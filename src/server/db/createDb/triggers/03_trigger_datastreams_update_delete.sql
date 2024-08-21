/* Trigger for function datastreams Update Delete */
do $$ begin
CREATE TRIGGER datastreams_actualization_delete
    after delete
    on "observation"
    for each row
    execute procedure datastreams_update_delete();
exception
when others then null;
end $$;