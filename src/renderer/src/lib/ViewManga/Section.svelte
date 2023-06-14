<script>
  import { wrapEnter } from '@/modules/util.js'
  import Cards from './Cards.svelte'
  import CompactCards from './CompactCards.svelte'
  import { set } from '../Settings.svelte'
  export let opts
  let gallery
  const cards = opts.preview()
  if (set.compactCards)
    gallery = 'gallery-compact'
  else
    gallery = 'gallery-full'

</script>

<span class='d-flex px-20 align-items-end pointer text-decoration-none'
  on:click={opts.onclick} on:keydown={wrapEnter(opts.onclick)}
  tabindex='0'
  role='button'>
  <div class='pl-20 font-size-24 font-weight-semi-bold'>{opts.title}</div>
  <div class='pr-10 ml-auto font-size-12'>View More</div>
</span>
<div class='{gallery} pt-10 pb-20 w-full overflow-y-hidden position-relative'>
  {#if set.compactCards == true}
    <CompactCards {cards} />
  {:else if set.compactCards == false}
    <Cards {cards} />
  {/if}

</div>

<style>
  div::-webkit-scrollbar{
    display: none;
  }
  .text-muted:hover {
    color: var(--dm-link-text-color-hover) !important;
  }
  .gallery-full {
    display: grid;
    grid-auto-rows: auto;
    grid-gap: 1rem;
    padding: 2rem 4rem;
    position: relative;
    padding: 0.7rem 4rem;
    grid-template-columns: repeat(10, 50rem);    /*6,50rem original, 10,24rem mine*/
  }

  .gallery-full :global(.empty) {
    grid-column: 1/3 !important;      /*1/3 original, 1/4 mine*/
  }

  .gallery-full:after {
    content: '';
    position: absolute;
    right: 0;
    height: 100%;
    width: 8rem;                   /*8rem original, 2rem mine*/
    pointer-events: none;
  }

  .gallery-compact {
    display: grid;
    grid-auto-rows: auto;
    grid-gap: 1rem;
    padding: 2rem 4rem;
    position: relative;
    padding: 0.7rem 4rem;
    grid-template-columns: repeat(10, 24rem);    /*6,50rem original, 10,24rem mine*/
  }

  .gallery-compact :global(.empty) {
    grid-column: 1/4 !important;      /*1/3 original, 1/4 mine*/
  }

  .gallery-compact:after {
    content: '';
    position: absolute;
    right: 0;
    height: 100%;
    width: 2rem;                   /*8rem original, 2rem mine*/
    pointer-events: none;
  }

</style>
