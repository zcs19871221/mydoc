import toTestFunction from "./toTestFile";
import { depend1 } from "./depend1";
import depend2 from "./depend2";
import { fromJS } from "immutable";
import moment from "moment";
jest.mock("./depend1", () => {
  return {
    depend1: jest.fn()
  };
});
jest.mock("./depend2", function() {
  return jest.fn();
});
jest.mock("immutable", () => {
  return {
    fromJS: jest.fn()
  };
});
jest.mock("moment", () => {
  return jest.fn();
});

it("测试mock", () => {
  depend1.mockImplementation(() => "doit");
  fromJS.mockImplementation(() => "fromJS");
  moment.mockImplementation(() => "moment");
  depend2.mockImplementation(() => "depend2");
  expect(toTestFunction()).toEqual("doit_fromJS_moment_depend2");
});
it("测试mock，自己加东西", () => {
  depend1.mockImplementation(() => "[doit]");
  fromJS.mockImplementation(() => "[fromJS]");
  moment.mockImplementation(() => "[moment]");
  depend2.mockImplementation(() => "[depend2]");
  expect(toTestFunction()).toEqual("[doit]_[fromJS]_[moment]_[depend2]");
});
