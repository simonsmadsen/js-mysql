import { migration } from './../src/index.js'

const init = async () => {
  await migration.table('users', {
    id: 'id',
    name: 'string',
    created: 'datetime'
  })
  await migration.table('pets', {
    id: 'id',
    name: 'string',
    user_id: 'int',
    created: 'datetime'
  })
}

export default init
