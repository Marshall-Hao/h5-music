import { computed, nextTick, ref, watch } from "vue";

export default function useFixed(props) {
  const TITLE_HEIGHT = 30;
  const groupRef = ref(null);
  const listHeights = ref([]);
  const scrollY = ref(0);
  const currentIndex = ref(0);
  const distance = ref(0);

  const fixedTitle = computed(() => {
    if (scrollY.value < 0) {
      return "";
    }
    const currentGroup = props.data[currentIndex.value];
    return currentGroup ? currentGroup.title : "";
  });

  const fixedStyle = computed(() => {
    const distanceVal = distance.value;
    const diff =
      distanceVal > 0 && distanceVal < TITLE_HEIGHT
        ? distanceVal - TITLE_HEIGHT
        : 0;
    return {
      transform: `translate3d(0, ${diff}px, 0 )`,
    };
  });
  watch(
    //  * getter
    () => props.data,
    async () => {
      // * waiting for the dom to change nextTick
      await nextTick;
      calculate();
    }
  );
  watch(scrollY, (newY) => {
    const listHeightVal = listHeights.value;
    for (let i = 0; i < listHeightVal.length - 1; i++) {
      const heightTop = listHeightVal[i];
      const heightBottom = listHeightVal[i + 1];
      if (newY >= heightTop && newY <= heightBottom) {
        currentIndex.value = i;
        // 下一层距离顶部的距离
        distance.value = heightBottom - newY;
      }
    }
  });
  function calculate() {
    const list = groupRef.value.children;
    const listHeightsVal = listHeights.value;
    let height = 0;

    listHeightsVal.length = 0;
    listHeightsVal.push(height);

    for (let i = 0; i < list.length; i++) {
      height += list[i].clientHeight;
      listHeightsVal.push(height);
    }
  }

  function onScroll(pos) {
    scrollY.value = -pos.y;
  }

  return { onScroll, groupRef, fixedTitle, fixedStyle };
}
