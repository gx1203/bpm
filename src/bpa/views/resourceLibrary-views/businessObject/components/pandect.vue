<template>
  <div id="pandect">
    <div class="h100 pad-t15px">
      <el-scrollbar class="h100">
        <el-row style="padding: 10px;">
          <el-col :span="24" class="title-box" style="min-height:236px">
            <el-row
              v-for="(child, index) in pandectList"
              :key="index"
              style="padding: 18px;"
            >
              <el-col :span="24">
                <div class="border color-b-b" />
                <div class="title color-b-f">
                  {{ child.listName }}
                </div>
                <div class="word">
                  <span v-if="stationName.length > 3" class="more" @click="getMore(child)">{{ child.levelIW }}</span>
                </div>
              </el-col>
              <el-col :span="24" class="title-box-bottom">
                <el-row :gutter="24">
                  <el-col
                    v-for="(item, index1) in child.nodeRespositoryViews"
                    v-if="index1 < child.levelI"
                    :key="index1"
                    :span="8"
                    style="height:24px;margin-bottom:10px;display: flex"
                  >
                    <div class="radius color-b-b" />
                    <div :title="item.nodeName" class="title text_overflow_1 cursor-pointer" @click="nodeClick(child.listid, item.keyid)">
                      {{ item.nodeName }}
                    </div>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-scrollbar>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Pandect',
  props: {
    ids: {
      type: Array,
      default: () => []
    },
    pandectList: {
      type: Array,
      default: () => []
    },
    relatelists: {
      type: Array,
      default: () => []
    },
    stationName: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      levelI: 3,
      levelII: 3,
      levelIII: 3,
      levelIV: 3,
      relative: 3,
      levelIW: this.$t('unfold'),
      levelIIW: this.$t('unfold'),
      levelIIIW: this.$t('unfold'),
      levelIVW: this.$t('unfold'),
      relativeW: this.$t('unfold'),
      josbsdialogVisible: false // 弹框
    }
  },
  mounted() {
  },
  methods: {
    // 查看更多
    getMore(child) {
      if (child.levelI === 3) {
        child.levelI = 999
        child.levelIW = this.$t('putAway')
      } else {
        child.levelI = 3
        child.levelIW = this.$t('unfold')
      }
    },
    nodeClick(listid, keyid) {
      this.$router.push({
        path: '/dataBank/businessRelation',
        query: { listid: listid, keyid: keyid }
      })
    }
  }
}
</script>

<style scoped lang="scss">
* {
  box-sizing: border-box;
}
#pandect {
  height: calc(100vh - 200px);
  /deep/ .el-scrollbar__wrap {
    padding: 0 !important;
  }
  .title-header {
    min-width: 111px;
    height: 38px;
    background: #b7bfea;
    border-radius: 10px 10px 0px 0px;
    // font-weight: bold;
    color: #2d42af;
    font-size: 15px;
    text-align: center;
    line-height: 42px;
    float: left;
    padding: 0px 8px;
  }
  .title-box {
    min-height: 136px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 8px 0px rgba(196, 204, 213, 1);
    border-radius: 10px;
    .border {
      width: 4px;
      height: 24px;
      border-radius: 2px;
      float: left;
      margin-top: 3px;
    }
    .title {
      font-size: 14px;
      float: left;
      margin-left: 20px;
      line-height:30px
    }
    .word {
      font-size: 14px;
      line-height: 30px;
    }
    .more {
      text-decoration: underline;
      color: rgba(45, 65, 175, 1);
      float: right;
      cursor: pointer;
    }
    .color-l-b {
      background: rgb(180, 205, 206);
    }
    .color-b-b {
      background: rgba(45, 65, 175, 1);
    }
    .color-sb-b {
      background: rgba(91, 111, 209, 1);
    }
    .color-l-f {
      color: rgba(27, 197, 199, 1);
    }
    .color-b-f {
      color: rgba(45, 65, 175, 1);
    }
    .color-sb-f {
      color: rgba(91, 111, 209, 1);
    }
    .title-box-bottom {
      border-bottom: 1px solid rgba(237, 237, 237, 1);
      padding: 10px 20px;
      .radius {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        float: left;
        margin-top: 7px;
      }
      .title {
        font-size: 14px;
        text-decoration: underline;
        color: rgba(135, 135, 135, 1);
        float: left;
        margin-left: 12px;
      }
    }
  }
  .common {
    line-height: 32px;
    margin-bottom: 25px;
    .title {
      border-bottom: 1px solid #ddd;
    }
    h5 {
      font-weight: 500;
      display: inline-block;
      vertical-align: top;
      border-bottom: 1px solid #308ae6;
      position: relative;
      bottom: -1px;
    }
    .content {
      li {
        display: inline-block;
        vertical-align: bottom;
        width: 30%;
        min-height: 30px;
        line-height: 30px;
        margin-right: 10px;
        word-break: break-all;
        padding: 5px 0;
        border-bottom: 1px dashed #ddd;
      }
    }
  }
  .content2 {
    margin: 10px 10px 0 0;
  }
  .el-tree {
    height: 280px;
    overflow: auto;
    /deep/ .el-tree-node__label {
      margin-left: 5px;
    }
  }
}
</style>
