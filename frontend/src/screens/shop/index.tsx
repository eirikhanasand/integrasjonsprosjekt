import GS from "@styles/globalStyles"
import SHS from "@styles/shopStyles"
import Swipe from "@components/nav/swipe"
import {
    purchaseConsumable,
    upgradeItem,
    purchaseSkin,
} from "@/redux/game"
import { useDispatch, useSelector } from "react-redux"
import { Dispatch, UnknownAction } from "redux"
import { 
    View, 
    Text, 
    Image, 
    TouchableOpacity, 
    ImageSourcePropType, 
    ScrollView,
    Dimensions
} from "react-native"
import { 
    consumables as gameConsumables,
    skins as gameSkins, 
    upgrades as gameUpgrades 
} from "./items"
import Space from "@components/shared/utils"
import { useEffect } from "react"
import { Navigation } from "@/interfaces"
import { useNavigation } from "@react-navigation/native"
import { Coin } from "@components/game/inGame/coins"

type HandlePurchaseProps = {
    item: ShopItem
    dispatch: Dispatch<UnknownAction>
    coins: number
    upgrades: OwnedUpgrade[]
    skins: number[] 
}

type RenderItemProps = {
    item: ShopItem
    index: number
}

export default function ShopScreen(): JSX.Element {
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const { coins } = useSelector((state: ReduxState) => state.game)
    const navigation: Navigation = useNavigation()

    // Defines the coin header
    function CoinHeader() {
        return (
            <Text style={{color: theme.textColor, right: 30, fontSize: 18, fontWeight: 'bold'}}>
                {coins}
                <View>
                    <Coin style={{
                        position: 'absolute',
                        width: 18, 
                        height: 18, 
                        backgroundColor: 'yellow',
                        borderRadius: 20,
                        right: -22,
                        bottom: -1
                    }} />
                </View>
            </Text>
        )
    }

    // Sets the coin header
    useEffect(()=>{
        navigation.setOptions({
            headerComponents: {
                right: [<CoinHeader />]
            }} as any)   
    }, [navigation, coins])
    

    return (
        <Swipe right="GameNav">
            <View style={{ ...GS.content, backgroundColor: theme.darker }}>
                <Space height={Dimensions.get("window").height / 9} /> 
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Section title={gameUpgrades[0].title} items={gameUpgrades[0].data} />
                    <Section title={gameConsumables[0].title} items={gameConsumables[0].data} />
                    <Section title={gameSkins[0].title} items={gameSkins[0].data} />
                    <Space height={Dimensions.get("window").height / 6.2} /> 
                </ScrollView>
            </View>
        </Swipe>
    );
}

function Item({ item, index }: RenderItemProps) {
    const dispatch = useDispatch()
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const { consumables, upgrades, skins, coins } = useSelector((state: ReduxState) => state.game)
    const ownedItem = upgrades.find((a) => a.id === item.id) || { level: 0 }
    console.log(ownedItem)
    if (!item) {
        console.warn(
            `Item at index ${index} is undefined.`
        )
        return null
    }

    // Initialize variables
    let filledBlocks = 0
    let emptyBlocks = 0

    if (isUpgradeItem(item)) {
        filledBlocks = ownedItem.level
        emptyBlocks = item.maxLevel - ownedItem.level;
    }

    return (
        <View style={[SHS.itemContainer, { backgroundColor: theme.contrast }]}>
            <ImageGuard image={item.image} />
            <Text style={[SHS.itemName, { color: theme.textColor }]}>
                {item.name || "Unnamed Item"}
            </Text>

            {isConsumableItem(item) &&
                <Text style={{ color: theme.textColor }}>
                    Quantity: {consumables[item.id]?.quantity ?? 0}
                </Text>
            }
            
            {isUpgradeItem(item) && 
                <View style={SHS.progressBarContainer}>
                    {Array.from({ length: filledBlocks }).map((_, index) =>
                        <View key={index} style={{...SHS.progressBlockFilled, backgroundColor: theme.green}} />
                    )}
                    {Array.from({ length: emptyBlocks }).map((_, index) =>
                        <View key={index} style={{...SHS.progressBlockEmpty, backgroundColor: theme.textColor}} />
                    )}
                </View>
            }

            <TouchableOpacity
                onPress={() => handlePurchase({item, dispatch, coins, upgrades, skins })}
                style={{...SHS.buyButton, backgroundColor: theme.green}}
                disabled={
                    (isUpgradeItem(item) &&
                    upgrades[item.id]?.level >= item.maxLevel) ||
                    (isSkinItem(item) && skins.includes(item.id))
                }
            >
                <Text style={SHS.buyButtonText}>
                    {isUpgradeItem(item) &&
                        ownedItem.level < item.maxLevel
                        ? `${item.price[upgrades.find((upgrade) => upgrade.id === item.id)?.level || 0]}`
                        : isSkinItem(item) && skins.includes(item.id)
                            ? "Owned"
                            : `Buy (${item.price[0]} coins)`
                    }
                    <View style={{paddingLeft: 5, top: 5}}>
                    <Coin style={{height: 15, width: 15, backgroundColor: 'yellow', borderRadius: 20}} />
                    </View>
                </Text>
            </TouchableOpacity>
        </View>
    );
}

// Function to handle item purchase or upgrade
function handlePurchase({ item, dispatch, coins, upgrades, skins }: HandlePurchaseProps) {
    if (isConsumableItem(item)) {
        const price = item.price[0];

        if (coins >= price) {
            dispatch(purchaseConsumable({ id: item.id, price }));
        } else {
            alert("Not enough coins to purchase this item.");
        }
    } else if (isUpgradeItem(item)) {
        const upgradeState = upgrades[item.id];
        const currentLevel = upgradeState?.level ?? 0;
        const price = item.price[currentLevel];
        if (coins >= price) {
            dispatch(upgradeItem({ id: item.id }));
        } else {
            alert("Not enough coins to upgrade this item.");
        }
    } else if (isSkinItem(item)) {
        const price = item.price[0];

        if (coins >= price && !skins.includes(item.id)) {
            dispatch(purchaseSkin({ id: item.id, price }));
        } else if (skins.includes(item.id)) {
            alert("Skin already owned.");
        } else {
            alert("Not enough coins to purchase this skin.");
        }
    }
}

// Type guards
function isUpgradeItem(item: ShopItem): item is Upgrade {
    return item.type === "Upgrade"
}

function isConsumableItem(item: ShopItem): item is Consumable {
    return item.type === "Consumable"
}

function isSkinItem(item: ShopItem): item is Skin {
    return item.type === "Skin"
}

function ImageGuard({image}: {image: ImageSourcePropType}) {
    if (!image) {
        return <Text>No Image</Text>
    }

    return <Image source={image} style={SHS.itemImage} />
}

// Section with title and items
function Section({title, items}: {title: string, items: ShopItem[]}) {
    const { theme } = useSelector((state: ReduxState) => state.theme)

    return (
        <>
            <Text style={{color: theme.textColor, fontSize: 24, fontWeight: 'bold'}}>
                {title}
            </Text>
            <View style={{ display: "flex", flexDirection: 'row', flexWrap: 'wrap' }}>
                {items.map((item, index) => (
                    <View key={item.id} style={{ width: '50%' }}>
                        <Item item={item} index={index} />
                    </View>
                ))}
            </View>
        </>
    )
}