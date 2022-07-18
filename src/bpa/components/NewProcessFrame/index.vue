<template>
  <div id="frameShow" ref="frameShowHead">
    <div class="w100 trans-origin" ref="frameShow">
      <div v-if="dataList.topRoof" class="topPart w100 text-center" @dblclick="nodeClick(data.strategy[0])">
        <div class="node-title">{{ dataList.strategy ? dataList.strategy[0].name : ''}}</div>
        <div class="child-node-wrapper" style="justify-content: center">
          <div style="width: 520px;display: flex;flex-wrap:wrap;justify-content: center">
            <div v-for="(item, index) in dataList.topRoof ? dataList.topRoof : []" :key="index"
                 class="node commonNode">
              <img src="@/bpa/assets/img/enterprise021.png"/>
              <div>
                <div>{{ item.name }}</div>
                <div v-for="(childItem, childIndex) in item.guizhang" :key="childIndex">
                  {{childItem}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="child-node-wrapper top-body" @dblclick="nodeClick(data.strategy[0])">
        <div v-for="(item, index) in dataList.topBody ? dataList.topBody : []" :key="index"
             class="node commonNode" @dblclick="nodeClick(item)">
          <img src="@/bpa/assets/img/enterprise021.png"/>
          <div>
            <div>{{ item.name }}</div>
            <div v-for="(childItem, childIndex) in item.guizhang" :key="childIndex">
              {{childItem}}
            </div>
          </div>
        </div>
      </div>
      <div class="commonPart">
        <div class="w100 common-part-box">
          <div v-for="(item, index) in dataList.main" :key="index" :span="rack.main == 5 ? 1:(24 / rack.main)"
               :class="{'w20': rack.main == 5}" class="common-part-wrapper" @dblclick="nodeClick(item)">
            <div class="item-wrapper">
              <div class="node-title">{{ item.name }}</div>
              <div class="child-node-wrapper">
                <div v-for="(childItem, childIndex) in item.item" :key="childIndex"
                     class="node commonNode w100 secondHeight">
                  <img src="@/bpa/assets/img/enterprise021.png"/>
                  <div>
                    <div>{{ childItem.name }}</div>
                    <div v-for="(gItem, gIndex) in childItem.guizhang" :key="gIndex">
                      {{gItem}}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="commonPart">
        <div class="w100 common-part-box">
          <div v-for="(item, index) in dataList.support" :key="index" :span="rack.main == 5 ? 1:(24 / rack.main)"
               :class="{'w20': rack.main == 5}" class="common-part-wrapper" @dblclick="nodeClick(item)">
            <div class="item-wrapper">
              <div class="node-title">{{ item.name }}</div>
              <div class="child-node-wrapper">
                <div v-for="(childItem, childIndex) in item.item" :key="childIndex"
                     class="node commonNode w100 secondHeight">
                  <img src="@/bpa/assets/img/enterprise031.png"/>
                  <div>
                    <div>{{ childItem.name }}</div>
                    <div v-for="(gItem, gIndex) in childItem.guizhang" :key="gIndex">
                      {{gItem}}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--      <div class="topPart w100 text-center">-->
      <!--        <div class="node commonNode" @dblclick="nodeClick(data.strategy[0])">-->
      <!--            <img src="@/assets/img/enterprise021.png" />-->
      <!--            <span>-->
      <!--                {{data.strategy[0].code + data.strategy[0].name}}<br/>-->
      <!--                {{data.strategy[0].ename}}-->
      <!--            </span>-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <div class="commonPart">-->
      <!--          <el-row :gutter="5" class="w100">-->
      <!--              <el-col :span="rack.main == 5 ? 1:(24 / rack.main)" :class="{'w20': rack.main == 5}" v-for="(item, index) in data.main" :key="index">-->
      <!--                  <div class="node commonNode w100 secondHeight" @dblclick="nodeClick(item)">-->
      <!--                      <img src="@/assets/img/enterprise021.png" />-->
      <!--                      <span>-->
      <!--                          {{item.code + item.name}}<br/>-->
      <!--                          {{item.ename}}-->
      <!--                      </span>-->
      <!--                  </div>-->
      <!--              </el-col>-->
      <!--          </el-row>-->
      <!--      </div>-->
      <!--      <div class="commonPart margin-t15">-->
      <!--          <el-row :gutter="5" class="w100">-->
      <!--              <el-col :span="rack.support == 5 ? 1:(24 / rack.support)" :class="{'w20': rack.support == 5}" v-for="(item, index) in data.support" :key="index">-->
      <!--                  <div class="node commonNode w100 thirdHeight" @dblclick="nodeClick(item)">-->
      <!--                      <img src="@/assets/img/enterprise031.png" />-->
      <!--                      <span>-->
      <!--                          {{item.code + item.name}}<br/>-->
      <!--                          {{item.ename}}-->
      <!--                      </span>-->
      <!--                  </div>-->
      <!--              </el-col>-->
      <!--          </el-row>-->
      <!--      </div>-->

    </div>
  </div>
</template>

<script>
import {requireOrgData, queryModelTreesAndRegulations} from '@/bpa/api/componentsApi'
// import { queryModelTreesAndRegulations } from '@/api/componentsApi'
import {getNum} from '@/bpa/api/common'

export default {
  name: 'frameShow',
  data() {
    return {
      data: {
        strategy: [{code: '', name: '', ename: ''}]
      },
      dataList: {
        // strategy: [{
        //   name: '1.0构建愿景与战略',
        //   item: [
        //     { name: '1.1定义业务理念和长期愿景1', guizhang: ['XXX体系', 'XXX手册'] },
        //   ]
        // }],
        // main: [
        //   {
        //     name: '2.0综合计划管理',
        //     item: [
        //       {name: '2.1定义业务理念和长期愿景1', guizhang: ['XXX体系', 'XXX职责']},
        //     ]
        //   }
        // ],
        // support: [
        //   {
        //     name: '2.0综合计划管理',
        //     item: [
        //       {name: '2.1定义业务理念和长期愿景1', guizhang: ['XXX体系', 'XXX手册', 'XXX职责']},
        //     ]
        //   }
        // ]
      },
      rack: {
        'support': 0,
        'main': 0
      }
    }
  },
  props: {
    clickable: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.getdata()
  },
  methods: {
    async getdata() {
      let res = await getNum({})
      if (!res) return false
      let obj = {}
      res.list.forEach(item => {
        if (item.id === 'support') {
          obj.support = parseInt(item.name)
        }
        if (item.id === 'main') {
          obj.main = parseInt(item.name)
        }
      })
      this.rack = Object.assign({}, this.rack, obj)
      queryModelTreesAndRegulations().then(res => {
        console.log(res)
        // this.data = res
        this.dataList = res
        // this.dataList.strategy = [{
        //   name: '1.0构建愿景与战略',
        //   item: [
        //     { name: '1.1定义业务理念和长期愿景1', guizhang: ['XXX体系', 'XXX手册'] },
        //     { name: '1.1定义业务理念和长期愿景1', guizhang: ['XXX体系', 'XXX手册'] },
        //     { name: '1.1定义业务理念和长期愿景1', guizhang: ['XXX体系', 'XXX手册'] },
        //     { name: '1.1定义业务理念和长期愿景1', guizhang: ['XXX体系', 'XXX手册'] },
        //     { name: '1.1定义业务理念和长期愿景1', guizhang: ['XXX体系', 'XXX手册'] },
        //     { name: '1.1定义业务理念和长期愿景1', guizhang: ['XXX体系', 'XXX手册'] },
        //     { name: '1.1定义业务理念和长期愿景1', guizhang: ['XXX体系', 'XXX手册'] },
        //     { name: '1.1定义业务理念和长期愿景1', guizhang: ['XXX体系', 'XXX手册'] },
        //     { name: '1.1定义业务理念和长期愿景1', guizhang: ['XXX体系', 'XXX手册'] },
        //     { name: '1.1定义业务理念和长期愿景1', guizhang: ['XXX体系', 'XXX手册'] },
        //     { name: '1111111定义业务理念和长期愿景1', guizhang: ['XXX体系', 'XXX手册'] },
        //     { name: '2222222定义业务理念和长期愿景1', guizhang: ['XXX体系', 'XXX手册'] },
        //     { name: '33333333定义业务理念和长期愿景1', guizhang: ['XXX体系', 'XXX手册'] },
        //     { name: '1.1定义业务理念和长期愿景1', guizhang: ['XXX体系', 'XXX手册'] },
        //     { name: '1.1定义业务理念和长期愿景1', guizhang: ['XXX体系', 'XXX手册'] }
        //   ]
        // }]
        this.dataList.topRoof = this.dataList.strategy[0].item.slice(0, 12)
        this.dataList.topBody = this.dataList.strategy[0].item.slice(13)
        console.log(this.dataList.topRoof)
        console.log(this.dataList.topBody)
        // if ()
      })
      requireOrgData().then(res => {
        console.log(res)
        this.data = res
        // this.dataList = res
      })
    },
    nodeClick(item) {
      if (this.clickable) {
        this.$emit('treeclick', item)
        return false
      }
      this.$router.push({
        path: '/processModelCenter/processIframeCenter',
        query: {attrid: item.id}
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  #frameShow {
    width: 1600px;

    .trans-origin {
      transform-origin: left top;
    }

    * {
      box-sizing: border-box;
    }

    .w20 {
      width: 20% !important;
    }

    .topPart {
      background: url("~@/../static/img/enterprise011.png") center center no-repeat;
      background-size: 100% 100%;
      padding: 120px 0 20px 0;

      .node {
        /*width: 84px;*/
        /*min-height: 62px;*/
        /*margin-left: 8px;*/
      }

      /*.node-title{*/
      /*  color: #FFFFFF;*/
      /*}*/
    }
    .top-body{
      background: #00235a;
      padding: 0 10px 2px 30px;
      position: relative;
      top: -17px;
      left: 0;
      width: calc(100% - 43px);
      box-shadow: 29px 10px 15px rgba(0, 0, 0, 0.5);
    }
    .node-title {
      color: #FFFFFF;
      font-weight: 600;
      font-size: 14px;
      line-height: 32px;
      height: 32px;
      text-align: center;
    }

    .common-part-box {
      display: flex;
      flex-wrap: wrap;
    }

    .item-wrapper {
      background: #1f4d79;
      box-shadow: 10px 10px 15px rgba(0, 0, 0, 0.5);
      height: 100%;
    }

    .common-part-wrapper {
      padding: 0 4px;
      flex: 0 0 260px;
      margin-bottom: 8px;
    }

    .commonPart {
      width: calc(100% - 25px);
      margin-top: 8px;
      /*padding: 20px 0px 10px 15px;*/
      /*background-color: #1f4d79;*/
      /*box-shadow: 10px 10px 15px rgba(0,0,0,0.5);*/
      &.margin-t15 {
        margin-top: 15px;
      }
    }

    /*.secondHeight{*/
    /*    height: 62px;*/
    /*}*/
    .thirdHeight {
      height: 110px;
    }

    .child-node-wrapper {
      display: flex;
      /*justify-content: center;*/
      flex-wrap: wrap;
      /*flex: ;*/
    }

    .commonNode {
      text-align: center;
      padding: 2px 12px 7px 5px;
      box-sizing: border-box;
      line-height: 18px;
      font-size: 10px;
      color: #555;
      display: inline-block;
      vertical-align: middle;
      position: relative;
      z-index: 0;
      overflow: hidden;
      margin-bottom: 10px;
      width: 75px;
      min-height: 62px;
      margin-left: 8px;
      /*flex: 1;*/
      flex: 0 0 75px;

      img {
        width: 100%;
        height: 100%;
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
      }

      span {
        word-break: break-all;
        display: inline-block;
        vertical-align: middle;
      }

      &:after {
        content: '';
        width: 0;
        height: 100%;
        display: inline-block;
        vertical-align: middle;
      }
    }
  }
</style>
