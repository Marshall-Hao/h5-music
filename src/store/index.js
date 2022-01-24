import { createLogger, createStore } from "vuex";
import state from "./state";
import mutations from "./mutations";
import * as getters from "./getters";
import * as actions from "./actions";

//  * 检测是否为开发环境
const debug = process.env.NODE_ENV !== "production";

export default createStore({
  state,
  getters,
  mutations,
  actions,
  strict: debug,
  plugins: debug ? [createLogger()] : [],
});
