import fs from 'fs'
import path from 'path'

import {Song} from './parse'

const DOWNLOAD_DIR = 'download'
const FILES_DIR = `${DOWNLOAD_DIR}/files`

export function getDownloadFilePath({id, file}: Song): string {
  fs.mkdirSync(FILES_DIR, {recursive: true})

  const basename = path.basename(file)
  return `${FILES_DIR}/${id}-${basename}`
}

export function createSymlink(
  playlistId: string,
  order: number,
  song: Song
): string {
  const downloadFilePath = getDownloadFilePath(song)
  const symlinkFilePath = getSymlinkFilePath(playlistId, order, song)

  if (!fs.existsSync(symlinkFilePath)) {
    fs.symlinkSync('../../' + downloadFilePath, symlinkFilePath)
  }

  return symlinkFilePath
}

function getSymlinkFilePath(
  playlistId: string,
  order: number,
  {file, title, artists}: Song
): string {
  const playlistDir = `${DOWNLOAD_DIR}/${playlistId}`
  fs.mkdirSync(playlistDir, {recursive: true})

  const formattedOrder = formatOrder(order)
  const artistNames = artists.map(({name}) => name).join('-')
  const extname = path.extname(file)
  return `${playlistDir}/${formattedOrder}-${title}-${artistNames}${extname}`
}

function formatOrder(order: number): string {
  return order < 10 ? '00' + order : order < 100 ? '0' + order : '' + order
}
