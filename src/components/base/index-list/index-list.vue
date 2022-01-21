<template>
	<scroll class="index-list" :probe-type="3" @scroll="onScroll" ref="scrollRef">
		<ul ref="groupRef">
			<li v-for="group in data" :key="group.title" class="group">
				<h2 class="title">{{ group.title }}</h2>
				<ul>
					<li v-for="item in group.list" :key="item.id" class="item">
						<img class="avatar" v-lazy="item.pic" />
						<span class="name">{{ item.name }}</span>
					</li>
				</ul>
			</li>
		</ul>
		<div class="fixed">
			<div class="fixed-title" v-show="fixedTitle" :style="fixedStyle">
				{{ fixedTitle }}
			</div>
		</div>
		<div
			class="shortcut"
			@touchstart.stop.prevent="onShortCutTouchStart"
			@touchmove.stop.prevent="onShortCutTouchMove"
			@touchend.stop.prevent
		>
			<ul>
				<!-- ! shortcut for currentIndex === index? current:'' -->
				<li
					v-for="(item, index) in shortcutList"
					:key="item"
					:data-index="index"
					class="item"
					:class="{ current: currentIndex === index }"
				>
					{{ item }}
				</li>
			</ul>
		</div>
	</scroll>
</template>

<script>
	import Scroll from "../scroll/scroll";
	import useFixed from "./use-fixed";
	import useShortcut from "./use-shortcut";
	export default {
		name: "index-list",
		components: { Scroll },
		props: {
			data: {
				type: Array,
				default() {
					return [];
				},
			},
		},
		setup(props) {
			const { onScroll, groupRef, fixedTitle, fixedStyle, currentIndex } =
				useFixed(props);
			const {
				shortcutList,
				onShortCutTouchStart,
				scrollRef,
				onShortCutTouchMove,
			} = useShortcut(props, groupRef);
			return {
				// * fixed
				groupRef,
				onScroll,
				fixedTitle,
				fixedStyle,
				currentIndex,
				// * shortcut
				shortcutList,
				onShortCutTouchStart,
				scrollRef,
				onShortCutTouchMove,
			};
		},
	};
</script>

<style lang="scss" scoped>
	.index-list {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
		background: $color-background;
		.group {
			padding-bottom: 30px;
			.title {
				height: 30px;
				line-height: 30px;
				padding-left: 20px;
				font-size: $font-size-small;
				color: $color-text-l;
				background: $color-highlight-background;
			}
			.item {
				display: flex;
				align-items: center;
				padding: 20px 0 0 30px;
				.avatar {
					width: 50px;
					height: 50px;
					border-radius: 50%;
				}
				.name {
					margin-left: 20px;
					color: $color-text-l;
					font-size: $font-size-medium;
				}
			}
		}
		.fixed {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			.fixed-title {
				height: 30px;
				line-height: 30px;
				padding-left: 20px;
				font-size: $font-size-small;
				color: $color-text-l;
				background: $color-highlight-background;
			}
		}
		.shortcut {
			position: absolute;
			right: 4px;
			top: 50%;
			transform: translateY(-50%);
			width: 20px;
			padding: 20px 0;
			border-radius: 10px;
			text-align: center;
			background: $color-background-d;
			font-family: Helvetica;
			.item {
				padding: 3px;
				line-height: 1;
				color: $color-text-l;
				font-size: $font-size-small;
				// * https://stackoverflow.com/questions/9988558/what-does-in-sub-title-indicates-in-scss
				&.current {
					color: $color-theme;
				}
			}
		}
	}
</style>
