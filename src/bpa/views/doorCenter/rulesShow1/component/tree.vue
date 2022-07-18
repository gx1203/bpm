<template>
  <div :ref="treeRefName" :class="treeClassName" :style="scroll ? 'overflow: scroll' : ''">
    <div
      v-for="(item) in convertData"
      :key="item.id"
      :class="[isChild?'process-tree-childNodes-row':'process-tree-roots',
               isChild && item.isLong?'long-with-line':'']"
      :style="rootStyle">
<!--      :class="{'process-tree-node': item.childList && item.childList.length >= 1,'level2': item.folderlevel == '2' || item.folderlevel == '1', 'level3': item.folderlevel == '3', 'level4': item.folderlevel == '4', 'level5': item.folderlevel == '5', 'level6': item.folderlevel == '6'}"-->
      <span
        class="level2"
        :class="{'process-tree-node': item.childList && item.childList.length >= 1, 'level10': item.tagss}"
        @click="topage(item)">
        <img v-if="item.tagss" src="../../../../assets/img/liuchen.png" style="float:left;padding: 0px 6px 0px 10px;width:18px" alt="">
        <span :class="{'float-width': item.tagss, 'text-decoration': item.tags || item.tagss}" :title="item.area">
          {{ item.area }}
          <span v-if="item.showMap !== undefined && item.showMap" class="node" @click.stop="changeShow(item)">-</span>
          <span v-if="item.showMap !== undefined && !item.showMap" class="nodeadd" @click.stop="changeShow(item)">+</span>
        </span>
      </span>
      <div
        v-if="item.childList && item.childList !== null && (item.showMap === undefined ? true : item.showMap)"
        :class="[
          item.childList.length > 1 ? 'multiply-node':'',
          item.childList.length == 1 ? 'single-node':'',
        ]"
        class="process-tree-childNodes">
        <div>
          <div
            v-for="(child,index) in item.childList"
            :key="index"
            :class="[child.isLong?'long-with-line':'']"
            class="process-tree-childNodes-row">
            <div v-if="child.isLong" class="line"/>
<!--            :class="{'process-tree-node': child.childList && child.childList.length >= 1,'level2': child.folderlevel == '2', 'level3': child.folderlevel == '3', 'level4': child.folderlevel == '4', 'level5': child.folderlevel == '5', 'level6': child.folderlevel == '6'}"-->
            <span
              class="level2"
              :class="{'process-tree-node': child.childList && child.childList.length >= 1, 'level10': child.tagss}"
              @click="topage(child)">
              <img v-if="child.tagss" src="../../../../assets/img/liuchen.png" style="float:left;padding: 0px 6px 0px 10px;width:18px" alt="">
              <span :class="{'float-width': child.tagss, 'text-decoration': child.tags || child.tagss}" :title="child.area">
                {{ child.area }}
                <span v-if="child.showMap !== undefined && child.showMap" class="node" @click.stop="changeShow(child)">-</span>
                <span v-if="child.showMap !== undefined && !child.showMap" class="nodeadd" @click.stop="changeShow(child)">+</span>
              </span>
            </span>
            <div
              v-if="child.childList && child.childList!== null && (child.showMap === undefined ? true : child.showMap)"
              :class="[
                child.childList.length > 1 ? 'multiply-node':'',
                child.childList.length == 1 ? 'single-node':'',
              ]"
              class="process-tree-childNodes">
              <processTree
                :data="child.childList || []"
                :is-child="true"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getDetails
} from '@/bpa/api/rulesCenter/handbookFiles'
export default {
  name: 'ProcessTree',
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    isChild: {
      type: Boolean,
      default: false
    },
    scroll: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      convertData: this.convert(this.data),
      rootStyle: {}
    }
  },
  computed: {
    treeRefName() {
      return this.isChild ? 'childTree':'baseTree'
    },
    treeClassName() {
      return this.isChild ? '':'process-tree'
    }
  },
  watch: {
    data() {
      this.convertData = this.convert(this.data);
    }
  },
  methods: {
    // 展开收起事件
    changeShow(doc) {
      this.convertData.map((child, index) => {
        if (doc.id === child.id) {
          this.$set(this.convertData[index], 'showMap', !this.convertData[index].showMap) // 刷新数据
        } else {
          if (child.childList !== null && child.childList.length > 0) {
            child.childList.map((childs, indexs) => {
              if (doc.id === childs.id) {
                this.$set(this.convertData[index].childList[indexs], 'showMap', !this.convertData[index].childList[indexs].showMap) // 刷新数据
              }
            })
          }
        }
      })
    },
    initDomWidth() {
      let leafs = document.getElementsByClassName('leaf-node')
      leafs = Array.from(leafs)
      leafs = leafs.map(i => {
        const total = this.getOffset(i, 'offsetLeft')
        return total
      })
      this.rootStyle = { width: Math.max(...leafs) * 1.5 + 'px' }
    },
    topage(item) {
      console.log(item)
      if (item.tagss) {
        let urls = `#/processDetails/${item.listid}`
        window.open(urls, '_blank')
      } else if (item.linktype === 'doc') {
        let urls = `#/rulesDetail/${item.id}/-1`
        window.open(urls, '_blank')
      } else {
        let urls = '#/rulesCenter/ruleView'
        window.open(urls, '_blank')
      }

      // getDetails(item.id).then(res => {
      //   if (res.docId) {
      //     var urls = '#/rulesDetail/' + res.docId + '/' + res.revId
      //     window.open(urls, '_blank')
      //   }
      // })
    },
    getOffset(obj, offsetDir) {
      var realNum = obj[offsetDir]
      var positionParent = obj.offsetParent // 获取上一级定位元素对象
      while (positionParent != null) {
        realNum += positionParent[offsetDir]
        positionParent = positionParent.offsetParent
      }
      return realNum
    },
    convert(arr) {
      return arr.map((item) => {
        if (item.childList && item.childList.length > 0) {
          item.childList = this.convert(item.childList)
        }
        return item
      })
    },
    isLeaftNode(data) {
      return (data.childList && data.childList.length > 0) ? '' : 'leaf-node'
    }
}
}
</script>

<style scoped>
.process-tree{
    padding-top: 24px;
    /* overflow: scroll; */
    /* padding-bottom: 27px; */
    width: 100%;
    padding-right:0;
    font-size:0;
    line-height:0
}
.process-tree-roots{
    width: 240%;
    margin-bottom:20px;
}
.single-node::before{
    content:"";
    display:block;
    position: absolute;
    width:23px;
    height:2px;
    background:rgba(203,221,238,1);
    left:-23px;
    top:50%;
}
.multiply-node::before{
    content:"";
    display:block;
    position: absolute;
    width:2px;
    height:100%;
    background:rgba(203,221,238,1);
    left:-22px;
    top:0;
}

.process-tree-node{
    position: relative;
    padding: 12px 10px;
    border-radius: 2px;
    color: #fff;
    display: inline-block;
    cursor: pointer;
    min-width: 80px;
    text-align: center;
    font-size: 12px;
    line-height: 1.8em;
    vertical-align: middle;
    min-height: 20px;
    width: 210px;
}
.process-tree-node::after{
    content:'';
    display:block;
    width:37px;
    height:2px;
    background:rgba(203,221,238,1);
    position:absolute;
    left:100%;
    top:49%
}
.leaf-node::after{
    display:none
}

.process-tree-childNodes{
    position: relative;
    display: inline-block;
    vertical-align: middle;
    margin-left:59px;
    top: -.5px;
}
.process-tree-childNodes>div{
    display:flex;
    flex-direction: column;
    justify-content:space-between;
}

.multiply-node .process-tree-childNodes-row::before{
    content:"";
    display:block;
    position: absolute;
    width:20px;
    height:2px;
    background:rgba(203,221,238,1);
    left:-20px;
    top:50%;
}
.multiply-node .process-tree-childNodes-row:first-child::after,
.multiply-node .process-tree-childNodes-row:last-child::after{
    content:'';
    position:absolute;
    display:block;
    width:4px;
    height:50%;
    background:#fff;
    left:-23px;
}
.multiply-node .long-with-line:first-child::after,
.multiply-node .long-with-line:last-child::after{
    left:-166px
}
.multiply-node .process-tree-childNodes-row:first-child::after{
    top:0px
}
.multiply-node .process-tree-childNodes-row:last-child::after{
    bottom:-4px;
}

.process-tree-childNodes-row{
    position: relative;
    margin-bottom:10px
}
.process-tree-childNodes-row:last-child{
    margin-bottom:0
}

.long-with-line{
    margin-left:142px;
}
.line{
    position: absolute;
    width:142px;
    height:2px;
    background-color:rgba(203,221,238,1);
    top:50%;
    left:-161px
}
.level2 {
    background-color:  #2d42af;
    cursor: pointer;
    position: relative;
    padding: 12px 10px;
    border-radius: 2px;
    color: #fff;
    display: inline-block;
    cursor: pointer;
    min-width: 80px;
    text-align: left;
    font-size: 12px;
    line-height: 1.8em;
    vertical-align: middle;
    min-height: 20px;
    width: 210px;
}
.level3{
    background-color:  #2d42af;
    cursor: pointer;
    position: relative;
    padding: 12px 10px;
    border-radius: 2px;
    color: #fff;
    display: inline-block;
    cursor: pointer;
    min-width: 80px;
    text-align: left;
    font-size: 12px;
    line-height: 1.8em;
    vertical-align: middle;
    min-height: 20px;
    width: 210px;
}
.level4{
    background-color: #5264bf;
    cursor: pointer;
    position: relative;
    padding: 12px 10px;
    border-radius: 2px;
    color: #fff;
    display: inline-block;
    cursor: pointer;
    min-width: 80px;
    text-align: left;
    font-size: 12px;
    line-height: 1.8em;
    vertical-align: middle;
    min-height: 20px;
    width: 210px;
}
.level5{
    background-color: #7084cc;
    cursor: pointer;
    position: relative;
    padding: 12px 10px;
    border-radius: 2px;
    color: #fff;
    display: inline-block;
    cursor: pointer;
    min-width: 80px;
    text-align: left;
    font-size: 12px;
    line-height: 1.8em;
    vertical-align: middle;
    min-height: 20px;
    width: 210px;
}
.level6{
    background-color: #9aaad9;
    cursor: pointer;
    position: relative;
    padding: 12px 10px;
    border-radius: 2px;
    color: #fff;
    display: inline-block;
    cursor: pointer;
    min-width: 80px;
    text-align: left;
    font-size: 12px;
    line-height: 1.8em;
    vertical-align: middle;
    min-height: 20px;
    width: 210px;
}
.level10{
    background-color: #597ef7;
    cursor: pointer;
    position: relative;
    padding: 12px 10px;
    border-radius: 2px;
    color: #fff;
    display: inline-block;
    cursor: pointer;
    min-width: 80px;
    text-align: left;
    font-size: 12px;
    line-height: 1.8em;
    vertical-align: middle;
    min-height: 20px;
    width: 210px;
}
.float-width{
    float:left;
    width: 172px;
}
.text-decoration{
    /* text-decoration:underline;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis; */
}
.node {
  text-align: center;
  background: #fff;
  border-radius: 50%;
  border: 1.5px solid #2d42af;
  color: #2d42af;
  cursor: pointer;
  width: 16px;
  height: 16px;
  line-height: 14px;
  margin-right: 10px;
  position: absolute;
  right: -38px;
  top: 34%;
  z-index: 999;
  font-size: 18px;
}
.nodeadd {
  text-align: center;
  background: #fff;
  border-radius: 50%;
  border: 1.5px solid #2d42af;
  color: #2d42af;
  cursor: pointer;
  width: 16px;
  height: 16px;
  line-height: 16.5px;
  margin-right: 10px;
  position: absolute;
  right: -38px;
  top: 34%;
  z-index: 999;
  font-size: 18px;
}
</style>
