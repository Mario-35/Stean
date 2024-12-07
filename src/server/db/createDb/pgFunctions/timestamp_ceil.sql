/* function timestamp ceil */
CREATE OR REPLACE FUNCTION timestamp_ceil(_tstz timestamptz, _int_seconds int)
    RETURNS timestamptz AS
    $func$   
      SELECT to_timestamp(ceil(extract(epoch FROM $1) / $2) * $2)
    $func$  LANGUAGE sql STABLE;