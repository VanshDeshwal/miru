<script context='module'>
    export let alToken = localStorage.getItem('ALtoken') || null


    const anime = {
    AnimeTitle: null,
    AnimeEpisode: null,
    AnimeCoverImage: null,
  }

  localStorage.removeItem('relations') // TODO: remove
  export const downloaded = { ...anime, ...(JSON.parse(localStorage.getItem('downloads')) || {}) }

</script>

<script>
    function downloadAnime () {
    console.log('Title:' + downloaded.AnimeTitle)
    console.log('Episode:' + downloaded.AnimeEpisode)
    console.log('CoverImage:' + downloaded.AnimeCoverImage)
  }
  let downloads = downloaded
  $: saveSettings(downloads)
  function saveSettings () {
    localStorage.setItem('downloads', JSON.stringify(downloads))
  }
</script>



<div class='d-flex h-full flex-column overflow-y-scroll '>
    <div class='h-full py-10'>
        <div>
            <span class="d-flex px-20 align-items-end pointer text-decoration-none s-yhC2jJRS39h5"><div class="pl-20 font-size-24 font-weight-semi-bold s-yhC2jJRS39h5">Downloads</div> </span>
            <div class='gallery pt-10 pb-20 w-full overflow-y-hidden position-relative'>
                <div class='card m-0 p-0'
                role='button'
                title={downloaded.AnimeTitle}
                on:click={() => { 
                  downloadAnime()
                }}>
                <div class='row h-full  title'>
                  <div class='col-12 '>
                    <img loading='lazy' src={downloaded.AnimeCoverImage || ''} alt='cover' class='cover-img w-full' />
                  </div>
                  <div class='col-12 mid-card text-overflow-hidden'>
                    <div class='px-10'>
                      <h5 class='m-0 text-capitalize font-weight-bold' >
                        {[downloaded.AnimeTitle, downloaded.AnimeEpisode].filter(s => s).join(' - ')}
                      </h5>
                    </div>
                  </div>
                  <div class="col-12 end-card text-overflow-hidden-oneline">
                  </div>
                </div>
              </div>
              </div>
           

        </div>
    </div>
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
    grid-template-columns: repeat(10, 24rem);    /*6,50rem original, 10,24rem mine*/
  }

  .gallery :global(.empty) {
    grid-column: 1/4 !important;      /*1/3 original, 1/4 mine*/
  }

  .gallery:after {
    content: '';
    position: absolute;
    right: 0;
    height: 100%;
    width: 2rem;                   /*8rem original, 2rem mine*/
    /*this gradient looks like ass, need to find smth better*/
    pointer-events: none;
  }
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
  
    .small-skeloader {
      position:absolute;
      bottom:0px;
      top:210px;
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
  

