<template>
  <div class="w100">
    <el-form
      :model="searchForm"
      label-width="80px"
    >
      <el-row :gutter="24" class="processBox">
        <el-col :span="5">
          <el-form-item label="制度框架">
            <!-- <el-select v-if="!state" v-model="searchForm.systemId" placeholder="制度总览" clearable @change="nodeClick()"> -->
            <el-select v-if="!state" v-model="searchForm.systemId" placeholder="制度总览" clearable @change="nodeClick">
              <el-option
                v-for="item in treeList"
                :key="item.id"
                :label="item.foldername"
                :value="item.id"
                :disabled="item.disabled"/>
            </el-select>
            <el-input v-if="state" v-model="searchForm.name" :disabled="true"/>
          </el-form-item>
        </el-col>
        <el-col :span="19" class="processTs">统计数据截止3个小时前</el-col>
        <el-col :span="24" class="system">
          <div v-for="(item,index) in headerList" :key="index" class="systemItem" >
            <div class="systemItemBox">
              <div class="systemItemTop">
                <span>{{ item.name }}
                  <el-tooltip :content="item.title" placement="top">
                    <img src="../../../assets/img/systemKanBan/process_top_icon.png"  alt >
                  </el-tooltip>
                </span>
              </div>
              <div class="systemItemBottom">
                <span><span style="font-size: 22px;font-family: Microsoft YaHei;font-weight: bold;color: #09EEF5;">{{item.num}}</span>个</span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import {
  queryRegulationCount
} from '@/bpa/api/systemKanBan'
import { getRuleIframeTree } from '@/bpa/api/rulesCenter/handbookFiles'
import { createNamespacedHelpers } from 'vuex'
const userInfo = createNamespacedHelpers('userInfo')
export default {
  name: 'SystemProcess',
  props: {
    system: {
      type: String,
      default: ''
    },
    state: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      treeList: [],
      searchForm: {
        systemId: '5',
        name: ''
      },
      headerList: [
        {
          num: '0',
          name: '已发布制度',
          ico: 'el-icon-s-promotion',
          color: '#06abb9',
          title: '已发布的制度数量'
        },
        {
          num: '0',
          name: '审批中制度',
          ico: 'el-icon-connection',
          color: '#b35141',
          title: '审批中的制度数量'
        },
        {
          num: '0',
          name: '失效制度',
          ico: 'el-icon-s-custom',
          color: '#019874',
          title: '失效的制度数量'
        },
        {
          num: '0',
          name: '未匹配到流程',
          ico: 'el-icon-copy-document',
          color: '#b37e11',
          title: '未关联流程制度数量'
        },
        {
          num: '0',
          name: '匹配到流程',
          ico: 'el-icon-crop',
          color: '#3577c0',
          title: '关联流程制度数量'
        }
      ]
    }
  },
  computed: {
    pId() {
      // return process.env.NODE_ENV !== 'production' ? '10603' : '10561'
      return '5'
    }
  },
  mounted() {
    this.searchForm.systemId = this.system
    this.queryRegulationCount()
    this.getFilterTreeList()
  },
  methods: {
    ...userInfo.mapActions(['getCurrentSystemId']),
    // 树点击节点事件
    nodeClick(val) {
      this.searchForm.systemId = val === "" ? '5' : val
      this.getCurrentSystemId(this.searchForm.systemId) // 回传数据
      this.$emit('systemId', this.searchForm.systemId)
      this.queryRegulationCount()
    },
    // 获取全部的制度框架
    getFilterTreeList() {
      getRuleIframeTree(this.pId).then((res) => {
        if (!res) return false
        this.treeList = res
        this.treeList.splice(0, 0, { id: this.pId, foldername: '制度总览' }) 
        if (this.state) {
          res.map(item => {
            if (item.id === this.system) {
              this.$set(this.searchForm, 'name', item.foldername)
            }
          })
        }
      })
    },
    // 制度框架
    queryRegulationCount() {
      queryRegulationCount({ 'attr': {
        'folderid': this.searchForm.systemId === '' ? this.pId : this.searchForm.systemId
      }, 'pageSize': '99999' }).then(res => {
          if (!res) return false
          // if (res) {
            this.$set(this.headerList[0], 'num', res[0].releaseNews)
            this.$set(this.headerList[1], 'num', res[1].approveNews)
            this.$set(this.headerList[2], 'num', res[2].releaseDelNews)
            this.$set(this.headerList[3], 'num', res[3].notMatchCount)
            this.$set(this.headerList[4], 'num', res[4].matchedCount)
          // }
      })
    }
  }
}
</script>

<style scoped lang="scss">
#bpaAnalysis {
  color: #09EEF5;
  .el-form {
    /deep/ .el-form-item__label {
      color: #9FCEFF;
    }
   /deep/ .el-select .el-input__inner {
      color: #426193;
      border-radius: 0;
      background-color: #082C62;
      border-color: #009499;
    }
    /deep/ .el-input__inner {
      color: #426193;
      border-radius: 0;
      background-color: #082C62;
      border-color: #009499;
    }
  }
  .processBox {
    padding: 20px;
    margin-bottom: 30px;
    background-size: cover;
    background: url("../../../assets/img/systemKanBan/process_bg.png") center center no-repeat;
    .processTs{
      text-align: right;
      line-height: 30px;
    }
    .system {
      display: flex;
      text-align: center;
      justify-content: space-around;
      padding: 0 20px;
      .systemItem {
        width: 18%;
        height: 124px;
        .systemItemBox {
          height: 100%;
          .systemItemTop {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 56px;
            span {
              display: flex;
              padding: 12px 20px;
              background-size: cover;
              background: url("../../../assets/img/systemKanBan/process_top.png") no-repeat;
              img {
                margin: auto 6px;
              }
            }
          }
          .systemItemBottom {
            display: flex;
            /*align-items: center;*/
            justify-content: center;
            height: 84px;
            background-size: cover;
            background: url("../../../assets/img/systemKanBan/process_bottom.png") center center no-repeat;
            span {
              padding-top: 12px;
            }
          }
        }
      }
    }
  }
}
</style>
