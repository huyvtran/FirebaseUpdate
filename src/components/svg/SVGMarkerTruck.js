import React from 'react'
import Svg, {
    Defs,
    RadialGradient,
    Stop,
    ClipPath,
    Path,
    G,
    Circle,
    Ellipse,
} from 'react-native-svg'
import AppSizes from '../../theme/AppSizes';
import AppColors from '../../theme/AppColors';
/* SVGR has dropped some elements not supported by react-native-svg: style, title */

const SvgMarkerTruck = () => (
    <Svg width={AppSizes.iconMapSize} height={AppSizes.iconMapSize} viewBox="0 0 48 48" >
        <Defs>
            <RadialGradient
                id="prefix__radial-gradient"
                cx={24}
                cy={-422.99}
                r={20.18}
                gradientTransform="matrix(1 0 0 .16 0 112.37)"
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
            <ClipPath id="prefix__clip-path">
                <Path fill="none" d="M13.07 7.41h23v16.17h-23z" />
            </ClipPath>
        </Defs>
        <G
            style={{
                isolation: 'isolate',
            }}
        >
            <G id="prefix__Layer_1" data-name="Layer 1">
                <Circle
                    className="prefix__cls-3"
                    fill={AppColors.white}

                    cx={24}
                    cy={15.37}
                    r={11.99}
                    transform="rotate(-7.21 24.05 15.379)"
                />
                <Path
                    d="M24 0a15.37 15.37 0 00-3.22 30.4c.81.18.77 1 .92 1.81L24 46l2.3-13.8c.16-.9.11-1.62.95-1.8A15.37 15.37 0 0024 0z"
                    fill="#2b4d88"
                    fillRule="evenodd"
                />
                <Ellipse
                    cx={24}
                    cy={45}
                    rx={20.55}
                    ry={3}
                    fill="url(#prefix__radial-gradient)"
                    opacity={0.2}
                />
                <G clipPath="url(#prefix__clip-path)">
                    <Path
                        className="prefix__cls-3"
                        fill={AppColors.white}
                        d="M13.87 18.18V8.4a1 1 0 011-1h9.79a1 1 0 011 1v9.78a.33.33 0 01-.33.33H14.2a.32.32 0 01-.33-.33zm7.9 3.36a2 2 0 11-2-2.05 2 2 0 012 2.05zm-1 0a1 1 0 10-1 1 1 1 0 001-1zM18 19.49h-4.61a.33.33 0 00-.33.33v1a.33.33 0 00.33.33h3.67a2.7 2.7 0 01.94-1.66zm14.49 2.05a2 2 0 11-2.05-2.05 2 2 0 012.05 2.05zm-1 0a1 1 0 00-2 0 1 1 0 002 0zm4.64-1.72v1a.33.33 0 01-.33.33h-2.72a2.7 2.7 0 00-5.34 0h-5.35a2.65 2.65 0 00-.91-1.66h5.08V10.1a.65.65 0 01.66-.65h3.09a2.61 2.61 0 012.18 1.16l2 3a2.68 2.68 0 01.45 1.39v4.46h.8a.33.33 0 01.33.33zm-3.33-6.18l-1.6-2.27a.32.32 0 00-.27-.14h-2.55a.33.33 0 00-.33.33v2.27a.33.33 0 00.33.33h4.09a.33.33 0 00.27-.52zm0 0"
                    />
                </G>
            </G>
        </G>
    </Svg>
)

export default SvgMarkerTruck
