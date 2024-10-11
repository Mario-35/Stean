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
import { server } from "../../server/index";
import { addStartNewTest, addTest, writeLog } from "./tests";

chai.use(chaiHttp);
const should = chai.should();
const tests: Record<string, any> = {
    "/test/v1.1/Things?$filter=Datastreams/ObservedProperty/description eq 'Description of classic Observed Property'": 1,
    "/test/v1.1/Observations?$filter=phenomenonTime gt 2024-06-05T02:15:01+02:00": 16,
    "/test/v1.1/Things?$filter=Datastreams/unitOfMeasurement/name eq 'Pression'": 1,
    "/test/v1.1/Things?$filter=Datastreams/unitOfMeasurement/name eq 'PM 2.5 Particulates (ug/m3)'": 1,
    "/test/v1.1/Observations?$filter=result gt 290 or result eq 250": 28,
    "/test/v1.1/Observations?$filter=length(result) le 2": 30,
    "/test/v1.1/Datastreams?$filter=ObservedProperty/name eq 'stream level'": 2,
    "/test/v1.1/Things?$filter=Datastreams/Observations/resultTime ge 2020-06-01T00:00:00Z and Datastreams/Observations/resultTime le 2022-07-01T00:00:00Z": 4,
    // "/test/v1.1/Locations?$filter=geo.intersects(location, geography'POLYGON (( -2.216815652511258 48.861982410214154, -2.0597541784431996 46.54337219625134, 2.8733501863528375 46.333340506967716, 1.413958211358164 48.61209155292218, 0.009716371272475044 48.95906378031344, -2.216815652511258 48.861982410214154))') and location/type eq 'Point'": 5,
    // "/test/v1.1/Locations?$filter=geo.intersects(geography'POLYGON ((-2.216815652511258 48.861982410214154, -2.0597541784431996 46.54337219625134, 2.8733501863528375 46.333340506967716, 1.413958211358164 48.61209155292218, 0.009716371272475044 48.95906378031344, -2.216815652511258 48.861982410214154))', location) and location/type eq 'Point'": 5,
    // "/test/v1.1/Things?$filter=Datastreams/Observations/FeatureOfInterest/id eq 'FOI_1' and Datastreams/Observations/resultTime ge 2010-06-01T00:00:00Z and date(Datastreams/Observations/resultTime) le date(2010-07-01T00:00:00Z)",
    // "/test/v1.1/Datastreams?$expand=Observations($filter=result eq 1;$expand=FeatureOfInterest;$select=@iot.id;$orderby=id;$skip=5;$top=10;$count=true),ObservedProperty",
    // "/test/v1.1/Locations?$filter=geo.distance(location,geography'POINT(-2.216815652511258 48.861982410214154)') gt 3": 16,
    // "/test/v1.1/Locations?$filter=geo.intersects(location, geography'LINESTRING(-0.21831720070755978 48.56370353432371, -3.2105651848888783 47.33247038599788)')",
    // "/test/v1.1/Locations?$filter=st_contains(geography'POLYGON((7.5 51.5, 7.5 53.5, 8.5 53.5, 8.5 51.5, 7.5 51.5))', location)",
    // "/test/v1.1/Locations?$filter=st_crosses(geography'LINESTRING(7.5 51.5, 7.5 53.5)', location)",
    // "/test/v1.1/Locations?$filter=st_disjoint(geography'POLYGON((7.5 51.5, 7.5 53.5, 8.5 53.5, 8.5 51.5, 7.5 51.5))', location)",
    // "/test/v1.1/Locations?$filter=geo.equals(location, geography'POINT(-1.54241217683861 47.223625061665274)')":16,
    // "/test/v1.1/Locations?$filter=st_intersects(location, geography'LINESTRING(7.5 51, 7.5 54)')",
    // "/test/v1.1/Locations?$filter=st_overlaps(geography'POLYGON((7.5 51.5, 7.5 53.5, 8.5 53.5, 8.5 51.5, 7.5 51.5))', location)",
    // "/test/v1.1/Locations?$filter=st_relate(geography'POLYGON((7.5 51.5, 7.5 53.5, 8.5 53.5, 8.5 51.5, 7.5 51.5))', location, 'T********')",
    // "/test/v1.1/Locations?$filter=st_touches(geography'POLYGON((8 53, 7.5 54.5, 8.5 54.5, 8 53))', location)",
    // "/test/v1.1/Locations?$filter=geo.within(location, geography'POINT(-4.108433416883344 47.99535576613954)')": 16,
    // "/test/v1.1/Observations?$filter=validTime gt 2016-01-02T01:01:01.000Z/2016-01-03T23:59:59.999Z sub duration'P1D'"

};
describe("Various Get tests", () => {
    before((done) => {
        addStartNewTest("Various");
		done();
	});
	afterEach(() => { writeLog(true); });
    Object.keys(tests).forEach((test: string) => {
        it(test, (done) => {
            addTest({
				api: `result => ${+tests[test]} : `,
				apiName: "",
				apiDescription: "",
				apiReference: "",
				apiExample: {
                    http: test,
				}
			});
            chai.request(server)
                .get(test)
                .end((err: Error, res: any) => {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal("application/json");
                    res.body["@iot.count"].should.eql(+tests[test]);					                    
                    done();
                });
        });
    });
});

