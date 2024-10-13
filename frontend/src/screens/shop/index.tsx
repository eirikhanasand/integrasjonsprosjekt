import GS from '@styles/globalStyles';
import Swipe from '@components/nav/swipe';
import { useSelector, useDispatch } from 'react-redux';
import SHS from '@styles/shopStyles';
import { consumableItem, skinItem, upgradeItem } from '@/interfaces';
import Space from '@components/shared/utils';
import { consumables, skins, upgrades } from './items';
import { removeCoins, increaseCoinMultiplier } from '../../redux/game';
import { ScrollView } from "react-native-gesture-handler";
import {
    View,
    Text,
    Image,
    FlatList,
    Dimensions,
    TouchableOpacity
} from 'react-native';

export default function ShopScreen(): JSX.Element {
    const dispatch = useDispatch();

    // Redux states
    const { theme } = useSelector((state: ReduxState) => state.theme);
    const { coins, multiplier } = useSelector((state: ReduxState) => state.game);

    // Type guard to check if item is upgradeItem
    function isUpgradeItem(item: upgradeItem | consumableItem | skinItem): item is upgradeItem {
        return item.type === 'upgradeItem';
    }

    // Function to handle item purchase or upgrade
    function handlePurchase(item: upgradeItem | consumableItem | skinItem) {
        if (isUpgradeItem(item)) {
            if (item.currentLevel < item.maxLevel) {
                const currentCost = item.price[item.currentLevel] * (item.currentLevel + 1);

                if (coins >= currentCost) {
                    // Deduct coins
                    dispatch(removeCoins(currentCost));
                    alert(`${item.name} upgraded to level ${item.currentLevel + 1}!`);

                    // Increase the upgrade level of the item
                    item.currentLevel += 1;

                    // Apply multiplier if it's a multiplier upgrade
                    if (item.name === 'Coin Multiplier') {
                        dispatch(increaseCoinMultiplier(1));
                    }
                } else {
                    alert("Not enough coins to upgrade this item.");
                }
            } else {
                alert("Maximum upgrade level reached.");
            }
        } else {
            // Handle consumables and skins
            const price = item.price[0];
            if (coins >= price) {
                dispatch(removeCoins(price));
                alert(`${item.name} purchased!`);
            } else {
                alert("Not enough coins to purchase this item.");
            }
        }
    }

    function renderItem({ item }: { item: upgradeItem | consumableItem | skinItem }) {
        const maxLevel = 5;  // Define the maximum level for upgrades
        let filledBlocks = 0;
        let emptyBlocks = maxLevel;
    
        // Only calculate the progress bar if the item is an upgradeItem
        if (isUpgradeItem(item)) {
            filledBlocks = item.currentLevel;  // Number of filled blocks based on current level
            emptyBlocks = maxLevel - filledBlocks;  // Remaining empty blocks
        }
    
        return (
            <View style={{ ...SHS.itemContainer, backgroundColor: theme.contrast }}>
                <Image source={item.image} style={SHS.itemImage} />
                <Text style={{ ...SHS.itemName, color: theme.textColor }}>{item.name}</Text>
                <Text style={{ ...SHS.itemPrice, color: theme.textColor }}>
                    {isUpgradeItem(item) && item.currentLevel < item.maxLevel
                        ? `Level ${item.currentLevel + 1} Cost: ${item.price[item.currentLevel] * (item.currentLevel + 1)}`
                        : 'Max Level Reached'}
                </Text>
    
                {/* Progress Bar */}
                {isUpgradeItem(item) && (
                    <View style={SHS.progressBarContainer}>
                        {/* Render filled blocks */}
                        {Array.from({ length: filledBlocks }).map((_, index) => (
                            <View key={`filled-${index}`} style={SHS.progressBlockFilled} />
                        ))}
                        {/* Render empty blocks */}
                        {Array.from({ length: emptyBlocks }).map((_, index) => (
                            <View key={`empty-${index}`} style={SHS.progressBlockEmpty} />
                        ))}
                    </View>
                )}
    
                <TouchableOpacity
                    onPress={() => handlePurchase(item)}
                    style={SHS.buyButton}
                    disabled={isUpgradeItem(item) && item.currentLevel >= item.maxLevel}
                >
                    <Text style={SHS.buyButtonText}>
                        {isUpgradeItem(item) && item.currentLevel < item.maxLevel ? 'Upgrade' : 'Buy'}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
    
    

    // Displays the ShopScreen UI
    return (
        <Swipe right="GameNav">
            <View style={{ ...GS.content, backgroundColor: theme.darker }}>
                {/* Top section for coins and multiplier */}
                <View style={SHS.statsContainer}>
                    <Text style={{ ...GS.title, color: theme.textColor }}>Coins: {coins}</Text>
                    <Text style={{ ...GS.title, color: theme.textColor }}>Multiplier: {multiplier}</Text>
                </View>

                <ScrollView>
                    <View style={SHS.shopContainer}>
                        {[...upgrades, ...consumables, ...skins].map((section) => (
                            <View key={section.title} style={SHS.sectionContainer}>
                                <Text style={{ ...SHS.sectionTitle, color: theme.textColor }}>{section.title}</Text>
                                <FlatList
                                    scrollEnabled={false}
                                    data={section.data}
                                    renderItem={renderItem}
                                    keyExtractor={(item) => item.id}
                                    numColumns={2}  // For two items per row
                                />
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </Swipe>
    );
}
