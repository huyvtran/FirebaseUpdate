import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import AwesomeListComponent from 'react-native-awesome-list';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import ErrorAbivinView from '../../../components/ErrorAbivinView';
import messages from '../../../constant/Messages';
import { refresh } from '../../../store/actions/refresh';
import FreightConstant from '../../freight/FreightConstant';
import { Localize } from '../../setting/languages/LanguageManager';
import { loadTaskDetail, loadTaskImplementing } from "../../task/actions/creater/task";
import ShipmentStopItem from '../ShipmentStopItem';





class ShipmentBargeListTask extends Component {
    constructor(props) {
        super(props);

        this.state = {
            shipment: props.shipment
        }

    }
    componentWillReceiveProps(newsProps) {
        if (newsProps.shipment && this.props.shipment && JSON.stringify(newsProps.shipment) !== JSON.stringify(this.props.shipment)) {
            this.setState({ shipment: newsProps.shipment }, () => this.bargeListTask.refresh())
        }
    }

    source = () => {
        return Promise.resolve(this.state.shipment.shipmentStopIds);
    }

    taskItemPress(item) {
        const { shipment } = this.state

        Actions.taskDetail({ item, selectedDate: this.props.selectedDate, index: 0, shipmentId: shipment._id });
    }

    transformer(res) {
        const { shipment } = this.state
        const isDummy = shipment.bargeShipmentType === FreightConstant.SHIPMENT_BARGE_TYPE.DUMMY

        if (isDummy) {
            return res.filter(stop => {
                return stop.stopType === FreightConstant.SHIPMENT_STOP_TYPES.PICK
            })
        }
        return res
    }

    keyExtractor = (item) => item._id

    renderShimentStopItem = ({ item }) => {

        return <ShipmentStopItem
            shipmentStop={item}
            taskItemPress={(item) => this.taskItemPress(item)}
            isParentControl
        />

    }

    render() {
        return (
            <View style={{ flex: 1, width: '100%', height: '100%' }}>

                <AwesomeListComponent
                    ref={ref => this.bargeListTask = ref}

                    containerStyle={[styles.containerTaskList]}
                    source={() => this.source()}
                    transformer={(response) => this.transformer(response)}
                    renderItem={(item) => this.renderShimentStopItem(item)}
                    keyExtractor={(item) => this.keyExtractor(item)}
                    emptyText={Localize(messages.noResult)}
                    renderErrorView={() => <ErrorAbivinView onPressRetry={() => this.subShipmentTaskList.onRetry()} />}
                />
            </View >
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

}), { loadTaskDetail, loadTaskImplementing, refresh })(ShipmentBargeListTask);
