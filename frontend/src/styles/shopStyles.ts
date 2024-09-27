import { StyleSheet } from 'react-native';

const SS =  StyleSheet.create({
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
    },
    itemPrice: {
        fontSize: 14,
    },
    currencyIcon: {
        width: 16,
        height: 16,
    },
    });

export default SS;
