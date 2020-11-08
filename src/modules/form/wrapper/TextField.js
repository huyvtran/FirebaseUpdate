import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Platform, StyleSheet, TextInput, View, Text } from 'react-native'
import { addForm, setValidateSubmit } from "../actions/creater/form";
import {
  checkBaseAction,
  checkToDayOrNot,
  isSnpTask,
} from "../../task/helper/FunctionHelper";
import { moneyFormat3 } from "../../../utils/moneyFormat";
import messages from '../../../constant/Messages';
import StringUtils from '../../../utils/StringUtils';
import TaskCode from '../../../constant/TaskCode';
import _ from 'lodash'
import LanguageManager, { Localize } from '../../setting/languages/LanguageManager';
import InputField from '../../../components/InputField';
import AppSizes from '../../../theme/AppSizes';
import AppColors from '../../../theme/AppColors';
import AppStyles from '../../../theme/AppStyles';


const styles = {
  container: {
    marginBottom: AppSizes.paddingXXSml,
    marginTop: AppSizes.paddingSml,
    paddingHorizontal: AppSizes.paddingMedium,
  },
  errorLabel: {
    color: '#DB4437',
    fontSize: AppSizes.fontSmall
  },
  textInput: {
    ...AppStyles.regularText,
    fontWeight: '400',
    opacity: 0.87,
    borderBottomWidth: AppSizes.paddingXXTiny,
    borderBottomColor: '#5c91e2',
    borderRadius: AppSizes.paddingXTiny,
    padding: AppSizes.paddingTiny,
    color: AppColors.textColor,
    fontSize: AppSizes.fontBase,
    height: AppSizes.paddingLarge * 2,
  },

}
class TextField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      text: this.props.defaultValues ? (this.props.defaultValues.length > 0 ? this.props.defaultValues[0].value : null) : null,
      error: false,
      errorFormat: false
    };
    const { ...item } = this.props;
    this.item = item;

    this.onChangeText = this.onChangeText.bind(this);
  }

  componentWillReceiveProps(props) {
    if (!_.isEqual(this.props.defaultValues, props.defaultValues) && this.props.actionCode === 'V-FAST') {
      this.setState({
        text: props.defaultValues[0].value ? props.defaultValues[0].value : null
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.text !== nextState.text ||
      (!_.isEqual(this.props.defaultValues, nextProps.defaultValues) && this.props.actionCode === 'V-FAST') ||
      this.state.errorFormat !== nextState.errorFormat
    );
  }

  isSODTask() {
    return this.props.actionCode && this.props.actionCode === TaskCode.SOD;
  }
  /**
   * in case this text field just input number, => validate is it float/interger number or not
   * with SOD task, all filed is interger number 
   * @param {*} input 
   */
  onChangeText(input) {
    let text = input.replace(",", ".");

    const rawText = text.split('.').join("")
    if (!_.isEmpty(rawText) && this.isLimitLength()) {
      const validLength = rawText.length === this.getLengthInput()
      if (!validLength) {
        this.setState({ text, errorFormat: true }, () => this.addData(text));
        return;
      }

    }

    if (this.props.type === 'number' && checkBaseAction(this.props.actionCode)) {
      var valid = this.isSODTask() ? StringUtils.isIntergerNumberFormat(text) : StringUtils.isFloatNumberFormat(text);
      if (!valid && !_.isEmpty(text)) {
        this.setState({ text, errorFormat: true });
        this.props.setValidateSubmit(false)
        return;
      }
    }

    if (this.props.type === 'number') {
      let validNumberFormat = StringUtils.isAllDigit(rawText)
      if (!_.isEmpty(text) && !validNumberFormat) {
        this.setState({ text: text, errorFormat: true });
        this.addData(text);
        return;
      }
    }

    if (this.isSerialFormat()) {
      let validSerialFormat = StringUtils.isSerialFormat(text)
      if (!_.isEmpty(text) && !validSerialFormat) {
        this.setState({ text, errorFormat: true });
        this.props.setValidateSubmit(false)
        return;
      }
    }

    if (this.isContainerNumberFormat()) {
      let validContainerFormat = StringUtils.isValidateContainerNumber(text)
      if (!_.isEmpty(text) && !validContainerFormat) {
        this.setState({ text: text, errorFormat: true });
        this.addData(text);
        return;
      }
    }

    const today = checkToDayOrNot(this.props.currentDate);

    const textResult = (this.props.type === 'number' && !checkBaseAction(this.props.actionCode)) && !isSnpTask(this.props.actionCode) ? moneyFormat3(text) : this.getDefaultText(text, today)

    this.setState({ text: textResult, errorFormat: false });
    this.addData(textResult);
    this.props.setValidateSubmit(true)
  }

  addData(text) {
    const { defaultValues } = this.props
    const data = [{
      value: text,
      label: defaultValues && defaultValues[0] && !_.isEmpty(defaultValues[0].label) ? defaultValues[0].label : text,
    }];
    this.props.addForm(this.props, data);
  }

  onLostFocus() {

    if (this.props.type === 'number' && this.state.errorFormat === true) {
      this.setState({ text: '' })
      this.props.setValidateSubmit(true)
    }
  }

  getDefaultText(value, editAble) {
    let result = value;

    if (value == null && editAble === false) {
      result = "0";
    }

    return result;
  }


  isSerialFormat() {
    return this.props && this.props.properties && this.props.properties.isFormatSerial === 'true'
  }

  isAutoCapitalize() {
    return this.props && this.props.properties && this.props.properties.isAutoCapitalize === 'true'
  }

  isContainerNumberFormat() {
    return this.props && this.props.properties && this.props.properties.isContainerNumberFormat === 'true'
  }

  isLimitLength = () => {
    return this.props && this.props.properties && this.props.properties.lengthInput

  }

  getLengthInput() {
    return parseInt(this.props.properties.lengthInput)
  }

  getTitle = () => {
    if (this.props.validate.required) {
      return this.item.label + ' (*)'
    }
    return this.item.label
  }

  renderTextInput() {
    const today = checkToDayOrNot(this.props.currentDate);
    const editable = today && !this.props.disabled
    if (editable) {
      return <TextInput
        style={styles.textInput}
        keyboardShouldPersistTaps='always'
        underlineColorAndroid="transparent"
        ref={this.props.key}
        multiline={!!this.props.rows}
        numberOfLines={this.props.rows || null}
        onChangeText={(text) => this.onChangeText(text)}
        value={this.state.text}
        placeholder={this.item.placeholder || Localize(messages.enter)}
        placeholderStyle={{ fontSize: AppSizes.fontSmall }}
        keyboardType={this.props.type === 'number' ? (Platform.OS === 'ios' ? 'numeric' : 'phone-pad') : null}
        returnKeyType="next"
        editable={editable}
        autoCapitalize={this.isSerialFormat() || this.isAutoCapitalize() ? 'characters' : 'none'}
        onBlur={() => { this.onLostFocus() }}
      />
    }

    return <Text
      style={[styles.textInput,
      {
        numberOfLines: 1,
        paddingTop: AppSizes.paddingSml,
        paddingBottom: AppSizes.paddingSml,
        alignItems: 'center',
      }]}>{this.state.text}</Text>

  }

  render() {
    return (
      <View style={styles.container}>
        <InputField
          title={this.getTitle()}
          noLocalize
          renderContent={this.renderTextInput()}
        />

        {this.state.error ?
          <Text style={styles.errorLabel}>{this.props.ErrorLabel || 'Required...'}</Text> : null
        }
        {this.state.errorFormat ?
          <Text style={styles.errorLabel}>{messages.task.failFormat}</Text> : null
        }
      </View>
    );
  }
}

export default connect(state => ({
  currentDate: state.task.currentDate,
  actionCode: state.task.taskDetail.task.taskAction.taskActionCode,
}), { addForm, setValidateSubmit })(TextField);
