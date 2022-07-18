import { fetch } from "@/bpm/utils";

export function sendMessage(data) {
  return fetch({
    url: "/bpm/message/sendMessage",
    method: "POST",
    data
  });
}

// 查询会话列表
export function queryTalk(data) {
  return fetch({
    url: "/bpm/talk/queryTalk",
    method: "POST",
    data
  });
}

// 保存会话
export function saveTalk(data) {
  return fetch({
    url: "/bpm/talk/saveTalk",
    method: "POST",
    data
  });
}

// 删除会话
export function deleteTalk(id) {
  return fetch({
    url: `/bpm/talk/deleteTalk/${id}`,
    method: "DELETE"
  });
}

// 清除会话数据
export function clearTalk(id) {
  return fetch({
    url: `/bpm/talk/clearTalk/${id}`,
    method: "DELETE"
  });
}

// 获取会话消息
export function getTalkMessage(data) {
  return fetch({
    url: `/bpm/talk/getTalkMessage`,
    method: "POST",
    data
  });
}
