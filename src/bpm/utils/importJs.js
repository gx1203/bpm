// function loadJs(src) {
//     return new Promise((resolve,reject)=>{
//       let script = document.createElement('script')
//       script.type = "text/javascript"
//       script.onload = ()=>{
//         resolve()
//       }
//       script.onerror = ()=>{
//         reject()
//       }
//       script.src= src
//       document.getElementsByTagName('body')[0].appendChild(script)
//     })
//   }

//   export default loadJs

import Vue from 'vue'
Vue.component('remote-script', {
  props: {
    src: {
      type: String,
      required: true
    }
  },
  render: function(createElement) {
    var self = this
    return createElement('script', {
      attrs: {
        type: 'text/javascript',
        src: this.src
      },
      on: {
        load: function(event) {
          self.$emit('load', event)
        },
        error: function(event) {
          self.$emit('error', event)
        },
        readystatechange: function(event) {
          if (this.readyState == 'complete') {
            self.$emit('load', event)
          }
        }
      }
    })
  }
  //   watch: {
  //     'src': {
  //       handler(val) {
  //         this.externalFun()
  //       },
  //       deep: true,
  //       immediate: true
  //     }
  //   },
})
