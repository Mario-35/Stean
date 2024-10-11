process.env.NODE_ENV = "test";
import chai from "chai";
import chaiHttp from "chai-http";
chai.use(chaiHttp);
const cases = require('./files/primitive-cases.json');
const expect = require('chai').expect;
import PrimitiveLiteral from '../../server/odata/parser/primitiveLiteral';
import { addSimpleTest, addStartNewTest, writeLog } from "./tests";
describe("Primitive literals", () => {
  before((done) => {
      addStartNewTest("literals");
    done();
  });

cases.forEach((item: any, index: number, array: any) => {
  const title = 'Should parse ' + item['-Name'] + ': ' + item.input;
  it(title,  () => {
    addSimpleTest(title);
    const raw = new Uint16Array(item.input.length);
    for (let i = 0; i < item.input.length; i++) {
      raw[i] = item.input.charCodeAt(i);
    }
    const token =  PrimitiveLiteral.primitiveLiteral(raw, 0);
    if (item.hasOwnProperty("result_error")) {
      expect(token).to.be.undefined;
      return;
    }
    expect(token?.type).equal(item["result"].type);
    expect(token?.value).equal(item["result"].value);
    writeLog(true);
  });
});
});



  //   Object.keys(tests).forEach((test: string) => {
  //       it(test, (done) => {
  //           addTest({ api: `result => ${+tests[test]} : `, apiName: "", apiDescription: "", apiReference: "", apiExample: { http: test, } });
  //           chai.request(server)
  //               .get(test)
  //               .end((err: Error, res: any) => {
  //                   should.not.exist(err);
  //                   res.status.should.equal(200);
  //                   res.type.should.equal("application/json");
  //                   res.body["@iot.count"].should.eql(+tests[test]);					                    
  //                   done();
  //               });
  //       });
  //   });
  // });




  // describe('Primitive literals from json', () => {  
  //   cases.forEach((item: any, index: number, array: any) => {
  //     const title = '#' + index + ' should parse ' + item['-Name'] + ': ' + item.input;
  //     it(title, () => {
  //       const raw = new Uint16Array(item.input.length);
  //       for (let i = 0; i < item.input.length; i++) {
  //           raw[i] = item.input.charCodeAt(i);
  //       }
  //       const token =  PrimitiveLiteral.primitiveLiteral(raw, 0);
  //       if (item.hasOwnProperty("result_error")) {
  //         expect(token).to.be.undefined;
  //         return;
  //       }
  //       expect(token?.type).equal(item["result"].type);
  //       expect(token?.value).equal(item["result"].value);
  //     });
  //   });
  // });