import React, { Component } from 'react';
import { connect } from 'react-redux';

import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native'

import { Actions } from 'react-native-router-flux';

import _ from 'lodash'
import ButtonIcon from '../../components/ButtonIcon';
import messages from '../../constant/Messages';
import Divider from '../form/components/Divider';
import AppColors from '../../theme/AppColors';
import AppStyles from '../../theme/AppStyles';
import SelectItemsComponent from '../../components/selectItem/SelectItemsComponent';
import LanguageManager, { Localize } from '../setting/languages/LanguageManager';
import Languages from '../setting/languages/Languages';
import API from '../../network/API';
import OrgConfig from '../../constant/OrgConfig';
import OrgHelper from '../../utils/OrgUtils';


class SelectReason extends SelectItemsComponent {


    source = () => {       
        if(OrgHelper.isOutsourcingOrg){
            const id = this.props.org[0].parentId._id;
            return API.getOrgRead(id);
        }
        else{
            const wareHouse= OrgConfig.TYPE_WAREHOUSE.BRANCH;
            const organizationIds = this.props.org[0]._id;
            return API.getOrgParentBranch(wareHouse,organizationIds);
        }
        
    }

    transformer(res) {
        return res.data.data && res.data.data.reasons;
    }

    config() {
        return {
            itemText: (item, index) => item.message,
            source: this.source,
            transformer: this.transformer,
            title: Localize(messages.selectReason)
        }
    }
}

export default connect(state => ({ orgArr: state.user.user.organizationIds, org: state.org.orgSelect, }), {})(SelectReason);


