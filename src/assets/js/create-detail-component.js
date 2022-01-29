import MusicList from "../../components/music-list/music-list";
import storage from "good-storage";
import { processSongs } from "../../service/song";
export default function createDetailComponent(name, key, fetch) {
  return {
    name,
    props: {
      data: Object,
    },
    data() {
      return {
        songs: [],
        loading: true,
      };
    },
    computed: {
      computedData() {
        let ret = null;
        const data = this.data;
        if (data) {
          ret = data;
        } else {
          const cache = storage.session.get(key);
          if (cache && cache.mid === this.$route.params.id) {
            ret = cache;
          }
        }
        return ret;
      },
      pic() {
        const data = this.computedData;
        return data && data.pic;
      },
      title() {
        const data = this.computedData;
        return data && data.name;
      },
    },
    components: {
      MusicList,
    },
    async created() {
      const data = this.computedData;
      // *每一次访问computed数据，都在执行一次依赖收集，对性能有影响
      if (!data) {
        const path = this.$route.matched[0].path;
        this.$router.push({
          path,
        });
        return;
      }
      // * https://segmentfault.com/q/1010000010364198 computed第一次发生时机beforeCreate和created之间
      const result = await fetch(data);
      await processSongs(result.songs);
      this.songs = result.songs;
      this.loading = false;
    },
  };
}
