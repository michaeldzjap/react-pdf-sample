import path from 'path';
import CopyWebpackPlugin from 'copy-webpack-plugin';

export default {
    entry: {
        bundle: './src/index',
        vendor: ['prop-types', 'react', 'react-dom', 'react-pdf', 'react-window', 'throttle-debounce'],
        style: './sass/app',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: path.resolve(__dirname, 'node_modules'),
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                },
            },
            {
                test: /\.s?css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'resolve-url-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: './src/index.html', to: './' },
                { from: './src/test.pdf', to: './' },
            ],
        }),
    ],
    resolve: {
        extensions: ['.js', '.jsx', '.scss'],
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    chunks: 'initial',
                    name: 'vendor',
                    test: 'vendor',
                    enforce: true,
                },
            },
        },
        runtimeChunk: {
            name: 'manifest',
        },
        emitOnErrors: false,
    },
};
