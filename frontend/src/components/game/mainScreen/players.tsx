import { Dimensions, Text, TouchableOpacity, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { useSelector } from "react-redux"

export default function Players() {
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const height = Dimensions.get('window').height
    
    function handlePress() {
        console.log("Clicked invite button (unimplemented)")
        // send invite
    }

    return (
        <View style={{ 
            width: 140, 
            height: 200,
            top: height * 0.2,
            backgroundColor: 'red',
            left: 20, 
            position: 'absolute',
            borderRadius: 20,
        }}>
            <ScrollView style={{backgroundColor: 'yellow', marginBottom: 50, borderTopLeftRadius: 20, borderTopRightRadius: 20}}>
                <Text>gubbe 1</Text>
                <Text>gubbe 2</Text>
                <Text>gubbe 3</Text>
                <Text>gubbe 4</Text>
                <Text>gubbe 5</Text>
                <Text>gubbe 6</Text>
                <Text>gubbe 7</Text>
                <Text>gubbe 8</Text>
                <Text>gubbe 9</Text>
                <Text>gubbe 10</Text>
            </ScrollView>
            <TouchableOpacity onPress={handlePress} activeOpacity={1} style={{
                justifyContent: 'center',
                alignSelf: 'center',
                bottom: 10,
                position: 'absolute',
                backgroundColor: theme.contrast, 
                width: 120, 
                height: 30,
                borderRadius: 8,
            }}>
                <Text style={{color: theme.textColor, textAlign: 'center', fontWeight: 'bold'}}>
                    Invite
                </Text>
            </TouchableOpacity>
        </View>
    )
}