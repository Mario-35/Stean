/**
 * TDD for create and write apidoc.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
process.env.NODE_ENV = "test";
import chai from "chai";
import chaiHttp from "chai-http";
import path from "path";
import { createDoc } from "apidoc";
chai.use(chaiHttp);
describe("Create ApiDoc", function () {
    this.timeout(7500);
    it(`write : ${path.resolve(__dirname, "../../server/apidoc")}`, async (done) => {
        try {
            const options: Record<string, any> = {
                src: path.resolve(__dirname, "../../test"),
                dest: path.resolve(__dirname, "../../server/apidoc"),
                template: path.resolve(__dirname, "../../template"),
                silent: false
            };
            const doc = createDoc(options);
            doc.should.not.eql("boolean");
        } catch (error) {
            console.error(error);
        }
        process.exit(111);
    });
});
