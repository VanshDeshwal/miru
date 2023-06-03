<script>
  import Cards from './Cards.svelte'
  import { set } from '../Settings.svelte'
  let gallery
  const cards = opts.preview()
  if (set.compactCards)
    gallery = 'gallery-compact'
  else
    gallery = 'gallery-full'

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

<div class='{gallery} browse' class:loading>
  {#each media as cards, i (i)}
    <Cards {cards} length={4} tabable={true} />
  {/each}
</div>

<style>
  .gallery-full {
    display: grid;
    grid-template-columns: repeat(auto-fill, 50rem);    /* 24rem for small, 50 rem for large*/
    grid-auto-rows: auto;
    justify-content: center;
    grid-gap: 2rem;                /* 2 rem original, 1rem mine*/
    padding: 2rem 4rem;
    position: relative;
  }

  .gallery-compact {
    display: grid;
    grid-template-columns: repeat(auto-fill, 24rem);    /* 24rem for small, 50 rem for large*/
    grid-auto-rows: auto;
    justify-content: center;
    grid-gap: 1rem;                /* 2 rem original, 1rem mine*/
    padding: 2rem 4rem;
    position: relative;
  }

  .loading:after {
    content: '';
    position: absolute;
    bottom: 0;
    height: 40rem;
    width: 100%;
    background: linear-gradient(0deg, rgba(37, 40, 44, 1) 0%, rgba(37, 40, 44, 1) 70%, rgba(37, 40, 44, 1) 75%, rgba(37, 40, 44, 0.45) 90%, rgba(37, 40, 44, 0) 100%);
  }
</style>
