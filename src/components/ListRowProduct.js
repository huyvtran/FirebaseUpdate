import React from 'react';
import { Text } from 'react-native'
import { TouchableOpacity } from 'react-native'
import AppSizes from '../theme/AppSizes';
import AppStyles from '../theme/AppStyles';


const ListRowProduct = ({ i1, i2, i3, onPress }) => (
    <TouchableOpacity style={styles.rowContainer} onPress={onPress}>
        <Text style={styles.H1}>{i1}</Text>
        <Text style={styles.H2}>{i2}</Text>
        <Text style={styles.H3}>{i3}</Text>
    </TouchableOpacity>
);

const styles = {
    rowContainer: {
        backgroundColor: 'white',
        paddingLeft: '5%',
        marginVertical: AppSizes.paddingXSml
    },
    H1: {
        ...AppStyles.regularText,
        fontSize: AppSizes.fontBase,
        fontWeight: '500'
    },
    H2: {
        ...AppStyles.regularText,
        fontSize: AppSizes.fontSmall,
        fontWeight: '400',
        marginVertical: 3,
    },
    H3: {
        ...AppStyles.regularText,
        fontSize: AppSizes.fontSmall,
        opacity: 0.85
    }

}

export { ListRowProduct };
