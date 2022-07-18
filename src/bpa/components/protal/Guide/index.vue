<template>
  <div>
    <el-button icon="el-icon-question" type="primary" @click.prevent.stop="guide">
      开始导航
    </el-button>
  </div>
</template>

<script>
import Driver from 'driver.js' // import driver.js
import 'driver.js/dist/driver.min.css' // import driver.js css
export default {
  name: 'PortalGuide',
  props: {
    steps: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      driver: null
    }
  },
  mounted() {
    this.driver = new Driver({
      className: '', // className to wrap driver.js popover
      animate: true, // Animate while changing highlighted element
      opacity: 0.75, // Background opacity (0 means only popovers and without overlay)
      padding: 10, // Distance of element from around the edges
      allowClose: true, // Whether clicking on overlay should close or not
      overlayClickNext: false, // Should it move to next step on overlay click
      doneBtnText: 'Done', // Text on the final button
      closeBtnText: '关闭', // Text on the close button for this step
      nextBtnText: '下一步', // Next button text for this step
      prevBtnText: '上一步', // Previous button text for this step
      showButtons: true, // Do not show control buttons in footer
      keyboardControl: true, // Allow controlling through keyboard (escape to close, arrow keys to move)
      scrollIntoViewOptions: {}, // We use `scrollIntoView()` when possible, pass here the options for it if you want any
      onHighlightStarted: (Element) => {}, // Called when element is about to be highlighted
      onHighlighted: (Element) => {}, // Called when element is fully highlighted
      onDeselected: (Element) => {}, // Called when element has been deselected
      onReset: (Element) => {}, // Called when overlay is about to be cleared
      onNext: (Element) => {}, // Called when moving to next step on any step
      onPrevious: (Element) => {} // Called when moving to next step on any step
    })
  },
  methods: {
    guide() {
      this.driver.defineSteps(this.steps)
      this.driver.start()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
