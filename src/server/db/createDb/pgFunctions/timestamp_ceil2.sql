/* function timestamp ceil Override */
CREATE OR REPLACE FUNCTION timestamp_ceil(_tstz timestamptz, _interval interval)
    RETURNS timestamptz LANGUAGE sql STABLE AS
  'SELECT timestamp_ceil($1, extract(epoch FROM $2)::int)';