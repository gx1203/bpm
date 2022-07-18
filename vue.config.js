// const TerserPlugin = require('terser-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const chalk = require('chalk')
const HappyPack = require('happypack')
const os = require('os')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })
const path = require('path')

// const webpack = require('webpack')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: './', // 部署应用时的根路径(默认'/'),也可用相对路径(存在使用限制)
  outputDir: 'dist', // 输出目录，打包时生成的生产环境构建文件的目录(默认''dist''，构建之前会被清除)
  assetsDir: 'static', // 放置生成的静态资源(js、css、img、fonts)的(相对于 outputDir 的)目录(默认'')
  indexPath: 'index.html', // 指定生成的 index.html 的输出路径(相对于 outputDir)也可以是一个绝对路径。
  filenameHashing: true,
  runtimeCompiler: true,
  // lintOnSave: process.env.NODE_ENV !== 'production', // 是否在保存的时候检查
  lintOnSave: false, // 是否在保存的时候检查
  css: {
    // extract: true, , //是否启用css分离插件，默认是true，如果不启用css样式分离插件，打包出来的css是通过内联样式的方式注入至dom中的
    sourceMap: false, // 关闭 CSS source maps
    loaderOptions: {
      // 向 CSS 相关的 loader 传递选项
      sass: {
        // 这里的选项会传递给sass-loader
        prependData: `@import "~@/assets/styles/variable.scss";`
      }
    } // css预设器配置项
  },
  productionSourceMap: false, // 把这个改为false。不然在最终打包的文件中会出现一些映射map文件，map文件的作用在于：项目打包后，代码都是经过压缩加密的，如果运行时报错，输出的错误信息无法准确得知是哪里的代码报错。有了map就可以像未加密的代码一样，准确的输出是哪一行哪一列有错。
  devServer: {
    // 配置开发服务器
    host: '0.0.0.0', // 0.0.0.0
    port: 80, // 端口
    hot: true, // 是否启用热加载，就是每次更新代码，是否需要重新刷新浏览器才能看到新代码效果
    open: true, // //是否自动打开浏览器默认为false
    proxy: {
      // 配置多个代理(配置一个 proxy: 'http://localhost:4000' )
      '/api': {
        target: 'http://jiucaiyunbpm.jiucaiyun.cn',
        pathRewrite: { '^/api': '' },
        changeOrigin: true
      },
      '^/jcydev1': {
        target: 'http://test2.jiucaiyun.cn', // 接口的域名
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        pathRewrite: { '^/jcydev1': 'bpabpmdev1api' }
      },
      '^/jcydev2': {
        target: 'http://test2.jiucaiyun.cn', // 接口的域名
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        pathRewrite: { '^/jcydev2': 'bpabpmdev2api' }
      },
      // '^/jcydev3': {
      //   target: 'http://test2.jiucaiyun.cn', // 接口的域名
      //   changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
      //   pathRewrite: { '^/jcydev3': 'bpabpmdev3api' }
      // },
      // 开发
      '^/jcydev3': {
        target: 'http://huawei5.jiucaiyun.cn/', // 接口的域名
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        pathRewrite: { '^/jcydev3': 'sbpmtestapi' }
      },
      // 测试
      // '^/jcydev3': {
      //   target: 'http://huawei5.jiucaiyun.cn/', // 接口的域名
      //   changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
      //   pathRewrite: { '^/jcydev3': 'sbpmtestapi' }
      // },
      // 生产
      // '^/jcydev3': {
      //   target: 'http://huawei5.jiucaiyun.cn/', // 接口的域名
      //   changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
      //   pathRewrite: { '^/jcydev3': 'sbpmapi' }
      // },
      '^/jcydev4': {
        target: 'http://test2.jiucaiyun.cn', // 接口的域名
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        pathRewrite: { '^/jcydev4': 'bpabpmdev4api' }
      },
      '^/bpabpmapi': {
        target: 'http://127.0.0.1:8089/', // 接口的域名
        changeOrigin: true // 如果接口跨域，需要进行这个参数配置

      }
    }
  },
  // 对内部的 webpack 配置进行更细粒度的修改
  chainWebpack: config => {
    // // 禁用fork-ts-checker
    // config.plugins.delete('fork-ts-checker')
    // 移除 prefetch 插件
    config.plugins.delete('prefetch')
    // 移除 preload 插件
    config.plugins.delete('preload')
    // 压缩代码
    config.when(process.env.NODE_ENV === 'production', config => {
      config.optimization.minimize(true)
    })
    // 分割代码
    config.optimization.splitChunks({
      chunks: 'all',
      minSize: 20000,
      minChunks: 1,
      // maxAsyncRequests: 30,
      // maxInitialRequests: 30,
      // enforceSizeThreshold: 50000,
      cacheGroups: {
        elementUI: {
          name: 'chunk-elementUI', // split elementUI into a single package
          priority: 10, // the weight needs to be larger than libs and app or it will be packaged into libs or app
          enforce: true,
          test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
        },
        basCompoment: {
          name: 'chunk-basCompoment', // split elementUI into a single package
          priority: 9, // the weight needs to be larger than libs and app or it will be packaged into libs or app
          enforce: true,
          test: /[\\/]node_modules[\\/]_?bas-component(.*)/ // in order to adapt to cnpm
        },
        libs: {
          name: 'chunk-libs',
          test: /[\\/]node_modules[\\/]/,
          priority: 8,
          enforce: true,
          chunks: 'initial' // only package third parties that are initially dependent
        },
        common: {
          name: 'common',
          chunks: 'initial',
          minChunks: 2,
          priority: 8,
          enforce: true
        },
        // app:{
        //   name: 'app',
        //   chunks: 'initial',
        //   reuseExistingChunk: true
        // }
        bas: {
          name: 'chunk-bas',
          test: resolve('src/bas'), // can customize your rules
          priority: 7,
          enforce: true
        }
        // bpa: {
        //   name: 'chunk-bpa',
        //   test: resolve('src/bpa'), // can customize your rules
        //   priority: 6,
        // },
        // bpm: {
        //   name: 'chunk-bpm',
        //   test: resolve('src/bpm'), // can customize your rules
        //   priority: 5,
        //   reuseExistingChunk: true
        // }
        // bas: {
        //   name: 'chunk-bas',
        //   test: resolve('src/bas'), // can customize your rules

        //   priority: 10,
        //   reuseExistingChunk: true
        // },

        // bpm: {
        //   name: 'chunk-bpm',
        //   test: resolve('src/bpm'), // can customize your rules
        //   priority: 10,
        //   reuseExistingChunk: true
        // }
      }
    })
    config.optimization.runtimeChunk('single')

    const jsRule = config.module.rule('js')
    jsRule.uses.clear()
    jsRule
      .use('happypack/loader?id=babel')
      .loader('happypack/loader?id=babel')
      .end()
    // 压缩图片
    config.module
      .rule('images')
      .use('image-webpack-loader')
      .loader('image-webpack-loader')
      .options({
        bypassOnDebug: true
      })
      .end()
  },
  transpileDependencies: ['element-ui', 'webpack-dev-server'],
  // 调整 webpack 配置
  configureWebpack: {
    optimization: {
      // minimize: false
      // 生产环境去除console
      // minimizer: [
      //   new TerserPlugin({
      //     terserOptions: {
      //       compress: {
      //         warnings: false,
      //         drop_console: true,
      //         drop_debugger: true,
      //         pure_funcs: ['console.log']
      //       }
      //     }
      //   })
      // ]
    },
    // 性能
    performance: {
      // entrypoint size limit: The following entrypoint(s) combined asset size exceeds the recommended limit (244 KiB). This can impact web performance.
      // npm run build: WARNING in asset size limit: The following asset(s) exceed the recommended size limit
      // 错误原因，资源(asset)和入口起点超过指定文件限制，需要在 vue.config.js 文件内做如下配置
      // 1、关闭 webpack 的性能提示
      // hints: false,
      // 2、警告 webpack 的性能提示
      hints: 'warning',
      // 入口起点的最大体积 整数类型（以字节为单位）
      maxEntrypointSize: 50000000,
      // 生成文件的最大体积 整数类型（以字节为单位 300k）
      maxAssetSize: 30000000,
      // 只给出 js 文件的性能提示
      assetFilter: function (assetFilename) {
        return assetFilename.endsWith('.js')
      }
    },
    plugins: [
      new HappyPack({
        id: 'babel',
        loaders: ['babel-loader?cacheDirectory=true'],
        threadPool: happyThreadPool
      }),
      new ProgressBarPlugin({
        format:
          ' build [:bar] ' +
          chalk.green.bold(':percent') +
          ' (:elapsed seconds)',
        clear: true
      })
      // new webpack.optimize.LimitChunkCountPlugin({
      //   maxChunks: 20,
      //   minChunkSize: 1000
      // })
    ]
  },
  pluginOptions: {
    // 第三方插件配置
    // ...
  }
}
