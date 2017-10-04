import { table, now } from './../src/index.js'
import initTestDB from './migration.js'

const petsTable = table('pets')
const usersTable = table('users')

beforeAll( async () => {
  await initTestDB()
})

beforeEach(async () => {
  await usersTable.truncate()
  await usersTable.create({
    name: 'Simon',
    created: now()
  })
  await usersTable.create({
    name: 'Peter',
    created: now()
  })
  await usersTable.create({
    name: 'Neal',
    created: now()
  })
})