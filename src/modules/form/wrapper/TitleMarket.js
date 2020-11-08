import React from "react";
import { Text, View } from "react-native";
import AppSizes from "../../../theme/AppSizes";
import AppStyles from "../../../theme/AppStyles";

const TitleMarket = props => (
  <View style={{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: AppSizes.paddingXXTiny,
    borderColor: '#d6d7da',
    borderRadius: AppSizes.paddingXTiny,
    // backgroundColor: '#F2F2F3',
    marginHorizontal: AppSizes.paddingXXTiny,
    marginVertical: AppSizes.paddingXXSml,
    paddingHorizontal: AppSizes.paddingXTiny,
    paddingVertical: AppSizes.paddingXXSml
  }}
  >

    <Text style={{ ...AppStyles.regularText, fontSize: AppSizes.fontXXMedium, color: 'black' }} >{props.content}</Text>
  </View>
);

export default TitleMarket;
