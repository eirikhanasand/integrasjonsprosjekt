import React from 'react';
import { View, Text, Image, FlatList } from 'react-native';
import GS from '@styles/globalStyles';
import Swipe from '@components/nav/swipe';
import { useSelector } from 'react-redux';
import shopStyles from '@styles/shopStyles';
import { StoreItem } from '@type/screenTypes';

// Sample data for the store items
const storeSections = [
  {
    title: 'Upgrades',
    data: [
      { id: '1', name: 'Bag upgrade', price: 200, image: require('@assets/shop/school-bag.png') },
      { id: '2', name: 'Coin multiplier', price: 200, image: require('@assets/shop/calculator.png') },
    ],
  },
  {
    title: 'Consumables',
    data: [
      { id: '3', name: 'Start boost', price: 200, image: require('@assets/shop/coffee-cup.png') },
      { id: '4', name: 'Electric Scooter', price: 200, image: require('@assets/shop/electric-scooter.png') },
    ],
  },
  {
    title: 'Skins',
    data: [
      { id: '5', name: 'Skin 1', price: 200, image: require('@assets/shop/boy.png') },
      { id: '6', name: 'Skin 2', price: 200, image: require('@assets/shop/boy.png') },
    ],
  },
];

/**
 * Parent ShopScreen component
 *
 * @param {navigation} Navigation Navigation route
 * @returns ShopScreen
 */
export default function ShopScreen(): JSX.Element {
  // Redux states
  const { theme } = useSelector((state: ReduxState) => state.theme);

  // Render function for store items
  const renderItem = ({ item }: { item: StoreItem }) => (
    <View style={styles(theme).itemContainer}>
      <Image source={item.image} style={styles(theme).itemImage} />
      <Text style={styles(theme).itemName}>{item.name}</Text>
      <Text style={styles(theme).itemPrice}>
        {item.price}{' '}
        <Image source={require('@assets/shop/energy-drink.png')} style={styles(theme).currencyIcon} />
      </Text>
    </View>
  );

  // Displays the ShopScreen UI
  return (
    <Swipe right="GameNav">
      <View style={{ ...GS.content, backgroundColor: theme.darker }}>
        {storeSections.map((section) => (
          <View key={section.title} style={styles(theme).sectionContainer}>
            <Text style={styles(theme).sectionTitle}>{section.title}</Text>
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
  );
}

// Import styles dynamically
const styles = shopStyles;
