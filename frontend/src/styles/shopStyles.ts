import { StyleSheet } from 'react-native';

const shopStyles = (theme: any) => StyleSheet.create({
  sectionContainer: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#fff',
  },
  itemContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 10,
    margin: 5,
    alignItems: 'center',
    borderRadius: 8,
  },
  itemImage: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 16,
    color: '#333',
  },
  itemPrice: {
    fontSize: 14,
    color: '#333',
  },
  currencyIcon: {
    width: 16,
    height: 16,
  },
});

export default shopStyles;
