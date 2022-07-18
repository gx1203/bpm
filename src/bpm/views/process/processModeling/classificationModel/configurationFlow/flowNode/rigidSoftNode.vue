<template>
  <div id="rigidSoftConfig"  v-loading="load">
     <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="120px">
        <el-row>
            <el-col :span="8" :offset="2">
              <el-form-item :label="$t('nodeProperties') + '：'">
                 <el-select v-model="ruleForm.nodeattr" clearable :placeholder="$t('placeholderText.pleaseSelect')"
                  class="w100">
                  <el-option v-for="item in nodePropertiesList" :key="item.value" :label="item.text" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
             <el-col :span="8" :offset="2"> 
              <el-form-item :label="$t('businessRuleAuthority') + '：'" prop="authusersDisplayname">
                <!-- <el-input v-model="ruleForm.authusersDisplayname" :placeholder="$t('placeholderText.pleaseSelect')" clearable /> -->
                <el-input
                  type="textarea"
                  clearable
                  @focus="handelCkeckAuthusers"
                  v-model="ruleForm.authusersDisplayname"
                   :placeholder="$t('placeholderText.pleaseSelect')" 
                ></el-input>


               <!-- <el-input clearable  type="textarea" :rows="3" v-model="ruleForm.authusers" @focus="usersHandle" :placeholder="$t('placeholderText.pleaseSelect')" ></el-input> -->
              </el-form-item>
            </el-col>
          </el-row>
     </el-form>
      <el-row>
      <div class="text-r">
        <el-button type="primary" @click="saveForm('ruleForm')">
          {{ $t('submit') }}
        </el-button>
      </div>
    </el-row>
     <bas-organieation
      v-model="organieationShow"
      :selectedElement="selectedElement"
      :isSpecifiedGroupBut="false"
      :isShowBustomGroupsBut="false"
      :selectElement="selectElement"
      :showElement="showElement"
      :title="orgtitle"
      @fnCallBack="fnBasOrganieationCallBack"
    />
  </div>
</template>

<script>
import {
  updateProcessNode,
  getDictionaryOption,
} from '@/bpm/api/process/processModeling/classificationModel'
export default {
  name:'rigidSoftConfig',
  props: {
    content: {
      type: Object
    },
    treeData: {
      type: Object
    }
  },
  data () {
    return {
      load: false,
      nodePropertiesList:[],
      organieationShow: false,
      selectedElement: {},
      showElement: [],
      selectElement: ["9"],
      orgtitle: "选择权限人",
      ruleForm:{
        nodeattr:"",
        authusers:""
      },
      rules: {
       authusersDisplayname: [
        { required: true, message: this.$t('hintText.pleaseSelectBusinessRuleAuthority'), trigger: 'blur' }
      ]
    },
    }
  },
  watch:{
     content (val) {
        this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate();
      })
      this.ruleForm = val
    }
  },
  mounted(){
     getDictionaryOption({
      dictionaryen: '节点属性'
    }).then(rt => {
      this.nodePropertiesList = rt.data
    })
  },
  methods:{
    handelCkeckAuthusers(){
      this.selectedElement = {};
      if (this.ruleForm.authusers) {
        let list = this.ruleForm.authusersDisplayname.split("、").join("&");
        let idType = []
        this.ruleForm.authusers.split(",").forEach((item, i) => {
          idType.push(`${item}-9`)
        });
        this.selectedElement = {
          id: this.ruleForm.authusers.split(","),
          name: list,
          idType: idType.join(";"),
        }
      }
      this.organieationShow = true
    },
    fnBasOrganieationCallBack(data) {
      this.$set(this.ruleForm, "authusersDisplayname", data.name.split("&").join("、"));
      this.$set(this.ruleForm, "authusers", data.id);
      this.organieationShow = false;
    },
    saveForm(ruleForm) {
        this.$refs[ruleForm].validate(valid => {
          const than = this
          if (valid) {
            than.load = true
             let obj = Object.assign({}, than.ruleForm)
              obj.textingchecked = obj.textingchecked.join(',')
             updateProcessNode({
            ...obj
          })
            .then(rt => {
              than.load = false
              if (rt.status === '200') {
                than.$message.success(this.$t('hintText.submittedSuccessfully'))
              }
            })
            .catch(er => {
              than.load = false
            })
          }
        })
    },
  }
}

</script>
<style lang="scss">
  #rigidSoftConfig{

  }
</style>
<style lang="scss" scoped>
 #rigidSoftConfig{
    
  }
</style>
















