import React from 'react';
import { Label, Required } from '../../../theme/styled';
import { Text, View } from 'react-native'
import AppSizes from '../../../theme/AppSizes';
const styles = {
  container: {
    flexDirection: 'row'

  }
}

const LabelForm = ({ label, required }) => (
  <View style={styles.container}>
    <Text style={[Label, { fontSize: AppSizes.fontSmall, opacity: 0.87, marginBottom: 0 }]} underlineColorAndroid="transparent" >{label}</Text>
    {required ? <Text style={Required}> (*)</Text> : null}
  </View>
);
export default LabelForm;
