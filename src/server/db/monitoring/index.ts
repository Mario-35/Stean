/**
 * monitoring Index.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { config } from "../../configuration";
import { EConstant } from "../../enums";
import { asyncForEach } from "../../helpers";
import { log } from "../../log";
import { Iservice } from "../../types";
export const getMetrics = async (service: Iservice): Promise<string[] | { [key: string]: any }> => {
    console.log(log.whereIam());
    const username = "postgres";
    const type = "all";
    const lto = 3 * 1000;
    const metrics: Record<string, any> = {
        versionFull: "select version()",
        version: `SELECT split_part(split_part((SELECT version()), ',', 1), ' ', 2) AS version`,
        get_extensions: `select array(SELECT extname||'-'||extversion AS extension FROM pg_extension) AS extension`,
        get_databases: "SELECT datname FROM pg_database WHERE NOT datistemplate AND datallowconn",
        get_uptime: "SELECT pg_postmaster_start_time()",
        get_schemas: `SELECT nspname FROM pg_namespace WHERE nspname !~ '^pg_' AND nspname <> 'information_schema'`,
        get_json_cols: `SELECT c.relname||'.'||a.attname FROM pg_attribute a JOIN pg_class c ON (a.attrelid=c.relfilenode) WHERE a.atttypid = 114`,
        get_partitionned_tables: `SELECT p.oid, quote_ident(pn.nspname) || '.' || quote_ident(p.relname), quote_ident(cn.nspname) || '.' || quote_ident(c.relname), con.conkey, CASE WHEN t.oid IS NOT NULL THEN 'Trigger' WHEN r.oid IS NOT NULL THEN 'Rule' ELSE 'Unknown' END, count(*) OVER (PARTITION BY p.oid) FROM pg_inherits i JOIN pg_class p ON p.oid = i.inhparent JOIN pg_namespace pn ON pn.oid = p.relnamespace JOIN pg_class c ON c.oid = i.inhrelid JOIN pg_namespace cn ON cn.oid = p.relnamespace JOIN pg_constraint con ON con.conrelid= c.oid AND con.contype = 'c' LEFT JOIN pg_trigger t ON t.tgrelid = p.oid LEFT JOIN pg_rewrite r ON r.ev_class = p.oid `,
        get_partitionned_implementation: `SELECT DISTINCT CASE WHEN pro.oid IS NOT NULL THEN pro.prosrc WHEN r.oid IS NOT NULL THEN pg_get_ruledef(r.oid) ELSE 'Unknown' END FROM pg_inherits i JOIN pg_class p ON p.oid = i.inhparent JOIN pg_namespace pn ON pn.oid = p.relnamespace LEFT JOIN pg_trigger t ON t.tgrelid = p.oid LEFT JOIN pg_proc pro ON pro.oid = t.tgfoid LEFT JOIN pg_rewrite r ON r.ev_class = p.oid WHERE p.oid = r.oid`,
        has_pg_buffercache: `SELECT proname FROM pg_proc WHERE proname = 'pg_buffercache_pages';`,
        is_superuser: `SELECT 1 FROM pg_user WHERE pg_user.usename='${username}' AND usesuper`,
        dump_pgstatactivity: ` SELECT date_trunc('seconds', now()), datid, datname, pid, usesysid, usename, application_name, client_addr, client_hostname, client_port, date_trunc('seconds', backend_start) AS backend_start, date_trunc('seconds', xact_start) AS xact_start, date_trunc('seconds', query_start) AS query_start, state_change, wait_event, "query" FROM pg_stat_activity WHERE application_name != '${EConstant.appName}'`,
        dump_pgstatbgwriter: `SELECT date_trunc('seconds', now()), checkpoints_timed, checkpoints_req,  checkpoint_write_time, checkpoint_sync_time, buffers_checkpoint, buffers_clean, maxwritten_clean, buffers_backend, buffers_backend_fsync, buffers_alloc, date_trunc('seconds', stats_reset) AS stats_reset FROM pg_stat_bgwriter`,
        dump_pgstatdatabase: `SELECT date_trunc('seconds', now()), datid, datname, numbackends, xact_commit, xact_rollback, blks_read, blks_hit, tup_returned, tup_fetched, tup_inserted, tup_updated, tup_deleted, conflicts, date_trunc('seconds', stats_reset) AS stats_reset, temp_files, temp_bytes, deadlocks, blk_read_time, blk_write_time FROM pg_stat_database`,
        dump_pgtablespace_size: `SELECT date_trunc('seconds', now()), spcname, pg_tablespace_size(spcname), CASE WHEN pg_tablespace_location(oid) = '' THEN CASE WHEN spcname = 'pg_default' THEN (select setting from pg_settings where name='data_directory')||'/base' ELSE (select setting from pg_settings where name='data_directory')||'/global' END ELSE pg_tablespace_location(oid) END AS tablespace_location FROM pg_tablespace`,
        dump_pgstatdatabaseconflicts: `SELECT date_trunc('seconds', now()), * FROM pg_stat_database_conflicts`,
        dump_pgstattables: ` SELECT date_trunc('seconds', now()), current_database(), relid, schemaname, relname, seq_scan, seq_tup_read, idx_scan, idx_tup_fetch, n_tup_ins, n_tup_upd, n_tup_del, n_tup_hot_upd, n_live_tup, n_dead_tup, date_trunc('seconds', last_vacuum) AS last_vacuum, date_trunc('seconds', last_autovacuum) AS last_autovacuum, date_trunc('seconds',last_analyze) AS last_analyze, date_trunc('seconds',last_autoanalyze) AS last_autoanalyze, vacuum_count, autovacuum_count, analyze_count, autoanalyze_count FROM pg_stat_${type}_tables WHERE schemaname <> 'information_schema'`,
        dump_pgstatindexes: `SELECT date_trunc('seconds', now()), current_database(), *  FROM pg_stat_all_indexes WHERE schemaname <> 'information_schema'`,
        dump_pgstatiotables: `SELECT date_trunc('seconds', now()), current_database(), * FROM pg_statio_all_tables WHERE schemaname <> 'information_schema'`,
        dump_pgstatioindexes: `SELECT date_trunc('seconds', now()), current_database(), * FROM pg_statio_all_indexes WHERE schemaname <> 'information_schema'`,
        dump_pgstatiosequences: `SELECT date_trunc('seconds', now()), current_database(), * FROM pg_statio_all_sequences WHERE schemaname <> 'information_schema'`,
        dump_pgstatuserfunctions: `SELECT date_trunc('seconds', now()), current_database(), * FROM pg_stat_user_functions WHERE schemaname <> 'information_schema'`,
        dump_pgclass_size: `SELECT date_trunc('seconds', now()), current_database(), n.nspname, c.relname, c.relkind, c.reltuples, c.relpages, pg_relation_size(c.oid) FROM pg_class c, pg_namespace n WHERE n.oid=c.relnamespace AND n.nspname <> 'information_schema' AND n.nspname <> 'pg_catalog' `,
        dump_xlog_stat: ` SELECT date_trunc('seconds', now()), count(*) AS num_file, pg_walfile_name(pg_current_wal_lsn()) AS current, sum(is_recycled::int) AS is_recycled, sum((NOT is_recycled)::int) AS written, max_wal FROM ( SELECT file > first_value(file) OVER w AS is_recycled, (select setting from pg_settings where name = 'max_wal_size')::float4 AS max_wal FROM pg_ls_waldir()AS file WHERE file.name~ '^[0-9A-F]{24}\$' WINDOW w AS ( ORDER BY file.modification DESC ) ) AS t GROUP BY 6 `,
        dump_pgdatabase_size: `SELECT date_trunc('seconds', now()), datid, datname, pg_database_size(datid) AS size FROM pg_stat_database WHERE datid > 0`,
        dump_pgstatconnections: `SELECT date_trunc('seconds', now()), COUNT(*) AS total, coalesce(SUM((state NOT LIKE 'idle%')::integer), 0) AS active, coalesce(SUM((wait_event_type='Lock' AND wait_event='tuple')::integer), 0) AS waiting, coalesce(SUM((state = 'idle in transaction')::integer), 0) AS idle_in_xact, pg_database.datname AS datname FROM pg_stat_activity JOIN pg_database ON (pg_database.oid=pg_stat_activity.datid) WHERE pid <> pg_backend_pid() GROUP BY pg_database.datname`,
        dump_pgstatlocktypes: `SELECT date_trunc('seconds', now()), current_database(), 'lock_type'::text AS label, locktype, count(locktype) AS count FROM pg_locks GROUP BY locktype`,
        dump_pgstatlockmodes: `SELECT date_trunc('seconds', now()), current_database(), 'lock_mode'::text AS label, mode, count(mode) AS count FROM pg_locks GROUP BY mode`,
        dump_pgstatlockgranted: `SELECT date_trunc('seconds', now()), current_database(), 'lock_granted'::text AS label, granted, count(granted) AS count FROM pg_locks GROUP BY granted`,
        dump_pgstatxactuserfunctions: `SELECT date_trunc('seconds', now()), * FROM pg_stat_xact_user_functions WHERE schemaname <> 'information_schema'`,
        dump_pgstatxacttables: `SELECT date_trunc('seconds', now()), * FROM pg_stat_xact_${type}_tables WHERE schemaname <> 'information_schema'`,
        get_proc_name: `SELECT n.nspname||'.'||p.proname FROM pg_proc p, pg_namespace n WHERE p.pronamespace=n.oid AND n.nspname NOT IN ('pg_catalog', 'information_schema')`,
        get_proc_count: `SELECT count(p.proname) FROM pg_proc p, pg_namespace n WHERE p.pronamespace=n.oid AND n.nspname NOT IN ('pg_catalog', 'information_schema')`,
        get_triggers: `SELECT count(tgname) FROM pg_trigger WHERE NOT tgisinternal`,
        dump_unusedindexes: `SELECT date_trunc('seconds', now()), current_database(), schemaname, relname, indexrelname, regexp_replace(pg_get_indexdef(pg_stat_user_indexes.indexrelid), E'[\\\\n\\\\r]+', ' ', 'g') FROM pg_stat_user_indexes INNER JOIN pg_index ON pg_index.indexrelid = pg_stat_user_indexes.indexrelid WHERE NOT indexrelname ILIKE 'fki%%' AND NOT indisprimary AND NOT indisunique AND idx_scan = 0 AND NOT indisexclusion`,
        dump_redundantindexes: `SELECT date_trunc('seconds', now()), current_database(), regexp_replace(pg_get_indexdef(indexrelid), E'[\\\\n\\\\r]+', ' ', 'g') AS contained, regexp_replace(pg_get_indexdef(index_backward), E'[\\\\n\\\\r]+', ' ', 'g') AS container FROM ( SELECT indexrelid, indrelid, array_to_string(indkey,'+') AS colindex, indisunique AS is_unique, lag(array_to_string(indkey,'+')) OVER search_window AS colindexbackward, lag(indexrelid) OVER search_window AS index_backward, lag(indisunique) OVER search_window AS is_unique_backward FROM pg_index WINDOW search_window AS (PARTITION BY indrelid ORDER BY array_to_string(indkey,'+') DESC, length(regexp_replace(pg_get_indexdef(indexrelid), E'[\\n\\r]+', ' ', 'g'))) ) AS tmp WHERE (colindexbackward LIKE (colindex || '+%') OR colindexbackward = colindex) AND (is_unique_backward <> is_unique OR (not is_unique_backward AND NOT is_unique)) AND NOT is_unique AND coalesce(regexp_match(pg_get_indexdef(indexrelid), ' (WHERE .*)')::text, 'A') = coalesce(regexp_match(pg_get_indexdef(index_backward), ' (WHERE .*)')::text, 'A')`,
        dump_invalidindexes: `SELECT date_trunc('seconds', now()), current_database(), schemaname, relname, indexrelname, regexp_replace(pg_get_indexdef(pg_stat_user_indexes.indexrelid), E'[\\\\n\\\\r]+', ' ', 'g') FROM pg_stat_user_indexes INNER JOIN pg_index ON pg_index.indexrelid = pg_stat_user_indexes.indexrelid WHERE NOT pg_index.indisvalid`,
        dump_hashindexes: `WITH indexes AS ( SELECT date_trunc('seconds', now()), current_database(), schemaname,relname, indexrelname, regexp_replace(pg_get_indexdef(pg_stat_user_indexes.indexrelid), E'[\\\\n\\\\r]+', ' ', 'g') AS indexdef FROM pg_stat_user_indexes INNER JOIN pg_index ON pg_index.indexrelid = pg_stat_user_indexes.indexrelid) SELECT * from indexes where indexdef like '%%USING hash (%'`,
        dump_count_indexes: `SELECT date_trunc('seconds', now()), current_database(), pg_stat_user_tables.schemaname, pg_stat_user_tables.relname, count(pg_stat_user_indexes.indexrelid) AS number_of_indexes FROM pg_stat_user_tables lEFT JOIN pg_stat_user_indexes ON pg_stat_user_indexes.schemaname = pg_stat_user_tables.schemaname AND pg_stat_user_indexes.relname = pg_stat_user_tables.relname GROUP BY pg_stat_user_tables.schemaname, pg_stat_user_tables.relname`,
        dump_unusedtrigfunc: `SELECT date_trunc('seconds', now()), current_database(), c.nspname, a.proname FROM pg_proc a JOIN pg_type b ON a.prorettype = b.oid JOIN pg_namespace c ON a.pronamespace = c.oid WHERE a.prokind = 'f' AND b.typname = 'trigger' AND c.nspname NOT IN ('pg_catalog', 'information_schema') AND a.proname NOT IN (SELECT funcname FROM pg_stat_user_functions)`,
        dump_pgsettings: `SELECT date_trunc('seconds', now()), category, name, (CASE WHEN name = 'lock_timeout' THEN (setting::bigint-${lto})::text ELSE setting END) AS setting, unit, context, source, boot_val, (CASE WHEN name = 'lock_timeout' THEN (reset_val::bigint-${lto})::text ELSE reset_val END) AS reset_val, pending_restart FROM pg_settings`,
        dump_nondefault_pgsettings: `SELECT date_trunc('seconds', now()), category, name, setting, unit, context, source, boot_val, reset_val FROM pg_settings WHERE source != 'default' AND source != 'override' AND setting != boot_val`,
        dump_pgdbrolesetting: `SELECT date_trunc('seconds', now()), b.datname, c.rolname, a.setconfig FROM pg_db_role_setting a LEFT JOIN pg_database b ON (a.setdatabase=b.oid) LEFT JOIN pg_roles c ON (a.setrole=c.oid)`,
        dump_unlogged: `SELECT date_trunc('seconds', now()), current_database(), n.nspname, c.relname, c.relkind FROM pg_class c, pg_namespace n WHERE n.oid=c.relnamespace AND c.relpersistence='u' and n.nspname != 'pg_toast' and c.relkind = 'r'`,
        dump_pgstatarchiver: `SELECT date_trunc('seconds', now()), archived_count, last_archived_wal, last_archived_time, failed_count, last_failed_wal, last_failed_time, stats_reset FROM pg_stat_archiver`,
        dump_preparedxactstats: `SELECT date_trunc('seconds', now()), database, count(*) AS num_prepared, max(coalesce(extract('epoch' FROM date_trunc('second', current_timestamp-prepared)), 0)) oldest FROM pg_prepared_xacts GROUP BY database`,
        dump_statisticsext: `SELECT date_trunc('seconds', now()), current_database(), cn.nspname AS schemaname, c.relname AS tablename, sn.nspname AS stat_schemaname, s.stxname AS stat_name, pg_get_userbyid(s.stxowner) AS stat_owner, (SELECT array_agg(a.attname ORDER BY a.attnum) AS array_agg FROM unnest(s.stxkeys) k(k) JOIN pg_attribute a ON a.attrelid = s.stxrelid AND a.attnum = k.k) AS attnames, s.stxkind AS kinds FROM pg_statistic_ext s JOIN pg_class c ON c.oid = s.stxrelid LEFT JOIN pg_namespace cn ON cn.oid = c.relnamespace LEFT JOIN pg_namespace sn ON sn.oid = s.stxnamespace WHERE NOT (EXISTS (SELECT 1 FROM unnest(s.stxkeys) k(k) JOIN pg_attribute a ON a.attrelid = s.stxrelid AND a.attnum = k.k WHERE NOT has_column_privilege(c.oid, a.attnum, 'select'::text))) AND (c.relrowsecurity = false OR NOT row_security_active(c.oid))`
    };
    let res: Record<string, any> = {};
    await asyncForEach(Object.keys(metrics), async (operation: string) => {
        if (metrics[operation])
            await config
                .connection(service.name)
                .unsafe(`${metrics[operation]}`)
                .then((result) => {
                    res[operation] = result.length === 1 ? Object.values(result[0])[0] : result;
                })
                .catch((err) => {
                    console.log(err);
                });
    });
    return res;
};
