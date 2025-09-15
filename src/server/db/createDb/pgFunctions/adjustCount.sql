
/* function adjust_count */
CREATE OR REPLACE FUNCTION adjust_count()
RETURNS TRIGGER AS
$$
   DECLARE
   BEGIN
   IF TG_OP = 'INSERT' THEN
      EXECUTE 'UPDATE row_counts set nb=nb +1 where name = ''' || TG_RELNAME || '''';
      RETURN NEW;
   ELSIF TG_OP = 'DELETE' THEN
      EXECUTE 'UPDATE row_counts set nb=nb -1 where name = ''' || TG_RELNAME || '''';
      RETURN OLD;
   END IF;
   END;
$$
LANGUAGE 'plpgsql';


  

