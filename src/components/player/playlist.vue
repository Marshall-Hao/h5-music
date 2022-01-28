<template>
    <!-- *https://v3.vuejs.org/guide/teleport.html#using-multiple-teleports-on-the-same-target -->
    <!-- 可以任意将组件插入到dom的某个位置，同时使用本组件的逻辑,尤其针对modal组件 -->
    <teleport to="body">
        <transition name="list-fade">
            <div class="playlist" v-show="visible && playlist.length" @click="hide">
                <div class="list-wrapper" @click.stop>
                    <div class="list-header">
                        <h1 class="title">
                            <i class="icon" :class="modeIcon" @click.stop="changeMode"></i>
                            <span class="text">{{ modeText }}</span>
                        </h1>
                    </div>
                    <!-- * scroll组件初始化的时候， 这个组件并没有渲染 ,计算不对-->
                    <scroll class="list-content" ref="scrollRef">
                        <ul ref="listRef">
                            <li
                                class="item"
                                v-for="song in sequenceList"
                                :key="song.id"
                                @click="selectItem(song)"
                            >
                                <i class="current" :class="getCurrentIcon(song)"></i>
                                <span class="text">{{ song.name }}</span>
                                <span class="favorite" @click.stop="toggleFavorite(song)">
                                    <i :class="getFavoriteIcon(song)"></i>
                                </span>
                            </li>
                        </ul>
                    </scroll>
                    <div class="list-footer" @click.stop="hide">
                        <span>关闭</span>
                    </div>
                </div>
            </div>
        </transition>
    </teleport>
</template>

<script>
import { computed, nextTick, ref, watch } from "vue"
import { useStore } from "vuex"
import Scroll from "../base/scroll/scroll.vue"
import useMode from "./use-mode"
import useFavorite from "./use-fav"

export default {
    name: 'playlist',
    components: {
        Scroll
    },
    setup() {
        // * reactive
        const visible = ref(false)
        const scrollRef = ref(null)
        const listRef = ref(null)
        // * store
        const store = useStore()
        const playlist = computed(() => store.state.playlist)
        const sequenceList = computed(() => store.state.sequenceList)
        const currentSong = computed(() => store.getters.currentSong)
        //  * hooks
        const { modeIcon, modeText, changeMode } = useMode()
        const { getFavoriteIcon, toggleFavorite } = useFavorite()
        // * watch
        watch(currentSong, async () => {
            if (!visible.value) {
                return;
            }
            // * 有可能改变数据， 所以dom的改变要等会
            await nextTick()
            scrollToCurrent()
        })
        // * functions
        function hide() {
            visible.value = false
        }

        async function show() {
            visible.value = true
            // ! 跟组件dom相关计算，等待一个nextTick
            await nextTick()
            refreshScroll()
            scrollToCurrent()
        }

        function getCurrentIcon(song) {
            if (song.id === currentSong.value.id) {
                return 'icon-play'
            }
        }

        function selectItem(song) {
            const index = playlist.value.findIndex((item) => {
                return song.id === item.id
            })

            store.commit('setCurrentIndex', index)
            store.commit('setPlayingState', true)
        }

        function refreshScroll() {
            scrollRef.value.scroll.refresh()
        }

        function scrollToCurrent() {
            const index = sequenceList.value.findIndex((song) => {
                return currentSong.value.id === song.id
            })
            const target = listRef.value.children[index]

            scrollRef.value.scroll.scrollToElement(target, 300)
        }

        return {
            visible,
            playlist,
            sequenceList,
            scrollRef,
            listRef,
            hide,
            show,
            getCurrentIcon,
            selectItem,
            // * mode
            modeIcon,
            modeText,
            changeMode,
            // * favorite
            getFavoriteIcon,
            toggleFavorite
        }
    }
}
</script>

<style lang="scss" scoped>
.playlist {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 200;
    background-color: $color-background-d;
    &.list-fade-enter-active,
    &.list-fade-leave-active {
        transition: opacity 0.3s;
        .list-wrapper {
            transition: all 0.3s;
        }
    }
    &.list-fade-enter-from,
    &.list-fade-leave-to {
        opacity: 0;
        .list-wrapper {
            transform: translate3d(0, 100%, 0);
        }
    }
    .list-wrapper {
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 210;
        width: 100%;
        background-color: $color-highlight-background;
        .list-header {
            position: relative;
            padding: 20px 30px 10px 20px;
            .title {
                display: flex;
                align-items: center;
                .icon {
                    margin-right: 10px;
                    font-size: 24px;
                    color: $color-theme-d;
                }
                .text {
                    flex: 1;
                    font-size: $font-size-medium;
                    color: $color-text-l;
                }
                .clear {
                    @include extend-click();
                    .icon-clear {
                        font-size: $font-size-medium;
                        color: $color-text-d;
                    }
                }
            }
        }
        .list-content {
            max-height: 240px;
            overflow: hidden;
            .item {
                display: flex;
                align-items: center;
                height: 40px;
                padding: 0 30px 0 20px;
                overflow: hidden;
                .current {
                    flex: 0 0 20px;
                    width: 20px;
                    font-size: $font-size-small;
                    color: $color-theme-d;
                }
                .text {
                    flex: 1;
                    @include no-wrap();
                    font-size: $font-size-medium;
                    color: $color-text-d;
                }
                .favorite {
                    @include extend-click();
                    margin-right: 15px;
                    font-size: $font-size-small;
                    color: $color-theme;
                    .icon-favorite {
                        color: $color-sub-theme;
                    }
                }
                .delete {
                    @include extend-click();
                    font-size: $font-size-small;
                    color: $color-theme;
                    &.disable {
                        color: $color-theme-d;
                    }
                }
            }
        }
        .list-add {
            width: 140px;
            margin: 20px auto 30px auto;
            .add {
                display: flex;
                align-items: center;
                padding: 8px 16px;
                border: 1px solid $color-text-l;
                border-radius: 100px;
                color: $color-text-l;
                .icon-add {
                    margin-right: 5px;
                    font-size: $font-size-small-s;
                }
                .text {
                    font-size: $font-size-small;
                }
            }
        }
        .list-footer {
            text-align: center;
            line-height: 50px;
            background: $color-background;
            font-size: $font-size-medium-x;
            color: $color-text-l;
        }
    }
}
</style>
