<!--公用组件：图片上传
/**
* 按钮组件
* @desc 图片上传
* @author zhangyuting
* @date 2019.06.12
    https://github.com/xyxiao001/vue-cropper
* @安装依赖  npm install vue-cropper    // 图片进行裁剪
* @param {String} []
    {
       disabled: false, // true 启用，false禁用
        img: '', // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 0.8, // 裁剪生成图片的质量
        outputType: 'jpeg', // 裁剪生成图片的格式
        canScale: false, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 10, // 默认生成截图框宽度
        autoCropHeight: 20, // 默认生成截图框高度
        fixedBox: true, // 固定截图框大小 不允许改变
        fixed: false, // 是否开启截图框宽高固定比例
        fixedNumber: [7, 5], // 截图框的宽高比例
        full: true, // 是否输出原图比例的截图
        canMoveBox: false, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: false, // 截图框是否被限制在图片里面
        infoTrue: true // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
    }
* @问题--》》截图后重新上传用的调接口的方法，未验证
    参考--https://www.jianshu.com/p/6a77430023f1
* @其他ui组件解决方案 https://shnhz.github.io/shn-ui/#/component/uploadimg

* @example 调用示例
    <poral-imgupload 
    :options = 'croper'
    />
*/
-->