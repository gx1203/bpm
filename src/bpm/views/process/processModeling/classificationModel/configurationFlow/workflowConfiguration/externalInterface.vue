<template>
  <div id="externalInterface" v-loading="load">
    <el-row class="text-r margin-b15">
      <el-button type="primary" @click="addDialog">{{ $t('add') }}</el-button>
    </el-row>
    <el-table
      :data="content"
      class="margin-t10"
      stripe
      :header-cell-style="{ background: '#E1EAFD !important' }"
      highlight-current-row
    >
      <el-table-column
        :label="$t('number')"
        type="index"
      ></el-table-column>
      <el-table-column
        label="调用节点"
        show-overflow-tooltip
        prop="nodename"
      >
      </el-table-column>
      <el-table-column
        label="调用顺序"
        show-overflow-tooltip
        prop="callordername"
      >
      </el-table-column>
      <el-table-column
        label="服务名称"
        show-overflow-tooltip
        prop="esbservicename"
      >
      </el-table-column>
      <el-table-column
        label="请求方式"
        show-overflow-tooltip
        prop="requestmethod"
      >
      </el-table-column>
      <el-table-column
        label="服务地址"
        show-overflow-tooltip
        prop="serviceurl"
        min-width="200"
      >
      </el-table-column>
      <el-table-column :label="$t('operation')" width="60">
        <template slot-scope="scope">
          <el-tooltip :content="$t('edit')">
            <el-button type="text" icon="el-icon-edit" @click="editItem(scope.row)" />
          </el-tooltip>
          <el-tooltip :content="$t('delete')">
            <el-button type="text" icon="el-icon-delete" @click="deleteItem(scope.row.id)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="服务添加配置" width="800px" :visible.sync="dialogVisible" v-if="dialogVisible" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form label-width="110px" label-position="right" ref="serviceform" :model="serviceform" :rules="rules">
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="调用节点"
              prop="nodename"
            >
              <el-select v-model="serviceform.nodename" placeholder="请选择" style="width: 100%;">
                <el-option
                  v-for="(item, index) in nodeList"
                  :key="index"
                  :label="item.name"
                  :value="item.modelname">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="调用顺序"
              prop="callorder"
            >
              <el-select v-model="serviceform.callorder" placeholder="请选择" style="width: 100%;">
                <el-option
                  v-for="(item, index) in callorderList"
                  :key="index"
                  :label="item.text"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="服务名称"
              prop="esbservicename"
            >
              <el-input v-model="serviceform.esbservicename" @focus="serviceFocus"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="请求方式"
            >
              <el-input v-model="serviceform.requestmethod" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="服务地址"
            >
              <el-input v-model="serviceform.serviceurl" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="请求参数" name="first">
            </el-tab-pane>
            <el-tab-pane label="响应参数" name="second">
            </el-tab-pane>
          </el-tabs>
          <div v-if="plumbShow">
            <div style="overflow: hidden;" :style="{height: activeName === 'first' ? 'auto' : '0px'}">
              <plumb :leftList="leftList" :rightList="rightList" :connectData="connectData" @confirm="handleRequest" />
            </div>
            <div style="overflow: hidden;" :style="{height: activeName === 'second' ? 'auto' : '0px'}">
              <plumb :leftList="leftList2" :rightList="rightList2" :connectData="connectData2" @confirm="handleResponse" />
            </div>
          </div>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="saveService">{{ $t('confirm') }}</el-button>
      </span>
    </el-dialog>
    <choose-service v-model="serviceVisible" @confirm="handleService" />
  </div>
</template>
<script>
import { saveEsbServiceConfig, deleteEsbServiceConfig, getEsbServiceInfo } from "@/bpm/api/process/processModeling/classificationModel";
import chooseService from "@/bpm/components/service/chooseService";
import Plumb from "@/bpm/components/plumb/Plumb";
import PlumbTree from "@/bpm/components/plumb/PlumbTree";
import { jsPlumb } from 'jsplumb'
import $ from 'jquery'
export default {
  name: "ExternalInterface",
  components: {
    chooseService,
    Plumb,
    PlumbTree
  },
  props: {
    content: {
      type: Array,
    },
    treeData: {
      type: Object,
    },
    nodeList: {
      type: Array,
      default: () => {
        return []
      }
    },
    callorderList: {
      type: Array,
      default: () => {
        return []
      }
    },
    nodeData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      serviceVisible: false,
      serviceform: {
        nodename: '',
        callorder: '',
        esbservicename: '',
        requestmethod: '',
        serviceurl: ''
      },
      rules: {
        nodename: [
          { required: true, message: '请选择调用节点', trigger: ['blur', 'change'] }
        ],
        callorder: [
          { required: true, message: '请填写调用顺序', trigger: ['blur', 'change'] }
        ],
        esbservicename: [
          { required: true, message: '请选择服务名称', trigger: ['blur', 'change'] }
        ]
      },
      activeName: 'first',
      load: false,
      common: {
        isSource: true,
        isTarget: true,
        connector: 'Straight',
        endpoint: 'Dot',
        maxConnections: -1,
        anchor: 'Continuous',
        paintStyle: {
          fill: '#4caf50',
          radius: 4
        },
        hoverPaintStyle: {
          fill: 'red'
        },
        connectorStyle: {
          lineWidth: 1,
          outlineStroke: '#4caf50'
        },
        connectorHoverStyle: {
          lineWidth: 2,
          outlineStroke: 'red'
        }
      },
      leftList: [],
      leftList2: [],
      rightList: [],
      rightList2: [],
      connectData: [],
      connectData2: [],
      responseformatpath: {"path":"$.path","data":{"startRow":"$.data.startRow","navigatepageNums":"","prePage":"$.data.prePage","hasNextPage":"$.data.hasNextPage","nextPage":"$.data.nextPage","pageSize":"$.data.pageSize","endRow":"$.data.endRow","list":[{"port":"$.data.list[*].port","domainInfoDTO":{"name":"$.data.list[*].domainInfoDTO.name","description":"$.data.list[*].domainInfoDTO.description","id":"$.data.list[*].domainInfoDTO.id"},"name":"$.data.list[*].name","host":"$.data.list[*].host","fullAddress":"$.data.list[*].fullAddress","id":"$.data.list[*].id","type":"$.data.list[*].type","domainId":"$.data.list[*].domainId"}],"pageNum":"$.data.pageNum","navigatePages":"$.data.navigatePages","total":"$.data.total","navigateFirstPage":"$.data.navigateFirstPage","pages":"$.data.pages","size":"$.data.size","isLastPage":"$.data.isLastPage","hasPreviousPage":"$.data.hasPreviousPage","navigateLastPage":"$.data.navigateLastPage","isFirstPage":"$.data.isFirstPage"},"requestId":"$.requestId","timestamp":"$.timestamp","status":"$.status"},
      requestformatpath: {"orderby":"$.orderby","pageSize":"$.pageSize","fullFilters":[{"logic":"$.fullFilters[*].logic","filters":[{"logic":"$.fullFilters[*].filters[*].logic","value":"$.fullFilters[*].filters[*].value","key":"$.fullFilters[*].filters[*].key"}]}],"sort":"$.sort","attr":{"attr1":"$.attr.attr1"},"pageNum":"$.pageNum"},
      requestConnectionsList: [],
      responseConnectionsList: [],
      allRequestList: [],
      allResponseList: [],
      plumbIns1: null,
      plumbIns2: null,
      plumbShow: false
    };
  },
  watch: {
    dialogVisible: {
      handler: function(val) {
        if (val) {
          this.plumbShow = true
          console.log(this.nodeData)
          this.forEachNodeData(this.nodeData)
          this.getEsbServiceInfo(this.serviceform.esbserviceid)
        } else {
          this.activeName = 'first'
          this.plumbShow = false
          this.connectData = []
          this.connectData2 = []
          this.leftList = []
          this.leftList2 = []
          this.rightList = []
          this.rightList2 = []
        }
      }
    }
  },
  mounted() {

  },
  methods: {
    // convertData(list) {
    //   list.map()
    // },
    forEachEsbData(data, tip) {
      return Object.keys(data).map(key => {
        let child = []
        if (Object.prototype.toString.call(data[key]) === '[object Object]') {
          child = this.forEachEsbData(data[key], tip)
        } else if (Object.prototype.toString.call(data[key]) === '[object Array]') {
          if (data[key].length > 0) {
            child = this.forEachEsbData(data[key][0], tip)
          }
        }
        return {
          fieldName: Object.prototype.toString.call(data[key]) === '[object String]' ? data[key] : '',
          fieldShowName: key,
          id: Object.prototype.toString.call(data[key]) === '[object String]' ? data[key] + '-' + tip : key,
          type: 'target',
          fieldType: Object.prototype.toString.call(data[key]) === '[object String]' ? 'String' : Object.prototype.toString.call(data[key]) === '[object Object]' ? 'Object' : Object.prototype.toString.call(data[key]) === '[object Array]' ? 'Array' : '',
          isPlumb: Object.prototype.toString.call(data[key]) === '[object String]',
          child: child
        }
      })
    },
    forEachNodeData(node, list) {
      if (node.nodeTabLists) {
        node.nodeTabLists.forEach(tab => {
          this.forEachNodeData(tab, this.leftList)
        })
      }
      if (node.nodeTableLists) {
        node.nodeTableLists.forEach((table, index) => {
          if (table.inputType === 'subtable') {
            let child = table.nodeTableLists.map(el => {
              // this.$nextTick(() => {
              //   this.plumbIns1.makeSource(el.fieldName + '-' + el.id, {
              //     anchor: 'Continuous'
              //   }, this.common)
              // })

              return {
                fieldName: el.fieldName,
                fieldShowName: el.fieldShowName,
                id: el.fieldName + '-' + el.id,
                type: 'source',
                fieldType: 'String'
              }
            });
            let child2 = table.nodeTableLists.map(el => {
              // this.$nextTick(() => {
              //   this.plumbIns1.makeSource(el.fieldName + '-' + el.id + '-2', {
              //     anchor: 'Continuous'
              //   }, this.common)
              // })
              return {
                fieldName: el.fieldName,
                fieldShowName: el.fieldShowName,
                id: el.fieldName + '-' + el.id + '-2',
                type: 'source',
                fieldType: 'String'
              }
            });
            this.leftList.push({
              fieldName: table.fieldName,
              fieldShowName: table.fieldShowName,
              id: table.fieldName + '-' + table.id,
              type: 'source',
              fieldType: 'Array',
              child: child,
              isPlumb: false
            })
            this.leftList2.push({
              fieldName: table.fieldName,
              fieldShowName: table.fieldShowName,
              id: table.fieldName + '-' + table.id + '-2',
              type: 'source',
              fieldType: 'Array',
              child: child2,
              isPlumb: false
            })
          } else {
            this.leftList.push({
              fieldName: table.fieldName,
              fieldShowName: table.fieldShowName,
              id: table.fieldName + '-' + table.id,
              type: 'source',
              fieldType: 'String'
            })
            this.leftList2.push({
              fieldName: table.fieldName,
              fieldShowName: table.fieldShowName,
              id: table.fieldName + '-' + table.id + '-2',
              type: 'source',
              fieldType: 'String'
            })
            // this.$nextTick(() => {
            //   this.plumbIns1.makeSource(table.fieldName + '-' + table.id, {
            //     anchor: 'Continuous'
            //   }, this.common)
            //   this.plumbIns2.makeSource(table.fieldName + '-' + table.id + '-2', {
            //     anchor: 'Continuous'
            //   }, this.common)
            // })
            this.forEachNodeData(table, list)
          }
        })
      }
    },
    addDialog() {
      this.dialogVisible = true
      this.serviceform = {}
    },
    editItem(item) {
      this.dialogVisible = true
      this.serviceform = JSON.parse(JSON.stringify(item))
      if (this.serviceform.attributemapping) {
        let attributemapping = JSON.parse(this.serviceform.attributemapping)
        if (attributemapping) {
          this.connectData = attributemapping.Request || []
          this.connectData2 = attributemapping.Response || []
        }
      }
    },
    deleteItem(id) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        deleteEsbServiceConfig(id).then(res => {
          this.$message({
            message: this.$t('hintText.successfullyDelete'),
            type: 'success'
          })
          this.$emit('confirm')
        })
      })
    },
    handleClick() {
    },
    serviceFocus() {
      this.serviceVisible = true
    },
    handleRequest(connectionsList, allList) {
      console.log(connectionsList)
      console.log(allList)
      this.requestConnectionsList = connectionsList
      this.allRequestList = allList
      console.log(this.requestConnectionsList)
      console.log(this.allRequestList)
    },
    handleResponse(connectionsList, allList) {
      this.responseConnectionsList = connectionsList
      this.allResponseList = allList
      console.log(this.responseConnectionsList)
      console.log(this.allResponseList)
    },
    getEsbServiceInfo (id) {
      if (id) {
        getEsbServiceInfo(id).then(rt => {
          if (rt.data) {
            if (rt.data.requestformatpath) {
              this.rightList = this.forEachEsbData(JSON.parse(rt.data.requestformatpath), '1')
            }
            if (rt.data.responseformatpath) {
              this.rightList2 = this.forEachEsbData(JSON.parse(rt.data.responseformatpath), '2')
            }
          }
        })
      }
    },
    handleService (data) {
      if (data.id) {
        let that = this
        this.activeName = 'first'
        this.plumbShow = false
        this.connectData = []
        this.connectData2 = []
        this.leftList = []
        this.leftList2 = []
        this.rightList = []
        this.rightList2 = []
        this.$nextTick(() => {
          getEsbServiceInfo(data.id).then(rt => {
            if (!rt.data || rt.status !== '200') {
              this.$message.error('无服务信息！');
            }
            let rtdata = rt.data || {}
            that.$set(that.serviceform, 'esbservicename', rtdata.name || '')
            that.$set(that.serviceform, 'esbserviceid', rtdata.id || '')
            that.$set(that.serviceform, 'requestmethod', 'post')
            that.$set(that.serviceform, 'serviceurl', rtdata.unifyurls && rtdata.unifyurls.length > 0 ? rtdata.unifyurls[0] : '')
            that.$set(that.serviceform, 'schemainfos', rtdata.schemainfos || '')
            that.$set(that.serviceform, 'operation', rtdata.operation || '')
            that.connectData = []
            that.connectData2 = []
            that.rightList = []
            that.rightList2 = []
            that.rightList = rtdata.requestformatpath ? that.forEachEsbData(JSON.parse(rtdata.requestformatpath), '1') : []
            that.rightList2 = rtdata.responseformatpath ? that.forEachEsbData(JSON.parse(rtdata.responseformatpath), '2') : []
            that.forEachNodeData(that.nodeData)
            that.getEsbServiceInfo(that.serviceform.esbserviceid)
            that.plumbShow = true
            that.$forceUpdate()
          })
        })
      }
    },
    processData (connectionsList, allList) {
      return connectionsList.map(item => {
        let source = allList.find(val => val.id === item.sourceId)
        let target = allList.find(val => val.id === item.targetId)
        let key = source.type === 'source' ? source : target.type === 'source' ? target : {}
        let value = source.type === 'target' ? source : target.type === 'target' ? target : {}
        let data = {}
        if (key.fieldName) {
          data[key.fieldName] = value.fieldName
        }
        return data
      })
    },
    saveService() {
      this.$refs['serviceform'].validate(valid => {
        if (valid) {
          let request = this.processData(this.requestConnectionsList, this.allRequestList)
          let response = this.processData(this.responseConnectionsList, this.allResponseList)
          this.$set(this.serviceform, 'attributemapping', JSON.stringify({
            Request: request,
            Response: response
          }))
          console.log(this.serviceform)
          saveEsbServiceConfig({
            processid: this.treeData.id,
            ...this.serviceform
          }).then(res => {
            this.$message({
              type: 'success',
              message: this.$t("hintText.submittedSuccessfully")
            })
            this.$emit('confirm')
            this.dialogVisible = false
          })
        }
      })
    }
  }
};
</script>
<style lang="scss">
</style>
