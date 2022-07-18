<!--公用组件：个人信息卡片
/**
* 按钮组件
* @desc 个人信息展示，修改，保存
* @author zhangyuting
* @date 2019.06.12
* @param {String} [options]
    {
        disabled: true, // true 启用，false禁用
        size: 'mini', // medium / small / mini 说的是整体的放大缩小比例
        showClose: false, // 是否显示关闭按钮,false 不显示，true 显示
        dateformet: 'yyyy-MM-dd', // 日期格式
        title: '个人设置', // 标题名称
        top: '2vh' // 弹框距离顶端距离
    }
* @param {String} [personaldata]
    {
        list: [
            {
              type: 'text', // input类型 文本
              name: '姓名', // input label
              value: '黄金龙', // input value
              isrequired: true, // true 必填 ，false 非必填
              isedit: true // true 不可编辑，false 可编辑
            },
            {
              type: 'date', // input类型 日期
              name: '生日', // input label
              value: '2019-02-02', // input value
              isrequired: true, // true 必填 ，false 非必填
              isedit: true // true 不可编辑，false 可编辑
            },
            {
              type: 'select', // input类型 下拉框
              name: '状态',
              value: '在岗',
              isrequired: true,
              isedit: true,
              option: [
                // 下拉数据内容
                { label: '出差', value: '出差' },
                { label: '在岗', value: '在岗' },
                { label: '会议', value: '会议' },
                { label: '休假', value: '休假' },
                { label: '回家', value: '回家' }
              ]
            },
            {
              type: 'textarea', // input类型 文本域
              name: '状态描述',
              value: '呼啦啦啦啦啊呀呀呀呀',
              style: "width:100%", // 表单样式
              rows: "5", // 文本域行数
              isrequired: true,
              isedit: false
            },
            {
              type: 'password', // input类型 密码
              name: '邮箱密码', 
              value: '123456',
              isrequired: true,
              isedit: false
            }
          ],
          imgurl: '' // 头像url
    }
* @example 调用示例
    <portal-personalset 
    :options = 'personaloption'
    :personaldata = 'personalinfo'
    @changepersonalinfo="changepersonalinfo" // 修改基本信息
    @savepasschange="savepasschange"         // 修改密码
    @customizingpage="customizingpage"       // 修改主题
    />
*/
-->