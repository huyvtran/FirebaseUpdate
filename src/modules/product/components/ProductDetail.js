import React, { Component } from 'react';
import { BackHandler, View, ScrollView, Image } from 'react-native';

import { translateText } from '../../setting/languages/components/translate';
import RowDetail from './RowDetail';
import HeaderDetail from '../../../components/HeaderDetail';
import ProductHelper from './ProductHelper';
import TranslateText from '../../setting/languages/components/TranslateText';
import messages from '../../../constant/Messages';

class ProductDetail extends Component {

  constructor(props) {
    super(props);
    this.item = null;
    this.isInventory = null;

    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }
  componentWillMount() {
    this.item = this.getNavigationParams().item;
    this.isInventory = this.getNavigationParams().isInventory;
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
  render() {
    console.log("ProductDetail this.item>>", this.item);
    return (
      <View style={styles.container} >
        <HeaderDetail
          title={this.item.productName}
        />


        <ScrollView>
          
          <RowDetail
            i1={translateText('category')}
            i2={this.item.categoryIds && this.item.categoryIds.length > 0 && this.item.categoryIds[0] ? this.item.categoryIds[0].categoryName : null}
          />
          <RowDetail
            i1={<TranslateText value={messages.productName} />}
            i2={this.item.productName}
          />
          <RowDetail
            i1={translateText('volume')}
            i2={this.item.volume}
          />
          <RowDetail
            i1={translateText('weight')}
            i2={this.item.weight}
          />
          <RowDetail
            i1={translateText('unit')}
            i2={this.item.unit}
          />
          <RowDetail
            i1={translateText('temperature')}
            i2={this.item.temperature && ProductHelper.temperature[this.item.temperature]}
          />
          {
            this.isInventory && <View>
              <RowDetail
                i1={translateText('picked')}
                i2={this.item.picked}
              />
              <RowDetail
                i1={translateText('reserved')}
                i2={this.item.reserved}
              />
              <RowDetail
                i1={translateText('on_order')}
                i2={this.item.onPOrder}
              />
            </View>
          }
        </ScrollView>
      </View >
    );
  }
}

export default ProductDetail;

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  imageContainer: {
    width: '100%',
    height: 160,
    justifyContent: 'center',
    alignItems: 'center'
  },
  img: {
    width: 120,
    height: 120
  }
}