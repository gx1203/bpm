<template>
<div class="avatar">
  <img :src="avatar" alt="">
</div>
</template>

<script>
import avatar from './images/avatar.png'
export default {
  data() {
    return {
      avatar: avatar
    }
  }
};
</script>

<style lang="scss" scoped>
.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    vertical-align: middle;
  }
}
</style>
