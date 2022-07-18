import axios from 'axios'
export default {
  methods: {
    getInstanceImage(instanceId) {
      axios.get(`${process.env.VUE_APP_HOST_URL}${process.env.VUE_APP_BASE_URL}/bpm/process/instanceImage/${instanceId}`, {
        responseType: 'arraybuffer',
        headers: {
          token: localStorage.getItem('token')
        }
      }).then(rt => {
        const img = new Image()
        img.src = 'data:image/png;base64,' + btoa(new Uint8Array(rt.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))
        const newWin = window.open('', '_blank')
        newWin.document.write(img.outerHTML)
        newWin.document.title = '流程图'
        newWin.document.close()
      })
    }
  }
}
