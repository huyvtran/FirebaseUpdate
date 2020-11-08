import React, { Component } from 'react';
import { Text } from 'react-native';
import { connect } from 'react-redux';

const _ = require('lodash');

class TextHtml extends Component {
  find(obj) {
    if (_.isObject(obj) && obj.key === 'S0') return obj;
    if (_.isArray(obj)) return _.find(obj, (item) => this.find(item));
    if (obj.components) return _.find(obj.components, (item) => this.find(item));
    if (obj.columns) return _.find(obj.columns, (item) => this.find(item));
  }
  render() {
    const tim = this.find(this.props.components);
    const tim2 = this.find(tim);
    const tim3 = this.find(tim2);
    const tim4 = this.find(tim3);
    const content = this.props.customConditional ? tim4.defaultValues && tim4.defaultValues.value :
      this.props.content;
    return (
      <Text>{content}</Text>
    );
  }
}

export default connect(state => ({ components: state.task.taskDetail.components }))(TextHtml);
