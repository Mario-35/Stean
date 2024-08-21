/* function datastreams Update Insert */
CREATE OR REPLACE FUNCTION datastreams_update_insert() RETURNS TRIGGER 
 LANGUAGE PLPGSQL
AS $$
DECLARE 
    "DS_ROW" RECORD;
    queryset TEXT := '';
    delimitr char(1) := ' ';
BEGIN
  IF (NEW."datastream_id" is not null) 
    THEN SELECT "id", "_phenomenonTimeStart", "_phenomenonTimeEnd", "_resultTimeStart", "_resultTimeEnd" INTO "DS_ROW" FROM "datastream" WHERE "datastream"."id" = NEW."datastream_id";
        
    IF ( NEW."phenomenonTime" < "DS_ROW"."_phenomenonTimeStart" OR "DS_ROW"."_phenomenonTimeStart" IS NULL ) 
      THEN queryset := queryset || delimitr || '"_phenomenonTimeStart" = $1."phenomenonTime"';
      delimitr := ',';
    END IF;

    IF ( coalesce( NEW."phenomenonTime", NEW."resultTime" ) > "DS_ROW"."_phenomenonTimeEnd" OR "DS_ROW"."_phenomenonTimeEnd" IS NULL ) 
      THEN queryset := queryset || delimitr || '"_phenomenonTimeEnd" = coalesce($1."phenomenonTime", $1."resultTime")';
      delimitr := ',';
    END IF;

    IF (NEW."resultTime" is not null) 
      THEN IF ( NEW."resultTime" < "DS_ROW"."_resultTimeStart" OR "DS_ROW"."_resultTimeStart" IS NULL ) 
        THEN queryset := queryset || delimitr || '"_resultTimeStart" = $1."resultTime"';
        delimitr := ',';
      END IF;

      IF ( NEW."resultTime" > "DS_ROW"."_resultTimeEnd" OR "DS_ROW"."_resultTimeEnd" IS NULL ) 
        THEN queryset := queryset || delimitr || '"_resultTimeEnd" = $1."resultTime"';
        delimitr := ',';
      END IF;
    END IF;

    IF (delimitr = ',') 
      THEN EXECUTE 'update "datastream" SET ' || queryset || ' where "datastream"."id"=$1."datastream_id"' using NEW;
    END IF;
    RETURN new;
  END IF;

  /* START 'multiDatastream' */
  IF (NEW."multidatastream_id" is not null) 
    THEN SELECT "id", "_phenomenonTimeStart", "_phenomenonTimeEnd", "_resultTimeStart", "_resultTimeEnd" INTO "DS_ROW" FROM "multidatastream" WHERE "multidatastream"."id" = NEW."multidatastream_id";
        
    IF ( NEW."phenomenonTime" < "DS_ROW"."_phenomenonTimeStart" OR "DS_ROW"."_phenomenonTimeStart" IS NULL ) 
      THEN queryset := queryset || delimitr || '"_phenomenonTimeStart" = $1."phenomenonTime"';
      delimitr := ',';
    END IF;

    IF ( coalesce( NEW."phenomenonTime", NEW."resultTime" ) > "DS_ROW"."_phenomenonTimeEnd" OR "DS_ROW"."_phenomenonTimeEnd" IS NULL ) 
      THEN queryset := queryset || delimitr || '"_phenomenonTimeEnd" = coalesce($1."phenomenonTime", $1."resultTime")';
      delimitr := ',';
    END IF;

    IF (NEW."resultTime" is not null) 
      THEN IF ( NEW."resultTime" < "DS_ROW"."_resultTimeStart" OR "DS_ROW"."_resultTimeStart" IS NULL ) 
        THEN queryset := queryset || delimitr || '"_resultTimeStart" = $1."resultTime"';
        delimitr := ',';
      END IF;

      IF ( NEW."resultTime" > "DS_ROW"."_resultTimeEnd" OR "DS_ROW"."_resultTimeEnd" IS NULL ) 
        THEN queryset := queryset || delimitr || '"_resultTimeEnd" = $1."resultTime"';
        delimitr := ',';
      END IF;
    END IF;

    IF (delimitr = ',') 
      THEN EXECUTE 'update "multidatastream" SET ' || queryset || ' where "multidatastream"."id"=$1."multidatastream_id"' using NEW;
    END IF;
    RETURN new;
  END IF;
  /* END 'multiDatastream' */
    
  RETURN new;
END;
$$