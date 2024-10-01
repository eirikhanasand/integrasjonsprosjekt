import { StyleProp, View, ViewStyle } from "react-native"
import { Svg, Path } from "react-native-svg"

export default function SettingsIcon({style, color}: {style?: StyleProp<ViewStyle>, color: string}) {
    return (
        <View style={style}>
            <Svg viewBox="0 0 100.25 100.25">
                <Path fill={color} d="M50,30.5c-10.201,0-18.5,8.299-18.5,18.5S39.799,67.5,50,67.5S68.5,59.201,68.5,49S60.201,30.5,50,30.5z M50,64.5
		c-8.547,0-15.5-6.953-15.5-15.5S41.453,33.5,50,33.5S65.5,40.453,65.5,49S58.547,64.5,50,64.5z"/>
                <Path fill={color} d="M95.225,41.501L83.257,39.69c-0.658-2.218-1.547-4.372-2.651-6.425l7.176-9.733c0.44-0.597,0.378-1.426-0.146-1.951
                    l-9.216-9.215c-0.525-0.524-1.354-0.587-1.951-0.147l-9.702,7.152c-2.062-1.12-4.23-2.022-6.466-2.691L58.5,4.776
                    C58.389,4.042,57.759,3.5,57.017,3.5H43.985c-0.742,0-1.372,0.542-1.483,1.276L40.701,16.68c-2.236,0.669-4.404,1.572-6.466,2.691
                    l-9.702-7.152c-0.597-0.44-1.426-0.378-1.951,0.147l-9.215,9.215c-0.524,0.524-0.587,1.354-0.147,1.951l7.176,9.733
                    c-1.104,2.053-1.993,4.207-2.651,6.425L5.777,41.501c-0.734,0.111-1.276,0.741-1.276,1.483v13.032c0,0.742,0.542,1.372,1.275,1.483
                    l12.027,1.82c0.665,2.194,1.552,4.319,2.647,6.341l-7.231,9.808c-0.44,0.597-0.377,1.426,0.147,1.951l9.215,9.215
                    c0.524,0.525,1.354,0.587,1.951,0.147l9.84-7.254c2.012,1.08,4.124,1.954,6.3,2.607l1.829,12.09
                    c0.111,0.734,0.741,1.276,1.483,1.276h13.032c0.742,0,1.372-0.542,1.483-1.276l1.829-12.09c2.176-0.653,4.288-1.527,6.3-2.607
                    l9.84,7.254c0.597,0.44,1.426,0.377,1.951-0.147l9.216-9.215c0.524-0.524,0.587-1.354,0.146-1.951L80.55,65.66
                    c1.096-2.022,1.983-4.147,2.647-6.341l12.027-1.82c0.733-0.111,1.275-0.741,1.275-1.483V42.984
                    C96.5,42.243,95.958,41.612,95.225,41.501z M93.5,54.726l-11.703,1.771c-0.588,0.089-1.068,0.517-1.224,1.09
                    c-0.704,2.595-1.748,5.095-3.103,7.432c-0.3,0.517-0.265,1.162,0.09,1.643l7.04,9.549l-7.391,7.391l-9.578-7.061
                    c-0.48-0.353-1.122-0.39-1.637-0.093c-2.331,1.339-4.818,2.369-7.395,3.06c-0.575,0.155-1.005,0.635-1.094,1.225l-1.78,11.769
                    H45.273l-1.78-11.769c-0.089-0.589-0.519-1.07-1.094-1.225c-2.577-0.691-5.064-1.721-7.395-3.06
                    c-0.515-0.296-1.158-0.259-1.637,0.093l-9.578,7.061l-7.391-7.391l7.04-9.549c0.354-0.481,0.39-1.126,0.09-1.643
                    c-1.355-2.336-2.399-4.837-3.103-7.432c-0.156-0.574-0.636-1.001-1.224-1.09L7.498,54.726V44.274l11.65-1.762
                    c0.591-0.089,1.073-0.521,1.226-1.099c0.693-2.616,1.735-5.144,3.099-7.514c0.297-0.516,0.26-1.159-0.093-1.638l-6.982-9.471
                    l7.391-7.391l9.443,6.961c0.481,0.354,1.126,0.39,1.644,0.089c2.375-1.38,4.916-2.437,7.55-3.142
                    c0.576-0.154,1.006-0.635,1.095-1.225l1.752-11.583h10.452l1.752,11.583c0.089,0.59,0.519,1.071,1.095,1.225
                    c2.634,0.705,5.174,1.762,7.55,3.142c0.517,0.302,1.162,0.265,1.644-0.089l9.443-6.961L84.6,22.79l-6.982,9.471
                    c-0.353,0.479-0.39,1.122-0.093,1.638c1.363,2.37,2.406,4.898,3.099,7.514c0.153,0.578,0.635,1.009,1.226,1.099l11.65,1.762
                    L93.5,54.726L93.5,54.726z"/>
            </Svg>
        </View>
    )
}
