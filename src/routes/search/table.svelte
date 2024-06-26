<script lang="ts">
	import { createTable, Render, createRender, Subscribe, DataBodyRow } from 'svelte-headless-table';
	import {
		addPagination,
		addTableFilter,
		addSortBy,
		addSelectedRows,
		addColumnFilters
	} from 'svelte-headless-table/plugins';

	import { readable, type Writable } from 'svelte/store';
	import { cn } from '$lib/utils';

	import ArrowUpDown from 'lucide-svelte/icons/arrow-up-down';

	import * as Table from '$lib/components/ui/table';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Button } from '$lib/components/ui/button';

	import DataTableCheckbox from './table-checkbox.svelte';
	import DataTableActions from './table-actions.svelte';
	import { parseDate } from '@internationalized/date';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';

	export let data: DisplayProblem[], selected_problem: string;

	const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });

	const table = createTable(readable(data), {
		page: addPagination({
			initialPageSize: 5
		}),
		sort: addSortBy({
			toggleOrder: ['asc', 'desc']
		}),
		filter: addTableFilter({
			fn: ({ filterValue, value }) => value.toLowerCase().includes(filterValue.toLowerCase())
		}),
		colFilter: addColumnFilters(),
		select: addSelectedRows()
	});

	const columns = table.createColumns([
		table.column({
			accessor: 'id',
			header: (_, { pluginStates }) => {
				const { allPageRowsSelected } = pluginStates.select;
				return createRender(DataTableCheckbox, {
					checked: allPageRowsSelected
				});
			},
			cell: ({ row }, { pluginStates }) => {
				const { getRowState } = pluginStates.select;
				const { isSelected } = getRowState(row);

				return createRender(DataTableCheckbox, {
					checked: isSelected
				});
			},
			plugins: {
				sort: {
					disable: true
				}
			}
		}),
		table.column({
			accessor: 'common_title',
			header: 'Title',
			plugins: {
				sort: {
					compareFn: (a, b) => collator.compare(a, b)
				}
			}
		}),
		table.column({
			accessor: 'source',
			header: 'Source',
			plugins: {
				sort: {
					disable: true
				}
			}
		}),
		table.column({
			accessor: ({ id, collection, date, metadata: { tags, difficulty, source_href } }) => {
				return { id, collection, date, tags, difficulty, source_href };
			},
			header: '',
			cell: ({ value }) => {
				return createRender(DataTableActions, {
					id: value.id,
					source_href: value.source_href as string
				});
			},
			plugins: {
				filter: {
					exclude: true
				},
				sort: {
					disable: true
				},
				colFilter: {
					fn: ({ filterValue, value }) => {
						let date = parseDate(value.date);

						return (
							(!filterValue.collection || value.collection === filterValue.collection) &&
							(!value.difficulty ||
								(filterValue.minDifficulty <= value.difficulty &&
									value.difficulty <= filterValue.maxDifficulty)) &&
							(!filterValue.ids || filterValue.ids.includes(value.id)) &&
							(!filterValue.minDate ||
								!filterValue.maxDate ||
								(date.compare(filterValue.minDate) >= 0 && date.compare(filterValue.maxDate) <= 0))
						);
						// && (!filterValue.tags || value.tags === filterValue.tags)
					}
				}
			}
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates, rows } =
		table.createViewModel(columns, {
			rowDataId: (item, index) => {
				return item.id;
			}
		});

	let { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
	let { filterValue: pluginTitleFilter } = pluginStates.filter;
	let { filterValues: pluginOtherFilter } = pluginStates.colFilter;
	let { selectedDataIds } = pluginStates.select;

	const changeSelected = (newSelection: string) => {
		selected_problem = newSelection;
	};

	export let titleFilter: string, otherFilter: tableOtherFilters;

	$: pluginTitleFilter.set(titleFilter ?? '');
	$: otherFilter &&
		pluginOtherFilter.set({
			'': otherFilter
		});
</script>

<div class="flex w-full flex-col">
	<div class="w-full overflow-auto rounded-md border">
		<Table.Root {...$tableAttrs}>
			<Table.Header>
				{#each $headerRows as headerRow}
					<Subscribe rowAttrs={headerRow.attrs()}>
						<Table.Row>
							{#each headerRow.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
									<Table.Head {...attrs}>
										{#if cell.id === 'common_title'}
											<Button class="mx-auto" variant="ghost" on:click={props.sort.toggle}>
												<Render of={cell.render()} />
												<ArrowUpDown class={'ml-2 h-4 w-4'} />
											</Button>
										{:else}
											<Render of={cell.render()} />
										{/if}
									</Table.Head>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Header>
			<Table.Body {...$tableBodyAttrs}>
				{#each $pageRows as row (row.id)}
					<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
						<Table.Row
							class={row.original.id === selected_problem ? 'bg-muted' : ''}
							{...rowAttrs}
							data-state={$selectedDataIds[row.id] && 'selected'}
						>
							{#each row.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs>
									<Table.Cell class="[&:has([role=checkbox])]:pl-3" {...attrs}>
										{#if cell.id === 'common_title'}
											<div class="align-start flex">
												<Button
													class="mr-auto"
													variant="ghost"
													on:click={() => changeSelected(row.original.id)}
												>
													<Render of={cell.render()} />
												</Button>
											</div>
										{:else}
											<div class="text-left">
												<Render of={cell.render()} />
											</div>
										{/if}
									</Table.Cell>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
	<div class="flex items-start justify-between space-x-4 py-4">
		<div class="text-sm text-muted-foreground">
			{Object.keys($selectedDataIds).length} of {$rows.length + '/' + data.length} problem(s) selected.
		</div>
		<div class="hidden items-center justify-end space-x-4 sm:flex">
			<Button
				variant="outline"
				size="sm"
				on:click={() => ($pageIndex = Number($pageIndex) - 1)}
				disabled={!$hasPreviousPage}
			>
				Previous
			</Button>
			<Input
				type="number"
				placeholder="0"
				min={0}
				max={Math.ceil($rows.length / 5) - 1}
				bind:value={$pageIndex}
				class="h-9 max-w-[80px]"
			/>
			<Button
				variant="outline"
				size="sm"
				disabled={!$hasNextPage}
				on:click={() => ($pageIndex = Number($pageIndex) + 1)}
			>
				Next
			</Button>
		</div>
		<div class="flex items-center justify-end space-x-2 sm:hidden">
			<Button
				variant="outline"
				size="sm"
				on:click={() => ($pageIndex = Number($pageIndex) - 1)}
				disabled={!$hasPreviousPage}
				class="px-2"
			>
				<ChevronLeft class="h-4 w-4"/>
			</Button>
			<Input
				type="number"
				placeholder="0"
				min={0}
				max={Math.ceil($rows.length / 5) - 1}
				bind:value={$pageIndex}
				class="h-9 p-2 pr-1 min-w-[60px] max-w-[80px]"
			/>
			<Button
				variant="outline"
				size="sm"
				disabled={!$hasNextPage}
				on:click={() => ($pageIndex = Number($pageIndex) + 1)}
				class="px-2"
			>
				<ChevronRight class="h-4 w-4"/>
			</Button>
		</div>
	</div>
</div>
