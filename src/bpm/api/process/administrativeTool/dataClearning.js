import { fetch } from "@/bpm/utils";

// 全部清理接口
export function allClear(data) {
  return fetch({
    url: `/process/datacleanup/allCleanUp`,
    method: "POST",
    data
  });
}

// 批量清理接口
export function batchClear(data) {
  return fetch({
    url: `/process/datacleanup/batchCleanUp`,
    method: "POST",
    data
  });
}

//数据清理列表接口
export function queryDatacleanup(data) {
  return fetch({
    url: `/process/datacleanup/query`,
    method: "POST",
    data
  });
}

