import React from 'react'
import Svg, { Path } from 'react-native-svg'

const LinkIcon = ({ size = 24, color = 'black' }) => {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
            <Path
                d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zm8.2 0c0 1.71-1.39 3.1-3.1 3.1H5v1.9h4c2.76 0 5-2.24 5-5s-2.24-5-5-5H5V7h4c1.71 0 3.1 1.39 3.1 3.1zm8-4h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"
                fill={color}
            />
        </Svg>
    )
}
export default LinkIcon;