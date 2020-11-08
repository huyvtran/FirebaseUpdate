import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Cell from './cell';
import AppSizes from '../../../../../theme/AppSizes';

class Row extends Component {
  static propTypes = {
    textStyle: Text.propTypes.style,
  }

  render() {
    const { data, style, widthArr, height, flexArr, alignItemsArr, textStyle, borderStyle } = this.props;
    let widthNum = 0;
    if (widthArr) {
      for (let i = 0; i < widthArr.length; i++) {
        widthNum += widthArr[i];
      }
    }

    return (
      data ?
        <View style={[
          height && { height },
          widthNum && { width: widthNum },
          styles.row,
          style,
        ]}
        >
          {
            data.map((item, i) => {
              const flex = flexArr && flexArr[i];
              const width = widthArr && widthArr[i];
              const alignItems = alignItemsArr && alignItemsArr[i];
              return (<Cell
                key={i}
                data={item}
                height={AppSizes.paddingXXLarge * 2}
                width={width}
                flex={flex}
                alignItems={alignItems}
                textStyle={textStyle}
                borderStyle={borderStyle}
              />);
            })
          }
        </View>
        : null
    );
  }
}

class Rows extends Component {
  static propTypes = {
    textStyle: Text.propTypes.style,
  }

  render() {
    const { data, style, widthArr, heightArr, flexArr, alignItemsArr, textStyle, borderStyle } = this.props;
    let flexNum = 0;
    let widthNum = 0;
    if (flexArr) {
      for (let i = 0; i < flexArr.length; i++) {
        flexNum += flexArr[i];
      }
    }
    if (widthArr) {
      for (let i = 0; i < widthArr.length; i++) {
        widthNum += widthArr[i];
      }
    }

    return (
      data ?
        <View style={[
          flexNum && { flex: flexNum },
          widthNum && { width: widthNum },
        ]}
        >
          {
            data.map((item, i) => {
              const height = heightArr && heightArr[i];
              return (<Row
                key={i} data={item}
                widthArr={widthArr}
                height={height}
                flexArr={flexArr}
                alignItemsArr={alignItemsArr}
                style={style}
                textStyle={textStyle}
                borderStyle={borderStyle}
              />);
            })
          }
        </View>
        : null
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    overflow: 'hidden',
  },
});

export { Row, Rows };
