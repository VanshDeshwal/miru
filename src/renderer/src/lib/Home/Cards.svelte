<script>
  import { since, release_time, wrapEnter } from '@/modules/util.js'
  import { getContext } from 'svelte'
  export let cards = new Promise(() => {})
  const view = getContext('view')
  function viewMedia (media) {
    $view = media
  }
  export let length = 8
  export let tabable = false

  const statusColorMap = {
    CURRENT: 'rgb(61,180,242)',
    PLANNING: 'rgb(247,154,99)',
    COMPLETED: 'rgb(123,213,85)',
    PAUSED: 'rgb(250,122,122)',
    REPEATING: '#3baeea',
    DROPPED: 'rgb(232,93,117)'
  }
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
        <div class='row h-full  bg-very-dark'>
          <div class='col-12'>
            <img loading='lazy' src={card.media.coverImage.extraLarge || ''} alt='cover' class='cover-img w-full' />
          </div>
          <div class="badge text-dark font-weight-bold rating">
            <span class="material-icons font-size-16" style="color:yellow">star</span>
            <span style="color: white;">{card.media.averageScore}</span>
          </div>
          {#if card.date}
          <div class="bg-very-dark since">
            <span class="text-muted font-weight-bold">{since(card.date)}</span>
          </div>
          {/if}
          <div class='col-12 mid-card text-overflow-hidden'>
            <div class='px-10'>
              <h5 class='m-0 text-capitalize font-weight-bold' >
                {#if card.media.mediaListEntry?.status}
                  <div style:--statusColor={statusColorMap[card.media.mediaListEntry.status]} class='list-status-circle d-inline-flex overflow-hidden mr-5' title={card.media.mediaListEntry.status} />
                {/if}
                {#if card.failed}
                  <span class='badge badge-secondary'>Uncertain</span>
                {/if}
                {[card.media.title.userPreferred, card.episode].filter(s => s).join(' - ')}
              </h5>
            </div>
          </div>
          <div class="col-12 end-card text-overflow-hidden-oneline">
            <div class='px-10' >
              <p class=' m-0 text-capitalize details'>
                {#if card.schedule && card.media.nextAiringEpisode}
                <span class=' font-weight-bold badge-color'>
                  {'EP ' + card.media.nextAiringEpisode.episode + ' releasing at ' + release_time(card.media.nextAiringEpisode.timeUntilAiring)}
                </span>
                {/if}


                {#if (card.media.format === 'TV') && !(card.schedule && card.media.nextAiringEpisode)}
                  <span>TV</span>
                {:else if (card.media.format) && !(card.schedule && card.media.nextAiringEpisode)}
                  <span>{card.media.format?.toLowerCase().replace(/_/g, ' ')}</span>
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
    white-space: normal;
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
    color: var(--color) !important;
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
  .list-status-circle {
    background: var(--statusColor);
    height: 1.1rem;
    width: 1.1rem;
    border-radius: 50%;
  }
  .text-overflow-hidden{
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .rating{
    position:absolute;
    background-color: rgba(0,0,0,.7);
    border-top-width: 0px;
    border-left-width: 0px;
    border-radius: 0.6rem 0 4px 0px;
  }
  .mid-card{
    position:absolute;
    top:220px;
    height:45px;
  }
  .end-card{
    position:absolute; 
    bottom:0px;
  }

  .text-overflow-hidden-oneline{
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .since{
    position:absolute; 
    top:200px;
    right:0px;
    border-top-width: 0px;
    border-left-width: 0px;
    border-radius: 0.5rem 0px 0px 0px;
    padding-left: 8px;
    padding-right: 8px;
}

</style>
