const yargs = require('yargs').argv
const _ = require('lodash');
const json2md = require('json2md');
const fs = require('fs-extra');
const path = require('path');
const pdf = require('html-pdf');
const htmlReportingDirectory = path.join(process.cwd(),'reports','html_report');
const exec = require('execa');

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
            if (yargs.reportOutdated === 'markdown'){
                let sites = App.Db.get.sites()
                let outDated = _.map(sites,(site)=>{
                    if (site.upstreamOutdated === 'outdated'){
                        return site;
                    }
                })
                outDated = _.compact(outDated) //Removed the undefined, which are ghost of items removed not matching filter.
                if (outDated.length>0){
                    App.Utils.Log.msg(['Found', outDated.length,'sites, details for each are below']);
                    let mdResults = []
                    _.each(outDated,(item)=>{
                        mdResults.push(App.Utils.toMarkdown(item));
                    })
                    let md = json2md(mdResults);
                    fs.writeFileSync(path.join(process.cwd(),'report.md'),md);
                    App.Utils.Log.msg(['Reporting completed, please review report.md']);
                } else {
                    App.Utils.Log.msg(['No outdated sites found']);
                }
            }
            if (yargs.reportOutdated === 'html'){
                processReportOutdatedHtml(false);
            }

            if (yargs.reportOutdated === 'pdf'){
                processReportOutdatedHtml(true);
            }
        }
    }
}

function processReportOutdatedHtml(emitPdf){
    let sites = App.Db.get.sites()
    let outDated = _.map(sites,(site)=>{
        if (site.upstreamOutdated === 'outdated'){
            return site;
        }
    })
    outDated = _.compact(outDated) //Removed the undefined, which are ghost of items removed not matching filter.
    if (outDated.length>0){
        //Process the html generation.
        App.Utils.Log.msg(['Found', outDated.length,'sites, details for each are below']);
        let htmlResults = App.Utils.toHtml(outDated);
        saveHtmlResults(htmlResults);
        if(emitPdf === true) {
            savePdfResults(htmlResults);
        }
    } else {
        App.Utils.Log.msg(['No outdated sites found']);
    }
}
/**
 * Saves html report to cwd reports/html_reporty directory
 * @param html
 */
function saveHtmlResults(html){
    let templateDir = path.join(path.resolve(__dirname,'reports','html_template'));

    App.Utils.Log.msg(['Saving html report to ', htmlReportingDirectory],true);
    fs.copySync(templateDir,htmlReportingDirectory);
    fs.outputFileSync(path.join(htmlReportingDirectory,'index.html'),html);
    App.Utils.Log.msg([' - COMPLETED']);
}

function savePdfResults(html,htmlPath) {
    let reportingDir = path.join(process.cwd(),'reports','pdf_report');
    App.Utils.Log.msg(['Producing pdf report to ', reportingDir],true);
    fs.emptyDirSync(reportingDir);
    let options =  {"base": "file://" + htmlReportingDirectory};
    var html = fs.readFileSync(path.join(htmlReportingDirectory,'index.html'), 'utf8');
    exec.sync('html-pdf',[path.join(htmlReportingDirectory,'index.html'), path.join(reportingDir,'upstream_report.pdf')])
    App.Utils.Log.msg([' - COMPLETED']);

}
module.exports = ArgumentsProcessor;