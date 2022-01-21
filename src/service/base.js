import axios from "axios";

const ERR_OK = 0;
const baseURL = "/";

axios.defaults.baseURL = baseURL;

export function get(url, paramas) {
  return axios
    .get(url, {
      paramas,
    })
    .then((res) => {
      const serverData = res.data;
      if (serverData.code === ERR_OK) {
        return serverData.result;
      }
    })
    .catch((e) => {
      console.error(e);
    });
}
