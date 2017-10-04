export const insert = (table,fields,values) =>
  'Insert into '+table+' ('+fields+') Values ('+values+')'

const hasWhereInWhere = where => where.toLower().indexOf('where') > -1 ? true : false

export const update = (table,fieldValuePairs,where) =>
  'UPDATE '+table+' SET '+fieldValuePairs+ ( where ? where : '')

export const select = (table,where) =>
  'SELECT * FROM ' + table + ' ' + where

export const selectFields = (select,table,where) =>
  'SELECT '+select+' FROM '+table+ ' ' + where

export const _delete = (table,where) =>
  'DELETE FROM ' + table + ' ' + where
