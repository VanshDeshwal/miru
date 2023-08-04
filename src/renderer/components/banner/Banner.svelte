<script>
  import FullBanner from './FullBanner.svelte'
  import SkeletonBanner from './SkeletonBanner.svelte'
  import {set} from '../../views/Settings.svelte'
  export let data
</script>

<div class='w-full h-400 position-relative gradient-{set.theme}'>
  {#await data}
    <SkeletonBanner />
  {:then { data }}
    <FullBanner media={data.Page.media[0]} />
  {/await}
</div>

<style>
    .gradient-dark {
    background: linear-gradient(0deg, var(--dark-color) 0%, #0000 15%, #0000 100%), linear-gradient(90deg, var(--dark-color) 0%, rgba(23, 25, 29, 0.885417) 15%, rgba(25, 28, 32, 0) 72%);
  }
  .gradient-very-dark {
    background: linear-gradient(0deg, var(--dark-color-dim) 0%, #0000 15%, #0000 100%), linear-gradient(90deg, var(--dark-color-dim) 0%, rgba(23, 25, 29, 0.885417) 15%, rgba(25, 28, 32, 0) 72%);
  }
  .gradient-pitch-black {
    background: linear-gradient(0deg, #000000 0%, #0000 15%, #0000 100%), linear-gradient(90deg, #000000 0%, rgba(23, 25, 29, 0.885417) 15%, rgba(25, 28, 32, 0) 72%);
  }
  .gradient-anilist-blue {
    background: linear-gradient(0deg, #0B1622 0%, #0000 15%, #0000 100%), linear-gradient(90deg, #0B1622 0%, rgba(23, 25, 29, 0.885417) 15%, rgba(25, 28, 32, 0) 72%);
  }
  .gradient-marin-blue {
    background: linear-gradient(0deg, #1F2937 0%, #0000 15%, #0000 100%), linear-gradient(90deg, #1F2937 0%, rgba(23, 25, 29, 0.885417) 15%, rgba(25, 28, 32, 0) 72%);
  }
  .gradient-spot-green {
    background: linear-gradient(0deg, var(--spot-green-medium) 0%, #0000 15%, #0000 100%), linear-gradient(90deg, var(--spot-green-medium) 0%, rgba(23, 25, 29, 0.885417) 15%, rgba(25, 28, 32, 0) 72%);
  }
</style>
