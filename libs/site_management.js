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
function scanForPatches(refresh){
    if (refresh === true || App.Pantheon.sites.all.length === 0){
        if (refresh === true) {
            app.log.msg(['Refreshing sites array']);
            app.Pantheon.sites.all = new Array();
        }
        App.utils.log.msg(['Sites empty, filling array'])
        App.Pantheon.sites.fill()
            .then(()=>{
                App.utils.log.msg(['Finished getting Pantheon results, found', App.Pantheon.sites.all.length, 'sites']);
            })
            .then(()=>{
                App.utils.log.msg(['Scanning for missing patches for all', App.Pantheon.sites.all.length, 'sites']);
                App.Pantheon.sites.checkUpstreamStatus();

            })
            .then(()=>{
                let outdated = _.map(App.Pantheon.sites.all,(site)=>{
                    if (!_.isNil(site) && site.upstreamOutdated === 'outdated') {
                        App.Pantheon.sites.all.pop(site);
                        return site;
                    }
                })
                return _.compact(outdated);
            })
            .then((outdated)=>{
                App.utils.log.msg(['Found', outdated.length,'sites with outdated upstreams']);
                App.Pantheon.sites.fillUpstreamUpdates(outdated);
            })
            .then(()=>{
                let count = 0;
                do {
                    App.Pantheon.sites.writeSiteDetails(App.Pantheon.sites.all[count])
                    count++;
                } while (count != App.Pantheon.sites.all.length)
            })
    }

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
                    App.utils.log.msg(['Sucessfully create multidev', multidevName,'for site',site.name]);
                } else {
                    App.utils.log.msg(['Failed to create multidev', multidevName,'for site', site.name]);
                }
            } else {
                App.utils.log.msg(['Unable to create multidev patching, because it already exists'])
            }
        } else {
            App.utils.log.msg(['Site',site.name,'is UP-TO-DATE, skipping multidev creation']);
        }
    })
}

/**
 * Generalized methods and functions for management of Pantheon sites.
 * @type {SiteManagement}
 */
module.exports = SiteManagement