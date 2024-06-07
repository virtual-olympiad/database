<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Separator } from '$lib/components/ui/separator';
	import { Button } from '$lib/components/ui/button';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import * as Collapsible from '$lib/components/ui/collapsible';

	import { Circle, ChevronDown, Heart, Plus, Gauge, Eye } from 'lucide-svelte';

	export let id;

	const sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay));

	const refreshProblem = async (): Promise<Problem> => {
		let response = await fetch(`/api?problemId=${encodeURIComponent(id)}`);
		return await response.json();
	};

	let promise = refreshProblem();

	const parseAnswerType = (type: string) => {
		if (type == 'number:integer'){
			return 'Integer';
		} 
		
		if (type == 'select:single'){
			return 'Single-Select Choice';
		}
		
		if (type == 'select:multiple'){
			return 'Multi-Select Choice';
		}
	}
</script>

{#await promise}
	<Card.Root class="w-full">
		<Card.Header>
			<Breadcrumb.Root>
				<Breadcrumb.List>
					<Breadcrumb.Item>
						<Breadcrumb.Link><Skeleton class="h-4 w-4" /></Breadcrumb.Link>
					</Breadcrumb.Item>
					<Breadcrumb.Separator />
					<Breadcrumb.Item>
						<Breadcrumb.Link><Skeleton class="h-4 w-8" /></Breadcrumb.Link>
					</Breadcrumb.Item>
				</Breadcrumb.List>
			</Breadcrumb.Root>
			<div class="grid grid-cols-[1fr_110px] items-center gap-4 space-y-0">
				<div>
					<Card.Title><Skeleton class="h-4 w-[100px]" /></Card.Title>
				</div>
				<div class="flex items-center space-x-1 rounded-md bg-secondary text-secondary-foreground">
					<Button variant="secondary" class="px-3 shadow-none">
						<Heart class="mr-2 h-4 w-4" />
						Like
					</Button>
					<Separator orientation="vertical" class="h-[20px]" />
					<DropdownMenu.Root>
						<DropdownMenu.Trigger asChild let:builder>
							<Button builders={[builder]} variant="secondary" class="px-2 shadow-none">
								<ChevronDown class="h-4 w-4 text-secondary-foreground" />
							</Button>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content class="w-[200px]" align="end">
							<DropdownMenu.Label>Add to Collection</DropdownMenu.Label>
							<DropdownMenu.Separator />
							<DropdownMenu.CheckboxItem checked>My TODO</DropdownMenu.CheckboxItem>
							<DropdownMenu.CheckboxItem>Fun Problems</DropdownMenu.CheckboxItem>
							<DropdownMenu.CheckboxItem>Classics</DropdownMenu.CheckboxItem>
							<DropdownMenu.Separator />
							<DropdownMenu.Item>
								<Plus class="mr-2 h-4 w-4" /> Create Collection
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</div>
			</div>
		</Card.Header>
		<Card.Content class="relative block">
			<div class="mb-2 space-y-2 text-sm">
				<Skeleton class="h-4 w-[230px]" />
				<Skeleton class="h-4 w-[200px]" />
				<Skeleton class="h-4 w-[250px]" />
			</div>
			<div class="flex space-x-4 text-sm text-muted-foreground">
				<div class="flex items-center">
					<Circle class="mr-1 h-3 w-3 fill-sky-400 text-sky-400" />
					<Skeleton class="h-4 w-4" />
				</div>
				<div class="flex items-center">
					<Gauge class="mr-1 h-3 w-3" />
					<Skeleton class="h-4 w-4" />
				</div>
				<div class="!ml-auto flex items-center">
					<Heart class="mr-1 h-3 w-3" />
					<Skeleton class="h-4 w-4" />
				</div>
			</div>
		</Card.Content>
	</Card.Root>
{:then problem}
	<Card.Root class="w-full">
		<Card.Header>
			<Breadcrumb.Root>
				<Breadcrumb.List>
					<Breadcrumb.Item>
						<Breadcrumb.Link>{problem?.collection ?? ''}</Breadcrumb.Link>
					</Breadcrumb.Item>
					<Breadcrumb.Separator />
					<Breadcrumb.Item>
						<Breadcrumb.Link>{problem?.edition ?? ''}</Breadcrumb.Link>
					</Breadcrumb.Item>
				</Breadcrumb.List>
			</Breadcrumb.Root>
			<div class="grid grid-cols-[1fr_110px] items-center gap-4 space-y-0">
				<div>
					<Card.Title>
						{problem?.common_title ?? ''}
						{#if problem?.duplicate}
							<Tooltip.Root>
								<Tooltip.Trigger
									><Badge variant="outline" class="ml-2 align-middle">Duplicate</Badge
									></Tooltip.Trigger
								>
								<Tooltip.Content>
									<p>This exact problem appeared in the past.</p>
								</Tooltip.Content>
							</Tooltip.Root>
						{/if}
					</Card.Title>
				</div>
				<div class="flex items-center space-x-1 rounded-md bg-secondary text-secondary-foreground">
					<Button variant="secondary" class="px-3 shadow-none">
						<Heart class="mr-2 h-4 w-4" />
						Like
					</Button>
					<Separator orientation="vertical" class="h-[20px]" />
					<DropdownMenu.Root>
						<DropdownMenu.Trigger asChild let:builder>
							<Button builders={[builder]} variant="secondary" class="px-2 shadow-none">
								<ChevronDown class="h-4 w-4 text-secondary-foreground" />
							</Button>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content class="w-[200px]" align="end">
							<DropdownMenu.Label>Add to Collection</DropdownMenu.Label>
							<DropdownMenu.Separator />
							<DropdownMenu.CheckboxItem checked>My TODO</DropdownMenu.CheckboxItem>
							<DropdownMenu.CheckboxItem>Fun Problems</DropdownMenu.CheckboxItem>
							<DropdownMenu.CheckboxItem>Classics</DropdownMenu.CheckboxItem>
							<DropdownMenu.Separator />
							<DropdownMenu.Item>
								<Plus class="mr-2 h-4 w-4" /> Create Collection
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</div>
			</div>
		</Card.Header>
		<Card.Content class="relative block">
			<div class="math-wrapper mb-2 w-full overflow-x-auto overflow-y-hidden text-sm">
				{@html problem?.content ?? ''}
			</div>
			<Separator />
			<Collapsible.Root class="my-2 w-fit space-y-1">
				{#if problem.answer.type == 'proof'}
					Answer: Proof
				{:else}
					<div class="flex items-center space-x-4">
						<h4 class="text-sm font-semibold">Answer: {parseAnswerType(problem.answer.type)}</h4>
						<Collapsible.Trigger asChild let:builder>
							<Button builders={[builder]} variant="ghost" size="sm" class="w-9 p-0">
								<Eye class="h-4 w-4" />
								<span class="sr-only">Reveal</span>
							</Button>
						</Collapsible.Trigger>
					</div>
					<Collapsible.Content class="space-y-2">
						<div class="rounded-md border px-4 py-2 font-mono text-sm">
							{#if problem.answer.type == 'select:multiple'}
								{problem.answer.value
									.map((v) => {
										return v.toUpperCase();
									})
									.join(', ')}
							{:else}
								{problem.answer.value.toUpperCase() ?? ''}
							{/if}
						</div>
					</Collapsible.Content>
				{/if}
			</Collapsible.Root>
			<div class="flex space-x-4 text-sm text-muted-foreground">
				<div class="flex items-center">
					<Circle class="mr-1 h-3 w-3 fill-sky-400 text-sky-400" />
					<Tooltip.Root>
						<Tooltip.Trigger>?</Tooltip.Trigger>
						<Tooltip.Content>
							<p>Problem topics will be supported soon.</p>
						</Tooltip.Content>
					</Tooltip.Root>
				</div>
				<div class="flex items-center">
					<Gauge class="mr-1 h-3 w-3" />
					<Tooltip.Root>
						<Tooltip.Trigger>{problem.metadata.difficulty?.toFixed(1) ?? '?'}</Tooltip.Trigger>
						<Tooltip.Content>
							<p>Difficulty: {problem.metadata.difficulty?.toFixed(2) ?? '?'}/10</p>
						</Tooltip.Content>
					</Tooltip.Root>
				</div>
				<div class="!ml-auto flex items-center">
					<Heart class="mr-1 h-3 w-3" />
					<Tooltip.Root>
						<Tooltip.Trigger>0</Tooltip.Trigger>
						<Tooltip.Content>
							<p>0 Likes</p>
						</Tooltip.Content>
					</Tooltip.Root>
				</div>
			</div>
		</Card.Content>
	</Card.Root>
{/await}
