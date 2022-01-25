import { computed, ref, watch } from "vue";
import { useStore } from "vuex";

export default function useCD() {
  const cdRef = ref(null);
  const cdImageRef = ref(null);

  const store = useStore();
  const playing = computed(() => store.state.playing);

  const cdCls = computed(() => {
    return playing.value ? "playing" : "";
  });

  watch(playing, (newPlaying) => {
    if (!newPlaying) {
      syncTransform(cdRef.value, cdImageRef.value);
    }
  });

  function syncTransform(wrapper, inner) {
    const wrapperTransform = getComputedStyle(wrapper).transform;
    const innerTransform = getComputedStyle(inner).transform;
    // * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/concat
    wrapper.style.transform =
      wrapperTransform === "none"
        ? innerTransform
        : innerTransform.concat("", wrapperTransform);
  }

  return { cdCls, cdRef, cdImageRef };
}
