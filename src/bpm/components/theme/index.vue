<template>
  <div id="theme">
    <el-form ref="ruleForm" label-width="80px">
      <el-form-item :label="$t('chooseTheme')" prop="grantor" size="small">
        <el-row>
          <el-col :span="12">
            <el-radio v-model="themeColor" label="" class="blue">
              {{ $t('default') }}
            </el-radio>
          </el-col>
          <el-col :span="12">
            <el-radio v-model="themeColor" label="red" class="red">
              {{ $t('red') }}
            </el-radio>
          </el-col>
          <el-col :span="12">
            <el-radio v-model="themeColor" label="orange" class="orange">
              {{ $t('orange') }}
            </el-radio>
          </el-col>
          <el-col :span="12">
            <el-radio v-model="themeColor" label="purple" class="purple">
              {{ $t('purple') }}
            </el-radio>
          </el-col>
          <!-- <el-col :span="12">
            <el-radio v-model="themeColor" label="custom" class="custom" @change.self="changeRadioColor"  style=" display: flex; justify-content: flex-start;flex-direction: row;margin-top:10px;">
              <div  style=" display: flex; justify-content: flex-start;flex-direction: row;">
                <span class="custom" style="margin-right:6px"> {{ $t('bodyColor') }} </span>
                <el-color-picker v-model="customThemeColor" @change.self="changeCustomColor" size="mini" style="position:relative;top:-6px;"></el-color-picker>
               </div>
            </el-radio>
          </el-col> -->
        </el-row>
      </el-form-item>
      <el-form-item :label="$t('chooseSkin')" prop="grantor" size="small">
        <el-row>
          <el-col :span="12" v-for='v,i in skinOption' :key='v.value'>
            <el-radio v-model="skinColor" :label="v.value" :class="v.class">
              {{ $t(v.label) }}
            </el-radio>
          </el-col>
        </el-row>
      </el-form-item>
      <div class="text-r">
        <el-button type="primary" @click="submit">
          {{ $t('confirm') }}
        </el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
// import { setThemeColorInfo } from "@/bpm/api/app";
import { createNamespacedHelpers } from 'vuex'
const { mapMutations } = createNamespacedHelpers('app')
const headerStore = createNamespacedHelpers('header')

export default {
  name: 'Theme',
  data() {
    return {
      themeColor: '',
      skinColor: '',
      skinOption: [
        {label: '经典蓝',class: '' ,value: 'blue'},
        {label: '简约白',class: '' ,value: 'white'}
      ] 
      // currentColor:'',
      // customThemeColor:''
    }
  },
  mounted() {
    this.themeColor = this.$store.state.app.themeColor
    this.skinColor = this.$store.state.header.headerSkin;
  },
  methods: {
    ...mapMutations(['setThemeColor']),
    ...headerStore.mapMutations(['setHeaderSkin']),
    // changeRadioColor(e){
    //   console.log('radio----------class类型', e)//custom
    //   this.themeColor = e
    //   this.currentColor = e
    //   console.log(' this.themeColor----------',  this.themeColor)//custom
    // },
    // changeCustomColor(e){
    //    console.log('e---------自定义颜色', e)//#11E426
    //    this.customThemeColor = e 
    //     this.currentColor = e
    //    document.body.style.setProperty("--testColor", e)
    // },
    submit() {
      //  let root = document.querySelector(":root");
      //  root.style.setProperty("--primary",this.currentColor)

      //  setThemeColorInfo({
      //    id:this.$store.state.app.themeColorId,
      //    color:this.themeColor
      //  }).then(rt => {
      //    console.log('rt', rt)
      //   if (rt.status === '200') {
      //      this.setThemeColor(this.themeColor === 'blue' ? '' : this.themeColor)
      //     this.$router.go(0)
      //     // window.location.reload()

      //     //  this.setThemeColor(this.currentColor)//主题的class-红/橙/紫
      //     //  this.setThemeColorId(rt.data.id)//主题的颜色
      //     //  this.setCustomThemeColor(this.currentColor)//主题的颜色
      //   }
      // })
 
  
      this.setThemeColor(this.themeColor === 'blue' ? '' : this.themeColor)
      this.setHeaderSkin(this.skinColor)
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
   .custom{
    color: var(--testColor)
  }
}
</style>
