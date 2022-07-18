<template>
  <div id="legendSettings">
    <!--    closable addable-->
    <!--    <el-tabs v-model="editableTabsValue" type="card"-->
    <!--             @tab-remove="removeTab" @tab-click="clickTab" @tab-add="addTabClick">-->
    <!--      <el-tab-pane-->
    <!--        v-for="(item, index) in editableTabs"-->
    <!--        :key="item.id"-->
    <!--        :label="item.styleName"-->
    <!--        :name="item.id"-->
    <!--      >-->
    <!--      </el-tab-pane>-->
    <!--    </el-tabs>-->

    <div class="scroll-layout" v-show="legendList && legendList.length > 0">
      <el-collapse
        v-model="activeNames"
        @change="collapseChange"
        accordion
        class="s-img-content"
      >
        <el-collapse-item
          :name="index + ''"
          v-for="(legendItem, index) in legendList"
          :key="index"
        >
          <template slot="title">
            <div class="title-bar">
              <span class="title">{{ getTitle(legendItem.classifyName) }}</span>
            </div>
          </template>
          <el-table
            :data="legendItem.modelIconTree"
            stripe
            tooltip-effect="dark"
          >
            <el-table-column
              type="index"
              :label="$t('legendTableNum')"
              width="55"
            ></el-table-column>
            <el-table-column
              prop="iconName"
              :label="$t('legendTableName')"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              :label="$t('legendTableIcon')"
              width="220"
            >
              <template slot-scope="scope">
                <div class="iconPath">
                  <img :src="getFullPath(scope.row)" alt="图例" />
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="sort"
              :label="$t('legendTableSort')"
              width="180"
            ></el-table-column>
            <el-table-column
              :label="$t('legendTableStatus')"
              width="180"
            >
              <template slot="header" slot-scope="scope">
                <div>
                  <span>{{ $t('legendTableStatus') }}</span>
                  <el-switch
                    v-model="legendItem.status"
                    @change="updateStatus(legendItem)"
                    :active-value="1"
                    :inactive-value="0"
                  ></el-switch>
                </div>
              </template>
              <template slot-scope="scope">
                <div>
                  <el-switch
                    v-model="scope.row.status"
                    @change="statusChanged(scope.row, legendItem)"
                    :active-value="1"
                    :inactive-value="0"
                  ></el-switch>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('legendTableAction')"
              width="180"
            >
              <template slot-scope="scope">
                <div>
                  <el-button
                    type="text"
                    @click="showLegendDialog('edit', scope.row)"
                    >{{ $t('edit') }}
                  </el-button>
                  <el-button type="text" @click="remove(scope.row)"
                    >{{ $t('delete') }}
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!--    表格-->
            <!-- <bas-table
              row-key="id"
              :tableList="tableCardlist"
              :headerList="headerList"
              :pages="pages"
              :isShowIndex="true"
              @selectionChange="handleSelectionChange"
              @currentChange="currentChange">
               图例名称
              <template #iconName="{ row }">
                <div>{{ row.iconName }}</div>
              </template>
              图例图片
              <template #iconId="{ row }">
                <div class="iconPath">
                  <img :src="getFullPath(row)" alt="图例" />
                </div>
              </template>
              排序
              <template #sort="{ row }">
                <div>{{ row.sort }}</div>
              </template>
            </bas-table> -->
          <div class="add-btn" @click.stop="showLegendDialog('add')">
            <i class="el-icon-plus"></i>{{ $t('add') }}
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <el-dialog
      :title="styleDialogTitle"
      :visible.sync="styleDialogShow"
      width="40%"
    >
      <el-form ref="styleFormRef" :model="styleForm" :rules="styleFormRules">
        <el-form-item :label="$t('legendStyleName') + ' :'" prop="styleName">
          <el-input v-model="styleForm.styleName" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="styleDialogShow = false">{{
          $t('cancel')
        }}</el-button>
        <el-button type="primary" @click="saveNewStyle">{{
          $t('confirm')
        }}</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="40%"
      @close="dialogClosed"
    >
      <el-form
        ref="legendForm"
        :model="legendForm"
        :rules="legendFormRules"
        label-width="100px"
        label-position="left"
      >
        <el-form-item :label="$t('legendInfoIcon')" required>
          <el-upload
            :action="imgHost"
            class="avatar-uploader"
            :show-file-list="false"
            accept="image/jpeg,image/png,image/jpg"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="imageUrl"
              :src="imageUrl"
              @error="showAddImg"
              class="avatar"
              alt=""
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">
              {{ $t('legendInfoIconErr') }}
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item :label="$t('legendInfoName')" prop="iconName">
          <el-input v-model="legendForm.iconName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('legendInfoCategory')" prop="iconClassify">
          <el-select
            v-model="legendForm.iconClassify"
            :placeholder="$t('pleaseSelect')"
          >
            <el-option
              v-for="item in legendCategoryOptions"
              :key="item.value"
              :label="item.text"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('legendInfoType')" prop="type">
          <el-select
            v-model="legendForm.type"
            :placeholder="$t('pleaseSelect')"
          >
            <el-option
              v-for="item in legendStyleOptions"
              :key="item.value"
              :label="item.text"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('legendInfoSort')" prop="sort">
          <el-input type="number" v-model="legendForm.sort"></el-input>
        </el-form-item>
        <el-form-item :label="$t('legendInfoStatus')">
          <el-switch
            :active-value="1"
            :inactive-value="0"
            v-model="legendForm.status"
          ></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="saveLegend">{{
          $t('confirm')
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  uploadImg,
  getImg,
  saveLegend,
  updateStatus,
  getLegend,
  getLegendList,
  removeLegend,
  getAllStyle,
  addNewStyle,
  editStyle,
  deleteStyle
} from '@/bpa/api/settings/legendSettings'
import { getDictionaryOption } from '@/bpm/api/process/processModeling/classificationModel'

export default {
  data() {
    return {
      status: false,
      styleDialogTitle: '新增',
      styleDialogShow: false,
      // editableTabs: [{
      //   styleName: this.$t('legendStyleLoading'),
      //   id: '0'
      // }],
      editableTabs: [
        {
          styleName: '黑白',
          id: '0'
        },
        {
          styleName: '彩色',
          id: '1'
        }
      ],
      editableTabsValue: '0',
      tabsSelected: {
        id: '0',
        styleName: ''
      },
      legendList: [],
      styleForm: {
        styleName: ''
      },
      newForm: () => {
        return {
          iconClassify: '', // 图例分类
          iconName: '', // 图例名称
          iconPath: '', // 图片路径
          type: '', // 图例类型
          status: true, // 启用状态
          sort: '' // 排序
        }
      },
      currentPane: '',
      imageUrl: '',
      dialogVisible: false, // 是否显示对话框
      dialogType: 'add',
      activeNames: ['0'], // 当前折叠面板激活项
      legendForm: {
        iconClassify: '', // 图例分类
        iconName: '', // 图例名称
        iconPath: '', // 图片路径
        type: '', // 图例类型
        status: true, // 启用状态
        sort: '', // 排序
        iconContent: '' // 图片base64Url
      }, // 新增和编辑图例表单
      legendFormRules: {
        iconClassify: [
          {
            required: true,
            message: this.$t('legendInfoCategoryErr'),
            trigger: 'change'
          }
        ],
        type: [
          {
            required: true,
            message: this.$t('legendInfoTypeErr'),
            trigger: 'change'
          }
        ],
        iconName: [
          {
            required: true,
            message: this.$t('legendInfoNameErr'),
            trigger: 'blur'
          }
        ],
        sort: [
          {
            required: true,
            message: this.$t('legendInfoSortErr'),
            trigger: 'blur'
          }
        ]
      },
      legendCategoryOptions: [],
      legendStyleOptions: [],
      styleFormRules: {
        styleName: [
          {
            required: true,
            message: this.$t('legendStyleNameErr'),
            trigger: 'blur'
          }
        ]
      },
      value: ''
    }
  },
  props: {
    changeStyle: {
      type: String,
      default: '0'
    }
  },
  created() {
    this.getDictionaryOption()
    this.getDicStyleType()
    this.getAllStyleReq()
  },
  computed: {
    title() {
      if (this.dialogType === 'add') {
        return this.$t('legendInfoAdd')
      } else {
        return this.$t('legendInfoEdit')
      }
    },
    imgHost() {
      return (
        process.env.VUE_APP_BPA_BASE_URL + '/attach/upload?attachmentType=bpm'
      )
    }
  },
  watch: {
    tabsSelected: {
      handler(val, oldval) {
        console.log('选中', val)
        this.getLegendList()
      },
      deep: true
    },
    changeStyle(val) {
      this.tabsSelected = this.editableTabs[val]
    }
  },
  methods: {
    getFullPath(rowData) {
      const fullPath = `${process.env.VUE_APP_BASE_URL}/bpm/attachment/download/${rowData.iconId}?attachmentType=bpm`
      return fullPath
    },
    iconTypeChange(item) {
      console.log(item)
    },
    // 移除标签
    removeTab(target) {
      console.log('移除标签->', target)
      deleteStyle(target)
        .then(res => {
          if (res) {
            this.editableTabs = this.editableTabs.filter(item => {
              return item.id !== target
            })
            if (this.editableTabsValue === target) {
              this.tabsSelected = this.editableTabs[
                this.editableTabs.length - 1
              ]
              this.editableTabsValue = this.tabsSelected.id
            }
          }
        })
        .catch(err => {})
    },
    // 单个tab点击事件
    clickTab(target) {
      console.log(target)
      this.tabsSelected = this.editableTabs[target.index]
    },
    // 显示新增弹框
    addTabClick() {
      this.styleDialogShow = true
    },
    changeSelect(val) {
      this.tabsSelected = this.editableTabs[val]
    },
    // 获取所用样式Tab列表
    getAllStyleReq() {
      getAllStyle().then(res => {
        if (res && res.length > 0) {
          this.editableTabs = res
          this.tabsSelected = res[0]
          this.editableTabsValue = res[0].id
        }
      })
    },
    // 保存新的样式
    saveNewStyle() {
      this.$refs.styleFormRef.validate(valid => {
        if (valid) {
          addNewStyle(this.styleForm.styleName)
            .then(res => {
              if (res) {
                this.$message.success(this.$t('saveSuccess'))
                this.styleDialogShow = false
                this.getAllStyleReq()
              } else {
                this.$message.error(this.$t('saveFailed'))
              }
            })
            .catch(err => {
              this.$message.error(this.$t('saveFailed'))
            })
        }
      })
    },
    // 获取分类标题
    getTitle(category) {
      if (this.legendCategoryOptions.length) {
        const result = this.legendCategoryOptions.find(
          item => item.value === category
        )
        if (result === 'undefined') {
          return ''
        } else {
          return result.text
        }
      } else {
        return ''
      }
    },
    // 获取图例列表
    async getLegendList() {
      let params = {
        attr: {},
        filters: [
          { key: 'styleId', opt: 'EQ', type: 'S', value: this.tabsSelected.id }
        ],
        sort: 'asc',
        orderby: 'sort',
        pageNum: 1,
        pageSize: 9999
      }
      // 先清空原数据，再赋值，目前这么做是为了解决table中的switch未刷新问题
      this.legendList = []
      const res = await getLegendList(params)
      console.log('获取图例列表', res)
      if (res.length > 0) {
        res.forEach(item1 => {
          let status = 1
          if (item1.modelIconTree.length > 0) {
            for (let i = 0; i < item1.modelIconTree.length; i++) {
              if (
                item1.modelIconTree[i].status === 0 ||
                item1.modelIconTree[i].status === '0'
              ) {
                status = 0
                break
              }
            }
          } else {
            status = 0
          }
          item1['status'] = status
        })
      }

      this.legendList = res
    },
    // 获取数据字典
    async getDictionaryOption() {
      const res = await getDictionaryOption({
        dictionaryen: 'legendCategory'
      })
      if (res.status === '200') {
        this.legendCategoryOptions = res.data
      }
    },
    getDicStyleType() {
      getDictionaryOption({
        dictionaryen: 'legendType'
      }).then(res => {
        if (res.status === '200') {
          console.log('🍉', res.data)
          this.legendStyleOptions = res.data
        }
      })
    },
    // 折叠面板改变事件
    collapseChange(val) {
      this.currentPane = val
    },
    // 对话框关闭前事件
    dialogClosed() {
      this.$refs.legendForm.resetFields()
      this.imageUrl = ''
      this.legendForm = this.newForm()
    },
    getBase64Image(img) {  
      var canvas = document.createElement("canvas");  
      canvas.width = img.width;  
      canvas.height = img.height;  
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, img.width, img.height);  
      var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();  
      var dataURL = canvas.toDataURL("image/" + ext);  
      return dataURL;
    },
    // 图片上传成功事件
    async handleAvatarSuccess(res, file) {
      console.log(res)
      this.imageUrl = URL.createObjectURL(file.raw)
      if (res) {
        this.legendForm.iconId = res.id
        this.legendForm.fileName = res.newName
        // const result = await getImg(res.id)

        var image = new Image(); 
        image.src = this.getFullPath(this.legendForm); 
        let that = this
        image.onload = function () { 
          that.legendForm.iconContent = that.getBase64Image(image)
        }
      }
    },
    // 图片上传前判断,封面图标尺寸限制
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error(this.$t('uploadSizeTips'))
        return false
      }
      // return isLt2M
      let fileEndNameIndex = file.name.lastIndexOf('.')
      let fileEndName = file.name.substring(fileEndNameIndex + 1)
      // console.log('文件名：' + file.name, '文件后缀名：' + fileEndName)
      if (
        fileEndName === 'jpg' ||
        fileEndName === 'png' ||
        fileEndName === 'jpeg'
      ) {
        return true
      } else {
        this.$message.error(this.$t('uploadTypeTips'))
        return false
      }
    },
    // 显示对话框
    showLegendDialog(type, rowData = this.newForm()) {
      this.dialogType = type
      if (type === 'add') {
        this.imageUrl = ''
      } else {
        this.imageUrl = this.getFullPath(rowData)
      }
      this.legendForm = JSON.parse(JSON.stringify(rowData))
      // console.log(this.imageUrl)
      // console.log('bianj', this.legendForm)
      this.dialogVisible = true
    },
    // 移除图例
    remove(rowData) {
      this.$confirm(this.$t('legendDelAsk'), this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(async () => {
        console.log(rowData.id)
        const res = await removeLegend(rowData.id)
        console.log('删除图例', res)
        this.$message({
          type: 'success',
          message: this.$t('delSuccess')
        })
        this.getLegendList()
      })
      // .catch(() => {
      // this.$message({
      //   type: 'info',
      //   message: '已取消删除'
      // })
      // })
    },
    // 更新分类状态
    async updateStatus(legendItem) {
      const params = {
        styleId: this.tabsSelected.id,
        classifyName: legendItem.classifyName,
        status: legendItem.status
      }
      const res = await updateStatus(params)
      if (res) {
        legendItem.modelIconTree.forEach(item => {
          item.status = legendItem.status
        })
        this.$message.success(this.$t('saveSuccess'))
      } else {
        legendItem.status = legendItem.status === 1 ? 0 : 1
        this.$message.error(this.$t('saveFailed'))
      }
    },
    // 状态更新
    async statusChanged(rowData, legendItem) {
      console.log(rowData)
      const form = JSON.parse(JSON.stringify(rowData))
      form.status = form.status ? 1 : 0
      const res = await saveLegend(form)
      if (res) {
        this.$message.success(this.$t('saveSuccess'))
        // await this.getLegendList()
        if (rowData.status === 0 || rowData.status === '0') {
          legendItem.status = 0
        } else {
          let status = 1
          for (let i = 0; i < legendItem.modelIconTree.length; i++) {
            if (
              legendItem.modelIconTree[i].status === 0 ||
              legendItem.modelIconTree[i].status === '0'
            ) {
              status = 0
              break
            }
          }
          legendItem.status = status
        }
      } else {
        rowData.status = !rowData.status
        this.$message.error(this.$t('saveFailed'))
      }
    },
    // 保存图例表单信息
    saveLegend() {
      this.$refs.legendForm.validate(async valid => {
        if (!valid) {
          return this.$message.error(this.$t('legendInputFull'))
        } else if (!this.imageUrl) {
          return this.$message.error(this.$t('legendUploadIcon'))
        } else {
          if (this.legendForm.sort < 1) {
            return this.$message.error(this.$t('legendSortErr'))
          }
        }
        console.log(this.legendForm)
        const form = JSON.parse(JSON.stringify(this.legendForm))
        form.status = form.status ? 1 : 0
        form.styleName = this.tabsSelected.styleName
        form.styleId = this.tabsSelected.id
        const res = await saveLegend(form)
        if (res) {
          this.legendForm = this.newForm()
          this.imageUrl = ''
          this.$message.success(this.$t('saveSuccess'))
          this.dialogVisible = false
          this.getLegendList()
        } else {
          this.legendForm.status = !this.legendForm.status
          this.$message.error(this.$t('saveFailed'))
        }
      })
    },
    // 图片地址失效时显示添加按钮
    showAddImg() {
      this.imageUrl = ''
    }
  }
}
</script>
<style lang="scss" scoped>
#legendSettings {
  width: 100%;
  // background-color: skyblue;
  box-sizing: border-box;
  //padding: 10px;

  .iconPath {
    width: 100%;
    height: 60px;

    img {
      // width: 100%;
      height: 100%;
    }
  }

  .scroll-layout {
    //overflow-y: scroll;
    //height: calc(100vh - 165px)
  }

  ///deep/ .el-tabs__nav > .is-active {
  //  background: white;
  //  color: #2d42af;
  //}

  /deep/ .el-tabs__new-tab {
    margin-right: 20px;
    color: #3311e4;
    border: 1px solid #3c7ab7;

    &:hover {
    }
  }

  /deep/ .el-collapse {
    width: 90%;
  }

  .s-img-content {
    /deep/ .el-collapse-item__header {
      background-color: #2d42af;
      color: #fff;
    }

    /deep/ .el-collapse-item__wrap {
      border-bottom: none;
    }

    .title {
      margin-left: 20px;
      font-size: 16px;
      font-weight: 500;
    }

    .add {
      margin-left: 20px;
    }

    .el-table {
      margin-bottom: 0;
    }

    .add-btn {
      border: 1px solid #eeeeee;
      height: 80px;
      line-height: 80px;
      text-align: center;
      cursor: pointer;

      &:active {
        background-color: #eeeeee;
      }

      &:hover {
        background-color: #fafafa;
      }
    }
  }
}

.el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  // width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}

.avatar {
  // width: 120px;
  height: 120px;
  display: block;
}

.el-collapse {
  width: 80%;
  margin: 0 auto;
}

.el-divider--horizontal {
  margin: 10px 0;
}
</style>
