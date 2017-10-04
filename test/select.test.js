import { table, now } from './../src/index.js'
require('./setup.js')

const petsTable = table('pets')
const usersTable = table('users')

test('select all', async () => {
  const users = await usersTable.select()
  expect(users.length).toBe(3)
})

test('select simon', async () => {
  const users = await usersTable.select({name: 'Simon'})
  expect(users.length).toBe(1)
  expect(users[0].name).toMatch('Simon')
})

test('select limit 2', async () => {
  const users = await usersTable.select(null,null,2)
  expect(users.length).toBe(2)
})

test('select reverse order', async () => {
  const usersNoOrder = await usersTable.select(null)
  const usersWithOrder = await usersTable.select(null, 'id desc')
  expect(usersNoOrder[0].name).toMatch('Simon')
  expect(usersWithOrder[0].name).toMatch('Neal')
})