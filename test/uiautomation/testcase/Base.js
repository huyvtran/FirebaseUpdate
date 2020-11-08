import TestID from "../../constant/TestID";
import TestData from "../../constant/TestData";
import en from "../../../src/modules/setting/languages/configs/en";
import TaskCode from "../../../src/constant/TaskCode";

const signIn = async () => {

  await expect(element(by.id(TestID.signInScreen)))
    .toBeVisible();
  await expect(element(by.id(TestID.userNameTextInput)))
    .toBeVisible();
  await element(by.id(TestID.userNameTextInput))
    .replaceText(TestData.username);
  await expect(element(by.id(TestID.passTextInput)))
    .toBeVisible();
  await element(by.id(TestID.passTextInput))
    .replaceText(TestData.password);
  await expect(element(by.id(TestID.signInButton)))
    .toBeVisible();
  await element(by.id(TestID.signInButton))
    .tap();
};

const signOut = async () => {
  await waitFor(element(by.id(TestID.drawerButton)))
    .toBeVisible()
    .withTimeout(3000);
  await element(by.id(TestID.drawerButton))
    .tap();
  await expect(element(by.id(TestID.logoutButton)))
    .toBeVisible();
  await element(by.id(TestID.logoutButton))
    .tap();
  await expect(element(by.id(TestID.signInScreen)))
    .toBeVisible();
};

const submitLoadingTask = async () => {
  await pickImage();
  await element(by.id(TestID.submitTaskButton))
    .tap();
  try {
    await expect(element(by.text(en.notAllowPickTwice)))
      .toBeVisible();
    await element(by.text(en.Ok))
      .tap();
    await element(by.id(TestID.backButton))
      .tap();
  } catch (e) {
    console.log(e.message);
    await expect(element(by.text(en.confirmTakeGoods)))
      .toBeVisible();
    await clickOkAlert();
    await element(by.text("Delivery Confirmation"))
      .tap();

    await element(by.text("Confirm products are taken out of depot"))
      .tap();
    await element(by.id(TestID.submitTaskButton))
      .tap();
    await clickOkAlert();

    await element(by.text("Checkout depot"))
      .tap();

    await element(by.id(TestID.submitTaskButton))
      .tap();

    await expectTaskSubmittedSuccess();
  }


};

const submitDeliveryTask = async () => {
  await pickImage();

  await waitFor(element(by.id(TestID.orderStatusView)))
    .toBeVisible()
    .whileElement(by.id(TestID.taskDetailView))
    .scroll(320, "down");

  const statusRandom = Math.random();
  if (statusRandom % 2 === 0) {
    await element(by.text(en.completed))
      .tap();
  } else {
    await element(by.text(en.partlyDeliver))
      .tap();
  }
  await element(by.id(TestID.submitTaskButton))
    .tap();
  await clickOkAlert();
  await expectTaskSubmittedSuccess();

};

const submitEndTask = async () => {
  await pickImage();
  await element(by.text("Xác nhận trạng thái"))
    .tap();

  await element(by.text("Xác nhận đã trả hàng và trả tiền"))
    .tap();
  await element(by.id(TestID.submitTaskButton))
    .tap();
  await expectTaskSubmittedSuccess();

};

const pickImage = async () => {
  await element(by.id(TestID.addPhotoButton))
    .tap();
  try {
    await element(by.text(en.Ok))
      .tap();
  } catch (e) {

  }
};

const clickOkAlert = async () => {
  await waitFor(element(by.text("OK")))
    .toBeVisible()
    .withTimeout(3000);
  await element(by.text("OK"))
    .tap();
};

const expectTaskSubmittedSuccess = async () => {
  await waitFor(element(by.text(en.submitSuccess)))
    .toBeVisible()
    .withTimeout(3000);

};

export {
  signIn,
  signOut,
  submitLoadingTask,
  submitDeliveryTask,
  submitEndTask,
  clickOkAlert,
  expectTaskSubmittedSuccess
};