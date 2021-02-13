import fs from 'fs'

import fetch, {Response} from 'node-fetch'

import {Song} from './parse'
import {getDownloadFilePath} from './symlink'

const PLAYLIST_BASE_URL = 'https://bcdcnt.net/playlist'
const FILE_BASE_URL = 'https://mp3.bcdcnt.net/files'

export async function downloadPlaylistHtml(
  playlistId: string
): Promise<string> {
  const playlistUrl = `${PLAYLIST_BASE_URL}/${playlistId}.html`
  const res = await fetch(playlistUrl)
  checkResponseOk(res)
  return await res.text()
}

export async function downloadSong(song: Song): Promise<string> {
  const downloadFilePath = getDownloadFilePath(song)

  if (fs.existsSync(downloadFilePath)) {
    console.log(`Song already downloaded: ${downloadFilePath}`)
    return downloadFilePath
  }

  const fileUrl = `${FILE_BASE_URL}/${song.file}`
  const res = await fetch(fileUrl)
  checkResponseOk(res)

  return new Promise<string>((resolve, reject) => {
    const dest = fs.createWriteStream(downloadFilePath)
    res.body.pipe(dest)
    res.body.on('end', () => resolve(downloadFilePath))
    dest.on('error', reject)
  })
}

function checkResponseOk(res: Response) {
  if (!res.ok) {
    throw new Error(`Request error: ${res.status} ${res.statusText}`)
  }
}
