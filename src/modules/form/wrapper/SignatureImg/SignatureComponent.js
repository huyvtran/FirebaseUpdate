import React, {
    Component, PropTypes
  } from 'react';
  
  import ReactNative, {
    View, Text, Modal, Platform, Alert
  } from 'react-native';
  
  import SignatureCapture from 'react-native-signature-capture';
  import messages from '../../../../constant/Messages';
  import { Localize } from '../../../setting/languages/LanguageManager';
import AppSizes from '../../../../theme/AppSizes';
import AppStyles from '../../../../theme/AppStyles';
  
  const toolbarHeight = Platform.select({
    android: 0,
    ios: AppSizes.paddingXLarge
  });
  
  const modalViewStyle = {
    paddingTop: toolbarHeight,
    flex: 1
  };
  
  class SignatureComponent extends Component {
  
    constructor(props) {
      super(props);
  
      this.state = {
        visible: false
      };
    }
  
    show(display) {
      this.setState({visible: display});
    }
  
    render() {
      const {visible} = this.state;
  
      return (
        <Modal transparent={false} visible={visible} onRequestClose={this._onRequreClose.bind(this)}>
          <View style={modalViewStyle}>
            <View style={{padding: AppSizes.paddingSml, flexDirection: 'row'}}>
              <Text onPress={this._onPressClose.bind(this)}>{Localize(messages.exit)}</Text>
              <View style={{flex: 1, alignItems: 'center'}}>
                <Text style={{...AppStyles.regularText}}>{Localize(messages.pleaseWriteYourSignature)}</Text>
              </View>
            </View>
            <SignatureCapture
                style={{flex: 1, width: '100%'}}
              onDragEvent={this._onDragEvent.bind(this)}
              onSaveEvent={this._onSaveEvent.bind(this)}
            />
          </View>
        </Modal>
      );
    }
  
    _onPressClose() {
      this.show(false);
    }
  
    _onRequreClose() {
      this.show(false);
    }
  
    _onDragEvent() {
      // This callback will be called when the user enters signature
     console.log("dragged");
    }
  
    _onSaveEvent(result) {
      //result.encoded - for the base64 encoded png
      //result.pathName - for the file path name
      this.props.onSave && this.props.onSave(result);
    }
  }
  
  export default SignatureComponent;
  