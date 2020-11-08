import React from 'react';
import {View} from 'react-native';
import formCreator from "../formCreator";

const Column = props => (
  <View style={{
    flex: 1,
    flexDirection: "row"
  }}
  >
    {props.item.columns.map(it => (
      <View style={{flex: it.width}}>
        {formCreator(it.components)}
      </View>))
    }
  </View>
);

export default Column;
