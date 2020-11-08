import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { connect } from 'react-redux';

import _ from 'lodash'
import AddPhotoComponent from '../../../components/AddPhotoComponent';
import Progress from '../../../components/Progress';
import API from '../../../network/API';
import NotificationManager from '../../notification/NotificationManager';
import { Localize } from '../../setting/languages/LanguageManager';
import messages from '../../../constant/Messages';
import eventTypes from '../../../store/constant/eventTypes';
import { refresh } from '../../../store/actions/refresh'
import HeaderDetail from '../../../components/HeaderDetail';


class ShipmentBargeBayMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stopSelected: props.shipment ? this.getStopSelected(props.shipment) : null
        }


    }

    componentWillReceiveProps(newsProps) {
        if (newsProps.shipment && this.props.shipment && JSON.stringify(newsProps.shipment) !== JSON.stringify(this.props.shipment)) {
            this.setState({ stopSelected: this.getStopSelected(newsProps.shipment) })
        }
    }

    getStopSelected = (shipment) => {
        return shipment.shipmentStopIds.find(shipmentStop => shipmentStop.isSelected)
    }

    onChangeImageList = (imageList) => {
        console.log("onChangeImageList imageList.length>>", imageList.length)
        const stopId = this.state.stopSelected._id
        Progress.show(API.updateImageShipmentStop, [stopId, imageList], (res) => {
            if (res && res.data) {
                NotificationManager.showMessageBar(Localize(messages.updatePhotoShipmentStopSuccess), undefined, undefined)
                this.props.refresh(eventTypes.REFRESH_SHIPMENT_LIST, _.now())

            }
        })
    }

    renderShipmentStop = (stop) => {
        return <AddPhotoComponent
            title={stop && stop.customerId ? stop.customerId.fullName : ''}
            onChangePhotoList={(imageList) => this.onChangeImageList(imageList)}
            defaultValues={stop.images}
            disable={!!this.props.shipmentData}
        />
    }


    render() {
        const { shipmentData } = this.props
        const { stopSelected } = this.state
        return (<View>
            {shipmentData && <HeaderDetail
                title={Localize(messages.bayMap)}
            />}
            <ScrollView >
                {shipmentData ? shipmentData.shipmentStopIds.map(stopId => this.renderShipmentStop(stopId)) : this.renderShipmentStop(stopSelected)}
            </ScrollView>
        </View>

        );
    }
}

const styles = StyleSheet.create({

    containerTaskList: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
    },

})
export default connect(state => ({
    task: state.task,
    event: state.refresh.event,
    locale: state.i18n.locale,
    org: state.org.orgSelect,
    orgConfig: state.user.orgConfig,
    user: state.user.user,

}), { refresh })(ShipmentBargeBayMap);
