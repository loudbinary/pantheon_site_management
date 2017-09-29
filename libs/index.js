const chalk = require('chalk');
const _ = require('lodash');

function createMarkdown(key,value) {
    if (typeof value !== 'object' && typeof value !== 'undefined' && typeof key !== 'undefined') {
        let compareValue = value.toString(); //Ensures we have a string
        let result = key + " : " + compareValue.trim();
        return result;
    }
}

/**
 * Used to generate markdown documentation of sites in database.
 * Cleans up unnecessary _id_ and _ts_ from details
 * Seperated any found Array/Object to it's own recurse function for markdown creation.
 * @param obj
 */
let recurseObj = function recurseObj(obj) {
    let allObj = _.compact(_.map(obj,(item,key)=>{
        let newItem = {};
        if (typeof item === 'object'){
            delete obj[key]
            newItem.key = key;
            newItem.value = _.flattenDeep(item)
            return newItem
        }
        if (key.indexOf('_') === 0) { //Remove unneeded fildb properties for markdown report.
            delete obj[key];
        }
    }))

    let topLevelMarkdown = []
    _.each(obj,(item,key) =>{
        let results = createMarkdown(key,item)
        topLevelMarkdown.push(results);
    })

    let topMd = [
            {h1: obj.name},
            {ul: topLevelMarkdown}
        ]

    _.each(allObj,(item)=>{
        let finalResults = []
            _.each(item.value,(newItem)=>{
                _.each(newItem,(finalnew,finalnewKey)=>{
                    finalResults.push(createMarkdown(finalnewKey,finalnew));
                })
            })
        let md = [
            {p: item.key},
            {ul: finalResults}
        ]
        topMd[1].ul.push(md)
    })
    // Returns extracted md array, and any remaining objects to be parsed for mark down.
    return topMd;
}

App = {
    Utils: {
        Log: {
            /**
             *
             * @param message {Array} Array to be concatenated into string and display in console
             * @param no_new_line {Boolean} Default false, if true no line ending is applied to message
             * @param error {Boolean} Default false, if true color display will be red otherwise green
             */
            msg: function (message, no_new_line, error) {
                no_new_line = (typeof no_new_line !== 'undefined') ? no_new_line : false;
                error = (typeof error !== 'undefined') ? error : false;
                if (!no_new_line) {
                    chalk.green(console.log(_.join(arguments[0], ' ')));
                } else {
                    if (error) {
                        chalk.red(process.stdout.write(_.join(arguments[0], ' ')));
                    } else {
                        chalk.green(process.stdout.write(_.join(arguments[0], ' ')));
                    }

                }
            },
            error: function (message) {
                chalk.red(console.log(_.join(arguments[0], ' ')));
            }
        },
        /**
         * Given a Site JSON object, returns neatly formatted JSON Object for emitting markdown
         * @param site
         */
        toMarkdownJson: function (site) {
            let results = recurseObj(site);
            return results;
        }
    }
};

App.SiteManagement = require('./site_management');
App.Pantheon = require('./pantheon.js');
App.Db = require('./db.js');
App.ArgumentsProcessor = require('./arguments_processor');

module.exports = App;
