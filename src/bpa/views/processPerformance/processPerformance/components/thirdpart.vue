<template>
  <div class="center w100 h100">
    <div class="textArea">
        <h6>采购执行效率</h6>
        <div class="showNum">
            <text-gradient :title="'3698.23'" :font="'45'" :bold="'bold'" class="inline-block"></text-gradient>
            <span class="inline-block">h</span>
        </div>
    </div>
  </div>
</template>

<script>
import textGradient from '@/bpa/components/textGradient.vue'
export default {
  name: 'thirdpart',
  components: {
    textGradient
  },
  data() {
    return {
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
* {
    box-sizing: border-box;
}
.inline-block{
  display: inline-block;
  vertical-align: top;
}
h6 {
    font-size: 16px;
    color: #a9ddee;
    font-weight: 100;
    line-height: 38px;
}
.center {
    background: url('../../../../assets/img/centerEarth.png') center center no-repeat;
    background-size: 70% auto;
    position: relative;
}
.textArea {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -70%);
    h6 {
        text-align: center;
        font-size: 25px;
        font-weight: bold;
        color: #fff;
        margin-bottom: 20px;
    }
    .showNum {
        text-align: center;
        font-size: 20px;
        color: #fff;
        position: relative;
        span {
            position: absolute;
            left: 105%;
            top: 18px;
        }
    }
}
</style>
