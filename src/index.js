import getConnection from './get-mysql-connection'
import * as sql from './sql-query-str'
import config from './config'

const quote = str => '\''+str+'\''
const formatDate = date => date.toISOString().slice(0, 19).replace('T', ' ')
const createDate = _ => formatDate(new Date())

const quoteIfStrOrDate = str =>
  typeof(str) == 'string' ? quote(str) : typeof(str) == 'object' ? quote(formatDate(str)) : str

const whereStr = where => where.indexOf('where') > -1 ?
  where :
  ' WHERE '+where

const whereObj = where => Object.keys(where).map( key => {
  return key + ' = ' + quoteIfStrOrDate(where[key])
}).join(' AND ')

const handleSoftDelete = where =>
  config.mysql_soft_delete === '1' ?
  where.toLowerCase().replace('where','').trim().length > 0 ?
    where + ' AND '+config.mysql_soft_delete_field+' = 0 ' :
    config.mysql_soft_delete_field+' = 0 ' :
  where

const ensureWhere = where => where.trim().length > 0 ? where.trim().toLowerCase().indexOf('where') > -1 ? where : ' WHERE '+where : ''
const prepareWhere = where => ensureWhere(handleSoftDelete(typeof(where) == 'string' ? whereStr(where) : ' WHERE ' + whereObj(where)))

const sqlFields = obj => Object.keys(obj).join()
const sqlValues = obj => Object.values(obj).map(quoteIfStrOrDate).join()

const objectToCreateQuery = (table,obj) => sql.insert(table,sqlFields(obj),sqlValues(obj))

const queryCreate = (table,obj) => conn =>
    conn.query(objectToCreateQuery(table,obj))

const runQuery = (query) => conn =>
  conn.query(query)

const takeFirst = queryResult =>
  queryResult[0].length > 0 ? queryResult[0][0] : {}

export function create(table,obj){
  return getConnection()
    .then(queryCreate(table,obj))
}

export function find(table,where){
  return getConnection()
  .then(runQuery(sql.select(table,prepareWhere(where))))
  .then(takeFirst)
}

const prepareUpdate = updates => Object.keys(updates).map( key => {
  return key + ' = ' + quoteIfStrOrDate(updates[key]) + ' '
}).join(' , ')

const prepareLimit = limig => limit ? ' Limit '+limit  : ''

export function update(table,updates,where){
  return getConnection()
  .then(runQuery(sql.update(table,prepareUpdate(updates),prepareWhere(where))))
  .then(r => r[0])
}

export function _delete(table,where){
  if(config.mysql_soft_delete === '0'){
    return getConnection()
    .then(runQuery(sql._delete(table,prepareWhere(where))))
  }else{
    const deleteField = config.mysql_soft_delete_field
    const updates = {}
    updates[deleteField] = 1
    return getConnection()
    .then(runQuery(sql.update(table,prepareUpdate(updates),prepareWhere(where))))
    .then(r => r[0])
  }
}

export function select(table,where,limit){
  return getConnection()
  .then(runQuery(sql.select(table,prepareWhere(where)+prepareLimit(limit))))
  .then(r => r[0])
}

export function raw(sqlQuery){
  return getConnection()
  .then(runQuery(sqlQuery))
  .then(r => r[0])
}

export function now(){
  return createDate()
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
