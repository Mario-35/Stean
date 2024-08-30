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
    docs.push(prepareToApiDoc(input, "BuiltInFunctions"));
};

addToApiDoc({
    api: `{infos} /BuiltInFunctions Infos`,
    apiName: "InfosBuiltInFunctions",
    apiDescription: `The OGC SensorThings API supports a set of functions that can be used with the $filter or $orderby query operations. The following table lists the available functions and they follows the OData Canonical function definitions listed in Section 5.1.1.4 of the [OData Version 4.0 Part 2: URL Conventions] and the syntax rules for these functions are defined in [OData Version 4.0 ABNF].`,
          apiReference: "https://docs.ogc.org/is/18-088/18-088.html#_built_in_filter_operations",
    result: ""
});
   
describe("Odata BuiltInFunctions [9.3.3.5.2]", () => {
    before((done) => {
        addStartNewTest("Built in Functions");
		done();
	});
	afterEach(() => { writeLog(true); });
    it("substringof('name', 'chamber') eq true ", (done) => {
        const infos = addTest({
            api: "{get} Things(:id) substringof",
            apiName: "BuiltInFunctionsSubstringof",
            apiDescription: "This string function filters all the records that contain with string in property.",
            apiReference: "https://docs.ogc.org/is/18-088/18-088.html#_built_in_filter_operations",
            apiExample: { 
                http: `${testVersion}/Things?$filter=substringof('description', 'chamber') eq true`,
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
                res.body["value"][0]["@iot.id"].should.eql(6);
                addToApiDoc({ ...infos, result: limitResult(res) });
                
                done();
            });
    });

    it("substringof('name', 'with')", (done) => {
        const infos = addTest({
            api: `{get} substringof('name', 'with')`,
            apiName: "",
            apiDescription: "",
            apiReference: "",
            apiExample: {
                        http: `${testVersion}/Things?$filter=substringof('name', 'with')`,
					}
				});
        chai.request(server)
            .get(`/test/${infos.apiExample.http}`)
            .end((err: Error, res: any) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                res.body.value.length.should.eql(3);
                res.body["value"][0]["@iot.id"].should.eql(13);
                
                done();
            });
    });

    it("endwith('name', 'Thing') eq true", (done) => {
        const infos = addTest({
            api: "{get} Things(:id) endwith",
            apiName: "BuiltInFunctionsEndwith",
            apiDescription: "This string function filters all the records that column name ends with the string in the property.",
            apiReference: "https://docs.ogc.org/is/18-088/18-088.html#_built_in_filter_operations",
            apiExample: { 
                http: `${testVersion}/Things?$filter=endswith('name', 'Thing') eq true`,
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
                res.body.value.length.should.eql(5);
                res.body["value"][0]["@iot.id"].should.eql(1);
                addToApiDoc({ ...infos, result: limitResult(res) });
                
                done();
            });
    });

    it("endwith('description', 'one')", (done) => {
        const infos = addTest({
            api: `{get} endwith('description', 'one')`,
            apiName: "",
            apiDescription: "",
            apiReference: "",
            apiExample: {
                        http: `${testVersion}/Things?$filter=endswith('description', 'Thing')`,
					}
				});
        chai.request(server)
            .get(`/test/${infos.apiExample.http}`)
            .end((err: Error, res: any) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                res.body.value.length.should.eql(6);
                res.body["value"][0]["@iot.id"].should.eql(1);
                
                done();
            });
    });

    it("startswith('name', 'Temperature') eq true", (done) => {
        const infos = addTest({
            api: "{get} Things(:id) startswith",
            apiName: "BuiltInFunctionsStartswith",
            apiDescription: "This string function filters all the records that starts with the string in the property.",
            apiReference: "https://docs.ogc.org/is/18-088/18-088.html#_built_in_filter_operations",
            apiExample: { 
                http: `${testVersion}/Sensors?$filter=startswith('name', 'Hack') eq true`,
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
                res.body["value"][0]["@iot.id"].should.eql(5);
                addToApiDoc({ ...infos, result: limitResult(res) });
                
                done();
            });
    });

    it("startswith('name', 'Temperature')", (done) => {
        const infos = addTest({
            api: `{get} endwith(description, 'one')`,
            apiName: "",
            apiDescription: "",
            apiReference: "",
            apiExample: {
                http: `${testVersion}/Datastreams?$filter=startswith('name', 'Outlet')`,
            }
        });
        chai.request(server)
            .get(`/test/${infos.apiExample.http}`)
            .end((err: Error, res: any) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                res.body.value.length.should.eql(2);
                res.body["value"][0]["@iot.id"].should.eql(9);
                
                done();
            });
    });

    it("length(description) le 22", (done) => {
        const infos = addTest({
            api: "{get} Things(:id) Length",
            apiName: "BuiltInFunctionsLength",
            apiDescription: "This string function return the length of the parameters to be test in filter.",
            apiReference: "https://docs.ogc.org/is/18-088/18-088.html#_built_in_filter_operations",
            apiExample: { 
                http: `${testVersion}/Things?$filter=length(description) le 25`,
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
                res.body["value"][0]["@iot.id"].should.eql(7);
                addToApiDoc({ ...infos, result: limitResult(res) });
                
                done();
            });
    });

    it("indexof('name', 'Temperature') eq 1", (done) => {
        const infos = addTest({
            api: "{get} indexof",
            apiName: "BuiltInFunctionsIndexOf",
            apiDescription: "This string function return the index of the parameters in the column.",
            apiReference: "https://docs.ogc.org/is/18-088/18-088.html#_built_in_filter_operations",
            apiExample: { 
                http: `${testVersion}/Things?$filter=indexof('name', 'Piezo') eq 1`,
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
                res.body.value.length.should.eql(2);
                res.body["value"][0]["@iot.id"].should.eql(9);
                addToApiDoc({ ...infos, result: limitResult(res) });
                
                done();
            });
    });

    it("substring('name', 1) eq 'ame of new Things 1'", (done) => {
        const infos = addTest({
            api: "{get} Things substring(str, nb)",
            apiName: "BuiltInFunctionsSubstringOne",
            apiDescription: "This string function filters all the records that contain with part of the string extract all characters from a particular position of a column name .",
            apiReference: "https://docs.ogc.org/is/18-088/18-088.html#_built_in_filter_operations",
            apiExample: { 
                http: `${testVersion}/Things?$filter=substring('name', 1) eq 'hing with new Location test'`,
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
                res.body["value"][0]["@iot.id"].should.eql(13);
                addToApiDoc({ ...infos, result: limitResult(res) });
                
                done();
            });
    });
    
    it("substring('description', 10, 6) eq 'outlet'", (done) => {
        const infos = addTest({
            api: "{get} Things substring(str, index, nb)",
            apiName: "BuiltInFunctionsSubstringTwo",
            apiDescription: "This string function filters all the records that contain with part of the string extract by specific number of characters from a particular position of a column name .",
            apiReference: "https://docs.ogc.org/is/18-088/18-088.html#_built_in_filter_operations",
            apiExample: { 
                http: `${testVersion}/Things?$filter=substring('description', 10, 6) eq 'outlet'`,
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
                res.body.value.length.should.eql(2);
                res.body["value"][0]["@iot.id"].should.eql(7);
                addToApiDoc({ ...infos, result: limitResult(res) });
                
                done();
            });
    });

    it("tolower('name') eq 'sensorwebthing 2'", (done) => {
        const infos = addTest({
            api: "{get} Things toLower",
            apiName: "BuiltInFunctionsTolower",
            apiDescription: "This string function return string whose characters are going to be converted to lowercase.",
            apiReference: "https://docs.ogc.org/is/18-088/18-088.html#_built_in_filter_operations",
            apiExample: { 
                http: `${testVersion}/Things?$filter=tolower('name') eq 'piezo f5b'`,
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
                res.body["value"][0]["@iot.id"].should.eql(9);
                addToApiDoc({ ...infos, result: limitResult(res) });
                
                done();
            });
    });
    
    it("toupper('name') eq 'PIEZOMETER F4'", (done) => {
        const infos = addTest({
            api: "{get} Things toUpper",
            apiName: "BuiltInFunctionsToUpper",
            apiDescription: "This string function return string whose characters are going to be converted to uppercase.",
            apiReference: "https://docs.ogc.org/is/18-088/18-088.html#_built_in_filter_operations",
            apiExample: { 
                http: `${testVersion}/Things?$filter=toupper('name') eq 'PIEZOMETER F4'`,
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
                res.body["value"][0]["@iot.id"].should.eql(10);
                addToApiDoc({ ...infos, result: limitResult(res) });
                
                done();
            });
    });

    it("trim('name') eq 'Piezo F5b'", (done) => {
        const infos = addTest({
            api: "{get} Things trim",
            apiName: "BuiltInFunctionsTrim",
            apiDescription: "This string function return string with removed spaces from both side from a string.",
            apiReference: "https://docs.ogc.org/is/18-088/18-088.html#_built_in_filter_operations",
            apiExample: { 
                http: `${testVersion}/Things?$filter=trim('name') eq 'Piezo F5b'`,
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
                res.body["value"][0]["@iot.id"].should.eql(9);
                addToApiDoc({ ...infos, result: limitResult(res) });
                
                done();
            });
    });

    // it("trim('name', 'Piezo ') eq '2'", (done) => {
    //     const infos = addTest({
    //         api: "{get} Things trimParams",
    //         http: `${testVersion}/Things?$filter=trim('name', 'Piezo ') eq '2'`,
    //         apiName: "BuiltInFunctionsTrimWithParams",
    //         apiDescription: "This string function return string with removed spaces from both side from a string.",
    //         apiReference: "https://docs.ogc.org/is/18-088/18-088.html#_built_in_filter_operations",
    //         apiExample: { 
    //                         curl: defaultGet("curl", "KEYHTTP"),
    //                         javascript: defaultGet("javascript", "KEYHTTP"),
    //                         python: defaultGet("python", "KEYHTTP") 
    //                     }
    //     };
    //     chai.request(server)
    //         .get(`/test/${infos.apiExample.http}`)
    //         .end((err: Error, res: any) => {
    //             should.not.exist(err);
    //             res.status.should.equal(200);
    //             res.type.should.equal("application/json");
    //             res.body.value.length.should.eql(1);
    //             res.body["value"][0]["@iot.id"].should.eql(2);
    //             addToApiDoc({ ...infos, result: limitResult(res) });
    //             
    //             done();
    //         });
    // });

    it("concat('name', 'test') eq 'MultiDatastreams SensorWebThing 10test'", (done) => {
        const infos = addTest({
            api: "{get} Things concat",
            apiName: "BuiltInFunctionsConcat",
            apiDescription: " 	The concat function returns a string that appends the second input parameter string value to the first.",
            apiReference: "https://docs.ogc.org/is/18-088/18-088.html#_built_in_filter_operations",
            apiExample: { 
                http: `${testVersion}/Things?$filter=concat('name', 'test') eq 'Piezometer F4test'`,
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
                res.body["value"][0]["@iot.id"].should.eql(10);
                addToApiDoc({ ...infos, result: limitResult(res) });
                
                done();
            });
    });

    it("Save and write apiDoc", (done) => {
        generateApiDoc(docs, "apiDocBuiltInFunctions.js");
        done();
    });
});
