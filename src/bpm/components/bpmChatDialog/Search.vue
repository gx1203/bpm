<template>
  <div class="chat-search">
    <div class="header">
<!--      <el-input class="search-input" v-model="search" prefix-icon="el-icon-search" placeholder="搜索" />-->
			<i class="el-icon-plus add-icon" @click="organieationShow = true" />
    </div>
		<bas-organieation
			v-model="organieationShow"
			:selected-element="selectedElement"
			:is-specified-group-but="false"
			:multiple="false"
			:is-show-bustom-groups-but="false"
			:select-element="selectElement"
			:show-element="showElement"
			:title="orgtitle"
			:isShowPost="true"
			@fnCallBack="fnBasOrganieationCallBack"
		/>
  </div>
</template>
<script>
import {
  saveTalk
} from '@/bpm/api/bpmHome/bpmChat'
export default {
  data() {
    return {
      search: '',
      organieationShow: false,
      selectedElement: {},
      showElement: [],
      selectElement: ['9'],
      orgtitle: '选择具体人'
		}
  },
	methods: {
    fnBasOrganieationCallBack(data) {
      saveTalk({
        bpmTalkUserList: [
					{
            userName: data.name && data.name.split('-').length > 1 ? data.name.split('-')[0] : '',
            userId: data.id,
            postId:	data.idType && data.idType.split('-').length > 2 ? data.idType.split('-')[2] : '',
            postName:	data.name && data.name.split('-').length > 1 ? data.name.split('-')[1] : ''
					}
				]
      }).then(rt => {
        if (rt.status === '200') {
          this.organieationShow = false
					this.$emit('confirm', rt.data)
        }
      })
    }
	}
};
</script>

<style lang="scss" scoped>
.chat-search {
	height: 55px;
  padding: 12px;
	box-sizing: border-box;
	.header {
		overflow: hidden;
	}
  .search-input {
		float: left;
		width: calc(100% - 30px);
		/deep/ input  {
			height: 30px;
			line-height: 30px;
			font-size: 12px;
			border: none;
			outline: none;
			color: #333333;
			background-color: #D4D6D9;
		}
		::placeholder, /deep/ .el-input__prefix {
			color: #333 !important;
		}
  }
	.add-icon {
		float: right;
		line-height: 30px;
		width: 30px;
		text-align: center;
		font-size: 16px;
		cursor: pointer;
	}
}
</style>
