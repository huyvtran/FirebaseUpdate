import TestID from "../../constant/TestID";
import en from "../../../src/modules/setting/languages/configs/en";
import TestData from "../../constant/TestData";
import { signIn, signOut, submitDeliveryTask, submitEndTask, submitLoadingTask } from "./Base";
import TaskCode from "../../../src/constant/TaskCode";

let indexDeliveryTask = 0;

describe.only('Delivery submit task', () => {
  it('should login success', signIn);

  it("should have vehicle info after login", async () => {
    await expect(element(by.id(TestID.vehicleViewScreen)))
      .toBeVisible();
    await element(by.id(TestID.gotoTaskListButton))
      .tap();
  });

  // it('should not submit delevery task when loading task is not done', async () => {
  //   await expect(element(by.id(TestID.mainScreen)))
  //     .toBeVisible();
  //
  //   await element(by.id(TestID.taskItemView + "1"))
  //     .tap();
  //
  //   await element(by.id(TestID.addPhotoButton))
  //     .tap();
  //
  //   try {
  //     await expect(element(by.text(en.haveNotLoaddingProduct)))
  //       .toBeVisible();
  //   } catch (error) {
  //     await expect(element(by.text(en.doingAnotherDeliveryTask)))
  //       .toBeVisible();
  //   }
  //
  //   await element(by.text("OK"))
  //     .tap();
  //
  //   await element(by.id(TestID.backButton))
  //     .tap();
  //
  //   await element(by.text("Cancel"))
  //     .tap();
  //
  //
  // });

  it('should submit loading task', async () => {
    await expect(element(by.id(TestID.mainScreen)))
      .toBeVisible();

    await element(by.id(TestID.taskItemView + TaskCode.SOAN_HANG + indexDeliveryTask))
      .tap();
    await submitLoadingTask();
    indexDeliveryTask++;

  });

  it('should submit delivery task', async () => {
    let outIndexDeliveryTask = false;
    do {
      try {
        await waitFor(element(by.id(TestID.taskItemView + TaskCode.GIAO_HANG + indexDeliveryTask)))
          .toBeVisible()
          .whileElement(by.id(TestID.taskListView))
          .scroll(80, "down");
        await element(by.id(TestID.taskItemView + TaskCode.GIAO_HANG + indexDeliveryTask))
          .tap();
        await submitDeliveryTask();
        indexDeliveryTask++;
      } catch (error) {
        console.log("Run in catch: " + error.message);
        outIndexDeliveryTask = true;
      }
    } while (!outIndexDeliveryTask);
  }, 1200000);

  it('should submit end task', async () => {
    await element(by.id(TestID.taskItemView + TaskCode.HET_NGAY + indexDeliveryTask))
      .tap();
    await submitEndTask();
  });

  // it('should logout success', signOut);
});
