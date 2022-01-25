export function shuffle(source) {
  // * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
  const arr = [...source];
  for (let i = 0; i < arr.length; i++) {
    const j = getRandomInt(i);
    swap(arr, i, j);
  }
  return arr;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * (max + 1));
}

function swap(arr, i, j) {
  const t = arr[i];
  arr[i] = arr[j];
  arr[j] = t;
}

export function formatTime(interval) {
  // * 向下取整
  interval = interval | 0;
  //  * ttps://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
  const minute = (((interval / 60) | 0) + "").padStart(2, "0");
  const second = ((interval % 60 | 0) + "").padStart(2, "0");
  return `${minute}:${second}`;
}
