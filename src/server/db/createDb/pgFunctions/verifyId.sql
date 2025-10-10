/* function verifyId */
CREATE OR REPLACE FUNCTION verifyId(_tbl varchar, searchId NUMERIC)
RETURNS NUMERIC
  AS
    $body$
    declare
    id_return NUMERIC;
    BEGIN
        EXECUTE 'select 1 FROM ' || quote_ident(_tbl) || ' WHERE ' || quote_ident(_tbl) || '.id = ' || searchId || '' INTO id_return;
        if id_return then return searchId; 
            else RAISE invalid_foreign_key USING MESSAGE = 'exist no ' || _tbl || ' ID --> ' || searchId || '';
        end if;
    END;
    $body$
  LANGUAGE 'plpgsql'
  VOLATILE;
  
