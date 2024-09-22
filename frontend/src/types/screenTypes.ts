import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native"
import { StackScreenProps } from "@react-navigation/stack"
declare global {
    namespace ReactNavigation {
      interface RootParamList extends TabBarParamList {}
    }
}

export type TabBarProps<T extends keyof TabBarParamList> =
BottomTabScreenProps<TabBarParamList, T>

export type ShopStackParamList = {
    ShopScreen: undefined

    // Example on how to pass props to a screen
    // ExampleScreen: {name: string}
}

export type ShopScreenProps<T extends keyof ShopStackParamList> = 
    CompositeScreenProps<
        StackScreenProps<ShopStackParamList, T>,
        BottomTabScreenProps<TabBarParamList>
    >

export type GameStackParamList = {
    GameScreen: undefined;
    PauseScreen: { score: number; onResume: () => void; setInGame: (inGame: boolean) => void; };
};

export type GameScreenProps<T extends keyof GameStackParamList> =
    CompositeScreenProps<
        StackScreenProps<GameStackParamList, T>,
        BottomTabScreenProps<TabBarParamList>
    >

export type MenuRoutes = "SettingScreen"

    export type ItemProps = {
    id: number
    nav: MenuRoutes
    title: string
}

export type MenuProps<T extends keyof MenuStackParamList> = 
StackScreenProps<MenuStackParamList, T>

export type MenuStackParamList = {
    SettingScreen: undefined
}

export type TabBarParamList = {
    ShopNav: NavigatorScreenParams<ShopStackParamList>
    GameNav: NavigatorScreenParams<GameStackParamList>
    MenuNav: NavigatorScreenParams<MenuStackParamList>
}

export type RootStackParamList = {
    Tabs: NavigatorScreenParams<TabBarParamList>
    NotificationModal: {title: string, body: string, data: any}
}

export type RootStackProps<T extends keyof RootStackParamList> =
    CompositeScreenProps<StackScreenProps<RootStackParamList, T>,
    BottomTabScreenProps<TabBarParamList>>