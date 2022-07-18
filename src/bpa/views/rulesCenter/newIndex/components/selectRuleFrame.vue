<template>
  <div class="w100">
    <el-dialog v-if="isDialogsVisible" :append-to-body="true" class="distribution" :visible.sync="isDialogsVisible" :title="$t('selectInstitutionalFramework')"
      :close-on-click-modal="false" :close-on-press-escape="false">
      <el-row class="margin-b10">
        <el-input
          v-model="filterText"
          clearable
          :placeholder="$t('placeholderText.enterTheRulesAndRegulations')"
          :title="$t('placeholderText.enterTheRulesAndRegulations')"
          class="search_component remove-margin-b"
          @keyup.13.native="abstractSearch"
        >
          <el-button slot="append" type="primary" @click="abstractSearch">{{
            $t('search')
          }}</el-button>
        </el-input>
      </el-row>
      <el-scrollbar class="h300px">
        <el-tree
          v-show="!isSearch"
          ref="tree"
          class="filter-tree elTree"
          :props="props"
          :load="loadNode"
          node-key="id"
          lazy
          :expand-on-click-node="false"
          :default-expanded-keys="expandedList"
          @node-click="handleNodeClick"
        >
          <div slot-scope="{ node, data }" class="custom-tree-node w100">
            <span>{{ node.label }}</span>
            <span style="float: left; margin-top: -1px;">
              <el-radio :disabled="data.id === '5'" v-model="radioNode" :label="data.id" @click="clickRadioNode($event)" @change="changeRadioNode(data)">{{''}}</el-radio>
            </span>
          </div>
        </el-tree>
        <el-tree
          v-show="isSearch"
          ref="filterTree"
          class="filter-tree elTree"
          :props="props"
          node-key="id"
          :data="treeData"
          lazy
          :expand-on-click-node="false"
          :default-expanded-keys="expandedList"
          @node-click="handleNodeClick"
        >
          <div slot-scope="{ node, data }" class="custom-tree-node">
            <span>{{ node.label }}</span>
            <span style="float: left; margin-top: -1px;">
              <el-radio :disabled="data.id === '5'" v-model="radioNode" :label="data.id" @click="clickRadioNode($event)" @change="changeRadioNode(data)">{{''}}</el-radio>
            </span>
          </div>
        </el-tree>
      </el-scrollbar>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isDialogsVisible = false">{{$t("cancel")}}</el-button>
        <el-button type="primary" @click="confirmChoose">{{$t("confirm")}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getRuleIframeTree
} from '@/bpa/api/rulesCenter/handbookFiles'
import { searchRulestree } from '@/bpa/api/processModelCenter/rulesAndRegulations/detail'

export default {
  name: 'selectRuleFrame',
  data () {
    return {
      isDialogsVisible: false,
      grandParentId: '',
      filterText: '',
      props: {
        label: function(data) {
          return data.foldername
        },
        isLeaf: function(data) {
          return data.parent !== true
        }
      },
      treeData: [],
      isSearch: false,
      expandedList: [],
      radioNode: '',
      ruleFrameItem: {}
    }
  },
  mounted () {
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    ruleFrameSelected: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    value (val) {
      if (val) {
        this.isDialogsVisible = val
        this.handleNodeClick(this.ruleFrameSelected)
      }
    },
    isDialogsVisible (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    clickRadioNode (event) {
      if (event) event.preventDefault()
    },
    changeRadioNode (data) {
      this.ruleFrameItem = data
    },
    handleNodeClick (data) {
      if (data.id === '5') {
        let ref = this.isSearch ? 'filterTree' : 'tree'
        this.$refs[ref].setCurrentKey(this.radioNode)
        return
      }
      this.radioNode = data.id
      this.ruleFrameItem = data
    },
    abstractSearch () {
      if (this.filterText) {
        this.isSearch = true
        searchRulestree({ foldername: this.filterText }).then(res => {
          this.treeData = res
        })
      } else {
        this.isSearch = false
      }
    },
    loadNode (node, resolve) {
      const id = node.data ? node.data.id : '0'
      getRuleIframeTree(id).then(res => {
        if (!res) return
        resolve(res)
        if (id === '0') {
          this.expandedList = [res[0].id]
        }
        this.$refs.tree.setCurrentKey(this.radioNode)
      })
    },
    confirmChoose () {
      console.log(this.ruleFrameItem)
      this.$emit('confirm', this.ruleFrameItem)
      this.isDialogsVisible = false
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
  /deep/ .el-input-group__append {
    background-color: #2d42af;
    border-color: #2d42af;
    color: #fff;
  }
  /deep/ .el-input__inner {
    border-color: #2d42af;
  }
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
