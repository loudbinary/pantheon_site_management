//TODO Potentially implement https://www.npmjs.com/package/github-db instead of file based db.
const DB = require('flat-db');
const path = require('path');
const dbPath = path.join(process.cwd(),'db');
App.Utils.Log.msg(['Current DB Path is:', dbPath])

//Set database path to be directory where this utility was executed.
DB.configure({
    dir: dbPath
})

/**
 * Filter all upstreamOutdated == 'outdated' items within App.Pantheon.sites.all[]
 * @param site
 * @returns {Object} Items that are upstreamOutdated == 'outdated'
 */
function filterUpstreams(site){
    return site.upstreamOutdated == 'outdated';
}

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
    Collection:{
        sites: new DB.Collection('sites')
    },
    get: {
        /**
         *
         * @returns {*|{src}|Promise.<*>}
         */
        sites: function(){
            let Site = new DB.Collection('sites');
            let all = Site.all();
            let outdatedUpstreams = App.Pantheon.sites.all.filter(filterUpstreams)
            App.Utils.Log.msg(['Loaded',all.length,'sites from CWB/DB/ File Database']);
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