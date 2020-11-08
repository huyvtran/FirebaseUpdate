import React, { Component } from 'react';
import { Linking, BackHandler, Text, View, Image } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import openMap from 'react-native-open-maps';

import { translateText } from '../../setting/languages/components/translate';
import RowDetail from '../../product/components/RowDetail';
import HeaderDetail from '../../../components/HeaderDetail';
import { H1 } from '../../../theme/styled';
import AppSizes from '../../../theme/AppSizes';

const styles = {
  container: {
    backgroundColor: 'white'
  },
  profileContainer: {
    marginTop: AppSizes.paddingLarge * 5
  },
  profile: {
    width: AppSizes.paddingLarge * 10,
    position: 'absolute',
    alignSelf: 'center',
    marginTop: -AppSizes.paddingLarge * 7,
    marginBottom: AppSizes.paddingSml,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    height: AppSizes.paddingLarge * 5,
    width: AppSizes.paddingLarge * 5
  }
}

class CustomerDetail extends Component {
  constructor(props) {
    super(props);
    this.item = null;
    this.state = {
      data: {
        _id: '',
        ContactName: '',
        organizationId: {
          _id: '',
          organizationName: '',
        },
        categoryIds: [
          {
            _id: '',
            categoryType: '',
            categoryName: '',
            categoryCode: '',
          },
        ],
        createdBy: '',
        ContactCode: null,
        sku: '',
      },
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.item = props.item
  }
  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  getNavigationParams() {
    return this.props.navigation.state.params || {};
  }

  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }
  startNavigation(url) {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log(`Don't know how to open URI: ${url}`);
      }
    });
  }

  render() {
    return (
      <View style={styles.container} >
        <HeaderDetail />
        <View style={styles.profileContainer}>
          <View style={styles.profile}>
            <Image style={styles.avatar} source={require('../../../assets/icon/iconPerson.png')} />
            <Text style={H1}>{this.item.fullName}</Text>
          </View>
          <RowDetail
            i1={translateText('phoneNumber')}
            i2={this.item.mobileNumber}
            icon='call'
            onPress={() => Linking.openURL(`tel:${this.item.mobileNumber}`)}
          />
          <RowDetail
            i1={translateText('address')}
            i2={this.item.streetAddress}
            icon='directions'
            onPress={() => openMap(this.item.coordinate)}
          />
          <RowDetail
            i1={'Email'}
            i2={this.item.email || ''}
          />
        </View>
      </View >
    );
  }
}

export default connect(null, null)(CustomerDetail);
