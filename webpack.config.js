import path from 'path';
import pkg from './package.json';

export default {
    mode: 'development',
    entry: {
        bundle: './src/index',
        vendor: [
            'prop-types',
            'react',
            'react-dom',
            'react-pdf',
            'react-window',
            'throttle-debounce',
        ],
        style: './sass/app'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        devtoolModuleFilenameTemplate: 'webpack:///[absolute-resource-path]'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: path.resolve(__dirname, 'node_modules'),
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true
                }
            },
            {
                test: /\.s?css$/,
                loaders: [
                    'style-loader',
                    'css-loader',
                    'resolve-url-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.scss']
    },
    devtool: 'cheap-module-eval-source-map',
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    chunks: 'initial',
                    name: 'vendor',
                    test: 'vendor',
                    enforce: true
                }
            }
        },
        runtimeChunk: {
            name: 'manifest'
        },
        noEmitOnErrors: true
    }
};
