<template>
  <div id="app" class="custom-4ba2ef bpa">
    <div class="product-intro" v-if="carouselShow">
      <!-- <el-button type="text" icon="el-icon-circle-close" @click="closeCarousel"></el-button>
      <el-image
        style="width: 100%;"
        :src="carouselimg"
        :preview-src-list="imgList">
      </el-image> -->

      <!--      <el-carousel height="400px">-->
      <!--        <el-carousel-item v-for="item in imgList" :key="item">-->
      <!--          <el-image-->
      <!--            style="height: 100%; display: inline-block;"-->
      <!--            :src="item"-->
      <!--            :preview-src-list="imgList">-->
      <!--          </el-image>-->
      <!--        </el-carousel-item>-->
      <!--      </el-carousel>-->
    </div>
    <router-view />
  </div>
</template>

<script>
import './assets/styles/theme/4ba2ef/theme.css'
import './assets/styles/theme/0f0/theme.css'
import './assets/styles/theme/00f/theme.css'
import carouselimg from '@/assets/img/carousel/carousel.jpg'
import img5 from '@/assets/img/carousel/carousel5.jpg'
import img6 from '@/assets/img/carousel/carousel6.jpg'
import img7 from '@/assets/img/carousel/carousel7.jpg'
import img8 from '@/assets/img/carousel/carousel8.jpg'
import img9 from '@/assets/img/carousel/carousel9.jpg'
import img10 from '@/assets/img/carousel/carousel10.jpg'
import img11 from '@/assets/img/carousel/carousel11.jpg'
import img12 from '@/assets/img/carousel/carousel12.jpg'
import img13 from '@/assets/img/carousel/carousel13.jpg'
import img14 from '@/assets/img/carousel/carousel14.jpg'
import img15 from '@/assets/img/carousel/carousel15.jpg'
import img16 from '@/assets/img/carousel/carousel16.jpg'
import img17 from '@/assets/img/carousel/carousel17.jpg'
import img18 from '@/assets/img/carousel/carousel18.jpg'
import img19 from '@/assets/img/carousel/carousel19.jpg'
// import img20 from '@/assets/img/carousel/carousel20.jpg'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapMutations } = createNamespacedHelpers('app')
export default {
  name: 'App',
  data () {
    return {
      carouselimg: carouselimg,
      imgList: [img5, img6, img7, img8, img9, img10, img11, img12, img13,img14,img15, img16, img17, img18, img19]
    }
  },
  computed: {
    ...mapGetters(['carouselShow'])
  },
  methods: {
    ...mapMutations(['setCarouselShow']),
    closeCarousel () {
      this.setCarouselShow(false)
    }
  }
}
</script>

<style lang="scss" scoped>
.product-intro {
  position: relative;
  .el-button {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 100;
    color: #000000;
    font-size: 20px;
  }
}
.el-carousel__item {
  text-align: center;
}
.el-carousel {
  /deep/ .el-carousel__indicators {
    .el-carousel__button {
      background-color: #aaa;
    }
  }
}
/deep/.el-button:hover, .el-button:focus{
      background-color: #2d42af !important;
      color: #fff !important;
  }
/deep/.el-input-group__append>.el-button:hover, .el-button:focus{
      background-color:rgba(255,255,255,0.1) !important;
  }
</style>
<style lang="scss">
@import "~@/bpa/assets/styles/index.scss";
</style>
