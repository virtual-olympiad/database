<script lang="ts">
	import { Ellipsis, Heart } from 'lucide-svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';

	export let id: string, source_href: string;
</script>

<Button variant="ghost" size="icon" class="relative h-8 w-8 p-0">
    <span class="sr-only">Like problem</span>
    <Heart class="h-4 w-4" />
</Button>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="ghost" builders={[builder]} size="icon" class="relative h-8 w-8 p-0">
			<span class="sr-only">Open menu</span>
			<Ellipsis class="h-4 w-4" />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content side="right">
		<DropdownMenu.Group>
			<DropdownMenu.Item disabled>
				Open in Judge
			</DropdownMenu.Item>
			<DropdownMenu.Item target="_blank" rel="noreferrer" href={source_href}>
				Open in AoPS
			</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Item on:click={() => navigator.clipboard.writeText(id)}>Copy Problem ID</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
