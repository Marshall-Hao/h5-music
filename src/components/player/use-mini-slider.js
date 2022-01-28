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

          sliderVal.on("slidePageChanged", ({ pageX }) => {
            store.commit("setCurrentIndex", pageX);
            store.commit("setPlayingState", true);
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
  });

  onUnmounted(() => {
    //   * 有值才销毁
    if (slider.value) {
      sliderVal.value.destroy();
    }
  });

  return {
    slider,
    sliderWrapperRef,
  };
}