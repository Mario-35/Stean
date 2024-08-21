/* function datastreams Update update */
CREATE OR REPLACE FUNCTION datastreams_update_update() RETURNS TRIGGER 
 LANGUAGE PLPGSQL
AS $$
DECLARE 
    "DS_ROW" "datastream"%rowtype;
    "MULTIDS_ROW" "multidatastream"%rowtype;
    queryset TEXT := '';
    delimitr char(1) := ' ';
BEGIN
    IF (NEW."datastream_id" is not null) 
        THEN
            IF (NEW."phenomenonTime" != OLD."phenomenonTime" OR NEW."resultTime" != OLD."resultTime") THEN
                for "DS_ROW" IN SELECT * FROM "datastream" WHERE "id"=NEW."datastream_id"
                LOOP
                    IF (NEW."phenomenonTime"<"DS_ROW"."_phenomenonTimeStart") THEN
                        queryset := queryset || delimitr || '"_phenomenonTimeStart" = $1."phenomenonTime"';
                        delimitr := ',';
                    elseIF (OLD."resultTime" = "DS_ROW"."_phenomenonTimeStart") THEN
                        queryset := queryset || delimitr || '"_phenomenonTimeStart" = (select min("phenomenonTime") from "observation" where "observation"."datastream_id" = $1."datastream_id")';
                        delimitr := ',';
                    END IF;
                    IF (coalesce(NEW."phenomenonTime", NEW."resultTime") > "DS_ROW"."_phenomenonTimeEnd") THEN
                        queryset := queryset || delimitr || '"_phenomenonTimeEnd" = coalesce($1."phenomenonTime", $1."resultTime")';
                        delimitr := ',';
                    elseIF (coalesce(OLD."phenomenonTime", OLD."resultTime") = "DS_ROW"."_phenomenonTimeEnd") THEN
                        queryset := queryset || delimitr || '"_phenomenonTimeEnd" = (select max(coalesce("phenomenonTime", "resultTime")) from "observation" where "observation"."datastream_id" = $1."datastream_id")';
                        delimitr := ',';
                    END IF;
                END LOOP;
            END IF;


            IF (NEW."resultTime" != OLD."resultTime") THEN
                for "DS_ROW" IN SELECT * FROM "datastream" WHERE "id"=NEW."datastream_id"
                LOOP
                    IF (NEW."resultTime" < "DS_ROW"."_resultTimeStart") THEN
                        queryset := queryset || delimitr || '"_resultTimeStart" = $1."resultTime"';
                        delimitr := ',';
                    elseIF (OLD."resultTime" = "DS_ROW"."_resultTimeStart") THEN
                        queryset := queryset || delimitr || '"_resultTimeStart" = (select min("resultTime") from "observation" where "observation"."datastream_id" = $1."datastream_id")';
                        delimitr := ',';
                    END IF;
                    IF (NEW."resultTime" > "DS_ROW"."_resultTimeEnd") THEN
                        queryset := queryset || delimitr || '"_resultTimeEnd" = $1."resultTime"';
                        delimitr := ',';
                    elseIF (OLD."resultTime" = "DS_ROW"."_resultTimeEnd") THEN
                        queryset := queryset || delimitr || '"_resultTimeEnd" = (select max("resultTime") from "observation" where "observation"."datastream_id" = $1."datastream_id")';
                        delimitr := ',';
                    END IF;
                END LOOP;
            END IF;

            IF (delimitr = ',') THEN
                EXECUTE 'update "datastream" SET ' || queryset ||  ' where "datastream"."id"=$1."datastream_id"' using NEW;
            END IF;
    END IF;
    /* START 'multiDatastream' */
    IF (NEW."multidatastream_id" is not null) 
        THEN
            IF (NEW."phenomenonTime" != OLD."phenomenonTime" OR NEW."resultTime" != OLD."resultTime") THEN
                for "MULTIDS_ROW" IN SELECT * FROM "multidatastream" WHERE "id"=NEW."multidatastream_id"
                LOOP
                    IF (NEW."phenomenonTime"<"MULTIDS_ROW"."_phenomenonTimeStart") THEN
                        queryset := queryset || delimitr || '"_phenomenonTimeStart" = $1."phenomenonTime"';
                        delimitr := ',';
                    elseIF (OLD."resultTime" = "MULTIDS_ROW"."_phenomenonTimeStart") THEN
                        queryset := queryset || delimitr || '"_phenomenonTimeStart" = (select min("phenomenonTime") from "observation" where "observation"."multidatastream_id" = $1."multidatastream_id")';
                        delimitr := ',';
                    END IF;
                    IF (coalesce(NEW."phenomenonTime", NEW."resultTime") > "MULTIDS_ROW"."_phenomenonTimeEnd") THEN
                        queryset := queryset || delimitr || '"_phenomenonTimeEnd" = coalesce($1."phenomenonTime", $1."resultTime")';
                        delimitr := ',';
                    elseIF (coalesce(OLD."phenomenonTime", OLD."resultTime") = "MULTIDS_ROW"."_phenomenonTimeEnd") THEN
                        queryset := queryset || delimitr || '"_phenomenonTimeEnd" = (select max(coalesce("phenomenonTime", "resultTime")) from "observation" where "observation"."multidatastream_id" = $1."multidatastream_id")';
                        delimitr := ',';
                    END IF;
                END LOOP;
            END IF;


            IF (NEW."resultTime" != OLD."resultTime") THEN
                for "MULTIDS_ROW" IN SELECT * FROM "multidatastream" WHERE "id"=NEW."multidatastream_id"
                LOOP
                    IF (NEW."resultTime" < "MULTIDS_ROW"."_resultTimeStart") THEN
                        queryset := queryset || delimitr || '"_resultTimeStart" = $1."resultTime"';
                        delimitr := ',';
                    elseIF (OLD."resultTime" = "MULTIDS_ROW"."_resultTimeStart") THEN
                        queryset := queryset || delimitr || '"_resultTimeStart" = (select min("resultTime") from "observation" where "observation"."multidatastream_id" = $1."multidatastream_id")';
                        delimitr := ',';
                    END IF;
                    IF (NEW."resultTime" > "MULTIDS_ROW"."_resultTimeEnd") THEN
                        queryset := queryset || delimitr || '"_resultTimeEnd" = $1."resultTime"';
                        delimitr := ',';
                    elseIF (OLD."resultTime" = "MULTIDS_ROW"."_resultTimeEnd") THEN
                        queryset := queryset || delimitr || '"_resultTimeEnd" = (select max("resultTime") from "observation" where "observation"."multidatastream_id" = $1."multidatastream_id")';
                        delimitr := ',';
                    END IF;
                END LOOP;
            END IF;

            IF (delimitr = ',') THEN
                EXECUTE 'update "multidatastream" SET ' || queryset ||  ' where "multidatastream"."id"=$1."multidatastream_id"' using NEW;
            END IF;
    END IF;
    /* END 'multiDatastream' */    
    RETURN NEW;
END;
$$