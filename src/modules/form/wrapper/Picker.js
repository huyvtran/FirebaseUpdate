import React, { Component } from 'react';
import { Modal, View, FlatList, TouchableOpacity, Text, ActivityIndicator, TextInput, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import LabelForm from '../components/LabelForm';

import { H1 } from '../../../theme/styled';
import { StatusBarView } from '../../../components/';
import { pickerStyles } from "./Styles";
import { isDisablePicker, isInitiativeTask } from "../../task/helper/FunctionHelper";
import { checkBaseAction } from "../../task/helper/FunctionHelper";
import { addForm } from "../actions/creater/form";
import AppColors from '../../../theme/AppColors';
import API from '../../../network/API';
import { Actions } from 'react-native-router-flux';
import { Localize } from '../../setting/languages/LanguageManager';
import messages from '../../../constant/Messages';
import InputField from '../../../components/InputField';
import AppSizes from '../../../theme/AppSizes';
import _ from 'lodash'
import AppStyles from '../../../theme/AppStyles';

const styles = {
  container: {
    paddingHorizontal: AppSizes.paddingMedium
  },
  headerContainer: {
    flexDirection: 'row',
    paddingHorizontal: AppSizes.paddingLarge,
    alignItems: 'center',
    height: AppSizes.paddingXSml * 7
  },
  inputContainer: {
    marginLeft: AppSizes.paddingXXLarge,
    paddingRight: AppSizes.paddingXXLarge,
    width: '100%'
  },
  input: {
    fontSize: AppSizes.fontXXMedium,
    color: 'white',
    fontWeight: '400',
    width: '100%'
  },
  textInput: {
    ...AppStyles.regularText,
    fontSize: AppSizes.fontXXMedium,
    color: '#1B64B0',
    fontWeight: '400',
    opacity: 0.87,
    borderBottomWidth: 1,
    borderBottomColor: '#5c91e2',
    borderRadius: AppSizes.paddingXTiny,
    padding: AppSizes.paddingTiny,

    color: AppColors.textColor,
    fontSize: AppSizes.fontBase,
    height: AppSizes.paddingLarge * 2,
    overflow: 'hidden',

  },

  itemContainer: {
    width: '100%',
    paddingHorizontal: AppSizes.paddingMedium,
    paddingVertical: AppSizes.paddingXSml,
    borderBottomWidth: AppSizes.paddingMicro,
    borderBottomColor: AppColors.lightgray
  }
}
class Picker extends Component {
  constructor(props, ctx) {
    super(props, ctx);
    this.state = {
      selected: this.props.defaultValues && this.props.defaultValues.length > 0 && !_.isEmpty(this.props.defaultValues[0].label) ? this.props.defaultValues[0].label : 'Vui lòng chọn',
      data: [],
      visible: false,
      picked: this.props.defaultValues && this.props.defaultValues[0] && this.props.defaultValues[0].value ? this.props.defaultValues[0].value : 'Lý do'
    };
    const { ...item } = this.props;
    this.item = item;
  }
  componentDidMount = () => {
    if (!checkBaseAction(this.props.taskActionCode)) {
      this.fetchDataPicker('');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value && nextProps.value === 'No') {
      this.setState({
        picked: 'Lý do'
      });
    }
  };


  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.visible !== nextState.visible ||
      this.state.data !== nextState.data ||
      this.state.picked !== nextState.picked ||
      this.props.value !== nextProps.value
    );
  }
  onShow() {
    this.setState({ visible: true });
  }
  onFilterChange = (text) => {
    this.fetchDataPicker(text);
  }
  async fetchDataPicker(text) {
    if (_.isEmpty(this.props.data.url)) {
      return;
    }
    await API.callApiPost(this.props.data.url, {
      currentPage: 1,
      date: new Date(),
      organizationIds: this.props.orgArr,
      pageLimit: 100,
      searchInput: text,
      filterBy: {
        organizationIds: this.props.orgArr,
      },
      attachedVehicleId: false
    }).then(res => {
      this.setState({ data: res.data.data, loading: false });
    })

  }
  addData(item) {
    const data = [
      {
        value: item._id,
        label: item[this.item.template],
      },
    ];
    this.props.addForm(this.item, data);
    this.setState({ selected: item[this.item.template], visible: false });
  }
  renderList = () => (
    <View >
      <FlatList
        data={this.state.data}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            // key={item._id}
            onPress={() => this.addData(item)}
            style={styles.itemContainer}
          >
            <Text>{item[this.item.template]}</Text>
          </TouchableOpacity>
        )
        }
      />
    </View>
  )

  renderOption = (rowData) => {
    const {
      selectedOption,
      renderOption,
    } = this.props;

    const { key, label } = rowData;

    if (renderOption) {
      return renderOption(rowData, key === selectedOption);
    }
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => this.props.onSelect(key)}
      >
        <Text>{label}</Text>
      </TouchableOpacity >
    );
  }

  onSelect = (value) => {
    console.log("Picker Picked value", value);
    if (this.props.status !== 2) {
      this.addDataBaseAction(value);
      this.setState({ picked: value });
    }
  };
  addDataBaseAction(value) {
    const data = [
      {
        value,
        label: this.props.label,
      },
    ];
    this.props.addForm(this.props, data);
  }

  onClickSelect = _.throttle(() => {
    Actions.selectPicker({ data: this.props.data, callback: this.onSelect.bind(this) })
  }, 300)

  displayAdditionText() {
    const result = isInitiativeTask(this.props.taskActionCode)
    return !!result
  }

  getTitle = () => {
    if (this.props.validate.required) {
      return this.item.label + ' (*)'
    }
    return this.item.label
  }

  renderContentSelected() {
    return <TouchableOpacity
      onPress={() => this.setState({ visible: true })}
    >
      <TextInput
        style={styles.textInput}
        keyboardShouldPersistTaps='always'
        underlineColorAndroid="transparent"
        ref={this.props.key}
        numberOfLines={1}
        value={this.state.selected}
        placeholder={'Vui lòng chọn'}
        placeholderStyle={{ fontSize: AppSizes.fontSmall }}
        returnKeyType="next"
        editable={false}
        pointerEvents="none"
      />
    </TouchableOpacity>
  }

  render() {
    if (checkBaseAction(this.props.taskActionCode)) {

      return (
        <View style={pickerStyles.container}>


          <TouchableOpacity
            style={[
              this.displayAdditionText() ? pickerStyles.triggerWrapperYellowText : {},
              { flexDirection: 'row' }
            ]}
            onPress={() => this.onClickSelect()}
            disabled={isDisablePicker(this.props.currentDate, this.props.taskActionCode, this.props.value)}>

            <Text style={[
              this.state.picked === 'Lý do' ? pickerStyles.triggerStylesText : pickerStyles.triggerWrapperYellowText,
              {
                flex: 9,
                textAlign: 'center',
                color: 'white'
              }]} numberOfLines={2}>{this.state.picked}</Text>

            {this.displayAdditionText() && <Text numberOfLines={1} style={{ justifyContent: 'center', flex: 2, marginVertical: AppSizes.paddingTiny, width: AppSizes.paddingXMedium * 2, pointerEvents: 'none', color: 'white', fontSize: AppSizes.fontXXMedium, textAlign: 'center' }}>{Localize(messages.select)}</Text>
            }
            {this.displayAdditionText() && <Icon
              style={{ flex: 1 }}
              name={'ios-arrow-forward'}
              size={AppSizes.paddingXXLarge}
              color='white'
            />}
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <InputField
            title={this.getTitle()}
            noLocalize
            renderContent={this.renderContentSelected()}
          />
          <Modal
            visible={this.state.visible}
            onRequestClose={() => null}
            supportedOrientations={['portrait', 'landscape']}
          >
            <StatusBarView />

            <View style={{ ...styles.headerContainer, backgroundColor: AppColors.abi_blue }}>
              <TouchableOpacity
                onPress={() => this.setState({ visible: false }, () => this.fetchDataPicker(''))}
                hitSlop={{
                  top: AppSizes.paddingLarge * 2,
                  left: AppSizes.paddingLarge * 2,
                  bottom: AppSizes.paddingLarge * 2,
                  right: AppSizes.paddingLarge * 2
                }}
              >
                <Icon
                  name='md-arrow-back'
                  size={AppSizes.paddingXXLarge}
                  color='white'
                  style={{ display: this.props.display }}
                />
              </TouchableOpacity>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  selectionColor='white'
                  placeholder='Search'
                  placeholderTextColor='#f0f0ff'
                  autoFocus
                  underlineColorAndroid='white'
                  value={this.state.text}
                  onChangeText={this.onFilterChange}
                  autoCorrect={false}
                  onSubmitEditing={() => null}
                />
              </View>
            </View>
            {this.props.loading && <ActivityIndicator />}
            {this.renderList()}
          </Modal>
        </View>
      );
    }
  }
}
export default connect((state, ownProps) => ({
  value: state.task.taskDetail.task.taskAction.taskActionCode === 'SOOS' ?
    state.task.taskDetail.task.lastResponse.eAVs[ownProps.index].value : null,
  currentDate: state.task.currentDate,
  taskActionCode: state.task.taskDetail.task.taskAction.taskActionCode,
  orgArr: state.user.user.organizationIds,
}), { addForm })(Picker);
