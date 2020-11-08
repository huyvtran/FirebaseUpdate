import React, { Component } from 'react';
import { TextInput, Text, View } from 'react-native';
import { connect } from 'react-redux';

import { addForm } from "../actions/creater/form";
import { H1 } from '../../../theme/styled';
import LabelForm from '../components/LabelForm';
import AppSizes from '../../../theme/AppSizes';
import AppColors from '../../../theme/AppColors';


const styles = {
  container: {
    marginBottom: AppSizes.paddingMedium,
    paddingHorizontal: AppSizes.paddingMedium
  },
  tagsContainer: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap'
  },
  tag: {
    height: AppSizes.paddingMedium * 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.abi_blue,
    borderRadius: AppSizes.paddingTiny,
    paddingHorizontal: AppSizes.paddingXXMedium,
    paddingVertical: AppSizes.paddingXXMedium,
    marginLeft: AppSizes.paddingSml,
    marginBottom: AppSizes.paddingSml
  }
}

class Tags extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      text: '',
      error: false,
      tags: this.props.defaultValues ? this.props.defaultValues[0].value : '',
    };
    const { ...item } = this.props;
    this.item = item;
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.tags !== nextState.tags ||
      this.state.text !== nextState.text
    ) {
      return true;
    }
    return false;
  }

  onSubmitEditing() {
    this.state.text === '' ? null :
      this.setState({ text: '', tags: `${this.state.text},${this.state.tags}` });
    this.addData(this.state.text);
  }
  addData(text) {
    const data = [{
      value: text,
      label: this.props.label,
    }];
    this.props.addForm(this.item, data);
  }

  render() {
    const { ...item } = this.props;
    const tags = this.state.tags.split(',');
    const tagsrender = tags.map((e, i) => e !== '' && <View style={styles.tag} key={i}><Text style={[H1, { color: '#FFFFFF' }]}>{e}</Text></View>);

    return (
      <View style={styles.container}>
        <LabelForm
          label={item.label}
          required={this.props.validate.required}
        />
        <TextInput
          multiline={!!this.props.rows}
          numberOfLines={this.props.rows || null}
          onChangeText={text => this.setState({ text })}
          onSubmitEditing={() => this.onSubmitEditing()}
          value={this.state.text}
          placeholder={item.placeholder || 'Input here'}
          keyboardType={this.props.type === 'number' ? 'numeric' : null}
        />
        <View style={styles.tagsContainer}>
          {tagsrender}
        </View>
      </View>
    );
  }
}

export default connect(state => ({ form: state.form }), { addForm })(Tags);
