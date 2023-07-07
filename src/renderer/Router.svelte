<script>
  import { getContext } from 'svelte'
  import Home from './views/Home/Home.svelte'
  import Dome from './views/Home/Dome.svelte'
  import MediaHandler from './views/Player/MediaHandler.svelte'
  import Settings from './views/Settings.svelte'
  import WatchTogether from './views/WatchTogether/WatchTogether.svelte'
  import Miniplayer from 'svelte-miniplayer'

  export let page = 'home'
  const current = getContext('gallery')
</script>

<Miniplayer active={page !== 'player'} class='bg-dark-light z-10 {page === 'player' ? 'h-full' : ''}' minwidth='5rem' maxwidth='45rem' width='300px' padding='2rem'>
  <MediaHandler miniplayer={page !== 'player'} bind:page />
</Miniplayer>
{#if page === 'settings'}
  <Settings />
{:else if page === 'home'}
  <Home bind:current={$current} />
{:else if page === 'schedule'}
  <Dome bind:current={$current} />
{:else if page === 'watchtogether'}
  <WatchTogether />
{/if}
