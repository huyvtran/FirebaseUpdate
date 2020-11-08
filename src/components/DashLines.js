import React from 'react'
import { View, StyleSheet } from 'react-native'
import AppColors from '../theme/AppColors';
import AppSizes from '../theme/AppSizes';



const DashLines = ({ width, height, dashGap, dashLength }) => {
    const n = Math.ceil(height / (dashGap + dashLength))

    let dash = []
    for (let i = 0; i < n; i++) {
        dash.push(
            <View
                key={i}
                style={[
                    { backgroundColor: AppColors.abi_blue, width: dashLength, height: dashLength, borderRadius: dashLength, marginBottom: dashGap },
                ]}
            />
        )
    }
    return (
        <View
            style={{ width: '100%', height: height, alignItems: 'center', paddingTop: AppSizes.paddingTiny }}
        >
            {dash}
        </View>
    )
}

export default DashLines