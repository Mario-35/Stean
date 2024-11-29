/* eslint-disable @typescript-eslint/no-explicit-any */
process.env.NODE_ENV = "test";
import chai from "chai";
import chaiHttp from "chai-http";
chai.use(chaiHttp);
import { server } from "../../server/index";
import { testVersion, VERSION, _RAWDB } from "./constant";
import { AddToTestFile } from "./tests";
const should = chai.should();
const n = [_RAWDB.Things.name, _RAWDB.Locations.name, _RAWDB.HistoricalLocations.name, _RAWDB.Datastreams.name, _RAWDB.MultiDatastreams.name, _RAWDB.Sensors.name, _RAWDB.ObservedProperties.name, _RAWDB.Observations.name, _RAWDB.CreateObservations.name, _RAWDB.Loras.name, "literals", "Odatas", "BuiltInFunctions", "BuiltInFilter", "BuiltinDates", "BuiltinMaths" ,"BuiltinGeospatial", "BuiltinMisc", "Various"];
AddToTestFile(`\r\r# <a id="start">TEST : ${new Date().toLocaleDateString()} : ${new Date().toLocaleTimeString()}</a> version[${VERSION}]\r\r`);
AddToTestFile(`${n.map(e => `[${e}](#${e})`)}\r\r`);
describe("Create Test Database.", function () {
    this.timeout(7500);
    it("Create Database", (done) => {
        chai.request(server)
            .get(`/test/${testVersion}/createDBTEST`)
            .end((err: Error, res: any) => {
                if (err) {
                    console.log(res.body);
                    console.error(err);
                }
                should.not.exist(err);
                res.status.should.equal(201);    
                done();
            });
    });
});
