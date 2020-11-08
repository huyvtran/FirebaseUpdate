// import OrderControl from "../OrderControl";
// import OrderDataTest from "./OrderDataTest";

// test('test get VAT price', () => {
//     const vatPrice = OrderControl.getVatPrice(17000)
//     expect(vatPrice).toEqual(1700);
// });

// test('test get total price befor VAT', () => {
//     const vatPrice = OrderControl.getTotalPriceBeforeVat(OrderDataTest.SKU_LIST_IN_ORDER)
//     expect(vatPrice).toEqual(365000);
// });

// test('test get total price', () => {
//     const vatPrice = OrderControl.getTotalPrice(OrderDataTest.SKU_LIST_IN_ORDER)
//     expect(vatPrice).toEqual(401500);
// });

// test('check discount list has both groupId and customer id of one customer', () => {
//     const isValid = OrderControl.isHasBothCustomerGroupOrPersonal(OrderDataTest.PROMOTION_LIST, OrderDataTest.CUSTOMER_SELECTED)
//     expect(isValid).toEqual(true);
// });