let mysql = require('mysql2/promise');

import config from './config'

import extendPool from './extend-mysql-connection-pool'

const dbConfig = {
    host     : config.mysql_host ,
    user     : config.mysql_user,
    password : config.mysql_password,
    database : config.mysql_database
}

if(config.mac === 'true'){
  dbConfig.socketPath = '/tmp/mysql.sock'
}

const pool = mysql.createPool(dbConfig);
export const connectionPool = pool
