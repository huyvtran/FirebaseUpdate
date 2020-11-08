import React, { Component } from "react";
import { ActivityIndicator, View, StyleSheet, Platform, Text, Alert } from "react-native";
import { connect } from "react-redux";
import { Button } from "react-native-elements";
import PropTypes from "prop-types";

import { CardTitle } from "../../../../theme/styled";
import { PanelContainer } from "./components/styled";
import { addForm } from "../../actions/creater/form";
import MultiImageListView from "./MultiImageListView";
import _ from "lodash";
import AppStyles from "../../../../theme/AppStyles";
import messages from "../../../../constant/Messages";
import FirebaseStorageManager from "../../../../firebase/FirebaseStorageManager";
import AppColors from "../../../../theme/AppColors";
import { isPhototAppTask, isInitiativeTask } from "../../../task/helper/FunctionHelper";
import Progress from "../../../../components/Progress";
import PermissionUtils from "../../../../utils/PermissionUtils";
import TrackLocationManager from "../../../locations/TrackLocationManager";
import { Localize } from "../../../setting/languages/LanguageManager";
import MapUtils from "../../../../utils/MapUtils";
import { Actions } from "react-native-router-flux";
import FirebaseDatabaseManager from "../../../../firebase/FirebaseDatabaseManager";
import AppSizes from "../../../../theme/AppSizes";
import ImagePicker from "react-native-image-picker";
import AlertUtils from "../../../../utils/AlertUtils";

// Component...

const styles = StyleSheet.create({
  contentContainer: {
    justifyContent: "center",
    backgroundColor: "transparent",
    paddingTop: AppSizes.paddingXSml,
    paddingBottom: AppSizes.paddingXSml,
    width: "100%",

  },
});
class PickerImgMulti extends Component {
  static PropTypes = {
    label: PropTypes.string.isRequired,
  }
  latitude = null;
  longitude = null;
  constructor(props) {
    super(props);
    this.state = {
      uri: null,
      uris: this.props.defaultValues ? this.getUrisDefault(this.props.defaultValues) : [],
      promptVisible: false,
      text: "",


      error: null,
      loading: false,
      loadingLocation: false,
    };
    this.uris = this.props.defaultValues ? this.getUrisDefault(this.props.defaultValues) : [];
    const { ...item } = this.props;
    this.item = item;
    this.hasDistanceFilter = props.properties && props.properties.distanceFilter;
    this.distanceFilter = props.properties && props.properties.distanceFilter ? parseInt(props.properties.distanceFilter) : 0;
    this.numberOfImages = props.properties && props.properties.numberOfImages ? parseInt(props.properties.numberOfImages) : 4;
  }

  componentWillReceiveProps(props) {
    if (!_.isEqual(this.props.defaultValues, props.defaultValues)) {
      this.setState({
        uris: props.defaultValues ? this.getUrisDefault(props.defaultValues) : [],
      });
    }
    const { ...item } = props;
    this.item = item;
  }


  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.uri !== nextState.uri ||
      this.state.uris !== nextState.uris ||
      this.state.text !== nextState.text ||
      this.state.error !== nextState.error ||
      this.state.loading !== nextState.loading ||
      this.state.loadingLocation !== nextState.loadingLocation ||
      this.state.promptVisible !== nextState.promptVisible
    );
  }


  getUrisDefault(valueDefaults) {
    const { taskDetail } = this.props;
    const taskActionsCode = taskDetail.task.taskAction.taskActionCode;

    if (_.isEmpty(valueDefaults)) {
      return [];
    }
    if (isInitiativeTask(taskActionsCode)) {
      const valueUrl = valueDefaults[0].value;
      const images = _.split(valueUrl, ",");
      const result = _.map(images, image => {
        return { value: image.replace("'", "").replace("'", "") };
      });
      return result;
    }

    return valueDefaults;
  }
  onClickPickPhoto(enableAccracy = true, count = 0) {
    this.setState({ loadingLocation: true }, () => {
      PermissionUtils.checkLocationPermission().then(value => {
        if (value === PermissionUtils.PERMISSIONS_STATUS.AUTHORIZED) {
          TrackLocationManager.getCurrentLocation(position => {
            if (Platform.OS === "android" && position.mocked) {
              FirebaseDatabaseManager.reportUserMockLocation(this.props.user);
              this.setState({
                loadingLocation: false,
              });
              AlertUtils.showError(messages.youAreUsingMockLocation);

              return;
            }
            if (position && position.coords) {
              this.location = position.coords;
              this.selectPhotoTapped();
            }
          }, error => {
            console.log("onClickPickPhoto >>", error.message);
            if (isPhototAppTask(this.props.taskActionCode)) {
              if (count >= 5) {
                this.setState({ loadingLocation: false });
                AlertUtils.showError(messages.canotCheckLocation);

                return;
              }
              this.onClickPickPhoto(false, count + 1);
            } else {
              this.selectPhotoTapped();
            }
          }, enableAccracy);
        } else {
          this.setState({ loadingLocation: false }, () => {
            AlertUtils.showError(messages.canotCheckLocation);
          });
        }
      });
    });
  }

  checkDistanceFilter() {
    const distance = MapUtils._calculateGreatCircleDistance(this.location, this.props.org[0].coordinate);
    return distance > this.distanceFilter;
  }

  selectPhotoTapped() {
    if (this.hasDistanceFilter && this.checkDistanceFilter()) {
      this.setState({ loadingLocation: false });
      AlertUtils.showError(messages.notNearEnough);
      return;
    }
    this.setState({ loadingLocation: false });
    const options = {
      quality: 0.5,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
        path: "Pictures/myAppPicture/",
        privateDirectory: true,
      },

      title: Localize(messages.chooseYourImage),
      chooseFromLibraryButtonTitle: Localize(messages.chooseFromLibrary),
      takePhotoButtonTitle: Localize(messages.takePhoto),
      cancelButtonTitle: Localize(messages.cancel),
    };
    if (this.isHideSelectFromLibrary()) {
      ImagePicker.launchCamera(options, response => {
        this.onCallBackMedia(response);
      });
    } else {
      ImagePicker.showImagePicker(options, response => {
        console.log("Response = ", response);
        this.onCallBackMedia(response);
      });
    }
  }

  onCallBackMedia(response) {
    console.log("Response = ", response);
    if (response.didCancel) {
      console.log("User cancelled photo picker");
    } else if (response.error) {
      console.log("ImagePicker Error: ", response.error);
    } else if (response.customButton) {
      console.log("User tapped custom button: ", response.customButton);
    } else {
      console.log("onCallBackMedia >>", response);

      // this.setState({ loading: true })
      Progress.show(FirebaseStorageManager.uploadImgaeFirebaseStorage, [response], url => {
        url && this.submitUrl(url);
      });
    }
  }

  submitUrl(url) {
    if (!this.location) {
      AlertUtils.showError(messages.locationIsnotDetect);
      return;
    }
    const { latitude, longitude } = this.location;

    this.uris = [...this.state.uris,
      {
        value: url,
        label: null,
        timestamp: new Date(),
        latlng: `${latitude},${longitude}`,
      }];
    this.setState({
      uris: this.uris,
      loading: false,
    }, () => {
      this.props.addForm(this.item, this.getImageValuesEnvInit(this.uris)); 
    });
  }

  getImageValuesEnvInit = images => {
    const { taskDetail } = this.props;
    const taskActionsCode = taskDetail.task.taskAction.taskActionCode;

    if (isInitiativeTask(taskActionsCode)) {
      let result = "";
      if (!images || images.length == 0) {
        return result;
      }
      images.forEach((image, index) => {
        if (index == 0) {
          result = `'${image.value}'`;
        } else {
          result += `,'${image.value}'`;
        }
      });
      return [{
        value: result,
        label: null,
        timestamp: new Date(),
      }];
    }

    return images;
  }

  isShowAddButton() {
    return !this.state.uris || this.state.uris.length < this.numberOfImages;
  }

  isHideSelectFromLibrary = () => {
    return this.props && this.props.properties && this.props.properties.isHideSelectFromLibrary && this.props.properties.isHideSelectFromLibrary === "true";
  }

  onDeleteAttachment = _.throttle((item, index) => {
    const uris = _.filter(this.state.uris, uri => {
      return uri.value !== item.value;
    });
    this.setState({ uris }, () => {
      this.props.addForm(this.item, this.getImageValuesEnvInit(uris));
    });
  }, 300)

  render() {
    const listUrlImage = this.state.uris.map(uri => uri.value);
    return (
      <View style={{
        marginHorizontal: AppSizes.paddingXTiny,
        marginVertical: AppSizes.paddingXXSml,
        borderRadius: AppSizes.paddingXTiny,
      }}
      >

        <PanelContainer>
          <Text style={CardTitle}>{this.props.label}</Text>
          {this.isShowAddButton() &&
            <Button
              buttonStyle={{ padding: 0, backgroundColor: "transparent" }}
              containerStyle={{ backgroundColor: "transparent" }}
              icon={{ name: "add-a-photo", color: "white" }}
              title={Localize(messages.addPhoto).toUpperCase()}
              onPress={() => this.onClickPickPhoto()}
            />
          }
        </PanelContainer>
        <View style={styles.contentContainer}>
          {this.state.loadingLocation ? <ActivityIndicator /> : <MultiImageListView
            onClickImageItem={(item, index) => {
              Actions.viewImage({ imageList: listUrlImage, indexSelected: index }); 
            }}
            data={this.state.uris}
            onDelete={(item, index) => this.onDeleteAttachment(item, index)}
                                                                />}

        </View>


      </View>
    );
  }
}
export default connect(state => ({
  taskDetail: state.task.taskDetail,
  taskActionCode: state.task.taskDetail.task.taskAction.taskActionCode,
  org: state.org.orgSelect,
  user: state.user.user,
}), { addForm })(PickerImgMulti);


