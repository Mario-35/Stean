/* eslint-disable @typescript-eslint/no-explicit-any */
process.env.NODE_ENV = "test";

import chai from "chai";
import chaiHttp from "chai-http";

chai.use(chaiHttp);

import { server } from "../../server/index";
import { testVersion } from "./constant";
import { closeLog } from "./tests";

const should = chai.should();

describe("Delete test Database", function () {
    it("Delete test Database", (done) => {
        closeLog();
        chai.request(server)
        .get(`/test/${testVersion}/removedbtest`)
        .end((err: Error, res: any) => {                 
                if (err) {
                    console.log(res.body);                    
                    console.error(err);
                }
                should.not.exist(err);
                done();
            });
    });
});
