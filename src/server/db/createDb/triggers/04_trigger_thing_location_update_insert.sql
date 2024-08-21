/* Trigger for function location Update Insert */
do $$ begin
CREATE TRIGGER thing_location_update_insert
    AFTER INSERT OR UPDATE
    on "thinglocation"
    for each row
    execute procedure thing_location_update_insert();
exception
when others then null;
end $$;
