<script>
  import { traceAnime } from '@/modules/anime.js'
 
  export let search
  export let current
  export let media = null
  export let loadCurrent
  let searchTimeout = null
  let searchTextInput

  function searchClear () {
    search = {
      format: '',
      genre: '',
      season: '',
      sort: '',
      status: ''
    }
    current = null
    searchTextInput?.focus()
  }
  function input () {
    if (!searchTimeout) {
      if (Object.values(search).filter(v => v).length) media = [new Promise(() => {})]
    } else {
      clearTimeout(searchTimeout)
    }
    searchTimeout = setTimeout(() => {
      if (current === null) {
        if (Object.values(search).filter(v => v).length) current = 'search'
      } else {
        if (Object.values(search).filter(v => v).length) {
          loadCurrent(false)
        } else {
          current = null
        }
      }
      searchTimeout = null
    }, 500)
  }
  function handleFile ({ target }) {
    const { files } = target
    if (files?.[0]) {
      traceAnime(files[0], 'file')
      target.value = null
    }
  }
</script>

<div class='container-fluid row p-20 position-sticky top-0 search-container z-40' on:input={input}>
  <div class='col-4 p-10 d-flex flex-column justify-content-end'>
    <div class='input-group shadow-lg'>
      <div class='input-group-prepend'>
        <span class='input-group-text d-flex material-icons search-color pr-0 font-size-18'>search</span>
      </div>
      <!-- svelte-ignore a11y-autofocus -->
      <input
        on:input={({ target }) => {
          queueMicrotask(() => {
            search.search = target.value
            input()
          })
        }}
        bind:this={searchTextInput}
        autofocus
        type='search'
        class='form-control search-color border-left-0 text-capitalize'
        autocomplete='off'
        bind:value={search.search}
        data-option='search'
        placeholder='Title' />
    </div>
  </div>
  <div class='col-lg col-4 p-10 d-flex flex-column justify-content-end'>
    <div class='shadow-lg'>
      <select class='form-control search-color' required bind:value={search.genre}>
        <option value selected disabled hidden>Genre</option>
        <option value='Action'>Action</option>
        <option value='Adventure'>Adventure</option>
        <option value='Comedy'>Comedy</option>
        <option value='Drama'>Drama</option>
        <option value='Ecchi'>Ecchi</option>
        <option value='Fantasy'>Fantasy</option>
        <option value='Horror'>Horror</option>
        <option value='Mahou Shoujo'>Mahou Shoujo</option>
        <option value='Mecha'>Mecha</option>
        <option value='Music'>Music</option>
        <option value='Mystery'>Mystery</option>
        <option value='Psychological'>Psychological</option>
        <option value='Romance'>Romance</option>
        <option value='Sci-Fi'>Sci-Fi</option>
        <option value='Slice of Life'>Slice of Life</option>
        <option value='Sports'>Sports</option>
        <option value='Supernatural'>Supernatural</option>
        <option value='Thriller'>Thriller</option>
      </select>
    </div>
  </div>
  <div class='col-lg col-4 p-10 d-flex flex-column justify-content-end'>
    <div class='input-group shadow-lg'>
      <select class='form-control search-color border-right-dark' required bind:value={search.season}>
        <option value selected disabled hidden>Season</option>
        <option value='WINTER'>Winter</option>
        <option value='SPRING'>Spring</option>
        <option value='SUMMER'>Summer</option>
        <option value='FALL'>Fall</option>
      </select>
      <input type='number' placeholder='Year' min='1940' max='2100' list='search-year' class='form-control search-color' bind:value={search.year} />
      <datalist id='search-year'>
        {#each Array(new Date().getFullYear() - 1940 + 2) as _, i}
          {@const year = new Date().getFullYear() + 2 - i}
          <option>{year}</option>
        {/each}
      </datalist>
    </div>
  </div>
  <div class='col p-10 d-flex flex-column justify-content-end'>
    <div class='shadow-lg'>
      <select class='form-control search-color' required bind:value={search.format}>
        <option value selected disabled hidden>Format</option>
        <option value='TV'>TV Show</option>
        <option value='MOVIE'>Movie</option>
        <option value='TV_SHORT'>TV Short</option>
        <option value='OVA'>OVA</option>
        <option value='ONA'>ONA</option>
      </select>
    </div>
  </div>
  <div class='col p-10 d-flex flex-column justify-content-end'>
    <div class='shadow-lg'>
      <select class='form-control search-color' required bind:value={search.status}>
        <option value selected disabled hidden>Status</option>
        <option value='RELEASING'>Airing</option>
        <option value='FINISHED'>Finished</option>
        <option value='NOT_YET_RELEASED'>Not Yet Aired</option>
        <option value='CANCELLED'>Cancelled</option>
      </select>
    </div>
  </div>
  <div class='col p-10 d-flex flex-column justify-content-end'>
    <div class='shadow-lg'>
      <select class='form-control search-color' required bind:value={search.sort}>
        <option value selected disabled hidden>Name</option>
        <option value='START_DATE_DESC'>Release Date</option>
        <option value='SCORE_DESC'>Score</option>
        <option value='POPULARITY_DESC'>Popularity</option>
        <option value='TRENDING_DESC'>Trending</option>
        <option value='UPDATED_TIME_DESC' disabled hidden>Updated Date</option>
      </select>
    </div>
  </div>
  <input type='file' class='d-none' id='search-image' accept='image/*' on:input={handleFile} />
  <div class='col-auto p-10 d-flex'>
    <div class='shadow-lg align-self-end'>
      <button class='btn search-color material-icons font-size-18 px-5 align-self-end border-0' type='button'>
        <label for='search-image' style="color:grey;" class='pointer'>
          image
        </label>
      </button>
    </div>
  </div>
  <div class='col-auto p-10 d-flex'>
    <div class='shadow-lg align-self-end'>
      <button class='btn search-color material-icons font-size-18 px-5 align-self-end border-0' style="color:grey;" type='button' on:click={searchClear} class:text-primary={!!current}>
        delete
      </button>
    </div>
  </div>

</div>

<style>
  .container-fluid > div > :nth-child(2),
  .container-fluid button {
    transition: transform 0.2s ease;
  }

  .container-fluid > div > :nth-child(2):hover {
    transform: scale(1.05);
  }

  .container-fluid button:hover {
    transform: scale(1.15);
  }
  .bg-dark::-webkit-inner-spin-button {
    filter: invert(0.942);
  }
  input:not(:focus):invalid {
    box-shadow: 0 0 0 0.2rem var(--danger-color) !important;
  }
  select.form-control:invalid {
    color: var(--dm-input-placeholder-text-color);
  }
  .font-size-30 {
    font-size: 3rem !important;
  }
</style>
