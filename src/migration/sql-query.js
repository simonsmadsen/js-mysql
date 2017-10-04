export const tableExists = table => 'SHOW TABLES LIKE \''+table+'\''
export const tableFields = table => 'SHOW COLUMNS FROM ' +table
