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
module.exports.generateMarkdown = function generateMarkdown(obj) {
    let allObj = _.compact(_.map(obj,(item,key)=>{
        let newItem = {};
        if (typeof item === 'object'){
            delete obj[key]
            newItem.key = key;
            newItem.value = _.flattenDeep(item)
            return newItem
        }
        if (key.indexOf('_') === 0) { //Remove unneeded properties for markdown report.
            delete obj[key];
        }
    }))

    let topLevelMarkdown = []
    _.each(obj,(item,key) =>{
        let results = createMarkdown(key,item)
        topLevelMarkdown.push(results);
    })
    topLevelMarkdown = _.compact(topLevelMarkdown);
    let topMd = [
        {h1: obj.name},
        {ul: topLevelMarkdown}
    ]
    if(allObj.length >> 0) {
        let nestedResults = []

        _.each(allObj,(item)=>{

            let itemLevelMd = [
                {h2: item.key }
            ]
            //Record object name into markdown
            //nestedResults.push(itemLevelMd);
            topMd[1].ul.push(itemLevelMd);
            // Get each property as details and append ul into off object for Markdown conversion.
            _.each(item.value,(newItem,newKey)=>{
                let key = function (count){
                    return Object.entries(newItem)[count][0];
                }
                let value = function (count){
                    return Object.entries(newItem)[count][1];
                }
                let subMd = [
                    {h4: "Item Details : " + String(newKey)}
                ]
                topMd[1].ul.push(subMd);
                let count = 0;
                do {
                    let subMarkdown = createMarkdown(key(count),value(count));
                    topMd[1].ul.push(subMarkdown);
                    count++
                } while (count != Object.entries(newItem).length)
                //nestedResults.push(subMd);
            })
            //topMd[1].ul.push(nestedResults);
        })
        // Returns extracted md array, and any remaining objects to be parsed for mark down.
        return topMd;
    }

}