import { fetch } from "@/bpm/utils";
// 列表查询
export function query(data) {
  return fetch({
    url: `/org-authorize/query`,
    method: "POST",
    data
  });
}

// 保存
export function save(data) {
  return fetch({
    url: `/org-authorize/save`,
    method: "POST",
    data
  });
}

// 获取信息
export function get(id) {
  return fetch({
    url: `/org-authorize/get/${id}`,
    method: "GET"
  });
}

// 删除
export function deleteauthority(id) {
  return fetch({
    url: `/org-authorize/delete/${id}`,
    method: "DELETE"
  });
}
