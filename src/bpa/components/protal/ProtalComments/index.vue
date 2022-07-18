<template>
  <div class="msg-conten">
    <div v-for="(item,index) in cmmontslist" :key="index" class="contents">
      <p class="texts">{{ item.text }}</p>
      <ScoreComponent :options="personalinfo"/>
      <p class="comments" @click="goComments(item.id)">
        <i class="el-icon-edit" /> 评论
      </p>
      <p v-if="isShow===item.id" class="comments" @click="onSubmit">
        <i class="el-icon-chat-dot-round" /> 取消评论
      </p>
      <div style="clear: both;"></div>
      <div v-if="isShow===item.id" style="height: 100px;">
        <el-input clearable
          v-model="textareas"
          class="texts"
          type="textarea"
          rows="2"
          placeholder="写下你的评论..."
          maxlength="100"
          resize="none"
          show-word-limit
        />
        <el-button class="buts" type="primary" size="mini" @click="onSubmit">发布</el-button>
        <p class="msg-color">100 字</p>
      </div>
      <div class="contentss">
        <div>评论({{ item.total }})</div>
        <div class="msg-contents" v-for="(item1,index) in item.cmmonts" :key="index">
          <div style="margin-bottom: 10px;">
            <div class="div1">
              <span class="span1" style="float:left;">
                <img src="../../../assets/img/app_logo01.png" alt >
              </span>
              <span class="span2">
                <span class="span2_s1">{{ item1.author }}</span>
                <span class="span2_s2" style="float:right;">{{ item1.date }}</span>
              </span>
            </div>
            <div class="div2">{{ item1.text }}</div>
            <div style="margin-left: 30px;" class="div3" @click="goreply_s(item1.id)">
              <i class="el-icon-edit" /> 回复
            </div>
            <div v-if="item1.author==='张三'" class="div3" @click="deletereply(item1.id)">
               删除
            </div>
            <div v-if="isShow===item1.id" class="div3" @click="onSubmit1">
              <i class="el-icon-chat-dot-round" /> 取消回复
            </div>
            <div style="clear: both;"></div>
            <div v-if="isShow===item1.id">
              <el-input clearable
                v-model="textareas"
                class="texts"
                type="textarea"
                rows="2"
                placeholder="写下你的评论..."
                maxlength="100"
                show-word-limit
                resize="none"
              />
              <el-button class="buts" type="primary" size="mini" @click="onSubmit1">发布</el-button>
              <p class="msg-color">100 字</p>
            </div>
          </div>
          <div v-for="(item2,index) in item1.child" :key="index" style="margin-bottom: 10px;">
            <div class="div1">
              <span class="span1" style="float:left;">
                <img src="../../../assets/img/app_logo01.png" alt >
              </span>
              <span class="span2">
                <span class="span2_s1">
                  <span>{{ item2.author }}</span>
                  <span class="span2_s1_s1">回复</span>
                  <span>{{ item2.replier }}</span>
                </span>
                <span class="span2_s2" style="float:right;">{{ item2.date }}</span>
              </span>
            </div>
            <div class="div2">{{ item2.text }}</div>
            <div style="margin-left: 30px;" class="div3" @click="goreply_ss(item2.id)">
              <i class="el-icon-edit" /> 回复
            </div>
            <div v-if="item2.author==='张三'" class="div3" @click="deletereply(item1.id)">
               删除
            </div>
            <div v-if="isShow===item2.id" class="div3" @click="cancelreply">
              <i class="el-icon-chat-dot-round" /> 取消回复
            </div>
            <div style="clear: both;"></div>
            <div v-if="isShow===item2.id">
              <el-input clearable
                v-model="textareas"
                class="texts"
                type="textarea"
                rows="2"
                placeholder="写下你的评论..."
                maxlength="100"
                resize="none"
                show-word-limit
              />
              <el-button class="buts" type="primary" size="mini" @click="onSubmit2">发布</el-button>
              <p class="msg-color">100 字</p>
            </div>
            <!-- <div style="clear: both;"></div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ScoreComponent from "@/bpa/components/protal/PortalScore";
export default {
  name: "PortalScore",
  components: {
    ScoreComponent
  },
  data() {
    return {
      isShow: true,
      textareas: "",
      cmmontslist: [
        {
          total: "3",
          text: "开学了、我暑假作业怎么不见了？",
          cmmonts: [
            {
              text: "我是评论",
              id: 44,
              author: "张三",
              date: "2019-08-18",
              child: [
                {
                  text: "我是回复的评论,我是第一条回复",
                  pid: 1,
                  id: 55,
                  author: "李四",
                  replier: "张三",
                  date: "2019-08-18"
                },
                {
                  text: "我是回复的第一条评论,我是第二条回复",
                  pid: 1,
                  id: 66,
                  author: "王五",
                  replier: "李四",
                  date: "2019-08-18"
                }
              ]
            },
            {
              text: "我是评论",
              id: 77,
              author: "张三",
              date: "2019-08-18",
              child: [
                {
                  text: "我是回复的评论,我是第一条回复",
                  pid: 1,
                  id: 88,
                  author: "李四",
                  replier: "张三",
                  date: "2019-08-18"
                },
                {
                  text: "我是回复的第一条评论,我是第二条回复",
                  pid: 1,
                  id: 99,
                  author: "王五",
                  replier: "李四",
                  date: "2019-08-18"
                }
              ]
            }
          ]
        }
      ],
      personalinfo: {
        value: 4,
        isShow: "2"
      }
    };
  },
  mounted() {
    // this.fun();
  },
  methods: {
    // 获取评论数据
    // fun() {
    //   getComments('')
    //     .then(res => {
    //       console.log(res.data)
    //       this.cmmontslist = res.data.datalist
    //     })
    //     .catch(err => {
    //       console.log(err)
    //     })
    // },
    // 评论
    goComments(id) {
      this.isShow = id;
    },
    // 发布评论
    onSubmit() {
      console.log("评论：", this.textareas);
      this.isShow = false;
      this.textareas = "";
    },
    // 一级回复
    goreply_s(id) {
      this.isShow = id;
    },
    // 二级回复
    goreply_ss(id) {
      this.isShow = id;
    },
    // 一级发布回复
    onSubmit1() {
      this.isShow = false;
      this.textareas = ''
    },
    // 二级发布回复
    onSubmit2() {
      this.isShow = false;
      this.textareas = ''
    },
    // 取消评论
    cancelreply() {
      this.isShow = false;
      this.textareas = ''
    },
    // 删除评论
    deletereply() {
      this.$message({
        message: '删除成功',
        type: 'success'
      });
    }
  }
};
</script>

<style scoped>
* {
  font-size: 14px;
}
.msg-conten {
  width: 350px;
}
.texts {
  width: 100%;
  margin-top: 5px;
}
.contents {
  margin-top: 50px;
}
.contents > .texts {
  font-size: 16px;
  font-weight: 600;
}
.contents > .comments {
  max-width: 120px;
  min-width: 60px;
  float: left;
  color: #199edb;
  font-size: 12px;
  cursor: pointer;
  font-weight: 600;
}
.contents > .comments:hover {
  text-decoration: underline;
}
.contentss {
  border: 1px solid #ddd;
  margin-top: 15px;
}
.contentss > div:nth-child(1) {
  width: 100%;
  height: 30px;
  color: #888;
  line-height: 30px;
  font-weight: 600;
  text-indent: 5px;
  background-color: #e4e7ed;
}
.contentss > .msg-contents {
  padding: 5px 10px;
}
.buts {
  float: right;
  margin-top: 5px;
}
.msg-color {
  color: #199edb;
}
.span1 {
  display: inline-block;
  width: 28px;
  height: 28px;
}
.span1 img {
  width: 100%;
  height: 100%;
}
.span2 {
  /* float: left; */
  margin: 5px;
  width: 88%;
  display: inline-block;
}
.span2 .span2_s1 {
  width: 70%;
  display: inline-block;
}
.span2 .span2_s2 {
  color: #aaa;
}
.div1 {
  width: 100%;
  height: 30px;
}
.div2 {
  margin-left: 30px;
}
.div3 {
  max-width: 120px;
  float: left;
  color: #199edb;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  margin-top: 5px;
  margin-left: 10px;
}
.div3:hover {
  text-decoration: underline;
}
.span2_s1_s1 {
  margin: 0 6px;
  color: #aaa;
}
.msg-score {
  margin: 10px 0;
}
</style>
