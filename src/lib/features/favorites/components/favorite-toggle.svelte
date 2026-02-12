<script lang="ts">
	import { Toggle } from '$lib/components/ui/toggle';
	import { Heart } from '@lucide/svelte';

	interface FavoriteToggleProps {
		favorited: boolean;
		onchange: (favorited: boolean) => void;
		disabled?: boolean;
		class?: string;
	}

	let { favorited, onchange, disabled = false, class: className = '' }: FavoriteToggleProps = $props();

	function handlePressedChange(pressed: boolean): void {
		onchange(pressed);
	}
</script>

<Toggle
	variant="outline"
	size="sm"
	pressed={favorited}
	onPressedChange={handlePressedChange}
	{disabled}
	aria-label="Favorite"
	class={className}
>
	<Heart class={favorited ? 'fill-current' : ''} />
</Toggle>
