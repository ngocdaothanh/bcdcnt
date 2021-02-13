import cheerio from 'cheerio'

export type Artist = {
  id: string
  name: string
}

export type Song = {
  id: string
  file: string
  title: string
  artists: Artist[]
}

export function parsePlaylist(playlistHtml: string): Song[] {
  const $ = cheerio.load(playlistHtml)
  const songItems = $('.playlist-song-item')

  const songs: Song[] = []

  songItems.each((_songItemIdx, elem) => {
    const $elem = $(elem)

    const id = $elem.data('id')
    const file = $elem.data('file')
    const title = $('.content-title a', $elem).text()

    const artists: Artist[] = []
    const artistLinks = $('.content-info a', $elem)
    artistLinks.each((_artistLinkIdx, artistLink) => {
      const $artistLink = $(artistLink)
      const artistId = $artistLink.attr('href')!.substring('/nghe-si/'.length)
      const artistName = $(artistLink).text()
      artists.push({id: artistId, name: artistName})
    })

    songs.push({id, file, title, artists})
  })

  return songs
}
