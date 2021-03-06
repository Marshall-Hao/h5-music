import { computed } from "vue";
import { useStore } from "vuex";
import { save, remove, load } from "../../assets/js/array-store";
import { FAVORITE_KEY } from "../../assets/js/constant";
export default function useFavorite() {
  const store = useStore();
  const favoriteList = computed(() => {
    return store.state.favoriteList;
  });
  const maxLen = 100;
  function getFavoriteIcon(song) {
    return isFavorite(song) ? "icon-favorite" : "icon-not-favorite";
  }

  function toggleFavorite(song) {
    let list;
    if (isFavorite(song)) {
      console.log("remove");
      // * remove
      list = remove(FAVORITE_KEY, compare);
    } else {
      // * save
      list = save(song, FAVORITE_KEY, compare, maxLen);
    }
    store.commit("setFavoriteList", list);
    function compare(item) {
      return item.id === song.id;
    }
  }

  function isFavorite(song) {
    return (
      //  * 不能用indexOf 因为 对象的值可能一样但 引用不一样
      favoriteList.value.findIndex((item) => {
        return item.id === song.id;
      }) > -1
    );
  }

  return {
    getFavoriteIcon,
    toggleFavorite,
  };
}
