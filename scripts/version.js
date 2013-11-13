/**
  * ScriptName: Version
  * Created: 22nd June 2012
  * By: Shlomo Sagir, Tech-Tav Documentation Limited
  *
  **/

var debug = false,
    dataFile = 'version.data.js';

/* Generates content object
 * Run from command prompt: cscript //nologo version.js */
if (typeof WScript != 'undefined') {
	var fso = new ActiveXObject('Scripting.FileSystemObject'),
	    fh,
	    guidePath = '../guide',
		content = "var guide = {";
	
	processFolder(guidePath, 1, false);
	
	if (content.match(/,$/)) content = content.substr(0, content.length-1);
	content += '\r\n};'
	
	fh = fso.CreateTextFile(dataFile);
	fh.Write(content);
	fh.close();
}

function processFolder(folder, level, closeBrace) {
	var fc, f;
	var firstFile = true;
	
	f = fso.GetFolder(folder);
	
	fc = new Enumerator(f.subfolders);
	for (; !fc.atEnd(); fc.moveNext()) {
		if (!fc.item().name.match(/^api$/) && !fc.item().name.match(/^images$/)) {
			content += '\r\n' + Array(level+1).join('\t') + '\'' + fc.item().name + '\':{';
			processFolder(fc.item().path, level + 1, true);
		}
	}
	
	fc = new Enumerator(f.files);
	for (; !fc.atEnd(); fc.moveNext()) {
		if (fc.item().name.match(/\.textile$/)) {
			content += ((firstFile) ? '' : ',') + '\r\n' + Array(level+1).join('\t') + '\'' + fc.item().name.replace('.textile','') + '\':true';
			firstFile = false;
		}
	}
	
	if (closeBrace) content += '\r\n' + Array(level).join('\t') + '},';
}

function addPageVersions() {
	var href = document.location.href,
	    base = href.substr(0, href.indexOf('guide')-1),
	    path = href.substr(href.indexOf('guide')).split('/'),
		currVersion = path[1],
		pageTemplate = versions = value = null,
		phVersion = '__Version__',
		versionTitle='This document refers to Cloudify Version: ',
		options = new Object;
	
	debugWrite('Base: ' + base + '\tPath: ' + path);
	
	options['version'] = '';
	if (!isEmpty((versions = getAlternatePages(path)))) {
		debugWrite('versions: ' + versions + '\tLength: ' + versions.length);
		
		path[1] = phVersion;
		pageTemplate = base + '/' + path.join('/');
		options['version'] += '<option selected="true">Other versions</option>';
		for (var version in versions) {
			debugWrite('Processing version: ' + version);
			
			value = ' Cloudify ' + version;
			debugWrite('Value: ' + value + '\tpageCurrent: ' + path[3]);
			
			options['version'] += '<option text="' + value + '" value="' + pageTemplate.replace(phVersion, version) + '">' + value + '</option>';
		}
		
		debugWrite('options[version]: ' + options['version']);
		
		var versionShowing = versionTitle +	currVersion;		
		
		$('#todHdr').addClass('version');
		injectToHtml('#todHdr', '<span id="versionSelectionToc">', '', 'after');
		injectToHtml('#versionSelectionToc', '<select onchange="document.location.href = this.options[this.selectedIndex].value;">', options['version']);
		
		//injectToHtml('#pageVersion', '<span id="versionSelectionTop">', '');
		//injectToHtml('#versionSelectionTop', '<table class="versionTable">', '<tr><td class="impt"></td><td class="versionSelection"></td></tr>');
		//injectToHtml('#versionSelectionTop table td.impt', '<span>', versionShowing);
		//injectToHtml('#versionSelectionTop table td.versionSelection', '<select onchange="document.location.href = this.options[this.selectedIndex].value;">', options['version'], 'append');
		
		injectToHtml('#pageContent', '<span id="versionSelectionBottom">', '', 'append');
		injectToHtml('#versionSelectionBottom', '<br>', '');
		injectToHtml('#versionSelectionBottom', '<table class="versionTable">', '<tr><td class="impt"></td><td class="versionSelection"></td></tr>', 'append');
		injectToHtml('#versionSelectionBottom table td.impt', '<span>', versionShowing);
		injectToHtml('#versionSelectionBottom table td.versionSelection', '<select onchange="document.location.href = this.options[this.selectedIndex].value;">', options['version'], 'append');
	}
	else {
		injectToHtml('#pageContent', '<span id="versionSelectionBottom">', '', 'append');
		injectToHtml('#versionSelectionBottom', '<br>', '','append');
		injectToHtml('#versionSelectionBottom', '<br>', '','append');
		injectToHtml('#versionSelectionBottom', '<span class="impt">', versionTitle + currVersion, 'append');
	}
}

function getAlternatePages (path) {
	var versions = new Object();
	
	for (var version in guide) {
		if (version !== path[1] &&
			((guide[version])[path[2]])[path[3]]) {
			versions[version] = true;
		}
	}
	
	return ((versions) ? versions : null);
}

function injectToHtml(target, element, innerHtml, location) {
	if (location === 'append')
		$(element).html(innerHtml).appendTo(target);
	else if (location === "after")
		$(element).html(innerHtml).insertAfter(target);
	else
		$(element).html(innerHtml).prependTo(target);
}

function isEmpty(map) {
   for (var key in map) {
         return false;
   }
   return true;
}

function debugWrite(msg) {
	if (debug) {
		if (typeof WScript !== 'undefined')
			WScript.Echo ('version.js::' + msg);
		else if (typeof console !== 'undefined')
			console.log('version.js::' + msg);
	}
}

/*
function getRelease(release) {
	var releases = {
			ga: 'GA',
			mx: 'M',
			rc: 'RC'
		},
		milestone = null;
	
	debugWrite('Release: ' + release);
	if (release.match(/m\d/)) {
		milestone = release.match(/\d+/);
		release = 'mx';
		debugWrite('Release: ' + release + '\tMilestone: ' + milestone);
	}
	return ((releases[release]) ? releases[release] + ((release=='mx') ? milestone : '') : release);
}
*/