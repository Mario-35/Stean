/**
 * TDD for create and write apidoc.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
process.env.NODE_ENV = "test";
// onsole.log("!----------------------------------- TDD for create and write apidoc. -----------------------------------!");
import chai from "chai";
import chaiHttp from "chai-http";
import path from "path";
import { createDoc } from "apidoc";

chai.use(chaiHttp);

describe("Create ApiDoc", () => {
    it(`write : ${path.resolve(__dirname, "../../server/apidoc")}`, async (done) => {
        try {
            const doc = createDoc({
                src: path.resolve(__dirname, "../../test"),
                dest: path.resolve(__dirname, "../../server/apidoc"),
                template: path.resolve(__dirname, "../../template"),
                silent: false
            });
            doc.should.not.eql("boolean");
        } catch (error) {
            console.error(error);
        }
        done();
    });
});


