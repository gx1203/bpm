<template>
  <el-dialog
    title=""
    :visible.sync="dialogVisible"
    width="84%"
    height="82%"
    class="dialogbox"
    :show-close="false"
    :close-on-click-modal="true"
    :destroy-on-close="true"
    :close-on-press-escape="true"
    :modal="true"
  >
    <div class="mainbox">
      <div class="iptbox" style="width: 100%; text-align: right">
        <el-input
          clearable
          v-model="filterText"
          placeholder="输入关键字进行过滤"
          class="search_components search_component"
          @keyup.13.native="filterTree"
        >
          <el-button slot="append" type="primary" @click.stop="filterTree"
            >{{ $t('search') }}
          </el-button>
        </el-input>
      </div>
      <div class="nav-box">
        <div class="nav-box-left">
          <el-row class="nav-box">
            <el-col
              :span="24"
              :class="
                index % 2 === 0 ? 'nav-box-li nav-box-li-border' : 'nav-box-li'
              "
              v-for="(item, index) in treedata"
              :key="item.id"
              v-if="index % 2 === 0"
            >
              <div class="nav-box-li-title">
                <span class="border-left"></span>
                <span style="margin-left:10px">{{ item.name }}</span>
              </div>
              <div
                class="nav-box-li-li"
                v-for="items in item.subNodes"
                :key="items.id"
              >
                <div
                  class="li-title"
                  v-if="items.subNodes.length > 0"
                  :title="items.name + ' >'"
                >
                  {{ items.name }} >
                </div>
                <div class="title-right">
                  <div
                    class="right-li"
                    v-for="node in items.subNodes"
                    :key="node.id"
                    :title="node.names ? node.names : node.name"
                  >
                    <div
                      class="right-li-li"
                      v-if="node.subNodes.length === 0"
                      v-html="node.name"
                      @click.stop="nodeClick(node)"
                    ></div>
                    <el-popover
                      v-else
                      placement="right"
                      width="400"
                      trigger="hover"
                    >
                      <div class="right-li-hover">
                        <div
                          class="hover-li"
                          v-for="nodes in node.subNodes"
                          :key="nodes.id"
                          :title="nodes.name"
                          @click.stop="nodeClick(nodes)"
                        >
                          {{ nodes.name }}
                        </div>
                      </div>
                      <div slot="reference" v-html="node.name"></div>
                    </el-popover>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="nav-box-right">
          <el-row class="nav-box">
            <el-col
              :span="24"
              :class="
                index % 2 === 0 ? 'nav-box-li nav-box-li-border' : 'nav-box-li'
              "
              v-for="(item, index) in treedata"
              :key="item.id"
              v-if="index % 2 !== 0"
            >
              <div class="nav-box-li-title">
                <span class="border-left"></span>
                <span style="margin-left:10px">{{ item.name }}</span>
              </div>
              <div
                class="nav-box-li-li"
                v-for="items in item.subNodes"
                :key="items.id"
              >
                <div
                  class="li-title"
                  v-if="items.subNodes.length > 0"
                  :title="items.name + ' >'"
                >
                  {{ items.name }} >
                </div>
                <div class="title-right">
                  <div
                    class="right-li"
                    v-for="node in items.subNodes"
                    :key="node.id"
                    :title="node.names ? node.names : node.name"
                  >
                    <div
                      class="right-li-li"
                      v-if="node.subNodes.length === 0"
                      v-html="node.name"
                      @click.stop="nodeClick(node)"
                    ></div>
                    <el-popover
                      v-else
                      placement="right"
                      width="400"
                      trigger="hover"
                    >
                      <div class="right-li-hover">
                        <div
                          class="hover-li"
                          v-for="nodes in node.subNodes"
                          :key="nodes.id"
                          :title="nodes.name"
                          @click.stop="nodeClick(nodes)"
                        >
                          {{ nodes.name }}
                        </div>
                      </div>
                      <div slot="reference" v-html="node.name"></div>
                    </el-popover>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'MenuNavigation',
  components: {},
  data() {
    return {
      filterText: '',
      treelist: '',
      dialogVisible: false,
      treedata: []
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    filterText(val) {
      this.filterTree()
    },
    value(val) {
      this.dialogVisible = val
      if (val) {
        this.filterTree()
      }
    },
    dialogVisible(val) {
      this.$emit('input', val)
    }
  },
  computed: {},
  mounted() {
    this.gettreelist()
  },
  methods: {
    // 导航搜索方法
    filterTree() {
      if (this.filterText) {
        let treelist = JSON.parse(JSON.stringify(this.treelist))
        treelist.forEach(item => {
          if (item.subNodes.length > 0) {
            item.subNodes.forEach(items => {
              if (items.subNodes.length > 0) {
                items.subNodes.forEach(node => {
                  if (node.name.indexOf(this.filterText) !== -1) {
                    this.$set(node, 'names', node.name)
                    node.name = node.name.replace(
                      this.filterText,
                      '<span class="words-span">' + this.filterText + '</span>'
                    )
                  }
                })
              }
            })
          }
        })
        this.treedata = treelist
      } else {
        this.treedata = JSON.parse(JSON.stringify(this.treelist))
      }
      console.log('00009asd0as9d0a', this.treedata)
    },
    nodeClick(data, node) {
      if (data.url.indexOf('/') != -1) {
        this.$router.push({
          path: data.url
        })
        this.dialogVisible = false
      } else {
        if (data.url.split('?').length > 1) {
          this.$router.push({
            path: data.url.split('?')[0],
            query: this.getQueryString(data.url)
          })
        } else {
          this.$router.push({
            path: data.url
          })
        }
      }
      this.dialogVisible = false
    },
    // 获取导航数据
    gettreelist() {
      let arr = new Array()
      this.treelist = []
      var treelist = JSON.parse(localStorage.getItem('bpm_pc_nav_records')).app
        .tabList
      treelist.forEach(item => {
        if (item.url == '/knowLedge') {
          item.subNodes.forEach(ele => {
            if (ele.url == '/knowLedge/index') {
              ele.subNodes.forEach(val => {
                if (val.url == '/knowLedge/permission') {
                  val.subNodes = []
                }
              })
            }
          })
        }
      })
      treelist.forEach((item, index) => {
        if (item.subNodes.length !== 0) {
          this.treelist.push(item)
        }
      })
      // this.treelist.sort(this.dataSort)
    },
    // 导航排序
    dataSort(a, b) {
      return a.subNodes.length - b.subNodes.length
    }
  }
}
</script>
<style>
.parent-header .el-dialog__wrapper {
  margin-top: 0vh !important;
}
.header .el-dialog {
  margin: 0 auto;
}
.header::-webkit-scrollbar {
  width: 6px;
  height: 6px;
  background: transparent;
}

.header::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 4px;
}

.header:hover::-webkit-scrollbar-thumb {
  background: hsla(0, 0%, 53%, 0.4);
}

.header:hover::-webkit-scrollbar-track {
  background: hsla(0, 0%, 53%, 0.1);
}
</style>
<style lang="scss">
.header {
  .el-dialog {
    margin-top: 0px;
  }
}
</style>
<style lang="scss" scoped>
.right-li-hover {
  display: flex;
  flex-wrap: wrap;
  .hover-li {
    width: 18%;
    margin-left: 2%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 12px;
    cursor: pointer;
    &:hover {
      color: #519eff;
      text-decoration: underline;
    }
    .words-span {
      background: #e6d9a7;
      color: #000;
      padding: 4px;
    }
  }
}
.mainbox /deep/ {
  width: 100%;
  margin: 0 auto;
  .search_components {
    max-width: 204px;
    margin-bottom: 0px !important;
  }
  .nav-box {
    .nav-box-left,
    .nav-box-right {
      width: 50%;
      float: left;
    }
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .nav-box-li-title {
      font-weight: 700;
      margin-bottom: 12px;
    }
    .nav-box-li {
      padding: 8px 16px;
      .nav-box-li-li {
        width: 100%;
        .li-title {
          width: 18%;
          float: left;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-weight: 700;
        }
        .title-right {
          width: 82%;
          float: left;
          display: flex;
          flex-wrap: wrap;
          .right-li {
            width: 18%;
            margin-left: 2%;
            margin-bottom: 12px;
            cursor: pointer;
            &:hover {
              color: #519eff;
              text-decoration: underline;
            }
            .words-span {
              background: #e6d9a7;
              color: #000;
              padding: 4px;
            }
            .right-li-li {
              width: 100%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
      }
    }
    .nav-box-li-border {
      border-right: 1px #d2cece dotted;
    }
  }
  .el-tree-node:focus > .el-tree-node__content {
    background-color: #eee !important;
  }
  .el-tree-node__content:hover {
    background-color: rgba(0, 0, 0, 0);
  }
  .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    background-color: #eee;
  }
  .el-tree .el-tree-node__expand-icon.expanded {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
    // margin-top: 12px;
  }
  .el-tree .el-icon-caret-right:before {
    content: '';
  }
  .el-tree .el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
    content: '';
  }

  .el-tree-node__label {
    width: auto;
    margin-top: 12px;
    float: right;
    font-size: 14px;
    color: #999999;
    line-height: 25px;
    letter-spacing: 1px;
  }
  .el-tree-node {
    margin: 10px 0;
  }
  .el-tree-node__content {
    text-align: center;
    padding: 15px;
  }
}
.dialogbox /deep/ {
  .el-dialog .el-dialog__header {
    border-bottom: none;
    padding: 0px !important;
    padding-bottom: 0px !important;
  }
}
.header /deep/ {
  .el-dialog .el-dialog__header {
    border-bottom: none;
    padding: 0px !important;
    padding-bottom: 0px !important;
  }
  .dialogbox {
    top: 66px;
    .el-dialog {
      margin-top: 0vh !important;
      .el-dialog__body {
        padding: 10px 15px;
        //max-height: 450px;
        overflow: none;
        box-sizing: border-box;
      }
    }
  }
}
.hover:hover {
  color: #000;
  &:hover {
    color: #519eff;
  }
}

.el-dialog__body::-webkit-scrollbar /deep/ {
  /*滚动条整体样式*/
  width: 0px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 0px;
}
.el-dialog__body::-webkit-scrollbar-thumb /deep/ {
  /*滚动条里面小方块*/
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #535353;
}
.el-dialog__body::-webkit-scrollbar-track /deep/ {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #ededed;
}
.dialogbox::-webkit-scrollbar /deep/ {
  /*滚动条整体样式*/
  width: 0px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 0px;
}
.dialogbox::-webkit-scrollbar-thumb /deep/ {
  /*滚动条里面小方块*/
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #535353;
}
.dialogbox::-webkit-scrollbar-track /deep/ {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #ededed;
}

.border-left::before {
  content: '';
  border-left: 4px solid #ec2323;
}

.Suk {
  color: rgb(45, 66, 175);
  display: flex;
}
</style>
