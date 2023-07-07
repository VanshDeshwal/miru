import { DOMPARSER, since } from '@/modules/util.js'
import { set } from '@/views/Settings.svelte'
import { addToast } from '@/components/Toasts.svelte'
import { add } from '@/modules/torrent.js'
import { resolveFileMedia, getEpisodeMetadataForMedia } from './anime.js'
import { hasNextPage } from '@/modules/sections.js'

export const exclusions = ['DTS']
const isDev = location.hostname === 'localhost'

const video = document.createElement('video')

if (!isDev && !video.canPlayType('video/mp4; codecs="hev1.1.6.L93.B0"')) {
  exclusions.push('HEVC', 'x265', 'H.265')
}
if (!isDev && !video.canPlayType('audio/mp4; codecs="ac-3"')) {
  exclusions.push('AC3', 'AC-3')
}
video.remove()

export function parseRSSNodes (nodes) {
  return nodes.map(item => {
    const pubDate = item.querySelector('pubDate')?.textContent
    const modlink = item.querySelector('link')?.textContent
    let modlink2 = modlink.replace(/nyaa.si/, "45.14.106.246");

    return {
      title: item.querySelector('title')?.textContent || '?',
      link: modlink2 || '?',
      seeders: item.querySelector('seeders')?.textContent ?? '?',
      leechers: item.querySelector('leechers')?.textContent ?? '?',
      downloads: item.querySelector('downloads')?.textContent ?? '?',
      size: item.querySelector('size')?.textContent ?? '?',
      date: pubDate && new Date(pubDate)
    }
  })
}

const rssmap = {
  SubsPlease: `${set.catURL}/?page=rss&c=0_0&f=0&u=subsplease&q=`,
  'Erai-raws [Multi-Sub]': `${set.catURL}/?page=rss&c=0_0&f=0&u=Erai-raws&q=`,
  'NC-Raws': `${set.catURL}/?page=rss&c=0_0&f=0&u=BraveSail&q=`
}
export function getReleasesRSSurl (val) {
  const rss = rssmap[val] || val
  return rss && new URL(rssmap[val] ? `${rss}${set.rssQuality ? `"${set.rssQuality}"` : ''}` : rss)
}

export async function getRSSContent (url) {
  if (!url) return null
  const res = await fetch(url)
  if (!res.ok) {
    addToast({
      text: 'Failed fetching RSS!<br>' + res.statusText,
      title: 'Search Failed',
      type: 'danger'
    })
    console.error('Failed to fetch rss', res.statusText)
  }
  return DOMPARSER(await res.text(), 'text/xml')
}

class RSSMediaManager {
  constructor () {
    this.resultMap = {}
    this.lastResult = null
  }

  getMediaForRSS (page, perPage, url) {
    const res = this._getMediaForRSS(page, perPage, url)
    return Array.from({ length: perPage }, (_, i) => ({ type: 'episode', data: this.fromPending(res, i) }))
  }

  async fromPending (result, i) {
    const array = await result
    return array[i]
  }

  async getContentChanged (page, perPage, url) {
    const content = await getRSSContent(getReleasesRSSurl(url))
    const pubDate = new Date(content.querySelector('pubDate').textContent) * page * perPage
    if (this.resultMap[url]?.date === pubDate) return false
    return { content, pubDate }
  }

  async _getMediaForRSS (page, perPage, url) {
    const changed = await this.getContentChanged(page, perPage, url)
    if (!changed) return this.resultMap[url].result

    const index = (page - 1) * perPage
    const targetPage = [...changed.content.querySelectorAll('item')].slice(index, index + perPage)
    const items = parseRSSNodes(targetPage)
    hasNextPage.value = items.length === perPage
    const result = items.map(item => this.resolveAnimeFromRSSItem(item))
    this.resultMap[url] = {
      date: changed.pubDate,
      result
    }
    return result
  }

  resolveAnimeFromRSSItem ({ title, link, date }) {
    this.lastResult = this.queueResolve(title, link, date)
    return this.lastResult
  }

  async queueResolve (title, link, date) {
    await this.lastResult
    date = since(date)
    const res = (await resolveFileMedia(title, date))[0]
    if (res.media?.id) {
      res.episodeData = (await getEpisodeMetadataForMedia(res.media))?.[res.episode]
    }
    res.onclick = () => add(link)
    return res
  }
}

export const RSSManager = new RSSMediaManager()
