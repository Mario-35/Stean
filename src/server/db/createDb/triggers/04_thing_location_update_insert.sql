/* function location Update Insert */
CREATE OR REPLACE FUNCTION thing_location_update_insert() RETURNS TRIGGER 
 LANGUAGE PLPGSQL
AS $$
DECLARE t_id integer;    
BEGIN
  INSERT INTO historicallocation(time, thing_id) VALUES(current_timestamp, new.thing_id) returning id into t_id;
  INSERT INTO locationhistoricallocation(historicallocation_id, location_id) VALUES(t_id, new.location_id);
  RETURN NEW;
END;
$$