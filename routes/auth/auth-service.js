var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");

const CosmosClient = require("@azure/cosmos").CosmosClient;
const endpoint = process.env.COSMOS_URL;
const key = process.env.COSMOS_PRIMARY_KEY;
const databaseId = process.env.COSMOS_DATABASE;
const containerId = process.env.COSMOS_CONTAINER;
const client = new CosmosClient({
  endpoint,
  key,
});
const database = client.database(databaseId);
const container = database.container(containerId);

async function getListData(pageSize, lastKey, type, filter, whereObj, cols) {
  try {
    console.log('filter accessssssssssssss',filter);
    if (lastKey == 0) lastKey = new Date().getTime();

    let whereClause = "";

    if (type) {
      whereClause = " AND c.___type='" + type + "'";
    }
    if (filter && filter.length > 0) {
      whereClause += " AND " + filter + " ";
    }

    if (whereObj) {
      for (let prop in whereObj) {
        let valType = Object.prototype.toString.call(whereObj[prop]);
        if (valType === "[object Number]" || valType === "[object Boolean]") whereClause += " AND c." + prop + "=" + whereObj[prop];
        else whereClause += " AND c." + prop + "='" + whereObj[prop] + "'";
      }
    }

    let selectCols = " * ";

    if(cols && cols.length>0){
      for (let I = 0; I < cols.length; I++) {
        cols[I] = "c." +cols[I];;
        
      }
      
      selectCols = cols.join(",");
    }

    let orderby = " ORDER BY c.lastModified DESC";
    // let orderby = " ORDER BY c._ts DESC";
    let querySpec = {
      // query: "SELECT Top " + pageSize +" "+ selectCols+" FROM c WHERE c.lastModified < @lastKey " + whereClause + orderby,
      query: `SELECT ${pageSize!=undefined || pageSize!=null?'Top '+pageSize:''} ${selectCols} FROM c WHERE c.lastModified < @lastKey  ${whereClause} ${orderby}`,
      parameters: [
        {
          name: "@lastKey",
          value: lastKey,
        },
      ],
    };
    console.log('queryspec isssssssssssssssssssssssssss',querySpec);
    const { resources: items } = await container.items
      .query(querySpec, {
        maxItemCount: pageSize,
      })
      .fetchAll();

    if (items != null && items.length > 0) {
      return {
        Success: true,
        Message: "Data Found",
        Data: items,
      };
    } else {
      return {
        Success: true,
        Data: [],
        Message: "No Data Found",
      };
    }
  } catch (e) {
    return {
      Success: false,
      Message: e.message,
    };
  }
}

async function getAllData(type, filter, whereObj,cols) {
  try {
    let whereClause = "";

    if (type) {
      whereClause = " AND c.___type='" + type + "'";
    }
    if (filter && filter.length > 0) {
      whereClause += " AND " + filter + " ";
    }

    if (whereObj) {
      for (let prop in whereObj) {
        let valType = Object.prototype.toString.call(whereObj[prop]);
        if (valType === "[object Number]" || valType === "[object Boolean]") whereClause += " AND c." + prop + "=" + whereObj[prop];
        else whereClause += " AND c." + prop + "='" + whereObj[prop] + "'";
      }
    }

    let selectCols = " * ";

    if(cols && cols.length>0){
      for (let I = 0; I < cols.length; I++) {
        cols[I] = "c." +cols[I];;
        
      }
      
      selectCols = cols.join(",");
    }


    let orderby = " ORDER BY c.lastModified DESC";
    // let orderby = " ORDER BY c._ts DESC";
    let querySpec = {
      query: "SELECT "+selectCols+" FROM c WHERE c.___type='" + type + "' " + whereClause + orderby,
      parameters: [],
    };
    const { resources: items } = await container.items
      .query(querySpec, {
        enableCrossPartitionQuery: true,
      })
      .fetchAll();

    if (items != null && items.length > 0) {
      return {
        Success: true,
        Message: "Data Found",
        Data: items,
      };
    } else {
      return {
        Success: true,
        Data: [],
        Message: "No Data Found",
      };
    }
  } catch (e) {
    return {
      Success: false,
      Message: e.message,
    };
  }
}

async function getDataDetails(type, whereObj) {
  try {
    let whereClause = "";

    if (whereObj) {
      for (let prop in whereObj) {
        let valType = Object.prototype.toString.call(whereObj[prop]);
        if (valType === "[object Number]" || valType === "[object Boolean]") whereClause += " AND c." + prop + "=" + whereObj[prop];
        else whereClause += " AND c." + prop + "='" + whereObj[prop] + "'";
      }
    }

    let querySpec = {
      query: "SELECT Top 1 * FROM c WHERE c.___type=@type " + whereClause,
      parameters: [
        {
          name: "@type",
          value: type,
        },
      ],
    };

    const { resources: items } = await container.items
      .query(querySpec, {
        enableCrossPartitionQuery: true,
        maxItemCount: 1,
      })
      .fetchAll();

    if (items && items.length > 0) {
      return {
        Success: true,
        Message: "Data Found",
        Data: items[0],
      };
    } else {
      return {
        Success: false,
        Message: "No Data Found",
        Data: null,
      };
    }
  } catch (e) {
    return {
      Success: false,
      Message: e.message,
    };
  }
}

async function saveOrUpdateData(data,req) {
  try {
    let existData = await getDataDetails(data.___type, {
      id: data.id,
    });
    let currentData = {};
    data.lastModifiedBy = req.user.id;
    data.lastModified = data.lastModified ? data.lastModified : new Date().getTime();
    if (existData.Success && existData.Data != null) {
      currentData = existData.Data;
    } else {
      data.createdAt = data.createdAt ? data.createdAt: data.lastModified;
      data.createdBy = req.user.id;
    }
    var fields, i;
    fields = Object.keys(data);
    for (i = 0; i < fields.length; i++) {
      currentData[fields[i]] = data[fields[i]];
    }

    let insetData;
    if (existData.Success && existData.Data != null) {
      insetData = await container.item(currentData.id).replace(currentData);
    } else {
      insetData = await container.items.create(currentData);
    }

    if (insetData.resource) {
      currentData = insetData.resource;
    } else {
      return {
        Success: false,
        Message: "Failed to save data",
      };
    }
    return {
      Success: true,
      Data: currentData,
      Message: data.___type + " saved",
    };
  } catch (error) {
    console.log(error);
    return {
      Success: false,
      Message: error,
    };
  }
}

async function updateData(data, type, id) {
  try {
    let existData = await getDataDetails(type, { id: id });

    let currentData = {};

    if (!existData.Success) {
      return existData;
    }

    if (existData.Success && existData.Data != null) {
      currentData = existData.Data;
    }

    var fields, i;
    fields = Object.keys(data);
    for (i = 0; i < fields.length; i++) {
      currentData[fields[i]] = data[fields[i]];
    }

    let insetData = await container.item(currentData.id).replace(currentData);

    if (insetData.resource) {
      currentData = insetData.resource;
    } else {
      return {
        Success: false,
        Message: "Failed to save data",
      };
    }
    return {
      Success: true,
      Data: currentData,
      Message: type + " updated",
    };
  } catch (error) {
    console.log(error);
    return {
      Success: false,
      Message: error,
    };
  }
}

async function deleteData(id, type) {
  try {
    let item = await container.item(id, type).delete();

    if (item) {
      return {
        Success: true,
        Message: "Data Deleted",
      };
    } else {
      return {
        Success: false,
        Message: "Item not deleted",
      };
    }
  } catch (error) {
    return {
      Success: false,
      Message: error.Message,
    };
  }
}



module.exports = {
  getListData,
  getDataDetails,
  updateData,
  deleteData,
  saveOrUpdateData,
  getAllData,
};
