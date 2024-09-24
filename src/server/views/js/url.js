  
  const removeAllQuotes = (input) => (input != null && input.length >= 2 && input.charAt(0) == '\"' && input.charAt(input.length - 1) === '\"') ? input.substring(1, input.length - 1) : input;

  function decodeUrl(input) {
    input = removeAllQuotes(input);
    header("decodeUrl", input);
    try {
      // return true if some works are done (for init to not delete value)
      let decode = false;
      // delete all before
      let myRoot = input;
      let myOptions = input;
      let myPath = input;
      // get options if exists
      if (input.includes('?')) {
        const splitStr = input.split('?');
        myRoot = splitStr[0];
        myOptions = splitStr[1];
      } 
      const version = getVersion(input);
      // get version
      if (version) {
        const splitStr = myRoot.split(version);
        myPath = splitStr[1];
        myRoot = splitStr[0];
      }
      // process my path
      myPath.split('/')
            .filter((word) => word !== '')
            .forEach((element, index) => {
              if (index === 0) {
                if (element.includes('(')) {
                  const temp = element.split('(');
                  entityOption.value = temp[0];
                  idOption.value = temp[1].replace(')', '');
                } else entityOption.value = getEntityName(element);
              } else if (index === 1) {
                if (element.includes('?')) queryOptions.value = element;
                else if (_PARAMS._DATAS[getEntityName(element)]) populateSelect(subentityOption, Object.keys(_PARAMS._DATAS[entityOption.value].relations), element, true);
              }
            });
      
      myOptions.split('&$').filter(e => e.trim() !== "").forEach((element) => {
        const temp = element.split('=');
        console.log(`===========> ${temp}`);
        
        switch (temp[0]) {
          case "resultFormat":
            getFormatOptions();
            populateSelect(resultFormatOption, getFormatOptions(),temp[1] ,temp[1] );
          default:
            const element = getElement(`${temp[0]}Option`);
            if(element) {
              switch (element.type ) {
                case "checkbox":
                  setChecked(element.id, temp[1] === "true" ? true : false);
                  break;
                case "select-multiple":
                  multiSelects[element.id].setValue(temp[1].split(","));
                  break;
                default:
                  console.log(`element.type: ${element.type}`);                  
                  element.value = temp[1];
                  break;
              }
            }

        }

      });
      canShowQueryButton();
      return decode;
    } catch (error) {
      console.error(error);
        return false;
    } 
  }

  function cleanUrl(input) {
    while (["$", "&", "?"].includes(input[input.length - 1])) {
        input = input.slice(0, -1);
    }
    return input;
  }

  function createUrl() {
    header("createUrl");
    const queryOptions = [];

    var addInOption = function(key, value) {
      if (value != "") queryOptions.push(`${key}=${value}`);
    };

    const index = Number(idOption.value);

    const root = `${optHost.value}/${optVersion.value}`;
  
    let directLink = root;
    let queryLink = `${root}/Query?&method=${methodOption.value}`;
    
    if (index > 0) {
      directLink = directLink + "/" + entityOption.value + "(" + index + ")";
      queryLink = queryLink + `&entity=${entityOption.value}&id=${index}`;
    } else {
      if (entityOption.value == "Loras" && idOption.value != "" && idOption.value != "0") {
        directLink = directLink + "/" + entityOption.value + "(" + idOption.value + ")";
        queryLink = queryLink + `&entity=${entityOption.value}&id=${index}`;
      }
      else {
        directLink = directLink + "/" + entityOption.value;
        queryLink = queryLink + `&entity=${entityOption.value}`;
      }
    }

    if (subentityOption.value != "none") {
      directLink = directLink + "/" + subentityOption.value;
      queryLink = queryLink + `&subentity=${subentityOption.value}`;
      const indexSub = Number(idSubOption.value);
      if (indexSub > 0) {
        directLink = directLink + "(" + indexSub + ")";
        queryLink = queryLink + `&idSub=${idSubOption.value}`;
      }
    }

    if (propertyOption.value != "none" && idOption.value != "") {
        directLink = directLink + "/" + propertyOption.value;
        queryLink = queryLink + `&property=${propertyOption.value}`;
    
      if (getIfChecked("onlyValueOption") === true) {
        directLink = directLink + "/$value";
        queryLink = queryLink + `&onlyValueOption=true`;
      } 

      return { "direct" : directLink, "query": queryLink};
    }  

    if (datas.innerText != "") {
      const datasEncoded = encodeURIComponent(datas.innerText );
      queryLink = queryLink + `&datas=${datasEncoded}`;
    }

    addInOption("resultFormat", ["json", "logs"].includes(resultFormatOption.value) ? "" : resultFormatOption.value);
    addInOption("debug", isDebug ? "true" : "");
    addInOption("count", getIfChecked("countOption") ? "true" : "");
    addInOption("valuesKeys", getIfChecked("valueskeysOption") ? "true" : "");
    if (isObservation()) addInOption("splitResult", splitResultOption.value);
    if (intervalOption.value != "" && isObservation() ) addInOption("interval",intervalOption.value);
    if (!["","0"].includes(skipOption.value)) addInOption("skip",skipOption.value);
    if (!["","0"].includes(topOption.value)) addInOption("top",topOption.value);
    tempDatas = multiSelects["expandOption"].getData();
    if (tempDatas && tempDatas.length > 0) addInOption("expand", tempDatas);
    tempDatas = (resultFormatOption.value === "logs") ? ["id","date","code","method","database"] : multiSelects["selectOption"].getData();
    if (tempDatas && tempDatas.length > 0) addInOption("select", tempDatas);
    tempDatas = multiSelects["orderbyOption"].getData();
    if (isLog() && tempDatas.length < 1) tempDatas = ["date desc"];
    if (tempDatas && tempDatas.length > 0) addInOption("orderby", tempDatas);
    if (payload.value != "" && ["Decoders"].includes(entityOption.value)) addInOption("payload", payload.value);

    // orderbyOption;
    const queryBuilder = getElement("query-builder").innerText;
    const listOr = [];
    JSON.parse(queryBuilder).forEach((whereOr) => {    
      const listAnd = [];
      whereOr.forEach((whereAnd) => {    
        if (whereAnd.criterium && whereAnd.criterium != "" && whereAnd.condition && whereAnd.criterium != "" && whereAnd.criterium && whereAnd.value != "") {
          const value = isNaN(whereAnd.value) ? `'${whereAnd.value}'` : whereAnd.value;
          switch (whereAnd.condition) {
            case "contains":
            case "endswith":
            case "startswith":
              listAnd.push(`${whereAnd.condition}(${whereAnd.criterium},${value})`);              
              break;
            case "between":
              listAnd.push(`${whereAnd.criterium} gt ${whereAnd.value.first} and ${whereAnd.criterium} lt ${whereAnd.value.second} `);              
              break;
            case "nn":
              listAnd.push(`${whereAnd.criterium} ne null`);              
              break;
            case "nu":
              listAnd.push(`${whereAnd.criterium} eq null`);              
              break;            
            default:
              listAnd.push(`${whereAnd.criterium} ${whereAnd.condition} ${value}`);
              break;
          }
        }
        });
      listOr.push(listAnd.join(" and "));
    });
    let where = listOr.join(" or ");
    // Filter for logs
    if (isLog() && Logfilter) where += Logfilter;
    addInOption("filter", where);  

    const addMark = queryOptions.length > 0 ? "?$":"";
    directLink = `${directLink}${addMark}${queryOptions.join("&$")}`;
    queryLink = `${queryLink}&${encodeURI(queryOptions.join("&"))}`;
    directLink = cleanUrl(directLink);
    queryLink = cleanUrl(queryLink).split("&").join("&$");
    console.log(queryLink);
    
    if (isDebug) {
      console.log(`direct : ${directLink}`);
      console.log(`query : ${queryLink}`);
    }
    return { "direct" : directLink, "query": queryLink};
  }
  