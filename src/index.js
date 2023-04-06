const { app, BrowserWindow, protocol, shell, ipcMain, dialog, MessageChannelMain } = require('electron')
const path = require('path')
const { Client } = require('discord-rpc')
const log = require('electron-log')
const { autoUpdater } = require('electron-updater')

const flags = [
  ['enable-gpu-rasterization'],
  ['enable-zero-copy'],
  ['ignore-gpu-blocklist'],
  ['ignore-certificate-errors'],
  ['enable-hardware-overlays', 'single-fullscreen,single-on-top,underlay'],
  ['enable-features', 'EnableDrDc,CanvasOopRasterization,BackForwardCache:TimeToLiveInBackForwardCacheInSeconds/300/should_ignore_blocklists/true/enable_same_site/true,ThrottleDisplayNoneAndVisibilityHiddenCrossOriginIframes,UseSkiaRenderer,WebAssemblyLazyCompilationEnableDrDc,CanvasOopRasterization,BackForwardCache:TimeToLiveInBackForwardCacheInSeconds/300/should_ignore_blocklists/true/enable_same_site/true,ThrottleDisplayNoneAndVisibilityHiddenCrossOriginIframes,UseSkiaRenderer,WebAssemblyLazyCompilation'],
  ['force_high_performance_gpu'],
  ['disable-features', 'Vulkan']
]
for (const [flag, value] of flags) {
  app.commandLine.appendSwitch(flag, value)
}

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('miru', process.execPath, [path.resolve(process.argv[1])])
  }
} else {
  app.setAsDefaultProtocolClient('miru')
  if (process.argv.length >= 2) {
    ipcMain.on('version', () => {
      for (const line of process.argv) {
        handleProtocol(line)
      }
    })
  }
}

if (!app.requestSingleInstanceLock()) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
    // There's probably a better way to do this instead of a for loop and split[1][0]
    // but for now it works as a way to fix multiple OS's commandLine differences
    for (const line of commandLine) {
      handleProtocol(line)
    }
  })
}
app.on('open-url', (event, url) => {
  event.preventDefault()
  handleProtocol(url)
})

// schema: miru://key/value
const protocolMap = {
  auth: sendToken,
  anime: openAnime,
  w2g: joinLobby
}
const protocolRx = /miru:\/\/([a-z0-9]+)\/(.+)/i
function handleProtocol (text) {
  const match = text.match(protocolRx)
  if (match) protocolMap[match[1]]?.(match[2])
}

function joinLobby (link) {
  mainWindow.webContents.send('w2glink', link)
}

function sendToken (line) {
  let token = line.split('access_token=')[1].split('&token_type')[0]
  if (token) {
    if (token.endsWith('/')) token = token.slice(0, -1)
    mainWindow.webContents.send('altoken', token)
  }
}

function openAnime (id) {
  if (!isNaN(id)) mainWindow.webContents.send('open-anime', id)
}

ipcMain.on('open', (event, url) => {
  shell.openExternal(url)
})

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let webtorrentWindow

function UpsertKeyValue (obj, keyToChange, value) {
  const keyToChangeLower = keyToChange.toLowerCase()
  for (const key of Object.keys(obj)) {
    if (key.toLowerCase() === keyToChangeLower) {
      // Reassign old key
      obj[key] = value
      // Done
      return
    }
  }
  // Insert at end instead
  obj[keyToChange] = value
}

ipcMain.on('devtools', () => {
  webtorrentWindow.webContents.openDevTools()
})

function createWindow () {
  // Create the browser window.
  webtorrentWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      backgroundThrottling: false
    }
  })
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    frame: false,
    backgroundColor: '#191c20',
    autoHideMenuBar: true,
    webPreferences: {
      enableBlinkFeatures: 'FontAccess, AudioVideoTracks',
      backgroundThrottling: false,
      preload: path.join(__dirname, '/preload.js')
    },
    icon: path.join(__dirname, '/renderer/public/logo.ico'),
    show: false
  })
  mainWindow.setMenuBarVisibility(false)

  protocol.registerHttpProtocol('miru', (req, cb) => {
    const token = req.url.slice(7)
    if (process.env.NODE_ENV !== 'development ') {
      mainWindow.loadURL(path.join(__dirname, '/renderer/dist/index.html' + token))
    } else {
      mainWindow.loadURL('http://localhost:5173/' + token)
    }
  })

  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    const { responseHeaders } = details
    if (!responseHeaders['access-control-allow-origin']) UpsertKeyValue(responseHeaders, 'Access-Control-Allow-Origin', ['*'])
    if (!responseHeaders['access-control-allow-credentials']) UpsertKeyValue(responseHeaders, 'Access-Control-Allow-Origin', ['*'])
    if (!responseHeaders['access-control-allow-credentials']) UpsertKeyValue(responseHeaders, 'Access-Control-Allow-Headers', ['*'])

    const headers = { responseHeaders }
    callback(headers)
  })

  let torrentLoad = null

  if (process.env.NODE_ENV !== 'development ') {
    // Load production build
    torrentLoad = webtorrentWindow.loadFile(path.join(__dirname, '/renderer/dist/webtorrent.html'))
    mainWindow.loadFile(path.join(__dirname, '/renderer/dist/index.html'))
  } else {
    // Load vite dev server page
    console.log('Development mode')
    torrentLoad = webtorrentWindow.loadURL('http://localhost:5173/webtorrent.html')
    webtorrentWindow.webContents.openDevTools()
    mainWindow.loadURL('http://localhost:5173/')
    mainWindow.webContents.openDevTools()
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
    app.quit()
  })

  // Emitted when the window is ready to be shown
  // This helps in showing the window gracefully.
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })
  ipcMain.on('portRequest', async ({ sender }) => {
    const { port1, port2 } = new MessageChannelMain()
    await torrentLoad
    webtorrentWindow.webContents.postMessage('port', null, [port1])
    sender.postMessage('port', null, [port2])
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

ipcMain.on('dialog', async (event, data) => {
  const { filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory']
  })
  if (filePaths.length) {
    let path = filePaths[0]
    if (!(path.endsWith('\\') || path.endsWith('/'))) {
      if (path.indexOf('\\') !== -1) {
        path += '\\'
      } else if (path.indexOf('/') !== -1) {
        path += '/'
      }
    }
    event.sender.send('path', path)
  }
})

ipcMain.on('minimize', (event) => {
  BrowserWindow.fromWebContents(event.sender).minimize()
})
ipcMain.on('maximize', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender)
  if (window.isMaximized()) {
    window.unmaximize()
  } else {
    window.maximize()
  }
})
ipcMain.on('close', () => {
  app.quit()
})

let status = null
const discord = new Client({
  transport: 'ipc'
})
function setDiscordRPC (event, data) {
  status = data
  if (discord?.user && status) {
    status.pid = process.pid
    discord.request('SET_ACTIVITY', status)
  }
}

ipcMain.on('discord', setDiscordRPC)
discord.on('ready', async () => {
  setDiscordRPC(null, status)
  discord.subscribe('ACTIVITY_JOIN_REQUEST')
  discord.subscribe('ACTIVITY_JOIN')
  discord.subscribe('ACTIVITY_SPECTATE')
})
discord.on('ACTIVITY_JOIN', (args) => {
  BrowserWindow.getAllWindows()[0]?.send('w2glink', args.secret)
})

function loginRPC () {
  discord.login({ clientId: '954855428355915797' }).catch(() => {
    setTimeout(loginRPC, 5000).unref()
  })
}
loginRPC()

ipcMain.on('version', (event) => {
  event.sender.send('version', app.getVersion()) // fucking stupid
})

autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'
ipcMain.on('update', () => {
  autoUpdater.checkForUpdatesAndNotify()
})

autoUpdater.checkForUpdatesAndNotify()
autoUpdater.on('update-available', () => {
  BrowserWindow.getAllWindows()[0]?.send('update', true)
})
