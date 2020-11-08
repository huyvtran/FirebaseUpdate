import React, { Component } from 'react'
import { View } from 'react-native'
import AppSizes from '../../../../../theme/AppSizes';
// const PanelContainer = styled.View`
// flex-direction: row;
// justify-content: space-between;
// align-items: center;
// height: 40;
// border-radius: 2;
// backgroundColor: #5c91e2;
// marginBottom: 12;
// paddingHorizontal: 16;
// `;
const PanelContainer = ({ children }) => {
    return <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: AppSizes.paddingLarge * 2,
        borderRadius: AppSizes.paddingXTiny,
        backgroundColor: '#5c91e2',
        marginBottom: AppSizes.paddingXXMedium,
        paddingHorizontal: AppSizes.paddingMedium,
    }} >
        {children}
    </View>
}
export { PanelContainer };
