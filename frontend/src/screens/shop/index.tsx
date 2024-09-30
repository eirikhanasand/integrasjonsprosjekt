import GS from '@styles/globalStyles'
import Swipe from '@components/nav/swipe'
import { useSelector, useDispatch } from 'react-redux'
import SHS from '@styles/shopStyles'
import { consumableItem, skinItem, upgradeItem } from '@/interfaces'
import Space from '@components/shared/utils'
import { consumables, skins, upgrades } from './items'
import { removeCoins, increaseCoinMultiplier } from '../../redux/game'
import { ScrollView } from "react-native-gesture-handler"
import { 
    View, 
    Text, 
    Image, 
    FlatList, 
    Dimensions, 
    TouchableOpacity 
} from 'react-native'

export default function ShopScreen(): JSX.Element {
    const dispatch = useDispatch()

    // Redux states
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const { coins, multiplier } = useSelector((state: ReduxState) => state.game)

    // Function to handle item purchase or upgrade
    const handlePurchase = (item: upgradeItem | consumableItem | skinItem) => {
        if (item.currentLevel < item.maxLevel) {
            const currentCost = item.price[item.currentLevel] * (item.currentLevel + 1)

            if (coins >= currentCost) {
                // Deduct coins
                dispatch(removeCoins(currentCost))
                alert(`${item.name} upgraded to level ${item.currentLevel + 1}!`)

                // Increase the upgrade level of the item
                item.currentLevel += 1

                // Apply multiplier if it's a multiplier upgrade
                if (item.name === 'Coin Multiplier') {
                    console.log("Dispatching increaseMultiplier with value:", 1)
                    dispatch(increaseCoinMultiplier(1))
                }

            } else {
                alert("Not enough coins to upgrade this item.")
            }
        } else {
            alert("Maximum upgrade level reached.")
        }
    }

    // Render function for store items
    const renderItem = ({ item }: { item: upgradeItem | consumableItem | skinItem }) => (
        <View style={{ ...SHS.itemContainer, backgroundColor: theme.contrast }}>
            <Image source={item.image} style={SHS.itemImage} />
            <Text style={{ ...SHS.itemName, color: theme.textColor }}>{item.name}</Text>
            <Text style={{ ...SHS.itemPrice, color: theme.textColor }}>
                {item.currentLevel < item.maxLevel ? `Level ${item.currentLevel + 1} Cost: ${item.price[0] * (item.currentLevel + 1)}` : 'Max Level Reached'}{' '}
                <Image 
                    source={require('@assets/shop/energy-drink.png')} 
                    style={SHS.currencyIcon} 
                />
            </Text>
            <TouchableOpacity
                onPress={() => handlePurchase(item)}
                style={SHS.buyButton}
                disabled={item.currentLevel >= item.maxLevel} // Disable button if max level is reached
            >
                <Text style={SHS.buyButtonText}>{item.currentLevel < item.maxLevel ? 'Upgrade' : 'Maxed Out'}</Text>
            </TouchableOpacity>
        </View>
    );

    // Displays the ShopScreen UI
    return (
        <Swipe right="GameNav">
            <View style={{ ...GS.content, backgroundColor: theme.darker }}>
                <Space height={Dimensions.get("window").height / 8.1} />
                <Text style={{ ...GS.title, color: theme.textColor }}>Coins: {coins}</Text>
                <Text style={{ ...GS.title, color: theme.textColor }}>Multiplier: {multiplier}</Text>
                <ScrollView>
                    {upgrades.map((section) => (
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
                    {consumables.map((section) => (
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
                    {skins.map((section) => (
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
    )
}
