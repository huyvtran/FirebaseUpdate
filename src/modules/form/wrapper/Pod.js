import React, { Component } from 'react';

import { connect } from 'react-redux';

import { addForm } from "../actions/creater/form";
import { PanelContainer } from './PickerImg/components/styled';
import messages from '../../../constant/Messages';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import AppStyles from '../../../theme/AppStyles';
import AppColors from '../../../theme/AppColors';
import API from '../../../network/API';
import AppSizes from '../../../theme/AppSizes';


const styles = StyleSheet.create({
  containerLabel: {
    backgroundColor: 'white',
    alignItems: 'center',
    padding: AppSizes.paddingMedium,
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: AppSizes.paddingXXSml,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    width: AppSizes.screenWidth - AppSizes.paddingMedium * 2
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: AppSizes.paddingMedium,
    paddingLeft: AppSizes.paddingMedium,
    width: AppSizes.screenWidth,
    backgroundColor: 'transparent',
    paddingTop: AppSizes.paddingXSml,
    paddingBottom: AppSizes.paddingXSml
  },
})
class Pod extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      text: this.props.defaultValues ? (this.props.defaultValues.length > 0 ? this.props.defaultValues[0].value : '') : '',
      error: false,
    };
    const { ...item } = this.props;
    this.item = item;
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {
    this.submitData();
  }
  async submitData() {
    const endpoint = await this.props.properties.endpoint;
    const data = await JSON.parse(this.props.properties.data);
    await API.callApiPost(endpoint, { taskId: this.props.taskDetail._id }).then()
  }
  addData(text) {
    const data = [{
      value: text,
      label: text,
    }];
    this.props.addForm(this.item, data);
  }

  render() {

    return (
      <View style={{
        marginHorizontal: AppSizes.paddingXTiny,
        marginVertical: AppSizes.paddingXXSml,
        borderRadius: AppSizes.paddingXTiny
      }}>
        <PanelContainer >
          <Text style={{ ...AppStyles.regularText, fontSize: AppSizes.fontXXMedium, color: 'white' }}>{messages.confirmCode}</Text>
        </PanelContainer>
        <View style={styles.contentContainer} >
          <TouchableOpacity style={styles.containerLabel} onPress={() => this.onSubmit()}>
            <Text style={{ color: AppColors.abi_blue }}>{'GET POD'}</Text>
          </TouchableOpacity>


        </View>
      </View>
    );
  }
}

export default connect(state => ({ taskDetail: state.task.taskDetail.task }), { addForm })(Pod);
