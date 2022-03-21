module.exports = {
    publicPath: './',
    configureWebpack: {
        resolve: {
            alias: {
                'assets': '@/assets',
                'components': '@/components',
                'constants': '@/constants',
                'router': '@/router',
                'services': '@/services',
                'store': '@/store',
                'utils': '@/utils',
                'views': '@/views',
            }
        }
    },
}