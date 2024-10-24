const path = require("path")
const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const appDirectory = path.resolve(__dirname)
const { presets, plugins } = require(`${appDirectory}/babel.config.js`)
const compileNodeModules = [
    // Add every react-native package that needs compiling
    'react-native-game-engine',
    'expo-three',
    'three',
    'expo-modules-core',
    '@react-three/fiber',
    '@react-three/drei',
    'react-native-gesture-handler',
    '@react-native/assets-registry'
].map((moduleName) => path.resolve(appDirectory, `node_modules/${moduleName}`))

const babelLoaderConfiguration = {
    // Handles .js, .jsx, .ts and .tsx files
    test: /\.[jt]sx?$/,
    // Add every directory that needs to be compiled by Babel during the build.
    include: [
         // Entry to your application
        path.resolve(__dirname, "index.web.js"),
        // Updated to .jsx
        path.resolve(__dirname, "App.tsx"),
        path.resolve(__dirname, "src"),
        path.resolve(__dirname, "component"),
        ...compileNodeModules,
    ],
    use: {
        loader: "babel-loader",
        options: {
            cacheDirectory: true,
            presets,
            plugins,
        },
    },
}

const svgLoaderConfiguration = {
    test: /\.svg$/,
    use: [
        {
            loader: "@svgr/webpack",
        },
    ],
}

const imageLoaderConfiguration = {
    test: /\.(gif|jpe?g|png|svg)$/,
    use: {
        loader: "url-loader",
        options: {
            name: "[name].[ext]",
        },
    },
}

const tsLoaderConfiguration = {
    test: /\.(ts)x?$/,
    exclude: /node_modules|\.d\.ts$/,
    use: {
        loader: 'ts-loader',
        options: {
            compilerOptions: {
                noEmit: false,
            },
        },
    },
}

const glbLoaderConfiguration = {
    test: /\.(glb|gltf)$/,
    use: {
        loader: 'file-loader',
        options: {
            outputPath: 'assets/models/',
            name: '[name].[ext]',
        },
    },
};

module.exports = {
    entry: {
        app: path.join(__dirname, "index.web.js"),
    },
    output: {
        path: path.resolve(appDirectory, "dist"),
        publicPath: "/",
        filename: "rnw.bundle.js",
    },
    resolve: {
        extensions: [".web.tsx", ".web.ts", ".tsx", ".ts", ".web.js", ".js"],
        alias: {
            "react-native$": "react-native-web",
        },
        fallback: {
            crypto: false,
        },
    },
    module: {
        rules: [
            babelLoaderConfiguration,
            imageLoaderConfiguration,
            svgLoaderConfiguration,
            tsLoaderConfiguration,
            glbLoaderConfiguration
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "index.html"),
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            __DEV__: JSON.stringify(true),
        }),
    ],
}
