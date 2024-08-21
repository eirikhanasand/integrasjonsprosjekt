import { ExpoConfig, ConfigContext } from '@expo/config'

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: 'Speedrun',
    slug: 'Speedrun',
});
