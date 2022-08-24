module.exports = {
    chainWebpack: config => {
        // 为生产环境修改配置...
        config.when(process.env.NODE_ENV === 'production', config => {
            config.entry('app').clear().add('./src/main-prod.js')
        })
        // 为开发环境修改配置...
        config.when(process.env.NODE_ENV === 'development', config => {
            config.entry('app').clear().add('./src/main-dev.js')
        })
    },
    transpileDependencies: true
}
