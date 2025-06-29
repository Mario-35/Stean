/**
 * TDD for ultime tests API.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
process.env.NODE_ENV = "test";
import chai from "chai";
import chaiHttp from "chai-http";
import { IApiDoc, IApiInput, prepareToApiDoc, generateApiDoc, identification, keyTokenName, limitResult, testVersion } from "./constant";
import { server } from "../../server/index";
import { addPostFile, addStartNewTest, addTest, writeLog } from "./tests";
chai.use(chaiHttp);
const should = chai.should();
const docs: IApiDoc[] = [];
const addToApiDoc = (input: IApiInput) => {
    docs.push(prepareToApiDoc(input));
};
const simple = {
    "header": false,
    "nan": true,
    "columns": {
        "1": {
            "Datastream": 1,
            "FeaturesOfInterest": 1
        }
    }
};
const multi = {
    "header": true,
    "nan": true,
    "columns": {
        "1": {
            "Datastream": "1",
            "FeaturesOfInterest": "1"
        },
        "2": {
            "Datastream": "4",
            "FeaturesOfInterest": "2"
        }
    }
};
addToApiDoc({
    type: "infos",
    short: "Presentation Extension",
    description: `<hr>
    <div class="text">
      <p> You can import a csv file in observations. with one or multiple columns </p>
    </div>`,
    result: ""
});
describe("CSV Import", function () {
    this.timeout(5000);
    let token = "";
    before((done) => {
        addStartNewTest("Import");
        chai.request(server)
            .post(`/test/${testVersion}/login`)
            .send(identification)
            .end((err: Error, res: any) => {
                token = String(res.body["token"]);
                done();
            });
    });
    afterEach(() => {
        writeLog(true);
    });
    it("should return 12 observations added from csv file", (done) => {
        const infos = addTest({
            type: "post",
            short: "CreateObservations with simple csv attached file",
            description: "Import simple csv file",
            reference: "",
            request: `${testVersion}/CreateObservations`,
            params: simple
        });
        chai.request(server)
            .post(`/test/${infos.request}`)
            .field("Content-Type", "multipart/form-data")
            .field("datas", JSON.stringify(infos.params))
            .field("method", "POST")
            .field("nb", "1")
            .attach("file", "./src/test/integration/files/simple.csv")
            .set("Cookie", `${keyTokenName}=${token}`)
            .end((err: Error, res: any) => {
                should.not.exist(err);
                res.should.have.status(201);
                res.body[0].should.eql("Add 12 on 12 lines from simple.csv");
                addToApiDoc({ ...infos, result: limitResult(res) });
                addPostFile(infos);
                done();
            });
    });
    it("should insert 0 observations for duplicates values", (done) => {
        const infos = addTest({
            type: "post",
            short: "CreateObservations with simple csv attached file",
            description: "Import simple csv file",
            reference: "",
            request: `${testVersion}/CreateObservations`,
            params: simple
        });
        chai.request(server)
            .post(`/test/${infos.request}`)
            .field("Content-Type", "multipart/form-data")
            .field("datas", JSON.stringify(infos.params))
            .field("method", "POST")
            .field("nb", "1")
            .attach("file", "./src/test/integration/files/simple.csv")
            .set("Cookie", `${keyTokenName}=${token}`)
            .end((err: Error, res: any) => {
                if (err) console.log(err);
                else {
                    res.should.have.status(201);
                    res.body[0].should.eql("Add 0 on 12 lines from simple.csv");
                }
                should.not.exist(err);
                docs[docs.length - 1].error = JSON.stringify(res.body, null, 4);
                addPostFile(infos);
                done();
            });
    });
    it("should return 10 observations added from csv file", (done) => {
        const infos = addTest({
            type: "post",
            short: "CreateObservations with multi csv attached file",
            description: "Import multi csv file",
            reference: "",
            request: `${testVersion}/CreateObservations`,
            params: multi
        });
        chai.request(server)
            .post(`/test/${infos.request}`)
            .field("Content-Type", "multipart/form-data")
            .field("datas", JSON.stringify(infos.params))
            .field("method", "POST")
            .field("nb", "1")
            .attach("file", "./src/test/integration/files/multi.csv")
            .set("Cookie", `${keyTokenName}=${token}`)
            .end((err: Error, res: any) => {
                if (err) console.log(err);
                else {
                    should.not.exist(err);
                    res.should.have.status(201);
                    res.body[0].should.eql("Add 5 on 5 lines from multi.csv");
                    addToApiDoc({ ...infos, result: limitResult(res) });
                    addPostFile(infos);
                    done();
                }
            });
    });
    it("should insert 0 observations for duplicates values", (done) => {
        const infos = addTest({
            type: "post",
            short: "CreateObservations with multi csv attached file",
            description: "Import multi csv file",
            reference: "",
            request: `${testVersion}/CreateObservations`,
            params: multi
        });
        chai.request(server)
            .post(`/test/${infos.request}`)
            .field("Content-Type", "multipart/form-data")
            .field("datas", JSON.stringify(infos.params))
            .field("method", "POST")
            .field("nb", "1")
            .attach("file", "./src/test/integration/files/multi.csv")
            .set("Cookie", `${keyTokenName}=${token}`)
            .end(function (err, res) {
                if (err) console.log(err);
                else {
                    res.should.have.status(201);
                    res.body[0].should.eql("Add 0 on 5 lines from multi.csv");
                }
                should.not.exist(err);
                docs[docs.length - 1].error = JSON.stringify(res.body, null, 4);
                generateApiDoc(docs, "Import");
                addPostFile(infos);
                done();
            });
    });
});
