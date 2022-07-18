<template>
  <div class="blessing">
    <div class="blessing_title clear_float">
      <div :class="{'active': tabIndex === 'to'}" class="link" @click="tabClick('to')">生日祝福</div>
      <div :class="{'active': tabIndex === 'from'}" class="link" @click="tabClick('from')">收到的祝福</div>
      <div class="link more" @click="goWishesList">更多 ></div>
    </div>
    <el-scrollbar style="height:100%">
      <div class="blessing_main">
        <template v-if="tabIndex === 'to'">
          <div
            v-for="(item, index) in birthList"
            :key="index"
            class="birthday-list clear_float"
            style="padding: 0 20px 0 10px;"
          >
            <div class="media-left">
              <img :src="item.avatar ? item.avatar :defaultAvatar" alt="头像" />
            </div>
            <div class="media-body">
              <div class="name">{{ item.name }}</div>
              <div class="text-muted">{{ item.dep }}</div>
            </div>
            <div class="media-right" style=" padding-top: 10px;float:right">
              <div>
                <el-button class="mini" size="mini" @click="showBlessingForm()">送上祝福</el-button>
              </div>
            </div>
          </div>
          <div v-if="birthList.length < 1" style="margin-top: 80px;width: 100%">
            <img :src="noData" alt="无数据" />
          </div>
        </template>
        <template v-if="tabIndex === 'from'">
          <div v-for="(item, index) in wishesList" :key="index" class="wishes-media">
            <div class="birthday-list clear_float">
              <div class="media-left">
                <img :src="item.avatar ? item.avatar :defaultAvatar" alt="头像" />
              </div>
              <div class="media-body">
                <div class="name">{{ item.name }}</div>
                <div class="text-muted">{{ item.dep }}</div>
              </div>
              <div class="media-right" style=" width: 100px;">{{ item.desc }}</div>
            </div>
          </div>
          <div v-if="wishesList.length < 1" style="margin-top: 80px;width: 100%">
            <img :src="noData" alt="无数据" />
          </div>
        </template>
      </div>
    </el-scrollbar>
    <!-- 消息弹窗 -->
    <el-dialog :visible.sync="formShow" title="生日祝福" width="50%" @close="resetForm">
      <el-row>
        <div class="label">送上您的祝福语</div>
        <div class="value-wrapper">
          <el-input clearable
            v-model="textareas"
            class="texts"
            type="textarea"
            rows="4"
            placeholder="写下你的评论..."
            maxlength="100"
            show-word-limit
          />
        </div>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="resetForm">取消</el-button>
        <el-button size="small" type="primary" @click="submitForm">发送</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import defaultAvatar from '@/bpa/assets/img/user_head.png'
import noData from '@/bpa/assets/img/no-data.jpg'
// import wishesFrom from '@/bpa/components/WishesFrom'
export default {
  name: 'BirthdayBlessing',
  components: {
    // wishesFrom
  },
  props: {
    birthList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      tabIndex: 'to',
      defaultAvatar,
      noData,
      formShow: false,
      textareas: '',
      wishesList: []
    }
  },
  methods: {
    tabClick(tab) {
      this.tabIndex = tab
    },
    showBlessingForm() {
      this.formShow = true
    },
    //  消息取消
    resetForm() {
      this.formShow = false
      this.textareas = ''
    },
    submitForm() {
      this.formShow = false
      this.textareas = ''
      this.$message({
        message: '发送成功！',
        type: 'success'
      })
    },
    goWishesList() {
      this.$router.push({ name: 'wishes' })
    }
  }
}
</script>

<style lang="scss" scoped>
.blessing {
  width: 90%;
  height: 83%;
  border: 0 none;
  overflow: hidden;
  border-radius: 10px;
  margin-bottom: 12px;
  margin: 5px 0px 0px 5px;
  padding: 8px;
  // box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
  &_title {
    line-height: 1;
    font-size: 13px;
    position: relative;
    border-bottom: dashed 2px #ccc;
    .link {
      float: left;
      padding: 0 5px 10px;
      border-bottom: solid 3px transparent;
      float: left;
      position: relative;
      top: 1px;
      cursor: pointer;
      margin-right: 5px;
      transition: all 0.2s ease-in-out;
    }
    .link.active {
      border-color: #2a552b;
      font-weight: bold;
    }
    .link.more {
      float: right;
      color: #006953;
    }
  }
  &_main {
    width: 100%;
    padding-bottom: 20px;
    .birthday-list {
      margin-top: 15px;
      .media-left {
        padding-right: 4%;
        display: table-cell;
        vertical-align: top;
        float: left;
        img {
          width: 56px;
          height: 56px;
        }
      }
      .media-body {
        width: 33%;
        display: table-cell;
        vertical-align: top;
        float: left;
        font-size: 13px;
        .name {
          margin-top: 5px;
          margin-bottom: 5px;
        }
        .text-muted {
          font-size: 12px;
          color: #777;
          margin: 5px 0 10px 0;
        }
      }
      .media-right {
        float: left;
        font-size: 14px;
        .mini {
          padding: 5px 8px;
        }
      }
    }
  }
  .label {
    width: 115px;
    text-align: right;
    font-weight: 600;
    padding: 4px 10px 0 0;
    float: left;
  }
  .value-wrapper {
    /*float: left;*/
    margin-left: 115px;
  }
  .el-scrollbar /deep/ .el-scrollbar__wrap {
    overflow: scroll;
    width: 107%;
    height: 100%;
  }
}
</style>
