'use strict';

var _jsWeb = require('./js-web');

const ofilter = _jsWeb.storage.mysql.filterObject;

/*
    LINKS !
 */
/*
    CREATION
 */
const metaData = {
    'created_at': _jsWeb.storage.mysql.now(),
    'updated_at': _jsWeb.storage.mysql.now()
};
const prepareCreateObj = params => Object.assign(metaData, ofilter(params, 'url'));
(0, _jsWeb.postRoute)('/create', params => _jsWeb.storage.mysql.create('links', prepareCreateObj(params)));

/*
    SELECTION
 */
(0, _jsWeb.route)('/link/:link_id', params => _jsWeb.storage.mysql.find('links', params));
(0, _jsWeb.route)('/links', params => _jsWeb.storage.mysql.select('links', params));
/*
    REMOVEING
 */
(0, _jsWeb.postRoute)('/link/:link_id', params => _jsWeb.storage.mysql._delete('links', params));
/*
    UPDATING
 */
(0, _jsWeb.postRoute)('/update/:link_id', p => _jsWeb.storage.mysql.update('links', ofilter(p, 'url'), ofilter(p, 'link_id')));

(0, _jsWeb.start)();