<template>
  <div id="responsible">
    <div class="content">
      <div ref="leftTree" class="leftTree">
        <div class="item-tree">
          <el-tree ref="tree" :props="propss" :load="loadNode" lazy node-key="id" :default-expanded-keys="[grandParentId]" highlight-current :expand-on-click-node="false" @node-click="nodeClick">
            <div slot-scope="{ node, data }">
              <p :title="node.label" :class="data.system === 'isbo' ? 'isclick' : ''">
                {{ node.label }}
              </p>
            </div>
          </el-tree>
        </div>
      </div>
      <div class="listContent">
        <pandect :pandect-list="pandectList" />
      </div>
    </div>
  </div>
</template>
<script>
import pandect from './components/pandect.vue'
import {
  // queryRepositoryBoFolderTreeId,
  getRepositoryboFolder,
  getRepositoryboProcess
} from '@/bpa/api/jobsCenter/businessObject'
export default {
  components: {
    pandect
  },
  data() {
    return {
      pandectList: [],
      grandParentId: '',
      propss: {
        label: 'foldername',
        children: 'subNodes',
        isLeaf: function(data, node) {
          if (data.parent) {
            return false
          } else {
            return true
          }
        }
      }
    }
  },
  mounted() {
  },
  methods: {
    nodeClick(data) {
      this.modelid = data.id
      if (data.system === 'isbo') {
        this.getData()
      } else {
        this.pandectList = []
      }
    },
    getData() {
      if (this.modelid) {
        getRepositoryboProcess({
          attr: {
            boid: this.modelid
          },
          pageNum: 1,
          pageSize: 9999
        }).then(res => {
          if (!res) return false
          if (res) {
            this.pandectList = res.list
            this.pandectList.forEach(item => {
              this.$set(item, 'levelIW', this.$t('unfold'))
              this.$set(item, 'levelI', 3)
            })
          }
        })
      }
    },
    // 加载节点事件
    async loadNode(node, resolve) {
      // let rt
      // if (!node.data) {
      //   rt = await queryRepositoryBoFolderTreeId()
      // }
      const id = node.data ? node.data.id : '3'
      getRepositoryboFolder(id).then(res => {
        if (!res) return false
        if (res && res.length > 0) {
          if (id === '3') {
            this.grandParentId = res[0].id
            this.$nextTick(() => {
              this.$refs.tree.setCurrentKey(res[0].id)
              this.modelid = res[0].id
              this.getData()
            })
          }
          resolve(res)
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.listContent {
  flex: 1;
  overflow-y: auto;
}
.item-tree {
  width: 220px;
  margin-top: 20px;
  overflow: auto;
  height: calc(100vh - 208px) !important;
}
.content {
  width: 100%;
  display: flex;
  overflow: hidden;
}
.leftTree {
  width: 220px;
  overflow: hidden;
  padding-right: 10px;
  position: relative;
  margin-top: 12px;
}
.isclick {
  color: $active-color;
}
</style>
