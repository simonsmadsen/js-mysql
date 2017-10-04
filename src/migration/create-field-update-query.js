const iterateKeyValues = (obj,callback) =>  {
  Object.keys(obj).forEach(key => {
    callback(key,obj[key])
  })
}
const databaseType = type => {
  if (type == 'id'){
    return  'int(11)'; // int(11) && key: 'PRI'
  }
  if (type == 'string') {
    return  'varchar(255)';
  }
  if (type == 'int') {
    return  'int(11)';
  }
  if (type == 'datetime') {
    return 'datetime';
  }
  if (type == 'bool') {
    return  'tinyint(1)';
  }
  if (type == 'text') {
    return  'text';
  }
  return 'varchar(255)'
}

// Type
const parseSqlDefinition = (fieldDefinition) => {
  if (fieldDefinition == 'id'){
    return ' INT(11) NOT NULL AUTO_INCREMENT ; ' // int(11) && key: 'PRI'
  }
  if (fieldDefinition == 'string') {
    return ' VARCHAR(255) DEFAULT NULL ; ' // varchar(255)
  }
  if (fieldDefinition == 'int') {
    return ' INT(11) DEFAULT 0 ; ' // int(11)
  }
  if (fieldDefinition == 'datetime') {
    return ' DATETIME DEFAULT NULL ; ' // 'datetime'
  }
  if (fieldDefinition == 'bool') {
    return ' BOOLEAN DEFAULT 0 ; ' // tinyint(1)
  }
  if (fieldDefinition == 'text') {
    return ' TEXT DEFAULT NULL ; ' // text
  }
  return ' VARCHAR(255) DEFAULT NULL ; '
}

export function createFieldUpdateQuery (table,fields,databaseFields ) {
  let query = ''
  iterateKeyValues(fields, (key, value) => {
    let dbField = databaseFields.filter( f => f.Field === key)
    if(dbField.length > 0){
      dbField = dbField[0]
    }
    const fieldTypeChanged = dbField && dbField.Type !== databaseType(value)
    query += fieldTypeChanged ? 'ALTER TABLE '+table+' MODIFY '+ key + parseSqlDefinition(value) : ''
  })
  return query
}
