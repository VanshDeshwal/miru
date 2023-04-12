<script>
  import { wrapEnter } from '@/modules/util.js'
  import Cards from './Cards.svelte'
  export let opts
  const cards = opts.preview()
</script>

<span class='d-flex px-20 align-items-end pointer text-decoration-none'
  on:click={opts.onclick} on:keydown={wrapEnter(opts.onclick)}
  tabindex='0'
  role='button'>
  <div class='pl-20 font-size-24 font-weight-semi-bold'>{opts.title}</div>
  <div class='pr-10 ml-auto font-size-12'>View More</div>
</span>
<div class='gallery pt-10 pb-20 w-full overflow-y-hidden position-relative'>
  <Cards {cards} />
</div>

<style>
  div::-webkit-scrollbar{
    display: none;
  }
  .text-muted:hover {
    color: var(--dm-link-text-color-hover) !important;
  }
  .gallery {
    display: grid;
    grid-auto-rows: auto;
    grid-gap: 1rem;
    padding: 2rem 4rem;
    position: relative;
    padding: 0.7rem 4rem;
    grid-template-columns: repeat(10, 24rem);
  }

  .gallery :global(.empty) {
    grid-column: 1/4 !important;
  }

  .gallery:after {
    content: '';
    position: absolute;
    right: 0;
    height: 100%;
    width: 2rem;
    /*this gradient looks like ass, need to find smth better*/
    pointer-events: none;
  }

</style>
