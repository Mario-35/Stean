/* function datastream partition */
CREATE OR REPLACE FUNCTION datastream_partition(nb integer) RETURNS void 
  LANGUAGE plpgsql AS
$$
 DECLARE 
  id int;
 BEGIN  
  SELECT last_value + 1
  INTO  id 
  FROM  datastream_id_seq;
    for counter in id..id + nb  loop
    EXECUTE 'CREATE TABLE IF NOT EXISTS "datastream_id' || counter || '" PARTITION OF observation FOR VALUES IN (' || counter || ')'; 
    EXECUTE 'CREATE UNIQUE INDEX IF NOT EXISTS "datastream_id' || counter || '_nb" on datastream_id' || counter || ' (_nb)';
  end loop;
 END;
$$;