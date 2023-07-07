<script>
  import { release_time, wrapEnter } from '@/modules/util.js'
  import { formatMap, statusColorMap } from '@/modules/anime.js'
  import { getContext } from 'svelte'
  export let cards = new Promise(() => {})
  const view = getContext('view')
  function viewMedia (media) {
    $view = media
  }
  export let length = 8
  export let tabable = false

  function rating (s) {
    s = (s/10).toFixed(1)
    return s
  }
</script>

{#await cards}
  {#each Array(length) as _}
    <div class='card m-0 p-0'>
      <div class='row h-full '>
        <div class='col-12 small-skeloader card-title px-15 py-10'>
          <p class='skeloader w-210 h-25 rounded ' />
          <p class='skeloader w-210 h-10 rounded ' />
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
    <div class='d-flex p-20 position-relative first-check'
    on:click={card.onclick || (() => viewMedia(card.media))}
    on:keydown={wrapEnter(card.onclick || (() => viewMedia(card.media)))}
    tabindex={tabable ? 0 : null} role='button'
    style:--color={card.media.coverImage.color || '#1890ff'}
    title={card.parseObject?.file_name}>
      <div class='item d-flex flex-column h-full pointer'>
          <img loading='lazy' src={card.media.coverImage.extraLarge || ''} alt='cover' class='cover-img w-full rounded-3' style:--color={card.media.coverImage.color || '#1890ff'} />
          {#if card.media.averageScore}
          <div class='rating position-absolute'>
            <span class='p-5 material-icons rating-icon'>grade</span>
            <span class='pt-5 pr-5 rating-number position-absolute'>{rating(card.media.averageScore)}</span>
          </div>
          {/if}
          <div class='text-white font-weight-very-bold font-size-16 pt-15 title overflow-hidden'>
            {#if card.media.mediaListEntry?.status}
              <div style:--statusColor={statusColorMap[card.media.mediaListEntry.status]} class='list-status-circle d-inline-flex overflow-hidden mr-5' title={card.media.mediaListEntry.status} />
            {/if}
            {[card.media.title.userPreferred, card.episode].filter(s => s).join(' - ')}
          </div>
              <p class=' m-0 text-capitalize details'>
                {#if card.schedule && card.media.nextAiringEpisode}
                <span class=' font-weight-bold badge-color'>
                  {'EP ' + card.media.nextAiringEpisode.episode + ' releasing at ' + release_time(card.media.nextAiringEpisode.timeUntilAiring)}
                </span>
                {/if}
              </p>
          <div class='d-flex flex-row mt-auto pt-10 font-weight-medium justify-content-between w-full text-muted'>
            <div class='d-flex align-items-center' style='margin-left: -3px'>
              <span class='material-symbols-outlined font-size-24 pr-5'>calendar_month</span>
              {card.media.seasonYear || 'N/A'}
            </div>
            <div class='d-flex align-items-center'>
              {formatMap[card.media.format]}
              <span class='material-symbols-outlined font-size-24 pl-5'>monitor</span>
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
    height: 27rem;
    grid-column: 1 / -1;
  }
  .h-10 {
    height: 1rem !important;
  }

  .card {
    animation: 0.3s ease 0s 1 load-in;
    cursor: pointer;
    overflow: hidden;
    transition: transform 0.2s ease;
    height: 27rem !important;
    box-shadow: rgba(0, 4, 12, 0.3) 0px 7px 15px, rgba(0, 4, 12, 0.05) 0px 4px 4px;
  }

  .badge-color {
    color: var(--color) !important;
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
    .day-row {
    grid-column: 1 / -1;
  }

  .first-check:first-child :global(.absolute-container) {
    left: -48% !important
  }
  .title {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  img {
    height: 265px;
  }
  .item {
    animation: 0.3s ease 0s 1 load-in;
    width: 185px
  }
  .cover-img {
    object-fit: cover;
    background-color: var(--color) !important;
  }
  .list-status-circle {
    background: var(--statusColor);
    height: 1.1rem;
    width: 1.1rem;
    border-radius: 50%;
  }
  .rating {
    background:black !important;
    width:50px;
    border-radius: 0.8rem 0 0.8rem 0;
  }
  .rating-icon{
    color:yellow;
    font-size:18px;
  }
  .rating-number{
    top:0px;
  }
</style>
