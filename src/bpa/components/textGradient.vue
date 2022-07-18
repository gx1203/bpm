<template>
    <svg class="textGradient" ref="textGradient">
        <defs>
            <linearGradient id="grad" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" />
                <stop offset="100%" />
            </linearGradient>
        </defs>
        <text ref="text" x="0" y="36" :style="'font-size:' + font + 'px;font-weight:' + bold + ';'">{{title}}</text>
    </svg>
</template>

<script>
export default {
  name: 'textGradient',
  data() {
    return {}
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    font: {
      type: String,
      default: '36'
    },
    bold: {
      type: String,
      default: 'normal'
    }
  },
  mounted () {
    let width = this.$refs.text.getBoundingClientRect().width
    let height = this.$refs.text.getBoundingClientRect().height + 2
    this.$refs.textGradient.style.width = `${width}px`
    this.$refs.textGradient.style.height = `${height}px`
  }
}
</script>

<style lang="scss" scoped>
.textGradient {
    linearGradient {
        stop:nth-of-type(1){
            stop-color:#00bdf5;
            stop-opacity:1;
        }
        stop:nth-of-type(2){
            stop-color:#64d7c1;
            stop-opacity:1;
        }
    }
    text {
        font-size: 36px;
        fill: url(#grad);
    }
}
</style>
