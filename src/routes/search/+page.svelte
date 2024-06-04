<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import * as Collapsible from '$lib/components/ui/collapsible/index';
	import { Separator } from '$lib/components/ui/separator';
	import { GithubLogo } from 'svelte-radix';
	import {
		Activity,
		Star,
		ChevronDown,
		Plus,
		Circle,
		Heart,
		Gauge,
		Slash,
		Hash,
		ChevronRight,
		ChevronsUpDown,
		Search
	} from 'lucide-svelte';
	import * as config from '$lib/siteConfig';

	import katex from 'katex';
	import { Content } from '$lib/components/ui/drawer';

	import DataTable from './table.svelte';
	import Problem from './problem.svelte';

	export let data;

	let problems: DisplayProblem[] = data.problems as DisplayProblem[];
</script>

<section
	class="flex flex-col w-[350px] md:w-[500px] lg:w-[640px] items-center gap-2 py-8 text-center md:py-12 md:pb-8 lg:py-24 lg:pb-12"
>	
	{#key data.selected_problem}
		<Problem id = {data.selected_problem} />
	{/key}
	<DataTable data={problems} bind:selected_problem={data.selected_problem}/>
</section>
