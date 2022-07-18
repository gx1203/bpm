<template>
    <div id="frameShow" ref="frameShowHead">
        <div class="w100 trans-origin" ref="frameShow">
            <div class="topPart w100 text-center">
                <div class="node commonNode" @click="nodeClick(data.strategy[0])">
                    <img src="@/bpa/assets/img/enterprise021.png" />
                    <span>
                {{data.strategy[0].code + data.strategy[0].name}}<br/>
                {{data.strategy[0].enname}}
            </span>
                </div>
            </div>
            <div class="commonPart">
                <el-row :gutter="5" class="w100">
                    <el-col :span="rack.main == 5 ? 1:(24 / rack.main)" :class="{'w20': rack.main == 5}" v-for="(item, index) in data.main" :key="index">
                        <div class="node commonNode w100 secondHeight" @click="nodeClick(item)">
                            <img src="@/bpa/assets/img/enterprise021.png" />
                            <span>
                          {{item.code + item.name}}<br/>
                          {{item.enname}}
                      </span>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <div class="commonPart margin-t15">
                <el-row :gutter="5" class="w100">
                    <el-col :span="rack.support == 5 ? 1:(24 / rack.support)" :class="{'w20': rack.support == 5}" v-for="(item, index) in data.support" :key="index">
                        <div class="node commonNode w100 thirdHeight" @click="nodeClick(item)">
                            <img src="@/bpa/assets/img/enterprise031.png" />
                            <span>
                          {{item.code + item.name}}<br/>
                          {{item.enname}}
                      </span>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
  import { requireOrgData } from '@/bpa/api/componentsApi'
  import { getNum } from '@/bpa/api/common'
  export default {
    name: 'frameShow',
    data () {
      return {
        data: {
          strategy: [{code: '', name: '', enname: ''}]
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
    mounted () {
      this.getdata()
    },
    methods: {
      async getdata () {
        let res = await getNum({})
        if (!res) return false
        let obj = {}
        res.list.forEach(item => {
          if (item.id == 'support') {
            obj.support = parseInt(item.name)
          }
          if (item.id == 'main') {
            obj.main = parseInt(item.name)
          }
        })
        this.rack = Object.assign({}, this.rack, obj)
        requireOrgData().then(res => {
          console.log(res)
          this.data = res
        })
      },
      nodeClick (item) {
        if (this.clickable) {
          this.$emit('treeclick', item)
          return false
        }
        this.$router.push({
          path: '/processModelCenter/processIframeCenter',
          query: { attrid: item.id }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
    #frameShow {
        width: 1000px;
        .trans-origin {
            transform-origin: left top;
        }
        * {
            box-sizing: border-box;
        }
        .w20{
            width: 20%!important;
        }
        .topPart {
            background: url("~@/../static/img/enterprise011.png") center center no-repeat;
            background-size: 100% 100%;
            padding: 45px 0 15px;
            .node{
                width: 216px;
                height: 62px;
                margin-left: -10px;
            }
        }
        .commonPart{
            width: calc(100% - 25px);
            margin-top: 8px;
            padding: 20px 0px 10px 15px;
            background-color: #1f4d79;
            box-shadow: 10px 10px 15px rgba(0,0,0,0.5);
            &.margin-t15 {
                margin-top: 15px;
            }
        }
        .secondHeight{
            height: 62px;
        }
        .thirdHeight{
            height: 110px;
        }
        .commonNode{
            text-align: center;
            padding: 2px 12px 7px 5px;
            box-sizing: border-box;
            line-height: 18px;
            font-size: 13px;
            color: #555;
            display: inline-block;
            vertical-align: middle;
            position: relative;
            z-index: 0;
            overflow: hidden;
            margin-bottom: 10px;
            img {
                width: 100%;
                height: 100%;
                display: block;
                position: absolute;
                top: 0;
                left: 0;
                z-index: -1;
            }
            span{
                word-break: break-all;
                display: inline-block;
                vertical-align: middle;
            }
            &:after{
                content: '';
                width: 0;
                height: 100%;
                display: inline-block;
                vertical-align: middle;
            }
        }
    }
</style>
