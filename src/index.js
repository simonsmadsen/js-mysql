import getConnection from './get-mysql-connection'
import * as sql from './sql-query-str'
import config from './config'
const quote = str => '\''+str+'\''
const formatDate = date => date.toISOString().slice(0, 19).replace('T', ' ')
const createDate = _ => formatDate(new Date())
const prepareLimit = limit => limit > 0 ? ' Limit '+limit  : ''
const prepareOrder = order => order ? ' Order by '+ order : ''
const formatBool = bool => bool ? '1' : '0'
const log = log => {
  console.log(log)
  return log
}

const quoteIfStrOrDate = str =>
  typeof(str) == 'boolean' ? formatBool(str) : typeof(str) == 'object' ? formatDate(str) : str

const whereStr = where => where.indexOf('where') > -1 ?
  where :
  ' WHERE '+where

const whereObj = where => Object.keys(where).map( key => {
  return key + ' = ? '
}).join(' AND ')

const whereValues = where => ! where || typeof(where) == 'string' ? [] : Object.keys(where).map( key => {
  return quoteIfStrOrDate(where[key])
})

const handleSoftDelete = where =>
  config.mysql_soft_delete === 'true' ?
  where.toLowerCase().replace('where','').trim().length > 0 ?
    where + ' AND '+config.mysql_soft_delete_field+' = 0 ' :
    config.mysql_soft_delete_field+' = 0 ' :
  where

const ensureWhere = where => where.trim().length > 0 ? where.trim().toLowerCase().indexOf('where') > -1 ? where : ' WHERE '+where : ''
const prepareWhere = where => {
  if(where){
    return ensureWhere(handleSoftDelete(typeof(where) == 'string' ? whereStr(where) : ' WHERE ' + whereObj(where)))
  }
  return ensureWhere(handleSoftDelete(''))
}

const sqlFields = obj => Object.keys(obj).join()
const sqlValues = obj => Object.values(obj).map(quoteIfStrOrDate)
const sqlValuesPrepared = obj => Object.values(obj).map(_ => '?').join()

const objectToCreateQuery = (table,obj) => sql.insert(table,sqlFields(obj),sqlValuesPrepared(obj))

const printQuery = (query,vals) => {
  if(config.mysql_query_debug == 'true'){
    console.log([query,vals])
  }
  return query
}

const runQuery = (query,values) => conn => {
  return conn.execute(printQuery(query,values),values)
  .then(r => {
      if(! sharedConn){
          conn.release()
      }
      return r
  })
}

const queryCreate = (table,obj) => conn =>
  runQuery(objectToCreateQuery(table,obj),sqlValues(obj))(conn)

const takeFirst = queryResult =>
  queryResult[0].length > 0 ? queryResult[0][0] : null


export function insert(table,obj){
  return create(table,obj)
}

const prepareUpdate = updates => Object.keys(updates).map( key => {
  return key + ' = ? '
}).join(' , ')

const prepareUpdateValues = updates => Object.keys(updates).map( key => {
  return quoteIfStrOrDate(updates[key])
})

export function create(table,obj){
  return getConnection()
    .then(queryCreate(table,obj))
    .then(r => r[0].insertId)
}

export function find(table,where){
  return getConnection()
  .then(runQuery(
      sql.select(table,prepareWhere(where)),
      whereValues(where)
    )
  )
  .then(takeFirst)
}

export function update(table,updates,where){
  console.log(prepareUpdateValues(updates).concat(whereValues(where)))
  return getConnection()
  .then(runQuery(
    sql.update(table,prepareUpdate(updates),prepareWhere(where)),
    prepareUpdateValues(updates).concat(whereValues(where))
    )
  )
  .then(r => r[0])
}

export function _delete(table,where){
  if(config.mysql_soft_delete !== 'true'){
    return getConnection()
    .then(runQuery(sql._delete(table,prepareWhere(where)),whereValues(where)))
  }else{
    const deleteField = config.mysql_soft_delete_field
    const updates = {}
    updates[deleteField] = 1
    return getConnection()
    .then(runQuery(
      sql.update(table,prepareUpdate(updates),prepareWhere(where)),
      prepareUpdateValues(updates).concat(whereValues(where))
      )
    )
    .then(r => r[0])
  }
}

export function selectCols(table,fields,where,orderBy,limit = 0){
  return getConnection()
  .then(runQuery(sql.selectFields(fields,table,prepareWhere(where)+prepareOrder(orderBy)+prepareLimit(limit)),whereValues(where)))
  .then(r => r[0])
}

export function selectFields(table,fields,where,orderBy,limit = 0){
  return getConnection()
  .then(runQuery(sql.selectFields(fields,table,prepareWhere(where)+prepareOrder(orderBy)+prepareLimit(limit)),whereValues(where)))
  .then(r => r[0])
}

export function select(table,where,orderBy,limit = 0){
  return getConnection()
  .then(runQuery(sql.select(table,prepareWhere(where)+prepareOrder(orderBy)+prepareLimit(limit)),whereValues(where)))
  .then(r => r[0])
}

export function raw(sqlQuery){
  return getConnection()
  .then(runQuery(sqlQuery))
  .then(r => r[0])
}

export function table(table){
  return {
    delete: where => _delete(table,where),
    find: where => find(table,where),
    select: (where,order = '',limit = 0) => select(table,where,order,limit),
    selectFields: (fields,where,order = '', limit = 0) => selectFields(table,fields,where,order,limit),
    selectCols: (fields,where,order = '', limit = 0) => selectFields(table,fields,where,order,limit),
    update: (updates,where) => update(table,updates,where),
    create: obj => create(table,obj)
  }
}
export function now(){
  return createDate()
}
let sharedConn = null
export function sharedConnection(func){
    return getConnection()
    .then(conn => {
      sharedConn = conn
      func(_ => {
        sharedConn.release()
        sharedConn = null
      })
    })
}

export function filterObject(obj, allowedKeys){
  const newObj = {}
  Object.keys(obj).forEach(key => {
    if(allowedKeys.indexOf(key) > -1){
      newObj[key] = obj[key]
    }
  })
  return newObj
}
