<template>
  <el-form-item :label="title">
    <el-input clearable v-model="form[prop]"></el-input>
  </el-form-item>
</template>

<script>
export default {
  name: 'FormItem',
  data () {
    return {
      form: {}
    }
  },
  props: {
    title: {
      type: String,
      default: 'title'
    },
    prop: {
      type: String,
      default: 'prop'
    },
    value2: {
      type: String,
      default: 'prop'
    }
  },
  mounted () {
    this.form[this.prop] = this.value2
  }
}
</script>