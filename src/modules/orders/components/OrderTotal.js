import React, { Component } from 'react';
import Divider from '../../form/components/Divider';
import { View, Text, StyleSheet } from 'react-native'
import TranslateText from '../../setting/languages/components/TranslateText';
import AppColors from '../../../theme/AppColors';
import { moneyFormat } from '../../../utils/moneyFormat';
import TaskHelper from '../../task/helper/TaskHelper';
import AppSizes from '../../../theme/AppSizes';
import { isDeliveryTask, isTMSTasks } from '../../task/helper/FunctionHelper';

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    paddingVertical: AppSizes.paddingSml,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: AppSizes.paddingXXMedium,
  },
  totalText: {
    fontSize: 16,
    fontWeight: '500',
    color: AppColors.spaceGrey
  }
})

const totalAmountCollected = (taskList) => {
  let sumOrder = 0;
  let sumAmountCollected = 0;
  let sumTotalPrice = 0;
  taskList.forEach(task => {
    task.status === TaskHelper.status.COMPLETE && task.lastResponse.entities.forEach(entity => {
      if (entity.datas) {
        entity.datas.forEach(order => {
          order.amountCollected && (sumAmountCollected += Number(order.amountCollected.replace(/\./g, '')));
          (order.amountCollected === undefined && order.status === 2) && (sumTotalPrice += Number(order.totalPrice));
          sumOrder = sumAmountCollected + sumTotalPrice
        }
        );
      }
    });
  });
  return sumOrder;
}

export default OrderTotal = ({ taskList }) => {
  if (!taskList || taskList.length === 0 || !isTMSTasks(taskList)) {
    return <View />
  }
  const totalAmount = totalAmountCollected(taskList)
  return (<View>
    <View style={styles.container} >
      <TranslateText
        style={{ fontSize: 16, fontWeight: "500", color: AppColors.spaceGrey }}
        value={'totalAmount'}
      />
      <Text style={styles.totalText} >{moneyFormat(totalAmount)}</Text>

    </View >
    <Divider />
  </View>)
}

