import { StyleSheet } from 'react-native';

const SHS = StyleSheet.create({
    // Container for the stats section at the top
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#2a2a2a',
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
        backgroundColor: '#f5f5f5',
        padding: 15,
        margin: 5,
        borderRadius: 10,
        alignItems: 'center',
        width: '45%',  // Ensures two items per row
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
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    buyButtonText: {
        color: '#fff',
        fontWeight: 'bold',
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
        backgroundColor: '#4CAF50',  // Green for filled blocks
        marginRight: 2,
        borderRadius: 2,
    },
    // Style for empty blocks in the progress bar
    progressBlockEmpty: {
        width: 15,
        height: 10,
        backgroundColor: '#ddd',  // Light gray for empty blocks
        marginRight: 2,
        borderRadius: 2,
    },
});

export default SHS;
