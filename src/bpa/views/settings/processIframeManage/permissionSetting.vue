<template>
  <el-dialog
    :title="$t('permissionSettings')"
    width="900px"
    append-to-body
    :visible.sync="dialogVisible"
  >
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
      <el-table-column :label="$t('name')" width="120">
        <template slot-scope="scope">
          <span>{{
            scope.row.relatedname ? scope.row.relatedname : scope.row.name
          }}</span>
        </template>
      </el-table-column>

      <!-- 类型 -->
      <el-table-column :label="$t('type')" width="80">
        <template slot-scope="scope">
          <span>{{
            scope.row.relatedtype === '0' ? '组织' : scope.row.relatedtype === '1' ? '公司' : scope.row.relatedtype === '2' ? '部门' : scope.row.relatedtype === '3' ? '岗位' : scope.row.relatedtype === '4' ? '事业部' : scope.row.relatedtype === '5' ? '片区' : scope.row.relatedtype === '6' ? '职务' : scope.row.relatedtype === '7' ? '系统组' : scope.row.relatedtype === '8' ? '角色' : scope.row.relatedtype === '9' ? '用户' : scope.row.relatedtype === '10' ? '自定义组' : scope.row.relatedtype
          }}</span>
        </template>
      </el-table-column>

      <!-- 业务设计平台可见权限 -->
      <el-table-column align="center" min-width="150">
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
      <el-table-column align="center" min-width="150">
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
            <el-button type="text" @click="removeOrg(scope.$index)">{{
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
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogVisible = false"> {{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {
  getNodePermissions,
  deleteOrganization,
  checkAll,
} from '@/bpa/api/settings/processFrameworkAuthority'
export default {
  data() {
    return {
      dialogVisible: this.value,
      selectMenuId: '',
      searchOrg: '',
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

      // 选人组件相关
      organieationShow: false,
      selectedElement: {},
      selectElement: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
      showElement: [
        {
          key: "1",
          name: this.$t("OrganizationalTree")
        },
        {
          key: "8",
          name: this.$t("role")
        }
      ],
      basOrganieationMultiple: true,
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    treeData: {
      type: Object,
      default: () => {
        {}
      }
    },
    permissionList: {
      type: Array,
      default: () => {
        []
      }
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
    value(val) {
      this.dialogVisible = val;
      if (val) {
        this.selectMenuId = this.treeData.id
        this.tableOrgData = JSON.parse(JSON.stringify(this.permissionList))
        console.log('122222222222', this.tableOrgData)
        // this.getTableList()
      }
    },
    dialogVisible(val) {
      this.$emit("input", val);
    },
    tableOrgData: {
      handler (list) {
        this.orgFields.rulecommunitylookover =
        this.tableOrgData.filter(item => item.rulecommunitylookover)
          .length === this.tableOrgData.length && this.tableOrgData.length > 0
        this.orgFields.rulemanagementlookover =
          this.tableOrgData.filter(item => item.rulemanagementlookover)
            .length === this.tableOrgData.length && this.tableOrgData.length > 0
        this.orgFields.adder =
          this.tableOrgData.filter(item => item.adder).length ===
            this.tableOrgData.length && this.tableOrgData.length > 0
        this.orgFields.updater =
          this.tableOrgData.filter(item => item.updater).length ===
            this.tableOrgData.length && this.tableOrgData.length > 0
        this.orgFields.deleter =
          this.tableOrgData.filter(item => item.deleter).length ===
            this.tableOrgData.length && this.tableOrgData.length > 0
        this.$emit("confirm", list)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 全选和取消全选
    async checkboxChanged(type, value) {
      console.log(type, value)
      this.orgFields[type] = value
      this.tableOrgData.forEach(item => {
        item[type] = value
      })
    },

    // 更新一条数据
    updateStatus(rowData, field) {
      this.orgFields[field] = this.tableOrgData.filter(item => item[field]).length === this.tableOrgData.length && this.tableOrgData.length > 0
    },

    // 获取table数据
    async getTableList() {
      let queryData = {
        filters: [
          { key: 'modelid', opt: 'EQ', type: 'S', value: this.selectMenuId },
          {
            key: 'relatedname',
            opt: 'LIKE',
            type: 'S',
            value: this.searchOrg
          }
        ],
        pageNum: 1,
        pageSize: 10000
      }
      const res = await getNodePermissions(queryData)
      if (!res) {
        return this.$message.error('获取列表数据失败')
      }
      this.tableOrgData = res.list
      this.orgFields.rulecommunitylookover =
        this.tableOrgData.filter(item => item.rulecommunitylookover)
          .length === this.tableOrgData.length && this.tableOrgData.length > 0
      this.orgFields.rulemanagementlookover =
        this.tableOrgData.filter(item => item.rulemanagementlookover)
          .length === this.tableOrgData.length && this.tableOrgData.length > 0
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
          id: this.tableOrgData.map(item => item.relatedid).join(","),
          name: this.tableOrgData.map(item => item.relatedname).join("&"),
          idType: this.tableOrgData.map(item => {
            return `${item.relatedid}-${item.relatedtype}`;
          }).join(";")
        };
      } else {
        this.selectedElement = {};
      }
      this.organieationShow = true
    },

    // 删除组织
    removeOrg(i) {
      this.tableOrgData.splice(i, 1)
    },
    fnBasOrganieationCallBack(data) {
      let subRelated = [];
      if (data.idType) {
        let dataList = data.idType.split(";");
        dataList.forEach((val, index) => {
          if (val.indexOf("-") == 0) {
            // 目前有些数据id为负数
            val = val.slice(1);
            let val0 = val.split("-")[0];
            let val1 = val.split("-")[1];
            subRelated.push({
              isDelete: false,
              modelid: this.selectMenuId,
              relatedname: data.name.split("&")[index],
              relatedtype: val1,
              relatedid: "-" + val0,
              lookover: true,
              adder: true,
              updater: true,
              deleter: true,
              rulemanagementlookover: true,
              rulecommunitylookover: true
            });
          } else {
            let val0 = val.split("-")[0];
            let val1 = val.split("-")[1];
            subRelated.push({
              isDelete: false,
              modelid: this.selectMenuId,
              relatedname: data.name.split("&")[index],
              relatedtype: val1,
              relatedid: val0,
              lookover: true,
              adder: true,
              updater: true,
              deleter: true,
              rulemanagementlookover: true,
              rulecommunitylookover: true
            });
          }
        });
      }
      let tableOrgData = this.tableOrgData.filter(item => subRelated.map(el => el.relatedid).includes(item.relatedid))
      subRelated = subRelated.filter(item => !this.tableOrgData.map(el => el.relatedid).includes(item.relatedid))
      this.tableOrgData = [
         ...tableOrgData,
        ...subRelated
      ]
      this.organieationShow = false;
    }
  }
};
</script>

<style scoped>
.content {
  height: 30vh;
  width: 60%;
  margin: 0 auto;
  overflow: auto;
}
.w100 {
  width: 100%;
}
</style>
