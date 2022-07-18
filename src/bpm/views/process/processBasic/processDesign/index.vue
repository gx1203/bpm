<template>
  <el-card shadow="never" class="process-design" :class="isfullScreen?'fullScreen':''">
    <el-card shadow="always" class="process-course">
      <div class="processVersion" v-if="active > 0">
       <span> {{ $t('currentProcessVersion') }}：</span>
        <el-dropdown class="international" @command="handleSetVersion">
          <span class="el-dropdown-link">
            {{ showVersion }}
            <i class="el-icon-arrow-down" />
          </span>
          <el-dropdown-menu class="dropdownMenu" slot="dropdown">
            <el-dropdown-item v-for="item in versionList" :key="item.id" :disabled="version === item.version"
              :command="item" style="font-size:12px">{{item.version}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <el-row>
        <el-steps :active="active" align-center process-status="finish" finish-status="success">
          <el-step :title="$t('selectProcess')" @click.native="handle(active,0)" />
          <el-step :title="$t('formTheConfiguration')" @click.native="handle(active,1)" />
          <el-step :title="$t('businessRule')" @click.native="handle(active,2)" />
          <el-step :title="$t('launchPermissions')" @click.native="handle(active,3)" />
        </el-steps>
      </el-row>
      <el-tooltip class="process-fullScreen">
        <span v-if="!isfullScreen" slot="content">CTRL+F11</span>
        <span v-else slot="content">ESC</span>
        <i
          class="iconfont icon-quanping font28"
          :class="isfullScreen?'icon-guanbiquanping':'icon-quanping'"
          @click="fullScreen"
        />
      </el-tooltip>
    </el-card>
    <el-card shadow="always" class="margin-t10">
      <process-classification v-show="active === 0" @next="nextStep" />
      <config-form v-if="active === 1 && reloadProcess" />
      <confin-business-rule v-if="active === 2 && reloadProcess" type="edit" :processData="processData" />
       <my-table v-if="active === 3 && reloadProcess" :tree-data="processData" />
    </el-card>
  </el-card>
</template>
<script>
import processClassification from './processClassification'
import confinBusinessRule from '@/bpm/views/confinBusinessRule'
import {
  getProcessQuickQuery
} from "@/bpm/api/process/processModeling/process_manage";
import myTable from '../../administrativeTool/processJobsPermissions/table'

import configForm from './configForm'
import { createNamespacedHelpers } from 'vuex'
const { mapMutations, mapGetters } = createNamespacedHelpers('processDesign')
export default {
  name: 'ProcessDesign',
  components: {
    processClassification,
    confinBusinessRule,
    myTable,
    configForm
  },
  computed: {
    ...mapGetters(['active', 'processData', 'isCount'])
  },
  data() {
    return {
      version: '',
      showVersion: '',
      versionList: [],
      isfullScreen: false,
      reloadProcess: false
    }
  },
  mounted() {
    this.setIsCount(0)
    this.setActive(0)
    this.setProcessData({})
    if (this.processData.processname) {
      this.getVeriosn()
    }
    if (this.processData.showVersion) {
      this.showVersion = this.processData.showVersion
    }
    if (this.processData.version || this.processData.version === '') {
      this.version = this.processData.version
    }
    // 监听键盘按键事件
    const self = this
    this.$nextTick(function() {
      document.addEventListener('keyup', function(e) {
        if (e.keyCode == 27 && self.isfullScreen) {
          self.isfullScreen = false
          return
        }
        if (e.ctrlKey && e.keyCode == 122) {
          self.isfullScreen = true
          return false
        }
      })
    })
  },
  methods: {
    ...mapMutations(['setActive', 'setIsCount', 'setProcessData']),
    handleSetVersion(val) {
      console.log('handleSetVersion')
      this.showVersion = val.version
      this.version = val.isnewest === "Y" ? "" : val.version
      this.setProcessData({
        ...this.processData,
        version: this.version,
        showVersion: this.showVersion,
        bpaVersion: val.bpaVersion
      })
      this.reloadProcess = false
      this.$nextTick(() => {
        this.reloadProcess = true
      })
    },
    getVeriosn() {
      this.loading = true;
      getProcessQuickQuery({
        filters: [
          {
            key: "processname",
            opt: "EQ",
            type: "S",
            value: this.processData.processname
          },
          {
            key: "history",
            opt: "EQ",
            type: "S",
            value: "Y"
          }
        ],
        pageNum: 1,
        pageSize: 100000
      })
        .then(rt => {
          if (rt.data.list.length > 0) {
            this.versionList = rt.data.list || [];
            if (!this.version) {
              this.reloadProcess = true
              let versionObj = this.versionList.find(
                val => val.isnewest === "Y"
              );
              this.version = ""
              this.showVersion = versionObj.version
              this.setProcessData({
                ...this.processData,
                version: this.version,
                showVersion: this.showVersion,
                bpaVersion: versionObj.bpaVersion
              })
            }

          }
        })
        .catch(() => {
        });
    },
    nextStep() {
      this.version = ""
      this.showVersion = ""
      this.getVeriosn()
    },
    fullScreen() {
      this.isfullScreen = !this.isfullScreen
    },
    handle(active, index) {
      if (index !== 0 && !this.processData.id) {
        this.$message.error(this.$t('hintText.pleaseSelectProcess'))
        return
      }
      if (active === 1 && this.isCount > 0) {
        this.$confirm(this.isCount === 100000 ? this.$t('hintText.pleaseSaveTheImportedDataFirst') : this.$t('hintText.formContentChangedAreYouSureSwitch'), this.$t('hintText.hint'), {
          type: 'warning'
        }).then(() => {
          this.setIsCount(0)
          this.setActive(index)
        })
      } else {
        this.setActive(index)
      }
      if (index === 1) {
        this.setIsCount(0)
      }
    }
  }
}
</script>
<style lang="scss">
.process-design {
  .el-step__title.is-success {
    color: $bc4;
  }
  .is-success .el-step__icon.is-text {
    background: $bc4;
  }
  .el-step.is-center .el-step__line {
    left: 60%;
    right: -40%;
    border-radius: 50px;
  }
  .el-step.is-horizontal .el-step__line {
    height: 5px;
    top: 17px;
  }
  .is-success .el-step__line .el-step__line-inner {
    background-color: $bc4 !important;
    width: 100%;
    border-radius: 50%;
    height: 5px;
  }
  .padd0 {
    .el-card__body{
      padding: 0;
    }
  }
  .el-step__icon {
    width: 36px;
    height: 36px;
    font-size: 26px;
  }
  .el-step__title.is-finish {
    font-weight: bold;
  }
  .el-step__head.is-success {
    color: white;
    border-color: white;
  }
  .el-step.is-horizontal {
    cursor: pointer;
  }
}
</style>
<style lang="scss" scoped>
.dropdownMenu {
  min-width: 60px;
}
.processVersion {
  > span {
    color: $bc4;
  }
  .international {
    cursor: pointer;
  }
}
.fullScreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #fff;
  z-index: 3000;
  &.el-select-dropdown{
    z-index: 3000
  }
  .fullScreen_layout {
    margin: 20px 10px;
  }
}
.process-design {
  ::v-deep > .el-card__body {
    padding: 10px 30px 10px 10px;
  }
  overflow: auto;
  .process-course {
    position: relative;
    .process-fullScreen {
      position: absolute;
      right: 20px;
      top: 20px;
      cursor: pointer;
      z-index: 1000;
    }
  }

}
</style>
