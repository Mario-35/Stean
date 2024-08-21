/**
 * TDD for ultime tests API
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
process.env.NODE_ENV = "test";
// onsole.log("!----------------------------------- TDD for ultime tests API -----------------------------------!");

import chai from "chai";
import chaiHttp from "chai-http";
import { IApiDoc, IApiInput, prepareToApiDoc, generateApiDoc, limitResult, testVersion, _RAWDB, defaultGet, defaultPost, keyTokenName, identification, apiInfos, blank, infos } from "./constant";
import { server } from "../../server/index";
import { addStartNewTest, addTest, writeLog } from "./tests";
import { Ientity } from "../../server/types";

chai.use(chaiHttp);

const should = chai.should();
const docs: IApiDoc[] = [];
const entity: Ientity = _RAWDB.Configs;

const addToApiDoc = (input: IApiInput) => {
	docs.push(prepareToApiDoc(input, entity.name));
};


const conf = {
    "name": "newconfig", 
    "port": 8030,
    "pg": {
        "host": "localhost",
        "port": 5432,
        "user": "newuser",
        "password": "newpass",
        "database": "newdb",
        "retry": 2,
		"tunnel": {
			"sshConnection": {
				"host": "147.100.165.4",
				"username": "madam",
				"port": 22,
				"password": "Mario35*"
			},
			"forwardConnection": {
				"srcAddr": "localhost",
				"srcPort": 1111,
				"dstAddr": "localhost",
				"dstPort": 5432
			}
		}
    },
    "apiVersion": "v1.1",
    "date_format": "DD/MM/YYYY hh:mi:ss",
    "webSite": "http://sensorthings.geosas.fr/apidoc/",
    "nb_page": 200,
    "alias": [
        ""
    ],
    "extensions": [
        "base",
        "multiDatastream",
        "logs",
        "users"
    ],
    "options": [
        "canDrop"
    ]

};
const confPres = {
    "name": "[newconfig]Name of the config", 
    "pg": {
        "host": "[localhost] Postgres Host",
        "port": "[5432] Postgres Port",
        "user": "Postgres username to create",
        "password": "Postgres password to create",
        "database": "Name of the database (create it if not exist)",
        "retry": "[2] number of connection retry",
		"tunnel": {
			"sshConnection": {
				"host": "[8.8.8.8] Distant host",
				"username": "Distant username",
				"password": "Distant password",
				"port": "[22] Distant ssh port"
			},
			"forwardConnection": {
				"srcAddr": "[localhost] forward Connection source",
				"srcPort": "[1111] forward Connection source",
				"dstAddr": "[localhost] forward Connection distant",
				"dstPort": "[5432] forward Connection distant",
			}
		}
    },
    "apiVersion": "[v1.1] Model",
    "date_format": "[DD/MM/YYYY hh:mi:ss] Date format",
    "webSite": "Web site",
    "nb_page": "[200] Default pagination number",
    "alias": [
        "name", "Alias"
    ],
    "extensions": [
        "List of extensions"
    ],
    "options": [
        "List of options"
    ]

};

addToApiDoc({
	api: `{infos} ${entity.name} infos`,
	apiName: `Infos${entity.name}`,
	apiDescription: infos[entity.name].definition,
	apiReference: infos[entity.name].reference,
	result: ""
});

describe("endpoint : Config", () => {
	let token = "";
	before((done) => {
		addStartNewTest(entity.name);
		chai.request(server)
			.post(`/test/${testVersion}/login`)
			.send(identification)
			.type("form")
			.end((err: Error, res: any) => {
				token = String(res.body["token"]);
				done();
			});
	});

	describe(`{get} ${entity.name}`, () => {
		afterEach(() => { writeLog(true); });
		
		it(`Return all ${entity.name}`, (done) => {
			const infos = addTest({
				api: `{get} ${entity.name} Get all`,
				apiName: `GetAll${entity.name}`,
				apiDescription: `Retrieve all ${entity.name}}`,
				apiReference: "",
				apiExample: {
					http: `${testVersion}/${entity.name}`,
					curl: defaultGet("curl", "KEYHTTP"),
					javascript: defaultGet("javascript", "KEYHTTP"),
					python: defaultGet("python", "KEYHTTP")
				}
			});
			chai.request(server)
				.get(`/test/${infos.apiExample.http}`)
				.set("Cookie", `${keyTokenName}=${token}`)
				.end((err, res) => {
					should.not.exist(err);
					res.status.should.equal(200);
					res.type.should.equal("application/json");
					addToApiDoc({
						...infos,
						result: res
					});
					done();
				});
		});

		it(`Return ${entity.name} id: 1 `, (done) => {
			const infos = addTest({
				api: `{get} ${entity.name}(:id) Get one`,
				apiName: `GetOne${entity.name}`,
				apiDescription: `Get a specific ${entity.singular}`,
				apiReference: "https://docs.ogc.org/is/18-088/18-088.html#usage-address-entity",
				apiExample: {
					http: `${testVersion}/${entity.name}(1)`,					
					curl: defaultGet("curl", "KEYHTTP"),
					javascript: defaultGet("javascript", "KEYHTTP"),
					python: defaultGet("python", "KEYHTTP")
				}
			});
			chai.request(server)
				.get(`/test/${infos.apiExample.http}`)
				.set("Cookie", `${keyTokenName}=${token}`)
				.end((err: Error, res: any) => {
					should.not.exist(err);
					res.status.should.equal(200);
					res.type.should.equal("application/json");
					addToApiDoc({
						...infos,
						result: res
					});
					done();
				});
		});

	});

	describe(`{post} ${entity.name}`, () => {
		afterEach(() => { writeLog(true); });
		it(`Return added ${entity.name}`, (done) => {
			const infos = addTest({
				api: `{post} ${entity.name} Post basic`,
				apiName: `Post${entity.name}`,
				apiDescription: `Post a new config${blank(1)}${apiInfos["2"]}${blank(1)}${apiInfos["1"]}`,
				apiReference: "https://docs.ogc.org/is/18-088/18-088.html#_request",
				apiPermission: "admin:computer",
				apiExample: {
					http: `${testVersion}/${entity.name}`,
					curl: defaultPost("curl", "KEYHTTP", conf),
					javascript: defaultPost("javascript", "KEYHTTP", conf),
					python: defaultPost("python", "KEYHTTP", conf)
				},
				apiParamExample: confPres
			});
			chai.request(server)
				.post(`/test/${infos.apiExample.http}`)
				.send(conf)
				.set("Cookie", `${keyTokenName}=${token}`)
				.end((err: Error, res: any) => {
					should.not.exist(err);
					res.status.should.equal(201);
					res.type.should.equal("application/json");
					addToApiDoc({
						...infos,
						result: limitResult(res)
					});
					generateApiDoc(docs, `apiDoc${entity.name}.js`);
					done();
				});
		});

	});


});
