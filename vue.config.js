module.exports = {
    publicPath: process.env.NODE_ENV==='development'?'./':'http://static.smctask.cn/wxj/',
    devServer: {
        proxy: {
            '/api': {
                target: 'http://119.23.208.65:8092/',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
};
