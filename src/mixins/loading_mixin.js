export default {
  data() {
    return {
      MLoading: false
    }
  },

  methods: {
    MLoad(promise, loadingKey = 'MLoading') {
      this.$set(this, loadingKey, true)

      return promise.then(data => {
        this.$set(this, loadingKey, false)
        if (data.code !== 0) {
          return [new Error(data.message)]
        }
        return [null, data]
      }).catch(err => {
        this.$set(this, loadingKey, false)
        return [err]
      })
    }
  }
}
