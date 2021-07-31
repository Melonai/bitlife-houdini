const path = require("path");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
    mode: "development",
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "bundle.js",
    },
    devServer: {
        port: 9000,
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                ],
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.html$/i,
                loader: "html-loader",
            }
        ],
    },
    plugins: [
        new WasmPackPlugin({
            crateDirectory: path.resolve(__dirname, "../wasm"),
            outDir: path.resolve(__dirname, "../wasm/pkg"),
            forceMode: "production"
        }),
        new HtmlWebpackPlugin({template: "./assets/index.html"}),
        new CleanWebpackPlugin(),
    ],
    resolve: {
        extensions: ['.ts', '.js'],
    },
    experiments: {
        asyncWebAssembly: true,
    },
};