/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * TDD for things API.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
process.env.NODE_ENV = "test";

import chai from "chai";
import chaiHttp from "chai-http";
import { IApiDoc, generateApiDoc, IApiInput, prepareToApiDoc, defaultGet, limitResult, testVersion } from "./constant";
import { server } from "../../server/index";
import { addStartNewTest, addTest, writeLog } from "./tests";


chai.use(chaiHttp);

const should = chai.should();

const docs: IApiDoc[] = [];

const addToApiDoc = (input: IApiInput) => {
    docs.push(prepareToApiDoc(input, "BuiltInMath"));
};

addToApiDoc({
    api: `{infos} /BuiltInMath Infos`,
    apiName: "InfosBuiltInMath",
    apiDescription: `The OGC SensorThings API supports a set of functions that can be used with the $filter or $orderby query operations. The following table lists the available functions and they follows the OData Canonical function definitions listed in Section 5.1.1.4 of the [OData Version 4.0 Part 2: URL Conventions] and the syntax rules for these functions are defined in [OData Version 4.0 ABNF].`,
        apiReference: "https://docs.ogc.org/is/18-088/18-088.html#_built_in_query_functions",
    result: ""
});
   
describe("Odata BuiltInMath [9.3.3.5.2]", () => {
    before((done) => {
        addStartNewTest("Built in Maths");
		done();
	});
	afterEach(() => { writeLog(true); });
    it("round(result) eq 63", (done) => {
        const infos = addTest({
            api: "{get} Observations Round",
            apiName: "BuiltInMathRound",
            apiDescription: "The round function rounds the input numeric parameter to the nearest numeric value with no decimal component. The mid-point between two integers is rounded away from zero, i.e. 0.5 is rounded to 1 and ‑0.5 is rounded to -1.",
            apiReference: "https://docs.ogc.org/is/18-088/18-088.html#_built_in_query_functions",
            apiExample: { 
                            http: `${testVersion}/Observations?$filter=round(result) eq 63`,
                            curl: defaultGet("curl", "KEYHTTP"),
                            javascript: defaultGet("javascript", "KEYHTTP"),
                            python: defaultGet("python", "KEYHTTP") 
                        }
        });
        chai.request(server)
            .get(`/test/${infos.apiExample.http}`)
            .end((err: Error, res: any) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                res.body.value.length.should.eql(3);
                addToApiDoc({ ...infos, result: limitResult(res) });                
                done();
            });
    });

    it("floor(result) eq 63", (done) => {
        const infos = addTest({
            api: "{get} Observations Floor",
            apiName: "BuiltInMathFloor",
            apiDescription: "The floor function rounds the input numeric parameter down to the nearest numeric value with no decimal component. The floorMethodCallExpr syntax rule defines how the floor function is invoked.",
            apiReference: "https://docs.ogc.org/is/18-088/18-088.html#_built_in_query_functions",
            apiExample: { 
                            http: `${testVersion}/Observations?$filter=floor(result) eq 63`,
                            curl: defaultGet("curl", "KEYHTTP"),
                            javascript: defaultGet("javascript", "KEYHTTP"),
                            python: defaultGet("python", "KEYHTTP") 
                        }
        });
        chai.request(server)
            .get(`/test/${infos.apiExample.http}`)
            .end((err: Error, res: any) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                res.body.value.length.should.eql(1);
                addToApiDoc({ ...infos, result: limitResult(res) });
                
                done();
            });
    });

    it("ceiling(result) eq 63", (done) => {
        const infos = addTest({
            api: "{get} Observations Ceiling",
            apiName: "BuiltInMathCeiling",
            apiDescription: "The ceiling function rounds the input numeric parameter up to the nearest numeric value with no decimal component. The ceilingMethodCallExpr syntax rule defines how the ceiling function is invoked.",
            apiReference: "https://docs.ogc.org/is/18-088/18-088.html#_built_in_query_functions",
            apiExample: { 
                http: `${testVersion}/Observations?$filter=ceiling(result) eq 63`,
                            curl: defaultGet("curl", "KEYHTTP"),
                            javascript: defaultGet("javascript", "KEYHTTP"),
                            python: defaultGet("python", "KEYHTTP") 
                        }
        });
        chai.request(server)
            .get(`/test/${infos.apiExample.http}`)
            .end((err: Error, res: any) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                res.body.value.length.should.eql(3);
                addToApiDoc({ ...infos, result: limitResult(res) });
                
                done();
            });
    });

    it("Save and write apiDoc", (done) => {
        generateApiDoc(docs, "apiDocBuiltInMath.js");
                done();
    });

});

