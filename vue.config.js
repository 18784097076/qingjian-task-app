module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://zh.etymx.tk:8082/',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}
