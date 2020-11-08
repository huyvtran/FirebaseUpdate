import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Icon as MaterialIcon } from 'react-native-elements'
import { connect } from 'react-redux';
import { PanelStyle, H1 } from '../../../theme/styled';
import { panelStyles } from "./Styles";
import { getPointOfCatPE } from "../../task/helper/FunctionHelper";
import AppSizes from '../../../theme/AppSizes';

class Panel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expanded: props.properties && String(props.properties.isOpenPanel) === 'true',
    }
  }

  getPanelStyle = () => {
    const { isDisable } = this.props
    if (isDisable) {
      return panelStyles.panelDisable
    }
    if (this.state.expanded) {
      panelStyles.panelExpanded
    }
    return panelStyles.panel
  }

  render() {
    // console.log("=================Panel================ render", this.props);
    const { expanded } = this.state
    const { isDisable } = this.props
    return (

      <View style={panelStyles.container}>

        <TouchableOpacity
          disabled={isDisable}
          style={[PanelStyle, this.getPanelStyle()]}
          onPress={() => this.setState({ expanded: !this.state.expanded })}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[H1, { color: 'white' }]}>{this.props.title}</Text>
            {isDisable && <MaterialIcon
              name={'report-problem'}
              color={'white'}
              size={AppSizes.paddingXXLarge}
              containerStyle={{ paddingLeft: AppSizes.paddingMedium }}
            />}
          </View>

          <View style={panelStyles.iconView}>
            <Icon
              style={panelStyles.icon}
              size={AppSizes.paddingXXLarge}
              color={'white'}
              name={!this.state.expanded ? 'ios-arrow-up' : 'ios-arrow-down'}
            />
            {(this.props.point || this.props.point === 0) && <Text style={panelStyles.point}>{this.props.point}</Text>}

          </View>
        </TouchableOpacity>

        {expanded && !isDisable ?
          <View style={panelStyles.childContainer}>
            {this.props.children}
          </View> : null
        }

      </View>

    );
  }
}
export default connect((state, ownProps) => ({
  form: state.form,
  point: getPointOfCatPE(state, ownProps.title)
}))(Panel);
