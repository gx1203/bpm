<template>
  <el-card v-loading="load" class="route">
    <!-- <el-button @click="handleSave" type="primary" style="margin-bottom:10px;">{{ $t('save') }}</el-button> -->
    <h2>{{ $t('processNodeRouting') }}</h2>
    <el-row v-for="(item, index) in content.grabInfos" :key="index" :gutter="50">
      <el-col :span="8">
        <p v-if="index === 0">
          {{ $t('currentActivity') }}
        </p>
        <el-input v-model="item.sourceActivity.name" disabled type="text" />
      </el-col>
      <el-col :span="8">
        <p v-if="index === 0">
          <i style="color: #ea3c40;margin-right: 4px;">*</i>{{ $t('newEvent') }}
        </p>
        <el-select v-model="item.sourceActivity.targetName" :placeholder="$t('placeholderText.pleaseSelect')">
          <el-option
            v-for="val in item.targetActivityList"
            :key="val.name"
            :label="val.name"
            :value="val.name"
          />
        </el-select>
      </el-col>
    </el-row>
    <h2>{{ $t('dataObject') }}</h2>
    <el-row v-for="(item, index) in list" :key="index" :gutter="50" v-if="item.enname && item.enname !== 'subject' && item.enname !== 'businessrule' && item.enname !== '${applyuser}' && item.enname !== 'reqNo' && item.enname !== 'taskId' && item.enname !== 'index'">
      <el-col :span="8">
        <p v-if="index === 0">
          {{ $t('name2') }}
        </p>
        <el-input v-model="item.enname" disabled type="text" />
      </el-col>
      <el-col :span="8">
        <p v-if="index === 0">
          {{ $t('chineseName') }}
        </p>
        <el-input v-model="item.cnname" disabled type="text" />
      </el-col>
      <el-col :span="8">
        <p v-if="index === 0">
          {{ $t('value2') }}
        </p>
        <el-input v-model="item.value" type="text" @click.native="selectPeople(index)" />
      </el-col>
    </el-row>
    <el-button type="primary" @click="handleSave">
      {{ $t('save') }}
    </el-button>
    <h2 class="margin-t20">
      {{ $t('businessRule') }}
    </h2>
    <el-table
      :data="content.brlist"
      class="margin-t10"
      stripe
      :header-cell-style="{'text-align':'center',background: '#E1EAFD !important'}"
      :cell-style="{'text-align':'center'}"
      highlight-current-row
      current-row-key="id"
    >
      <el-table-column :label="$t('name')" show-overflow-tooltip prop="name" />
      <el-table-column :label="$t('description')" show-overflow-tooltip prop="description" />
    </el-table>
    <h2 class="margin-t20">
      {{ $t('approvalRecord') }}
    </h2>
    <el-table
      :data="approvalRecordList"
      class="margin-t10"
      stripe
      :header-cell-style="{background: '#E1EAFD !important'}"
      highlight-current-row
      current-row-key="id"
    >
      <el-table-column
        prop="processnodename"
        :label="$t('node')"
        width="110"
        show-overflow-tooltip
      />
      <el-table-column
        prop="usernames"
        width="100"
        :label="$t('name')"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="usernames"
        width="120"
        :label="$t('startTime')"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ scope.row.startdate | formatDateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="usernames"
        width="120"
        :label="$t('endTime')"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ scope.row.createdate | formatDateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="approvalUseDate"
        width="90"
        :label="$t('processingTime')"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="reason"
        :label="$t('approvalOpinion')"
        show-overflow-tooltip
      />
      <el-table-column
        prop="result"
        :label="$t('action2')"
        align="center"
        width="120"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        :label="$t('approvalTime')"
        width="90"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span :class="scope.row.isexpire ? 'urge' : ''">{{ scope.row.approvalUseDate }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createdate"
        align="center"
        :label="$t('time')"
        width="120"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ scope.row.createdate | formatDateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="reason"
        :label="$t('handlingOpinions')"
        align="center"
        show-overflow-tooltip
      />
    </el-table>
    <bas-organieation
      v-model="organieationShow"
      :selected-element="selectedElement"
      :is-specified-group-but="false"
      :is-show-bustom-groups-but="false"
      :select-element="selectElement"
      :show-element="showElement"
      :title="orgtitle"
      @fnCallBack="fnBasOrganieationCallBack"
    />
  </el-card>
</template>

<script>
import Vue from 'vue'
import {
  routingInfoDetail,
  routed
} from '@/bpm/api/process/administrativeTool/flowManagement'
import {
  getApprovalRecord
} from '@/bpm/api/app'
import BasComponent from 'bas-component'
import 'bas-component/lib/BasComponent.css'
Vue.use(BasComponent)
export default {
  data() {
    return {
      organieationShow: false,
      selectedElement: {},
      showElement: [],
      selectElement: ['9'],
      orgtitle: this.$t('placeholderText.selectAgent'),
      load: false,
      content: {},
      value: '',
      approvalRecordList: [],
      list: [],
      selectIndex: ''
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    // 选人组件
    selectPeople(index) {
      console.log(23532534)
      this.selectIndex = index
      this.selectedElement = {}
      if (this.list[index].value) {
        if (this.list[index].valueId) {
          const list = this.list[index].value.split(',').join('&')
          const idType = []
          this.list[index].valueId.split(',').forEach((item, i) => {
            idType.push(`${item}-9`)
          })
          this.selectedElement = {
            id: this.list[index].valueId.split(','),
            name: list,
            idType: idType.join(';')
          }
        }
      }
      this.organieationShow = true
    },
    fnBasOrganieationCallBack(data) {
      this.list[this.selectIndex].value = data.name.split('&').join(',')
      this.list[this.selectIndex].valueId = data.id
      this.organieationShow = false
    },
    handleSave() {
      const dataList = this.content.grabInfos
      console.log(dataList)
      for (let i = 0; i < dataList.length; i++) {
        const dataList1 = dataList[i].sourceActivity
        console.log(dataList1)
        if (!('targetName' in dataList1)) {
          this.$message.warning(this.$t('newEvent') + ' ' + this.$t('hintText.canNotEmpty'))
          return
        }
      }
      const routeSources = []
      const variables = []
      this.content.grabInfos.forEach(e => {
        routeSources.push({
          sourceName: e.sourceActivity.name,
          targetName: e.sourceActivity.targetName
        })
      })
      this.list.forEach(e => {
        variables.push({
          keyname: e.enname,
          keyvalue: e.valueId
        })
      })
      this.load = true
      routed({
        instanceId: this.$route.query.instanceId,
        routeSources: routeSources,
        variables: variables
      })
        .then(rt => {
          this.load = false
          if (rt.status === '200') {
            this.$message.success(this.$t('hintText.operateSuccessfully'))
          }
        })
        .catch(er => {
          this.load = false
        })
    },
    getData() {
      const than = this
      than.load = true
      routingInfoDetail(this.$route.query.instanceId)
        .then(rt => {
          rt.data.grabInfoVariablesList.forEach((item, key) => {
            for (const key in item) {
              const data = item[key].split(',')
              const dataList = data.map(i => {
                return i.split('@@')[1]
              })
              const dataList1 = data.map(i => {
                return i.split('@@')[0]
              })
              than.list.push({
                enname: key.split('_')[0],
                cnname: key.split('_')[1],
                value: dataList.join(),
                valueId: dataList1.join()
              })
            }
          })
          than.content = rt.data
          return getApprovalRecord(this.$route.query.instanceId)
        }).then(rt => {
          this.load = false
          if (rt.status === '200') {
            rt.data.forEach(item => {
              item.usernames = item.username
              if (item.attribute1 && item.attribute1 !== item.userid) {
                item.usernames = `${item.username}-代-${item.grantorName}`
              }
            })
            this.approvalRecordList = rt.data
          }
        })
        .catch(er => {
          than.load = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  .route {
    & /deep/ .el-input {
      margin-bottom: 10px;
    }
    h2 {
      font-size: 16px;
    }
    p {
      margin: 10px 0;
    }
  }
</style>
