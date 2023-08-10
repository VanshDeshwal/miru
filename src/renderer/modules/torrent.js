import { set } from '../views/Settings.svelte'
import { files } from '../views/Player/MediaHandler.svelte'
import { page } from '@/App.svelte'
import { toast } from 'svelte-sonner'
import 'browser-event-target-emitter'

class TorrentWorker extends EventTarget {
  constructor () {
    super()
    this.ready = new Promise((resolve) => {
      window.IPC.once('port', () => {
        this.port = window.port
        this.port.onmessage((...args) => this.handleMessage(...args))
        resolve()
      })
      window.IPC.emit('portRequest')
    })
  }

  handleMessage ({ data }) {
    this.emit(data.type, data.data)
  }

  async send (type, data, transfer) {
    await this.ready
    console.info('Torrent: sending message', { type, data })
    this.port.postMessage({ type, data }, transfer)
  }
}

export const client = new TorrentWorker()

client.send('settings', { ...set })

client.on('files', ({ detail }) => {
  files.set(detail)
})

client.on('error', ({ detail }) => {
  console.error(detail)
  toast.error('Torrent Error', { description: detail.message || detail })
})

export async function add (torrentID, hide) {
  if (torrentID) {
    console.info('Torrent: adding torrent', { torrentID })
    files.set([])
    if (!hide) page.set('player')
    if (typeof torrentID === 'string' && !torrentID.startsWith('magnet:')) {
      // IMPORTANT, this is because node's get bypasses proxies, wut????
      const res = await fetch(torrentID)
      torrentID = new Uint8Array(await res.arrayBuffer())
      client.send('torrent', torrentID, [torrentID.buffer])
    } else {
      client.send('torrent', torrentID)
    }
  }
}

client.on('torrent', ({ detail }) => {
  localStorage.setItem('torrent', JSON.stringify([...detail]))
})

// load last used torrent
queueMicrotask(() => {
  setTimeout(() => {
    const torrent = localStorage.getItem('torrent')
    if (torrent) {
      const data = new Uint8Array(JSON.parse(torrent))
      if (!files.length) client.send('torrent', data, [data.buffer])
    }
  }, 1000)
})
