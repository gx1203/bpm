<template>
  <div class="process-framework-authority-container">
    <el-row>
      <el-col :span="12">
        <bas-search
          :placeholder="$t('name') + '、' + $t('type')"
          v-model="searchData"
          @fnSearch="search"
        />
      </el-col>
      <el-col :span="12" class="text-r">
        <el-button type="primary" @click="isHighSearch = !isHighSearch"
          >{{ $t('advancedQuery') }}
          <i
            :class="isHighSearch ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"
          ></i>
        </el-button>
      </el-col>
    </el-row>
    <el-collapse-transition>
      <!-- 高级搜索表格 -->
      <el-form
        v-show="isHighSearch"
        class="search_options_wrap"
        :model="searchForm"
        label-width="100px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('name')">
              <el-input v-model="searchForm.relatedname" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('type')">
              <el-input v-model="searchForm.relatedtypename" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <div class="search_buttons_wrap">
          <el-button type="primary" @click="search('high')"
            >{{ $t('search') }}
          </el-button>
          <el-button type="primary" @click="reset()"
            >{{ $t('reset') }}
          </el-button>
        </div>
      </el-form>
    </el-collapse-transition>
    <el-row class="margin-b10 text-r">
      <el-button
        type="primary"
        :disabled="!this.selectMenuId"
        @click="referMenuSelect('organization')"
        >{{ $t('edit') }}</el-button
      >
    </el-row>
    <el-table :data="tableOrgData" stripe class="main_tab">
      <!-- 序号 -->
      <el-table-column :label="$t('number')" type="index"></el-table-column>

      <!-- 名称 -->
      <el-table-column :label="$t('name')" min-width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.relatedname }}</span>
        </template>
      </el-table-column>

      <!-- 类型 -->
      <el-table-column :label="$t('type')" min-width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.relatedtypename }}</span>
        </template>
      </el-table-column>

      <!-- 业务设计平台可见权限 -->
      <el-table-column align="center" min-width="160">
        <template slot="header" slot-scope="scope">
          <el-checkbox
            :disabled="isOrgDisabled"
            :indeterminate="orgManageIsIndeterminate"
            :value="orgFields.rulemanagementlookover"
            @change="checkboxChanged('rulemanagementlookover', $event)"
            >{{ $t('businessDesignPlatformVisibilityPermissions') }}</el-checkbox
          >
        </template>
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.rulemanagementlookover"
            @change="updateStatus(scope.row, 'rulemanagementlookover')"
          ></el-switch>
        </template>
      </el-table-column>

      <!-- 业务展示平台可见权限 -->
      <el-table-column align="center" min-width="160">
        <template slot="header" slot-scope="scope">
          <el-checkbox
            :disabled="isOrgDisabled"
            :indeterminate="orgViewIsIndeterminate"
            :value="orgFields.rulecommunitylookover"
            @change="checkboxChanged('rulecommunitylookover', $event)"
            >{{ $t('businessDisplayPlatformVisibilityPermissions') }}</el-checkbox
          >
        </template>
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.rulecommunitylookover"
            @change="updateStatus(scope.row, 'rulecommunitylookover')"
          ></el-switch>
        </template>
      </el-table-column>

      <!-- 添加 -->
      <el-table-column align="center">
        <template slot="header" slot-scope="scope">
          <el-checkbox
            :disabled="isOrgDisabled"
            :indeterminate="orgAdderIsIndeterminate"
            :value="orgFields.adder"
            @change="checkboxChanged('adder', $event)"
            >{{ $t('add') }}</el-checkbox
          >
        </template>
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.adder"
            @change="updateStatus(scope.row, 'adder')"
          ></el-switch>
        </template>
      </el-table-column>

      <!-- 删除 -->
      <el-table-column align="center">
        <template slot="header" slot-scope="scope">
          <el-checkbox
            :disabled="isOrgDisabled"
            :indeterminate="orgDeleterIsIndeterminate"
            :value="orgFields.deleter"
            @change="checkboxChanged('deleter', $event)"
            >{{ $t('delete') }}</el-checkbox
          >
        </template>
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.deleter"
            @change="updateStatus(scope.row, 'deleter')"
          ></el-switch>
        </template>
      </el-table-column>

      <!-- 修改 -->
      <el-table-column align="center">
        <template slot="header" slot-scope="scope">
          <el-checkbox
            :disabled="isOrgDisabled"
            :indeterminate="orgUpdaterIsIndeterminate"
            :value="orgFields.updater"
            @change="checkboxChanged('updater', $event)"
            >{{ $t('edit') }}</el-checkbox
          >
        </template>
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.updater"
            @change="updateStatus(scope.row, 'updater')"
          ></el-switch>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column :label="$t('operation')">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            :enterable="false"
            effect="dark"
            :content="$t('delete')"
            placement="top"
          >
            <el-button type="text" @click="remove(scope.row)">{{
              $t('delete')
            }}</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <bas-organieation
      v-model="organieationShow"
      :selectedElement="selectedElement"
      :isSpecifiedGroupBut="false"
      :isShowBustomGroupsBut="false"
      :selectElement="selectElement"
      :showElement="showElement"
      :load="false"
      :multiple="basOrganieationMultiple"
      @fnCallBack="fnBasOrganieationCallBack"
    />
  </div>
</template>

<script>
import {
  getNodePermissions,
  deleteOrganization,
  checkAll,
  updateStatus,
  saveProcessFrameworkAuth
} from '@/bpa/api/settings/processFrameworkAuthority'

export default {
  props: {
    selectMenuId: {
      type: String,
      required: true
    },
    selectMenuName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isHighSearch: false,
      searchForm: {},
      filters: [],
      
      searchData: '',
      tableOrgData: [],
      selectedData: [],
      isIndeterminate: true,

      orgFields: {
        rulecommunitylookover: false,
        rulemanagementlookover: false,
        adder: false,
        deleter: false,
        updater: false
      },

      //  	选人组件相关
      organieationShow: false,
      selectedElement: {},
      selectElement: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
      showElement: [
        {
          key: '1',
          name: this.$t('OrganizationalTree')
        },
        {
          key: '8',
          name: this.$t('role')
        }
      ],
      basOrganieationMultiple: true
    }
  },
  computed: {
    isOrgDisabled() {
      return this.tableOrgData.length === 0
    },
    orgViewIsIndeterminate() {
      const length = this.tableOrgData.filter(
        item => item.rulecommunitylookover === true
      ).length
      return this.tableOrgData.length !== length && length > 0
    },
    orgManageIsIndeterminate() {
      const length = this.tableOrgData.filter(
        item => item.rulemanagementlookover === true
      ).length
      return this.tableOrgData.length !== length && length > 0
    },
    orgAdderIsIndeterminate() {
      const length = this.tableOrgData.filter(item => item.adder === true)
        .length
      return this.tableOrgData.length !== length && length > 0
    },
    orgDeleterIsIndeterminate() {
      const length = this.tableOrgData.filter(item => item.deleter === true)
        .length
      return this.tableOrgData.length !== length && length > 0
    },
    orgUpdaterIsIndeterminate() {
      const length = this.tableOrgData.filter(item => item.updater === true)
        .length
      return this.tableOrgData.length !== length && length > 0
    }
  },
  watch: {
    selectMenuId: {
      handler (val) {
        if (this.selectMenuId) {
          this.getTableList()
        }
      },
      immediate: true
    }
  },
  methods: {
    // 搜索的点击事件
    search(type) {
      if (type === 'high') {
        this.filters = [
          {
            key: 'relatedname',
            opt: 'LIKE',
            type: 'S',
            logic: 'and',
            value: this.searchForm.relatedname
          },
          {
            key: 'relatedtypename',
            opt: 'LIKE',
            type: 'S',
            logic: 'and',
            value: this.searchForm.relatedtypename
          }
        ]
      } else {
        this.filters = [
          {
            key: 'relatedname',
            opt: 'LIKE',
            type: 'S',
            logic: 'or',
            value: this.searchData
          },
          {
            key: 'relatedtypename',
            opt: 'LIKE',
            type: 'S',
            logic: 'or',
            value: this.searchData
          }
        ]
      }
      this.getTableList()
    },
    reset() {
      this.searchForm = Object.assign({}, this.searchForm, {
        relatedname: '',
        relatedtype: ''
      })
      this.filters = [
        {
          key: 'relatedname',
          opt: 'LIKE',
          type: 'S',
          logic: 'or',
          value: this.searchData
        },
        {
          key: 'relatedtypename',
          opt: 'LIKE',
          type: 'S',
          logic: 'or',
          value: this.searchData
        }
      ]
      this.getTableList()
    },
    // 全选和取消全选
    async checkboxChanged(type, value) {
      console.log(type, value)
      this.orgFields[type] = value
      const formData = {
        modelid: this.selectMenuId,
        [type]: value ? 1 : 0
      }
      const res = await checkAll(formData, type)
      if (res) {
        this.$message.success('更新成功')
        this.getTableList()
      }
    },

    // 更新一条数据
    async updateStatus(rowData, field) {
      console.log(rowData, field)
      const formData = JSON.parse(JSON.stringify(rowData))
      formData.adder = formData.adder ? 1 : 0
      formData.deleter = formData.deleter ? 1 : 0
      formData.lookover = formData.lookover ? 1 : 0
      formData.updater = formData.updater ? 1 : 0
      formData.rulecommunitylookover = formData.rulecommunitylookover ? 1 : 0
      formData.rulemanagementlookover = formData.rulemanagementlookover ? 1 : 0
      console.log(formData)
      const res = await updateStatus(formData)
      console.log(res)
      if (res) {
        this.$message.success('更新成功')
        this.getTableList()
      } else {
        this.$message.error('更新失败')
        rowData[field] = !rowData[field]
      }
    },

    // 获取table数据
    async getTableList() {
      let queryData = {
        fullFilters: [
          {
            filters: [
              { key: 'modelid', opt: 'EQ', type: 'S', value: this.selectMenuId }
            ],
            logic: 'and'
          },
          {
            filters: this.filters,
            logic: 'and'
          }
        ],
        logic: 'and',
        pageNum: 1,
        pageSize: 10000
      }
      const res = await getNodePermissions(queryData)
      if (!res) {
        return this.$message.error('获取列表数据失败')
      }
      this.tableOrgData = res.list
      this.orgFields.rulecommunitylookover =
        this.tableOrgData.filter(item => item.rulecommunitylookover).length ===
          this.tableOrgData.length && this.tableOrgData.length > 0
      this.orgFields.rulemanagementlookover =
        this.tableOrgData.filter(item => item.rulemanagementlookover).length ===
          this.tableOrgData.length && this.tableOrgData.length > 0
      this.orgFields.adder =
        this.tableOrgData.filter(item => item.adder).length ===
          this.tableOrgData.length && this.tableOrgData.length > 0
      this.orgFields.updater =
        this.tableOrgData.filter(item => item.updater).length ===
          this.tableOrgData.length && this.tableOrgData.length > 0
      this.orgFields.deleter =
        this.tableOrgData.filter(item => item.deleter).length ===
          this.tableOrgData.length && this.tableOrgData.length > 0
    },
    // 添加的按钮点击事件
    referMenuSelect(type) {
      if (!this.selectMenuId) {
        this.$message({
          message: this.$t('hintText.pleaseSelectAMenuToProceed'),
          type: 'warning'
        })
        return false
      }
      if (this.tableOrgData.length > 0) {
        this.selectedElement = {
          id: this.tableOrgData.map(item => item.relatedid).join(','),
          name: this.tableOrgData.map(item => item.relatedname).join('&'),
          idType: this.tableOrgData
            .map(item => {
              return `${item.relatedid}-${item.relatedtype}`
            })
            .join(';')
        }
      } else {
        this.selectedElement = {}
      }
      this.organieationShow = true
    },

    // 删除
    remove(rowData) {
      this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await deleteOrganization(rowData.id)
          console.log(res)
          if (res) {
            this.$message.success('删除成功')
            this.getTableList()
          } else {
            this.$message.error('删除失败')
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    fnBasOrganieationCallBack(data) {
      let subRelated = []
      if (data.idType) {
        let dataList = data.idType.split(';')
        dataList.forEach(val => {
          if (val.indexOf('-') == 0) {
            // 目前有些数据id为负数
            val = val.slice(1)
            let val0 = val.split('-')[0]
            let val1 = val.split('-')[1]
            // if (
            //   !this.tableOrgData
            //     .map(item => item.relatedid)
            //     .includes('-' + val0)
            // ) {
              subRelated.push({
                isDelete: false,
                modelid: this.selectMenuId,
                relatedtype: val1,
                relatedid: '-' + val0,
                lookover: true,
                adder: true,
                updater: true,
                deleter: true,
                rulemanagementlookover: true,
                rulecommunitylookover: true
              })
            // }
          } else {
            let val0 = val.split('-')[0]
            let val1 = val.split('-')[1]
            // if (!this.tableOrgData.map(item => item.relatedid).includes(val0)) {
              subRelated.push({
                isDelete: false,
                modelid: this.selectMenuId,
                relatedtype: val1,
                relatedid: val0,
                lookover: true,
                adder: true,
                updater: true,
                deleter: true,
                rulemanagementlookover: true,
                rulecommunitylookover: true
              })
            // }
          }
        })
      }
      // 新增的没有id，编辑的传id，删除的isDelete=true
      let relatedids = subRelated.map(el => el.relatedid)
      this.tableOrgData.forEach(item => {
        if (!relatedids.includes(item.relatedid)) {
          item.isDelete = true
        }
      })
      subRelated = subRelated.filter(item => !this.tableOrgData.map(el => el.relatedid).includes(item.relatedid))
      let permissionList = [...this.tableOrgData, ...subRelated]
      permissionList.forEach(item => {
        item.lookover = item.lookover ? '1' : '0'
        item.adder = item.adder ? '1' : '0'
        item.updater = item.updater ? '1' : '0'
        item.deleter = item.deleter ? '1' : '0'
        item.rulemanagementlookover = item.rulemanagementlookover ? '1' : '0'
        item.rulecommunitylookover = item.rulecommunitylookover ? '1' : '0'
      })
      saveProcessFrameworkAuth(permissionList)
        .then(rt => {
          this.$message.success(this.$t('hintText.operateSuccessfully'))
          this.getTableList()
        })
        .catch(() => {})
      this.organieationShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
.process-framework-authority-container {
  .selectMenu {
    position: absolute;
    top: 0;
    right: 10px;
    line-height: 40px;
    font-size: 14px;
    letter-spacing: 2px;
  }
}
</style>
