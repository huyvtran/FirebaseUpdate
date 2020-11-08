import React from "react";
import { Text, View } from "react-native";
import { connect } from "react-redux";
import {
  borderSizeHTMLToText, getAvePointPE,
  textSizeHTMLToText,
  valueOfSurvey
} from "../../task/helper/FunctionHelper";
import { panelStyles } from "./Styles";
import AppSizes from "../../../theme/AppSizes";
import AppStyles from "../../../theme/AppStyles";


const HtmlToText = ({
  value, typeText, taskActionCode, index, point
}) =>

  (
    <View style={{
      flex: 1,
      flexDirection: 'row',
      alignItems: (typeText === 'normal' && !(taskActionCode.includes('SURVEY') && index >= 0)) ? 'flex-start' : 'center',
      justifyContent: 'center',
      borderBottomWidth: 1,
      borderTopWidth: borderSizeHTMLToText(typeText),
      borderLeftWidth: borderSizeHTMLToText(typeText),
      borderRightWidth: borderSizeHTMLToText(typeText),
      borderColor: '#d6d7da',
      borderRadius: typeText === 'normal' ? 0 : AppSizes.paddingTiny,
      marginHorizontal: 0,
      marginVertical: AppSizes.paddingXXSml,
      paddingHorizontal: AppSizes.paddingXTiny,
      paddingVertical: (typeText === 'title') ? AppSizes.paddingXSml : AppSizes.paddingXXSml,

    }}
    >

      <Text style={{
        ...AppStyles.regularText,
        fontSize: textSizeHTMLToText(typeText),
        color: (taskActionCode.includes('SURVEY') && index >= 0) ? 'red' : 'black',
        flex: 9,
        textAlign: 'center'
      }}
      >{value}
      </Text>
      {(point || point === 0) && <Text style={{
        color: 'red',
        flex: 1
      }}
      >{point}
      </Text>}
    </View>
  );


export default connect((state, own) => ({
  taskActionCode: state.task.taskDetail.task.taskAction.taskActionCode,
  point: getAvePointPE(state, own),
  value: (state.task.taskDetail.task.taskAction.taskActionCode.includes('SURVEY') && own.index >= 0) ?
    valueOfSurvey(state.task.taskDetail.task, own.index) : own.content
}), null)(HtmlToText);
