export const fulfillments = [
  {
    code: 1,
    text: 'Not Fulfilled', // ""
  }, {
    code: 2,
    text: 'Fulfilled', // "Fulfilled"
  }, {
    code: 3,
    text: 'Partially Fulfilled', // "Partially Fulfilled"
  }, {
    code: 4,
    text: 'Unfulfilled', // "Unfulfilled"
  },
];
  
export const saleOrderStatus = [{
  code: 1,
  text: 'Open', // "Open"
}, 
// {
//   code: 2,
//   text: 'Picking & Packing', // "Picking & Packing"
// },
 {
  code: 3,
  text: 'Picked & Packed', // "Picked & Packed"
}, 
// {
//   code: 4,
//   text: 'Shipping', // "Shipping"
// }, 
{
  code: 5,
  text: 'Shipped', // "Shipped"
}, {
  code: 6,
  text: 'Canceled', // "Canceled"
}];
  
export const purchaseOrderStatus = [{
  code: 1,
  text: 'Open', // "Open"
}, 
// {
//   code: 2,
//   text: 'Receiving', // "Receiving"
// }, 
{
  code: 3,
  text: 'Received', // "Received"
}, 
// {
//   code: 4,
//   text: 'Putting Away', // "Putting Away"
// }, 
{
  code: 5,
  text: 'Put Away', // "Put Away"
}, {
  code: 6,
  text: 'Canceled', // "Canceled"
}, {
  code: 7,
  text: 'Returned', // "Returned"
}];
  
export const saleOrderRuleToFulfillments = {
  1: [1],
  2: [1],
  3: [1],
  4: [1],
  5: [2, 3, 4],
  6: [0],
};
  
export const purchaseOrderRuleToFulfillments = {
  1: [1],
  2: [1],
  3: [2, 3],
  4: [2, 3],
  5: [2, 3],
  6: [4],
  7: [0],
};

export const saleOrderRule = {
  1: [1, 3, 6],
  3: [3, 5, 6],
  5: [5],
  6: [6],
};
export const purchaseOrderRule = {
  1: [1, 3, 6, 7],
  3: [3, 5, 6],
  5: [5],
  6: [6],
  7: [7],
};

export const orderFilter = (status, isPurchase) => (!isPurchase ?
  saleOrderStatus.filter(e => e.code == status) :
  purchaseOrderStatus.filter(e => e.code == status));
  
export const fulfillmentsFilter = (status) => fulfillments.filter(e => e.code == status);

export const orderRuleFilter = (status, isPurchase) => {
  const groupSaleOrder = saleOrderRule[status];
  const groupPurchaseOrder = purchaseOrderRule[status];
  return !isPurchase ? 
    saleOrderStatus.filter(e => groupSaleOrder.indexOf(e.code) !== -1) :
    purchaseOrderStatus.filter(e => groupPurchaseOrder.indexOf(e.code) !== -1);
};

export const orderRuleToFulfillmentsFilter = (status, isPurchase) => {
  const groupSaleFulfillments = saleOrderRuleToFulfillments[status];
  const groupPurchaseFulfillments = purchaseOrderRuleToFulfillments[status];
  return !isPurchase ?
    fulfillments.filter(e => groupSaleFulfillments.indexOf(e.code) !== -1) :
    fulfillments.filter(e => groupPurchaseFulfillments.indexOf(e.code) !== -1);
};
