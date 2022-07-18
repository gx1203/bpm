import { fetch } from "@/bpm/utils";
// 列表查询
export function query(data,id) {
  return fetch({
    url: `/postProcess/getprocessByPostid/${id}`,
    method: "POST",
    data
  });
}

//获取菜单方法
export function getMenuMethod(data) {
  return fetch({
    url: `/data/authority/getMenuMethod`,
    method: "PUT",
    data
  });
}
