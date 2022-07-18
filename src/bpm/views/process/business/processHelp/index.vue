<template>
  <el-card shadow="never">
    <div class="item-left">
      <!-- <treeProcessFlow ref="tree" type="2" @confirm="handleNodeClick" /> -->
      <BasProcessTree showView="2" type="3" @confirm="handleNodeClick" />
    </div>
    <div v-if="isShowTable" v-loading="load" class="item-right">
      <el-form ref="form" :model="content" label-width="150px">
        <div ref="card1" class="card1" :class="[basic?'h-auto':'']">
          <div class="header">
            <span class="title">{{ $t('basicConfiguration') }}</span>
            <div class="space" />
            <el-button type="text" @click="isShow('card1','basic')">
              {{ basic ? $t('putAway') : $t('unfold') }}
            </el-button>
          </div>
          <div class="card-info">
            <el-row>
              <el-col :span="8" :offset="2">
                <el-form-item :label="$t('modifier') + '：'">
                  <el-input v-model="content.updateby" clearable :title="content.updateby" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8" :offset="2">
                <el-form-item :label="$t('changeTheTime') + '：'">
                  <el-date-picker v-model="content.updateon" type="datetime" :title="content.updateon|formatDateTimess"
                    disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8" :offset="2">
                <el-form-item :label="$t('nodeClassification') + '：'">
                  <el-select v-model="content.processnodecategory" clearable
                    :placeholder="$t('placeholderText.pleaseSelect')" class="w100">
                    <el-option v-for="item in processnodecategoryList" :key="item.value" :label="item.label"
                      :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8" :offset="2">
                <el-form-item :label="$t('standardTimeHours') + '：'">
                  <el-input v-model="content.approvaltime" clearable type="number" min="0"
                    onkeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" />
                </el-form-item>
              </el-col>
              <el-col :span="20" :offset="2">
                <el-form-item :label="$t('help') + '：'">
                  <el-input v-model="content.helpcontent" clearable autocomplete="off" :autosize="{ minRows: 4}"
                    show-word-limit type="textarea" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <div class="text-r">
                <el-button type="primary" @click="saveForm('ruleForm')">
                  {{ $t('submit') }}
                </el-button>
              </div>
            </el-row>
          </div>
        </div>
      </el-form>
    </div>
  </el-card>
</template>

<script>
import Vue from 'vue'
import BasProcessTree from 'bas-component'
Vue.use(BasProcessTree)
import {
  getProcessNodeData,
  updateProcessNode
} from '@/bpm/api/process/processModeling/classificationModel'
import treeProcessFlow from '@/bpm/components/treeProcessFlow'
export default {
  components: {
    treeProcessFlow
  },
  data () {
    return {
      isShowTable: false,
      basic: true,
      load: false,
      content: {},
      load: false,
      processnodecategoryList: [
        {
          value: '审批类',
          label: this.$t('approval2')
        },
        {
          value: '处理类',
          label: this.$t('processingClass')
        }
      ],
      treeData: {}
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.basuser.user
    },
    key () {
      return this.$route.fullPath
    }
  },
  methods: {
    saveForm (formName) {
      if (this.content.approvaltim && this.content.approvaltime.lenhtg > 10) {
        this.$message.error(this.$t('hintText.fieldIsTooLong'))
        return
      }

      this.load = true
      updateProcessNode(this.content)
        .then(rt => {
          this.load = false
          if (rt.status === '200') {
            this.getData()
            this.$message.success(this.$t('hintText.submittedSuccessfully'))
          }
        })
        .catch(er => {
          this.load = false
        })
    },
    isShow (c, el) {
      this[el] = !this[el]
      this.slideToggle(c, this[el])
    },
    slideToggle (c, show) {
      const parent = this.$refs[c]
      if (show) {
        parent.style.overflow = 'hidden'
        parent.style.height = 40 + parent.lastElementChild.offsetHeight + 'px'
        if (this.timer) {
          clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
          parent.style.overflow = 'auto'
          parent.style.height = 'auto'
        }, 500)
      } else {
        parent.style.overflow = 'hidden'
        parent.style.height = 40 + parent.lastElementChild.offsetHeight + 'px'
        setTimeout(() => {
          parent.style.overflow = 'hidden'
          parent.style.height = '35px'
        }, 10)
      }
    },
    getData () {
      this.load = true
      getProcessNodeData({
        id: this.treeData.id,
        pid: this.treeData.pid,
        type: this.treeData.type
      }).then(rt => {
        this.load = false
        this.content = rt.data
      })
    },
    handleNodeClick (data) {
      this.treeData = data
      this.isShowTable = data.type === '2'
      if (!this.isShowTable) {
        return
      }
      this.getData()
    },
    treeRefresh () {
      this.$refs.tree.getDepartment()
    }
  }
}
</script>
<style lang="scss" scoped>
.item-left {
  float: left;
  width: 20%;
}
.item-right {
  float: right;
  width: 78%;
  .card1 {
    padding: 0 5px 15px 15px;
    background: white;
    overflow: hidden;
    transition-duration: 0.5s;
    box-sizing: border-box;
    height: 35px;

    .header {
      margin-right: 10px;
      display: flex;
      border-bottom: 1px solid $dc1;
      margin-bottom: 10px;
      .title {
        height: 35px;
        line-height: 35px;
        color: $tc1;
        font-weight: bold;
      }
      .space {
        flex-grow: 1;
      }
    }
  }
  .table-header {
    position: relative;
    background: $bc2;
    display: flex;
    align-items: center;
    .all-check {
      position: absolute;
      left: 20px;
    }
  }
  .h-auto {
    height: auto;
  }
}
</style>
