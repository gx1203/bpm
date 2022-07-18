<!--公用组件：评论
/**
* 评论组件
* @desc 显示评论组件
* @author yilongjiang
* @date 2019.06.12
* @param {String} [paginationObj]
    {
        isShow: true,//评论
        isShow1: false,//一级回复输入框显示隐藏
        isShow2: false,//二级回复输入框显示隐藏
        textarea: '',//评论内容
        cmmontslist: [
            {
                "total": "3",//评论总条数
                "text": "给你100百万、你愿意裸奔吗？",//标题
                "cmmonts": [
                    {
                        "text": "我是评论",//一级评论
                        "id": 44,//评论人ID
                        "author": "张三",//评论人
                        "date": "2019-08-18",//评论时间
                        "child": [
                            {
                                "text": "我是回复的评论,我是第一条回复",//二级评论
                                "pid": 1,//
                                "id": 55,//评论人ID
                                "author": "张三",//回复评论人
                                "replier": "李四",//评论人
                                "date": "2019-08-18"//评论时间
                            },
                            {
                                "text": "我是回复的第一条评论,我是第二条回复",//二级评论
                                "pid": 1,//
                                "id": 66,//评论人ID
                                "author": "李四",//回复评论人
                                "replier": "王五",//评论人
                                "date": "2019-08-18"//评论时间
                            }
                        ]
                    }
                ]
            },
        ],//评论数据
        personalinfo: {//组件传值
            value: 4,
            isShow: false
        }
    }
* @example 调用示例
    import ProtalComments from '@/bpa/components/ProtalComments'
    components: {
        ProtalComments
    },
页面展示： <ProtalComments />
-->