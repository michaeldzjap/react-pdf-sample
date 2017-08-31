import path from 'path';
import webpack from 'webpack';

export default {
    devtool: 'cheap-module-eval-source-map',
    entry: {
        bundle: './src/index',
        vendor: ['react', 'react-dom'],
        style: './sass/app'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: path.resolve(__dirname, 'node_modules'),
                options: {
                    cacheDirectory: true
                }
            },
            {
                test: /\.s?css$/,
                loaders: ['style-loader', 'css-loader', 'resolve-url-loader', 'sass-loader']
            }
        ]
    },
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'manifest']
        })
    ],
    resolve: {
        extensions: ['.js', '.jsx', '.scss']
    }
};
