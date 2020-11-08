import _ from 'lodash'

const getOrderIdFromTask = (taskList) => {
    let orderIds = [];
    if (taskList && taskList.length > 0) {
        taskList.forEach(task => {
            task.orderList.forEach(order => {
                orderIds.push(order._id);
            });
        });
    }

    return orderIds;
}

const getProductListFromOrders = (orders) => {
    let products = [];
    if (orders && orders.length > 0) {
        orders.forEach(order => {
            products = products.concat(order.skuList);
        })
    }

    return uniqProductInOrderList(products)
}

const uniqProductInOrderList = (products) => {
    const productUniqs = _.uniqBy(products, product => {
        return product.sku;
    })

    return productUniqs.map(productUniq => {
        let numberOfCase = 0;
        let numberOfItem = 0;
        let numberOfCaseDelivered=0;
        let numberOfItemDelivered=0;
        products.forEach(product => {
            if (product.sku === productUniq.sku) {
                numberOfCase += product.numberOfCase
                numberOfItem += product.numberOfItem
                numberOfCaseDelivered+=product.numberOfCaseDelivered
                numberOfItemDelivered+=product.numberOfItemDelivered
            }
        })
        return { ...productUniq, numberOfCase, numberOfItem ,numberOfCaseDelivered,numberOfItemDelivered}
    })
}

const findOrderContainProduct = (orders, product) => {
    return orders.filter(order => {
        let indexOrder = _.findIndex(order.skuList, sku => {
            return sku.sku === product.sku;
        })
        return indexOrder >= 0;
    })
}

const calculateTripOrder = (ordersToday, tasksToday, taskDetail) => {
    const taskDataList = tasksToday.filter(task => {
        return task.routeDetailId === taskDetail.task.routeDetailId
    })
    const orderIds = getOrderIdFromTask(taskDataList)

    const result = ordersToday.filter(order => {
        return _.includes(orderIds, order._id)
    })

    return result

}

export default { getOrderIdFromTask, getProductListFromOrders, findOrderContainProduct, calculateTripOrder }