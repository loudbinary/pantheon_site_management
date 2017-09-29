const chalk = require('chalk');
const _ = require('lodash');

function createMarkdown(key,value) {
    if (typeof value !== 'object' && typeof value !== 'undefined' && typeof key !== 'undefined') {
        if (key.indexOf('_') !== 0) {
            let result = key + " : " + value;
            return result;
        }
        /*
         } else {
         let md = []
         _.each(value,(subValue,subKey)=>{
         md.push(createMarkdown(subKey,subValue));
         })
         let result = 'Item ' + key + " : " + md
         return _.compact(result);
         }
         */
    }
}
App = {
    Utils: {
        Log:{
            /**
             *
             * @param message {Array} Array to be concatenated into string and display in console
             * @param no_new_line {Boolean} Default false, if true no line ending is applied to message
             * @param error {Boolean} Default false, if true color display will be red otherwise green
             */
            msg: function(message,no_new_line,error){
                no_new_line = (typeof no_new_line !== 'undefined') ?  no_new_line : false;
                error = (typeof error !== 'undefined') ?  error : false;
                if (!no_new_line){
                    chalk.green(console.log(_.join(arguments[0],' ')));
                } else {
                    if(error) {
                        chalk.red(process.stdout.write(_.join(arguments[0],' ')));
                    } else {
                        chalk.green(process.stdout.write(_.join(arguments[0],' ')));
                    }

                }
            },
            error: function(message){
                chalk.red(console.log(_.join(arguments[0],' ')));
            }
        },
        /**
         * Given a Site JSON object, returns neatly formatted JSON Object for emitting markdown
         * @param site
         */
        toMarkdownJson: function(site){
            let ulList = [];
            _.each(site,(item,key) =>{
                ulList.push(createMarkdown(key,item));
            });
            let md = function() {
                return [
                    {
                        h1: site.name
                    },
                    { ul: ulList
                    }
                ]
            }
            return (md());
        }
    }
};

App.SiteManagement = require('./site_management');
App.Pantheon = require('./pantheon.js');
App.Db = require('./db.js');
App.ArgumentsProcessor = require('./arguments_processor');

module.exports = App;
