<template>
  <div id="theme">
    <el-form ref="ruleForm" label-width="80px">
      <el-form-item label="选择语音" prop="grantor" size="small">
        <el-row>
          <el-col :span="12">
            <el-radio v-model="global" label="orange" class="orange">中文</el-radio>
          </el-col>
          <el-col :span="12">
            <el-radio v-model="global" label="purple" class="purple">英文</el-radio>
          </el-col>
        </el-row>
      </el-form-item>
      <div class="text-r">
        <el-button type="primary" @click="submit">{{ $t('confirm') }}</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import {createNamespacedHelpers} from 'vuex'
const { mapMutations } = createNamespacedHelpers('app')
export default {
  name: 'theme',
  data () {
    return {
      global: ''
    }
  },
  mounted () {
    // this.global = this.$store.state.app.global
  },
  methods: {
    ...mapMutations(['setThemeColor']),
    submit () {
      this.setThemeColor(this.themeColor === 'blue' ? '' : this.themeColor)
      this.$router.go(0)
    }
  }
}
</script>
<style lang="scss">
#theme {
}
</style>
<style lang="scss" scoped>
#theme {
  .blue {
    color: #2d42af;
  }
  .red {
    color: #ed1111;
  }
  .orange {
    color: #FF7F00;
  }
  .purple {
    color: #AF3BFF;
  }
}
</style>
