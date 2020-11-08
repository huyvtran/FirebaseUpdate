import React, { Component } from 'react';

import {
  View, StyleSheet, Text, Image, TouchableOpacity, Dimensions
} from 'react-native';
import { PanelContainer } from '../PickerImg/components/styled';
import AppColors from '../../../../theme/AppColors';
import { Icon } from 'react-native-elements';
import messages from '../../../../constant/Messages';
import LanguageManager, { Localize } from '../../../setting/languages/LanguageManager';
import { connect } from 'react-redux';
import { addForm } from "../../actions/creater/form";
import { refresh } from '../../../../store/actions/refresh';
import AppSizes from '../../../../theme/AppSizes';
import AppStyles from '../../../../theme/AppStyles';
import { Actions } from 'react-native-router-flux';
import LottieView from 'lottie-react-native';

const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;

const flexCenter = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
};


class QRScanComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: this.props.defaultValues ? (this.props.defaultValues.length > 0 && this.props.defaultValues[0].value) : false,

    };
    const { ...item } = this.props;
    this.item = item;
    this.orderId = props ?.taskDetail ?.orderList ?.[0] ?._id ?? null;
  }

  addData(item, data) {
    this.props.addForm(item, data);
  }

  showQRCoadScan() {
    if (this.state.value) {
      return;
    }
    Actions.qrScan({ onQRCodeRead: this.onQRCodeRead.bind(this) })
  }

  onQRCodeRead(data) {
    if (!this.orderId) {
      alert("There are no order")
      return;
    }
    if (this.orderId === data) {
      this.setState({ value: true })
      this.addData(this.item, [{
        value: true,
        timestamp: new Date(),
        label: null
      }]);
      return;
    }

    alert("You are scanning wrong order!")

  }


  renderPicker() {
    const { value } = this.state

    return (
      <View style={styles.contentContainer}>


        <TouchableOpacity style={styles.containerLabel}
          onPress={this.showQRCoadScan.bind(this)}>

          {value ? <LottieView style={styles.lottieView} source={require('../../../../assets/animation/aniDone.json')} autoPlay loop={false} /> :
            <LottieView style={styles.lottieView} source={require('../../../../assets/animation/aniScan.json')} autoPlay loop />}

        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { uri } = this.state;
    return (
      <View style={{
        marginHorizontal: AppSizes.paddingXTiny,
        marginVertical: AppSizes.paddingXXSml,
        borderRadius: AppSizes.paddingXTiny
      }}>
        <PanelContainer>
          <Text style={styles.CardTitle}>{Localize(messages.qrScan)}</Text>
        </PanelContainer>
        {this.renderPicker()}
      </View>
    );
  }


}

// export default SignatureView;
export default connect(state => ({
  currentDate: state.task.currentDate,
  taskDetail: state.task.taskDetail.task,
  username: state.user.user.username,
  taskActionCode: state.task.taskDetail.task.taskAction.taskActionCode,
  org: state.org.orgSelect,
  taskDetailContain: state.task.taskDetail,
  components: state.task.taskDetail.components,

}), {
  addForm,
  refresh,
})(QRScanComponent);


const styles = {
  lottieView: {
    width: AppSizes.paddingLarge * 3,
    height: AppSizes.paddingLarge * 3
  },
  containerLabel: {
    alignItems: 'center',
    padding: AppSizes.paddingMedium,
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: AppSizes.paddingXXSml,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    width: AppSizes.screenWidth - AppSizes.paddingMedium * 2
  },
  CardTitle: {
    ...AppStyles.regularText,
    fontSize: AppSizes.fontXXMedium,
    color: '#ffffff',
    fontWeight: '400',
    opacity: 0.87
  },
  containerInfo: {
    paddingTop: AppSizes.paddingTiny,
    paddingBottom: AppSizes.paddingTiny,
    flexDirection: 'row',
    width: AppSizes.screenWidth - AppSizes.paddingMedium * 2,
    justifyContent: 'space-between'
  },
  textPicker: {
    ...AppStyles.regularText,
    fontSize: AppSizes.fontXXMedium,
    color: '#455A64'
  },
  image: {
    width: AppSizes.screenWidth - AppSizes.paddingMedium * 2,
    height: AppSizes.paddingSml * 20,
    borderColor: AppColors.gray,
    borderWidth: 0.8,
    borderRadius: AppSizes.paddingXXSml,
    marginTop: AppSizes.paddingXSml
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: AppSizes.paddingMedium,
    paddingLeft: AppSizes.paddingMedium,
    width: widthScreen,
    backgroundColor: 'transparent',
    paddingTop: AppSizes.paddingXSml,
    paddingBottom: AppSizes.paddingXSml
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },

};