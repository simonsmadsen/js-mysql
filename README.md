import {route,postRoute,start,storage} from ''
const ofilter = storage.mysql.filterObject

const metaData = {
  'created_at': storage.mysql.now(),
  'updated_at': storage.mysql.now()
}
const prepareCreateObj = params => Object.assign(metaData,ofilter(params,'url'))
postRoute('/create', params => storage.mysql.create('links',prepareCreateObj(params)))

/*
    SELECTION
 */
route('/link/:link_id', params => storage.mysql.find('links',params))
route('/links', params => storage.mysql.select('links',params))

/*
    REMOVEING
 */
postRoute('/link/:link_id', params => storage.mysql._delete('links',params))

/*
    UPDATING
 */
postRoute('/update/:link_id', p => storage.mysql.update('links',ofilter(p,'url'),ofilter(p,'link_id')))

/*
    Start listen!
 */
start()
