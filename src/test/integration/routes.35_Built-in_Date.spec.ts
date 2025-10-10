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
import { IApiDoc, generateApiDoc, IApiInput, prepareToApiDoc, limitResult, testVersion } from "./constant";
import { server } from "../../server/index";
import { addStartNewTest, addTest, writeLog } from "./tests";

chai.use(chaiHttp);
const should = chai.should();
const docs: IApiDoc[] = [];
const addToApiDoc = (input: IApiInput) => {
    docs.push(prepareToApiDoc(input));
};
addToApiDoc({
    type: "infos",
    short: "Presentation",
    description: `The OGC SensorThings API supports a set of functions that can be used with the $filter or $orderby query operations. The following table lists the available functions and they follows the OData Canonical function definitions listed in Section 5.1.1.4 of the [OData Version 4.0 Part 2: URL Conventions] and the syntax rules for these functions are defined in [OData Version 4.0 ABNF].`,
    reference: "https://docs.ogc.org/is/18-088/18-088.html#_built_in_query_functions",
    result: ""
});

describe("Odata BuiltInDates [9.3.3.5.2]", () => {
    before((done) => {
        addStartNewTest("Built in Dates");
        done();
    });
    afterEach(() => {
        writeLog(true);
    });
    it("search by resultTime eq 2017-01-13", (done) => {
        const infos = addTest({
            type: "get",
            short: "Observations Date",
            description: "Stean have a multitude date an",
            reference: "https://docs.ogc.org/is/18-088/18-088.html#_built_in_query_functions",
            request: `${testVersion}/Observations?$filter=resultTime eq 2017-01-13`
        });
        chai.request(server)
            .get(`/test/${infos.request}`)
            .end((err: Error, res: any) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                res.body.value.length.should.eql(2);
                res.body["value"][0]["@iot.id"].should.eql(530);
                addToApiDoc({ ...infos, result: limitResult(res) });
                done();
            });
    });
    it("search by resultTime eq 13-01-2017", (done) => {
        const infos = addTest({
            type: "get",
            short: "search by resultTime eq 01-13-2017",
            description: "",
            reference: "",
            request: `${testVersion}/Observations?$filter=resultTime eq '13-01-2017'`
        });
        chai.request(server)
            .get(`/test/${infos.request}`)
            .end((err: Error, res: any) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                res.body.value.length.should.eql(2);
                res.body["value"][0]["@iot.id"].should.eql(530);
                done();
            });
    });
    it("search by resultTime gt 13-01-2017", (done) => {
        const infos = addTest({
            type: "get",
            short: "search by resultTime gt 13-01-2017",
            description: "",
            reference: "",
            request: `${testVersion}/Observations?$filter=resultTime gt '13-01-2017'`
        });
        chai.request(server)
            .get(`/test/${infos.request}`)
            .end((err: Error, res: any) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                res.body.value.length.should.eql(528);
                res.body["value"][0]["@iot.id"].should.eql(526);
                done();
            });
    });
    it("search by resultTime lt 15-10-2021", (done) => {
        const infos = addTest({
            type: "get",
            short: "search by resultTime lt 15-10-2021",
            description: "",
            reference: "",
            request: `${testVersion}/Observations?$filter=resultTime lt '15-10-2021'`
        });
        chai.request(server)
            .get(`/test/${infos.request}`)
            .end((err: Error, res: any) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                res.body.value.length.should.eql(8);
                res.body["value"][0]["@iot.id"].should.eql(530);
                done();
            });
    });
    it("year(resultTime) eq 2017", (done) => {
        const infos = addTest({
            type: "get",
            short: "Observations Year",
            description: "The year function returns the year component of the Date or DateTimeOffset parameter value, evaluated in the time zone of the DateTimeOffset parameter value.",
            reference: "https://docs.ogc.org/is/18-088/18-088.html#_built_in_query_functions",
            request: `${testVersion}/Observations?$filter=year(resultTime) eq 2017`
        });
        chai.request(server)
            .get(`/test/${infos.request}`)
            .end((err: Error, res: any) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                res.body.value.length.should.eql(8);
                addToApiDoc({ ...infos, result: limitResult(res) });

                done();
            });
    });
    it("month(resultTime) eq 10", (done) => {
        const infos = addTest({
            type: "get",
            short: "Observations Month",
            description: "The month function returns the month component of the Date or DateTimeOffset parameter value, evaluated in the time zone of the DateTimeOffset parameter value.",
            reference: "https://docs.ogc.org/is/18-088/18-088.html#_built_in_query_functions",
            request: `${testVersion}/Observations?$filter=month(resultTime) eq 2`
        });
        chai.request(server)
            .get(`/test/${infos.request}`)
            .end((err: Error, res: any) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                res.body.value.length.should.eql(6);
                res.body["value"][0]["@iot.id"].should.eql(525);
                addToApiDoc({ ...infos, result: limitResult(res) });

                done();
            });
    });
    it("day(resultTime) eq 11", (done) => {
        const infos = addTest({
            type: "get",
            short: "Observations Day",
            description: "The day function returns the day component Date or DateTimeOffset parameter value, evaluated in the time zone of the DateTimeOffset parameter value.",
            reference: "https://docs.ogc.org/is/18-088/18-088.html#_built_in_query_functions",
            request: `${testVersion}/Observations?$filter=day(resultTime) eq 5`
        });
        chai.request(server)
            .get(`/test/${infos.request}`)
            .end((err: Error, res: any) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                res.body.value.length.should.eql(26);
                res.body["value"][0]["@iot.id"].should.eql(495);
                addToApiDoc({ ...infos, result: limitResult(res) });

                done();
            });
    });
    it("hour(resultTime) eq 12", (done) => {
        const infos = addTest({
            type: "get",
            short: "Observations Hour",
            description: "The hour function returns the hour component of the DateTimeOffset or TimeOfDay parameter value, evaluated in the time zone of the DateTimeOffset parameter value.",
            reference: "https://docs.ogc.org/is/18-088/18-088.html#_built_in_query_functions",
            request: `${testVersion}/Observations?$filter=hour(resultTime) eq 12`
        });
        chai.request(server)
            .get(`/test/${infos.request}`)
            .end((err: Error, res: any) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                res.body.value.length.should.eql(20);
                addToApiDoc({ ...infos, result: limitResult(res) });
                done();
            });
    });
    it("minute(resultTime) eq 50", (done) => {
        const infos = addTest({
            type: "get",
            short: "Observations minute",
            description: "The minute function returns the minute component of the DateTimeOffset or TimeOfDay parameter value, evaluated in the time zone of the DateTimeOffset parameter value.",
            reference: "https://docs.ogc.org/is/18-088/18-088.html#_built_in_query_functions",
            request: `${testVersion}/Observations?$filter=minute(resultTime) eq 45`
        });
        chai.request(server)
            .get(`/test/${infos.request}`)
            .end((err: Error, res: any) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                res.body.value.length.should.eql(130);
                addToApiDoc({ ...infos, result: limitResult(res) });

                done();
            });
    });
    it("second(resultTime) ge 40", (done) => {
        const infos = addTest({
            type: "get",
            short: "Observations second",
            description: "The second function returns the second component (without the fractional part) of the DateTimeOffset or TimeOfDay parameter value.",
            reference: "https://docs.ogc.org/is/18-088/18-088.html#_built_in_query_functions",
            request: `${testVersion}/Observations?$filter=second(resultTime) ge 40`
        });
        chai.request(server)
            .get(`/test/${infos.request}`)
            .end((err: Error, res: any) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                res.body.value.length.should.eql(2);
                addToApiDoc({ ...infos, result: limitResult(res) });

                done();
            });
    });
    it("date(resultTime) eq date(validTime)", (done) => {
        const infos = addTest({
            type: "get",
            short: "Observations date",
            description: "The date function returns the date part of the DateTimeOffset parameter value, evaluated in the time zone of the DateTimeOffset parameter value.",
            reference: "https://docs.ogc.org/is/18-088/18-088.html#_built_in_query_functions",
            request: `${testVersion}/Observations?$filter=date(resultTime) eq date(phenomenonTime)`
        });
        chai.request(server)
            .get(`/test/${infos.request}`)
            .end((err: Error, res: any) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                res.body.value.length.should.eql(530);
                addToApiDoc({ ...infos, result: limitResult(res) });

                done();
            });
    });
    it("time(resultTime) ne time(phenomenonTime)", (done) => {
        const infos = addTest({
            type: "get",
            short: "Observations time",
            description: "The time function returns the time part of the DateTimeOffset parameter value, evaluated in the time zone of the DateTimeOffset parameter value.",
            reference: "https://docs.ogc.org/is/18-088/18-088.html#_built_in_query_functions",
            request: `${testVersion}/Observations?$filter=time(resultTime) ne time(phenomenonTime)`
        });
        chai.request(server)
            .get(`/test/${infos.request}`)
            .end((err: Error, res: any) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                res.body.value.length.should.eql(4);
                addToApiDoc({ ...infos, result: limitResult(res) });

                done();
            });
    });
    it("ge(resultTime) and le(phenomenonTime)", (done) => {
        const infos = addTest({
            type: "get",
            short: "Observations boundaries",
            description: "The ge and le time functions is use as boundaries date.",
            request: `${testVersion}/Observations?$filter=resultTime%20ge%202024-06-04%20and%20resultTime%20le%202024-06-05`
        });
        chai.request(server)
            .get(`/test/${infos.request}`)
            .end((err: Error, res: any) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                res.body.value.length.should.eql(122);
                addToApiDoc({ ...infos, result: limitResult(res) });

                done();
            });
    });
    // it("totaloffsetminutes(resultTime) eq 330", (done) => {
    //     const infos = addTest({
    //         type: 'get',
    // short: "Observations Now",
    //         description: "The totaloffsetminutes function returns the signed number of minutes in the time zone offset part of the DateTimeOffset parameter value, evaluated in the time zone of the DateTimeOffset parameter value.",
    //         reference: "https://docs.ogc.org/is/18-088/18-088.html#_built_in_query_functions",
    //         examples: {
    //            http: `${testVersion}/Observations?$filter=totaloffsetminutes(resultTime) eq 330",
    //                         curl: defaultGet("curl", "KEYHTTP"),
    //                         javascript: defaultGet("javascript", "KEYHTTP"),
    //                         python: defaultGet("python", "KEYHTTP")
    //                     }
    //     };
    //     chai.request(server)
    //         .get(`/test/${infos.request}`)
    //         .end((err: Error, res: any) => {
    //             should.not.exist(err);
    //             res.status.should.equal(200);
    //             res.type.should.equal("application/json");
    //             res.body.value.length.should.eql(52);
    //             res.body["value"][0]["@iot.id"].should.eql(1);
    //             addToApiDoc({ ...infos, result: limitResult(res) });
    //
    //            done();
    //         });
    // });
    it("resultTime le now()", (done) => {
        const infos = addTest({
            type: "get",
            short: "Observations Now()",
            description: "The now function returns the current point in time (date and time with time zone) as a DateTimeOffset value.",
            reference: "https://docs.ogc.org/is/18-088/18-088.html#_built_in_query_functions",
            request: `${testVersion}/Observations?$filter=resultTime le now()`
        });
        chai.request(server)
            .get(`/test/${infos.request}`)
            .end((err: Error, res: any) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                res.body.value.length.should.eql(530);
                addToApiDoc({ ...infos, result: limitResult(res) });

                done();
            });
    });
    // it("fractionalseconds(resultTime) ne 0", (done) => {
    //     const infos = addTest({
    //         type: 'get',
    // short: "Observations fractionalseconds",
    //         description: "The fractionalseconds function returns the fractional seconds component of the DateTimeOffset or TimeOfDay parameter value as a non-negative decimal value less than 1.",
    //         reference: "https://docs.ogc.org/is/18-088/18-088.html#_built_in_query_functions",
    //         examples: {
    //           http: `${testVersion}/Observations?$filter=fractionalseconds(resultTime) ne 0",
    //                         curl: defaultGet("curl", "KEYHTTP"),
    //                         javascript: defaultGet("javascript", "KEYHTTP"),
    //                         python: defaultGet("python", "KEYHTTP")
    //                     }
    //     };
    //     chai.request(server)
    //         .get(`/test/${infos.request}`)
    //         .end((err: Error, res: any) => {
    //             should.not.exist(err);
    //             res.status.should.equal(200);
    //             res.type.should.equal("application/json");
    //             res.body.value.length.should.eql(52);
    //             res.body["value"][0]["@iot.id"].should.eql(1);
    //             addToApiDoc({ ...infos, result: limitResult(res) });
    //
    //            done();
    //         });
    // });
    // it("mindatetime(resultTime) ne 0", (done) => {
    //     const infos = addTest({
    //         type: 'get',
    // short: "Observations mindatetime",
    //         description: "The mindatetime function returns the earliest possible point in time as a DateTimeOffset value.",
    //         reference: "https://docs.ogc.org/is/18-088/18-088.html#_built_in_query_functions",
    //         examples: {
    //           http: `${testVersion}/Observations?$filter=resultTime gt mindatetime()",
    //                         curl: defaultGet("curl", "KEYHTTP"),
    //                         javascript: defaultGet("javascript", "KEYHTTP"),
    //                         python: defaultGet("python", "KEYHTTP")
    //                     }
    //     };
    //     chai.request(server)
    //         .get(`/test/${infos.request}`)
    //         .end((err: Error, res: any) => {
    //             should.not.exist(err);
    //             res.status.should.equal(200);
    //             res.type.should.equal("application/json");
    //             res.body.value.length.should.eql(52);
    //             res.body["value"][0]["@iot.id"].should.eql(1);
    //             addToApiDoc({ ...infos, result: limitResult(res) });
    //
    //           done();
    //         });
    // });
    it("Save and write apiDoc", (done) => {
        generateApiDoc(docs, "BuiltInDate");
        done();
    });
});
