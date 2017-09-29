const yargs = require('yargs').argv
const _ = require('lodash');
const json2md = require('json2md');
const fs = require('fs');
const path = require('path');

ArgumentsProcessor = {
    args: yargs,
    process: function(){
        if (!_.isNil(yargs.resetDb)) {
            let msg = function(){
                App.Utils.Log.msg(['SUCCESS']);
            }
            App.Utils.Log.msg(['Reseting local database - ' ],true);
            try{
                App.Db.Collection.sites.reset();
                msg();
            }
            catch(err){
                msg();
            }
        }

        if (!_.isNil(yargs.PANTHEON_MACHINE_TOKEN)){
            //TODO Actually use this damn token and login....
            App.Pantheon.machineToken = yargs.PANTHEON_MACHINE_TOKEN;
        }

        if (!_.isNil(yargs.scanSites)){
            //Fills Global Object App.Pantheon.sites.all with results
            App.SiteManagement.scanForPatches();
        }

        if (!_.isNil(yargs.createMultidevs)) {
            if (App.ArgumentsProcessor.args.loadFileDb && App.Pantheon.sites.all.length === 0) {
                App.Pantheon.sites.all = App.Db.get.sites();
            }
            //Method loops through all sites, and if outdated then a multidev is created.
            App.SiteManagement.createMultidevs('patching');
        }

        if (!_.isNil(yargs.reportOutdated)) {
            let sites = App.Db.get.sites()
            let outDated = _.map(sites,(site)=>{
                if (site.upstreamOutdated === 'outdated'){
                    return site;
                }
            })
            App.Utils.Log.msg(['Found', outDated.length,'sites, details for each are below']);
            let mdResults = []
            _.each(outDated,(item)=>{
                mdResults.push(App.Utils.toMarkdownJson(item));
            })
            let md = json2md(mdResults);
            console.log(process.cwd());
            fs.writeFileSync(path.join(process.cwd(),'report.md'),md);
            App.Utils.Log.msg(['Reporting completed, please review report.md']);
        }
    }
}

module.exports = ArgumentsProcessor;