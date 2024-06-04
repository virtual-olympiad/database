<script lang="ts">
	import { Ellipsis, Heart } from 'lucide-svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';

	export let id: string;
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
			<DropdownMenu.Label>Actions</DropdownMenu.Label>
			<DropdownMenu.Item>
				Open in Judge
			</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Item on:click={() => navigator.clipboard.writeText(id)}>Copy Problem ID</DropdownMenu.Item>
		<DropdownMenu.Item>Copy Source ID</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
