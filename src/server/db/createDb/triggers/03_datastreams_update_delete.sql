/* Trigger for function datastreams Update Delete */
CREATE OR REPLACE FUNCTION datastreams_update_delete() RETURNS TRIGGER 
 LANGUAGE PLPGSQL
AS $$
DECLARE 
  "DS_ROW" "datastream"%rowtype;
  "MULTIDS_ROW" "multidatastream"%rowtype;
  queryset TEXT := '';
  delimitr char(1) := ' ';
BEGIN

  IF (OLD."datastream_id" is not null) THEN 
    SELECT * INTO "DS_ROW" FROM "datastream" WHERE "datastream"."id"=OLD."datastream_id";

    IF (OLD."phenomenonTime" = "DS_ROW"."_phenomenonTimeStart" OR coalesce(OLD."phenomenonTime", OLD."resultTime") = "DS_ROW"."_phenomenonTimeEnd") THEN
          queryset := queryset || delimitr || '"_phenomenonTimeStart" = (select min("phenomenonTime") from "observation" where "observation"."datastream_id" = $1."datastream_id")';
          delimitr := ',';
          queryset := queryset || delimitr || '"_phenomenonTimeEnd" = (select max(coalesce("phenomenonTime", "resultTime")) from "observation" where "observation"."datastream_id" = $1."datastream_id")';
    END IF;

    IF (OLD."resultTime" = "DS_ROW"."_resultTimeStart") THEN
        queryset := queryset || delimitr || '"_resultTimeStart" = (select min("resultTime") from "observation" where "observation"."datastream_id" = $1."datastream_id")';
        delimitr := ',';
    END IF;

    IF (OLD."resultTime" = "DS_ROW"."_resultTimeEnd") THEN
        queryset := queryset || delimitr || '"_resultTimeEnd" = (select max("resultTime") from "observation" where "observation"."datastream_id" = $1."datastream_id")';
        delimitr := ',';
    END IF;

    IF (delimitr = ',') THEN
        EXECUTE 'update "datastream" SET ' || queryset ||  ' where "datastream"."id"=$1."datastream_id"' using OLD;
    END IF;
  END IF;    
  /* START 'multiDatastream' */
  IF (OLD."multidatastream_id" is not null) THEN 
    SELECT * INTO "MULTIDS_ROW" FROM "multidatastream" WHERE "multidatastream"."id"=OLD."multidatastream_id";

    IF (OLD."phenomenonTime" = "MULTIDS_ROW"."_phenomenonTimeStart" OR coalesce(OLD."phenomenonTime", OLD."resultTime") = "MULTIDS_ROW"."_phenomenonTimeEnd") THEN
          queryset := queryset || delimitr || '"_phenomenonTimeStart" = (select min("phenomenonTime") from "observation" where "observation"."multidatastream_id" = $1."multidatastream_id")';
          delimitr := ',';
          queryset := queryset || delimitr || '"_phenomenonTimeEnd" = (select max(coalesce("phenomenonTime", "resultTime")) from "observation" where "observation"."multidatastream_id" = $1."multidatastream_id")';
    END IF;

    IF (OLD."resultTime" = "MULTIDS_ROW"."_resultTimeStart") THEN
        queryset := queryset || delimitr || '"_resultTimeStart" = (select min("resultTime") from "observation" where "observation"."multidatastream_id" = $1."multidatastream_id")';
        delimitr := ',';
    END IF;

    IF (OLD."resultTime" = "MULTIDS_ROW"."_resultTimeEnd") THEN
        queryset := queryset || delimitr || '"_resultTimeEnd" = (select max("resultTime") from "observation" where "observation"."multidatastream_id" = $1."multidatastream_id")';
        delimitr := ',';
    END IF;

    IF (delimitr = ',') THEN
        EXECUTE 'update "multidatastream" SET ' || queryset ||  ' where "multidatastream"."id"=$1."multidatastream_id"' using OLD;
    END IF;
  END IF; 
  /* END 'multiDatastream' */
  RETURN NULL;
END;
$$