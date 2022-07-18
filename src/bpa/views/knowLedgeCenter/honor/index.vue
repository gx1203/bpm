<template>
  <el-container>
    <el-aside width="200px" style="background: #f5f5f5">
      <portal-login-info :options="logininfoset" :logindata="logininfo" style="width: 99%;" />
      <div class="button-warrper">
        <el-button class="upload-button">上传文档</el-button>
      </div>
      <div>
        <know-tree-index />
      </div>
    </el-aside>
    <el-aside width="63%" style="padding: 10px;">
      <div class="clear-fix" style="height: 290px;width: 100%;overflow: hidden;">
        <div class="honortitle">
          <span>我获得的成就</span>
        </div>
        <el-scrollbar style="height: 100%;">
          <div v-for="(item,index) in gothonorinfo" :key="index" class="honorcard">
            <el-tooltip placement="right">
              <div slot="content">
                达成条件
                <br />
                上传量：{{ item.upsum }}/{{ item.targetUpload }}
                <br />
                阅读量：{{ item.readsum }}/{{ item.targetRead }}
                <br />
                下载量：{{ item.downsum }}/{{ item.targetDownload }}
                <br />
                评论量：{{ item.discuss }}/{{ item.targetDiscuss }}
                <br />
                收藏量：{{ item.collect }}/{{ item.targetCollect }}
                <br />
              </div>
              <img :src="item.imageUrl?item.imageUrl:honorimg" alt />
            </el-tooltip>
            <p>{{ item.name }}</p>
          </div>
        </el-scrollbar>
      </div>
      <div class="clear-fix" style="height: 290px;width: 100%;overflow: hidden;">
        <div class="honortitle">
          <span>未获得的成就</span>
        </div>
        <el-scrollbar style="height: 100%;">
          <div v-for="(item,index) in ungothonorinfo" :key="index" class="honorcard">
            <el-tooltip placement="right">
              <div slot="content">
                达成条件
                <br />
                上传量：{{ item.upsum }}/{{ item.targetUpload }}
                <br />
                阅读量：{{ item.readsum }}/{{ item.targetRead }}
                <br />
                下载量：{{ item.downsum }}/{{ item.targetDownload }}
                <br />
                评论量：{{ item.discuss }}/{{ item.targetDiscuss }}
                <br />
                收藏量：{{ item.collect }}/{{ item.targetCollect }}
                <br />
              </div>
              <img :src="item.imageUrl?item.imageUrl:honorimg" alt />
            </el-tooltip>
            <p>{{ item.name }}</p>
          </div>
        </el-scrollbar>
      </div>
    </el-aside>
    <el-aside width="20%" style="margin: 10px;">
      <birthday-blessing :birth-list="birthList" />
    </el-aside>
  </el-container>
</template>

<script>
import KnowTreeIndex from '../components/tree1'
import PortalLoginInfo from '@/bpa/components/protal/portallogininfo'
import userImg from '@/bpa/assets/img/user.png'
import honorimg from '@/bpa/assets/img/honor1.png'
import BirthdayBlessing from '@/bpa/components/protal/BirthdayBlessing'

export default {
  name: 'KnowLedgehonor',
  components: {
    KnowTreeIndex,
    PortalLoginInfo,
    BirthdayBlessing
  },
  data() {
    return {
      logininfoset: {
        disabled: true, // true 启用，false禁用
        showtext: true,
        customColors: [
          { color: '#f56c6c', percentage: 20 },
          { color: '#e6a23c', percentage: 40 },
          { color: '#6f7ad3', percentage: 100 }
        ]
      },
      logininfo: {
        imageUrl: userImg,
        name: '黄金龙',
        levelname: '黄金荣耀', // 当前等级称谓
        level: 'Lv5', // 当前level
        levelscore: '48', // 当前level最低分
        levelscoretotal: '64', // 当前level最高分
        levelcolor: 'blue' // 等级称谓颜色
      },
      birthList: [
        { name: '张三', avatar: '', dep: '生产组' },
        { name: '李四', avatar: '', dep: '生产组' },
        { name: '王五', avatar: '', dep: '生产组' },
        { name: '赵六', avatar: '', dep: '生产组' },
        { name: '朱七', avatar: '', dep: '生产组' },
        { name: '张三', avatar: '', dep: '生产组' },
        { name: '李四', avatar: '', dep: '生产组' },
        { name: '王五', avatar: '', dep: '生产组' },
        { name: '赵六', avatar: '', dep: '生产组' }
      ],
      honorimg,
      gothonorinfo: [
        {
          imageUrl: '',
          name: '上传达人',
          upsum: '1230',
          targetUpload: '1500',
          readsum: '488',
          targetRead: '64',
          downsum: '168',
          targetDownload: '365',
          discuss: '666',
          targetDiscuss: '2222',
          collect: '432',
          targetCollect: '235'
        },
        {
          imageUrl: '',
          name: '阅读达人',
          upsum: '1230',
          targetUpload: '1500',
          readsum: '488',
          targetRead: '64',
          downsum: '168',
          targetDownload: '365',
          discuss: '666',
          targetDiscuss: '2222',
          collect: '432',
          targetCollect: '235'
        },
        {
          imageUrl: '',
          name: '发帖达人',
          upsum: '1230',
          targetUpload: '1500',
          readsum: '488',
          targetRead: '64',
          downsum: '168',
          targetDownload: '365',
          discuss: '666',
          targetDiscuss: '2222',
          collect: '432',
          targetCollect: '235'
        },
        {
          imageUrl: '',
          name: '发帖达人',
          upsum: '1230',
          targetUpload: '1500',
          readsum: '488',
          targetRead: '64',
          downsum: '168',
          targetDownload: '365',
          discuss: '666',
          targetDiscuss: '2222',
          collect: '432',
          targetCollect: '235'
        },
        {
          imageUrl: '',
          name: '发帖达人',
          upsum: '1230',
          targetUpload: '1500',
          readsum: '488',
          targetRead: '64',
          downsum: '168',
          targetDownload: '365',
          discuss: '666',
          targetDiscuss: '2222',
          collect: '432',
          targetCollect: '235'
        },
        {
          imageUrl: '',
          name: '发帖达人',
          upsum: '1230',
          targetUpload: '1500',
          readsum: '488',
          targetRead: '64',
          downsum: '168',
          targetDownload: '365',
          discuss: '666',
          targetDiscuss: '2222',
          collect: '432',
          targetCollect: '235'
        },
        {
          imageUrl: '',
          name: '发帖达人',
          upsum: '1230',
          targetUpload: '1500',
          readsum: '488',
          targetRead: '64',
          downsum: '168',
          targetDownload: '365',
          discuss: '666',
          targetDiscuss: '2222',
          collect: '432',
          targetCollect: '235'
        },
        {
          imageUrl: '',
          name: '发帖达人',
          upsum: '1230',
          targetUpload: '1500',
          readsum: '488',
          targetRead: '64',
          downsum: '168',
          targetDownload: '365',
          discuss: '666',
          targetDiscuss: '2222',
          collect: '432',
          targetCollect: '235'
        },
        {
          imageUrl: '',
          name: '发帖达人',
          upsum: '1230',
          targetUpload: '1500',
          readsum: '488',
          targetRead: '64',
          downsum: '168',
          targetDownload: '365',
          discuss: '666',
          targetDiscuss: '2222',
          collect: '432',
          targetCollect: '235'
        },
        {
          imageUrl: '',
          name: '发帖达人',
          upsum: '1230',
          targetUpload: '1500',
          readsum: '488',
          targetRead: '64',
          downsum: '168',
          targetDownload: '365',
          discuss: '666',
          targetDiscuss: '2222',
          collect: '432',
          targetCollect: '235'
        },
        {
          imageUrl: '',
          name: '发帖达人',
          upsum: '1230',
          targetUpload: '1500',
          readsum: '488',
          targetRead: '64',
          downsum: '168',
          targetDownload: '365',
          discuss: '666',
          targetDiscuss: '2222',
          collect: '432',
          targetCollect: '235'
        }
      ],
      ungothonorinfo: [
        {
          imageUrl: '',
          name: '上传达人',
          upsum: '1230',
          targetUpload: '1500',
          readsum: '488',
          targetRead: '64',
          downsum: '168',
          targetDownload: '365',
          discuss: '666',
          targetDiscuss: '2222',
          collect: '432',
          targetCollect: '235'
        },
        {
          imageUrl: '',
          name: '阅读达人',
          upsum: '1230',
          targetUpload: '1500',
          readsum: '488',
          targetRead: '64',
          downsum: '168',
          targetDownload: '365',
          discuss: '666',
          targetDiscuss: '2222',
          collect: '432',
          targetCollect: '235'
        },
        {
          imageUrl: '',
          name: '发帖达人',
          upsum: '1230',
          targetUpload: '1500',
          readsum: '488',
          targetRead: '64',
          downsum: '168',
          targetDownload: '365',
          discuss: '666',
          targetDiscuss: '2222',
          collect: '432',
          targetCollect: '235'
        }
      ]
    }
  },
  methods: {
    // 获取列表数据
    fun() {
      getComments({
        pageNum: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        filters: []
      })
        .then(res => {
          console.log(res.data)
          this.tableData = res.data.tableData
          this.pagination.total = res.data.count
        })
        .catch(err => {
          console.log(err)
        })
    },
    search() {
      // this.fun()
    },
    // 立即搜索
    submitForm1(formName) {
      console.log(this.ruleForm1)
    },
    //  重置
    resetForm1(formName) {
      this.$refs[formName].resetFields()
    },
    // 维度
    godimension() {
      this.dialogVisible = true
    },
    // 获取树的勾选数据
    getCheckedNodes() {
      this.dialogVisible = false
      this.ruleForm1.name6 = []
      for (let i = 0; i < this.msgFormSon.length; i++) {
        this.ruleForm1.name6.push(this.msgFormSon[i].name)
      }
      console.log(this.ruleForm1.name6)
    },
    getMsgFormSon(data) {
      this.dialogVisible = false
      console.log(data)
      this.msgFormSon = data
      console.log(this.msgFormSon)
      this.ruleForm1.name6 = []
      for (let i = 0; i < this.msgFormSon.length; i++) {
        this.ruleForm1.name6.push(this.msgFormSon[i].name)
      }
      console.log(this.ruleForm1.name6)
    },
    SizeChange(val) {
      console.log(val)
      this.pagination.currentPage = val
      // this.fun()
    },
    CurrentChange(val) {
      console.log(val)
      this.pagination.currentPage = val
      // this.fun()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../mixin/search-box';

.right-content {
  height: calc(100vh - 160px);
  .el-scrollbar__wrap {
    height: 100%;
  }
  .el-scrollbar__view {
    height: 100%;
  }
}
.button-warrper {
  padding: 20px 0;
  display: flex;
  justify-content: center;
  .upload-button {
    padding: 10px 60px;
    background-color: #66b1ff;
  }
}
.left_tree_wrapper.el-scrollbar {
  height: calc(100vh - 208px) !important;
}
/*清浮动*/
.clear-fix:after {
  content: '.';
  clear: both;
  display: block;
  height: 0;
  overflow: hidden;
  visibility: hidden;
}
.honortitle {
  padding: 20px 0 2px 0;
  border-bottom: 2px solid #efefef;
}
.honortitle span {
  font-size: 18px;
  font-weight: 600;
  padding: 2px 0;
  border-bottom: 2px solid #5255f0;
}
.honorcard {
  float: left;
  width: 23%;
  margin: 20px 0;
}
.honorcard img {
  width: 66px;
  display: block;
  margin: 0 auto;
}
.honorcard p {
  text-align: center;
  margin: 0;
}
.el-scrollbar /deep/ .el-scrollbar__wrap {
  overflow: scroll;
  width: 110%;
  height: 90%;
}
</style>
