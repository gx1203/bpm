<!--公用组件：上传附件 -->
/**
* 按钮组件
* @desc 多附件列表形式展示，可选择
* @author dengxp
* @date 2019.08.22
* @param {Array} [list]  default: [] 排行数据
* @param {Object} [mine-data]  default: {} 个人积分和排名
* @example 调用示例
    <ranking :list="ranking-list" mine-date='mineDate'/>
* @data example 
* ---------- list:[{ name: '张三', avatar: '', credits: 33 },
                  { name: '李四', avatar: '', credits: 20 },
                  { name: '王五', avatar: '', credits: 10 },
                  { name: '赵六', avatar: '', credits: 5 },
                  { name: '朱温', avatar: '', credits: 2 },
                  { name: '李存勖', avatar: '', credits: 0 }]
* ---------- mineDate: {
                  no: '0', 
                  credits: '99'
               }

      
