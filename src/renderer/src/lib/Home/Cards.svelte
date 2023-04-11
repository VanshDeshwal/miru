<script>
  import { countdown, wrapEnter } from '@/modules/util.js'
  import { getContext } from 'svelte'
  export let cards = new Promise(() => {})
  const view = getContext('view')
  function viewMedia (media) {
    $view = media
  }
  export let length = 5
  export let tabable = false
</script>

{#await cards}
  {#each Array(length) as _}
    <div class='card m-0 p-0'>
      <div class='row h-full '>
        <div style="position:absolute;bottom:0px;top:210px;" class='col-12 bg-very-dark px-15 py-10'>
          <p class='skeloader w-210 h-25 rounded bg-dark' />
          <p class='skeloader w-210 h-10 rounded bg-dark' />
        </div>
      </div>
    </div>
  {/each}
{:then cards}
  {#each cards || [] as card}
    {#if typeof card === 'string'}
      <div class='day-row font-size-24 font-weight-bold h-50 d-flex align-items-end'>{card}</div>
    {:else if !card.media}
      <div class='card m-0 p-0' on:click={card.onclick} on:keydown={wrapEnter(card.onclick)} tabindex={tabable ? 0 : null} role='button'>
      </div>
    {:else}
      <div class='card m-0 p-0'
        on:click={card.onclick || (() => viewMedia(card.media))}
        on:keydown={wrapEnter(card.onclick || (() => viewMedia(card.media)))}
        tabindex={tabable ? 0 : null} role='button'
        style:--color={card.media.coverImage.color || '#1890ff'}
        title={card.parseObject?.file_name}>
        <div class='row h-full'>
          <div class='col-12'>
            <img loading='lazy' src={card.media.coverImage.extraLarge || ''} alt='cover' class='cover-img w-full' />
          </div>
          


        </div>
        <div class="badge text-dark mr-5 font-weight-bold s-HqY-olil0_bj" style="position:absolute;top: 0px;left: 0px;background-color: rgba(0,0,0,.7);border-top-width: 0px;border-left-width: 0px;border-radius: 0.6rem 0 4px 0px;margin-right: 0px;">
          <span class="material-icons font-size-16" style="color:yellow;size=5px;">star</span>
          <span style="color: white;">{card.media.averageScore}</span>
          
        </div>
        <div style="position: absolute;top: 210px;bottom:17px;left: 0px; right:0px;background-color: rgb(25,28,32);margin-right: 0px">             
          <h5 class='text-capitalize font-weight-bold' style="position: absolute; top:0px; bottom:1px; margin-left:10px; margin-bottom:0px; margin-right:10px">
          {#if card.failed}
            <span class='badge badge-secondary'>Uncertain</span>
          {/if}
          {[card.media.title.userPreferred, card.episode].filter(s => s).join(' - ')}
          </h5>
        </div>

        <div style="position: absolute;bottom: 0px;left: 0px; right:0px;background-color: rgb(25,28,32);margin-right: 0px;">          

        <p class='text-muted m-0 text-capitalize details'>
          {#if card.schedule && card.media.nextAiringEpisode}
          <span style="margin-left:10px;"class='text-muted font-weight-bold'>
            {'EP ' + card.media.nextAiringEpisode.episode + ' in ' + countdown(card.media.nextAiringEpisode.timeUntilAiring)}
          </span>
        {/if}
          {#if (card.media.format === 'TV') && !(card.schedule && card.media.nextAiringEpisode)}
            <span class='m-10'>TV</span>
          {:else if (card.media.format) && !(card.schedule && card.media.nextAiringEpisode)}
            <span class='m-10'>{card.media.format?.toLowerCase().replace(/_/g, ' ')}</span>
          {/if}
          {#if (card.media.episodes) && !(card.schedule && card.media.nextAiringEpisode)}
            <span>{card.media.episodes + ' Episodes'}</span>
          {:else if (card.media.duration) && !(card.schedule && card.media.nextAiringEpisode)}
            <span>{card.media.duration + ' Minutes'}</span>
          {/if}
          {#if (card.media.season || card.media.seasonYear) && !(card.schedule && card.media.nextAiringEpisode)}
          <span>
            {[card.media.season?.toLowerCase(), card.media.seasonYear].filter(s => s).join(' ')}
          </span>
        {/if}
        </p>
        </div>

      </div>
    {/if}
  {:else}
    <div class='empty d-flex flex-column align-items-center justify-content-center'>
      <h2 class='font-weight-semi-bold mb-10'>Ooops!</h2>
      <div>Looks like there's nothing here.</div>
    </div>
  {/each}
{/await}

<style>
  .pre-wrap {
    white-space: pre-wrap
  }
  .empty {
    height: 31rem;
    grid-column: 1 / -1;
  }
  .h-10 {
    height: 1rem !important;
  }

  .card-desc :global(p) {
    margin: 0;
  }

  .details span + span::before {
    content: ' • ';
  }
  .card {
    animation: 0.3s ease 0s 1 load-in;
    cursor: pointer;
    overflow: hidden;
    transition: transform 0.2s ease;
    height: 35rem !important;
    border-radius: 0.6rem !important;
    box-shadow: rgba(0, 4, 12, 0.3) 0px 7px 15px, rgba(0, 4, 12, 0.05) 0px 4px 4px;
  }
  .card-grid {
    display: grid;
    grid-template-rows: auto 1fr auto;
  }
  .badge-color {
    background-color: var(--color) !important;
    border-color: var(--color) !important;
  }

  .card:hover {
    transform: scale(1.05);
  }

  @keyframes load {
    from {
      left: -100%;
    }

    to {
      left: 100%;
    }
  }

  @keyframes load-in {
    from {
      bottom: -1.2rem;
      transform: scale(0.95);
    }

    to {
      bottom: 0;
      transform: scale(1);
    }
  }
  .skeloader {
    position: relative;
    overflow: hidden;
  }

  .skeloader::before {
    will-change: left;
    content: '';
    position: absolute;
    height: 100%;
    width: 15rem;
    background: linear-gradient(to right, transparent 0%, #25282c 50%, transparent 100%);
    animation: load 1s infinite cubic-bezier(0.4, 0, 0.2, 1);
  }
  .cover-img {
    object-fit: cover;
    background-color: var(--color) !important;
    height: 27rem;
  }
  .day-row {
    grid-column: 1 / -1;
  }

</style>
