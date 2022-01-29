<template>
	<div class="singer" v-loading:[loadingText]="!singers.length">
		<index-list :data="singers" @select="selectSinger"></index-list>
		<!-- * https://blog.csdn.net/qq_24767091/article/details/119385206 -->
		<!-- * https://blog.csdn.net/weixin_43974265/article/details/113543096 -->
		<!-- * https://router.vuejs.org/zh/guide/#html -->
		<router-view v-slot="{ Component }">
			<transition appear name="slide">
				<component :is="Component" :data="selectedSinger" />
			</transition>
		</router-view>
	</div>
</template>

<script>
import { getSingerList } from "../service/singer";
import IndexList from "../components/base/index-list/index-list";
import storage from "good-storage";
import { SINGER_KEY } from "../assets/js/constant";

export default {
	name: "singer",
	components: {
		IndexList,
	},
	data() {
		return {
			singers: [],
			loadingText: "yeah!",
			selectedSinger: null,
		};
	},
	async created() {
		const result = await getSingerList();
		this.singers = result.singers;
	},
	methods: {
		selectSinger(singer) {
			this.selectedSinger = singer;
			this.cacheSinger(singer);
			this.$router.push({
				path: `/singer/${singer.mid}`,
			});
		},
		cacheSinger(singer) {
			storage.session.set(SINGER_KEY, singer);
		},
	},
};
</script>


<style lang="scss" scoped>
.singer {
	position: fixed;
	width: 100%;
	top: 88px;
	bottom: 0;
}
</style>