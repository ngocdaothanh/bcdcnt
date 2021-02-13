import {downloadPlaylistHtml, downloadSong} from './download'
import {parsePlaylist} from './parse'
import {createSymlink, savePlaylist} from './symlink'

async function main() {
  if (process.argv.length !== 3) {
    console.error('Run with args: <playlist id>')
    return
  }

  const playlistId = process.argv[2]

  const html = await downloadPlaylistHtml(playlistId)
  const songs = parsePlaylist(html)

  console.log(`Playlist ${playlistId} has ${songs.length} songs`)

  for (let idx = 0; idx < songs.length; idx++) {
    const song = songs[idx]
    const order = idx + 1

    try {
      console.log(`Download ${order}/${songs.length} ${song.title}...`)
      const downloadFilePath = await downloadSong(song)

      const symlinkFilePath = createSymlink(playlistId, order, song)
      console.log(`${symlinkFilePath} -> ${downloadFilePath}`)

      console.log()
    } catch (error) {
      console.error(error)
    }
  }

  savePlaylist(playlistId, songs)
}

main()
