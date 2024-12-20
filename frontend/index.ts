import registerRootComponent from 'expo/build/launch/registerRootComponent'
import App from './src/App'
import polyfills from '@utils/polyfills'

// registerRootComponent calls AppRegistry.registerComponent("main", () => App)
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately

registerRootComponent(App)

polyfills()
