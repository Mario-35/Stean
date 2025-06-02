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
const geoPos: { [key: string]: number[] } = {
    "Centre commercial Grand Quartier": [48.13765198324515, -1.6956051932646596],
    "Polyclinic Saint Laurent": [48.139101133693764, -1.6571222811169917],
    "Golf municipal de Cesson-Sévigné": [48.12552590922048, -1.5889906727727678],
    "Glaz Arena": [48.11472599868096, -1.594679622929148],
    "Brin Herbe": [48.08416909630583, -1.601486946802519],
    "E.Leclerc VERN SUR SEICHE": [48.06467042196109, -1.623116279666956],
    "Écomusée du pays de Rennes": [48.07908248444603, -1.6664475955447595],
    "Castorama": [48.089982264765595, -1.7050636226736864],
    "The Mem": [48.089982264765595, -1.7050636226736864],
    "Kenedy": [48.123242161802274, -1.7127016234011674],
    "Institut Agro Rennes-Angers": [48.1140652783794, -1.7062956999598533]
};
const positions = Object.values(geoPos);
const point: string[] = [];
positions.forEach((e: number[]) => {
    point.push(`${e[0]} ${e[1]}`);
});
chai.use(chaiHttp);
const should = chai.should();
const docs: IApiDoc[] = [];
const addToApiDoc = (input: IApiInput) => {
    docs.push(prepareToApiDoc(input));
};
addToApiDoc({
    type: "infos",
    short: "Presentation",
    description: ` Geospatial functions work on all geospatial fields (Location/location and FeatureOfInterest/feature) and on geospatial constants. Geospatial constants can be specified by using WKT enclosed in geography'…', for example:.`,
    reference: "https://docs.ogc.org/is/18-088/18-088.html#_built_in_query_functions",
    result: ""
});

describe("{get} BuiltInGeospatial [9.3.3.5.2]", () => {
    before((done) => {
        addStartNewTest("Built in Geospatial");
        done();
    });
    afterEach(() => {
        writeLog(true);
    });
    it(`geo.distance(location, geography'POINT(-1.6567440482485551 48.11256463781973)') lt 0.11`, (done) => {
        const infos = addTest({
            type: "get",
            short: "Location Distance location",
            description: "geo.distance(g1, g2) number : Returns the distance between g1 and g2 in the units of the server (generally degrees)",
            reference: "https://postgis.net/docs/ST_Distance.html",
            examples: {
                http: `${testVersion}/Locations?$filter=geo.distance(location, geography'POINT(-1.6567440482485551 48.11256463781973)') lt 0.11`,
                curl: defaultGet("curl", "KEYHTTP"),
                javascript: defaultGet("javascript", "KEYHTTP"),
                python: defaultGet("python", "KEYHTTP")
            }
        });
        chai.request(server)
            .get(`/test/${infos.examples.http}`)
            .end((err: Error, res: any) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                res.body.value.length.should.eql(1);
                res.body["value"][0]["@iot.id"].should.eql(7);
                addToApiDoc({ ...infos, result: limitResult(res) });
                done();
            });
    });
    it(`geo.distance(FeatureOfInterest/feature, geography'POINT(-4.108433416883344 47.99535576613954)') lt 0.11`, (done) => {
        const infos = addTest({
            type: "get",
            short: "FOI Distance Foi",
            description: "geo.distance(g1, g2) number : Returns the distance between g1 and g2 in the units of the server (generally degrees)",
            reference: "https://postgis.net/docs/ST_Distance.html",
            examples: {
                http: `${testVersion}/Observations?$filter=geo.distance(FeatureOfInterest/feature,geography'POINT(-4.108433416883344 47.99535576613954)') ge 1`,
                curl: defaultGet("curl", "KEYHTTP"),
                javascript: defaultGet("javascript", "KEYHTTP"),
                python: defaultGet("python", "KEYHTTP")
            }
        });
        chai.request(server)
            .get(`/test/${infos.examples.http}`)
            .end((err: Error, res: any) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                res.body.value.length.should.eql(2);
                res.body["value"][0]["@iot.id"].should.eql(526);
                addToApiDoc({ ...infos, result: limitResult(res) });

                done();
            });
    });
    it(`geo.length(location,'POINT(-1.6571736839366906 48.112731020713284)') lt 1`, (done) => {
        const infos = addTest({
            type: "get",
            short: "Location Length location",
            description: "geo.length(g1) number : geo.length(location) lt 2 matches all locations that are linestrings with a length less than 2 degrees",
            reference: "https://postgis.net/docs/ST_Length.html",
            examples: {
                http: `${testVersion}/Locations?$filter=geo.length(location,'POINT(-1.6571736839366906 48.112731020713284)') lt 1`,
                curl: defaultGet("curl", "KEYHTTP"),
                javascript: defaultGet("javascript", "KEYHTTP"),
                python: defaultGet("python", "KEYHTTP")
            }
        });
        chai.request(server)
            .get(`/test/${infos.examples.http}`)
            .end((err: Error, res: any) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                res.body.value.length.should.eql(4);
                res.body["value"][0]["@iot.id"].should.eql(3);
                addToApiDoc({ ...infos, result: limitResult(res) });

                done();
            });
    });
    it(`geo.length(FeatureOfInterest/feature,'POINT(-1.6571736839366906 48.112731020713284)') lt 1`, (done) => {
        const infos = addTest({
            type: "get",
            short: "Location Length Foi",
            description: "geo.length(g1) number : geo.length(location) lt 2 matches all locations that are linestrings with a length less than 2 degrees",
            reference: "https://postgis.net/docs/ST_Length.html",
            examples: {
                http: `${testVersion}/Observations?$filter=geo.length(FeatureOfInterest/feature,'POINT(-1.6571736839366906 48.112731020713284)') lt 1`,
                curl: defaultGet("curl", "KEYHTTP"),
                javascript: defaultGet("javascript", "KEYHTTP"),
                python: defaultGet("python", "KEYHTTP")
            }
        });
        chai.request(server)
            .get(`/test/${infos.examples.http}`)
            .end((err: Error, res: any) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                res.body.value.length.should.eql(2);
                res.body["value"][0]["@iot.id"].should.eql(526);
                addToApiDoc({ ...infos, result: limitResult(res) });
                done();
            });
    });
    it("geo.intersects(location,'LINESTRING(-1.6567440482485551 48.11256463781973, -4.108433416883344 47.99535576613954)')", (done) => {
        const infos = addTest({
            type: "get",
            short: "Location Intersects location",
            description: "geo.intersects(g1, g2) bool : Returns true if g1 intersects g2 geo.intersects(location, geography'POLYGON ((30 10, 10 20, 20 40, 40 40, 30 10))')",
            reference: "https://postgis.net/docs/ST_Intersects.html",
            examples: {
                http: `${testVersion}/Locations?$filter=geo.intersects(location,'LINESTRING(-1.6567440482485551 48.11256463781973, -4.108433416883344 47.99535576613954)')`,
                curl: defaultGet("curl", "KEYHTTP"),
                javascript: defaultGet("javascript", "KEYHTTP"),
                python: defaultGet("python", "KEYHTTP")
            }
        });
        chai.request(server)
            .get(`/test/${infos.examples.http}`)
            .end((err: Error, res: any) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                res.body.value.length.should.eql(1);
                res.body["value"][0]["@iot.id"].should.eql(1);
                addToApiDoc({ ...infos, result: limitResult(res) });
                done();
            });
    });
    it("geo.intersects(FeatureOfInterest/feature, 'LINESTRING(-1.6567440482485551 48.11256463781973, -4.108433416883344 47.99535576613954)')", (done) => {
        const infos = addTest({
            type: "get",
            short: "FOI Intersects Foi",
            description: "geo.intersects(g1, g2) bool : Returns true if g1 intersects g2 geo.intersects(location, geography'POLYGON ((30 10, 10 20, 20 40, 40 40, 30 10))')",
            reference: "https://postgis.net/docs/ST_Intersects.html",
            examples: {
                http: `${testVersion}/Observations?$filter=geo.intersects(FeatureOfInterest/feature, 'LINESTRING(-1.202481228298467 48.35475608212215, -4.108433416883344 47.99535576613954)')`,
                curl: defaultGet("curl", "KEYHTTP"),
                javascript: defaultGet("javascript", "KEYHTTP"),
                python: defaultGet("python", "KEYHTTP")
            }
        });
        chai.request(server)
            .get(`/test/${infos.examples.http}`)
            .end((err: Error, res: any) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                res.body.value.length.should.eql(1);
                res.body["value"][0]["@iot.id"].should.eql(526);
                addToApiDoc({ ...infos, result: limitResult(res) });
                done();
            });
    });
    it(`geo.within(location, geography'POINT(-4.108433416883344 47.99535576613954)')`, (done) => {
        const infos = addTest({
            type: "get",
            short: "Location Within location",
            description: "geo.within(g1, g2) bool : Returns true if g1 is within g2 geo.within(location, geography'POLYGON ((30 10, 10 20, 20 40, 40 40, 30 10))')",
            reference: "https://postgis.net/docs/ST_Within.html",
            examples: {
                http: `${testVersion}/Locations?$filter=geo.within(location, geography'POINT(-4.108433416883344 47.99535576613954)')`,
                curl: defaultGet("curl", "KEYHTTP"),
                javascript: defaultGet("javascript", "KEYHTTP"),
                python: defaultGet("python", "KEYHTTP")
            }
        });
        chai.request(server)
            .get(`/test/${infos.examples.http}`)
            .end((err: Error, res: any) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                res.body.value.length.should.eql(1);
                res.body["value"][0]["@iot.id"].should.eql(1);
                addToApiDoc({ ...infos, result: limitResult(res) });

                done();
            });
    });

    it(`geo.within(FeatureOfInterest/feature, geography'POINT(-1.202481228298467 48.354756082122154)')`, (done) => {
        const infos = addTest({
            type: "get",
            short: "Location Within Foi",
            description: "geo.within(g1, g2) bool : Returns true if g1 is within g2 geo.within(location, geography'POLYGON ((30 10, 10 20, 20 40, 40 40, 30 10))')",
            reference: "https://postgis.net/docs/ST_Within.html",
            examples: {
                http: `${testVersion}/Observations?$filter=geo.within(FeatureOfInterest/feature, geography'POINT(-1.202481228298467 48.354756082122154)')`,
                curl: defaultGet("curl", "KEYHTTP"),
                javascript: defaultGet("javascript", "KEYHTTP"),
                python: defaultGet("python", "KEYHTTP")
            }
        });
        chai.request(server)
            .get(`/test/${infos.examples.http}`)
            .end((err: Error, res: any) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                res.body.value.length.should.eql(1);
                res.body["value"][0]["@iot.id"].should.eql(526);
                addToApiDoc({ ...infos, result: limitResult(res) });

                done();
            });
    });
    it(`geo.disjoint(location,'MULTIPOINT(-3.377509239138959 47.74736066059859, -1.6567440482485551 48.11256463781973, -4.108433416883344 47.99535576613954)')`, (done) => {
        const infos = addTest({
            type: "get",
            short: "Location Disjoint location",
            description: "geo.disjoint(g1, g2) bool : Returns true if g1 is separated from g2 geo.disjoint(location, geography'POLYGON ((30 10, 10 20, 20 40, 40 40, 30 10))')",
            reference: "https://postgis.net/docs/ST_Disjoint.html",
            examples: {
                http: `${testVersion}/Locations?$filter=geo.disjoint(location,'MULTIPOINT(-3.377509239138959 47.74736066059859, -1.6567440482485551 48.11256463781973, -4.108433416883344 47.99535576613954)')`,
                curl: defaultGet("curl", "KEYHTTP"),
                javascript: defaultGet("javascript", "KEYHTTP"),
                python: defaultGet("python", "KEYHTTP")
            }
        });
        chai.request(server)
            .get(`/test/${infos.examples.http}`)
            .end((err: Error, res: any) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                res.body.value.length.should.eql(14);
                res.body["value"][0]["@iot.id"].should.eql(2);
                addToApiDoc({ ...infos, result: limitResult(res) });

                done();
            });
    });
    it(`geo.disjoint(FeatureOfInterest/feature,'MULTIPOINT(-3.377509239138959 47.74736066059859, -1.6567440482485551 48.11256463781973, -4.108433416883344 47.99535576613954)')`, (done) => {
        const infos = addTest({
            type: "get",
            short: "Location Disjoint Observations",
            description: "geo.disjoint(g1, g2) bool : Returns true if g1 is separated from g2 geo.disjoint(location, geography'POLYGON ((30 10, 10 20, 20 40, 40 40, 30 10))')",
            reference: "https://postgis.net/docs/ST_Disjoint.html",
            examples: {
                http: `${testVersion}/Observations?$filter=geo.disjoint(FeatureOfInterest/feature,'MULTIPOINT(-3.377509239138959 47.74736066059859, -1.6567440482485551 48.11256463781973, -4.108433416883344 47.99535576613954)')`,
                curl: defaultGet("curl", "KEYHTTP"),
                javascript: defaultGet("javascript", "KEYHTTP"),
                python: defaultGet("python", "KEYHTTP")
            }
        });
        chai.request(server)
            .get(`/test/${infos.examples.http}`)
            .end((err: Error, res: any) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                res.body.value.length.should.eql(2);
                res.body["value"][0]["@iot.id"].should.eql(526);
                addToApiDoc({ ...infos, result: limitResult(res) });
                done();
            });
    });
    it(`geo.equals(location,'POINT(-3.377509239138959 47.74736066059859)')`, (done) => {
        const infos = addTest({
            type: "get",
            short: "Location Equals location",
            description: "geo.equals(g1, g2) bool : Returns true if g1 is the same as g2 geo.equals(location, geography'POINT (30 10)')",
            reference: "https://postgis.net/docs/ST_Equals.html",
            examples: {
                http: `${testVersion}/Locations?$filter=geo.equals(location,'POINT(-3.377509239138959 47.74736066059859)')`,
                curl: defaultGet("curl", "KEYHTTP"),
                javascript: defaultGet("javascript", "KEYHTTP"),
                python: defaultGet("python", "KEYHTTP")
            }
        });
        chai.request(server)
            .get(`/test/${infos.examples.http}`)
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
    it(`geo.equals(FeatureOfInterest/feature,'POINT(-1.202481228298467 48.35475608212215)')`, (done) => {
        const infos = addTest({
            type: "get",
            short: "Location Equals Foi",
            description: "geo.equals(g1, g2) bool : Returns true if g1 is the same as g2 geo.equals(location, geography'POINT (30 10)')",
            reference: "https://postgis.net/docs/ST_Equals.html",
            examples: {
                http: `${testVersion}/Observations?$filter=geo.equals(FeatureOfInterest/feature,%27POINT(-1.202481228298467%2048.35475608212215)%27)`,
                curl: defaultGet("curl", "KEYHTTP"),
                javascript: defaultGet("javascript", "KEYHTTP"),
                python: defaultGet("python", "KEYHTTP")
            }
        });
        chai.request(server)
            .get(`/test/${infos.examples.http}`)
            .end((err: Error, res: any) => {
                should.not.exist(err);
                res.status.should.equal(200);
                res.type.should.equal("application/json");
                res.body.value.length.should.eql(1);
                res.body["value"][0]["@iot.id"].should.eql(526);
                addToApiDoc({ ...infos, result: limitResult(res) });
                done();
            });
    });
    // it(`geo.contains(location, geography'POINT(${startPoint[0]} ${startPoint[1]})')`, (done) => {
    //     const infos = addTest({
    //         type: 'get',
    // short: "Location Contains location",
    //         description: "geo.contains(A, B) returns TRUE if geometry B is completely inside geometry A. A contains B if and only if no points of B lie in the exterior of A, and at least one point of the interior of B lies in the interior of A.",
    //         reference: "https://postgis.net/docs/ST_Contains.html",
    //         examples: {
    //             http: `${testVersion}/Locations?$filter=geo.contains(location, geography'POINT(${startPoint[0]} ${startPoint[1]})')`,
    //                         curl: defaultGet("curl", "KEYHTTP"),
    //                         javascript: defaultGet("javascript", "KEYHTTP"),
    //                         python: defaultGet("python", "KEYHTTP")
    //                     }
    //     });
    //     chai.request(server)
    //         .get(`/test/${infos.examples.http}`)
    //         .end((err: Error, res: any) => {
    //             should.not.exist(err);
    //             res.status.should.equal(200);
    //             res.type.should.equal("application/json");
    //             res.body.value.length.should.eql(1);
    //             res.body["value"][0]["@iot.id"].should.eql(20);
    //             addToApiDoc({ ...infos, result: limitResult(res) });

    //             done();
    //         });
    // });
    // it(`geo.contains(FeatureOfInterest/feature, geography'POINT(${startPoint[0]} ${startPoint[1]})')`, (done) => {
    //     const infos = addTest({
    //         type: 'get',
    // short: "Location Contains location",
    //         description: "geo.contains(A, B) returns TRUE if geometry B is completely inside geometry A. A contains B if and only if no points of B lie in the exterior of A, and at least one point of the interior of B lies in the interior of A.",
    //         reference: "https://postgis.net/docs/ST_Contains.html",
    //         examples: {
    //             http : `/${testVersion}/Observations?$filter=geo.contains(FeatureOfInterest/feature, geography'POINT(${positions[1][0]} ${positions[1][1]})')`,
    //                         curl: defaultGet("curl", "KEYHTTP"),
    //                         javascript: defaultGet("javascript", "KEYHTTP"),
    //                         python: defaultGet("python", "KEYHTTP")
    //                     }
    //     });
    //     chai.request(server)
    //         .get(`/test/${infos.examples.http}`)
    //         .end((err: Error, res: any) => {
    //             should.not.exist(err);
    //             res.status.should.equal(200);
    //             res.type.should.equal("application/json");
    //             res.body.value.length.should.eql(4);
    //             res.body["value"][0]["@iot.id"].should.eql(3);
    //             addToApiDoc({ ...infos, result: limitResult(res) });

    //             done();
    //         });
    // });
    // it(`geo.crosses(location, geography'MULTIPOINT(${point.join()})')`, (done) => {
    //     const infos = addTest({
    //         type: 'get',
    // short: "Location Crosses location",
    //         description: "Compares two geometry objects and returns true if their intersection 'spatially cross', that is, the geometries have some, but not all interior points in common. The intersection of the interiors of the geometries must be non-empty and must have dimension less than the maximum dimension of the two input geometries. Additionally, the intersection of the two geometries must not equal either of the source geometries. Otherwise, it returns false.",
    //         reference: "https://postgis.net/docs/ST_Crosses.html",
    //         examples: {   http: `/${testVersion}/Locations?$filter=geo.crosses(location, geography'MULTIPOINT(${point.join()})')`,
    //                         curl: defaultGet("curl", "KEYHTTP"),
    //                         javascript: defaultGet("javascript", "KEYHTTP"),
    //                         python: defaultGet("python", "KEYHTTP")
    //                     }
    //     };
    //     chai.request(server)
    //         .get(`/test/${infos.examples.http}`)
    //         .end((err: Error, res: any) => {
    //             console.log(infos.examples.http);

    //             should.not.exist(err);
    //             res.status.should.equal(200);
    //             res.type.should.equal("application/json");
    //             res.body.value.length.should.eql(1);
    //             res.body["value"][0]["@iot.id"].should.eql(20);
    //             pipo
    //             addToApiDoc({ ...infos, result: limitResult(res) });
    //
    //           done();
    //         });
    // });

    // it(`geo.overlaps(location, geography'MULTIPOINT(${point.join()})')`, (done) => {
    //     const infos = addTest({
    //         type: 'get',
    // short: "Location overlaps location",
    //         description: "geo.overlaps( geometry A, geometry B ) Returns TRUE if geometry A and B 'spatially overlap'. Two geometries overlap if they have the same dimension, each has at least one point not shared by the other (or equivalently neither covers the other), and the intersection of their interiors has the same dimension. The overlaps relationship is symmetrical.",
    //         reference: "https://postgis.net/docs/ST_Overlaps.html",
    //         examples: {   http: `/${testVersion}/Locations?$filter=geo.overlaps(location,'MULTIPOINT(${point.join()})')`,
    //                         curl: defaultGet("curl", "KEYHTTP"),
    //                         javascript: defaultGet("javascript", "KEYHTTP"),
    //                         python: defaultGet("python", "KEYHTTP")
    //                     }
    //     };
    //     chai.request(server)
    //         .get(`/test/${infos.examples.http}`)
    //         .end((err: Error, res: any) => {
    //             console.log(infos.examples.http);
    //             should.not.exist(err);
    //             res.status.should.equal(200);
    //             res.type.should.equal("application/json");
    //             res.body.value.length.should.eql(1);
    //             res.body["value"][0]["@iot.id"].should.eql(7);
    //             pipo
    //             addToApiDoc({ ...infos, result: limitResult(res) });
    //
    //            done();
    //         });
    // });

    // it(`geo.overlaps(location, geography'POINT(-4.108433416883344 47.99535576613954)')`, (done) => {
    //     const infos = addTest({
    //         type: 'get',
    // short: "Location Overlaps location",
    //         description: "geo.overlaps(g1, g2) bool : Returns true if g1 overlaps g2 st_overlaps(location, geography'POLYGON ((30 10, 10 20, 20 40, 40 40, 30 10))')",
    //         reference: "https://postgis.net/docs/ST_Overlaps.html",
    //         examples: {
    //             http: `${testVersion}/Locations?$filter=geo.overlaps(location, geography'POLYGON ((-0.8347358617822636 48.66462023954696, -2.05118356962916 48.14958754904805, -1.1721435197140408 47.24630170361877, 0.6797102981657304 47.65326805412454, -0.7784784542859882 48.07366464951724, -0.8347358617822636 48.66462023954696))')`,
    //                         curl: defaultGet("curl", "KEYHTTP"),
    //                         javascript: defaultGet("javascript", "KEYHTTP"),
    //                         python: defaultGet("python", "KEYHTTP")
    //                     }
    //     });
    //     chai.request(server)
    //         .get(`/test/${infos.examples.http}`)
    //         .end((err: Error, res: any) => {
    //             should.not.exist(err);
    //             res.status.should.equal(200);
    //             res.type.should.equal("application/json");
    //             res.body.value.length.should.eql(1);
    //             res.body["value"][0]["@iot.id"].should.eql(7);
    //             addToApiDoc({ ...infos, result: limitResult(res) });

    //             done();
    //         });
    // });

    // it(`geo.overlaps(FeatureOfInterest/feature, geography'POINT(-1.202481228298467 48.354756082122154)')`, (done) => {
    //     const infos = addTest({
    //         type: 'get',
    // short: "Location Overlaps Foi",
    //         description: "geo.overlaps(g1, g2) bool : Returns true if g1 overlaps g2 st_overlaps(location, geography'POLYGON ((30 10, 10 20, 20 40, 40 40, 30 10))')",
    //         reference: "https://postgis.net/docs/ST_Equals.html",
    //         examples: {
    //             http: `${testVersion}/Observations?$filter=geo.overlaps(FeatureOfInterest/feature, geography'POINT(-1.202481228298467 48.354756082122154)')`,
    //                         curl: defaultGet("curl", "KEYHTTP"),
    //                         javascript: defaultGet("javascript", "KEYHTTP"),
    //                         python: defaultGet("python", "KEYHTTP")
    //                     }
    //     });
    //     chai.request(server)
    //         .get(`/test/${infos.examples.http}`)
    //         .end((err: Error, res: any) => {
    //             should.not.exist(err);
    //             res.status.should.equal(200);
    //             res.type.should.equal("application/json");
    //             res.body.value.length.should.eql(1);
    //             res.body["value"][0]["@iot.id"].should.eql(526);
    //             addToApiDoc({ ...infos, result: limitResult(res) });

    //             done();
    //         });
    // });
    it("Save and write apiDoc", (done) => {
        generateApiDoc(docs, "BuiltInGeospatial");
        done();
    });
});
