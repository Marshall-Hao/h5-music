import { get } from "./base";

export function processSongs(songs) {
  if (!songs.length) {
    return Promise.resolve(songs);
  }

  return get("api/getSongsUrl", {
    mid: songs.map((song) => {
      return song.mid;
    }),
  }).then((result) => {
    const map = result.map;
    return songs
      .map((song) => {
        song.url = map[song.mid];
        return song;
      })
      .filter((song) => {
        //   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf
        return song.url.indexOf("vkev") > -1;
      });
  });
}

const lyricMap = {};

export function getLyric(song) {
  if (song.lyric) {
    // * cuz it's async fn
    return Promise.resolve(song.lyric);
  }
  const mid = song.mid;
  const lyric = lyricMap[mid];
  // * 有的歌可能是相同的mid
  if (lyric) {
    return Promise.resolve(lyric);
  }
  return get("/api/getLyric", {
    mid,
  }).then((res) => {
    const lyric = res ? res.lyric : "[00:00:00]该歌曲暂时无法获取歌词";
    lyricMap[mid] = lyric;
    return lyric;
  });
}
