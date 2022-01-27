import { ref } from "vue";
import animations from "create-keyframe-animation";
export default function useAnimation() {
  const cdWrapperRef = ref(null);
  // * 标志位
  let entering = false;
  let leaving = false;

  function enter(el, done) {
    if (leaving) {
      // * 手动停止leave 动画， 防止 dom的css混乱
      afterleave();
    }
    entering = true;
    const { x, y, scale } = getPosAndScale();
    // * animation 可以改变初时状态
    const animation = {
      0: {
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
      },
      100: {
        transform: "translate3d(0,0,0) scale(1)",
      },
    };

    animations.registerAnimation({
      name: "move",
      animation,
      presets: {
        duration: 600,
        easing: "cubic-bezier(0.45, 0, 0.55, 1)",
      },
    });

    // * 执行done 才能作下面的动画
    // * https://github.com/HenrikJoreteg/create-keyframe-animation
    animations.runAnimation(cdWrapperRef.value, "move", done);
  }

  function afterenter() {
    entering = false;
    animations.unregisterAnimation("move");
    cdWrapperRef.value.animation = "";
  }

  function leave(el, done) {
    if (entering) {
      // * 手动停止动画
      afterenter();
    }
    leaving = true;
    const { x, y, scale } = getPosAndScale();
    const cdWrapperEl = cdWrapperRef.value;

    cdWrapperEl.style.transition = "all .6s cubic-bezier(0.45, 0, 0.55, 1)";
    cdWrapperEl.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;

    //  * 当transition结束的时候，就到afterleave hook
    cdWrapperEl.addEventListener("transitionend", next);

    function next() {
      cdWrapperEl.removeEventListener("transitionend", next);
      done();
    }
  }

  function afterleave() {
    leaving = false;
    const cdWrapperEl = cdWrapperRef.value;

    cdWrapperEl.style.transition = "";
    cdWrapperEl.style.transform = "";
  }

  function getPosAndScale() {
    const targetWidth = 40;
    const paddingLeft = 40;
    const paddingBottom = 30;
    const paddingTop = 80;
    const width = window.innerWidth * 0.8;
    const x = -(window.innerWidth / 2 - paddingLeft);
    const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
    const scale = targetWidth / width;

    return {
      x,
      y,
      scale,
    };
  }

  return {
    cdWrapperRef,
    enter,
    afterenter,
    leave,
    afterleave,
  };
}
