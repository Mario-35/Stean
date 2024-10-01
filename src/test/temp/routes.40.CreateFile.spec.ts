/**
 * TDD for ultime tests API.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
process.env.NODE_ENV = "test";
// onsole.log("!----------------------------------- TDD for ultime tests API. -----------------------------------!\n");

import chai from "chai";
import chaiHttp from "chai-http";
import { IApiDoc, IApiInput, prepareToApiDoc, identification, keyTokenName, limitResult, testVersion, generateApiDoc, _RAWDB, testLog } from "../integration/constant";
import { server } from "../../server/index";
import { Ientity } from "../../server/types";
import { executeQuery } from "../integration/executeQuery";
import { addStartNewTest, addTest } from "../integration/tests";

chai.use(chaiHttp);

const should = chai.should();

const docs: IApiDoc[] = [];
const entity: Ientity = _RAWDB.CreateFile;
let id = 0;

const addToApiDoc = (input: IApiInput) => {
    docs.push(prepareToApiDoc(input, "CreateFile"));
};

addToApiDoc({
    api: `{infos} /Import info.`,
    apiName: "InfosCreateFile",
    apiDescription: `<hr>
    <div class="text">
      <p>
      You can import a csv file as an observations.
      with one or multiple columns
      </p>
    </div>`,
    result: ""
});

describe(`CSV ${entity.name}`, function () {
    this.timeout(5000);
    let token = "";
    let thingId = 0;
    before((done) => {        
        addStartNewTest(entity.name);
        chai.request(server)
            .post(`/test/${testVersion}/login`)
            .send(identification)
            .end((err: Error, res: any) => {
                token = String(res.body["token"]);
                done();
            });
    });

    it(`Create Thing For createFile`, (done) => {
        const datas = {
            "name": "Thing createFile2",
            "description": "Create Thing for testing createFile",
            "properties": {
                "organization": "Mozilla",
                "owner": "Mozilla"
            }
        };
        chai.request(server)
            .post(`/test/${testVersion}/Things`)
            .send(datas)
            .set("Cookie", `${keyTokenName}=${token}`)
            .end((err: Error, res: any) => {
                should.not.exist(err);
                res.status.should.equal(201);
                res.type.should.equal("application/json");                
                thingId = res.body["@iot.id"];
                done();
            });
    });    

    it("Should return The Datastreams create to ingest csv file", (done) => {
        const infos = addTest({
            api: `{post} ${entity.name} with csv attached file`,
            apiName: `${entity.name}Post`,
            apiDescription: "Import csv file",
            apiExample: { 
                http: `/${testVersion}/${entity.name}(${thingId})`
            }
        });
        chai.request(server)
            .post(`/test/${infos.apiExample.http}`)
            .field("Content-Type", "multipart/form-data")
            .field("method", "POST")
            .field("nb", "1")
            .attach("file", "./src/test/integration/files/file.csv")
            .set("Cookie", `${keyTokenName}=${token}`)
            .end(async (err: Error, res: any) => {                
                if (err) console.log(err);
                else {
                    should.not.exist(err);
                    res.should.have.status(201);
                    id = res.body["@iot.id"];
                    res.body["description"].should.contain("file.csv");
                    await executeQuery(`SELECT count(*)::int FROM ${_RAWDB.Observations.table} WHERE "datastream_id"=${id}`).then((test: Record<string, any>) => {
                        test["count"].should.eql(25);
                        addToApiDoc({ ...infos, result: limitResult(res) });
                        done();
                    })
                    .catch((err) => console.log(err));
                }
            });
    });

    it("Should return The Datastreams updated for file", (done) => {
        const infos = addTest({
            api: `{post} ${entity.name} with same csv attached file [duplicate]`,
            apiName: `${entity.name}PostDuplicate`,
            apiDescription: "Import csv file [duplicate]",
            apiExample: { http: `/${testVersion}/${entity.name}(${thingId})` },
        });
        chai.request(server)
            .post(`/test${infos.apiExample.http}`)
            .field("Content-Type", "multipart/form-data")
            .field("method", "POST")
            .field("nb", "22")
            .attach("file", "./src/test/integration/files/duplicates/file.csv")
            .set("Cookie", `${keyTokenName}=${token}`)
            .end(async (err: Error, res: any) => {
                console.log(res.body);
                testLog(res.body);

                if (err) testLog(err);
                if (err) console.log(err);
                else {
                    should.not.exist(err);
                    res.should.have.status(201);
                    res.body["@iot.id"].should.eql(id);
                    executeQuery(`SELECT count(*)::int FROM "${_RAWDB.Observations.table}" WHERE "datastream_id" = ${id}`).then((test: Record<string, any>) => {
                        test["count"].should.eql(24);
                        addToApiDoc({ ...infos, result: limitResult(res) });
                        generateApiDoc(docs, `apiDoc${entity.name}.js`);
                        done();
                    })
                    .catch((err) => console.log(err));
                }
            });
            
    });

});