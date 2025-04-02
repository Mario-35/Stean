import { EConstant } from "../../enums";

export function formatConfig(input: Record<string, any>, admin?: boolean): Record<string, any> {
    const name = admin ? EConstant.admin : input.name.toLowerCase();
    return {
        "name": name,
        "ports": admin
            ? {
                  "http": 8029,
                  "tcp": 9000,
                  "ws": 1883
              }
            : 8029,
        "pg": {
            "host": input["host"],
            "port": input["port"],
            "user": admin ? input["adminname"] : name,
            "password": admin ? input["adminpassword"] : input["password"],
            "database": admin ? "postgres" : input["database"].toLowerCase(),
            "retry": 2
        },
        "apiVersion": input["version"],
        "date_format": "DD/MM/YYYY hh:mi:ss",
        "webSite": "no web site",
        "nb_page": 200,
        "alias": [""],
        "extensions": admin ? ["base"] : `base,${input["extensions"] ? String(input["extensions"]) : ""}`.split(","),
        "options": admin ? [] : input["options"] ? String(input["options"]).split(",") : []
    };
}
