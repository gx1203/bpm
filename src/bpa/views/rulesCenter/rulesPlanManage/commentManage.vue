<template>
  <div id="commentMangement">
    <el-row>
      <el-col :span="12">
        <el-input
          placeholder="请输入评论内容、相关制度、相关标签、评论人、评论人所在部门"
          class="search_component"
          v-model="keyWords"
          clearable
          @keyup.13.native="singleSearch"
        >
          <el-button type="primary" slot="append" @click="singleSearch"
            >搜索</el-button
          >
        </el-input>
        <el-button
          class="high_search"
          @click="isHighSearch = !isHighSearch"
          type="primary"
        >
          高级查询
          <i
            :class="isHighSearch ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"
          ></i>
        </el-button>
      </el-col>
      <el-col :span="12" class="text-right">
        <el-button @click="reset" type="primary"> 刷新 </el-button>
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
            <el-form-item label="评论内容">
              <el-input @keyup.13.native="highSearch" v-model="searchForm.description" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="相关制度">
              <el-input @keyup.13.native="highSearch" v-model="searchForm.listname" clearable></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item label="相关标签">
              <el-input v-model="searchForm.tagcontent" clearable></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="8">
            <el-form-item label="评论人">
              <el-input @keyup.13.native="highSearch" v-model="searchForm.createname" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="评论人部门">
              <el-input @keyup.13.native="highSearch" v-model="searchForm.deptname" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="评论时间">
              <el-date-picker
                clearable
                value-format="yyyy-MM-dd"
                v-model="searchForm.createon"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="search_buttons_wrap">
          <el-button type="primary" @click="highSearch">搜索</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
        </div>
      </el-form>
    </el-collapse-transition>
    <!-- 信息表格 -->
    <el-table :data="booksList" border class="main_tab" >
      <el-table-column label="序号" type="index" height="50px"></el-table-column>
      <el-table-column prop="description" style="cursor:pointer" label="评论内容" max-height="50px" show-overflow-tooltip></el-table-column>
      <el-table-column label="相关制度" prop="listname" height="50px"></el-table-column>
      <!-- <el-table-column label="相关标签" prop="tagcontent"></el-table-column> -->
      <el-table-column label="评论人" prop="createname" height=50></el-table-column>
      <el-table-column label="评论人部门" prop="deptname" width="180" height="50px">
        <template slot-scope="scope">
          <div
            style="
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            "
            :title="scope.row.deptname"
          >
            {{ scope.row.deptname }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="createon" label="评论时间" max-height="50px"></el-table-column>
      <el-table-column prop="replycount" label="评论回复数" max-height="50px"></el-table-column>
      <el-table-column width="180" label="操作" max-height="50px">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="查看" placement="top">
            <el-button
              @click="getDetails(scope.row.id)"
              class="no-border"
              type="text"
              circle
              >查看</el-button
            >
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
          :current-page="pages.pageNum"
          :page-size.sync="pages.pageSize"
          background
          layout="total,prev, pager, next, jumper, total"
          :total="pages.total"
          @current-change="handleCurrentChange"
    ></el-pagination>
    <!-- 添加弹框 -->
    <el-dialog
      title="评论详情"
      :visible.sync="dialogVisible"
      width="65%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="form" label-width="90px">
        <el-row>
          <el-scrollbar style="height: 60vh">
            <div style="border-bottom: 1px solid #f6f6f6; padding-bottom: 10px">
              <div class="comment_item">
                <div class="comment_header">
                  {{ comment.createname }}（{{ comment.deptname }}）
                </div>
                <div class="comment_text">{{ comment.description }}</div>
                <div class="comment_footer">
                  <div>
                    <span>{{ comment.createon | formateDate }}</span>
                    <span
                      class="reply"
                      @click="showReply('replyInput', comment.id)"
                    >
                      <i class="icon iconfont icon-comment"></i>回复
                    </span>
                  </div>
                  <div
                    class="reply_input_wrapper"
                    v-show="replyInput.isShow && currentId === comment.id"
                  >
                    <el-input
                      v-model.trim="replyInput.text"
                      maxlength="50"
                    ></el-input>
                    <span class="tips2"></span>
                    <span class="text">限制50字以内</span>
                    <el-button
                      class="reply_input"
                      type="primary"
                      plain
                      @click="replyComment('replyInput', comment)"
                      >回复评论</el-button
                    >
                  </div>
                </div>
              </div>
              <div
                class="reply_wrapper"
                v-for="reply in comment.reply"
                :key="reply.id"
              >
                <div class="reply_header">
                  <span>{{ reply.commonname }}</span
                  >回复
                  <span>{{ reply.replyname }}</span>
                </div>
                <div class="reply_text">{{ reply.description }}</div>
                <div class="reply_footer">
                  <div>
                    <span>{{ reply.createon | formateDate }}</span>
                    <span
                      class="reply"
                      @click="showReply('replyInput2', reply.id)"
                    >
                      <i class="icon iconfont icon-comment"></i>回复
                    </span>
                  </div>
                  <div
                    class="reply_input_wrapper"
                    v-show="replyInput2.isShow && currentId === reply.id"
                  >
                    <el-input
                      v-model.trim="replyInput2.text"
                      maxlength="50"
                    ></el-input>
                    <span class="tips2"></span>
                    <span class="text">限制50字以内</span>
                    <el-button
                      class="reply_input"
                      type="primary"
                      plain
                      @click="replyComment('replyInput2', reply)"
                      >回复评论</el-button
                    >
                  </div>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <!-- <el-button type="primary" v-if="isEdit" @click="saveNotice">确 定</el-button> -->
      </span>
    </el-dialog>
  </div>
</template>

<script>

import {
  getCommentMangementList,
  getDetails
} from '@/bpa/api/rulesCenter/commentManage'
import paginations from '@/bpa/mixins/pagination_mixin'
import fileOperation from '@/bpa/mixins/fileDownView'
import {
  getFormateDate
} from '@/bpa/utils/common'

import {
  saveCommentReply
} from '@/bpa/api/processModelCenter/processCommunity'
import { createNamespacedHelpers } from 'vuex'
import axios from 'axios'

const userInfo = createNamespacedHelpers('userInfo')
export default {
  data() {
    return {
      booksList: [],
      comment: {},
      keyWords: "",
      isSelectPersonVisible: false,
      dialogVisible: false,
      isHighSearch: false,
      isEdit: false,
      authority: "",
      params: { orderby: "createon", sort: "desc" },
      replyInput: {
        text: "",
        isShow: false,
      },
      replyInput2: {
        text: "",
        isShow: false,
      },
      searchForm: {
        description: "",
        username: "",
        content: "",
        createon: "",
      },
      editFormObj: {},
      pages: {
        pageSize: 10,
        pageNum: 1,
        total: 0,
      },
      rules: {
        description: [{ required: true, message: " ", trigger: "blur" }],
        username: [{ required: true, message: " ", trigger: "blur" }],
        content: [{ required: true, message: " ", trigger: "blur" }],
      },
      textMaxLength: 50, // 文本框最大字数限制
      areaMaxLength: 1000, // 文本框最大字数限制
      // 体系分类
      sysLists: [],
    };
  },
   mixins: [paginations, fileOperation],
  computed:{
    host() {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL;
    },
    action() {
      return `${this.host}/regulation/upload?username=${this.userid}`;
    },
    download() {
      return this.host + "/regulation/download/";
    },
    viewfile() {
      return this.host + "/document/print/";
    },
    userid() {
      return JSON.parse(localStorage.getItem("portalCurrentUserInfo") || "{}")
        .empuid;
    },
    username() {
      return JSON.parse(localStorage.getItem("portalCurrentUserInfo") || "{}")
        .cnname;
    },
  },

  mounted(){
 // 获取当前登录人权限
    // this.getAuthoriy()

    this.getList()
  },
  methods:{

     
       // 回复评论
    showReply (type, id) {
      this[type].isShow = true
      this[type].text = ''
      this.currentId = id
      this.$forceUpdate()
    },
    replyComment (type, item) {
      console.log(type, item)
      let obj = {
        commentid: this.comment.id,
        commonby: JSON.parse(
          localStorage.getItem('portalCurrentUserInfo') || {}
        ).empuid,
        description: this[type].text,
        replyby: item.commonby ? item.commonby : item.createby
      }
      // return
      saveCommentReply(obj).then(res => {
        if (!res) return
        this.$message({
          type: 'success',
          message: '回复评论成功!'
        })
        this[type].isShow = false
        this.getDetails(obj.commentid)
      })
    },
    // getAuthoriy () {
    //   axios
    //     .get(`${this.host}/jurisdictionConfigration/getByUserId/${this.userid}`)
    //     .then(rt => {
    //       let data = rt.data.data
    //       if (data.type === '1') {
    //         this.authority = '1'
    //       } else if (data.type === '2') {
    //         if (data.tzgl === 'Y') {
    //           this.authority = '2'
    //         } else {
    //           this.authority = '1'
    //         }
    //       } else if (data.type === '3') {
    //         this.authority = '3'
    //       }
    //     })
    // },
    addDialog () {
      this.dialogVisible = true
      this.docFile = []
      this.isEdit = true
      this.editFormObj = {
        description: '',
        username: '',
        content: '',
        createon: ''
      }
    },
    focusHandle () {
      this.selectedPersonList = []
      if (this.editFormObj.userid) {
        this.editFormObj.userid.split(',').forEach((item, index) => {
          this.selectedPersonList.push({
            cnname: this.editFormObj.username
              ? this.editFormObj.username.split(',')[index]
              : '',
            empuid: item
          })
        })
      }
      this.isSelectPersonVisible = true
    },
    addList () {
      this.editFormObj.list.push({})
    },
    singleSearch () {
      this.pages.pageNum = 1
      this.params = {
        orderby: 'createon',
        sort: 'desc',
        filters: [
          { key: 'description', opt: 'LIKE', type: 'S', value: this.keyWords },
          { key: 'listname', opt: 'LIKE', type: 'S', value: this.keyWords }
        ],
        logic: 'or'
      }
      this.getList()
    },
    handlerSelectPersonComfirm (list) {
      this.editFormObj.username = list
        .map(item => {
          return item.cnname
        })
        .toString()
      this.editFormObj.userid = list
        .map(item => {
          return item.empuid
        })
        .join(',')
    },
    highSearch () {
      this.pages.pageNum = 1
      this.params = {
        orderby: 'createon',
        sort: 'desc',
        logic: 'and',
        filters: [
          {
            key: 'description',
            opt: 'LIKE',
            type: 'S',
            value: this.searchForm.description
          },
          {
            key: 'listname',
            opt: 'LIKE',
            type: 'S',
            value: this.searchForm.listname
          },
          // 评论人
          {
            key: 'createname',
            opt: 'LIKE',
            type: 'S',
            value: this.searchForm.createname
          },
          // 评论人部门
          {
            key: 'deptname',
            opt: 'LIKE',
            type: 'S',
            value: this.searchForm.deptname
          },
          // 生效日期
          {
            key: 'createon',
            opt: 'BETWEEN',
            type: 'D',
            value:
              this.searchForm.createon && this.searchForm.createon.length
                ? this.searchForm.createon[0] +
                '~' +
                this.searchForm.createon[1]
                : ''
          }
        ]
      }
      this.getList()
    },
    reset () {
      this.pages.pageNum = 1
      this.keyWords = ''
      this.searchForm = {
        doctitle: '',
        enname: '',
        provideruser: '',
        docAuthorDis: '',
        status: '',
        name: '',
        value1: []
      }
      this.params = {
        orderby: 'createon',
        sort: 'desc'
      }
      this.getList()
    },
    getList () {
      let obj = {
        ...this.pages,
        ...this.params
      }
      getCommentMangementList(obj).then(res => {
        if (!res) return false
        this.booksList = res.list.map(item => {
          item.createon = !item.createon
            ? ''
            : getFormateDate(new Date(item.createon), 'yyyy-MM-dd hh:mm:ss')
          return item
        })
        this.pages.total = res.total
      })
    },

    //分页
     handleCurrentChange(value) {
      this.processlistpage = value;
      this.pages.pageNum = value
      // if(this.historyPages =='1'){
      // this.checkHistoryRules(this.docno)
      // }else{
      this.getList();
      // }
    },
    // 确认添加
    saveNotice () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.editFormObj.docFile = this.docFile
          this.editFormObj.fj = this.docFile.map(item => item.fileId).join(',')
          saveNotice(this.editFormObj).then(res => {
            this.$message({
              type: 'success',
              message: '保存成功！'
            })
            this.dialogVisible = false
            this.getList()
          })
        }
      })
    },
    deleteFile (index) {
      this.$confirm('确认要删除该条附件吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.docFile.splice(index, 1)
        })
        .catch(err => {
          console.log(err)
        })
    },
    getDetails (id) {
      getDetails(id).then(res => {
        if (!res) return false
        this.comment = res
        this.dialogVisible = true
      })
    }
  }
};
</script>

<style lang="scss" scoped>
#commentMangement {
    padding: 20px;
    .high_search{
        margin-left: 20px;
    }
  .comment_item {
    font-size: 14px;
    margin-top: 20px;
    .comment_header {
      color: #6495e0;
      line-height: 24px;
    }
    .comment_text {
      font-size: 16px;
      line-height: 30px;
    }
    .comment_footer {
      text-align: right;
      span:first-child {
        float: left;
      }
      span.delete {
        color: #999;
        cursor: pointer;
      }
      span.reply {
        color: #999;
        margin-left: 5px;
        cursor: pointer;
      }
    }
  }
  .reply_wrapper {
    padding-left: 15px;
    .reply_header {
      font-size: 14px;
      line-height: 24px;
      span {
        color: #6495e0;
        margin: 0 10px;
      }
    }
    .reply_text {
      margin-left: 10px;
      font-size: 16px;
      line-height: 30px;
    }
    .reply_footer {
      text-align: right;
      // line-height: 24px;
      padding-left: 10px;
      span {
        font-size: 14px;
        line-height: 24px;
      }
      span:first-child {
        float: left;
      }
      span.delete {
        color: #999;
        cursor: pointer;
      }
      span.reply {
        color: #999;
        margin-left: 5px;
        cursor: pointer;
      }
    }
  }
  .reply_input_wrapper {
    margin: 10px 0;
    position: relative;
    .text {
      position: absolute;
      top: 3px;
      right: 82px;
      color: #8994a0;
    }
    .reply_input {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
}
// .main_tab{
//   height: 500px;
// }
</style>