<script>
  import CompactCards from './CompactCards.svelte'
  export let media
  $: update(media)
  let loading = true
  async function update (med) {
    loading = true
    const index = med.length - 1
    await med[index]
    if (med[index] === media[media.length - 1]) loading = false
  }
</script>

<div class='gallery browse' class:loading>
  {#each media as cards, i (i)}

      <CompactCards {cards} length={4} tabable={true} />
    
  {/each}
</div>

<style>
  .gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, 27rem);
    grid-auto-rows: auto;
    justify-content: center;
    grid-gap: 2rem;   
    padding: 2rem 4rem;
    position: relative;
  }

  .loading:after {
    content: '';
    position: absolute;
    bottom: 0;
    height: 40rem;
    width: 100%;
    background: linear-gradient(0deg, rgba(18,20,22,255) 0%, rgba(18,20,22,255) 70%, rgba(18,20,22,255) 75%, rgba(18,20,22,255) 90%, rgba(18,20,22,255) 100%);
    backdrop-filter: blur(0.5px);
  }
</style>
