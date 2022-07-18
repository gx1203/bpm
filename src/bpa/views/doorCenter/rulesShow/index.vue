<template>
  <div style="margin:0 auto;width:100%">
    <div style="width: 1200px;text-align:right;margin: auto;">
      <el-link :underline="false" @click="$router.go(-1)" type="primary">{{$t('return')}}</el-link>
    </div>
    <div v-if="typeStyles==='treeShape'">
      <div class="continer-top">
        <!-- <div class="btn-fullscreen" @click="handleFullScreen">
        <el-tooltip :open-delay="1000" :content="fullscreen ? `取消全屏`:`全屏`" effect="dark" placement="bottom">
          <i class="el-icon-rank"/>
        </el-tooltip>
      </div> -->
        <!-- <el-button :class="{'active-buton': activeId == pId}" round @click="getFolderListById(pId)">总览</el-button>
      <el-button v-for="(item, index) in postList" :key="item.id" :class="{'active-buton': activeId == item.id}" round @click="getFolderListById(item.id)">{{ item.name }}</el-button> -->

        <!-- <el-popover placement="bottom-start" width="620" v-for="(item, index) in postLists" :key="item.id"
          trigger="hover">
          <div>
            <el-button v-for="(items, indexs) in item.children" :key="items.id"
              :class="{'active-buton': activeId == items.id}" :style="index === 0 ? 'margin-left: 10px' : ''" round
              class="buton" style="margin-bottom:12px" @click="getFolderListById(items.id, items.pid)">{{ items.name }}
            </el-button>
          </div>
          <el-button slot="reference" class="buton"
            :class="{'active-buton': activeId == item.id, 'active-pid':activePid == item.id}"
            :style="index === 0 ? 'margin-right: 12px' : ''" @click="getFolderListById(item.id, item.pid)">
            {{ item.name}}</el-button>
        </el-popover> -->
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane v-for="(item, index) in postLists" :key="index" :name="item.id">
            <span slot="label" @click="getFolderListById(item.id, item.pid);checkItem=item">
              {{ item.name}}
              <!-- <el-popover placement="bottom-start" width="620" trigger="hover">
                <div slot="reference">{{ item.name}}</div>
                <div>
                  <el-button v-for="(items, indexs) in item.children" :key="items.id"
                    :class="{'active-buton': activeId == items.id}" :style="index === 0 ? 'margin-left: 10px' : ''"
                    round class="buton" style="margin-bottom:12px"
                    @click="getFolderListById(items.id, items.pid);checkItem=item">
                    {{ items.name }}
                  </el-button>
                </div>
              </el-popover> -->
            </span>
          </el-tab-pane>
        </el-tabs>
        <div class="childrenList">
          <el-tabs>
            <el-tab-pane>
              <span slot="label">
                <el-button v-for="(items, indexs) in checkItem.children" :key="items.id"
                  :class="{'active-buton': activeId == items.id}" round class="buton" style="margin-bottom:12px"
                  @click="getFolderListById(items.id, items.pid)">
                  {{ items.name }}
                </el-button>
              </span>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <!-- <HR align="center" width="1200px" class="continer-btn" /> -->
      <div class="continer-bottom">
        <tree :tree-data="treeData" :levelMax="levelMax" />
      </div>
    </div>
    <div v-else>
      <frame-show :displaymode="displaymode" :attrid="attrid" />
    </div>
  </div>
</template>
<script>
import tree from './component'
import { getProcessTree } from '@/bpa/api/processModelCenter/processIframeCenter'
import { getProcessIframeTree } from '@/bpa/api/componentsApi'
import frameShow from '@/bpa/components/processFrameShow2.vue'

export default {
  components: {
    tree,
    frameShow
  },
  data () {
    return {
      activeName: '',
      typeStyles: '',
      nams: false,
      treeData: [],
      fullscreen: false,
      levelMax: false,
      activeId: '',
      activePid: '',
      postList: [], // 少量按钮
      postLists: [],
      checkItem: {}
    }
  },
  props: ['attrid', 'displaymode']
  ,
  computed: {
    pId () {
      return '1'
    }
  },
  created () { },
  mounted () {
    if (this.$route.query.type) {
      this.typeStyles = this.$route.query.type
    } else if (this.displaymode) {
      this.typeStyles = this.displaymode
    }
    this.getFolder()
  },
  methods: {
    handleClick (tab) {
      console.log(tab)
    },
    // 初始化数据
    getFolder () {
      // 获取顶部按钮数据
      getProcessIframeTree(0).then(res => {
        if (res && res.length > 0) {
          getProcessIframeTree(res[0].id).then(res => {
            this.postLists = res
            this.checkItem = res.filter(x => x.id == this.$route.query.pid)[0]
            this.activeName = this.checkItem.id
            console.log(this.checkItem)
            res.map((item, index) => {
              getProcessIframeTree(item.id).then(res => {
                this.postLists[index].children = res
                this.postLists.splice(0, 0)
              })
            })
            if (this.$route.query.attrid) {
              this.activeId = this.$route.query.attrid
            } else if (this.attrid) {
              this.activeId = this.attrid
            } else {
              this.activeId = this.pId
            }
            if (this.$route.query.pid) {
              this.activePid = this.$route.query.pid
            } else {
              this.activePid = this.pId
            }
            this.getFolderListById(this.activeId, this.activePid)
          })
        }
      })
    },
    handleFullScreen () {
      const element = document.documentElement
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen()
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen()
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen()
        }
      }
      this.fullscreen = !this.fullscreen
    },
    // 获取制度下的数据
    getFolderListById (id, pid) {
      this.activeId = id
      this.activePid = pid
      getProcessTree({ 'id': id, 'state': '0' }).then(res => {
        this.treeData = []
        var arr = [res]
        this.treeData = arr.map(item => {
          item.parents = [item.id]
          item.show = 1
          item.area = item.name
          if (item.children !== null && item.children.length > 0) {
            item.children.map(items => {
              items.parents = [item.id, items.id]
              items.show = 1
              items.area = items.name
              if (items.children !== null && items.children.length > 0) {
                items.children.map(itemss => {
                  itemss.parents = [item.id, items.id, itemss.id]
                  itemss.show = 1
                  itemss.area = itemss.name
                  if (itemss.children !== null && itemss.children.length > 0) {
                    itemss.children.map(itemsss => {
                      itemsss.parents = [item.id, items.id, itemss.id, itemsss.id]
                      itemsss.show = 1
                      itemsss.area = itemsss.name
                      if (itemsss.children !== null && itemsss.children.length > 0) {
                        this.levelMax = true
                        itemsss.children.map(itemssss => {
                          itemssss.show = 1
                          itemssss.parents = [item.id, items.id, itemss.id, itemsss.id, itemssss.id]
                          itemssss.area = itemssss.name
                          if (itemssss.children !== null && itemssss.children.length > 0) {
                            itemssss.children.map(itemsssss => {
                              itemsssss.show = 1
                              itemsssss.parents = [item.id, items.id, itemss.id, itemsss.id, itemssss.id]
                              itemsssss.area = itemsssss.name
                              if (itemsssss.children !== null && itemsssss.children.length > 0) {
                                itemsssss.children.map(itemssssss => {
                                  itemssssss.show = 1
                                  itemssssss.parents = [item.id, items.id, itemss.id, itemsss.id, itemssss.id]
                                  itemssssss.area = itemssssss.name
                                  return itemssssss
                                })
                              }
                              return itemsssss
                            })
                          }
                          return itemssss
                        })
                      }
                      return itemsss
                    })
                  }
                  return itemss
                })
              }
              return items
            })
          }
          return item
        })
        this.$set(this.treeData[0], 'changeTime', Date.parse(new Date())) // 刷新数据
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.continer-top {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 1200px;
  background: #fff;
  z-index: 999;
  text-align: center;
  // line-height: 36px;
  .childrenList {
    /deep/ .el-tabs__active-bar {
      background: #fff;
    }
    /deep/ .el-tabs__nav-wrap::after {
      height: 0;
    }
  }
  /deep/ .el-tabs__header {
    margin: 0;
  }
}
.continer-bottom {
  width: 82%;
  margin: 0 auto;
  // margin-top: 92px;
}
.continer-btn {
  margin-top: 90px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  border: 1px solid #f1efef;
}
.continer-list {
  width: 631px;
  margin-top: 62px;
  position: absolute;
  left: 53%;
  transform: translateX(-50%);
  height: 200px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.continer-list > .buton {
  margin: 8px 2px;
}
.active-buton {
  background-color: #2d42af !important;
  color: azure !important;
}
.active-pid {
  background-color: #7b88c8 !important;
  color: azure !important;
}
el-button:hover {
  background-color: beige !important;
  border-color: #2d42af !important;
}
</style>
