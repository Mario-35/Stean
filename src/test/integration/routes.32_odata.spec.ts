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
import { IApiDoc, generateApiDoc, IApiInput, prepareToApiDoc, limitResult, apiInfos, testVersion } from "./constant";
import { server } from "../../server/index";
import { testsKeys as things_testsKeys } from "./routes.14_things.spec";
import { testsKeys as datastreams_testsKeys } from "./routes.17_datastreams.spec";
import { testsKeys as sensors_testsKeys } from "./routes.19_sensors.spec";
import { count, executeQuery } from "./executeQuery";
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
    description: `The use of query options allows refining the requests to help get the required information about the SensorThings entities in an easy and efficient manner. Each of the listed query options are available for each SensorThings entity, however the options for each may differ.<br>
        SensorThings query options can be categorized to two different groups.<br>
          -  The first group specifies the properties to be returned by the request. $expand and $select are query options of this group.<br>
          -  The second group is limiting, filtering, or re-ordering the request results. This group contains $orderby, $top, $skip, $count, and $filter`,
    reference: "http://docs.opengeospatial.org/is/15-078r6/15-078r6.html#19",
    result: ""
});

// http://docs.opengeospatial.org/is/15-078r6/15-078r6.html#25
describe("Odata", () => {
    before((done) => {
        addStartNewTest("Odatas");
        done();
    });
    afterEach(() => {
        writeLog(true);
    });
    it("Retrieve a specific thing and $expand Datastreams. [9.3.2.1]", (done) => {
        const infos = addTest({
            type: "get",
            short: "Things(:id) Expand",
            description: `Use $expand query option to request inline information for related entities of the requested entity collection.${apiInfos["9.3.2.1"]}`,
            reference: "https://docs.ogc.org/is/18-088/18-088.html#expand",
            request: `${testVersion}/Things(6)?$expand=Datastreams`
        });
        chai.request(server)
            .get(`/test/${infos.request}`)
            .end((err: Error, res: any) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                res.body.should.include.keys(things_testsKeys.filter((elem) => elem !== "Datastreams@iot.navigationLink"));
                res.body.should.include.keys("Datastreams");
                res.body.Datastreams.length.should.eql(3);
                res.body.Datastreams[0].should.include.keys(datastreams_testsKeys);
                res.body["@iot.id"].should.eql(6);
                res.body.Datastreams[0] = [res.body.Datastreams[0][0], res.body.Datastreams[0][1], "..."];
                addToApiDoc({ ...infos, result: res });

                done();
            });
    });
    it("Retrieve a specific thing and $expand Datastreams and Sensor inside. [9.3.2.1]", (done) => {
        const infos = addTest({
            type: "get",
            short: "Things(:id) Expand sub Entity",
            description: "$expand comma separated list of sub-entity names or sub-entity names separated by forward slash.",
            reference: "https://docs.ogc.org/is/18-088/18-088.html#expand",
            request: `${testVersion}/Things(6)?$expand=Datastreams/Sensor`
        });
        chai.request(server)
            .get(`/test/${infos.request}`)
            .end((err: Error, res: any) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                res.body.should.include.keys(things_testsKeys.filter((elem) => elem !== "Datastreams@iot.navigationLink"));
                res.body["@iot.id"].should.eql(6);
                res.body.should.include.keys("Datastreams");
                res.body.Datastreams.length.should.eql(3);
                res.body.Datastreams[0].should.include.keys("Sensor");
                res.body.Datastreams[0].Sensor.should.include.keys(sensors_testsKeys);
                res.body.Datastreams[1].should.include.keys("Sensor");
                res.body.Datastreams[1].Sensor.should.include.keys(sensors_testsKeys);
                res.body.Datastreams[0] = [res.body.Datastreams[0][0], res.body.Datastreams[0][1], "..."];
                addToApiDoc({ ...infos, result: res });

                done();
            });
    });
    it("Return void MultiDatastreams list in expand with no datas [9.3.2.1]", (done) => {
        const infos = addTest({
            type: "get",
            short: "things(:id) expand with empty result",
            description: "Get list of locations and return list if is empty.",
            reference: "https://docs.ogc.org/is/18-088/18-088.html#expand",
            request: `${testVersion}/Things(6)?$expand=MultiDatastreams`
        });
        chai.request(server)
            .get(`/test/${infos.request}`)
            .end((err: Error, res: any) => {
                // there should be no errors
                should.not.exist(err);
                // there should be a 200 status code
                res.status.should.equal(200);
                // the response should be text plain
                res.body.should.include.keys(things_testsKeys.filter((elem) => elem !== "MultiDatastreams@iot.navigationLink"));
                res.body.should.include.keys("MultiDatastreams");
                res.body.MultiDatastreams.length.should.eql(0);
                addToApiDoc({ ...infos, result: limitResult(res) });

                done();
            });
    });
    it("Return Datastreams with obvervation expand with filter result = 17.5 [9.3.2.1] & [9.3.2.2]", (done) => {
        const infos = addTest({
            type: "get",
            short: "things(:id) expand with inner filter",
            description: "Get datastream and expand obvervations with filter.",
            reference: "https://docs.ogc.org/is/18-088/18-088.html#expand",
            request: `${testVersion}/Datastreams(2)?$expand=Observations($filter=result eq 240)`
        });
        chai.request(server)
            .get(`/test/${infos.request}`)
            .end((err: Error, res: any) => {
                // there should be no errors
                should.not.exist(err);
                // there should be a 200 status code
                res.status.should.equal(200);
                // the response should be text plain
                res.body.should.include.keys(datastreams_testsKeys.filter((elem) => elem !== "Observations@iot.navigationLink"));
                res.body.should.include.keys("Observations");
                res.body.Observations.length.should.eql(1);
                res.body.Observations[0]["@iot.id"].should.eql(29);
                addToApiDoc({ ...infos, result: limitResult(res) });

                done();
            });
    });
    it("Return Datastreams with obvervation expand complex SELECT [9.3.2.1] & [9.3.2.2]", (done) => {
        const infos = addTest({
            type: "get",
            short: "things(:id) expand with inner select",
            description: "Get datastream and expand obvervations with complex select.",
            reference: "https://docs.ogc.org/is/18-088/18-088.html#expand",
            request: `${testVersion}/Datastreams?$expand=Observations($select=phenomenonTime,result;$orderby=phenomenonTime desc;$top=10)`
        });
        chai.request(server)
            .get(`/test/${infos.request}`)
            .end((err: Error, res: any) => {
                // there should be no errors
                should.not.exist(err);
                // there should be a 200 status code
                res.status.should.equal(200);
                // the response should be text plain
                res.body.value[0].should.include.keys(datastreams_testsKeys.filter((elem) => elem !== "Observations@iot.navigationLink"));
                res.body.value[0].should.include.keys("Observations");
                res.body.value[0].Observations.length.should.eql(10);
                Object.keys(res.body.value[0].Observations[0]).length.should.eql(2);
                addToApiDoc({ ...infos, result: limitResult(res) });

                done();
            });
    });
    it("Retrieve description property for a specific Thing. [9.3.2.2]", (done) => {
        const infos = addTest({
            type: "get",
            short: "Things(:id) Select",
            description: `Retrieve specified properties for a specific Things.${apiInfos["9.3.2.2"]}`,
            reference: "https://docs.ogc.org/is/18-088/18-088.html#select4",
            request: `${testVersion}/Things(1)?$select=description`
        });
        chai.request(server)
            .get(`/test/${infos.request}`)
            .end((err: Error, res: any) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                res.body.should.include.keys("description");
                addToApiDoc({ ...infos, result: limitResult(res) });

                done();
            });
    });
    it("Retrieve name and description properties from all Things. [9.3.2.2]", (done) => {
        const infos = addTest({
            type: "get",
            short: "Things(:id) Select multi",
            description: "Retrieve name and description for Things.",
            reference: "https://docs.ogc.org/is/18-088/18-088.html#select4",
            request: `${testVersion}/Things?$select=name,description`
        });
        executeQuery(count("thing")).then((result: Record<string, any>) => {
            chai.request(server)
                .get(`/test/${infos.request}`)
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    res.body.value.length.should.eql(result["count"]);
                    res.body.should.include.keys("@iot.count", "value");
                    res.body.value[0].should.include.keys("description", "name");
                    addToApiDoc({ ...infos, result: limitResult(res) });

                    done();
                });
        });
    });
    it("Oata orderBy [9.3.3.1]", (done) => {
        const infos = addTest({
            type: "get",
            short: "Things OrderBy",
            description: `Use $orderby query option to sort the response based on properties of requested entity in ascending (asc) or descending (desc) order.${apiInfos["9.3.3.1"]}`,
            reference: "https://docs.ogc.org/is/18-088/18-088.html#orderby",
            request: `${testVersion}/Things?$orderby=name desc`
        });
        executeQuery(count("thing")).then((result: Record<string, any>) => {
            chai.request(server)
                .get(`/test/${infos.request}`)
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    res.body.value.length.should.eql(result["count"]);
                    res.body.should.include.keys("@iot.count", "value");
                    res.body.value[0].should.include.keys("description", "name");
                    addToApiDoc({ ...infos, result: limitResult(res) });

                    done();
                });
        });
    });
    it("Oata top [9.3.3.2]", (done) => {
        const infos = addTest({
            type: "get",
            short: "Observations Top",
            description: `Use $top query option to limit the number of requested entities.${apiInfos["9.3.3.2"]}`,
            reference: "https://docs.ogc.org/is/18-088/18-088.html#top",
            request: `${testVersion}/Observations?$top=5`
        });
        chai.request(server)
            .get(`/test/${infos.request}`)
            .end((err, res) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                res.body.value.length.should.eql(5);
                res.body.should.include.keys("@iot.count", "value");
                addToApiDoc({ ...infos, result: limitResult(res) });

                done();
            });
    });
    it("Oata skip [9.3.3.3]", (done) => {
        const infos = addTest({
            type: "get",
            short: "Observations Skip",
            description: `Use $skip to specify the number of entities that should be skipped before returning the requested entities.${apiInfos["9.3.3.3"]}`,
            reference: "https://docs.ogc.org/is/18-088/18-088.html#skip",
            request: `${testVersion}/Observations?$skip=500`
        });
        executeQuery(count("observation")).then((result: Record<string, any>) => {
            chai.request(server)
                .get(`/test/${infos.request}`)
                .end((err, res) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    res.body.value.length.should.eql(result["count"] - 500);
                    res.body.should.include.keys("@iot.count", "value");
                    addToApiDoc({ ...infos, result: limitResult(res) });

                    done();
                });
        });
    });
    it("Oata count [9.3.3.4]", (done) => {
        const infos = addTest({
            type: "get",
            short: "Observations count",
            description: `Use count.${apiInfos["9.3.3.4"]}`,
            reference: "http://docs.opengeospatial.org/is/15-078r6/15-078r6.html#53",
            request: `${testVersion}/Observations?$skip=3&$top=2&$count=true`
        });
        chai.request(server)
            .get(`/test/${infos.request}`)
            .end((err, res) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                res.body.value.length.should.eql(2);
                res.body.should.include.keys("@iot.count", "value");
                res.body["@iot.count"].should.eql(530);
                addToApiDoc({ ...infos, result: limitResult(res) });

                done();
            });
    });
    it("filter Datastreams whose unitOfMeasurement property name = 'Degrees Fahrenheit'.", (done) => {
        const infos = addTest({
            type: "get",
            short: "filter Datastreams whose unitOfMeasurement property name = 'Degrees Fahrenheit'",

            description: "",
            reference: "",
            request: `${testVersion}/Datastreams?$filter=unitOfMeasurement/name eq 'Degrees Fahrenheit'`
        });
        chai.request(server)
            .get(`/test/${infos.request}`)
            .end((err, res) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                res.body.value.length.should.eql(1);
                res.body.should.include.keys("@iot.count", "value");
                res.body.value[0]["@iot.id"].should.eql(12);

                done();
            });
    });
    it("filter name OR description of thing", (done) => {
        const infos = addTest({
            type: "get",
            short: "filter name OR description of thing",

            description: "",
            reference: "",
            request: `${testVersion}/Things?$filter=name eq 'Climatic chamber' or description eq 'A New SensorWeb thing'`
        });
        chai.request(server)
            .get(`/test/${infos.request}`)
            .end((err, res) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                res.body.value.length.should.eql(2);
                res.body.should.include.keys("@iot.count", "value");

                done();
            });
    });
    it("filter name AND description of thing", (done) => {
        const infos = addTest({
            type: "get",
            short: "filter name AND description of thing",

            description: "",
            reference: "",
            request: `${testVersion}/Things?$filter=name eq 'classic Thing' and description eq 'Description of classic Thing'`
        });
        chai.request(server)
            .get(`/test/${infos.request}`)
            .end((err, res) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                res.body.value.length.should.eql(1);
                res.body.should.include.keys("@iot.count", "value");

                done();
            });
    });
    it("filter name STARTWITH", (done) => {
        const infos = addTest({
            type: "get",
            short: "filter name STARTWITH",

            description: "",
            reference: "",
            request: `${testVersion}/Things?$filter=startswith(description,'A New')`
        });
        chai.request(server)
            .get(`/test/${infos.request}`)
            .end((err, res) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                res.body.value.length.should.eql(1);
                res.body.should.include.keys("@iot.count", "value");

                done();
            });
    });
    it("filter name CONTAINS", (done) => {
        const infos = addTest({
            type: "get",
            short: "filter name CONTAINS",

            description: "",
            reference: "",
            request: `${testVersion}/Things?$filter=contains(description,'chamber')`
        });
        chai.request(server)
            .get(`/test/${infos.request}`)
            .end((err, res) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                res.body.value.length.should.eql(1);
                res.body.should.include.keys("@iot.count", "value");

                done();
            });
    });
    it("filter date greater Than", (done) => {
        const infos = addTest({
            type: "get",
            short: "filter date greater Than",

            description: "",
            reference: "",
            request: `${testVersion}/Observations?$filter=phenomenonTime gt '2024-06-04'`
        });
        chai.request(server)
            .get(`/test/${infos.request}`)
            .end((err, res) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                res.body.value.length.should.eql(26);
                res.body.should.include.keys("@iot.count", "value");
                done();
            });
    });
    it("filter date eq", (done) => {
        const infos = addTest({
            type: "get",
            short: "filter date eq",

            description: "",
            reference: "",
            request: `${testVersion}/Observations?$filter=result eq 92 and resultTime eq '2017-02-13'`
        });
        chai.request(server)
            .get(`/test/${infos.request}`)
            .end((err, res) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                res.body.value.length.should.eql(1);
                res.body.value[0]["@iot.id"].should.eql(532);
                res.body.value[0]["result"].should.eql(92);
                res.body.should.include.keys("@iot.count", "value");
                done();
            });
    });
    it("filter date interval", (done) => {
        const infos = addTest({
            type: "get",
            short: "Thing filter date greater than and less than",
            description: "Use filter gt with date",
            reference: "https://docs.ogc.org/is/18-088/18-088.html#requirement-request-data-filter",
            request: `${testVersion}/Observations?$filter=phenomenonTime gt '2021-01-01' and phenomenonTime lt '2021-10-16'`
        });
        chai.request(server)
            .get(`/test/${infos.request}`)
            .end((err, res) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                res.body.value.length.should.eql(1);
                res.body.should.include.keys("@iot.count", "value");
                addToApiDoc({ ...infos, result: limitResult(res) });
                done();
            });
    });
    it("Save and write apiDoc", (done) => {
        generateApiDoc(docs, "Odata");
        done();
    });
});
