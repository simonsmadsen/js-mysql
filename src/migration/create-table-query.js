const iterateKeyValues = (obj,callback) =>  {
  Object.keys(obj).forEach(key => {
    callback(key,obj[key])
  })
}

function parseSqlDefinition (fieldDefinition) {  
  if (fieldDefinition == 'id'){
    return ' INT(11) NOT NULL AUTO_INCREMENT, '
  }
  if (fieldDefinition == 'string') {
    return ' VARCHAR(255) DEFAULT NULL, '
  }
  if (fieldDefinition == 'int') {
    return ' INT(11) DEFAULT 0, '
  }
  if (fieldDefinition == 'datetime') {
    return ' DATETIME DEFAULT NULL, '
  }
  if (fieldDefinition == 'bool') {
    return ' BOOLEAN DEFAULT 0, '
  }
  if (fieldDefinition == 'text') {
    return ' TEXT DEFAULT NULL, '
  }
  return ' VARCHAR(255) DEFAULT NULL, '
}

export function createTableQuery (tablename, tableDefinition) {
  let query = 'CREATE TABLE IF NOT EXISTS ' + tablename + ' ('

  iterateKeyValues(tableDefinition, (key, value) => {
    query += key + parseSqlDefinition(value)
  })
  query += 'PRIMARY KEY ('+Object.keys(tableDefinition)[0]+'))'
  return query
}
