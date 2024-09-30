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
                        console.log("Dispatching increaseMultiplier with value:", 1);
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
                // Add logic to grant the consumable or skin to the player
            } else {
                alert("Not enough coins to purchase this item.");
            }
        }
    }

    // Render function for store items
    function renderItem({ item }: { item: upgradeItem | consumableItem | skinItem }) {
        return (
            <View style={{ ...SHS.itemContainer, backgroundColor: theme.contrast }}>
                <Image source={item.image} style={SHS.itemImage} />
                <Text style={{ ...SHS.itemName, color: theme.textColor }}>{item.name}</Text>
                <Text style={{ ...SHS.itemPrice, color: theme.textColor }}>
                    {isUpgradeItem(item) && item.currentLevel < item.maxLevel
                        ? `Level ${item.currentLevel + 1} Cost: ${item.price[item.currentLevel] * (item.currentLevel + 1)}`
                        : 'Max Level Reached'}
                </Text>
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
                <Space height={Dimensions.get("window").height / 8.1} />
                <Text style={{ ...GS.title, color: theme.textColor }}>Coins: {coins}</Text>
                <Text style={{ ...GS.title, color: theme.textColor }}>Multiplier: {multiplier}</Text>
                <ScrollView>
                    {[...upgrades, ...consumables, ...skins].map((section) => (
                        <View key={section.title} style={SHS.sectionContainer}>
                            <Text style={{ ...SHS.sectionTitle, color: theme.textColor }}>{section.title}</Text>
                            <FlatList
                                scrollEnabled={false}
                                data={section.data}
                                renderItem={renderItem}
                                keyExtractor={(item) => item.id}
                                numColumns={2}
                            />
                        </View>
                    ))}
                </ScrollView>
            </View>
        </Swipe>
    );
}
