<template>
  <div>
    <el-dialog
      :title="menuInfo.name"
      class="person_list"
      :visible.sync="dialogVisible"
      width="50%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-row class="search_wrap">
        <el-col :span="8" :offset="16">
          <el-button class="float-r" type="primary" @click="addBtn()">添加按钮</el-button>
        </el-col>
      </el-row>
      <el-table :data="personList" class="main_tab" ref="personTable">
        <el-table-column type="index" :label="$t('number')" width="80px"></el-table-column>
        <el-table-column prop="name" label="名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="address" :label="$t('operation')" width="80px">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="$t('modify')" placement="top">
              <el-button class="no-border" @click="editBtn(scope.row)" icon="el-icon-edit" circle></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="$t('delete')" placement="top">
              <el-button
                class="no-border"
                @click="deleteBtn(scope.row.id)"
                icon="el-icon-delete"
                circle
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-size="pages.size"
        :current-page.sync="pages.page"
        background
        layout="prev, pager, next, jumper, total"
        :total="pages.total"
      ></el-pagination>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handlerConfirmDialog">确定</el-button>
      </span>
    </el-dialog>
    <!-- 添加按钮 -->
    <el-dialog
      :title="menutitle"
      :visible.sync="addBtndialogVisible"
      width="30%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form label-width="110px" :rules="rules" :model="menuform" ref="menuformRef">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input clearable :disabled="true" v-model="menuform.menuName"></el-input>
        </el-form-item>
        <el-form-item label="按钮名称" prop="name">
          <el-input clearable v-model="menuform.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelBtn">{{$t("cancel")}}</el-button>
        <el-button type="primary" @click="confirmBtn">{{$t("confirm")}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getButtonList,
  ButtonSave,
  ButtonDelete
} from '@/bpa/api/componentsApi'

import paginations from '@/bpa/mixins/pagination_mixin'

export default {
  name: 'addBtn',
  data() {
    return {
      addBtndialogVisible: false,
      dialogVisible: false,
      keyWords: '',
      personList: [],
      selectedList: [],
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      menutitle: '添加按钮',
      menuform: {
        menuName: '',
        menuid: '',
        name: ''
      },
      rules: {
        name: [{ required: true, message: ' ', trigger: 'blur' }]
      }
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    menuInfo: {
      type: Object,
      default: () => {
        return {
          name: ''
        }
      }
    }
  },
  mixins: [paginations],
  watch: {
    value(val) {
      this.dialogVisible = val
      if (val) {
        this.getList()
      }
    },
    dialogVisible(val) {
      this.$emit('input', val)
    }
  },
  methods: {
    getList() {
      getButtonList({
        orderby: 'createon',
        pageNum: this.pages.pageNum,
        pageSize: this.pages.pageSize,
        sort: 'desc',
        filters: [
          {
            key: 'menuid',
            opt: 'LIKE',
            type: 'S',
            value: this.menuInfo.id
          }
        ]
      }).then(res => {
        if (!res) return false
        this.pages.total = res.total
        this.personList = res.list
      })
    },
    editBtn(item) {
      this.menuform = Object.assign({}, this.menuform, {
        menuName: this.menuInfo.name,
        ...item
      })
      this.$nextTick(() => {
        this.$refs.menuformRef.clearValidate()
      })
      this.addBtndialogVisible = true
    },
    deleteBtn(id) {
      this.$confirm(
        this.$t('hintText.areYouSureDelete'),
        this.$t('hintText.hint'),
        {
          confirmButtonText: this.$t('confirm'),
          cancelButtonText: this.$t('cancel'),
          type: 'warning',
          center: true
        }
      )
        .then(() => {
          ButtonDelete(id).then(res => {
            if (!res) return false
            this.$message({
              type: 'success',
              message: this.$t('hintText.successfullyDelete')
            })
            this.getList()
          })
        })
        .catch(err => {})
    },
    handlerConfirmDialog() {
      this.dialogVisible = false
    },
    addBtn() {
      this.menuform = Object.assign({}, this.menuform, {
        menuName: this.menuInfo.name,
        menuid: this.menuInfo.id,
        name: ''
      })
      this.$nextTick(() => {
        this.$refs.menuformRef.clearValidate()
      })
      this.addBtndialogVisible = true
    },
    confirmBtn() {
      this.$refs.menuformRef.validate(valid => {
        if (valid) {
          ButtonSave(this.menuform).then(res => {
            if (!res) return false
            this.$message({
              type: 'success',
              message: '添加成功!'
            })
            this.getList()
            this.addBtndialogVisible = false
          })
        } else {
          this.$message({
            type: 'warning',
            message: this.$t('hintText.theRequiredFieldsMustNotBeEmpty')
          })
        }
      })
    },
    cancelBtn() {
      this.addBtndialogVisible = false
    }
  }
}
</script>
