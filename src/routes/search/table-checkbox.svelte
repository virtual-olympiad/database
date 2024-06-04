	
<script lang="ts">
    import { Checkbox } from "$lib/components/ui/checkbox";
    import type { Writable } from "svelte/store";
   
    export let checked: Writable<boolean>;
  </script>
   
  <Checkbox class="w-16px h-16px" bind:checked={$checked} />
  
  