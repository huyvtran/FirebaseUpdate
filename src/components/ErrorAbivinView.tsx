import _ from "lodash";
import LottieView from "lottie-react-native";
import React from "react";
import { Component } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity
} from "react-native";
import AnimationJson from "../assets/AnimationJson";
import { AbstractProps, AbstractStates } from "../base/AbstractProperty";
import messages from "../constant/Messages";
import { Localize } from "../modules/setting/languages/LanguageManager";
import AppColors from "../theme/AppColors";
import AppSizes from "../theme/AppSizes";
import AppStyles from "../theme/AppStyles";

interface Props extends AbstractProps {
    onPressRetry:()=>void;
}

interface States extends AbstractStates {}

class ErrorAbivinView extends Component<Props, States> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { onPressRetry } = this.props;

    return (
      <TouchableOpacity
        style={[styles.container]}
        onPress={
          onPressRetry
            ? _.throttle(onPressRetry, 200, { trailing: false })
            : null
        }
      >
        <LottieView
          style={styles.lottieView}
          source={AnimationJson.aniErrorView}
          autoPlay
          loop
        />

        <Text style={styles.contentText}>
          {Localize(messages.somethingWentWrong)}
        </Text>
        <Text style={styles.retryText}>{Localize(messages.clickToRetry)}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  lottieView: {
    width: AppSizes.paddingLarge * 6,
    height: AppSizes.paddingLarge * 6,
  },
  retryText: {
    ...AppStyles.regularText,
    color: AppColors.hintText,
    marginTop: AppSizes.paddingXSml,
    backgroundColor: "white",
  },
  contentText: {
    ...AppStyles.regularText,
    color: AppColors.sectionText,
    marginTop: AppSizes.paddingMedium,
    backgroundColor: "white",
  },
});

export default ErrorAbivinView;
