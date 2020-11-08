import _ from "lodash";
import React from "react";
import { Component } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import AppSizes from "../theme/AppSizes";
interface Props {
  enable: boolean;
  content: string;
  onClick: () => void;
  buttonStyle?: any;
  textStyle?: StyleProp<TextStyle>;
  textStyleDisable?: any;
  containerStyle: StyleProp<ViewStyle>;
  testID: any;
}

class ButtonText extends Component<Props, any> {
  static defaultProps = {
    enable: true,
    content: "Done",
    onClick: () => {
      console.log("ButtonText Clicked");
    },
    buttonStyle: {
      width: "100%",
      height: "100%",
      backgroundColor: "blue",
    },
  };

  onClick = () => {
    Keyboard.dismiss();
    this.props.onClick && this.props.onClick();
  };
  render() {
    const {
      containerStyle,
      enable,
      content,
      onClick,
      buttonStyle,
      textStyle,
      textStyleDisable,
      testID,
    } = this.props;
    const styleText = [
      styles.text,
      enable ? styles.enable : styles.disabled,
      enable ? textStyle : textStyleDisable,
    ];
    // const styleDisable = [styles.text, styles.disabled, textStyleDisable];
    return (
      <TouchableOpacity
        testID={testID}
        style={[styles.containerStyle, containerStyle && containerStyle]}
        keyboardShouldPersistTaps="always"
        disabled={!enable}
        onPress={() => {
          // this.onClick ? _.throttle(this.onClick, 2000, { trailing: false }) : null;
          this.onClick();
        }}
      >
        <Text numberOfLine={1} style={styleText}>
          {content}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    width: AppSizes.paddingLarge * 2,
    height: AppSizes.paddingLarge * 2,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: AppSizes.fontBase,
    textAlign: "center",
  },
  enable: {
    color: "white",
  },
  disabled: {
    color: "rgba(250, 250, 250, 0.5)",
  },
});

export default ButtonText;
