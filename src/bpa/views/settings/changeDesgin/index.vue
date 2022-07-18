<template>
  <div id="changeLegend">
    <el-row :gutter="10">
      <el-col :span="12" class="text-center">
        <img class="example" src="@/bpa/assets/img/bgnocolor.jpg"/>
        <el-radio class="margin-t15" v-model="chooseSubject" label="white" @change="saveChagne">
          {{ $t("illustrations") }}
        </el-radio>
      </el-col>
      <el-col :span="12" class="text-center">
        <img class="example" src="@/bpa/assets/img/bgcolor.jpg"/>
        <el-radio class="margin-t15" v-model="chooseSubject" label="shadow" @change="saveChagne">
          {{ $t("shadowLegend") }}
        </el-radio>
      </el-col>
    </el-row>

    <div class="change-setting">
      {{ $t("upDownProcessSwitch") }}
      <el-switch
        style="margin-left:10px"
        v-model="upDownProcessOpen"
        active-value="enable"
        inactive-value="disable"
        @change="processChange">
      </el-switch>
    </div>
  </div>
</template>

<script>
import {saveLegend, requireLegend} from '@/bpa/api/settings/changeDesgin'

export default {
  data() {
    return {
      upDownProcessOpen: 'disable',
      chooseSubject: 'white',
      modifyTheSuccess: this.$t("hintText.modifyTheSuccess")
    }
  },
  mounted() {
    this.getChecked()
    this.getSettings('swimlane')
  },
  methods: {
    processChange(status){
      this.saveSetting('swimlane',status)
    },
    saveChagne() {
      saveLegend({
        'id': '1',
        'name': this.chooseSubject,
        'checked': '1'
      }).then(res => {
        if (!res) return false
        this.$message({
          type: 'success',
          message: this.modifyTheSuccess
        })
      })
    },
    getChecked() {
      requireLegend('1').then(res => {
        if (!res) return false
        this.chooseSubject = res.name
      })
    },
    getSettings(setting) {
      requireLegend(setting).then(res => {
        this.upDownProcessOpen = res.name
      })
    },
    saveSetting(key, value) {
      let params = {
        "createon": null,
        "createby": "00041956",
        "updateon": null,
        "updateby": "00041956",
        "id": key,
        "name": value,
        "checked": null
      }
      saveLegend(params).then(res => {
        if(!res){
          this.upDownProcessOpen = 'disable'
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#changeLegend {
  img.example {
    width: 400px;
    height: 355px;
    display: block;
    margin: 0 auto;
  }

  .change-setting {
    padding: 20px;
    margin: 20px;
    border: 1px solid #eeeeee;
    border-radius: 3px;
  }
}
</style>
