import storage from "good-storage";

function insertArray(arr, val, compare, maxLen) {
  //  * 不能用indexOf 因为 对象的值可能一样但 引用不一样
  const index = arr.findIndex(compare);
  if (index > -1) {
    return;
  }
  arr.unshift(val);
  if (maxLen && arr.length > maxLen) {
    arr.pop();
  }
}

function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare);
  console.log(index);
  if (index <= -1) {
    return;
  }
  //  * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
  console.log(arr);
  arr.splice(index, 1);
}

export function save(item, key, compare, maxLen) {
  const items = storage.get(key, []);
  insertArray(items, item, compare, maxLen);
  //  * 给storage重新赋值
  storage.set(key, items);
  return items;
}

export function remove(key, compare) {
  const items = storage.get(key, []);
  console.log("remove again");
  deleteFromArray(items, compare);
  storage.set(key, items);
  return items;
}

export function load(key) {
  return storage.get(key, []);
}
