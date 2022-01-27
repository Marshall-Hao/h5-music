import { ref } from "vue";

export default function useMiddleInteractive() {
  const currentShow = ref("cd");
  const middleLStyle = ref(null);
  const middleRStyle = ref(null);

  const touch = {};
  //   * 两个变量避免，ref在过程中发生变化
  let currentView = "cd";
  function onMiddleTouchStart(e) {
    touch.startX = e.touches[0].pageX;
    touch.startY = e.touches[0].pageY;
    touch.directionLocked = "";
  }

  function onMiddleTouchMove(e) {
    const deltaX = e.touches[0].pageX - touch.startX;
    const deltaY = e.touches[0].pageY - touch.startY;

    const absDelataX = Math.abs(deltaX);
    const absDelataY = Math.abs(deltaY);

    // * 方向锁
    if (!touch.directionLocked) {
      touch.directionLocked = absDelataX >= absDelataY ? "h" : "v";
    }

    if (touch.directionLocked === "v") {
      return;
    }

    const left = currentView === "cd" ? 0 : -window.innerWidth;
    // * 设定范围， 最小 -window.innerwidth ，最大 0
    const offsetWidth = Math.min(
      0,
      Math.max(left + deltaX, -window.innerWidth)
    );
    touch.percent = Math.abs(offsetWidth / window.innerWidth);

    if (currentView === "cd") {
      if (touch.percent > 0.2) {
        currentShow.value = "lyric";
      } else {
        currentShow.value = "cd";
      }
    } else {
      if (touch.percent < 0.8) {
        currentShow.value = "cd";
      } else {
        currentShow.value = "lyric";
      }
    }

    middleLStyle.value = {
      opacity: 1 - touch.percent,
      transitionDuration: "0ms",
    };

    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px,0,0)`,
      transitionDuration: "0ms",
    };
  }

  function onMiddleTouchEnd(e) {
    let offsetWidth;
    let opacity;
    if (currentShow.value === "cd") {
      currentView = "cd";
      offsetWidth = 0;
      opacity = 1;
    } else {
      currentView = "lyric";
      offsetWidth = -window.innerWidth;
      opacity = 0;
    }

    const duration = 300;
    middleLStyle.value = {
      opacity,
      transitionDuration: `${duration}ms`,
    };

    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px,0,0)`,
      transitionDuration: `${duration}ms`,
    };
  }

  return {
    currentShow,
    middleLStyle,
    middleRStyle,
    onMiddleTouchEnd,
    onMiddleTouchMove,
    onMiddleTouchStart,
  };
}
