<template>
  <div class="w100" id="edgeToedge" @click="rightContextMenu = false">
    <el-row :gutter="10">
      <el-col :span="3" class="remove-margin-l">
        <ul class="firstChain">
          <li
            :class="{'active': item.checked}"
            v-for="item in chainValue"
            :key="item.id"
            @click="chooseChain(item)"
          >
          <p class="label" :title="item.name">{{item.name}}</p>
          <!-- <p class="float-r tools">
            <i class="el-icon-edit" @click.stop="editChain('modify', item)"></i>
            <i class="el-icon-delete" @click.stop="editChain('delete', item)"></i>
          </p> -->
          </li>
        </ul>
        <!-- <p class="text-center margin-t15">
          <el-button @click="newChain">新建价值链</el-button>
        </p> -->
      </el-col>
      <el-col :span="21" class="remove-margin-r">
        <iframe ref="iFrameChain" class="w100 iFrameChain" :src="chainHref" frameborder="0"></iframe>
      </el-col>
    </el-row>

    <!-- 添加价值链 -->
    <!-- <el-dialog
      title="价值链"
      :visible.sync="dialogVisible"
      width="40%">
      <el-form label-width="120px" ref="chainlist" :rules="rules" :model="chainlist">
        <el-form-item label="价值链名称" prop="name">
          <el-input clearable v-model="chainlist.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{$t("cancel")}}</el-button>
        <el-button type="primary" @click="confirmChain()">{{$t("confirm")}}</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
import {
  getChainlist,
  newChain,
  deleteChain,
  publishProcess
} from '@/bpa/api/valueCenter/folders'

import { getProcessTreeofprincipal } from '@/bpa/api/componentsApi'

import { createId, userId } from '@/bpa/utils/common'

export default {
  data () {
    return {
      dialogVisible: false,
      chainValue: [],
      chainlist: {
        id: ''
      },
      rules: {
        name: [{required: true, message: ' ', trigger: 'blur'}]
      },
      chainHref: ''
    }
  },
  created () {
    let self = this
    window.onFullScreen = () => {
      if (self.$refs.iFrameChain.getAttribute('class').indexOf('fullEditor') > -1) {
        self.$refs.iFrameChain.classList.remove('fullEditor')
      } else {
        self.$refs.iFrameChain.classList.add('fullEditor')
      }
    }
    // 发布
    window.openBpmUrl = (state, listid, bpmid, type) => {
      publishProcess(listid).then(res => {
        if (!res) return false
        this.$message({
          type: 'success',
          message: '发布成功!'
        })
      })
    }
    window.todesign = (item) => {
      if (!item.processGroup.length) {
        self.$message({
          type: 'warning',
          message: '请引用流程在进行此操作!'
        })
        return false
      }
      getProcessTreeofprincipal(item.processGroup[0].id).then(res => {
        self.toDesign(res.code)
      })
    }
  },
  mounted() {
    this.getChainlist()
  },
  methods: {
    getChainlist () {
      getChainlist({release: 'Y'}).then(res => {
        console.log(res)
        if (!res) return false
        this.chainValue = res.map((item, index) => {
          item.checked = false
          return item
        })
        if (this.chainValue.length > 0) {
          this.chainValue[0].checked = true
          this.chainHref = `./leftMenu/endToEnd2/BaseNewPage.html?id=${this.chainValue[0].id}&listid=${this.chainValue[0].id}&treeId=${this.chainValue[0].id}&processName=${this.chainValue[0].name}&username=${userId}&processNum=''&state=&isRead=no`
        }
      })
    },
    chooseChain (obj) {
      let arr = this.chainValue.map(item => {
        item.checked = false
        if (item.id === obj.id) {
          item.checked = true
          this.chainHref = `./leftMenu/endToEnd2/BaseNewPage.html?id=${item.id}&listid=${item.id}&treeId=${item.id}&processName=${item.name}&username=${userId}&processNum=''&state=&isRead=no`
        }
        return item
      })
      this.$set(this, 'chainValue', arr)
    },
    // newChain () {
    //   this.chainlist = {}
    //   this.dialogVisible = true
    // },
    // confirmChain () {
    //   this.$refs.chainlist.validate((valid) => {
    //     if (valid) {
    //       this.dialogVisible = false
    //       newChain({
    //         id: this.chainlist.id,
    //         name: this.chainlist.name
    //       }).then(res => {
    //         console.log(res)
    //         if (!res) return false
    //         this.$message({
    //           type: 'success',
    //           message: !!this.chainlist.id ? '修改成功!' : '添加成功!'
    //         })
    //         this.getChainlist()
    //       })
    //     } else {
    //       this.$message({
    //         type: 'warning',
    //         message: this.$t('hintText.theRequiredFieldsMustNotBeEmpty')
    //       })
    //     }
    //   })
    // },
    // editChain (type, item) {
    //   switch (true) {
    //     case type === 'modify':
    //       console.log(item)
    //       this.dialogVisible = true
    //       this.$set(this.chainlist, 'name', item.name)
    //       this.$set(this.chainlist, 'id', item.id)
    //       console.log(this.chainlist)
    //       break
    //     case type === 'delete':
    //       this.$confirm('删除该一级价值链, 他下面的所有的内容会删除, 确认删除吗?', this.$t('hintText.hint'), {
    //         confirmButtonText: this.$t('confirm'),
    //         cancelButtonText: this.$t('cancel'),
    //         type: 'warning'
    //       }).then(() => {
    //         deleteChain(item.id).then(res => {
    //           if (!res) return false
    //           this.$message({
    //             type: 'success',
    //             message: this.$t('hintText.successfullyDelete')
    //           })
    //           this.getChainlist()
    //         }).catch(err => {})
    //       })
    //       break
    //   }
    // },
    // 跳转流程设计器
    toDesign (item) {
      let code = item.split('.').map((val, index) => {
        if (index === item.split('.').length - 1) {
          return val.substring(0, 1)
        }
        return val
      }).join('.')
      this.$router.push({
        path: '/processDesignCenter',
        query: {
          code: code
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#edgeToedge{
  .firstChain{
    min-height: 30px;
    li {
      line-height: 30px;
      padding: 0 8px;
      font-size: 14px;
      cursor: pointer;
      position: relative;
      .label{
        padding-right: 40px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .tools{
        color: #555555;
        display: none;
        position: absolute;
        top: 0;
        right: 10px;
        .el-icon-edit:hover{
          color: #427efc;
          font-weight: bold;
        }
        .el-icon-delete:hover{
          color: #fb1c1c;
          font-weight: bold;
        }
      }
    }
    li:hover {
      .label {
        color: #409eff;
      }
      .tools {
        display: block;
      }
    }
    li.active {
      color: #409eff;
    }
  }
  .iFrameChain{
    height: calc(100vh - 160px);
  }
  /*流程设计器全屏*/
  .fullEditor{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 99999;
  }
}

</style>
