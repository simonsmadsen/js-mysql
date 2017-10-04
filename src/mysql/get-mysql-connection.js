import * as pool from './get-mysql-pool'

export default function getConnection(){
  return pool.connectionPool.getConnection()
}
