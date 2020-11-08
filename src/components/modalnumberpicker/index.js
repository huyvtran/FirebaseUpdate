'use strict';

import React, { Component } from 'react';

import {
  Modal,
  View,
  Dimensions,
  Text,
  TouchableOpacity
} from 'react-native';

import BaseComponent from './BaseComponent';
import { StatusBarView } from '../';
import HeaderDetail from '../HeaderDetail'
import messages from '../../constant/Messages';
import { Localize } from '../../modules/setting/languages/LanguageManager';
import AppColors from '../../theme/AppColors';
import ButtonText from '../ButtonText';
import Divider from '../../modules/form/components/Divider';
import AppStyles from '../../theme/AppStyles';
const { width } = Dimensions.get('window');
import { Picker, DatePicker } from 'react-native-wheel-pick';
import * as Animatable from 'react-native-animatable';
import AppSizes from '../../theme/AppSizes';

export default class ModalPicker extends BaseComponent {
  constructor(props) {
    super(props);

    this._bind(
      'open',
      'close',
      'renderChildren',
      'accept',
    );
    this.state = {
      modalVisible: false,
      transparent: false,
      selection: props.initValue ? props.initValue : props.data,
      data: this.props.data,
    };
  }

  handleViewRef = ref => this.modalView = ref;

  close() {
    this.modalView.slideOutDown(300).then(endState => {
      this.setState({
        modalVisible: false,
      });
    })

  }

  accept() {
    const { selection } = this.state;
    this.props.onChange(selection);
    this.close()
  }

  open() {
    console.log('object');
    this.setState({
      modalVisible: true,
    });
  }

  renderChildren() {
    if (this.props.children) {
      return this.props.children;
    }
    return (
      <Text>Please Select an Item!</Text>
    );
  }

  getCaseValues() {
    let values = []
    for (let index = 0; index <= this.state.data[0]; index++) {
      values.push(index)
    }
    return values
  }
  getItemValues() {
    let values = []
    const numberOfItem = this.props.initValue[0] == this.state.data[0] ? this.state.data[1] : this.props.numberPerCase
    for (let index = 0; index <= numberOfItem; index++) {
      values.push(index)
    }
    return values
  }

  onChangeCase(item) {
    const selection = this.state.selection;
    selection[0] = item;
    if (item == this.state.data[0]) {
      selection[1] = this.state.data[1]
    }
    this.setState({ selection })

  }

  onChangeItem(item) {
    const selection = this.state.selection;
    selection[1] = item;
    this.setState({ selection })

  }
  renderContentModal() {
    return <View style={{ backgroundColor: AppColors.hintText, width: '100%', height: '100%' }}>
      <Animatable.View ref={this.handleViewRef} animation="slideInUp" duration={300} style={{ backgroundColor: 'white', position: 'absolute', bottom: 0, width: AppSizes.screenWidth }}>
        <Divider />

        <View style={{ paddingHorizontal: AppSizes.paddingMedium, paddingVertical: AppSizes.paddingTiny, justifyContent: 'space-between', flexDirection: 'row' }}>
          <ButtonText
            containerStyle={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row' }}
            content={Localize(messages.cancel)}
            onClick={() => this.close()}
            textStyle={{ color: AppColors.gray, fontSize: AppSizes.fontXXMedium }}

          />
          <ButtonText
            containerStyle={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row' }}
            content={Localize(messages.confirm)}
            textStyle={{ color: AppColors.abi_blue, fontSize: AppSizes.fontXXMedium }}
            onClick={() => this.accept()}

          />
        </View>
        <Divider />
        <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
          <Picker
            style={{ backgroundColor: 'white', width: AppSizes.screenWidth / 2, height: AppSizes.paddingXLarge * 10 }}
            selectedValue={this.state.selection[0]}
            pickerData={this.getCaseValues()}
            onValueChange={value => { this.onChangeCase(value) }}
            itemSpace={AppSizes.paddingSml * 3} // this only support in android
          />
          <Picker
            style={{ backgroundColor: 'white', width: AppSizes.screenWidth / 2, height: AppSizes.paddingXLarge * 10 }}
            selectedValue={this.state.selection[1]}
            pickerData={this.getItemValues()}
            onValueChange={value => { this.onChangeItem(value) }}
            itemSpace={AppSizes.paddingSml * 3} // this only support in android
          />
        </View>
      </Animatable.View>
    </View>
  }

  render() {
    const dp = (
      <Modal
        transparent ref="modal"
        visible={this.state.modalVisible}
        onRequestClose={this.close}
        animationType={'fade'}
      >
        {this.renderContentModal()}
      </Modal>
    );

    return (
      <View style={this.props.style}>
        {dp}
        <TouchableOpacity
          style={this.props.style}
          disabled={this.props.disabled}
          onPress={this.open}
        >
          {this.renderChildren()}
        </TouchableOpacity>
      </View>
    );
  }
}




