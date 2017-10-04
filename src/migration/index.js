import * as mysql from './../mysql'
import * as sql from './sql-query'
import {createTableQuery} from './create-table-query'
import {createFieldsQuery} from './create-fields-query'
import {createFieldUpdateQuery} from './create-field-update-query'
import {createFieldDeleteQuery} from './create-field-delete-query'

const l = l => {
  console.log(l)
  return l
}
const rawQuertIfNotEmpty = query => query.trim().length > 0 ?  mysql.raw(query) : 'empty query!'
const createTable = (table,fields) => mysql.raw(createTableQuery(table, fields))
const arrNotEmpty = arr => arr.length > 0
const tableExists = table => mysql.raw(sql.tableExists(table)).then(arrNotEmpty)
const mapDatabaseFields = databaseFields => databaseFields.map(field => field.Field)
const findNewFields = fields => databaseFields => Object.keys(fields).filter(f => databaseFields.indexOf(f) === -1)
const createNewFields = (table,fields) => newFields =>
  createFieldsQuery(table,fields,newFields).split(';').forEach(rawQuertIfNotEmpty)

const handleNewFields = (table,fields) => mysql.raw(sql.tableFields(table))
  .then(mapDatabaseFields)
  .then(findNewFields(fields))
  .then(createNewFields(table,fields))

const fieldUpdateQuery = (table,fields) => databaseFields => createFieldUpdateQuery(table,fields,databaseFields)

const runQueries = queries => queries.split(';').forEach(rawQuertIfNotEmpty)

const handleChangedFields = (table,fields) => oldResult => mysql.raw(sql.tableFields(table))
  .then(fieldUpdateQuery(table,fields))
  .then(runQueries)

const fieldDeleteQuery = (table,fields) => databaseFields => createFieldDeleteQuery(table,fields,databaseFields)
const handleRemovedFields = (table,fields) => old => mysql.raw(sql.tableFields(table))
  .then(fieldDeleteQuery(table,fields))
  .then(runQueries)

const validateFields = (table,fields) =>
   handleNewFields(table,fields)
  .then(handleChangedFields(table,fields))
  .then(handleRemovedFields(table,fields))

const createOrUpdate = (table,fields) => exists =>
  ! exists ? createTable(table,fields) : validateFields(table,fields)

export function table(table,fields){
  return tableExists(table)
    .then(createOrUpdate(table,fields))
}
