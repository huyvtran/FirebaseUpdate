
const getPromotionAllPrice = (skuList) => {
    let promotionPrice = 0;
    skuList.forEach(sku => {
        if (sku.promotionProductInfo) {
            promotionPrice += sku.promotionPrice
        }
    })
    return promotionPrice
}

const getDiscountAllPrice = (skuList) => {
    let discountPrice = 0;
    skuList.forEach(sku => {
        if (sku.discountProductInfo) {
            discountPrice += sku.discountPrice
        }
    })
    return discountPrice
}
const getTotalPriceBeforeVat = (skuList) => {
    let totalPrice = 0;
    if (!skuList || skuList.length == 0)
        return 0;

    skuList.forEach(sku => {
        totalPrice += sku.totalPrice;

    })
    return totalPrice
}

const getVatPrice = (totalPriceBeforeVat) => {
    return totalPriceBeforeVat * 10 / 100
}

const getTotalPrice = (skuList) => {
    const totalPriceBeforeVat = getTotalPriceBeforeVat(skuList)
    return totalPriceBeforeVat + getVatPrice(totalPriceBeforeVat)

}

const getActualPrice = (skuList) => {
    let actualPrice = 0;

    if (!skuList || skuList.length == 0)
        return 0;

    skuList.forEach(sku => {
        actualPrice += sku.actualPrice;
    })

    return actualPrice;


}

const isHasBothCustomerGroupOrPersonal = (discountCustomerList, customer) => {
    return discountCustomerList.filter(discount => {
        return (discount.customerId && discount.customerId._id === customer._id) && (customer.groupIds.filter(group => {
            return discount.customerGroupId && group._id === discount.customerGroupId._id
        }).length > 0)
    }).length > 0
}

export default { getPromotionAllPrice, getDiscountAllPrice, getVatPrice, getTotalPrice, getActualPrice, getTotalPriceBeforeVat, isHasBothCustomerGroupOrPersonal }