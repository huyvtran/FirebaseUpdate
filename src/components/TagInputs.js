import React, { Component } from 'react';
import {
    View, Text,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import AppStyles from '../theme/AppStyles';
import AppColors from '../theme/AppColors';
import { Icon } from 'react-native-elements';
import AppSizes from '../theme/AppSizes';

const styles = {
    containerTagView: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
        width: '100%',
        paddingVertical: AppSizes.paddingXSml,
        paddingHorizontal: AppSizes.paddingXSml,

    },
    textTileTagView: {
        ...AppStyles.regularText,
        fontSize: AppSizes.fontBase,

    },
    tagContainer: {
        padding: AppSizes.paddingTiny,
        backgroundColor: AppColors.abi_blue,
        borderRadius: AppSizes.paddingXXMedium,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: AppSizes.paddingTiny,
        paddingHorizontal: AppSizes.paddingXSml,
        flexDirection: 'row'
    },
    textTags: {
        ...AppStyles.regularText,
        color: 'white',
        marginRight: AppSizes.paddingTiny
    }
}
const TagItems = ({ content, onClose, index }) => {
    return <View style={styles.tagContainer}>
        <Text style={styles.textTags}>{content}</Text>
        {!!onClose && <TouchableOpacity onPress={() => onClose(content, index)}>
            <Icon name={'clear'} size={AppSizes.paddingXMedium} color={'white'} />
        </TouchableOpacity>}
    </View>
}

const TagView = ({ tagList, extractorValue, title, onClose }) => {
    const tagExtractorList = tagList.map(tag => {
        return extractorValue(tag)
    })

    return (<View style={styles.containerTagView}>
        <Text style={styles.textTileTagView}>{title}</Text>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal>
            {tagExtractorList.map((keyExtractor, index) => {
                return <TagItems content={keyExtractor} onClose={onClose && onClose} index={index} />
            })}
        </ScrollView>

    </View>
    );

}
export default TagView