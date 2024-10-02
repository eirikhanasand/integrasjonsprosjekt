import { useState } from "react"
import { Dimensions, Text, TouchableOpacity, View } from "react-native"
import { useSelector } from "react-redux"
import Trophy from "./trophy"
import { ScrollView, TouchableWithoutFeedback } from "react-native-gesture-handler"

export default function Leaderboard() {
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const [displayLeaderboard, setDisplayLeaderboard] = useState<boolean>(false)
    
    function handlePress() {
        setDisplayLeaderboard(!displayLeaderboard)
    }

    return (
        <>
            <View style={{ 
                width: 40, 
                height: 40, 
                top: 100, 
                right: 20, 
                position: 'absolute',
                borderRadius: 20,
            }}>
                <TouchableOpacity onPress={handlePress} activeOpacity={1} style={{
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    backgroundColor: theme.contrast, 
                    width: 40, 
                    height: 40,
                    borderRadius: 8,
                }}>
                    <Trophy color="none" style={{width: 30, height: 30, alignSelf: 'center'}} />
                </TouchableOpacity>
            </View>
            {displayLeaderboard && <List handlePress={handlePress} />}
        </>
    )
}

function List({handlePress}: {handlePress: () => void}) {
    const width = Dimensions.get('window').width
    const height = Dimensions.get('window').height
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const { lang } = useSelector((state: ReduxState) => state.lang)

    const gubber = [
        {name: 'eirik', score: 40000},
        {name: 'gubbe 2', score: 39000},
        {name: 'gubbe 3', score: 24000},
        {name: 'gubbe 4', score: 15000},
        {name: 'gubbe 5', score: 14000},
        {name: 'gubbe 6', score: 8000},
        {name: 'gubbe 7', score: 5000},
        {name: 'gubbe 8', score: 3000},
        {name: 'gubbe 9', score: 2000},
        {name: 'gubbe 10', score: 1000},
        {name: 'sindre', score: 1},
    ]
    return (
        <TouchableWithoutFeedback onPress={() => {console.log("pressed bru")}} style={{
            width, 
            height,
            alignSelf: 'center',
            backgroundColor: theme.transparentAndroid, 
            position: 'absolute', 
            zIndex: 100,
            borderRadius: 20,
        }}>
            {/* Header */}
            <View style={{
                width: width * 0.8, 
                height: height * 0.7, 
                alignSelf: 'center',
                backgroundColor: theme.contrast, 
                position: 'absolute', 
                zIndex: 100,
                borderRadius: 20,
                top: (height - height * 0.7) / 2,
            }}>
                {/* Header content */}
                <View style={{
                    width: '100%', 
                    height: 40, 
                    borderRadius: 12,
                    justifyContent: 'center'
                }}>
                    <Text style={{
                        textAlign: 'center', 
                        color: theme.textColor,
                        fontWeight: 'bold',
                        fontSize: 20
                    }}>
                        {lang ? 'Toppliste' : 'Leaderboard'}
                    </Text>
                    <TouchableOpacity
                        style={{position: 'absolute', right: 12, bottom: 10}}
                        onPress={handlePress}
                    >
                        <Text>❌</Text>
                    </TouchableOpacity>
                </View>
                {/* Body */}
                <ScrollView>
                    {gubber.map((gubbe, index) => {
                        return (
                            <ListView gubbe={gubbe} index={index} />
                        )
                    })}
                </ScrollView>
            </View>
        </TouchableWithoutFeedback>
    )
}

function ListView({gubbe, index}: {gubbe: any, index: number}) {
    const { theme } = useSelector((state: ReduxState) => state.theme)

    return (
        <View style={{
            backgroundColor: theme.dark,
            width: '95%', 
            height: 40, 
            alignSelf: 'center',
            justifyContent: 'space-between',
            margin: 5, 
            borderRadius: 4,
            flexDirection: 'row',
        }}>
            <LeftListView gubbe={gubbe} index={index} />
            <View style={{flexDirection: 'row', marginVertical: 'auto'}}>
                <Text style={{
                    color: 'white', 
                    fontSize: 18, 
                    fontWeight: 'bold', 
                    marginRight: 5,
                    marginVertical: 'auto'
                }}>{gubbe.score}
                </Text>
                <Trophy color="none" style={{width: 28, height: 28}} />
            </View>
        </View>
    )
}

function LeftListView({gubbe, index}: {gubbe: any, index: number}) {
    const { theme } = useSelector((state: ReduxState) => state.theme)
    return (
        <View style={{flexDirection: 'row'}}>
            <View style={{
                backgroundColor: theme.contrast,
                width: 30,
                height: 30,
                borderRadius: 8,
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                left: 5,
                marginRight: 5
            }}>
                <Text style={{
                    color: 'white',
                    fontSize: 18,
                    fontWeight: 'bold',
                }}>
                    {index + 1}
                </Text>
            </View>
            <Text style={{
                color: 'white', 
                fontSize: 18, 
                fontWeight: 'bold', 
                marginLeft: 5,
                marginVertical: 'auto'
            }}>
                {gubbe.name}
            </Text>
        </View>
    )
}