<template>
  <el-card shadow="never" class="card-reset">
    <!--    表格-->
    <bas-table
      row-key="id"
      :tableList="content.list"
      :headerList="headerList"
      :pages="page"
      selectType="checkbox"
      :headerCellStyle="{background: '#E1EAFD !important'}"
      @selectionChange="handleSelectionChange"
      @currentChange="currentChange">
      <template #search>
        <div>
          <div class="tool-common-wrap">
            <div class="search-wrap">
              <quick-query :isDate="false" :placeholder="$t('placeholderText.multipleFieldsPlaceholder30')" ref="quick"
                @quickSearch="quickSearch" />
            </div>
            <div class="btn-wrap">
              <el-upload class="upload-demo" :action="action" name="file" :data="{'dataType':'businessrule'}"
                :headers="headData" :show-file-list='false' :before-upload="beforeAvatarUpload" :on-success="uploadSuccess"
                :on-error="uploadError" style="display: inline-block;margin-right: 10px;">
                <el-button type="primary">
                  {{ $t('import') }}
                  <!--<i class="el-icon-upload2" />-->
                </el-button>
              </el-upload>
              <export :filters="filters" :selections="selections" type="businessruleExport" />
              <el-button type="primary" @click="addList($t('addBusinessAttributes'))">
                {{ $t('add') }}
                <!---->
              </el-button>
              <el-button type="primary" :disabled="selections.length === 0" @click="handleAllDelete">
                {{ $t('batchDelete') }}
                <!--<i class="el-icon-circle-close" />-->
              </el-button>
              <el-button type="primary" @click="isPowerSearch = !isPowerSearch">
                {{ $t('advancedQuery') }}
                <i :class="isPowerSearch?'el-icon-caret-top':'el-icon-caret-bottom'" />
              </el-button>
              <el-button type="primary" @click="rest">
                {{ $t('refresh') }}
                <!---->
              </el-button>
            </div>
          </div>
          <el-form class="power-search" :model="searchForm" @keyup.enter.native="powerSearch" ref="searchForm"
            label-width="120px" size="mini" v-if="isPowerSearch">
            <el-row>
              <el-col :span="8">
                <el-form-item :label="$t('type') + '：'">
                  <el-select clearable v-model="searchForm.type" class="w100">
                    <el-option v-for="item in typeList" :key="item.value" :label="item.name" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('fieldNames') + '：'">
                  <el-input clearable type="text" v-model="searchForm.fieldname"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('fieldType') + '：'">
                  <el-select clearable v-model="searchForm.fieldtype" class="w100">
                    <el-option v-for="item in selectTypeList" :key="item.value" :label="item.name" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item :label="$t('fieldDescription') + '：'">
                  <el-input clearable type="text" v-model="searchForm.fielddesc"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" class="text-r">
                <el-button type="primary" @click="powerSearch">{{ $t('query') }}</el-button>
                <el-button type="primary" @click="rest">{{ $t('reset') }}</el-button>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </template>
      <!-- 类型  -->
      <template #type="{ row }">
        <div>{{row.type === '0' ? $t('post') : row.type === '1' ? $t('user') : row.type}}</div>
      </template>
      <!-- 字段名称  -->
      <template #fieldname="{ row }">
        <div>{{ row.fieldname }}</div>
      </template>
      <!-- 字段类型  -->
      <template #fieldtype="{ row }">
        <div>{{row.fieldtype === 'date' ? $t('date') : row.fieldtype === 'string' ? $t('string') : row.fieldtype === 'number' ? $t('value') : row.fieldtype}}</div>
      </template>
      <!-- 字段描述  -->
      <template #fielddesc="{ row }">
        <div>{{ row.fielddesc }}</div>
      </template>
      <!-- 操作 -->
      <template #id="{ row }">
        <el-tooltip class="item" effect="dark" :content="$t('editBusinessAttributes')" placement="top">
          <el-button type="text" @click="addList($t('editBusinessAttributes'),row)">
            {{ $t('editBusinessAttributes') }}
          </el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" :content="$t('delete')" placement="top">
          <el-button type="text" @click="handleDeleteOne(row)">{{ $t('delete') }}</el-button>
        </el-tooltip>
      </template>
    </bas-table>
    <service-attribute-dialog v-model="dialogVisible" :item="editItem" :title="linkTitle" @confirm="saveSuccess" />
  </el-card>
</template>

<script>
import serviceAttributeDialog from "./serviceAttributeDialog";
import QuickQuery from "@/bpm/components/quickquery/QuickQuery";
import Export from '@/bpm/components/export/Export'
import SearchListMixin from "@/bpm/mixins/search_list_mixin";
import {
  getBusinessAttributeList,
  deleteBusinessAttribute,
  batchDeleteBusinessAttribute
} from "@/bpm/api/process/business/service_attribute";
import axios from 'axios'
export default {
  name: 'serviceAttribute',
  mixins: [SearchListMixin],
  components: {
    serviceAttributeDialog,
    QuickQuery,
    Export
  },
  watch: {
    "content.list": {
      handler (val) {
        if (this.content.list && this.content.list.length !== 0) {
          this.checkAll = true;
          this.selections = [];
          for (let i = 0; i < this.content.list.length; i++) {
            if (!this.content.list[i].checked) {
              this.checkAll = false;
            } else {
              this.selections.push(this.content.list[i]);
            }
          }
        }
      },
      deep: true
    },
    checkAll (val) {
      if (this.content.list) {
        if (val) {
          this.content.list.forEach(item => {
            item.checked = val;
          });
        } else if (this.selections.length === this.content.list.length) {
          this.content.list.forEach(item => {
            item.checked = val;
          });
        }
      }
    }
  },
  data () {
    return {
      headData: {
        token: localStorage.getItem('token')
      },
      action: `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/datamanage/dataImport`,
      selectTypeList: [
        {
          name: this.$t('date'),
          value: "date"
        },
        {
          name: this.$t('string'),
          value: "string"
        },
        {
          name: this.$t('value'),
          value: "number"
        }
      ],
      typeList: [
        {
          name: this.$t('post'),
          value: "0"
        },
        {
          name: this.$t('user'),
          value: "1"
        }
      ],
      isPowerSearch: false,
      dialogVisible: false,
      editItem: {},
      linkTitle: "",
      headers: [
        {
          key: "type",
          name: this.$t('type'),
          span: 5
        },
        {
          key: "fieldname",
          name: this.$t('fieldNames'),
          span: 5
        },
        {
          key: "fieldtype",
          name: this.$t('fieldType'),
          span: 5
        },
        {
          key: "fielddesc",
          name: this.$t('fieldDescription'),
          span: 5
        },
        {
          name: this.$t('operation'),
          span: 4
        }
      ],
      selections: [],
      checkAll: "",
      // 表头字段
      headerList: [
        {
          label: this.$t('type'), // 类型
          prop: 'type',
          slotName: 'type',
          sortable: true
        },
        {
          label: this.$t('fieldNames'), // 字段名称
          prop: 'fieldname',
          slotName: 'fieldname',
          sortable: true
        },
        {
          label: this.$t('fieldType'), // 字段类型
          prop: 'fieldtype',
          slotName: 'fieldtype',
          sortable: true
        },
        {
          label: this.$t('fieldDescription'), // 字段描述
          prop: 'fielddesc',
          slotName: 'fielddesc',
          sortable: true
        },
        {
          label: this.$t('operation'), // 操作
          prop: 'id',
          slotName: 'id',
          sortable: false,
          width: "150"
        }
      ],
      page: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      }
    };
  },
  mounted () {
    this.getData();
  },
  methods: {
    // 页码改变事件
    currentChange(newPageNum) {
      console.log('newPage', newPageNum)
      this.page.pageNum = newPageNum
      this.searchType === 'power' ? this.getData() : this.quickQueryData()
    },
    // 复选框勾选事件
    handleSelectionChange(data) {
      console.log(data)
      this.selections = data
    },
    beforeAvatarUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 100;
      let postfix = file.name.replace(/.+\./, "");
      const isPostfix = ['JSON'].indexOf(postfix.toUpperCase()) === -1
      if (isPostfix) {
        this.$message.error(this.$t('hintText.pleaseUploadJsonFile'))
      }
      if (!isLt2M) {
        this.$message.error(this.$t('hintText.uploadAttachmentSizeCannotExceed'))
      }
      if (!isPostfix && isLt2M) {
        this.pageLoading = true

      }
      return !isPostfix && isLt2M
    },
    uploadSuccess (file) {
      this.pageLoading = false
      if (file.status === '200') {
        this.$message.success(this.$t('hintText.importedSuccessfully'))
        this.getData()
      } else {
        this.$message.error(this.$t('hintText.importFileError'))
      }
    },
    uploadError (err) {
      console.log(err)
      console.log(err.message)
      this.pageLoading = false
      // if (err.message) {
      //   let data = JSON.parse(err.message)
      //   this.$message.error(data.message)
      // } else {
      //   this.$message.error(this.$t('hintText.importFailed'))
      // }
      this.$message.error(this.$t('hintText.importFileError'))
    },
    excelFile () {
      this.pageLoading = true
      axios({
        method: 'post',
        url: `${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/datamanage/businessruleExport`,
        data: {
          filters: [...this.filters, ...[{ 'key': 'id', 'value': (this.selections.map(x => x.id)).join(','), 'opt': 'IN' }]]
        },
        headers: {
          token: localStorage.getItem('token')
        },
        responseType: 'blob'
      }).then(res => {
        this.pageLoading = false
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
        let url = window.URL.createObjectURL(blob)
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', '业务属性.json')
        document.body.appendChild(link)
        link.click()
      }).catch(() => {
        this.pageLoading = false
      })
    },
    getFieldType (status) {
      const result = this.selectTypeList.find(item => item.value === status);
      return result ? result.name : "";
    },
    getType (type) {
      const result = this.typeList.find(item => item.value === type);
      return result ? result.name : "";
    },
    handleDeleteOne (item) {
      this.$confirm(this.$t('hintText.areYouSureDelete'), this.$t('hintText.hint'), {
        type: "warning"
      })
        .then(() => {
          deleteBusinessAttribute(item.id).then(rt => {
            if (rt.status === "200") {
              if (this.searchType === "power") {
                this.getData();
              } else if (this.searchType === "quick") {
                this.quickQueryData();
              }
              this.$message({
                message: this.$t('hintText.successfullyDelete'),
                type: "success"
              });
            } else {
              this.$message({
                message: this.$t('hintText.failToDelete'),
                type: "error"
              });
            }
          });
        })
        .catch(_ => { });
    },
    handleAllDelete () {
      this.$confirm(this.$t('hintText.areYouSureDeleteSelectedData'), this.$t('hintText.hint'), {
        type: "warning"
      })
        .then(() => {
          batchDeleteBusinessAttribute(
            this.selections.map(item => item.id).join(",")
          ).then(rt => {
            if (rt.status === "200") {
              if (this.searchType === "power") {
                this.getData();
              } else if (this.searchType === "quick") {
                this.quickQueryData();
              }
              this.$message({
                message: this.$t('hintText.successfullyDelete'),
                type: "success"
              });
            } else {
              this.$message({
                message: this.$t('hintText.failToDelete'),
                type: "error"
              });
            }
          });
        })
        .catch(_ => { });
    },
    quickQueryData () {
      this.checkAll = false

      getBusinessAttributeList({
        logic: 'or',
        queryFilter: ['fieldname', 'fielddesc'],
        ...this.quickData,
        filters: this.filters,
        ...this.sort,
        ...this.page
      })
        .then(rt => {
          rt.data.list.forEach(item => {
            item.checked = false;
          });
          this.content = rt.data;
          this.page.total = rt.data.total
          return getBusinessGroupTypeList();
        })
        .then(rt => {
          if (rt.status === "200") {
            this.selectTypeList = rt.data.list;
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    saveSuccess (data) {
      if (data) {
        if (this.searchType === "power") {
          this.getData();
        } else if (this.searchType === "quick") {
          this.quickQueryData();
        }
      }
    },
    addList (item, data) {
      if (item === this.$t('addBusinessAttributes')) {
        this.dialogVisible = true;
        this.linkTitle = item;
        this.editItem = {};
      } else if (item === this.$t('editBusinessAttributes')) {
        this.dialogVisible = true;
        this.linkTitle = item;
        this.editItem = Object.assign({}, data);
      }
    },
    getData () {
      this.loading = true;
      this.checkAll = false;
      getBusinessAttributeList({
        logic: "and",
        filters: this.filters,
        ...this.sort,
        ...this.page
      })
        .then(rt => {
          rt.data.list.forEach(item => {
            item.checked = false;
          });
          this.content = rt.data;
          this.page.total = rt.data.total
          return getBusinessGroupTypeList();
        })
        .then(rt => {
          if (rt.status === "200") {
            this.selectTypeList = rt.data.list;
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.table-header {
  position: relative;
  background: $bc2;
  display: flex;
  align-items: center;
  .all-check {
    position: absolute;
    left: 20px;
  }
}
.w100 {
  width: 100%;
}
</style>
