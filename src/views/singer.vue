<template>
	<div class="singer" v-loading:[loadingText]="!singers.length">
		<index-list :data="singers"></index-list>
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
			};
		},
		async created() {
			const result = await getSingerList();
			this.singers = result.singers;
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