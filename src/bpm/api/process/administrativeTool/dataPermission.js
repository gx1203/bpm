import { fetch } from "@/bpm/utils";
// 列表查询
export function query(data) {
  return fetch({
    url: `/data/authority/query`,
    method: "POST",
    data
  });
}

// 保存
export function save(data) {
  return fetch({
    url: `/data/authority/save`,
    method: "POST",
    data
  });
}

// 保存
export function saveDataAuthority(data) {
  return fetch({
    url: `/data/authority/save`,
    method: "POST",
    data
  });
}

// 获取信息
export function get(id) {
  return fetch({
    url: `/data/authority/get/${id}`,
    method: "GET"
  });
}

// 删除
export function deleteauthority(id) {
  return fetch({
    url: `/data/authority/delete/${id}`,
    method: "PUT"
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

//获取自定义报表 字段列表
export function getFieldListByReportId(reportId) {
  return fetch({
    url: `/report/getFieldListByReportId/${reportId}`,
    method: "GET"
  });
}
