import {
  h,
  mergeProps,
  withCtx,
  renderSlot,
  ref,
  computed,
  watch,
  nextTick,
} from "vue";
import Scroll from "@/components/base/scroll/scroll";
import { useStore } from "vuex";

export default {
  name: "wrap-scroll",
  props: Scroll.props,
  emits: Scroll.emits,
  render(ctx) {
    return h(
      Scroll,
      mergeProps(
        {
          ref: "scrollRef",
        },
        ctx.$props,
        {
          onScroll: (e) => {
            ctx.$emit("scroll", e);
          },
        }
      ),
      {
        default: withCtx(() => {
          return [renderSlot(ctx.$slots, "default")];
        }),
      }
    );
  },
  setup() {
    const scrollRef = ref(null);
    const scroll = computed(() => {
      return scrollRef.value.scroll;
    });

    const store = useStore();
    const playlist = computed(() => store.state.playlist);

    watch(playlist, async () => {
      await nextTick();
      //   *
      scroll.value.refresh();
    });
    return {
      scrollRef,
      //  * 因为其他组件使用scroll组件的时候，使用到了scrollRef.value.scroll -》 betterscroll的实列， 所以需要return
      //   * setup 内部的属性和方法，必须 return 暴露出来，将属性挂载到实例上，否则没有办法使用，上述代码添加 return：
      // * https://juejin.cn/post/7032072166459834382
      scroll,
    };
  },
};
