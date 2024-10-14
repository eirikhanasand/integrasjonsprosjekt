// interfaces.ts

import { ImageSourcePropType } from "react-native";
import { ParamListBase, CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native";
import type { BottomTabNavigationOptions, BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { Dispatch, ReactNode, SetStateAction } from "react";
import type { StackHeaderProps, StackNavigationOptions, StackScreenProps } from "@react-navigation/stack";
import {
  Animated,
  DimensionValue,
  StyleProp,
  ViewStyle,
} from "react-native";
import {
  BottomTabHeaderProps,
  BottomTabNavigationProp,
} from "@react-navigation/bottom-tabs/lib/typescript/src/types";

// **Navigation Types**

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

export interface MoveProps<T> {
  setState: Dispatch<SetStateAction<T>>;
  value: AnimatedValue;
  opposite: T;
  state: T;
}

export interface AnimatedValue extends Animated.Value {
  __getValue: () => number;
  __setValue: (newValue: number) => void;
}

export type TabBarProps<T extends keyof TabBarParamList> = BottomTabScreenProps<
  TabBarParamList,
  T
>;

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

// **Game-related Types**

// Upgrade Item Type
export type UpgradeItem = {
  id: string;
  name: string;
  type: "upgradeItem";
  price: number[];
  image: ImageSourcePropType;
  maxLevel: number;
};

// Consumable Item Type
export type ConsumableItem = {
  id: string;
  name: string;
  type: "consumableItem";
  price: number[];
  image: ImageSourcePropType;
};

// Skin Item Type
export type SkinItem = {
  id: string;
  name: string;
  type: "skinItem";
  price: number[];
  image: ImageSourcePropType;
};

// Shop Item Union Type
export type ShopItem = UpgradeItem | ConsumableItem | SkinItem;

// Game State Interface
export interface GameState {
  coins: number;
  startTime: number;
  inGame: boolean;
  alive: boolean;
  score: number;
  gameId: string | null;
  highscore: number;
  multiplier: number;
  coinMultiplier: number;
  consumables: { [id: string]: { quantity: number } };
  upgrades: { [id: string]: { currentLevel: number } };
  skins: { [id: string]: { unlocked: boolean } };
}

// RootState Interface
export interface RootState {
  game: GameState;
  theme: any; // Replace 'any' with your actual ThemeState type
  user: any; // Replace 'any' with your actual user state type
  // Add other slices if necessary
}
