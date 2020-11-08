import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash'
import messages from '../../constant/Messages';
import SelectItemsComponent from '../../components/selectItem/SelectItemsComponent';
import LanguageManager, { Localize } from '../setting/languages/LanguageManager';
import API from '../../network/API';


class SelectFeeType extends SelectItemsComponent {


    source = () => {
        const id = this.props.org[0]._id;
        return API.chargeList(id)

    }

    transformer(res) {
        return res.data && res.data.data;
    }

    config() {
        return {
            itemText: (item, index) => item.chargeName,
            source: this.source,
            transformer: this.transformer,
            title: Localize(messages.selectFeeType)
        }
    }
}

export default connect(state => ({ orgArr: state.user.user.organizationIds, org: state.org.orgSelect, }), {})(SelectFeeType);


