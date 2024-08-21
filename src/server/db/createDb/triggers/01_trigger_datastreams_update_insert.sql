/* Trigger for function datastreams Update Insert */
do $$ BEGIN
  CREATE TRIGGER datastreams_actualization_insert
      after insert
      on "observation"
      for each row
      execute procedure datastreams_update_insert();
exception
  when others then null;
end $$;
