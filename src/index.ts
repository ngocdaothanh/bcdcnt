import fs from 'fs'
import path from 'path'

import cheerio from 'cheerio'
import fetch, {Response} from 'node-fetch'

const playlistId = 'nang-luong-tich-cuc-763'

type Artist = {
  id: string
  name: string
}

type Song = {
  id: string
  fileUrl: string
  title: string
  artists: Artist[]
}

function checkResponseOk(res: Response) {
  if (!res.ok) {
    throw new Error(`Request error: ${res.status} ${res.statusText}`)
  }
}

async function downloadPlaylistHtml(playlistId: string): Promise<string> {
  const playlistUrl = `https://bcdcnt.net/playlist/${playlistId}.html`
  const res = await fetch(playlistUrl)
  checkResponseOk(res)
  return await res.text()
}

function parsePlaylist(playlistHtml: string): Song[] {
  const $ = cheerio.load(playlistHtml)
  const songItems = $('.playlist-song-item')

  const songs: Song[] = []

  songItems.each((_songItemIdx, elem) => {
    const $elem = $(elem)

    const id = $elem.data('id')

    const file = $elem.data('file')
    const fileUrl = `https://mp3.bcdcnt.net/files/${file}`

    const title = $('.content-title a', $elem).text()

    const artists: Artist[] = []
    const artistLinks = $('.content-info a', $elem)
    artistLinks.each((_artistLinkIdx, artistLink) => {
      const $artistLink = $(artistLink)
      const artistId = $artistLink.attr('href')!.substring('/nghe-si/'.length)
      const artistName = $(artistLink).text()
      artists.push({id: artistId, name: artistName})
    })

    songs.push({id, fileUrl, title, artists})
  })

  return songs
}

async function downloadSong(
  {id, fileUrl, title}: Song,
  order: number
): Promise<void> {
  const res = await fetch(fileUrl)
  checkResponseOk(res)

  const fileName = `${order}-${id}-${title}-${path.basename(fileUrl)}`

  return new Promise((resolve, reject) => {
    const dest = fs.createWriteStream(fileName)
    res.body.pipe(dest)
    res.body.on('end', resolve)
    dest.on('error', reject)
  })
}

async function main() {
  const html = await downloadPlaylistHtml(playlistId)

  const songs = parsePlaylist(html)
  console.log(JSON.stringify(songs, null, 2))

  console.log(`Playlist ${playlistId} has ${songs.length} songs`)

  for (let idx = 0; idx < 1; idx++) {
    const song = songs[idx]
    const order = idx + 1

    console.log(`Download song #${order} ${song.title}...`)
    try {
      await downloadSong(song, order)
    } catch (error) {
      console.error(error)
    }
  }
}

main()
