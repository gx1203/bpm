<template>
  <div class="ranking">
    <div class="ranking_title">积分排行榜</div>
    <div class="ranking_mine">您当前知识积分第{{ mineData.no }}名，积分为{{ mineData.credits }}</div>
    <div
      v-for="(item, index) in list"
      :key="index"
      :class="{'color-red':index===0,'color-orange':index===1,'color-cyan':index=== 2}"
      class="ranking_item"
    >
      <div class="num">
        <img v-if="index<3" :src="require(`@/bpa/assets/img/no_${index+1}.png`)" :alt="index">
        <span v-else> {{ index }} </span>
      </div>
      <div class="avatar-wrapper">
        <div class="avatar">
          <img :src="item.avatar ? item.avatar : defaultAvatar" alt="头像">
        </div>
      </div>
      <div class="name">{{ item.name }}</div>
      <div class="credits"> {{ item.credits }} </div>
    </div>
  </div>
</template>

<script>
import defaultAvatar from '@/bpa/assets/img/user_head.png'
export default {
  name: 'Ranking',
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    },
    mineData: {
      type: Object,
      default() {
        return {
          no: '0', // 排名
          credits: '0' // 积分
        }
      }
    }
  },
  data() {
    return {
      defaultAvatar
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.color-red{
  color: #e82f17;
}
.color-orange{
  color: #ea9925;
}
.color-cyan{
  color: #b5c71b;
}
.ranking{
  width: 350px;
  &_title{
    font-size: 14px;
    color: #333333;
    font-weight: bold;
    margin: 15px 0 0 15px;
  }
  &_mine{
    font-size: 12px;
    margin: 5px 0 15px 0;
  }
  &_item{
    border-top: 1px solid #dddddd;
    display: flex;
    align-items: center;
    .num{
      width: 75px;
      text-align: center;
      padding: 8px;
    }
    .avatar-wrapper{
      width: 105px;
      padding: 8px;
     .avatar{
       width: 46px;
       height: 46px;
       border-radius: 50%;
       overflow: hidden;
       img{
         width: 100%;
       }
     }
    }
    .name{
      width: 100px;
      padding: 8px;
    }
    .credits{
      width: 55px;
      padding: 8px;
    }
  }
}
</style>
