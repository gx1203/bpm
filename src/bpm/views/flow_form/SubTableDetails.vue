<template>
  <el-dialog title="子表详情" :visible.sync="dialogVisible" v-loading="loading" top="10vh" :close-on-click-modal="false" :close-on-press-escape="false" append-to-body>
    <flow-card :data="item" :subTableDetailsErrorShow="subTableDetailsErrorShow" isSubTableDetail :bizData2="bizData2" />
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">{{ $t('cancelAction') }}</el-button>
      <el-button type="primary" @click="confirm" v-if="btnShow">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapMutations } = createNamespacedHelpers('app')
export default {
  name: 'SubTableDetail',
  components: {
    FlowCard: () => import('./FlowCard')
  },
  data () {
    return {
      dialogVisible: this.value,
      loading: false,
      errors: [],
      subTableDetailsErrorShow: false,
      btnShow: false
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    bizData2: {
      type: Object,
      default: () => ({})
    },
    item: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    ...mapGetters(['errorsShow'])
  },
  watch: {
    value (val) {
      this.dialogVisible = val
      if (val) {
        this.subTableDetailsErrorShow = false
        this.errors = []
        let nodeTableLists = this.item.nodeTableLists.filter(item => item.editstate === 'W')
        this.btnShow = nodeTableLists.length !== 0
        this.$forceUpdate()
      }
    },
    dialogVisible (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    ...mapMutations(["setErrorsShow"]),
    getFormData () {
      this.item.nodeTableLists.forEach(table => {
        if (table.inputType !== "hidden" && table.editstate === "W") {
          if (
            table.isrequired === "required" &&
            table.inputType === "subtable" &&
            table.rows.length < 1
          ) {
            this.errors.push(table);
          } else if (table.inputType !== "subtable") {
            if (table.inputType === "nokt") {
              if (!table.value && table.isrequired === "required") {
                this.errors.push(table);
                return;
              }
            } else {
              if (!table.applyvalue && table.isrequired === "required") {
                this.errors.push(table);
                return;
              }
            }
            if (table.inputType !== "ckeditor") {
              if (
                table.applyvalue &&
                table.applyvalue.length > table.length
              ) {
                this.errors.push(table);
              }
            }
          }
        }
      })
    },
    confirm () {
      this.errors = []
      this.getFormData();
      if (this.errors.length === 0) {
        this.$emit('confirm', JSON.parse(JSON.stringify(this.item)));
        this.dialogVisible = false
      } else {
        this.subTableDetailsErrorShow = true
        if (this.errors[0].applyvalue) {
          this.$message({
            showClose: true,
            message: `${this.errors[0].fieldShowName}超长`,
            type: "error"
          });
        } else {
          this.$message({
            showClose: true,
            message: `${this.errors[0].fieldShowName}` + this.$t('hintText.cannotBeEmpty'),
            type: "error"
          });
        }
      }
    }
  },
  mounted () {
  }
}
</script>

<style type="text/scss" lang="scss" scoped>
.el-dialog__wrapper {
  /deep/ .el-dialog {
    min-width: 1080px;
    width: 56vw;
  }
}
</style>
