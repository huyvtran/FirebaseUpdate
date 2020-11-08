// TranslateText.js

import React from 'react';
import { Component } from 'react';
import { Text, TextProps } from 'react-native';
import { connect } from 'react-redux';
import { AbstractProps, AbstractStates } from '../../../../base/AbstractProperty';
import { Localize } from '../LanguageManager';

interface Props extends AbstractProps {
  params: { style: TextProps, numberOfLines: number };
  value: string;
}

interface States extends AbstractStates {

}

class TranslateText extends Component<Props, States> {
  static defaultProps = {
    params: {},
  };

  render() {
    return (
      <Text style={this.props.params.style} numberOfLines={this.props.params.numberOfLines ? this.props.params.numberOfLines : 5}>
        {Localize(this.props.value)}
      </Text>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  i18n: state.i18n,
  ...ownProps,
});

export default connect(mapStateToProps)(TranslateText);

