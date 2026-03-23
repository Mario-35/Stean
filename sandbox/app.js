
go.onclick = async (e) => {
	e.preventDefault();
	// let temp = 'delete FROM "observation" WHERE 1=1';
	const datasJson = {
		header: false,
		nan: true,
		columns: { '1': { Datastream: '1', FeaturesOfInterest: '1' } }
	  };
	  
	 Object.keys(datasJson["columns"]).forEach((key) => {
		 resultat.value = datasJson["columns"][key];
	 });
};

const test = {
	"versionFull": [
	  {
		"version": "PostgreSQL 16.0, compiled by Visual C++ build 1935, 64-bit"
	  }
	],
	"version": [
	  {
		"version": "16.0"
	  }
	],
	"get_extensions": [
	  {
		"extension": [
		  "plpgsql-1.0",
		  "postgis-3.4.0",
		  "tablefunc-1.0"
		]
	  }
	],
	"get_databases": [
	  {
		"datname": "postgres"
	  },
	  {
		"datname": "loradatas"
	  },
	  {
		"datname": "agrhys"
	  },
	  {
		"datname": "rennesmetro"
	  },
	  {
		"datname": "adam"
	  },
	  {
		"datname": "test"
	  },
	  {
		"datname": "admin"
	  },
	  {
		"datname": "mario"
	  }
	],
	"get_uptime": [
	  {
		"pg_postmaster_start_time": "2023-10-21T06:03:10.284Z"
	  }
	],
	"get_schemas": [
	  {
		"nspname": "public"
	  }
	],
	"get_json_cols": [],
	"get_partitionned_tables": [],
	"get_partitionned_implementation": [],
	"has_pg_buffercache": [],
	"has_pgstatstatements": [],
	"is_superuser": [
	  {
		"?column?": 1
	  }
	],
	"dump_pgstatactivity": [
	  {
		"date_trunc": "2023-10-26T08:59:17.000Z",
		"datid": null,
		"datname": null,
		"pid": 8168,
		"usesysid": null,
		"usename": null,
		"application_name": "",
		"client_addr": null,
		"client_hostname": null,
		"client_port": null,
		"backend_start": "2023-10-21T06:03:10.000Z",
		"xact_start": null,
		"query_start": null,
		"state_change": null,
		"wait_event": "AutoVacuumMain",
		"query": ""
	  },
	  {
		"date_trunc": "2023-10-26T08:59:17.000Z",
		"datid": null,
		"datname": null,
		"pid": 8176,
		"usesysid": 10,
		"usename": "postgres",
		"application_name": "",
		"client_addr": null,
		"client_hostname": null,
		"client_port": null,
		"backend_start": "2023-10-21T06:03:10.000Z",
		"xact_start": null,
		"query_start": null,
		"state_change": null,
		"wait_event": "LogicalLauncherMain",
		"query": ""
	  },
	  {
		"date_trunc": "2023-10-26T08:59:17.000Z",
		"datid": 5,
		"datname": "postgres",
		"pid": 24240,
		"usesysid": 10,
		"usename": "postgres",
		"application_name": "DBeaver 23.2.2 - Main <postgres>",
		"client_addr": "127.0.0.1",
		"client_hostname": null,
		"client_port": 62678,
		"backend_start": "2023-10-26T05:06:13.000Z",
		"xact_start": null,
		"query_start": "2023-10-26T05:06:17.000Z",
		"state_change": "2023-10-26T05:06:17.380Z",
		"wait_event": "ClientRead",
		"query": "DROP DATABASE test"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:17.000Z",
		"datid": 5,
		"datname": "postgres",
		"pid": 8352,
		"usesysid": 10,
		"usename": "postgres",
		"application_name": "DBeaver 23.2.2 - Metadata <postgres>",
		"client_addr": "127.0.0.1",
		"client_hostname": null,
		"client_port": 62679,
		"backend_start": "2023-10-26T05:06:13.000Z",
		"xact_start": null,
		"query_start": "2023-10-26T05:06:13.000Z",
		"state_change": "2023-10-26T05:06:13.713Z",
		"wait_event": "ClientRead",
		"query": "SELECT * FROM pg_catalog.pg_enum"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:17.000Z",
		"datid": 354854,
		"datname": "rennesmetro",
		"pid": 12872,
		"usesysid": 10,
		"usename": "postgres",
		"application_name": "DBeaver 23.2.2 - Main <rennesmetro>",
		"client_addr": "127.0.0.1",
		"client_hostname": null,
		"client_port": 63665,
		"backend_start": "2023-10-26T05:58:14.000Z",
		"xact_start": null,
		"query_start": "2023-10-26T05:58:25.000Z",
		"state_change": "2023-10-26T05:58:25.115Z",
		"wait_event": "ClientRead",
		"query": "SELECT c.oid, a.attnum, a.attname, c.relname, n.nspname, a.attnotnull OR (t.typtype = 'd' AND t.typnotnull), a.attidentity != '' OR pg_catalog.pg_get_expr(d.adbin, d.adrelid) LIKE '%nextval(%' FROM pg_catalog.pg_class c JOIN pg_catalog.pg_namespace n ON (c.relnamespace = n.oid) JOIN pg_catalog.pg_attribute a ON (c.oid = a.attrelid) JOIN pg_catalog.pg_type t ON (a.atttypid = t.oid) LEFT JOIN pg_catalog.pg_attrdef d ON (d.adrelid = a.attrelid AND d.adnum = a.attnum) JOIN (SELECT 356267 AS oid, 1 AS attnum UNION ALL SELECT 356267, 2 UNION ALL SELECT 356267, 3 UNION ALL SELECT 356267, 4 UNION ALL SELECT 356267, 5) vals ON (c.oid = vals.oid AND a.attnum = vals.attnum) "
	  },
	  {
		"date_trunc": "2023-10-26T08:59:17.000Z",
		"datid": 354854,
		"datname": "rennesmetro",
		"pid": 24348,
		"usesysid": 10,
		"usename": "postgres",
		"application_name": "DBeaver 23.2.2 - Metadata <rennesmetro>",
		"client_addr": "127.0.0.1",
		"client_hostname": null,
		"client_port": 63666,
		"backend_start": "2023-10-26T05:58:14.000Z",
		"xact_start": null,
		"query_start": "2023-10-26T05:58:25.000Z",
		"state_change": "2023-10-26T05:58:25.200Z",
		"wait_event": "ClientRead",
		"query": "SELECT c.oid,c.*,t.relname as tabrelname,rt.relnamespace as refnamespace,d.description, case when c.contype='c' then \"substring\"(pg_get_constraintdef(c.oid), 7) else null end consrc_copy\nFROM pg_catalog.pg_constraint c\nINNER JOIN pg_catalog.pg_class t ON t.oid=c.conrelid\nLEFT OUTER JOIN pg_catalog.pg_class rt ON rt.oid=c.confrelid\nLEFT OUTER JOIN pg_catalog.pg_description d ON d.objoid=c.oid AND d.objsubid=0 AND d.classoid='pg_constraint'::regclass\nWHERE c.conrelid=$1\nORDER BY c.oid"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:17.000Z",
		"datid": 492263,
		"datname": "mario",
		"pid": 14704,
		"usesysid": 10,
		"usename": "postgres",
		"application_name": "DBeaver 23.2.2 - Main <mario>",
		"client_addr": "127.0.0.1",
		"client_hostname": null,
		"client_port": 63667,
		"backend_start": "2023-10-26T05:58:49.000Z",
		"xact_start": null,
		"query_start": "2023-10-26T05:58:58.000Z",
		"state_change": "2023-10-26T05:58:58.757Z",
		"wait_event": "ClientRead",
		"query": "SHOW TRANSACTION ISOLATION LEVEL"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:17.000Z",
		"datid": 492263,
		"datname": "mario",
		"pid": 21256,
		"usesysid": 10,
		"usename": "postgres",
		"application_name": "DBeaver 23.2.2 - Metadata <mario>",
		"client_addr": "127.0.0.1",
		"client_hostname": null,
		"client_port": 63668,
		"backend_start": "2023-10-26T05:58:49.000Z",
		"xact_start": null,
		"query_start": "2023-10-26T08:56:16.000Z",
		"state_change": "2023-10-26T08:56:16.470Z",
		"wait_event": "ClientRead",
		"query": "SELECT pet.*, d.description FROM pg_catalog.pg_event_trigger pet\nLEFT OUTER JOIN pg_catalog.pg_description d ON pet.\"oid\" = d.objoid WHERE pet.evtname = $1"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:17.000Z",
		"datid": 492263,
		"datname": "mario",
		"pid": 15588,
		"usesysid": 10,
		"usename": "postgres",
		"application_name": "DBeaver 23.2.2 - SQLEditor <Script-41.sql>",
		"client_addr": "127.0.0.1",
		"client_hostname": null,
		"client_port": 49772,
		"backend_start": "2023-10-26T08:54:36.000Z",
		"xact_start": null,
		"query_start": "2023-10-26T08:56:24.000Z",
		"state_change": "2023-10-26T08:56:24.299Z",
		"wait_event": "ClientRead",
		"query": "SHOW search_path"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:17.000Z",
		"datid": 378306,
		"datname": "admin",
		"pid": 15072,
		"usesysid": 10,
		"usename": "postgres",
		"application_name": "STEAN 2.1.0",
		"client_addr": "::1",
		"client_hostname": null,
		"client_port": 49855,
		"backend_start": "2023-10-26T08:59:12.000Z",
		"xact_start": "2023-10-26T08:59:17.000Z",
		"query_start": "2023-10-26T08:59:17.000Z",
		"state_change": "2023-10-26T08:59:17.346Z",
		"wait_event": null,
		"query": " SELECT date_trunc('seconds', now()), datid, datname, pid,usesysid, usename, application_name, client_addr, client_hostname, client_port, date_trunc('seconds', backend_start) AS backend_start, date_trunc('seconds', xact_start) AS xact_start,  date_trunc('seconds', query_start) AS query_start, state_change, wait_event,  query FROM pg_stat_activity WHERE application_name != 'STEAN' "
	  },
	  {
		"date_trunc": "2023-10-26T08:59:17.000Z",
		"datid": 492263,
		"datname": "mario",
		"pid": 13580,
		"usesysid": 29265,
		"usename": "sensorapi",
		"application_name": "STEAN 2.1.0",
		"client_addr": "::1",
		"client_hostname": null,
		"client_port": 49856,
		"backend_start": "2023-10-26T08:59:12.000Z",
		"xact_start": null,
		"query_start": "2023-10-26T08:59:14.000Z",
		"state_change": "2023-10-26T08:59:14.550Z",
		"wait_event": "ClientRead",
		"query": "update decoder set code='function decode(bytes) {\t\"use strict\";\tfunction Decoder(input) { const decoded = { valid: true, err: 0, payload: input, messages: [] }; const temp = input.match(/.{1,2}/g); if (temp != null) { if (temp[0] == \"01\" || temp[0] == \"81\") { decoded.messages.push({ type: \"report_telemetry\", measurementName: nomenclature[\"0610\"], measurementValue: (parseInt(String(temp[2]) + String(temp[1]), 16) * 175.72) / 65536 - 46.85 }); decoded.messages.push({ type: \"report_telemetry\", measurementName: nomenclature[\"0710\"], measurementValue: (parseInt(temp[3], 16) * 125) / 256 - 6 }); decoded.messages.push({ type: \"upload_battery\", measurementName: nomenclature[\"period\"], measurementValue: parseInt(String(temp[5]) + String(temp[4]), 16) * 2 }); decoded.messages.push({ type: \"upload_battery\", measurementName: nomenclature[\"voltage\"], measurementValue: (parseInt(temp[8], 16) + 150) * 0.01 }); decoded.datas = {}; decoded.messages.map(e => decoded.datas[e.measurementName] = e.measurementValue); return decod"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:17.000Z",
		"datid": 354854,
		"datname": "rennesmetro",
		"pid": 12948,
		"usesysid": 29265,
		"usename": "sensorapi",
		"application_name": "STEAN 2.1.0",
		"client_addr": "::1",
		"client_hostname": null,
		"client_port": 49858,
		"backend_start": "2023-10-26T08:59:12.000Z",
		"xact_start": null,
		"query_start": "2023-10-26T08:59:14.000Z",
		"state_change": "2023-10-26T08:59:14.553Z",
		"wait_event": "ClientRead",
		"query": "update decoder set code='function decode(bytes) {\t\"use strict\";\tfunction Decoder(input) { const decoded = { valid: true, err: 0, payload: input, messages: [] }; const temp = input.match(/.{1,2}/g); if (temp != null) { if (temp[0] == \"01\" || temp[0] == \"81\") { decoded.messages.push({ type: \"report_telemetry\", measurementName: nomenclature[\"0610\"], measurementValue: (parseInt(String(temp[2]) + String(temp[1]), 16) * 175.72) / 65536 - 46.85 }); decoded.messages.push({ type: \"report_telemetry\", measurementName: nomenclature[\"0710\"], measurementValue: (parseInt(temp[3], 16) * 125) / 256 - 6 }); decoded.messages.push({ type: \"upload_battery\", measurementName: nomenclature[\"period\"], measurementValue: parseInt(String(temp[5]) + String(temp[4]), 16) * 2 }); decoded.messages.push({ type: \"upload_battery\", measurementName: nomenclature[\"voltage\"], measurementValue: (parseInt(temp[8], 16) + 150) * 0.01 }); decoded.datas = {}; decoded.messages.map(e => decoded.datas[e.measurementName] = e.measurementValue); return decod"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:17.000Z",
		"datid": 375548,
		"datname": "agrhys",
		"pid": 8540,
		"usesysid": 29265,
		"usename": "sensorapi",
		"application_name": "STEAN 2.1.0",
		"client_addr": "::1",
		"client_hostname": null,
		"client_port": 49859,
		"backend_start": "2023-10-26T08:59:13.000Z",
		"xact_start": null,
		"query_start": "2023-10-26T08:59:14.000Z",
		"state_change": "2023-10-26T08:59:14.542Z",
		"wait_event": "ClientRead",
		"query": "vacuum"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:17.000Z",
		"datid": null,
		"datname": null,
		"pid": 7852,
		"usesysid": null,
		"usename": null,
		"application_name": "",
		"client_addr": null,
		"client_hostname": null,
		"client_port": null,
		"backend_start": "2023-10-21T06:03:10.000Z",
		"xact_start": null,
		"query_start": null,
		"state_change": null,
		"wait_event": "BgWriterHibernate",
		"query": ""
	  },
	  {
		"date_trunc": "2023-10-26T08:59:17.000Z",
		"datid": null,
		"datname": null,
		"pid": 7836,
		"usesysid": null,
		"usename": null,
		"application_name": "",
		"client_addr": null,
		"client_hostname": null,
		"client_port": null,
		"backend_start": "2023-10-21T06:03:10.000Z",
		"xact_start": null,
		"query_start": null,
		"state_change": null,
		"wait_event": "CheckpointerMain",
		"query": ""
	  },
	  {
		"date_trunc": "2023-10-26T08:59:17.000Z",
		"datid": null,
		"datname": null,
		"pid": 8160,
		"usesysid": null,
		"usename": null,
		"application_name": "",
		"client_addr": null,
		"client_hostname": null,
		"client_port": null,
		"backend_start": "2023-10-21T06:03:10.000Z",
		"xact_start": null,
		"query_start": null,
		"state_change": null,
		"wait_event": "WalWriterMain",
		"query": ""
	  }
	],
	"dump_pgstatbgwriter": [
	  {
		"date_trunc": "2023-10-26T08:59:17.000Z",
		"checkpoints_timed": "3885",
		"checkpoints_req": "389",
		"checkpoint_write_time": 65082233,
		"checkpoint_sync_time": 166404,
		"buffers_checkpoint": "920664",
		"buffers_clean": "1146551",
		"maxwritten_clean": "6545",
		"buffers_backend": "5383198",
		"buffers_backend_fsync": "0",
		"buffers_alloc": "60257081",
		"stats_reset": "2023-09-29T15:38:29.000Z"
	  }
	],
	"dump_pgstatdatabase": [
	  {
		"date_trunc": "2023-10-26T08:59:17.000Z",
		"datid": 0,
		"datname": null,
		"numbackends": 0,
		"xact_commit": "0",
		"xact_rollback": "0",
		"blks_read": "5912",
		"blks_hit": "5459474",
		"tup_returned": "2096941",
		"tup_fetched": "1020132",
		"tup_inserted": "301730",
		"tup_updated": "374",
		"tup_deleted": "298447",
		"conflicts": "0",
		"stats_reset": null,
		"temp_files": "0",
		"temp_bytes": "0",
		"deadlocks": "0",
		"blk_read_time": 0,
		"blk_write_time": 0
	  },
	  {
		"date_trunc": "2023-10-26T08:59:17.000Z",
		"datid": 5,
		"datname": "postgres",
		"numbackends": 2,
		"xact_commit": "57461",
		"xact_rollback": "107",
		"blks_read": "12243",
		"blks_hit": "4290392",
		"tup_returned": "19643876",
		"tup_fetched": "1427751",
		"tup_inserted": "13429",
		"tup_updated": "596",
		"tup_deleted": "121",
		"conflicts": "0",
		"stats_reset": null,
		"temp_files": "0",
		"temp_bytes": "0",
		"deadlocks": "0",
		"blk_read_time": 0,
		"blk_write_time": 0
	  },
	  {
		"date_trunc": "2023-10-26T08:59:17.000Z",
		"datid": 465624,
		"datname": "loradatas",
		"numbackends": 0,
		"xact_commit": "10457",
		"xact_rollback": "9",
		"blks_read": "1300",
		"blks_hit": "445421",
		"tup_returned": "4506619",
		"tup_fetched": "103438",
		"tup_inserted": "174",
		"tup_updated": "54",
		"tup_deleted": "0",
		"conflicts": "0",
		"stats_reset": null,
		"temp_files": "0",
		"temp_bytes": "0",
		"deadlocks": "0",
		"blk_read_time": 0,
		"blk_write_time": 0
	  },
	  {
		"date_trunc": "2023-10-26T08:59:17.000Z",
		"datid": 1,
		"datname": "template1",
		"numbackends": 0,
		"xact_commit": "41542",
		"xact_rollback": "0",
		"blks_read": "6174",
		"blks_hit": "1660189",
		"tup_returned": "17947096",
		"tup_fetched": "353900",
		"tup_inserted": "19038",
		"tup_updated": "1143",
		"tup_deleted": "35",
		"conflicts": "0",
		"stats_reset": null,
		"temp_files": "0",
		"temp_bytes": "0",
		"deadlocks": "0",
		"blk_read_time": 0,
		"blk_write_time": 0
	  },
	  {
		"date_trunc": "2023-10-26T08:59:17.000Z",
		"datid": 4,
		"datname": "template0",
		"numbackends": 0,
		"xact_commit": "0",
		"xact_rollback": "0",
		"blks_read": "0",
		"blks_hit": "0",
		"tup_returned": "0",
		"tup_fetched": "0",
		"tup_inserted": "0",
		"tup_updated": "0",
		"tup_deleted": "0",
		"conflicts": "0",
		"stats_reset": null,
		"temp_files": "0",
		"temp_bytes": "0",
		"deadlocks": "0",
		"blk_read_time": 0,
		"blk_write_time": 0
	  },
	  {
		"date_trunc": "2023-10-26T08:59:17.000Z",
		"datid": 375548,
		"datname": "agrhys",
		"numbackends": 1,
		"xact_commit": "149558",
		"xact_rollback": "622",
		"blks_read": "202833",
		"blks_hit": "76679122",
		"tup_returned": "26787463",
		"tup_fetched": "4665824",
		"tup_inserted": "3846759",
		"tup_updated": "568",
		"tup_deleted": "117",
		"conflicts": "0",
		"stats_reset": null,
		"temp_files": "1",
		"temp_bytes": "26818302",
		"deadlocks": "0",
		"blk_read_time": 0,
		"blk_write_time": 0
	  },
	  {
		"date_trunc": "2023-10-26T08:59:17.000Z",
		"datid": 354854,
		"datname": "rennesmetro",
		"numbackends": 3,
		"xact_commit": "4312906",
		"xact_rollback": "1261",
		"blks_read": "12003457",
		"blks_hit": "83365914",
		"tup_returned": "419677371",
		"tup_fetched": "41060714",
		"tup_inserted": "2371066",
		"tup_updated": "822515",
		"tup_deleted": "741242",
		"conflicts": "0",
		"stats_reset": null,
		"temp_files": "293",
		"temp_bytes": "6879019008",
		"deadlocks": "0",
		"blk_read_time": 0,
		"blk_write_time": 0
	  },
	  {
		"date_trunc": "2023-10-26T08:59:17.000Z",
		"datid": 465677,
		"datname": "adam",
		"numbackends": 0,
		"xact_commit": "81173",
		"xact_rollback": "31",
		"blks_read": "293573",
		"blks_hit": "937936",
		"tup_returned": "9078485",
		"tup_fetched": "130463",
		"tup_inserted": "72781",
		"tup_updated": "42",
		"tup_deleted": "0",
		"conflicts": "0",
		"stats_reset": null,
		"temp_files": "30",
		"temp_bytes": "2129018880",
		"deadlocks": "0",
		"blk_read_time": 0,
		"blk_write_time": 0
	  },
	  {
		"date_trunc": "2023-10-26T08:59:17.000Z",
		"datid": 500997,
		"datname": "test",
		"numbackends": 0,
		"xact_commit": "1196",
		"xact_rollback": "18",
		"blks_read": "73",
		"blks_hit": "150953",
		"tup_returned": "306712",
		"tup_fetched": "28742",
		"tup_inserted": "15544",
		"tup_updated": "289",
		"tup_deleted": "114",
		"conflicts": "0",
		"stats_reset": null,
		"temp_files": "0",
		"temp_bytes": "0",
		"deadlocks": "0",
		"blk_read_time": 0,
		"blk_write_time": 0
	  },
	  {
		"date_trunc": "2023-10-26T08:59:17.000Z",
		"datid": 378306,
		"datname": "admin",
		"numbackends": 1,
		"xact_commit": "29065",
		"xact_rollback": "44",
		"blks_read": "6874",
		"blks_hit": "1863547",
		"tup_returned": "8587710",
		"tup_fetched": "1172805",
		"tup_inserted": "14631",
		"tup_updated": "4827",
		"tup_deleted": "92",
		"conflicts": "0",
		"stats_reset": null,
		"temp_files": "0",
		"temp_bytes": "0",
		"deadlocks": "0",
		"blk_read_time": 0,
		"blk_write_time": 0
	  },
	  {
		"date_trunc": "2023-10-26T08:59:17.000Z",
		"datid": 492263,
		"datname": "mario",
		"numbackends": 4,
		"xact_commit": "26951",
		"xact_rollback": "246",
		"blks_read": "839",
		"blks_hit": "1294990",
		"tup_returned": "1414410",
		"tup_fetched": "524366",
		"tup_inserted": "15547",
		"tup_updated": "331",
		"tup_deleted": "517",
		"conflicts": "0",
		"stats_reset": null,
		"temp_files": "0",
		"temp_bytes": "0",
		"deadlocks": "0",
		"blk_read_time": 0,
		"blk_write_time": 0
	  }
	],
	"dump_pgtablespace_size": [
	  {
		"date_trunc": "2023-10-26T08:59:17.000Z",
		"spcname": "pg_default",
		"pg_tablespace_size": "3050214242",
		"tablespace_location": "C:/Program Files/PostgreSQL/16/data/base"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:17.000Z",
		"spcname": "pg_global",
		"pg_tablespace_size": "1231668",
		"tablespace_location": "C:/Program Files/PostgreSQL/16/data/global"
	  }
	],
	"dump_pgstatdatabaseconflicts": [
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"datid": 5,
		"datname": "postgres",
		"confl_tablespace": "0",
		"confl_lock": "0",
		"confl_snapshot": "0",
		"confl_bufferpin": "0",
		"confl_deadlock": "0",
		"confl_active_logicalslot": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"datid": 465624,
		"datname": "loradatas",
		"confl_tablespace": "0",
		"confl_lock": "0",
		"confl_snapshot": "0",
		"confl_bufferpin": "0",
		"confl_deadlock": "0",
		"confl_active_logicalslot": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"datid": 1,
		"datname": "template1",
		"confl_tablespace": "0",
		"confl_lock": "0",
		"confl_snapshot": "0",
		"confl_bufferpin": "0",
		"confl_deadlock": "0",
		"confl_active_logicalslot": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"datid": 4,
		"datname": "template0",
		"confl_tablespace": "0",
		"confl_lock": "0",
		"confl_snapshot": "0",
		"confl_bufferpin": "0",
		"confl_deadlock": "0",
		"confl_active_logicalslot": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"datid": 375548,
		"datname": "agrhys",
		"confl_tablespace": "0",
		"confl_lock": "0",
		"confl_snapshot": "0",
		"confl_bufferpin": "0",
		"confl_deadlock": "0",
		"confl_active_logicalslot": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"datid": 354854,
		"datname": "rennesmetro",
		"confl_tablespace": "0",
		"confl_lock": "0",
		"confl_snapshot": "0",
		"confl_bufferpin": "0",
		"confl_deadlock": "0",
		"confl_active_logicalslot": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"datid": 465677,
		"datname": "adam",
		"confl_tablespace": "0",
		"confl_lock": "0",
		"confl_snapshot": "0",
		"confl_bufferpin": "0",
		"confl_deadlock": "0",
		"confl_active_logicalslot": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"datid": 500997,
		"datname": "test",
		"confl_tablespace": "0",
		"confl_lock": "0",
		"confl_snapshot": "0",
		"confl_bufferpin": "0",
		"confl_deadlock": "0",
		"confl_active_logicalslot": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"datid": 378306,
		"datname": "admin",
		"confl_tablespace": "0",
		"confl_lock": "0",
		"confl_snapshot": "0",
		"confl_bufferpin": "0",
		"confl_deadlock": "0",
		"confl_active_logicalslot": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"datid": 492263,
		"datname": "mario",
		"confl_tablespace": "0",
		"confl_lock": "0",
		"confl_snapshot": "0",
		"confl_bufferpin": "0",
		"confl_deadlock": "0",
		"confl_active_logicalslot": "0"
	  }
	],
	"dump_pgstatreplication": [],
	"dump_pgstattables": [
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4060,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3592",
		"seq_scan": "1",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": "2023-10-26T08:59:14.000Z",
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "3839",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4159,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2600",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4165,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3350",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4147,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3079",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "1",
		"idx_tup_fetch": "0",
		"n_tup_ins": "3",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "3",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2753,
		"schemaname": "pg_catalog",
		"relname": "pg_opfamily",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "29",
		"idx_tup_fetch": "1",
		"n_tup_ins": "14",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "14",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4181,
		"schemaname": "pg_toast",
		"relname": "pg_toast_6000",
		"seq_scan": "1",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": "2023-10-26T08:59:14.000Z",
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "3839",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1247,
		"schemaname": "pg_catalog",
		"relname": "pg_type",
		"seq_scan": "8",
		"seq_tup_read": "5192",
		"idx_scan": "32150",
		"idx_tup_fetch": "27094",
		"n_tup_ins": "36",
		"n_tup_upd": "7",
		"n_tup_del": "0",
		"n_tup_hot_upd": "7",
		"n_live_tup": "36",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3601,
		"schemaname": "pg_catalog",
		"relname": "pg_ts_parser",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2602,
		"schemaname": "pg_catalog",
		"relname": "pg_amop",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "23385",
		"idx_tup_fetch": "40547",
		"n_tup_ins": "78",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "78",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3439,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3381",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6104,
		"schemaname": "pg_catalog",
		"relname": "pg_publication",
		"seq_scan": "947",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3429,
		"schemaname": "pg_catalog",
		"relname": "pg_statistic_ext_data",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2846,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2396",
		"seq_scan": "1",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": "2023-10-26T08:59:14.000Z",
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "3839",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4145,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3466",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2619,
		"schemaname": "pg_catalog",
		"relname": "pg_statistic",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "13602",
		"idx_tup_fetch": "12527",
		"n_tup_ins": "29",
		"n_tup_upd": "986",
		"n_tup_del": "0",
		"n_tup_hot_upd": "922",
		"n_live_tup": "29",
		"n_dead_tup": "95",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4155,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3394",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 379419,
		"schemaname": "public",
		"relname": "config",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": null,
		"idx_tup_fetch": null,
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3541,
		"schemaname": "pg_catalog",
		"relname": "pg_range",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "32",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3602,
		"schemaname": "pg_catalog",
		"relname": "pg_ts_config",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3381,
		"schemaname": "pg_catalog",
		"relname": "pg_statistic_ext",
		"seq_scan": "20",
		"seq_tup_read": "0",
		"idx_scan": "4402",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 379405,
		"schemaname": "public",
		"relname": "user",
		"seq_scan": "8521",
		"seq_tup_read": "17039",
		"idx_scan": "222",
		"idx_tup_fetch": "220",
		"n_tup_ins": "2",
		"n_tup_upd": "3771",
		"n_tup_del": "0",
		"n_tup_hot_upd": "3771",
		"n_live_tup": "2",
		"n_dead_tup": "16",
		"last_vacuum": null,
		"last_autovacuum": "2023-10-26T08:45:39.000Z",
		"last_analyze": null,
		"last_autoanalyze": "2023-10-26T08:33:39.000Z",
		"vacuum_count": "0",
		"autovacuum_count": "68",
		"analyze_count": "0",
		"autoanalyze_count": "71"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4175,
		"schemaname": "pg_toast",
		"relname": "pg_toast_1260",
		"seq_scan": "1",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": "2023-10-26T08:59:14.000Z",
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "3839",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6106,
		"schemaname": "pg_catalog",
		"relname": "pg_publication_rel",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "946",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 14835,
		"schemaname": "pg_toast",
		"relname": "pg_toast_14832",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2605,
		"schemaname": "pg_catalog",
		"relname": "pg_cast",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "46038",
		"idx_tup_fetch": "6367",
		"n_tup_ins": "26",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "26",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 379408,
		"schemaname": "pg_toast",
		"relname": "pg_toast_379405",
		"seq_scan": "1",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4183,
		"schemaname": "pg_toast",
		"relname": "pg_toast_6100",
		"seq_scan": "1",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": "2023-10-26T08:59:14.000Z",
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "3839",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4171,
		"schemaname": "pg_toast",
		"relname": "pg_toast_1247",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2224,
		"schemaname": "pg_catalog",
		"relname": "pg_sequence",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "32",
		"idx_tup_fetch": "32",
		"n_tup_ins": "2",
		"n_tup_upd": "2",
		"n_tup_del": "0",
		"n_tup_hot_upd": "2",
		"n_live_tup": "2",
		"n_dead_tup": "2",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2611,
		"schemaname": "pg_catalog",
		"relname": "pg_inherits",
		"seq_scan": "42",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2830,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2604",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1417,
		"schemaname": "pg_catalog",
		"relname": "pg_foreign_server",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 14845,
		"schemaname": "pg_toast",
		"relname": "pg_toast_14842",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1262,
		"schemaname": "pg_catalog",
		"relname": "pg_database",
		"seq_scan": "124829",
		"seq_tup_read": "1032698",
		"idx_scan": "664179",
		"idx_tup_fetch": "663087",
		"n_tup_ins": "345",
		"n_tup_upd": "47",
		"n_tup_del": "335",
		"n_tup_hot_upd": "4",
		"n_live_tup": "10",
		"n_dead_tup": "0",
		"last_vacuum": "2023-10-26T08:59:14.000Z",
		"last_autovacuum": "2023-10-14T12:52:16.000Z",
		"last_analyze": "2023-09-29T15:38:30.000Z",
		"last_autoanalyze": "2023-10-25T14:33:21.000Z",
		"vacuum_count": "3840",
		"autovacuum_count": "5",
		"analyze_count": "1",
		"autoanalyze_count": "14"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6244,
		"schemaname": "pg_toast",
		"relname": "pg_toast_6243",
		"seq_scan": "1",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": "2023-10-26T08:59:14.000Z",
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "3839",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3430,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3429",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 14840,
		"schemaname": "pg_toast",
		"relname": "pg_toast_14837",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3501,
		"schemaname": "pg_catalog",
		"relname": "pg_enum",
		"seq_scan": "8",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2607,
		"schemaname": "pg_catalog",
		"relname": "pg_conversion",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3576,
		"schemaname": "pg_catalog",
		"relname": "pg_transform",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "70",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 826,
		"schemaname": "pg_catalog",
		"relname": "pg_default_acl",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "8",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2601,
		"schemaname": "pg_catalog",
		"relname": "pg_am",
		"seq_scan": "8876",
		"seq_tup_read": "8876",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2604,
		"schemaname": "pg_catalog",
		"relname": "pg_attrdef",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "58",
		"idx_tup_fetch": "57",
		"n_tup_ins": "1",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "1",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3394,
		"schemaname": "pg_catalog",
		"relname": "pg_init_privs",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "3",
		"idx_tup_fetch": "0",
		"n_tup_ins": "3",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "3",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4167,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3256",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2336,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2620",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4151,
		"schemaname": "pg_toast",
		"relname": "pg_toast_1417",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2834,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2609",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6000,
		"schemaname": "pg_catalog",
		"relname": "pg_replication_origin",
		"seq_scan": "5",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": "2023-10-26T08:59:14.000Z",
		"last_autovacuum": null,
		"last_analyze": "2023-09-29T15:38:30.000Z",
		"last_autoanalyze": null,
		"vacuum_count": "3839",
		"autovacuum_count": "0",
		"analyze_count": "1",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2603,
		"schemaname": "pg_catalog",
		"relname": "pg_amproc",
		"seq_scan": "12",
		"seq_tup_read": "42",
		"idx_scan": "13809",
		"idx_tup_fetch": "35068",
		"n_tup_ins": "69",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "69",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2606,
		"schemaname": "pg_catalog",
		"relname": "pg_constraint",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "1078",
		"idx_tup_fetch": "148",
		"n_tup_ins": "3",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "3",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1255,
		"schemaname": "pg_catalog",
		"relname": "pg_proc",
		"seq_scan": "120",
		"seq_tup_read": "490080",
		"idx_scan": "36468",
		"idx_tup_fetch": "38182",
		"n_tup_ins": "787",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "4084",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": "2023-10-18T08:44:46.000Z",
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "1"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2840,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2619",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "154",
		"idx_tup_fetch": "208",
		"n_tup_ins": "68",
		"n_tup_upd": "0",
		"n_tup_del": "50",
		"n_tup_hot_upd": "0",
		"n_live_tup": "18",
		"n_dead_tup": "50",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4173,
		"schemaname": "pg_toast",
		"relname": "pg_toast_1418",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2328,
		"schemaname": "pg_catalog",
		"relname": "pg_foreign_data_wrapper",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2620,
		"schemaname": "pg_catalog",
		"relname": "pg_trigger",
		"seq_scan": "20",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4157,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2612",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1260,
		"schemaname": "pg_catalog",
		"relname": "pg_authid",
		"seq_scan": "8677",
		"seq_tup_read": "21363",
		"idx_scan": "44097",
		"idx_tup_fetch": "44022",
		"n_tup_ins": "18",
		"n_tup_upd": "327",
		"n_tup_del": "2",
		"n_tup_hot_upd": "327",
		"n_live_tup": "16",
		"n_dead_tup": "0",
		"last_vacuum": "2023-10-26T08:59:14.000Z",
		"last_autovacuum": null,
		"last_analyze": "2023-09-29T15:38:30.000Z",
		"last_autoanalyze": "2023-10-21T13:15:50.000Z",
		"vacuum_count": "3839",
		"autovacuum_count": "0",
		"analyze_count": "1",
		"autoanalyze_count": "6"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2612,
		"schemaname": "pg_catalog",
		"relname": "pg_language",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "6",
		"idx_tup_fetch": "6",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4149,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2328",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6102,
		"schemaname": "pg_catalog",
		"relname": "pg_subscription_rel",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1214,
		"schemaname": "pg_catalog",
		"relname": "pg_shdepend",
		"seq_scan": "5",
		"seq_tup_read": "13647",
		"idx_scan": "10549",
		"idx_tup_fetch": "299025",
		"n_tup_ins": "301359",
		"n_tup_upd": "0",
		"n_tup_del": "298110",
		"n_tup_hot_upd": "0",
		"n_live_tup": "1811",
		"n_dead_tup": "0",
		"last_vacuum": "2023-10-26T08:59:14.000Z",
		"last_autovacuum": "2023-10-26T05:06:23.000Z",
		"last_analyze": "2023-09-29T15:38:30.000Z",
		"last_autoanalyze": "2023-10-26T05:07:04.000Z",
		"vacuum_count": "3839",
		"autovacuum_count": "327",
		"analyze_count": "1",
		"autoanalyze_count": "621"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4163,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2615",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3598,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3596",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4169,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3600",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2615,
		"schemaname": "pg_catalog",
		"relname": "pg_namespace",
		"seq_scan": "285",
		"seq_tup_read": "1084",
		"idx_scan": "8985",
		"idx_tup_fetch": "2838",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2836,
		"schemaname": "pg_toast",
		"relname": "pg_toast_1255",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "9",
		"idx_tup_fetch": "20",
		"n_tup_ins": "10",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "10",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3456,
		"schemaname": "pg_catalog",
		"relname": "pg_collation",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "944",
		"idx_tup_fetch": "944",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3079,
		"schemaname": "pg_catalog",
		"relname": "pg_extension",
		"seq_scan": "21",
		"seq_tup_read": "63",
		"idx_scan": "9",
		"idx_tup_fetch": "5",
		"n_tup_ins": "2",
		"n_tup_upd": "1",
		"n_tup_del": "0",
		"n_tup_hot_upd": "1",
		"n_live_tup": "2",
		"n_dead_tup": "1",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 378625,
		"schemaname": "public",
		"relname": "spatial_ref_sys",
		"seq_scan": "1",
		"seq_tup_read": "0",
		"idx_scan": "8500",
		"idx_tup_fetch": "0",
		"n_tup_ins": "8500",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "8500",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": "2023-10-18T08:44:46.000Z",
		"last_analyze": "2023-10-18T08:43:38.000Z",
		"last_autoanalyze": "2023-10-18T08:44:46.000Z",
		"vacuum_count": "0",
		"autovacuum_count": "1",
		"analyze_count": "1",
		"autoanalyze_count": "1"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6100,
		"schemaname": "pg_catalog",
		"relname": "pg_subscription",
		"seq_scan": "6664",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": "2023-10-26T08:59:14.000Z",
		"last_autovacuum": null,
		"last_analyze": "2023-09-29T15:38:30.000Z",
		"last_autoanalyze": null,
		"vacuum_count": "3839",
		"autovacuum_count": "0",
		"analyze_count": "1",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 14830,
		"schemaname": "pg_toast",
		"relname": "pg_toast_14827",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2832,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2606",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2396,
		"schemaname": "pg_catalog",
		"relname": "pg_shdescription",
		"seq_scan": "146",
		"seq_tup_read": "436",
		"idx_scan": "339",
		"idx_tup_fetch": "0",
		"n_tup_ins": "3",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "3",
		"n_dead_tup": "0",
		"last_vacuum": "2023-10-26T08:59:14.000Z",
		"last_autovacuum": null,
		"last_analyze": "2023-09-29T15:38:30.000Z",
		"last_autoanalyze": null,
		"vacuum_count": "3839",
		"autovacuum_count": "0",
		"analyze_count": "1",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3256,
		"schemaname": "pg_catalog",
		"relname": "pg_policy",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3600,
		"schemaname": "pg_catalog",
		"relname": "pg_ts_dict",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3596,
		"schemaname": "pg_catalog",
		"relname": "pg_seclabel",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2609,
		"schemaname": "pg_catalog",
		"relname": "pg_description",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "2105",
		"idx_tup_fetch": "928",
		"n_tup_ins": "329",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "329",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3466,
		"schemaname": "pg_catalog",
		"relname": "pg_event_trigger",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "1",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3592,
		"schemaname": "pg_catalog",
		"relname": "pg_shseclabel",
		"seq_scan": "3",
		"seq_tup_read": "0",
		"idx_scan": "337",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": "2023-10-26T08:59:14.000Z",
		"last_autovacuum": null,
		"last_analyze": "2023-09-29T15:38:30.000Z",
		"last_autoanalyze": null,
		"vacuum_count": "3839",
		"autovacuum_count": "0",
		"analyze_count": "1",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3764,
		"schemaname": "pg_catalog",
		"relname": "pg_ts_template",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6237,
		"schemaname": "pg_catalog",
		"relname": "pg_publication_namespace",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "946",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3603,
		"schemaname": "pg_catalog",
		"relname": "pg_ts_config_map",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1213,
		"schemaname": "pg_catalog",
		"relname": "pg_tablespace",
		"seq_scan": "811",
		"seq_tup_read": "1565",
		"idx_scan": "13999",
		"idx_tup_fetch": "13999",
		"n_tup_ins": "2",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "2",
		"n_dead_tup": "0",
		"last_vacuum": "2023-10-26T08:59:14.000Z",
		"last_autovacuum": null,
		"last_analyze": "2023-09-29T15:38:30.000Z",
		"last_autoanalyze": null,
		"vacuum_count": "3839",
		"autovacuum_count": "0",
		"analyze_count": "1",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2608,
		"schemaname": "pg_catalog",
		"relname": "pg_depend",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "1230",
		"idx_tup_fetch": "1314",
		"n_tup_ins": "3221",
		"n_tup_upd": "0",
		"n_tup_del": "42",
		"n_tup_hot_upd": "0",
		"n_live_tup": "4883",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": "2023-10-18T08:44:46.000Z",
		"last_analyze": null,
		"last_autoanalyze": "2023-10-18T08:44:46.000Z",
		"vacuum_count": "0",
		"autovacuum_count": "1",
		"analyze_count": "0",
		"autoanalyze_count": "1"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2964,
		"schemaname": "pg_catalog",
		"relname": "pg_db_role_setting",
		"seq_scan": "487",
		"seq_tup_read": "0",
		"idx_scan": "705380",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": "2023-10-26T08:59:14.000Z",
		"last_autovacuum": null,
		"last_analyze": "2023-09-29T15:38:30.000Z",
		"last_autoanalyze": null,
		"vacuum_count": "3839",
		"autovacuum_count": "0",
		"analyze_count": "1",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2995,
		"schemaname": "pg_catalog",
		"relname": "pg_largeobject_metadata",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4143,
		"schemaname": "pg_toast",
		"relname": "pg_toast_826",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 379413,
		"schemaname": "public",
		"relname": "log_request",
		"seq_scan": "3",
		"seq_tup_read": "3543",
		"idx_scan": null,
		"idx_tup_fetch": null,
		"n_tup_ins": "1181",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "1181",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": "2023-10-19T06:58:42.000Z",
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "9"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4185,
		"schemaname": "pg_toast",
		"relname": "pg_toast_1213",
		"seq_scan": "1",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": "2023-10-26T08:59:14.000Z",
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "3839",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6243,
		"schemaname": "pg_catalog",
		"relname": "pg_parameter_acl",
		"seq_scan": "5",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": "2023-10-26T08:59:14.000Z",
		"last_autovacuum": null,
		"last_analyze": "2023-09-29T15:38:30.000Z",
		"last_autoanalyze": null,
		"vacuum_count": "3839",
		"autovacuum_count": "0",
		"analyze_count": "1",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1418,
		"schemaname": "pg_catalog",
		"relname": "pg_user_mapping",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2613,
		"schemaname": "pg_catalog",
		"relname": "pg_largeobject",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6175,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3456",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1261,
		"schemaname": "pg_catalog",
		"relname": "pg_auth_members",
		"seq_scan": "56",
		"seq_tup_read": "156",
		"idx_scan": "13",
		"idx_tup_fetch": "0",
		"n_tup_ins": "3",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "3",
		"n_dead_tup": "0",
		"last_vacuum": "2023-10-26T08:59:14.000Z",
		"last_autovacuum": null,
		"last_analyze": "2023-09-29T15:38:30.000Z",
		"last_autoanalyze": null,
		"vacuum_count": "3839",
		"autovacuum_count": "0",
		"analyze_count": "1",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2616,
		"schemaname": "pg_catalog",
		"relname": "pg_opclass",
		"seq_scan": "12",
		"seq_tup_read": "12",
		"idx_scan": "28873",
		"idx_tup_fetch": "707811",
		"n_tup_ins": "14",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "14",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 378629,
		"schemaname": "pg_toast",
		"relname": "pg_toast_378625",
		"seq_scan": "1",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2617,
		"schemaname": "pg_catalog",
		"relname": "pg_operator",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "15356",
		"idx_tup_fetch": "20278",
		"n_tup_ins": "51",
		"n_tup_upd": "50",
		"n_tup_del": "0",
		"n_tup_hot_upd": "48",
		"n_live_tup": "51",
		"n_dead_tup": "17",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2838,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2618",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "1229",
		"idx_tup_fetch": "4685",
		"n_tup_ins": "12",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "12",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6228,
		"schemaname": "pg_toast",
		"relname": "pg_toast_6106",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2610,
		"schemaname": "pg_catalog",
		"relname": "pg_index",
		"seq_scan": "4702",
		"seq_tup_read": "784222",
		"idx_scan": "29656",
		"idx_tup_fetch": "29397",
		"n_tup_ins": "5",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "5",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1249,
		"schemaname": "pg_catalog",
		"relname": "pg_attribute",
		"seq_scan": "87",
		"seq_tup_read": "68463",
		"idx_scan": "133979",
		"idx_tup_fetch": "196730",
		"n_tup_ins": "137",
		"n_tup_upd": "1",
		"n_tup_del": "0",
		"n_tup_hot_upd": "1",
		"n_live_tup": "137",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2600,
		"schemaname": "pg_catalog",
		"relname": "pg_aggregate",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "1961",
		"idx_tup_fetch": "1961",
		"n_tup_ins": "22",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "22",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 379417,
		"schemaname": "pg_toast",
		"relname": "pg_toast_379413",
		"seq_scan": "1",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3118,
		"schemaname": "pg_catalog",
		"relname": "pg_foreign_table",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1259,
		"schemaname": "pg_catalog",
		"relname": "pg_class",
		"seq_scan": "19813",
		"seq_tup_read": "6031456",
		"idx_scan": "47707",
		"idx_tup_fetch": "44598",
		"n_tup_ins": "21",
		"n_tup_upd": "9",
		"n_tup_del": "0",
		"n_tup_hot_upd": "9",
		"n_live_tup": "21",
		"n_dead_tup": "9",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2966,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2964",
		"seq_scan": "1",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": "2023-10-26T08:59:14.000Z",
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "3839",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3350,
		"schemaname": "pg_catalog",
		"relname": "pg_partitioned_table",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2618,
		"schemaname": "pg_catalog",
		"relname": "pg_rewrite",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "1437",
		"idx_tup_fetch": "1518",
		"n_tup_ins": "5",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "5",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4153,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3118",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": null,
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "0",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4177,
		"schemaname": "pg_toast",
		"relname": "pg_toast_1262",
		"seq_scan": "1",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_live_tup": "0",
		"n_dead_tup": "0",
		"last_vacuum": "2023-10-26T08:59:14.000Z",
		"last_autovacuum": null,
		"last_analyze": null,
		"last_autoanalyze": null,
		"vacuum_count": "3840",
		"autovacuum_count": "0",
		"analyze_count": "0",
		"autoanalyze_count": "0"
	  }
	],
	"dump_pgstatindexes": [
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 378629,
		"indexrelid": 378630,
		"schemaname": "pg_toast",
		"relname": "pg_toast_378625",
		"indexrelname": "pg_toast_378625_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 378625,
		"indexrelid": 378631,
		"schemaname": "public",
		"relname": "spatial_ref_sys",
		"indexrelname": "spatial_ref_sys_pkey",
		"idx_scan": "8500",
		"last_idx_scan": "2023-10-18T08:43:38.318Z",
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 379408,
		"indexrelid": 379409,
		"schemaname": "pg_toast",
		"relname": "pg_toast_379405",
		"indexrelname": "pg_toast_379405_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 379405,
		"indexrelid": 379410,
		"schemaname": "public",
		"relname": "user",
		"indexrelname": "user_username_key",
		"idx_scan": "222",
		"last_idx_scan": "2023-10-18T11:24:05.109Z",
		"idx_tup_read": "220",
		"idx_tup_fetch": "220"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 379417,
		"indexrelid": 379418,
		"schemaname": "pg_toast",
		"relname": "pg_toast_379413",
		"indexrelname": "pg_toast_379413_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2836,
		"indexrelid": 2837,
		"schemaname": "pg_toast",
		"relname": "pg_toast_1255",
		"indexrelname": "pg_toast_1255_index",
		"idx_scan": "9",
		"last_idx_scan": "2023-10-18T08:43:38.318Z",
		"idx_tup_read": "20",
		"idx_tup_fetch": "20"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4171,
		"indexrelid": 4172,
		"schemaname": "pg_toast",
		"relname": "pg_toast_1247",
		"indexrelname": "pg_toast_1247_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2830,
		"indexrelid": 2831,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2604",
		"indexrelname": "pg_toast_2604_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2832,
		"indexrelid": 2833,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2606",
		"indexrelname": "pg_toast_2606_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4157,
		"indexrelid": 4158,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2612",
		"indexrelname": "pg_toast_2612_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4159,
		"indexrelid": 4160,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2600",
		"indexrelname": "pg_toast_2600_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2840,
		"indexrelid": 2841,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2619",
		"indexrelname": "pg_toast_2619_index",
		"idx_scan": "154",
		"last_idx_scan": "2023-10-26T08:59:18.744Z",
		"idx_tup_read": "208",
		"idx_tup_fetch": "208"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3439,
		"indexrelid": 3440,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3381",
		"indexrelname": "pg_toast_3381_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3430,
		"indexrelid": 3431,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3429",
		"indexrelname": "pg_toast_3429_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2838,
		"indexrelid": 2839,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2618",
		"indexrelname": "pg_toast_2618_index",
		"idx_scan": "1229",
		"last_idx_scan": "2023-10-26T08:59:18.744Z",
		"idx_tup_read": "4685",
		"idx_tup_fetch": "4685"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2336,
		"indexrelid": 2337,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2620",
		"indexrelname": "pg_toast_2620_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4145,
		"indexrelid": 4146,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3466",
		"indexrelname": "pg_toast_3466_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2834,
		"indexrelid": 2835,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2609",
		"indexrelname": "pg_toast_2609_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4163,
		"indexrelid": 4164,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2615",
		"indexrelname": "pg_toast_2615_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4177,
		"indexrelid": 4178,
		"schemaname": "pg_toast",
		"relname": "pg_toast_1262",
		"indexrelname": "pg_toast_1262_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2966,
		"indexrelid": 2967,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2964",
		"indexrelname": "pg_toast_2964_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4185,
		"indexrelid": 4186,
		"schemaname": "pg_toast",
		"relname": "pg_toast_1213",
		"indexrelname": "pg_toast_1213_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4175,
		"indexrelid": 4176,
		"schemaname": "pg_toast",
		"relname": "pg_toast_1260",
		"indexrelname": "pg_toast_1260_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2846,
		"indexrelid": 2847,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2396",
		"indexrelname": "pg_toast_2396_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4169,
		"indexrelid": 4170,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3600",
		"indexrelname": "pg_toast_3600_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4147,
		"indexrelid": 4148,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3079",
		"indexrelname": "pg_toast_3079_index",
		"idx_scan": "1",
		"last_idx_scan": "2023-10-18T08:43:38.318Z",
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4149,
		"indexrelid": 4150,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2328",
		"indexrelname": "pg_toast_2328_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4151,
		"indexrelid": 4152,
		"schemaname": "pg_toast",
		"relname": "pg_toast_1417",
		"indexrelname": "pg_toast_1417_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4173,
		"indexrelid": 4174,
		"schemaname": "pg_toast",
		"relname": "pg_toast_1418",
		"indexrelname": "pg_toast_1418_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4153,
		"indexrelid": 4154,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3118",
		"indexrelname": "pg_toast_3118_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4167,
		"indexrelid": 4168,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3256",
		"indexrelname": "pg_toast_3256_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4181,
		"indexrelid": 4182,
		"schemaname": "pg_toast",
		"relname": "pg_toast_6000",
		"indexrelname": "pg_toast_6000_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4143,
		"indexrelid": 4144,
		"schemaname": "pg_toast",
		"relname": "pg_toast_826",
		"indexrelname": "pg_toast_826_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4155,
		"indexrelid": 4156,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3394",
		"indexrelname": "pg_toast_3394_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3598,
		"indexrelid": 3599,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3596",
		"indexrelname": "pg_toast_3596_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4060,
		"indexrelid": 4061,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3592",
		"indexrelname": "pg_toast_3592_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6175,
		"indexrelid": 6176,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3456",
		"indexrelname": "pg_toast_3456_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6244,
		"indexrelid": 6245,
		"schemaname": "pg_toast",
		"relname": "pg_toast_6243",
		"indexrelname": "pg_toast_6243_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4165,
		"indexrelid": 4166,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3350",
		"indexrelname": "pg_toast_3350_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6228,
		"indexrelid": 6229,
		"schemaname": "pg_toast",
		"relname": "pg_toast_6106",
		"indexrelname": "pg_toast_6106_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4183,
		"indexrelid": 4184,
		"schemaname": "pg_toast",
		"relname": "pg_toast_6100",
		"indexrelname": "pg_toast_6100_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1255,
		"indexrelid": 2690,
		"schemaname": "pg_catalog",
		"relname": "pg_proc",
		"indexrelname": "pg_proc_oid_index",
		"idx_scan": "28030",
		"last_idx_scan": "2023-10-26T08:59:18.744Z",
		"idx_tup_read": "27243",
		"idx_tup_fetch": "27243"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1255,
		"indexrelid": 2691,
		"schemaname": "pg_catalog",
		"relname": "pg_proc",
		"indexrelname": "pg_proc_proname_args_nsp_index",
		"idx_scan": "8438",
		"last_idx_scan": "2023-10-26T08:59:18.744Z",
		"idx_tup_read": "10939",
		"idx_tup_fetch": "10939"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1247,
		"indexrelid": 2703,
		"schemaname": "pg_catalog",
		"relname": "pg_type",
		"indexrelname": "pg_type_oid_index",
		"idx_scan": "29853",
		"last_idx_scan": "2023-10-26T08:59:18.744Z",
		"idx_tup_read": "28864",
		"idx_tup_fetch": "26940"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1247,
		"indexrelid": 2704,
		"schemaname": "pg_catalog",
		"relname": "pg_type",
		"indexrelname": "pg_type_typname_nsp_index",
		"idx_scan": "2297",
		"last_idx_scan": "2023-10-26T08:59:18.744Z",
		"idx_tup_read": "154",
		"idx_tup_fetch": "154"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1249,
		"indexrelid": 2658,
		"schemaname": "pg_catalog",
		"relname": "pg_attribute",
		"indexrelname": "pg_attribute_relid_attnam_index",
		"idx_scan": "4",
		"last_idx_scan": "2023-10-18T08:43:38.318Z",
		"idx_tup_read": "4",
		"idx_tup_fetch": "4"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1249,
		"indexrelid": 2659,
		"schemaname": "pg_catalog",
		"relname": "pg_attribute",
		"indexrelname": "pg_attribute_relid_attnum_index",
		"idx_scan": "133975",
		"last_idx_scan": "2023-10-26T08:59:18.744Z",
		"idx_tup_read": "196747",
		"idx_tup_fetch": "196726"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1259,
		"indexrelid": 2662,
		"schemaname": "pg_catalog",
		"relname": "pg_class",
		"indexrelname": "pg_class_oid_index",
		"idx_scan": "42862",
		"last_idx_scan": "2023-10-26T08:59:18.744Z",
		"idx_tup_read": "42821",
		"idx_tup_fetch": "41872"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1259,
		"indexrelid": 2663,
		"schemaname": "pg_catalog",
		"relname": "pg_class",
		"indexrelname": "pg_class_relname_nsp_index",
		"idx_scan": "4845",
		"last_idx_scan": "2023-10-26T08:59:18.744Z",
		"idx_tup_read": "2726",
		"idx_tup_fetch": "2726"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1259,
		"indexrelid": 3455,
		"schemaname": "pg_catalog",
		"relname": "pg_class",
		"indexrelname": "pg_class_tblspc_relfilenode_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2604,
		"indexrelid": 2656,
		"schemaname": "pg_catalog",
		"relname": "pg_attrdef",
		"indexrelname": "pg_attrdef_adrelid_adnum_index",
		"idx_scan": "57",
		"last_idx_scan": "2023-10-26T08:57:58.961Z",
		"idx_tup_read": "57",
		"idx_tup_fetch": "57"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2604,
		"indexrelid": 2657,
		"schemaname": "pg_catalog",
		"relname": "pg_attrdef",
		"indexrelname": "pg_attrdef_oid_index",
		"idx_scan": "1",
		"last_idx_scan": "2023-10-18T08:43:38.318Z",
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2606,
		"indexrelid": 2664,
		"schemaname": "pg_catalog",
		"relname": "pg_constraint",
		"indexrelname": "pg_constraint_conname_nsp_index",
		"idx_scan": "3",
		"last_idx_scan": "2023-10-18T08:43:38.318Z",
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2606,
		"indexrelid": 2665,
		"schemaname": "pg_catalog",
		"relname": "pg_constraint",
		"indexrelname": "pg_constraint_conrelid_contypid_conname_index",
		"idx_scan": "128",
		"last_idx_scan": "2023-10-26T08:59:18.744Z",
		"idx_tup_read": "148",
		"idx_tup_fetch": "148"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2606,
		"indexrelid": 2666,
		"schemaname": "pg_catalog",
		"relname": "pg_constraint",
		"indexrelname": "pg_constraint_contypid_index",
		"idx_scan": "944",
		"last_idx_scan": "2023-10-26T08:59:17.308Z",
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2606,
		"indexrelid": 2667,
		"schemaname": "pg_catalog",
		"relname": "pg_constraint",
		"indexrelname": "pg_constraint_oid_index",
		"idx_scan": "3",
		"last_idx_scan": "2023-10-18T08:43:38.318Z",
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2606,
		"indexrelid": 2579,
		"schemaname": "pg_catalog",
		"relname": "pg_constraint",
		"indexrelname": "pg_constraint_conparentid_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2611,
		"indexrelid": 2680,
		"schemaname": "pg_catalog",
		"relname": "pg_inherits",
		"indexrelname": "pg_inherits_relid_seqno_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2611,
		"indexrelid": 2187,
		"schemaname": "pg_catalog",
		"relname": "pg_inherits",
		"indexrelname": "pg_inherits_parent_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2610,
		"indexrelid": 2678,
		"schemaname": "pg_catalog",
		"relname": "pg_index",
		"indexrelname": "pg_index_indrelid_index",
		"idx_scan": "5843",
		"last_idx_scan": "2023-10-26T08:59:18.744Z",
		"idx_tup_read": "10004",
		"idx_tup_fetch": "9824"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2610,
		"indexrelid": 2679,
		"schemaname": "pg_catalog",
		"relname": "pg_index",
		"indexrelname": "pg_index_indexrelid_index",
		"idx_scan": "23813",
		"last_idx_scan": "2023-10-26T08:59:18.744Z",
		"idx_tup_read": "19573",
		"idx_tup_fetch": "19573"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2617,
		"indexrelid": 2688,
		"schemaname": "pg_catalog",
		"relname": "pg_operator",
		"indexrelname": "pg_operator_oid_index",
		"idx_scan": "9684",
		"last_idx_scan": "2023-10-26T08:59:18.744Z",
		"idx_tup_read": "9636",
		"idx_tup_fetch": "9633"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2617,
		"indexrelid": 2689,
		"schemaname": "pg_catalog",
		"relname": "pg_operator",
		"indexrelname": "pg_operator_oprname_l_r_n_index",
		"idx_scan": "5672",
		"last_idx_scan": "2023-10-26T08:59:18.744Z",
		"idx_tup_read": "10649",
		"idx_tup_fetch": "10645"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2753,
		"indexrelid": 2754,
		"schemaname": "pg_catalog",
		"relname": "pg_opfamily",
		"indexrelname": "pg_opfamily_am_name_nsp_index",
		"idx_scan": "15",
		"last_idx_scan": "2023-10-18T08:43:38.318Z",
		"idx_tup_read": "1",
		"idx_tup_fetch": "1"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2753,
		"indexrelid": 2755,
		"schemaname": "pg_catalog",
		"relname": "pg_opfamily",
		"indexrelname": "pg_opfamily_oid_index",
		"idx_scan": "14",
		"last_idx_scan": "2023-10-18T08:43:38.318Z",
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2616,
		"indexrelid": 2686,
		"schemaname": "pg_catalog",
		"relname": "pg_opclass",
		"indexrelname": "pg_opclass_am_name_nsp_index",
		"idx_scan": "15202",
		"last_idx_scan": "2023-10-26T08:59:18.744Z",
		"idx_tup_read": "694154",
		"idx_tup_fetch": "694154"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2616,
		"indexrelid": 2687,
		"schemaname": "pg_catalog",
		"relname": "pg_opclass",
		"indexrelname": "pg_opclass_oid_index",
		"idx_scan": "13671",
		"last_idx_scan": "2023-10-26T08:59:18.744Z",
		"idx_tup_read": "13657",
		"idx_tup_fetch": "13657"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2601,
		"indexrelid": 2651,
		"schemaname": "pg_catalog",
		"relname": "pg_am",
		"indexrelname": "pg_am_name_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2601,
		"indexrelid": 2652,
		"schemaname": "pg_catalog",
		"relname": "pg_am",
		"indexrelname": "pg_am_oid_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2602,
		"indexrelid": 2653,
		"schemaname": "pg_catalog",
		"relname": "pg_amop",
		"indexrelname": "pg_amop_fam_strat_index",
		"idx_scan": "9195",
		"last_idx_scan": "2023-10-26T08:59:18.744Z",
		"idx_tup_read": "9195",
		"idx_tup_fetch": "9195"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2602,
		"indexrelid": 2654,
		"schemaname": "pg_catalog",
		"relname": "pg_amop",
		"indexrelname": "pg_amop_opr_fam_index",
		"idx_scan": "14112",
		"last_idx_scan": "2023-10-26T08:59:18.744Z",
		"idx_tup_read": "31352",
		"idx_tup_fetch": "31352"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2602,
		"indexrelid": 2756,
		"schemaname": "pg_catalog",
		"relname": "pg_amop",
		"indexrelname": "pg_amop_oid_index",
		"idx_scan": "78",
		"last_idx_scan": "2023-10-18T08:43:38.318Z",
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2603,
		"indexrelid": 2655,
		"schemaname": "pg_catalog",
		"relname": "pg_amproc",
		"indexrelname": "pg_amproc_fam_proc_index",
		"idx_scan": "13740",
		"last_idx_scan": "2023-10-26T08:59:18.744Z",
		"idx_tup_read": "35068",
		"idx_tup_fetch": "35068"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2603,
		"indexrelid": 2757,
		"schemaname": "pg_catalog",
		"relname": "pg_amproc",
		"indexrelname": "pg_amproc_oid_index",
		"idx_scan": "69",
		"last_idx_scan": "2023-10-18T08:43:38.318Z",
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2612,
		"indexrelid": 2681,
		"schemaname": "pg_catalog",
		"relname": "pg_language",
		"indexrelname": "pg_language_name_index",
		"idx_scan": "3",
		"last_idx_scan": "2023-10-18T08:43:38.318Z",
		"idx_tup_read": "3",
		"idx_tup_fetch": "3"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2612,
		"indexrelid": 2682,
		"schemaname": "pg_catalog",
		"relname": "pg_language",
		"indexrelname": "pg_language_oid_index",
		"idx_scan": "3",
		"last_idx_scan": "2023-10-18T08:43:38.318Z",
		"idx_tup_read": "3",
		"idx_tup_fetch": "3"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2995,
		"indexrelid": 2996,
		"schemaname": "pg_catalog",
		"relname": "pg_largeobject_metadata",
		"indexrelname": "pg_largeobject_metadata_oid_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2613,
		"indexrelid": 2683,
		"schemaname": "pg_catalog",
		"relname": "pg_largeobject",
		"indexrelname": "pg_largeobject_loid_pn_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2600,
		"indexrelid": 2650,
		"schemaname": "pg_catalog",
		"relname": "pg_aggregate",
		"indexrelname": "pg_aggregate_fnoid_index",
		"idx_scan": "1961",
		"last_idx_scan": "2023-10-26T08:59:17.308Z",
		"idx_tup_read": "1961",
		"idx_tup_fetch": "1961"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2619,
		"indexrelid": 2696,
		"schemaname": "pg_catalog",
		"relname": "pg_statistic",
		"indexrelname": "pg_statistic_relid_att_inh_index",
		"idx_scan": "13602",
		"last_idx_scan": "2023-10-26T08:59:18.744Z",
		"idx_tup_read": "12551",
		"idx_tup_fetch": "12527"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3381,
		"indexrelid": 3380,
		"schemaname": "pg_catalog",
		"relname": "pg_statistic_ext",
		"indexrelname": "pg_statistic_ext_oid_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3381,
		"indexrelid": 3997,
		"schemaname": "pg_catalog",
		"relname": "pg_statistic_ext",
		"indexrelname": "pg_statistic_ext_name_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3381,
		"indexrelid": 3379,
		"schemaname": "pg_catalog",
		"relname": "pg_statistic_ext",
		"indexrelname": "pg_statistic_ext_relid_index",
		"idx_scan": "4402",
		"last_idx_scan": "2023-10-26T08:59:18.744Z",
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3429,
		"indexrelid": 3433,
		"schemaname": "pg_catalog",
		"relname": "pg_statistic_ext_data",
		"indexrelname": "pg_statistic_ext_data_stxoid_inh_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2618,
		"indexrelid": 2692,
		"schemaname": "pg_catalog",
		"relname": "pg_rewrite",
		"indexrelname": "pg_rewrite_oid_index",
		"idx_scan": "5",
		"last_idx_scan": "2023-10-18T08:43:38.318Z",
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2618,
		"indexrelid": 2693,
		"schemaname": "pg_catalog",
		"relname": "pg_rewrite",
		"indexrelname": "pg_rewrite_rel_rulename_index",
		"idx_scan": "1432",
		"last_idx_scan": "2023-10-26T08:59:18.744Z",
		"idx_tup_read": "1518",
		"idx_tup_fetch": "1518"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2620,
		"indexrelid": 2699,
		"schemaname": "pg_catalog",
		"relname": "pg_trigger",
		"indexrelname": "pg_trigger_tgconstraint_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2620,
		"indexrelid": 2701,
		"schemaname": "pg_catalog",
		"relname": "pg_trigger",
		"indexrelname": "pg_trigger_tgrelid_tgname_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2620,
		"indexrelid": 2702,
		"schemaname": "pg_catalog",
		"relname": "pg_trigger",
		"indexrelname": "pg_trigger_oid_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3466,
		"indexrelid": 3467,
		"schemaname": "pg_catalog",
		"relname": "pg_event_trigger",
		"indexrelname": "pg_event_trigger_evtname_index",
		"idx_scan": "1",
		"last_idx_scan": "2023-10-18T08:43:38.318Z",
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3466,
		"indexrelid": 3468,
		"schemaname": "pg_catalog",
		"relname": "pg_event_trigger",
		"indexrelname": "pg_event_trigger_oid_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2609,
		"indexrelid": 2675,
		"schemaname": "pg_catalog",
		"relname": "pg_description",
		"indexrelname": "pg_description_o_c_o_index",
		"idx_scan": "2105",
		"last_idx_scan": "2023-10-23T11:40:07.683Z",
		"idx_tup_read": "944",
		"idx_tup_fetch": "928"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2605,
		"indexrelid": 2660,
		"schemaname": "pg_catalog",
		"relname": "pg_cast",
		"indexrelname": "pg_cast_oid_index",
		"idx_scan": "26",
		"last_idx_scan": "2023-10-18T08:43:38.318Z",
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2605,
		"indexrelid": 2661,
		"schemaname": "pg_catalog",
		"relname": "pg_cast",
		"indexrelname": "pg_cast_source_target_index",
		"idx_scan": "46012",
		"last_idx_scan": "2023-10-26T08:59:18.744Z",
		"idx_tup_read": "6367",
		"idx_tup_fetch": "6367"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3501,
		"indexrelid": 3502,
		"schemaname": "pg_catalog",
		"relname": "pg_enum",
		"indexrelname": "pg_enum_oid_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3501,
		"indexrelid": 3503,
		"schemaname": "pg_catalog",
		"relname": "pg_enum",
		"indexrelname": "pg_enum_typid_label_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3501,
		"indexrelid": 3534,
		"schemaname": "pg_catalog",
		"relname": "pg_enum",
		"indexrelname": "pg_enum_typid_sortorder_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2615,
		"indexrelid": 2684,
		"schemaname": "pg_catalog",
		"relname": "pg_namespace",
		"indexrelname": "pg_namespace_nspname_index",
		"idx_scan": "3453",
		"last_idx_scan": "2023-10-26T08:59:18.744Z",
		"idx_tup_read": "2286",
		"idx_tup_fetch": "2144"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2615,
		"indexrelid": 2685,
		"schemaname": "pg_catalog",
		"relname": "pg_namespace",
		"indexrelname": "pg_namespace_oid_index",
		"idx_scan": "5532",
		"last_idx_scan": "2023-10-26T08:59:18.744Z",
		"idx_tup_read": "5532",
		"idx_tup_fetch": "694"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2607,
		"indexrelid": 2668,
		"schemaname": "pg_catalog",
		"relname": "pg_conversion",
		"indexrelname": "pg_conversion_default_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2607,
		"indexrelid": 2669,
		"schemaname": "pg_catalog",
		"relname": "pg_conversion",
		"indexrelname": "pg_conversion_name_nsp_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2607,
		"indexrelid": 2670,
		"schemaname": "pg_catalog",
		"relname": "pg_conversion",
		"indexrelname": "pg_conversion_oid_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2608,
		"indexrelid": 2673,
		"schemaname": "pg_catalog",
		"relname": "pg_depend",
		"indexrelname": "pg_depend_depender_index",
		"idx_scan": "47",
		"last_idx_scan": "2023-10-18T08:43:38.318Z",
		"idx_tup_read": "131",
		"idx_tup_fetch": "131"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2608,
		"indexrelid": 2674,
		"schemaname": "pg_catalog",
		"relname": "pg_depend",
		"indexrelname": "pg_depend_reference_index",
		"idx_scan": "1183",
		"last_idx_scan": "2023-10-19T07:01:26.544Z",
		"idx_tup_read": "1183",
		"idx_tup_fetch": "1183"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1262,
		"indexrelid": 2671,
		"schemaname": "pg_catalog",
		"relname": "pg_database",
		"indexrelname": "pg_database_datname_index",
		"idx_scan": "15141",
		"last_idx_scan": "2023-10-26T08:59:13.241Z",
		"idx_tup_read": "14746",
		"idx_tup_fetch": "14394"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1262,
		"indexrelid": 2672,
		"schemaname": "pg_catalog",
		"relname": "pg_database",
		"indexrelname": "pg_database_oid_index",
		"idx_scan": "649038",
		"last_idx_scan": "2023-10-26T08:59:14.550Z",
		"idx_tup_read": "648734",
		"idx_tup_fetch": "648693"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2964,
		"indexrelid": 2965,
		"schemaname": "pg_catalog",
		"relname": "pg_db_role_setting",
		"indexrelname": "pg_db_role_setting_databaseid_rol_index",
		"idx_scan": "705380",
		"last_idx_scan": "2023-10-26T08:59:14.345Z",
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1213,
		"indexrelid": 2697,
		"schemaname": "pg_catalog",
		"relname": "pg_tablespace",
		"indexrelname": "pg_tablespace_oid_index",
		"idx_scan": "13999",
		"last_idx_scan": "2023-10-26T08:59:18.744Z",
		"idx_tup_read": "13999",
		"idx_tup_fetch": "13999"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1213,
		"indexrelid": 2698,
		"schemaname": "pg_catalog",
		"relname": "pg_tablespace",
		"indexrelname": "pg_tablespace_spcname_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1260,
		"indexrelid": 2676,
		"schemaname": "pg_catalog",
		"relname": "pg_authid",
		"indexrelname": "pg_authid_rolname_index",
		"idx_scan": "16075",
		"last_idx_scan": "2023-10-26T08:59:13.241Z",
		"idx_tup_read": "16005",
		"idx_tup_fetch": "16003"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1260,
		"indexrelid": 2677,
		"schemaname": "pg_catalog",
		"relname": "pg_authid",
		"indexrelname": "pg_authid_oid_index",
		"idx_scan": "28022",
		"last_idx_scan": "2023-10-26T08:59:14.550Z",
		"idx_tup_read": "28019",
		"idx_tup_fetch": "28019"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1261,
		"indexrelid": 6303,
		"schemaname": "pg_catalog",
		"relname": "pg_auth_members",
		"indexrelname": "pg_auth_members_oid_index",
		"idx_scan": "3",
		"last_idx_scan": "2023-09-29T15:38:31.229Z",
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1261,
		"indexrelid": 2694,
		"schemaname": "pg_catalog",
		"relname": "pg_auth_members",
		"indexrelname": "pg_auth_members_role_member_index",
		"idx_scan": "5",
		"last_idx_scan": "2023-09-30T07:27:26.275Z",
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1261,
		"indexrelid": 2695,
		"schemaname": "pg_catalog",
		"relname": "pg_auth_members",
		"indexrelname": "pg_auth_members_member_role_index",
		"idx_scan": "5",
		"last_idx_scan": "2023-09-30T07:27:26.275Z",
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1261,
		"indexrelid": 6302,
		"schemaname": "pg_catalog",
		"relname": "pg_auth_members",
		"indexrelname": "pg_auth_members_grantor_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1214,
		"indexrelid": 1232,
		"schemaname": "pg_catalog",
		"relname": "pg_shdepend",
		"indexrelname": "pg_shdepend_depender_index",
		"idx_scan": "10547",
		"last_idx_scan": "2023-10-26T06:06:51.101Z",
		"idx_tup_read": "303814",
		"idx_tup_fetch": "299025"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1214,
		"indexrelid": 1233,
		"schemaname": "pg_catalog",
		"relname": "pg_shdepend",
		"indexrelname": "pg_shdepend_reference_index",
		"idx_scan": "2",
		"last_idx_scan": "2023-09-30T07:27:26.275Z",
		"idx_tup_read": "1826",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2396,
		"indexrelid": 2397,
		"schemaname": "pg_catalog",
		"relname": "pg_shdescription",
		"indexrelname": "pg_shdescription_o_c_index",
		"idx_scan": "339",
		"last_idx_scan": "2023-10-26T05:06:17.380Z",
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3602,
		"indexrelid": 3608,
		"schemaname": "pg_catalog",
		"relname": "pg_ts_config",
		"indexrelname": "pg_ts_config_cfgname_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3602,
		"indexrelid": 3712,
		"schemaname": "pg_catalog",
		"relname": "pg_ts_config",
		"indexrelname": "pg_ts_config_oid_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3603,
		"indexrelid": 3609,
		"schemaname": "pg_catalog",
		"relname": "pg_ts_config_map",
		"indexrelname": "pg_ts_config_map_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3600,
		"indexrelid": 3604,
		"schemaname": "pg_catalog",
		"relname": "pg_ts_dict",
		"indexrelname": "pg_ts_dict_dictname_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3600,
		"indexrelid": 3605,
		"schemaname": "pg_catalog",
		"relname": "pg_ts_dict",
		"indexrelname": "pg_ts_dict_oid_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3601,
		"indexrelid": 3606,
		"schemaname": "pg_catalog",
		"relname": "pg_ts_parser",
		"indexrelname": "pg_ts_parser_prsname_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3601,
		"indexrelid": 3607,
		"schemaname": "pg_catalog",
		"relname": "pg_ts_parser",
		"indexrelname": "pg_ts_parser_oid_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3764,
		"indexrelid": 3766,
		"schemaname": "pg_catalog",
		"relname": "pg_ts_template",
		"indexrelname": "pg_ts_template_tmplname_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3764,
		"indexrelid": 3767,
		"schemaname": "pg_catalog",
		"relname": "pg_ts_template",
		"indexrelname": "pg_ts_template_oid_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3079,
		"indexrelid": 3080,
		"schemaname": "pg_catalog",
		"relname": "pg_extension",
		"indexrelname": "pg_extension_oid_index",
		"idx_scan": "3",
		"last_idx_scan": "2023-10-18T08:43:38.318Z",
		"idx_tup_read": "1",
		"idx_tup_fetch": "1"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3079,
		"indexrelid": 3081,
		"schemaname": "pg_catalog",
		"relname": "pg_extension",
		"indexrelname": "pg_extension_name_index",
		"idx_scan": "6",
		"last_idx_scan": "2023-10-18T08:43:38.318Z",
		"idx_tup_read": "4",
		"idx_tup_fetch": "4"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2328,
		"indexrelid": 112,
		"schemaname": "pg_catalog",
		"relname": "pg_foreign_data_wrapper",
		"indexrelname": "pg_foreign_data_wrapper_oid_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2328,
		"indexrelid": 548,
		"schemaname": "pg_catalog",
		"relname": "pg_foreign_data_wrapper",
		"indexrelname": "pg_foreign_data_wrapper_name_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1417,
		"indexrelid": 113,
		"schemaname": "pg_catalog",
		"relname": "pg_foreign_server",
		"indexrelname": "pg_foreign_server_oid_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1417,
		"indexrelid": 549,
		"schemaname": "pg_catalog",
		"relname": "pg_foreign_server",
		"indexrelname": "pg_foreign_server_name_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1418,
		"indexrelid": 174,
		"schemaname": "pg_catalog",
		"relname": "pg_user_mapping",
		"indexrelname": "pg_user_mapping_oid_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1418,
		"indexrelid": 175,
		"schemaname": "pg_catalog",
		"relname": "pg_user_mapping",
		"indexrelname": "pg_user_mapping_user_server_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3118,
		"indexrelid": 3119,
		"schemaname": "pg_catalog",
		"relname": "pg_foreign_table",
		"indexrelname": "pg_foreign_table_relid_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3256,
		"indexrelid": 3257,
		"schemaname": "pg_catalog",
		"relname": "pg_policy",
		"indexrelname": "pg_policy_oid_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3256,
		"indexrelid": 3258,
		"schemaname": "pg_catalog",
		"relname": "pg_policy",
		"indexrelname": "pg_policy_polrelid_polname_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6000,
		"indexrelid": 6001,
		"schemaname": "pg_catalog",
		"relname": "pg_replication_origin",
		"indexrelname": "pg_replication_origin_roiident_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6000,
		"indexrelid": 6002,
		"schemaname": "pg_catalog",
		"relname": "pg_replication_origin",
		"indexrelname": "pg_replication_origin_roname_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 826,
		"indexrelid": 827,
		"schemaname": "pg_catalog",
		"relname": "pg_default_acl",
		"indexrelname": "pg_default_acl_role_nsp_obj_index",
		"idx_scan": "8",
		"last_idx_scan": "2023-10-18T08:43:38.318Z",
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 826,
		"indexrelid": 828,
		"schemaname": "pg_catalog",
		"relname": "pg_default_acl",
		"indexrelname": "pg_default_acl_oid_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3394,
		"indexrelid": 3395,
		"schemaname": "pg_catalog",
		"relname": "pg_init_privs",
		"indexrelname": "pg_init_privs_o_c_o_index",
		"idx_scan": "3",
		"last_idx_scan": "2023-10-18T08:43:38.318Z",
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3596,
		"indexrelid": 3597,
		"schemaname": "pg_catalog",
		"relname": "pg_seclabel",
		"indexrelname": "pg_seclabel_object_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3592,
		"indexrelid": 3593,
		"schemaname": "pg_catalog",
		"relname": "pg_shseclabel",
		"indexrelname": "pg_shseclabel_object_index",
		"idx_scan": "337",
		"last_idx_scan": "2023-10-26T05:06:17.380Z",
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3456,
		"indexrelid": 3164,
		"schemaname": "pg_catalog",
		"relname": "pg_collation",
		"indexrelname": "pg_collation_name_enc_nsp_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3456,
		"indexrelid": 3085,
		"schemaname": "pg_catalog",
		"relname": "pg_collation",
		"indexrelname": "pg_collation_oid_index",
		"idx_scan": "944",
		"last_idx_scan": "2023-10-26T08:59:17.308Z",
		"idx_tup_read": "944",
		"idx_tup_fetch": "944"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6243,
		"indexrelid": 6246,
		"schemaname": "pg_catalog",
		"relname": "pg_parameter_acl",
		"indexrelname": "pg_parameter_acl_parname_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6243,
		"indexrelid": 6247,
		"schemaname": "pg_catalog",
		"relname": "pg_parameter_acl",
		"indexrelname": "pg_parameter_acl_oid_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3350,
		"indexrelid": 3351,
		"schemaname": "pg_catalog",
		"relname": "pg_partitioned_table",
		"indexrelname": "pg_partitioned_table_partrelid_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3541,
		"indexrelid": 3542,
		"schemaname": "pg_catalog",
		"relname": "pg_range",
		"indexrelname": "pg_range_rngtypid_index",
		"idx_scan": "8",
		"last_idx_scan": "2023-10-23T11:40:07.477Z",
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3541,
		"indexrelid": 2228,
		"schemaname": "pg_catalog",
		"relname": "pg_range",
		"indexrelname": "pg_range_rngmultitypid_index",
		"idx_scan": "24",
		"last_idx_scan": "2023-10-26T08:58:06.119Z",
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3576,
		"indexrelid": 3574,
		"schemaname": "pg_catalog",
		"relname": "pg_transform",
		"indexrelname": "pg_transform_oid_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3576,
		"indexrelid": 3575,
		"schemaname": "pg_catalog",
		"relname": "pg_transform",
		"indexrelname": "pg_transform_type_lang_index",
		"idx_scan": "70",
		"last_idx_scan": "2023-10-18T08:43:38.318Z",
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2224,
		"indexrelid": 5002,
		"schemaname": "pg_catalog",
		"relname": "pg_sequence",
		"indexrelname": "pg_sequence_seqrelid_index",
		"idx_scan": "32",
		"last_idx_scan": "2023-10-19T07:01:20.536Z",
		"idx_tup_read": "32",
		"idx_tup_fetch": "32"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6104,
		"indexrelid": 6110,
		"schemaname": "pg_catalog",
		"relname": "pg_publication",
		"indexrelname": "pg_publication_oid_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6104,
		"indexrelid": 6111,
		"schemaname": "pg_catalog",
		"relname": "pg_publication",
		"indexrelname": "pg_publication_pubname_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6237,
		"indexrelid": 6238,
		"schemaname": "pg_catalog",
		"relname": "pg_publication_namespace",
		"indexrelname": "pg_publication_namespace_oid_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6237,
		"indexrelid": 6239,
		"schemaname": "pg_catalog",
		"relname": "pg_publication_namespace",
		"indexrelname": "pg_publication_namespace_pnnspid_pnpubid_index",
		"idx_scan": "946",
		"last_idx_scan": "2023-10-26T08:59:17.308Z",
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6106,
		"indexrelid": 6112,
		"schemaname": "pg_catalog",
		"relname": "pg_publication_rel",
		"indexrelname": "pg_publication_rel_oid_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6106,
		"indexrelid": 6113,
		"schemaname": "pg_catalog",
		"relname": "pg_publication_rel",
		"indexrelname": "pg_publication_rel_prrelid_prpubid_index",
		"idx_scan": "946",
		"last_idx_scan": "2023-10-26T08:59:17.308Z",
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6106,
		"indexrelid": 6116,
		"schemaname": "pg_catalog",
		"relname": "pg_publication_rel",
		"indexrelname": "pg_publication_rel_prpubid_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6100,
		"indexrelid": 6114,
		"schemaname": "pg_catalog",
		"relname": "pg_subscription",
		"indexrelname": "pg_subscription_oid_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6100,
		"indexrelid": 6115,
		"schemaname": "pg_catalog",
		"relname": "pg_subscription",
		"indexrelname": "pg_subscription_subname_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6102,
		"indexrelid": 6117,
		"schemaname": "pg_catalog",
		"relname": "pg_subscription_rel",
		"indexrelname": "pg_subscription_rel_srrelid_srsubid_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 14830,
		"indexrelid": 14831,
		"schemaname": "pg_toast",
		"relname": "pg_toast_14827",
		"indexrelname": "pg_toast_14827_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 14835,
		"indexrelid": 14836,
		"schemaname": "pg_toast",
		"relname": "pg_toast_14832",
		"indexrelname": "pg_toast_14832_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 14840,
		"indexrelid": 14841,
		"schemaname": "pg_toast",
		"relname": "pg_toast_14837",
		"indexrelname": "pg_toast_14837_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 14845,
		"indexrelid": 14846,
		"schemaname": "pg_toast",
		"relname": "pg_toast_14842",
		"indexrelname": "pg_toast_14842_index",
		"idx_scan": "0",
		"last_idx_scan": null,
		"idx_tup_read": "0",
		"idx_tup_fetch": "0"
	  }
	],
	"dump_pgstatiotables": [
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 378629,
		"schemaname": "pg_toast",
		"relname": "pg_toast_378625",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "0",
		"idx_blks_hit": "0",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 378625,
		"schemaname": "public",
		"relname": "spatial_ref_sys",
		"heap_blks_read": "0",
		"heap_blks_hit": "23045",
		"idx_blks_read": "1",
		"idx_blks_hit": "33212",
		"toast_blks_read": "0",
		"toast_blks_hit": "0",
		"tidx_blks_read": "0",
		"tidx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 379408,
		"schemaname": "pg_toast",
		"relname": "pg_toast_379405",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "0",
		"idx_blks_hit": "0",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 379405,
		"schemaname": "public",
		"relname": "user",
		"heap_blks_read": "106",
		"heap_blks_hit": "16861",
		"idx_blks_read": "62",
		"idx_blks_hit": "1318",
		"toast_blks_read": "0",
		"toast_blks_hit": "0",
		"tidx_blks_read": "0",
		"tidx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 379417,
		"schemaname": "pg_toast",
		"relname": "pg_toast_379413",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "0",
		"idx_blks_hit": "0",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 379413,
		"schemaname": "public",
		"relname": "log_request",
		"heap_blks_read": "177",
		"heap_blks_hit": "2296",
		"idx_blks_read": null,
		"idx_blks_hit": null,
		"toast_blks_read": "0",
		"toast_blks_hit": "0",
		"tidx_blks_read": "0",
		"tidx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 379419,
		"schemaname": "public",
		"relname": "config",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": null,
		"idx_blks_hit": null,
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2619,
		"schemaname": "pg_catalog",
		"relname": "pg_statistic",
		"heap_blks_read": "286",
		"heap_blks_hit": "13506",
		"idx_blks_read": "209",
		"idx_blks_hit": "28398",
		"toast_blks_read": "13",
		"toast_blks_hit": "316",
		"tidx_blks_read": "8",
		"tidx_blks_hit": "258"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1247,
		"schemaname": "pg_catalog",
		"relname": "pg_type",
		"heap_blks_read": "302",
		"heap_blks_hit": "28936",
		"idx_blks_read": "233",
		"idx_blks_hit": "66432",
		"toast_blks_read": "0",
		"toast_blks_hit": "0",
		"tidx_blks_read": "0",
		"tidx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2836,
		"schemaname": "pg_toast",
		"relname": "pg_toast_1255",
		"heap_blks_read": "0",
		"heap_blks_hit": "37",
		"idx_blks_read": "0",
		"idx_blks_hit": "20",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4171,
		"schemaname": "pg_toast",
		"relname": "pg_toast_1247",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "0",
		"idx_blks_hit": "0",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2830,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2604",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "0",
		"idx_blks_hit": "0",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2832,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2606",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "0",
		"idx_blks_hit": "0",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4157,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2612",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "0",
		"idx_blks_hit": "0",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4159,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2600",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "0",
		"idx_blks_hit": "0",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2840,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2619",
		"heap_blks_read": "13",
		"heap_blks_hit": "316",
		"idx_blks_read": "8",
		"idx_blks_hit": "258",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3439,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3381",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "0",
		"idx_blks_hit": "0",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3430,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3429",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "0",
		"idx_blks_hit": "0",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2838,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2618",
		"heap_blks_read": "144",
		"heap_blks_hit": "2170",
		"idx_blks_read": "130",
		"idx_blks_hit": "2058",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2336,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2620",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "0",
		"idx_blks_hit": "0",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4145,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3466",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "0",
		"idx_blks_hit": "0",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2834,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2609",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "0",
		"idx_blks_hit": "0",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3118,
		"schemaname": "pg_catalog",
		"relname": "pg_foreign_table",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "0",
		"idx_blks_hit": "0",
		"toast_blks_read": "0",
		"toast_blks_hit": "0",
		"tidx_blks_read": "0",
		"tidx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4163,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2615",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "0",
		"idx_blks_hit": "0",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4177,
		"schemaname": "pg_toast",
		"relname": "pg_toast_1262",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "24",
		"idx_blks_hit": "3816",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2966,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2964",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "24",
		"idx_blks_hit": "3815",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4185,
		"schemaname": "pg_toast",
		"relname": "pg_toast_1213",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "24",
		"idx_blks_hit": "3815",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4175,
		"schemaname": "pg_toast",
		"relname": "pg_toast_1260",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "25",
		"idx_blks_hit": "3814",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2846,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2396",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "24",
		"idx_blks_hit": "3815",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4169,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3600",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "0",
		"idx_blks_hit": "0",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4147,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3079",
		"heap_blks_read": "0",
		"heap_blks_hit": "2",
		"idx_blks_read": "0",
		"idx_blks_hit": "7",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4149,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2328",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "0",
		"idx_blks_hit": "0",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4151,
		"schemaname": "pg_toast",
		"relname": "pg_toast_1417",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "0",
		"idx_blks_hit": "0",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4173,
		"schemaname": "pg_toast",
		"relname": "pg_toast_1418",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "0",
		"idx_blks_hit": "0",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4153,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3118",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "0",
		"idx_blks_hit": "0",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4167,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3256",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "0",
		"idx_blks_hit": "0",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4181,
		"schemaname": "pg_toast",
		"relname": "pg_toast_6000",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "24",
		"idx_blks_hit": "3815",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4143,
		"schemaname": "pg_toast",
		"relname": "pg_toast_826",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "0",
		"idx_blks_hit": "0",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4155,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3394",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "0",
		"idx_blks_hit": "0",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3598,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3596",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "0",
		"idx_blks_hit": "0",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4060,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3592",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "24",
		"idx_blks_hit": "3815",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6175,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3456",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "0",
		"idx_blks_hit": "0",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6244,
		"schemaname": "pg_toast",
		"relname": "pg_toast_6243",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "24",
		"idx_blks_hit": "3815",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4165,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3350",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "0",
		"idx_blks_hit": "0",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6228,
		"schemaname": "pg_toast",
		"relname": "pg_toast_6106",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "0",
		"idx_blks_hit": "0",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4183,
		"schemaname": "pg_toast",
		"relname": "pg_toast_6100",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "24",
		"idx_blks_hit": "3815",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1260,
		"schemaname": "pg_catalog",
		"relname": "pg_authid",
		"heap_blks_read": "159",
		"heap_blks_hit": "79829",
		"idx_blks_read": "283",
		"idx_blks_hit": "86704",
		"toast_blks_read": "0",
		"toast_blks_hit": "0",
		"tidx_blks_read": "25",
		"tidx_blks_hit": "3814"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3429,
		"schemaname": "pg_catalog",
		"relname": "pg_statistic_ext_data",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "0",
		"idx_blks_hit": "0",
		"toast_blks_read": "0",
		"toast_blks_hit": "0",
		"tidx_blks_read": "0",
		"tidx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1418,
		"schemaname": "pg_catalog",
		"relname": "pg_user_mapping",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "0",
		"idx_blks_hit": "0",
		"toast_blks_read": "0",
		"toast_blks_hit": "0",
		"tidx_blks_read": "0",
		"tidx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6100,
		"schemaname": "pg_catalog",
		"relname": "pg_subscription",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "48",
		"idx_blks_hit": "7630",
		"toast_blks_read": "0",
		"toast_blks_hit": "0",
		"tidx_blks_read": "24",
		"tidx_blks_hit": "3815"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1249,
		"schemaname": "pg_catalog",
		"relname": "pg_attribute",
		"heap_blks_read": "490",
		"heap_blks_hit": "136316",
		"idx_blks_read": "214",
		"idx_blks_hit": "275977",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1255,
		"schemaname": "pg_catalog",
		"relname": "pg_proc",
		"heap_blks_read": "802",
		"heap_blks_hit": "52529",
		"idx_blks_read": "609",
		"idx_blks_hit": "77872",
		"toast_blks_read": "0",
		"toast_blks_hit": "37",
		"tidx_blks_read": "0",
		"tidx_blks_hit": "20"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1259,
		"schemaname": "pg_catalog",
		"relname": "pg_class",
		"heap_blks_read": "208",
		"heap_blks_hit": "321746",
		"idx_blks_read": "234",
		"idx_blks_hit": "105015",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2604,
		"schemaname": "pg_catalog",
		"relname": "pg_attrdef",
		"heap_blks_read": "5",
		"heap_blks_hit": "52",
		"idx_blks_read": "10",
		"idx_blks_hit": "109",
		"toast_blks_read": "0",
		"toast_blks_hit": "0",
		"tidx_blks_read": "0",
		"tidx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2606,
		"schemaname": "pg_catalog",
		"relname": "pg_constraint",
		"heap_blks_read": "3",
		"heap_blks_hit": "172",
		"idx_blks_read": "135",
		"idx_blks_hit": "1978",
		"toast_blks_read": "0",
		"toast_blks_hit": "0",
		"tidx_blks_read": "0",
		"tidx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2611,
		"schemaname": "pg_catalog",
		"relname": "pg_inherits",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "2",
		"idx_blks_hit": "82",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2610,
		"schemaname": "pg_catalog",
		"relname": "pg_index",
		"heap_blks_read": "72",
		"heap_blks_hit": "46774",
		"idx_blks_read": "116",
		"idx_blks_hit": "38433",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2617,
		"schemaname": "pg_catalog",
		"relname": "pg_operator",
		"heap_blks_read": "221",
		"heap_blks_hit": "17279",
		"idx_blks_read": "326",
		"idx_blks_hit": "32927",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2753,
		"schemaname": "pg_catalog",
		"relname": "pg_opfamily",
		"heap_blks_read": "0",
		"heap_blks_hit": "28",
		"idx_blks_read": "0",
		"idx_blks_hit": "59",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2616,
		"schemaname": "pg_catalog",
		"relname": "pg_opclass",
		"heap_blks_read": "48",
		"heap_blks_hit": "235004",
		"idx_blks_read": "119",
		"idx_blks_hit": "37495",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2601,
		"schemaname": "pg_catalog",
		"relname": "pg_am",
		"heap_blks_read": "17",
		"heap_blks_hit": "8859",
		"idx_blks_read": "0",
		"idx_blks_hit": "0",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2602,
		"schemaname": "pg_catalog",
		"relname": "pg_amop",
		"heap_blks_read": "96",
		"heap_blks_hit": "34394",
		"idx_blks_read": "204",
		"idx_blks_hit": "49365",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2603,
		"schemaname": "pg_catalog",
		"relname": "pg_amproc",
		"heap_blks_read": "34",
		"heap_blks_hit": "13745",
		"idx_blks_read": "57",
		"idx_blks_hit": "35498",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2612,
		"schemaname": "pg_catalog",
		"relname": "pg_language",
		"heap_blks_read": "0",
		"heap_blks_hit": "6",
		"idx_blks_read": "0",
		"idx_blks_hit": "8",
		"toast_blks_read": "0",
		"toast_blks_hit": "0",
		"tidx_blks_read": "0",
		"tidx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2995,
		"schemaname": "pg_catalog",
		"relname": "pg_largeobject_metadata",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "0",
		"idx_blks_hit": "0",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2600,
		"schemaname": "pg_catalog",
		"relname": "pg_aggregate",
		"heap_blks_read": "130",
		"heap_blks_hit": "1866",
		"idx_blks_read": "95",
		"idx_blks_hit": "2837",
		"toast_blks_read": "0",
		"toast_blks_hit": "0",
		"tidx_blks_read": "0",
		"tidx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3381,
		"schemaname": "pg_catalog",
		"relname": "pg_statistic_ext",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "18",
		"idx_blks_hit": "8846",
		"toast_blks_read": "0",
		"toast_blks_hit": "0",
		"tidx_blks_read": "0",
		"tidx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2618,
		"schemaname": "pg_catalog",
		"relname": "pg_rewrite",
		"heap_blks_read": "76",
		"heap_blks_hit": "1547",
		"idx_blks_read": "131",
		"idx_blks_hit": "2281",
		"toast_blks_read": "144",
		"toast_blks_hit": "2170",
		"tidx_blks_read": "130",
		"tidx_blks_hit": "2058"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2620,
		"schemaname": "pg_catalog",
		"relname": "pg_trigger",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "3",
		"idx_blks_hit": "183",
		"toast_blks_read": "0",
		"toast_blks_hit": "0",
		"tidx_blks_read": "0",
		"tidx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3466,
		"schemaname": "pg_catalog",
		"relname": "pg_event_trigger",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "0",
		"idx_blks_hit": "1",
		"toast_blks_read": "0",
		"toast_blks_hit": "0",
		"tidx_blks_read": "0",
		"tidx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2609,
		"schemaname": "pg_catalog",
		"relname": "pg_description",
		"heap_blks_read": "12",
		"heap_blks_hit": "1298",
		"idx_blks_read": "44",
		"idx_blks_hit": "4846",
		"toast_blks_read": "0",
		"toast_blks_hit": "0",
		"tidx_blks_read": "0",
		"tidx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2605,
		"schemaname": "pg_catalog",
		"relname": "pg_cast",
		"heap_blks_read": "37",
		"heap_blks_hit": "6360",
		"idx_blks_read": "73",
		"idx_blks_hit": "47071",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3501,
		"schemaname": "pg_catalog",
		"relname": "pg_enum",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "6",
		"idx_blks_hit": "18",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2615,
		"schemaname": "pg_catalog",
		"relname": "pg_namespace",
		"heap_blks_read": "43",
		"heap_blks_hit": "8060",
		"idx_blks_read": "153",
		"idx_blks_hit": "11082",
		"toast_blks_read": "0",
		"toast_blks_hit": "0",
		"tidx_blks_read": "0",
		"tidx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2607,
		"schemaname": "pg_catalog",
		"relname": "pg_conversion",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "0",
		"idx_blks_hit": "0",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2608,
		"schemaname": "pg_catalog",
		"relname": "pg_depend",
		"heap_blks_read": "4",
		"heap_blks_hit": "3729",
		"idx_blks_read": "9",
		"idx_blks_hit": "15438",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1262,
		"schemaname": "pg_catalog",
		"relname": "pg_database",
		"heap_blks_read": "483",
		"heap_blks_hit": "817051",
		"idx_blks_read": "916",
		"idx_blks_hit": "862640",
		"toast_blks_read": "0",
		"toast_blks_hit": "0",
		"tidx_blks_read": "24",
		"tidx_blks_hit": "3816"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2964,
		"schemaname": "pg_catalog",
		"relname": "pg_db_role_setting",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "361",
		"idx_blks_hit": "1415100",
		"toast_blks_read": "0",
		"toast_blks_hit": "0",
		"tidx_blks_read": "24",
		"tidx_blks_hit": "3815"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1213,
		"schemaname": "pg_catalog",
		"relname": "pg_tablespace",
		"heap_blks_read": "156",
		"heap_blks_hit": "41525",
		"idx_blks_read": "175",
		"idx_blks_hit": "35018",
		"toast_blks_read": "0",
		"toast_blks_hit": "0",
		"tidx_blks_read": "24",
		"tidx_blks_hit": "3815"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1261,
		"schemaname": "pg_catalog",
		"relname": "pg_auth_members",
		"heap_blks_read": "282",
		"heap_blks_hit": "26642",
		"idx_blks_read": "102",
		"idx_blks_hit": "15478",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1214,
		"schemaname": "pg_catalog",
		"relname": "pg_shdepend",
		"heap_blks_read": "1180",
		"heap_blks_hit": "717789",
		"idx_blks_read": "1108",
		"idx_blks_hit": "1268680",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2396,
		"schemaname": "pg_catalog",
		"relname": "pg_shdescription",
		"heap_blks_read": "254",
		"heap_blks_hit": "26771",
		"idx_blks_read": "57",
		"idx_blks_hit": "4556",
		"toast_blks_read": "0",
		"toast_blks_hit": "0",
		"tidx_blks_read": "24",
		"tidx_blks_hit": "3815"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3602,
		"schemaname": "pg_catalog",
		"relname": "pg_ts_config",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "0",
		"idx_blks_hit": "0",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3603,
		"schemaname": "pg_catalog",
		"relname": "pg_ts_config_map",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "0",
		"idx_blks_hit": "0",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3600,
		"schemaname": "pg_catalog",
		"relname": "pg_ts_dict",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "0",
		"idx_blks_hit": "0",
		"toast_blks_read": "0",
		"toast_blks_hit": "0",
		"tidx_blks_read": "0",
		"tidx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3601,
		"schemaname": "pg_catalog",
		"relname": "pg_ts_parser",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "0",
		"idx_blks_hit": "0",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3764,
		"schemaname": "pg_catalog",
		"relname": "pg_ts_template",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "0",
		"idx_blks_hit": "0",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3079,
		"schemaname": "pg_catalog",
		"relname": "pg_extension",
		"heap_blks_read": "1",
		"heap_blks_hit": "32",
		"idx_blks_read": "2",
		"idx_blks_hit": "47",
		"toast_blks_read": "0",
		"toast_blks_hit": "2",
		"tidx_blks_read": "0",
		"tidx_blks_hit": "7"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2328,
		"schemaname": "pg_catalog",
		"relname": "pg_foreign_data_wrapper",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "0",
		"idx_blks_hit": "0",
		"toast_blks_read": "0",
		"toast_blks_hit": "0",
		"tidx_blks_read": "0",
		"tidx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1417,
		"schemaname": "pg_catalog",
		"relname": "pg_foreign_server",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "0",
		"idx_blks_hit": "0",
		"toast_blks_read": "0",
		"toast_blks_hit": "0",
		"tidx_blks_read": "0",
		"tidx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3256,
		"schemaname": "pg_catalog",
		"relname": "pg_policy",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "0",
		"idx_blks_hit": "0",
		"toast_blks_read": "0",
		"toast_blks_hit": "0",
		"tidx_blks_read": "0",
		"tidx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6000,
		"schemaname": "pg_catalog",
		"relname": "pg_replication_origin",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "48",
		"idx_blks_hit": "7630",
		"toast_blks_read": "0",
		"toast_blks_hit": "0",
		"tidx_blks_read": "24",
		"tidx_blks_hit": "3815"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 826,
		"schemaname": "pg_catalog",
		"relname": "pg_default_acl",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "0",
		"idx_blks_hit": "16",
		"toast_blks_read": "0",
		"toast_blks_hit": "0",
		"tidx_blks_read": "0",
		"tidx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3394,
		"schemaname": "pg_catalog",
		"relname": "pg_init_privs",
		"heap_blks_read": "0",
		"heap_blks_hit": "7",
		"idx_blks_read": "0",
		"idx_blks_hit": "7",
		"toast_blks_read": "0",
		"toast_blks_hit": "0",
		"tidx_blks_read": "0",
		"tidx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3596,
		"schemaname": "pg_catalog",
		"relname": "pg_seclabel",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "0",
		"idx_blks_hit": "0",
		"toast_blks_read": "0",
		"toast_blks_hit": "0",
		"tidx_blks_read": "0",
		"tidx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3592,
		"schemaname": "pg_catalog",
		"relname": "pg_shseclabel",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "35",
		"idx_blks_hit": "4478",
		"toast_blks_read": "0",
		"toast_blks_hit": "0",
		"tidx_blks_read": "24",
		"tidx_blks_hit": "3815"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3456,
		"schemaname": "pg_catalog",
		"relname": "pg_collation",
		"heap_blks_read": "65",
		"heap_blks_hit": "879",
		"idx_blks_read": "192",
		"idx_blks_hit": "2640",
		"toast_blks_read": "0",
		"toast_blks_hit": "0",
		"tidx_blks_read": "0",
		"tidx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6243,
		"schemaname": "pg_catalog",
		"relname": "pg_parameter_acl",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "48",
		"idx_blks_hit": "7630",
		"toast_blks_read": "0",
		"toast_blks_hit": "0",
		"tidx_blks_read": "24",
		"tidx_blks_hit": "3815"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3350,
		"schemaname": "pg_catalog",
		"relname": "pg_partitioned_table",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "0",
		"idx_blks_hit": "0",
		"toast_blks_read": "0",
		"toast_blks_hit": "0",
		"tidx_blks_read": "0",
		"tidx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3541,
		"schemaname": "pg_catalog",
		"relname": "pg_range",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "10",
		"idx_blks_hit": "54",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3576,
		"schemaname": "pg_catalog",
		"relname": "pg_transform",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "0",
		"idx_blks_hit": "140",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2224,
		"schemaname": "pg_catalog",
		"relname": "pg_sequence",
		"heap_blks_read": "4",
		"heap_blks_hit": "31",
		"idx_blks_read": "7",
		"idx_blks_hit": "59",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6104,
		"schemaname": "pg_catalog",
		"relname": "pg_publication",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "0",
		"idx_blks_hit": "0",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6237,
		"schemaname": "pg_catalog",
		"relname": "pg_publication_namespace",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "31",
		"idx_blks_hit": "1861",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6106,
		"schemaname": "pg_catalog",
		"relname": "pg_publication_rel",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "31",
		"idx_blks_hit": "1861",
		"toast_blks_read": "0",
		"toast_blks_hit": "0",
		"tidx_blks_read": "0",
		"tidx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6102,
		"schemaname": "pg_catalog",
		"relname": "pg_subscription_rel",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "0",
		"idx_blks_hit": "0",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2613,
		"schemaname": "pg_catalog",
		"relname": "pg_largeobject",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "0",
		"idx_blks_hit": "0",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 14835,
		"schemaname": "pg_toast",
		"relname": "pg_toast_14832",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "0",
		"idx_blks_hit": "0",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 14840,
		"schemaname": "pg_toast",
		"relname": "pg_toast_14837",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "0",
		"idx_blks_hit": "0",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 14830,
		"schemaname": "pg_toast",
		"relname": "pg_toast_14827",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "0",
		"idx_blks_hit": "0",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 14845,
		"schemaname": "pg_toast",
		"relname": "pg_toast_14842",
		"heap_blks_read": "0",
		"heap_blks_hit": "0",
		"idx_blks_read": "0",
		"idx_blks_hit": "0",
		"toast_blks_read": null,
		"toast_blks_hit": null,
		"tidx_blks_read": null,
		"tidx_blks_hit": null
	  }
	],
	"dump_pgstatioindexes": [
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 378629,
		"indexrelid": 378630,
		"schemaname": "pg_toast",
		"relname": "pg_toast_378625",
		"indexrelname": "pg_toast_378625_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 378625,
		"indexrelid": 378631,
		"schemaname": "public",
		"relname": "spatial_ref_sys",
		"indexrelname": "spatial_ref_sys_pkey",
		"idx_blks_read": "1",
		"idx_blks_hit": "33212"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 379408,
		"indexrelid": 379409,
		"schemaname": "pg_toast",
		"relname": "pg_toast_379405",
		"indexrelname": "pg_toast_379405_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 379405,
		"indexrelid": 379410,
		"schemaname": "public",
		"relname": "user",
		"indexrelname": "user_username_key",
		"idx_blks_read": "62",
		"idx_blks_hit": "1318"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 379417,
		"indexrelid": 379418,
		"schemaname": "pg_toast",
		"relname": "pg_toast_379413",
		"indexrelname": "pg_toast_379413_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2836,
		"indexrelid": 2837,
		"schemaname": "pg_toast",
		"relname": "pg_toast_1255",
		"indexrelname": "pg_toast_1255_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "20"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4171,
		"indexrelid": 4172,
		"schemaname": "pg_toast",
		"relname": "pg_toast_1247",
		"indexrelname": "pg_toast_1247_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2830,
		"indexrelid": 2831,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2604",
		"indexrelname": "pg_toast_2604_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2832,
		"indexrelid": 2833,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2606",
		"indexrelname": "pg_toast_2606_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4157,
		"indexrelid": 4158,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2612",
		"indexrelname": "pg_toast_2612_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4159,
		"indexrelid": 4160,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2600",
		"indexrelname": "pg_toast_2600_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2840,
		"indexrelid": 2841,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2619",
		"indexrelname": "pg_toast_2619_index",
		"idx_blks_read": "8",
		"idx_blks_hit": "258"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3439,
		"indexrelid": 3440,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3381",
		"indexrelname": "pg_toast_3381_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3430,
		"indexrelid": 3431,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3429",
		"indexrelname": "pg_toast_3429_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2838,
		"indexrelid": 2839,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2618",
		"indexrelname": "pg_toast_2618_index",
		"idx_blks_read": "130",
		"idx_blks_hit": "2058"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2336,
		"indexrelid": 2337,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2620",
		"indexrelname": "pg_toast_2620_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4145,
		"indexrelid": 4146,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3466",
		"indexrelname": "pg_toast_3466_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2834,
		"indexrelid": 2835,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2609",
		"indexrelname": "pg_toast_2609_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4163,
		"indexrelid": 4164,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2615",
		"indexrelname": "pg_toast_2615_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4177,
		"indexrelid": 4178,
		"schemaname": "pg_toast",
		"relname": "pg_toast_1262",
		"indexrelname": "pg_toast_1262_index",
		"idx_blks_read": "24",
		"idx_blks_hit": "3816"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2966,
		"indexrelid": 2967,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2964",
		"indexrelname": "pg_toast_2964_index",
		"idx_blks_read": "24",
		"idx_blks_hit": "3815"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4185,
		"indexrelid": 4186,
		"schemaname": "pg_toast",
		"relname": "pg_toast_1213",
		"indexrelname": "pg_toast_1213_index",
		"idx_blks_read": "24",
		"idx_blks_hit": "3815"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4175,
		"indexrelid": 4176,
		"schemaname": "pg_toast",
		"relname": "pg_toast_1260",
		"indexrelname": "pg_toast_1260_index",
		"idx_blks_read": "25",
		"idx_blks_hit": "3814"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2846,
		"indexrelid": 2847,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2396",
		"indexrelname": "pg_toast_2396_index",
		"idx_blks_read": "24",
		"idx_blks_hit": "3815"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4169,
		"indexrelid": 4170,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3600",
		"indexrelname": "pg_toast_3600_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4147,
		"indexrelid": 4148,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3079",
		"indexrelname": "pg_toast_3079_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "7"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4149,
		"indexrelid": 4150,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2328",
		"indexrelname": "pg_toast_2328_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4151,
		"indexrelid": 4152,
		"schemaname": "pg_toast",
		"relname": "pg_toast_1417",
		"indexrelname": "pg_toast_1417_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4173,
		"indexrelid": 4174,
		"schemaname": "pg_toast",
		"relname": "pg_toast_1418",
		"indexrelname": "pg_toast_1418_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4153,
		"indexrelid": 4154,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3118",
		"indexrelname": "pg_toast_3118_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4167,
		"indexrelid": 4168,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3256",
		"indexrelname": "pg_toast_3256_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4181,
		"indexrelid": 4182,
		"schemaname": "pg_toast",
		"relname": "pg_toast_6000",
		"indexrelname": "pg_toast_6000_index",
		"idx_blks_read": "24",
		"idx_blks_hit": "3815"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4143,
		"indexrelid": 4144,
		"schemaname": "pg_toast",
		"relname": "pg_toast_826",
		"indexrelname": "pg_toast_826_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4155,
		"indexrelid": 4156,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3394",
		"indexrelname": "pg_toast_3394_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3598,
		"indexrelid": 3599,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3596",
		"indexrelname": "pg_toast_3596_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4060,
		"indexrelid": 4061,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3592",
		"indexrelname": "pg_toast_3592_index",
		"idx_blks_read": "24",
		"idx_blks_hit": "3815"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6175,
		"indexrelid": 6176,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3456",
		"indexrelname": "pg_toast_3456_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6244,
		"indexrelid": 6245,
		"schemaname": "pg_toast",
		"relname": "pg_toast_6243",
		"indexrelname": "pg_toast_6243_index",
		"idx_blks_read": "24",
		"idx_blks_hit": "3815"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4165,
		"indexrelid": 4166,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3350",
		"indexrelname": "pg_toast_3350_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6228,
		"indexrelid": 6229,
		"schemaname": "pg_toast",
		"relname": "pg_toast_6106",
		"indexrelname": "pg_toast_6106_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 4183,
		"indexrelid": 4184,
		"schemaname": "pg_toast",
		"relname": "pg_toast_6100",
		"indexrelname": "pg_toast_6100_index",
		"idx_blks_read": "24",
		"idx_blks_hit": "3815"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1255,
		"indexrelid": 2690,
		"schemaname": "pg_catalog",
		"relname": "pg_proc",
		"indexrelname": "pg_proc_oid_index",
		"idx_blks_read": "246",
		"idx_blks_hit": "58548"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1255,
		"indexrelid": 2691,
		"schemaname": "pg_catalog",
		"relname": "pg_proc",
		"indexrelname": "pg_proc_proname_args_nsp_index",
		"idx_blks_read": "363",
		"idx_blks_hit": "19324"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1247,
		"indexrelid": 2703,
		"schemaname": "pg_catalog",
		"relname": "pg_type",
		"indexrelname": "pg_type_oid_index",
		"idx_blks_read": "104",
		"idx_blks_hit": "60930"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1247,
		"indexrelid": 2704,
		"schemaname": "pg_catalog",
		"relname": "pg_type",
		"indexrelname": "pg_type_typname_nsp_index",
		"idx_blks_read": "129",
		"idx_blks_hit": "5502"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1249,
		"indexrelid": 2658,
		"schemaname": "pg_catalog",
		"relname": "pg_attribute",
		"indexrelname": "pg_attribute_relid_attnam_index",
		"idx_blks_read": "1",
		"idx_blks_hit": "300"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1249,
		"indexrelid": 2659,
		"schemaname": "pg_catalog",
		"relname": "pg_attribute",
		"indexrelname": "pg_attribute_relid_attnum_index",
		"idx_blks_read": "213",
		"idx_blks_hit": "275677"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1259,
		"indexrelid": 2662,
		"schemaname": "pg_catalog",
		"relname": "pg_class",
		"indexrelname": "pg_class_oid_index",
		"idx_blks_read": "62",
		"idx_blks_hit": "93364"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1259,
		"indexrelid": 2663,
		"schemaname": "pg_catalog",
		"relname": "pg_class",
		"indexrelname": "pg_class_relname_nsp_index",
		"idx_blks_read": "107",
		"idx_blks_hit": "10740"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1259,
		"indexrelid": 3455,
		"schemaname": "pg_catalog",
		"relname": "pg_class",
		"indexrelname": "pg_class_tblspc_relfilenode_index",
		"idx_blks_read": "65",
		"idx_blks_hit": "911"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2604,
		"indexrelid": 2656,
		"schemaname": "pg_catalog",
		"relname": "pg_attrdef",
		"indexrelname": "pg_attrdef_adrelid_adnum_index",
		"idx_blks_read": "10",
		"idx_blks_hit": "105"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2604,
		"indexrelid": 2657,
		"schemaname": "pg_catalog",
		"relname": "pg_attrdef",
		"indexrelname": "pg_attrdef_oid_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "4"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2606,
		"indexrelid": 2664,
		"schemaname": "pg_catalog",
		"relname": "pg_constraint",
		"indexrelname": "pg_constraint_conname_nsp_index",
		"idx_blks_read": "1",
		"idx_blks_hit": "23"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2606,
		"indexrelid": 2665,
		"schemaname": "pg_catalog",
		"relname": "pg_constraint",
		"indexrelname": "pg_constraint_conrelid_contypid_conname_index",
		"idx_blks_read": "2",
		"idx_blks_hit": "148"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2606,
		"indexrelid": 2666,
		"schemaname": "pg_catalog",
		"relname": "pg_constraint",
		"indexrelname": "pg_constraint_contypid_index",
		"idx_blks_read": "130",
		"idx_blks_hit": "1764"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2606,
		"indexrelid": 2667,
		"schemaname": "pg_catalog",
		"relname": "pg_constraint",
		"indexrelname": "pg_constraint_oid_index",
		"idx_blks_read": "1",
		"idx_blks_hit": "23"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2606,
		"indexrelid": 2579,
		"schemaname": "pg_catalog",
		"relname": "pg_constraint",
		"indexrelname": "pg_constraint_conparentid_index",
		"idx_blks_read": "1",
		"idx_blks_hit": "20"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2611,
		"indexrelid": 2680,
		"schemaname": "pg_catalog",
		"relname": "pg_inherits",
		"indexrelname": "pg_inherits_relid_seqno_index",
		"idx_blks_read": "1",
		"idx_blks_hit": "41"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2611,
		"indexrelid": 2187,
		"schemaname": "pg_catalog",
		"relname": "pg_inherits",
		"indexrelname": "pg_inherits_parent_index",
		"idx_blks_read": "1",
		"idx_blks_hit": "41"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2610,
		"indexrelid": 2678,
		"schemaname": "pg_catalog",
		"relname": "pg_index",
		"indexrelname": "pg_index_indrelid_index",
		"idx_blks_read": "76",
		"idx_blks_hit": "6995"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2610,
		"indexrelid": 2679,
		"schemaname": "pg_catalog",
		"relname": "pg_index",
		"indexrelname": "pg_index_indexrelid_index",
		"idx_blks_read": "40",
		"idx_blks_hit": "31438"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2617,
		"indexrelid": 2688,
		"schemaname": "pg_catalog",
		"relname": "pg_operator",
		"indexrelname": "pg_operator_oid_index",
		"idx_blks_read": "96",
		"idx_blks_hit": "20571"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2617,
		"indexrelid": 2689,
		"schemaname": "pg_catalog",
		"relname": "pg_operator",
		"indexrelname": "pg_operator_oprname_l_r_n_index",
		"idx_blks_read": "230",
		"idx_blks_hit": "12356"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2753,
		"indexrelid": 2754,
		"schemaname": "pg_catalog",
		"relname": "pg_opfamily",
		"indexrelname": "pg_opfamily_am_name_nsp_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "30"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2753,
		"indexrelid": 2755,
		"schemaname": "pg_catalog",
		"relname": "pg_opfamily",
		"indexrelname": "pg_opfamily_oid_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "29"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2616,
		"indexrelid": 2686,
		"schemaname": "pg_catalog",
		"relname": "pg_opclass",
		"indexrelname": "pg_opclass_am_name_nsp_index",
		"idx_blks_read": "79",
		"idx_blks_hit": "16190"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2616,
		"indexrelid": 2687,
		"schemaname": "pg_catalog",
		"relname": "pg_opclass",
		"indexrelname": "pg_opclass_oid_index",
		"idx_blks_read": "40",
		"idx_blks_hit": "21305"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2601,
		"indexrelid": 2651,
		"schemaname": "pg_catalog",
		"relname": "pg_am",
		"indexrelname": "pg_am_name_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2601,
		"indexrelid": 2652,
		"schemaname": "pg_catalog",
		"relname": "pg_am",
		"indexrelname": "pg_am_oid_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2602,
		"indexrelid": 2653,
		"schemaname": "pg_catalog",
		"relname": "pg_amop",
		"indexrelname": "pg_amop_fam_strat_index",
		"idx_blks_read": "93",
		"idx_blks_hit": "19590"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2602,
		"indexrelid": 2654,
		"schemaname": "pg_catalog",
		"relname": "pg_amop",
		"indexrelname": "pg_amop_opr_fam_index",
		"idx_blks_read": "111",
		"idx_blks_hit": "29462"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2602,
		"indexrelid": 2756,
		"schemaname": "pg_catalog",
		"relname": "pg_amop",
		"indexrelname": "pg_amop_oid_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "313"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2603,
		"indexrelid": 2655,
		"schemaname": "pg_catalog",
		"relname": "pg_amproc",
		"indexrelname": "pg_amproc_fam_proc_index",
		"idx_blks_read": "57",
		"idx_blks_hit": "35221"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2603,
		"indexrelid": 2757,
		"schemaname": "pg_catalog",
		"relname": "pg_amproc",
		"indexrelname": "pg_amproc_oid_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "277"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2612,
		"indexrelid": 2681,
		"schemaname": "pg_catalog",
		"relname": "pg_language",
		"indexrelname": "pg_language_name_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "4"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2612,
		"indexrelid": 2682,
		"schemaname": "pg_catalog",
		"relname": "pg_language",
		"indexrelname": "pg_language_oid_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "4"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2995,
		"indexrelid": 2996,
		"schemaname": "pg_catalog",
		"relname": "pg_largeobject_metadata",
		"indexrelname": "pg_largeobject_metadata_oid_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2613,
		"indexrelid": 2683,
		"schemaname": "pg_catalog",
		"relname": "pg_largeobject",
		"indexrelname": "pg_largeobject_loid_pn_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2600,
		"indexrelid": 2650,
		"schemaname": "pg_catalog",
		"relname": "pg_aggregate",
		"indexrelname": "pg_aggregate_fnoid_index",
		"idx_blks_read": "95",
		"idx_blks_hit": "2837"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2619,
		"indexrelid": 2696,
		"schemaname": "pg_catalog",
		"relname": "pg_statistic",
		"indexrelname": "pg_statistic_relid_att_inh_index",
		"idx_blks_read": "209",
		"idx_blks_hit": "28398"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3381,
		"indexrelid": 3380,
		"schemaname": "pg_catalog",
		"relname": "pg_statistic_ext",
		"indexrelname": "pg_statistic_ext_oid_index",
		"idx_blks_read": "1",
		"idx_blks_hit": "19"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3381,
		"indexrelid": 3997,
		"schemaname": "pg_catalog",
		"relname": "pg_statistic_ext",
		"indexrelname": "pg_statistic_ext_name_index",
		"idx_blks_read": "1",
		"idx_blks_hit": "19"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3381,
		"indexrelid": 3379,
		"schemaname": "pg_catalog",
		"relname": "pg_statistic_ext",
		"indexrelname": "pg_statistic_ext_relid_index",
		"idx_blks_read": "16",
		"idx_blks_hit": "8808"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3429,
		"indexrelid": 3433,
		"schemaname": "pg_catalog",
		"relname": "pg_statistic_ext_data",
		"indexrelname": "pg_statistic_ext_data_stxoid_inh_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2618,
		"indexrelid": 2692,
		"schemaname": "pg_catalog",
		"relname": "pg_rewrite",
		"indexrelname": "pg_rewrite_oid_index",
		"idx_blks_read": "1",
		"idx_blks_hit": "27"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2618,
		"indexrelid": 2693,
		"schemaname": "pg_catalog",
		"relname": "pg_rewrite",
		"indexrelname": "pg_rewrite_rel_rulename_index",
		"idx_blks_read": "130",
		"idx_blks_hit": "2254"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2620,
		"indexrelid": 2699,
		"schemaname": "pg_catalog",
		"relname": "pg_trigger",
		"indexrelname": "pg_trigger_tgconstraint_index",
		"idx_blks_read": "1",
		"idx_blks_hit": "61"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2620,
		"indexrelid": 2701,
		"schemaname": "pg_catalog",
		"relname": "pg_trigger",
		"indexrelname": "pg_trigger_tgrelid_tgname_index",
		"idx_blks_read": "1",
		"idx_blks_hit": "61"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2620,
		"indexrelid": 2702,
		"schemaname": "pg_catalog",
		"relname": "pg_trigger",
		"indexrelname": "pg_trigger_oid_index",
		"idx_blks_read": "1",
		"idx_blks_hit": "61"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3466,
		"indexrelid": 3467,
		"schemaname": "pg_catalog",
		"relname": "pg_event_trigger",
		"indexrelname": "pg_event_trigger_evtname_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "1"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3466,
		"indexrelid": 3468,
		"schemaname": "pg_catalog",
		"relname": "pg_event_trigger",
		"indexrelname": "pg_event_trigger_oid_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2609,
		"indexrelid": 2675,
		"schemaname": "pg_catalog",
		"relname": "pg_description",
		"indexrelname": "pg_description_o_c_o_index",
		"idx_blks_read": "44",
		"idx_blks_hit": "4846"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2605,
		"indexrelid": 2660,
		"schemaname": "pg_catalog",
		"relname": "pg_cast",
		"indexrelname": "pg_cast_oid_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "53"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2605,
		"indexrelid": 2661,
		"schemaname": "pg_catalog",
		"relname": "pg_cast",
		"indexrelname": "pg_cast_source_target_index",
		"idx_blks_read": "73",
		"idx_blks_hit": "47018"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3501,
		"indexrelid": 3502,
		"schemaname": "pg_catalog",
		"relname": "pg_enum",
		"indexrelname": "pg_enum_oid_index",
		"idx_blks_read": "2",
		"idx_blks_hit": "6"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3501,
		"indexrelid": 3503,
		"schemaname": "pg_catalog",
		"relname": "pg_enum",
		"indexrelname": "pg_enum_typid_label_index",
		"idx_blks_read": "2",
		"idx_blks_hit": "6"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3501,
		"indexrelid": 3534,
		"schemaname": "pg_catalog",
		"relname": "pg_enum",
		"indexrelname": "pg_enum_typid_sortorder_index",
		"idx_blks_read": "2",
		"idx_blks_hit": "6"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2615,
		"indexrelid": 2684,
		"schemaname": "pg_catalog",
		"relname": "pg_namespace",
		"indexrelname": "pg_namespace_nspname_index",
		"idx_blks_read": "79",
		"idx_blks_hit": "4541"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2615,
		"indexrelid": 2685,
		"schemaname": "pg_catalog",
		"relname": "pg_namespace",
		"indexrelname": "pg_namespace_oid_index",
		"idx_blks_read": "74",
		"idx_blks_hit": "6541"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2607,
		"indexrelid": 2668,
		"schemaname": "pg_catalog",
		"relname": "pg_conversion",
		"indexrelname": "pg_conversion_default_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2607,
		"indexrelid": 2669,
		"schemaname": "pg_catalog",
		"relname": "pg_conversion",
		"indexrelname": "pg_conversion_name_nsp_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2607,
		"indexrelid": 2670,
		"schemaname": "pg_catalog",
		"relname": "pg_conversion",
		"indexrelname": "pg_conversion_oid_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2608,
		"indexrelid": 2673,
		"schemaname": "pg_catalog",
		"relname": "pg_depend",
		"indexrelname": "pg_depend_depender_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "6585"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2608,
		"indexrelid": 2674,
		"schemaname": "pg_catalog",
		"relname": "pg_depend",
		"indexrelname": "pg_depend_reference_index",
		"idx_blks_read": "9",
		"idx_blks_hit": "8853"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1262,
		"indexrelid": 2671,
		"schemaname": "pg_catalog",
		"relname": "pg_database",
		"indexrelname": "pg_database_datname_index",
		"idx_blks_read": "143",
		"idx_blks_hit": "33614"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1262,
		"indexrelid": 2672,
		"schemaname": "pg_catalog",
		"relname": "pg_database",
		"indexrelname": "pg_database_oid_index",
		"idx_blks_read": "773",
		"idx_blks_hit": "829026"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2964,
		"indexrelid": 2965,
		"schemaname": "pg_catalog",
		"relname": "pg_db_role_setting",
		"indexrelname": "pg_db_role_setting_databaseid_rol_index",
		"idx_blks_read": "361",
		"idx_blks_hit": "1415100"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1213,
		"indexrelid": 2697,
		"schemaname": "pg_catalog",
		"relname": "pg_tablespace",
		"indexrelname": "pg_tablespace_oid_index",
		"idx_blks_read": "141",
		"idx_blks_hit": "31149"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1213,
		"indexrelid": 2698,
		"schemaname": "pg_catalog",
		"relname": "pg_tablespace",
		"indexrelname": "pg_tablespace_spcname_index",
		"idx_blks_read": "34",
		"idx_blks_hit": "3869"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1260,
		"indexrelid": 2676,
		"schemaname": "pg_catalog",
		"relname": "pg_authid",
		"indexrelname": "pg_authid_rolname_index",
		"idx_blks_read": "140",
		"idx_blks_hit": "36128"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1260,
		"indexrelid": 2677,
		"schemaname": "pg_catalog",
		"relname": "pg_authid",
		"indexrelname": "pg_authid_oid_index",
		"idx_blks_read": "143",
		"idx_blks_hit": "50576"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1261,
		"indexrelid": 6303,
		"schemaname": "pg_catalog",
		"relname": "pg_auth_members",
		"indexrelname": "pg_auth_members_oid_index",
		"idx_blks_read": "25",
		"idx_blks_hit": "3869"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1261,
		"indexrelid": 2694,
		"schemaname": "pg_catalog",
		"relname": "pg_auth_members",
		"indexrelname": "pg_auth_members_role_member_index",
		"idx_blks_read": "26",
		"idx_blks_hit": "3872"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1261,
		"indexrelid": 2695,
		"schemaname": "pg_catalog",
		"relname": "pg_auth_members",
		"indexrelname": "pg_auth_members_member_role_index",
		"idx_blks_read": "26",
		"idx_blks_hit": "3872"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1261,
		"indexrelid": 6302,
		"schemaname": "pg_catalog",
		"relname": "pg_auth_members",
		"indexrelname": "pg_auth_members_grantor_index",
		"idx_blks_read": "25",
		"idx_blks_hit": "3865"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1214,
		"indexrelid": 1232,
		"schemaname": "pg_catalog",
		"relname": "pg_shdepend",
		"indexrelname": "pg_shdepend_depender_index",
		"idx_blks_read": "891",
		"idx_blks_hit": "663989"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1214,
		"indexrelid": 1233,
		"schemaname": "pg_catalog",
		"relname": "pg_shdepend",
		"indexrelname": "pg_shdepend_reference_index",
		"idx_blks_read": "217",
		"idx_blks_hit": "604691"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2396,
		"indexrelid": 2397,
		"schemaname": "pg_catalog",
		"relname": "pg_shdescription",
		"indexrelname": "pg_shdescription_o_c_index",
		"idx_blks_read": "57",
		"idx_blks_hit": "4556"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3602,
		"indexrelid": 3608,
		"schemaname": "pg_catalog",
		"relname": "pg_ts_config",
		"indexrelname": "pg_ts_config_cfgname_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3602,
		"indexrelid": 3712,
		"schemaname": "pg_catalog",
		"relname": "pg_ts_config",
		"indexrelname": "pg_ts_config_oid_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3603,
		"indexrelid": 3609,
		"schemaname": "pg_catalog",
		"relname": "pg_ts_config_map",
		"indexrelname": "pg_ts_config_map_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3600,
		"indexrelid": 3604,
		"schemaname": "pg_catalog",
		"relname": "pg_ts_dict",
		"indexrelname": "pg_ts_dict_dictname_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3600,
		"indexrelid": 3605,
		"schemaname": "pg_catalog",
		"relname": "pg_ts_dict",
		"indexrelname": "pg_ts_dict_oid_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3601,
		"indexrelid": 3606,
		"schemaname": "pg_catalog",
		"relname": "pg_ts_parser",
		"indexrelname": "pg_ts_parser_prsname_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3601,
		"indexrelid": 3607,
		"schemaname": "pg_catalog",
		"relname": "pg_ts_parser",
		"indexrelname": "pg_ts_parser_oid_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3764,
		"indexrelid": 3766,
		"schemaname": "pg_catalog",
		"relname": "pg_ts_template",
		"indexrelname": "pg_ts_template_tmplname_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3764,
		"indexrelid": 3767,
		"schemaname": "pg_catalog",
		"relname": "pg_ts_template",
		"indexrelname": "pg_ts_template_oid_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3079,
		"indexrelid": 3080,
		"schemaname": "pg_catalog",
		"relname": "pg_extension",
		"indexrelname": "pg_extension_oid_index",
		"idx_blks_read": "1",
		"idx_blks_hit": "22"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3079,
		"indexrelid": 3081,
		"schemaname": "pg_catalog",
		"relname": "pg_extension",
		"indexrelname": "pg_extension_name_index",
		"idx_blks_read": "1",
		"idx_blks_hit": "25"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2328,
		"indexrelid": 112,
		"schemaname": "pg_catalog",
		"relname": "pg_foreign_data_wrapper",
		"indexrelname": "pg_foreign_data_wrapper_oid_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2328,
		"indexrelid": 548,
		"schemaname": "pg_catalog",
		"relname": "pg_foreign_data_wrapper",
		"indexrelname": "pg_foreign_data_wrapper_name_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1417,
		"indexrelid": 113,
		"schemaname": "pg_catalog",
		"relname": "pg_foreign_server",
		"indexrelname": "pg_foreign_server_oid_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1417,
		"indexrelid": 549,
		"schemaname": "pg_catalog",
		"relname": "pg_foreign_server",
		"indexrelname": "pg_foreign_server_name_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1418,
		"indexrelid": 174,
		"schemaname": "pg_catalog",
		"relname": "pg_user_mapping",
		"indexrelname": "pg_user_mapping_oid_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 1418,
		"indexrelid": 175,
		"schemaname": "pg_catalog",
		"relname": "pg_user_mapping",
		"indexrelname": "pg_user_mapping_user_server_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3118,
		"indexrelid": 3119,
		"schemaname": "pg_catalog",
		"relname": "pg_foreign_table",
		"indexrelname": "pg_foreign_table_relid_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3256,
		"indexrelid": 3257,
		"schemaname": "pg_catalog",
		"relname": "pg_policy",
		"indexrelname": "pg_policy_oid_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3256,
		"indexrelid": 3258,
		"schemaname": "pg_catalog",
		"relname": "pg_policy",
		"indexrelname": "pg_policy_polrelid_polname_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6000,
		"indexrelid": 6001,
		"schemaname": "pg_catalog",
		"relname": "pg_replication_origin",
		"indexrelname": "pg_replication_origin_roiident_index",
		"idx_blks_read": "24",
		"idx_blks_hit": "3815"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6000,
		"indexrelid": 6002,
		"schemaname": "pg_catalog",
		"relname": "pg_replication_origin",
		"indexrelname": "pg_replication_origin_roname_index",
		"idx_blks_read": "24",
		"idx_blks_hit": "3815"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 826,
		"indexrelid": 827,
		"schemaname": "pg_catalog",
		"relname": "pg_default_acl",
		"indexrelname": "pg_default_acl_role_nsp_obj_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "16"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 826,
		"indexrelid": 828,
		"schemaname": "pg_catalog",
		"relname": "pg_default_acl",
		"indexrelname": "pg_default_acl_oid_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3394,
		"indexrelid": 3395,
		"schemaname": "pg_catalog",
		"relname": "pg_init_privs",
		"indexrelname": "pg_init_privs_o_c_o_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "7"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3596,
		"indexrelid": 3597,
		"schemaname": "pg_catalog",
		"relname": "pg_seclabel",
		"indexrelname": "pg_seclabel_object_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3592,
		"indexrelid": 3593,
		"schemaname": "pg_catalog",
		"relname": "pg_shseclabel",
		"indexrelname": "pg_shseclabel_object_index",
		"idx_blks_read": "35",
		"idx_blks_hit": "4478"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3456,
		"indexrelid": 3164,
		"schemaname": "pg_catalog",
		"relname": "pg_collation",
		"indexrelname": "pg_collation_name_enc_nsp_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3456,
		"indexrelid": 3085,
		"schemaname": "pg_catalog",
		"relname": "pg_collation",
		"indexrelname": "pg_collation_oid_index",
		"idx_blks_read": "192",
		"idx_blks_hit": "2640"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6243,
		"indexrelid": 6246,
		"schemaname": "pg_catalog",
		"relname": "pg_parameter_acl",
		"indexrelname": "pg_parameter_acl_parname_index",
		"idx_blks_read": "24",
		"idx_blks_hit": "3815"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6243,
		"indexrelid": 6247,
		"schemaname": "pg_catalog",
		"relname": "pg_parameter_acl",
		"indexrelname": "pg_parameter_acl_oid_index",
		"idx_blks_read": "24",
		"idx_blks_hit": "3815"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3350,
		"indexrelid": 3351,
		"schemaname": "pg_catalog",
		"relname": "pg_partitioned_table",
		"indexrelname": "pg_partitioned_table_partrelid_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3541,
		"indexrelid": 3542,
		"schemaname": "pg_catalog",
		"relname": "pg_range",
		"indexrelname": "pg_range_rngtypid_index",
		"idx_blks_read": "4",
		"idx_blks_hit": "12"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3541,
		"indexrelid": 2228,
		"schemaname": "pg_catalog",
		"relname": "pg_range",
		"indexrelname": "pg_range_rngmultitypid_index",
		"idx_blks_read": "6",
		"idx_blks_hit": "42"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3576,
		"indexrelid": 3574,
		"schemaname": "pg_catalog",
		"relname": "pg_transform",
		"indexrelname": "pg_transform_oid_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 3576,
		"indexrelid": 3575,
		"schemaname": "pg_catalog",
		"relname": "pg_transform",
		"indexrelname": "pg_transform_type_lang_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "140"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 2224,
		"indexrelid": 5002,
		"schemaname": "pg_catalog",
		"relname": "pg_sequence",
		"indexrelname": "pg_sequence_seqrelid_index",
		"idx_blks_read": "7",
		"idx_blks_hit": "59"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6104,
		"indexrelid": 6110,
		"schemaname": "pg_catalog",
		"relname": "pg_publication",
		"indexrelname": "pg_publication_oid_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6104,
		"indexrelid": 6111,
		"schemaname": "pg_catalog",
		"relname": "pg_publication",
		"indexrelname": "pg_publication_pubname_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6237,
		"indexrelid": 6238,
		"schemaname": "pg_catalog",
		"relname": "pg_publication_namespace",
		"indexrelname": "pg_publication_namespace_oid_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6237,
		"indexrelid": 6239,
		"schemaname": "pg_catalog",
		"relname": "pg_publication_namespace",
		"indexrelname": "pg_publication_namespace_pnnspid_pnpubid_index",
		"idx_blks_read": "31",
		"idx_blks_hit": "1861"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6106,
		"indexrelid": 6112,
		"schemaname": "pg_catalog",
		"relname": "pg_publication_rel",
		"indexrelname": "pg_publication_rel_oid_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6106,
		"indexrelid": 6113,
		"schemaname": "pg_catalog",
		"relname": "pg_publication_rel",
		"indexrelname": "pg_publication_rel_prrelid_prpubid_index",
		"idx_blks_read": "31",
		"idx_blks_hit": "1861"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6106,
		"indexrelid": 6116,
		"schemaname": "pg_catalog",
		"relname": "pg_publication_rel",
		"indexrelname": "pg_publication_rel_prpubid_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6100,
		"indexrelid": 6114,
		"schemaname": "pg_catalog",
		"relname": "pg_subscription",
		"indexrelname": "pg_subscription_oid_index",
		"idx_blks_read": "24",
		"idx_blks_hit": "3815"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6100,
		"indexrelid": 6115,
		"schemaname": "pg_catalog",
		"relname": "pg_subscription",
		"indexrelname": "pg_subscription_subname_index",
		"idx_blks_read": "24",
		"idx_blks_hit": "3815"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 6102,
		"indexrelid": 6117,
		"schemaname": "pg_catalog",
		"relname": "pg_subscription_rel",
		"indexrelname": "pg_subscription_rel_srrelid_srsubid_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 14830,
		"indexrelid": 14831,
		"schemaname": "pg_toast",
		"relname": "pg_toast_14827",
		"indexrelname": "pg_toast_14827_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 14835,
		"indexrelid": 14836,
		"schemaname": "pg_toast",
		"relname": "pg_toast_14832",
		"indexrelname": "pg_toast_14832_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 14840,
		"indexrelid": 14841,
		"schemaname": "pg_toast",
		"relname": "pg_toast_14837",
		"indexrelname": "pg_toast_14837_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 14845,
		"indexrelid": 14846,
		"schemaname": "pg_toast",
		"relname": "pg_toast_14842",
		"indexrelname": "pg_toast_14842_index",
		"idx_blks_read": "0",
		"idx_blks_hit": "0"
	  }
	],
	"dump_pgstatiosequences": [
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 379404,
		"schemaname": "public",
		"relname": "user_id_seq",
		"blks_read": "0",
		"blks_hit": "3"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"relid": 379412,
		"schemaname": "public",
		"relname": "log_request_id_seq",
		"blks_read": "4",
		"blks_hit": "1178"
	  }
	],
	"dump_pgstatuserfunctions": [],
	"dump_pgclass_size": [
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "public",
		"relname": "geometry_dump",
		"relkind": "c",
		"reltuples": -1,
		"relpages": 0,
		"pg_relation_size": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_378625",
		"relkind": "t",
		"reltuples": -1,
		"relpages": 0,
		"pg_relation_size": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_378625_index",
		"relkind": "i",
		"reltuples": 0,
		"relpages": 1,
		"pg_relation_size": "8192"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "public",
		"relname": "spatial_ref_sys_pkey",
		"relkind": "i",
		"reltuples": 8500,
		"relpages": 26,
		"pg_relation_size": "212992"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "public",
		"relname": "valid_detail",
		"relkind": "c",
		"reltuples": -1,
		"relpages": 0,
		"pg_relation_size": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "public",
		"relname": "geography_columns",
		"relkind": "v",
		"reltuples": -1,
		"relpages": 0,
		"pg_relation_size": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "public",
		"relname": "geometry_columns",
		"relkind": "v",
		"reltuples": -1,
		"relpages": 0,
		"pg_relation_size": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "public",
		"relname": "spatial_ref_sys",
		"relkind": "r",
		"reltuples": 8500,
		"relpages": 862,
		"pg_relation_size": "7061504"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "public",
		"relname": "tablefunc_crosstab_2",
		"relkind": "c",
		"reltuples": -1,
		"relpages": 0,
		"pg_relation_size": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "public",
		"relname": "tablefunc_crosstab_3",
		"relkind": "c",
		"reltuples": -1,
		"relpages": 0,
		"pg_relation_size": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "public",
		"relname": "tablefunc_crosstab_4",
		"relkind": "c",
		"reltuples": -1,
		"relpages": 0,
		"pg_relation_size": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "public",
		"relname": "user_id_seq",
		"relkind": "S",
		"reltuples": 1,
		"relpages": 1,
		"pg_relation_size": "8192"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_379405",
		"relkind": "t",
		"reltuples": -1,
		"relpages": 0,
		"pg_relation_size": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_379405_index",
		"relkind": "i",
		"reltuples": 0,
		"relpages": 1,
		"pg_relation_size": "8192"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "public",
		"relname": "user",
		"relkind": "r",
		"reltuples": 2,
		"relpages": 1,
		"pg_relation_size": "8192"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "public",
		"relname": "user_username_key",
		"relkind": "i",
		"reltuples": 2,
		"relpages": 2,
		"pg_relation_size": "16384"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "public",
		"relname": "log_request_id_seq",
		"relkind": "S",
		"reltuples": 1,
		"relpages": 1,
		"pg_relation_size": "8192"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_379413",
		"relkind": "t",
		"reltuples": -1,
		"relpages": 0,
		"pg_relation_size": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_379413_index",
		"relkind": "i",
		"reltuples": 0,
		"relpages": 1,
		"pg_relation_size": "8192"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "public",
		"relname": "log_request",
		"relkind": "r",
		"reltuples": 1087,
		"relpages": 122,
		"pg_relation_size": "1081344"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "public",
		"relname": "config",
		"relkind": "r",
		"reltuples": -1,
		"relpages": 0,
		"pg_relation_size": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_1255",
		"relkind": "t",
		"reltuples": 3,
		"relpages": 1,
		"pg_relation_size": "32768"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_1255_index",
		"relkind": "i",
		"reltuples": 0,
		"relpages": 1,
		"pg_relation_size": "16384"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_1247",
		"relkind": "t",
		"reltuples": 0,
		"relpages": 0,
		"pg_relation_size": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_1247_index",
		"relkind": "i",
		"reltuples": 0,
		"relpages": 1,
		"pg_relation_size": "8192"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_2604",
		"relkind": "t",
		"reltuples": 0,
		"relpages": 0,
		"pg_relation_size": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_2604_index",
		"relkind": "i",
		"reltuples": 0,
		"relpages": 1,
		"pg_relation_size": "8192"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_2606",
		"relkind": "t",
		"reltuples": 0,
		"relpages": 0,
		"pg_relation_size": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_2606_index",
		"relkind": "i",
		"reltuples": 0,
		"relpages": 1,
		"pg_relation_size": "8192"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_2612",
		"relkind": "t",
		"reltuples": 0,
		"relpages": 0,
		"pg_relation_size": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_2612_index",
		"relkind": "i",
		"reltuples": 0,
		"relpages": 1,
		"pg_relation_size": "8192"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_2600",
		"relkind": "t",
		"reltuples": 0,
		"relpages": 0,
		"pg_relation_size": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_2600_index",
		"relkind": "i",
		"reltuples": 0,
		"relpages": 1,
		"pg_relation_size": "8192"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_2619",
		"relkind": "t",
		"reltuples": 14,
		"relpages": 3,
		"pg_relation_size": "147456"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_2619_index",
		"relkind": "i",
		"reltuples": 0,
		"relpages": 1,
		"pg_relation_size": "16384"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_3381",
		"relkind": "t",
		"reltuples": 0,
		"relpages": 0,
		"pg_relation_size": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_3381_index",
		"relkind": "i",
		"reltuples": 0,
		"relpages": 1,
		"pg_relation_size": "8192"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_3429",
		"relkind": "t",
		"reltuples": 0,
		"relpages": 0,
		"pg_relation_size": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_3429_index",
		"relkind": "i",
		"reltuples": 0,
		"relpages": 1,
		"pg_relation_size": "8192"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_2618",
		"relkind": "t",
		"reltuples": 287,
		"relpages": 65,
		"pg_relation_size": "557056"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_2618_index",
		"relkind": "i",
		"reltuples": 0,
		"relpages": 1,
		"pg_relation_size": "16384"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_2620",
		"relkind": "t",
		"reltuples": 0,
		"relpages": 0,
		"pg_relation_size": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_2620_index",
		"relkind": "i",
		"reltuples": 0,
		"relpages": 1,
		"pg_relation_size": "8192"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_3466",
		"relkind": "t",
		"reltuples": 0,
		"relpages": 0,
		"pg_relation_size": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_3466_index",
		"relkind": "i",
		"reltuples": 0,
		"relpages": 1,
		"pg_relation_size": "8192"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_2609",
		"relkind": "t",
		"reltuples": 0,
		"relpages": 0,
		"pg_relation_size": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_2609_index",
		"relkind": "i",
		"reltuples": 0,
		"relpages": 1,
		"pg_relation_size": "8192"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_2615",
		"relkind": "t",
		"reltuples": 0,
		"relpages": 0,
		"pg_relation_size": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_2615_index",
		"relkind": "i",
		"reltuples": 0,
		"relpages": 1,
		"pg_relation_size": "8192"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_1262",
		"relkind": "t",
		"reltuples": 0,
		"relpages": 0,
		"pg_relation_size": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_1262_index",
		"relkind": "i",
		"reltuples": 0,
		"relpages": 1,
		"pg_relation_size": "8192"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_2964",
		"relkind": "t",
		"reltuples": 0,
		"relpages": 0,
		"pg_relation_size": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_2964_index",
		"relkind": "i",
		"reltuples": 0,
		"relpages": 1,
		"pg_relation_size": "8192"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_1213",
		"relkind": "t",
		"reltuples": 0,
		"relpages": 0,
		"pg_relation_size": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_1213_index",
		"relkind": "i",
		"reltuples": 0,
		"relpages": 1,
		"pg_relation_size": "8192"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_1260",
		"relkind": "t",
		"reltuples": 0,
		"relpages": 0,
		"pg_relation_size": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_1260_index",
		"relkind": "i",
		"reltuples": 0,
		"relpages": 1,
		"pg_relation_size": "8192"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_2396",
		"relkind": "t",
		"reltuples": 0,
		"relpages": 0,
		"pg_relation_size": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_2396_index",
		"relkind": "i",
		"reltuples": 0,
		"relpages": 1,
		"pg_relation_size": "8192"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_3600",
		"relkind": "t",
		"reltuples": 0,
		"relpages": 0,
		"pg_relation_size": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_3600_index",
		"relkind": "i",
		"reltuples": 0,
		"relpages": 1,
		"pg_relation_size": "8192"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_3079",
		"relkind": "t",
		"reltuples": 0,
		"relpages": 0,
		"pg_relation_size": "8192"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_3079_index",
		"relkind": "i",
		"reltuples": 0,
		"relpages": 1,
		"pg_relation_size": "16384"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_2328",
		"relkind": "t",
		"reltuples": 0,
		"relpages": 0,
		"pg_relation_size": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_2328_index",
		"relkind": "i",
		"reltuples": 0,
		"relpages": 1,
		"pg_relation_size": "8192"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_1417",
		"relkind": "t",
		"reltuples": 0,
		"relpages": 0,
		"pg_relation_size": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_1417_index",
		"relkind": "i",
		"reltuples": 0,
		"relpages": 1,
		"pg_relation_size": "8192"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_1418",
		"relkind": "t",
		"reltuples": 0,
		"relpages": 0,
		"pg_relation_size": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_1418_index",
		"relkind": "i",
		"reltuples": 0,
		"relpages": 1,
		"pg_relation_size": "8192"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_3118",
		"relkind": "t",
		"reltuples": 0,
		"relpages": 0,
		"pg_relation_size": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_3118_index",
		"relkind": "i",
		"reltuples": 0,
		"relpages": 1,
		"pg_relation_size": "8192"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_3256",
		"relkind": "t",
		"reltuples": 0,
		"relpages": 0,
		"pg_relation_size": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_3256_index",
		"relkind": "i",
		"reltuples": 0,
		"relpages": 1,
		"pg_relation_size": "8192"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_6000",
		"relkind": "t",
		"reltuples": 0,
		"relpages": 0,
		"pg_relation_size": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_6000_index",
		"relkind": "i",
		"reltuples": 0,
		"relpages": 1,
		"pg_relation_size": "8192"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_826",
		"relkind": "t",
		"reltuples": 0,
		"relpages": 0,
		"pg_relation_size": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_826_index",
		"relkind": "i",
		"reltuples": 0,
		"relpages": 1,
		"pg_relation_size": "8192"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_3394",
		"relkind": "t",
		"reltuples": 0,
		"relpages": 0,
		"pg_relation_size": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_3394_index",
		"relkind": "i",
		"reltuples": 0,
		"relpages": 1,
		"pg_relation_size": "8192"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_3596",
		"relkind": "t",
		"reltuples": 0,
		"relpages": 0,
		"pg_relation_size": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_3596_index",
		"relkind": "i",
		"reltuples": 0,
		"relpages": 1,
		"pg_relation_size": "8192"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_3592",
		"relkind": "t",
		"reltuples": 0,
		"relpages": 0,
		"pg_relation_size": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_3592_index",
		"relkind": "i",
		"reltuples": 0,
		"relpages": 1,
		"pg_relation_size": "8192"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_3456",
		"relkind": "t",
		"reltuples": 0,
		"relpages": 0,
		"pg_relation_size": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_3456_index",
		"relkind": "i",
		"reltuples": 0,
		"relpages": 1,
		"pg_relation_size": "8192"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_6243",
		"relkind": "t",
		"reltuples": 0,
		"relpages": 0,
		"pg_relation_size": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_6243_index",
		"relkind": "i",
		"reltuples": 0,
		"relpages": 1,
		"pg_relation_size": "8192"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_3350",
		"relkind": "t",
		"reltuples": 0,
		"relpages": 0,
		"pg_relation_size": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_3350_index",
		"relkind": "i",
		"reltuples": 0,
		"relpages": 1,
		"pg_relation_size": "8192"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_6106",
		"relkind": "t",
		"reltuples": 0,
		"relpages": 0,
		"pg_relation_size": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_6106_index",
		"relkind": "i",
		"reltuples": 0,
		"relpages": 1,
		"pg_relation_size": "8192"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_6100",
		"relkind": "t",
		"reltuples": 0,
		"relpages": 0,
		"pg_relation_size": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_6100_index",
		"relkind": "i",
		"reltuples": 0,
		"relpages": 1,
		"pg_relation_size": "8192"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_14827_index",
		"relkind": "i",
		"reltuples": 0,
		"relpages": 1,
		"pg_relation_size": "8192"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_14832",
		"relkind": "t",
		"reltuples": 0,
		"relpages": 0,
		"pg_relation_size": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_14832_index",
		"relkind": "i",
		"reltuples": 0,
		"relpages": 1,
		"pg_relation_size": "8192"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_14837",
		"relkind": "t",
		"reltuples": 0,
		"relpages": 0,
		"pg_relation_size": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_14837_index",
		"relkind": "i",
		"reltuples": 0,
		"relpages": 1,
		"pg_relation_size": "8192"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_14827",
		"relkind": "t",
		"reltuples": 0,
		"relpages": 0,
		"pg_relation_size": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_14842",
		"relkind": "t",
		"reltuples": 0,
		"relpages": 0,
		"pg_relation_size": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"current_database": "admin",
		"nspname": "pg_toast",
		"relname": "pg_toast_14842_index",
		"relkind": "i",
		"reltuples": 0,
		"relpages": 1,
		"pg_relation_size": "8192"
	  }
	],
	"dump_xlog_stat": [
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"num_file": "5",
		"current": "00000001000000090000008F",
		"is_recycled": "4",
		"written": "1",
		"max_wal": 1024
	  }
	],
	"dump_pgdatabase_size": [
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"datid": 5,
		"datname": "postgres",
		"size": "16380387"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"datid": 465624,
		"datname": "loradatas",
		"size": "8188387"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"datid": 1,
		"datname": "template1",
		"size": "8090083"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"datid": 4,
		"datname": "template0",
		"size": "7856655"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"datid": 375548,
		"datname": "agrhys",
		"size": "1724875279"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"datid": 354854,
		"datname": "rennesmetro",
		"size": "1141510627"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"datid": 465677,
		"datname": "adam",
		"size": "87806435"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"datid": 500997,
		"datname": "test",
		"size": "18444771"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"datid": 378306,
		"datname": "admin",
		"size": "17715683"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:18.000Z",
		"datid": 492263,
		"datname": "mario",
		"size": "18555407"
	  }
	],
	"dump_pgstatconnections": [
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"total": "2",
		"active": "0",
		"waiting": "0",
		"idle_in_xact": "0",
		"datname": "postgres"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"total": "1",
		"active": "0",
		"waiting": "0",
		"idle_in_xact": "0",
		"datname": "agrhys"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"total": "3",
		"active": "0",
		"waiting": "0",
		"idle_in_xact": "0",
		"datname": "rennesmetro"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"total": "4",
		"active": "0",
		"waiting": "0",
		"idle_in_xact": "0",
		"datname": "mario"
	  }
	],
	"dump_pgstatlocktypes": [
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"current_database": "admin",
		"label": "lock_type",
		"locktype": "virtualxid",
		"count": "1"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"current_database": "admin",
		"label": "lock_type",
		"locktype": "relation",
		"count": "1"
	  }
	],
	"dump_pgstatlockmodes": [
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"current_database": "admin",
		"label": "lock_mode",
		"mode": "ExclusiveLock",
		"count": "1"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"current_database": "admin",
		"label": "lock_mode",
		"mode": "AccessShareLock",
		"count": "1"
	  }
	],
	"dump_pgstatlockgranted": [
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"current_database": "admin",
		"label": "lock_granted",
		"granted": true,
		"count": "2"
	  }
	],
	"dump_pgstatxactuserfunctions": [],
	"dump_pgstatxacttables": [
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 4060,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3592",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 4159,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2600",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 4165,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3350",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 4147,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3079",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 2753,
		"schemaname": "pg_catalog",
		"relname": "pg_opfamily",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 4181,
		"schemaname": "pg_toast",
		"relname": "pg_toast_6000",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 1247,
		"schemaname": "pg_catalog",
		"relname": "pg_type",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "3",
		"idx_tup_fetch": "1",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 3601,
		"schemaname": "pg_catalog",
		"relname": "pg_ts_parser",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 2602,
		"schemaname": "pg_catalog",
		"relname": "pg_amop",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "8",
		"idx_tup_fetch": "9",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 3439,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3381",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 6104,
		"schemaname": "pg_catalog",
		"relname": "pg_publication",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 3429,
		"schemaname": "pg_catalog",
		"relname": "pg_statistic_ext_data",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 2846,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2396",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 4145,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3466",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 2619,
		"schemaname": "pg_catalog",
		"relname": "pg_statistic",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "12",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 4155,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3394",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 379419,
		"schemaname": "public",
		"relname": "config",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": null,
		"idx_tup_fetch": null,
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 3541,
		"schemaname": "pg_catalog",
		"relname": "pg_range",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 3602,
		"schemaname": "pg_catalog",
		"relname": "pg_ts_config",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 3381,
		"schemaname": "pg_catalog",
		"relname": "pg_statistic_ext",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 379405,
		"schemaname": "public",
		"relname": "user",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 4175,
		"schemaname": "pg_toast",
		"relname": "pg_toast_1260",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 6106,
		"schemaname": "pg_catalog",
		"relname": "pg_publication_rel",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 14835,
		"schemaname": "pg_toast",
		"relname": "pg_toast_14832",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 2605,
		"schemaname": "pg_catalog",
		"relname": "pg_cast",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "24",
		"idx_tup_fetch": "1",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 379408,
		"schemaname": "pg_toast",
		"relname": "pg_toast_379405",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 4183,
		"schemaname": "pg_toast",
		"relname": "pg_toast_6100",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 4171,
		"schemaname": "pg_toast",
		"relname": "pg_toast_1247",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 2224,
		"schemaname": "pg_catalog",
		"relname": "pg_sequence",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 2611,
		"schemaname": "pg_catalog",
		"relname": "pg_inherits",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 2830,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2604",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 1417,
		"schemaname": "pg_catalog",
		"relname": "pg_foreign_server",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 14845,
		"schemaname": "pg_toast",
		"relname": "pg_toast_14842",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 1262,
		"schemaname": "pg_catalog",
		"relname": "pg_database",
		"seq_scan": "1",
		"seq_tup_read": "10",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 6244,
		"schemaname": "pg_toast",
		"relname": "pg_toast_6243",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 3430,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3429",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 14840,
		"schemaname": "pg_toast",
		"relname": "pg_toast_14837",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 3501,
		"schemaname": "pg_catalog",
		"relname": "pg_enum",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 2607,
		"schemaname": "pg_catalog",
		"relname": "pg_conversion",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 3576,
		"schemaname": "pg_catalog",
		"relname": "pg_transform",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 826,
		"schemaname": "pg_catalog",
		"relname": "pg_default_acl",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 2601,
		"schemaname": "pg_catalog",
		"relname": "pg_am",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 2604,
		"schemaname": "pg_catalog",
		"relname": "pg_attrdef",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 3394,
		"schemaname": "pg_catalog",
		"relname": "pg_init_privs",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 4167,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3256",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 2336,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2620",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 4151,
		"schemaname": "pg_toast",
		"relname": "pg_toast_1417",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 2834,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2609",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 6000,
		"schemaname": "pg_catalog",
		"relname": "pg_replication_origin",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 2603,
		"schemaname": "pg_catalog",
		"relname": "pg_amproc",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "1",
		"idx_tup_fetch": "1",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 2606,
		"schemaname": "pg_catalog",
		"relname": "pg_constraint",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "1",
		"idx_tup_fetch": "1",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 1255,
		"schemaname": "pg_catalog",
		"relname": "pg_proc",
		"seq_scan": "1",
		"seq_tup_read": "4084",
		"idx_scan": "19",
		"idx_tup_fetch": "19",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 2840,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2619",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 4173,
		"schemaname": "pg_toast",
		"relname": "pg_toast_1418",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 2328,
		"schemaname": "pg_catalog",
		"relname": "pg_foreign_data_wrapper",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 2620,
		"schemaname": "pg_catalog",
		"relname": "pg_trigger",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 4157,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2612",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 1260,
		"schemaname": "pg_catalog",
		"relname": "pg_authid",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 2612,
		"schemaname": "pg_catalog",
		"relname": "pg_language",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 4149,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2328",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 6102,
		"schemaname": "pg_catalog",
		"relname": "pg_subscription_rel",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 1214,
		"schemaname": "pg_catalog",
		"relname": "pg_shdepend",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 4163,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2615",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 3598,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3596",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 4169,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3600",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 2615,
		"schemaname": "pg_catalog",
		"relname": "pg_namespace",
		"seq_scan": "1",
		"seq_tup_read": "4",
		"idx_scan": "4",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 2836,
		"schemaname": "pg_toast",
		"relname": "pg_toast_1255",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 3456,
		"schemaname": "pg_catalog",
		"relname": "pg_collation",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 3079,
		"schemaname": "pg_catalog",
		"relname": "pg_extension",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 378625,
		"schemaname": "public",
		"relname": "spatial_ref_sys",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 6100,
		"schemaname": "pg_catalog",
		"relname": "pg_subscription",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 14830,
		"schemaname": "pg_toast",
		"relname": "pg_toast_14827",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 2832,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2606",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 2396,
		"schemaname": "pg_catalog",
		"relname": "pg_shdescription",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 3256,
		"schemaname": "pg_catalog",
		"relname": "pg_policy",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 3600,
		"schemaname": "pg_catalog",
		"relname": "pg_ts_dict",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 3596,
		"schemaname": "pg_catalog",
		"relname": "pg_seclabel",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 2609,
		"schemaname": "pg_catalog",
		"relname": "pg_description",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 3466,
		"schemaname": "pg_catalog",
		"relname": "pg_event_trigger",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 3592,
		"schemaname": "pg_catalog",
		"relname": "pg_shseclabel",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 3764,
		"schemaname": "pg_catalog",
		"relname": "pg_ts_template",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 6237,
		"schemaname": "pg_catalog",
		"relname": "pg_publication_namespace",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 3603,
		"schemaname": "pg_catalog",
		"relname": "pg_ts_config_map",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 1213,
		"schemaname": "pg_catalog",
		"relname": "pg_tablespace",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 2608,
		"schemaname": "pg_catalog",
		"relname": "pg_depend",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 2964,
		"schemaname": "pg_catalog",
		"relname": "pg_db_role_setting",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 2995,
		"schemaname": "pg_catalog",
		"relname": "pg_largeobject_metadata",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 4143,
		"schemaname": "pg_toast",
		"relname": "pg_toast_826",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 379413,
		"schemaname": "public",
		"relname": "log_request",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": null,
		"idx_tup_fetch": null,
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 4185,
		"schemaname": "pg_toast",
		"relname": "pg_toast_1213",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 6243,
		"schemaname": "pg_catalog",
		"relname": "pg_parameter_acl",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 1418,
		"schemaname": "pg_catalog",
		"relname": "pg_user_mapping",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 2613,
		"schemaname": "pg_catalog",
		"relname": "pg_largeobject",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 6175,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3456",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 1261,
		"schemaname": "pg_catalog",
		"relname": "pg_auth_members",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 2616,
		"schemaname": "pg_catalog",
		"relname": "pg_opclass",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "8",
		"idx_tup_fetch": "180",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 378629,
		"schemaname": "pg_toast",
		"relname": "pg_toast_378625",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 2617,
		"schemaname": "pg_catalog",
		"relname": "pg_operator",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "4",
		"idx_tup_fetch": "4",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 2838,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2618",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "2",
		"idx_tup_fetch": "5",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 6228,
		"schemaname": "pg_toast",
		"relname": "pg_toast_6106",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 2610,
		"schemaname": "pg_catalog",
		"relname": "pg_index",
		"seq_scan": "1",
		"seq_tup_read": "169",
		"idx_scan": "2",
		"idx_tup_fetch": "1",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 1249,
		"schemaname": "pg_catalog",
		"relname": "pg_attribute",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "3",
		"idx_tup_fetch": "34",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 2600,
		"schemaname": "pg_catalog",
		"relname": "pg_aggregate",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "1",
		"idx_tup_fetch": "1",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 379417,
		"schemaname": "pg_toast",
		"relname": "pg_toast_379413",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 3118,
		"schemaname": "pg_catalog",
		"relname": "pg_foreign_table",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 1259,
		"schemaname": "pg_catalog",
		"relname": "pg_class",
		"seq_scan": "1",
		"seq_tup_read": "434",
		"idx_scan": "9",
		"idx_tup_fetch": "9",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 2966,
		"schemaname": "pg_toast",
		"relname": "pg_toast_2964",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 3350,
		"schemaname": "pg_catalog",
		"relname": "pg_partitioned_table",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 2618,
		"schemaname": "pg_catalog",
		"relname": "pg_rewrite",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "3",
		"idx_tup_fetch": "3",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 4153,
		"schemaname": "pg_toast",
		"relname": "pg_toast_3118",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"relid": 4177,
		"schemaname": "pg_toast",
		"relname": "pg_toast_1262",
		"seq_scan": "0",
		"seq_tup_read": "0",
		"idx_scan": "0",
		"idx_tup_fetch": "0",
		"n_tup_ins": "0",
		"n_tup_upd": "0",
		"n_tup_del": "0",
		"n_tup_hot_upd": "0",
		"n_tup_newpage_upd": "0"
	  }
	],
	"get_proc_name": [
	  {
		"?column?": "public.st_forcepolygoncw"
	  },
	  {
		"?column?": "public._postgis_deprecate"
	  },
	  {
		"?column?": "public.spheroid_in"
	  },
	  {
		"?column?": "public.spheroid_out"
	  },
	  {
		"?column?": "public.geometry_in"
	  },
	  {
		"?column?": "public.geometry_out"
	  },
	  {
		"?column?": "public.geometry_typmod_in"
	  },
	  {
		"?column?": "public.geometry_typmod_out"
	  },
	  {
		"?column?": "public.geometry_analyze"
	  },
	  {
		"?column?": "public.geometry_recv"
	  },
	  {
		"?column?": "public.geometry_send"
	  },
	  {
		"?column?": "public.geometry"
	  },
	  {
		"?column?": "public.st_clusterintersecting"
	  },
	  {
		"?column?": "public.st_clusterwithin"
	  },
	  {
		"?column?": "public.st_polygonize"
	  },
	  {
		"?column?": "public.geometry"
	  },
	  {
		"?column?": "public.point"
	  },
	  {
		"?column?": "public.geometry"
	  },
	  {
		"?column?": "public.path"
	  },
	  {
		"?column?": "public.geometry"
	  },
	  {
		"?column?": "public.polygon"
	  },
	  {
		"?column?": "public.st_x"
	  },
	  {
		"?column?": "public.st_y"
	  },
	  {
		"?column?": "public.st_z"
	  },
	  {
		"?column?": "public.st_m"
	  },
	  {
		"?column?": "public.box3d_in"
	  },
	  {
		"?column?": "public.st_makeline"
	  },
	  {
		"?column?": "public.box3d_out"
	  },
	  {
		"?column?": "public.box2d_in"
	  },
	  {
		"?column?": "public.box2d_out"
	  },
	  {
		"?column?": "public.box2df_in"
	  },
	  {
		"?column?": "public.box2df_out"
	  },
	  {
		"?column?": "public.gidx_in"
	  },
	  {
		"?column?": "public.gidx_out"
	  },
	  {
		"?column?": "public.geometry_lt"
	  },
	  {
		"?column?": "public.geometry_le"
	  },
	  {
		"?column?": "public.geometry_gt"
	  },
	  {
		"?column?": "public.geometry_ge"
	  },
	  {
		"?column?": "public.geometry_eq"
	  },
	  {
		"?column?": "public.geometry_cmp"
	  },
	  {
		"?column?": "public.geometry_sortsupport"
	  },
	  {
		"?column?": "public.geometry_hash"
	  },
	  {
		"?column?": "public.geometry_gist_distance_2d"
	  },
	  {
		"?column?": "public.geometry_gist_consistent_2d"
	  },
	  {
		"?column?": "public.geometry_gist_compress_2d"
	  },
	  {
		"?column?": "public.geometry_gist_penalty_2d"
	  },
	  {
		"?column?": "public.geometry_gist_picksplit_2d"
	  },
	  {
		"?column?": "public.geometry_gist_union_2d"
	  },
	  {
		"?column?": "public.geometry_gist_same_2d"
	  },
	  {
		"?column?": "public.geometry_gist_decompress_2d"
	  },
	  {
		"?column?": "public.geometry_gist_sortsupport_2d"
	  },
	  {
		"?column?": "public.st_forcerhr"
	  },
	  {
		"?column?": "public._postgis_selectivity"
	  },
	  {
		"?column?": "public.postgis_noop"
	  },
	  {
		"?column?": "public._postgis_join_selectivity"
	  },
	  {
		"?column?": "public._postgis_stats"
	  },
	  {
		"?column?": "public.st_forcepolygonccw"
	  },
	  {
		"?column?": "public._postgis_index_extent"
	  },
	  {
		"?column?": "public.gserialized_gist_sel_2d"
	  },
	  {
		"?column?": "public.gserialized_gist_sel_nd"
	  },
	  {
		"?column?": "public.gserialized_gist_joinsel_2d"
	  },
	  {
		"?column?": "public.gserialized_gist_joinsel_nd"
	  },
	  {
		"?column?": "public.geometry_overlaps"
	  },
	  {
		"?column?": "public.geometry_same"
	  },
	  {
		"?column?": "public.geometry_distance_centroid"
	  },
	  {
		"?column?": "public.geometry_distance_box"
	  },
	  {
		"?column?": "public.geometry_contains"
	  },
	  {
		"?column?": "public.geometry_within"
	  },
	  {
		"?column?": "public.geometry_left"
	  },
	  {
		"?column?": "public.geometry_overleft"
	  },
	  {
		"?column?": "public.geometry_below"
	  },
	  {
		"?column?": "public.geometry_overbelow"
	  },
	  {
		"?column?": "public.geometry_overright"
	  },
	  {
		"?column?": "public.geometry_right"
	  },
	  {
		"?column?": "public.geometry_overabove"
	  },
	  {
		"?column?": "public.geometry_above"
	  },
	  {
		"?column?": "public.geometry_gist_consistent_nd"
	  },
	  {
		"?column?": "public.geometry_gist_compress_nd"
	  },
	  {
		"?column?": "public.geometry_gist_penalty_nd"
	  },
	  {
		"?column?": "public.geometry_gist_picksplit_nd"
	  },
	  {
		"?column?": "public.geometry_gist_union_nd"
	  },
	  {
		"?column?": "public.geometry_gist_same_nd"
	  },
	  {
		"?column?": "public.geometry_gist_decompress_nd"
	  },
	  {
		"?column?": "public.geometry_overlaps_nd"
	  },
	  {
		"?column?": "public.geometry_contains_nd"
	  },
	  {
		"?column?": "public.geometry_within_nd"
	  },
	  {
		"?column?": "public.geometry_same_nd"
	  },
	  {
		"?column?": "public.geometry_distance_centroid_nd"
	  },
	  {
		"?column?": "public.geometry_distance_cpa"
	  },
	  {
		"?column?": "public.geometry_gist_distance_nd"
	  },
	  {
		"?column?": "public.st_shiftlongitude"
	  },
	  {
		"?column?": "public.st_wrapx"
	  },
	  {
		"?column?": "public.st_xmin"
	  },
	  {
		"?column?": "public.st_ymin"
	  },
	  {
		"?column?": "public.st_zmin"
	  },
	  {
		"?column?": "public.st_xmax"
	  },
	  {
		"?column?": "public.st_ymax"
	  },
	  {
		"?column?": "public.st_zmax"
	  },
	  {
		"?column?": "public.st_expand"
	  },
	  {
		"?column?": "public.st_expand"
	  },
	  {
		"?column?": "public.postgis_getbbox"
	  },
	  {
		"?column?": "public.st_makebox2d"
	  },
	  {
		"?column?": "public.st_estimatedextent"
	  },
	  {
		"?column?": "public.st_estimatedextent"
	  },
	  {
		"?column?": "public.st_estimatedextent"
	  },
	  {
		"?column?": "public.st_findextent"
	  },
	  {
		"?column?": "public.st_findextent"
	  },
	  {
		"?column?": "public.postgis_addbbox"
	  },
	  {
		"?column?": "public.postgis_dropbbox"
	  },
	  {
		"?column?": "public.postgis_hasbbox"
	  },
	  {
		"?column?": "public.st_quantizecoordinates"
	  },
	  {
		"?column?": "public.st_memsize"
	  },
	  {
		"?column?": "public.st_summary"
	  },
	  {
		"?column?": "public.st_npoints"
	  },
	  {
		"?column?": "public.st_nrings"
	  },
	  {
		"?column?": "public.st_3dlength"
	  },
	  {
		"?column?": "public.st_length2d"
	  },
	  {
		"?column?": "public.st_length"
	  },
	  {
		"?column?": "public.st_lengthspheroid"
	  },
	  {
		"?column?": "public.st_length2dspheroid"
	  },
	  {
		"?column?": "public.st_3dperimeter"
	  },
	  {
		"?column?": "public.st_perimeter2d"
	  },
	  {
		"?column?": "public.st_perimeter"
	  },
	  {
		"?column?": "public.st_area2d"
	  },
	  {
		"?column?": "public.st_area"
	  },
	  {
		"?column?": "public.st_ispolygoncw"
	  },
	  {
		"?column?": "public.st_ispolygonccw"
	  },
	  {
		"?column?": "public.st_distancespheroid"
	  },
	  {
		"?column?": "public.st_distancespheroid"
	  },
	  {
		"?column?": "public.st_distance"
	  },
	  {
		"?column?": "public.st_pointinsidecircle"
	  },
	  {
		"?column?": "public.st_azimuth"
	  },
	  {
		"?column?": "public.st_project"
	  },
	  {
		"?column?": "public.st_project"
	  },
	  {
		"?column?": "public.st_angle"
	  },
	  {
		"?column?": "public.st_lineextend"
	  },
	  {
		"?column?": "public.st_force2d"
	  },
	  {
		"?column?": "public.st_force3dz"
	  },
	  {
		"?column?": "public.st_force3d"
	  },
	  {
		"?column?": "public.st_force3dm"
	  },
	  {
		"?column?": "public.st_force4d"
	  },
	  {
		"?column?": "public.st_forcecollection"
	  },
	  {
		"?column?": "public.st_collectionextract"
	  },
	  {
		"?column?": "public.st_collectionextract"
	  },
	  {
		"?column?": "public.st_collectionhomogenize"
	  },
	  {
		"?column?": "public.st_multi"
	  },
	  {
		"?column?": "public.st_forcecurve"
	  },
	  {
		"?column?": "public.st_forcesfs"
	  },
	  {
		"?column?": "public.st_forcesfs"
	  },
	  {
		"?column?": "public.st_expand"
	  },
	  {
		"?column?": "public.st_expand"
	  },
	  {
		"?column?": "public.st_expand"
	  },
	  {
		"?column?": "public.st_expand"
	  },
	  {
		"?column?": "public.st_envelope"
	  },
	  {
		"?column?": "public.st_boundingdiagonal"
	  },
	  {
		"?column?": "public.st_reverse"
	  },
	  {
		"?column?": "public.st_scroll"
	  },
	  {
		"?column?": "public.postgis_geos_noop"
	  },
	  {
		"?column?": "public.st_normalize"
	  },
	  {
		"?column?": "public.st_zmflag"
	  },
	  {
		"?column?": "public.st_ndims"
	  },
	  {
		"?column?": "public.st_asewkt"
	  },
	  {
		"?column?": "public.st_asewkt"
	  },
	  {
		"?column?": "public.st_astwkb"
	  },
	  {
		"?column?": "public.st_astwkb"
	  },
	  {
		"?column?": "public.st_asewkb"
	  },
	  {
		"?column?": "public.st_ashexewkb"
	  },
	  {
		"?column?": "public.st_ashexewkb"
	  },
	  {
		"?column?": "public.st_asewkb"
	  },
	  {
		"?column?": "public.st_aslatlontext"
	  },
	  {
		"?column?": "public.geomfromewkb"
	  },
	  {
		"?column?": "public.st_geomfromewkb"
	  },
	  {
		"?column?": "public.st_geomfromtwkb"
	  },
	  {
		"?column?": "public.geomfromewkt"
	  },
	  {
		"?column?": "public.st_geomfromewkt"
	  },
	  {
		"?column?": "public.postgis_cache_bbox"
	  },
	  {
		"?column?": "public.st_makepoint"
	  },
	  {
		"?column?": "public.st_makepoint"
	  },
	  {
		"?column?": "public.st_makepoint"
	  },
	  {
		"?column?": "public.st_makepointm"
	  },
	  {
		"?column?": "public.st_3dmakebox"
	  },
	  {
		"?column?": "public.st_makeline"
	  },
	  {
		"?column?": "public.st_linefrommultipoint"
	  },
	  {
		"?column?": "public.st_makeline"
	  },
	  {
		"?column?": "public.st_addpoint"
	  },
	  {
		"?column?": "public.st_scale"
	  },
	  {
		"?column?": "public.st_addpoint"
	  },
	  {
		"?column?": "public.st_removepoint"
	  },
	  {
		"?column?": "public.st_setpoint"
	  },
	  {
		"?column?": "public.st_makeenvelope"
	  },
	  {
		"?column?": "public.st_tileenvelope"
	  },
	  {
		"?column?": "public.st_makepolygon"
	  },
	  {
		"?column?": "public.st_makepolygon"
	  },
	  {
		"?column?": "public.st_buildarea"
	  },
	  {
		"?column?": "public.st_polygonize"
	  },
	  {
		"?column?": "public.st_clusterintersecting"
	  },
	  {
		"?column?": "public.st_clusterwithin"
	  },
	  {
		"?column?": "public.st_clusterdbscan"
	  },
	  {
		"?column?": "public.st_clusterwithinwin"
	  },
	  {
		"?column?": "public.st_clusterintersectingwin"
	  },
	  {
		"?column?": "public.st_linemerge"
	  },
	  {
		"?column?": "public.st_linemerge"
	  },
	  {
		"?column?": "public.st_affine"
	  },
	  {
		"?column?": "public.st_affine"
	  },
	  {
		"?column?": "public.st_rotate"
	  },
	  {
		"?column?": "public.st_rotate"
	  },
	  {
		"?column?": "public.st_rotate"
	  },
	  {
		"?column?": "public.st_rotatez"
	  },
	  {
		"?column?": "public.st_rotatex"
	  },
	  {
		"?column?": "public.st_rotatey"
	  },
	  {
		"?column?": "public.st_translate"
	  },
	  {
		"?column?": "public.st_translate"
	  },
	  {
		"?column?": "public.st_scale"
	  },
	  {
		"?column?": "public.st_scale"
	  },
	  {
		"?column?": "public.st_scale"
	  },
	  {
		"?column?": "public.st_transscale"
	  },
	  {
		"?column?": "public.st_dump"
	  },
	  {
		"?column?": "public.st_dumprings"
	  },
	  {
		"?column?": "public.st_dumppoints"
	  },
	  {
		"?column?": "public.st_dumpsegments"
	  },
	  {
		"?column?": "public.populate_geometry_columns"
	  },
	  {
		"?column?": "public.populate_geometry_columns"
	  },
	  {
		"?column?": "public.addgeometrycolumn"
	  },
	  {
		"?column?": "public.addgeometrycolumn"
	  },
	  {
		"?column?": "public.addgeometrycolumn"
	  },
	  {
		"?column?": "public.dropgeometrycolumn"
	  },
	  {
		"?column?": "public.dropgeometrycolumn"
	  },
	  {
		"?column?": "public.dropgeometrycolumn"
	  },
	  {
		"?column?": "public.dropgeometrytable"
	  },
	  {
		"?column?": "public.st_segmentize"
	  },
	  {
		"?column?": "public.dropgeometrytable"
	  },
	  {
		"?column?": "public.dropgeometrytable"
	  },
	  {
		"?column?": "public.updategeometrysrid"
	  },
	  {
		"?column?": "public.updategeometrysrid"
	  },
	  {
		"?column?": "public.updategeometrysrid"
	  },
	  {
		"?column?": "public.find_srid"
	  },
	  {
		"?column?": "public.get_proj4_from_srid"
	  },
	  {
		"?column?": "public.st_setsrid"
	  },
	  {
		"?column?": "public.st_srid"
	  },
	  {
		"?column?": "public.postgis_transform_geometry"
	  },
	  {
		"?column?": "public.postgis_srs_codes"
	  },
	  {
		"?column?": "public.postgis_srs"
	  },
	  {
		"?column?": "public.postgis_srs_all"
	  },
	  {
		"?column?": "public.postgis_srs_search"
	  },
	  {
		"?column?": "public.st_transform"
	  },
	  {
		"?column?": "public.st_transform"
	  },
	  {
		"?column?": "public.st_transform"
	  },
	  {
		"?column?": "public.st_transform"
	  },
	  {
		"?column?": "public.postgis_transform_pipeline_geometry"
	  },
	  {
		"?column?": "public.st_transformpipeline"
	  },
	  {
		"?column?": "public.st_inversetransformpipeline"
	  },
	  {
		"?column?": "public.postgis_version"
	  },
	  {
		"?column?": "public.postgis_liblwgeom_version"
	  },
	  {
		"?column?": "public.postgis_proj_version"
	  },
	  {
		"?column?": "public.postgis_wagyu_version"
	  },
	  {
		"?column?": "public.postgis_scripts_installed"
	  },
	  {
		"?column?": "public.postgis_lib_version"
	  },
	  {
		"?column?": "public.postgis_scripts_released"
	  },
	  {
		"?column?": "public.postgis_geos_version"
	  },
	  {
		"?column?": "public.postgis_geos_compiled_version"
	  },
	  {
		"?column?": "public.postgis_lib_revision"
	  },
	  {
		"?column?": "public.postgis_svn_version"
	  },
	  {
		"?column?": "public.postgis_libxml_version"
	  },
	  {
		"?column?": "public.postgis_scripts_build_date"
	  },
	  {
		"?column?": "public.postgis_lib_build_date"
	  },
	  {
		"?column?": "public._postgis_scripts_pgsql_version"
	  },
	  {
		"?column?": "public._postgis_pgsql_version"
	  },
	  {
		"?column?": "public.postgis_extensions_upgrade"
	  },
	  {
		"?column?": "public.st_lineinterpolatepoint"
	  },
	  {
		"?column?": "public.st_lineinterpolatepoints"
	  },
	  {
		"?column?": "public.st_linesubstring"
	  },
	  {
		"?column?": "public.st_linelocatepoint"
	  },
	  {
		"?column?": "public.st_addmeasure"
	  },
	  {
		"?column?": "public.st_closestpointofapproach"
	  },
	  {
		"?column?": "public.postgis_full_version"
	  },
	  {
		"?column?": "public.box2d"
	  },
	  {
		"?column?": "public.box3d"
	  },
	  {
		"?column?": "public.box"
	  },
	  {
		"?column?": "public.box2d"
	  },
	  {
		"?column?": "public.box3d"
	  },
	  {
		"?column?": "public.box"
	  },
	  {
		"?column?": "public.text"
	  },
	  {
		"?column?": "public.box3dtobox"
	  },
	  {
		"?column?": "public.geometry"
	  },
	  {
		"?column?": "public.geometry"
	  },
	  {
		"?column?": "public.geometry"
	  },
	  {
		"?column?": "public.geometry"
	  },
	  {
		"?column?": "public.bytea"
	  },
	  {
		"?column?": "public.st_simplify"
	  },
	  {
		"?column?": "public.st_simplify"
	  },
	  {
		"?column?": "public.st_simplifyvw"
	  },
	  {
		"?column?": "public.st_seteffectivearea"
	  },
	  {
		"?column?": "public.st_filterbym"
	  },
	  {
		"?column?": "public.st_chaikinsmoothing"
	  },
	  {
		"?column?": "public.st_snaptogrid"
	  },
	  {
		"?column?": "public.st_snaptogrid"
	  },
	  {
		"?column?": "public.st_snaptogrid"
	  },
	  {
		"?column?": "public.st_snaptogrid"
	  },
	  {
		"?column?": "public.st_distancecpa"
	  },
	  {
		"?column?": "public.st_cpawithin"
	  },
	  {
		"?column?": "public.st_isvalidtrajectory"
	  },
	  {
		"?column?": "public.st_intersection"
	  },
	  {
		"?column?": "public.st_buffer"
	  },
	  {
		"?column?": "public.st_buffer"
	  },
	  {
		"?column?": "public.st_minimumboundingradius"
	  },
	  {
		"?column?": "public.st_minimumboundingcircle"
	  },
	  {
		"?column?": "public.st_orientedenvelope"
	  },
	  {
		"?column?": "public.st_offsetcurve"
	  },
	  {
		"?column?": "public.st_generatepoints"
	  },
	  {
		"?column?": "public.st_generatepoints"
	  },
	  {
		"?column?": "public.st_convexhull"
	  },
	  {
		"?column?": "public.st_simplifypreservetopology"
	  },
	  {
		"?column?": "public.st_isvalidreason"
	  },
	  {
		"?column?": "public.st_isvaliddetail"
	  },
	  {
		"?column?": "public.st_isvalidreason"
	  },
	  {
		"?column?": "public.st_isvalid"
	  },
	  {
		"?column?": "public.st_hausdorffdistance"
	  },
	  {
		"?column?": "public.st_hausdorffdistance"
	  },
	  {
		"?column?": "public.st_frechetdistance"
	  },
	  {
		"?column?": "public.st_maximuminscribedcircle"
	  },
	  {
		"?column?": "public.st_largestemptycircle"
	  },
	  {
		"?column?": "public.st_union"
	  },
	  {
		"?column?": "public.st_difference"
	  },
	  {
		"?column?": "public.st_boundary"
	  },
	  {
		"?column?": "public.st_points"
	  },
	  {
		"?column?": "public.st_symdifference"
	  },
	  {
		"?column?": "public.st_symmetricdifference"
	  },
	  {
		"?column?": "public.st_union"
	  },
	  {
		"?column?": "public.st_union"
	  },
	  {
		"?column?": "public.st_unaryunion"
	  },
	  {
		"?column?": "public.st_removerepeatedpoints"
	  },
	  {
		"?column?": "public.st_clipbybox2d"
	  },
	  {
		"?column?": "public.st_subdivide"
	  },
	  {
		"?column?": "public.st_reduceprecision"
	  },
	  {
		"?column?": "public.st_makevalid"
	  },
	  {
		"?column?": "public.st_makevalid"
	  },
	  {
		"?column?": "public.st_cleangeometry"
	  },
	  {
		"?column?": "public.st_split"
	  },
	  {
		"?column?": "public.st_sharedpaths"
	  },
	  {
		"?column?": "public.st_snap"
	  },
	  {
		"?column?": "public.st_relatematch"
	  },
	  {
		"?column?": "public.st_node"
	  },
	  {
		"?column?": "public.st_delaunaytriangles"
	  },
	  {
		"?column?": "public.st_triangulatepolygon"
	  },
	  {
		"?column?": "public.st_union"
	  },
	  {
		"?column?": "public.st_collect"
	  },
	  {
		"?column?": "public._st_voronoi"
	  },
	  {
		"?column?": "public.st_voronoipolygons"
	  },
	  {
		"?column?": "public.st_voronoilines"
	  },
	  {
		"?column?": "public.st_combinebbox"
	  },
	  {
		"?column?": "public.st_combinebbox"
	  },
	  {
		"?column?": "public.st_combinebbox"
	  },
	  {
		"?column?": "public.st_extent"
	  },
	  {
		"?column?": "public.st_3dextent"
	  },
	  {
		"?column?": "public.st_collect"
	  },
	  {
		"?column?": "public.st_memcollect"
	  },
	  {
		"?column?": "public.st_collect"
	  },
	  {
		"?column?": "public.st_memunion"
	  },
	  {
		"?column?": "public.pgis_geometry_accum_transfn"
	  },
	  {
		"?column?": "public.pgis_geometry_accum_transfn"
	  },
	  {
		"?column?": "public.pgis_geometry_accum_transfn"
	  },
	  {
		"?column?": "public.pgis_geometry_collect_finalfn"
	  },
	  {
		"?column?": "public.pgis_geometry_polygonize_finalfn"
	  },
	  {
		"?column?": "public.pgis_geometry_clusterintersecting_finalfn"
	  },
	  {
		"?column?": "public.pgis_geometry_clusterwithin_finalfn"
	  },
	  {
		"?column?": "public.pgis_geometry_makeline_finalfn"
	  },
	  {
		"?column?": "public.pgis_geometry_coverageunion_finalfn"
	  },
	  {
		"?column?": "public.pgis_geometry_union_parallel_transfn"
	  },
	  {
		"?column?": "public.pgis_geometry_union_parallel_transfn"
	  },
	  {
		"?column?": "public.pgis_geometry_union_parallel_combinefn"
	  },
	  {
		"?column?": "public.pgis_geometry_union_parallel_serialfn"
	  },
	  {
		"?column?": "public.pgis_geometry_union_parallel_deserialfn"
	  },
	  {
		"?column?": "public.pgis_geometry_union_parallel_finalfn"
	  },
	  {
		"?column?": "public.st_union"
	  },
	  {
		"?column?": "public.st_coverageunion"
	  },
	  {
		"?column?": "public.st_coverageunion"
	  },
	  {
		"?column?": "public.st_coveragesimplify"
	  },
	  {
		"?column?": "public.st_coverageinvalidedges"
	  },
	  {
		"?column?": "public.st_clusterkmeans"
	  },
	  {
		"?column?": "public.st_relate"
	  },
	  {
		"?column?": "public.st_relate"
	  },
	  {
		"?column?": "public.st_relate"
	  },
	  {
		"?column?": "public.st_disjoint"
	  },
	  {
		"?column?": "public._st_linecrossingdirection"
	  },
	  {
		"?column?": "public._st_dwithin"
	  },
	  {
		"?column?": "public._st_touches"
	  },
	  {
		"?column?": "public._st_intersects"
	  },
	  {
		"?column?": "public._st_crosses"
	  },
	  {
		"?column?": "public._st_contains"
	  },
	  {
		"?column?": "public._st_containsproperly"
	  },
	  {
		"?column?": "public._st_covers"
	  },
	  {
		"?column?": "public._st_coveredby"
	  },
	  {
		"?column?": "public._st_within"
	  },
	  {
		"?column?": "public._st_overlaps"
	  },
	  {
		"?column?": "public._st_dfullywithin"
	  },
	  {
		"?column?": "public._st_3ddwithin"
	  },
	  {
		"?column?": "public._st_3ddfullywithin"
	  },
	  {
		"?column?": "public._st_3dintersects"
	  },
	  {
		"?column?": "public._st_orderingequals"
	  },
	  {
		"?column?": "public._st_equals"
	  },
	  {
		"?column?": "public.postgis_index_supportfn"
	  },
	  {
		"?column?": "public.st_linecrossingdirection"
	  },
	  {
		"?column?": "public.st_dwithin"
	  },
	  {
		"?column?": "public.st_touches"
	  },
	  {
		"?column?": "public.st_intersects"
	  },
	  {
		"?column?": "public.st_crosses"
	  },
	  {
		"?column?": "public.st_contains"
	  },
	  {
		"?column?": "public.st_containsproperly"
	  },
	  {
		"?column?": "public.st_within"
	  },
	  {
		"?column?": "public.st_covers"
	  },
	  {
		"?column?": "public.st_coveredby"
	  },
	  {
		"?column?": "public.st_overlaps"
	  },
	  {
		"?column?": "public.st_dfullywithin"
	  },
	  {
		"?column?": "public.st_3ddwithin"
	  },
	  {
		"?column?": "public.st_3ddfullywithin"
	  },
	  {
		"?column?": "public.st_3dintersects"
	  },
	  {
		"?column?": "public.st_orderingequals"
	  },
	  {
		"?column?": "public.st_equals"
	  },
	  {
		"?column?": "public.st_isvalid"
	  },
	  {
		"?column?": "public.st_minimumclearance"
	  },
	  {
		"?column?": "public.st_minimumclearanceline"
	  },
	  {
		"?column?": "public.st_centroid"
	  },
	  {
		"?column?": "public.st_geometricmedian"
	  },
	  {
		"?column?": "public.st_isring"
	  },
	  {
		"?column?": "public.st_pointonsurface"
	  },
	  {
		"?column?": "public.st_issimple"
	  },
	  {
		"?column?": "public.st_iscollection"
	  },
	  {
		"?column?": "public.equals"
	  },
	  {
		"?column?": "public._st_geomfromgml"
	  },
	  {
		"?column?": "public.st_geomfromgml"
	  },
	  {
		"?column?": "public.st_geomfromgml"
	  },
	  {
		"?column?": "public.st_gmltosql"
	  },
	  {
		"?column?": "public.st_gmltosql"
	  },
	  {
		"?column?": "public.st_geomfromkml"
	  },
	  {
		"?column?": "public.st_geomfrommarc21"
	  },
	  {
		"?column?": "public.st_asmarc21"
	  },
	  {
		"?column?": "public.st_geomfromgeojson"
	  },
	  {
		"?column?": "public.st_geomfromgeojson"
	  },
	  {
		"?column?": "public.st_geomfromgeojson"
	  },
	  {
		"?column?": "public.postgis_libjson_version"
	  },
	  {
		"?column?": "public.st_linefromencodedpolyline"
	  },
	  {
		"?column?": "public.st_asencodedpolyline"
	  },
	  {
		"?column?": "public.st_assvg"
	  },
	  {
		"?column?": "public._st_asgml"
	  },
	  {
		"?column?": "public.st_asgml"
	  },
	  {
		"?column?": "public.st_asgml"
	  },
	  {
		"?column?": "public.st_askml"
	  },
	  {
		"?column?": "public.st_asgeojson"
	  },
	  {
		"?column?": "public.st_asgeojson"
	  },
	  {
		"?column?": "public.json"
	  },
	  {
		"?column?": "public.jsonb"
	  },
	  {
		"?column?": "public.pgis_asmvt_transfn"
	  },
	  {
		"?column?": "public.pgis_asmvt_transfn"
	  },
	  {
		"?column?": "public.pgis_asmvt_transfn"
	  },
	  {
		"?column?": "public.pgis_asmvt_transfn"
	  },
	  {
		"?column?": "public.pgis_asmvt_transfn"
	  },
	  {
		"?column?": "public.pgis_asmvt_finalfn"
	  },
	  {
		"?column?": "public.pgis_asmvt_combinefn"
	  },
	  {
		"?column?": "public.pgis_asmvt_serialfn"
	  },
	  {
		"?column?": "public.pgis_asmvt_deserialfn"
	  },
	  {
		"?column?": "public.st_asmvt"
	  },
	  {
		"?column?": "public.st_asmvt"
	  },
	  {
		"?column?": "public.st_asmvt"
	  },
	  {
		"?column?": "public.st_asmvt"
	  },
	  {
		"?column?": "public.st_asmvt"
	  },
	  {
		"?column?": "public.st_asmvtgeom"
	  },
	  {
		"?column?": "public.postgis_libprotobuf_version"
	  },
	  {
		"?column?": "public.pgis_asgeobuf_transfn"
	  },
	  {
		"?column?": "public.pgis_asgeobuf_transfn"
	  },
	  {
		"?column?": "public.pgis_asgeobuf_finalfn"
	  },
	  {
		"?column?": "public.st_asgeobuf"
	  },
	  {
		"?column?": "public.st_asgeobuf"
	  },
	  {
		"?column?": "public.pgis_asflatgeobuf_transfn"
	  },
	  {
		"?column?": "public.pgis_asflatgeobuf_transfn"
	  },
	  {
		"?column?": "public.pgis_asflatgeobuf_transfn"
	  },
	  {
		"?column?": "public.pgis_asflatgeobuf_finalfn"
	  },
	  {
		"?column?": "public.st_asflatgeobuf"
	  },
	  {
		"?column?": "public.st_asflatgeobuf"
	  },
	  {
		"?column?": "public.st_asflatgeobuf"
	  },
	  {
		"?column?": "public.st_fromflatgeobuftotable"
	  },
	  {
		"?column?": "public.st_fromflatgeobuf"
	  },
	  {
		"?column?": "public.st_geohash"
	  },
	  {
		"?column?": "public._st_sortablehash"
	  },
	  {
		"?column?": "public.st_box2dfromgeohash"
	  },
	  {
		"?column?": "public.st_pointfromgeohash"
	  },
	  {
		"?column?": "public.st_geomfromgeohash"
	  },
	  {
		"?column?": "public.st_numpoints"
	  },
	  {
		"?column?": "public.st_numgeometries"
	  },
	  {
		"?column?": "public.st_geometryn"
	  },
	  {
		"?column?": "public.st_dimension"
	  },
	  {
		"?column?": "public.st_exteriorring"
	  },
	  {
		"?column?": "public.st_numinteriorrings"
	  },
	  {
		"?column?": "public.st_numinteriorring"
	  },
	  {
		"?column?": "public.st_interiorringn"
	  },
	  {
		"?column?": "public.geometrytype"
	  },
	  {
		"?column?": "public.st_geometrytype"
	  },
	  {
		"?column?": "public.st_pointn"
	  },
	  {
		"?column?": "public.st_numpatches"
	  },
	  {
		"?column?": "public.st_patchn"
	  },
	  {
		"?column?": "public.st_startpoint"
	  },
	  {
		"?column?": "public.st_endpoint"
	  },
	  {
		"?column?": "public.st_isclosed"
	  },
	  {
		"?column?": "public.st_isempty"
	  },
	  {
		"?column?": "public.st_asbinary"
	  },
	  {
		"?column?": "public.st_asbinary"
	  },
	  {
		"?column?": "public.st_astext"
	  },
	  {
		"?column?": "public.st_astext"
	  },
	  {
		"?column?": "public.st_geometryfromtext"
	  },
	  {
		"?column?": "public.st_geometryfromtext"
	  },
	  {
		"?column?": "public.st_geomfromtext"
	  },
	  {
		"?column?": "public.st_geomfromtext"
	  },
	  {
		"?column?": "public.st_wkttosql"
	  },
	  {
		"?column?": "public.st_pointfromtext"
	  },
	  {
		"?column?": "public.st_pointfromtext"
	  },
	  {
		"?column?": "public.st_linefromtext"
	  },
	  {
		"?column?": "public.st_linefromtext"
	  },
	  {
		"?column?": "public.st_polyfromtext"
	  },
	  {
		"?column?": "public.st_polyfromtext"
	  },
	  {
		"?column?": "public.st_polygonfromtext"
	  },
	  {
		"?column?": "public.st_polygonfromtext"
	  },
	  {
		"?column?": "public.st_mlinefromtext"
	  },
	  {
		"?column?": "public.st_mlinefromtext"
	  },
	  {
		"?column?": "public.st_multilinestringfromtext"
	  },
	  {
		"?column?": "public.st_multilinestringfromtext"
	  },
	  {
		"?column?": "public.st_mpointfromtext"
	  },
	  {
		"?column?": "public.st_mpointfromtext"
	  },
	  {
		"?column?": "public.st_multipointfromtext"
	  },
	  {
		"?column?": "public.st_mpolyfromtext"
	  },
	  {
		"?column?": "public.st_mpolyfromtext"
	  },
	  {
		"?column?": "public.st_multipolygonfromtext"
	  },
	  {
		"?column?": "public.st_multipolygonfromtext"
	  },
	  {
		"?column?": "public.st_geomcollfromtext"
	  },
	  {
		"?column?": "public.st_geomcollfromtext"
	  },
	  {
		"?column?": "public.st_geomfromwkb"
	  },
	  {
		"?column?": "public.st_geomfromwkb"
	  },
	  {
		"?column?": "public.st_pointfromwkb"
	  },
	  {
		"?column?": "public.st_pointfromwkb"
	  },
	  {
		"?column?": "public.st_linefromwkb"
	  },
	  {
		"?column?": "public.st_linefromwkb"
	  },
	  {
		"?column?": "public.st_linestringfromwkb"
	  },
	  {
		"?column?": "public.st_linestringfromwkb"
	  },
	  {
		"?column?": "public.st_polyfromwkb"
	  },
	  {
		"?column?": "public.st_polyfromwkb"
	  },
	  {
		"?column?": "public.st_polygonfromwkb"
	  },
	  {
		"?column?": "public.st_polygonfromwkb"
	  },
	  {
		"?column?": "public.st_mpointfromwkb"
	  },
	  {
		"?column?": "public.st_mpointfromwkb"
	  },
	  {
		"?column?": "public.st_multipointfromwkb"
	  },
	  {
		"?column?": "public.geography_analyze"
	  },
	  {
		"?column?": "public.st_multipointfromwkb"
	  },
	  {
		"?column?": "public.st_multilinefromwkb"
	  },
	  {
		"?column?": "public.st_mlinefromwkb"
	  },
	  {
		"?column?": "public.st_mlinefromwkb"
	  },
	  {
		"?column?": "public.st_mpolyfromwkb"
	  },
	  {
		"?column?": "public.st_mpolyfromwkb"
	  },
	  {
		"?column?": "public.st_multipolyfromwkb"
	  },
	  {
		"?column?": "public.st_multipolyfromwkb"
	  },
	  {
		"?column?": "public.st_geomcollfromwkb"
	  },
	  {
		"?column?": "public.st_geomcollfromwkb"
	  },
	  {
		"?column?": "public._st_maxdistance"
	  },
	  {
		"?column?": "public.st_maxdistance"
	  },
	  {
		"?column?": "public.st_closestpoint"
	  },
	  {
		"?column?": "public.st_shortestline"
	  },
	  {
		"?column?": "public._st_longestline"
	  },
	  {
		"?column?": "public.st_longestline"
	  },
	  {
		"?column?": "public.st_swapordinates"
	  },
	  {
		"?column?": "public.st_flipcoordinates"
	  },
	  {
		"?column?": "public.st_bdpolyfromtext"
	  },
	  {
		"?column?": "public.st_bdmpolyfromtext"
	  },
	  {
		"?column?": "public.unlockrows"
	  },
	  {
		"?column?": "public.geography"
	  },
	  {
		"?column?": "public.geography"
	  },
	  {
		"?column?": "public.bytea"
	  },
	  {
		"?column?": "public.st_astext"
	  },
	  {
		"?column?": "public.st_astext"
	  },
	  {
		"?column?": "public.lockrow"
	  },
	  {
		"?column?": "public.lockrow"
	  },
	  {
		"?column?": "public.lockrow"
	  },
	  {
		"?column?": "public.lockrow"
	  },
	  {
		"?column?": "public.addauth"
	  },
	  {
		"?column?": "public.checkauth"
	  },
	  {
		"?column?": "public.checkauth"
	  },
	  {
		"?column?": "public.checkauthtrigger"
	  },
	  {
		"?column?": "public.gettransactionid"
	  },
	  {
		"?column?": "public.enablelongtransactions"
	  },
	  {
		"?column?": "public.longtransactionsenabled"
	  },
	  {
		"?column?": "public.disablelongtransactions"
	  },
	  {
		"?column?": "public.geography_typmod_in"
	  },
	  {
		"?column?": "public.geography_typmod_out"
	  },
	  {
		"?column?": "public.geography_in"
	  },
	  {
		"?column?": "public.geography_out"
	  },
	  {
		"?column?": "public.geography_recv"
	  },
	  {
		"?column?": "public.geography_send"
	  },
	  {
		"?column?": "public.st_astext"
	  },
	  {
		"?column?": "public.st_geographyfromtext"
	  },
	  {
		"?column?": "public.st_geogfromtext"
	  },
	  {
		"?column?": "public.st_geogfromwkb"
	  },
	  {
		"?column?": "public.postgis_typmod_dims"
	  },
	  {
		"?column?": "public.postgis_typmod_srid"
	  },
	  {
		"?column?": "public.postgis_typmod_type"
	  },
	  {
		"?column?": "public.geography"
	  },
	  {
		"?column?": "public.geometry"
	  },
	  {
		"?column?": "public.geography_gist_consistent"
	  },
	  {
		"?column?": "public.geography_gist_compress"
	  },
	  {
		"?column?": "public.geography_gist_penalty"
	  },
	  {
		"?column?": "public.geography_gist_picksplit"
	  },
	  {
		"?column?": "public.geography_gist_union"
	  },
	  {
		"?column?": "public.geography_gist_same"
	  },
	  {
		"?column?": "public.geography_gist_decompress"
	  },
	  {
		"?column?": "public.geography_overlaps"
	  },
	  {
		"?column?": "public.geography_distance_knn"
	  },
	  {
		"?column?": "public.geography_gist_distance"
	  },
	  {
		"?column?": "public.overlaps_geog"
	  },
	  {
		"?column?": "public.overlaps_geog"
	  },
	  {
		"?column?": "public.overlaps_geog"
	  },
	  {
		"?column?": "public.geog_brin_inclusion_add_value"
	  },
	  {
		"?column?": "public.geography_lt"
	  },
	  {
		"?column?": "public.geography_le"
	  },
	  {
		"?column?": "public.geography_gt"
	  },
	  {
		"?column?": "public.geography_ge"
	  },
	  {
		"?column?": "public.geography_eq"
	  },
	  {
		"?column?": "public.geography_cmp"
	  },
	  {
		"?column?": "public.st_assvg"
	  },
	  {
		"?column?": "public.st_assvg"
	  },
	  {
		"?column?": "public.st_project"
	  },
	  {
		"?column?": "public.st_azimuth"
	  },
	  {
		"?column?": "public.st_buffer"
	  },
	  {
		"?column?": "public.st_asgml"
	  },
	  {
		"?column?": "public.st_asgml"
	  },
	  {
		"?column?": "public.st_asgml"
	  },
	  {
		"?column?": "public.st_askml"
	  },
	  {
		"?column?": "public.st_askml"
	  },
	  {
		"?column?": "public.st_asgeojson"
	  },
	  {
		"?column?": "public.st_asgeojson"
	  },
	  {
		"?column?": "public.st_distance"
	  },
	  {
		"?column?": "public.st_distance"
	  },
	  {
		"?column?": "public._st_expand"
	  },
	  {
		"?column?": "public._st_distanceuncached"
	  },
	  {
		"?column?": "public._st_distanceuncached"
	  },
	  {
		"?column?": "public._st_distanceuncached"
	  },
	  {
		"?column?": "public._st_distancetree"
	  },
	  {
		"?column?": "public._st_distancetree"
	  },
	  {
		"?column?": "public._st_dwithinuncached"
	  },
	  {
		"?column?": "public._st_dwithinuncached"
	  },
	  {
		"?column?": "public.st_area"
	  },
	  {
		"?column?": "public.st_area"
	  },
	  {
		"?column?": "public.st_length"
	  },
	  {
		"?column?": "public.st_length"
	  },
	  {
		"?column?": "public.st_project"
	  },
	  {
		"?column?": "public.st_perimeter"
	  },
	  {
		"?column?": "public._st_pointoutside"
	  },
	  {
		"?column?": "public.st_segmentize"
	  },
	  {
		"?column?": "public._st_bestsrid"
	  },
	  {
		"?column?": "public._st_bestsrid"
	  },
	  {
		"?column?": "public.st_asbinary"
	  },
	  {
		"?column?": "public.st_asbinary"
	  },
	  {
		"?column?": "public.st_asewkt"
	  },
	  {
		"?column?": "public.st_asewkt"
	  },
	  {
		"?column?": "public.st_asewkt"
	  },
	  {
		"?column?": "public.geometrytype"
	  },
	  {
		"?column?": "public.st_summary"
	  },
	  {
		"?column?": "public.st_geohash"
	  },
	  {
		"?column?": "public.st_srid"
	  },
	  {
		"?column?": "public.st_setsrid"
	  },
	  {
		"?column?": "public.st_centroid"
	  },
	  {
		"?column?": "public.st_centroid"
	  },
	  {
		"?column?": "public._st_covers"
	  },
	  {
		"?column?": "public._st_dwithin"
	  },
	  {
		"?column?": "public._st_coveredby"
	  },
	  {
		"?column?": "public.st_covers"
	  },
	  {
		"?column?": "public.st_dwithin"
	  },
	  {
		"?column?": "public.st_coveredby"
	  },
	  {
		"?column?": "public.st_intersects"
	  },
	  {
		"?column?": "public.st_buffer"
	  },
	  {
		"?column?": "public.st_buffer"
	  },
	  {
		"?column?": "public.st_buffer"
	  },
	  {
		"?column?": "public.st_buffer"
	  },
	  {
		"?column?": "public.st_buffer"
	  },
	  {
		"?column?": "public.st_intersection"
	  },
	  {
		"?column?": "public.st_intersection"
	  },
	  {
		"?column?": "public.st_covers"
	  },
	  {
		"?column?": "public.st_coveredby"
	  },
	  {
		"?column?": "public.st_dwithin"
	  },
	  {
		"?column?": "public.st_intersects"
	  },
	  {
		"?column?": "public.st_closestpoint"
	  },
	  {
		"?column?": "public.st_closestpoint"
	  },
	  {
		"?column?": "public.st_shortestline"
	  },
	  {
		"?column?": "public.st_shortestline"
	  },
	  {
		"?column?": "public.st_linesubstring"
	  },
	  {
		"?column?": "public.st_linesubstring"
	  },
	  {
		"?column?": "public.st_linelocatepoint"
	  },
	  {
		"?column?": "public.st_linelocatepoint"
	  },
	  {
		"?column?": "public.st_lineinterpolatepoints"
	  },
	  {
		"?column?": "public.st_lineinterpolatepoints"
	  },
	  {
		"?column?": "public.st_lineinterpolatepoint"
	  },
	  {
		"?column?": "public.st_lineinterpolatepoint"
	  },
	  {
		"?column?": "public.st_distancesphere"
	  },
	  {
		"?column?": "public.st_distancesphere"
	  },
	  {
		"?column?": "public.postgis_type_name"
	  },
	  {
		"?column?": "public.crosstab2"
	  },
	  {
		"?column?": "public.postgis_constraint_srid"
	  },
	  {
		"?column?": "public.postgis_constraint_dims"
	  },
	  {
		"?column?": "public.postgis_constraint_type"
	  },
	  {
		"?column?": "public.st_3ddistance"
	  },
	  {
		"?column?": "public.st_3dmaxdistance"
	  },
	  {
		"?column?": "public.st_3dclosestpoint"
	  },
	  {
		"?column?": "public.st_3dshortestline"
	  },
	  {
		"?column?": "public.st_3dlongestline"
	  },
	  {
		"?column?": "public.st_coorddim"
	  },
	  {
		"?column?": "public.st_curvetoline"
	  },
	  {
		"?column?": "public.st_hasarc"
	  },
	  {
		"?column?": "public.st_linetocurve"
	  },
	  {
		"?column?": "public.st_point"
	  },
	  {
		"?column?": "public.st_point"
	  },
	  {
		"?column?": "public.st_pointz"
	  },
	  {
		"?column?": "public.st_pointm"
	  },
	  {
		"?column?": "public.st_pointzm"
	  },
	  {
		"?column?": "public.st_polygon"
	  },
	  {
		"?column?": "public.st_wkbtosql"
	  },
	  {
		"?column?": "public.st_locatebetween"
	  },
	  {
		"?column?": "public.st_locatealong"
	  },
	  {
		"?column?": "public.st_locatebetweenelevations"
	  },
	  {
		"?column?": "public.st_interpolatepoint"
	  },
	  {
		"?column?": "public.st_hexagon"
	  },
	  {
		"?column?": "public.st_square"
	  },
	  {
		"?column?": "public.st_hexagongrid"
	  },
	  {
		"?column?": "public.st_squaregrid"
	  },
	  {
		"?column?": "public.contains_2d"
	  },
	  {
		"?column?": "public.is_contained_2d"
	  },
	  {
		"?column?": "public.overlaps_2d"
	  },
	  {
		"?column?": "public.overlaps_2d"
	  },
	  {
		"?column?": "public.contains_2d"
	  },
	  {
		"?column?": "public.is_contained_2d"
	  },
	  {
		"?column?": "public.contains_2d"
	  },
	  {
		"?column?": "public.is_contained_2d"
	  },
	  {
		"?column?": "public.overlaps_2d"
	  },
	  {
		"?column?": "public.overlaps_nd"
	  },
	  {
		"?column?": "public.overlaps_nd"
	  },
	  {
		"?column?": "public.overlaps_nd"
	  },
	  {
		"?column?": "public.geom2d_brin_inclusion_add_value"
	  },
	  {
		"?column?": "public.geom3d_brin_inclusion_add_value"
	  },
	  {
		"?column?": "public.geom4d_brin_inclusion_add_value"
	  },
	  {
		"?column?": "public.st_simplifypolygonhull"
	  },
	  {
		"?column?": "public.st_concavehull"
	  },
	  {
		"?column?": "public._st_asx3d"
	  },
	  {
		"?column?": "public.st_asx3d"
	  },
	  {
		"?column?": "public.st_angle"
	  },
	  {
		"?column?": "public.st_3dlineinterpolatepoint"
	  },
	  {
		"?column?": "public.geometry_spgist_config_2d"
	  },
	  {
		"?column?": "public.geometry_spgist_choose_2d"
	  },
	  {
		"?column?": "public.geometry_spgist_picksplit_2d"
	  },
	  {
		"?column?": "public.geometry_spgist_inner_consistent_2d"
	  },
	  {
		"?column?": "public.geometry_spgist_leaf_consistent_2d"
	  },
	  {
		"?column?": "public.geometry_spgist_compress_2d"
	  },
	  {
		"?column?": "public.geometry_overlaps_3d"
	  },
	  {
		"?column?": "public.geometry_contains_3d"
	  },
	  {
		"?column?": "public.geometry_contained_3d"
	  },
	  {
		"?column?": "public.geometry_same_3d"
	  },
	  {
		"?column?": "public.geometry_spgist_config_3d"
	  },
	  {
		"?column?": "public.geometry_spgist_choose_3d"
	  },
	  {
		"?column?": "public.geometry_spgist_picksplit_3d"
	  },
	  {
		"?column?": "public.geometry_spgist_inner_consistent_3d"
	  },
	  {
		"?column?": "public.geometry_spgist_leaf_consistent_3d"
	  },
	  {
		"?column?": "public.geometry_spgist_compress_3d"
	  },
	  {
		"?column?": "public.geometry_spgist_config_nd"
	  },
	  {
		"?column?": "public.geometry_spgist_choose_nd"
	  },
	  {
		"?column?": "public.geometry_spgist_picksplit_nd"
	  },
	  {
		"?column?": "public.geometry_spgist_inner_consistent_nd"
	  },
	  {
		"?column?": "public.geometry_spgist_leaf_consistent_nd"
	  },
	  {
		"?column?": "public.geometry_spgist_compress_nd"
	  },
	  {
		"?column?": "public.geography_spgist_config_nd"
	  },
	  {
		"?column?": "public.geography_spgist_choose_nd"
	  },
	  {
		"?column?": "public.geography_spgist_picksplit_nd"
	  },
	  {
		"?column?": "public.geography_spgist_inner_consistent_nd"
	  },
	  {
		"?column?": "public.geography_spgist_leaf_consistent_nd"
	  },
	  {
		"?column?": "public.geography_spgist_compress_nd"
	  },
	  {
		"?column?": "public.st_letters"
	  },
	  {
		"?column?": "public.normal_rand"
	  },
	  {
		"?column?": "public.crosstab"
	  },
	  {
		"?column?": "public.crosstab3"
	  },
	  {
		"?column?": "public.crosstab4"
	  },
	  {
		"?column?": "public.crosstab"
	  },
	  {
		"?column?": "public.crosstab"
	  },
	  {
		"?column?": "public.connectby"
	  },
	  {
		"?column?": "public.connectby"
	  },
	  {
		"?column?": "public.connectby"
	  },
	  {
		"?column?": "public.connectby"
	  }
	],
	"get_proc_count": [
	  {
		"count": "787"
	  }
	],
	"get_triggers": [
	  {
		"count": "0"
	  }
	],
	"dump_unusedindexes": [],
	"dump_redundantindexes": [],
	"dump_invalidindexes": [],
	"dump_hashindexes": [],
	"dump_count_indexes": [
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"current_database": "admin",
		"schemaname": "public",
		"relname": "log_request",
		"number_of_indexes": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"current_database": "admin",
		"schemaname": "public",
		"relname": "config",
		"number_of_indexes": "0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"current_database": "admin",
		"schemaname": "public",
		"relname": "spatial_ref_sys",
		"number_of_indexes": "1"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"current_database": "admin",
		"schemaname": "public",
		"relname": "user",
		"number_of_indexes": "1"
	  }
	],
	"dump_unusedtrigfunc": [
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"current_database": "admin",
		"nspname": "public",
		"proname": "postgis_cache_bbox"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"current_database": "admin",
		"nspname": "public",
		"proname": "checkauthtrigger"
	  }
	],
	"dump_pgsettings": [
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Options pour le développeur",
		"name": "allow_in_place_tablespaces",
		"setting": "off",
		"unit": null,
		"context": "superuser",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Options pour le développeur",
		"name": "allow_system_table_mods",
		"setting": "off",
		"unit": null,
		"context": "superuser",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Rapports et traces / Que tracer",
		"name": "application_name",
		"setting": "STEAN 2.1.0",
		"unit": null,
		"context": "user",
		"source": "client",
		"boot_val": "",
		"reset_val": "STEAN 2.1.0",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Write-Ahead Log / Restauration d'archive",
		"name": "archive_cleanup_command",
		"setting": "",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "",
		"reset_val": "",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Write-Ahead Log / Archivage",
		"name": "archive_command",
		"setting": "(disabled)",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "",
		"reset_val": "",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Write-Ahead Log / Archivage",
		"name": "archive_library",
		"setting": "",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "",
		"reset_val": "",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Write-Ahead Log / Archivage",
		"name": "archive_mode",
		"setting": "off",
		"unit": null,
		"context": "postmaster",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Write-Ahead Log / Archivage",
		"name": "archive_timeout",
		"setting": "0",
		"unit": "s",
		"context": "sighup",
		"source": "default",
		"boot_val": "0",
		"reset_val": "0",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Compatibilité des versions et des plateformes / Anciennes versions de PostgreSQL",
		"name": "array_nulls",
		"setting": "on",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "on",
		"reset_val": "on",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Connexions et authentification / Authentification",
		"name": "authentication_timeout",
		"setting": "60",
		"unit": "s",
		"context": "sighup",
		"source": "default",
		"boot_val": "60",
		"reset_val": "60",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Autovacuum",
		"name": "autovacuum",
		"setting": "on",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "on",
		"reset_val": "on",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Autovacuum",
		"name": "autovacuum_analyze_scale_factor",
		"setting": "0.1",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "0.1",
		"reset_val": "0.1",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Autovacuum",
		"name": "autovacuum_analyze_threshold",
		"setting": "50",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "50",
		"reset_val": "50",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Autovacuum",
		"name": "autovacuum_freeze_max_age",
		"setting": "200000000",
		"unit": null,
		"context": "postmaster",
		"source": "default",
		"boot_val": "200000000",
		"reset_val": "200000000",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Autovacuum",
		"name": "autovacuum_max_workers",
		"setting": "3",
		"unit": null,
		"context": "postmaster",
		"source": "default",
		"boot_val": "3",
		"reset_val": "3",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Autovacuum",
		"name": "autovacuum_multixact_freeze_max_age",
		"setting": "400000000",
		"unit": null,
		"context": "postmaster",
		"source": "default",
		"boot_val": "400000000",
		"reset_val": "400000000",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Autovacuum",
		"name": "autovacuum_naptime",
		"setting": "60",
		"unit": "s",
		"context": "sighup",
		"source": "default",
		"boot_val": "60",
		"reset_val": "60",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Autovacuum",
		"name": "autovacuum_vacuum_cost_delay",
		"setting": "2",
		"unit": "ms",
		"context": "sighup",
		"source": "default",
		"boot_val": "2",
		"reset_val": "2",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Autovacuum",
		"name": "autovacuum_vacuum_cost_limit",
		"setting": "-1",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "-1",
		"reset_val": "-1",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Autovacuum",
		"name": "autovacuum_vacuum_insert_scale_factor",
		"setting": "0.2",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "0.2",
		"reset_val": "0.2",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Autovacuum",
		"name": "autovacuum_vacuum_insert_threshold",
		"setting": "1000",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "1000",
		"reset_val": "1000",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Autovacuum",
		"name": "autovacuum_vacuum_scale_factor",
		"setting": "0.2",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "0.2",
		"reset_val": "0.2",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Autovacuum",
		"name": "autovacuum_vacuum_threshold",
		"setting": "50",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "50",
		"reset_val": "50",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Utilisation des ressources / Mémoire",
		"name": "autovacuum_work_mem",
		"setting": "-1",
		"unit": "kB",
		"context": "sighup",
		"source": "default",
		"boot_val": "-1",
		"reset_val": "-1",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Utilisation des ressources / Comportement asynchrone",
		"name": "backend_flush_after",
		"setting": "0",
		"unit": "8kB",
		"context": "user",
		"source": "default",
		"boot_val": "0",
		"reset_val": "0",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Compatibilité des versions et des plateformes / Anciennes versions de PostgreSQL",
		"name": "backslash_quote",
		"setting": "safe_encoding",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "safe_encoding",
		"reset_val": "safe_encoding",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Options pour le développeur",
		"name": "backtrace_functions",
		"setting": "",
		"unit": null,
		"context": "superuser",
		"source": "default",
		"boot_val": "",
		"reset_val": "",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Utilisation des ressources / Processus d'écriture en tâche de fond",
		"name": "bgwriter_delay",
		"setting": "200",
		"unit": "ms",
		"context": "sighup",
		"source": "default",
		"boot_val": "200",
		"reset_val": "200",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Utilisation des ressources / Processus d'écriture en tâche de fond",
		"name": "bgwriter_flush_after",
		"setting": "0",
		"unit": "8kB",
		"context": "sighup",
		"source": "default",
		"boot_val": "0",
		"reset_val": "0",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Utilisation des ressources / Processus d'écriture en tâche de fond",
		"name": "bgwriter_lru_maxpages",
		"setting": "100",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "100",
		"reset_val": "100",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Utilisation des ressources / Processus d'écriture en tâche de fond",
		"name": "bgwriter_lru_multiplier",
		"setting": "2",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "2",
		"reset_val": "2",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Options pré-configurées",
		"name": "block_size",
		"setting": "8192",
		"unit": null,
		"context": "internal",
		"source": "default",
		"boot_val": "8192",
		"reset_val": "8192",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Connexions et authentification / Paramétrages de connexion",
		"name": "bonjour",
		"setting": "off",
		"unit": null,
		"context": "postmaster",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Connexions et authentification / Paramétrages de connexion",
		"name": "bonjour_name",
		"setting": "",
		"unit": null,
		"context": "postmaster",
		"source": "default",
		"boot_val": "",
		"reset_val": "",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions client / Comportement des instructions",
		"name": "bytea_output",
		"setting": "hex",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "hex",
		"reset_val": "hex",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions client / Comportement des instructions",
		"name": "check_function_bodies",
		"setting": "on",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "on",
		"reset_val": "on",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Write-Ahead Log / Points de vérification (Checkpoints)",
		"name": "checkpoint_completion_target",
		"setting": "0.9",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "0.9",
		"reset_val": "0.9",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Write-Ahead Log / Points de vérification (Checkpoints)",
		"name": "checkpoint_flush_after",
		"setting": "0",
		"unit": "8kB",
		"context": "sighup",
		"source": "default",
		"boot_val": "0",
		"reset_val": "0",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Write-Ahead Log / Points de vérification (Checkpoints)",
		"name": "checkpoint_timeout",
		"setting": "300",
		"unit": "s",
		"context": "sighup",
		"source": "default",
		"boot_val": "300",
		"reset_val": "300",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Write-Ahead Log / Points de vérification (Checkpoints)",
		"name": "checkpoint_warning",
		"setting": "30",
		"unit": "s",
		"context": "sighup",
		"source": "default",
		"boot_val": "30",
		"reset_val": "30",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Connections and Authentication / TCP Settings",
		"name": "client_connection_check_interval",
		"setting": "0",
		"unit": "ms",
		"context": "user",
		"source": "default",
		"boot_val": "0",
		"reset_val": "0",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions client / Locale et formattage",
		"name": "client_encoding",
		"setting": "UTF8",
		"unit": null,
		"context": "user",
		"source": "client",
		"boot_val": "SQL_ASCII",
		"reset_val": "UTF8",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions client / Comportement des instructions",
		"name": "client_min_messages",
		"setting": "notice",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "notice",
		"reset_val": "notice",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Rapports et traces / Titre du processus",
		"name": "cluster_name",
		"setting": "",
		"unit": null,
		"context": "postmaster",
		"source": "default",
		"boot_val": "",
		"reset_val": "",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Write-Ahead Log / Paramétrages",
		"name": "commit_delay",
		"setting": "0",
		"unit": null,
		"context": "superuser",
		"source": "default",
		"boot_val": "0",
		"reset_val": "0",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Write-Ahead Log / Paramétrages",
		"name": "commit_siblings",
		"setting": "5",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "5",
		"reset_val": "5",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Statistiques / Surveillance",
		"name": "compute_query_id",
		"setting": "auto",
		"unit": null,
		"context": "superuser",
		"source": "default",
		"boot_val": "auto",
		"reset_val": "auto",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Emplacement des fichiers",
		"name": "config_file",
		"setting": "C:/Program Files/PostgreSQL/16/data/postgresql.conf",
		"unit": null,
		"context": "postmaster",
		"source": "override",
		"boot_val": null,
		"reset_val": "C:/Program Files/PostgreSQL/16/data/postgresql.conf",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Optimisation des requêtes / Autres options du planificateur",
		"name": "constraint_exclusion",
		"setting": "partition",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "partition",
		"reset_val": "partition",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Optimisation des requêtes / Constantes des coûts du planificateur",
		"name": "cpu_index_tuple_cost",
		"setting": "0.005",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "0.005",
		"reset_val": "0.005",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Optimisation des requêtes / Constantes des coûts du planificateur",
		"name": "cpu_operator_cost",
		"setting": "0.0025",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "0.0025",
		"reset_val": "0.0025",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Optimisation des requêtes / Constantes des coûts du planificateur",
		"name": "cpu_tuple_cost",
		"setting": "0.01",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "0.01",
		"reset_val": "0.01",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions client / Comportement des instructions",
		"name": "createrole_self_grant",
		"setting": "",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "",
		"reset_val": "",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Optimisation des requêtes / Autres options du planificateur",
		"name": "cursor_tuple_fraction",
		"setting": "0.1",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "0.1",
		"reset_val": "0.1",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Options pré-configurées",
		"name": "data_checksums",
		"setting": "off",
		"unit": null,
		"context": "internal",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Emplacement des fichiers",
		"name": "data_directory",
		"setting": "C:/Program Files/PostgreSQL/16/data",
		"unit": null,
		"context": "postmaster",
		"source": "override",
		"boot_val": null,
		"reset_val": "C:/Program Files/PostgreSQL/16/data",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Options pré-configurées",
		"name": "data_directory_mode",
		"setting": "0700",
		"unit": null,
		"context": "internal",
		"source": "default",
		"boot_val": "448",
		"reset_val": "448",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Gestion des erreurs",
		"name": "data_sync_retry",
		"setting": "off",
		"unit": null,
		"context": "postmaster",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions client / Locale et formattage",
		"name": "DateStyle",
		"setting": "ISO, DMY",
		"unit": null,
		"context": "user",
		"source": "configuration file",
		"boot_val": "ISO, MDY",
		"reset_val": "ISO, DMY",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Connexions et authentification / Authentification",
		"name": "db_user_namespace",
		"setting": "off",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Gestion des verrous",
		"name": "deadlock_timeout",
		"setting": "1000",
		"unit": "ms",
		"context": "superuser",
		"source": "default",
		"boot_val": "1000",
		"reset_val": "1000",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Options pré-configurées",
		"name": "debug_assertions",
		"setting": "off",
		"unit": null,
		"context": "internal",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Options pour le développeur",
		"name": "debug_discard_caches",
		"setting": "0",
		"unit": null,
		"context": "superuser",
		"source": "default",
		"boot_val": "0",
		"reset_val": "0",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Options pour le développeur",
		"name": "debug_io_direct",
		"setting": "",
		"unit": null,
		"context": "postmaster",
		"source": "default",
		"boot_val": "",
		"reset_val": "",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Options pour le développeur",
		"name": "debug_logical_replication_streaming",
		"setting": "buffered",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "buffered",
		"reset_val": "buffered",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Options pour le développeur",
		"name": "debug_parallel_query",
		"setting": "off",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Rapports et traces / Que tracer",
		"name": "debug_pretty_print",
		"setting": "on",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "on",
		"reset_val": "on",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Rapports et traces / Que tracer",
		"name": "debug_print_parse",
		"setting": "off",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Rapports et traces / Que tracer",
		"name": "debug_print_plan",
		"setting": "off",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Rapports et traces / Que tracer",
		"name": "debug_print_rewritten",
		"setting": "off",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Optimisation des requêtes / Autres options du planificateur",
		"name": "default_statistics_target",
		"setting": "100",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "100",
		"reset_val": "100",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions client / Comportement des instructions",
		"name": "default_table_access_method",
		"setting": "heap",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "heap",
		"reset_val": "heap",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions client / Comportement des instructions",
		"name": "default_tablespace",
		"setting": "",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "",
		"reset_val": "",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions client / Locale et formattage",
		"name": "default_text_search_config",
		"setting": "pg_catalog.french",
		"unit": null,
		"context": "user",
		"source": "configuration file",
		"boot_val": "pg_catalog.simple",
		"reset_val": "pg_catalog.french",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions client / Comportement des instructions",
		"name": "default_toast_compression",
		"setting": "pglz",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "pglz",
		"reset_val": "pglz",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions client / Comportement des instructions",
		"name": "default_transaction_deferrable",
		"setting": "off",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions client / Comportement des instructions",
		"name": "default_transaction_isolation",
		"setting": "read committed",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "read committed",
		"reset_val": "read committed",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions client / Comportement des instructions",
		"name": "default_transaction_read_only",
		"setting": "off",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions client / Autres valeurs par défaut",
		"name": "dynamic_library_path",
		"setting": "$libdir",
		"unit": null,
		"context": "superuser",
		"source": "default",
		"boot_val": "$libdir",
		"reset_val": "$libdir",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Utilisation des ressources / Mémoire",
		"name": "dynamic_shared_memory_type",
		"setting": "windows",
		"unit": null,
		"context": "postmaster",
		"source": "configuration file",
		"boot_val": "windows",
		"reset_val": "windows",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Optimisation des requêtes / Constantes des coûts du planificateur",
		"name": "effective_cache_size",
		"setting": "524288",
		"unit": "8kB",
		"context": "user",
		"source": "default",
		"boot_val": "524288",
		"reset_val": "524288",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Utilisation des ressources / Comportement asynchrone",
		"name": "effective_io_concurrency",
		"setting": "0",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "0",
		"reset_val": "0",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Optimisation des requêtes / Configuration de la méthode du planificateur",
		"name": "enable_async_append",
		"setting": "on",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "on",
		"reset_val": "on",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Optimisation des requêtes / Configuration de la méthode du planificateur",
		"name": "enable_bitmapscan",
		"setting": "on",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "on",
		"reset_val": "on",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Optimisation des requêtes / Configuration de la méthode du planificateur",
		"name": "enable_gathermerge",
		"setting": "on",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "on",
		"reset_val": "on",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Optimisation des requêtes / Configuration de la méthode du planificateur",
		"name": "enable_hashagg",
		"setting": "on",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "on",
		"reset_val": "on",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Optimisation des requêtes / Configuration de la méthode du planificateur",
		"name": "enable_hashjoin",
		"setting": "on",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "on",
		"reset_val": "on",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Optimisation des requêtes / Configuration de la méthode du planificateur",
		"name": "enable_incremental_sort",
		"setting": "on",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "on",
		"reset_val": "on",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Optimisation des requêtes / Configuration de la méthode du planificateur",
		"name": "enable_indexonlyscan",
		"setting": "on",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "on",
		"reset_val": "on",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Optimisation des requêtes / Configuration de la méthode du planificateur",
		"name": "enable_indexscan",
		"setting": "on",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "on",
		"reset_val": "on",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Optimisation des requêtes / Configuration de la méthode du planificateur",
		"name": "enable_material",
		"setting": "on",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "on",
		"reset_val": "on",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Optimisation des requêtes / Configuration de la méthode du planificateur",
		"name": "enable_memoize",
		"setting": "on",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "on",
		"reset_val": "on",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Optimisation des requêtes / Configuration de la méthode du planificateur",
		"name": "enable_mergejoin",
		"setting": "on",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "on",
		"reset_val": "on",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Optimisation des requêtes / Configuration de la méthode du planificateur",
		"name": "enable_nestloop",
		"setting": "on",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "on",
		"reset_val": "on",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Optimisation des requêtes / Configuration de la méthode du planificateur",
		"name": "enable_parallel_append",
		"setting": "on",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "on",
		"reset_val": "on",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Optimisation des requêtes / Configuration de la méthode du planificateur",
		"name": "enable_parallel_hash",
		"setting": "on",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "on",
		"reset_val": "on",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Optimisation des requêtes / Configuration de la méthode du planificateur",
		"name": "enable_partition_pruning",
		"setting": "on",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "on",
		"reset_val": "on",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Optimisation des requêtes / Configuration de la méthode du planificateur",
		"name": "enable_partitionwise_aggregate",
		"setting": "off",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Optimisation des requêtes / Configuration de la méthode du planificateur",
		"name": "enable_partitionwise_join",
		"setting": "off",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Optimisation des requêtes / Configuration de la méthode du planificateur",
		"name": "enable_presorted_aggregate",
		"setting": "on",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "on",
		"reset_val": "on",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Optimisation des requêtes / Configuration de la méthode du planificateur",
		"name": "enable_seqscan",
		"setting": "on",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "on",
		"reset_val": "on",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Optimisation des requêtes / Configuration de la méthode du planificateur",
		"name": "enable_sort",
		"setting": "on",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "on",
		"reset_val": "on",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Optimisation des requêtes / Configuration de la méthode du planificateur",
		"name": "enable_tidscan",
		"setting": "on",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "on",
		"reset_val": "on",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Compatibilité des versions et des plateformes / Anciennes versions de PostgreSQL",
		"name": "escape_string_warning",
		"setting": "on",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "on",
		"reset_val": "on",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Rapports et traces / Où tracer",
		"name": "event_source",
		"setting": "PostgreSQL",
		"unit": null,
		"context": "postmaster",
		"source": "default",
		"boot_val": "PostgreSQL",
		"reset_val": "PostgreSQL",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Gestion des erreurs",
		"name": "exit_on_error",
		"setting": "off",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Emplacement des fichiers",
		"name": "external_pid_file",
		"setting": "",
		"unit": null,
		"context": "postmaster",
		"source": "default",
		"boot_val": null,
		"reset_val": null,
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions client / Locale et formattage",
		"name": "extra_float_digits",
		"setting": "1",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "1",
		"reset_val": "1",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Optimisation des requêtes / Autres options du planificateur",
		"name": "from_collapse_limit",
		"setting": "8",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "8",
		"reset_val": "8",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Write-Ahead Log / Paramétrages",
		"name": "fsync",
		"setting": "on",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "on",
		"reset_val": "on",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Write-Ahead Log / Paramétrages",
		"name": "full_page_writes",
		"setting": "on",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "on",
		"reset_val": "on",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Optimisation des requêtes / Optimiseur génétique de requêtes",
		"name": "geqo",
		"setting": "on",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "on",
		"reset_val": "on",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Optimisation des requêtes / Optimiseur génétique de requêtes",
		"name": "geqo_effort",
		"setting": "5",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "5",
		"reset_val": "5",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Optimisation des requêtes / Optimiseur génétique de requêtes",
		"name": "geqo_generations",
		"setting": "0",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "0",
		"reset_val": "0",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Optimisation des requêtes / Optimiseur génétique de requêtes",
		"name": "geqo_pool_size",
		"setting": "0",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "0",
		"reset_val": "0",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Optimisation des requêtes / Optimiseur génétique de requêtes",
		"name": "geqo_seed",
		"setting": "0",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "0",
		"reset_val": "0",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Optimisation des requêtes / Optimiseur génétique de requêtes",
		"name": "geqo_selection_bias",
		"setting": "2",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "2",
		"reset_val": "2",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Optimisation des requêtes / Optimiseur génétique de requêtes",
		"name": "geqo_threshold",
		"setting": "12",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "12",
		"reset_val": "12",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions client / Autres valeurs par défaut",
		"name": "gin_fuzzy_search_limit",
		"setting": "0",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "0",
		"reset_val": "0",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions client / Comportement des instructions",
		"name": "gin_pending_list_limit",
		"setting": "4096",
		"unit": "kB",
		"context": "user",
		"source": "default",
		"boot_val": "4096",
		"reset_val": "4096",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Connexions et authentification / Authentification",
		"name": "gss_accept_delegation",
		"setting": "off",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Utilisation des ressources / Mémoire",
		"name": "hash_mem_multiplier",
		"setting": "2",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "2",
		"reset_val": "2",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Emplacement des fichiers",
		"name": "hba_file",
		"setting": "C:/Program Files/PostgreSQL/16/data/pg_hba.conf",
		"unit": null,
		"context": "postmaster",
		"source": "override",
		"boot_val": null,
		"reset_val": "C:/Program Files/PostgreSQL/16/data/pg_hba.conf",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Réplication / Serveurs en attente",
		"name": "hot_standby",
		"setting": "on",
		"unit": null,
		"context": "postmaster",
		"source": "default",
		"boot_val": "on",
		"reset_val": "on",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Réplication / Serveurs en attente",
		"name": "hot_standby_feedback",
		"setting": "off",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Utilisation des ressources / Mémoire",
		"name": "huge_page_size",
		"setting": "0",
		"unit": "kB",
		"context": "postmaster",
		"source": "default",
		"boot_val": "0",
		"reset_val": "0",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Utilisation des ressources / Mémoire",
		"name": "huge_pages",
		"setting": "try",
		"unit": null,
		"context": "postmaster",
		"source": "default",
		"boot_val": "try",
		"reset_val": "try",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions client / Locale et formattage",
		"name": "icu_validation_level",
		"setting": "warning",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "warning",
		"reset_val": "warning",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Emplacement des fichiers",
		"name": "ident_file",
		"setting": "C:/Program Files/PostgreSQL/16/data/pg_ident.conf",
		"unit": null,
		"context": "postmaster",
		"source": "override",
		"boot_val": null,
		"reset_val": "C:/Program Files/PostgreSQL/16/data/pg_ident.conf",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions client / Comportement des instructions",
		"name": "idle_in_transaction_session_timeout",
		"setting": "0",
		"unit": "ms",
		"context": "user",
		"source": "default",
		"boot_val": "0",
		"reset_val": "0",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions client / Comportement des instructions",
		"name": "idle_session_timeout",
		"setting": "0",
		"unit": "ms",
		"context": "user",
		"source": "default",
		"boot_val": "0",
		"reset_val": "0",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Options pour le développeur",
		"name": "ignore_checksum_failure",
		"setting": "off",
		"unit": null,
		"context": "superuser",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Options pour le développeur",
		"name": "ignore_invalid_pages",
		"setting": "off",
		"unit": null,
		"context": "postmaster",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Options pour le développeur",
		"name": "ignore_system_indexes",
		"setting": "off",
		"unit": null,
		"context": "backend",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Options pré-configurées",
		"name": "in_hot_standby",
		"setting": "off",
		"unit": null,
		"context": "internal",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Options pré-configurées",
		"name": "integer_datetimes",
		"setting": "on",
		"unit": null,
		"context": "internal",
		"source": "default",
		"boot_val": "on",
		"reset_val": "on",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions client / Locale et formattage",
		"name": "IntervalStyle",
		"setting": "postgres",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "postgres",
		"reset_val": "postgres",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Optimisation des requêtes / Autres options du planificateur",
		"name": "jit",
		"setting": "on",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "on",
		"reset_val": "on",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Optimisation des requêtes / Constantes des coûts du planificateur",
		"name": "jit_above_cost",
		"setting": "100000",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "100000",
		"reset_val": "100000",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Options pour le développeur",
		"name": "jit_debugging_support",
		"setting": "off",
		"unit": null,
		"context": "superuser-backend",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Options pour le développeur",
		"name": "jit_dump_bitcode",
		"setting": "off",
		"unit": null,
		"context": "superuser",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Options pour le développeur",
		"name": "jit_expressions",
		"setting": "on",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "on",
		"reset_val": "on",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Optimisation des requêtes / Constantes des coûts du planificateur",
		"name": "jit_inline_above_cost",
		"setting": "500000",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "500000",
		"reset_val": "500000",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Optimisation des requêtes / Constantes des coûts du planificateur",
		"name": "jit_optimize_above_cost",
		"setting": "500000",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "500000",
		"reset_val": "500000",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Options pour le développeur",
		"name": "jit_profiling_support",
		"setting": "off",
		"unit": null,
		"context": "superuser-backend",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions des clients / Préchargement des bibliothèques partagées",
		"name": "jit_provider",
		"setting": "llvmjit",
		"unit": null,
		"context": "postmaster",
		"source": "default",
		"boot_val": "llvmjit",
		"reset_val": "llvmjit",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Options pour le développeur",
		"name": "jit_tuple_deforming",
		"setting": "on",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "on",
		"reset_val": "on",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Optimisation des requêtes / Autres options du planificateur",
		"name": "join_collapse_limit",
		"setting": "8",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "8",
		"reset_val": "8",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Connexions et authentification / Authentification",
		"name": "krb_caseins_users",
		"setting": "off",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Connexions et authentification / Authentification",
		"name": "krb_server_keyfile",
		"setting": "",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "",
		"reset_val": "",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions client / Locale et formattage",
		"name": "lc_messages",
		"setting": "French_France.1252",
		"unit": null,
		"context": "superuser",
		"source": "configuration file",
		"boot_val": "",
		"reset_val": "French_France.1252",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions client / Locale et formattage",
		"name": "lc_monetary",
		"setting": "French_France.1252",
		"unit": null,
		"context": "user",
		"source": "configuration file",
		"boot_val": "C",
		"reset_val": "French_France.1252",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions client / Locale et formattage",
		"name": "lc_numeric",
		"setting": "French_France.1252",
		"unit": null,
		"context": "user",
		"source": "configuration file",
		"boot_val": "C",
		"reset_val": "French_France.1252",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions client / Locale et formattage",
		"name": "lc_time",
		"setting": "French_France.1252",
		"unit": null,
		"context": "user",
		"source": "configuration file",
		"boot_val": "C",
		"reset_val": "French_France.1252",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Connexions et authentification / Paramétrages de connexion",
		"name": "listen_addresses",
		"setting": "*",
		"unit": null,
		"context": "postmaster",
		"source": "configuration file",
		"boot_val": "localhost",
		"reset_val": "*",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Compatibilité des versions et des plateformes / Anciennes versions de PostgreSQL",
		"name": "lo_compat_privileges",
		"setting": "off",
		"unit": null,
		"context": "superuser",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions des clients / Préchargement des bibliothèques partagées",
		"name": "local_preload_libraries",
		"setting": "",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "",
		"reset_val": "",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions client / Comportement des instructions",
		"name": "lock_timeout",
		"setting": "-3000",
		"unit": "ms",
		"context": "user",
		"source": "default",
		"boot_val": "0",
		"reset_val": "-3000",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Rapports et traces / Que tracer",
		"name": "log_autovacuum_min_duration",
		"setting": "600000",
		"unit": "ms",
		"context": "sighup",
		"source": "default",
		"boot_val": "600000",
		"reset_val": "600000",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Rapports et traces / Que tracer",
		"name": "log_checkpoints",
		"setting": "on",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "on",
		"reset_val": "on",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Rapports et traces / Que tracer",
		"name": "log_connections",
		"setting": "off",
		"unit": null,
		"context": "superuser-backend",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Rapports et traces / Où tracer",
		"name": "log_destination",
		"setting": "stderr",
		"unit": null,
		"context": "sighup",
		"source": "configuration file",
		"boot_val": "stderr",
		"reset_val": "stderr",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Rapports et traces / Où tracer",
		"name": "log_directory",
		"setting": "log",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "log",
		"reset_val": "log",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Rapports et traces / Que tracer",
		"name": "log_disconnections",
		"setting": "off",
		"unit": null,
		"context": "superuser-backend",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Rapports et traces / Que tracer",
		"name": "log_duration",
		"setting": "off",
		"unit": null,
		"context": "superuser",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Rapports et traces / Que tracer",
		"name": "log_error_verbosity",
		"setting": "default",
		"unit": null,
		"context": "superuser",
		"source": "default",
		"boot_val": "default",
		"reset_val": "default",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Statistiques / Surveillance",
		"name": "log_executor_stats",
		"setting": "off",
		"unit": null,
		"context": "superuser",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Rapports et traces / Où tracer",
		"name": "log_file_mode",
		"setting": "0640",
		"unit": null,
		"context": "sighup",
		"source": "configuration file",
		"boot_val": "384",
		"reset_val": "416",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Rapports et traces / Où tracer",
		"name": "log_filename",
		"setting": "postgresql-%Y-%m-%d_%H%M%S.log",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "postgresql-%Y-%m-%d_%H%M%S.log",
		"reset_val": "postgresql-%Y-%m-%d_%H%M%S.log",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Rapports et traces / Que tracer",
		"name": "log_hostname",
		"setting": "off",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Rapports et traces / Que tracer",
		"name": "log_line_prefix",
		"setting": "%m [%p] ",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "%m [%p] ",
		"reset_val": "%m [%p] ",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Rapports et traces / Que tracer",
		"name": "log_lock_waits",
		"setting": "off",
		"unit": null,
		"context": "superuser",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Rapports et traces / Quand tracer",
		"name": "log_min_duration_sample",
		"setting": "-1",
		"unit": "ms",
		"context": "superuser",
		"source": "default",
		"boot_val": "-1",
		"reset_val": "-1",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Rapports et traces / Quand tracer",
		"name": "log_min_duration_statement",
		"setting": "-1",
		"unit": "ms",
		"context": "superuser",
		"source": "default",
		"boot_val": "-1",
		"reset_val": "-1",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Rapports et traces / Quand tracer",
		"name": "log_min_error_statement",
		"setting": "error",
		"unit": null,
		"context": "superuser",
		"source": "default",
		"boot_val": "error",
		"reset_val": "error",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Rapports et traces / Quand tracer",
		"name": "log_min_messages",
		"setting": "warning",
		"unit": null,
		"context": "superuser",
		"source": "default",
		"boot_val": "warning",
		"reset_val": "warning",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Rapports et traces / Que tracer",
		"name": "log_parameter_max_length",
		"setting": "-1",
		"unit": "B",
		"context": "superuser",
		"source": "default",
		"boot_val": "-1",
		"reset_val": "-1",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Rapports et traces / Que tracer",
		"name": "log_parameter_max_length_on_error",
		"setting": "0",
		"unit": "B",
		"context": "user",
		"source": "default",
		"boot_val": "0",
		"reset_val": "0",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Statistiques / Surveillance",
		"name": "log_parser_stats",
		"setting": "off",
		"unit": null,
		"context": "superuser",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Statistiques / Surveillance",
		"name": "log_planner_stats",
		"setting": "off",
		"unit": null,
		"context": "superuser",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Rapports et traces / Que tracer",
		"name": "log_recovery_conflict_waits",
		"setting": "off",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Rapports et traces / Que tracer",
		"name": "log_replication_commands",
		"setting": "off",
		"unit": null,
		"context": "superuser",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Rapports et traces / Où tracer",
		"name": "log_rotation_age",
		"setting": "1440",
		"unit": "min",
		"context": "sighup",
		"source": "default",
		"boot_val": "1440",
		"reset_val": "1440",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Rapports et traces / Où tracer",
		"name": "log_rotation_size",
		"setting": "10240",
		"unit": "kB",
		"context": "sighup",
		"source": "default",
		"boot_val": "10240",
		"reset_val": "10240",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Rapports et traces / Quand tracer",
		"name": "log_startup_progress_interval",
		"setting": "10000",
		"unit": "ms",
		"context": "sighup",
		"source": "default",
		"boot_val": "10000",
		"reset_val": "10000",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Rapports et traces / Que tracer",
		"name": "log_statement",
		"setting": "none",
		"unit": null,
		"context": "superuser",
		"source": "default",
		"boot_val": "none",
		"reset_val": "none",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Rapports et traces / Quand tracer",
		"name": "log_statement_sample_rate",
		"setting": "1",
		"unit": null,
		"context": "superuser",
		"source": "default",
		"boot_val": "1",
		"reset_val": "1",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Statistiques / Surveillance",
		"name": "log_statement_stats",
		"setting": "off",
		"unit": null,
		"context": "superuser",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Rapports et traces / Que tracer",
		"name": "log_temp_files",
		"setting": "-1",
		"unit": "kB",
		"context": "superuser",
		"source": "default",
		"boot_val": "-1",
		"reset_val": "-1",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Rapports et traces / Que tracer",
		"name": "log_timezone",
		"setting": "Europe/Paris",
		"unit": null,
		"context": "sighup",
		"source": "configuration file",
		"boot_val": "GMT",
		"reset_val": "Europe/Paris",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Rapports et traces / Quand tracer",
		"name": "log_transaction_sample_rate",
		"setting": "0",
		"unit": null,
		"context": "superuser",
		"source": "default",
		"boot_val": "0",
		"reset_val": "0",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Rapports et traces / Où tracer",
		"name": "log_truncate_on_rotation",
		"setting": "off",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Rapports et traces / Où tracer",
		"name": "logging_collector",
		"setting": "on",
		"unit": null,
		"context": "postmaster",
		"source": "configuration file",
		"boot_val": "off",
		"reset_val": "on",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Utilisation des ressources / Mémoire",
		"name": "logical_decoding_work_mem",
		"setting": "65536",
		"unit": "kB",
		"context": "user",
		"source": "default",
		"boot_val": "65536",
		"reset_val": "65536",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Utilisation des ressources / Comportement asynchrone",
		"name": "maintenance_io_concurrency",
		"setting": "0",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "0",
		"reset_val": "0",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Utilisation des ressources / Mémoire",
		"name": "maintenance_work_mem",
		"setting": "65536",
		"unit": "kB",
		"context": "user",
		"source": "default",
		"boot_val": "65536",
		"reset_val": "65536",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Connexions et authentification / Paramétrages de connexion",
		"name": "max_connections",
		"setting": "100",
		"unit": null,
		"context": "postmaster",
		"source": "configuration file",
		"boot_val": "100",
		"reset_val": "100",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Utilisation des ressources / Ressources noyau",
		"name": "max_files_per_process",
		"setting": "1000",
		"unit": null,
		"context": "postmaster",
		"source": "default",
		"boot_val": "1000",
		"reset_val": "1000",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Options pré-configurées",
		"name": "max_function_args",
		"setting": "100",
		"unit": null,
		"context": "internal",
		"source": "default",
		"boot_val": "100",
		"reset_val": "100",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Options pré-configurées",
		"name": "max_identifier_length",
		"setting": "63",
		"unit": null,
		"context": "internal",
		"source": "default",
		"boot_val": "63",
		"reset_val": "63",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Options pré-configurées",
		"name": "max_index_keys",
		"setting": "32",
		"unit": null,
		"context": "internal",
		"source": "default",
		"boot_val": "32",
		"reset_val": "32",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Gestion des verrous",
		"name": "max_locks_per_transaction",
		"setting": "64",
		"unit": null,
		"context": "postmaster",
		"source": "default",
		"boot_val": "64",
		"reset_val": "64",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Réplication / Abonnés",
		"name": "max_logical_replication_workers",
		"setting": "4",
		"unit": null,
		"context": "postmaster",
		"source": "default",
		"boot_val": "4",
		"reset_val": "4",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Réplication / Abonnés",
		"name": "max_parallel_apply_workers_per_subscription",
		"setting": "2",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "2",
		"reset_val": "2",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Utilisation des ressources / Comportement asynchrone",
		"name": "max_parallel_maintenance_workers",
		"setting": "2",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "2",
		"reset_val": "2",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Utilisation des ressources / Comportement asynchrone",
		"name": "max_parallel_workers",
		"setting": "8",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "8",
		"reset_val": "8",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Utilisation des ressources / Comportement asynchrone",
		"name": "max_parallel_workers_per_gather",
		"setting": "2",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "2",
		"reset_val": "2",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Gestion des verrous",
		"name": "max_pred_locks_per_page",
		"setting": "2",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "2",
		"reset_val": "2",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Gestion des verrous",
		"name": "max_pred_locks_per_relation",
		"setting": "-2",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "-2",
		"reset_val": "-2",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Gestion des verrous",
		"name": "max_pred_locks_per_transaction",
		"setting": "64",
		"unit": null,
		"context": "postmaster",
		"source": "default",
		"boot_val": "64",
		"reset_val": "64",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Utilisation des ressources / Mémoire",
		"name": "max_prepared_transactions",
		"setting": "0",
		"unit": null,
		"context": "postmaster",
		"source": "default",
		"boot_val": "0",
		"reset_val": "0",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Réplication / Serveurs d'envoi",
		"name": "max_replication_slots",
		"setting": "10",
		"unit": null,
		"context": "postmaster",
		"source": "default",
		"boot_val": "10",
		"reset_val": "10",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Réplication / Serveurs d'envoi",
		"name": "max_slot_wal_keep_size",
		"setting": "-1",
		"unit": "MB",
		"context": "sighup",
		"source": "default",
		"boot_val": "-1",
		"reset_val": "-1",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Utilisation des ressources / Mémoire",
		"name": "max_stack_depth",
		"setting": "2048",
		"unit": "kB",
		"context": "superuser",
		"source": "default",
		"boot_val": "100",
		"reset_val": "2048",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Réplication / Serveurs en attente",
		"name": "max_standby_archive_delay",
		"setting": "30000",
		"unit": "ms",
		"context": "sighup",
		"source": "default",
		"boot_val": "30000",
		"reset_val": "30000",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Réplication / Serveurs en attente",
		"name": "max_standby_streaming_delay",
		"setting": "30000",
		"unit": "ms",
		"context": "sighup",
		"source": "default",
		"boot_val": "30000",
		"reset_val": "30000",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Réplication / Abonnés",
		"name": "max_sync_workers_per_subscription",
		"setting": "2",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "2",
		"reset_val": "2",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Réplication / Serveurs d'envoi",
		"name": "max_wal_senders",
		"setting": "10",
		"unit": null,
		"context": "postmaster",
		"source": "default",
		"boot_val": "10",
		"reset_val": "10",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Write-Ahead Log / Points de vérification (Checkpoints)",
		"name": "max_wal_size",
		"setting": "1024",
		"unit": "MB",
		"context": "sighup",
		"source": "configuration file",
		"boot_val": "1024",
		"reset_val": "1024",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Utilisation des ressources / Comportement asynchrone",
		"name": "max_worker_processes",
		"setting": "8",
		"unit": null,
		"context": "postmaster",
		"source": "default",
		"boot_val": "8",
		"reset_val": "8",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Utilisation des ressources / Mémoire",
		"name": "min_dynamic_shared_memory",
		"setting": "0",
		"unit": "MB",
		"context": "postmaster",
		"source": "default",
		"boot_val": "0",
		"reset_val": "0",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Optimisation des requêtes / Constantes des coûts du planificateur",
		"name": "min_parallel_index_scan_size",
		"setting": "64",
		"unit": "8kB",
		"context": "user",
		"source": "default",
		"boot_val": "64",
		"reset_val": "64",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Optimisation des requêtes / Constantes des coûts du planificateur",
		"name": "min_parallel_table_scan_size",
		"setting": "1024",
		"unit": "8kB",
		"context": "user",
		"source": "default",
		"boot_val": "1024",
		"reset_val": "1024",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Write-Ahead Log / Points de vérification (Checkpoints)",
		"name": "min_wal_size",
		"setting": "80",
		"unit": "MB",
		"context": "sighup",
		"source": "configuration file",
		"boot_val": "80",
		"reset_val": "80",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Utilisation des ressources / Comportement asynchrone",
		"name": "old_snapshot_threshold",
		"setting": "-1",
		"unit": "min",
		"context": "postmaster",
		"source": "default",
		"boot_val": "-1",
		"reset_val": "-1",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Utilisation des ressources / Comportement asynchrone",
		"name": "parallel_leader_participation",
		"setting": "on",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "on",
		"reset_val": "on",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Optimisation des requêtes / Constantes des coûts du planificateur",
		"name": "parallel_setup_cost",
		"setting": "1000",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "1000",
		"reset_val": "1000",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Optimisation des requêtes / Constantes des coûts du planificateur",
		"name": "parallel_tuple_cost",
		"setting": "0.1",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "0.1",
		"reset_val": "0.1",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Connexions et authentification / Authentification",
		"name": "password_encryption",
		"setting": "scram-sha-256",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "scram-sha-256",
		"reset_val": "scram-sha-256",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Optimisation des requêtes / Autres options du planificateur",
		"name": "plan_cache_mode",
		"setting": "auto",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "auto",
		"reset_val": "auto",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Connexions et authentification / Paramétrages de connexion",
		"name": "port",
		"setting": "5432",
		"unit": null,
		"context": "postmaster",
		"source": "configuration file",
		"boot_val": "5432",
		"reset_val": "5432",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Options pour le développeur",
		"name": "post_auth_delay",
		"setting": "0",
		"unit": "s",
		"context": "backend",
		"source": "default",
		"boot_val": "0",
		"reset_val": "0",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Options pour le développeur",
		"name": "pre_auth_delay",
		"setting": "0",
		"unit": "s",
		"context": "sighup",
		"source": "default",
		"boot_val": "0",
		"reset_val": "0",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Réplication / Serveurs en attente",
		"name": "primary_conninfo",
		"setting": "",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "",
		"reset_val": "",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Réplication / Serveurs en attente",
		"name": "primary_slot_name",
		"setting": "",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "",
		"reset_val": "",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Compatibilité des versions et des plateformes / Anciennes versions de PostgreSQL",
		"name": "quote_all_identifiers",
		"setting": "off",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Optimisation des requêtes / Constantes des coûts du planificateur",
		"name": "random_page_cost",
		"setting": "4",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "4",
		"reset_val": "4",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Write-Ahead Log / Restauration d'archive",
		"name": "recovery_end_command",
		"setting": "",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "",
		"reset_val": "",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Gestion des erreurs",
		"name": "recovery_init_sync_method",
		"setting": "fsync",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "fsync",
		"reset_val": "fsync",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Réplication / Serveurs en attente",
		"name": "recovery_min_apply_delay",
		"setting": "0",
		"unit": "ms",
		"context": "sighup",
		"source": "default",
		"boot_val": "0",
		"reset_val": "0",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Write-Ahead Log / Recovery",
		"name": "recovery_prefetch",
		"setting": "try",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "try",
		"reset_val": "try",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Write-Ahead Log / Cible de restauration",
		"name": "recovery_target",
		"setting": "",
		"unit": null,
		"context": "postmaster",
		"source": "default",
		"boot_val": "",
		"reset_val": "",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Write-Ahead Log / Cible de restauration",
		"name": "recovery_target_action",
		"setting": "pause",
		"unit": null,
		"context": "postmaster",
		"source": "default",
		"boot_val": "pause",
		"reset_val": "pause",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Write-Ahead Log / Cible de restauration",
		"name": "recovery_target_inclusive",
		"setting": "on",
		"unit": null,
		"context": "postmaster",
		"source": "default",
		"boot_val": "on",
		"reset_val": "on",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Write-Ahead Log / Cible de restauration",
		"name": "recovery_target_lsn",
		"setting": "",
		"unit": null,
		"context": "postmaster",
		"source": "default",
		"boot_val": "",
		"reset_val": "",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Write-Ahead Log / Cible de restauration",
		"name": "recovery_target_name",
		"setting": "",
		"unit": null,
		"context": "postmaster",
		"source": "default",
		"boot_val": "",
		"reset_val": "",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Write-Ahead Log / Cible de restauration",
		"name": "recovery_target_time",
		"setting": "",
		"unit": null,
		"context": "postmaster",
		"source": "default",
		"boot_val": "",
		"reset_val": "",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Write-Ahead Log / Cible de restauration",
		"name": "recovery_target_timeline",
		"setting": "latest",
		"unit": null,
		"context": "postmaster",
		"source": "default",
		"boot_val": "latest",
		"reset_val": "latest",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Write-Ahead Log / Cible de restauration",
		"name": "recovery_target_xid",
		"setting": "",
		"unit": null,
		"context": "postmaster",
		"source": "default",
		"boot_val": "",
		"reset_val": "",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Optimisation des requêtes / Autres options du planificateur",
		"name": "recursive_worktable_factor",
		"setting": "10",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "10",
		"reset_val": "10",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Options pour le développeur",
		"name": "remove_temp_files_after_crash",
		"setting": "on",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "on",
		"reset_val": "on",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Connexions et authentification / Paramétrages de connexion",
		"name": "reserved_connections",
		"setting": "0",
		"unit": null,
		"context": "postmaster",
		"source": "default",
		"boot_val": "0",
		"reset_val": "0",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Gestion des erreurs",
		"name": "restart_after_crash",
		"setting": "on",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "on",
		"reset_val": "on",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Write-Ahead Log / Restauration d'archive",
		"name": "restore_command",
		"setting": "",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "",
		"reset_val": "",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions client / Comportement des instructions",
		"name": "row_security",
		"setting": "on",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "on",
		"reset_val": "on",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Connexions et authentification / Authentification",
		"name": "scram_iterations",
		"setting": "4096",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "4096",
		"reset_val": "4096",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions client / Comportement des instructions",
		"name": "search_path",
		"setting": "\"$user\", public",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "\"$user\", public",
		"reset_val": "\"$user\", public",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Options pré-configurées",
		"name": "segment_size",
		"setting": "131072",
		"unit": "8kB",
		"context": "internal",
		"source": "default",
		"boot_val": "131072",
		"reset_val": "131072",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Options pour le développeur",
		"name": "send_abort_for_crash",
		"setting": "off",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Options pour le développeur",
		"name": "send_abort_for_kill",
		"setting": "off",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Optimisation des requêtes / Constantes des coûts du planificateur",
		"name": "seq_page_cost",
		"setting": "1",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "1",
		"reset_val": "1",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Options pré-configurées",
		"name": "server_encoding",
		"setting": "UTF8",
		"unit": null,
		"context": "internal",
		"source": "default",
		"boot_val": "SQL_ASCII",
		"reset_val": "UTF8",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Options pré-configurées",
		"name": "server_version",
		"setting": "16.0",
		"unit": null,
		"context": "internal",
		"source": "default",
		"boot_val": "16.0",
		"reset_val": "16.0",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Options pré-configurées",
		"name": "server_version_num",
		"setting": "160000",
		"unit": null,
		"context": "internal",
		"source": "default",
		"boot_val": "160000",
		"reset_val": "160000",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions des clients / Préchargement des bibliothèques partagées",
		"name": "session_preload_libraries",
		"setting": "",
		"unit": null,
		"context": "superuser",
		"source": "default",
		"boot_val": "",
		"reset_val": "",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions client / Comportement des instructions",
		"name": "session_replication_role",
		"setting": "origin",
		"unit": null,
		"context": "superuser",
		"source": "default",
		"boot_val": "origin",
		"reset_val": "origin",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Utilisation des ressources / Mémoire",
		"name": "shared_buffers",
		"setting": "16384",
		"unit": "8kB",
		"context": "postmaster",
		"source": "configuration file",
		"boot_val": "16384",
		"reset_val": "16384",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Options pré-configurées",
		"name": "shared_memory_size",
		"setting": "143",
		"unit": "MB",
		"context": "internal",
		"source": "default",
		"boot_val": "0",
		"reset_val": "143",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Options pré-configurées",
		"name": "shared_memory_size_in_huge_pages",
		"setting": "-1",
		"unit": null,
		"context": "internal",
		"source": "default",
		"boot_val": "-1",
		"reset_val": "-1",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Utilisation des ressources / Mémoire",
		"name": "shared_memory_type",
		"setting": "windows",
		"unit": null,
		"context": "postmaster",
		"source": "default",
		"boot_val": "windows",
		"reset_val": "windows",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions des clients / Préchargement des bibliothèques partagées",
		"name": "shared_preload_libraries",
		"setting": "",
		"unit": null,
		"context": "postmaster",
		"source": "default",
		"boot_val": "",
		"reset_val": "",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Connexions et authentification / SSL",
		"name": "ssl",
		"setting": "off",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Connexions et authentification / SSL",
		"name": "ssl_ca_file",
		"setting": "",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "",
		"reset_val": "",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Connexions et authentification / SSL",
		"name": "ssl_cert_file",
		"setting": "server.crt",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "server.crt",
		"reset_val": "server.crt",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Connexions et authentification / SSL",
		"name": "ssl_ciphers",
		"setting": "HIGH:MEDIUM:+3DES:!aNULL",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "HIGH:MEDIUM:+3DES:!aNULL",
		"reset_val": "HIGH:MEDIUM:+3DES:!aNULL",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Connexions et authentification / SSL",
		"name": "ssl_crl_dir",
		"setting": "",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "",
		"reset_val": "",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Connexions et authentification / SSL",
		"name": "ssl_crl_file",
		"setting": "",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "",
		"reset_val": "",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Connexions et authentification / SSL",
		"name": "ssl_dh_params_file",
		"setting": "",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "",
		"reset_val": "",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Connexions et authentification / SSL",
		"name": "ssl_ecdh_curve",
		"setting": "prime256v1",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "prime256v1",
		"reset_val": "prime256v1",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Connexions et authentification / SSL",
		"name": "ssl_key_file",
		"setting": "server.key",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "server.key",
		"reset_val": "server.key",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Options pré-configurées",
		"name": "ssl_library",
		"setting": "OpenSSL",
		"unit": null,
		"context": "internal",
		"source": "default",
		"boot_val": "OpenSSL",
		"reset_val": "OpenSSL",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Connexions et authentification / SSL",
		"name": "ssl_max_protocol_version",
		"setting": "",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "",
		"reset_val": "",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Connexions et authentification / SSL",
		"name": "ssl_min_protocol_version",
		"setting": "TLSv1.2",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "TLSv1.2",
		"reset_val": "TLSv1.2",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Connexions et authentification / SSL",
		"name": "ssl_passphrase_command",
		"setting": "",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "",
		"reset_val": "",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Connexions et authentification / SSL",
		"name": "ssl_passphrase_command_supports_reload",
		"setting": "off",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Connexions et authentification / SSL",
		"name": "ssl_prefer_server_ciphers",
		"setting": "on",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "on",
		"reset_val": "on",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Compatibilité des versions et des plateformes / Anciennes versions de PostgreSQL",
		"name": "standard_conforming_strings",
		"setting": "on",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "on",
		"reset_val": "on",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions client / Comportement des instructions",
		"name": "statement_timeout",
		"setting": "0",
		"unit": "ms",
		"context": "user",
		"source": "default",
		"boot_val": "0",
		"reset_val": "0",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Statistics / Cumulative Query and Index Statistics",
		"name": "stats_fetch_consistency",
		"setting": "cache",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "cache",
		"reset_val": "cache",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Connexions et authentification / Paramétrages de connexion",
		"name": "superuser_reserved_connections",
		"setting": "3",
		"unit": null,
		"context": "postmaster",
		"source": "default",
		"boot_val": "3",
		"reset_val": "3",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Compatibilité des versions et des plateformes / Anciennes versions de PostgreSQL",
		"name": "synchronize_seqscans",
		"setting": "on",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "on",
		"reset_val": "on",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Write-Ahead Log / Paramétrages",
		"name": "synchronous_commit",
		"setting": "on",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "on",
		"reset_val": "on",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Réplication / Serveur primaire",
		"name": "synchronous_standby_names",
		"setting": "",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "",
		"reset_val": "",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Rapports et traces / Où tracer",
		"name": "syslog_facility",
		"setting": "none",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "none",
		"reset_val": "none",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Rapports et traces / Où tracer",
		"name": "syslog_ident",
		"setting": "postgres",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "postgres",
		"reset_val": "postgres",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Rapports et traces / Où tracer",
		"name": "syslog_sequence_numbers",
		"setting": "on",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "on",
		"reset_val": "on",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Rapports et traces / Où tracer",
		"name": "syslog_split_messages",
		"setting": "on",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "on",
		"reset_val": "on",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Connections and Authentication / TCP Settings",
		"name": "tcp_keepalives_count",
		"setting": "10",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "0",
		"reset_val": "0",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Connections and Authentication / TCP Settings",
		"name": "tcp_keepalives_idle",
		"setting": "-1",
		"unit": "s",
		"context": "user",
		"source": "default",
		"boot_val": "0",
		"reset_val": "0",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Connections and Authentication / TCP Settings",
		"name": "tcp_keepalives_interval",
		"setting": "-1",
		"unit": "s",
		"context": "user",
		"source": "default",
		"boot_val": "0",
		"reset_val": "0",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Connections and Authentication / TCP Settings",
		"name": "tcp_user_timeout",
		"setting": "0",
		"unit": "ms",
		"context": "user",
		"source": "default",
		"boot_val": "0",
		"reset_val": "0",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Utilisation des ressources / Mémoire",
		"name": "temp_buffers",
		"setting": "1024",
		"unit": "8kB",
		"context": "user",
		"source": "default",
		"boot_val": "1024",
		"reset_val": "1024",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Utilisation des ressources / Disques",
		"name": "temp_file_limit",
		"setting": "-1",
		"unit": "kB",
		"context": "superuser",
		"source": "default",
		"boot_val": "-1",
		"reset_val": "-1",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions client / Comportement des instructions",
		"name": "temp_tablespaces",
		"setting": "",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "",
		"reset_val": "",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions client / Locale et formattage",
		"name": "TimeZone",
		"setting": "Europe/Paris",
		"unit": null,
		"context": "user",
		"source": "configuration file",
		"boot_val": "GMT",
		"reset_val": "Europe/Paris",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions client / Locale et formattage",
		"name": "timezone_abbreviations",
		"setting": "Default",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": null,
		"reset_val": "Default",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Options pour le développeur",
		"name": "trace_notify",
		"setting": "off",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Options pour le développeur",
		"name": "trace_recovery_messages",
		"setting": "log",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "log",
		"reset_val": "log",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Options pour le développeur",
		"name": "trace_sort",
		"setting": "off",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Statistics / Cumulative Query and Index Statistics",
		"name": "track_activities",
		"setting": "on",
		"unit": null,
		"context": "superuser",
		"source": "default",
		"boot_val": "on",
		"reset_val": "on",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Statistics / Cumulative Query and Index Statistics",
		"name": "track_activity_query_size",
		"setting": "1024",
		"unit": "B",
		"context": "postmaster",
		"source": "default",
		"boot_val": "1024",
		"reset_val": "1024",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Réplication / Serveurs d'envoi",
		"name": "track_commit_timestamp",
		"setting": "off",
		"unit": null,
		"context": "postmaster",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Statistics / Cumulative Query and Index Statistics",
		"name": "track_counts",
		"setting": "on",
		"unit": null,
		"context": "superuser",
		"source": "default",
		"boot_val": "on",
		"reset_val": "on",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Statistics / Cumulative Query and Index Statistics",
		"name": "track_functions",
		"setting": "none",
		"unit": null,
		"context": "superuser",
		"source": "default",
		"boot_val": "none",
		"reset_val": "none",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Statistics / Cumulative Query and Index Statistics",
		"name": "track_io_timing",
		"setting": "off",
		"unit": null,
		"context": "superuser",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Statistics / Cumulative Query and Index Statistics",
		"name": "track_wal_io_timing",
		"setting": "off",
		"unit": null,
		"context": "superuser",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions client / Comportement des instructions",
		"name": "transaction_deferrable",
		"setting": "off",
		"unit": null,
		"context": "user",
		"source": "override",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions client / Comportement des instructions",
		"name": "transaction_isolation",
		"setting": "read committed",
		"unit": null,
		"context": "user",
		"source": "override",
		"boot_val": "read committed",
		"reset_val": "read committed",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions client / Comportement des instructions",
		"name": "transaction_read_only",
		"setting": "off",
		"unit": null,
		"context": "user",
		"source": "override",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Compatibilité des versions et des plateformes / Anciennes plateformes et anciens clients",
		"name": "transform_null_equals",
		"setting": "off",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Connexions et authentification / Paramétrages de connexion",
		"name": "unix_socket_directories",
		"setting": "",
		"unit": null,
		"context": "postmaster",
		"source": "default",
		"boot_val": "",
		"reset_val": "",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Connexions et authentification / Paramétrages de connexion",
		"name": "unix_socket_group",
		"setting": "",
		"unit": null,
		"context": "postmaster",
		"source": "default",
		"boot_val": "",
		"reset_val": "",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Connexions et authentification / Paramétrages de connexion",
		"name": "unix_socket_permissions",
		"setting": "0777",
		"unit": null,
		"context": "postmaster",
		"source": "default",
		"boot_val": "511",
		"reset_val": "511",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Rapports et traces / Titre du processus",
		"name": "update_process_title",
		"setting": "off",
		"unit": null,
		"context": "superuser",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Utilisation des ressources / Mémoire",
		"name": "vacuum_buffer_usage_limit",
		"setting": "256",
		"unit": "kB",
		"context": "user",
		"source": "default",
		"boot_val": "256",
		"reset_val": "256",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Utilisation des ressources / Délai du VACUUM basé sur le coût",
		"name": "vacuum_cost_delay",
		"setting": "0",
		"unit": "ms",
		"context": "user",
		"source": "default",
		"boot_val": "0",
		"reset_val": "0",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Utilisation des ressources / Délai du VACUUM basé sur le coût",
		"name": "vacuum_cost_limit",
		"setting": "200",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "200",
		"reset_val": "200",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Utilisation des ressources / Délai du VACUUM basé sur le coût",
		"name": "vacuum_cost_page_dirty",
		"setting": "20",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "20",
		"reset_val": "20",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Utilisation des ressources / Délai du VACUUM basé sur le coût",
		"name": "vacuum_cost_page_hit",
		"setting": "1",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "1",
		"reset_val": "1",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Utilisation des ressources / Délai du VACUUM basé sur le coût",
		"name": "vacuum_cost_page_miss",
		"setting": "2",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "2",
		"reset_val": "2",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions client / Comportement des instructions",
		"name": "vacuum_failsafe_age",
		"setting": "1600000000",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "1600000000",
		"reset_val": "1600000000",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions client / Comportement des instructions",
		"name": "vacuum_freeze_min_age",
		"setting": "50000000",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "50000000",
		"reset_val": "50000000",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions client / Comportement des instructions",
		"name": "vacuum_freeze_table_age",
		"setting": "150000000",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "150000000",
		"reset_val": "150000000",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions client / Comportement des instructions",
		"name": "vacuum_multixact_failsafe_age",
		"setting": "1600000000",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "1600000000",
		"reset_val": "1600000000",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions client / Comportement des instructions",
		"name": "vacuum_multixact_freeze_min_age",
		"setting": "5000000",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "5000000",
		"reset_val": "5000000",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions client / Comportement des instructions",
		"name": "vacuum_multixact_freeze_table_age",
		"setting": "150000000",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "150000000",
		"reset_val": "150000000",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Options pré-configurées",
		"name": "wal_block_size",
		"setting": "8192",
		"unit": null,
		"context": "internal",
		"source": "default",
		"boot_val": "8192",
		"reset_val": "8192",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Write-Ahead Log / Paramétrages",
		"name": "wal_buffers",
		"setting": "512",
		"unit": "8kB",
		"context": "postmaster",
		"source": "default",
		"boot_val": "-1",
		"reset_val": "512",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Write-Ahead Log / Paramétrages",
		"name": "wal_compression",
		"setting": "off",
		"unit": null,
		"context": "superuser",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Options pour le développeur",
		"name": "wal_consistency_checking",
		"setting": "",
		"unit": null,
		"context": "superuser",
		"source": "default",
		"boot_val": "",
		"reset_val": "",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Write-Ahead Log / Recovery",
		"name": "wal_decode_buffer_size",
		"setting": "524288",
		"unit": "B",
		"context": "postmaster",
		"source": "default",
		"boot_val": "524288",
		"reset_val": "524288",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Write-Ahead Log / Paramétrages",
		"name": "wal_init_zero",
		"setting": "on",
		"unit": null,
		"context": "superuser",
		"source": "default",
		"boot_val": "on",
		"reset_val": "on",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Réplication / Serveurs d'envoi",
		"name": "wal_keep_size",
		"setting": "0",
		"unit": "MB",
		"context": "sighup",
		"source": "default",
		"boot_val": "0",
		"reset_val": "0",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Write-Ahead Log / Paramétrages",
		"name": "wal_level",
		"setting": "replica",
		"unit": null,
		"context": "postmaster",
		"source": "default",
		"boot_val": "replica",
		"reset_val": "replica",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Write-Ahead Log / Paramétrages",
		"name": "wal_log_hints",
		"setting": "off",
		"unit": null,
		"context": "postmaster",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Réplication / Serveurs en attente",
		"name": "wal_receiver_create_temp_slot",
		"setting": "off",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Réplication / Serveurs en attente",
		"name": "wal_receiver_status_interval",
		"setting": "10",
		"unit": "s",
		"context": "sighup",
		"source": "default",
		"boot_val": "10",
		"reset_val": "10",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Réplication / Serveurs en attente",
		"name": "wal_receiver_timeout",
		"setting": "60000",
		"unit": "ms",
		"context": "sighup",
		"source": "default",
		"boot_val": "60000",
		"reset_val": "60000",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Write-Ahead Log / Paramétrages",
		"name": "wal_recycle",
		"setting": "on",
		"unit": null,
		"context": "superuser",
		"source": "default",
		"boot_val": "on",
		"reset_val": "on",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Réplication / Serveurs en attente",
		"name": "wal_retrieve_retry_interval",
		"setting": "5000",
		"unit": "ms",
		"context": "sighup",
		"source": "default",
		"boot_val": "5000",
		"reset_val": "5000",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Options pré-configurées",
		"name": "wal_segment_size",
		"setting": "16777216",
		"unit": "B",
		"context": "internal",
		"source": "default",
		"boot_val": "16777216",
		"reset_val": "16777216",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Réplication / Serveurs d'envoi",
		"name": "wal_sender_timeout",
		"setting": "60000",
		"unit": "ms",
		"context": "user",
		"source": "default",
		"boot_val": "60000",
		"reset_val": "60000",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Write-Ahead Log / Paramétrages",
		"name": "wal_skip_threshold",
		"setting": "2048",
		"unit": "kB",
		"context": "user",
		"source": "default",
		"boot_val": "2048",
		"reset_val": "2048",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Write-Ahead Log / Paramétrages",
		"name": "wal_sync_method",
		"setting": "open_datasync",
		"unit": null,
		"context": "sighup",
		"source": "default",
		"boot_val": "open_datasync",
		"reset_val": "open_datasync",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Write-Ahead Log / Paramétrages",
		"name": "wal_writer_delay",
		"setting": "200",
		"unit": "ms",
		"context": "sighup",
		"source": "default",
		"boot_val": "200",
		"reset_val": "200",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Write-Ahead Log / Paramétrages",
		"name": "wal_writer_flush_after",
		"setting": "128",
		"unit": "8kB",
		"context": "sighup",
		"source": "default",
		"boot_val": "128",
		"reset_val": "128",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Utilisation des ressources / Mémoire",
		"name": "work_mem",
		"setting": "4096",
		"unit": "kB",
		"context": "user",
		"source": "default",
		"boot_val": "4096",
		"reset_val": "4096",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions client / Comportement des instructions",
		"name": "xmlbinary",
		"setting": "base64",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "base64",
		"reset_val": "base64",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions client / Comportement des instructions",
		"name": "xmloption",
		"setting": "content",
		"unit": null,
		"context": "user",
		"source": "default",
		"boot_val": "content",
		"reset_val": "content",
		"pending_restart": false
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Options pour le développeur",
		"name": "zero_damaged_pages",
		"setting": "off",
		"unit": null,
		"context": "superuser",
		"source": "default",
		"boot_val": "off",
		"reset_val": "off",
		"pending_restart": false
	  }
	],
	"dump_nondefault_pgsettings": [
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Rapports et traces / Que tracer",
		"name": "application_name",
		"setting": "STEAN 2.1.0",
		"unit": null,
		"context": "user",
		"source": "client",
		"boot_val": "",
		"reset_val": "STEAN 2.1.0"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions client / Locale et formattage",
		"name": "client_encoding",
		"setting": "UTF8",
		"unit": null,
		"context": "user",
		"source": "client",
		"boot_val": "SQL_ASCII",
		"reset_val": "UTF8"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions client / Locale et formattage",
		"name": "DateStyle",
		"setting": "ISO, DMY",
		"unit": null,
		"context": "user",
		"source": "configuration file",
		"boot_val": "ISO, MDY",
		"reset_val": "ISO, DMY"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions client / Locale et formattage",
		"name": "default_text_search_config",
		"setting": "pg_catalog.french",
		"unit": null,
		"context": "user",
		"source": "configuration file",
		"boot_val": "pg_catalog.simple",
		"reset_val": "pg_catalog.french"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions client / Locale et formattage",
		"name": "lc_messages",
		"setting": "French_France.1252",
		"unit": null,
		"context": "superuser",
		"source": "configuration file",
		"boot_val": "",
		"reset_val": "French_France.1252"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions client / Locale et formattage",
		"name": "lc_monetary",
		"setting": "French_France.1252",
		"unit": null,
		"context": "user",
		"source": "configuration file",
		"boot_val": "C",
		"reset_val": "French_France.1252"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions client / Locale et formattage",
		"name": "lc_numeric",
		"setting": "French_France.1252",
		"unit": null,
		"context": "user",
		"source": "configuration file",
		"boot_val": "C",
		"reset_val": "French_France.1252"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions client / Locale et formattage",
		"name": "lc_time",
		"setting": "French_France.1252",
		"unit": null,
		"context": "user",
		"source": "configuration file",
		"boot_val": "C",
		"reset_val": "French_France.1252"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Connexions et authentification / Paramétrages de connexion",
		"name": "listen_addresses",
		"setting": "*",
		"unit": null,
		"context": "postmaster",
		"source": "configuration file",
		"boot_val": "localhost",
		"reset_val": "*"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Rapports et traces / Où tracer",
		"name": "log_file_mode",
		"setting": "0640",
		"unit": null,
		"context": "sighup",
		"source": "configuration file",
		"boot_val": "384",
		"reset_val": "416"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Rapports et traces / Que tracer",
		"name": "log_timezone",
		"setting": "Europe/Paris",
		"unit": null,
		"context": "sighup",
		"source": "configuration file",
		"boot_val": "GMT",
		"reset_val": "Europe/Paris"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Rapports et traces / Où tracer",
		"name": "logging_collector",
		"setting": "on",
		"unit": null,
		"context": "postmaster",
		"source": "configuration file",
		"boot_val": "off",
		"reset_val": "on"
	  },
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"category": "Valeurs par défaut pour les connexions client / Locale et formattage",
		"name": "TimeZone",
		"setting": "Europe/Paris",
		"unit": null,
		"context": "user",
		"source": "configuration file",
		"boot_val": "GMT",
		"reset_val": "Europe/Paris"
	  }
	],
	"dump_pgdbrolesetting": [],
	"dump_unlogged": [],
	"dump_pgstatarchiver": [
	  {
		"date_trunc": "2023-10-26T08:59:20.000Z",
		"archived_count": "0",
		"last_archived_wal": null,
		"last_archived_time": null,
		"failed_count": "0",
		"last_failed_wal": null,
		"last_failed_time": null,
		"stats_reset": "2023-09-29T15:38:29.275Z"
	  }
	],
	"dump_preparedxactstats": [],
	"dump_statisticsext": []
  };

console.log(test["dump_pgdatabase_size"].filter(e => e.datname=== "mario")[0]["size"]);