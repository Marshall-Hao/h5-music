import { PLAY_MODE } from "../assets/js/constant";
import { shuffle } from "@/assets/js/util";
export function selectPlay({ commit, state }, { list, index }) {
  commit("setPlayMode", PLAY_MODE.sequence);
  commit("setSequenceList", list);
  commit("setPlayingState", true);
  commit("setFullScreen", true);
  commit("setPlaylist", list);
  commit("setCurrentIndex", index);
}

export function randomPlay({ commit }, list) {
  commit("setPlayMode", PLAY_MODE.random);
  commit("setSequenceList", list);
  commit("setPlayingState", true);
  commit("setFullScreen", true);
  commit("setPlaylist", shuffle(list));
  commit("setCurrentIndex", 0);
}

export function changeMode({ commit, state, getters }, mode) {
  const currentId = getters.currentSong.id;
  if (mode === PLAY_MODE.random) {
    commit("setPlaylist", shuffle(state.sequenceList));
  } else {
    commit("setPlaylist", state.sequenceList);
  }
  const index = state.playlist.findIndex((song) => {
    return song.id === currentId;
  });

  commit("setCurrentIndex", index);
  commit("setPlayMode", mode);
}

export function removeSong({ commit, state }, song) {
  const sequenceList = [...state.sequenceList];
  const playlist = [...state.playlist];

  const sequenceIndex = findIndex(sequenceList, song);
  const playlistIndex = findIndex(playlist, song);

  if (playlistIndex < 0) {
    return;
  }

  sequenceList.splice(sequenceIndex, 1);
  playlist.splice(playlistIndex, 1);

  let currentIndex = state.currentIndex;
  if (
    playlistIndex < currentIndex ||
    (playlistIndex === playlist.length && currentIndex === playlist.length)
  ) {
    currentIndex--;
  }
  commit("setSequenceList", sequenceList);
  commit("setPlaylist", playlist);
  commit("setCurrentIndex", currentIndex);
  if (!playlist.length) {
    commit("setPlayingState", false);
  }
}

export function clearSonglist({ commit }) {
  commit("setSequenceList", []);
  commit("setPlaylist", []);
  commit("setCurrentIndex", 0);
  commit("setPlayingState", false);
}

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id;
  });
}
