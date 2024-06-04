<script lang="ts">
	import { createTable, Render, createRender, Subscribe } from 'svelte-headless-table';
	import {
		addPagination,
		addTableFilter,
		addSortBy,
		addSelectedRows
	} from 'svelte-headless-table/plugins';

	import { readable } from 'svelte/store';
	import { cn } from '$lib/utils';

	import ArrowUpDown from 'lucide-svelte/icons/arrow-up-down';

	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';

	import DataTableCheckbox from './table-checkbox.svelte';
	import DataTableActions from './table-actions.svelte';

	export let data: DisplayProblem[], selected_problem: string;

	const table = createTable(readable(data), {
		page: addPagination(),
		sort: addSortBy({
			toggleOrder: ['asc', 'desc']
		}),
		filter: addTableFilter({
			fn: ({ filterValue, value }) => value.toLowerCase().includes(filterValue.toLowerCase())
		}),
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
			header: 'Title'
		}),
		table.column({
			accessor: 'source',
			header: 'Source'
		}),
		table.column({
			accessor: ({ id }) => id,
			header: '',
			cell: ({ value }) => {
				return createRender(DataTableActions, { id: value });
			},
			plugins: {
				filter: {
					exclude: true
				},
				sort: {
					disable: true
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

	const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
	const { filterValue } = pluginStates.filter;
	const { selectedDataIds } = pluginStates.select;

	const changeSelected = (newSelection: string) => {
		selected_problem = newSelection;
	};
</script>

<div class="flex items-center py-4">
	<Input class="max-w-sm" placeholder="Filter problems..." type="text" bind:value={$filterValue} />
</div>
<div class="w-full rounded-md border">
	<Table.Root {...$tableAttrs}>
		<Table.Header>
			{#each $headerRows as headerRow}
				<Subscribe rowAttrs={headerRow.attrs()}>
					<Table.Row>
						{#each headerRow.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
								<Table.Head
									{...attrs}
									class={cn('[&:has([role=checkbox])]:pl-3') +
										(cell.id === 'source' ? ' !text-center' : '')}
								>
									{#if cell.id === 'source'}
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
										<div class="flex align-start">
											<Button
												class="mr-auto"
												variant="ghost"
												on:click={() => changeSelected(row.original.id)}
											>
												<Render of={cell.render()} />
											</Button>
										</div>
									{:else if cell.id === 'source'}
										<Render of={cell.render()} />
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

<div class="flex items-center justify-between space-x-4 py-4">
	<div class="mr-auto text-sm text-muted-foreground">
		{Object.keys($selectedDataIds).length} of {$rows.length} row(s) selected.
	</div>
	<Button
		variant="outline"
		size="sm"
		on:click={() => ($pageIndex = $pageIndex - 1)}
		disabled={!$hasPreviousPage}>Previous</Button
	>
	<Button
		variant="outline"
		size="sm"
		disabled={!$hasNextPage}
		on:click={() => ($pageIndex = $pageIndex + 1)}>Next</Button
	>
</div>
