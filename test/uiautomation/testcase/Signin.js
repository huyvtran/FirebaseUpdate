import TestID from "../../constant/TestID";
import en from "../../../src/modules/setting/languages/configs/en";
import TestData from "../../constant/TestData";
import {signIn, signOut} from "./Base";

describe.only('Sign in - submit task - sign out', () => {
  it('should login success', signIn);

  it('should submit task success', async () => {
    await expect(element(by.id(TestID.mainScreen)))
      .toBeVisible();
    await element(by.id(TestID.taskItemView + "1"))
      .tap();
    await element(by.id(TestID.submitTaskButton))
      .tap();
    await expect(element(by.text(en.submitSuccess)))
      .toBeVisible();

  });

  it('should logout success', signOut);
});
