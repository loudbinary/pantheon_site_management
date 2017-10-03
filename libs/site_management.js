let app = require('./index');
const _ = require('lodash');

SiteManagement = {
    scanForPatches: scanForPatches,
    createMultidevs: createMultidevs
}
/**
 * Scan for patches, and fills global App.Pantheon.sites object
 * @param refresh {Boolean} If true, forces new Array on App.Pantheon.sites to refresh data.
 */
function scanForPatches(){
        App.Pantheon.sites.fill()
            .then(()=>{
                App.Utils.Log.msg(['Finished getting Pantheon results, found', App.Pantheon.sites.all.length, 'sites']);
            })
            .then(()=>{
                App.Utils.Log.msg(['Scanning for missing patches for all', App.Pantheon.sites.all.length, 'sites']);
                App.Pantheon.sites.checkUpstreamStatus();
            })
            .then(()=>{
                let outdated = []
                    _.each(App.Pantheon.sites.all,(site)=>{
                    if (!_.isNil(site) && site.upstreamOutdated == 'outdated') {
                        outdated.push(site);
                    }
                });
                // We have to remove outdated items from Global array of sites, because
                // they will be getting added back into array as upstreamUpdates found
                // Are appended into new object.
                App.Pantheon.sites.all = _.difference(App.Pantheon.sites.all,outdated);
                return _.compact(outdated);
            })
            .then((outdated)=>{
                if (outdated.length > 0) {
                    App.Utils.Log.msg(['Found', outdated.length,'sites with outdated upstreams']);
                    App.Pantheon.sites.fillUpstreamUpdates(outdated);
                } else {
                    App.Utils.Log.msg(['No sites with outdated upstreams']);
                }
            })
            .then(()=>{
                let count = 0;
                do {
                    App.Pantheon.sites.writeSiteDetails(App.Pantheon.sites.all[count])
                    count++;
                } while (count != App.Pantheon.sites.all.length)
            })
}

/** Creates patching multidev for given site array, or if not provided all sites in database */
function createMultidevs(multidevName) {
    //TODO Need to filter all sites to only create multidevs for sites which have pending updates.
    _.each(App.Pantheon.sites.all,(site)=>{
        if (site.upstreamOutdated === 'outdated'){
            let mdExists = App.Pantheon.sites.checkMultidevExists(site,multidevName);
            if (mdExists===false){
                let results = App.Pantheon.sites.createMultidev(site,multidevName);
                if (results.status ===0) {
                    App.Utils.Log.msg(['Sucessfully create multidev', multidevName,'for site',site.name]);
                } else {
                    App.Utils.Log.msg(['Failed to create multidev', multidevName,'for site', site.name]);
                }
            } else {
                App.Utils.Log.msg(['Unable to create multidev patching, because it already exists'])
            }
        } else {
            App.Utils.Log.msg(['Site',site.name,'is UP-TO-DATE, skipping multidev creation']);
        }
    })
}

/**
 * Generalized methods and functions for management of Pantheon sites.
 * @type {SiteManagement}
 */
module.exports = SiteManagement