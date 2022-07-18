<template>
  <div>
    <slot :form="form">
      {{form.name}}
    </slot>
  </div>
</template>

<script>
export default {
  name: 'Test',
  data () {
    return {
      datalist: [
        {
          name: '赵元',
          sex: '男'
        },
        {
          name: '流程',
          sex: '女'
        },
        {
          name: '汤莹',
          sex: '女'
        }
      ]
    }
  }
}
</script>
