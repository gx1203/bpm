<!--  -->
<template>
  <div class="thisPrintCard">
    <div v-for="(item, index) in printCardLen" :key="index">
      <div class="cardTtile">
        <h2>出门证</h2>
        <p v-if="printData.DOCUMENTNO != ''">
          单据编号: {{ printData.DOCUMENTNO }}
        </p>
        <div
          class="qrcode"
          :id="`qrCodeUrl${index}`"
          :ref="`qrCodeUrl${index}`"
        ></div>
      </div>
      <table cellpadding="0" cellspacing="0">
        <tr>
          <th colspan="2">工厂:{{ printData.FACTORY_NO }}</th>
          <th colspan="2">物料分类:{{ printData.ORDER_TYPE }}</th>
          <th colspan="2">车牌号:{{ printData.PLATE_NUMBER }}</th>
        </tr>
        <tr>
          <th colspan="2">出门单位:{{ printData.CORPORATION }}</th>
          <th colspan="2">出门时间:{{ formatDateTime(printData.OUT_TIME) }}</th>
          <th colspan="2">出门原因:{{ printData.OUT_REASON }}</th>
        </tr>
        <tr class="tag">
          <th class="th1">序号</th>
          <th class="th2">物料编码</th>
          <th class="th3">物料名称</th>
          <th class="th4">单位</th>
          <th class="th5">数量</th>
          <th class="th6">备注</th>
        </tr>
        <tr v-for="(item, index) in printData.ZBQY" :key="index">
          <td class="no">{{ index + 1 }}</td>
          <td>{{ item.MATERIAL_NO }}</td>
          <td>{{ item.MATERIAL_NAME }}</td>
          <td>{{ item.UNITS }}</td>
          <td>{{ item.QTY }}</td>
          <td>{{ item.DETAILS_COMMENTS }}</td>
        </tr>
        <tr>
          <th colspan="2">创建人:{{ printData.CREATE_USER }}</th>
          <th colspan="2">负责人:{{ printData.APPROVAL_USER }}</th>
          <th colspan="2">经办人:{{ printData.CHARGE_USER }}</th>
        </tr>
      </table>
      <p v-if="index != 1" class="fg"></p>
    </div>
  </div>
</template>

<script>
import moment from 'moment-mini'
import QRCode from 'qrcodejs2'
export default {
  data() {
    return {
      printCardLen: 2,
      keys: [
        'FACTORY_NO',
        'ORDER_TYPE',
        'OUT_TIME',
        'CORPORATION',
        'OUT_REASON',
        'PLATE_NUMBER',
        'CHARGE_USER',
        'ZBQY',
      ],
      printData: {
        FACTORY_NO: '',
        ORDER_TYPE: '',
        OUT_TIME: '',
        CORPORATION: '',
        OUT_REASON: '',
        PLATE_NUMBER: '',
        ZBQY: [],
        CHARGE_USER:'',
        CREATE_USER: '',
        APPROVAL_USER: '',
        DOCUMENTNO: '',
      },
    }
  },
  props: {
    childNodes: {
      type: Array,
      default() {
        return []
      },
    },
    childNodeName: {
      type: String,
      default() {
        return null
      },
    },
  },
  watch: {
    childNodes(newVal) {
      // console.error(JSON.stringify(newVal))
    },
    childNodeName(newVal) {
      // console.error(newVal)
    },
  },
  mounted() {
    this.setPrintCardDatas(this.childNodes)
  },
  methods: {
    setPrintCardDatas(obj) {
      var nodeData = this.$store.state.app.nodeData
      // console.error(nodeData)
      // console.error(obj)
      // console.error(JSON.stringify(obj))

      // 申请人
      this.printData.CREATE_USER = nodeData.applyUserDto.cnname

      // 审批、经办人
      var approvalRecordList = nodeData.approvalRecordList
      if (typeof nodeData.approvalRecordList != 'undefined') {
        if (approvalRecordList.length > 1) {
          this.printData.APPROVAL_USER = nodeData.approvalRecordList[1].username
        }
      }

      nodeData.nodeTabLists.forEach((item) => {
        if (item.tabname == '隐藏域') {
          this.printData.DOCUMENTNO =
            nodeData.nodeTabLists[2].nodeTableLists[0].showValue
          if (
            this.printData.DOCUMENTNO != null &&
            this.printData.DOCUMENTNO != ''
          ) {
            this.doCreateQrCode()
          }
        }
      })

      //数据检索
      this.keys.forEach((item, index) => {
        obj.forEach((objItem, objIndex) => {
          if (item == objItem.fieldName) {
            if (item == 'ZBQY') {
              var rows = objItem.rows
              var rowsLen = rows.length
              var diffNum = 5 - rowsLen

              if (rowsLen > 0) {
                rows.forEach((rowItem, rowIndex) => {
                  var thisRowData = rowItem.nodeTableLists
                  var thisItem = {
                    MATERIAL_NO: thisRowData[0].showValue,
                    MATERIAL_NAME: thisRowData[1].showValue,
                    UNITS: thisRowData[2].showValue,
                    QTY: thisRowData[3].showValue,
                    DETAILS_COMMENTS: thisRowData[4].showValue,
                  }
                  this.printData[item].push(thisItem)

                  if (rowIndex == rows.length - 1 && diffNum > 0) {
                    for (let i = 0; i < diffNum; i++) {
                      this.printData[item].push({
                        MATERIAL_NO: '',
                        MATERIAL_NAME: '',
                        UNITS: '',
                        QTY: '',
                        DETAILS_COMMENTS: '',
                      })
                    }
                  }
                })
              } else {
                for (let i = 0; i < diffNum; i++) {
                  this.printData[item].push({
                    MATERIAL_NO: '',
                    MATERIAL_NAME: '',
                    UNITS: '',
                    QTY: '',
                    DETAILS_COMMENTS: '',
                  })
                }
              }
            } else {
              this.printData[item] = objItem.showValue
            }
          }
        })
      })
    },
    doCreateQrCode() {
      for (let index = 0; index < this.printCardLen; index++) {
        var thisId = 'qrCodeUrl' + index
        this.creatQrCode(thisId)
      }
    },
    creatQrCode(id) {
      new QRCode(id, {
        text: this.printData.DOCUMENTNO,
        width: 100,
        height: 100,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H,
      })
    },
    formatDateTime(val) {
      if (val) {
        return moment(val).format('YYYY-MM-DD')
      }
    },
  },
}
</script>
<style lang="scss" scoped>
* {
  -webkit-print-color-adjust: exact;
}
.cardTtile {
  height: 110px;
  background-image: url(./beiqi_logo.png);
  background-repeat: no-repeat;
  background-position: 15px 0px;
  position: relative;
  -webkit-print-color-adjust: exact;

  h2 {
    text-align: center;
    font-size: 40px;
    line-height: 60px;
    color: #000;
    font-weight: bold;
    letter-spacing: 0.5em;
  }

  p {
    text-align: right;
    padding-right: 110px;
    color: #000;
    font-size: 18px;
    margin-top: 20px;
  }

  .qrcode {
    display: block;
    position: absolute;
    right: 0px;
    top: 0;
  }
}
table {
  border: 1px solid #000;
  width: 100%;
  text-align: left;
  color: #000;
  font-size: 16px;
}

table tr,
table th,
table td {
  border: 1px solid #000;
  height: 40px;
  margin: 0;
  padding: 0px 10px;
}

.no {
  text-align: center;
}

.tag {
  background-color: #afafaf;
  -webkit-print-color-adjust: exact;

  .th1 {
    width: 7% !important;
  }

  .th2 {
    width: 23% !important;
  }

  .th3 {
    width: 30% !important;
  }

  .th4 {
    width: 10% !important;
  }

  .th5 {
    width: 10% !important;
  }

  .th6 {
    width: 20% !important;
  }
}

.fg {
  border: 1px dashed #000;
  margin: 100px 0;
}
</style>

<style media="print">
@page {
  size: auto;
  margin: 1mm;
}
@media print {
  html {
    background-color: #ffffff;
    height: auto;
    margin: 0px;
    zoom: 88%;
  }
  body {
    border: solid 1px #ffffff;
    /* margin: 10mm 15mm 10mm 15mm; */
  }

  .thisPrintCard {
    margin-top: 40px;
  }

  .cardTtile {
    height: 110px;
    background-image: url(./beiqi_logo.png);
    background-repeat: no-repeat;
    background-position: 50px 0px !important;
    position: relative;
  }

  .cardTtile h2 {
    text-align: center;
    font-size: 40px;
    line-height: 60px;
    color: #000;
    font-weight: bold;
    letter-spacing: 0.5em;
  }

  .cardTtile p {
    text-align: right;
    padding-right: 180px !important;
    color: #000;
    font-size: 18px;
    margin-top: 20px !important;
  }

  .cardTtile .qrcode {
    display: block;
    position: absolute;
    right: 60px !important;
    top: 0;
  }

  #printArea table {
    table-layout: auto !important;
    width: 100% !important;
    border: solid 1px #000;
    table-layout: fixed !important;
    color: #000;
    font-size: 16px;
    padding: 10px 50px;
  }

  .th1 {
    width: 7vw !important;
  }

  .th2 {
    width: 23vw !important;
  }

  .th3 {
    width: 30vw !important;
  }

  .th4 {
    width: 10vw !important;
  }

  .th5 {
    width: 10vw !important;
  }

  .th6 {
    width: 20vw !important;
  }
}
</style>