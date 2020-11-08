import React, { Component } from 'react';
import { Text } from 'react-native';

import Svg, {
    Circle,
    Ellipse,
    G,
    Path,
    Defs,
    RadialGradient,
    Stop,
} from 'react-native-svg';
import AppSizes from '../../theme/AppSizes';
import AppColors from '../../theme/AppColors';

const SVGMarkerIndex = ({ color = AppColors.blueMarker, content = "." }) => {
    return <Svg width={50} height={50} viewBox="0 0 48 48" >
        <Defs>
            <RadialGradient
                id="prefix__a"
                cx={24}
                cy={-758.97}
                r={20.18}
                gradientTransform="matrix(1 0 0 .16 0 165.87)"
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset={0} />
                <Stop offset={0} />
                <Stop offset={0.03} />
                <Stop offset={0.05} stopColor="#0b0b0b" />
                <Stop offset={0.12} stopColor="#3e3e3e" />
                <Stop offset={0.2} stopColor="#6c6c6c" />
                <Stop offset={0.28} stopColor="#939393" />
                <Stop offset={0.36} stopColor="#b5b5b5" />
                <Stop offset={0.46} stopColor="#d0d0d0" />
                <Stop offset={0.55} stopColor="#e5e5e5" />
                <Stop offset={0.66} stopColor="#f4f4f4" />
                <Stop offset={0.8} stopColor="#fcfcfc" />
                <Stop offset={1} stopColor="#fff" />
            </RadialGradient>
        </Defs>
        <G data-name="Layer 1">
            <Path
                d="M24 0a15.37 15.37 0 00-3.22 30.4c.81.18.77 1 .92 1.81L24 46l2.3-13.8c.16-.9.11-1.62.95-1.8A15.37 15.37 0 0024 0z"
                fillRule="evenodd"
                fill={color}
            />
            <Circle
                cx={24}
                cy={15.37}
                r={11.99}
                transform="rotate(-7.21 24.05 15.379)"
                fill="#fff"
            />
            <Text style={{
                color: color,
                fontSize: AppSizes.fontBase,
                fontWeight: '700',
                height: '100%',
                width: '100%',
                textAlign: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: 7,

            }}>{content}</Text>
            <Ellipse
                cx={24}
                cy={45}
                rx={20.55}
                ry={3}
                fill="url(#prefix__a)"
                opacity={0.2}
            />
        </G>
    </Svg>
}

export default SVGMarkerIndex