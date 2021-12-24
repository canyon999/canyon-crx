const path = require("path");
const CopyWebpackPlugin = require('copy-webpack-plugin')
module.exports = {
    entry: {
        background: './src/background/index.js',
        'content-scripts': './src/content-scripts/index.js',
        popup: './src/popup/index.js'
    },
    // output: {
    //     path: path.resolve(__dirname, './dist'),
    //     filename: "bundle.js"
    // },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: "src/copy/"
                },
            ],
        }),
    ]
};
