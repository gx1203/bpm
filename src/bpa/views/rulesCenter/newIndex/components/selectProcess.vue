<template>
  <div class="w100">
    <!-- 选择组织的dialog -->
    <el-dialog :append-to-body="true" class="distribution" :visible.sync="isDialogsVisible" :title="selectProcess"
      :close-on-click-modal=false :close-on-press-escape=false>
      <el-row :gutter="20" class="margin-b10">
        <el-col :span="12" class="tree_wrap">
          <el-row>
            <bas-search
              :placeholder="pleaseEnterTheContent"
              v-model="keyWords"
              @fnSearch="filterTree"
            />
          </el-row>
        </el-col>
      </el-row>
      <el-scrollbar class="h300px">
        <el-tree class="filter-tree" :props="props" :load="loadNode" v-show="!controlTree" node-key="id" lazy
          :default-expanded-keys="[grandParentId]" :expand-on-click-node="false" show-checkbox :check-strictly="true"
          @check-change="handlerNodeChecked" ref="processTree"></el-tree>
        <el-tree class="filter-tree" ref="treeFilter" node-key="id" :props="searchProps" :data="treelist"
          v-show="controlTree" show-checkbox @check-change="handlerNodeChecked">
        </el-tree>
      </el-scrollbar>
<!--      <el-scrollbar class="h70px margin-t20">-->
<!--        <p class="showFiles processCommon">-->
<!--          <span class="margin-r5 margin-b5" v-for="item in checkData" :key="item.id"-->
<!--            :title="item.name">{{item.name.indexOf(item.code)==-1 ? (item.code + item.name) : item.name}}<i-->
<!--              class="el-icon-close cursor-pointer" @click="delCheckedData(item)"></i></span>-->
<!--        </p>-->
<!--      </el-scrollbar>-->
      <div style="margin-top: 10px;">
        <span v-for="item in checkData" :key="item.id" :title="item.name" class="listItem">
          {{item.name.indexOf(item.code)==-1 ? (item.code + item.name) : item.name}}<i
          class="el-icon-close cursor-pointer" @click="delCheckedData(item)"></i>
        </span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isDialogsVisible = false">{{$t("cancel")}}</el-button>
        <el-button type="primary" @click="confirmChoose">{{$t("confirm")}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getProcessIframeTree,
  searchProcessIframeTree1
} from '@/bpa/api/componentsApi'

export default {
  name: 'selectProcess',
  data () {
    let self = this
    return {
      isDialogsVisible: false,
      grandParentId: '',
      checkData: [],
      keyWords: '',
      props: {
        label: 'name',
        disabled (data, node) {
          return node.level === 1 || data.id === self.modelId || data.isVisible === '0';
        }
      },
      searchProps: {
        label: 'name',
        disabled (data, node) {
          return data.id === self.modelId || data.isVisible === '0';
        }
      },
      treelist: [],
      controlTree: false,
      selectProcess: this.$t("selectProcess"),
      pleaseEnterTheContent: this.$t("placeholderText.pleaseEnterTheContent"),
    }
  },
  computed: {
    host () {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
    }
  },
  mounted () {
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    modelId: {
      type: String,
      default: ''
    },
    processlists: {
      type: Array,
      default: () => []
    },
    // 控制单选还是多选
    selectType: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value (val) {
      if (val) {
        this.isDialogsVisible = val
        this.checkData = JSON.parse(JSON.stringify(this.processlists))
        this.$nextTick(() => {
          this.keyWords = ''
          this.filterTree()
          this.$refs.processTree.setCheckedNodes(this.checkData)
        })
      }
    },
    isDialogsVisible (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    filterTree () {
      if (!this.keyWords) {
        this.controlTree = false
        return false
      }
      searchProcessIframeTree1({
        name: this.keyWords,
        moduletype: 'rulemanagement',
        id: this.grandParentId
      }).then(res => {
        console.log(res)
        if (!res) return false
        this.controlTree = true
        res = res.map(item => {
          if (item.id === self.modelId) {
            item.disabled = true
          }
          return item
        })
        this.treelist = res
      })
    },
    loadNode (node, resolve) {
      let self = this
      let id = node.data ? node.data.id : '0'
      getProcessIframeTree(id).then(res => {
        if (!res) return false
        if (id === '0') {
          this.grandParentId = res[0].id
        }
        res = res.map(item => {
          if (item.id === self.modelId) {
            item.disabled = true
          }
          return item
        })
        console.log(res)
        resolve(res)
      })
    },
    handlerNodeChecked (item, isChecked) {
      if (isChecked) {
        let count = 0
        for (let i = 0; i < this.checkData.length; i++) {
          if (this.checkData[i].id === item.id) {
            count++
          }
        }
        if (!count) {
          this.checkData.push(item)
        }
      } else {
        for (let i = 0; i < this.checkData.length; i++) {
          if (this.checkData[i].id === item.id) {
            this.checkData.splice(i, 1)
            break
          }
        }
      }
    },
    delCheckedData (item) {
      for (let i = 0; i < this.checkData.length; i++) {
        if (this.checkData[i].id === item.id) {
          this.checkData.splice(i, 1)
          break
        }
      }
      this.$refs.processTree.setCheckedNodes(this.checkData)
    },
    confirmChoose () {
      if (this.selectType && this.checkData.length > 1) {
        this.$message({
          type: 'warning',
          message: this.$t("hintText.pleaseEnterTheContent")
        })
        return false
      }
      this.isDialogsVisible = false
      this.$emit('confirm', this.checkData)
    }
  }
}
</script>

<style lang="scss" scoped>
.listItem {
  background: #2d42af;
  color: #fff;
  padding: 10px;
  margin: 0 10px 10px 0;
  display: inline-block;
  text-align: center;
  i {
    cursor: pointer;
  }
}
/*附件部分*/
.showFiles {
  span {
    line-height: 18px;
    padding: 3px 20px 3px 8px;
    border: 1px solid #519eff;
    display: inline-block;
    vertical-align: top;
    max-width: 130px;
    border-radius: 3px;
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  &.commonpadding span {
    padding: 3px 8px;
  }
  i {
    position: absolute;
    right: 3px;
    top: 5px;
    color: $ico;
  }
  &.processCommon i {
    top: 6px;
  }
}
.ztree li span.button.chk.type1 {
  display: none !important;
}
.distribution {
  .h70px {
    height: 70px;
  }
  .h300px {
    height: 300px;
  }
}
/deep/ .el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>
