import { View, Text, Image, FlatList, Dimensions } from 'react-native'
import GS from '@styles/globalStyles'
import Swipe from '@components/nav/swipe'
import { useSelector } from 'react-redux'
import SHS from '@styles/shopStyles'
import { StoreItem } from '@type/screenTypes'
import Space from '@components/shared/utils'
import storeSections from './items'

/**
 * Parent ShopScreen component
 *
 * @param {navigation} Navigation Navigation route
 * @returns ShopScreen
 */
export default function ShopScreen(): JSX.Element {
    // Redux states
    const { theme } = useSelector((state: ReduxState) => state.theme)

    // Render function for store items
    const renderItem = ({ item }: { item: StoreItem }) => (
        <View style={{...SHS.itemContainer, backgroundColor: theme.contrast }}>
            <Image source={item.image} style={SHS.itemImage} />
            <Text style={{...SHS.itemName, color: theme.textColor}}>{item.name}</Text>
            <Text style={{...SHS.itemPrice, color: theme.textColor}}>
                {item.price}{' '}
                <Image 
                    source={require('@assets/shop/energy-drink.png')} 
                    style={SHS.currencyIcon} 
                />
            </Text>
        </View>
    )

    // Displays the ShopScreen UI
    return (
        <Swipe right="GameNav">
            <View style={{ ...GS.content, backgroundColor: theme.darker }}>
                <Space height={Dimensions.get("window").height / 8.1} /> 
                {storeSections.map((section) => (
                <View key={section.title} style={SHS.sectionContainer}>
                    <Text style={SHS.sectionTitle}>{section.title}</Text>
                    <FlatList
                        data={section.data}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                    />
                </View>
                ))}
            </View>
        </Swipe>
    )
}
