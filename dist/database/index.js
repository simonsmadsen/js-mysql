'use strict';

var _tables = require('./tables');

var tables = _interopRequireWildcard(_tables);

var _getMysqlConnection = require('./get-mysql-connection');

var _getMysqlConnection2 = _interopRequireDefault(_getMysqlConnection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const tableDefinitions = [['access_kinds', tables.AccessKinds], ['access', tables.Access], ['owner', tables.Owner], ['owner_partnerships', tables.OwnerPartnerships], ['owner_partnership_types', tables.OwnerPartnershipTypes], ['owner_tags', tables.OwnerTags], ['tags', tables.Tags], ['tag_links', tables.TagLinks], ['links', tables.Links], ['headlines', tables.Headlines], ['headline_links', tables.HeadlineLinks], ['ower_links', tables.OwerLinks]];

const iterateKeyValues = (obj, callback) => {
  Object.keys(obj).forEach(key => {
    callback(key, obj[key]);
  });
};

function parseSqlDefinition(fieldDefinition) {
  if (fieldDefinition == 'id') {
    return ' INT(11) NOT NULL AUTO_INCREMENT, ';
  }
  if (fieldDefinition == 'string') {
    return ' VARCHAR(255) DEFAULT NULL, ';
  }
  if (fieldDefinition == 'int') {
    return ' INT(11) DEFAULT 0, ';
  }
  if (fieldDefinition == 'datetime') {
    return ' DATETIME DEFAULT NULL, ';
  }
  if (fieldDefinition == 'bool') {
    return ' BOOLEAN DEFAULT 0, ';
  }
  if (fieldDefinition == 'text') {
    return ' TEXT DEFAULT NULL, ';
  }
  return ' VARCHAR(255) DEFAULT NULL, ';
}

function getCreateTableQuery(tablename, tableDefinition) {
  let query = 'CREATE TABLE IF NOT EXISTS ' + tablename + ' (';

  iterateKeyValues(tableDefinition, (key, value) => {
    query += key + parseSqlDefinition(value);
  });
  query += 'PRIMARY KEY (' + Object.keys(tableDefinition)[0] + '))';
  return query;
}

(0, _getMysqlConnection2.default)().then(connection => {
  tableDefinitions.forEach(definition => {
    const createQuery = getCreateTableQuery(definition[0], definition[1]);
    connection.query(createQuery).then(console.log).catch(console.log);
  });
}).catch(console.log);

setTimeout(function () {
  console.log('out!');
}, 1000000);

console.log('here!');