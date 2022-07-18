<template>
  <div id="configProcess" v-loading="loading">
    <el-form ref="ruleForm" :model="ruleForm">
      <div ref="card1" class="card1">
        <div class="header">
          <span class="title">{{ $t('configurationProcess') }}</span>
        </div>
        <div class="card-info">
          <el-button type="primary" @click="handleCheckAllChange">
            {{ $t('selectAll') }}/{{ $t('reverseElection') }}
          </el-button>
          <el-form ref="ruleForm" :model="ruleForm" label-width="120px">
            <el-row>
              <el-checkbox-group v-model="checkedCities">
                <el-col
                  v-for="(item, index) in cities"
                  :key="index"
                  :span="8"
                  style="margin-top: 10px;"
                >
                  <el-checkbox
                    :key="item.id"
                    :label="item.id"
                    :checked="item.isCheck ==='Y'"
                  >
                    {{ item.processname }}
                  </el-checkbox>
                </el-col>
              </el-checkbox-group>
            </el-row>
            <div class="text-r">
              <el-button type="primary" @click="subHandle">
                {{ $t('submit') }}
              </el-button>
            </div>
          </el-form>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script>
import { now } from 'moment-mini'
import {
  getMobileProcess,
  addMobileProcess
} from '@/bpm/api/process/mobileConfig/mobile_process'
export default {
  name: 'ConfigProcess',
  components: {},
  props: {
    treeData: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      ruleForm: {},
      loading: false,
      cities: [],
      checkedCities: [],
      checkAll: false,
      citiesIds: []
    }
  },
  computed: {},
  watch: {
    treeData(val) {
      this.getData()
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    subHandle() {
      this.loading = true
      const _list = this.cities.filter(
        item => !this.checkedCities.some(ele => ele === item.id)
      ).map(item => item.id)
      const processIds = []
      const delmapids = []
      // 获取当前新增勾选的id
      this.checkedCities.forEach(item => {
        if (this.citiesIds.indexOf(item) === -1) {
          processIds.push(item)
        }
      })
      // 获取当前取消勾选的id
      this.citiesIds.forEach(item => {
        if (this.checkedCities.indexOf(item) === -1) {
          delmapids.push(item)
        }
      })
      addMobileProcess({ processIds: processIds, delmapids: delmapids }).then(rt => {
        this.loading = false
        if (rt.status === '200') {
          this.$message({
            message: this.$t('hintText.saveSuccessfully'),
            type: 'success'
          })
          this.$emit('confim', true)
          // this.getData()
        } else {
          this.loading = false
          this.$message({
            message: this.$t('hintText.failToSave'),
            type: 'error'
          })
        }
      })
        .catch(() => {
          this.loading = false
          this.$message({
            message: this.$t('hintText.failToSave'),
            type: 'error'
          })
        })
    },
    getData() {
      this.loading = true
      getMobileProcess()
        .then(rt => {
          if (rt.status === '200') {
            this.loading = false
            this.cities = rt.data
            this.citiesIds = this.cities.filter(
              item => item.isCheck === 'Y'
            ).map(item => item.id)
            this.checkAll = this.citiesIds.length === this.cities.length
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleCheckAllChange() {
      this.checkAll = !this.checkAll
      if (this.checkAll) {
        this.checkedCities = this.cities.map(x => x.id)
      } else {
        this.checkedCities = []
      }
    }
  }
}
</script>
<style lang="scss">
#configProcess {
  .el-input__inner {
    border: none;
    border-bottom: 1px solid $dc1;
  }
  .text-r {
    button {
      margin: 15px 10px;
    }
  }
}
</style>
<style lang="scss" scoped>
#configProcess {
  .w100 {
    width: 100%;
  }
  .card1 {
    padding: 0 5px 15px 15px;
    background: white;
    overflow: hidden;
    transition-duration: 0.5s;
    box-sizing: border-box;
    height: auto;
    .header {
      margin-right: 10px;
      border-bottom: 1px solid $dc1;
      margin-bottom: 10px;
      display: flex;
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
}
</style>
