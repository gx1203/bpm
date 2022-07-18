<template>
  <div id="meQrcode" :title="qrUrl">
    <div class="qrcode_box">
      <img
        id="qrcode_canvas"
        ref="qrcode_canvas"
        class="qrcode_canvas"
        alt="二维码本图"
      >
      <img
        v-if="qrLogo"
        ref="qrcode_logo"
        :src="qrLogo"
        class="qrcode_logo"
        alt="公司logo"
      >
      <canvas
        ref="canvas"
        :width="qrSize"
        :height="qrSize"
        class="canvas"
      />
    </div>
  </div>
</template>
<script>
import QRCode from 'qrcode'
import logo from './logo.png'
export default {
  // name: "AQrcode",
  props: {
    qrUrl: {
      type: String,
      default: ''
    },
    qrSize: {
      type: Number,
      default: 200
    },
    qrText: {
      type: String,
      default: ''
    },
    qrLogo: {
      type: String,
      default: logo
    },
    qrLogoSize: {
      type: Number,
      default: 40
    },
    qrTextSize: {
      type: Number,
      default: 14
    }
  },
  data() {
    return {
      // qrUrl: 'http://www.baidu.com/'
    }
  },
  mounted() {
    this.handleQrcodeToDataUrl()
  },
  updated() {
    this.handleQrcodeToDataUrl()
  },
  methods: {
    /**
     * @argument qrUrl        二维码内容
     * @argument qrSize       二维码大小
     * @argument qrText       二维码下方显示文字
     * @argument qrTextSize   二维码下方显示文字大小(默认16px)
     * @argument qrLogo       二维码中间显示图片
     * @argument qrLogoSize   二维码中间显示图片大小(默认为80)
     */
    handleQrcodeToDataUrl() {
      const qrcode_canvas = this.$refs.qrcode_canvas
      const qrcode_logo = this.$refs.qrcode_logo
      const canvas = this.$refs.canvas
      const that = this
      QRCode.toDataURL(
        that.qrUrl,
        { errorCorrectionLevel: 'H' },
        // eslint-disable-next-line handle-callback-err
        (err, url) => {
          qrcode_canvas.src = url
          const ctx = canvas.getContext('2d')

          setTimeout(() => {
            ctx.drawImage(qrcode_canvas, 0, 0, that.qrSize, that.qrSize)
            if (that.qrLogo) {
              // 设置logo大小
              // 设置获取的logo将其变为圆角以及添加白色背景
              ctx.fillStyle = '#fff'
              ctx.beginPath()
              const logoPosition = (that.qrSize - that.qrLogoSize) / 2 // logo相对于canvas居中定位
              const h = that.qrLogoSize + 6 // 圆角高 10为基数(logo四周白色背景为10/2)
              const w = that.qrLogoSize + 6 // 圆角宽
              const x = logoPosition - 3
              const y = logoPosition - 3
              const r = 5 // 圆角半径
              ctx.moveTo(x + r, y)
              ctx.arcTo(x + w, y, x + w, y + h, r)
              ctx.arcTo(x + w, y + h, x, y + h, r)
              ctx.arcTo(x, y + h, x, y, r)
              ctx.arcTo(x, y, x + w, y, r)
              ctx.closePath()
              ctx.fill()
              ctx.drawImage(
                qrcode_logo,
                logoPosition,
                logoPosition,
                that.qrLogoSize,
                that.qrLogoSize
              )
            }
            if (that.qrText) {
              // 设置字体
              // const fpadd = 10 // 规定内间距
              ctx.font = 'bold ' + that.qrTextSize + 'px Arial'
              const tw = ctx.measureText(that.qrText).width // 文字真实宽度
              const ftop = that.qrSize - that.qrTextSize // 根据字体大小计算文字top
              const fleft = (that.qrSize - tw) / 2 // 根据字体大小计算文字left
              const tp = that.qrTextSize / 2 // 字体边距为字体大小的一半可以自己设置
              ctx.fillStyle = '#fff'
              ctx.fillRect(
                fleft - tp / 2,
                ftop - tp / 2,
                tw + tp,
                that.qrTextSize + tp
              )
              ctx.textBaseline = 'top' // 设置绘制文本时的文本基线。
              ctx.fillStyle = '#333'
              ctx.fillText(that.qrText, fleft, ftop)
            }
            canvas.style.display = 'none'
            qrcode_canvas.src = canvas.toDataURL()
            qrcode_canvas.style.display = 'inline-block'
          }, 0)
        }
      )
    }
  }
}
</script>
<style scoped>
  .qrcode_box,
  #meQrcode {
    display: inline-block;
  }

  .qrcode_box img {
    display: none;
  }
</style>
