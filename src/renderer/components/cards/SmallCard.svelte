<script>
  import { getContext } from 'svelte'
  import PreviewCard from './PreviewCard.svelte'
  import { formatMap, statusColorMap } from '@/modules/anime.js'
  import { hoverClick } from '@/modules/click.js'
  import {release_time} from '@/modules/util.js'
  export let media
  let preview = false



  const view = getContext('view')
  function viewMedia () {
    $view = media
  }

  function rating (s) {
    s = (s/10).toFixed(1)
    return s
  }
</script>

<div class='d-flex p-20 position-relative first-check' on:pointerenter={() => { preview = true }} on:custom-pointerleave={() => { preview = false }} use:hoverClick={viewMedia}>
  {#if preview}
    <PreviewCard {media} />
  {/if}
  <div class='item d-flex flex-column h-full pointer content-visibility-auto'>
    <img loading='lazy' src={media.coverImage.extraLarge || ''} alt='cover' class='cover-img w-full rounded-3' style:--color={media.coverImage.color || '#1890ff'} />
    {#if media.averageScore}
    <div class='rating position-absolute'>
      <span class='p-5 material-icons rating-icon'>grade</span>
      <span class='pt-5 pr-5 rating-number position-absolute'>{rating(media.averageScore)}</span>
    </div>
    {/if}
    <div class='text-white font-weight-very-bold font-size-16 pt-15 title overflow-hidden'>
      {#if media.mediaListEntry?.status}
        <div style:--statusColor={statusColorMap[media.mediaListEntry.status]} class='list-status-circle d-inline-flex overflow-hidden mr-5' title={media.mediaListEntry.status} />
      {/if}
      {media.title.userPreferred}
    </div>
    <div class='d-flex flex-row mt-auto pt-10 font-weight-medium justify-content-between w-full text-muted'>
      <div class='d-flex align-items-center' style='margin-left: -3px'>
        <span class='material-symbols-outlined font-size-24 pr-5'>calendar_month</span>
        {media.seasonYear || 'N/A'}
      </div>
      <div class='d-flex align-items-center'>
        {formatMap[media.format]}
        <span class='material-symbols-outlined font-size-24 pl-5'>monitor</span>
      </div>
      <div>
        {#if media.schedule && media.nextAiringEpisode}
      <span class=' font-weight-bold badge-color'>
        {'EP ' + media.nextAiringEpisode.episode + ' releasing at ' + release_time(media.nextAiringEpisode.timeUntilAiring)}
      </span>
      {/if}
      </div>
      
    </div>
  </div>
</div>

<style>
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
    width: 185px;
    contain-intrinsic-height: 36.7rem;
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
