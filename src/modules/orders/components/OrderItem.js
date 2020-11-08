import React, { Component } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet
} from 'react-native';
import AppStyles from '../../../theme/AppStyles';
import AppColors from '../../../theme/AppColors';
import OrderInfo from '../../../constant/OrderInfo';
import { Icon } from 'react-native-elements';
import { H1, H2 } from '../../../theme/styled';
import { Localize } from '../../setting/languages/LanguageManager';
import messages from '../../../constant/Messages';
import Divider from '../../form/components/Divider';
import AppSizes from '../../../theme/AppSizes';





class OrderItem extends Component {
  render() {
    const { order, onPress } = this.props


    return (

      <TouchableOpacity onPress={onPress && onPress} style={{ justifyContent: 'center', alignItems: 'center', width: AppSizes.screenWidth,  }}>
        <View style={styles.itemContainer}>
          <View style={styles.containerContentItem}>
            <View style={styles.itemTittle}>
              {/* <Icon
                name='clipboard-notes'
                size={20}
                color={AppColors.abi_blue}
                type='foundation'
                paddingLeft={4}
              /> */}
              <Text style={[H1, { paddingTop: 4 }]} numberOfLines={1} >{order.orderCode}</Text>

            </View>
            <View style={styles.mainContentItem}>
              <View style={styles.containerContentItem}>
                <View style={styles.text}>
                  <Icon

                    name='account'
                    size={16}
                    color={AppColors.orderDark}
                    type='material-community'
                  />

                  <Text style={[H2, { paddingLeft: 8 }]} numberOfLines={1}>  {order && order.vehicleInfo && order.vehicleInfo.defaultDriverName ? order.vehicleInfo.defaultDriverName : Localize(messages.noDriver)}</Text>

                </View>

              </View>
              <View style={styles.fulfillmentStatusIcon}>
                <View style={styles.text} >
                  <Icon
                    name='check-circle'
                    size={16}
                    color={OrderInfo.ORDER_FULLFILLMENT_STATUS[order.fulfillmentStatus].color}
                    type='material-community'
                  />

                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={{ paddingHorizontal: 16, width: '100%', backgroundColor: 'white', paddingTop: 8 }}>
          <Divider />

        </View>
      </TouchableOpacity>

    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },

  itemContainer: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    width: '100%',

    // borderColor: '#455a64',
    // borderWidth: 0.3,
    // borderRadius: 4,

    marginTop: 4,
    paddingLeft: 16

  },
  containerContentItem: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flex: 1,
    marginTop: 4,

  },
  mainContentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  orderCodeItem: {
    color: AppColors.orderDark,
    fontSize: 12,



  },



  background: {
    backgroundColor: '#f4f4f4',
    marginLeft: 8,
    marginRight: 8,
    marginTop: 8,
    marginBottom: 8

  },
  text: {
    margin: 4,
    flexDirection: 'row'
  },
  itemTittle: {
    backgroundColor: '#ffffff',
    padding: 2,
    flexDirection: 'row',
    borderColor: '#455a64',

  },
  fulfillmentStatusIcon: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flex: 1,
    marginRight: 16
  },


});
export default OrderItem;