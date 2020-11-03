module.exports = {
  productionSourceMap: false,
  lintOnSave: false,
  devServer: {
    port:8020,
    proxy: {   //  解决 跨域问题   配置后台服务器地址
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
}
