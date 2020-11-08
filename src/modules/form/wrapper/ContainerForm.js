import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import { addForm } from "../actions/creater/form";
import AppColors from '../../../theme/AppColors';
import AppSizes from '../../../theme/AppSizes';
import AppStyles from '../../../theme/AppStyles';


const styles = {
  panelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: AppSizes.paddingMedium,
    marginBottom: AppSizes.paddingMedium,
    height: AppSizes.paddingXLarge * 2,
    backgroundColor: AppColors.naviBlue
  },
  titleText: {
    ...AppStyles.regularText,
    fontSize: AppSizes.fontXXMedium,
    color: AppColors.abi_blue
  }
}

class ContainerForm extends Component {
  state = {
    expanded: false,
  }
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const expanded = this.state.expanded ? { height: 0, width: 0 } : null;
    return (
      <View>
        <TouchableOpacity style={styles.panelContainer} >
          <Text style={styles.titleText}>{this.props.title}</Text>
          <View>
            <Icon
              size={AppSizes.paddingXXLarge}
              color='white'
              name='md-add'
            />
          </View>
        </TouchableOpacity>
        <View style={expanded}>{this.props.children}</View>
      </View>
    );
  }
}
export default connect(state => ({ form: state.form }), { addForm })(ContainerForm);
