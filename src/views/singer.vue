<template>
	<div class="singer" v-loading:[loadingText]="!singers.length">
		<index-list :data="singers" @select="selectSinger"></index-list>
		<router-view :singer="selectedSinger"></router-view>
	</div>
</template>

<script>
	import { getSingerList } from "../service/singer";
	import IndexList from "../components/base/index-list/index-list";

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
				this.$router.push({
					path: `/singer/${singer.mid}`,
				});
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