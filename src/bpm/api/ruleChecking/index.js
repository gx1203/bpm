import { fetch } from '@/bpm/utils'
export function previewBrs(data){
    return fetch({
        url:`/businessRuleManage/preview-brs/${data.processId}`,
        method: 'POST',
        data
    })
}
