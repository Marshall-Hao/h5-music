import { computed, ref } from "vue";

export default function useShortcut(props, groupRef) {
  const ANCHOR_HEIGHT = 18;
  const scrollRef = ref(null);
  const touch = {};

  const shortcutList = computed(() => {
    return props.data.map((group) => {
      return group.title;
    });
  });

  function onShortCutTouchStart(e) {
    const anchorIndex = parseInt(e.target.dataset.index);
    touch.y1 = e.touches[0].pageY;
    touch.anchorIndex = anchorIndex;
    scrollTo(anchorIndex);
  }
  function onShortCutTouchMove(e) {
    touch.y2 = e.touches[0].pageY;
    //  * Math.floor
    const delta = ((touch.y2 - touch.y1) / ANCHOR_HEIGHT) | 0;
    const anchorIndex = touch.anchorIndex + delta;
    scrollTo(anchorIndex);
  }

  function scrollTo(index) {
    //   * build-in method, isNaN
    if (isNaN(index)) {
      return;
    }
    index = Math.max(0, Math.min(shortcutList.value.length - 1, index));
    const targetEl = groupRef.value.children[index];
    // * 挂载了scroll在scroll组件实例上
    const scroll = scrollRef.value.scroll;
    scroll.scrollToElement(targetEl);
  }
  return { shortcutList, onShortCutTouchStart, scrollRef, onShortCutTouchMove };
}
