<!--公用组件：轮播图
/**
* 按钮组件
* @desc 轮播图
* @author zhangyuting
* @date 2019.06.12
    https://github.com/surmon-china/vue-awesome-swiper
* @安装依赖  npm i vue-awesome-swiper   
* @param {String} [] // swiper 参数
    {
       swiperCSS: 'swiper-css',
          swiperActive: 'swiper-active',
          swiperOption: {
            slidesPerView: 3, // 一屏幕显示元素数量
            spaceBetween: 30, // 间隔
            // direction: 'vertical', // 垂直翻页
            // freeMode: true,  // 元素边缘不贴合
            slidesPerColumn: 1, // 多行并排展示
            pagination: {
              // 分页器
              el: '.swiper-pagination',
              clickable: true // 隐藏
            },
            scrollbar: {
              // 滚动条
              el: '.swiper-scrollbar',
              hide: false // 不隐藏
            },
            navigation: {
              // 左右切换按钮
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev'
            }
          }
    }
* @param {Array} [] // swiper 元素
    [
      {
        name: '元素一',
        id: '1'
      },
      {
        name: '元素二',
        id: '2'
      },
      {
        name: '元素三',
        id: '3'
      },
      {
        name: '元素四',
        id: '4'
      },
      {
        name: '元素五',
        id: '5'
      },
      {
        name: '元素一',
        id: '6'
      }
    ]


* @example 调用示例
    <poral-swiper 
    :options = 'swiper'
    :data = 'swiperEle'
    @choosesub="choosesub"  // 选中元素
    />
*/
-->