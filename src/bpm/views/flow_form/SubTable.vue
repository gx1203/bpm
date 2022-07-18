<template>
  <div class="sub-table">
    <div v-if="!isChild" :id="'subTableHeadDom-' + item.relationType + '-' + item.fieldName" class="sub-table-head">
      <span v-if="item.isrequired === 'required' && item.editstate === 'W'" style="color: red">*</span>
      <span>{{ item.fieldShowName }}</span>
      <div class="fill" />
      <el-button v-if="!isPrint && item.export === 'Y'" type="text" class="templateButton" @click="downloadTemplate">
        模板下载
      </el-button>
      <el-upload
        v-if="!isPrint && item.editstate === 'W' && item.export === 'Y'"
        class="upload-demo"
        :action="action"
        :with-credentials="true"
        :before-upload="beforeAvatarUpload"
        accept=".xls,.xlsx"
        multiple
        :data="{
          zbqyId: this.item.id
        }"
        :on-success="uploadTemplate"
      >
        <el-button type="text" class="templateButton">
          导入
        </el-button>
      </el-upload>
      <el-button
        v-if="!isPrint && item.export === 'Y' && (nodeData.bizId || nodeData.instanceId)"
        type="text"
        class="templateButton"
        @click="exportTemplate"
      >
        导出
      </el-button>
      <el-button
        v-if="!isPrint && item.editstate === 'W'"
        :id="'subTableHeadDom-' + item.relationType + '-' + item.fieldName + '-' + 'addbutton'"
        type="text"
        icon="el-icon-circle-plus"
        @click="addSubTableItem"
      >
        {{ $t('add') }}
      </el-button>
    </div>
    <div
      :id="'subTableBody-' + item.relationType + '-' + item.fieldName"
      ref="subTableBody"
      v-loading="tableLoading"
      class="sub-table-body"
      :class="item.nodeTableLists.length > 0 ? 'border0' : ''"
    >
      <table>
        <tr>
          <th style="width: 50px">
            序号
          </th>
          <th
            v-for="(column, index1) in item.nodeTableLists"
            v-if="(column.inputType !== 'hidden' && column.editstate !== 'H') && ((item.isPopUp === '1' && column.isShowColumn ==='1') || item.isPopUp === '0' || !item.isPopUp)"
            :key="index1"
          >
            <span v-if="column.isrequired === 'required' && column.editstate === 'W'" style="color: red">*</span>
            {{ column.fieldShowName }}
          </th>
          <th v-if="!isPrint && (item.editstate === 'W' || item.isPopUp === '1')" style="width: 75px">
            <i v-if="item.editstate === 'W'" class="el-icon-circle-plus" title="添加" @click="addSubTableItem" />
          </th>
        </tr>
        <tbody v-for="(child, index1) in item.rows" :key="index1">
          <tr>
            <td>{{ (index1 + 1) * 1 }}</td>
            <td
              v-for="(column, index) in child.nodeTableLists"
              v-if="(column.inputType !== 'hidden' && column.editstate !== 'H') && ((item.isPopUp === '1' && column.isShowColumn ==='1') || item.isPopUp === '0' || !item.isPopUp)"
              :key="index"
            >
              <i
                v-if="column.inputType === 'subtable'"
                style="font-size: 18px"
                :class="column.hidden ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"
                @click="showSubTable(child.nodeTableLists, column)"
              />
              <flow-item
                v-else
                :ref="'flowitem' + column.fieldName + index1"
                :title="'flowitem' + column.fieldName + index1"
                :index="index1"
                :item="column"
                :p-item="child.nodeTableLists"
                :biz-data2="bizData2[index1]"
                :is-print="isPrint"
                :is-sub-table="true"
                :is-pop-up="item.isPopUp"
                @externalFun="externalFun($event,index1)"
              />
              <p
                v-if="errorsShow && !column.applyvalue && column.isrequired === 'required' && !isPrint"
                class="checkText"
                style="color: red"
                :title="column.fieldShowName+'不能为空'"
              >
                {{ column.fieldShowName }}
              </p>
              <p
                v-else-if="errorsShow && String(column.applyvalue).length > column.length && !isPrint"
                class="checkText"
                style="color: red"
                :title="column.fieldShowName+'不能超过'+column.length+'个字符'"
              >
                {{ column.fieldShowName }}不能超过{{ column.length }}个字符
              </p>
            </td>
            <!-- 为隐藏域时 -->
            <span v-else style="display:none">
              <flow-item
                ref="flowitem"
                :item="column"
                :p-item="child.nodeTableLists"
                :biz-data2="bizData2[index1]"
                :is-print="isPrint"
                :is-sub-table="true"
                :is-pop-up="item.isPopUp"
              />
            </span>
            <td v-if="!isPrint && (item.editstate === 'W' || item.isPopUp === '1')" style="width: 75px">
              <el-button
                v-if="item.editstate === 'W'"
                icon="el-icon-delete"
                type="text"
                :title="$t('delete')"
                style="margin: 0 10px;"
                @click="delItem(index1, child, 'deleteTable' + item.fieldName)"
              />
              <el-button
                v-if="item.editstate === 'W'"
                icon="iconfont icon-copy" 
                type="text"
                :title="$t('copy')"
                style="margin: 0 10px;"
                @click="copyItem(index1, child, 'copyTable' + item.fieldName)"
              />
              <el-button
                v-if="item.isPopUp === '1' && child.nodeTableLists.filter(el => el.editstate === 'W').length !== 0"
                icon="el-icon-edit"
                type="text"
                :title="$t('edit')"
                style="margin: 0 10px;"
                @click="editItem(child, index1)"
              />
              <el-button
                v-if="item.isPopUp === '1' && child.nodeTableLists.filter(el => el.editstate === 'W').length === 0"
                icon="el-icon-view"
                type="text"
                :title="$t('view')"
                style="margin: 0 10px;"
                @click="editItem(child, index1)"
              />
            </td>
          </tr>
          <tr
            v-for="(subtable, index2) in getInnerSubTables(child.nodeTableLists)"
            v-show="!subtable.hidden"
            :key="index2"
          >
            <td :colspan="item.nodeTableLists.length + 2">
              <transition name="el-zoom-in-top">
                <div v-show="!subtable.hidden" style="padding-left: 10px">
                  <sub-table :item="subtable" :biz-data="bizData2[index1]" is-child :is-print="isPrint" />
                </div>
              </transition>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td />
            <td v-for="(column, index1) in item.nodeTableLists" v-if="(column.inputType !== 'hidden' && column.editstate !== 'H') && ((item.isPopUp === '1' && column.isShowColumn ==='1') || item.isPopUp === '0' || !item.isPopUp)" :key="index1">
              <span v-if="column.issum === '1'">合计：{{ column.total || 0 }}</span>
            </td>
            <td v-if="!isPrint && (item.editstate === 'W' || item.isPopUp === '1')" style="width: 75px" />
          </tr>
        </tfoot>
      </table>
    </div>
    <sub-table-details
      v-model="subtableDetailsVisible"
      :item="curItem"
      :biz-data2="bizData2item"
      @confirm="handlerSubtableDetails"
    />
  </div>
</template>
<script>
import FlowItem from './FlowItem'
import moment from 'moment-mini'
import SubTableDetails from './SubTableDetails'
import axios from 'axios'
import $ from 'jquery'
import formFieldCalculation from '@/bpm/mixins/form_field_calculation'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('app')
export default {
  name: 'SubTable',
  mixins: [formFieldCalculation],
  components: {
    FlowItem,
    SubTableDetails
  },
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    bizData: {
      type: Object,
      default: () => ({})
    },
    isChild: {
      type: Boolean,
      default: false
    },
    isPrint: {
      type: Boolean
    },
    isNoStart: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      bizData2: [],
      bizData2item: {},
      subtableDetailsVisible: false,
      tableLoading: false,
      action: `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/processNodeConfig/importSubTableData`,
      curItem: {},
      curIndex: -1,

      tBodyList: [],
      startIndex: 0,
      endIndex: 10,

      index: null,
      isSubTable: true

    }
  },
  computed: {
    ...mapGetters(['errorsShow', 'nodeData'])
  },
  watch: {
    bizData: {
      handler(val) {
        if(!val)return false
        this.initData(this.item)
      }
    },
    item: {
      handler: function(val) {
         if(!val)return false
        const index = val.nodeTableLists.findIndex(el => el.islock === '1')
        this.tableColFixed('subTableBody-' + val.relationType + '-' + val.fieldName, index)
        if (
          window[`table${this.item.fieldName}`] &&
          typeof eval(window[`table${this.item.fieldName}`]) === 'function'
        ) {
          window[`table${this.item.fieldName}`](this, val.rows, this.bizData2)
        }
      },
      immediate: true,
      deep: true
    },
    'item.rows': {
      handler: function(val) {
        if (val) {
          for (let i = 0, len = this.item.nodeTableLists.length; i < len; i++) {
            const item = this.item.nodeTableLists[i]
            if (item.issum === '1') {
              let total = 0
              for (let i2 = 0, len2 = val.length; i2 < len2; i2++) {
                let applyvalue = val[i2].nodeTableLists[i].applyvalue
                if (applyvalue && (/^\d+(.\d+)?$/.test(applyvalue.replace(/,/g, '')))) {
                  applyvalue = applyvalue.replace(/,/g, '')
                }
                total += applyvalue ? Number(applyvalue) : 0
              }
              total = item.inputType === 'double' ? this.$options.filters.formatNumber(total, 2, 1) : total
              this.$set(item, 'total', total)
            }
          }
        }
      },
      immediate: true,
      deep: true
    }
    // item: {
    //   handler(val, oldVal) {
    //     console.log(val)
    //     console.log(oldVal)
    //     if (!val.rows) {
    //       this.$set(val, 'rows', [])
    //     }
    //     Object.keys(this.bizData).forEach(key => {
    //       if (key === val.fieldName) {
    //         console.log(this.bizData[key])
    //         this.bizData[key].forEach(item => {
    //           console.log(item)
    //           val.rows.push({
    //             nodeTableLists: JSON.parse(JSON.stringify(val.nodeTableLists))
    //           })
    //         })
    //       }
    //     })
    //   },
    //   immediate: true
    // }
  },
  mounted() {
    this.initData(this.item)
     if(!this.item)return false
    const that = this
    const index = this.item.nodeTableLists.findIndex(el => el.islock === '1')
    $(`#${'subTableBody-' + this.item.relationType + '-' + this.item.fieldName}`).scroll(function() {
      that.tableColFixed('subTableBody-' + that.item.relationType + '-' + that.item.fieldName, index)
    })
  },
  methods: {
    getFormDataIsNull(node, data) {
      if (node.nodeTabLists) {
        node.nodeTabLists.forEach(tab => {
          this.getFormDataIsNull(tab, data)
        })
      }
      if (node.rows) {
        data[node.fieldName] = []
        // data['tableName'] = node.relationType
        node.rows.forEach(row => {
          const rowData = {}
          data[node.fieldName].push(rowData)
          this.getFormDataIsNull(row, rowData)
        })
      } else if (node.nodeTableLists) {
        node.nodeTableLists.forEach(table => {
          // if (table.applyvalue) {
          if (table.inputType === 'date' || table.inputType === 'date-edit') {
            data[table.fieldName] = table.applyvalue
              ? moment(table.applyvalue).format('YYYY-MM-DD')
              : ''
          } else if (
            table.inputType === 'time' ||
            table.inputType === 'time-edits'
          ) {
            data[table.fieldName] = table.applyvalue
              ? moment(table.applyvalue).format('YYYY-MM-DD HH:mm:ss')
              : ''
          } else if (table.inputType === 'double') {
            if (table.applyvalue) {
              data[table.fieldName] = String(
                this.$options.filters.delcommafy(table.applyvalue)
              )
            }
          } else if (table.inputType === 'search-switch') {
            if (table.applyvalue) {
              data[table.fieldName] = ''
            }
          } else if (table.inputType === 'nokt') {
            if (table.applyvalue) {
              data[table.fieldName] = table.value
            }
          } else {
            data[table.fieldName] = table.applyvalue
          }
          this.getFormDataIsNull(table, data)
        })
      }
    },
    externalFun(type, i) {
      // this.$emit('externalFun', type)
      const data = {}
      this.getFormDataIsNull(this.item, data)
      if (window[type] && typeof eval(window[type]) === 'function') {
        window[type](this, data, i, this.bizData2, this.item.rows)
      }
    },
    initData(val) {
      this.$set(val, 'rows', [])
      this.tBodyList = []
      // let bizData =  Object.keys(this.bizData)
      // this.bizData2 = this.bizData[key]
      if(!this.bizData) return false
      if (!this.bizData[val.fieldName]) {
        return
      }
      this.bizData2 = this.bizData[val.fieldName]
      const _nodeTableLists = JSON.parse(
        JSON.stringify(val.nodeTableLists)
      )
      for (let index = 0, lengh = this.bizData2.length; index < lengh; index++) {
        // if (index < 10) {
        _nodeTableLists.forEach(el => {
          if (el.childnodeoptions && el.childnodeoptions.length > 0) {
            el.nodeoptions = el.childnodeoptions[index]
          }
        })
        this.tBodyList.push(JSON.parse(
          JSON.stringify({
            nodeTableLists: _nodeTableLists
          })
        ))
        // }
      }
      // 数据过滤  生成表格数据
      if (this.tBodyList && this.tBodyList.length > 0) {
        var that = this
        that.endIndex = 10
        that.startIndex = 0
        var t = setInterval(function() {
          for (that.startIndex; that.startIndex < that.endIndex && that.startIndex < that.tBodyList.length; that.startIndex++) {
            if (!that.tBodyList[that.startIndex].isShow) {
              val.rows.push(that.tBodyList[that.startIndex])
            }
          }
          if (that.endIndex >= that.tBodyList.length) {
            clearInterval(t)
          }
          that.endIndex = that.endIndex + 10
        }, 10)
      }
      this.$forceUpdate()
      // Object.keys(this.bizData).forEach(key => {
      //   if (key === val.fieldName) {
      //     this.bizData2 = this.bizData[key]
      //     this.bizData[key].forEach((item, index) => {
      //       if (index < 10) {
      //         let _nodeTableLists = JSON.parse(
      //           JSON.stringify(val.nodeTableLists)
      //         )
      //         _nodeTableLists.forEach(el => {
      //           if (el.childnodeoptions && el.childnodeoptions.length > 0) {
      //             el.nodeoptions = el.childnodeoptions[index]
      //           }
      //         })
      //         val.rows.push({
      //           nodeTableLists: _nodeTableLists
      //         })
      //       }
      //     })
      //   }
      // })
    },
    getInnerSubTables(list) {
      const arr = []
      list.forEach(item => {
        if (item.inputType === 'subtable') {
          arr.push(item)
        }
      })
      return arr
    },
    editItem(item, index) {
      this.$nextTick(() => {
        this.curIndex = index
        this.curItem = item
        this.$set(this.curItem, 'fieldcol', this.item.fieldcol)
        this.bizData2item = this.bizData2[this.curIndex]
        this.subtableDetailsVisible = true
        this.$forceUpdate()
      })
    },
    addSubTableItem() {
      const newItem = JSON.parse(JSON.stringify(this.item.nodeTableLists))
      this.$nextTick(() => {
        if (this.item.isPopUp === '1') {
          this.curIndex = -1
          this.$set(this.curItem, 'nodeTableLists', newItem)
          this.$set(this.curItem, 'fieldcol', this.item.fieldcol)
          this.bizData2item = {}
          // newItem.forEach(item => {
          //   if (item.inputType === 'subtable') {
          //     this.$set(this.bizData2item, item.fieldName, [])
          //   } else {
          //     this.$set(this.bizData2item, item.fieldName, {
          //       value: null,
          //       showValue: null
          //     })
          //   }
          // })
          this.subtableDetailsVisible = true
        } else {
          this.addItem(newItem)
          this.item.rows.push({
            nodeTableLists: newItem
          })
        }
      })
    },
    handlerSubtableDetails(data) {
      if (this.curIndex === -1) {
        this.addItem(data.nodeTableLists)
        this.item.rows.push(data)
      } else {
        this.$set(this.item.rows, this.curIndex, data)
        this.setItem(data.nodeTableLists)
      }
      this.$forceUpdate()
    },
    addItem(newItem) {
      const keyArr = {}
      newItem.forEach(item => {
        if (item.inputType === 'subtable') {
          this.$set(keyArr, item.fieldName, [])
        } else {
          this.$set(keyArr, item.fieldName, {
            value: null,
            showValue: null
          })
        }
      })
      this.bizData2.push(keyArr)
    },
    setItem(newItem) {
      const keyArr = {}
      newItem.forEach(item => {
        if (item.inputType !== 'subtable') {
          this.$set(keyArr, item.fieldName, {
            value: item.applyvalue,
            showValue: item.showValue
          })
        }
      })
      this.$set(this.bizData2, this.curIndex, keyArr)
    },
    delItem(index, item, type) {
      const rows = JSON.parse(JSON.stringify(this.item.rows))
      const _list = JSON.parse(JSON.stringify(this.item.rows[index].nodeTableLists))
      const bool = false
      const than = this
      rows.splice(index, 1)
      than.bizData2.splice(index, 1)
      than.item.rows.splice(index, 1)
      than.delTableFun(type, item, index)

      this.item.nodeTableLists.forEach(val => {
        if (val.fieldCalculations && val.fieldCalculations.length > 0) {
          this.isCalculation(val)
        }
      })

      // for (let i = 0; i < _list.length; i++) {
      //   if (_list[i].event && _list[i].eventtype) {
      //     than.externalFun(_list[i].event)
      //   }
      // }
    },
    copyItem(index, item, type){
      console.log(item)
      const rows = JSON.parse(JSON.stringify(this.item.rows))
      console.log(rows)
      rows.push(item)
      this.$set(this.item, 'rows', rows)
    },
    delTableFun(type, tableitem, tableindex) {
      const data = {}
      this.getFormDataIsNull(this.item, data)
      if (window[type] && typeof eval(window[type]) === 'function') {
        window[type](this, data, tableitem, tableindex)
      }
    },
    showSubTable(list, subtable) {
      this.getInnerSubTables(list).forEach(item => {
        console.log(item)
        if (item.id === subtable.id) {
          this.$set(item, 'hidden', !item.hidden)
        }
      })
    },
    downloadTemplate() {
      axios({
        method: 'post',
        url: `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/processNodeConfig/subTemplateDownLoad/${this.item.id}`,
        data: {},
        responseType: 'blob'
      }).then(rt => {
        const blob = new Blob([rt.data], { type: 'application/vnd.ms-excel' })
        if (window.navigator && window.navigator.msSaveOrOpenBlob) { // 兼容TMD IE
          navigator.msSaveBlob(blob, `${this.item.fieldShowName || '子表导出'}.xls`)
        } else { // 其他浏览器
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', `${this.item.fieldShowName || '子表导出'}.xls`)
          document.body.appendChild(link)
          link.click()
          window.URL.revokeObjectURL(link.href) // 释放掉blob对象
        }
      })
    },
    exportTemplate() {
      const formData = new FormData()
      formData.append('zbqyId', this.item.id)
      if (this.nodeData.instanceId) {
        formData.append('exportType', 'process')
        formData.append('instId', this.nodeData.instanceId)
      } else {
        formData.append('exportType', 'other')
        formData.append('bizId', this.nodeData.bizId)
      }
      axios({
        method: 'post',
        url: `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/processNodeConfig/exportSubTableData`,
        data: formData,
        responseType: 'blob'
      }).then(rt => {
        const blob = new Blob([rt.data], { type: 'application/vnd.ms-excel' })
        if (window.navigator && window.navigator.msSaveOrOpenBlob) { // 兼容TMD IE
          navigator.msSaveBlob(blob, `${this.item.fieldShowName || '子表导出'}.xls`)
        } else { // 其他浏览器
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', `${this.item.fieldShowName || '子表导出'}.xls`)
          document.body.appendChild(link)
          link.click()
          window.URL.revokeObjectURL(link.href) // 释放掉blob对象
        }
      }).catch(err => {
        this.$message.error('导出失败!')
      })
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 100
      if (!isLt2M) {
        this.$message.error('上传附件大小不能超过 100MB!')
      } else {
        this.tableLoading = true
      }
      return isLt2M
    },
    uploadTemplate(res) {
      this.tableLoading = false
      if (res) {
        if (res.status === '200') {
          if (res.data) {
            res.data.forEach(item => {
              const newItem = JSON.parse(JSON.stringify(this.item.nodeTableLists))
              newItem.forEach(val => {
                if (item[val.fieldName] && item[val.fieldName].option && item[val.fieldName].option.length > 0) {
                  this.$set(val, 'nodeoptions', item[val.fieldName].option)
                }
              })
              this.item.rows.push({
                type: 'new',
                nodeTableLists: newItem
              })
              this.bizData2.push(item)
            })
            this.$nextTick(() => {
              this.item.rows.forEach((item, index) => {
                item.nodeTableLists.forEach(val => {
                  if (val.fieldCalculations && val.fieldCalculations.length > 0) {
                    this.index = index
                    this.isCalculation(val)
                  }
                })
              })
            })
            const data = {}
            this.getFormDataIsNull(this.item, data)
            if (window[`uploadTemplate${this.item.fieldName}`] && typeof eval(window[`uploadTemplate${this.item.fieldName}`]) === 'function') {
              window[`uploadTemplate${this.item.fieldName}`](this, this.item.rows, data, this.bizData2)
            }
          }
        } else {
          this.$message.error('导入模板与子表字段不匹配，请重新确认模板！')
          // this.$message.error(res.message);
        }
      }
    },
    tableColFixed(id, index) {
      this.$nextTick(() => {
        if ($(`#${id}`)) {
          if (index >= 0) {
            const indexArr = this.item.nodeTableLists.filter((item, i) => i <= index).map((item, i) => i + 2)
            const indexAll = [1, ...indexArr]
            indexAll.forEach((item) => {
              $(`#${id}>table>tr:first-child>:nth-child(${item})`).addClass('positionStyle')
              $(`#${id}>table>tr:first-child>:nth-child(${item})`).css('left', $(`#${id}`).scrollLeft() > 0 ? $(`#${id}`).scrollLeft() - 1 : 0)

              $(`#${id}>table>tbody>tr:first-child>:nth-child(${item})`).addClass('positionStyle')
              $(`#${id}>table>tbody>tr:first-child>:nth-child(${item})`).css('left', $(`#${id}`).scrollLeft() > 0 ? $(`#${id}`).scrollLeft() - 1 : 0)
              // if (item === indexAll.length) {
              if ($(`#${id}`).scrollLeft() > 0) {
                $(`#${id}>table>tr:first-child>:nth-child(${item})`).addClass('lefttdshadow')
                $(`#${id}>table>tbody>tr:first-child>:nth-child(${item})`).addClass('lefttdshadow')
              } else {
                $(`#${id}>table>tr:first-child>:nth-child(${item})`).removeClass('lefttdshadow')
                $(`#${id}>table>tbody>tr:first-child>:nth-child(${item})`).removeClass('lefttdshadow')
              }
              // }
            })
          }
        }
      })
    }
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
.sub-table {
  /*display: table-cell;*/
  vertical-align: middle;
  padding-right: 10px;
  width: 100%;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  -ms-box-sizing: border-box;
  box-sizing: border-box;
  &-head {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .templateButton {
      padding: 0;
      margin-right: 10px;
    }
    .fill {
      flex-grow: 1;
    }
  }
  &-body {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    overflow-x: auto;
    // border: solid 1px $dc1;
    table {
      min-width: 100%;
      table-layout: fixed;
      border-collapse: collapse;
    }
    th {
      background: #f5f5f5;
      padding: 7px 10px;
      text-align: center;
      border: 1px solid #ebeef5;
      position: relative;
      box-sizing: border-box;
    }
    tbody {
      td {
        text-align: center;
        padding: 10px 5px;
        border: 1px solid #ebeef5;
        position: relative;
        box-sizing: border-box;
        /deep/ .el-input {
          text-align: center;
          input {
            min-width: 100%;
            text-align: center;
          }
        }
        .checkText {
          width: 90%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          position: absolute;
          bottom: 2px;
          font-size: 12px;
        }
      }
    }
    tfoot {
      td {
        padding: 5px 0;
        text-align: center;
        color: red;
      }
    }
    /deep/ .positionStyle {
      z-index: 2;
    }
    /deep/ .lefttdshadow {
      box-shadow: 5px 2px 8px -1px rgba(0, 0, 0, 0.12);
    }
    /deep/ .righttdshadow {
      box-shadow: -1px 6px 8px 0px rgba(0, 0, 0, 0.12);
    }
    /deep/ td.positionStyle {
      background-color: #ffffff;
    }
  }
  .upload-demo {
    /deep/ .el-upload-list {
      display: none;
    }
  }
}
</style>
