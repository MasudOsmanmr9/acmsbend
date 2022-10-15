/**
 * Make query string from object
 * @param {any} data
 * @returns {string} dataStr
 */
function dataString(data) {
  let fields,
    i,
    dataStr = "";
  fields = Object.keys(data);
  for (i = 0; i < fields.length; i++) {
    if (typeof data[fields[i]] == "number") {
      dataStr += "" + data[fields[i]] + ",";
    } else if (typeof data[fields[i]] == "string") {
      dataStr += "N" + "'" + data[fields[i]] + "' ,";
    } else if (typeof data[fields[i]] == "undefined" || typeof data[fields[i]] == "null" || typeof data[fields[i]] == "object") {
      dataStr += " " + data[fields[i]] + " ,";
    }
  }

  return dataStr;
}

/**
 * @param {string} str
 * @returns string
 */
let TitleCase = function titleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ")
    .trim();
};

/**
 *
 * @param {string} shortStr
 * @returns string
 */
let GetTblName = function getTableName(shortStr) {
  if (!shortStr) {
    throw (result = {
      Success: false,
      Message: "Table Name missing",
    });
  }

  let tblFullName = "";
  switch (shortStr) {
    case "BRAND":
      tblFullName = "[dbo].[Brand]";
      break;
    case "PCAT":
      tblFullName = "[dbo].[ProductCategory]";
      break;

  }

  return tblFullName;
};

function searchString(data) {
  const { whereObj, filter, lastKey } = data;
  let whereClause = "";
  if (lastKey == 0 || !lastKey) {
    whereClause += " WHERE d.LastModified<" + new Date().getTime() + " ";
  } else {
    whereClause += " WHERE d.LastModified<" + lastKey + " ";
  }

  if (filter && filter != "" && filter.startsWith("AND")) {
    whereClause += " " + filter;
  }

  if (whereObj) {
    for (let prop in whereObj) {
      let valType = Object.prototype.toString.call(whereObj[prop]);
      if (valType === "[object Number]" || valType === "[object Boolean]") whereClause += " AND d." + prop + "=" + whereObj[prop];
      else whereClause += " AND d." + prop + "='" + whereObj[prop] + "' ";
    }
  }

  return whereClause;
}

function orderWhereClauseString(whereObj, filter, lastKey) {
  // const { whereObj, filter, lastKey } = data;
  let whereClause = "";
  if (lastKey == 0 || !lastKey) {
    whereClause += " WHERE r.LastModified<" + new Date().getTime() + " ";
  } else {
    whereClause += " WHERE r.LastModified<" + lastKey + " ";
  }

  if (filter && filter != "" && filter.startsWith("AND")) {
    whereClause += " " + filter;
  }

  if (whereObj) {
    for (let prop in whereObj) {
      let valType = Object.prototype.toString.call(whereObj[prop]);
      if (valType === "[object Number]" || valType === "[object Boolean]") whereClause += " AND r." + prop + "=" + whereObj[prop];
      else whereClause += " AND r." + prop + "='" + whereObj[prop] + "' ";
    }
  }

  return whereClause;
}

function requisitionWhereClauseString(whereObj, filter, lastKey) {
  let whereClause = "";
  if (lastKey == 0 || !lastKey) {
    whereClause += " WHERE r.LastModified<" + new Date().getTime() + " ";
  } else {
    whereClause += " WHERE r.LastModified<" + lastKey + " ";
  }

  if (filter && filter != "" && filter.startsWith("AND")) {
    whereClause += " " + filter;
  }

  if (whereObj) {
    for (let prop in whereObj) {
      let valType = Object.prototype.toString.call(whereObj[prop]);
      if (valType === "[object Number]" || valType === "[object Boolean]") whereClause += " AND r." + prop + "=" + whereObj[prop];
      else whereClause += " AND r." + prop + "='" + whereObj[prop] + "' ";
    }
  }

  return whereClause;
}

function invoiceWhereClauseString(whereObj, filter, lastKey) {

  let whereClause = "";
  if (lastKey == 0 || !lastKey) {
    whereClause += " WHERE Invoice.LastModified<" + new Date().getTime() + " ";
  } else {
    whereClause += " WHERE Invoice.LastModified<" + lastKey + " ";
  }

  if (filter && filter != "" && filter.startsWith("AND")) {
    whereClause += " " + filter;
  }

  if (whereObj) {
    for (let prop in whereObj) {
      let valType = Object.prototype.toString.call(whereObj[prop]);
      if (valType === "[object Number]" || valType === "[object Boolean]") whereClause += " AND Invoice." + prop + "=" + whereObj[prop];
      else whereClause += " AND Invoice." + prop + "='" + whereObj[prop] + "' ";
    }
  }

  return whereClause;
}

function toBinary(string) {
  const codeUnits = new Uint16Array(string.length);
  for (let i = 0; i < codeUnits.length; i++) {
    codeUnits[i] = string.charCodeAt(i);
  }
  const charCodes = new Uint8Array(codeUnits.buffer);
  let result = "";
  for (let i = 0; i < charCodes.byteLength; i++) {
    result += String.fromCharCode(charCodes[i]);
  }
  return result;
}

function fromBinary(binary) {
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const charCodes = new Uint16Array(bytes.buffer);
  let result = "";
  for (let i = 0; i < charCodes.length; i++) {
    result += String.fromCharCode(charCodes[i]);
  }
  return result;
}

function nativeNameEncode(value) {
  const converted = toBinary(value);
  value = btoa(converted);
  return value;
}

function nativeNameDecode(value) {
  const converted = atob(value);
  value = fromBinary(converted);
  return value;
}

function parseAllNativeName(data) {
  var fields, i;
  fields = Object.keys(data);
  for (i = 0; i < fields.length; i++) {
    if (fields[i].toUpperCase().includes('NATIVENAME') && data[fields[i]] && !data[fields[i]].toString().startsWith('??')) {
      try {
        data[fields[i]] = this.nativeNameDecode(data[fields[i]]);
      } catch (error) {
        data[fields[i]] = data[fields[i]];
      }
    }
  }
  return data;
}

function encodeAllNativeName(data) {
  var fields, i;
  fields = Object.keys(data);
  for (i = 0; i < fields.length; i++) {
    if (fields[i].toUpperCase().includes('NATIVENAME') && data[fields[i]] && !data[fields[i]].toString().startsWith('??')) {
      data[fields[i]] = this.nativeNameEncode(data[fields[i]]);
    }
  }
  return data;
}

module.exports = {
  ObjToQueryStr: dataString,
  TitleCase,
  GetTblName,
  ObjToSearchStr: searchString,
  orderWhereClauseString,
  invoiceWhereClauseString,
  nativeNameEncode,
  nativeNameDecode,
  parseAllNativeName,
  encodeAllNativeName,
  requisitionWhereClauseString,
};
