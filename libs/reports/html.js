const _ = require('lodash');

/**
 * Represents a data node in Jquery jqtree plugin
 * @param name
 * @param index
 * @returns {{name: *, id: *, children: Array}}
 */
function newTreeNode(name,index){
    return {
        name: name, id: index,
        children: []
    }
}

/**
 * Represents a nested node within jqtree object/plugin.
 * @param value
 * @param key
 * @param index
 * @return {{name: string, id: *}}
 */
function newChildNode(value,key,index) {
    return {
        name: `${key} - ${value}`, id: index
    }
}

/**
 * Builds HTML string that will be saved as HTML report.
 * @param data Data is JQTree data compliant.
 * @returns {string}
 */
function buildHtml(data) {
    let dataString = _.map(data,(item)=>{
        return JSON.stringify(item);
    })

    return `<!DOCTYPE html>
        <html>
        <head>
        <link rel="stylesheet" href="css/bootstrap.min.css">
        <script src="js/jquery.min.js"></script>
        <script src="js/tree.jquery.js"></script>
        <link rel="stylesheet" href="css/jqtree.css">
        <script>
        $(document).ready(function(){
            var data = [${dataString}]
            $('#tree1').tree({
                data: data,
                autoOpen: true
            });
       
            var toggleNodes = (function(){
                var tree_data = $('#tree1').tree('getTree');
              return tree_data;
            })();
            $("#open_tree").click(function(e){
              $.each(toggleNodes.children,function (index,value){
                $('#tree1').tree('openNode',value);
              })
            })
            $("#close_tree").click(function(e){
              $.each(toggleNodes.children,function (index,value){
                $('#tree1').tree('closeNode',value);
              })
            })
        })
        </script>
        </head>
        <body>

        <h2>Outdated Upstream Patching Reports for Pantheon Sites</h2>
        <input type="button" class="btn btn-primary" id="open_tree" value="Expand"/>
        <input type="button" class="btn btn-primary" id="close_tree" value="Collapse"/></p>
        <div id="tree1"></div>
        </body>
        </html>`
};

/**
 * Returns Array of key/value pairs of objects found nested within given obj param.
 * @param obj
 * @returns {Array}
 */
function getObjects(obj) {
    let results = [];
    _.each(Object.values(obj), (val, idx) => {
        if (typeof val === 'object') {
            let key = Object.entries(obj)[idx][0];
            let newItem = {
                key: key,
                value: _.flattenDeep(val)
            }
            results.push(newItem);
        }
    })
    return results;
}

/**
 * Returns properties found on an object.
 * @param obj
 * @returns {Array|Object}
 */
function getProps(obj){
    let properties = Object.getOwnPropertyNames(obj)
    let prop = _.filter(properties,(val) =>{
        if (typeof val !== 'undefined' || typeof obj[val] !== 'object'){
            return val;
        } else {properties.pop(val);}
    })
    return properties;
}

/**
 * Creates single childNode for use in JQTree
 * @param prop
 * @param index
 * @param obj
 * @returns {{name, id}|*}
 */
function generateChildNode(prop,index,obj){
    let key = prop
    let value = obj
    return newChildNode(value, key, index);
}

/**
 * Builds out data structure for use in JQTree
 * @param objs
 * @returns {Array}
 */
let buildTree = function buildTree(objs) {
    let results = [];
    _.each(objs, (obj, index) => {
        let properties = _.filter(getProps(obj), (item) => {
            if (item.indexOf('_') !== 0) {
                return item;
            }
        })
        let nestedObjects = getObjects(obj);
        let treeNode = newTreeNode(obj.name + ' - ' + obj.upstreamUpdates[0].length + " update(s) available - Service Level: " +obj.service_level, index);
        _.each(properties,(prop,index)=>{
            treeNode.children.push(generateChildNode(prop,index,obj[prop]));
        })

        _.each(nestedObjects,(nestedObj,index)=>{
            let nestedNode = newTreeNode(nestedObj.key,index);
            _.each(nestedObj.value,(nestedValues,index)=>{
                let nestedDetail = newTreeNode('#' + index,index);
                let counter = 0;
                _.each(Object.entries(nestedValues),(item,key)=>{
                    nestedDetail.children.push(generateChildNode(item[0],counter,item[1]))
                })
                nestedNode.children.push(nestedDetail);
            })
            treeNode.children.push(nestedNode);
        })
        results.push(treeNode)
    })
    return results;
}

module.exports.generateHtml = function generateHtml(data){
    var treeData = buildTree(data);
    let html = buildHtml(treeData);
    return html;
}