import _ from "lodash";
import React from "react";
import { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Actions } from "react-native-router-flux";
import { AbstractProps, AbstractStates } from "../base/AbstractProperty";
import AppColors from "../theme/AppColors";
import AppSizes from "../theme/AppSizes";
import AppStyles from "../theme/AppStyles";
import DeviceUtil from "../utils/DeviceUtil";
import ButtonIcon from "./ButtonIcon";
import ButtonText from "./ButtonText";

const wrapNavBarDimen = AppSizes.paddingXMedium * 4;

const styles = StyleSheet.create({
  navigationBar: {
    backgroundColor: AppColors.abi_blue,
    height: wrapNavBarDimen,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
  },
  wrapContainer: {
    flex: 1,
    height: wrapNavBarDimen,
    alignItems: "center",
  },
  backButton: {
    width: wrapNavBarDimen,
    height: wrapNavBarDimen,
    zIndex: -1,
  },
  rightButton: {
    width: wrapNavBarDimen,
    height: wrapNavBarDimen,
  },
  title: {
    // fontFamily: AppFonts.base.family,
    fontSize: AppSizes.fontBase,
    backgroundColor: "transparent",
    color: "white",
    width: "50%",
    textAlign: "center",
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  rightView: {
    flexDirection: "row",
    height: wrapNavBarDimen,
    position: "absolute",
    right: AppSizes.paddingTiny,
    alignItems: "center",
  },
});

interface Props extends AbstractProps {
  title;
  subTitle;
  rightView?;
  contentView?;
  rightButtonTitle;
  rightButtonEnable;
  rightButtonAction: () =>void;
  leftButtonAction: () =>void;
  isHideLeftButton?;
  customTitleStyle?;
  rightButtonTestId?;
  leftButtonTestId?;
}

interface States extends AbstractStates {}

class HeaderDetail extends Component<Props, States> {
  renderTitleView = () => {
    const { title, subTitle } = this.props;
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: "40%",
        }}
      >
        {!!title && !_.isEmpty(title) && (
          <Text
            numberOfLines={1}
            ellipsizeMode={"tail"}
            style={{
              fontSize: AppSizes.fontXXMedium,
              backgroundColor: "transparent",
              color: AppColors.white,
              width: "100%",
              textAlign: "center",
              fontWeight: "500",
            }}
          >
            {title}
          </Text>
        )}
        {!!subTitle && !_.isEmpty(subTitle) && (
          <Text
            numberOfLines={1}
            ellipsizeMode={"head"}
            style={{
              ...AppStyles.regularText,
              color: "white",
              fontSize: AppSizes.fontSmall,
              marginTop: AppSizes.paddingTiny,
              fontWeight: "400",
            }}
          >
            {subTitle}
          </Text>
        )}
      </View>
    );
  };
  render() {
    const _titleContainerStyle = {};

    const {
      rightView,
      contentView,
      title,
      rightButtonTitle,
      rightButtonEnable,
      rightButtonAction,
      leftButtonAction,
      isHideLeftButton,
      customTitleStyle,
      rightButtonTestId,
      leftButtonTestId,
    } = this.props;

    const iphoneXCustomHeight = DeviceUtil.isIPhoneX()
      ? { ...AppStyles.ipXNavBarHeight }
      : {};
    const iphoneXCustomTop = DeviceUtil.isIPhoneX()
      ? { ...AppStyles.ipXNavBarTop }
      : {};
    return (
      <View style={[styles.navigationBar, iphoneXCustomHeight]}>
        <View
          flexDirection="row"
          style={[styles.wrapContainer, iphoneXCustomTop]}
        >
          <View style={[styles.titleContainer, _titleContainerStyle]}>
            {/* {contentView ? contentView : <Text numberOfLines={1} style={[styles.title, customTitleStyle]}>{title}</Text>} */}
            {contentView ? contentView : this.renderTitleView()}
          </View>
          {!isHideLeftButton && (
            <ButtonIcon
              testID={leftButtonTestId}
              containerStyle={styles.backButton}
              iconName="arrow-back"
              iconSize={AppSizes.paddingXXLarge}
              iconColor={"white"}
              onPress={() => {
                leftButtonAction ? leftButtonAction() : Actions.pop();
              }}
            />
          )}
          <View style={styles.rightView}>
            {rightView && rightView}
            {rightButtonTitle && (
              <ButtonText
                testID={rightButtonTestId}
                containerStyle={styles.rightButton}
                enable={rightButtonEnable}
                content={rightButtonTitle}
                onClick={() => {
                  rightButtonAction && rightButtonAction();
                }}
              />
            )}
          </View>
        </View>
      </View>
    );
  }
}

export default HeaderDetail;
