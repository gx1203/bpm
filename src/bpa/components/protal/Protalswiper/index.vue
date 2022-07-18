<template>
  <div class>
    <swiper :options="options.swiperOption">
      <swiper-slide v-for="(item,index) in data" :key="index">
        <div
          :class="isItem === item.name? options.swiperActive:options.swiperCSS"
          @click="choosesub(item)"
        >{{ item.name }}</div>
      </swiper-slide>
      <!-- 左右翻页按钮 -->
      <div slot="button-prev" class="swiper-button-prev" />
      <div slot="button-next" class="swiper-button-next" />
      <!-- 分页器 -->
      <!-- <div slot="pagination" class="swiper-pagination" /> -->
      <!-- 滚动条 -->
      <!-- <div slot="scrollbar" class="swiper-scrollbar" /> -->
    </swiper>
  </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
// require styles
import 'swiper/dist/css/swiper.css'

export default {
  name: 'Portalimgupload',
  components: {
    swiper,
    swiperSlide
  },
  props: {
    options: {
      type: Object,
      default: () => {
        return {
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
      }
    },
    data: {
      type: Array,
      default: () => {
        return [
          // swiper 元素
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
      }
    }
  },
  data() {
    return {
      isItem: ''
    }
  },
  watch: {},
  created() {},
  mounted() {},
  updated() {},
  methods: {
    // 元素选中事件
    choosesub(item) {
      this.isItem = item.name
      this.$emit('choosetype', item)
    }
  }
}
</script>

<style scoped>
</style>
