<template>
	<div class="singer-detail">
		<music-list :songs="songs" :title="title" :pic="pic" :loading="loading"></music-list>
	</div>
</template>

<script>
import createDetailComponent from "../assets/js/create-detail-component";
import { getSingerDetail } from "../service/singer";
// import { processSongs } from "../service/song";
// import MusicList from "../components/music-list/music-list";
// import storage from "good-storage";
import { SINGER_KEY } from "../assets/js/constant";

export default createDetailComponent('singer-detail', SINGER_KEY, getSingerDetail)
	// export default {
	// 	name: "singer-detail",
	// 	props: {
	// 		singer: Object,
	// 	},
	// 	data() {
	// 		return {
	// 			songs: [],
	// 			loading: true,
	// 		};
	// 	},
	// 	computed: {
	// 		computedSinger() {
	// 			let ret = null;
	// 			const singer = this.singer;
	// 			if (singer) {
	// 				ret = singer;
	// 			} else {
	// 				const cacheSinger = storage.session.get(SINGER_KEY);
	// 				if (cacheSinger && cacheSinger.mid === this.$route.params.id) {
	// 					ret = cacheSinger;
	// 				}
	// 			}
	// 			return ret;
	// 		},
	// 		pic() {
	// 			const singer = this.computedSinger;
	// 			return singer && singer.pic;
	// 		},
	// 		title() {
	// 			const singer = this.computedSinger;
	// 			return singer && singer.name;
	// 		},
	// 	},
	// 	components: {
	// 		MusicList,
	// 	},
	// 	async created() {
	// 		if (!this.computedSinger) {
	// 			const path = this.$route.matched[0].path;
	// 			this.$router.push({
	// 				path,
	// 			});
	// 			return;
	// 		}
	// 		// * https://segmentfault.com/q/1010000010364198
	// 		const result = await getSingerDetail(this.computedSinger);
	// 		await processSongs(result.songs);
	// 		this.songs = result.songs;
	// 		this.loading = false;
	// 	},
	// };
</script>

<style lang="scss" scoped>
.singer-detail {
	position: fixed;
	z-index: 10;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	background: $color-background;
}
</style>