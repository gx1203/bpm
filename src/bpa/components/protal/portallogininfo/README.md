<!--公用组件：登录人卡片
/**
* 按钮组件
* @desc 个人信息展示，修改，保存
* @author zhangyuting
* @date 2019.06.12
* @param {String} [options]
    {
        disabled: 'true', // true 启用，false禁用
        showtext: true,    // 等级进度展示百分比
        customColors: [    // 等级颜色
            { color: '#f56c6c', percentage: 20 },
            { color: '#e6a23c', percentage: 40 },
            { color: '#6f7ad3', percentage: 100 }
        ],
        isneedhonor: true, // 是否有进入荣誉墙
    }
* @param {String} [logininfo]
    {
        "imageUrl": "http://portaldev.cq-p.com.cn:8080/portalimage/2019/8D62AE879FA91BA0E0535DC6A8C034C0.jpg",
        "name": "黄金龙", 
        "levelname": "黄金荣耀",     // 当前等级称谓
        "level": "Lv5",             // 当前level
        "levelscore":"48",          // 当前level最低分
        "levelscoretotal":"64",    // 当前level最高分
        "levelcolor": "blue"      // 等级称谓颜色
      }
* @example 调用示例
    <poral-logininfo
    :options = 'logininfoset'
    :logindata = 'logininfo'
    @tohonorwall = 'tohonorwall'
    />
*/
-->