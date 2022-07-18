<template>
  <div id="businessRelation">
    <div ref="myPage" style="height:calc(100vh - 50px);">
      <RelationGraph ref="seeksRelationGraph" :options="graphOptions" :on-node-click="onNodeClick"  :on-node-expand="onNodeExpand" :on-node-collapse="onNodeCollapse">
        <div slot="node" slot-scope="{ node }" class="c-node-text">
          <el-popover :disabled="!node.data.listName" trigger="hover">
            <p>
              <span>
                <img src="@/assets/img/zeze.png" style="width: 14px; margin-right: 5px;" />
                {{ node.data.listName }}
              </span>
              <span v-if="node.data.nodeRespositoryViews && node.data.nodeRespositoryViews.length > 0">
                {{ node.data.listName ? '：' : '' }}
                <span v-for="(item, index) in node.data.nodeRespositoryViews" :key="index">
                  <span class="isclick">{{ item.nodeName }}</span>
                  {{ index !== node.data.nodeRespositoryViews.length - 1 ? '、' : '' }}
                </span>
              </span>
            </p>
            <div slot="reference" class="node-text">
              <span>
                <i v-if="node.data.type === 'tool'" class="el-icon-camera-solid rel-icon" />
                <i v-if="node.data.type === 'doc'" class="el-icon-s-cooperation" />
                {{ node.data.name }}
              </span>
              <span v-if="node.data.list && node.data.list.length > 0">
                {{ node.data.name ? '：' : '' }}
                <span v-for="(item, index) in node.data.list" :key="index">
                  <span class="isclick" @click="nodeClick(item, node.data)">{{ item.name }}</span>
                  {{ index !== node.data.list.length - 1 ? '、' : '' }}
                </span>
              </span>
            </div>
          </el-popover>
        </div>
      </RelationGraph>
    </div>
    <div v-if="isShowNodeTipsPanel" :style="{left: nodeMenuPanelPosition.x + 'px', top: nodeMenuPanelPosition.y + 'px' }" style="z-index: 999;padding:10px;background-color: #ffffff;border:#eeeeee solid 1px;box-shadow: 0px 0px 8px #cccccc;position: absolute;">
      <div style="line-height: 25px;padding-left: 10px;color: #888888;font-size: 12px;">节点名称：{{currentNode.text}}</div>
      <div class="c-node-menu-item">id:{{currentNode.text}}</div>
      <div class="c-node-menu-item">图标:{{currentNode.data.myicon}}</div>
    </div>
  </div>
</template>
<script>
import RelationGraph from 'relation-graph'
import {
  getDocBoRelation,
  getToolNodeRelation,
  getNodeRelation
} from '@/bpa/api/jobsCenter/businessObject'
export default {
  name: 'BusinessRelation',
  components: { RelationGraph },
  props: {
  },
  data() {
    return {
      isShowNodeTipsPanel: false,
      nodeMenuPanelPosition: { x: 0, y: 0 },
      currentNode: {},
      rootId: '',
      graphOptions: {
        // allowShowMiniToolBar: false,
        defaultJunctionPoint: 'border',
        // defaultJunctionPoint: 'ltrb',
        defaultNodeColor: '#ffffff',
        defaultLineColor: '#2d42af',
        defaultNodeShape: 1,
        defaultNodeFontColor: '#000000',
        defaultNodeBorderWidth: 2,
        defaultNodeBorderColor: '#2d42af',
        // defaultLineShape: 2,
        // defaultExpandHolderPosition: 'bottom',
        layouts: [
          {
            'label': '中心',
            // 'layoutName': 'tree',
            'layoutName': 'tree',
            'layoutClassName': 'seeks-layout-center',
            'from': 'left',
            'max_per_width': '300',
            'min_per_height': '40'
          }
        ]
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    showNodeTips(nodeObject, $event) {
      this.currentNode = nodeObject
      var _base_position = this.$refs.myPage.getBoundingClientRect()
      console.log('showNodeMenus:', $event, _base_position)
      this.isShowNodeTipsPanel = true
      this.nodeMenuPanelPosition.x = $event.clientX - _base_position.x + 10
      this.nodeMenuPanelPosition.y = $event.clientY - _base_position.y + 10
    },
    hideNodeTips(nodeObject, $event) {
      this.isShowNodeTipsPanel = false
    },
    getData() {
      getNodeRelation(this.$route.query.listid, this.$route.query.keyid).then(res => {
        if (!res) return false
        if (res) {
          const data = res
          const nodes = [
            {
              id: data.keyid,
              nodeShape: 0,
              data: {
                name: data.nodeName,
                id: data.keyid,
                listName: data.listName,
                listid: data.listid,
                nodeRespositoryViews: data.nodeRespositoryViews
              }
            }
          ]
          const links = []
          if (data.modelListToolsDtos && data.modelListToolsDtos.length > 0) {
            const list = data.modelListToolsDtos.map((item, index) => {
              return {
                name: item.toolname,
                id: item.id,
                type: 'tool'
              }
            })
            nodes.push({
              id: list[0].id,
              data: {
                name: '',
                id: list[0].id,
                list: list,
                type: 'tool'
              }
            })
            links.push(
              { from: data.keyid, to: list[0].id, color: '#2d42af' }
            )
          }
          data.repositoryDocDtos.forEach(item => {
            const list = item.bolist.map(val => {
              return {
                name: val.boname,
                id: val.id,
                type: 'bo'
              }
            })
            nodes.push({
              id: item.id,
              data: {
                name: item.docname,
                id: item.id,
                type: 'doc',
                list: list
              }
            })
            links.push(
              { from: data.keyid, to: item.id, color: '#2d42af' }
            )
          })
          var __graph_json_data = {
            rootId: '0',
            nodes: nodes,
            links: links
          }
          console.log(__graph_json_data)
          this.$refs.seeksRelationGraph.setJsonData(__graph_json_data, (seeksRGGraph) => {
          })
        }
      })
      // const data = {
      //   nodeName: '节点：技术部门审核',
      //   keyid: '11321',
      //   modelListToolsDtos: [
      //     {
      //       toolname: 'AutoCAD 5.0',
      //       toolid: '42412'
      //     },
      //     {
      //       toolname: 'Axure9',
      //       toolid: '4241232'
      //     }
      //   ],
      //   repositoryDocDtos: [
      //     {
      //       docname: '文档1',
      //       docid: '5234124',
      //       bolist: [
      //         {
      //           boname: '业务对象1',
      //           boid: '132341231'
      //         },
      //         {
      //           boname: '业务对象2',
      //           boid: '132341432131231'
      //         },
      //         {
      //           boname: '业务对象3',
      //           boid: '132421341231'
      //         }
      //       ]
      //     },
      //     {
      //       docname: '文档2',
      //       docid: '3241234432',
      //       bolist: [
      //         {
      //           boname: '业务对象1',
      //           boid: '132343241231'
      //         },
      //         {
      //           boname: '业务对象2',
      //           boid: '132341132432131231'
      //         },
      //         {
      //           boname: '业务对象3',
      //           boid: '13242142341231'
      //         }
      //       ]
      //     }
      //   ]
      // }
      // this.rootId = data.keyid
    },
    getDocBoRelation(child, nodeData) {
      getDocBoRelation(child.id, nodeData.id).then(res => {
        if (!res) return false
        if (res) {
          const data = res
          const nodes = []
          const links = []
          data.docDtoList.forEach(item => {
            const list = item.bolist.map(val => {
              return {
                name: val.boname,
                id: val.id,
                type: 'bo'
              }
            })
            nodes.push({
              id: item.id,
              data: {
                name: item.docname,
                id: item.id,
                type: 'doc',
                list: list
              }
            })
            links.push(
              { from: nodeData.id, to: item.id, text: child.name, color: '#2d42af' }
            )
          })
          this.$set(child, 'ishave', true)
          var __graph_json_data = {
            rootId: '0',
            nodes: nodes,
            links: links
          }
          if (nodes.length > 0) {
            this.$refs.seeksRelationGraph.appendJsonData(__graph_json_data, (seeksRGGraph) => {})
          }
          // this.$nextTick(() => {
          //   this.$refs.seeksRelationGraph.refresh()
          //   this.$forceUpdate()
          // })
        }
      })
    },
    getToolNodeRelation(child, nodeData) {
      getToolNodeRelation(child.id).then(res => {
        if (!res) return false
        if (res) {
          const data = res
          const nodes = []
          const links = []
          data.forEach(item => {
            nodes.push({
              id: item.keyid,
              nodeShape: 0,
              data: {
                name: item.nodeName,
                id: item.keyid,
                type: 'node',
                listName: item.listName,
                listid: item.listid,
                nodeRespositoryViews: item.nodeRespositoryViews
              }
            })
            links.push(
              { from: nodeData.id, to: item.keyid, color: '#2d42af' }
            )
          })
          this.$set(child, 'ishave', true)
          var __graph_json_data = {
            rootId: '0',
            nodes: nodes,
            links: links
          }
          if (nodes.length > 0) {
            this.$refs.seeksRelationGraph.appendJsonData(__graph_json_data, (seeksRGGraph) => {})
          }
          // this.$nextTick(() => {
          //   this.$refs.seeksRelationGraph.refresh()
          //   this.$forceUpdate()
          // })
        }
      })
    },
    showSeeksGraph(query) {
      var __graph_json_data = {
        rootId: '0',
        nodes: [
          // { id: 'a', nodeShape: 0, data: {
          //   name: '节点：技术部门审核'
          // }},
          // { id: 'b', data: {
          //   name: '战略规划流程：直属审批、技术部门审核、财务审核'
          // }},
          // { id: 'c', innerHTML: '<span class="isclick">业务对象1</span>', data: {
          //   name: '文档1',
          //   obj: ['业务对象1', '业务对象2', '业务对象3']
          // }},
          // { id: 'd', data: {
          //   name: '业务对象1-----1'
          // }},
          // { id: 'e', data: {
          //   name: '业务对象2-----2'
          // }},
          // { id: 'f', data: {
          //   name: '业务对象3-----3'
          // }}
        ],
        links: [
          // { from: 'a', to: 'b', color: '#2d42af' },
          // { from: 'a', to: 'c', color: '#2d42af' },
          // { from: 'c', to: 'd', text: '业务对象1', color: '#2d42af' },
          // { from: 'c', to: 'e', text: '业务对象2', color: '#2d42af' },
          // { from: 'c', to: 'f', text: '业务对象3', color: '#2d42af' }
        ]
      }
      // 以上数据中的node和link可以参考"Node节点"和"Link关系"中的参数进行配置
      this.$refs.seeksRelationGraph.setJsonData(__graph_json_data, (seeksRGGraph) => {
        // Called when the relation-graph is completed
      })
      this.getData()
    },
    onNodeClick(nodeObject, $event) {
      console.log('onNodeClick:', nodeObject)
    },
    onNodeCollapse(node, e) {
      this.$refs.seeksRelationGraph.refresh()
    },
    // 通过onNodeExpand事件监听节点的展开事件，在被展开的时候有选择的去从后台获取数据，如果已经从后台加载过数据，则让当前图谱根据当前的节点重新布局
    onNodeExpand(node, e) {
      console.log('onNodeExpand:', node)
      // 根据具体的业务需要决定是否需要从后台加载数据
      if (!node.data.isNeedLoadDataFromRemoteServer) {
        console.log('这个节点的子节点已经加载过了')
        this.$refs.seeksRelationGraph.refresh()
        return
      }
      //判断是否已经动态加载数据了
      if (node.data.childrenLoaded) {
        console.log('这个节点的子节点已经加载过了')
        this.$refs.seeksRelationGraph.refresh()
        return
      }
      this.g_loading = true
      node.data.childrenLoaded = true
      this.loadChildNodesFromRemoteServer(node, new_data => {
        this.g_loading = false
        this.$refs.seeksRelationGraph.appendJsonData(new_data, (seeksRGGraph) => {
          // 这些写上当图谱初始化完成后需要执行的代码
        })
      })
    },
    nodeClick(child, nodeData) {
      console.log(child, nodeData)
      if (!child.ishave) {
        if (child.type === 'bo') {
          this.getDocBoRelation(child, nodeData)
        } else if (child.type === 'tool') {
          this.getToolNodeRelation(child, nodeData)
        }
      }
      // this.getToolNodeRelation(child.id)
      // if ()
      // if (child.name === '业务对象1') {
      //   const data = {
      //     docDtoList: [
      //       {
      //         docname: '文档11',
      //         docid: '523412124',
      //         bolist: [
      //           {
      //             boname: '业务对象11',
      //             boid: '13234311231'
      //           },
      //           {
      //             boname: '业务对象12',
      //             boid: '13234121432131231'
      //           },
      //           {
      //             boname: '业务对象13',
      //             boid: '13242132341231'
      //           }
      //         ]
      //       },
      //       {
      //         docname: '文档22',
      //         docid: '324121234432',
      //         bolist: [
      //           {
      //             boname: '业务对象21',
      //             boid: '132321343241231'
      //           },
      //           {
      //             boname: '业务对象22',
      //             boid: '132343211132432131231'
      //           },
      //           {
      //             boname: '业务对象23',
      //             boid: '13243232142341231'
      //           }
      //         ]
      //       }
      //     ]
      //   }
      //   const nodes = []
      //   const links = []
      //   data.docDtoList.forEach(item => {
      //     const list = item.bolist.map(val => {
      //       return {
      //         name: val.boname,
      //         id: val.boid,
      //         type: 'bo'
      //       }
      //     })
      //     nodes.push({
      //       id: item.docid,
      //       data: {
      //         name: item.docname,
      //         id: item.docid,
      //         type: 'doc',
      //         list: list
      //       }
      //     })
      //     links.push(
      //       { from: nodeData.id, to: item.docid, color: '#2d42af' }
      //     )
      //   })
      //   var __graph_json_data = {
      //     rootId: '0',
      //     nodes: nodes,
      //     links: links
      //   }
      //   this.$refs.seeksRelationGraph.appendJsonData(__graph_json_data, (seeksRGGraph) => {})
      // }
    },
    onLineClick(lineObject, $event) {
      // console.log('onLineClick:', lineObject)
    }
  }
}
</script>

<style scoped lang="scss">
#businessRelation {
  /deep/ .rel-map {
    .c-collapsed, .c-expanded {
      background-color: #2d42af !important;
    }
    .c-node-text > span, .c-node-text > span > span, .node-text {
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .rel-icon {
      font-size: 18px;
      vertical-align: middle;
      margin-right: 8px;
    }
    .rel-diy-node {
      padding: 5px 15px;
    }
    .isclick {
      color: #2d42af;
      border-bottom: 1px solid #2d42af;
      cursor: pointer;
    }
  }
  /deep/ .c-mini-toolbar {
    .c-mb-button {
      &:last-child {
        display: none;
      }
    }
  }
  /deep/ .rel-node-checked, /deep/ .rel-node-selected, /deep/ .rel-node-hover, /deep/ .c-rg-line-checked {
    box-shadow: 0px 0px 10px #2d42af;
    animation: none;
    -moz-transform: none !important;
  }
}

</style>
