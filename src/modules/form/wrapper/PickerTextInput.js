import React, { Component, useState, useEffect, useLayoutEffect } from 'react';
import { Modal, View, FlatList, TouchableOpacity, Text, ActivityIndicator, TextInput, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import { addForm } from "../actions/creater/form";
import AppColors from '../../../theme/AppColors';
import API from '../../../network/API';
import { Actions } from 'react-native-router-flux';
import { Localize } from '../../setting/languages/LanguageManager';
import messages from '../../../constant/Messages';
import InputField from '../../../components/InputField';
import AppSizes from '../../../theme/AppSizes';
import _ from 'lodash'
import AppStyles from '../../../theme/AppStyles';

const PickerTextInput = (props) => {
    /**************************************************** HOOK *************************************** */
    const getTextResultDefault = () => {
        if (!props || !props.defaultValues || !props.defaultValues[0] || _.isEmpty(props.defaultValues[0].value)) {
            return ''
        }
        return props.defaultValues[0].value
    }

    const [textResult, setTextResult] = useState(getTextResultDefault())

    const [stateData, setStateData] = useState({
        loading: true,
        dataSource: []
    })

    useEffect(() => {
        console.log("PickerTextInput >>", textResult)
        const data = [
            {
                value: textResult,
                label: textResult,
            }
        ]
        props.addForm(props, data)
    }, [textResult])

    useEffect(() => {
        fetchDataPicker()
    }, [])

    /**************************************************** LOGIC CONTROL *************************************** */




    const fetchDataPicker = async (text = '') => {

        const { orgSelect } = props
        if (_.isEmpty(props.data.url) || !orgSelect || !orgSelect[0] || !orgSelect[0].parentId) {
            return;
        }


        const body = {
            date: new Date(),
            organizationId: orgSelect[0].parentId._id ? orgSelect[0].parentId._id : '',
            currentPage: 1,
            pageLimit: 200,
            searchInput: text,
            attachedVehicleId: false,
            orderBy: { createdAt: -1 }
        }

        const res = await API.callApiPost(props.data.url, body)
        if (res && res.data && res.data.data) {
            const resListData = res.data.data
            const dataSource = resListData.map(resItem => {
                const template = !_.isEmpty(props.template) ? props.template : '_id'
                return resItem[template]

            })
            setStateData({
                loading: false,
                dataSource
            })
        }

    }

    /**************************************************** UI CONTROL *************************************** */

    const getTitle = () => {
        if (props.validate.required) {
            return props.label + ' (*)'
        }
        return props.label
    }

    const onClickChooseList = () => {
        Actions.selectPicker({ data: stateData.dataSource, callback: (dataSelected) => onSelectCallback(dataSelected) })
    }

    const onSelectCallback = (dataSelect) => {
        setTextResult(dataSelect)
    }

    /**************************************************** UI RENDER *************************************** */

    const renderContentSelected = () => {
        return <TextInput
            style={styles.textInput}
            keyboardShouldPersistTaps='always'
            underlineColorAndroid="transparent"
            ref={props.key}
            numberOfLines={1}
            placeholder={props.placeholder}
            value={textResult}
            returnKeyType="next"
            onChangeText={(text) => setTextResult(text)}
        />
    }

    return (<View style={styles.container}>
        <InputField
            title={getTitle()}
            noLocalize
            renderContent={renderContentSelected()}
        />
        <TouchableOpacity onPress={() => onClickChooseList()}>
            <Text style={styles.selectText}>{Localize(messages.chooseFromList)}</Text>

        </TouchableOpacity>

    </View>)
}


const styles = {
    container: {
        paddingHorizontal: AppSizes.paddingMedium
    },

    textInput: {
        ...AppStyles.regularText,
        fontSize: AppSizes.fontXXMedium,
        color: '#1B64B0',
        fontWeight: '400',
        opacity: 0.87,
        borderRadius: AppSizes.paddingXTiny,
        padding: AppSizes.paddingTiny,

        color: AppColors.textColor,
        fontSize: AppSizes.fontBase,
        height: AppSizes.paddingLarge * 2,
        overflow: 'hidden',

    },


    selectText: {
        ...AppStyles.regularText,
        color: '#646464',
        fontWeight: '500',
        marginTop: AppSizes.paddingMedium,
        marginBottom: AppSizes.paddingMedium,
    }
}

export default connect((state, ownProps) => ({
    orgSelect: state.org.orgSelect
}), { addForm })(PickerTextInput);
