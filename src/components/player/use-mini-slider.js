import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  watch,
  nextTick,
  onUpdated,
  onBeforeUpdate,
} from "vue";
import { useStore } from "vuex";
import BScroll from "@better-scroll/core";
import Slide from "@better-scroll/slide";

BScroll.use(Slide);

export default function useMiniSlider() {
  const sliderWrapperRef = ref(null);
  const slider = ref(null);
  const store = useStore();
  const fullScreen = computed(() => {
    return store.state.fullScreen;
  });
  const playlist = computed(() => {
    return store.state.playlist;
  });
  const currentIndex = computed(() => {
    return store.state.currentIndex;
  });

  const sliderShow = computed(() => {
    //   * 双重否定去值，只取 true or false
    return !fullScreen.value && !!playlist.value;
  });

  onMounted(() => {
    let sliderVal;
    watch(sliderShow, async (newSliderShow) => {
      if (newSliderShow) {
        await nextTick();
        if (!sliderVal) {
          sliderVal = slider.value = new BScroll(sliderWrapperRef.value, {
            click: true,
            scrollX: true,
            scrollY: false,
            momentum: false,
            probeType: 2,
            slide: {
              autoplay: false,
              loop: true,
            },
          });
          //   * 删除一首歌，会造成index（pageX）的改变，所以会触发slidePageChange事件
          sliderVal.on("slidePageChanged", ({ pageX }) => {
            store.commit("setCurrentIndex", pageX);
          });
        } else {
          sliderVal.refresh();
        }
        sliderVal.goToPage(currentIndex.value, 0, 0);
      }
    });

    watch(currentIndex, (newIndex) => {
      if (sliderVal && sliderShow.value) {
        sliderVal.goToPage(newIndex, 0, 0);
      }
    });

    watch(playlist, async (newList) => {
      if (sliderVal && sliderShow.value && newList.length) {
        //   * dom变化在数据变化之后
        await nextTick();
        sliderVal.refresh();
      }
    });
  });

  onUnmounted(() => {
    //   * 有值才销毁
    if (slider.value && playlist.length) {
      sliderVal.value.destroy();
    }
  });

  return {
    slider,
    sliderWrapperRef,
  };
}
