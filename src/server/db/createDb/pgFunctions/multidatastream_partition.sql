/* function multidatastream partition */
CREATE OR REPLACE FUNCTION multidatastream_partition(nb integer) RETURNS void
  LANGUAGE plpgsql AS
$$
 DECLARE 
  id int;
 BEGIN  
  SELECT last_value + 1
  INTO  id 
  FROM  multidatastream_id_seq;
    for counter in id..id + nb  loop
    EXECUTE 'CREATE TABLE IF NOT EXISTS "multidatastream_id' || counter || '" PARTITION OF datastream_id0 FOR VALUES IN (' || counter || ')';
    EXECUTE 'CREATE UNIQUE INDEX IF NOT EXISTS "multidatastream_id' || counter || '_nb" on multidatastream_id' || counter || ' (_nb)';
  end loop;
 END;
$$;