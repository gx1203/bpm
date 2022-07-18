<template>
  <div id="processCard">
    <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="流程标签维护" name="process">
        <!--    表格-->
          <bas-table
            row-key="id"
            :tableList="tableCardlist"
            :headerList="headerList"
            :pages="pages"
            :isShowIndex="true"
            @selectionChange="handleSelectionChange"
            @currentChange="currentChange">
            <template #search>
              <div>
                <el-row>
                  <el-col :span="8">
                    <el-input
                      v-model="searchContent"
                      :placeholder="enterSettingsProcessTabCard"
                      :title="enterSettingsProcessTabCard"
                      class="search_component"
                      clearable
                      @keyup.13.native="getData('singleSelect')"
                    >
                      <el-button
                        slot="append"
                        type="primary"
                        @click="getData('singleSelect')"
                        >{{ $t('search') }}</el-button
                      >
                    </el-input>
                    <!--<el-button class="high_search" type="primary" @click="isHighSearch=!isHighSearch">-->
                    <!--高级-->
                    <!--<i :class="isHighSearch?'el-icon-caret-top' : 'el-icon-caret-bottom'"></i>-->
                    <!--</el-button>-->
                  </el-col>
                  <!-- 根据提交Bug需求,暂时隐藏添加按钮 -->
                  <el-col :span="6" :offset="10" class="search_buttons_wrap">
                    <el-button type="primary" @click="isHighSearch = !isHighSearch">
                      {{ $t('advancedQuery') }}
                      <i
                        :class="
                          isHighSearch ? 'el-icon-caret-top' : 'el-icon-caret-bottom'
                        "
                      ></i>
                    </el-button>
                    <el-button type="primary" v-if="isAdmin" @click="addfield()">
                      {{ $t('add') }}
                    </el-button>
                  </el-col>
                </el-row>
                <el-collapse-transition>
                  <el-form
                    v-show="isHighSearch"
                    class="search_options_wrap"
                    :model="searchForm"
                    label-width="100px"
                  >
                    <el-row>
                      <el-col :span="8">
                        <el-form-item :label="fieldNames">
                          <el-input v-model="searchForm.name" clearable />
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item :label="state">
                          <el-select v-model="searchForm.state" clearable>
                            <el-option :label="$t('all')" value="" />
                            <el-option :label="invisible" value="0" />
                            <el-option :label="visible" value="1" />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8" :offset="16">
                        <div class="search_buttons_wrap">
                          <el-button type="primary" @click="getData('highSelect')">
                            {{ $t('search') }}
                          </el-button>
                          <el-button type="primary" @click="reset()">
                            {{ $t('reset') }}
                          </el-button>
                        </div>
                      </el-col>
                    </el-row>
                  </el-form>
                </el-collapse-transition>
              </div>
            </template>
            <!-- 字段名称 -->
            <template #name="{ row }">
              <div>{{ row.name }}</div>
            </template>
            <!-- 状态 -->
            <template #state="{ row }">
              <div>{{ row.state == '1' ? visible : invisible }}</div>
            </template>
            <!-- 操作 -->
              <template #updateby="{ row }">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="edit2"
                  placement="top"
                >
                  <!-- class="no-border" icon="el-icon-edit" circle -->
                  <el-button type="text" @click="addfield(row)">{{
                    edit2
                  }}</el-button>
                </el-tooltip>
                <!-- 根据提交Bug需求,暂时隐藏删除按钮 -->
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="$t('delete')"
                  placement="top"
                >
                  <!-- icon="el-icon-delete" circle -->
                  <el-button
                    type="text"
                    @click="delField(row.id)"
                    v-if="isAdmin"
                    >{{ $t('delete') }}</el-button
                  >
                </el-tooltip>
              </template>
          </bas-table>
      </el-tab-pane>
      <el-tab-pane label="制度标签维护" name="system">
        <!--    表格-->
          <bas-table
            row-key="id"
            :tableList="tableCardlist"
            :headerList="headerList"
            :pages="pages"
            :isShowIndex="true"
            @selectionChange="handleSelectionChange"
            @currentChange="currentChange">
            <template #search>
              <div>
                <el-row>
                  <el-col :span="8">
                    <el-input
                      v-model="searchContent"
                      :placeholder="enterSettingsProcessTabCard"
                      :title="enterSettingsProcessTabCard"
                      class="search_component"
                      clearable
                      @keyup.13.native="getData('singleSelect')"
                    >
                      <el-button
                        slot="append"
                        type="primary"
                        @click="getData('singleSelect')"
                        >{{ $t('search') }}</el-button
                      >
                    </el-input>
                    <!--<el-button class="high_search" type="primary" @click="isHighSearch=!isHighSearch">-->
                    <!--高级-->
                    <!--<i :class="isHighSearch?'el-icon-caret-top' : 'el-icon-caret-bottom'"></i>-->
                    <!--</el-button>-->
                  </el-col>
                  <!-- 根据提交Bug需求,暂时隐藏添加按钮 -->
                  <el-col :span="6" :offset="10" class="search_buttons_wrap">
                    <el-button type="primary" @click="isHighSearch = !isHighSearch">
                      {{ $t('advancedQuery') }}
                      <i
                        :class="
                          isHighSearch ? 'el-icon-caret-top' : 'el-icon-caret-bottom'
                        "
                      ></i>
                    </el-button>
                    <el-button type="primary" v-if="isAdmin" @click="addfield()">
                      {{ $t('add') }}
                    </el-button>
                  </el-col>
                </el-row>
                <el-collapse-transition>
                  <el-form
                    v-show="isHighSearch"
                    class="search_options_wrap"
                    :model="searchForm"
                    label-width="100px"
                  >
                    <el-row>
                      <el-col :span="8">
                        <el-form-item :label="fieldNames">
                          <el-input v-model="searchForm.name" clearable />
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item :label="state">
                          <el-select v-model="searchForm.state" clearable>
                            <el-option :label="$t('all')" value="" />
                            <el-option :label="invisible" value="0" />
                            <el-option :label="visible" value="1" />
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8" :offset="16">
                        <div class="search_buttons_wrap">
                          <el-button type="primary" @click="getData('highSelect')">
                            {{ $t('search') }}
                          </el-button>
                          <el-button type="primary" @click="reset()">
                            {{ $t('reset') }}
                          </el-button>
                        </div>
                      </el-col>
                    </el-row>
                  </el-form>
                </el-collapse-transition>
              </div>
            </template>
            <!-- 字段名称 -->
            <template #name="{ row }">
              <div>{{ row.name }}</div>
            </template>
            <!-- 状态 -->
            <template #state="{ row }">
              <div>{{ row.state == '1' ? visible : invisible }}</div>
            </template>
            <!-- 操作 -->
              <template #updateby="{ row }">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="edit2"
                  placement="top"
                >
                  <!-- class="no-border" icon="el-icon-edit" circle -->
                  <el-button type="text" @click="addfield(row)">{{
                    edit2
                  }}</el-button>
                </el-tooltip>
                <!-- 根据提交Bug需求,暂时隐藏删除按钮 -->
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="$t('delete')"
                  placement="top"
                >
                  <!-- icon="el-icon-delete" circle -->
                  <el-button
                    type="text"
                    @click="delField(row.id)"
                    v-if="isAdmin"
                    >{{ $t('delete') }}</el-button
                  >
                </el-tooltip>
              </template>
          </bas-table>
      </el-tab-pane>
    </el-tabs>
    <!-- <el-pagination
      :current-page.sync="pages.pageNum"
      :page-size="pages.pageSize"
      background
      layout="prev, pager, next, jumper, total"
      :total="pages.total"
      @current-change="handleCurrentChange"
    /> -->
    <!--    添加或者修改字段-->
    <el-dialog
      :title="addProcessCardTabfield"
      :visible.sync="dialogVisible"
      width="40%"
      :rules="rules"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        ref="fieldlist"
        label-width="120px"
        :rules="rules"
        :model="fieldlist"
      >
        <el-form-item :label="fieldNames" prop="name">
          <el-input v-model="fieldlist.name" clearable maxlength="50" />
        </el-form-item>
        <el-form-item :label="englishFieldName" prop="enname">
          <el-input
            v-model="fieldlist.enname"
            onchange="this.value=this.value.replace(/[^a-zA-Z\s!\?.,。，]/g,'')"
            clearable
            maxlength="50"
          />
        </el-form-item>
        <el-form-item :label="tabOrder" prop="sort">
          <el-input
            v-model="fieldlist.sort"
            type="number"
            clearable
            maxlength="50"
            :disabled="fieldtitle == '修改'"
          />
        </el-form-item>
        <el-form-item :label="state" prop="state">
          <el-select v-model="fieldlist.state" clearable>
            <el-option :label="invisible" value="0" />
            <el-option :label="visible" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('sort')" prop="rank">
          <el-input-number v-model="fieldlist.rank" controls-position="right" :min="1"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="confirmField('fieldlist')">{{
          $t('confirm')
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getTabCardlist,
  saveTabField,
  deleteTabField
} from '@/bpa/api/settings/processTabCard'
import { getIsAdmin } from '@/bpm/api/configManage/navConfig'
export default {
  data() {
    return {
      isAdmin: false,
      activeName: 'process',
      // 标签页的字段
      tableTabCardlist: [],
      // 控制显示隐藏弹出框
      dialogVisible: false,
      params: {
        attr: {},
        filters: [
          { key: 'name', opt: 'LIKE', type: 'S', value: '' },
          { key: 'state', opt: 'LIKE', type: 'S', value: '' },
          { key: 'sheetType', opt: 'LIKE', type: 'S', value: '0' }
        ],
        logic: 'or',
        orderby: 'rank',
        pageNum: 1,
        pageSize: 10,
        sort: 'asc'
      },
      tableCardlist: [],
      isHighSearch: false,
      searchContent: '',
      searchForm: {
        name: '',
        sheetType: '',
        state: ''
      },
      form: {},
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      fieldtitle: '添加',
      // 弹出框的变量部分
      fieldlist: {
        name: '',
        enname: '',
        sort: '',
        state: '',
        id: '',
        rank: ''
      },
      isEdit: false,
      // 弹出框的必填规则
      rules: {
        name: [{ required: true, message: ' ', trigger: 'blur' }],
        enname: [{ required: true, message: ' ', trigger: 'blur' }],
        sort: [{ required: true, message: ' ', trigger: 'blur' }],
        state: [{ required: true, message: ' ', trigger: 'blur' }],
        sheetType: [{ required: true, message: ' ', trigger: 'blur' }]
      },
      textMaxLength: 50, // 文本框最大字数限制
      areaMaxLength: 1000, // 文本框最大字数限制
      enterSettingsProcessTabCard: this.$t(
        'placeholderText.enterSettingsProcessTabCard'
      ),
      fieldNames: this.$t('fieldNames'),
      state: this.$t('state'),
      edit2: this.$t('edit'),
      number: this.$t('bpa_number'),
      operation: this.$t('operation'),
      addProcessCardTabfield: this.$t('addProcessCardTabfield'),
      englishFieldName: this.$t('englishFieldName'),
      tabOrder: this.$t('tabOrder'),
      fieldNameShouldNotExceedFiftyWords: this.$t(
        'hintText.fieldNameShouldNotExceedFiftyWords'
      ),
      dataSavedSuccessfully: this.$t('hintText.dataSavedSuccessfully'),
      requiredFieldsCannotBeEmpty: this.$t(
        'hintText.requiredFieldsCannotBeEmpty'
      ),
      successfullyDelete: this.$t('hintText.successfullyDelete'),
      visible: this.$t('bpa_visible'),
      invisible: this.$t('bpa_invisible'),
      areYouSureDelete: this.$t('hintText.areYouSureDelete'),
      hint: this.$t('hintText.hint'),
      confirm: this.$t('confirm'),
      cancel: this.$t('cancel'),
      // 表头字段
      headerList: [
        {
          label: this.$t('fieldNames'), // 字段名称
          prop: 'name',
          slotName: 'name',
          sortable: false
        },
        {
          label: this.$t('state'), // 状态
          prop: 'state',
          slotName: 'state',
          sortable: false
        },
        {
          label: this.$t('operation'), // 操作
          prop: 'updateby',
          slotName: 'updateby',
          sortable: false
        }
      ]
    }
  },
  mounted() {
    this.getData()
    this.Suk_getIsAdmin()
  },
  methods: {
    // 页码改变事件
    currentChange(newPageNum) {
      console.log('newPage', newPageNum)
      this.pages.pageNum = newPageNum
      this.params.pageNum = newPageNum
      this.getData()
    },
    systemCurrentChange(newPageNum) {
      console.log('newPage', newPageNum)
      this.pages.pageNum = newPageNum
      this.params.pageNum = newPageNum
      this.getData()
    },
    // 复选框勾选事件
    handleSelectionChange(data) {
      console.log(data)
      this.selections = data
    },
    Suk_getIsAdmin() {
      getIsAdmin()
        .then(rt => {
          if (rt.data === false) {
            //非管理员
            this.isAdmin = false
          } else {
            this.isAdmin = true
          }
        })
        .catch(er => {
          console.log(er)
        })
    },
    handleClick(tab, event) {
      this.getData()
    },
    /*
      获取标签页内列表数据
     */
    getData(type) {
      const self = this
      this.params.filters[2].value = this.activeName === 'process' ? '0' : '1'
      if (type === 'highSelect') {
        this.params.filters[0].value = this.searchForm.name
        this.params.filters[1].value = this.searchForm.state
        this.params.logic = 'and'
        this.pages.pageNum = 1
        this.params.pageNum = 1
      } else if (type === 'singleSelect') {
        this.params.filters[0].value = this.searchContent
        this.params.logic = 'and'
        this.params.filters[1].value = ''
        this.pages.pageNum = 1
        this.params.pageNum = 1
      }
      getTabCardlist(this.params).then(res => {
        console.log(res)
        self.tableCardlist = res.list
        self.pages.total = res.total
      })
    },

    /*
      重置高级搜索的条件
     */
    reset() {
      const self = this
      this.$set(self.searchForm, 'name', '')
      this.$set(self.searchForm, 'state', '')
      this.$set(self.searchForm, 'sheetType', '')
      this.$set(self.searchForm, 'blgLabel', '')
      this.params.filters[0].value = this.searchForm.name
      this.params.filters[1].value = this.searchForm.state
      this.$set(this.pages, 'pageNum', 1)
      this.params.pageNum = 1
      this.getData()
    },
    handleCurrentChange(val) {
      this.params.pageNum = val
      this.getData()
    },
    /*
      弹出添加或者修改的对话框
     */
    addfield(item) {
      const self = this
      if (item) {
        this.isEdit = true
      } else {
        this.isEdit = false
      }
      if (self.$refs.fieldlist) {
        self.$refs.fieldlist.clearValidate()
      }
      self.fieldlist = {
        name: '',
        enname: '',
        sort: '',
        state: '',
        sheetType: '',
        id: '',
        rank: ''
      }
      if (!item) {
        ;(self.addProcessCardTabfield = this.$t('addProcessCardTabfield')),
          (self.fieldtitle = '添加')
        if (this.activeName === 'process') {
          this.addProcessCardTabfield = this.$t('addProcessCardTabfield')
        } else {
          this.addProcessCardTabfield = '添加制度卡片标签页字段'
        }
      } else {
        if (this.activeName === 'process') {
          this.modifyProcessCardTabfield = this.$t('modifyProcessCardTabfield')
        } else {
          this.addProcessCardLabelField = '修改制度卡片标签页字段'
        }
        self.fieldtitle = '修改'
        self.fieldlist = {
          name: item.name,
          enname: item.enname,
          sort: item.sort,
          state: item.state,
          id: item.id,
          rank: item.rank
        }
      }
      self.dialogVisible = true
    },
    /*
      弹出框确认
     */
    confirmField(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.fieldlist.name.length > this.textMaxLength) {
            this.$message({
              type: 'warning',
              message: this.fieldNameShouldNotExceedFiftyWords
            })
            return false
          } else if (this.fieldlist.enname.length > this.textMaxLength) {
            this.$message({
              type: 'warning',
              message: this.fieldNameShouldNotExceedFiftyWords
            })
            return false
          }
          saveTabField(
            {
              id: this.fieldlist.id,
              name: this.fieldlist.name,
              enname: this.fieldlist.enname,
              sort: this.fieldlist.sort,
              sheetType: this.activeName === 'process' ? '0' : '1',
              state: this.fieldlist.state,
              rank: this.fieldlist.rank
            },
            this.userid
          ).then(res => {
            this.$message({
              type: 'success',
              message: this.dataSavedSuccessfully
            })
            this.reset()
            this.dialogVisible = false
          })
        } else {
          this.$message({
            type: 'warning',
            message: this.requiredFieldsCannotBeEmpty
          })
        }
      })
    },
    /*
      删除字段
     */
    delField(id) {
      this.$confirm(this.areYouSureDelete, this.hint, {
        confirmButtonText: this.confirm,
        cancelButtonText: this.cancel,
        type: 'warning'
      })
        .then(() => {
          deleteTabField(id).then(res => {
            this.$message({
              type: 'success',
              message: this.successfullyDelete
            })
            this.getData()
          })
        })
        .catch()
    }
  }
}
</script>
<style lang="scss" scoped>
#processCard{
  background-color: white;
  height: calc(100vh - 172px);
  padding: 10px;
  overflow-x: hidden;
}
</style>