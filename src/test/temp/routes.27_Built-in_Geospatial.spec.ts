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
import { IApiDoc, generateApiDoc, IApiInput, prepareToApiDoc, defaultGet, limitResult, testVersion } from "../integration/constant";
import { server } from "../../server/index";
import { addStartNewTest, addTest } from "../integration/tests";

const geoPos: { [key: string]: number[] } = {
    "Centre commercial Grand Quartier" : [48.13765198324515, -1.6956051932646596],
    "Polyclinic Saint Laurent" : [48.139101133693764, -1.6571222811169917],
    "Golf municipal de Cesson-Sévigné": [48.12552590922048, -1.5889906727727678],
    "Glaz Arena": [48.11472599868096, -1.594679622929148],
    "Brin Herbe": [48.08416909630583, -1.601486946802519],
    "E.Leclerc VERN SUR SEICHE": [48.06467042196109, -1.623116279666956],
    "Écomusée du pays de Rennes": [48.07908248444603, -1.6664475955447595],
    "Castorama": [48.089982264765595, -1.7050636226736864],
    "The Mem": [48.089982264765595, -1.7050636226736864],
    "Kenedy": [48.123242161802274, -1.7127016234011674],
    "Institut Agro Rennes-Angers": [48.1140652783794, -1.7062956999598533 ]
};
const positions = Object.values(geoPos);

// Institut Agro Rennes-Angers 48.1140652783794, -1.7062956999598533 
const startPoint = [48.1140652783794, -1.7062956999598533 ];
const point:string[] = [];
positions.forEach((e: number[]) => {
    point.push(`${e[0]} ${e[1]}`);
});

chai.use(chaiHttp);

const should = chai.should();

const docs: IApiDoc[] = [];

const addToApiDoc = (input: IApiInput) => {
    docs.push(prepareToApiDoc(input, "BuiltInGeospatial"));
};

addToApiDoc({
    api: `{infos} /BuiltInGeospatial Infos`,
    apiName: "InfosBuiltInGeospatial",
    apiDescription: `The OGC SensorThings API supports a set of functions that can be used with the $filter or $orderby query operations. The following table lists the available functions and they follows the OData Canonical function definitions listed in Section 5.1.1.4 of the [OData Version 4.0 Part 2: URL Conventions] and the syntax rules for these functions are defined in [OData Version 4.0 ABNF].`,
          apiReference: "https://docs.ogc.org/is/18-088/18-088.html#_built_in_query_functions",
    result: ""
});
   
describe("{get} BuiltInGeospatial [9.3.3.5.2]", () => {
    before((done) => {
        addStartNewTest("Built in Geospatial");
		done();
	});
    it(`geo.distance(location, geography'POINT(${startPoint[0]} ${startPoint[1]})') ge 0.11`, (done) => {
        const infos = addTest({
            api: "{get} Location Distance location",
            apiName: "BuiltInGeospatialDistanceLocation",
            apiDescription: "The round function rounds the input numeric parameter to the nearest numeric value with no decimal component. The mid-point between two integers is rounded away from zero, i.e. 0.5 is rounded to 1 and ‑0.5 is rounded to -1.",
            apiReference: "https://docs.ogc.org/is/18-088/18-088.html#_built_in_query_functions",
            apiExample: {  
                http: `${testVersion}/Locations?$filter=geo.distance(location, geography'POINT(${startPoint[0]} ${startPoint[1]})') ge 0.11`,
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
                res.body.value.length.should.eql(4);
                res.body["value"][0]["@iot.id"].should.eql(8);
                addToApiDoc({ ...infos, result: limitResult(res) });                
                done();
            });
    });

    it(`geo.distance(FeatureOfInterest/feature,geography'POINT(${startPoint[0]} ${startPoint[1]})') ge 0.11`, (done) => {
        const infos = addTest({
            api: "{get} FOI Distance Observations",
            http: `${testVersion}/Observations?$filter=geo.distance(FeatureOfInterest/feature,geography'POINT(${startPoint[0]} ${startPoint[1]})') ge 0.11`,
            apiName: "BuiltInGeospatialDistanceFoi",
            apiDescription: "The round function rounds the input numeric parameter to the nearest numeric value with no decimal component. The mid-point between two integers is rounded away from zero, i.e. 0.5 is rounded to 1 and ‑0.5 is rounded to -1.",
            apiReference: "https://docs.ogc.org/is/18-088/18-088.html#_built_in_query_functions",
            apiExample: {  
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
                res.body["value"][0]["@iot.id"].should.eql(13);
                addToApiDoc({ ...infos, result: limitResult(res) });
                
                done();
            });
    });

    it(`geo.length(location,'POINT(${startPoint[0]} ${startPoint[1]})') ge 0.11`, (done) => {
        const infos = addTest({
            api: "{get} Location Length location",
            http: `${testVersion}/Locations?$filter=geo.length(location,'POINT(${startPoint[0]} ${startPoint[1]})') ge 0.11`,
            apiName: "BuiltInGeospatiaLengthLocation",
            apiDescription: "The geo.length function returns the total length of its line string parameter in the coordinate reference system signified by its SRID.",
            apiReference: "https://docs.ogc.org/is/18-088/18-088.html#_built_in_query_functions",
            apiExample: {  
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
                res.body.value.length.should.eql(4);
                res.body["value"][0]["@iot.id"].should.eql(8);
                addToApiDoc({ ...infos, result: limitResult(res) });
                
                done();
            });
    });

    it(`geo.length(FeatureOfInterest/feature,'POINT(${startPoint[0]} ${startPoint[1]})') ge 0.11`, (done) => {
        const infos = addTest({
            api: "{get} Location Length Observations",
            http: `${testVersion}/Observations?$filter=geo.length(FeatureOfInterest/feature,'POINT(${startPoint[0]} ${startPoint[1]})') ge 0.11`,
            apiName: "BuiltInGeospatiaLengthFoi",
            apiDescription: "The geo.length function returns the total length of its line string parameter in the coordinate reference system signified by its SRID.",
            apiReference: "https://docs.ogc.org/is/18-088/18-088.html#_built_in_query_functions",
            apiExample: {  
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
                res.body["value"][0]["@iot.id"].should.eql(13);
                addToApiDoc({ ...infos, result: limitResult(res) });
                
                done();
            });
    });    

    it("geo.intersects(location,'LINESTRING(48.13765198324515 -1.6956051932646596, 48.06467042196109 -1.623116279666956)')", (done) => {
        const infos = addTest({
            api: "{get} Location Intersects location",
            http: `${testVersion}/Locations?$filter=geo.intersects(location,'LINESTRING(48.13765198324515 -1.6956051932646596, 48.06467042196109 -1.623116279666956)')`,
            apiName: "BuiltInGeospatialIntersectsLocation",
            apiDescription: "The geo.intersects function returns true if the specified point lies within the interior or on the boundary of the specified polygon, otherwise it returns false.",
            apiReference: "https://docs.ogc.org/is/18-088/18-088.html#_built_in_query_functions",
            apiExample: {  
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
                res.body["value"][0]["@iot.id"].should.eql(1);
                addToApiDoc({ ...infos, result: limitResult(res) });
                
                done();
            });
    });

    it("geo.intersects(FeatureOfInterest/feature, 'LINESTRING(48.11829243294942 -1.717928984533772, 48.06467042196109 -1.623116279666956)')", (done) => {
        const infos = addTest({
            api: "{get} FOI Intersects Observations",
            http: `${testVersion}/Observations?$filter=geo.intersects(FeatureOfInterest/feature, 'LINESTRING(48.11829243294942 -1.717928984533772, 48.06467042196109 -1.623116279666956)')`,
            apiName: "BuiltInGeospatialIntersectsFoi",
            apiDescription: "The geo.intersects function returns true if the specified point lies within the interior or on the boundary of the specified polygon, otherwise it returns false.",
            apiReference: "https://docs.ogc.org/is/18-088/18-088.html#_built_in_query_functions",
            apiExample: {  
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
                res.body["value"][0]["@iot.id"].should.eql(26);
                addToApiDoc({ ...infos, result: limitResult(res) });
                
                done();
            });
    });

    // it("geo.intersects(observedArea, 'POLYGON(48.1470945265153 -1.7189909389547655, 48.1112154851337 -1.6464601361216131, 48.1470945265153 -1.7189909389547655)')", (done) => {
    //     const infos = addTest({
    //         api: "{get} Observations Intersects",
    //         apiName: "BuiltInGeospatialIntersectsDatastream",
    //         apiDescription: "The geo.intersects function returns true if the specified point lies within the interior or on the boundary of the specified polygon, otherwise it returns false.",
    //         apiReference: "https://docs.ogc.org/is/18-088/18-088.html#_built_in_query_functions",
    //         apiExample: {   http: `/${testVersion}/Datastreams?$filter=geo.intersects(observedArea,geography'POLYGON((7.5 51.5, 7.5 53.5, 8.5 53.5, 8.5 51.5, 7.5 51.5))')",
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
    //             res.body.value.length.should.eql(2);
    //             res.body["value"][0]["@iot.id"].should.eql(22);
    //             pipo
    //             addToApiDoc({ ...infos, result: limitResult(res) });
    //             
     //           done();
    //         });
    // });
    
    it(`geo.equals(location,'POINT(${positions[1][0]} ${positions[1][1]})')`, (done) => {
        const infos = addTest({
            api: "{get} Location Equals location",
            http: `${testVersion}/Locations?$filter=geo.equals(location,'POINT(${positions[1][0]} ${positions[1][1]})')`,
            apiName: "BuiltInGeospatialEquarsLocation",
            apiDescription: "geo.equals( geometry A , geometry B ) Returns true if the given geometries are 'spatially equal'. Use this for a 'better' answer than '='. Note by spatially equal we mean ST_Within(A,B) = true and ST_Within(B,A) = true and also mean ordering of points can be different but represent the same geometry structure.",
            apiReference: "https://postgis.net/docs/ST_Equals.html",
            apiExample: {  
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
                res.body["value"][0]["@iot.id"].should.eql(7);
                addToApiDoc({ ...infos, result: limitResult(res) });
                
                done();
            });
    }); 

    it(`geo.equals(FeatureOfInterest/feature,'POINT(${positions[1][0]} ${positions[1][1]})')`, (done) => {
        const infos = addTest({
            api: "{get} Location Equals Observations",
            http: `${testVersion}/Observations?$filter=geo.equals(FeatureOfInterest/feature,'POINT(${positions[1][0]} ${positions[1][1]})')`,
            apiName: "BuiltInGeospatialEquarsFoi",
            apiDescription: "geo.equals( geometry A , geometry B ) Returns true if the given geometries are 'spatially equal'. Use this for a 'better' answer than '='. Note by spatially equal we mean ST_Within(A,B) = true and ST_Within(B,A) = true and also mean ordering of points can be different but represent the same geometry structure.",
            apiReference: "https://postgis.net/docs/ST_Equals.html",
            apiExample: {  
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
                res.body.value.length.should.eql(4);
                res.body["value"][0]["@iot.id"].should.eql(3);
                addToApiDoc({ ...infos, result: limitResult(res) });
                
                done();
            });
    });  

    it(`geo.disjoint(location, geography'MULTIPOINT(${point.join()})')`, (done) => {
        const infos = addTest({
            api: "{get} Location Disjoint location",
            http: `${testVersion}/Locations?$filter=geo.disjoint(location,'MULTIPOINT(${point.join()})')`,
            apiName: "BuiltInGeospatialDisjointLocation",
            apiDescription: "geo.disjoint( geometry A , geometry B ) Overlaps, Touches, Within all imply geometries are not spatially disjoint. If any of the aforementioned returns true, then the geometries are not spatially disjoint. Disjoint implies false for spatial intersection.",
            apiReference: "https://postgis.net/docs/ST_Disjoint.html",
            apiExample: {  
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
                res.body.value.length.should.eql(4);
                res.body["value"][0]["@iot.id"].should.eql(21);
                addToApiDoc({ ...infos, result: limitResult(res) });
                
                done();
            });
    });    

    it(`geo.disjoint(FeatureOfInterest/feature, geography'MULTIPOINT(${point.join()})')`, (done) => {
        const infos = addTest({
            api: "{get} Location Disjoint Observations",
            http: `${testVersion}/Observations?$filter=geo.disjoint(FeatureOfInterest/feature,'MULTIPOINT(${point.join()})')`,
            apiName: "BuiltInGeospatialDisjointFoi",
            apiDescription: "geo.disjoint( geometry A , geometry B ) Overlaps, Touches, Within all imply geometries are not spatially disjoint. If any of the aforementioned returns true, then the geometries are not spatially disjoint. Disjoint implies false for spatial intersection.",
            apiReference: "https://postgis.net/docs/ST_Disjoint.html",
            apiExample: {  
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
                res.body["value"][0]["@iot.id"].should.eql(26);
                addToApiDoc({ ...infos, result: limitResult(res) });
                
                done();
            });
    });   

    it(`geo.contains(location, geography'POINT(${startPoint[0]} ${startPoint[1]})')`, (done) => {
        const infos = addTest({
            api: "{get} Location Contains location",
            http: `${testVersion}/Locations?$filter=geo.contains(location, geography'POINT(${startPoint[0]} ${startPoint[1]})')`,
            apiName: "BuiltInGeospatialContainsLocation",
            apiDescription: "geo.contains(A, B) returns TRUE if geometry B is completely inside geometry A. A contains B if and only if no points of B lie in the exterior of A, and at least one point of the interior of B lies in the interior of A.",
            apiReference: "https://postgis.net/docs/ST_Contains.html",
            apiExample: {  
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
                res.body["value"][0]["@iot.id"].should.eql(20);
                addToApiDoc({ ...infos, result: limitResult(res) });
                
                done();
            });
    });

    it(`geo.contains(FeatureOfInterest/feature, geography'POINT(${startPoint[0]} ${startPoint[1]})')`, (done) => {
        const infos = addTest({
            api: "{get} Location Contains location",
            http : `/${testVersion}/Observations?$filter=geo.contains(FeatureOfInterest/feature, geography'POINT(${positions[1][0]} ${positions[1][1]})')`,
            apiName: "BuiltInGeospatialContainsFoi",
            apiDescription: "geo.contains(A, B) returns TRUE if geometry B is completely inside geometry A. A contains B if and only if no points of B lie in the exterior of A, and at least one point of the interior of B lies in the interior of A.",
            apiReference: "https://postgis.net/docs/ST_Contains.html",
            apiExample: {  
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
                res.body.value.length.should.eql(4);
                res.body["value"][0]["@iot.id"].should.eql(3);
                addToApiDoc({ ...infos, result: limitResult(res) });
                
                done();
            });
    });    

    // it(`geo.crosses(location, geography'MULTIPOINT(${point.join()})')`, (done) => {
    //     const infos = addTest({
    //         api: "{get} Location Crosses location",
    //         apiName: "BuiltInGeospatialContainsLocation",
    //         apiDescription: "Compares two geometry objects and returns true if their intersection 'spatially cross', that is, the geometries have some, but not all interior points in common. The intersection of the interiors of the geometries must be non-empty and must have dimension less than the maximum dimension of the two input geometries. Additionally, the intersection of the two geometries must not equal either of the source geometries. Otherwise, it returns false.",
    //         apiReference: "https://postgis.net/docs/ST_Crosses.html",
    //         apiExample: {   http: `/${testVersion}/Locations?$filter=geo.crosses(location, geography'MULTIPOINT(${point.join()})')`,
    //                         curl: defaultGet("curl", "KEYHTTP"),
    //                         javascript: defaultGet("javascript", "KEYHTTP"),
    //                         python: defaultGet("python", "KEYHTTP") 
    //                     }
    //     };
    //     chai.request(server)
    //         .get(`/test/${infos.apiExample.http}`)
    //         .end((err: Error, res: any) => {
    //             console.log(infos.apiExample.http);
                
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
    //         api: "{get} Location overlaps location",
    //         apiName: "BuiltInGeospatialOverlapsLocation",
    //         apiDescription: "geo.overlaps( geometry A , geometry B ) Returns TRUE if geometry A and B 'spatially overlap'. Two geometries overlap if they have the same dimension, each has at least one point not shared by the other (or equivalently neither covers the other), and the intersection of their interiors has the same dimension. The overlaps relationship is symmetrical.",
    //         apiReference: "https://postgis.net/docs/ST_Overlaps.html",
    //         apiExample: {   http: `/${testVersion}/Locations?$filter=geo.overlaps(location,'MULTIPOINT(${point.join()})')`,
    //                         curl: defaultGet("curl", "KEYHTTP"),
    //                         javascript: defaultGet("javascript", "KEYHTTP"),
    //                         python: defaultGet("python", "KEYHTTP") 
    //                     }
    //     };
    //     chai.request(server)
    //         .get(`/test/${infos.apiExample.http}`)
    //         .end((err: Error, res: any) => {
    //             console.log(infos.apiExample.http);
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

    it("Save and write apiDoc", (done) => {
        generateApiDoc(docs, "apiDocBuiltInGeospatial.js");
        done();
    });

});
