/* Trigger for function datastreams Update Update */
do $$ begin
CREATE TRIGGER datastreams_actualization_update
    after update
    on "observation"
    for each row
    execute procedure datastreams_update_update();
exception
when others then null;
end $$;