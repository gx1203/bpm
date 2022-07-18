<template>
  <div style="margin:0 auto;width:100%">
    <div class="continer-top">
      <!-- <div class="btn-fullscreen" @click="handleFullScreen">
        <el-tooltip :content="fullscreen ? `取消全屏`:`全屏`" effect="dark" placement="bottom">
          <i class="el-icon-rank"/>
        </el-tooltip>
      </div> -->
      <el-button :class="{'active-buton': activeId == chooseId}" round @click="getFolderListById(chooseId)">总览</el-button>
      <el-button v-for="(item, index) in postList" :key="item.id" :class="{'active-buton': activeId == item.id}" round @click="getFolderListById(item.id)">{{ item.foldername }}</el-button>
      <el-popover
        placement="bottom-start"
        width="620"
        trigger="hover">
        <div>
          <el-button
            v-for="item in postLists"
            :key="item.id"
            :class="{'active-buton': activeId == item.id}"
            round
            class="buton"
            style="margin-bottom:12px"
            @click="getFolderListById(item.id)"
          >{{ item.foldername }}</el-button>
        </div>
        <el-button slot="reference" style="border-radius: 20px;">···</el-button>
      </el-popover>
    </div>
    <HR align="center" width="82%" class="continer-btn" />
    <div class="continer-bottom">
      <tree :tree-data="treeData"/>
    </div>
  </div>
</template>
<script>
import tree from './component'
import { queryRegulationFolderTreeId } from '@/bpa/api/doorCenter'
import { getSystemFolderCopy, getFolderListById } from '@/bpa/api/rulesCenter/handbookFiles'
export default {
  components: {
    tree
  },
  data() {
    return {
      treeData: [],
      fullscreen: false,
      activeId: '',
      postList: [], // 少量按钮
      postLists: [],
      chooseId: '5'
    }
  },
  props:['attrid'],
  computed: {
  },
  created() {},
  mounted() {
    this.queryRegulationFolderTreeId()
  },
  methods: {
    queryRegulationFolderTreeId() {
      queryRegulationFolderTreeId().then((res) => {
        if (!res) return false
        console.log(res)
        this.chooseId = res
        if (this.chooseId) {
          this.getFolder()
        }
      })
    },
    // 初始化数据
    getFolder() {
      // 获取顶部按钮数据
      getSystemFolderCopy(this.chooseId).then(res => {
        this.postLists = res
        if (this.$route.query.attrid !== undefined) {
          this.activeId = this.$route.query.attrid
        } else if (this.attrid !== undefined) {
          this.activeId = this.attrid
        } else {
          this.activeId = this.chooseId
        }
        this.getFolderListById(this.activeId)
      })
    },
    handleFullScreen() {
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
    getFolderListById(id) {
      this.activeId = id
      // 处理头部逻辑
      this.postList = []
      console.log(id, '11111')
      if (this.postLists.length > 4) {
        this.postLists.map((item, index) => {
          if (item.id == id) {
            if (index > 4 && index < this.postLists.length - 2) {
              this.postList.push(
                this.postLists[index - 2], this.postLists[index - 1], this.postLists[index], this.postLists[index + 1], this.postLists[index + 2]
              )
            } else if (index > 4 && index >= this.postLists.length - 3) {
              var num = this.postLists.length - 1
              this.postList.push(
                this.postLists[num - 4], this.postLists[num - 3], this.postLists[num - 2], this.postLists[num - 1], this.postLists[num]
              )
            } else {
              this.postList.push(
                this.postLists[0], this.postLists[1], this.postLists[2], this.postLists[3], this.postLists[4]
              )
            }
          }
        })
        if (id === this.chooseId) {
          this.postList.push(
            this.postLists[0], this.postLists[1], this.postLists[2], this.postLists[3], this.postLists[4]
          )
        }
      } else {
        this.postList = this.postLists
      }
      getFolderListById(id).then(res => {
        console.log(res, '1111111')
        this.treeData = []
        this.treeData = res.map(item => {
          item.linktype = 'child'
          item.parents = [item.id]
          item.show = 1
          item.area = item.foldername
          if (item.childList && item.childList.length > 0) {
            item.childList.map(items => {
              items.linktype = 'child'
              items.parents = [item.id, items.id]
              items.show = 1
              items.area = items.foldername
              if (items.childList && items.childList.length > 0) {
                items.childList.map(itemss => {
                  itemss.linktype = 'child'
                  itemss.parents = [item.id, items.id, itemss.id]
                  itemss.show = 1
                  itemss.area = itemss.foldername
                  if (itemss.childList && itemss.childList.length > 0) {
                    itemss.childList.map(itemsss => {
                      itemsss.linktype = 'child'
                      itemsss.parents = [item.id, items.id, itemss.id, itemsss.id]
                      itemsss.show = 1
                      itemsss.area = itemsss.foldername
                      if (itemsss.childList && itemsss.childList.length > 0) {
                        itemsss.childList.map(itemssss => {
                          itemssss.linktype = 'child'
                          itemssss.show = 1
                          itemssss.parents = [item.id, items.id, itemss.id, itemsss.id, itemssss.id]
                          itemssss.area = itemssss.foldername
                          return itemssss
                        })
                      }
                      return itemsss
                    })
                  }
                  if (itemss.docList && itemss.docList.length > 0) {
                    itemss.docList.map(doc => {
                      doc.linktype = 'doc'
                      doc.area = doc.title
                      doc.show = 1
                      doc.folderlevel = 5
                      // 处理制度下面的流程
                      doc.childList = doc.modelDmReleDtos.map(child => {
                        child.show = 1
                        child.area = child.modelname
                        child.childList = []
                        child.id = child.listid
                        child.tagss = true
                        child.folderlevel = 6
                        return child
                      })
                      // 判断流程数量
                      if (doc.childList && doc.childList.length > 0) {
                        doc.showMap = true
                      }
                      doc.tags = true
                      return doc
                    })
                  }
                  let childList3 = itemss.childList || []
                  let docList3 = itemss.docList || []
                  itemss.childList = [
                    ...childList3,
                    ...docList3
                  ]
                  return itemss
                })
              }
              if (items.docList && items.docList.length > 0) {
                items.docList.map(doc => {
                  doc.linktype = 'doc'
                  doc.area = doc.title
                  doc.show = 1
                  doc.folderlevel = 5
                  // 处理制度下面的流程
                  doc.childList = doc.modelDmReleDtos.map(child => {
                    child.show = 1
                    child.area = child.modelname
                    child.childList = []
                    child.id = child.listid
                    child.tagss = true
                    child.folderlevel = 6
                    return child
                  })
                  // 判断流程数量
                  if (doc.childList && doc.childList.length > 0) {
                    doc.showMap = true
                  }
                  doc.tags = true
                  return doc
                })
              }
              let childList2 = items.childList || []
              let docList2 = items.docList || []
              items.childList = [
                ...childList2,
                ...docList2
              ]
              return items
            })
          }
          if (item.docList && item.docList.length > 0) {
            item.docList.map(doc => {
              doc.linktype = 'doc'
              doc.area = doc.title
              doc.show = 1
              doc.folderlevel = 5
              // 处理制度下面的流程
              doc.childList = doc.modelDmReleDtos.map(child => {
                child.show = 1
                child.area = child.modelname
                child.childList = []
                child.id = child.listid
                child.tagss = true
                child.folderlevel = 6
                return child
              })
              // 判断流程数量
              if (doc.childList && doc.childList.length > 0) {
                doc.showMap = true
              }
              doc.tags = true
              return doc
            })
          }
          let childList1 = item.childList || []
          let docList1 = item.docList || []
          item.childList = [
            ...childList1,
            ...docList1
          ]
          return item
        })
        if (this.treeData.length > 0) {
          this.$set(this.treeData[0], 'changeTime', Date.parse(new Date())) // 刷新数据
          console.log(this.treeData, '1111')
        }
      })
    }
  }
};
</script>

<style scoped>
.continer-top {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 1000px;
  height: 50px;
  text-align: center;
  line-height: 69px;
}
.continer-bottom{
  width: 82%;
  margin: 0 auto;
  margin-top: 92px;
}
.continer-btn {
  margin-top: 80px;
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
el-button:hover {
  background-color: beige !important;
  border-color: #2d42af !important;
}
</style>
