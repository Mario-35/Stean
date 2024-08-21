/**
 * observationType Enum
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// onsole.log("!----------------------------------- observationType Enum -----------------------------------!");

export enum EObservationType {    
    "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_CategoryObservation" = "_resulttext",
    "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_CountObservation" = "number",
    "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement" = "number",
    "http://www.opengis.net/def/observation-type/ogc-om/2.0/om_complex-observation" ="array",
    "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Observation" = "any",
    "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_TruthObservation" = "_resultBoolean",
    "http://www.opengis.net/def/observation-type/ogc-omxml/2.0/swe-array-observation" = "object"
}
