## Members

<dl>
<dt><a href="#Pantheon">Pantheon</a> : <code><a href="#Pantheon">Pantheon</a></code></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#ensureSetup">ensureSetup()</a></dt>
<dd><p>Ensure that a PANTHEON_MACHINE_TOKEN environment variable available to application</p>
</dd>
<dt><a href="#fillSites">fillSites()</a></dt>
<dd><p>Private Fills App.Pantheon.sites.all array with all Sites from Pantheon query.</p>
</dd>
<dt><a href="#checkUpstream">checkUpstream(site)</a> ⇒ <code>Object</code></dt>
<dd><p>For given site queries Pantheon syncronously and returns results.</p>
</dd>
<dt><a href="#fillUpstreamUpdates">fillUpstreamUpdates()</a></dt>
<dd><p>For given site, queries Pantheon site syncronously and results all updates available and apply to upstreamUpdates array</p>
</dd>
<dt><a href="#scanForPatches">scanForPatches(refresh)</a></dt>
<dd><p>Scan for patches, and fills global App.Pantheon.sites object</p>
</dd>
</dl>

<a name="Pantheon"></a>

## Pantheon : [<code>Pantheon</code>](#Pantheon)
**Kind**: global variable  

* [Pantheon](#Pantheon) : [<code>Pantheon</code>](#Pantheon)
    * [.sites](#Pantheon.sites)
        * [.list()](#Pantheon.sites.list) ⇒ <code>Array</code>
        * [.fill()](#Pantheon.sites.fill)
        * [.checkUpstreamStatus()](#Pantheon.sites.checkUpstreamStatus) ⇒ <code>site</code>
        * [.fillUpstreamUpdates(outdated)](#Pantheon.sites.fillUpstreamUpdates)

<a name="Pantheon.sites"></a>

### Pantheon.sites
**Kind**: static property of [<code>Pantheon</code>](#Pantheon)  

* [.sites](#Pantheon.sites)
    * [.list()](#Pantheon.sites.list) ⇒ <code>Array</code>
    * [.fill()](#Pantheon.sites.fill)
    * [.checkUpstreamStatus()](#Pantheon.sites.checkUpstreamStatus) ⇒ <code>site</code>
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

#### sites.checkUpstreamStatus() ⇒ <code>site</code>
Queries upstream status for site, and returns outdated or current, value gets assigned too upstreamOutdated of site object

**Kind**: static method of [<code>sites</code>](#Pantheon.sites)  
**Returns**: <code>site</code> - Object  
<a name="Pantheon.sites.fillUpstreamUpdates"></a>

#### sites.fillUpstreamUpdates(outdated)
Fills upstreamUpdates array with all missing upstream updates found by terminus upstream:updates:list <site>.dev

**Kind**: static method of [<code>sites</code>](#Pantheon.sites)  

| Param | Description |
| --- | --- |
| outdated | Array filled with all sites matching upstreamOutdated === 'outdated' |

<a name="ensureSetup"></a>

## ensureSetup()
Ensure that a PANTHEON_MACHINE_TOKEN environment variable available to application

**Kind**: global function  
<a name="fillSites"></a>

## fillSites()
Private Fills App.Pantheon.sites.all array with all Sites from Pantheon query.

**Kind**: global function  
<a name="checkUpstream"></a>

## checkUpstream(site) ⇒ <code>Object</code>
For given site queries Pantheon syncronously and returns results.

**Kind**: global function  
**Returns**: <code>Object</code> - Array of Pantheon site data and details.  

| Param | Type | Description |
| --- | --- | --- |
| site | <code>Array</code> | Pantheon site data and details. |

<a name="fillUpstreamUpdates"></a>

## fillUpstreamUpdates()
For given site, queries Pantheon site syncronously and results all updates available and apply to upstreamUpdates array

**Kind**: global function  
<a name="scanForPatches"></a>

## scanForPatches(refresh)
Scan for patches, and fills global App.Pantheon.sites object

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| refresh | <code>Boolean</code> | If true, forces new Array on App.Pantheon.sites to refresh data. |
