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
