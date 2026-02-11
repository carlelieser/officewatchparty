<script lang="ts">
	interface TvAnimationProps {
		class?: string;
	}

	let { class: className = '' }: TvAnimationProps = $props();
</script>

<video
	class="w-full max-w-md m-auto rounded-2xl bg-background dark:bg-orange-200 {className}"
	autoplay
	loop
	muted
	playsinline
>
	<source src="/tv-animated.webm" type="video/webm" />
	<source src="/tv-animated.mp4" type="video/mp4" />
</video>
