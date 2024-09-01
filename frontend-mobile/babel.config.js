module.exports = function(api) {
    api.cache(true)

    return {
        presets: [
            'babel-preset-expo',
            "@babel/preset-env",
            "@babel/preset-react",
            "@babel/preset-typescript",
        ],
        plugins: [
            [
                "@babel/plugin-proposal-class-properties",
                { "loose": true }
            ],
            [
                "@babel/plugin-transform-private-methods",
                { "loose": true }
            ],
            [
                "@babel/plugin-transform-private-property-in-object",
                { "loose": true }
            ],
            "@babel/plugin-transform-runtime",
            'react-native-reanimated/plugin',
            ["module-resolver", {
                "alias": {
                    "@components": "./src/components",
                    "@themes": "./src/styles/themes",
                    "@assets": "./public/assets",
                    "@text": "./public/text",
                    "@screens": "./src/screens",
                    "@utils": "./src/utils",
                    "@shared": "./src/shared",
                    "@styles": "./src/styles",
                    "@redux": "./src/redux",
                    "@nav": "./src/components/nav",
                    "@": "./src/",
                }
            }],
            ["babel-plugin-inline-import", {
              "extensions": [".svg"]
            }]
        ],
    }
}