/* function dates_bound Name */
CREATE OR REPLACE FUNCTION dates_bound(_tbl text, _nb int, _col text, _format text)
returns text
  AS
    $func$
	  DECLARE retDate text;
    BEGIN
		  EXECUTE format('SELECT NULLIF (CONCAT_WS(''/'', to_char(MIN(%1$s),''%3$s''),  to_char(MAX(%1$s),''%3$s'')), '''') FROM %2$s', quote_ident(_col), quote_ident(_tbl || _nb), _format) into retDate;
		  RETURN retDate;
    END;
   $func$
  LANGUAGE 'plpgsql'
  VOLATILE;