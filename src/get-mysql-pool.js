import config from './config'

const mysql = require('mysql2/promise')

const dbConfig = {
  host: config.mysql_host,
  user: config.mysql_user,
  password: config.mysql_password,
  database: config.mysql_database,
  port: config.mysql_port ? config.mysql_port : 3306
}

if (config.mac === 'true') {
  dbConfig.socketPath = '/tmp/mysql.sock'
}

const pool = mysql.createPool(dbConfig)
export const connectionPool = pool
