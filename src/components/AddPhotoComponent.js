import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Text, TouchableOpacity, FlatList, Platform, Image, ImageBackground, ScrollView } from "react-native";
import ImagePicker from "react-native-image-picker";
import ImageLoading from "./ImageLoading";
import AppSizes from "../theme/AppSizes";
import { PanelContainer } from "../modules/form/wrapper/PickerImg/components/styled";
import FirebaseStorageManager from "../firebase/FirebaseStorageManager";
import Progress from "./Progress";
import { Actions } from "react-native-router-flux";
import { Icon } from "react-native-elements";
import { Localize } from "../modules/setting/languages/LanguageManager";
import messages from "../constant/Messages";
import _ from "lodash";
import AppStyles from "../theme/AppStyles";

class AddPhotoComponent extends Component {
    static propTypes = {
      componentId: PropTypes.string,
      title: PropTypes.string,
    };

    static defaultProps = {
      title: Localize(messages.takePhoto),
    }

    constructor(props) {
      super(props);
      this.state = {
        photoList: props.defaultValues ? props.defaultValues : [],
      };
    }

    componentWillReceiveProps(newProps) {
      if (newProps.defaultValues && this.props.defaultValues && JSON.stringify(this.props.defaultValues) !== JSON.stringify(newProps.defaultValues)) {
        this.setState({ photoList: newProps.defaultValues });
      }
    }


    showImagePicker = () => {
      const options = {
        title: Localize(messages.chooseYourImage),
        chooseFromLibraryButtonTitle: Localize(messages.chooseFromLibrary),
        takePhotoButtonTitle: Localize(messages.takePhoto),
        quality: 0.6,
        maxWidth: 500,
        maxHeight: 500,
        storageOptions: {
          skipBackup: true,
          path: "Pictures/myAppPicture/",
          privateDirectory: true,
        },
        cancelButtonTitle: Localize(messages.cancel),
      };
      ImagePicker.showImagePicker(options, response => {
        if (response.didCancel) {
          console.log("User cancelled image picker");
        } else if (response.error) {
          console.log("ImagePicker Error: ", response.error);
        } else if (response.customButton) {
          console.log("User tapped custom button: ", response.customButton);
        } else {
          Progress.show(FirebaseStorageManager.uploadImgaeFirebaseStorage, [response], url => {
            const { photoList } = this.state;
            photoList.push(url);
            this.setState({
              photoList,
            }, this.props.onChangePhotoList(photoList));
          });
        }
      });
    }

    renderImageItem = ({ item, index }) => {
      return (<ImageLoading
        style={styles.image}
        source={{ uri: item }}
        resizeMode={"cover"}
        onPress={() => {
          Actions.viewImage({ imageList: this.state.photoList, indexSelected: index }); 
        }}
        onDelete={() => {
          this.props.disable ? null : this.onDeleteAttachment(item); 
        }}
              />);
    }

    onDeleteAttachment = _.throttle((item, index) => {
      const photos = _.filter(this.state.photoList, uri => {
        return uri !== item;
      });
      this.setState({ photoList: photos }, () => {
        this.props.onChangePhotoList(photos);
      });
    }, 300)

    renderItemAdd = () => {
      return (<TouchableOpacity style={styles.image} onPress={() => this.showImagePicker()} >
        <Icon
          name={"add"}
          size={AppSizes.paddingLarge}
          color={"white"}
        />
      </TouchableOpacity>);
    }
    keyExtractor = (item, index) => {
      if (!item.id) {
        return index.toString();
      }
      return item.id;
    }
    render() {
      const { title, disable } = this.props;
      return (
        <View style={styles.container}>
          <PanelContainer >
            <Text style={{
              fontSize: AppSizes.fontXXMedium,
              color: "#ffffff",
              fontWeight: "400",
              opacity: 0.87,
            }}
            >{title}</Text>
            {!disable && <TouchableOpacity style={{ flexDirection: "row" }} onPress={() => this.showImagePicker()}>
              <Icon
                name={"add-a-photo"}
                size={AppSizes.paddingLarge}
                color={"white"}
              />
              <Text style={{ ...AppStyles.regularText, fontSize: AppSizes.fontXXMedium, paddingLeft: AppSizes.paddingXXSml, color: "white" }}>{Localize(messages.capture)}</Text>
            </TouchableOpacity>}

          </PanelContainer>

          <FlatList
            ref={ref => this.flatList = ref}
            renderItem={this.renderImageItem.bind(this)}
            data={this.state.photoList}
            keyExtractor={this.keyExtractor}
            horizontal={true}
            extraData={this.state}
          />
        </View>

      );
    }
}

export default AddPhotoComponent;


const styles = {
  container: {
    width: "100%",
    backgroundColor: "white",
    height: AppSizes.paddingSml * 17,
  },
  imageListContainer: {
    backgroundColor: "white",
    flexDirection: "row",
  },
  image: {
    width: AppSizes.paddingSml * 8,
    height: AppSizes.paddingSml * 10,
    margin: AppSizes.paddingXSml,
    borderRadius: AppSizes.paddingXXSml,
  },
  imageList: {
    height: AppSizes.paddingSml * 7,
    width: AppSizes.screenWidth,
    paddingVertical: AppSizes.paddingXXSml,
    paddingHorizontal: AppSizes.paddingMedium,
  },
};
