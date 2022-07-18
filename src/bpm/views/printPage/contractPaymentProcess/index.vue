<template>
  <div style="width:940px" class="info">
    <div class="content" v-loading="loading" id="form">
      <div>
        <div class="title" v-if="content.applyUserDto">
          <h3>{{content.bizData.PROJECTNAME.showValue}}合同支付申请单</h3>
        </div>
        <div class="table" v-if="content.bizData">
          <div class="table-tr">
            <span class="w140">项目名称</span>
            <span class="w770">{{content.bizData.PROJECTNAME.showValue}}</span>
          </div>

          <div class="table-tr">
            <span class="w140">合同编码</span>
            <span class="w152 text-r">{{content.bizData.CONTRACTCODE.showValue}}</span>

            <span class="w140">支付单号</span>
            <span class="w140 text-r">{{content.bizData.PAYMENTNO.showValue}}</span>

            <span class="w140">申请日期</span>
            <span class="w140 text-r">{{content.reqdate | formatDateTime}}</span>
          </div>

          <div class="table-tr">
            <span class="w140">合同名称</span>
            <span class="w770">{{content.bizData.CONTRAACTNAME.showValue}}</span>
          </div>
          <div class="table-tr">
            <span class="w140">经办部门</span>
            <span class="w770">{{content.bizData.CONTRACTOR.showValue}}</span>
          </div>
          <div class="table-tr">
            <span class="w140">乙方单位</span>
            <span class="w770">{{content.bizData.PARTYUNIT.showValue}}</span>
          </div>
          <div class="table-tr">
            <span class="w140">收款单位</span>
            <span class="w770">{{content.bizData.RECEIVINGUNIT.showValue}}</span>
          </div>
          <div class="table-tr">
            <span class="w140">开户银行</span>
            <span class="w300">{{content.bizData.PAYINGBANK.showValue}}</span>
            <span class="w140">帐号</span>
            <span class="w300 text-c">{{content.bizData.BANKACCOUNT.showValue}}</span>
          </div>

          <div class="table-tr">
            <span class="w140">合同原始金额</span>
            <span class="w300">{{content.bizData.CONTRACTTOTAL.showValue | formatNumber(2,1)}}</span>
            <span class="w140">合同当前金额</span>
            <span class="w300 text-c">{{content.bizData.FINALMONEY.showValue| formatNumber(2,1)}}</span>
          </div>

          <div class="table-tr">
            <span class="w140">累计支付金额</span>
            <span class="w300">{{content.bizData.AMOUNTPAID.showValue| formatNumber(2,1)}}</span>
            <span class="w140">支付说明</span>
            <span class="w300 text-c">{{content.bizData.DETAIL.showValue}}</span>
          </div>

          <div class="table-tr">
            <span class="w140">本次应付金额</span>
            <span class="w300">{{content.bizData.TPAYMENTMONEYS.showValue | formatNumber(2,1)}}</span>
            <span class="w140">增值税进项税</span>
            <span class="w300 text-c">{{content.bizData.VATINPUTTAX.showValue}}</span>
          </div>
          <div class="table-tr">
            <span class="w140">扣预付款</span>
            <span class="w300">{{content.bizData.ADVANCEMONEY.showValue | formatNumber(2,1)}}</span>
            <span class="w140">扣保留金</span>
            <span class="w300 text-c">{{content.bizData.RESERVEMONEY.showValue | formatNumber(2,1)}}</span>
          </div>
          <div class="table-tr">
            <span class="w140">代扣税金</span>
            <span class="w300">{{content.bizData.WITHHOLDINGTAX.showValue | formatNumber(2,1)}}</span>
            <span class="w140">其他扣款</span>
            <span class="w300 text-c">{{content.bizData.OTHERDEDUCTIONS.showValue | formatNumber(2,1)}}</span>
          </div>
          <div class="table-tr">
            <span class="w140">本次实付金额</span>
            <span class="w770">{{content.bizData.ACTUALMONETS.showValue | formatNumber(2,1)}}</span>
          </div>
          <div class="table-tr">
            <span class="w140">申请人</span>
            <span class="w770">{{content.applyUserDto.cnname}}</span>
          </div>
          <!-- <div class="table-tr">
            <span class="w140">付款理由及依据</span>
            <span class="w770">{{content.bizData.DETAIL.showValue}}</span>
          </div> -->
          <div class="table-tr">
              <h4 class="text-c">审批记录</h4>
          </div>
          <div class="table-tr table-th text-c">
            <span class="w50">序号</span>
            <span class="w200">审批备注</span>
            <span class="w150">审批意见</span>
            <span class="w150">审批节点</span>
            <span class="w150">审批时间</span>
            <span class="w150">审批人</span>
          </div>
            <div class="table-tr text-c" v-for="(item, index) in  content.approvalRecordList" :key="index">
                <span class="w50 text-c">{{index+1}}</span>
                <span class="w200">{{item.reason}}</span>
                <span class="w150 text-c">{{item.result}}</span>
                <span class="w150 text-c">{{item.processnodename}}</span>
                <span class="w150 text-c">{{item.createdate | formatDateTime}}</span>
                <span class="w150 text-c">{{item.username}}</span>
            </div>
        </div>
      </div>
      <div v-if="!isPrint" class="footer text-r">
        <el-button type="primary" class="submit-btn" @click="handlePrint">打 印</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { getPrintData } from "@/bpm/api/printPage";
export default {
  components: {},
  data() {
    return {
      isPrint: false,
      loading: false,
      content: {}
    };
  },
  watch: {},
  mounted() {
      this.getData()
  },
  methods: {
    getData(){
    this.loading = true
      getPrintData({
        instanceId: this.$route.query.instanceId,
      })
        .then(rt => {
          this.content = rt.data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
        
    },
    handlePrint() {
      this.isPrint = true;
      this.$nextTick(() => {
        window.print();
        this.isPrint = false;
      });
    }
  }
};
</script>
<style type="text/scss" lang="scss" scoped>
.root {
  min-height: 100%;
}
.info {
  margin: 0 auto;
}
.content {
  background: $bc1;
  padding-bottom: 54px;
  padding-top: 54px;
  .title {
    text-align: center;
    h3 {
      font-size: 20px;
      color: #000;
      font-weight: bold;
      height: 40px;
      line-height: 30px;
    }
  }
  .table {
    border-left: 1px solid $dc1;
    border-top: 1px solid $dc1;
    .table-th{
        font-weight: bold;
    }
    .table-tr {
      display: flex;
      font-size: 14px;
      color: #000;
      h4{
          width: 100%;
          height: 24px;
          line-height: 24px;
          border-right: 1px solid $dc1;
          border-bottom: 1px solid $dc1;
      }
      span {
        display: inline-block;
        line-height: 28px;
        border-right: 1px solid $dc1;
        border-bottom: 1px solid $dc1;
        padding: 5px 7px;
      }
      .w50{
          width: 50px;
      }

      .w140 {
        width: 140px;
      }
      .w770 {
        width: 770px;
      }
      .w152 {
        width: 152px;
      }
      
      .w200 {
        width: 200px;
      }
      .w150 {
        width: 150px;
      }
      .w292 {
        width: 292px;
      }
      .w300 {
        width: 300px;
      }
    }
  }
  .submit-btn {
    background: $bc4;
    margin: 15px 10px;
    width: 80px;
  }
}
.footer {
  position: fixed;
  z-index: 100;
  bottom: 0;
  width: 940px;
  background-color: #fff;
}
</style>

<style type="text/scss" lang="scss">
.subject {
  margin-left: 15px;
}
.subject input.el-input__inner {
  // border: 0;
  // border-bottom: 1px solid $dc1;
  width: 40%;

  &:focus {
    border-bottom: 1px solid $bc3;
  }
}
</style>
