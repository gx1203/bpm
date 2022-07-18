<template>
  <div>
    <el-row :span="24">
      <el-col v-for="(item, index) in routerList" :span="12" :key="index">
        <div class="route-item">
          <router-link :to="{name: item.pathName}">
            <img :src="item.imgurl || imgUrl" alt="图片">
            <span>{{ item.name }}</span>
          </router-link>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import imgUrl from '@/bpa/assets/img/no_1.png'
export default {
  name: 'KnowLedgeRouter',
  props: {
    routerList: {
      type: Array,
      default() {
        return [
          {
            imgUrl: '', // 图片展示
            pathName: '', // 路由的name属性值
            name: '' // 路径的展示名称
          }
        ]
      }
    }
  },
  data() {
    return {
      imgUrl: imgUrl
    }
  }
}
</script>

<style lang="scss" scoped>
  .route-item{
    padding: 10px;
    a{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    img{
        width: 50px;
        height: 50px;
    }
  }
</style>
