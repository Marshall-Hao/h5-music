<template>
    <div class="player">
        <!--  * v-show 会渲染好 v-show 和 v-if的区别 -->
        <div class="normal-player" v-show="fullScreen">
            <!-- * v-if 没有达到条件不渲染 -->
            <!-- * 因为palyer是全局组件，一开始vuex并没有playlist -->
            <template v-if="currentSong">
                <div class="background">
                    <img :src="currentSong.pic" />
                </div>
                <div class="top">
                    <div class="back" @click="goBack">
                        <i class="icon-back"></i>
                    </div>
                    <h1 class="title">{{ currentSong.name }}</h1>
                    <h2 class="subtitle">{{ currentSong.singer }}</h2>
                </div>
                <div class="bottom">
                    <div class="progress-wrapper">
                        <span class="time time-l">{{ formatTime(currentTime) }}</span>
                        <div class="progress-bar-wrapper">
                            <progress-bar
                                :progress="progress"
                                @progress-changing="onProgressChanging"
                                @progress-changed="onProgressChanged"
                            ></progress-bar>
                        </div>
                        <span class="time time-r">{{ formatTime(currentSong.duration) }}</span>
                    </div>
                    <div class="operators">
                        <div class="icon i-left">
                            <i :class="modeIcon" @click="changeMode"></i>
                        </div>
                        <div class="icon i-left" :class="disableCls">
                            <i class="icon-prev" @click="prev"></i>
                        </div>
                        <div class="icon i-center" :class="disableCls">
                            <i :class="playIcon" @click="togglePlay"></i>
                        </div>
                        <div class="icon i-right" :class="disableCls">
                            <i class="icon-next" @click="next"></i>
                        </div>
                        <div class="icon i-right">
                            <i
                                :class="getFavoriteIcon(currentSong)"
                                @click="toggleFavorite(currentSong)"
                            ></i>
                        </div>
                    </div>
                </div>
            </template>
        </div>
        <!-- * 自带pause事件 , canplay事件-->
        <audio
            ref="audioRef"
            @pause="pause"
            @canplay="ready"
            @error="error"
            @timeupdate="updateTime"
            @ended="end"
        ></audio>
    </div>
</template>

<script>
import { computed } from "@vue/reactivity";
import { useStore } from "vuex";
import { watch } from "@vue/runtime-core";
import { ref } from "vue";
import useMode from './use-mode'
import useFavorite from "./use-fav";
//  * 通过setup可以直接return到模版中，不需要mehtods在定义
import { formatTime } from "../../assets/js/util";
import progressBar from "./progress-bar";
import { PLAY_MODE } from "../../assets/js/constant";
export default {
    name: "player",
    components: {
        progressBar
    },
    setup() {
        //  * data
        const audioRef = ref(null);
        const songReady = ref(false);
        const currentTime = ref(0);
        let progressChaning = false
        // * vuex
        const store = useStore();

        const fullScreen = computed(() => {
            return store.state.fullScreen;
        });
        const currentIndex = computed(() => store.state.currentIndex)
        //  * getters是计算属性，响应式
        const currentSong = computed(() => store.getters.currentSong);
        const playlist = computed(() => store.state.playlist)
        const playing = computed(() => store.state.playing)
        const playMode = computed(() => store.state.playMode)
        //  * hooks
        const { modeIcon, changeMode } = useMode()
        const { getFavoriteIcon, toggleFavorite } = useFavorite()
        // * computed
        const playIcon = computed(() => {
            return playing.value ? 'icon-pause' : 'icon-play'
        })
        const disableCls = computed(() => {
            return songReady.value ? '' : 'disable'
        })
        const progress = computed(() => {
            return currentTime.value / currentSong.value.duration
        })
        // * watch 更侧重业务员逻辑
        watch(currentSong, (newSong) => {
            if (!newSong.id || !newSong.url) {
                return;
            }
            songReady.value = false
            // * 歌曲切换为0
            currentTime.value = 0
            const audioEl = audioRef.value;
            audioEl.src = newSong.url;
            audioEl.play();
        });

        watch(playing, (newPlaying) => {
            if (!songReady.value) {
                return
            }
            const audioEl = audioRef.value;
            newPlaying ? audioEl.play() : audioEl.pause()
        })

        //  * method
        function goBack() {
            store.commit("setFullScreen", false);
        }

        function togglePlay() {
            if (!songReady.value) {
                return
            }
            store.commit('setPlayingState', !playing.value)
        }

        function pause() {
            store.commit('setPlayingState', false)
        }

        function prev() {
            let index = currentIndex.value - 1
            let list = playlist.value
            if (!songReady.value || !list.length) {
                return
            }
            // * 边界情况 think about the edge
            if (list.length === 1) {
                loop()
            } else {
                if (index === -1) {
                    index = list.length - 1
                }
                store.commit('setCurrentIndex', index)
                if (!playing.value) {
                    store.commit('setPlayingState', true)

                }
            }
        }

        function next() {
            let index = currentIndex.value + 1
            let list = playlist.value
            if (!songReady.value || !list.length) {
                return
            }
            if (list.length === 1) {
                loop()
            } else {
                if (index === list.length) {
                    index = 0
                }
                store.commit('setCurrentIndex', index)
                if (!playing.value) {
                    store.commit('setPlayingState', true)

                }
            }
        }

        function loop() {
            const audioEl = audioRef.value;
            audioEl.currentTime = 0
            audioEl.play()
            store.commit('setPlayingState', true)
        }

        //  * 错误保护
        function ready() {
            if (songReady.value) {
                return
            }
            songReady.value = true
        }

        function error() {
            songReady.value = true
        }

        function updateTime(e) {
            //  * 降低播放器本身的currentTime修改优先级
            if (!progressChaning) {
                currentTime.value = e.target.currentTime
            }
        }

        function onProgressChanging(progress) {
            console.log(progress)
            progressChaning = true
            currentTime.value = currentSong.value.duration * progress
        }

        function onProgressChanged(progress) {
            console.log(progress)
            audioRef.value.currentTime = currentTime.value = currentSong.value.duration * progress
            if (!playing.value) {
                store.commit('setPlayingState', true)
            }
        }

        function end() {
            currentTime.value = 0
            if (playMode.value === PLAY_MODE.loop) {
                loop()
            } else {
                next()
            }
        }
        // * 模版中的变量 一定要在setup函数中return出去，这样才能在模版中渲染出来。
        return {
            fullScreen,
            currentSong,
            audioRef,
            currentTime,
            goBack,
            playIcon,
            togglePlay,
            progress,
            pause,
            prev,
            next,
            ready,
            disableCls,
            error,
            updateTime,
            // * modeIcon
            modeIcon,
            changeMode,
            //  * fav
            getFavoriteIcon,
            toggleFavorite,
            formatTime,
            onProgressChanging,
            onProgressChanged,
            end
        };
    },
};
</script>

<style lang="scss" scoped>
.player {
    .normal-player {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 150;
        background: $color-background;
        .background {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            opacity: 0.6;
            filter: blur(20px);

            img {
                width: 100%;
                height: 100%;
            }
        }
        .top {
            position: relative;
            margin-bottom: 25px;
            .back {
                position: absolute;
                top: 0;
                left: 6px;
                z-index: 50;
            }
            .icon-back {
                display: block;
                padding: 9px;
                font-size: $font-size-large-x;
                color: $color-theme;
                transform: rotate(-90deg);
            }
            .title {
                width: 70%;
                margin: 0 auto;
                line-height: 40px;
                text-align: center;
                @include no-wrap();
                font-size: $font-size-large;
                color: $color-text;
            }
            .subtitle {
                line-height: 20px;
                text-align: center;
                font-size: $font-size-medium;
                color: $color-text;
            }
        }
        .middle {
            position: fixed;
            width: 100%;
            top: 80px;
            bottom: 170px;
            white-space: nowrap;
            font-size: 0;
            .middle-l {
                display: inline-block;
                vertical-align: top;
                position: relative;
                width: 100%;
                height: 0;
                padding-top: 80%;
                .cd-wrapper {
                    position: absolute;
                    left: 10%;
                    top: 0;
                    width: 80%;
                    box-sizing: border-box;
                    height: 100%;
                    .cd {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        img {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            height: 100%;
                            box-sizing: border-box;
                            border-radius: 50%;
                            border: 10px solid rgba(255, 255, 255, 0.1);
                        }
                        .playing {
                            animation: rotate 20s linear infinite;
                        }
                    }
                }
                .playing-lyric-wrapper {
                    width: 80%;
                    margin: 30px auto 0 auto;
                    overflow: hidden;
                    text-align: center;
                    .playing-lyric {
                        height: 20px;
                        line-height: 20px;
                        font-size: $font-size-medium;
                        color: $color-text-l;
                    }
                }
            }
            .middle-r {
                display: inline-block;
                vertical-align: top;
                width: 100%;
                height: 100%;
                overflow: hidden;
                .lyric-wrapper {
                    width: 80%;
                    margin: 0 auto;
                    overflow: hidden;
                    text-align: center;
                    .text {
                        line-height: 32px;
                        color: $color-text-l;
                        font-size: $font-size-medium;
                        &.current {
                            color: $color-text;
                        }
                    }
                    .pure-music {
                        padding-top: 50%;
                        line-height: 32px;
                        color: $color-text-l;
                        font-size: $font-size-medium;
                    }
                }
            }
        }
        .bottom {
            position: absolute;
            bottom: 50px;
            width: 100%;
            .dot-wrapper {
                text-align: center;
                font-size: 0;
                .dot {
                    display: inline-block;
                    vertical-align: middle;
                    margin: 0 4px;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: $color-text-l;
                    &.active {
                        width: 20px;
                        border-radius: 5px;
                        background: $color-text-ll;
                    }
                }
            }
            .progress-wrapper {
                display: flex;
                align-items: center;
                width: 80%;
                margin: 0px auto;
                padding: 10px 0;
                .time {
                    color: $color-text;
                    font-size: $font-size-small;
                    flex: 0 0 40px;
                    line-height: 30px;
                    width: 40px;
                    &.time-l {
                        text-align: left;
                    }
                    &.time-r {
                        text-align: right;
                    }
                }
                .progress-bar-wrapper {
                    flex: 1;
                }
            }
            .operators {
                display: flex;
                align-items: center;
                .icon {
                    flex: 1;
                    color: $color-theme;
                    &.disable {
                        color: $color-theme-d;
                    }
                    i {
                        font-size: 30px;
                    }
                }
                .i-left {
                    text-align: right;
                }
                .i-center {
                    padding: 0 20px;
                    text-align: center;
                    i {
                        font-size: 40px;
                    }
                }
                .i-right {
                    text-align: left;
                }
                .icon-favorite {
                    color: $color-sub-theme;
                }
            }
        }
        &.normal-enter-active,
        &.normal-leave-active {
            transition: all 0.6s;
            .top,
            .bottom {
                transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
            }
        }
        &.normal-enter-from,
        &.normal-leave-to {
            opacity: 0;
            .top {
                transform: translate3d(0, -100px, 0);
            }
            .bottom {
                transform: translate3d(0, 100px, 0);
            }
        }
    }
}
</style>
