<template>
  <el-dialog ref :title="title" :visible.sync="dialogVisible" append-to-body @close="closeDialog">
    <el-form ref="item" :model="item" :rules="rules" label-width="auto" class="content">
      <el-form-item :label="$t('projectName2') + '：'" prop="projectTypeCode">
        <el-input v-model="item.projectTypeCode" clearable />
      </el-form-item>
      <el-form-item :label="$t('projectDisplayName') + '：'" prop="projectTypeName">
        <el-input v-model="item.projectTypeName" clearable />
      </el-form-item>
      <el-form-item :label="$t('link') + '：'" required>
        <el-button @click="addList">
          {{ $t('add') }}
        </el-button>
        <table
          border="1"
          cellspacing="0"
          style="margin: 15px 0;text-align: center;width: 100%;border-collapse:collapse;border: 1px solid #dedede;"
        >
          <tbody>
            <tr
              v-for="(data,index) in item.linkProjectLinkList"
              :key="index"
              style="line-height: 16px;height: 30px;font-size: 13px;"
            >
              <td>
                <el-select v-model="data.linkTypeCodeId" clearable style="padding:5px;width: 91%;">
                  <el-option
                    v-for="val in options"
                    :key="val.linkTypeCode"
                    :label="val.linkTypeName"
                    :value="val.linkTypeCode"
                  />
                </el-select>
              </td>
              <td>
                <el-input v-model="data.linkUrl" clearable style="padding:5px;width: 91%;" />
              </td>
              <td>
                <el-button
                  type="text"
                  icon="el-icon-delete"
                  style="padding:5px"
                  @click="deleData(index)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="submit('item')">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getlinkTypeList } from '@/bpm/api/configManage/link/link_type.js'
import { saveLinkProject } from '@/bpm/api/configManage/link/link_configuration.js'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: () => {
        return {}
      }
    },
    title: {
      type: String,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: this.value,
      options: [],
      rules: {
        projectTypeCode: [
          { required: true, message: this.$t('pleaseWrite') + this.$t('projectName2'), trigger: 'blur' },
          { max: 255, message: this.$t('projectName2') + this.$t('superLong'), trigger: 'blur' }
        ],
        projectTypeName: [
          { required: true, message: this.$t('pleaseWrite') + this.$t('projectDisplayName'), trigger: 'blur' },
          { max: 255, message: this.$t('projectDisplayName') + this.$t('superLong'), trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    value(val) {
      this.dialogVisible = val
      if (this.dialogVisible) {
        console.log(this.item)
        this.getSelete()
      }
    },
    dialogVisible(val) {
      this.$emit('input', val)
    }
  },
  mounted() {
  },
  methods: {
    closeDialog () {
      this.$refs.item.resetFields()
    },
    getSelete() {
      getlinkTypeList()
        .then(rt => {
          if (rt.status === '200') {
            this.options = rt.data.list
          }
        })
        .catch(() => {})
    },
    isVerify() {
      if (this.item.linkProjectLinkList.length === 0) {
        this.$message.error(this.$t('hintText.pleaseEnterAtLeastOneProjectLink'))
        return false
      } else {
        for (
          let index = 0;
          index < this.item.linkProjectLinkList.length;
          index++
        ) {
          if (
            !this.item.linkProjectLinkList[index].linkTypeCodeId ||
            !this.item.linkProjectLinkList[index].linkUrl
          ) {
            this.$message.error(this.$t('hintText.pleaseEnterTheCompleteProjectLink'))
            return false
          } else if (this.item.linkProjectLinkList[index].linkUrl.length > 255) {
            this.$message.error(`第${index + 1}行链接超长！！`)
            return false
          }
        }
      }
      return true
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.isVerify()) return
          this.loading = true
          saveLinkProject(this.item)
            .then(rt => {
              if (rt.status === '200') {
                this.$message.success(this.$t('hintText.addedSuccess'))
                this.dialogVisible = false
                this.$emit('confirm', this.item)
              }
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    cancel() {
      this.dialogVisible = false
    },
    addList() {
      this.item.linkProjectLinkList.push({
        linkTypeCodeId: '',
        linkUrl: ''
      })
    },
    deleData(index) {
      this.item.linkProjectLinkList.splice(index, 1)
    }
  }
}
</script>

<style scoped>
.content {
  height: 50vh;
  width: 60%;
  margin: 0 auto;
  pad: 0 10px;
  overflow: auto;
}
</style>
