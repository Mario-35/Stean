process.env.NODE_ENV = "test";
import chai from "chai";
import chaiHttp from "chai-http";
import resourcePath from '../../server/odata/parser/resourcePath';
import { testLog } from "./constant";

chai.use(chaiHttp);
const cases = require('./files/cases.json');
const expect = require('chai').expect;
import { addSimpleTest, addStartNewTest, writeLog } from "./tests";

describe("Odata decode", () => {
  before((done) => {
      addStartNewTest("decode");
    done();
  });


  cases.forEach((item: any, index: number, array: any) => {
    const title = 'Should parse ' + item['-Name'] + ': ' + item.input;
    it(title,  (done) => {
      addSimpleTest(title);
      const raw = new Uint16Array(item.input.length);
      for (let i = 0; i < item.input.length; i++) {
        raw[i] = item.input.charCodeAt(i);
      }
      const token =  resourcePath.resourcePath(raw, 0);
      testLog(`--------------------------> ${item.input}`)
      testLog(token)
      if (item.hasOwnProperty("result_error")) {
        expect(token).to.be.undefined;
        return;
      }
      // expect(token?.type).equal(item["result"].type);
      // expect(token?.value).equal(item["result"].value);
      writeLog(true);
    });
  });
});