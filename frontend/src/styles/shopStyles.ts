import { StyleSheet } from 'react-native';

const SHS = StyleSheet.create({
    // Container for the stats section at the top
    statsContainer: {
        justifyContent: 'space-between',
        padding: 10,
        borderRadius: 10,
        margin: 10,
    },
    // Wrapper for the entire shop content
    shopContainer: {
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    sectionContainer: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        paddingLeft: 10,
    },
    itemContainer: {
        paddingVertical: 25,
        margin: 5,
        borderRadius: 10,
        alignItems: 'center',
    },
    itemImage: {
        width: 50,
        height: 50,
        marginBottom: 10,
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemPrice: {
        fontSize: 14,
        color: '#888',
        marginVertical: 5,
    },
    buyButton: {
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        width: '80%'
    },
    buyButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    // Container for the progress bar
    progressBarContainer: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 5,
    },
    // Style for filled blocks in the progress bar
    progressBlockFilled: {
        width: 15,
        height: 10,
        marginRight: 2,
        borderRadius: 2,
    },
    // Style for empty blocks in the progress bar
    progressBlockEmpty: {
        width: 15,
        height: 10,
        marginRight: 2,
        borderRadius: 2,
    },
});

export default SHS;
