<script lang="ts">
	import TableFilter from './table-filter.svelte';
	import DataTable from './table.svelte';
	import Problem from './problem.svelte';

	export let data;

	let problems: DisplayProblem[] = data.problems as DisplayProblem[];
	let titleFilter: string = '';
	let today = new Date();
	let otherFilter: tableOtherFilters = {
		ids: null,
		minDifficulty: 0,
		maxDifficulty: 10,
		collection: ''
	};
</script>

<section class="w-full max-w-[1536px] p-4">
	<TableFilter collections={data.collections} bind:otherFilter bind:titleFilter />
	<div class="w-full gap-4 lg:grid lg:grid-cols-2">
		<div
			class="relative order-[-1] flex h-full w-full flex-col rounded-xl bg-muted/50 p-2 lg:p-4 mb-4 lg:mb-0 lg:order-1"
		>
			{#key data.selected_problem}
				<Problem id={data.selected_problem} />
			{/key}
		</div>
		<DataTable
			data={problems}
			bind:otherFilter
			bind:titleFilter
			bind:selected_problem={data.selected_problem}
		/>
	</div>
</section>
