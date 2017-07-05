import * as pool from './get-mysql-pool'

export default function getConnection(connectionPool){
  return pool.connectionPool.getConnection()
}
