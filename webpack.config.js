// Generated using webpack-cli https://github.com/webpack/webpack-cli
const path = require('path')

const webpack = require('webpack')

const isProduction = process.env.NODE_ENV === 'production'
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

const config = {
    target: ['web', 'es5'],
    mode: isProduction ? 'production' : 'development',
    devtool: 'source-map',
    devServer: {
        open: true,
        host: 'localhost'
    },
    plugins: [
        new LodashModuleReplacementPlugin(),
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
        library: 'Calendar'
    }
}

const bookingConfig = {
    ...config,
    name: 'bookingConfig',
    entry: { Booking: './src/booking-slider/main.js' },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js'
    }
}

const stepPostalCode = {
    ...config,
    name: 'stepPostalCode',
    entry: { StepPostalCode: './src/booking-flow/packages/postalCode.js' },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        clean: true
    }
}

module.exports = () => [calendarConfig, bookingConfig, stepPostalCode]
