/**
 * TDD for create and write docDatas.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
process.env.NODE_ENV = "test";
import chai from "chai";
import chaiHttp from "chai-http";
import { saveDoc } from "./constant";
import { closeLog } from "./tests";
chai.use(chaiHttp);
describe("Create Datas javascript file for documentation", function () {
    this.timeout(7500);
    it("Write : file", async (done) => {
        try {
            saveDoc();
            closeLog();
        } catch (error) {
            console.error(error);
        }
        done();
    });
    it(`Done All tests done`, () => {
        process.exit(111);
    });
});
