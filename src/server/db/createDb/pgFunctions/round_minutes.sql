/* function row round_minutes */
CREATE OR REPLACE FUNCTION round_minutes(TIMESTAMP WITHOUT TIME ZONE, integer) 
RETURNS TIMESTAMP WITHOUT TIME ZONE AS $$ 
  SELECT 
     date_trunc('hour', $1) 
     +  cast(($2::varchar||' min') as interval) 
     * round( 
     (date_part('minute',$1)::float + date_part('second',$1)/ 60.)::float 
     / $2::float
      )
$$ LANGUAGE SQL IMMUTABLE;

CREATE OR REPLACE FUNCTION round_minutes(TIMESTAMP WITH TIME ZONE, integer) 
RETURNS TIMESTAMP WITH TIME ZONE AS $$ 
  SELECT 
     date_trunc('hour', $1) 
     +  cast(($2::varchar||' min') as interval) 
     * round( 
     (date_part('minute',$1)::float + date_part('second',$1)/ 60.)::float 
     / $2::float
      )
$$ LANGUAGE SQL IMMUTABLE;