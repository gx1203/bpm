<template>
  <div class="pos-relative inline-block" v-show="dialogVisisble" id="newFramework" ref="newFramework">
    <div class="labelContent" v-if="!!dataprocess[0].name">
        <div class="text-center w150px h100 label" style="background-color: #486895;">
          <p :title="dataprocess[0].name">{{dataprocess[0].name}}</p>
        </div>
        <frame :children="dataprocess[0].children" v-if="!!dataprocess[0].children && dataprocess[0].children.length > 0"></frame>
    </div>
  </div>
</template>

<script>
import { newProcessFrmwrk } from '@/bpa/api/processModelCenter/processIframeCenter'
import frame from './components/frame.vue'
import $ from 'jquery'
export default {
  name: 'newFrame',
  components: {
    frame
  },
  data () {
    return {
      dialogVisisble: true,
      dataprocess: [{
        name: '',
        code: ''
      }]
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    scaleTo: {
      type: Number,
      default: 1
    },
    selectClass: {
      type: String,
      default: '1'
    }
  },
  watch: {
    value (val) {
      if (val) {
        this.dialogVisisble = val
      }
    },
    dialogVisisble (val) {
      if (!val) {
        $('#newFramework').height('auto')
      }
      this.$emit('input', val)
    },
    scaleTo (val) {
      this.$refs.newFramework.style = 'transform: scale(' + this.scaleTo + ');'
      if (this.scaleTo < 1) {
        $('#newFramework').height($('#newFramework').height() * this.scaleTo)
      }
    },
    selectClass (val) {
      this.getFrameDatas()
    }
  },
  mounted () {
    this.getFrameDatas()
  },
  methods: {
    getFrameDatas () {
      newProcessFrmwrk(this.selectClass).then(res => {
        // console.log(res)
        res.forEach(item => {
          if (item.rank == 1) {
            console.log(item)
            this.dataprocess = [JSON.parse(JSON.stringify(item))]
            return false
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#newFramework{
  transform-origin: left top;
}
.inline-block{
  display: inline-block;
  vertical-align: top
}
.text-center{
  text-align: center;
}
.w150px{
  width: 150px;
}
.labelContent{
    min-height: 30px;
    line-height: 24px;
    padding-left: 150px;
    position: relative;
    .label {
        color: #fff;
        font-size: 12px;
        box-sizing: border-box;
        border-left: 2px solid #fff;
        border-bottom: 2px solid #fff;
        position: absolute;
        top: 0;
        left: 0;
        p {
          width: 96%;
          line-height: 16px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
    }
}
</style>
