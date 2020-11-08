import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View } from 'react-native';
import ButtonText from '../../../components/ButtonText';
import messages from '../../../constant/Messages';
import { addForm } from "../actions/creater/form";
import AppSizes from '../../../theme/AppSizes';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%'
  },
  textContainer: {
    margin: AppSizes.paddingXXSml,
    height: AppSizes.paddingLarge,
  }
});

class CheckBoxYesNo extends Component {
  constructor(props) {
    super(props);

  }

  getColor(isYes) {
    const status = this.props.valueCheckBoxYesNo;
    if (status === 'yes' && isYes) {
      return 'green';
    }
    if (status === 'no' && !isYes) {
      return 'green';
    }
    return 'grey';
  }
  onChangeStatus(isYes) {
    // this.props.addForm(this.props, isYes ? 'yes' : 'no')

    const data = [
      {
        value: isYes ? 'yes' : 'no',
        label: this.props.label,
      },
    ];
    this.props.addForm(this.props, data);
  }
  render() {
    return (
      <View style={styles.container}>
        <ButtonText
          content={messages.yes}
          containerStyle={[styles.textContainer, { backgroundColor: this.getColor(true) }]}
          onClick={() => { this.onChangeStatus(true) }}
        />
        <ButtonText
          content={messages.no}
          containerStyle={[styles.textContainer, { backgroundColor: this.getColor(false) }]}
          onClick={() => { this.onChangeStatus(false) }}
        />
      </View>
    );
  }
}

export default connect(state => ({ form: state.form }), { addForm })(CheckBoxYesNo);
