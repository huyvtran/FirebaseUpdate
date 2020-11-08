import React, { Component } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';

import { Marker } from 'react-native-maps';
function MarkerImage({ coordinate, key = 0, description = '', title = '', renderMarker, renderCalloutMarker }) {
    return <Marker
        key={key}
        coordinate={coordinate}
        description={description}
        title={title}
    >
        {renderMarker && renderMarker}
        {renderCalloutMarker && renderCalloutMarker}
    </Marker >
}

export default MarkerImage
