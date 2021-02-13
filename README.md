# bcdcnt.net playlist downloader

## Compile

```sh
npm run compile
```

## Download playlist

```sh
node build/src/index.js <playlist id>
```

Example:

```sh
node build/src/index.js nang-luong-tich-cuc-763
```

## Downloaded files

```
download/
  files/ (shared among playlists)
    <song id>-<file id>.mp3  <----------------------+
                                                    |
  <playlist id>/                                    |
    <song order>-<title>-<artist1>-<artist2>.mp3  --+
```
