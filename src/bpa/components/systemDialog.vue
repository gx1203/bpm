<template>
  <div class="w100">
    <!-- 选择组织的dialog -->
    <el-dialog :append-to-body="true" class="distribution" :visible.sync="isDialogsVisible" title="选择制度" :close-on-click-modal = false :close-on-press-escape = false>
      <el-scrollbar class="h300px">
        <el-tree
        class="filter-tree"
        :props="props"
        :load="loadNode"
        node-key="id"
        lazy
        :default-expanded-keys="[grandParentId]"
        :expand-on-click-node="false"
        show-checkbox
        :check-strictly="true"
        @check-change="handlerNodeChecked"
        ref="processTree"
        ></el-tree>
      </el-scrollbar>
      <el-scrollbar class="h70px margin-t20">
        <p class="showFiles processCommon">
          <span class="margin-r5 margin-b5" v-for="item in checkData" :key="item.id" :title="item.name">{{item.name?item.name:item.foldername}}<i class="el-icon-close cursor-pointer" @click="delCheckedData(item)"></i></span>
        </p>
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

export default {
  name: 'selectProcess',
  data () {
    let self = this
    return {
      isDialogsVisible: false,
      grandParentId: '',
      checkData: [],
      props: {
        label: 'foldername',
        disabled (data, node) {
          if (node.level === 1 || node.level === 2 || data.id === self.modelId) {
            return true
          }
          return false
        }
      },
      onlyOneProcessCanBeSelected:this.$t("hintText.onlyOneProcessCanBeSelected")
    }
  },
  computed: {
    host () {
      return process.env.VUE_APP_HOST_URL + process.env.VUE_APP_BASE_URL
    }
  },
  mounted() {
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
        console.log(this.checkData,'this.checkData')
        this.$nextTick(() => {
          this.$refs.processTree.setCheckedNodes(this.checkData)
        })
      }
    },
    isDialogsVisible (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    loadNode(node, resolve) {
      let self = this
      let id = node.data ? node.data.id : '0'
      getRuleIframeTree(id).then(res => {
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
          message: this.onlyOneProcessCanBeSelected
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
/*附件部分*/
  .showFiles{
    span{
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
    &.commonpadding span{
      padding: 3px 8px;
    }
    i{
      position: absolute;
      right: 3px;
      top: 5px;
      color: $ico;
    }
    &.processCommon i{
      top: 6px;
    }
  }
.ztree li span.button.chk.type1{
  display:none!important;
}
.distribution{
  .h70px{
    height: 70px;
  }
  .h300px{
    height: 300px;
  }
}
/deep/ .el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>
