// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path')

const isProduction = process.env.NODE_ENV === 'production'
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const config = {
    target: ['web', 'es5'],
    mode: isProduction ? 'production' : 'development',
    devtool: 'source-map',
    devServer: {
        open: true,
        host: 'localhost'
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css'
        })
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: { sourceMap: false }
                    }
                ]
            }
        ]
    }
}

const calendarConfig = {
    ...config,
    name: 'calendarConfig',
    entry: { Calendar: './src/calendar/main.js' },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
        library: '[name]',
        sourceMapFilename: 'Calendar.js.map'
    }
}

const stepsConfig = {
    ...config,
    name: 'stepsConfig',
    entry: { Steps: './src/steps/main.js' },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
        sourceMapFilename: 'Steps.js.map'
    }
}

module.exports = () => [calendarConfig, stepsConfig]
