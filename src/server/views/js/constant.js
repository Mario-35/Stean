/**
 * Constantsfor Query.
 *
 * @copyright 2023-present Inrae
 * @author mario.adam@inrae.fr
 *
 */
// log debug test
let isDebug = false;
let isAdmin = false;
let valueGeo = "";


const _NONE = "none";

// load file json
let importFile = false;
var jsonObj = {};
var listOptions = {};
var canGo = false;
let builder = undefined;


const wins = {
    SqlQuery: false,
    Json: false,
    logs: false,
    Csv: false,
    Sql: false,
    Links: false,
    Graph: false
};


const cardDatas = {};
let dragText = "";
let jsonViewer = undefined; 


// replace at execution
const _PARAMS={};

function getEntityList() {
    return Object.keys(_PARAMS._DATAS).filter((elem) => _PARAMS._DATAS[elem].order > 0).sort((a, b) => (_PARAMS._DATAS[a].order > _PARAMS._DATAS[b].order ? 1 : -1)) ; 
  }
  
function getColumnsList(input) {
    const ent = getEntityName(input);
    return ent ? Object.keys(_PARAMS._DATAS[ent].columns).filter(e => !e.startsWith("_") && !e.includes("_id")) : undefined;
}

function getRelationsList(input) {
    const ent = getEntityName(input);
    return ent ? Object.keys(_PARAMS._DATAS[ent].relations) : undefined;
}
const getWinActives = () => Object.entries(wins).filter(e => e === true).length > 0;

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}
