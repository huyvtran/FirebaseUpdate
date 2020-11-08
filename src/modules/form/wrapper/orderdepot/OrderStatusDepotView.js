import React, { Component, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { addForm } from "../../actions/creater/form";
import { CheckBox } from 'react-native-elements'
import AppStyles from '../../../../theme/AppStyles';
import AppSizes from '../../../../theme/AppSizes';
import messages from '../../../../constant/Messages';
import { Localize } from '../../../setting/languages/LanguageManager';
import { Actions } from 'react-native-router-flux';
import OrderInfo from '../../../../constant/OrderInfo';
import Panel from '../Panel';

const OrderStatusDepotView = (props) => {
    /******************************************************STATE CONTROL ********************************************* */
    const [status, setStatus] = useState(props.defaultValues && props.defaultValues[0] ? props.defaultValues[0].status : false)
    const [reason, setReason] = useState("")

    useEffect(() => {
        let data = props.defaultValues
        if (!data || !data[0]) {
            return
        }
        data[0].status = status
        data[0].reason = reason
        props.addForm(props, data);

    }, [status, reason])

    useEffect(() => {
        let { data } = props.properties
        if (!data || !data[0]) {
            return
        }
        data[0].status = OrderInfo.ORDER_STATUS.COMPLETED
        props.addForm(props, data);

    }, [])

    /******************************************************UI CONTROL ********************************************* */

    const callBackSelectReason = (itemSelected) => {
        setReason(itemSelected)
    }

    const onClickSelectReason = () => {
        Actions.selectReason({ callback: callBackSelectReason, selected: reason })
    }
    /******************************************************UI RENDER ********************************************* */

    return (
        <Panel title={props.label} >
            <View style={styles.container} >
                <CheckBox
                    left
                    title={Localize(messages.agree)}
                    checked={status == OrderInfo.ORDER_STATUS.COMPLETED}
                    onPress={() => { setStatus(OrderInfo.ORDER_STATUS.COMPLETED) }}
                    textStyle={styles.titleCheckbox}
                    containerStyle={styles.containerCheckbox}
                    checkedIcon='check-circle'
                    uncheckedIcon='circle-o'
                />
                <View >
                    <CheckBox
                        left
                        title={Localize(messages.decline)}
                        checked={status == OrderInfo.ORDER_STATUS.NOT_COMPLETE}
                        onPress={() => { setStatus(OrderInfo.ORDER_STATUS.NOT_COMPLETE) }}
                        textStyle={styles.titleCheckbox}
                        containerStyle={styles.containerCheckbox}
                        checkedIcon='check-circle'
                        uncheckedIcon='circle-o'
                    />
                    {!status && <TouchableOpacity style={styles.reasonContainer} onPress={() => onClickSelectReason()} >
                        <Text style={styles.titleCheckbox}>{reason ? reason.message : Localize(messages.selectReason)}</Text>
                    </TouchableOpacity>}
                </View>

            </View >
        </Panel>

    );

}
const styles = {
    container: {
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    titleCheckbox: {
        ...AppStyles.regularText,
        fontSize: AppSizes.fontXXMedium,
        color: '#212121'
    },
    containerCheckbox: {
        backgroundColor: 'white',
        borderColor: 'white',
        marginLeft: 0,
        marginTop: 0,
        marginBottom: 0,
        borderRadius: 0
    },
    reasonContainer: {
        paddingHorizontal: AppSizes.paddingSml,
        paddingBottom: AppSizes.paddingSml
    }
}
export default connect(state => ({}), { addForm })(OrderStatusDepotView);
