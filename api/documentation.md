## Members

<dl>
<dt><a href="#Pantheon">Pantheon</a> : <code><a href="#Pantheon">Pantheon</a></code></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#filterUpstreams">filterUpstreams(site)</a> ⇒ <code>Object</code></dt>
<dd><p>Filter all upstreamOutdated == &#39;outdated&#39; items within App.Pantheon.sites.all[]</p>
</dd>
<dt><a href="#site">site(details)</a> ⇒ <code>String</code></dt>
<dd><p>Private function to write site JSON Object to File Db Storage</p>
</dd>
<dt><a href="#generateMarkdown">generateMarkdown(obj)</a></dt>
<dd><p>Used to generate markdown documentation of sites in database.
Cleans up unnecessary <em>id</em> and <em>ts</em> from details
Seperated any found Array/Object to it&#39;s own recurse function for markdown creation.</p>
</dd>
<dt><a href="#ensureSetup">ensureSetup()</a></dt>
<dd><p>Ensure that a PANTHEON_MACHINE_TOKEN environment variable available to application</p>
</dd>
<dt><a href="#fillSites">fillSites()</a></dt>
<dd><p>Private Fills App.Pantheon.sites.all array with all Sites from Pantheon query terminus site:list</p>
</dd>
<dt><a href="#checkUpstream">checkUpstream(site)</a> ⇒ <code>String</code></dt>
<dd><p>For given site queries Pantheon synchronously and return results of terminus upstream:updates:status</p>
</dd>
<dt><a href="#multidevExists">multidevExists(site, multidevName)</a> ⇒ <code>boolean</code></dt>
<dd><p>Queries Pantheon Site to see if a multidev exists by same name</p>
</dd>
<dt><a href="#fillUpstreamUpdates">fillUpstreamUpdates()</a></dt>
<dd><p>For given site, queries Pantheon site synchronously and results of terminus upstream:updates:list and apply to upstreamUpdates array</p>
</dd>
<dt><a href="#writeSiteToDb">writeSiteToDb(site)</a></dt>
<dd><p>Write json object to CWD directory as Files</p>
</dd>
<dt><a href="#createMultidev">createMultidev(site, multidevName)</a></dt>
<dd><p>Private method to create multidev</p>
</dd>
<dt><a href="#scanForPatches">scanForPatches(refresh)</a></dt>
<dd><p>Scan for patches, and fills global App.Pantheon.sites object</p>
</dd>
<dt><a href="#createMultidevs">createMultidevs()</a></dt>
<dd><p>Creates patching multidev for given site array, or if not provided all sites in database</p>
</dd>
</dl>

<a name="Pantheon"></a>

## Pantheon : [<code>Pantheon</code>](#Pantheon)
**Kind**: global variable  

* [Pantheon](#Pantheon) : [<code>Pantheon</code>](#Pantheon)
    * [.sites](#Pantheon.sites)
        * [.list()](#Pantheon.sites.list) ⇒ <code>Array</code>
        * [.fill()](#Pantheon.sites.fill)
        * [.checkUpstreamStatus()](#Pantheon.sites.checkUpstreamStatus) ⇒ [<code>site</code>](#site)
        * [.fillUpstreamUpdates(outdated)](#Pantheon.sites.fillUpstreamUpdates)

<a name="Pantheon.sites"></a>

### Pantheon.sites
**Kind**: static property of [<code>Pantheon</code>](#Pantheon)  

* [.sites](#Pantheon.sites)
    * [.list()](#Pantheon.sites.list) ⇒ <code>Array</code>
    * [.fill()](#Pantheon.sites.fill)
    * [.checkUpstreamStatus()](#Pantheon.sites.checkUpstreamStatus) ⇒ [<code>site</code>](#site)
    * [.fillUpstreamUpdates(outdated)](#Pantheon.sites.fillUpstreamUpdates)

<a name="Pantheon.sites.list"></a>

#### sites.list() ⇒ <code>Array</code>
Simple getter to read all sites found in object

**Kind**: static method of [<code>sites</code>](#Pantheon.sites)  
<a name="Pantheon.sites.fill"></a>

#### sites.fill()
Public Fills App.Pantheon.sites.all array with all Sites from Pantheon query.

**Kind**: static method of [<code>sites</code>](#Pantheon.sites)  
<a name="Pantheon.sites.checkUpstreamStatus"></a>

#### sites.checkUpstreamStatus() ⇒ [<code>site</code>](#site)
Queries upstream status for site, and returns outdated or current, value gets assigned too upstreamOutdated of site object

**Kind**: static method of [<code>sites</code>](#Pantheon.sites)  
**Returns**: [<code>site</code>](#site) - Object  
<a name="Pantheon.sites.fillUpstreamUpdates"></a>

#### sites.fillUpstreamUpdates(outdated)
Fills upstreamUpdates array with all missing upstream updates found by terminus upstream:updates:list <site>.dev

**Kind**: static method of [<code>sites</code>](#Pantheon.sites)  

| Param | Description |
| --- | --- |
| outdated | Array filled with all sites matching upstreamOutdated === 'outdated' |

<a name="filterUpstreams"></a>

## filterUpstreams(site) ⇒ <code>Object</code>
Filter all upstreamOutdated == 'outdated' items within App.Pantheon.sites.all[]

**Kind**: global function  
**Returns**: <code>Object</code> - Items that are upstreamOutdated == 'outdated'  

| Param |
| --- |
| site | 

<a name="site"></a>

## site(details) ⇒ <code>String</code>
Private function to write site JSON Object to File Db Storage

**Kind**: global function  
**Returns**: <code>String</code> - Returns key created for object written to File Db Storage  

| Param |
| --- |
| details | 

<a name="generateMarkdown"></a>

## generateMarkdown(obj)
Used to generate markdown documentation of sites in database.
Cleans up unnecessary _id_ and _ts_ from details
Seperated any found Array/Object to it's own recurse function for markdown creation.

**Kind**: global function  

| Param |
| --- |
| obj | 

<a name="ensureSetup"></a>

## ensureSetup()
Ensure that a PANTHEON_MACHINE_TOKEN environment variable available to application

**Kind**: global function  
<a name="fillSites"></a>

## fillSites()
Private Fills App.Pantheon.sites.all array with all Sites from Pantheon query terminus site:list

**Kind**: global function  
<a name="checkUpstream"></a>

## checkUpstream(site) ⇒ <code>String</code>
For given site queries Pantheon synchronously and return results of terminus upstream:updates:status

**Kind**: global function  
**Returns**: <code>String</code> - Results of Pantheon query Either - [outdated, current]  

| Param | Type | Description |
| --- | --- | --- |
| site | <code>Array</code> | Pantheon site data and details. |

<a name="multidevExists"></a>

## multidevExists(site, multidevName) ⇒ <code>boolean</code>
Queries Pantheon Site to see if a multidev exists by same name

**Kind**: global function  
**Returns**: <code>boolean</code> - Returns true if multidev exists, otherwise false.  

| Param | Type | Description |
| --- | --- | --- |
| site | <code>Object</code> | Details from Pantheon Query for a site. |
| multidevName | <code>String</code> | Multidev environment to check existence for within Pantheon site |

<a name="fillUpstreamUpdates"></a>

## fillUpstreamUpdates()
For given site, queries Pantheon site synchronously and results of terminus upstream:updates:list and apply to upstreamUpdates array

**Kind**: global function  
<a name="writeSiteToDb"></a>

## writeSiteToDb(site)
Write json object to CWD directory as Files

**Kind**: global function  

| Param | Description |
| --- | --- |
| site | A JSON Object with details to be written, in this case a site. |

<a name="createMultidev"></a>

## createMultidev(site, multidevName)
Private method to create multidev

**Kind**: global function  

| Param |
| --- |
| site | 
| multidevName | 

<a name="scanForPatches"></a>

## scanForPatches(refresh)
Scan for patches, and fills global App.Pantheon.sites object

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| refresh | <code>Boolean</code> | If true, forces new Array on App.Pantheon.sites to refresh data. |

<a name="createMultidevs"></a>

## createMultidevs()
Creates patching multidev for given site array, or if not provided all sites in database

**Kind**: global function  
