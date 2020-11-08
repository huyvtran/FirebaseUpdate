import React, { Component } from 'react';

import {
  View, StyleSheet, Text, Image, TouchableOpacity, Dimensions
} from 'react-native';
import SignatureComponent from './SignatureComponent';
import { PanelContainer } from '../PickerImg/components/styled';
import AppColors from '../../../../theme/AppColors';
import { Icon } from 'react-native-elements';
import messages from '../../../../constant/Messages';
import LanguageManager, { Localize } from '../../../setting/languages/LanguageManager';
import { connect } from 'react-redux';
import { addForm } from "../../actions/creater/form";
import { refresh } from '../../../../store/actions/refresh';
import API from '../../../../network/API';
import FormType from '../../../../constant/FormType';
import AppSizes from '../../../../theme/AppSizes';
import AppStyles from '../../../../theme/AppStyles';
import Messages from '../../../../constant/Messages';

const widthScreen = Dimensions.get('window').width;
const heightScreen = Dimensions.get('window').height;

const flexCenter = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
};

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
    justifyContent: 'space-between',
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

})

class SignatureView extends Component {

  constructor(props) {
    super(props);
    this.state = {

      uri: this.props.defaultValues ? (this.props.defaultValues.length > 0 && this.props.defaultValues[0].value) : null,
      // loadingLocation: false

    };
    const { ...item } = this.props;
    this.item = item;

  }

  addData(item, data) {
    this.props.addForm(item, data);
  }
  _showSignatureView() {
    this._signatureView.show(true);
  }

  _onSave(result) {
    const base64String = `data:image/png;base64,${result.encoded}`;

    this.setState({ uri: base64String });
    this.addData(this.item, [{ value: base64String, timestamp: new Date(), label: null }]);
    this._signatureView.show(false);
  }


  renderPicker() {
    const { uri } = this.state;
    console.log('base 64' + this.props.defaultValue)
    return (
      <View style={styles.contentContainer} >

        {uri ?
          <TouchableOpacity style={{ alignItems: 'flex-end', width: '100%' }} onPress={this._showSignatureView.bind(this)}>
            <Text style={[styles.textPicker, { color: '#5c91e2' }]}>{Localize(Messages.change)}</Text>
          </TouchableOpacity>
          : <TouchableOpacity style={styles.containerLabel} onPress={this._showSignatureView.bind(this)}>

            <Icon name='pen' color='#5c91e2' type='material-community' />

          </TouchableOpacity>}
        <SignatureComponent
          ref={r => this._signatureView = r}
          rotateClockwise={!!true}
          onSave={this._onSave.bind(this)}
        />
      </View>
    );
  }
  renderSignatureImg() {
    const { uri } = this.state;

    return (
      <View style={styles.contentContainer} >
        {uri &&
          <View style={styles.containerLabel}>
            <Image
              resizeMode={'contain'}
              style={{ width: AppSizes.paddingSml * 30, height: AppSizes.paddingSml * 30 }}
              source={{ uri: this.state.uri }}
            />

          </View>
        }
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
        <PanelContainer >
          <Text style={styles.CardTitle}>{Localize(Messages.signature)}</Text>
        </PanelContainer>
        {this.renderPicker()}
        {this.renderSignatureImg()}
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
  })(SignatureView);