// index.tsx (frontend/src/screens/shop/index.tsx)

import React from "react";
import { View, Text, Image, SectionList, TouchableOpacity } from "react-native";
import GS from "@styles/globalStyles";
import SHS from "@styles/shopStyles";
import Swipe from "@components/nav/swipe";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  purchaseConsumable,
  upgradeItem as upgradeItemAction,
  purchaseSkin,
} from "@/redux/game";
import {
  UpgradeItem,
  ConsumableItem,
  SkinItem,
  ShopItem,
} from "@/interfaces";
import { upgrades, consumables, skins } from "./items";

export default function ShopScreen(): JSX.Element {
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector((state) => state.theme);
  const {
    coins,
    consumables: consumablesState,
    upgrades: upgradesState,
    skins: skinsState,
  } = useAppSelector((state) => state.game);

  // Prepare sections for SectionList
  const sections = [
    {
      title: "Upgrades",
      data: upgrades[0]?.data ?? [],
    },
    {
      title: "Consumables",
      data: consumables[0]?.data ?? [],
    },
    {
      title: "Skins",
      data: skins[0]?.data ?? [],
    },
  ];

  // Type guards
  function isUpgradeItem(item: ShopItem): item is UpgradeItem {
    return item.type === "upgradeItem";
  }

  function isConsumableItem(item: ShopItem): item is ConsumableItem {
    return item.type === "consumableItem";
  }

  function isSkinItem(item: ShopItem): item is SkinItem {
    return item.type === "skinItem";
  }

  // Function to handle item purchase or upgrade
  function handlePurchase(item: ShopItem) {
    if (isConsumableItem(item)) {
      const price = item.price[0];
      if (coins >= price) {
        dispatch(purchaseConsumable({ id: item.id, price }));
      } else {
        alert("Not enough coins to purchase this item.");
      }
    } else if (isUpgradeItem(item)) {
      const upgradeState = upgradesState[item.id];
      const currentLevel = upgradeState?.currentLevel ?? 0;
      const price = item.price[currentLevel];
      if (coins >= price) {
        dispatch(upgradeItemAction({ id: item.id }));
      } else {
        alert("Not enough coins to upgrade this item.");
      }
    } else if (isSkinItem(item)) {
      const price = item.price[0];
      if (coins >= price && !skinsState[item.id]?.unlocked) {
        dispatch(purchaseSkin({ id: item.id, price }));
      } else if (skinsState[item.id]?.unlocked) {
        alert("Skin already owned.");
      } else {
        alert("Not enough coins to purchase this skin.");
      }
    }
  }

  function renderItem({
    item,
    index,
    section,
  }: {
    item: ShopItem;
    index: number;
    section: any;
  }) {
    if (!item) {
      console.warn(
        `Item at index ${index} in section ${section.title} is undefined.`
      );
      return null;
    }

    // Initialize variables
    let filledBlocks = 0;
    let emptyBlocks = 0;

    if (isUpgradeItem(item)) {
      const maxLevel = item.maxLevel;
      const upgradeState = upgradesState[item.id];
      const currentLevel = upgradeState?.currentLevel ?? 0;
      filledBlocks = currentLevel;
      emptyBlocks = maxLevel - filledBlocks;
    }

    return (
      <View style={[SHS.itemContainer, { backgroundColor: theme.contrast }]}>
        {item.image ? (
          <Image source={item.image} style={SHS.itemImage} />
        ) : (
          <Text>No Image</Text>
        )}
        <Text style={[SHS.itemName, { color: theme.textColor }]}>
          {item.name || "Unnamed Item"}
        </Text>

        {isConsumableItem(item) && (
          <Text style={{ color: theme.textColor }}>
            Quantity: {consumablesState[item.id]?.quantity ?? 0}
          </Text>
        )}

        {isUpgradeItem(item) && (
          <View style={SHS.progressBarContainer}>
            {Array.from({ length: filledBlocks }).map((_, index) => (
              <View key={`filled-${index}`} style={SHS.progressBlockFilled} />
            ))}
            {Array.from({ length: emptyBlocks }).map((_, index) => (
              <View key={`empty-${index}`} style={SHS.progressBlockEmpty} />
            ))}
          </View>
        )}

        <TouchableOpacity
          onPress={() => handlePurchase(item)}
          style={SHS.buyButton}
          disabled={
            (isUpgradeItem(item) &&
              upgradesState[item.id]?.currentLevel >= item.maxLevel) ||
            (isSkinItem(item) && skinsState[item.id]?.unlocked)
          }
        >
          <Text style={SHS.buyButtonText}>
            {isUpgradeItem(item) &&
            upgradesState[item.id]?.currentLevel < item.maxLevel
              ? `Upgrade (${item.price[upgradesState[item.id]?.currentLevel]} coins)`
              : isSkinItem(item) && skinsState[item.id]?.unlocked
              ? "Owned"
              : `Buy (${item.price[0]} coins)`}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function renderSectionHeader({
    section,
  }: {
    section: { title: string };
  }) {
    return (
      <Text style={{ ...SHS.sectionTitle, color: theme.textColor }}>
        {section.title}
      </Text>
    );
  }

  return (
    <Swipe right="GameNav">
      <View style={{ ...GS.content, backgroundColor: theme.darker }}>
        <View style={SHS.statsContainer}>
          <Text style={{ ...GS.title, fontSize: 24, color: "yellow" }}>
            Coins: {coins}
          </Text>
        </View>

        <SectionList
          sections={sections}
          renderSectionHeader={renderSectionHeader}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            item && item.id ? item.id : `key-${index}`
          }
          contentContainerStyle={SHS.shopContainer}
        />
      </View>
    </Swipe>
  );
}
