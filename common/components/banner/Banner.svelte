<script>
  import FullBanner from './FullBanner.svelte'
  import SkeletonBanner from './SkeletonBanner.svelte'
  export let data

  function shuffle (array) {
    let currentIndex = array.length
    let randomIndex

    while (currentIndex > 0) {
      randomIndex = Math.floor(Math.random() * currentIndex--);

      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
    }

    return array
  }

  function shuffleAndFilter (media) {
    return shuffle(media).filter(media => media.bannerImage || media.trailer?.id).slice(0, 5)
  }
</script>

<div class='w-full h-350 position-relative gradient'>
  <!-- really shit and hacky way of fixing scroll position jumping when banner changes height -->
  <div class='position-absolute top-0 transparent h-450 opacity-0'>.</div>
  {#await data}
    <SkeletonBanner />
  {:then { data }}
    <FullBanner mediaList={shuffleAndFilter(data.Page.media)} />
  {/await}
</div>

<style>
  .gradient {
    background: linear-gradient(0deg, #17191D 0%, #0000 15%, #0000 100%), linear-gradient(90deg, #17191D 0%, rgba(23, 25, 29, 0.885417) 15%, rgba(25, 28, 32, 0) 72%);
  }
  .opacity-0 {
    opacity: 0;
  }
</style>
