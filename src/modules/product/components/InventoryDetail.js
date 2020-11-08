import React, { Component } from 'react';
import { ScrollView, View } from 'react-native';
import messages from '../../../constant/Messages';
import { translateText } from '../../setting/languages/components/translate';
import TranslateText from '../../setting/languages/components/TranslateText';
import ProductHelper from './ProductHelper';
import RowDetail from './RowDetail';


class InventoryDetail extends Component {

    constructor(props) {
        super(props);

    }

    render() {
        const { inventory } = this.props
        return (
            <View style={{ flex: 1 }}>
                <ScrollView>
                    <RowDetail
                        i1={translateText('category')}
                        i2={inventory.categoryIds && inventory.categoryIds.length > 0 && inventory.categoryIds[0] ? inventory.categoryIds[0].categoryName : null}
                    />
                    <RowDetail
                        i1={<TranslateText value={messages.productName} />}
                        i2={inventory.productName}
                    />
                    <RowDetail
                        i1={translateText('volume')}
                        i2={inventory.volume}
                    />
                    <RowDetail
                        i1={translateText('weight')}
                        i2={inventory.weight}
                    />
                    <RowDetail
                        i1={translateText('unit')}
                        i2={inventory.unit}
                    />
                    <RowDetail
                        i1={translateText('temperature')}
                        i2={inventory.temperature && ProductHelper.temperature[inventory.temperature]}
                    />

                    <RowDetail
                        i1={translateText('picked')}
                        i2={inventory.picked}
                    />
                    <RowDetail
                        i1={translateText('reserved')}
                        i2={inventory.reserved}
                    />
                    <RowDetail
                        i1={translateText('on_order')}
                        i2={inventory.onPOrder}
                    />


                </ScrollView>

            </View>
        );
    }
}

export default InventoryDetail;
