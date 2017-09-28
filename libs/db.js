//TODO Potentially implement https://www.npmjs.com/package/github-db instead of file based db.
const DB = require('flat-db');
const path = require('path');
const dbPath = path.join(process.cwd(),'db');

//Set database path to be directory where this utility was executed.
DB.configure({
    dir: dbPath
})

/**
 * Private function to write site JSON Object to File Db Storage
 * @param details
 * @returns {String} Returns key created for object written to File Db Storage
 */
function site(details){
    let Site = new DB.Collection('sites');
    let key = Site.add(details);
    return key;
}
Db = {
    get: {
        /**
         *
         * @returns {*|{src}|Promise.<*>}
         */
        sites: function(){
            let Site = new DB.Collection('sites');
            let all = Site.all();
            App.utils.log.msg(['Loaded',all.length,'sites from CWB/DB/ File Database']);
            return all;
        }
    },
    add: {
        /**
         * Add site JSON to File Db Storage @ dbPath
         * @param details
         * @returns {Object} JSON Site Object
         */
        site: function (details){
             let key = site(details);
             return key;
        }
    }
}

module.exports = Db;