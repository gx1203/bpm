<template>
  <div class="card" v-loading="load">
    <div class="content" v-if="content.applyUserDto">
      <h1>
        <p></p>
        <p>投资立项审批表</p>
      </h1>
      <div style="margin:10px;">申报部门：{{content.applyUserDto.department}}</div>
      <table>
        <tr>
          <td width="200">项目名称</td>
          <td class="textLeft">{{content.bizData.LXMC.showValue}}</td>
        </tr>
        <tr>
          <td>项目编号</td>
          <td class="textLeft">{{content.bizData.LXBH.showValue}}</td>
        </tr>
        <tr>
          <td>项目内容</td>
          <td class="textLeft">{{content.bizData.LXNR.showValue}}</td>
        </tr>
        <tr>
          <td>投资规模</td>
          <td class="textLeft">{{content.bizData.TZGM.showValue}}</td>
        </tr>
        <tr>
          <td>费用列支（资金渠道）</td>
          <td class="textLeft">{{content.bizData.LZQD.showValue}}</td>
        </tr>
        <tr>
          <td>委托实施单位</td>
          <td class="textLeft">{{content.bizData.SSDW.showValue}}</td>
        </tr>
        <tr>
          <td>项目经办人</td>
          <td class="textLeft">{{content.applyUserDto.displayname}}</td>
        </tr>
        <tr>
          <td>部门内部审核意见</td>
          <td class="textLeft" v-html="remark1"></td>
        </tr>
        <tr>
          <td>部门会签意见</td>
          <td class="textLeft" v-html="remark2"></td>
        </tr>
        <tr>
          <td>外部相关部门、单位会签意见</td>
          <td class="textLeft" v-html="remark3"></td>
        </tr>
        <tr>
          <td>领导审批意见</td>
          <td class="textLeft" v-html="remark4"></td>
        </tr>
      </table>
      <div v-if="isPrint" class="footer text-r">
        <el-button type="primary" class="submit-btn" @click="handlePrint">打 印</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { getPrintData } from '../../../api/printPage/index'
import moment from 'moment-mini'
export default {
  data () {
    return {
      load: false,
      isPrint: true,
      content: {},
      remark1: '',
      remark2: '',
      remark3: '',
      remark4: ''
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      this.load = true
      getPrintData({
        instanceId: this.$route.query.instanceId
      }).then(rt => {
        this.content = rt.data
        rt.data.approvalRecordList.forEach(e => {
          e.result = e.result ? e.result : '同意'
          e.createdate = moment(e.createdate).format('YYYY-MM-DD HH:mm')
          if (e.processnodename === '处室审核' || e.processnodename === '处室、分中心会签') {
            this.remark1 += `审批人：${e.username}，审批时间：${e.createdate}，审批意见：${e.result}；</br>`
          } else if (e.processnodename === '部门领导审批') {
            this.remark2 += `审批人：${e.username}，审批时间：${e.createdate}，审批意见：${e.result}；</br>`
          } else if (e.processnodename === '外部相关部门、单位会签') {
            this.remark3 += `审批人：${e.username}，审批时间：${e.createdate}，审批意见：${e.result}；</br>`
          } else if (e.processnodename === '集团分管领导审批') {
            this.remark4 += `审批人：${e.username}，审批时间：${e.createdate}，审批意见：${e.result}；</br>`
          }
        })
        this.load = false
      }).catch(er => {
        this.load = false
      })
    },
    handlePrint () {
      this.isPrint = false
      this.$nextTick(() => {
        window.print()
        this.isPrint = true
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .card {
    width: 100%;
    background-color: #fff;
    color: #000;
    font-size: 16px;
    padding: 20px;
    .content {
      width: 900px;
      margin: 0 auto;
      position: relative;
      margin-bottom: 60px;
      h1 {
        text-align: center;
        font-size: 24px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        text-align: center;
        .textLeft {
          text-align: left;
        }
        td {
          border: 1px solid #000;
          padding: 15px 10px;
        }
      }
      .footer{
        position: fixed;
        z-index: 100;
        bottom: 0;
        width: 900px;
        background-color: #fff;
      }
      .submit-btn {
        background: $bc4;
        margin: 15px 10px;
        width: 80px;
      }
    }
  }
</style>
