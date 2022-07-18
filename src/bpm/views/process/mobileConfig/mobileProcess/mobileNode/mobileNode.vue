<template>
  <div id="modifyProcess">
    <el-form ref="ruleForm" label-width="120px">
      <el-row>
        <el-col :span="24">
          <el-table
            ref="multipleTable"
            :key="key"
            :data="userData.nodeFields"
            :v-loading="logding"
            border
            :header-cell-style="{'text-align':'center'}"
            style="width: 100%; margin-bottom: 10px"
            tooltip-effect="dark"
          >
            <el-table-column
              type="index"
              width="50"
            />
            <el-table-column
              prop="fieldName"
              align="center"
              :label="$t('fieldName')"
              show-overflow-tooltip
            />
            <el-table-column
              align="center"
              :label="$t('listDisplay2')"
              width="150"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.sparepage" :checked="scope.row.sparepage!=null" />
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              :label="$t('whetherEdit')"
              width="150"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.isedit" :disabled="scope.row.sparepage===null || scope.row.sparepage===false" :checked="scope.row.isedit==='Y'" />
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              :label="$t('isitRequired')"
              width="150"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.necessary" :disabled="scope.row.sparepage===null || scope.row.sparepage===false" :checked="scope.row.necessary==='Y'" />
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              :label="$t('sort')"
              width="150"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.sort" clearable />
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-form>
    <div class="text-r">
      <el-button type="primary" @click="saveForm">
        {{ $t('submit') }}
      </el-button>
    </div>
  </div>
</template>
<script>
import {
  getMobileNodeField,
  saveProcessNodeField
} from '@/bpm/api/process/mobileConfig/mobile_process'
export default {
  name: 'MobileProcess',
  props: {
    treeData: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      logding: false,
      key: Date.now(),
      options: [
        {
          value: '1',
          label: this.$t('yes')
        },
        {
          value: '-1',
          label: this.$t('no')
        }
      ],
      value: '-1',
      userData: {
      }
    }
  },
  watch: {
    treeData(val) {
      this.getData()
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    saveForm() {
      const _list = []
      this.userData.nodeFields.forEach(item => {
        if (item.sparepage != null) {
          item.sparepage = null
          if (item.necessary === true || item.necessary === 'Y') {
            item.necessary = 'Y'
          } else {
            item.necessary = 'N'
          }
          if (item.isedit === true || item.isedit === 'Y') {
            item.isedit = 'Y'
          } else {
            item.isedit = 'N'
          }
          item.fieldid = item.id
          _list.push(item)
        }
      })
      this.loading = true
      saveProcessNodeField({
        activitiname: this.treeData.name,
        nodeFields: _list,
        processname: this.userData.processname
      }).then(rt => {
        this.loading = false
        if (rt.status === '200') {
          this.$message({
            message: this.$t('hintText.saveSuccessfully'),
            type: 'success'
          })
          this.getData()
        } else {
          this.loading = false
          this.$message({
            message: this.$t('hintText.failToSave'),
            type: 'error'
          })
        }
      })
        .catch(() => {
          this.loading = false
          this.$message({
            message: this.$t('hintText.failToSave'),
            type: 'error'
          })
        })
    },
    getData() {
      this.loading = true
      getMobileNodeField({
        activitiname: this.treeData.name,
        processinfoid: this.treeData.pid,
        processnodeId: this.treeData.id
      })
        .then(rt => {
          if (rt.status === '200') {
            this.key = Date.now()
            this.userData = Object.assign({}, rt.data)
          }
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>
<style lang="scss">
#modifyProcess {
  .el-form-item__label {
    color: $tc1;
    font-size: 12px;
  }
  .el-input__inner {
    border: none;
    border-bottom: 1px solid $dc1;
  }
  .text-r {
    button {
      margin: 15px 10px;
    }
  }
}
</style>
<style lang="scss" scoped>
#modifyProcess {
  .select {
    width: calc(80% - 50px);
  }
}
</style>
