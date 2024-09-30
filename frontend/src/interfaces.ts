import { ParamListBase } from "@react-navigation/native";
import type { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { Dispatch, ReactNode, SetStateAction } from "react";
import type { StackHeaderProps, StackNavigationOptions } from "@react-navigation/stack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import {
    Animated,
    DimensionValue,
    ImageSourcePropType,
    StyleProp,
    ViewStyle,
} from "react-native";
import {
    BottomTabHeaderProps,
    BottomTabNavigationProp,
} from "@react-navigation/bottom-tabs/lib/typescript/src/types";

declare global {
    namespace ReactNavigation {
        interface RootParamList extends TabBarParamList {}
    }
}

export interface ExtendedBottomTabHeaderProps
    extends Omit<BottomTabHeaderProps, "options"> {
    options: ExtendedRouteOptions;
}

export interface ExtendedRouteOptions
    extends Omit<BottomTabNavigationOptions, "header"> {
    focusedIcon: ImageSourcePropType;
    icon: ImageSourcePropType;
    themeIcon?: ImageSourcePropType;

    header?: (props: ExtendedBottomTabHeaderProps) => ReactNode;
}

export interface ScreenProps {
    navigation: Navigation;
}

export type Navigation = BottomTabNavigationProp<ParamListBase, string, string>;

export interface StackProps extends ExtendedRouteOptions {
    name: string;
    component: React.FC<any>;
}

export interface ClusterProps extends React.PropsWithChildren<{}> {
    noColor?: boolean;
    marginVertical?: DimensionValue;
    marginHorizontal?: DimensionValue;
    highlight?: boolean;
    style?: StyleProp<ViewStyle>;
}

export type NotificationScreenProps = {
    back: string;
    navigation: Navigation;
};

export interface HeaderProps extends Omit<StackHeaderProps, "options"> {
    options: StackRouteOptions & {
        headerComponents?: {
            bottom?: JSX.Element[];
            right?: JSX.Element[];
            left?: JSX.Element[];
        };
    };
}

export interface StackRouteOptions
    extends Omit<StackNavigationOptions, "header"> {
    header?: (props: HeaderProps) => React.ReactNode;
}

export interface MoveProps<T extends Direction> {
    setState: Dispatch<SetStateAction<T>>;
    value: AnimatedValue;
    opposite: Direction;
    state: Direction;
}

export interface AnimatedValue extends Animated.Value {
    __getValue: () => number;
    __setValue: (newValue: number) => void;
}

export type TabBarProps<T extends keyof TabBarParamList> =
    BottomTabScreenProps<TabBarParamList, T>;

export type ShopStackParamList = {
    ShopScreen: undefined;
};

export type ShopScreenProps<T extends keyof ShopStackParamList> = CompositeScreenProps<
    StackScreenProps<ShopStackParamList, T>,
    BottomTabScreenProps<TabBarParamList>
>;

export type GameStackParamList = {
    GameScreen: undefined;
    PauseScreen: {
        score: number;
        onResume: () => void;
    };
};

export type GameScreenProps<T extends keyof GameStackParamList> = CompositeScreenProps<
    StackScreenProps<GameStackParamList, T>,
    BottomTabScreenProps<TabBarParamList>
>;

export type MenuRoutes = "SettingScreen";

export type ItemProps = {
    id: number;
    nav: MenuRoutes;
    title: string;
};

export type MenuProps<T extends keyof MenuStackParamList> = StackScreenProps<
    MenuStackParamList,
    T
>;

export type MenuStackParamList = {
    SettingScreen: undefined;
};

export type LoginStackParamList = {
    LoginScreen: undefined;
};

export type TabBarParamList = {
    ShopNav: NavigatorScreenParams<ShopStackParamList>;
    GameNav: NavigatorScreenParams<GameStackParamList>;
    MenuNav: NavigatorScreenParams<MenuStackParamList>;
    LoginNav: NavigatorScreenParams<LoginStackParamList>;
};

export type RootStackParamList = {
    Tabs: NavigatorScreenParams<TabBarParamList>;
    NotificationModal: { title: string; body: string; data: any };
};

export type RootStackProps<T extends keyof RootStackParamList> = CompositeScreenProps<
    StackScreenProps<RootStackParamList, T>,
    BottomTabScreenProps<TabBarParamList>
>;

// Updated item types with the type property
export type upgradeItem = {
    id: string;
    name: string;
    type: "upgradeItem"; // Added type property to identify the item type
    price: number[];
    image: ImageSourcePropType;
    currentLevel: number;
    maxLevel: number;
};

export type consumableItem = {
    id: string;
    name: string;
    type: "consumableItem"; // Added type property to identify the item type
    price: number[];
    image: ImageSourcePropType;
};

export type skinItem = {
    id: string;
    name: string;
    type: "skinItem"; // Added type property to identify the item type
    price: number[];
    image: ImageSourcePropType;
};
