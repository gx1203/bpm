import { fetch } from "@/bpm/utils";

// 获取人员变更列表
export function getAllocatedProcess (data) {
  return fetch({
    url: '/processModel/getAllocatedProcess',
    method: 'POST',
    data
  })
}



