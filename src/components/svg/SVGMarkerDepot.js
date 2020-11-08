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

const SVGMarkerDepot = ({ color = AppColors.blueMarker }) => {
    return <Svg width={AppSizes.iconMapSize} height={AppSizes.iconMapSize} viewBox="0 0 48 48" >
        <Defs>
            <RadialGradient
                id="prefix__radial-gradient"
                cx={24}
                cy={338.55}
                r={20.18}
                gradientTransform="matrix(1 0 0 .16 0 -8.92)"
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
        <G
            style={{
                isolation: 'isolate',
            }}
        >
            <G id="prefix__Layer_1" data-name="Layer 1">
                <Circle
                    className="prefix__cls-2"
                    fill={'#fff'}
                    cx={24}
                    cy={15.37}
                    r={11.99}
                    transform="rotate(-7.21 24.05 15.379)"
                />
                <Path
                    d="M24 0a15.37 15.37 0 00-3.22 30.4c.81.18.77 1 .92 1.81L24 46l2.3-13.8c.16-.9.11-1.62.95-1.8A15.37 15.37 0 0024 0z"
                    fillRule="evenodd"
                    fill={color}
                />
                <Circle
                    className="prefix__cls-2"
                    fill={'#fff'}

                    cx={24}
                    cy={15.37}
                    r={11.99}
                    transform="rotate(-7.21 24.05 15.379)"
                />
                <Ellipse
                    cx={24}
                    cy={45}
                    rx={20.55}
                    ry={3}
                    fill="url(#prefix__radial-gradient)"
                    opacity={0.2}
                />
                <Path className="prefix__cls-6" d="M20.36 20.1h1.58v1.37h-1.58z" fill={color} />
                <Path
                    className="prefix__cls-6"
                    fill={color}
                    d="M19.74 13.07h8.94v8.73h2.51V11.06L24 7.8l-6.78 3.26V21.8h2.51zm0 0"
                />
                <Path
                    className="prefix__cls-6"
                    fill={color}
                    d="M22.3 20.1h1.59v1.37H22.3zM24.25 20.1h1.59v1.37h-1.59zM22.3 18.22h1.59v1.37H22.3zM20.36 18.22h1.58v1.37h-1.58zM24.25 18.22h1.59v1.37h-1.59zM22.3 16.35h1.59v1.37H22.3zM20.36 16.35h1.58v1.37h-1.58zM26.2 20.1h1.59v1.37H26.2z"
                />
            </G>
        </G>
    </Svg>
}

export default SVGMarkerDepot