<template>
  <el-dialog title="详情" :visible.sync="isShow" :close-on-click-modal = false :close-on-press-escape = false>
    <el-form>
      <el-row>
        <el-col :span="22">
          <el-form-item label="活动名称" label-width="100px" prop="name">
            <el-input clearable :value="itemDataCopy.name" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item :label="$t('processResponsibility')" label-width="100px" prop="bponame">
            <el-input clearable :value="itemDataCopy.bponame" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item :label="$t('issuer')" label-width="100px" prop="submitby">
            <el-input clearable :value="itemDataCopy.submitby" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22">
          <el-form-item label="可见人员" label-width="100px" prop="typeid">
            <el-select clearable v-model="itemDataCopy.typeid" disabled>
              <el-option
                v-for="item in visitorlists"
                :key="item.id"
                :label="item.authorityname"
                :value="item.typeid">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="showTxtareaIdList.indexOf(itemDataCopy.typeid) > -1">
        <el-col :span="22">
          <el-form-item label="详情" label-width="100px" prop="orgnameFormat">
            <el-input clearable disabled v-model="itemDataCopy.orgnameFormat" type="textarea" resize="none" rows="5"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="22">
          <el-form-item label="修改原因" label-width="100px" prop="updatereason">
            <el-input clearable v-model="itemDataCopy.updatereason" disabled type="textarea" resize="none" rows="5"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="isShow = false">{{$t("cancel")}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  getOrgidAndName,
  getViewableSelectList
} from '@/bpa/api/settings/processVisibleManage'

export default {
  name: 'Description',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    itemData: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      showTxtareaIdList: ['2', '7', '8'],
      isShow: false,
      visitorlists: []
    }
  },
  computed: {
    itemDataCopy () {
      return JSON.parse(JSON.stringify(this.itemData))
    }
  },
  watch: {
    value (val) {
      if (val) {
        this.isShow = true
        this.requireVisior()
      }
    },
    isShow (val) {
      this.$emit("input", val)
    }
  },
  methods: {
    // 获取下拉菜单的数据
    requireVisior () {
      // 请求下拉菜单数据
      getViewableSelectList({
        attr: {},
        orderby: 'createon',
        pageNum: 1,
        pageSize: 10,
        sort: 'desc'
      }).then(res => {
        this.visitorlists = res.list
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
