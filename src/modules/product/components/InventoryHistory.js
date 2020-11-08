import React, { Component } from 'react';
import { BackHandler, View, FlatList, Text } from 'react-native';

import messages from '../../../constant/Messages';
import { connect } from 'react-redux';
import Moment from "moment/moment";
import InventoryOrderItem from './InventoryOrderItem';
import API from '../../../network/API';
import AwesomeListComponent from 'react-native-awesome-list';
import { Localize } from '../../setting/languages/LanguageManager';
import ErrorAbivinView from '../../../components/ErrorAbivinView';


class InventoryHistory extends Component {

    constructor(props) {
        super(props)
    }

    source = () => {
        const orgId = this.props.org && this.props.org[0] ? this.props.org[0].id : undefined;
        const { inventory } = this.props;
        return API.orderListInventoryApi([orgId], Moment(), inventory.skuReference);
    }

    renderItem({ item }) {
        return (
            <InventoryOrderItem
                order={item}
            />)
    }

    transformer(res) {
        return res.data.data;
    }
    //UI CONTROL ---------------------------------------------------------------------------------


    //UI RENDER ----------------------------------------------------------------------------------

    render() {
        return <AwesomeListComponent
            source={() => this.source()}
            transformer={(response) => this.transformer(response)}
            renderItem={(item) => this.renderItem(item)}
            emptyText={Localize(messages.noResult)}

        />
    }
}

// Redux
const mapStateToProps = state => ({
    org: state.org.orgSelect,
    locale: state.i18n.locale

})

// Any actions to map to the component?
const mapDispatchToProps = {

}
export default connect(mapStateToProps, mapDispatchToProps)(InventoryHistory);