<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Button } from '$lib/components/ui/button';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import type { DateRange } from 'bits-ui';
	import { RangeCalendar } from '$lib/components/ui/range-calendar/index.js';

	import { Search, Check, ChevronsUpDown, CalendarIcon } from 'lucide-svelte';

	import { writable, type Writable } from 'svelte/store';

	import { cn } from '$lib/utils.js';
	import {
		CalendarDate,
		DateFormatter,
		type DateValue,
		getLocalTimeZone
	} from '@internationalized/date';

	import { tick } from 'svelte';

	let collectionOpen = false;
	let collectionValue = '';

	$: selectedValue =
		collections?.find((c) => c.value === collectionValue)?.label ?? 'Select a collection...';

	// Refocus trigger when the user selects an item for keyboard navigation
	function closeAndFocusTrigger(triggerId: string) {
		collectionOpen = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}

	const df = new DateFormatter('en-US', {
		dateStyle: 'medium'
	});

	let today = new Date();

	let dateValue: DateRange | undefined = {
		start: new CalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate()).subtract({ years: 1 }),
		end: new CalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate())
	};

	let startValue: DateValue | undefined = undefined;

	const topics = [
		{
			value: 'a',
			label: 'Algebra'
		},
		{
			value: 'n',
			label: 'Number Theory'
		},
		{
			value: 'c',
			label: 'Combinatorics'
		},
		{
			value: 'g',
			label: 'Geometry'
		}
	];

	export let collections: { value: string, label: string }[], titleFilter: string, otherFilter: tableOtherFilters;

	$: otherFilter.collection = collectionValue;
</script>

<form class="mb-4 grid w-full items-start gap-6">
	<fieldset class="flex flex-col gap-3 rounded-lg border p-4 lg:grid">
		<legend class="-ml-1 px-1 text-sm font-medium">Filter</legend>
		<div class="flex flex-col-reverse gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
			<div class="grid gap-3">
				<Label for="model">Collection</Label>
				<Popover.Root bind:open={collectionOpen} let:ids>
					<Popover.Trigger id="model" asChild let:builder>
						<Button
							builders={[builder]}
							variant="outline"
							role="combobox"
							aria-expanded={collectionOpen}
							class="w-full justify-between"
						>
							{selectedValue}
							<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
						</Button>
					</Popover.Trigger>
					<Popover.Content class="w-[300px] p-0">
						<Command.Root>
							<Command.Input placeholder="Search collection..." />
							<Command.Empty>No collection found.</Command.Empty>
							<Command.Group>
								{#each collections ?? [] as collection}
									<Command.Item
										value={collection.value}
										onSelect={() => {
											collectionValue = collection.value;
											closeAndFocusTrigger(ids.trigger);
										}}
									>
										<Check
											class={cn(
												'mr-2 h-4 w-4',
												collectionValue !== collection.value && 'text-transparent'
											)}
										/>
										{collection.label}
									</Command.Item>
								{/each}
							</Command.Group>
						</Command.Root>
					</Popover.Content>
				</Popover.Root>
			</div>
			<div class="grid gap-3 lg:col-span-2">
				<Label for="title">Title</Label>
				<Input
					id="title"
					placeholder="Search problem by title..."
					type="text"
					bind:value={titleFilter}
				/>
			</div>
		</div>
		<div class="flex flex-col gap-4 lg:grid lg:grid-cols-2">
			<div class="flex flex-col gap-3">
				<Label for="content">Content</Label>
				<Textarea
					id="content"
					placeholder="Search problem content ($\LaTeX$ supported)..."
					class="h-full lg:resize-none"
				/>
			</div>
			<div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
				<div class="flex flex-col gap-3">
					<Label for="min-difficulty">Min Difficulty</Label>
					<Input id="min-difficulty" type="number" placeholder="0.0" min={0} max={10} step={0.1} bind:value={otherFilter.minDifficulty} />
				</div>
				<div class="flex flex-col gap-3">
					<Label for="max-difficulty">Max Difficulty</Label>
					<Input id="max-difficulty" type="number" placeholder="10.0" min={0} max={10} step={0.1} bind:value={otherFilter.maxDifficulty} />
				</div>
				<div class="col-span-2 flex flex-col gap-3 sm:col-span-1">
					<Label for="topic">Topic</Label>
					<Select.Root>
						<Select.Trigger id="topic" class="items-start [&_[data-description]]:hidden">
							<Select.Value placeholder="Select a topic" />
						</Select.Trigger>
						<Select.Content>
							{#each topics as { label, value }}
								<Select.Item {value}>{label}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
				<div class="flex flex-col col-span-2 gap-2">
					<Label for="date-range">Date Range</Label>
					<Popover.Root openFocus>
						<Popover.Trigger asChild let:builder>
							<Button
								variant="outline"
								class={cn(
									'w-full justify-start text-left font-normal',
									!dateValue && 'text-muted-foreground'
								)}
								builders={[builder]}
							>
								<CalendarIcon class="mr-2 h-4 w-4" />
								{#if dateValue && dateValue.start}
									{#if dateValue.end}
										{df.format(dateValue.start.toDate(getLocalTimeZone()))} - {df.format(
											dateValue.end.toDate(getLocalTimeZone())
										)}
									{:else}
										{df.format(dateValue.start.toDate(getLocalTimeZone()))}
									{/if}
								{:else if startValue}
									{df.format(startValue.toDate(getLocalTimeZone()))}
								{:else}
									Pick a date
								{/if}
							</Button>
						</Popover.Trigger>
						<Popover.Content class="w-auto p-0" align="start">
							<RangeCalendar
								bind:value={dateValue}
								bind:startValue
								initialFocus
								numberOfMonths={2}
								placeholder={dateValue?.start}
							/>
						</Popover.Content>
					</Popover.Root>
				</div>
				<Button class="col-start-[-2] mt-auto w-full gap-1.5">
					<Search class="hidden size-3.5 xl:block" />
					Query Database
				</Button>
			</div>
		</div>
	</fieldset>
</form>
