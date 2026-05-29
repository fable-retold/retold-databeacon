"use strict";(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f();}else if(typeof define==="function"&&define.amd){define([],f);}else{var g;if(typeof window!=="undefined"){g=window;}else if(typeof global!=="undefined"){g=global;}else if(typeof self!=="undefined"){g=self;}else{g=this;}g.retoldDataBeacon=f();}})(function(){var define,module,exports;return function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a;}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r);},p,p.exports,r,e,n,t);}return n[i].exports;}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o;}return r;}()({1:[function(require,module,exports){module.exports={"name":"fable-serviceproviderbase","version":"3.0.19","description":"Simple base classes for fable services.","main":"source/Fable-ServiceProviderBase.js","scripts":{"start":"node source/Fable-ServiceProviderBase.js","test":"npx quack test","tests":"npx quack test -g","coverage":"npx quack coverage","build":"npx quack build","types":"tsc -p ./tsconfig.build.json","check":"tsc -p . --noEmit"},"types":"types/source/Fable-ServiceProviderBase.d.ts","mocha":{"diff":true,"extension":["js"],"package":"./package.json","reporter":"spec","slow":"75","timeout":"5000","ui":"tdd","watch-files":["source/**/*.js","test/**/*.js"],"watch-ignore":["lib/vendor"]},"repository":{"type":"git","url":"https://github.com/stevenvelozo/fable-serviceproviderbase.git"},"keywords":["entity","behavior"],"author":"Steven Velozo <steven@velozo.com> (http://velozo.com/)","license":"MIT","bugs":{"url":"https://github.com/stevenvelozo/fable-serviceproviderbase/issues"},"homepage":"https://github.com/stevenvelozo/fable-serviceproviderbase","devDependencies":{"@types/mocha":"^10.0.10","fable":"^3.1.62","quackage":"^1.0.58","typescript":"^5.9.3"}};},{}],2:[function(require,module,exports){/**
* Fable Service Base
* @author <steven@velozo.com>
*/const libPackage=require('../package.json');class FableServiceProviderBase{/**
	 * The constructor can be used in two ways:
	 * 1) With a fable, options object and service hash (the options object and service hash are optional)a
	 * 2) With an object or nothing as the first parameter, where it will be treated as the options object
	 *
	 * @param {import('fable')|Record<string, any>} [pFable] - (optional) The fable instance, or the options object if there is no fable
	 * @param {Record<string, any>|string} [pOptions] - (optional) The options object, or the service hash if there is no fable
	 * @param {string} [pServiceHash] - (optional) The service hash to identify this service instance
	 */constructor(pFable,pOptions,pServiceHash){/** @type {import('fable')} */this.fable;/** @type {string} */this.UUID;/** @type {Record<string, any>} */this.options;/** @type {Record<string, any>} */this.services;/** @type {Record<string, any>} */this.servicesMap;// Check if a fable was passed in; connect it if so
if(typeof pFable==='object'&&pFable.isFable){this.connectFable(pFable);}else{this.fable=false;}// Initialize the services map if it wasn't passed in
/** @type {Record<string, any>} */this._PackageFableServiceProvider=libPackage;// initialize options and UUID based on whether the fable was passed in or not.
if(this.fable){this.UUID=pFable.getUUID();this.options=typeof pOptions==='object'?pOptions:{};}else{// With no fable, check to see if there was an object passed into either of the first two
// Parameters, and if so, treat it as the options object
this.options=typeof pFable==='object'&&!pFable.isFable?pFable:typeof pOptions==='object'?pOptions:{};this.UUID=`CORE-SVC-${Math.floor(Math.random()*(99999-10000)+10000)}`;}// It's expected that the deriving class will set this
this.serviceType=`Unknown-${this.UUID}`;// The service hash is used to identify the specific instantiation of the service in the services map
this.Hash=typeof pServiceHash==='string'?pServiceHash:!this.fable&&typeof pOptions==='string'?pOptions:`${this.UUID}`;}/**
	 * @param {import('fable')} pFable
	 */connectFable(pFable){if(typeof pFable!=='object'||!pFable.isFable){let tmpErrorMessage=`Fable Service Provider Base: Cannot connect to Fable, invalid Fable object passed in.  The pFable parameter was a [${typeof pFable}].}`;console.log(tmpErrorMessage);return new Error(tmpErrorMessage);}if(!this.fable){this.fable=pFable;}if(!this.log){this.log=this.fable.Logging;}if(!this.services){this.services=this.fable.services;}if(!this.servicesMap){this.servicesMap=this.fable.servicesMap;}return true;}static isFableService=true;}module.exports=FableServiceProviderBase;// This is left here in case we want to go back to having different code/base class for "core" services
module.exports.CoreServiceProviderBase=FableServiceProviderBase;},{"../package.json":1}],3:[function(require,module,exports){!function(t,n){"object"==typeof exports&&"object"==typeof module?module.exports=n():"function"==typeof define&&define.amd?define("Navigo",[],n):"object"==typeof exports?exports.Navigo=n():t.Navigo=n();}("undefined"!=typeof self?self:this,function(){return function(){"use strict";var t={407:function(t,n,e){e.d(n,{default:function(){return N;}});var o=/([:*])(\w+)/g,r=/\*/g,i=/\/\?/g;function a(t){return void 0===t&&(t="/"),v()?location.pathname+location.search+location.hash:t;}function s(t){return t.replace(/\/+$/,"").replace(/^\/+/,"");}function c(t){return"string"==typeof t;}function u(t){return t&&t.indexOf("#")>=0&&t.split("#").pop()||"";}function h(t){var n=s(t).split(/\?(.*)?$/);return[s(n[0]),n.slice(1).join("")];}function f(t){for(var n={},e=t.split("&"),o=0;o<e.length;o++){var r=e[o].split("=");if(""!==r[0]){var i=decodeURIComponent(r[0]);n[i]?(Array.isArray(n[i])||(n[i]=[n[i]]),n[i].push(decodeURIComponent(r[1]||""))):n[i]=decodeURIComponent(r[1]||"");}}return n;}function l(t,n){var e,a=h(s(t.currentLocationPath)),l=a[0],p=a[1],d=""===p?null:f(p),v=[];if(c(n.path)){if(e="(?:/^|^)"+s(n.path).replace(o,function(t,n,e){return v.push(e),"([^/]+)";}).replace(r,"?(?:.*)").replace(i,"/?([^/]+|)")+"$",""===s(n.path)&&""===s(l))return{url:l,queryString:p,hashString:u(t.to),route:n,data:null,params:d};}else e=n.path;var g=new RegExp(e,""),m=l.match(g);if(m){var y=c(n.path)?function(t,n){return 0===n.length?null:t?t.slice(1,t.length).reduce(function(t,e,o){return null===t&&(t={}),t[n[o]]=decodeURIComponent(e),t;},null):null;}(m,v):m.groups?m.groups:m.slice(1);return{url:s(l.replace(new RegExp("^"+t.instance.root),"")),queryString:p,hashString:u(t.to),route:n,data:y,params:d};}return!1;}function p(){return!("undefined"==typeof window||!window.history||!window.history.pushState);}function d(t,n){return void 0===t[n]||!0===t[n];}function v(){return"undefined"!=typeof window;}function g(t,n){return void 0===t&&(t=[]),void 0===n&&(n={}),t.filter(function(t){return t;}).forEach(function(t){["before","after","already","leave"].forEach(function(e){t[e]&&(n[e]||(n[e]=[]),n[e].push(t[e]));});}),n;}function m(t,n,e){var o=n||{},r=0;!function n(){t[r]?Array.isArray(t[r])?(t.splice.apply(t,[r,1].concat(t[r][0](o)?t[r][1]:t[r][2])),n()):t[r](o,function(t){void 0===t||!0===t?(r+=1,n()):e&&e(o);}):e&&e(o);}();}function y(t,n){void 0===t.currentLocationPath&&(t.currentLocationPath=t.to=a(t.instance.root)),t.currentLocationPath=t.instance._checkForAHash(t.currentLocationPath),n();}function _(t,n){for(var e=0;e<t.instance.routes.length;e++){var o=l(t,t.instance.routes[e]);if(o&&(t.matches||(t.matches=[]),t.matches.push(o),"ONE"===t.resolveOptions.strategy))return void n();}n();}function k(t,n){t.navigateOptions&&(void 0!==t.navigateOptions.shouldResolve&&console.warn('"shouldResolve" is deprecated. Please check the documentation.'),void 0!==t.navigateOptions.silent&&console.warn('"silent" is deprecated. Please check the documentation.')),n();}function O(t,n){!0===t.navigateOptions.force?(t.instance._setCurrent([t.instance._pathToMatchObject(t.to)]),n(!1)):n();}m.if=function(t,n,e){return Array.isArray(n)||(n=[n]),Array.isArray(e)||(e=[e]),[t,n,e];};var w=v(),L=p();function b(t,n){if(d(t.navigateOptions,"updateBrowserURL")){var e=("/"+t.to).replace(/\/\//g,"/"),o=w&&t.resolveOptions&&!0===t.resolveOptions.hash;L?(history[t.navigateOptions.historyAPIMethod||"pushState"](t.navigateOptions.stateObj||{},t.navigateOptions.title||"",o?"#"+e:e),location&&location.hash&&(t.instance.__freezeListening=!0,setTimeout(function(){if(!o){var n=location.hash;location.hash="",location.hash=n;}t.instance.__freezeListening=!1;},1))):w&&(window.location.href=t.to);}n();}function A(t,n){var e=t.instance;e.lastResolved()?m(e.lastResolved().map(function(n){return function(e,o){if(n.route.hooks&&n.route.hooks.leave){var r=!1,i=t.instance.matchLocation(n.route.path,t.currentLocationPath,!1);r="*"!==n.route.path?!i:!(t.matches&&t.matches.find(function(t){return n.route.path===t.route.path;})),d(t.navigateOptions,"callHooks")&&r?m(n.route.hooks.leave.map(function(n){return function(e,o){return n(function(n){!1===n?t.instance.__markAsClean(t):o();},t.matches&&t.matches.length>0?1===t.matches.length?t.matches[0]:t.matches:void 0);};}).concat([function(){return o();}])):o();}else o();};}),{},function(){return n();}):n();}function P(t,n){d(t.navigateOptions,"updateState")&&t.instance._setCurrent(t.matches),n();}var R=[function(t,n){var e=t.instance.lastResolved();if(e&&e[0]&&e[0].route===t.match.route&&e[0].url===t.match.url&&e[0].queryString===t.match.queryString)return e.forEach(function(n){n.route.hooks&&n.route.hooks.already&&d(t.navigateOptions,"callHooks")&&n.route.hooks.already.forEach(function(n){return n(t.match);});}),void n(!1);n();},function(t,n){t.match.route.hooks&&t.match.route.hooks.before&&d(t.navigateOptions,"callHooks")?m(t.match.route.hooks.before.map(function(n){return function(e,o){return n(function(n){!1===n?t.instance.__markAsClean(t):o();},t.match);};}).concat([function(){return n();}])):n();},function(t,n){d(t.navigateOptions,"callHandler")&&t.match.route.handler(t.match),t.instance.updatePageLinks(),n();},function(t,n){t.match.route.hooks&&t.match.route.hooks.after&&d(t.navigateOptions,"callHooks")&&t.match.route.hooks.after.forEach(function(n){return n(t.match);}),n();}],S=[A,function(t,n){var e=t.instance._notFoundRoute;if(e){t.notFoundHandled=!0;var o=h(t.currentLocationPath),r=o[0],i=o[1],a=u(t.to);e.path=s(r);var c={url:e.path,queryString:i,hashString:a,data:null,route:e,params:""!==i?f(i):null};t.matches=[c],t.match=c;}n();},m.if(function(t){return t.notFoundHandled;},R.concat([P]),[function(t,n){t.resolveOptions&&!1!==t.resolveOptions.noMatchWarning&&void 0!==t.resolveOptions.noMatchWarning||console.warn('Navigo: "'+t.currentLocationPath+"\" didn't match any of the registered routes."),n();},function(t,n){t.instance._setCurrent(null),n();}])];function E(){return(E=Object.assign||function(t){for(var n=1;n<arguments.length;n++){var e=arguments[n];for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o]);}return t;}).apply(this,arguments);}function x(t,n){var e=0;A(t,function o(){e!==t.matches.length?m(R,E({},t,{match:t.matches[e]}),function(){e+=1,o();}):P(t,n);});}function H(t){t.instance.__markAsClean(t);}function j(){return(j=Object.assign||function(t){for(var n=1;n<arguments.length;n++){var e=arguments[n];for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o]);}return t;}).apply(this,arguments);}var C="[data-navigo]";function N(t,n){var e,o=n||{strategy:"ONE",hash:!1,noMatchWarning:!1,linksSelector:C},r=this,i="/",d=null,w=[],L=!1,A=p(),P=v();function R(t){return t.indexOf("#")>=0&&(t=!0===o.hash?t.split("#")[1]||"/":t.split("#")[0]),t;}function E(t){return s(i+"/"+s(t));}function N(t,n,e,o){return t=c(t)?E(t):t,{name:o||s(String(t)),path:t,handler:n,hooks:g(e)};}function U(t,n){if(!r.__dirty){r.__dirty=!0,t=t?s(i)+"/"+s(t):void 0;var e={instance:r,to:t,currentLocationPath:t,navigateOptions:{},resolveOptions:j({},o,n)};return m([y,_,m.if(function(t){var n=t.matches;return n&&n.length>0;},x,S)],e,H),!!e.matches&&e.matches;}r.__waiting.push(function(){return r.resolve(t,n);});}function q(t,n){if(r.__dirty)r.__waiting.push(function(){return r.navigate(t,n);});else{r.__dirty=!0,t=s(i)+"/"+s(t);var e={instance:r,to:t,navigateOptions:n||{},resolveOptions:n&&n.resolveOptions?n.resolveOptions:o,currentLocationPath:R(t)};m([k,O,_,m.if(function(t){var n=t.matches;return n&&n.length>0;},x,S),b,H],e,H);}}function F(){if(P)return(P?[].slice.call(document.querySelectorAll(o.linksSelector||C)):[]).forEach(function(t){"false"!==t.getAttribute("data-navigo")&&"_blank"!==t.getAttribute("target")?t.hasListenerAttached||(t.hasListenerAttached=!0,t.navigoHandler=function(n){if((n.ctrlKey||n.metaKey)&&"a"===n.target.tagName.toLowerCase())return!1;var e=t.getAttribute("href");if(null==e)return!1;if(e.match(/^(http|https)/)&&"undefined"!=typeof URL)try{var o=new URL(e);e=o.pathname+o.search;}catch(t){}var i=function(t){if(!t)return{};var n,e=t.split(","),o={};return e.forEach(function(t){var e=t.split(":").map(function(t){return t.replace(/(^ +| +$)/g,"");});switch(e[0]){case"historyAPIMethod":o.historyAPIMethod=e[1];break;case"resolveOptionsStrategy":n||(n={}),n.strategy=e[1];break;case"resolveOptionsHash":n||(n={}),n.hash="true"===e[1];break;case"updateBrowserURL":case"callHandler":case"updateState":case"force":o[e[0]]="true"===e[1];}}),n&&(o.resolveOptions=n),o;}(t.getAttribute("data-navigo-options"));L||(n.preventDefault(),n.stopPropagation(),r.navigate(s(e),i));},t.addEventListener("click",t.navigoHandler)):t.hasListenerAttached&&t.removeEventListener("click",t.navigoHandler);}),r;}function I(t,n,e){var o=w.find(function(n){return n.name===t;}),r=null;if(o){if(r=o.path,n)for(var a in n)r=r.replace(":"+a,n[a]);r=r.match(/^\//)?r:"/"+r;}return r&&e&&!e.includeRoot&&(r=r.replace(new RegExp("^/"+i),"")),r;}function M(t){var n=h(s(t)),o=n[0],r=n[1],i=""===r?null:f(r);return{url:o,queryString:r,hashString:u(t),route:N(o,function(){},[e],o),data:null,params:i};}function T(t,n,e){return"string"==typeof n&&(n=z(n)),n?(n.hooks[t]||(n.hooks[t]=[]),n.hooks[t].push(e),function(){n.hooks[t]=n.hooks[t].filter(function(t){return t!==e;});}):(console.warn("Route doesn't exists: "+n),function(){});}function z(t){return"string"==typeof t?w.find(function(n){return n.name===E(t);}):w.find(function(n){return n.handler===t;});}t?i=s(t):console.warn('Navigo requires a root path in its constructor. If not provided will use "/" as default.'),this.root=i,this.routes=w,this.destroyed=L,this.current=d,this.__freezeListening=!1,this.__waiting=[],this.__dirty=!1,this.__markAsClean=function(t){t.instance.__dirty=!1,t.instance.__waiting.length>0&&t.instance.__waiting.shift()();},this.on=function(t,n,o){var r=this;return"object"!=typeof t||t instanceof RegExp?("function"==typeof t&&(o=n,n=t,t=i),w.push(N(t,n,[e,o])),this):(Object.keys(t).forEach(function(n){if("function"==typeof t[n])r.on(n,t[n]);else{var o=t[n],i=o.uses,a=o.as,s=o.hooks;w.push(N(n,i,[e,s],a));}}),this);},this.off=function(t){return this.routes=w=w.filter(function(n){return c(t)?s(n.path)!==s(t):"function"==typeof t?t!==n.handler:String(n.path)!==String(t);}),this;},this.resolve=U,this.navigate=q,this.navigateByName=function(t,n,e){var o=I(t,n);return null!==o&&(q(o.replace(new RegExp("^/?"+i),""),e),!0);},this.destroy=function(){this.routes=w=[],A&&window.removeEventListener("popstate",this.__popstateListener),this.destroyed=L=!0;},this.notFound=function(t,n){return r._notFoundRoute=N("*",t,[e,n],"__NOT_FOUND__"),this;},this.updatePageLinks=F,this.link=function(t){return"/"+i+"/"+s(t);},this.hooks=function(t){return e=t,this;},this.extractGETParameters=function(t){return h(R(t));},this.lastResolved=function(){return d;},this.generate=I,this.getLinkPath=function(t){return t.getAttribute("href");},this.match=function(t){var n={instance:r,currentLocationPath:t,to:t,navigateOptions:{},resolveOptions:o};return _(n,function(){}),!!n.matches&&n.matches;},this.matchLocation=function(t,n,e){void 0===n||void 0!==e&&!e||(n=E(n));var o={instance:r,to:n,currentLocationPath:n};return y(o,function(){}),"string"==typeof t&&(t=void 0===e||e?E(t):t),l(o,{name:String(t),path:t,handler:function(){},hooks:{}})||!1;},this.getCurrentLocation=function(){return M(s(a(i)).replace(new RegExp("^"+i),""));},this.addBeforeHook=T.bind(this,"before"),this.addAfterHook=T.bind(this,"after"),this.addAlreadyHook=T.bind(this,"already"),this.addLeaveHook=T.bind(this,"leave"),this.getRoute=z,this._pathToMatchObject=M,this._clean=s,this._checkForAHash=R,this._setCurrent=function(t){return d=r.current=t;},function(){A&&(this.__popstateListener=function(){r.__freezeListening||U();},window.addEventListener("popstate",this.__popstateListener));}.call(this),F.call(this);}}},n={};function e(o){if(n[o])return n[o].exports;var r=n[o]={exports:{}};return t[o](r,r.exports,e),r.exports;}return e.d=function(t,n){for(var o in n)e.o(n,o)&&!e.o(t,o)&&Object.defineProperty(t,o,{enumerable:!0,get:n[o]});},e.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n);},e(407);}().default;});},{}],4:[function(require,module,exports){module.exports={"name":"pict-application","version":"1.0.34","description":"Application base class for a pict view-based application","main":"source/Pict-Application.js","scripts":{"test":"npx quack test","start":"node source/Pict-Application.js","coverage":"npx quack coverage","build":"npx quack build","docker-dev-build":"docker build ./ -f Dockerfile_LUXURYCode -t pict-application-image:local","docker-dev-run":"docker run -it -d --name pict-application-dev -p 30001:8080 -p 38086:8086 -v \"$PWD/.config:/home/coder/.config\"  -v \"$PWD:/home/coder/pict-application\" -u \"$(id -u):$(id -g)\" -e \"DOCKER_USER=$USER\" pict-application-image:local","docker-dev-shell":"docker exec -it pict-application-dev /bin/bash","tests":"npx quack test -g","lint":"eslint source/**","types":"tsc -p ."},"types":"types/source/Pict-Application.d.ts","repository":{"type":"git","url":"git+https://github.com/stevenvelozo/pict-application.git"},"author":"steven velozo <steven@velozo.com>","license":"MIT","bugs":{"url":"https://github.com/stevenvelozo/pict-application/issues"},"homepage":"https://github.com/stevenvelozo/pict-application#readme","devDependencies":{"@eslint/js":"^9.28.0","browser-env":"^3.3.0","eslint":"^9.28.0","pict":"^1.0.348","pict-docuserve":"^0.1.5","pict-provider":"^1.0.10","pict-view":"^1.0.66","quackage":"^1.1.0","typescript":"^5.9.3"},"mocha":{"diff":true,"extension":["js"],"package":"./package.json","reporter":"spec","slow":"75","timeout":"5000","ui":"tdd","watch-files":["source/**/*.js","test/**/*.js"],"watch-ignore":["lib/vendor"]},"dependencies":{"fable-serviceproviderbase":"^3.0.19"}};},{}],5:[function(require,module,exports){const libFableServiceBase=require('fable-serviceproviderbase');const libPackage=require('../package.json');const defaultPictSettings={Name:'DefaultPictApplication',// The main "viewport" is the view that is used to host our application
MainViewportViewIdentifier:'Default-View',MainViewportRenderableHash:false,MainViewportDestinationAddress:false,MainViewportDefaultDataAddress:false,// Whether or not we should automatically render the main viewport and other autorender views after we initialize the pict application
AutoSolveAfterInitialize:true,AutoRenderMainViewportViewAfterInitialize:true,AutoRenderViewsAfterInitialize:false,AutoLoginAfterInitialize:false,AutoLoadDataAfterLogin:false,ConfigurationOnlyViews:[],Manifests:{},// The prefix to prepend on all template destination hashes
IdentifierAddressPrefix:'PICT-'};/**
 * Base class for pict applications.
 */class PictApplication extends libFableServiceBase{/**
	 * @param {import('fable')} pFable
	 * @param {Record<string, any>} [pOptions]
	 * @param {string} [pServiceHash]
	 */constructor(pFable,pOptions,pServiceHash){let tmpCarryOverConfiguration=typeof pFable.settings.PictApplicationConfiguration==='object'?pFable.settings.PictApplicationConfiguration:{};let tmpOptions=Object.assign({},JSON.parse(JSON.stringify(defaultPictSettings)),tmpCarryOverConfiguration,pOptions);super(pFable,tmpOptions,pServiceHash);/** @type {any} */this.options;/** @type {any} */this.log;/** @type {import('pict') & import('fable')} */this.fable;/** @type {string} */this.UUID;/** @type {string} */this.Hash;/**
		 * @type {{ [key: string]: any }}
		 */this.servicesMap;this.serviceType='PictApplication';/** @type {Record<string, any>} */this._Package=libPackage;// Convenience and consistency naming
this.pict=this.fable;// Wire in the essential Pict state
/** @type {Record<string, any>} */this.AppData=this.fable.AppData;/** @type {Record<string, any>} */this.Bundle=this.fable.Bundle;/** @type {number} */this.initializeTimestamp;/** @type {number} */this.lastSolvedTimestamp;/** @type {number} */this.lastLoginTimestamp;/** @type {number} */this.lastMarshalFromViewsTimestamp;/** @type {number} */this.lastMarshalToViewsTimestamp;/** @type {number} */this.lastAutoRenderTimestamp;/** @type {number} */this.lastLoadDataTimestamp;// Load all the manifests for the application
let tmpManifestKeys=Object.keys(this.options.Manifests);if(tmpManifestKeys.length>0){for(let i=0;i<tmpManifestKeys.length;i++){// Load each manifest
let tmpManifestKey=tmpManifestKeys[i];this.fable.instantiateServiceProvider('Manifest',this.options.Manifests[tmpManifestKey],tmpManifestKey);}}}/* -------------------------------------------------------------------------- *//*                     Code Section: Solve All Views                          *//* -------------------------------------------------------------------------- *//**
	 * @return {boolean}
	 */onPreSolve(){if(this.pict.LogNoisiness>3){this.log.trace(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} onPreSolve:`);}return true;}/**
	 * @param {(error?: Error) => void} fCallback
	 */onPreSolveAsync(fCallback){this.onPreSolve();return fCallback();}/**
	 * @return {boolean}
	 */onBeforeSolve(){if(this.pict.LogNoisiness>3){this.log.trace(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} onBeforeSolve:`);}return true;}/**
	 * @param {(error?: Error) => void} fCallback
	 */onBeforeSolveAsync(fCallback){this.onBeforeSolve();return fCallback();}/**
	 * @return {boolean}
	 */onSolve(){if(this.pict.LogNoisiness>3){this.log.trace(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} onSolve:`);}return true;}/**
	 * @param {(error?: Error) => void} fCallback
	 */onSolveAsync(fCallback){this.onSolve();return fCallback();}/**
	 * @return {boolean}
	 */solve(){if(this.pict.LogNoisiness>2){this.log.trace(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} executing solve() function...`);}// Walk through any loaded providers and solve them as well.
let tmpLoadedProviders=Object.keys(this.pict.providers);let tmpProvidersToSolve=[];for(let i=0;i<tmpLoadedProviders.length;i++){let tmpProvider=this.pict.providers[tmpLoadedProviders[i]];if(tmpProvider.options.AutoSolveWithApp){tmpProvidersToSolve.push(tmpProvider);}}// Sort the providers by their priority (if they are all priority 0, it will end up being add order due to JSON Object Property Key order stuff)
tmpProvidersToSolve.sort((a,b)=>{return a.options.AutoSolveOrdinal-b.options.AutoSolveOrdinal;});for(let i=0;i<tmpProvidersToSolve.length;i++){tmpProvidersToSolve[i].solve(tmpProvidersToSolve[i]);}this.onBeforeSolve();// Now walk through any loaded views and initialize them as well.
let tmpLoadedViews=Object.keys(this.pict.views);let tmpViewsToSolve=[];for(let i=0;i<tmpLoadedViews.length;i++){let tmpView=this.pict.views[tmpLoadedViews[i]];if(tmpView.options.AutoInitialize){tmpViewsToSolve.push(tmpView);}}// Sort the views by their priority (if they are all priority 0, it will end up being add order due to JSON Object Property Key order stuff)
tmpViewsToSolve.sort((a,b)=>{return a.options.AutoInitializeOrdinal-b.options.AutoInitializeOrdinal;});for(let i=0;i<tmpViewsToSolve.length;i++){tmpViewsToSolve[i].solve();}this.onSolve();this.onAfterSolve();this.lastSolvedTimestamp=this.fable.log.getTimeStamp();return true;}/**
	 * @param {(error?: Error) => void} fCallback
	 */solveAsync(fCallback){let tmpAnticipate=this.fable.instantiateServiceProviderWithoutRegistration('Anticipate');tmpAnticipate.anticipate(this.onBeforeSolveAsync.bind(this));// Allow the callback to be passed in as the last parameter no matter what
let tmpCallback=typeof fCallback==='function'?fCallback:false;if(!tmpCallback){this.log.warn(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} solveAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions.`);tmpCallback=pError=>{if(pError){this.log.error(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} solveAsync Auto Callback Error: ${pError}`,pError);}};}// Walk through any loaded providers and solve them as well.
let tmpLoadedProviders=Object.keys(this.pict.providers);let tmpProvidersToSolve=[];for(let i=0;i<tmpLoadedProviders.length;i++){let tmpProvider=this.pict.providers[tmpLoadedProviders[i]];if(tmpProvider.options.AutoSolveWithApp){tmpProvidersToSolve.push(tmpProvider);}}// Sort the providers by their priority (if they are all priority 0, it will end up being add order due to JSON Object Property Key order stuff)
tmpProvidersToSolve.sort((a,b)=>{return a.options.AutoSolveOrdinal-b.options.AutoSolveOrdinal;});for(let i=0;i<tmpProvidersToSolve.length;i++){tmpAnticipate.anticipate(tmpProvidersToSolve[i].solveAsync.bind(tmpProvidersToSolve[i]));}// Walk through any loaded views and solve them as well.
let tmpLoadedViews=Object.keys(this.pict.views);let tmpViewsToSolve=[];for(let i=0;i<tmpLoadedViews.length;i++){let tmpView=this.pict.views[tmpLoadedViews[i]];if(tmpView.options.AutoSolveWithApp){tmpViewsToSolve.push(tmpView);}}// Sort the views by their priority (if they are all priority 0, it will end up being add order due to JSON Object Property Key order stuff)
tmpViewsToSolve.sort((a,b)=>{return a.options.AutoSolveOrdinal-b.options.AutoSolveOrdinal;});for(let i=0;i<tmpViewsToSolve.length;i++){tmpAnticipate.anticipate(tmpViewsToSolve[i].solveAsync.bind(tmpViewsToSolve[i]));}tmpAnticipate.anticipate(this.onSolveAsync.bind(this));tmpAnticipate.anticipate(this.onAfterSolveAsync.bind(this));tmpAnticipate.wait(pError=>{if(this.pict.LogNoisiness>2){this.log.trace(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} solveAsync() complete.`);}this.lastSolvedTimestamp=this.fable.log.getTimeStamp();return tmpCallback(pError);});}/**
	 * @return {boolean}
	 */onAfterSolve(){if(this.pict.LogNoisiness>3){this.log.trace(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} onAfterSolve:`);}return true;}/**
	 * @param {(error?: Error) => void} fCallback
	 */onAfterSolveAsync(fCallback){this.onAfterSolve();return fCallback();}/* -------------------------------------------------------------------------- *//*                     Code Section: Application Login                        *//* -------------------------------------------------------------------------- *//**
	 * @param {(error?: Error) => void} fCallback
	 */onBeforeLoginAsync(fCallback){if(this.pict.LogNoisiness>3){this.log.trace(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} onBeforeLoginAsync:`);}return fCallback();}/**
	 * @param {(error?: Error) => void} fCallback
	 */onLoginAsync(fCallback){if(this.pict.LogNoisiness>3){this.log.trace(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} onLoginAsync:`);}return fCallback();}/**
	 * @param {(error?: Error) => void} fCallback
	 */loginAsync(fCallback){const tmpAnticipate=this.fable.instantiateServiceProviderWithoutRegistration('Anticipate');let tmpCallback=fCallback;if(typeof tmpCallback!=='function'){this.log.warn(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} loginAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions.`);tmpCallback=pError=>{if(pError){this.log.error(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} loginAsync Auto Callback Error: ${pError}`,pError);}};}tmpAnticipate.anticipate(this.onBeforeLoginAsync.bind(this));tmpAnticipate.anticipate(this.onLoginAsync.bind(this));tmpAnticipate.anticipate(this.onAfterLoginAsync.bind(this));// check and see if we should automatically trigger a data load
if(this.options.AutoLoadDataAfterLogin){tmpAnticipate.anticipate(fNext=>{if(!this.isLoggedIn()){return fNext();}if(this.pict.LogNoisiness>1){this.log.trace(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} auto loading data after login...`);}//TODO: should data load errors funnel here? this creates a weird coupling between login and data load callbacks
this.loadDataAsync(pError=>{fNext(pError);});});}tmpAnticipate.wait(pError=>{if(this.pict.LogNoisiness>2){this.log.trace(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} loginAsync() complete.`);}this.lastLoginTimestamp=this.fable.log.getTimeStamp();return tmpCallback(pError);});}/**
	 * Check if the application state is logged in. Defaults to true. Override this method in your application based on login requirements.
	 *
	 * @return {boolean}
	 */isLoggedIn(){return true;}/**
	 * @param {(error?: Error) => void} fCallback
	 */onAfterLoginAsync(fCallback){if(this.pict.LogNoisiness>3){this.log.trace(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} onAfterLoginAsync:`);}return fCallback();}/* -------------------------------------------------------------------------- *//*                     Code Section: Application LoadData                     *//* -------------------------------------------------------------------------- *//**
	 * @param {(error?: Error) => void} fCallback
	 */onBeforeLoadDataAsync(fCallback){if(this.pict.LogNoisiness>3){this.log.trace(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} onBeforeLoadDataAsync:`);}return fCallback();}/**
	 * @param {(error?: Error) => void} fCallback
	 */onLoadDataAsync(fCallback){if(this.pict.LogNoisiness>3){this.log.trace(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} onLoadDataAsync:`);}return fCallback();}/**
	 * @param {(error?: Error) => void} fCallback
	 */loadDataAsync(fCallback){const tmpAnticipate=this.fable.instantiateServiceProviderWithoutRegistration('Anticipate');let tmpCallback=fCallback;if(typeof tmpCallback!=='function'){this.log.warn(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} loadDataAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions.`);tmpCallback=pError=>{if(pError){this.log.error(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} loadDataAsync Auto Callback Error: ${pError}`,pError);}};}tmpAnticipate.anticipate(this.onBeforeLoadDataAsync.bind(this));// Walk through any loaded providers and load their data as well.
let tmpLoadedProviders=Object.keys(this.pict.providers);let tmpProvidersToLoadData=[];for(let i=0;i<tmpLoadedProviders.length;i++){let tmpProvider=this.pict.providers[tmpLoadedProviders[i]];if(tmpProvider.options.AutoLoadDataWithApp){tmpProvidersToLoadData.push(tmpProvider);}}// Sort the providers by their priority (if they are all priority 0, it will end up being add order due to JSON Object Property Key order stuff)
tmpProvidersToLoadData.sort((a,b)=>{return a.options.AutoLoadDataOrdinal-b.options.AutoLoadDataOrdinal;});for(const tmpProvider of tmpProvidersToLoadData){tmpAnticipate.anticipate(tmpProvider.onBeforeLoadDataAsync.bind(tmpProvider));}tmpAnticipate.anticipate(this.onLoadDataAsync.bind(this));//TODO: think about ways to parallelize these
for(const tmpProvider of tmpProvidersToLoadData){tmpAnticipate.anticipate(tmpProvider.onLoadDataAsync.bind(tmpProvider));}tmpAnticipate.anticipate(this.onAfterLoadDataAsync.bind(this));for(const tmpProvider of tmpProvidersToLoadData){tmpAnticipate.anticipate(tmpProvider.onAfterLoadDataAsync.bind(tmpProvider));}tmpAnticipate.wait(/** @param {Error} [pError] */pError=>{if(this.pict.LogNoisiness>2){this.log.trace(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} loadDataAsync() complete.`);}this.lastLoadDataTimestamp=this.fable.log.getTimeStamp();return tmpCallback(pError);});}/**
	 * @param {(error?: Error) => void} fCallback
	 */onAfterLoadDataAsync(fCallback){if(this.pict.LogNoisiness>3){this.log.trace(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} onAfterLoadDataAsync:`);}return fCallback();}/* -------------------------------------------------------------------------- *//*                     Code Section: Application SaveData                     *//* -------------------------------------------------------------------------- *//**
	 * @param {(error?: Error) => void} fCallback
	 */onBeforeSaveDataAsync(fCallback){if(this.pict.LogNoisiness>3){this.log.trace(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} onBeforeSaveDataAsync:`);}return fCallback();}/**
	 * @param {(error?: Error) => void} fCallback
	 */onSaveDataAsync(fCallback){if(this.pict.LogNoisiness>3){this.log.trace(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} onSaveDataAsync:`);}return fCallback();}/**
	 * @param {(error?: Error) => void} fCallback
	 */saveDataAsync(fCallback){const tmpAnticipate=this.fable.instantiateServiceProviderWithoutRegistration('Anticipate');let tmpCallback=fCallback;if(typeof tmpCallback!=='function'){this.log.warn(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} saveDataAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions.`);tmpCallback=pError=>{if(pError){this.log.error(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} saveDataAsync Auto Callback Error: ${pError}`,pError);}};}tmpAnticipate.anticipate(this.onBeforeSaveDataAsync.bind(this));// Walk through any loaded providers and load their data as well.
let tmpLoadedProviders=Object.keys(this.pict.providers);let tmpProvidersToSaveData=[];for(let i=0;i<tmpLoadedProviders.length;i++){let tmpProvider=this.pict.providers[tmpLoadedProviders[i]];if(tmpProvider.options.AutoSaveDataWithApp){tmpProvidersToSaveData.push(tmpProvider);}}// Sort the providers by their priority (if they are all priority 0, it will end up being add order due to JSON Object Property Key order stuff)
tmpProvidersToSaveData.sort((a,b)=>{return a.options.AutoSaveDataOrdinal-b.options.AutoSaveDataOrdinal;});for(const tmpProvider of tmpProvidersToSaveData){tmpAnticipate.anticipate(tmpProvider.onBeforeSaveDataAsync.bind(tmpProvider));}tmpAnticipate.anticipate(this.onSaveDataAsync.bind(this));//TODO: think about ways to parallelize these
for(const tmpProvider of tmpProvidersToSaveData){tmpAnticipate.anticipate(tmpProvider.onSaveDataAsync.bind(tmpProvider));}tmpAnticipate.anticipate(this.onAfterSaveDataAsync.bind(this));for(const tmpProvider of tmpProvidersToSaveData){tmpAnticipate.anticipate(tmpProvider.onAfterSaveDataAsync.bind(tmpProvider));}tmpAnticipate.wait(/** @param {Error} [pError] */pError=>{if(this.pict.LogNoisiness>2){this.log.trace(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} saveDataAsync() complete.`);}this.lastSaveDataTimestamp=this.fable.log.getTimeStamp();return tmpCallback(pError);});}/**
	 * @param {(error?: Error) => void} fCallback
	 */onAfterSaveDataAsync(fCallback){if(this.pict.LogNoisiness>3){this.log.trace(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} onAfterSaveDataAsync:`);}return fCallback();}/* -------------------------------------------------------------------------- *//*                     Code Section: Initialize Application                   *//* -------------------------------------------------------------------------- *//**
	 * @return {boolean}
	 */onBeforeInitialize(){if(this.pict.LogNoisiness>3){this.log.trace(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} onBeforeInitialize:`);}return true;}/**
	 * @param {(error?: Error) => void} fCallback
	 */onBeforeInitializeAsync(fCallback){this.onBeforeInitialize();return fCallback();}/**
	 * @return {boolean}
	 */onInitialize(){if(this.pict.LogNoisiness>3){this.log.trace(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} onInitialize:`);}return true;}/**
	 * @param {(error?: Error) => void} fCallback
	 */onInitializeAsync(fCallback){this.onInitialize();return fCallback();}/**
	 * @return {boolean}
	 */initialize(){if(this.pict.LogControlFlow){this.log.trace(`PICT-ControlFlow APPLICATION [${this.UUID}]::[${this.Hash}] ${this.options.Name} initialize:`);}if(!this.initializeTimestamp){this.onBeforeInitialize();if('ConfigurationOnlyViews'in this.options){// Load all the configuration only views
for(let i=0;i<this.options.ConfigurationOnlyViews.length;i++){let tmpViewIdentifier=typeof this.options.ConfigurationOnlyViews[i].ViewIdentifier==='undefined'?`AutoView-${this.fable.getUUID()}`:this.options.ConfigurationOnlyViews[i].ViewIdentifier;this.log.info(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} adding configuration only view: ${tmpViewIdentifier}`);this.pict.addView(tmpViewIdentifier,this.options.ConfigurationOnlyViews[i]);}}this.onInitialize();// Walk through any loaded providers and initialize them as well.
let tmpLoadedProviders=Object.keys(this.pict.providers);let tmpProvidersToInitialize=[];for(let i=0;i<tmpLoadedProviders.length;i++){let tmpProvider=this.pict.providers[tmpLoadedProviders[i]];if(tmpProvider.options.AutoInitialize){tmpProvidersToInitialize.push(tmpProvider);}}// Sort the providers by their priority (if they are all priority 0, it will end up being add order due to JSON Object Property Key order stuff)
tmpProvidersToInitialize.sort((a,b)=>{return a.options.AutoInitializeOrdinal-b.options.AutoInitializeOrdinal;});for(let i=0;i<tmpProvidersToInitialize.length;i++){tmpProvidersToInitialize[i].initialize();}// Now walk through any loaded views and initialize them as well.
let tmpLoadedViews=Object.keys(this.pict.views);let tmpViewsToInitialize=[];for(let i=0;i<tmpLoadedViews.length;i++){let tmpView=this.pict.views[tmpLoadedViews[i]];if(tmpView.options.AutoInitialize){tmpViewsToInitialize.push(tmpView);}}// Sort the views by their priority (if they are all priority 0, it will end up being add order due to JSON Object Property Key order stuff)
tmpViewsToInitialize.sort((a,b)=>{return a.options.AutoInitializeOrdinal-b.options.AutoInitializeOrdinal;});for(let i=0;i<tmpViewsToInitialize.length;i++){tmpViewsToInitialize[i].initialize();}this.onAfterInitialize();if(this.options.AutoSolveAfterInitialize){if(this.pict.LogNoisiness>1){this.log.trace(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} auto solving after initialization...`);}// Solve the template synchronously
this.solve();}// Now check and see if we should automatically render as well
if(this.options.AutoRenderMainViewportViewAfterInitialize){if(this.pict.LogNoisiness>1){this.log.trace(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} auto rendering after initialization...`);}// Render the template synchronously
this.render();}this.initializeTimestamp=this.fable.log.getTimeStamp();this.onCompletionOfInitialize();return true;}else{this.log.warn(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} initialize called but initialization is already completed.  Aborting.`);return false;}}/**
	 * @param {(error?: Error) => void} fCallback
	 */initializeAsync(fCallback){if(this.pict.LogControlFlow){this.log.trace(`PICT-ControlFlow APPLICATION [${this.UUID}]::[${this.Hash}] ${this.options.Name} initializeAsync:`);}// Allow the callback to be passed in as the last parameter no matter what
let tmpCallback=typeof fCallback==='function'?fCallback:false;if(!tmpCallback){this.log.warn(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} initializeAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions.`);tmpCallback=pError=>{if(pError){this.log.error(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} initializeAsync Auto Callback Error: ${pError}`,pError);}};}if(!this.initializeTimestamp){let tmpAnticipate=this.fable.instantiateServiceProviderWithoutRegistration('Anticipate');if(this.pict.LogNoisiness>3){this.log.trace(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} beginning initialization...`);}if('ConfigurationOnlyViews'in this.options){// Load all the configuration only views
for(let i=0;i<this.options.ConfigurationOnlyViews.length;i++){let tmpViewIdentifier=typeof this.options.ConfigurationOnlyViews[i].ViewIdentifier==='undefined'?`AutoView-${this.fable.getUUID()}`:this.options.ConfigurationOnlyViews[i].ViewIdentifier;this.log.info(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} adding configuration only view: ${tmpViewIdentifier}`);this.pict.addView(tmpViewIdentifier,this.options.ConfigurationOnlyViews[i]);}}tmpAnticipate.anticipate(this.onBeforeInitializeAsync.bind(this));tmpAnticipate.anticipate(this.onInitializeAsync.bind(this));// Walk through any loaded providers and solve them as well.
let tmpLoadedProviders=Object.keys(this.pict.providers);let tmpProvidersToInitialize=[];for(let i=0;i<tmpLoadedProviders.length;i++){let tmpProvider=this.pict.providers[tmpLoadedProviders[i]];if(tmpProvider.options.AutoInitialize){tmpProvidersToInitialize.push(tmpProvider);}}// Sort the providers by their priority (if they are all priority 0, it will end up being add order due to JSON Object Property Key order stuff)
tmpProvidersToInitialize.sort((a,b)=>{return a.options.AutoInitializeOrdinal-b.options.AutoInitializeOrdinal;});for(let i=0;i<tmpProvidersToInitialize.length;i++){tmpAnticipate.anticipate(tmpProvidersToInitialize[i].initializeAsync.bind(tmpProvidersToInitialize[i]));}// Now walk through any loaded views and initialize them as well.
// TODO: Some optimization cleverness could be gained by grouping them into a parallelized async operation, by ordinal.
let tmpLoadedViews=Object.keys(this.pict.views);let tmpViewsToInitialize=[];for(let i=0;i<tmpLoadedViews.length;i++){let tmpView=this.pict.views[tmpLoadedViews[i]];if(tmpView.options.AutoInitialize){tmpViewsToInitialize.push(tmpView);}}// Sort the views by their priority
// If they are all the default priority 0, it will end up being add order due to JSON Object Property Key order stuff
tmpViewsToInitialize.sort((a,b)=>{return a.options.AutoInitializeOrdinal-b.options.AutoInitializeOrdinal;});for(let i=0;i<tmpViewsToInitialize.length;i++){let tmpView=tmpViewsToInitialize[i];tmpAnticipate.anticipate(tmpView.initializeAsync.bind(tmpView));}tmpAnticipate.anticipate(this.onAfterInitializeAsync.bind(this));if(this.options.AutoLoginAfterInitialize){if(this.pict.LogNoisiness>1){this.log.trace(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} auto login (asynchronously) after initialization...`);}tmpAnticipate.anticipate(this.loginAsync.bind(this));}if(this.options.AutoSolveAfterInitialize){if(this.pict.LogNoisiness>1){this.log.trace(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} auto solving (asynchronously) after initialization...`);}tmpAnticipate.anticipate(this.solveAsync.bind(this));}if(this.options.AutoRenderMainViewportViewAfterInitialize){if(this.pict.LogNoisiness>1){this.log.trace(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} auto rendering (asynchronously) after initialization...`);}tmpAnticipate.anticipate(this.renderMainViewportAsync.bind(this));}tmpAnticipate.wait(pError=>{if(pError){this.log.error(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} initializeAsync Error: ${pError.message||pError}`,{stack:pError.stack});}this.initializeTimestamp=this.fable.log.getTimeStamp();if(this.pict.LogNoisiness>2){this.log.trace(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} initialization complete.`);}return tmpCallback();});}else{this.log.warn(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} async initialize called but initialization is already completed.  Aborting.`);// TODO: Should this be an error?
return this.onCompletionOfInitializeAsync(tmpCallback);}}/**
	 * @return {boolean}
	 */onAfterInitialize(){if(this.pict.LogNoisiness>3){this.log.trace(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} onAfterInitialize:`);}return true;}/**
	 * @param {(error?: Error) => void} fCallback
	 */onAfterInitializeAsync(fCallback){this.onAfterInitialize();return fCallback();}/**
	 * @return {boolean}
	 */onCompletionOfInitialize(){if(this.pict.LogNoisiness>3){this.log.trace(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} onCompletionOfInitialize:`);}return true;}/**
	 * @param {(error?: Error) => void} fCallback
	 */onCompletionOfInitializeAsync(fCallback){this.onCompletionOfInitialize();return fCallback();}/* -------------------------------------------------------------------------- *//*                     Code Section: Marshal Data From All Views              *//* -------------------------------------------------------------------------- *//**
	 * @return {boolean}
	 */onBeforeMarshalFromViews(){if(this.pict.LogNoisiness>3){this.log.trace(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} onBeforeMarshalFromViews:`);}return true;}/**
	 * @param {(error?: Error) => void} fCallback
	 */onBeforeMarshalFromViewsAsync(fCallback){this.onBeforeMarshalFromViews();return fCallback();}/**
	 * @return {boolean}
	 */onMarshalFromViews(){if(this.pict.LogNoisiness>3){this.log.trace(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} onMarshalFromViews:`);}return true;}/**
	 * @param {(error?: Error) => void} fCallback
	 */onMarshalFromViewsAsync(fCallback){this.onMarshalFromViews();return fCallback();}/**
	 * @return {boolean}
	 */marshalFromViews(){if(this.pict.LogNoisiness>2){this.log.trace(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} executing marshalFromViews() function...`);}this.onBeforeMarshalFromViews();// Now walk through any loaded views and initialize them as well.
let tmpLoadedViews=Object.keys(this.pict.views);let tmpViewsToMarshalFromViews=[];for(let i=0;i<tmpLoadedViews.length;i++){let tmpView=this.pict.views[tmpLoadedViews[i]];tmpViewsToMarshalFromViews.push(tmpView);}for(let i=0;i<tmpViewsToMarshalFromViews.length;i++){tmpViewsToMarshalFromViews[i].marshalFromView();}this.onMarshalFromViews();this.onAfterMarshalFromViews();this.lastMarshalFromViewsTimestamp=this.fable.log.getTimeStamp();return true;}/**
	 * @param {(error?: Error) => void} fCallback
	 */marshalFromViewsAsync(fCallback){let tmpAnticipate=this.fable.instantiateServiceProviderWithoutRegistration('Anticipate');// Allow the callback to be passed in as the last parameter no matter what
let tmpCallback=typeof fCallback==='function'?fCallback:false;if(!tmpCallback){this.log.warn(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} marshalFromViewsAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions.`);tmpCallback=pError=>{if(pError){this.log.error(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} marshalFromViewsAsync Auto Callback Error: ${pError}`,pError);}};}tmpAnticipate.anticipate(this.onBeforeMarshalFromViewsAsync.bind(this));// Walk through any loaded views and marshalFromViews them as well.
let tmpLoadedViews=Object.keys(this.pict.views);let tmpViewsToMarshalFromViews=[];for(let i=0;i<tmpLoadedViews.length;i++){let tmpView=this.pict.views[tmpLoadedViews[i]];tmpViewsToMarshalFromViews.push(tmpView);}for(let i=0;i<tmpViewsToMarshalFromViews.length;i++){tmpAnticipate.anticipate(tmpViewsToMarshalFromViews[i].marshalFromViewAsync.bind(tmpViewsToMarshalFromViews[i]));}tmpAnticipate.anticipate(this.onMarshalFromViewsAsync.bind(this));tmpAnticipate.anticipate(this.onAfterMarshalFromViewsAsync.bind(this));tmpAnticipate.wait(pError=>{if(this.pict.LogNoisiness>2){this.log.trace(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} marshalFromViewsAsync() complete.`);}this.lastMarshalFromViewsTimestamp=this.fable.log.getTimeStamp();return tmpCallback(pError);});}/**
	 * @return {boolean}
	 */onAfterMarshalFromViews(){if(this.pict.LogNoisiness>3){this.log.trace(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} onAfterMarshalFromViews:`);}return true;}/**
	 * @param {(error?: Error) => void} fCallback
	 */onAfterMarshalFromViewsAsync(fCallback){this.onAfterMarshalFromViews();return fCallback();}/* -------------------------------------------------------------------------- *//*                     Code Section: Marshal Data To All Views                *//* -------------------------------------------------------------------------- *//**
	 * @return {boolean}
	 */onBeforeMarshalToViews(){if(this.pict.LogNoisiness>3){this.log.trace(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} onBeforeMarshalToViews:`);}return true;}/**
	 * @param {(error?: Error) => void} fCallback
	 */onBeforeMarshalToViewsAsync(fCallback){this.onBeforeMarshalToViews();return fCallback();}/**
	 * @return {boolean}
	 */onMarshalToViews(){if(this.pict.LogNoisiness>3){this.log.trace(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} onMarshalToViews:`);}return true;}/**
	 * @param {(error?: Error) => void} fCallback
	 */onMarshalToViewsAsync(fCallback){this.onMarshalToViews();return fCallback();}/**
	 * @return {boolean}
	 */marshalToViews(){if(this.pict.LogNoisiness>2){this.log.trace(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} executing marshalToViews() function...`);}this.onBeforeMarshalToViews();// Now walk through any loaded views and initialize them as well.
let tmpLoadedViews=Object.keys(this.pict.views);let tmpViewsToMarshalToViews=[];for(let i=0;i<tmpLoadedViews.length;i++){let tmpView=this.pict.views[tmpLoadedViews[i]];tmpViewsToMarshalToViews.push(tmpView);}for(let i=0;i<tmpViewsToMarshalToViews.length;i++){tmpViewsToMarshalToViews[i].marshalToView();}this.onMarshalToViews();this.onAfterMarshalToViews();this.lastMarshalToViewsTimestamp=this.fable.log.getTimeStamp();return true;}/**
	 * @param {(error?: Error) => void} fCallback
	 */marshalToViewsAsync(fCallback){let tmpAnticipate=this.fable.instantiateServiceProviderWithoutRegistration('Anticipate');// Allow the callback to be passed in as the last parameter no matter what
let tmpCallback=typeof fCallback==='function'?fCallback:false;if(!tmpCallback){this.log.warn(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} marshalToViewsAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions.`);tmpCallback=pError=>{if(pError){this.log.error(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} marshalToViewsAsync Auto Callback Error: ${pError}`,pError);}};}tmpAnticipate.anticipate(this.onBeforeMarshalToViewsAsync.bind(this));// Walk through any loaded views and marshalToViews them as well.
let tmpLoadedViews=Object.keys(this.pict.views);let tmpViewsToMarshalToViews=[];for(let i=0;i<tmpLoadedViews.length;i++){let tmpView=this.pict.views[tmpLoadedViews[i]];tmpViewsToMarshalToViews.push(tmpView);}for(let i=0;i<tmpViewsToMarshalToViews.length;i++){tmpAnticipate.anticipate(tmpViewsToMarshalToViews[i].marshalToViewAsync.bind(tmpViewsToMarshalToViews[i]));}tmpAnticipate.anticipate(this.onMarshalToViewsAsync.bind(this));tmpAnticipate.anticipate(this.onAfterMarshalToViewsAsync.bind(this));tmpAnticipate.wait(pError=>{if(this.pict.LogNoisiness>2){this.log.trace(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} marshalToViewsAsync() complete.`);}this.lastMarshalToViewsTimestamp=this.fable.log.getTimeStamp();return tmpCallback(pError);});}/**
	 * @return {boolean}
	 */onAfterMarshalToViews(){if(this.pict.LogNoisiness>3){this.log.trace(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} onAfterMarshalToViews:`);}return true;}/**
	 * @param {(error?: Error) => void} fCallback
	 */onAfterMarshalToViewsAsync(fCallback){this.onAfterMarshalToViews();return fCallback();}/* -------------------------------------------------------------------------- *//*                     Code Section: Render View                              *//* -------------------------------------------------------------------------- *//**
	 * @return {boolean}
	 */onBeforeRender(){if(this.pict.LogNoisiness>3){this.log.trace(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} onBeforeRender:`);}return true;}/**
	 * @param {(error?: Error) => void} fCallback
	 */onBeforeRenderAsync(fCallback){this.onBeforeRender();return fCallback();}/**
	 * @param {string} [pViewIdentifier] - The hash of the view to render. By default, the main viewport view is rendered.
	 * @param {string} [pRenderableHash] - The hash of the renderable to render.
	 * @param {string} [pRenderDestinationAddress] - The address where the renderable will be rendered.
	 * @param {string} [pTemplateDataAddress] - The address where the data for the template is stored.
	 *
	 * TODO: Should we support objects for pTemplateDataAddress for parity with pict-view?
	 */render(pViewIdentifier,pRenderableHash,pRenderDestinationAddress,pTemplateDataAddress){let tmpViewIdentifier=typeof pViewIdentifier!=='string'?this.options.MainViewportViewIdentifier:pViewIdentifier;let tmpRenderableHash=typeof pRenderableHash!=='string'?this.options.MainViewportRenderableHash:pRenderableHash;let tmpRenderDestinationAddress=typeof pRenderDestinationAddress!=='string'?this.options.MainViewportDestinationAddress:pRenderDestinationAddress;let tmpTemplateDataAddress=typeof pTemplateDataAddress!=='string'?this.options.MainViewportDefaultDataAddress:pTemplateDataAddress;if(this.pict.LogControlFlow){this.log.trace(`PICT-ControlFlow APPLICATION [${this.UUID}]::[${this.Hash}] ${this.options.Name} VIEW Renderable[${tmpRenderableHash}] Destination[${tmpRenderDestinationAddress}] TemplateDataAddress[${tmpTemplateDataAddress}] render:`);}this.onBeforeRender();// Now get the view (by hash) from the loaded views
let tmpView=typeof tmpViewIdentifier==='string'?this.servicesMap.PictView[tmpViewIdentifier]:false;if(!tmpView){this.log.error(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} could not render from View ${tmpViewIdentifier} because it is not a valid view.`);return false;}this.onRender();tmpView.render(tmpRenderableHash,tmpRenderDestinationAddress,tmpTemplateDataAddress);this.onAfterRender();return true;}/**
	 * @return {boolean}
	 */onRender(){if(this.pict.LogNoisiness>3){this.log.trace(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} onRender:`);}return true;}/**
	 * @param {(error?: Error) => void} fCallback
	 */onRenderAsync(fCallback){this.onRender();return fCallback();}/**
	 * @param {string|((error?: Error) => void)} pViewIdentifier - The hash of the view to render. By default, the main viewport view is rendered. (or the callback)
	 * @param {string|((error?: Error) => void)} [pRenderableHash] - The hash of the renderable to render. (or the callback)
	 * @param {string|((error?: Error) => void)} [pRenderDestinationAddress] - The address where the renderable will be rendered. (or the callback)
	 * @param {string|((error?: Error) => void)} [pTemplateDataAddress] - The address where the data for the template is stored. (or the callback)
	 * @param {(error?: Error) => void} [fCallback] - The callback, if all other parameters are provided.
	 *
	 * TODO: Should we support objects for pTemplateDataAddress for parity with pict-view?
	 */renderAsync(pViewIdentifier,pRenderableHash,pRenderDestinationAddress,pTemplateDataAddress,fCallback){let tmpViewIdentifier=typeof pViewIdentifier!=='string'?this.options.MainViewportViewIdentifier:pViewIdentifier;let tmpRenderableHash=typeof pRenderableHash!=='string'?this.options.MainViewportRenderableHash:pRenderableHash;let tmpRenderDestinationAddress=typeof pRenderDestinationAddress!=='string'?this.options.MainViewportDestinationAddress:pRenderDestinationAddress;let tmpTemplateDataAddress=typeof pTemplateDataAddress!=='string'?this.options.MainViewportDefaultDataAddress:pTemplateDataAddress;// Allow the callback to be passed in as the last parameter no matter what
let tmpCallback=typeof fCallback==='function'?fCallback:typeof pTemplateDataAddress==='function'?pTemplateDataAddress:typeof pRenderDestinationAddress==='function'?pRenderDestinationAddress:typeof pRenderableHash==='function'?pRenderableHash:typeof pViewIdentifier==='function'?pViewIdentifier:false;if(!tmpCallback){this.log.warn(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} renderAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions.`);tmpCallback=pError=>{if(pError){this.log.error(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} renderAsync Auto Callback Error: ${pError}`,pError);}};}if(this.pict.LogControlFlow){this.log.trace(`PICT-ControlFlow APPLICATION [${this.UUID}]::[${this.Hash}] ${this.options.Name} VIEW Renderable[${tmpRenderableHash}] Destination[${tmpRenderDestinationAddress}] TemplateDataAddress[${tmpTemplateDataAddress}] renderAsync:`);}let tmpRenderAnticipate=this.fable.newAnticipate();tmpRenderAnticipate.anticipate(this.onBeforeRenderAsync.bind(this));let tmpView=typeof tmpViewIdentifier==='string'?this.servicesMap.PictView[tmpViewIdentifier]:false;if(!tmpView){let tmpErrorMessage=`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} could not asynchronously render from View ${tmpViewIdentifier} because it is not a valid view.`;if(this.pict.LogNoisiness>3){this.log.error(tmpErrorMessage);}return tmpCallback(new Error(tmpErrorMessage));}tmpRenderAnticipate.anticipate(this.onRenderAsync.bind(this));tmpRenderAnticipate.anticipate(fNext=>{tmpView.renderAsync.call(tmpView,tmpRenderableHash,tmpRenderDestinationAddress,tmpTemplateDataAddress,fNext);});tmpRenderAnticipate.anticipate(this.onAfterRenderAsync.bind(this));return tmpRenderAnticipate.wait(tmpCallback);}/**
	 * @return {boolean}
	 */onAfterRender(){if(this.pict.LogNoisiness>3){this.log.trace(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} onAfterRender:`);}return true;}/**
	 * @param {(error?: Error) => void} fCallback
	 */onAfterRenderAsync(fCallback){this.onAfterRender();return fCallback();}/**
	 * @return {boolean}
	 */renderMainViewport(){if(this.pict.LogControlFlow){this.log.trace(`PICT-ControlFlow APPLICATION [${this.UUID}]::[${this.Hash}] ${this.options.Name} renderMainViewport:`);}return this.render();}/**
	 * @param {(error?: Error) => void} fCallback
	 */renderMainViewportAsync(fCallback){if(this.pict.LogControlFlow){this.log.trace(`PICT-ControlFlow APPLICATION [${this.UUID}]::[${this.Hash}] ${this.options.Name} renderMainViewportAsync:`);}return this.renderAsync(fCallback);}/**
	 * @return {void}
	 */renderAutoViews(){if(this.pict.LogNoisiness>0){this.log.trace(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} beginning renderAutoViews...`);}// Now walk through any loaded views and sort them by the AutoRender ordinal
let tmpLoadedViews=Object.keys(this.pict.views);// Sort the views by their priority
// If they are all the default priority 0, it will end up being add order due to JSON Object Property Key order stuff
tmpLoadedViews.sort((a,b)=>{return this.pict.views[a].options.AutoRenderOrdinal-this.pict.views[b].options.AutoRenderOrdinal;});for(let i=0;i<tmpLoadedViews.length;i++){let tmpView=this.pict.views[tmpLoadedViews[i]];if(tmpView.options.AutoRender){tmpView.render();}}if(this.pict.LogNoisiness>0){this.log.trace(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} renderAutoViewsAsync complete.`);}}/**
	 * @param {(error?: Error) => void} fCallback
	 */renderAutoViewsAsync(fCallback){let tmpAnticipate=this.fable.instantiateServiceProviderWithoutRegistration('Anticipate');// Allow the callback to be passed in as the last parameter no matter what
let tmpCallback=typeof fCallback==='function'?fCallback:false;if(!tmpCallback){this.log.warn(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} renderAutoViewsAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions.`);tmpCallback=pError=>{if(pError){this.log.error(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} renderAutoViewsAsync Auto Callback Error: ${pError}`,pError);}};}if(this.pict.LogNoisiness>0){this.log.trace(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} beginning renderAutoViewsAsync...`);}// Now walk through any loaded views and sort them by the AutoRender ordinal
// TODO: Some optimization cleverness could be gained by grouping them into a parallelized async operation, by ordinal.
let tmpLoadedViews=Object.keys(this.pict.views);// Sort the views by their priority
// If they are all the default priority 0, it will end up being add order due to JSON Object Property Key order stuff
tmpLoadedViews.sort((a,b)=>{return this.pict.views[a].options.AutoRenderOrdinal-this.pict.views[b].options.AutoRenderOrdinal;});for(let i=0;i<tmpLoadedViews.length;i++){let tmpView=this.pict.views[tmpLoadedViews[i]];if(tmpView.options.AutoRender){tmpAnticipate.anticipate(tmpView.renderAsync.bind(tmpView));}}tmpAnticipate.wait(pError=>{this.lastAutoRenderTimestamp=this.fable.log.getTimeStamp();if(this.pict.LogNoisiness>0){this.log.trace(`PictApp [${this.UUID}]::[${this.Hash}] ${this.options.Name} renderAutoViewsAsync complete.`);}return tmpCallback(pError);});}/**
	 * @return {boolean}
	 */get isPictApplication(){return true;}}module.exports=PictApplication;},{"../package.json":4,"fable-serviceproviderbase":2}],6:[function(require,module,exports){/**
 * Pict Provider: Theme
 *
 * Runtime theme manager for Pict applications.  Registers theme bundles
 * (token maps + CSS + SVG + image assets) and applies them by injecting
 * CSS custom properties into a single <style id="pict-theme"> element.
 *
 * Themes can be:
 *   - Single-mode (Modes.Strategy = "single")
 *   - Paired light/dark (Modes.Strategy = "paired")
 *   - System-aware (Modes.Strategy = "system" — paired + auto-pick)
 *
 * Mode is reflected as `theme-light` / `theme-dark` class on <html>.
 *
 * Token resolution path examples:
 *   provider.token('Tokens.Color.Background.Primary') -> raw current value
 *   provider.cssVar('Color.Background.Primary')       -> 'var(--theme-color-background-primary)'
 *   provider.asset('SVG', 'Logo')                     -> SVG string
 *   provider.image('Hero')                            -> image URL / data URL
 *
 * Template expressions registered (when pict has addTemplate):
 *   {~Theme:Tokens.Color.Background.Primary~}    raw value
 *   {~ThemeVar:Color.Background.Primary~}        var(--theme-...) reference
 *   {~ThemeAsset:SVG.Logo~}                      asset content
 *   {~ThemeImage:Hero~}                          image URL
 *
 * Stateless: this provider does not persist anything.  Host applications
 * decide what to apply at boot (from localStorage, server config, etc.).
 *
 * @author Steven Velozo <steven@velozo.com>
 * @license MIT
 */const libPictProvider=require('pict-provider');const libDiagramAdapter=require('./Theme-Diagram-Adapter.js');const _ProviderConfiguration={ProviderIdentifier:'Theme',AutoInitialize:true,AutoInitializeOrdinal:0};const STYLE_ELEMENT_ID='pict-theme';const HTML_CLASS_LIGHT='theme-light';const HTML_CLASS_DARK='theme-dark';const CSS_VAR_PREFIX='--theme-';class PictProviderTheme extends libPictProvider{constructor(pFable,pOptions,pServiceHash){super(pFable,pOptions,pServiceHash);this.serviceType='PictProviderTheme';this._themes={};this._themeOrder=[];this._activeHash=null;this._activeMode=null;this._resolvedMode=null;this._registeredCSSHashes=[];this._applyListeners=[];// Diagram adapter: helper API for plugging Mermaid (and any
// future SVG-baking diagram engine) into the theme lifecycle.
// Exposes the same functions as the standalone require, plus
// `adaptMermaid(mermaid, options)` bound to this provider.
let tmpSelf=this;this.diagram={MERMAID_TOKEN_MAP:libDiagramAdapter.MERMAID_TOKEN_MAP,readCSSVar:libDiagramAdapter.readCSSVar,getMermaidTokenMap:libDiagramAdapter.getMermaidTokenMap,buildMermaidThemeVariables:libDiagramAdapter.buildMermaidThemeVariables,initializeMermaid:libDiagramAdapter.initializeMermaid,stashMermaidSource:libDiagramAdapter.stashMermaidSource,refreshMermaidDiagrams:libDiagramAdapter.refreshMermaidDiagrams,stripMermaidStyleImportance:libDiagramAdapter.stripMermaidStyleImportance,adaptMermaid:function(pMermaid,pOptions){return libDiagramAdapter.adaptMermaid(tmpSelf,pMermaid,pOptions);}};// Auto-register the four theme template expressions if the host pict
// supports addTemplate.  In bare-fable/test contexts this is skipped.
if(this.pict&&typeof this.pict.addTemplate==='function'){try{this.pict.addTemplate(require('./templates/Pict-Template-Theme.js'));this.pict.addTemplate(require('./templates/Pict-Template-ThemeVar.js'));this.pict.addTemplate(require('./templates/Pict-Template-ThemeAsset.js'));this.pict.addTemplate(require('./templates/Pict-Template-ThemeImage.js'));}catch(pError){if(this.log)this.log.warn('PictProviderTheme: template registration skipped: '+pError.message);}}}// ================================================================
// Theme registration
// ================================================================
/**
	 * Register a theme bundle.  Bundle is the compiled JSON shape (see
	 * the manifest schema documented in the module README and example themes).
	 *
	 * @param {object} pBundle - parsed manifest object
	 * @returns {boolean} true on success
	 */registerTheme(pBundle){if(!pBundle||typeof pBundle!=='object'){if(this.log)this.log.warn('PictProviderTheme.registerTheme: bundle is not an object');return false;}if(!pBundle.Hash||typeof pBundle.Hash!=='string'){if(this.log)this.log.warn('PictProviderTheme.registerTheme: bundle missing required string Hash');return false;}if(!this._themes[pBundle.Hash]){this._themeOrder.push(pBundle.Hash);}this._themes[pBundle.Hash]=pBundle;return true;}/**
	 * Get an array of registered theme metadata for building UIs.
	 * @returns {Array<{Hash, Name, Version, Strategy, DefaultMode, Comprehensive}>}
	 */listThemes(){let tmpList=[];for(let i=0;i<this._themeOrder.length;i++){let tmpHash=this._themeOrder[i];let tmpTheme=this._themes[tmpHash];let tmpModes=tmpTheme.Modes||{};tmpList.push({Hash:tmpTheme.Hash,Name:tmpTheme.Name||tmpTheme.Hash,Version:tmpTheme.Version||null,Strategy:tmpModes.Strategy||'single',DefaultMode:tmpModes.Default||'light',Comprehensive:tmpTheme.Comprehensive!==false});}return tmpList;}/**
	 * Get the raw stored bundle for a hash.
	 */getTheme(pHash){return this._themes[pHash]||null;}// ================================================================
// Apply / unapply
// ================================================================
/**
	 * Apply a theme by hash.  Optionally specify mode ('light', 'dark', 'system').
	 * If pMode is omitted, the theme's Modes.Default is used.
	 *
	 * @param {string} pHash
	 * @param {string} [pMode]
	 * @returns {boolean}
	 */applyTheme(pHash,pMode){let tmpTheme=this._themes[pHash];if(!tmpTheme){if(this.log)this.log.warn(`PictProviderTheme.applyTheme: unknown theme hash [${pHash}]`);return false;}// Resolve the effective theme bundle (handle BasedOn inheritance).
let tmpEffective=this._resolveBundle(tmpTheme);let tmpStrategy=tmpEffective.Modes&&tmpEffective.Modes.Strategy||'single';let tmpDefaultMode=tmpEffective.Modes&&tmpEffective.Modes.Default||'light';let tmpMode=pMode||tmpDefaultMode;// Single-mode themes cannot be put into dark/light/system; clamp.
if(tmpStrategy==='single'){tmpMode=tmpDefaultMode;}this._activeHash=pHash;this._activeMode=tmpMode;// Build CSS once, regardless of mode (paired themes emit both blocks
// and rely on the html class to switch between them).
let tmpCSS=this._buildThemeCSS(tmpEffective);this._injectStyleElement(tmpCSS);// Register any auxiliary CSS files declared in the bundle through the
// Pict CSS cascade so they participate in injectCSS().
this._registerAuxiliaryCSS(tmpEffective);// Set the html class to drive paired-theme variable resolution.
this._applyMode(tmpMode,tmpStrategy);// Notify subscribers (e.g. apps that need to re-color SVG icon palettes
// from a bundle.IconColors block, swap chart palettes, etc.).
this._fireApplyListeners(tmpEffective);return true;}/**
	 * Change mode without reapplying the theme.  No-op if no theme is active
	 * or active theme is single-mode.
	 *
	 * @param {string} pMode - 'light' | 'dark' | 'system'
	 */setMode(pMode){if(!this._activeHash)return false;let tmpTheme=this._resolveBundle(this._themes[this._activeHash]);let tmpStrategy=tmpTheme.Modes&&tmpTheme.Modes.Strategy||'single';if(tmpStrategy==='single')return false;this._activeMode=pMode;this._applyMode(pMode,tmpStrategy);this._fireApplyListeners(tmpTheme);return true;}// ================================================================
// Listener subscription
// ================================================================
/**
	 * Subscribe to theme apply / mode-change events.  The callback is
	 * invoked with the effective (BasedOn-resolved) bundle and a context
	 * object: { Hash, Mode, ResolvedMode }.
	 *
	 * Apps use this to re-color SVG icon palettes, swap chart colors,
	 * push tokens into non-CSS consumers (canvas, WebGL), etc.
	 *
	 * Returns a dispose function for symmetry with offApply().
	 */onApply(fCallback){if(typeof fCallback!=='function')return function(){};this._applyListeners.push(fCallback);let tmpSelf=this;return function(){tmpSelf.offApply(fCallback);};}offApply(fCallback){let tmpIdx=this._applyListeners.indexOf(fCallback);if(tmpIdx>=0)this._applyListeners.splice(tmpIdx,1);}_fireApplyListeners(pBundle){if(this._applyListeners.length===0)return;let tmpContext={Hash:this._activeHash,Mode:this._activeMode,ResolvedMode:this._resolvedMode};for(let i=0;i<this._applyListeners.length;i++){try{this._applyListeners[i](pBundle,tmpContext);}catch(pError){if(this.log)this.log.warn('PictProviderTheme: onApply listener threw: '+pError.message);}}}/**
	 * Remove the injected style element, html class, and any auxiliary CSS.
	 */unapplyTheme(){if(typeof document!=='undefined'){let tmpStyleEl=document.getElementById(STYLE_ELEMENT_ID);if(tmpStyleEl&&tmpStyleEl.parentNode){tmpStyleEl.parentNode.removeChild(tmpStyleEl);}if(document.documentElement&&document.documentElement.classList){document.documentElement.classList.remove(HTML_CLASS_LIGHT);document.documentElement.classList.remove(HTML_CLASS_DARK);}}// Unregister any auxiliary CSS we added.
if(this.pict&&this.pict.CSSMap&&typeof this.pict.CSSMap.removeCSS==='function'){for(let i=0;i<this._registeredCSSHashes.length;i++){this.pict.CSSMap.removeCSS(this._registeredCSSHashes[i]);}}this._registeredCSSHashes=[];this._activeHash=null;this._activeMode=null;this._resolvedMode=null;return true;}getActiveTheme(){// Live-read ResolvedMode so callers in system mode get the current OS
// preference without the provider having to subscribe to media-query
// changes.  Snapshot mode (explicit light/dark) returns as-is.
return{Hash:this._activeHash,Mode:this._activeMode,ResolvedMode:this._activeHash?this._currentResolvedMode():null};}// ================================================================
// Token / asset accessors
// ================================================================
/**
	 * Resolve a token by dot path against the active theme bundle.  Walks
	 * the entire bundle root, so paths can address Tokens, Brand, etc.
	 *
	 * If the value is paired ({Light, Dark}), returns the value at the
	 * currently resolved mode.
	 *
	 * @param {string} pPath - e.g. 'Tokens.Color.Background.Primary'
	 * @returns {string|number|null}
	 */token(pPath){if(!this._activeHash)return null;let tmpTheme=this._resolveBundle(this._themes[this._activeHash]);let tmpValue=this._walkPath(tmpTheme,pPath);return this._resolveModedValue(tmpValue);}/**
	 * Returns a CSS `var(--theme-...)` reference for a token under Tokens.
	 * Path is given without the Tokens prefix:
	 *   cssVar('Color.Background.Primary') -> 'var(--theme-color-background-primary)'
	 *
	 * @param {string} pTokenPath
	 * @returns {string}
	 */cssVar(pTokenPath){return'var('+this._cssVarName(pTokenPath)+')';}/**
	 * Look up a named asset under SVG, optionally nested (e.g. 'Icons.Foo').
	 * @param {string} pCategory - 'SVG' | 'Image'
	 * @param {string} pName
	 */asset(pCategory,pName){if(!this._activeHash)return null;let tmpTheme=this._resolveBundle(this._themes[this._activeHash]);let tmpRoot=tmpTheme[pCategory];if(!tmpRoot)return null;return this._walkPath(tmpRoot,pName);}image(pName){return this.asset('Image',pName);}svg(pName){return this.asset('SVG',pName);}// ================================================================
// Internals
// ================================================================
/**
	 * Resolve a bundle's BasedOn chain into a single effective bundle by
	 * deep-merging this bundle onto its base.  Cycle-safe.
	 */_resolveBundle(pBundle){let tmpChain=[];let tmpCurrent=pBundle;let tmpSeen={};while(tmpCurrent){if(tmpSeen[tmpCurrent.Hash])break;tmpSeen[tmpCurrent.Hash]=true;tmpChain.unshift(tmpCurrent);let tmpBaseHash=tmpCurrent.BasedOn;tmpCurrent=tmpBaseHash?this._themes[tmpBaseHash]:null;}if(tmpChain.length===1)return tmpChain[0];let tmpResult={};for(let i=0;i<tmpChain.length;i++){tmpResult=this._deepMerge(tmpResult,tmpChain[i]);}return tmpResult;}_deepMerge(pTarget,pSource){let tmpResult=Object.assign({},pTarget);let tmpKeys=Object.keys(pSource);for(let i=0;i<tmpKeys.length;i++){let tmpKey=tmpKeys[i];let tmpVal=pSource[tmpKey];if(tmpVal!==null&&typeof tmpVal==='object'&&!Array.isArray(tmpVal)&&tmpResult[tmpKey]!==null&&typeof tmpResult[tmpKey]==='object'&&!Array.isArray(tmpResult[tmpKey])){tmpResult[tmpKey]=this._deepMerge(tmpResult[tmpKey],tmpVal);}else{tmpResult[tmpKey]=tmpVal;}}return tmpResult;}/**
	 * Walk a dot-path from a starting object.  Returns null if any segment
	 * is missing.  Path segments are matched case-sensitively as authored.
	 */_walkPath(pRoot,pPath){if(!pRoot||!pPath)return null;let tmpSegments=pPath.split('.');let tmpNode=pRoot;for(let i=0;i<tmpSegments.length;i++){if(tmpNode===null||typeof tmpNode!=='object')return null;tmpNode=tmpNode[tmpSegments[i]];if(typeof tmpNode==='undefined')return null;}return tmpNode;}/**
	 * If pValue is a paired-mode object {Light, Dark}, pick the value matching
	 * the current resolved mode.  Otherwise return as-is.
	 *
	 * For system mode this re-reads the OS preference on every call so the
	 * value is always live-correct — no JS listener required to keep it in
	 * sync.  Explicit modes use the snapshotted `_resolvedMode`.
	 */_resolveModedValue(pValue){if(this._isPairedValue(pValue)){let tmpMode=this._currentResolvedMode();let tmpKey=tmpMode==='dark'?'Dark':'Light';return pValue[tmpKey];}return pValue;}_isPairedValue(pValue){return pValue!==null&&typeof pValue==='object'&&!Array.isArray(pValue)&&Object.keys(pValue).length>0&&Object.keys(pValue).every(k=>k==='Light'||k==='Dark');}/**
	 * Build the CSS string for a theme.
	 *
	 * Single-mode themes emit one `:root { ... }` block.
	 *
	 * Paired themes emit four blocks, ordered so the CSS cascade resolves
	 * to the right mode without any JS listeners:
	 *
	 *   1) `:root { ...light... }`                                — baseline
	 *   2) `@media (prefers-color-scheme: dark) { :root { ...dark... } }`
	 *                                                            — OS-driven
	 *   3) `.theme-light { ...light... }`                         — explicit override
	 *   4) `.theme-dark  { ...dark... }`                          — explicit override
	 *
	 * Mode = 'system' is "no class on <html>" — the @media rule drives.
	 * Mode = 'light'/'dark' adds the matching class which wins on tie via
	 * source order (same specificity as :root, but later in the file).
	 *
	 * The result: OS toggle moves the page via CSS alone, no DOM listener
	 * needed, no class flipping.  Explicit setMode() flips the class to
	 * lock the page to one mode regardless of OS preference.
	 *
	 * Only values under bundle.Tokens become CSS custom properties.
	 */_buildThemeCSS(pTheme){let tmpTokens=pTheme.Tokens||{};let tmpFlat=this._flattenTokens(tmpTokens,'');let tmpStrategy=pTheme.Modes&&pTheme.Modes.Strategy||'single';let tmpHasPaired=tmpFlat.some(tmpEntry=>this._isPairedValue(tmpEntry.Value));let tmpAliasLines=this._buildAliasLines(pTheme.Aliases);if(tmpStrategy==='single'||!tmpHasPaired){let tmpCSS=':root {\n';for(let i=0;i<tmpFlat.length;i++){let tmpEntry=tmpFlat[i];let tmpVal=this._isPairedValue(tmpEntry.Value)?tmpEntry.Value.Light:tmpEntry.Value;tmpCSS+='\t'+this._cssVarName(tmpEntry.Path)+': '+this._formatCSSValue(tmpVal)+';\n';}tmpCSS+=tmpAliasLines;tmpCSS+='}\n';return tmpCSS;}// Paired theme: emit the four-block cascade.
let tmpLightLines='';let tmpDarkLines='';let tmpFixedLines='';for(let i=0;i<tmpFlat.length;i++){let tmpEntry=tmpFlat[i];let tmpVarName=this._cssVarName(tmpEntry.Path);if(this._isPairedValue(tmpEntry.Value)){if(typeof tmpEntry.Value.Light!=='undefined'){tmpLightLines+='\t'+tmpVarName+': '+this._formatCSSValue(tmpEntry.Value.Light)+';\n';}if(typeof tmpEntry.Value.Dark!=='undefined'){tmpDarkLines+='\t'+tmpVarName+': '+this._formatCSSValue(tmpEntry.Value.Dark)+';\n';}}else{// Non-paired tokens (spacing, typography, etc.) live in :root only.
tmpFixedLines+='\t'+tmpVarName+': '+this._formatCSSValue(tmpEntry.Value)+';\n';}}// Block 1: :root holds light values + every non-paired token + aliases.
// Aliases use var() indirection, so they resolve to the active mode
// automatically without being duplicated in the dark blocks.
let tmpCSS=':root {\n'+tmpLightLines+tmpFixedLines+tmpAliasLines+'}\n';// Block 2: @media (prefers-color-scheme: dark) — OS-driven dark override.
// Only the paired tokens need to flip; fixed tokens and aliases stay
// the same.  Indented one level for readability.
let tmpMediaInner='';let tmpDarkLinesIndented=tmpDarkLines.replace(/^\t/gm,'\t\t');tmpMediaInner+='\t:root {\n'+tmpDarkLinesIndented+'\t}\n';tmpCSS+='@media (prefers-color-scheme: dark) {\n'+tmpMediaInner+'}\n';// Block 3: .theme-light — explicit override that locks light regardless of OS.
tmpCSS+='.'+HTML_CLASS_LIGHT+' {\n'+tmpLightLines+'}\n';// Block 4: .theme-dark — explicit override that locks dark regardless of OS.
tmpCSS+='.'+HTML_CLASS_DARK+' {\n'+tmpDarkLines+'}\n';return tmpCSS;}/**
	 * Emit alias lines for legacy CSS variable names that map to token paths
	 * under Tokens.  Each alias becomes:
	 *   --legacy-name: var(--theme-color-...);
	 * Indirection-via-var means paired-mode swap propagates without
	 * needing alias entries duplicated in the .theme-dark block.
	 *
	 * Authored as: { "--legacy-name": "Color.Background.Primary", ... }
	 */_buildAliasLines(pAliases){if(!pAliases||typeof pAliases!=='object')return'';let tmpKeys=Object.keys(pAliases);let tmpOut='';for(let i=0;i<tmpKeys.length;i++){let tmpAlias=tmpKeys[i];let tmpTarget=pAliases[tmpAlias];if(typeof tmpTarget!=='string'||tmpTarget.length===0)continue;tmpOut+='\t'+tmpAlias+': var('+this._cssVarName(tmpTarget)+');\n';}return tmpOut;}/**
	 * Walk an arbitrary nested token tree and produce a flat list of
	 * { Path: 'color.background.primary', Value: <leaf> } entries.
	 *
	 * Paired-mode objects ({Light, Dark}) and primitive values are leaves.
	 */_flattenTokens(pNode,pPathPrefix){let tmpResults=[];if(pNode===null||typeof pNode!=='object'||Array.isArray(pNode)){if(pPathPrefix){tmpResults.push({Path:pPathPrefix,Value:pNode});}return tmpResults;}if(this._isPairedValue(pNode)){tmpResults.push({Path:pPathPrefix,Value:pNode});return tmpResults;}let tmpKeys=Object.keys(pNode);for(let i=0;i<tmpKeys.length;i++){let tmpKey=tmpKeys[i];let tmpChildPath=pPathPrefix?pPathPrefix+'.'+tmpKey:tmpKey;let tmpChild=pNode[tmpKey];tmpResults=tmpResults.concat(this._flattenTokens(tmpChild,tmpChildPath));}return tmpResults;}/**
	 * 'Color.Background.Primary' -> '--theme-color-background-primary'
	 */_cssVarName(pTokenPath){return CSS_VAR_PREFIX+pTokenPath.toLowerCase().replace(/\./g,'-');}_formatCSSValue(pValue){if(pValue===null||typeof pValue==='undefined')return'';if(typeof pValue==='number')return String(pValue);return String(pValue);}_injectStyleElement(pCSS){if(typeof document==='undefined')return;let tmpStyleEl=document.getElementById(STYLE_ELEMENT_ID);if(!tmpStyleEl){tmpStyleEl=document.createElement('style');tmpStyleEl.id=STYLE_ELEMENT_ID;document.head.appendChild(tmpStyleEl);}tmpStyleEl.textContent=pCSS;}_registerAuxiliaryCSS(pTheme){// Clear previously registered auxiliary CSS so stale entries don't pile
// up when switching themes.
if(this.pict&&this.pict.CSSMap&&typeof this.pict.CSSMap.removeCSS==='function'){for(let i=0;i<this._registeredCSSHashes.length;i++){this.pict.CSSMap.removeCSS(this._registeredCSSHashes[i]);}}this._registeredCSSHashes=[];if(!Array.isArray(pTheme.CSS))return;if(!this.pict||!this.pict.CSSMap||typeof this.pict.CSSMap.addCSS!=='function')return;for(let i=0;i<pTheme.CSS.length;i++){let tmpEntry=pTheme.CSS[i];if(!tmpEntry||!tmpEntry.Hash||typeof tmpEntry.Content!=='string')continue;let tmpPriority=typeof tmpEntry.Priority==='number'?tmpEntry.Priority:500;this.pict.CSSMap.addCSS(tmpEntry.Hash,tmpEntry.Content,tmpPriority);this._registeredCSSHashes.push(tmpEntry.Hash);}}/**
	 * Apply the requested mode by adjusting the class on <html>.
	 *
	 *   - 'light' / 'dark': the matching class is added so the explicit
	 *     `.theme-light` / `.theme-dark` block in the injected stylesheet
	 *     overrides the @media (prefers-color-scheme) rule.
	 *   - 'system': both classes are cleared so the @media rule drives
	 *     the cascade from the OS preference, with no JS listener needed.
	 *
	 * `_resolvedMode` is snapshotted at apply time so synchronous reads
	 * via `token()` / `getActiveTheme()` return a consistent value.  In
	 * system mode it falls back to `_currentResolvedMode()` for callers
	 * that want a live read on each call.
	 */_applyMode(pMode,pStrategy){if(pMode==='system'){this._resolvedMode=this._readSystemPreference();this._clearHTMLClass();}else{this._resolvedMode=pMode==='dark'?'dark':'light';this._writeHTMLClass(this._resolvedMode);}}_writeHTMLClass(pResolvedMode){if(typeof document==='undefined'||!document.documentElement||!document.documentElement.classList)return;let tmpList=document.documentElement.classList;if(pResolvedMode==='dark'){tmpList.remove(HTML_CLASS_LIGHT);tmpList.add(HTML_CLASS_DARK);}else{tmpList.remove(HTML_CLASS_DARK);tmpList.add(HTML_CLASS_LIGHT);}}_clearHTMLClass(){if(typeof document==='undefined'||!document.documentElement||!document.documentElement.classList)return;let tmpList=document.documentElement.classList;tmpList.remove(HTML_CLASS_LIGHT);tmpList.remove(HTML_CLASS_DARK);}_readSystemPreference(){if(typeof window==='undefined'||typeof window.matchMedia!=='function')return'light';try{return window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}catch(pError){return'light';}}/**
	 * The mode currently driving the page.  Mirrors what the user sees:
	 * explicit modes return their literal value; 'system' reads the OS
	 * preference fresh so token() / getActiveTheme() never report a
	 * stale value when the OS toggles between calls.
	 *
	 * @returns {'light'|'dark'}
	 */_currentResolvedMode(){if(this._activeMode==='system'){return this._readSystemPreference();}return this._resolvedMode==='dark'?'dark':'light';}}PictProviderTheme.default_configuration=_ProviderConfiguration;module.exports=PictProviderTheme;module.exports.STYLE_ELEMENT_ID=STYLE_ELEMENT_ID;module.exports.HTML_CLASS_LIGHT=HTML_CLASS_LIGHT;module.exports.HTML_CLASS_DARK=HTML_CLASS_DARK;module.exports.CSS_VAR_PREFIX=CSS_VAR_PREFIX;module.exports.DiagramAdapter=libDiagramAdapter;},{"./Theme-Diagram-Adapter.js":7,"./templates/Pict-Template-Theme.js":8,"./templates/Pict-Template-ThemeAsset.js":9,"./templates/Pict-Template-ThemeImage.js":10,"./templates/Pict-Template-ThemeVar.js":11,"pict-provider":13}],7:[function(require,module,exports){/**
 * Theme Diagram Adapter
 *
 * Helper utilities for plugging diagram renderers (Mermaid today,
 * Excalidraw / chart libraries next) into the pict-provider-theme
 * lifecycle.
 *
 * Why this exists:
 *   Diagram engines like Mermaid bake colors into the SVG at render
 *   time. Once rendered, CSS alone cannot recolor node fills, cluster
 *   backgrounds, or edge stroke ends — those are inline attributes on
 *   <rect>, <path>, <polygon>, etc.  Switching light/dark requires
 *   the engine to re-render with a fresh themeVariables block.
 *
 *   Pre-adapter, every view that hosted a Mermaid block had to:
 *     - read every CSS custom property by hand
 *     - mirror a 20+ key themeVariables object
 *     - wire its own onApply subscription
 *     - stash diagram source on the DOM
 *     - clear data-processed + re-run on theme change
 *
 *   The adapter centralizes all of that.  Section views call
 *   `adapter.adaptMermaid(mermaid, options)` and stop caring about the
 *   token list, the listener, and the refresh dance.
 *
 *  Public API:
 *     buildMermaidThemeVariables(pOverrides)        - read fresh tokens, return mermaid themeVariables
 *     getMermaidTokenMap()                          - canonical {mermaidKey: cssVarName} map
 *     initializeMermaid(mermaid, pOverrides)        - mermaid.initialize() with the right base + themeVariables
 *     refreshMermaidDiagrams(pSelectorOrRoot)       - restore source, clear data-processed, re-run mermaid.run
 *     stashMermaidSource(pNodes)                    - cache source on data-mermaid-source before first run
 *     adaptMermaid(provider, mermaid, pOptions)     - one-shot: initialize + subscribe + return handle
 *     readCSSVar(pName, pFallback, pRoot)           - fresh getComputedStyle read with fallback
 *
 *  All helpers are stateless and safe to call repeatedly.  Subscriptions
 *  return a dispose function the caller can hold onto for teardown.
 *
 * @author Steven Velozo <steven@velozo.com>
 * @license MIT
 */// Canonical mapping: mermaid themeVariables key -> CSS custom property name -> fallback.
// Fallbacks match the pict-default LIGHT palette so unthemed apps look like
// the default theme rather than a third unrelated palette.
const MERMAID_TOKEN_MAP=[// Primary surfaces (node fills + cluster background)
{Key:'primaryColor',Var:'--theme-color-background-panel',Fallback:'#ffffff'},{Key:'primaryTextColor',Var:'--theme-color-text-primary',Fallback:'#1a1a1a'},{Key:'primaryBorderColor',Var:'--theme-color-brand-primary',Fallback:'#3357c7'},// Secondary (alt rows, alternate nodes, sequence actor bg)
{Key:'secondaryColor',Var:'--theme-color-background-secondary',Fallback:'#f5f5f5'},{Key:'secondaryTextColor',Var:'--theme-color-text-secondary',Fallback:'#454545'},{Key:'secondaryBorderColor',Var:'--theme-color-border-default',Fallback:'#d6d6d6'},// Tertiary (clusters, accent groups)
{Key:'tertiaryColor',Var:'--theme-color-background-tertiary',Fallback:'#ebebeb'},{Key:'tertiaryTextColor',Var:'--theme-color-text-secondary',Fallback:'#454545'},{Key:'tertiaryBorderColor',Var:'--theme-color-border-light',Fallback:'#e9e9e9'},// Page-level + line + note
{Key:'background',Var:'--theme-color-background-panel',Fallback:'#ffffff'},{Key:'mainBkg',Var:'--theme-color-background-panel',Fallback:'#ffffff'},{Key:'secondBkg',Var:'--theme-color-background-secondary',Fallback:'#f5f5f5'},{Key:'lineColor',Var:'--theme-color-text-secondary',Fallback:'#454545'},{Key:'textColor',Var:'--theme-color-text-primary',Fallback:'#1a1a1a'},{Key:'noteBkgColor',Var:'--theme-color-background-tertiary',Fallback:'#ebebeb'},{Key:'noteTextColor',Var:'--theme-color-text-primary',Fallback:'#1a1a1a'},{Key:'noteBorderColor',Var:'--theme-color-border-default',Fallback:'#d6d6d6'},// Status (Mermaid uses these for error/warning highlights)
{Key:'errorBkgColor',Var:'--theme-color-status-error',Fallback:'#b62828'},{Key:'errorTextColor',Var:'--theme-color-text-on-brand',Fallback:'#ffffff'},// Typography
{Key:'fontFamily',Var:'--theme-typography-family-sans',Fallback:'inherit'}];/**
 * Read a CSS custom property off pRoot (default: documentElement).
 * Always issues a fresh getComputedStyle so the value reflects the
 * current class state on <html> (theme-light / theme-dark).
 *
 * @param {string} pName     - variable name including '--' prefix
 * @param {string} [pFallback] - returned when the variable is unset/empty
 * @param {Element} [pRoot]  - element to compute style against
 * @returns {string}
 */function readCSSVar(pName,pFallback,pRoot){if(typeof window==='undefined'||typeof document==='undefined'){return pFallback||'';}let tmpRoot=pRoot||document.documentElement;if(!tmpRoot){return pFallback||'';}let tmpVal=(getComputedStyle(tmpRoot).getPropertyValue(pName)||'').trim();return tmpVal||pFallback||'';}/**
 * Returns the canonical {mermaidKey: cssVarName} mapping.  Useful for
 * apps that need to inspect or extend the token list (e.g. to add
 * gantt / sequence / pie-specific tokens for a custom diagram type).
 *
 * @returns {Array<{Key, Var, Fallback}>}
 */function getMermaidTokenMap(){// Defensive copy so callers can't mutate the canonical list.
return MERMAID_TOKEN_MAP.map(tmpEntry=>({Key:tmpEntry.Key,Var:tmpEntry.Var,Fallback:tmpEntry.Fallback}));}/**
 * Read every token in the mermaid map off the current document and
 * return an object suitable for mermaid.initialize({themeVariables}).
 *
 * @param {object} [pOverrides] - extra themeVariables keys to merge on top
 * @returns {object}
 */function buildMermaidThemeVariables(pOverrides){let tmpVars={};for(let i=0;i<MERMAID_TOKEN_MAP.length;i++){let tmpEntry=MERMAID_TOKEN_MAP[i];tmpVars[tmpEntry.Key]=readCSSVar(tmpEntry.Var,tmpEntry.Fallback);}if(pOverrides&&typeof pOverrides==='object'){let tmpKeys=Object.keys(pOverrides);for(let j=0;j<tmpKeys.length;j++){tmpVars[tmpKeys[j]]=pOverrides[tmpKeys[j]];}}return tmpVars;}/**
 * Call mermaid.initialize() with the canonical pict theme bindings.
 * Safe to call repeatedly; mermaid simply merges new config.
 *
 * @param {object} mermaid - the mermaid module / global
 * @param {object} [pOverrides] - extra themeVariables keys, or { config: ... }
 *                                to override startOnLoad / securityLevel / theme
 * @returns {boolean} true if initialize ran, false if no mermaid available
 */function initializeMermaid(mermaid,pOverrides){if(!mermaid||typeof mermaid.initialize!=='function'){return false;}let tmpOverrides=pOverrides||{};let tmpThemeOverrides=tmpOverrides.themeVariables;let tmpConfigOverrides=tmpOverrides.config||{};let tmpVars=buildMermaidThemeVariables(tmpThemeOverrides);let tmpConfig=Object.assign({startOnLoad:false,theme:'base',securityLevel:'loose'},tmpConfigOverrides,{themeVariables:tmpVars});mermaid.initialize(tmpConfig);return true;}/**
 * Cache each diagram's source text on data-mermaid-source so a later
 * refresh can restore it.  Mermaid replaces textContent with the
 * rendered SVG during run(); without this stash there's no way to
 * re-run.
 *
 * @param {NodeList|Array<Element>} pNodes
 */function stashMermaidSource(pNodes){if(!pNodes||pNodes.length<1){return;}for(let i=0;i<pNodes.length;i++){let tmpEl=pNodes[i];if(!tmpEl||typeof tmpEl.getAttribute!=='function'){continue;}if(!tmpEl.hasAttribute('data-mermaid-source')){tmpEl.setAttribute('data-mermaid-source',tmpEl.textContent);}}}/**
 * Restore each pre.mermaid[data-mermaid-source] element to its source
 * text, drop the data-processed flag (mermaid skips elements with that
 * flag set), strip the mermaid-rendered helper class if present, and
 * re-run mermaid against them.
 *
 * @param {string|Element|Document} [pSelectorOrRoot]
 *   - string: querySelectorAll target (defaults to whole document)
 *   - Element: scoped root to search inside
 *   - omitted: whole document
 * @returns {Promise|null} the mermaid.run() promise, or null if no work
 */function refreshMermaidDiagrams(pSelectorOrRoot){if(typeof document==='undefined'){return null;}let tmpMermaid=typeof mermaid!=='undefined'?mermaid:null;if(!tmpMermaid||typeof tmpMermaid.run!=='function'){return null;}let tmpRendered=_resolveMermaidNodes(pSelectorOrRoot);if(!tmpRendered||tmpRendered.length<1){return null;}for(let i=0;i<tmpRendered.length;i++){let tmpEl=tmpRendered[i];let tmpSrc=tmpEl.getAttribute('data-mermaid-source');if(tmpSrc!==null){tmpEl.textContent=tmpSrc;}tmpEl.removeAttribute('data-processed');if(tmpEl.classList&&typeof tmpEl.classList.remove==='function'){tmpEl.classList.remove('mermaid-rendered');}}try{let tmpResult=tmpMermaid.run({nodes:tmpRendered});// After mermaid finishes drawing, strip the !important flags it
// bakes into per-node inline fill/stroke styles. See
// stripMermaidStyleImportance() docs for the why.
if(tmpResult&&typeof tmpResult.then==='function'){return tmpResult.then(function(){stripMermaidStyleImportance(tmpRendered);return tmpResult;});}// Synchronous fallback (older mermaid versions).
stripMermaidStyleImportance(tmpRendered);return tmpResult;}catch(pError){// Surface to the caller; they're already wrapping in try/catch in
// most cases.  Return a rejected promise so .catch() consumers fire.
return Promise.reject(pError);}}/**
 * Mermaid 11's flowchart `style X fill:#...` directive emits the fill
 * and stroke inline with `!important`:
 *
 *   <rect class="basic label-container"
 *         style="fill:#e8f5e9 !important;stroke:#43a047 !important"/>
 *
 * Inline `!important` beats external `!important` via specificity, so
 * any theme-aware CSS we write (e.g. `.theme-dark ... { fill: theme-bg
 * !important }`) silently loses no matter how strong its selector.
 * Diagrams keep their Material pastels even in dark themes — light
 * fills with light text = unreadable.
 *
 * Strip just the `!important` flag off mermaid-emitted inline styles
 * after every render.  The fill/stroke values themselves stay intact,
 * so light mode keeps the author-intended palette; in dark mode the
 * external `.theme-dark` CSS now reaches the rect and recolors to a
 * theme-aware background.
 *
 * Must run after every mermaid render — initial + every re-render
 * triggered by a theme change.  `refreshMermaidDiagrams` calls it on
 * re-renders; the initial render in pict-section-content's view calls
 * it via the provider's `diagram.stripMermaidStyleImportance` handle.
 *
 * @param {string|Element|NodeList|Array} [pTarget]
 *   - omitted: scan the whole document
 *   - string: querySelector scope (e.g. '#Pict-Content-Body')
 *   - Element: scan within this element
 *   - NodeList/Array of `pre.mermaid` elements: scan within each
 * @returns {number} count of shapes that had !important stripped
 */function stripMermaidStyleImportance(pTarget){if(typeof document==='undefined'){return 0;}let tmpMermaids;if(!pTarget){tmpMermaids=document.querySelectorAll('pre.mermaid');}else if(typeof pTarget==='string'){let tmpScope=document.querySelector(pTarget);tmpMermaids=tmpScope?tmpScope.querySelectorAll('pre.mermaid'):[];}else if(pTarget.length!==undefined){// NodeList or Array of pre.mermaid elements
tmpMermaids=pTarget;}else if(pTarget.querySelectorAll){tmpMermaids=pTarget.querySelectorAll('pre.mermaid');}else{return 0;}let tmpStripped=0;for(let i=0;i<tmpMermaids.length;i++){let tmpMerm=tmpMermaids[i];if(!tmpMerm||!tmpMerm.querySelectorAll){continue;}let tmpShapes=tmpMerm.querySelectorAll('.node rect[style*="!important"], '+'.node polygon[style*="!important"], '+'.node circle[style*="!important"], '+'.node ellipse[style*="!important"], '+'.node path[style*="!important"], '+'.cluster rect[style*="!important"]');for(let j=0;j<tmpShapes.length;j++){let tmpEl=tmpShapes[j];let tmpStyle=tmpEl.getAttribute('style')||'';if(tmpStyle.indexOf('!important')<0){continue;}tmpEl.setAttribute('style',tmpStyle.replace(/\s*!important\s*/gi,''));tmpStripped++;}}return tmpStripped;}function _resolveMermaidNodes(pSelectorOrRoot){let tmpSelector='pre.mermaid[data-mermaid-source]';if(!pSelectorOrRoot){return document.querySelectorAll(tmpSelector);}if(typeof pSelectorOrRoot==='string'){// Treat the string as a scope selector; collect mermaid nodes inside it.
let tmpScope=document.querySelector(pSelectorOrRoot);if(!tmpScope){return[];}return tmpScope.querySelectorAll(tmpSelector);}if(pSelectorOrRoot.querySelectorAll){return pSelectorOrRoot.querySelectorAll(tmpSelector);}return[];}/**
 * One-shot: initialize mermaid against the active theme, subscribe to
 * theme apply events, and return a handle the caller can use for
 * teardown / manual refresh.
 *
 *   let tmpHandle = adaptMermaid(pict.providers.Theme, mermaid, {
 *       refreshScope: '#Pict-Content-Body'
 *   });
 *   // ... later, on unload:
 *   tmpHandle.dispose();
 *
 * @param {object} pProvider - pict-provider-theme instance
 * @param {object} pMermaid  - the mermaid module / global
 * @param {object} [pOptions]
 *   @param {string|Element} [pOptions.refreshScope] - passed to refreshMermaidDiagrams
 *   @param {object} [pOptions.themeOverrides]       - extra themeVariables keys
 *   @param {object} [pOptions.configOverrides]      - extra mermaid.initialize() top-level keys
 *   @param {function} [pOptions.onBeforeRefresh]    - called before each refresh; signature (pContext)
 *   @param {function} [pOptions.onAfterRefresh]     - called after each refresh resolves; signature (pContext)
 * @returns {{ dispose: function, refresh: function, reinitialize: function, subscribed: boolean }}
 */function adaptMermaid(pProvider,pMermaid,pOptions){let tmpOptions=pOptions||{};let tmpInitOverrides={themeVariables:tmpOptions.themeOverrides,config:tmpOptions.configOverrides};// Always initialize, even if no provider — the static base theme should
// still pick up whatever CSS variables the page does have.
initializeMermaid(pMermaid,tmpInitOverrides);let tmpRefresh=function(pContext){if(typeof tmpOptions.onBeforeRefresh==='function'){try{tmpOptions.onBeforeRefresh(pContext||{});}catch(e){/* swallow; refresh must not be gated on listener errors */}}initializeMermaid(pMermaid,tmpInitOverrides);let tmpResult=refreshMermaidDiagrams(tmpOptions.refreshScope);if(tmpResult&&typeof tmpResult.then==='function'&&typeof tmpOptions.onAfterRefresh==='function'){tmpResult.then(()=>{try{tmpOptions.onAfterRefresh(pContext||{});}catch(e){/* swallow */}},()=>{/* error path: onAfterRefresh still fires so the UI can drop spinners */try{tmpOptions.onAfterRefresh(pContext||{});}catch(e){/* swallow */}});}return tmpResult;};let tmpDispose=function(){};let tmpSubscribed=false;if(pProvider&&typeof pProvider.onApply==='function'){tmpDispose=pProvider.onApply(function(pBundle,pContext){tmpRefresh(pContext||{});});tmpSubscribed=true;}return{dispose:function(){if(typeof tmpDispose==='function'){tmpDispose();}},refresh:tmpRefresh,reinitialize:function(){initializeMermaid(pMermaid,tmpInitOverrides);},subscribed:tmpSubscribed};}module.exports={MERMAID_TOKEN_MAP:MERMAID_TOKEN_MAP,readCSSVar:readCSSVar,getMermaidTokenMap:getMermaidTokenMap,buildMermaidThemeVariables:buildMermaidThemeVariables,initializeMermaid:initializeMermaid,stashMermaidSource:stashMermaidSource,refreshMermaidDiagrams:refreshMermaidDiagrams,stripMermaidStyleImportance:stripMermaidStyleImportance,adaptMermaid:adaptMermaid};},{}],8:[function(require,module,exports){/**
 * Pict template expression: {~Theme:Path~}
 *
 * Resolves a token path against the active theme bundle and returns the
 * raw value at the currently resolved mode.  Walks from the bundle root,
 * so paths like 'Tokens.Color.Background.Primary' or 'Brand.Name' work.
 *
 * Returns an empty string if no theme is active or the path is missing.
 */const libPictTemplate=require('pict-template');class PictTemplateTheme extends libPictTemplate{constructor(pFable,pOptions,pServiceHash){super(pFable,pOptions,pServiceHash);this.addPattern('{~Theme:','~}');}render(pTemplateHash){let tmpPath=(pTemplateHash||'').trim();if(!tmpPath)return'';let tmpProvider=this._findThemeProvider();if(!tmpProvider)return'';let tmpValue=tmpProvider.token(tmpPath);if(tmpValue===null||typeof tmpValue==='undefined')return'';return String(tmpValue);}_findThemeProvider(){if(!this.pict||!this.pict.providers)return null;return this.pict.providers['Theme']||null;}}module.exports=PictTemplateTheme;},{"pict-template":92}],9:[function(require,module,exports){/**
 * Pict template expression: {~ThemeAsset:Category.Name~}
 *
 * Returns the contents of a named SVG (or other) asset from the active
 * theme bundle.  The first path segment is treated as the category
 * (e.g. SVG), the rest as the asset's path within that category.
 *
 *   {~ThemeAsset:SVG.Logo~}        -> bundle.SVG.Logo
 *   {~ThemeAsset:SVG.Icons.Foo~}   -> bundle.SVG.Icons.Foo
 */const libPictTemplate=require('pict-template');class PictTemplateThemeAsset extends libPictTemplate{constructor(pFable,pOptions,pServiceHash){super(pFable,pOptions,pServiceHash);this.addPattern('{~ThemeAsset:','~}');}render(pTemplateHash){let tmpPath=(pTemplateHash||'').trim();if(!tmpPath)return'';let tmpDot=tmpPath.indexOf('.');if(tmpDot<0)return'';let tmpCategory=tmpPath.substring(0,tmpDot);let tmpName=tmpPath.substring(tmpDot+1);let tmpProvider=this._findThemeProvider();if(!tmpProvider)return'';let tmpValue=tmpProvider.asset(tmpCategory,tmpName);if(tmpValue===null||typeof tmpValue==='undefined')return'';return String(tmpValue);}_findThemeProvider(){if(!this.pict||!this.pict.providers)return null;return this.pict.providers['Theme']||null;}}module.exports=PictTemplateThemeAsset;},{"pict-template":92}],10:[function(require,module,exports){/**
 * Pict template expression: {~ThemeImage:Name~}
 *
 * Returns the URL or data URL stored at bundle.Image[Name] in the active
 * theme bundle.  Convenience over {~ThemeAsset:Image.Name~}.
 */const libPictTemplate=require('pict-template');class PictTemplateThemeImage extends libPictTemplate{constructor(pFable,pOptions,pServiceHash){super(pFable,pOptions,pServiceHash);this.addPattern('{~ThemeImage:','~}');}render(pTemplateHash){let tmpName=(pTemplateHash||'').trim();if(!tmpName)return'';let tmpProvider=this._findThemeProvider();if(!tmpProvider)return'';let tmpValue=tmpProvider.image(tmpName);if(tmpValue===null||typeof tmpValue==='undefined')return'';return String(tmpValue);}_findThemeProvider(){if(!this.pict||!this.pict.providers)return null;return this.pict.providers['Theme']||null;}}module.exports=PictTemplateThemeImage;},{"pict-template":92}],11:[function(require,module,exports){/**
 * Pict template expression: {~ThemeVar:Path~}
 *
 * Returns a CSS `var(--theme-...)` reference for a token path under
 * Tokens.  E.g. {~ThemeVar:Color.Background.Primary~} ->
 * `var(--theme-color-background-primary)`.
 *
 * Useful inside style attributes and in CSS-in-JS contexts where you want
 * the live custom-property reference rather than the resolved value.
 */const libPictTemplate=require('pict-template');class PictTemplateThemeVar extends libPictTemplate{constructor(pFable,pOptions,pServiceHash){super(pFable,pOptions,pServiceHash);this.addPattern('{~ThemeVar:','~}');}render(pTemplateHash){let tmpPath=(pTemplateHash||'').trim();if(!tmpPath)return'';let tmpProvider=this._findThemeProvider();if(!tmpProvider)return'';return tmpProvider.cssVar(tmpPath);}_findThemeProvider(){if(!this.pict||!this.pict.providers)return null;return this.pict.providers['Theme']||null;}}module.exports=PictTemplateThemeVar;},{"pict-template":92}],12:[function(require,module,exports){module.exports={"name":"pict-provider","version":"1.0.13","description":"Pict Provider Base Class","main":"source/Pict-Provider.js","scripts":{"start":"node source/Pict-Provider.js","test":"npx quack test","tests":"npx quack test -g","coverage":"npx quack coverage","build":"npx quack build","docker-dev-build":"docker build ./ -f Dockerfile_LUXURYCode -t pict-provider-image:local","docker-dev-run":"docker run -it -d --name pict-provider-dev -p 24125:8080 -p 30027:8086 -v \"$PWD/.config:/home/coder/.config\"  -v \"$PWD:/home/coder/pict-provider\" -u \"$(id -u):$(id -g)\" -e \"DOCKER_USER=$USER\" pict-provider-image:local","docker-dev-shell":"docker exec -it pict-provider-dev /bin/bash","lint":"eslint source/**","types":"tsc -p ."},"types":"types/source/Pict-Provider.d.ts","repository":{"type":"git","url":"git+https://github.com/stevenvelozo/pict-provider.git"},"author":"steven velozo <steven@velozo.com>","license":"MIT","bugs":{"url":"https://github.com/stevenvelozo/pict-provider/issues"},"homepage":"https://github.com/stevenvelozo/pict-provider#readme","devDependencies":{"@eslint/js":"^9.39.1","eslint":"^9.39.1","pict":"^1.0.351","pict-docuserve":"^0.1.5","quackage":"^1.1.0","typescript":"^5.9.3"},"dependencies":{"fable-serviceproviderbase":"^3.0.19"},"mocha":{"diff":true,"extension":["js"],"package":"./package.json","reporter":"spec","slow":"75","timeout":"5000","ui":"tdd","watch-files":["source/**/*.js","test/**/*.js"],"watch-ignore":["lib/vendor"]}};},{}],13:[function(require,module,exports){const libFableServiceBase=require('fable-serviceproviderbase');const libPackage=require('../package.json');const defaultPictProviderSettings={ProviderIdentifier:false,// If this is set to true, when the App initializes this will.
// After the App initializes, initialize will be called as soon as it's added.
AutoInitialize:true,AutoInitializeOrdinal:0,AutoLoadDataWithApp:true,AutoLoadDataOrdinal:0,AutoSolveWithApp:true,AutoSolveOrdinal:0,Manifests:{},Templates:[]};class PictProvider extends libFableServiceBase{/**
	 * @param {import('fable')} pFable - The Fable instance.
	 * @param {Record<string, any>} [pOptions] - The options for the provider.
	 * @param {string} [pServiceHash] - The service hash for the provider.
	 */constructor(pFable,pOptions,pServiceHash){// Intersect default options, parent constructor, service information
let tmpOptions=Object.assign({},JSON.parse(JSON.stringify(defaultPictProviderSettings)),pOptions);super(pFable,tmpOptions,pServiceHash);/** @type {import('fable') & import('pict') & { instantiateServiceProviderWithoutRegistration(pServiceType: string, pOptions?: Record<string, any>, pCustomServiceHash?: string): any }} */this.fable;/** @type {import('fable') & import('pict') & { instantiateServiceProviderWithoutRegistration(pServiceType: string, pOptions?: Record<string, any>, pCustomServiceHash?: string): any }} */this.pict;/** @type {any} */this.log;/** @type {Record<string, any>} */this.options;/** @type {string} */this.UUID;/** @type {string} */this.Hash;if(!this.options.ProviderIdentifier){this.options.ProviderIdentifier=`AutoProviderID-${this.fable.getUUID()}`;}this.serviceType='PictProvider';/** @type {Record<string, any>} */this._Package=libPackage;// Convenience and consistency naming
this.pict=this.fable;// Wire in the essential Pict application state
/** @type {Record<string, any>} */this.AppData=this.pict.AppData;/** @type {Record<string, any>} */this.Bundle=this.pict.Bundle;this.initializeTimestamp=false;this.lastSolvedTimestamp=false;for(let i=0;i<this.options.Templates.length;i++){let tmpDefaultTemplate=this.options.Templates[i];if(!tmpDefaultTemplate.hasOwnProperty('Postfix')||!tmpDefaultTemplate.hasOwnProperty('Template')){this.log.error(`PictProvider [${this.UUID}]::[${this.Hash}] ${this.options.ProviderIdentifier} could not load Default Template ${i} in the options array.`,tmpDefaultTemplate);}else{if(!tmpDefaultTemplate.Source){tmpDefaultTemplate.Source=`PictProvider [${this.UUID}]::[${this.Hash}] ${this.options.ProviderIdentifier} options object.`;}this.pict.TemplateProvider.addDefaultTemplate(tmpDefaultTemplate.Prefix,tmpDefaultTemplate.Postfix,tmpDefaultTemplate.Template,tmpDefaultTemplate.Source);}}}/* -------------------------------------------------------------------------- *//*                        Code Section: Initialization                        *//* -------------------------------------------------------------------------- */onBeforeInitialize(){if(this.pict.LogNoisiness>3){this.log.trace(`PictProvider [${this.UUID}]::[${this.Hash}] ${this.options.ProviderIdentifier} onBeforeInitialize:`);}return true;}/**
	 * @param {(pError?: Error) => void} fCallback - The callback to call after pre-pinitialization.
	 *
	 * @return {void}
	 */onBeforeInitializeAsync(fCallback){this.onBeforeInitialize();return fCallback();}onInitialize(){if(this.pict.LogNoisiness>3){this.log.trace(`PictProvider [${this.UUID}]::[${this.Hash}] ${this.options.ProviderIdentifier} onInitialize:`);}return true;}/**
	 * @param {(pError?: Error) => void} fCallback - The callback to call after initialization.
	 *
	 * @return {void}
	 */onInitializeAsync(fCallback){this.onInitialize();return fCallback();}initialize(){if(this.pict.LogControlFlow){this.log.trace(`PICT-ControlFlow PROVIDER [${this.UUID}]::[${this.Hash}] ${this.options.ProviderIdentifier} initialize:`);}if(!this.initializeTimestamp){this.onBeforeInitialize();this.onInitialize();this.onAfterInitialize();this.initializeTimestamp=this.pict.log.getTimeStamp();return true;}else{this.log.warn(`PictProvider [${this.UUID}]::[${this.Hash}] ${this.options.ProviderIdentifier} initialize called but initialization is already completed.  Aborting.`);return false;}}/**
	 * @param {(pError?: Error) => void} fCallback - The callback to call after initialization.
	 *
	 * @return {void}
	 */initializeAsync(fCallback){if(this.pict.LogControlFlow){this.log.trace(`PICT-ControlFlow PROVIDER [${this.UUID}]::[${this.Hash}] ${this.options.ProviderIdentifier} initializeAsync:`);}if(!this.initializeTimestamp){let tmpAnticipate=this.pict.instantiateServiceProviderWithoutRegistration('Anticipate');if(this.pict.LogNoisiness>0){this.log.info(`PictProvider [${this.UUID}]::[${this.Hash}] ${this.options.ProviderIdentifier} beginning initialization...`);}tmpAnticipate.anticipate(this.onBeforeInitializeAsync.bind(this));tmpAnticipate.anticipate(this.onInitializeAsync.bind(this));tmpAnticipate.anticipate(this.onAfterInitializeAsync.bind(this));tmpAnticipate.wait(pError=>{this.initializeTimestamp=this.pict.log.getTimeStamp();if(pError){this.log.error(`PictProvider [${this.UUID}]::[${this.Hash}] ${this.options.ProviderIdentifier} initialization failed: ${pError.message||pError}`,{Stack:pError.stack});}else if(this.pict.LogNoisiness>0){this.log.info(`PictProvider [${this.UUID}]::[${this.Hash}] ${this.options.ProviderIdentifier} initialization complete.`);}return fCallback();});}else{this.log.warn(`PictProvider [${this.UUID}]::[${this.Hash}] ${this.options.ProviderIdentifier} async initialize called but initialization is already completed.  Aborting.`);// TODO: Should this be an error?
return fCallback();}}onAfterInitialize(){if(this.pict.LogNoisiness>3){this.log.trace(`PictProvider [${this.UUID}]::[${this.Hash}] ${this.options.ProviderIdentifier} onAfterInitialize:`);}return true;}/**
	 * @param {(pError?: Error) => void} fCallback - The callback to call after initialization.
	 *
	 * @return {void}
	 */onAfterInitializeAsync(fCallback){this.onAfterInitialize();return fCallback();}onPreRender(){if(this.pict.LogNoisiness>3){this.log.trace(`PictProvider [${this.UUID}]::[${this.Hash}] ${this.options.ProviderIdentifier} onPreRender:`);}return true;}/**
	 * @param {(pError?: Error) => void} fCallback - The callback to call after pre-render.
	 *
	 * @return {void}
	 */onPreRenderAsync(fCallback){this.onPreRender();return fCallback();}render(){return this.onPreRender();}/**
	 * @param {(pError?: Error) => void} fCallback - The callback to call after render.
	 *
	 * @return {void}
	 */renderAsync(fCallback){this.onPreRender();return fCallback();}onPreSolve(){if(this.pict.LogNoisiness>3){this.log.trace(`PictProvider [${this.UUID}]::[${this.Hash}] ${this.options.ProviderIdentifier} onPreSolve:`);}return true;}/**
	 * @param {(pError?: Error) => void} fCallback - The callback to call after pre-solve.
	 *
	 * @return {void}
	 */onPreSolveAsync(fCallback){this.onPreSolve();return fCallback();}solve(){return this.onPreSolve();}/**
	 * @param {(pError?: Error) => void} fCallback - The callback to call after solve.
	 *
	 * @return {void}
	 */solveAsync(fCallback){this.onPreSolve();return fCallback();}/**
	 * @param {(pError?: Error) => void} fCallback - The callback to call after the data pre-load.
	 */onBeforeLoadDataAsync(fCallback){return fCallback();}/**
	 * Hook to allow the provider to load data during application data load.
	 *
	 * @param {(pError?: Error) => void} fCallback - The callback to call after the data load.
	 */onLoadDataAsync(fCallback){if(this.pict.LogNoisiness>3){this.log.trace(`PictProvider [${this.UUID}]::[${this.Hash}] ${this.options.ProviderIdentifier} onLoadDataAsync:`);}return fCallback();}/**
	 * @param {(pError?: Error) => void} fCallback - The callback to call after the data post-load.
	 */onAfterLoadDataAsync(fCallback){return fCallback();}/**
	 * @param {(pError?: Error) => void} fCallback - The callback to call after the data pre-load.
	 *
	 * @return {void}
	 */onBeforeSaveDataAsync(fCallback){return fCallback();}/**
	 * Hook to allow the provider to load data during application data load.
	 *
	 * @param {(pError?: Error) => void} fCallback - The callback to call after the data load.
	 *
	 * @return {void}
	 */onSaveDataAsync(fCallback){if(this.pict.LogNoisiness>3){this.log.trace(`PictProvider [${this.UUID}]::[${this.Hash}] ${this.options.ProviderIdentifier} onSaveDataAsync:`);}return fCallback();}/**
	 * @param {(pError?: Error) => void} fCallback - The callback to call after the data post-load.
	 *
	 * @return {void}
	 */onAfterSaveDataAsync(fCallback){return fCallback();}}module.exports=PictProvider;},{"../package.json":12,"fable-serviceproviderbase":2}],14:[function(require,module,exports){const libPictProvider=require('pict-provider');const libNavigo=require('navigo');const _DEFAULT_PROVIDER_CONFIGURATION={ProviderIdentifier:'Pict-Router',AutoInitialize:true,AutoInitializeOrdinal:0,// When true, addRoute() will NOT auto-resolve after each route is added.
// This is useful in auth-gated SPAs where routes should only resolve after
// the DOM is ready (e.g. after login).  Can also be set globally via
// pict.settings.RouterSkipRouteResolveOnAdd — either one enables the skip.
SkipRouteResolveOnAdd:false};class PictRouter extends libPictProvider{constructor(pFable,pOptions,pServiceHash){let tmpOptions=Object.assign({},_DEFAULT_PROVIDER_CONFIGURATION,pOptions);super(pFable,tmpOptions,pServiceHash);// Initialize the navigo router and set the base path to '/'
this.router=new libNavigo('/',{strategy:'ONE',hash:true});if(this.options.Routes){for(let i=0;i<this.options.Routes.length;i++){if(this.options.Routes[i].path&&this.options.Routes[i].template){this.addRoute(this.options.Routes[i].path,this.options.Routes[i].template);}else if(this.options.Routes[i].path&&this.options.Routes[i].render){this.addRoute(this.options.Routes[i].path,this.options.Routes[i].render);}else{this.pict.log.warn(`Route ${i} is missing a render function or template string.`);}}}// This is the route to render after load
this.afterPersistView='/Manyfest/Overview';}get currentScope(){return this.AppData?.ManyfestRecord?.Scope??'Default';}forwardToScopedRoute(pData){this.navigate(`${pData.url}/${this.currentScope}`);}onInitializeAsync(fCallback){return super.onInitializeAsync(fCallback);}/**
	 * Add a route to the router.
	 */addRoute(pRoute,pRenderable){if(typeof pRenderable==='function'){this.router.on(pRoute,pRenderable);}else if(typeof pRenderable==='string'){// Run this as a template, allowing some whack things with functions in template expressions.
this.router.on(pRoute,pData=>{this.pict.parseTemplate(pRenderable,pData,null,this.pict);});}else{// renderable isn't usable!
this.pict.log.warn(`Route ${pRoute} has an invalid renderable.`);return;}// By default, resolve after each route is added (legacy behavior).
// Applications can skip this by setting SkipRouteResolveOnAdd: true in
// the provider config JSON, or globally via
// pict.settings.RouterSkipRouteResolveOnAdd.  Either one will prevent
// premature route resolution before views are rendered.
if(!this.options.SkipRouteResolveOnAdd&&!this.pict.settings.RouterSkipRouteResolveOnAdd){this.resolve();}}/**
	 * Navigate to a given route (set the browser URL string, add to history, trigger router)
	 * 
	 * @param {string} pRoute - The route to navigate to
	 */navigate(pRoute){this.router.navigate(pRoute);}/**
	 * Navigate to the route currently in the browser's location hash.
	 *
	 * This is useful in auth-gated SPAs: when the user pastes a deep-link
	 * (e.g. #/Books) and then logs in, calling navigateCurrent() will force
	 * the router to fire the handler for whatever hash is already in the URL.
	 * Unlike resolve(), navigate() always triggers the handler even if Navigo
	 * has already "consumed" that URL.
	 *
	 * If the hash is empty or just "#/", this is a no-op and returns false.
	 *
	 * @returns {boolean} true if a route was navigated to, false otherwise
	 */navigateCurrent(){let tmpHash=typeof window!=='undefined'&&window.location?window.location.hash:'';if(tmpHash&&tmpHash.length>2&&tmpHash!=='#/'){let tmpRoute=tmpHash.replace(/^#/,'');this.navigate(tmpRoute);return true;}return false;}/**
	 * Trigger the router resolving logic; this is expected to be called after all routes are added (to go to the default route).
	 *
	 */resolve(){this.router.resolve();}}module.exports=PictRouter;module.exports.default_configuration=_DEFAULT_PROVIDER_CONFIGURATION;},{"navigo":3,"pict-provider":13}],15:[function(require,module,exports){/**
 * Simple syntax highlighter for use with CodeJar.
 *
 * Provides basic keyword/string/number/comment highlighting for common languages.
 * Can be replaced with Prism.js or highlight.js for more sophisticated highlighting
 * by passing a custom highlight function to the view options.
 *
 * @module Pict-Code-Highlighter
 */// Language definition map
const _LanguageDefinitions={'javascript':{// Combined regex to tokenize: comments, strings, template literals, regex, then everything else
tokenizer:/(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|(["'])(?:(?!\2|\\).|\\.)*?\2|(`(?:[^`\\]|\\.)*?`)|(\/(?![/*])(?:\\.|\[(?:\\.|[^\]])*\]|[^/\\\n])+\/[gimsuvy]*)/g,keywords:/\b(async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|export|extends|finally|for|from|function|get|if|import|in|instanceof|let|new|of|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/g,builtins:/\b(true|false|null|undefined|NaN|Infinity|console|window|document|Math|JSON|Array|Object|String|Number|Boolean|Date|RegExp|Map|Set|Promise|Error|Symbol|parseInt|parseFloat|require|module|exports)\b/g,numbers:/\b(\d+\.?\d*(?:e[+-]?\d+)?|0x[0-9a-fA-F]+|0b[01]+|0o[0-7]+)\b/g},'json':{tokenizer:/(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:[^"\\]|\\.)*")/g,keywords:/\b(true|false|null)\b/g,numbers:/-?\b\d+\.?\d*(?:e[+-]?\d+)?\b/g},'html':{// Tokenizer captures: (1) comments, (2) strings, (3) tags with attributes
tokenizer:/(<!--[\s\S]*?-->)|(["'])(?:(?!\2|\\).|\\.)*?\2|(<\/?[a-zA-Z][a-zA-Z0-9-]*(?:\s+[a-zA-Z-]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*))?)*\s*\/?>)/g,// tagToken group index for identifying tag matches
tagGroupIndex:3},'css':{tokenizer:/(\/\*[\s\S]*?\*\/)|(["'])(?:(?!\2|\\).|\\.)*?\2/g,selectors:/([.#]?[a-zA-Z_][\w-]*(?:\s*[>+~]\s*[.#]?[a-zA-Z_][\w-]*)*)\s*\{/g,properties:/\b([a-zA-Z-]+)\s*:/g,numbers:/\b(\d+\.?\d*)(px|em|rem|%|vh|vw|s|ms|deg|fr)?\b/g,keywords:/\b(important|inherit|initial|unset|none|auto|block|inline|flex|grid)\b/g},'sql':{tokenizer:/(--[^\n]*|\/\*[\s\S]*?\*\/)|(["'])(?:(?!\2|\\).|\\.)*?\2/g,keywords:/\b(SELECT|FROM|WHERE|AND|OR|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|DROP|ALTER|ADD|COLUMN|INDEX|JOIN|LEFT|RIGHT|INNER|OUTER|ON|AS|ORDER|BY|GROUP|HAVING|LIMIT|OFFSET|UNION|ALL|DISTINCT|COUNT|SUM|AVG|MIN|MAX|NOT|NULL|IS|IN|BETWEEN|LIKE|EXISTS|CASE|WHEN|THEN|ELSE|END|PRIMARY|KEY|FOREIGN|REFERENCES|CONSTRAINT|DEFAULT|CHECK|UNIQUE|CASCADE|GRANT|REVOKE|COMMIT|ROLLBACK|BEGIN|TRANSACTION|INT|VARCHAR|DATETIME|AUTO_INCREMENT|CURRENT_TIMESTAMP)\b/gi,numbers:/\b\d+\.?\d*\b/g}};// Alias some common language names
_LanguageDefinitions['js']=_LanguageDefinitions['javascript'];_LanguageDefinitions['htm']=_LanguageDefinitions['html'];/**
 * Escape HTML special characters to prevent XSS when inserting into innerHTML.
 *
 * @param {string} pString - The string to escape
 * @returns {string} The escaped string
 */function escapeHTML(pString){return pString.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}/**
 * Highlight a segment of code that is NOT inside a string or comment.
 * This applies keyword, number, and structural highlighting.
 *
 * @param {string} pCode - The code segment to highlight (already HTML-escaped)
 * @param {object} pLanguageDef - The language definition
 * @returns {string} The highlighted HTML
 */function highlightCodeSegment(pCode,pLanguageDef){let tmpResult=pCode;// CSS selectors
if(pLanguageDef.selectors){pLanguageDef.selectors.lastIndex=0;tmpResult=tmpResult.replace(pLanguageDef.selectors,'<span class="function-name">$1</span>{');}// CSS properties
if(pLanguageDef.properties){pLanguageDef.properties.lastIndex=0;tmpResult=tmpResult.replace(pLanguageDef.properties,'<span class="property">$1</span>:');}// Keywords
if(pLanguageDef.keywords){pLanguageDef.keywords.lastIndex=0;tmpResult=tmpResult.replace(pLanguageDef.keywords,'<span class="keyword">$1</span>');}// Builtins
if(pLanguageDef.builtins){pLanguageDef.builtins.lastIndex=0;tmpResult=tmpResult.replace(pLanguageDef.builtins,'<span class="keyword">$1</span>');}// Numbers (CSS numbers may have units as a capture group, others do not)
if(pLanguageDef.numbers){pLanguageDef.numbers.lastIndex=0;tmpResult=tmpResult.replace(pLanguageDef.numbers,pMatch=>{return`<span class="number">${pMatch}</span>`;});}return tmpResult;}/**
 * Highlight an HTML tag token, applying tag name, attribute name, and attribute value colors.
 *
 * The approach: parse the raw tag into structured pieces first, then build the
 * highlighted output from those pieces. This avoids mixing raw text with HTML span
 * tags, which would cause regex replacements to match span attributes on subsequent passes.
 *
 * @param {string} pTag - The raw (unescaped) tag string
 * @returns {string} The highlighted HTML
 */function highlightHTMLTag(pTag){let tmpResult='';let tmpRest=pTag;// 1. Extract the opening bracket and tag name: < or </  followed by tagname
let tmpTagNameMatch=tmpRest.match(/^(<\/?)([a-zA-Z][a-zA-Z0-9-]*)/);if(!tmpTagNameMatch){// Not a recognizable tag, just escape the whole thing
return escapeHTML(pTag);}tmpResult+=escapeHTML(tmpTagNameMatch[1]);tmpResult+='<span class="tag">'+escapeHTML(tmpTagNameMatch[2])+'</span>';tmpRest=tmpRest.substring(tmpTagNameMatch[0].length);// 2. Parse attributes from the remaining text (before the closing > or />)
// Repeatedly match: whitespace + attr-name + optional =value
let tmpAttrRegex=/^(\s+)([a-zA-Z-]+)(?:(\s*=\s*)(["'])([^"']*?)\4)?/;let tmpAttrMatch;while((tmpAttrMatch=tmpRest.match(tmpAttrRegex))!==null){// Whitespace before the attribute
tmpResult+=tmpAttrMatch[1];// Attribute name
tmpResult+='<span class="attr-name">'+escapeHTML(tmpAttrMatch[2])+'</span>';// If there's an = value part
if(tmpAttrMatch[3]){tmpResult+=escapeHTML(tmpAttrMatch[3]);tmpResult+='<span class="attr-value">'+escapeHTML(tmpAttrMatch[4])+escapeHTML(tmpAttrMatch[5])+escapeHTML(tmpAttrMatch[4])+'</span>';}tmpRest=tmpRest.substring(tmpAttrMatch[0].length);}// 3. Whatever remains (whitespace, />, >) — escape it all
tmpResult+=escapeHTML(tmpRest);return tmpResult;}/**
 * Create a highlight function for a given language.
 *
 * The approach: use a single tokenizer regex to split the code into protected tokens
 * (comments, strings) and code segments. Process each segment independently.
 * This avoids placeholder/sentinel issues entirely.
 *
 * @param {string} pLanguage - The language identifier (e.g. "javascript", "json", "html")
 * @returns {function} A function that takes an element and highlights its textContent
 */function createHighlighter(pLanguage){return function highlightElement(pElement){let tmpCode=pElement.textContent;let tmpLanguageName=typeof pLanguage==='string'?pLanguage.toLowerCase():'javascript';let tmpLanguageDef=_LanguageDefinitions[tmpLanguageName];if(!tmpLanguageDef){// No highlighting rules for this language; just escape and return
pElement.innerHTML=escapeHTML(tmpCode);return;}if(!tmpLanguageDef.tokenizer){// No tokenizer; just escape and apply keyword highlighting
pElement.innerHTML=highlightCodeSegment(escapeHTML(tmpCode),tmpLanguageDef);return;}// Split the code into tokens using the tokenizer regex.
// The tokenizer captures comments and strings as groups.
// We process everything between matches as code.
let tmpResult='';let tmpLastIndex=0;let tmpTagGroupIndex=tmpLanguageDef.tagGroupIndex||0;tmpLanguageDef.tokenizer.lastIndex=0;let tmpMatch;while((tmpMatch=tmpLanguageDef.tokenizer.exec(tmpCode))!==null){// Add the code segment before this match
if(tmpMatch.index>tmpLastIndex){let tmpSegment=tmpCode.substring(tmpLastIndex,tmpMatch.index);tmpResult+=highlightCodeSegment(escapeHTML(tmpSegment),tmpLanguageDef);}let tmpFullMatch=tmpMatch[0];// Determine token type from capture groups
// Group 1 is always comments, Group 2+ are strings/template literals/regex
if(tmpMatch[1]){// Comment
tmpResult+=`<span class="comment">${escapeHTML(tmpFullMatch)}</span>`;}else if(tmpTagGroupIndex>0&&tmpMatch[tmpTagGroupIndex]){// HTML tag — highlight tag name, attributes, and values
tmpResult+=highlightHTMLTag(tmpFullMatch);}else{// String, template literal, or regex
tmpResult+=`<span class="string">${escapeHTML(tmpFullMatch)}</span>`;}tmpLastIndex=tmpLanguageDef.tokenizer.lastIndex;}// Add any remaining code after the last match
if(tmpLastIndex<tmpCode.length){let tmpSegment=tmpCode.substring(tmpLastIndex);tmpResult+=highlightCodeSegment(escapeHTML(tmpSegment),tmpLanguageDef);}pElement.innerHTML=tmpResult;};}module.exports=createHighlighter;module.exports.LanguageDefinitions=_LanguageDefinitions;},{}],16:[function(require,module,exports){module.exports={"RenderOnLoad":true,"DefaultRenderable":"CodeEditor-Wrap","DefaultDestinationAddress":"#CodeEditor-Container-Div","Templates":[{"Hash":"CodeEditor-Container","Template":"<!-- CodeEditor-Container Rendering Soon -->"}],"Renderables":[{"RenderableHash":"CodeEditor-Wrap","TemplateHash":"CodeEditor-Container","DestinationAddress":"#CodeEditor-Container-Div"}],"TargetElementAddress":"#CodeEditor-Container-Div",// Address in AppData or other Pict address space to read/write code content
"CodeDataAddress":false,// The language for syntax highlighting (e.g. "javascript", "html", "css", "json")
"Language":"javascript",// Whether the editor is read-only
"ReadOnly":false,// Tab character: use tab or spaces
"Tab":"\t",// Whether to indent with the same whitespace as the previous line
"IndentOn":/[({[]$/,// Whether to add a closing bracket/paren/brace
"MoveToNewLine":/^[)}\]]/,// Whether to handle the closing character
"AddClosing":true,// Whether to preserve indentation on new lines
"CatchTab":true,// Whether to show line numbers
"LineNumbers":true,// Default code content if no address is provided
"DefaultCode":"// Enter your code here\n",// CSS for the code editor.
//
// Every color/font is wired through pict-provider-theme tokens so apps
// using pict-provider-theme get themed code editor automatically.  Each
// var() carries its original ATOM-One-Light hex as the fallback so apps
// without pict-provider-theme installed look exactly as before.
"CSS":`.pict-code-editor-wrap
{
	display: flex;
	font-family: var(--theme-typography-family-mono, 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', 'Liberation Mono', 'Courier New', monospace);
	font-size: 14px;
	line-height: 1.5;
	border: 1px solid var(--theme-color-border-default, #D0D0D0);
	border-radius: 4px;
	overflow: hidden;
}
.pict-code-editor-wrap .pict-code-line-numbers
{
	width: 40px;
	min-width: 40px;
	/* padding-top/bottom are stamped at runtime from the editor's
	   computed padding so row 1 of the gutter aligns with row 1 of
	   the code; only horizontal padding is stylesheet-owned. */
	padding: 0;
	text-align: right;
	background: var(--theme-color-editor-linenumber-background, var(--theme-color-background-secondary, #F5F5F5));
	border-right: 1px solid var(--theme-color-editor-gutter-border, var(--theme-color-border-default, #D0D0D0));
	color: var(--theme-color-editor-linenumber-text, var(--theme-color-text-muted, #999));
	font-size: 13px;
	/* line-height, padding-top, padding-bottom, and font-family are
	   intentionally NOT declared here.  PictSectionCode._syncGutterMetrics()
	   copies them from the editor's computed styles at init and on every
	   editor resize, so the gutter is guaranteed to track the editor.
	   Declaring them in CSS would either be redundant (when matching) or
	   actively wrong (when the editor's metrics diverge — e.g. theme scale
	   changes the editor's font-size).  See codejar-linenumbers for the
	   canonical version of this pattern. */
	user-select: none;
	pointer-events: none;
	box-sizing: border-box;
}
.pict-code-editor-wrap .pict-code-line-numbers span
{
	display: block;
	padding: 0 8px 0 0;
}
.pict-code-editor-wrap .pict-code-editor
{
	margin: 0;
	padding: 10px 10px 10px 8px;
	min-height: 100px;
	flex: 1;
	min-width: 0;
	outline: none;
	tab-size: 4;
	white-space: pre;
	overflow-wrap: normal;
	color: var(--theme-color-text-primary, #383A42);
	background: var(--theme-color-background-panel, #FAFAFA);
	caret-color: var(--theme-color-brand-primary, #526FFF);
	border-radius: 0 4px 4px 0;
}
.pict-code-editor-wrap .pict-code-editor.pict-code-no-line-numbers
{
	padding-left: 10px;
	border-radius: 4px;
}
.pict-code-editor-wrap .pict-code-editor::selection,
.pict-code-editor-wrap .pict-code-editor *::selection
{
	background: var(--theme-color-editor-selection-background, var(--theme-color-selection-background, #B3D4FC));
}
/* Syntax token colors — each class binds to a Color.Syntax.* token from
   pict-provider-theme. Fallback hexes match the One Light palette so apps
   that don't install the theme provider look the same as before. */
.pict-code-editor-wrap .pict-code-editor .keyword       { color: var(--theme-color-syntax-keyword,     #A626A4); }
.pict-code-editor-wrap .pict-code-editor .string        { color: var(--theme-color-syntax-string,      #50A14F); }
.pict-code-editor-wrap .pict-code-editor .number        { color: var(--theme-color-syntax-number,      #986801); }
.pict-code-editor-wrap .pict-code-editor .comment       { color: var(--theme-color-syntax-comment,     #A0A1A7); font-style: italic; }
.pict-code-editor-wrap .pict-code-editor .operator      { color: var(--theme-color-syntax-operator,    #0184BC); }
.pict-code-editor-wrap .pict-code-editor .punctuation   { color: var(--theme-color-syntax-punctuation, #383A42); }
.pict-code-editor-wrap .pict-code-editor .function-name { color: var(--theme-color-syntax-function,    #4078F2); }
.pict-code-editor-wrap .pict-code-editor .property      { color: var(--theme-color-syntax-property,    #E45649); }
.pict-code-editor-wrap .pict-code-editor .tag           { color: var(--theme-color-syntax-tag,         #E45649); }
.pict-code-editor-wrap .pict-code-editor .attr-name     { color: var(--theme-color-syntax-attrname,    #986801); }
.pict-code-editor-wrap .pict-code-editor .attr-value    { color: var(--theme-color-syntax-attrvalue,   #50A14F); }
.pict-code-editor-wrap .pict-code-editor .builtin       { color: var(--theme-color-syntax-builtin,     #986801); }
.pict-code-editor-wrap .pict-code-editor .type          { color: var(--theme-color-syntax-type,        #C18401); }
.pict-code-editor-wrap .pict-code-editor .variable      { color: var(--theme-color-syntax-variable,    #383A42); }

/* highlight.js class aliases — when host apps render code blocks with
   highlight.js (e.g. markdown previews via CodeJar's hljs integration),
   the output uses .hljs / .hljs-* classes rather than the bare token
   classes pict-section-code emits. Mapping them here lets one stylesheet
   theme both editor surfaces (bare classes) and hljs-rendered surfaces
   without the host needing a separate per-app github.css. Rules are
   intentionally unscoped (no .pict-code-editor-wrap parent) so they
   apply globally wherever hljs paints. */
.hljs                  { color: var(--theme-color-text-primary,         #383A42); background: transparent; }
.hljs-keyword,
.hljs-keyword.hljs-typeof,
.hljs-selector-tag,
.hljs-literal          { color: var(--theme-color-syntax-keyword,       #A626A4); }
.hljs-string,
.hljs-regexp,
.hljs-template-tag,
.hljs-template-variable { color: var(--theme-color-syntax-string,       #50A14F); }
.hljs-number,
.hljs-meta             { color: var(--theme-color-syntax-number,        #986801); }
.hljs-comment,
.hljs-quote            { color: var(--theme-color-syntax-comment,       #A0A1A7); font-style: italic; }
.hljs-operator,
.hljs-link             { color: var(--theme-color-syntax-operator,      #0184BC); }
.hljs-punctuation      { color: var(--theme-color-syntax-punctuation,   #383A42); }
.hljs-function .hljs-title,
.hljs-title.function_,
.hljs-title.class_     { color: var(--theme-color-syntax-function,      #4078F2); }
.hljs-variable,
.hljs-variable.language_,
.hljs-params           { color: var(--theme-color-syntax-variable,      #383A42); }
.hljs-type,
.hljs-class .hljs-title { color: var(--theme-color-syntax-type,         #C18401); }
.hljs-built_in,
.hljs-builtin-name     { color: var(--theme-color-syntax-builtin,       #986801); }
.hljs-attr,
.hljs-property         { color: var(--theme-color-syntax-property,      #E45649); }
.hljs-tag,
.hljs-name             { color: var(--theme-color-syntax-tag,           #E45649); }
.hljs-attribute        { color: var(--theme-color-syntax-attrname,      #986801); }
.hljs-symbol           { color: var(--theme-color-syntax-attrvalue,     #50A14F); }
.hljs-emphasis         { font-style: italic; }
.hljs-strong           { font-weight: bold; }
.hljs-deletion         { color: var(--theme-color-status-error,         #B62828); background: rgba(220, 50, 47, 0.08); }
.hljs-addition         { color: var(--theme-color-status-success,       #2E7A3A); background: rgba(80, 161, 79, 0.10); }
`};},{}],17:[function(require,module,exports){const libPictViewClass=require('pict-view');const libCreateHighlighter=require('./Pict-Code-Highlighter.js');const _DefaultConfiguration=require('./Pict-Section-Code-DefaultConfiguration.js');class PictSectionCode extends libPictViewClass{constructor(pFable,pOptions,pServiceHash){let tmpOptions=Object.assign({},_DefaultConfiguration,pOptions);super(pFable,tmpOptions,pServiceHash);this.initialRenderComplete=false;// The CodeJar instance
this.codeJar=null;// The highlight function (can be overridden)
this._highlightFunction=null;// The current language
this._language=this.options.Language||'javascript';}onBeforeInitialize(){super.onBeforeInitialize();this._codeJarPrototype=null;this.targetElement=false;// Build the default highlight function for the configured language
this._highlightFunction=libCreateHighlighter(this._language);return super.onBeforeInitialize();}/**
	 * Connect the CodeJar prototype.  If not passed explicitly, try to find it
	 * as a global (window.CodeJar) or require it from the npm package.
	 *
	 * @param {function} [pCodeJarPrototype] - The CodeJar constructor function
	 * @returns {boolean|void}
	 */connectCodeJarPrototype(pCodeJarPrototype){if(typeof pCodeJarPrototype==='function'){this._codeJarPrototype=pCodeJarPrototype;return;}// Try to find CodeJar in global scope
if(typeof window!=='undefined'){if(typeof window.CodeJar==='function'){this.log.trace(`PICT-Code Found CodeJar in window.CodeJar.`);this._codeJarPrototype=window.CodeJar;return;}}this.log.error(`PICT-Code No CodeJar prototype found. Include codejar via script tag or call connectCodeJarPrototype(CodeJar) explicitly.`);return false;}onAfterRender(pRenderable){// Ensure the CSS from all registered views is injected into the DOM
this.pict.CSSMap.injectCSS();if(!this.initialRenderComplete){this.onAfterInitialRender();this.initialRenderComplete=true;}return super.onAfterRender(pRenderable);}onAfterInitialRender(){// Resolve the CodeJar prototype if not already set
if(!this._codeJarPrototype){this.connectCodeJarPrototype();}if(!this._codeJarPrototype){this.log.error(`PICT-Code Cannot initialize editor; no CodeJar prototype available.`);return false;}if(this.codeJar){this.log.error(`PICT-Code editor is already initialized!`);return false;}// Find the target element
let tmpTargetElementSet=this.services.ContentAssignment.getElement(this.options.TargetElementAddress);if(!tmpTargetElementSet||tmpTargetElementSet.length<1){this.log.error(`PICT-Code Could not find target element [${this.options.TargetElementAddress}]!`);this.targetElement=false;return false;}this.targetElement=tmpTargetElementSet[0];// Build the editor DOM structure
this._buildEditorDOM();// Get initial code content
let tmpCode=this._resolveCodeContent();// Create the CodeJar options
let tmpCodeJarOptions={};if(this.options.Tab){tmpCodeJarOptions.tab=this.options.Tab;}if(this.options.IndentOn){tmpCodeJarOptions.indentOn=this.options.IndentOn;}if(this.options.MoveToNewLine){tmpCodeJarOptions.moveToNewLine=this.options.MoveToNewLine;}if(typeof this.options.AddClosing!=='undefined'){tmpCodeJarOptions.addClosing=this.options.AddClosing;}if(typeof this.options.CatchTab!=='undefined'){tmpCodeJarOptions.catchTab=this.options.CatchTab;}this.customConfigureEditorOptions(tmpCodeJarOptions);// Instantiate CodeJar on the editor element
let tmpEditorElement=this._editorElement;this.codeJar=this._codeJarPrototype(tmpEditorElement,this._highlightFunction,tmpCodeJarOptions);// CodeJar forces white-space:pre-wrap and overflow-wrap:break-word
// via inline styles, which causes line wrapping that breaks the
// line-number alignment.  Override back to non-wrapping so the
// wrap container scrolls horizontally instead.
this._resetEditorWrapStyles();// Set the initial code
if(tmpCode){this.codeJar.updateCode(tmpCode);}// Wire up the change handler
this.codeJar.onUpdate(pCode=>{this._updateLineNumbers();this.onCodeChange(pCode);});// Initial line number render
this._updateLineNumbers();// Sync line-numbers vertical position with the editor's scroll.
//
// The editor element scrolls internally (CodeJar uses
// contenteditable + overflow:auto for long content), but the
// line-numbers div is a sibling with overflow:visible — without
// this sync the line-numbers content stays glued at the top of
// the wrap while the editor scrolls underneath it, so "line 1"
// appears next to whatever line is actually showing.
//
// Using `transform: translateY(...)` instead of scrollTop keeps
// the sync compositor-only (no reflow per scroll event) and
// avoids needing to change the line-numbers element's overflow
// from visible.  Passive listener so we don't block scrolling.
if(this._lineNumbersElement){let tmpLineNumbersEl=this._lineNumbersElement;tmpEditorElement.addEventListener('scroll',function(){tmpLineNumbersEl.style.transform='translateY(-'+tmpEditorElement.scrollTop+'px)';},{passive:true});}// Sync gutter typographic metrics from the editor.  The gutter
// must use the editor's exact line-height (and matching padding)
// or rows drift apart cumulatively.  See _syncGutterMetrics().
this._syncGutterMetrics();// Watch the editor for size changes (window resize affecting
// flex layout, container resize) and re-sync the gutter so it
// continues to track the editor.  ResizeObserver fires once per
// frame at most, so the cost is negligible.
if(this._lineNumbersElement&&typeof ResizeObserver==='function'){let tmpSelf=this;this._editorResizeObserver=new ResizeObserver(function(){tmpSelf._syncGutterMetrics();});this._editorResizeObserver.observe(tmpEditorElement);}// Watch for direct style/class mutations on the editor.  Theme
// providers that toggle scale by swapping a class on the editor,
// or host code that adjusts editor typography via inline styles,
// don't necessarily change the editor's box size — so the
// ResizeObserver above wouldn't see them.  MutationObserver on
// the attributes catches these cases.
if(this._lineNumbersElement&&typeof MutationObserver==='function'){let tmpSelf=this;this._editorStyleObserver=new MutationObserver(function(){tmpSelf._syncGutterMetrics();});this._editorStyleObserver.observe(tmpEditorElement,{attributes:true,attributeFilter:['style','class']});}// Handle read-only
if(this.options.ReadOnly){tmpEditorElement.setAttribute('contenteditable','false');}}/**
	 * Build the editor DOM elements inside the target container.
	 */_buildEditorDOM(){// Clear the target
this.targetElement.innerHTML='';// Create wrapper
let tmpWrap=document.createElement('div');tmpWrap.className='pict-code-editor-wrap';// Create line numbers container
if(this.options.LineNumbers){let tmpLineNumbers=document.createElement('div');tmpLineNumbers.className='pict-code-line-numbers';tmpWrap.appendChild(tmpLineNumbers);this._lineNumbersElement=tmpLineNumbers;}// Create the editor element (CodeJar needs a pre or div)
let tmpEditor=document.createElement('div');tmpEditor.className='pict-code-editor language-'+this._language;if(!this.options.LineNumbers){tmpEditor.className+=' pict-code-no-line-numbers';}tmpWrap.appendChild(tmpEditor);this.targetElement.appendChild(tmpWrap);this._editorElement=tmpEditor;this._wrapElement=tmpWrap;}/**
	 * Update the line numbers display based on current code content.
	 */_updateLineNumbers(){if(!this.options.LineNumbers||!this._lineNumbersElement||!this._editorElement){return;}let tmpCode=this._editorElement.textContent||'';let tmpLineCount=tmpCode.split('\n').length;let tmpHTML='';for(let i=1;i<=tmpLineCount;i++){tmpHTML+=`<span>${i}</span>`;}this._lineNumbersElement.innerHTML=tmpHTML;// Defense-in-depth: every line-count rebuild is also a natural
// re-sync point.  Cheap (one getComputedStyle + a handful of
// style writes) and guarantees newly-added spans use the same
// metrics as the editor at the moment of the rebuild.
this._syncGutterMetrics();}/**
	 * Copy typographic metrics from the editor element to the line-numbers
	 * gutter so every gutter row lines up with its corresponding code row.
	 *
	 * The gutter is a sibling element with its own font/line-height
	 * declarations — if any one diverges from the editor (unitless
	 * line-height resolving against a different font-size, host CSS
	 * overriding font-family, theme scale changing the editor's metrics),
	 * the two desync and the drift accumulates with every line.
	 *
	 * The pattern is borrowed from the canonical `codejar-linenumbers`
	 * library (julianpoemp/codejar-linenumbers), which solves the same
	 * class of bug by reading the editor's computed styles at init and
	 * stamping them onto the gutter.  We extend that here by also
	 * re-stamping whenever the editor resizes (see the ResizeObserver in
	 * onAfterInitialRender), so theme scale changes self-heal too.
	 *
	 * Public callers can invoke {@link syncMetrics} to force a re-sync
	 * after any external change that affects editor typography.
	 */_syncGutterMetrics(){if(!this._lineNumbersElement||!this._editorElement){return;}if(typeof window==='undefined'||typeof window.getComputedStyle!=='function'){return;}let tmpEditorStyle=window.getComputedStyle(this._editorElement);let tmpLineHeight=tmpEditorStyle.lineHeight;// `normal` is the spec default — leave the gutter untouched so the
// stylesheet's declaration wins (we have no number to copy).
if(tmpLineHeight&&tmpLineHeight!=='normal'){this._lineNumbersElement.style.lineHeight=tmpLineHeight;}// Match the editor's vertical padding so row 1 of the gutter sits
// at the same y-offset as row 1 of the code.
if(tmpEditorStyle.paddingTop){this._lineNumbersElement.style.paddingTop=tmpEditorStyle.paddingTop;}if(tmpEditorStyle.paddingBottom){this._lineNumbersElement.style.paddingBottom=tmpEditorStyle.paddingBottom;}// Font-family must match so the visual baseline of the digits
// aligns with the code (different monospace fonts can have
// different x-heights even at identical line-heights).
if(tmpEditorStyle.fontFamily){this._lineNumbersElement.style.fontFamily=tmpEditorStyle.fontFamily;}// Dev-time sanity check.  If the gutter's resolved row height
// disagrees with the editor's, alignment will drift cumulatively.
// Warn loudly so the regression is caught at the next reload
// instead of silently accumulating pixels per line.
if(typeof console!=='undefined'&&console.warn){let tmpFirstSpan=this._lineNumbersElement.querySelector('span');if(tmpFirstSpan){let tmpGutterRow=tmpFirstSpan.getBoundingClientRect().height;let tmpEditorRow=parseFloat(tmpLineHeight);if(tmpGutterRow&&tmpEditorRow&&Math.abs(tmpGutterRow-tmpEditorRow)>0.5){console.warn('[pict-section-code] gutter/editor row-height mismatch: '+'gutter '+tmpGutterRow+'px vs editor '+tmpEditorRow+'px — '+'line numbers will drift. Check for CSS overriding '+'.pict-code-line-numbers line-height.');}}}}/**
	 * Public hook for hosts to force a gutter metrics re-sync after
	 * external typography changes (theme scale, font-size swap, etc.).
	 * The ResizeObserver attached at init handles most cases, but call
	 * this from an app's post-theme-change hook for belt-and-suspenders
	 * coverage.
	 */syncMetrics(){this._syncGutterMetrics();}/**
	 * Reset inline styles that CodeJar sets on the editor element.
	 *
	 * CodeJar forces white-space:pre-wrap and overflow-wrap:break-word so
	 * long lines wrap visually.  That breaks line-number alignment because
	 * each wrapped visual row is not a logical line.  Resetting to pre /
	 * normal makes the outer .pict-code-editor-wrap scroll horizontally.
	 */_resetEditorWrapStyles(){if(!this._editorElement){return;}this._editorElement.style.whiteSpace='pre';this._editorElement.style.overflowWrap='normal';}/**
	 * Resolve the initial code content from address or default.
	 *
	 * @returns {string} The code content
	 */_resolveCodeContent(){if(this.options.CodeDataAddress){const tmpAddressSpace={Fable:this.fable,Pict:this.fable,AppData:this.AppData,Bundle:this.Bundle,Options:this.options};let tmpAddressedData=this.fable.manifest.getValueByHash(tmpAddressSpace,this.options.CodeDataAddress);if(typeof tmpAddressedData==='string'){return tmpAddressedData;}else{this.log.warn(`PICT-Code Address [${this.options.CodeDataAddress}] did not return a string; it was ${typeof tmpAddressedData}.`);}}return this.options.DefaultCode||'';}/**
	 * Hook for subclasses to customize CodeJar options before instantiation.
	 *
	 * @param {object} pOptions - The CodeJar options object to modify
	 */customConfigureEditorOptions(pOptions){// Override in subclass to tweak options
}/**
	 * Called when the code content changes.  Override in subclasses to handle changes.
	 *
	 * @param {string} pCode - The new code content
	 */onCodeChange(pCode){// Write back to data address if configured
if(this.options.CodeDataAddress){const tmpAddressSpace={Fable:this.fable,Pict:this.fable,AppData:this.AppData,Bundle:this.Bundle,Options:this.options};this.fable.manifest.setValueByHash(tmpAddressSpace,this.options.CodeDataAddress,pCode);}}// -- Public API Methods --
/**
	 * Get the current code content.
	 *
	 * @returns {string} The current code
	 */getCode(){if(!this.codeJar){this.log.warn('PICT-Code getCode called before editor initialized.');return'';}return this.codeJar.toString();}/**
	 * Set the code content.
	 *
	 * @param {string} pCode - The code to set
	 */setCode(pCode){if(!this.codeJar){this.log.warn('PICT-Code setCode called before editor initialized.');return;}this.codeJar.updateCode(pCode);this._updateLineNumbers();}/**
	 * Change the editor language and re-highlight.
	 *
	 * @param {string} pLanguage - The language identifier
	 */setLanguage(pLanguage){this._language=pLanguage;this._highlightFunction=libCreateHighlighter(pLanguage);if(this._editorElement){// Update the class
this._editorElement.className='pict-code-editor language-'+pLanguage;if(!this.options.LineNumbers){this._editorElement.className+=' pict-code-no-line-numbers';}}if(this.codeJar){// Re-create the editor with the new highlight function
let tmpCode=this.codeJar.toString();this.codeJar.destroy();this.codeJar=this._codeJarPrototype(this._editorElement,this._highlightFunction,{tab:this.options.Tab,catchTab:this.options.CatchTab,addClosing:this.options.AddClosing});this._resetEditorWrapStyles();this.codeJar.updateCode(tmpCode);this.codeJar.onUpdate(pCode=>{this._updateLineNumbers();this.onCodeChange(pCode);});}}/**
	 * Set a custom highlight function to replace the built-in highlighter.
	 * Useful for integrating Prism.js, highlight.js, or any other library.
	 *
	 * @param {function} pHighlightFunction - A function that takes a DOM element and highlights its textContent
	 */setHighlightFunction(pHighlightFunction){if(typeof pHighlightFunction!=='function'){this.log.error('PICT-Code setHighlightFunction requires a function.');return;}this._highlightFunction=pHighlightFunction;if(this.codeJar){let tmpCode=this.codeJar.toString();this.codeJar.destroy();this.codeJar=this._codeJarPrototype(this._editorElement,this._highlightFunction,{tab:this.options.Tab,catchTab:this.options.CatchTab,addClosing:this.options.AddClosing});this._resetEditorWrapStyles();this.codeJar.updateCode(tmpCode);this.codeJar.onUpdate(pCode=>{this._updateLineNumbers();this.onCodeChange(pCode);});}}/**
	 * Set the read-only state of the editor.
	 *
	 * @param {boolean} pReadOnly - Whether the editor should be read-only
	 */setReadOnly(pReadOnly){this.options.ReadOnly=pReadOnly;if(this._editorElement){this._editorElement.setAttribute('contenteditable',pReadOnly?'false':'true');}}/**
	 * Destroy the editor and clean up.
	 */destroy(){if(this._editorResizeObserver){this._editorResizeObserver.disconnect();this._editorResizeObserver=null;}if(this._editorStyleObserver){this._editorStyleObserver.disconnect();this._editorStyleObserver=null;}if(this.codeJar){this.codeJar.destroy();this.codeJar=null;}}/**
	 * Marshal code content from the data address into the view.
	 */marshalToView(){super.marshalToView();if(this.codeJar&&this.options.CodeDataAddress){let tmpCode=this._resolveCodeContent();if(typeof tmpCode==='string'){this.codeJar.updateCode(tmpCode);this._updateLineNumbers();}}}/**
	 * Marshal the current code content back to the data address.
	 */marshalFromView(){super.marshalFromView();if(this.codeJar&&this.options.CodeDataAddress){this.onCodeChange(this.codeJar.toString());}}}module.exports=PictSectionCode;module.exports.default_configuration=_DefaultConfiguration;module.exports.createHighlighter=libCreateHighlighter;// Demo bundle for pict-docuserve.  Host apps that embed docuserve and
// want pict-section-code's demos visible in their docs site call
// `require('pict-section-code').registerWithDocuserve(pict)` once at
// app boot.  Silent no-op when Docuserve-Demos isn't installed.
//
// The require here is intentionally eager: browserify needs a static
// `require()` at module-toplevel to trace and bundle the demos source.
// The apparent circular dep (demos/index.js requires THIS module to
// reach the PictSectionCode class) is benign — by the time demos/
// index.js runs, `module.exports = PictSectionCode` has already
// executed, so it sees a usable class.  The `.demos` and
// `.registerWithDocuserve` attachments below run after the require
// returns, so demos/index.js never observes them being undefined.
const libCodeDemos=require('./demos');module.exports.demos=libCodeDemos.demos;module.exports.registerWithDocuserve=libCodeDemos.registerWithDocuserve;},{"./Pict-Code-Highlighter.js":15,"./Pict-Section-Code-DefaultConfiguration.js":16,"./demos":18,"pict-view":94}],18:[function(require,module,exports){/**
 * pict-section-code demos
 *
 * Each entry is consumed by pict-docuserve's `Docuserve-Demos` provider.
 * Hosts that want these demos to appear in their docs site call
 * `require('pict-section-code/source/demos').registerWithDocuserve(pict)`
 * once at app boot (typically inside their DocuserveApplication subclass
 * after `super(...)`).
 *
 * Each demo's Mount(pict, container, spec) signature creates a fresh
 * pict-section-code view instance inside the supplied container.  Spec
 * fields are passed through to the view config so a single demo template
 * can express "JavaScript with line numbers", "JSON read-only no
 * gutter", etc. without duplicating the wiring.
 */const libPictSectionCode=require('../Pict-Section-Code.js');/**
 * Internal helper: mount a pict-section-code instance into a host
 * container according to the demo spec.  Each call registers a uniquely
 * identified view so multiple demos on the same page coexist cleanly.
 */function mountCodeEditor(pPict,pContainer,pSpec){// Tag this mount with an id we can target as the destination.
let tmpDestId='demo-code-'+(pSpec.Hash||'unnamed')+'-'+Date.now();pContainer.innerHTML='<div id="'+tmpDestId+'"></div>';let tmpConfig={ViewIdentifier:'Demo-Code-'+tmpDestId,DefaultDestinationAddress:'#'+tmpDestId,Templates:[{Hash:'CodeEditor-Container',Template:'<!-- demo code editor renders here -->'}],Renderables:[{RenderableHash:'CodeEditor-Wrap',TemplateHash:'CodeEditor-Container',DestinationAddress:'#'+tmpDestId}],TargetElementAddress:'#'+tmpDestId,Language:pSpec.Language||'javascript',ReadOnly:!!pSpec.ReadOnly,LineNumbers:pSpec.LineNumbers!==false,Tab:pSpec.Tab||'\t',AddClosing:pSpec.AddClosing!==false,CatchTab:pSpec.CatchTab!==false,DefaultCode:pSpec.Code||'// example code\n',// AutoRender is intentionally OFF so we can pre-wire CodeJar
// before the first render fires.  pict-section-code looks for
// window.CodeJar by default; most hosts bundle CodeJar under
// window.CodeJarModules.CodeJar (e.g. retold-content-system's
// codejar-bundle.js), so we wire it explicitly here.
AutoRender:false,RenderOnLoad:false};let tmpView=pPict.addView(tmpConfig.ViewIdentifier,tmpConfig,libPictSectionCode);if(!tmpView){return null;}// Connect the CodeJar prototype + highlight function from the
// CodeJarModules global if it's loaded.  Falls back to bare CodeJar
// if the host published the prototype directly.
if(typeof window!=='undefined'){if(window.CodeJarModules&&typeof window.CodeJarModules.CodeJar==='function'){tmpView.connectCodeJarPrototype(window.CodeJarModules.CodeJar);}else if(typeof window.CodeJar==='function'){tmpView.connectCodeJarPrototype(window.CodeJar);}// Wire highlight.js highlighting if the bundle exposes it.
if(window.CodeJarModules&&window.CodeJarModules.hljs){let tmpHljs=window.CodeJarModules.hljs;let tmpLanguage=tmpConfig.Language;tmpView._highlightFunction=function(pElement){pElement.removeAttribute('data-highlighted');delete pElement.dataset.highlighted;pElement.className=pElement.className.replace(/\bhljs\b/g,'').replace(/\blanguage-\S+/g,'').trim();pElement.classList.add('language-'+tmpLanguage);try{tmpHljs.highlightElement(pElement);}catch(pErr){/* swallow — highlighting is best-effort */}};}}try{tmpView.render();}catch(pError){/* pict-section-code logs its own errors */}return tmpView;}const _Demos=[{DemoSchemaVersion:1,Hash:'javascript-editor',Group:'pict',Module:'pict-section-code',Name:'JavaScript editor',Description:'Default pict-section-code configuration — line numbers on, highlight.js for JavaScript, two-space tab.',Spec:{Hash:'javascript-editor',Language:'javascript',LineNumbers:true,Tab:'  ',Code:'// A small example — try editing me.\n'+'function fibonacci(n) {\n'+'  if (n <= 1) return n;\n'+'  return fibonacci(n - 1) + fibonacci(n - 2);\n'+'}\n'+'\n'+'for (let i = 0; i < 10; i++) {\n'+'  console.log(`fib(${i}) =`, fibonacci(i));\n'+'}\n'},Mount:mountCodeEditor,Sources:[{Name:'spec.json',Language:'json',Content:'{\n'+'  "Language": "javascript",\n'+'  "LineNumbers": true,\n'+'  "Tab": "  ",\n'+'  "Code": "function fibonacci(n) { … }"\n'+'}'}]},{DemoSchemaVersion:1,Hash:'json-readonly',Group:'pict',Module:'pict-section-code',Name:'JSON viewer (read-only)',Description:'Read-only mode with line numbers off — useful for embedded "show me the payload" surfaces in dashboards.',Spec:{Hash:'json-readonly',Language:'json',ReadOnly:true,LineNumbers:false,Code:'{\n'+'  "version": "1.0.7",\n'+'  "syntax": {\n'+'    "keyword":  "#A626A4",\n'+'    "string":   "#50A14F",\n'+'    "number":   "#986801",\n'+'    "function": "#4078F2"\n'+'  },\n'+'  "features": ["highlighting", "line-numbers", "readonly", "themed"]\n'+'}\n'},Mount:mountCodeEditor,Sources:[{Name:'spec.json',Language:'json',Content:'{\n'+'  "Language": "json",\n'+'  "ReadOnly": true,\n'+'  "LineNumbers": false\n'+'}'}]},{DemoSchemaVersion:1,Hash:'css-editor',Group:'pict',Module:'pict-section-code',Name:'CSS editor (4-space tab)',Description:'CSS-flavoured highlighting with a 4-space tab and bracket auto-close turned off — leaner editing for stylesheet snippets.',Spec:{Hash:'css-editor',Language:'css',LineNumbers:true,Tab:'    ',AddClosing:false,Code:'/* Theme-aware token usage */\n'+'.docuserve-demo-title {\n'+'    color: var(--theme-color-text-primary, #3D3229);\n'+'    font-size: 1.5em;\n'+'    font-weight: 600;\n'+'}\n'+'\n'+'.docuserve-demo-description {\n'+'    color: var(--theme-color-text-secondary, #5E5549);\n'+'    line-height: 1.55;\n'+'}\n'},Mount:mountCodeEditor,Sources:[{Name:'spec.json',Language:'json',Content:'{\n'+'  "Language": "css",\n'+'  "LineNumbers": true,\n'+'  "Tab": "    ",\n'+'  "AddClosing": false\n'+'}'}]}];/**
 * Register every pict-section-code demo with the host docuserve app.
 *
 * @param {object} pPict - The Pict instance (typically `this.pict` inside
 *                        a DocuserveApplication subclass).
 * @returns {number} count of demos registered (0 if Docuserve-Demos
 *                   provider isn't present — silent no-op).
 */function registerWithDocuserve(pPict){if(!pPict||!pPict.providers||!pPict.providers['Docuserve-Demos']){return 0;}return pPict.providers['Docuserve-Demos'].registerAll(_Demos);}module.exports=_Demos;module.exports.demos=_Demos;module.exports.registerWithDocuserve=registerWithDocuserve;},{"../Pict-Section-Code.js":17}],19:[function(require,module,exports){/**
 * Default Pict-view configuration for PictSection-ConnectionForm.
 *
 * Host applications register the view with their own ContainerSelector
 * and field-id prefix (so multiple connection forms can coexist without
 * DOM-id collisions).  All other defaults live here.
 *
 * The host owns:
 *   - Where in the DOM the form lands (DefaultDestinationAddress / TargetSelector)
 *   - Where in AppData the schemas + active provider live (SchemasAddress / ActiveAddress)
 *   - The DOM-id prefix used to namespace per-field input ids (FieldIDPrefix)
 *   - Whether the provider <select> is visible at all (ShowProviderSelect)
 *   - Whether the "Advanced" <details> block is rendered (ShowAdvancedToggle)
 */'use strict';module.exports={ViewIdentifier:'PictSection-ConnectionForm',DefaultRenderable:'PictSection-ConnectionForm-Main',DefaultDestinationAddress:'#PictSection-ConnectionForm-Slot',AutoRender:false,// Host-overridable knobs
SchemasAddress:'AppData.Connection.Schemas',ActiveAddress:'AppData.Connection.ActiveProvider',FieldIDPrefix:'pict-conn',ShowProviderSelect:true,ShowAdvancedToggle:true};},{}],20:[function(require,module,exports){/**
 * PictSection-ConnectionForm
 *
 * Schema-driven Meadow connection-form view.  Renders a provider
 * <select> + per-provider field block from the form schemas exported
 * by each `meadow-connection-*` module (and aggregated server-side via
 * `meadow-connection-manager#getAllProviderFormSchemas()`).
 *
 * Three host applications consume this:
 *   - retold-data-service / DataCloner     (single active provider, "connect/test" UX)
 *   - retold-databeacon / Connection list  (add/edit named saved connections)
 *   - retold-facto / Store connections     (add/edit named saved connections)
 *
 * Each host wires it with a different DOM destination + AppData
 * address + DOM-id prefix so multiple connection forms can coexist
 * without colliding on element ids.
 *
 * ── Wiring contract ────────────────────────────────────────────────
 * Host AppData (configurable via SchemasAddress / ActiveAddress):
 *   AppData.<...>.Schemas         array of schemas (see field shape)
 *   AppData.<...>.ActiveProvider  string — currently selected Provider
 *
 * Host options on the view (registered via pict.addView):
 *   ContainerSelector    — where to render (overrides DefaultDestinationAddress)
 *   SchemasAddress       — AppData address of the Schemas array
 *   ActiveAddress        — AppData address of the ActiveProvider string
 *   FieldIDPrefix        — DOM-id namespace ('pict-conn' default)
 *   ShowProviderSelect   — whether to render the <select> (false = single-provider mode)
 *   ShowAdvancedToggle   — whether the Advanced group is collapsible
 *   OnProviderChange(p)  — optional callback when the user picks a different provider
 *
 * Host calls (instance methods):
 *   setSchemas(pSchemas)            — replace schema list and re-render
 *   setActiveProvider(pProvider)    — switch active provider
 *   getProviderConfig()             — collect form values → { Provider, Config }
 *   setValues(pProvider, pConfig)   — populate fields from a saved config blob
 *   clear()                         — reset all fields to schema defaults
 *
 * ── Field shape (from each meadow-connection-* schema) ─────────────
 *   Name        — canonical config key (lowercase for SQL drivers, dotted for nested)
 *   Label       — UI label
 *   Type        — String | Number | Password | Boolean | Path | Select
 *   Default     — initial value
 *   Required    — boolean
 *   Placeholder, Help, Min, Max — UI hints
 *   Group       — 'Basic' (default) or 'Advanced' (rendered under <details>)
 *   Multiplier  — form value × multiplier = stored value (sec→ms via 1000)
 *   MapTo       — array of dotted-path targets (one input → multiple keys)
 *   OmitIfFalsy — drop key from emitted config when value is 0/empty/false
 *   Options     — for Select: [{ Value, Label }]
 *
 * Pure presentation — does NOT fetch schemas itself.  Host fetches
 * them however it likes (typical: GET /<app>/connection/schemas
 * backed by MCM) and calls setSchemas() once they arrive.
 */'use strict';const libPictView=require('pict-view');const _DefaultConfiguration=require('./Pict-Section-ConnectionForm-DefaultConfiguration.js');const _BaseCSS=/*css*/`
.pict-conn-form {
	display: flex;
	flex-direction: column;
	gap: 10px;
}
.pict-conn-form__provider-row {
	display: flex;
	gap: 10px;
	align-items: flex-end;
}
.pict-conn-form__provider-row label {
	font-size: 12px;
	font-weight: 600;
	color: #475569;
	text-transform: uppercase;
	letter-spacing: 0.3px;
	display: flex;
	flex-direction: column;
	gap: 4px;
	flex: 0 0 200px;
}
.pict-conn-form__provider-row select {
	font-family: inherit;
	font-size: 14px;
	padding: 7px 10px;
	border: 1px solid #cbd5e1;
	border-radius: 6px;
	background: var(--theme-color-background-panel, #fff);
	color: #0f172a;
	height: 36px;
}
.pict-conn-form__provider-form {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
	gap: 10px 16px;
}
.pict-conn-form__field {
	display: flex;
	flex-direction: column;
	gap: 4px;
}
.pict-conn-form__field label {
	font-size: 12px;
	font-weight: 600;
	color: #475569;
	text-transform: uppercase;
	letter-spacing: 0.3px;
}
.pict-conn-form__field input,
.pict-conn-form__field select {
	font-family: inherit;
	font-size: 14px;
	padding: 7px 10px;
	border: 1px solid #cbd5e1;
	border-radius: 6px;
	background: var(--theme-color-background-panel, #fff);
	color: #0f172a;
}
.pict-conn-form__field input[type="checkbox"] {
	width: auto;
	height: auto;
	align-self: flex-start;
}
.pict-conn-form__field-help {
	font-size: 11px;
	color: #64748b;
}
.pict-conn-form__advanced {
	grid-column: 1 / -1;
	margin-top: 4px;
}
.pict-conn-form__advanced > summary {
	cursor: pointer;
	font-weight: 600;
	color: #475569;
	font-size: 12px;
	text-transform: uppercase;
	letter-spacing: 0.3px;
	padding: 4px 0;
}
.pict-conn-form__advanced > p {
	margin: 8px 0;
	font-size: 12px;
	color: #64748b;
}
.pict-conn-form__advanced > .pict-conn-form__advanced-fields {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
	gap: 10px 16px;
}
.pict-conn-form__no-schemas {
	padding: 12px;
	background: #fef3c7;
	border: 1px solid #f59e0b;
	border-radius: 6px;
	color: #92400e;
	font-size: 13px;
}
`;const _BaseTemplates=[{Hash:'PictSection-ConnectionForm-Main',Template:/*html*/`
<div class="pict-conn-form" id="{~D:AppData.PictSectionConnectionForm.RootId~}">
	{~TS:PictSection-ConnectionForm-Selector:AppData.PictSectionConnectionForm.SelectorSlot~}
	<div class="pict-conn-form__forms" id="{~D:AppData.PictSectionConnectionForm.FormsId~}">
		{~TS:PictSection-ConnectionForm-ProviderForm:AppData.PictSectionConnectionForm.ProviderForms~}
	</div>
	{~TS:PictSection-ConnectionForm-NoSchemas:AppData.PictSectionConnectionForm.NoSchemasSlot~}
</div>`},{Hash:'PictSection-ConnectionForm-Selector',Template:/*html*/`
<div class="pict-conn-form__provider-row">
	<label>Provider
		<select id="{~D:Record.SelectId~}" onchange="{~P~}.views['{~D:Record.ViewHash~}'].onProviderSelectChange(this.value)">
			{~TS:PictSection-ConnectionForm-ProviderOption:Record.Options~}
		</select>
	</label>
</div>`},{Hash:'PictSection-ConnectionForm-ProviderOption',Template:/*html*/`<option value="{~D:Record.Provider~}" {~D:Record.SelectedAttr~}>{~D:Record.DisplayName~}</option>`},{Hash:'PictSection-ConnectionForm-ProviderForm',Template:/*html*/`
<div class="pict-conn-form__provider-form" id="{~D:Record.FormId~}" style="display:{~D:Record.DisplayStyle~}">
	{~TS:PictSection-ConnectionForm-Field:Record.BasicFields~}
	{~TS:PictSection-ConnectionForm-Advanced:Record.AdvancedSlot~}
</div>`},{Hash:'PictSection-ConnectionForm-Field',Template:/*html*/`
<div class="pict-conn-form__field">
	<label for="{~D:Record.DOMId~}">{~D:Record.Label~}</label>
	{~D:Record.InputHTML~}
	{~TS:PictSection-ConnectionForm-FieldHelp:Record.HelpSlot~}
</div>`},{Hash:'PictSection-ConnectionForm-FieldHelp',Template:/*html*/`<small class="pict-conn-form__field-help">{~D:Record.Help~}</small>`},{Hash:'PictSection-ConnectionForm-Advanced',Template:/*html*/`
<details class="pict-conn-form__advanced">
	<summary>Advanced settings</summary>
	<p>Optional tuning — leave blank or zero to use the connection driver's defaults.</p>
	<div class="pict-conn-form__advanced-fields">
		{~TS:PictSection-ConnectionForm-Field:Record.Fields~}
	</div>
</details>`},{Hash:'PictSection-ConnectionForm-NoSchemas',Template:/*html*/`<div class="pict-conn-form__no-schemas">No connection providers detected.  Either <code>meadow-connection-manager</code> is older than 1.1.0 or no provider modules are installed in the host environment.</div>`}];class PictSectionConnectionForm extends libPictView{constructor(pFable,pOptions,pServiceHash){// Merge host-supplied options on top of the module defaults.
// Templates + CSS come from this module; host can override the
// AppData addresses, the DOM destination, and the field-id prefix.
let tmpOptions=Object.assign({},_DefaultConfiguration,pOptions||{});if(!tmpOptions.Templates){tmpOptions.Templates=_BaseTemplates;}if(!tmpOptions.CSS){tmpOptions.CSS=_BaseCSS;}if(!tmpOptions.Renderables){tmpOptions.Renderables=[{RenderableHash:'PictSection-ConnectionForm-Main',TemplateHash:'PictSection-ConnectionForm-Main',ContentDestinationAddress:tmpOptions.ContainerSelector||tmpOptions.DefaultDestinationAddress,RenderMethod:'replace'}];}super(pFable,tmpOptions,pServiceHash);this._Schemas=[];this._ActiveProvider='';}// ====================================================================
//  Public API — hosts call these to drive the view
// ====================================================================
setSchemas(pSchemas){this._Schemas=Array.isArray(pSchemas)?pSchemas:[];// If no active provider yet, default to the first schema.
if(!this._ActiveProvider&&this._Schemas.length>0){this._ActiveProvider=this._Schemas[0].Provider;}this._writeAppData();this.render();}setActiveProvider(pProvider){this._ActiveProvider=pProvider||'';this._writeAppData();this.render();this._invokeProviderChangeCallback();}getActiveProvider(){return this._ActiveProvider;}/**
	 * Read the active provider's form values out of the DOM and
	 * collect them into the canonical wire-format config blob the
	 * provider's connection driver expects.  Honors:
	 *   - Multiplier (form value × multiplier = stored value)
	 *   - MapTo (one input → multiple dotted-path targets)
	 *   - OmitIfFalsy (drop key when value is 0/empty/false)
	 *   - Type-aware reads (Boolean→.checked, Number→parseInt, else trimmed string)
	 *
	 * @returns {{Provider: string, Config: object}}
	 */getProviderConfig(){let tmpProvider=this._ActiveProvider;let tmpSchema=this._Schemas.find(pS=>pS.Provider===tmpProvider);if(!tmpSchema){return{Provider:tmpProvider,Config:{}};}let tmpConfig={};(tmpSchema.Fields||[]).forEach(pField=>this._collectField(tmpProvider,pField,tmpConfig));return{Provider:tmpProvider,Config:tmpConfig};}/**
	 * Populate the form from a saved config blob.  Used by edit
	 * workflows (DataBeacon / Facto) that load a named connection
	 * record and want its values pre-filled.
	 *
	 * @param {string} pProvider
	 * @param {object} pConfig — wire-format config (same shape getProviderConfig returns)
	 */setValues(pProvider,pConfig){this._ActiveProvider=pProvider||'';this._writeAppData();this.render();let tmpSchema=this._Schemas.find(pS=>pS.Provider===pProvider);if(!tmpSchema||typeof document==='undefined'){return;}(tmpSchema.Fields||[]).forEach(pField=>{let tmpDOMId=this.fieldDOMId(pProvider,pField.Name);let tmpEl=document.getElementById(tmpDOMId);if(!tmpEl){return;}let tmpVal=this._readNested(pConfig||{},pField.MapTo&&pField.MapTo[0]?pField.MapTo[0]:pField.Name);// Reverse-apply Multiplier (storage unit → display unit).
if(pField.Multiplier&&typeof tmpVal==='number'){tmpVal=Math.floor(tmpVal/pField.Multiplier);}if(pField.Type==='Boolean'){tmpEl.checked=!!tmpVal;}else if(tmpVal===undefined||tmpVal===null){/* leave default */}else{tmpEl.value=String(tmpVal);}});}clear(){this._ActiveProvider=this._Schemas.length>0?this._Schemas[0].Provider:'';this._writeAppData();this.render();}// ====================================================================
//  DOM-id helper — host code can use this to find a specific input
// ====================================================================
fieldDOMId(pProvider,pFieldName){let tmpPrefix=this.options.FieldIDPrefix||'pict-conn';let tmpProvider=String(pProvider||'').toLowerCase();let tmpField=String(pFieldName||'').replace(/\./g,'_');return`${tmpPrefix}-${tmpProvider}-${tmpField}`;}// ====================================================================
//  Lifecycle hooks
// ====================================================================
onBeforeRender(pRenderable){this._writeAppData();return super.onBeforeRender(pRenderable);}onAfterRender(pRenderable,pAddress,pRecord,pContent){// Toggle visibility on the active provider's form (the templates
// pre-render a wrapper for every schema so values persist when
// the user switches between providers).
if(typeof document!=='undefined'){this._Schemas.forEach(pSchema=>{let tmpEl=document.getElementById(this._formId(pSchema.Provider));if(tmpEl){tmpEl.style.display=pSchema.Provider===this._ActiveProvider?'':'none';}});}this.pict.CSSMap.injectCSS();return super.onAfterRender(pRenderable,pAddress,pRecord,pContent);}// ====================================================================
//  Selector-change handler (called from the rendered <select>)
// ====================================================================
onProviderSelectChange(pProvider){this.setActiveProvider(pProvider);}// ====================================================================
//  Internals
// ====================================================================
/**
	 * Push the computed render records into AppData under the address
	 * the templates read from.  Templates always read from
	 * `AppData.PictSectionConnectionForm.*` regardless of where the
	 * host's "real" Schemas / ActiveProvider live; that's because Pict
	 * template addresses are static strings and we want one set of
	 * templates to work for many host configurations.  The real
	 * SchemasAddress / ActiveAddress are also written so hosts can
	 * read them out for their own state-tracking.
	 */_writeAppData(){if(!this.pict.AppData){this.pict.AppData={};}let tmpRoot=this.pict.AppData.PictSectionConnectionForm=this.pict.AppData.PictSectionConnectionForm||{};let tmpPrefix=this.options.FieldIDPrefix||'pict-conn';tmpRoot.RootId=`${tmpPrefix}-root`;tmpRoot.FormsId=`${tmpPrefix}-forms`;// Selector slot — empty array hides the <select>, single-element
// renders it once.  Honors ShowProviderSelect.
if(this.options.ShowProviderSelect&&this._Schemas.length>0){tmpRoot.SelectorSlot=[{SelectId:`${tmpPrefix}-provider-select`,ViewHash:this.Hash,Options:this._Schemas.map(pS=>({Provider:pS.Provider,DisplayName:this._escape(pS.DisplayName||pS.Provider),SelectedAttr:pS.Provider===this._ActiveProvider?'selected':''}))}];}else{tmpRoot.SelectorSlot=[];}tmpRoot.ProviderForms=this._Schemas.map(pSchema=>this._buildProviderForm(pSchema,pSchema.Provider===this._ActiveProvider));tmpRoot.NoSchemasSlot=this._Schemas.length===0?[{}]:[];// Mirror state into the host's configured AppData addresses (so
// hosts that read AppData directly see live values).
if(this.options.SchemasAddress){this._writeAppDataAddress(this.options.SchemasAddress,this._Schemas);}if(this.options.ActiveAddress){this._writeAppDataAddress(this.options.ActiveAddress,this._ActiveProvider);}}_buildProviderForm(pSchema,pIsActive){let tmpFields=pSchema.Fields||[];let tmpBasic=[];let tmpAdvanced=[];tmpFields.forEach(pField=>{let tmpRecord=this._buildFieldRecord(pField,pSchema.Provider);if(pField.Group==='Advanced'){tmpAdvanced.push(tmpRecord);}else{tmpBasic.push(tmpRecord);}});return{Provider:pSchema.Provider,FormId:this._formId(pSchema.Provider),DisplayStyle:pIsActive?'':'none',BasicFields:tmpBasic,AdvancedSlot:this.options.ShowAdvancedToggle&&tmpAdvanced.length>0?[{Fields:tmpAdvanced}]:[]};}_buildFieldRecord(pField,pProvider){let tmpDOMId=this.fieldDOMId(pProvider,pField.Name);return{DOMId:tmpDOMId,Label:this._escape(pField.Label||pField.Name),InputHTML:this._buildInputHTML(pField,tmpDOMId),HelpSlot:pField.Help?[{Help:this._escape(pField.Help)}]:[]};}_buildInputHTML(pField,pDOMId){let tmpDefault=pField.Default!==undefined&&pField.Default!==null?String(pField.Default):'';let tmpPlaceholder=pField.Placeholder?this._escape(pField.Placeholder):'';let tmpRequired=pField.Required?' required':'';switch(pField.Type){case'Number':{let tmpMin=pField.Min!==undefined&&pField.Min!==null?` min="${this._escape(String(pField.Min))}"`:'';let tmpMax=pField.Max!==undefined&&pField.Max!==null?` max="${this._escape(String(pField.Max))}"`:'';return`<input type="number" id="${this._escape(pDOMId)}" value="${this._escape(tmpDefault)}" placeholder="${tmpPlaceholder}"${tmpMin}${tmpMax}${tmpRequired}>`;}case'Password':return`<input type="password" id="${this._escape(pDOMId)}" placeholder="${tmpPlaceholder||'(optional)'}"${tmpRequired}>`;case'Boolean':{let tmpChecked=pField.Default?' checked':'';return`<input type="checkbox" id="${this._escape(pDOMId)}"${tmpChecked}>`;}case'Select':{let tmpOptions=(pField.Options||[]).map(pOpt=>{let tmpVal=String(pOpt.Value);let tmpSel=tmpVal===tmpDefault?' selected':'';return`<option value="${this._escape(tmpVal)}"${tmpSel}>${this._escape(pOpt.Label||tmpVal)}</option>`;}).join('');return`<select id="${this._escape(pDOMId)}"${tmpRequired}>${tmpOptions}</select>`;}case'Path':case'String':default:return`<input type="text" id="${this._escape(pDOMId)}" value="${this._escape(tmpDefault)}" placeholder="${tmpPlaceholder}"${tmpRequired}>`;}}_collectField(pProvider,pField,pConfigOut){if(typeof document==='undefined'){return;}let tmpDOMId=this.fieldDOMId(pProvider,pField.Name);let tmpEl=document.getElementById(tmpDOMId);if(!tmpEl){return;}let tmpRaw;if(pField.Type==='Boolean'){tmpRaw=!!tmpEl.checked;}else if(pField.Type==='Number'){let tmpParsed=parseInt(tmpEl.value,10);tmpRaw=isNaN(tmpParsed)?0:tmpParsed;}else{tmpRaw=String(tmpEl.value||'').trim();}let tmpFinal=tmpRaw;if(pField.Multiplier&&typeof tmpFinal==='number'){tmpFinal=tmpFinal*pField.Multiplier;}if(pField.OmitIfFalsy&&!tmpFinal){return;}let tmpTargets=pField.MapTo&&pField.MapTo.length?pField.MapTo:[pField.Name];tmpTargets.forEach(pPath=>this._setNested(pConfigOut,pPath,tmpFinal));}_setNested(pTarget,pPath,pValue){let tmpParts=String(pPath).split('.');let tmpCursor=pTarget;for(let i=0;i<tmpParts.length-1;i++){let tmpKey=tmpParts[i];if(typeof tmpCursor[tmpKey]!=='object'||tmpCursor[tmpKey]===null){tmpCursor[tmpKey]={};}tmpCursor=tmpCursor[tmpKey];}tmpCursor[tmpParts[tmpParts.length-1]]=pValue;}_readNested(pSource,pPath){let tmpParts=String(pPath).split('.');let tmpCursor=pSource;for(let i=0;i<tmpParts.length;i++){if(tmpCursor===undefined||tmpCursor===null){return undefined;}tmpCursor=tmpCursor[tmpParts[i]];}return tmpCursor;}_writeAppDataAddress(pAddress,pValue){// Address is "AppData.X.Y" — drop the leading "AppData." prefix
// before walking; if it's missing, fall through and treat the
// whole string as a property chain off pict.AppData.
let tmpRoot=this.pict.AppData;let tmpAddr=String(pAddress||'');if(tmpAddr.indexOf('AppData.')===0){tmpAddr=tmpAddr.substring('AppData.'.length);}if(!tmpAddr){return;}let tmpParts=tmpAddr.split('.');let tmpCursor=tmpRoot;for(let i=0;i<tmpParts.length-1;i++){let tmpKey=tmpParts[i];if(typeof tmpCursor[tmpKey]!=='object'||tmpCursor[tmpKey]===null){tmpCursor[tmpKey]={};}tmpCursor=tmpCursor[tmpKey];}tmpCursor[tmpParts[tmpParts.length-1]]=pValue;}_invokeProviderChangeCallback(){let tmpCb=this.options.OnProviderChange;if(typeof tmpCb==='function'){try{tmpCb(this._ActiveProvider);}catch(pError){if(this.log&&this.log.warn){this.log.warn(`PictSection-ConnectionForm: OnProviderChange callback threw: ${pError&&pError.message}`);}}}}_formId(pProvider){let tmpPrefix=this.options.FieldIDPrefix||'pict-conn';return`${tmpPrefix}-form-${String(pProvider||'').toLowerCase()}`;}_escape(pStr){return String(pStr==null?'':pStr).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}}module.exports=PictSectionConnectionForm;module.exports.default_configuration=_DefaultConfiguration;},{"./Pict-Section-ConnectionForm-DefaultConfiguration.js":19,"pict-view":94}],21:[function(require,module,exports){module.exports={"RenderOnLoad":true,"DefaultRenderable":"Login-Container","DefaultDestinationAddress":"#Pict-Login-Container","TargetElementAddress":"#Pict-Login-Container",// ----- Endpoint Configuration -----
// Defaults match orator-authentication routes.
// Override these to point at any custom backend.
"LoginEndpoint":"/1.0/Authenticate",// "POST" sends JSON body { UserName, Password }.
// "GET"  appends /:username/:password to LoginEndpoint.
"LoginMethod":"POST","LogoutEndpoint":"/1.0/Deauthenticate","CheckSessionEndpoint":"/1.0/CheckSession","OAuthProvidersEndpoint":"/1.0/OAuth/Providers","OAuthBeginEndpoint":"/1.0/OAuth/Begin",// ----- Behavior -----
"CheckSessionOnLoad":true,"ShowOAuthProviders":false,// ----- Data Address -----
// Where session state is stored in the Pict address space.
"SessionDataAddress":"AppData.Session",// ----- Templates -----
"Templates":[{"Hash":"Pict-Login-Template-Wrapper","Template":"<div class=\"pict-login-card\"><div id=\"pict-login-error\" class=\"pict-login-error\" style=\"display:none\"></div><div id=\"pict-login-form-area\"></div><div id=\"pict-login-oauth-area\"></div><div id=\"pict-login-status-area\" style=\"display:none\"></div></div>"},{"Hash":"Pict-Login-Template-Form","Template":"<form id=\"pict-login-form\" class=\"pict-login-form\"><label class=\"pict-login-label\" for=\"pict-login-username\">Username</label><input class=\"pict-login-input\" type=\"text\" id=\"pict-login-username\" name=\"username\" autocomplete=\"username\" placeholder=\"Enter username\" /><label class=\"pict-login-label\" for=\"pict-login-password\">Password</label><input class=\"pict-login-input\" type=\"password\" id=\"pict-login-password\" name=\"password\" autocomplete=\"current-password\" placeholder=\"Enter password\" /><button class=\"pict-login-submit\" type=\"submit\">Log In</button></form>"},{"Hash":"Pict-Login-Template-Status","Template":"<div class=\"pict-login-status\"><span class=\"pict-login-dot pict-login-dot--on\"></span><span class=\"pict-login-user-label\">Logged in as <strong id=\"pict-login-display-name\"></strong></span><span class=\"pict-login-user-id\" id=\"pict-login-display-id\"></span><button class=\"pict-login-logout-btn\" id=\"pict-login-logout\" type=\"button\">Log out</button></div>"},{"Hash":"Pict-Login-Template-OAuthProviders","Template":"<div class=\"pict-login-oauth\"><div class=\"pict-login-oauth-divider\"><span>or sign in with</span></div><div class=\"pict-login-oauth-buttons\" id=\"pict-login-oauth-buttons\"></div></div>"},{"Hash":"Pict-Login-Template-Error","Template":"<div class=\"pict-login-error-message\">{~D:Record.Message~}</div>"}],// ----- Renderables -----
"Renderables":[{"RenderableHash":"Login-Container","TemplateHash":"Pict-Login-Template-Wrapper","DestinationAddress":"#Pict-Login-Container"}],// ----- CSS -----
"CSS":`.pict-login-card
{
	max-width: 400px;
	margin: 2rem auto;
	background: var(--theme-color-background-panel, #fff);
	border: 1px solid var(--theme-color-border-default, #D4A373);
	border-top: 4px solid var(--theme-color-brand-primary, #E76F51);
	border-radius: 6px;
	padding: 1.5rem;
	box-shadow: 0 2px 8px rgba(38,70,83,0.08);
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
	color: var(--theme-color-text-primary, #264653);
}

/* ----- Form ----- */
.pict-login-form
{
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}
.pict-login-label
{
	font-weight: 600;
	font-size: 0.85rem;
	color: var(--theme-color-text-primary, #264653);
}
.pict-login-input
{
	border: 1px solid var(--theme-color-border-light, #D4C4A8);
	background: var(--theme-color-background-secondary, #FFFCF7);
	padding: 0.55rem 0.7rem;
	border-radius: 4px;
	font-size: 0.9rem;
	color: var(--theme-color-text-primary, #264653);
	width: 100%;
	box-sizing: border-box;
}
.pict-login-input:focus
{
	outline: none;
	border-color: var(--theme-color-brand-primary, #E76F51);
	box-shadow: 0 0 0 2px rgba(231,111,81,0.15);
}
.pict-login-submit
{
	background: var(--theme-color-brand-primary, #E76F51);
	color: var(--theme-color-text-on-brand, #fff);
	border: none;
	padding: 0.6rem 1.25rem;
	border-radius: 4px;
	font-size: 0.9rem;
	font-weight: 600;
	cursor: pointer;
	margin-top: 0.25rem;
}
.pict-login-submit:hover
{
	background: var(--theme-color-brand-primary-hover, #C45A3E);
}
.pict-login-submit:disabled
{
	opacity: 0.6;
	cursor: not-allowed;
}

/* ----- Error ----- */
.pict-login-error
{
	background: var(--theme-color-background-tertiary, #FDECEA);
	border: 1px solid var(--theme-color-brand-primary, #E76F51);
	color: var(--theme-color-status-error, #8B2500);
	border-radius: 4px;
	padding: 0.6rem 0.8rem;
	font-size: 0.85rem;
	margin-bottom: 0.75rem;
}

/* ----- Logged-In Status ----- */
.pict-login-status
{
	display: flex;
	align-items: center;
	gap: 0.5rem;
	flex-wrap: wrap;
}
.pict-login-dot
{
	width: 10px;
	height: 10px;
	border-radius: 50%;
	flex-shrink: 0;
}
.pict-login-dot--on
{
	background: var(--theme-color-status-success, #2A9D8F);
	box-shadow: 0 0 4px rgba(42,157,143,0.5);
}
.pict-login-dot--off
{
	background: var(--theme-color-text-muted, #999);
}
.pict-login-user-label
{
	font-size: 0.9rem;
}
.pict-login-user-id
{
	background: var(--theme-color-text-primary, #264653);
	color: var(--theme-color-text-on-brand, #FAEDCD);
	font-size: 0.7rem;
	font-weight: 700;
	padding: 0.15rem 0.5rem;
	border-radius: 9999px;
}
.pict-login-logout-btn
{
	margin-left: auto;
	background: var(--theme-color-text-primary, #264653);
	color: var(--theme-color-text-on-brand, #FAEDCD);
	border: none;
	padding: 0.4rem 1rem;
	border-radius: 4px;
	font-size: 0.8rem;
	font-weight: 600;
	cursor: pointer;
}
.pict-login-logout-btn:hover
{
	background: var(--theme-color-text-primary, #1A3340);
}

/* ----- OAuth ----- */
.pict-login-oauth
{
	margin-top: 1rem;
}
.pict-login-oauth-divider
{
	display: flex;
	align-items: center;
	gap: 0.75rem;
	margin-bottom: 0.75rem;
	color: var(--theme-color-text-muted, #999);
	font-size: 0.8rem;
}
.pict-login-oauth-divider::before,
.pict-login-oauth-divider::after
{
	content: '';
	flex: 1;
	height: 1px;
	background: var(--theme-color-border-light, #D4C4A8);
}
.pict-login-oauth-buttons
{
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}
.pict-login-oauth-btn
{
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	padding: 0.55rem 1rem;
	border-radius: 4px;
	font-size: 0.85rem;
	font-weight: 600;
	cursor: pointer;
	text-decoration: none;
	border: 1px solid var(--theme-color-border-light, #D4C4A8);
	background: var(--theme-color-background-panel, #fff);
	color: var(--theme-color-text-primary, #264653);
}
.pict-login-oauth-btn:hover
{
	background: var(--theme-color-background-secondary, #F5F0E8);
}
.pict-login-oauth-btn--google
{
	border-color: #4285F4;
	color: #4285F4;
}
.pict-login-oauth-btn--google:hover
{
	background: #EBF2FE;
}
.pict-login-oauth-btn--microsoft
{
	border-color: #00A4EF;
	color: #00A4EF;
}
.pict-login-oauth-btn--microsoft:hover
{
	background: #E6F6FE;
}
`};},{}],22:[function(require,module,exports){const libPictViewClass=require('pict-view');const _DefaultConfiguration=require('./Pict-Section-Login-DefaultConfiguration.js');class PictSectionLogin extends libPictViewClass{constructor(pFable,pOptions,pServiceHash){let tmpOptions=Object.assign({},_DefaultConfiguration,pOptions);super(pFable,tmpOptions,pServiceHash);// --- State ---
this.authenticated=false;this.sessionData=null;this.oauthProviders=[];this.initialRenderComplete=false;}// ===== Lifecycle Hooks =====
onBeforeInitialize(){return super.onBeforeInitialize();}onAfterRender(pRenderable){// Inject all registered CSS into the DOM
this.pict.CSSMap.injectCSS();if(!this.initialRenderComplete){this.onAfterInitialRender();this.initialRenderComplete=true;}return super.onAfterRender(pRenderable);}onAfterInitialRender(){// Populate the form (or status) into the wrapper placeholders
this._updateView();if(this.options.CheckSessionOnLoad){this.checkSession();}if(this.options.ShowOAuthProviders){this.loadOAuthProviders();}}// ===== Public API =====
/**
	 * Authenticate with username and password.
	 *
	 * @param {string} pUsername - The username / login ID
	 * @param {string} pPassword - The password
	 * @param {function} [fCallback] - Optional callback(pError, pSessionData)
	 */login(pUsername,pPassword,fCallback){if(typeof fCallback!=='function'){fCallback=()=>{};}this._clearError();let tmpFetchOptions={};let tmpURL=this.options.LoginEndpoint;if(this.options.LoginMethod==='GET'){tmpURL=tmpURL+'/'+encodeURIComponent(pUsername)+'/'+encodeURIComponent(pPassword);tmpFetchOptions.method='GET';}else{tmpFetchOptions.method='POST';tmpFetchOptions.headers={'Content-Type':'application/json'};tmpFetchOptions.body=JSON.stringify({UserName:pUsername,Password:pPassword});}fetch(tmpURL,tmpFetchOptions).then(pResponse=>{return pResponse.json();}).then(pData=>{if(pData&&pData.LoggedIn){this.authenticated=true;this.sessionData=pData;this._storeSessionData(pData);this._updateView();this.onLoginSuccess(pData);this._solveApp();return fCallback(null,pData);}else{let tmpError=pData&&pData.Error?pData.Error:'Authentication failed.';this._displayError(tmpError);this.onLoginFailed(tmpError);return fCallback(tmpError);}}).catch(pError=>{let tmpMessage='Login request failed.';this.log.error('PictSectionLogin login error: '+pError.message);this._displayError(tmpMessage);this.onLoginFailed(tmpMessage);return fCallback(tmpMessage);});}/**
	 * End the current session.
	 *
	 * @param {function} [fCallback] - Optional callback(pError)
	 */logout(fCallback){if(typeof fCallback!=='function'){fCallback=()=>{};}fetch(this.options.LogoutEndpoint).then(pResponse=>{return pResponse.json();}).then(()=>{this.authenticated=false;this.sessionData=null;this._storeSessionData(null);this._updateView();this.onLogout();this._solveApp();return fCallback(null);}).catch(pError=>{this.log.error('PictSectionLogin logout error: '+pError.message);// Clear local state even if network failed
this.authenticated=false;this.sessionData=null;this._storeSessionData(null);this._updateView();this.onLogout();this._solveApp();return fCallback(pError.message);});}/**
	 * Check whether an existing session is active (e.g. from a cookie).
	 *
	 * @param {function} [fCallback] - Optional callback(pError, pSessionData)
	 */checkSession(fCallback){if(typeof fCallback!=='function'){fCallback=()=>{};}fetch(this.options.CheckSessionEndpoint).then(pResponse=>{return pResponse.json();}).then(pData=>{if(pData&&pData.LoggedIn){this.authenticated=true;this.sessionData=pData;this._storeSessionData(pData);this._updateView();}this.onSessionChecked(pData);this._solveApp();return fCallback(null,pData);}).catch(pError=>{this.log.error('PictSectionLogin checkSession error: '+pError.message);this.onSessionChecked(null);return fCallback(pError.message);});}/**
	 * Fetch available OAuth providers and render buttons.
	 *
	 * @param {function} [fCallback] - Optional callback(pError, pProviders)
	 */loadOAuthProviders(fCallback){if(typeof fCallback!=='function'){fCallback=()=>{};}fetch(this.options.OAuthProvidersEndpoint).then(pResponse=>{return pResponse.json();}).then(pData=>{if(pData&&Array.isArray(pData.Providers)){this.oauthProviders=pData.Providers;this._renderOAuthButtons();}return fCallback(null,this.oauthProviders);}).catch(pError=>{this.log.warn('PictSectionLogin loadOAuthProviders: '+pError.message);return fCallback(pError.message);});}// ===== Overridable Hooks =====
// Developers override these for custom post-login/logout behavior.
/**
	 * Called after a successful login.
	 * @param {object} pSessionData - The session data from the server
	 */onLoginSuccess(pSessionData){// Override in subclass or instance
}/**
	 * Called after a failed login attempt.
	 * @param {string} pError - The error message
	 */onLoginFailed(pError){// Override in subclass or instance
}/**
	 * Called after a successful logout.
	 */onLogout(){// Override in subclass or instance
}/**
	 * Called after a session check completes.
	 * @param {object|null} pSessionData - The session data, or null on error
	 */onSessionChecked(pSessionData){// Override in subclass or instance
}// ===== Internal Helpers =====
/**
	 * Wire up DOM event handlers on the login form and logout button.
	 */_wireFormEvents(){let tmpFormElements=this.services.ContentAssignment.getElement('#pict-login-form');if(tmpFormElements&&tmpFormElements.length>0){let tmpForm=tmpFormElements[0];tmpForm.addEventListener('submit',pEvent=>{pEvent.preventDefault();let tmpUsernameInput=tmpForm.querySelector('#pict-login-username');let tmpPasswordInput=tmpForm.querySelector('#pict-login-password');let tmpUsername=tmpUsernameInput?tmpUsernameInput.value:'';let tmpPassword=tmpPasswordInput?tmpPasswordInput.value:'';if(!tmpUsername){this._displayError('Please enter a username.');return;}this.login(tmpUsername,tmpPassword);});}let tmpLogoutElements=this.services.ContentAssignment.getElement('#pict-login-logout');if(tmpLogoutElements&&tmpLogoutElements.length>0){tmpLogoutElements[0].addEventListener('click',()=>{this.logout();});}}/**
	 * Show an error message in the error area.
	 * @param {string} pMessage - The error text
	 */_displayError(pMessage){let tmpErrorElements=this.services.ContentAssignment.getElement('#pict-login-error');if(tmpErrorElements&&tmpErrorElements.length>0){let tmpErrorEl=tmpErrorElements[0];tmpErrorEl.textContent=pMessage;tmpErrorEl.style.display='block';}}/**
	 * Hide the error area.
	 */_clearError(){let tmpErrorElements=this.services.ContentAssignment.getElement('#pict-login-error');if(tmpErrorElements&&tmpErrorElements.length>0){let tmpErrorEl=tmpErrorElements[0];tmpErrorEl.textContent='';tmpErrorEl.style.display='none';}}/**
	 * Re-render the view to reflect current authentication state.
	 * Shows the login form when unauthenticated, or the status bar when authenticated.
	 */_updateView(){let tmpFormAreaElements=this.services.ContentAssignment.getElement('#pict-login-form-area');let tmpStatusAreaElements=this.services.ContentAssignment.getElement('#pict-login-status-area');let tmpOAuthAreaElements=this.services.ContentAssignment.getElement('#pict-login-oauth-area');if(this.authenticated&&this.sessionData){// --- Authenticated: show status, hide form ---
if(tmpFormAreaElements&&tmpFormAreaElements.length>0){tmpFormAreaElements[0].style.display='none';}if(tmpOAuthAreaElements&&tmpOAuthAreaElements.length>0){tmpOAuthAreaElements[0].style.display='none';}if(tmpStatusAreaElements&&tmpStatusAreaElements.length>0){let tmpStatusArea=tmpStatusAreaElements[0];tmpStatusArea.style.display='block';// Render the status template
let tmpStatusHTML=this.pict.parseTemplateByHash('Pict-Login-Template-Status',{});tmpStatusArea.innerHTML=tmpStatusHTML;// Populate display values
let tmpDisplayName='';let tmpDisplayID='';if(this.sessionData.UserRecord){tmpDisplayName=this.sessionData.UserRecord.FullName||this.sessionData.UserRecord.LoginID||this.sessionData.UserRecord.Email||'';tmpDisplayID=this.sessionData.UserRecord.IDUser||this.sessionData.UserID||'';}else if(this.sessionData.UserID){tmpDisplayID=this.sessionData.UserID;}let tmpNameElements=tmpStatusArea.querySelectorAll('#pict-login-display-name');if(tmpNameElements.length>0){tmpNameElements[0].textContent=tmpDisplayName;}let tmpIDElements=tmpStatusArea.querySelectorAll('#pict-login-display-id');if(tmpIDElements.length>0){if(tmpDisplayID){tmpIDElements[0].textContent='ID '+tmpDisplayID;}else{tmpIDElements[0].style.display='none';}}// Wire logout button
let tmpLogoutBtn=tmpStatusArea.querySelector('#pict-login-logout');if(tmpLogoutBtn){tmpLogoutBtn.addEventListener('click',()=>{this.logout();});}}this._clearError();}else{// --- Unauthenticated: show form, hide status ---
if(tmpStatusAreaElements&&tmpStatusAreaElements.length>0){tmpStatusAreaElements[0].style.display='none';tmpStatusAreaElements[0].innerHTML='';}if(tmpFormAreaElements&&tmpFormAreaElements.length>0){let tmpFormArea=tmpFormAreaElements[0];tmpFormArea.style.display='block';// Re-render form if empty
if(!tmpFormArea.querySelector('#pict-login-form')){let tmpFormHTML=this.pict.parseTemplateByHash('Pict-Login-Template-Form',{});tmpFormArea.innerHTML=tmpFormHTML;this._wireFormEvents();}}if(tmpOAuthAreaElements&&tmpOAuthAreaElements.length>0){if(this.options.ShowOAuthProviders&&this.oauthProviders.length>0){tmpOAuthAreaElements[0].style.display='block';}else{tmpOAuthAreaElements[0].style.display='none';}}}}/**
	 * Render OAuth provider buttons into the OAuth area.
	 */_renderOAuthButtons(){let tmpOAuthAreaElements=this.services.ContentAssignment.getElement('#pict-login-oauth-area');if(!tmpOAuthAreaElements||tmpOAuthAreaElements.length<1){return;}if(!this.oauthProviders||this.oauthProviders.length<1){tmpOAuthAreaElements[0].style.display='none';return;}// Render the OAuth container template
let tmpOAuthHTML=this.pict.parseTemplateByHash('Pict-Login-Template-OAuthProviders',{});tmpOAuthAreaElements[0].innerHTML=tmpOAuthHTML;tmpOAuthAreaElements[0].style.display='block';// Build individual provider buttons
let tmpButtonContainer=tmpOAuthAreaElements[0].querySelector('#pict-login-oauth-buttons');if(!tmpButtonContainer){return;}let tmpButtonsHTML='';for(let i=0;i<this.oauthProviders.length;i++){let tmpProvider=this.oauthProviders[i];let tmpName=tmpProvider.Name||'provider';let tmpBeginURL=tmpProvider.BeginURL||this.options.OAuthBeginEndpoint+'/'+tmpName;let tmpDisplayName=tmpName.charAt(0).toUpperCase()+tmpName.slice(1);let tmpCSSModifier=tmpName.toLowerCase();tmpButtonsHTML+='<a class="pict-login-oauth-btn pict-login-oauth-btn--'+tmpCSSModifier+'" href="'+tmpBeginURL+'">Sign in with '+tmpDisplayName+'</a>';}tmpButtonContainer.innerHTML=tmpButtonsHTML;}/**
	 * Store session data at the configured Pict address.
	 * @param {object|null} pData - Session data to store
	 */_storeSessionData(pData){if(this.options.SessionDataAddress){let tmpAddressSpace={Fable:this.fable,Pict:this.fable,AppData:this.pict.AppData,Bundle:this.pict.Bundle};this.fable.manifest.setValueByHash(tmpAddressSpace,this.options.SessionDataAddress,pData);}}/**
	 * Trigger a solve on the PictApplication if one exists.
	 */_solveApp(){if(this.pict&&this.pict.PictApplication&&typeof this.pict.PictApplication.solve==='function'){this.pict.PictApplication.solve();}}}module.exports=PictSectionLogin;module.exports.default_configuration=_DefaultConfiguration;},{"./Pict-Section-Login-DefaultConfiguration.js":21,"pict-view":94}],23:[function(require,module,exports){/**
 * Pict-Modal-Confirm
 *
 * Builds confirm and double-confirm dialog DOM, returns Promises.
 */class PictModalConfirm{constructor(pModal){this._modal=pModal;}/**
	 * Show a single-step confirmation dialog.
	 *
	 * @param {string} pMessage - The confirmation message
	 * @param {object} [pOptions] - Options (title, confirmLabel, cancelLabel, dangerous)
	 * @returns {Promise<boolean>}
	 */confirm(pMessage,pOptions){let tmpOptions=Object.assign({},this._modal.options.DefaultConfirmOptions,pOptions);return new Promise(fResolve=>{let tmpDialog=this._buildDialog(tmpOptions.title,pMessage,fResolve,tmpOptions);this._showDialog(tmpDialog,fResolve);});}/**
	 * Show a two-step confirmation dialog.
	 *
	 * If confirmPhrase is provided, user must type it to enable the confirm button.
	 * Otherwise, first click changes button text, second click confirms.
	 *
	 * @param {string} pMessage - The confirmation message
	 * @param {object} [pOptions] - Options (title, confirmPhrase, phrasePrompt, confirmLabel, cancelLabel)
	 * @returns {Promise<boolean>}
	 */doubleConfirm(pMessage,pOptions){let tmpOptions=Object.assign({},this._modal.options.DefaultDoubleConfirmOptions,pOptions);return new Promise(fResolve=>{let tmpDialog=this._buildDoubleConfirmDialog(tmpOptions.title,pMessage,fResolve,tmpOptions);this._showDialog(tmpDialog,fResolve);});}/**
	 * Build a standard confirm dialog element.
	 *
	 * @param {string} pTitle
	 * @param {string} pMessage
	 * @param {function} fResolve - Promise resolver
	 * @param {object} pOptions
	 * @returns {HTMLElement}
	 */_buildDialog(pTitle,pMessage,fResolve,pOptions){let tmpId=this._modal._nextId();let tmpBtnStyle=pOptions.dangerous?'danger':'primary';let tmpDialog=document.createElement('div');tmpDialog.className='pict-modal-dialog';if(pOptions.unbounded){tmpDialog.className+=' pict-modal-dialog--unbounded';}tmpDialog.id='pict-modal-'+tmpId;tmpDialog.setAttribute('role','dialog');tmpDialog.setAttribute('aria-modal','true');tmpDialog.style.width='420px';tmpDialog.innerHTML='<div class="pict-modal-dialog-header">'+'<span class="pict-modal-dialog-title">'+this._escapeHTML(pTitle)+'</span>'+'<button class="pict-modal-dialog-close" aria-label="Close">&times;</button>'+'</div>'+'<div class="pict-modal-dialog-body">'+'<p>'+this._escapeHTML(pMessage)+'</p>'+'</div>'+'<div class="pict-modal-dialog-footer">'+'<button class="pict-modal-btn" data-action="cancel">'+this._escapeHTML(pOptions.cancelLabel)+'</button>'+'<button class="pict-modal-btn pict-modal-btn--'+tmpBtnStyle+'" data-action="confirm">'+this._escapeHTML(pOptions.confirmLabel)+'</button>'+'</div>';let tmpCloseBtn=tmpDialog.querySelector('.pict-modal-dialog-close');let tmpCancelBtn=tmpDialog.querySelector('[data-action="cancel"]');let tmpConfirmBtn=tmpDialog.querySelector('[data-action="confirm"]');let tmpDismiss=pResult=>{this._dismissDialog(tmpDialog,pResult,fResolve);};tmpCloseBtn.addEventListener('click',()=>{tmpDismiss(false);});tmpCancelBtn.addEventListener('click',()=>{tmpDismiss(false);});tmpConfirmBtn.addEventListener('click',()=>{tmpDismiss(true);});tmpDialog._dismiss=tmpDismiss;tmpDialog._focusTarget=tmpCancelBtn;return tmpDialog;}/**
	 * Build a double-confirm dialog element.
	 *
	 * @param {string} pTitle
	 * @param {string} pMessage
	 * @param {function} fResolve - Promise resolver
	 * @param {object} pOptions
	 * @returns {HTMLElement}
	 */_buildDoubleConfirmDialog(pTitle,pMessage,fResolve,pOptions){let tmpId=this._modal._nextId();let tmpHasPhrase=typeof pOptions.confirmPhrase==='string'&&pOptions.confirmPhrase.length>0;let tmpDialog=document.createElement('div');tmpDialog.className='pict-modal-dialog';if(pOptions.unbounded){tmpDialog.className+=' pict-modal-dialog--unbounded';}tmpDialog.id='pict-modal-'+tmpId;tmpDialog.setAttribute('role','dialog');tmpDialog.setAttribute('aria-modal','true');tmpDialog.style.width='420px';let tmpBodyContent='<p>'+this._escapeHTML(pMessage)+'</p>';if(tmpHasPhrase){let tmpPromptText=pOptions.phrasePrompt.replace('{phrase}',pOptions.confirmPhrase);tmpBodyContent+='<div class="pict-modal-confirm-prompt">'+this._escapeHTML(tmpPromptText)+'</div>'+'<input type="text" class="pict-modal-confirm-input" autocomplete="off" spellcheck="false" />';}tmpDialog.innerHTML='<div class="pict-modal-dialog-header">'+'<span class="pict-modal-dialog-title">'+this._escapeHTML(pTitle)+'</span>'+'<button class="pict-modal-dialog-close" aria-label="Close">&times;</button>'+'</div>'+'<div class="pict-modal-dialog-body">'+tmpBodyContent+'</div>'+'<div class="pict-modal-dialog-footer">'+'<button class="pict-modal-btn" data-action="cancel">'+this._escapeHTML(pOptions.cancelLabel)+'</button>'+'<button class="pict-modal-btn pict-modal-btn--danger" data-action="confirm" disabled>'+this._escapeHTML(pOptions.confirmLabel)+'</button>'+'</div>';let tmpCloseBtn=tmpDialog.querySelector('.pict-modal-dialog-close');let tmpCancelBtn=tmpDialog.querySelector('[data-action="cancel"]');let tmpConfirmBtn=tmpDialog.querySelector('[data-action="confirm"]');let tmpDismiss=pResult=>{this._dismissDialog(tmpDialog,pResult,fResolve);};tmpCloseBtn.addEventListener('click',()=>{tmpDismiss(false);});tmpCancelBtn.addEventListener('click',()=>{tmpDismiss(false);});if(tmpHasPhrase){// Phrase-based: enable confirm button when input matches
let tmpInput=tmpDialog.querySelector('.pict-modal-confirm-input');tmpInput.addEventListener('input',()=>{tmpConfirmBtn.disabled=tmpInput.value!==pOptions.confirmPhrase;});tmpConfirmBtn.addEventListener('click',()=>{if(!tmpConfirmBtn.disabled){tmpDismiss(true);}});tmpDialog._focusTarget=tmpInput;}else{// Two-click: first click changes label, second click confirms
let tmpClickCount=0;let tmpOriginalLabel=pOptions.confirmLabel;tmpConfirmBtn.disabled=false;tmpConfirmBtn.addEventListener('click',()=>{tmpClickCount++;if(tmpClickCount===1){tmpConfirmBtn.textContent='Click again to confirm';}else{tmpDismiss(true);}});tmpDialog._focusTarget=tmpCancelBtn;}tmpDialog._dismiss=tmpDismiss;return tmpDialog;}/**
	 * Show a dialog element: append to body, show overlay, animate in.
	 *
	 * @param {HTMLElement} pDialog
	 * @param {function} fResolve - Promise resolver (for overlay click dismiss)
	 */_showDialog(pDialog,fResolve){let tmpModalEntry={element:pDialog,dismiss:pDialog._dismiss,type:'confirm'};// Show overlay
let tmpOverlayClickHandler=null;if(this._modal.options.OverlayClickDismisses){tmpOverlayClickHandler=()=>{pDialog._dismiss(false);};}this._modal._overlay.show(tmpOverlayClickHandler);// Append to body
document.body.appendChild(pDialog);// Track active modal
this._modal._activeModals.push(tmpModalEntry);// Animate in
void pDialog.offsetHeight;pDialog.classList.add('pict-modal-visible');// Focus
if(pDialog._focusTarget){pDialog._focusTarget.focus();}// Keyboard handler
pDialog._keyHandler=pEvent=>{if(pEvent.key==='Escape'){pDialog._dismiss(false);}};document.addEventListener('keydown',pDialog._keyHandler);}/**
	 * Dismiss a dialog: animate out, remove from DOM, hide overlay.
	 *
	 * @param {HTMLElement} pDialog
	 * @param {*} pResult - Value to resolve the promise with
	 * @param {function} fResolve - Promise resolver
	 */_dismissDialog(pDialog,pResult,fResolve){// Prevent double-dismiss
if(pDialog._dismissed){return;}pDialog._dismissed=true;// Remove keyboard handler
if(pDialog._keyHandler){document.removeEventListener('keydown',pDialog._keyHandler);}// Animate out
pDialog.classList.remove('pict-modal-visible');// Remove from active modals
this._modal._activeModals=this._modal._activeModals.filter(pEntry=>{return pEntry.element!==pDialog;});// Update overlay click handler to point to new topmost modal
if(this._modal._activeModals.length>0){let tmpTopModal=this._modal._activeModals[this._modal._activeModals.length-1];this._modal._overlay.updateClickHandler(this._modal.options.OverlayClickDismisses?tmpTopModal.dismiss:null);}// Hide overlay
this._modal._overlay.hide();// Remove from DOM after transition
setTimeout(()=>{if(pDialog.parentNode){pDialog.parentNode.removeChild(pDialog);}},220);// Resolve promise
fResolve(pResult);}/**
	 * Escape HTML special characters.
	 *
	 * @param {string} pText
	 * @returns {string}
	 */_escapeHTML(pText){if(typeof pText!=='string'){return'';}return pText.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}}module.exports=PictModalConfirm;},{}],24:[function(require,module,exports){/**
 * Pict-Modal-Dropdown
 *
 * Anchor-positioned menu that behaves like a dropdown / popover. Handy for:
 *   - nav menus that hang off a header link or button
 *   - "split button" style addenda (a primary action paired with a chevron
 *     that opens a list of related/alternate actions)
 *   - any "more options" affordance where a full modal would be heavy
 *
 * Differences from the modal Window helper:
 *   - No backdrop overlay — the rest of the page stays interactive.
 *   - Positioned next to the anchor element, not centered.
 *   - Auto-flips above when there isn't room below; clamps inside the viewport.
 *   - Click outside or Escape dismisses (matches native menu conventions).
 *
 * Usage:
 *     modal.dropdown(anchorEl, {
 *         items:
 *         [
 *             { Hash: 'edit',   Label: 'Edit'                    },
 *             { Hash: 'rename', Label: 'Rename...'                },
 *             { Separator: true                                   },
 *             { Hash: 'delete', Label: 'Delete', Style: 'danger'  },
 *             { Hash: 'archive',Label: 'Archive', Disabled: true,
 *               Tooltip: 'Already archived'                       }
 *         ],
 *         align: 'left'        // 'left' | 'right' (relative to anchor)
 *     }).then((pChoice) => { ... });
 *
 * Returns a Promise that resolves with `{ Hash, Item }` on selection or
 * `null` on dismiss.
 */class PictModalDropdown{constructor(pModal){this._modal=pModal;this._activeMenu=null;}/**
	 * Open a dropdown menu anchored to an element.
	 *
	 * @param {HTMLElement|string|object} pAnchor - Element, CSS selector, or
	 *   a rect-like { left, top, width, height } anchor (handy for context menus).
	 * @param {object} pOptions
	 * @param {Array}    pOptions.items     - [{ Hash, Label, Style?, Disabled?, Tooltip?, Icon?, Separator? }]
	 * @param {string}   [pOptions.align]   - 'left'|'right' (default 'left')
	 * @param {string}   [pOptions.position]- 'auto'|'below'|'above' (default 'auto')
	 * @param {string}   [pOptions.minWidth]- CSS minWidth (default: anchor width if known, else '160px')
	 * @param {string}   [pOptions.maxHeight]- CSS maxHeight (default '60vh')
	 * @param {string}   [pOptions.className]- extra class(es) for the menu element
	 * @param {boolean}  [pOptions.closeOnSelect] - default true
	 * @param {function} [pOptions.onSelect]- called with (Hash, Item) on selection
	 * @param {function} [pOptions.onClose] - called after dismiss
	 * @returns {Promise<{Hash: string, Item: object}|null>}
	 */dropdown(pAnchor,pOptions){let tmpOptions=Object.assign({align:'left',position:'auto',maxHeight:'60vh',closeOnSelect:true},pOptions||{});let tmpAnchorEl=this._resolveAnchor(pAnchor);let tmpAnchorRect=this._anchorRect(pAnchor,tmpAnchorEl);if(!tmpAnchorRect){return Promise.resolve(null);}// Re-opening the same menu is a no-op; closing-then-reopening is a
// caller decision (just call dismissDropdown() first).
if(this._activeMenu&&this._activeMenu.anchor===tmpAnchorEl){return this._activeMenu.promise;}// Only one dropdown at a time keeps focus / keyboard handling sane.
this.dismissAll();let tmpItems=Array.isArray(tmpOptions.items)?tmpOptions.items:[];let tmpResolveOuter;let tmpPromise=new Promise(fResolve=>{tmpResolveOuter=fResolve;});let tmpMenu=this._buildMenu(tmpItems,tmpOptions);document.body.appendChild(tmpMenu);this._positionMenu(tmpMenu,tmpAnchorRect,tmpOptions);// Animate in on the next frame.
void tmpMenu.offsetHeight;tmpMenu.classList.add('pict-modal-visible');let tmpDismiss=pResult=>{if(tmpMenu._dismissed){return;}tmpMenu._dismissed=true;document.removeEventListener('mousedown',tmpOutsideHandler,true);document.removeEventListener('keydown',tmpKeyHandler,true);window.removeEventListener('resize',tmpRepositionHandler);window.removeEventListener('scroll',tmpRepositionHandler,true);tmpMenu.classList.remove('pict-modal-visible');setTimeout(()=>{if(tmpMenu.parentNode){tmpMenu.parentNode.removeChild(tmpMenu);}},180);if(this._activeMenu&&this._activeMenu.element===tmpMenu){this._activeMenu=null;}if(typeof tmpOptions.onClose==='function'){tmpOptions.onClose(pResult);}tmpResolveOuter(pResult);};// Wire item clicks (each item element carries a data-hash; separators
// and disabled items are skipped).
let tmpItemEls=tmpMenu.querySelectorAll('[data-pict-modal-dropdown-item]');for(let i=0;i<tmpItemEls.length;i++){let tmpEl=tmpItemEls[i];tmpEl.addEventListener('click',pEvent=>{if(tmpEl.hasAttribute('data-disabled')){return;}pEvent.stopPropagation();let tmpIdx=parseInt(tmpEl.getAttribute('data-index'),10);let tmpItem=tmpItems[tmpIdx];let tmpHash=tmpEl.getAttribute('data-hash');if(typeof tmpOptions.onSelect==='function'){tmpOptions.onSelect(tmpHash,tmpItem);}if(tmpOptions.closeOnSelect!==false){tmpDismiss({Hash:tmpHash,Item:tmpItem});}});}// Click anywhere outside the menu (and outside the anchor) → dismiss.
// Use mousedown/capture so we beat any per-element click handlers.
let tmpOutsideHandler=pEvent=>{if(tmpMenu.contains(pEvent.target)){return;}if(tmpAnchorEl&&tmpAnchorEl.contains&&tmpAnchorEl.contains(pEvent.target)){return;}tmpDismiss(null);};document.addEventListener('mousedown',tmpOutsideHandler,true);// Esc dismisses; arrow keys navigate items (skipping disabled/separator).
let tmpKeyHandler=pEvent=>{if(pEvent.key==='Escape'){pEvent.stopPropagation();tmpDismiss(null);return;}if(pEvent.key==='ArrowDown'||pEvent.key==='ArrowUp'){pEvent.preventDefault();this._focusNeighbor(tmpMenu,pEvent.key==='ArrowDown'?1:-1);}else if(pEvent.key==='Enter'||pEvent.key===' '){let tmpFocused=document.activeElement;if(tmpFocused&&tmpMenu.contains(tmpFocused)&&tmpFocused.hasAttribute('data-pict-modal-dropdown-item')){pEvent.preventDefault();tmpFocused.click();}}};document.addEventListener('keydown',tmpKeyHandler,true);// Reposition on viewport resize / scroll so the menu doesn't drift
// off the anchor.
let tmpRepositionHandler=()=>{let tmpRect=this._anchorRect(pAnchor,tmpAnchorEl);if(tmpRect){this._positionMenu(tmpMenu,tmpRect,tmpOptions);}};window.addEventListener('resize',tmpRepositionHandler);window.addEventListener('scroll',tmpRepositionHandler,true);// Move keyboard focus to the first enabled item so arrows / Enter work
// without an extra click.
setTimeout(()=>{this._focusFirstEnabled(tmpMenu);},0);this._activeMenu={element:tmpMenu,anchor:tmpAnchorEl,promise:tmpPromise,dismiss:tmpDismiss};return tmpPromise;}/**
	 * Dismiss the currently-open dropdown (if any).
	 */dismissAll(){if(this._activeMenu){let tmpDismiss=this._activeMenu.dismiss;this._activeMenu=null;tmpDismiss(null);}}// ─────────────────────────────────────────────
//  Internals
// ─────────────────────────────────────────────
_resolveAnchor(pAnchor){if(!pAnchor){return null;}if(typeof pAnchor==='string'){return document.querySelector(pAnchor);}if(pAnchor.nodeType===1){return pAnchor;}// rect-like — no element to attach focus / outside-click ignore to,
// but that's fine, the caller knows what they're doing.
return null;}_anchorRect(pAnchor,pAnchorEl){if(pAnchorEl&&typeof pAnchorEl.getBoundingClientRect==='function'){return pAnchorEl.getBoundingClientRect();}if(pAnchor&&typeof pAnchor==='object'&&typeof pAnchor.left==='number'&&typeof pAnchor.top==='number'){return{left:pAnchor.left,top:pAnchor.top,width:pAnchor.width||0,height:pAnchor.height||0,right:pAnchor.left+(pAnchor.width||0),bottom:pAnchor.top+(pAnchor.height||0)};}return null;}_buildMenu(pItems,pOptions){let tmpId=this._modal._nextId();let tmpMenu=document.createElement('div');tmpMenu.className='pict-modal-dropdown';if(pOptions.className){tmpMenu.className+=' '+pOptions.className;}tmpMenu.id='pict-modal-dropdown-'+tmpId;tmpMenu.setAttribute('role','menu');tmpMenu.style.maxHeight=pOptions.maxHeight;let tmpHtml='';for(let i=0;i<pItems.length;i++){let tmpItem=pItems[i];if(tmpItem.Separator){tmpHtml+='<div class="pict-modal-dropdown-separator" role="separator"></div>';continue;}if(tmpItem.Header){tmpHtml+='<div class="pict-modal-dropdown-header">'+this._escapeHTML(tmpItem.Header)+'</div>';continue;}let tmpCls='pict-modal-dropdown-item';if(tmpItem.Style){tmpCls+=' pict-modal-dropdown-item--'+tmpItem.Style;}if(tmpItem.Disabled){tmpCls+=' pict-modal-dropdown-item--disabled';}let tmpAttrs=''+' data-pict-modal-dropdown-item'+' data-index="'+i+'"'+' data-hash="'+this._escapeHTML(tmpItem.Hash||'')+'"'+' role="menuitem"'+' tabindex="-1"';if(tmpItem.Disabled){tmpAttrs+=' aria-disabled="true" data-disabled';}if(tmpItem.Tooltip){tmpAttrs+=' title="'+this._escapeHTML(tmpItem.Tooltip)+'"';}let tmpIcon=tmpItem.Icon?'<span class="pict-modal-dropdown-item-icon">'+tmpItem.Icon+'</span>':'';let tmpHint=tmpItem.Hint?'<span class="pict-modal-dropdown-item-hint">'+this._escapeHTML(tmpItem.Hint)+'</span>':'';tmpHtml+='<div class="'+tmpCls+'"'+tmpAttrs+'>'+tmpIcon+'<span class="pict-modal-dropdown-item-label">'+this._escapeHTML(tmpItem.Label||'')+'</span>'+tmpHint+'</div>';}tmpMenu.innerHTML=tmpHtml;return tmpMenu;}_positionMenu(pMenu,pAnchorRect,pOptions){// Apply min-width before measuring so the menu's natural size accounts
// for the constraint.
let tmpMinWidth=pOptions.minWidth||(pAnchorRect.width>=80?Math.ceil(pAnchorRect.width)+'px':'160px');pMenu.style.minWidth=tmpMinWidth;// Measure after attaching.
let tmpMenuRect=pMenu.getBoundingClientRect();let tmpVw=window.innerWidth||document.documentElement.clientWidth;let tmpVh=window.innerHeight||document.documentElement.clientHeight;let tmpGap=4;// breathing room between anchor and menu
// Vertical: prefer below; flip above when not enough room and there's
// more above. 'below'/'above' overrides force the side.
let tmpRoomBelow=tmpVh-pAnchorRect.bottom-tmpGap;let tmpRoomAbove=pAnchorRect.top-tmpGap;let tmpPlaceAbove;if(pOptions.position==='above'){tmpPlaceAbove=true;}else if(pOptions.position==='below'){tmpPlaceAbove=false;}else{tmpPlaceAbove=tmpMenuRect.height>tmpRoomBelow&&tmpRoomAbove>tmpRoomBelow;}// Cap height to whichever side we landed on so the menu can scroll
// internally instead of running off the screen.
let tmpCap=Math.max(80,(tmpPlaceAbove?tmpRoomAbove:tmpRoomBelow)-8);pMenu.style.maxHeight=tmpCap+'px';// Horizontal alignment to the anchor, then clamp inside the viewport.
let tmpLeft;if(pOptions.align==='right'){tmpLeft=pAnchorRect.right-tmpMenuRect.width;}else if(pOptions.align==='center'){tmpLeft=pAnchorRect.left+(pAnchorRect.width-tmpMenuRect.width)/2;}else{tmpLeft=pAnchorRect.left;}tmpLeft=Math.min(tmpLeft,tmpVw-tmpMenuRect.width-4);tmpLeft=Math.max(4,tmpLeft);let tmpTop;if(tmpPlaceAbove){tmpTop=Math.max(4,pAnchorRect.top-tmpMenuRect.height-tmpGap);pMenu.classList.add('pict-modal-dropdown--above');}else{tmpTop=pAnchorRect.bottom+tmpGap;pMenu.classList.remove('pict-modal-dropdown--above');}pMenu.style.left=Math.round(tmpLeft)+'px';pMenu.style.top=Math.round(tmpTop)+'px';}_focusFirstEnabled(pMenu){let tmpItems=pMenu.querySelectorAll('[data-pict-modal-dropdown-item]:not([data-disabled])');if(tmpItems.length){tmpItems[0].focus();}}_focusNeighbor(pMenu,pDirection){let tmpItems=Array.prototype.slice.call(pMenu.querySelectorAll('[data-pict-modal-dropdown-item]:not([data-disabled])'));if(!tmpItems.length){return;}let tmpActive=document.activeElement;let tmpIdx=tmpItems.indexOf(tmpActive);let tmpNext=tmpIdx===-1?pDirection>0?0:tmpItems.length-1:(tmpIdx+pDirection+tmpItems.length)%tmpItems.length;tmpItems[tmpNext].focus();}_escapeHTML(pText){if(typeof pText!=='string'){return'';}return pText.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}}module.exports=PictModalDropdown;},{}],25:[function(require,module,exports){/**
 * Pict-Modal-Overlay
 *
 * Manages a shared backdrop overlay element appended to document.body.
 * Reference-counted — created on first modal open, removed when last closes.
 */class PictModalOverlay{constructor(pModal){this._modal=pModal;this._element=null;this._refCount=0;}/**
	 * Show the overlay (incrementing reference count).
	 * Creates the DOM element on first call.
	 *
	 * @param {function} [fOnClick] - Optional click handler (e.g. dismiss topmost modal)
	 */show(fOnClick){this._refCount++;if(!this._element){this._element=document.createElement('div');this._element.className='pict-modal-overlay';document.body.appendChild(this._element);// Force reflow so the transition animates
void this._element.offsetHeight;this._element.classList.add('pict-modal-visible');}if(fOnClick){// Store the latest click handler (for the topmost modal)
this._currentClickHandler=fOnClick;this._element.onclick=pEvent=>{if(pEvent.target===this._element&&this._currentClickHandler){this._currentClickHandler();}};}}/**
	 * Update the overlay click handler (e.g. when topmost modal changes).
	 *
	 * @param {function} [fOnClick] - New click handler
	 */updateClickHandler(fOnClick){this._currentClickHandler=fOnClick||null;}/**
	 * Hide the overlay (decrementing reference count).
	 * Removes the DOM element when reference count reaches zero.
	 */hide(){this._refCount--;if(this._refCount<=0){this._refCount=0;if(this._element){this._element.classList.remove('pict-modal-visible');let tmpElement=this._element;// Remove after transition
setTimeout(()=>{if(tmpElement.parentNode){tmpElement.parentNode.removeChild(tmpElement);}},220);this._element=null;this._currentClickHandler=null;}}}/**
	 * Force-remove the overlay regardless of reference count.
	 */destroy(){this._refCount=0;if(this._element&&this._element.parentNode){this._element.parentNode.removeChild(this._element);}this._element=null;this._currentClickHandler=null;}}module.exports=PictModalOverlay;},{}],26:[function(require,module,exports){/**
 * Pict-Modal-Panel
 *
 * Adds resizable and collapsible panel behavior to any DOM element.
 * Follows the handler composition pattern used by the other modal
 * handlers (confirm, window, toast, tooltip).
 *
 * Usage:
 *   let handle = modal.panel('#my-panel', { position: 'right', width: 340 });
 *   handle.toggle();
 *   handle.destroy();
 */class PictModalPanel{constructor(pModal){this._modal=pModal;this._panels=[];}/**
	 * Attach resizable/collapsible panel behavior to an element.
	 *
	 * @param {string} pTargetSelector - CSS selector for the panel element
	 * @param {object} [pOptions] - Panel options
	 * @returns {{ collapse, expand, toggle, setWidth, destroy }} Panel handle
	 */create(pTargetSelector,pOptions){let tmpDefaults=this._modal&&this._modal.options&&this._modal.options.DefaultPanelOptions||{};let tmpOptions=Object.assign({},{position:'right',width:340,minWidth:200,maxWidth:600,collapsible:true,collapsed:false,persist:false,persistKey:'',onResize:null,onToggle:null},tmpDefaults,pOptions);if(typeof document==='undefined')return this._nullHandle();let tmpTarget=document.querySelector(pTargetSelector);if(!tmpTarget)return this._nullHandle();let tmpId=this._modal._nextId();let tmpIsRight=tmpOptions.position==='right';let tmpIsCollapsed=false;let tmpCurrentWidth=tmpOptions.width;let tmpDestroyed=false;// Restore persisted state
if(tmpOptions.persist&&tmpOptions.persistKey){try{let tmpStored=localStorage.getItem('pict-panel-'+tmpOptions.persistKey);if(tmpStored){let tmpParsed=JSON.parse(tmpStored);if(typeof tmpParsed.width==='number')tmpCurrentWidth=tmpParsed.width;if(typeof tmpParsed.collapsed==='boolean')tmpOptions.collapsed=tmpParsed.collapsed;}}catch(e){/* ignore */}}// Apply classes and initial width
tmpTarget.classList.add('pict-panel');tmpTarget.classList.add(tmpIsRight?'pict-panel-right':'pict-panel-left');tmpTarget.style.width=tmpCurrentWidth+'px';// Remove display:none if present — panel uses width collapse instead
if(tmpTarget.style.display==='none'){tmpTarget.style.display='';}// ── Create the edge container ───────────────────────
let tmpEdge=document.createElement('div');tmpEdge.className='pict-panel-edge '+(tmpIsRight?'pict-panel-edge-right':'pict-panel-edge-left');// Resize handle
let tmpResize=document.createElement('div');tmpResize.className='pict-panel-resize';tmpEdge.appendChild(tmpResize);// Collapse tab (chevron SVG)
let tmpTab=null;if(tmpOptions.collapsible){tmpTab=document.createElement('div');tmpTab.className='pict-panel-tab';tmpTab.title='Toggle panel';tmpEdge.appendChild(tmpTab);}// Insert edge as a sibling so it is not clipped by the
// panel's own overflow (e.g. overflow-y: auto for scrolling).
// Right panels: edge goes BEFORE the panel (left side).
// Left panels: edge goes AFTER the panel (right side).
if(tmpTarget.parentNode){if(tmpIsRight){tmpTarget.parentNode.insertBefore(tmpEdge,tmpTarget);}else{tmpTarget.parentNode.insertBefore(tmpEdge,tmpTarget.nextSibling);}}else{tmpTarget.insertBefore(tmpEdge,tmpTarget.firstChild);}// ── Chevron lookup via pict.providers.Icon ──────────
// Both directions come from the core registry (`{~I:ChevronLeft~}`
// / `{~I:ChevronRight~}`).  Resolved per-render so a theme that
// re-registers the chevron variant picks up automatically.  Empty
// fallback in the unlikely case pict is missing the Icon provider
// (very old pict versions; current minimum is 1.0.368).
let tmpPictHandle=typeof window!=='undefined'&&window.pict?window.pict:null;let tmpIcon=pName=>tmpPictHandle&&typeof tmpPictHandle.icon==='function'?tmpPictHandle.icon(pName):'';let tmpUpdateChevron=()=>{if(!tmpTab)return;let tmpChevronRight=tmpIcon('ChevronRight');let tmpChevronLeft=tmpIcon('ChevronLeft');if(tmpIsRight){tmpTab.innerHTML=tmpIsCollapsed?tmpChevronLeft:tmpChevronRight;}else{tmpTab.innerHTML=tmpIsCollapsed?tmpChevronRight:tmpChevronLeft;}};// ── Persist helper ──────────────────────────────────
let tmpPersist=()=>{if(!tmpOptions.persist||!tmpOptions.persistKey)return;try{localStorage.setItem('pict-panel-'+tmpOptions.persistKey,JSON.stringify({width:tmpCurrentWidth,collapsed:tmpIsCollapsed}));}catch(e){/* ignore */}};// ── Collapse / expand ───────────────────────────────
let tmpCollapse=()=>{if(tmpIsCollapsed||tmpDestroyed)return;tmpIsCollapsed=true;tmpTarget.classList.add('pict-panel-collapsed');tmpEdge.classList.add('pict-panel-edge-collapsed');tmpUpdateChevron();tmpPersist();if(typeof tmpOptions.onToggle==='function')tmpOptions.onToggle(true);};let tmpExpand=()=>{if(!tmpIsCollapsed||tmpDestroyed)return;tmpIsCollapsed=false;tmpEdge.classList.remove('pict-panel-edge-collapsed');tmpTarget.classList.remove('pict-panel-collapsed');tmpTarget.style.width=tmpCurrentWidth+'px';tmpUpdateChevron();tmpPersist();if(typeof tmpOptions.onToggle==='function')tmpOptions.onToggle(false);};let tmpToggle=()=>{if(tmpIsCollapsed)tmpExpand();else tmpCollapse();};let tmpSetWidth=pWidth=>{if(tmpDestroyed)return;let tmpWidth=Math.max(tmpOptions.minWidth,Math.min(tmpOptions.maxWidth,pWidth));tmpCurrentWidth=tmpWidth;if(!tmpIsCollapsed){tmpTarget.style.width=tmpWidth+'px';}tmpPersist();if(typeof tmpOptions.onResize==='function')tmpOptions.onResize(tmpWidth);};// ── Tab click ───────────────────────────────────────
if(tmpTab){tmpTab.addEventListener('click',pEvent=>{pEvent.stopPropagation();tmpToggle();});}// ── Resize drag ─────────────────────────────────────
let tmpOnMouseDown=pEvent=>{if(tmpIsCollapsed)return;pEvent.preventDefault();let tmpStartX=pEvent.clientX;let tmpStartWidth=tmpTarget.offsetWidth;tmpResize.classList.add('dragging');tmpTarget.style.transition='none';document.body.style.userSelect='none';document.body.style.cursor='col-resize';let tmpOnMouseMove=pMoveEvent=>{let tmpDelta=tmpIsRight?tmpStartX-pMoveEvent.clientX:pMoveEvent.clientX-tmpStartX;let tmpNewWidth=Math.max(tmpOptions.minWidth,Math.min(tmpOptions.maxWidth,tmpStartWidth+tmpDelta));tmpTarget.style.width=tmpNewWidth+'px';};let tmpOnMouseUp=pUpEvent=>{document.removeEventListener('mousemove',tmpOnMouseMove);document.removeEventListener('mouseup',tmpOnMouseUp);tmpResize.classList.remove('dragging');tmpTarget.style.transition='';document.body.style.userSelect='';document.body.style.cursor='';// Capture the final width
tmpCurrentWidth=tmpTarget.offsetWidth;tmpPersist();if(typeof tmpOptions.onResize==='function')tmpOptions.onResize(tmpCurrentWidth);};document.addEventListener('mousemove',tmpOnMouseMove);document.addEventListener('mouseup',tmpOnMouseUp);};tmpResize.addEventListener('mousedown',tmpOnMouseDown);// ── Initial state ───────────────────────────────────
tmpUpdateChevron();if(tmpOptions.collapsed){tmpIsCollapsed=true;tmpTarget.classList.add('pict-panel-collapsed');tmpEdge.classList.add('pict-panel-edge-collapsed');tmpUpdateChevron();}// ── Destroy ─────────────────────────────────────────
let tmpDestroy=()=>{if(tmpDestroyed)return;tmpDestroyed=true;tmpResize.removeEventListener('mousedown',tmpOnMouseDown);if(tmpEdge.parentNode)tmpEdge.remove();tmpTarget.classList.remove('pict-panel','pict-panel-right','pict-panel-left','pict-panel-collapsed');tmpTarget.style.width='';tmpTarget.style.transition='';let tmpIdx=this._panels.indexOf(tmpHandle);if(tmpIdx>=0)this._panels.splice(tmpIdx,1);};// ── Return handle ───────────────────────────────────
let tmpHandle={id:tmpId,collapse:tmpCollapse,expand:tmpExpand,toggle:tmpToggle,setWidth:tmpSetWidth,destroy:tmpDestroy};this._panels.push(tmpHandle);return tmpHandle;}/**
	 * Return a no-op handle for server-side or missing-element cases.
	 */_nullHandle(){return{id:0,collapse:()=>{},expand:()=>{},toggle:()=>{},setWidth:()=>{},destroy:()=>{}};}/**
	 * Destroy all active panels.
	 */destroyAll(){let tmpPanels=this._panels.slice();for(let i=0;i<tmpPanels.length;i++){tmpPanels[i].destroy();}}}module.exports=PictModalPanel;},{}],27:[function(require,module,exports){/**
 * Pict-Modal-Shell — viewport-managing layout system for top / right /
 * bottom / left panels around a center.
 *
 * # What this is for
 *
 * Most apps grow a chrome of stacked bars: a topbar, sometimes a
 * sub-nav, sometimes a bottom status bar, often a left sidebar, maybe
 * a right inspector. Each one has its own collapse / resize / persist
 * concerns, and apps end up reinventing the layout glue + the chrome
 * controls per-app.
 *
 * The Shell solves this once. The host calls `modal.shell(viewport)`,
 * adds panels in the order they should stack from each edge, and the
 * Shell manages:
 *
 *   - DOM structure (a flex tree wrapping the viewport)
 *   - Layout placement (multiple panels per side, each in registration order)
 *   - Collapse / expand chrome (a thin tab strip when collapsed)
 *   - Resize chrome (drag handle on the inner edge)
 *   - Pinned (in-flow) vs overlay (absolutely-positioned) panels
 *   - Persistence (per-panel collapsed + size, scoped by host or custom key)
 *   - Center destination (the workspace area between all panels)
 *
 * # Usage
 *
 *   let tmpShell = modal.shell('#App-Container', { PersistenceKey: 'my-app' });
 *
 *   tmpShell.addPanel({
 *       Hash: 'topbar', Side: 'top', Mode: 'fixed', Size: 60,
 *       ContentDestinationId: 'App-TopBar'
 *   });
 *   tmpShell.addPanel({
 *       Hash: 'statusbar', Side: 'bottom', Mode: 'fixed', Size: 28,
 *       ContentDestinationId: 'App-StatusBar'
 *   });
 *   tmpShell.addPanel({
 *       Hash: 'sidebar', Side: 'left', Mode: 'resizable', Size: 280,
 *       MinSize: 180, MaxSize: 480, Title: 'Modules',
 *       ContentDestinationId: 'App-Sidebar'
 *   });
 *
 *   let tmpCenter = tmpShell.center({ ContentDestinationId: 'App-Workspace' });
 *
 *   // Render into the destinations the same way as any other Pict view.
 *   pict.ContentAssignment.assignContent('#App-Sidebar', tmpHTML);
 *
 * # Panel options
 *
 *   Hash:                 unique id within the shell (auto-generated if omitted).
 *                         Used as the localStorage key suffix and for getPanel().
 *   Side:                 'top' | 'right' | 'bottom' | 'left'.
 *   Mode:                 'fixed' (no chrome), 'collapsible' (collapse tab),
 *                         'resizable' (collapse tab + drag handle).
 *   Position:             'pinned' (default; takes layout space) or 'overlay'
 *                         (absolutely positioned over the center / siblings).
 *   Scope:                'shell' (default) | 'center'.
 *                         When 'shell', the panel mounts in one of the
 *                         outer rows / side stacks (Side decides which).
 *                         When 'center', the panel mounts INSIDE the
 *                         center column instead — useful for bars that
 *                         should align with the content area only, not
 *                         span across the sidebars.  Only Side='top' and
 *                         Side='bottom' are supported with Scope='center'.
 *                         The center auto-switches to a flex-column
 *                         layout so the content destination + inner
 *                         panels stack vertically.
 *   Size:                 initial px (height for top/bottom, width for left/right).
 *                         Default: 200 for sides, 60 for top/bottom.
 *   MinSize, MaxSize:     drag clamp for resizable panels.
 *   Collapsed:            initial state. Persisted state overrides this.
 *   CollapsedSize:        px the panel becomes when collapsed (default 24).
 *   Title:                shown in the collapse tab.
 *   Icon:                 optional inline SVG / HTML for the collapse tab.
 *   ContentDestinationId: id given to the inner content div so the host can
 *                         reach it via #ContentDestinationId selectors.
 *   ContentView:          ViewIdentifier (string) of a registered Pict view
 *                         that owns this panel's content. When set, the
 *                         shell auto-renders the view once at panel creation
 *                         (so the destination is filled before the user
 *                         opens the panel) AND again on every expand
 *                         transition (so freshly-streamed state shows up).
 *                         Centralises the "I created a panel — now I have
 *                         to remember to render the view into it" boilerplate.
 *   Persist:              default true; pass false to skip save/load for this
 *                         panel even when the shell has persistence enabled.
 *   Hidden:               default false. When true, the collapsed state has
 *                         NO visible chrome — no collapse tab, no edge
 *                         affordance, the panel root is display: none. The
 *                         only way to reveal it is a programmatic
 *                         expand()/toggle() from elsewhere (e.g. a topbar
 *                         gear). Mode still controls the EXPANDED chrome —
 *                         pass Mode: 'resizable' to keep the drag handle
 *                         while open, then vanish on collapse.
 *   OnExpand, OnCollapse: callbacks that fire ONLY on transitions
 *                         (collapsed→expanded or expanded→collapsed).
 *                         Cleaner than OnToggle which fires for both
 *                         directions and forces callers to inspect the
 *                         bool. OnToggle is kept for back-compat.
 *
 * # Persistence
 *
 *   Storage key:  'pict-modal-shell:' + <PersistenceKey or hostname or 'default'>
 *   Value shape:  { Version: 1, Panels: { <hash>: { Collapsed: bool, Size: number } } }
 */const STORAGE_PREFIX='pict-modal-shell:';const SCHEMA_VERSION=1;const DEFAULT_COLLAPSED_SIZE=24;const DEFAULT_SIZE_SIDE=240;const DEFAULT_SIZE_TOPBOTTOM=60;class PictModalShell{constructor(pModalSection,pViewportEl,pOptions){this._modal=pModalSection;this._viewport=pViewportEl;this._options=pOptions||{};this._panels=[];this._panelsByHash={};this._centerDestinationEl=null;this._idCounter=0;this._activeDrag=null;this._persistenceEnabled=this._options.Persistence!==false;this._persistenceKey=this._persistenceEnabled?this._resolvePersistenceKey(this._options.PersistenceKey):null;// Build the wrapper DOM inside the viewport.
this._buildSkeleton();}// ────────────────────────────────────────────────────────────────
//  Public API
// ────────────────────────────────────────────────────────────────
addPanel(pConfig){let tmpPanel=new ShellPanel(this,pConfig||{});this._panels.push(tmpPanel);this._panelsByHash[tmpPanel.Hash]=tmpPanel;this._mountPanel(tmpPanel);// Render the bound ContentView once now so the destination has
// content even before the user opens the panel. This is the
// "create" half of the unified create-and-popup pattern — hosts
// no longer need to chase down each panel and call view.render()
// manually after addPanel().
tmpPanel._renderContentView();return tmpPanel;}getPanel(pHash){return this._panelsByHash[pHash]||null;}getPanels(){return this._panels.slice();}/**
	 * Convenience for cross-view popup triggers. Equivalent to
	 * `shell.getPanel(hash).popup()`. Silently no-ops when the hash
	 * doesn't match a registered panel (so callers don't have to
	 * null-check during boot races).
	 */openPanel(pHash){let tmpPanel=this._panelsByHash[pHash];if(tmpPanel){tmpPanel.popup();}return tmpPanel||null;}/**
	 * Configure the center area. Optional; if never called, the center
	 * still exists but has no host-supplied destination id (host can
	 * still reach it via .pict-modal-shell-center).
	 */center(pOptions){pOptions=pOptions||{};if(pOptions.ContentDestinationId){// Remove any previously-created destination so center() is
// idempotent across reconfigurations.  We don't blow away
// the whole center via innerHTML='' anymore: Scope:'center'
// panels mounted by earlier addPanel() calls need to stay
// in place.  Find the right insertion point so the
// destination sits between any top-scoped panels and any
// bottom-scoped panels.
if(this._centerDestinationEl&&this._centerDestinationEl.parentNode===this._centerEl){this._centerEl.removeChild(this._centerDestinationEl);}let tmpInner=document.createElement('div');tmpInner.id=pOptions.ContentDestinationId;tmpInner.className='pict-modal-shell-center-content';let tmpFirstBottomScoped=null;let tmpChildren=this._centerEl.children;for(let i=0;i<tmpChildren.length;i++){let tmpCandidate=tmpChildren[i];if(tmpCandidate.classList&&tmpCandidate.classList.contains('pict-modal-shell-panel-bottom')){tmpFirstBottomScoped=tmpCandidate;break;}}if(tmpFirstBottomScoped){this._centerEl.insertBefore(tmpInner,tmpFirstBottomScoped);}else{this._centerEl.appendChild(tmpInner);}this._centerDestinationEl=tmpInner;}return this._centerEl;}getCenterEl(){return this._centerEl;}destroy(){for(let i=0;i<this._panels.length;i++){this._panels[i].destroy(true);}this._panels=[];this._panelsByHash={};if(this._wrapperEl&&this._wrapperEl.parentNode){this._wrapperEl.parentNode.removeChild(this._wrapperEl);}this._detachDragHandlers();}// ────────────────────────────────────────────────────────────────
//  Persistence
// ────────────────────────────────────────────────────────────────
_resolvePersistenceKey(pUserKey){if(typeof pUserKey==='string'&&pUserKey.length>0)return STORAGE_PREFIX+pUserKey;try{if(typeof window!=='undefined'&&window.location&&window.location.hostname){return STORAGE_PREFIX+window.location.hostname;}}catch(pErr){/* fall through */}return STORAGE_PREFIX+'default';}_loadState(){if(!this._persistenceKey)return null;try{let tmpStore=typeof window!=='undefined'?window.localStorage:null;if(!tmpStore)return null;let tmpRaw=tmpStore.getItem(this._persistenceKey);if(!tmpRaw)return null;let tmpParsed=JSON.parse(tmpRaw);if(!tmpParsed||tmpParsed.Version!==SCHEMA_VERSION)return null;return tmpParsed.Panels&&typeof tmpParsed.Panels==='object'?tmpParsed.Panels:{};}catch(pErr){return null;}}_loadPanelState(pHash){let tmpAll=this._loadState();if(!tmpAll)return null;return tmpAll[pHash]||null;}_savePanelState(pHash,pState){if(!this._persistenceKey)return;try{let tmpStore=typeof window!=='undefined'?window.localStorage:null;if(!tmpStore)return;let tmpAll=this._loadState()||{};tmpAll[pHash]=pState;tmpStore.setItem(this._persistenceKey,JSON.stringify({Version:SCHEMA_VERSION,Panels:tmpAll,SavedAt:new Date().toISOString()}));}catch(pErr){/* swallow */}}// ────────────────────────────────────────────────────────────────
//  DOM scaffolding
// ────────────────────────────────────────────────────────────────
_buildSkeleton(){// Wipe whatever was inside the viewport — the host opted into
// the shell taking ownership of layout.
this._viewport.innerHTML='';this._viewport.classList.add('pict-modal-shell-host');this._wrapperEl=document.createElement('div');this._wrapperEl.className='pict-modal-shell';this._topRow=document.createElement('div');this._topRow.className='pict-modal-shell-row pict-modal-shell-row-top';this._wrapperEl.appendChild(this._topRow);this._middleRow=document.createElement('div');this._middleRow.className='pict-modal-shell-row pict-modal-shell-row-middle';this._wrapperEl.appendChild(this._middleRow);this._leftStack=document.createElement('div');this._leftStack.className='pict-modal-shell-side pict-modal-shell-side-left';this._middleRow.appendChild(this._leftStack);this._centerEl=document.createElement('div');this._centerEl.className='pict-modal-shell-center';this._middleRow.appendChild(this._centerEl);this._rightStack=document.createElement('div');this._rightStack.className='pict-modal-shell-side pict-modal-shell-side-right';this._middleRow.appendChild(this._rightStack);this._bottomRow=document.createElement('div');this._bottomRow.className='pict-modal-shell-row pict-modal-shell-row-bottom';this._wrapperEl.appendChild(this._bottomRow);// Overlay layer for overlay-position panels (absolute over middle row)
this._overlayLayer=document.createElement('div');this._overlayLayer.className='pict-modal-shell-overlay-layer';this._middleRow.appendChild(this._overlayLayer);this._viewport.appendChild(this._wrapperEl);}_mountPanel(pPanel){if(pPanel.Position==='overlay'){this._overlayLayer.appendChild(pPanel.El);return;}if(pPanel.Scope==='center'){// Center-scoped panels mount inside the center column.
// The column switches to flex-column so the content
// destination + the panel(s) stack vertically.
this._centerEl.classList.add('pict-modal-shell-center-with-inner-panel');if(pPanel.Side==='top'){// Top-scoped panels go above the content destination.
// If center() hasn't run yet, this still works — we
// insert before whatever's first (or just append to an
// empty center, which leaves us above any subsequent
// content destination).
this._centerEl.insertBefore(pPanel.El,this._centerEl.firstChild);}else{// Side === 'bottom' (the Scope guard already filtered
// left/right).  Append to the bottom of the center.
this._centerEl.appendChild(pPanel.El);}return;}let tmpHost;if(pPanel.Side==='top')tmpHost=this._topRow;else if(pPanel.Side==='bottom')tmpHost=this._bottomRow;else if(pPanel.Side==='left')tmpHost=this._leftStack;else if(pPanel.Side==='right')tmpHost=this._rightStack;else tmpHost=this._wrapperEl;tmpHost.appendChild(pPanel.El);}// ────────────────────────────────────────────────────────────────
//  Drag (resize) machinery — shared across all resizable panels.
// ────────────────────────────────────────────────────────────────
_attachDragStart(pPanel,pEvent){pEvent.preventDefault();let tmpAxis=pPanel.Side==='top'||pPanel.Side==='bottom'?'y':'x';this._activeDrag={Panel:pPanel,Axis:tmpAxis,StartCoord:tmpAxis==='x'?pEvent.clientX:pEvent.clientY,StartSize:pPanel.Size,Direction:pPanel.Side==='left'||pPanel.Side==='top'?1:-1,PendingSize:null,RAFId:0};document.body.classList.add(tmpAxis==='x'?'pict-modal-shell-dragging-x':'pict-modal-shell-dragging-y');// Suppress the panel's collapse/expand width/height transition for
// the duration of the drag — without this, every pointermove kicks
// off a fresh 140ms transition that stacks up and renders the
// resize as visibly laggy ("choppy"). With the transition off the
// panel snaps to each new size in the same frame as the pointer.
pPanel.El.classList.add('pict-modal-shell-panel-resizing');// Capture the pointer so dragging works even when the cursor leaves
// the resize handle (otherwise the user has to keep the cursor
// exactly on the 6 px strip — feels twitchy).
try{pEvent.target.setPointerCapture&&pEvent.target.setPointerCapture(pEvent.pointerId);}catch(pErr){/* not supported in old browsers — fine */}document.addEventListener('pointermove',this._onDragMove);document.addEventListener('pointerup',this._onDragEnd);}// Pointer events fire at the device's input rate (often 240 Hz+ on
// modern trackpads / mice) but we only paint at the display's refresh
// rate (60–120 Hz). Coalesce multiple pointermoves per frame into a
// single setSize() call via requestAnimationFrame — this drops the
// per-frame work to one DOM mutation regardless of pointer rate.
_onDragMove=pEvent=>{if(!this._activeDrag)return;let tmpD=this._activeDrag;let tmpCoord=tmpD.Axis==='x'?pEvent.clientX:pEvent.clientY;let tmpDelta=(tmpCoord-tmpD.StartCoord)*tmpD.Direction;tmpD.PendingSize=tmpD.StartSize+tmpDelta;if(!tmpD.RAFId){let tmpSelf=this;tmpD.RAFId=typeof window!=='undefined'&&window.requestAnimationFrame?window.requestAnimationFrame(function(){tmpSelf._flushDrag();}):setTimeout(function(){tmpSelf._flushDrag();},16);}};_flushDrag(){let tmpD=this._activeDrag;if(!tmpD)return;tmpD.RAFId=0;if(tmpD.PendingSize!==null){tmpD.Panel.setSize(tmpD.PendingSize);tmpD.PendingSize=null;}}_onDragEnd=()=>{if(!this._activeDrag)return;let tmpD=this._activeDrag;// Flush any pending pointermove that hadn't painted yet so the
// final size matches the actual cursor position, not the last
// rAF-aligned value.
if(tmpD.PendingSize!==null){this._flushDrag();}if(tmpD.RAFId&&typeof window!=='undefined'&&window.cancelAnimationFrame){window.cancelAnimationFrame(tmpD.RAFId);}document.body.classList.remove('pict-modal-shell-dragging-x');document.body.classList.remove('pict-modal-shell-dragging-y');tmpD.Panel.El.classList.remove('pict-modal-shell-panel-resizing');document.removeEventListener('pointermove',this._onDragMove);document.removeEventListener('pointerup',this._onDragEnd);// Persist final size.
tmpD.Panel._persist();this._activeDrag=null;};_detachDragHandlers(){document.removeEventListener('pointermove',this._onDragMove);document.removeEventListener('pointerup',this._onDragEnd);}}// ════════════════════════════════════════════════════════════════════
//  ShellPanel — one panel within a Shell
// ════════════════════════════════════════════════════════════════════
class ShellPanel{constructor(pShell,pConfig){this._shell=pShell;this._config=pConfig;this.Hash=pConfig.Hash||'panel-'+ ++pShell._idCounter;this.Side=pConfig.Side==='right'||pConfig.Side==='bottom'||pConfig.Side==='left'?pConfig.Side:'top';this.Mode=pConfig.Mode==='collapsible'||pConfig.Mode==='resizable'?pConfig.Mode:'fixed';this.Position=pConfig.Position==='overlay'?'overlay':'pinned';// Scope: 'center' opts the panel into the center column instead
// of the shell's outer rows.  Only valid for Side='top'/'bottom'
// (left/right inside center would need a separate axis we don't
// support).  Invalid combinations silently fall back to 'shell'.
this.Scope=pConfig.Scope==='center'&&(this.Side==='top'||this.Side==='bottom')?'center':'shell';this.Title=pConfig.Title||'';this.Icon=pConfig.Icon||'';this.MinSize=typeof pConfig.MinSize==='number'?pConfig.MinSize:40;this.MaxSize=typeof pConfig.MaxSize==='number'?pConfig.MaxSize:1200;// `Hidden: true` is a panel that has NO visible chrome in its collapsed
// state — no collapse tab sliver, no resize handle, no edge marker, and
// (via CSS) display: none on the panel root. The only way to reveal it
// is a programmatic expand()/toggle() called from elsewhere in the app
// (e.g. a gear button in the topbar). Useful when the host wants a
// fully-shaped panel but doesn't want an always-visible affordance for
// discovering it. The Mode is still honoured for the EXPANDED state —
// pass Mode: 'resizable' to keep the drag handle while the panel is
// open, while still vanishing entirely when collapsed.
this.Hidden=!!pConfig.Hidden;this.CollapsedSize=typeof pConfig.CollapsedSize==='number'?pConfig.CollapsedSize:this.Hidden?0:DEFAULT_COLLAPSED_SIZE;this.PersistEnabled=pShell._persistenceEnabled&&pConfig.Persist!==false;let tmpDefaultSize=this.Side==='left'||this.Side==='right'?DEFAULT_SIZE_SIDE:DEFAULT_SIZE_TOPBOTTOM;this.Size=typeof pConfig.Size==='number'?pConfig.Size:tmpDefaultSize;this.Collapsed=!!pConfig.Collapsed;// Persisted state overrides initial Size/Collapsed.
if(this.PersistEnabled){let tmpSaved=pShell._loadPanelState(this.Hash);if(tmpSaved){if(typeof tmpSaved.Size==='number')this.Size=tmpSaved.Size;if(typeof tmpSaved.Collapsed==='boolean')this.Collapsed=tmpSaved.Collapsed;}}this._clampSize();// Build the panel DOM.
this._buildEl(pConfig);this._applySize();this._applyCollapsedClass();// Responsive drawer — at narrow viewports, flip a docked side
// panel into a "top drawer" by adding a class to the middle row
// that toggles flex-direction from row to column. The panel
// stretches to full width and trades its inline `width` for a
// configurable drawer `height`. The user's collapse/expand
// keeps working: collapsed in drawer mode just gives the panel
// height: 0 (so only the collapse tab remains visible at the
// top of the content), expanded restores the drawer height.
// Pass `0` or omit to disable. Mirrors retold-remote's
// `.content-editor-body { flex-direction: column }` pattern.
this.ResponsiveDrawer=typeof pConfig.ResponsiveDrawer==='number'&&pConfig.ResponsiveDrawer>0?pConfig.ResponsiveDrawer:0;// Drawer height — applied as `height` to the panel in drawer
// mode. CSS units (px / vh / %) accepted. Default 33vh which
// gives the panel roughly a third of the viewport height and
// leaves comfortable room for the workspace below.
this.DrawerHeight=typeof pConfig.DrawerHeight==='string'&&pConfig.DrawerHeight?pConfig.DrawerHeight:'33vh';this._mediaQuery=null;this._mediaQueryHandler=null;if(this.ResponsiveDrawer>0){this._wireResponsiveDrawer();}}// ───────────── public ─────────────
getContentEl(){return this._contentEl;}/**
	 * Returns the currently-bound ContentView Pict view instance, or
	 * null if no ContentView is configured / the view isn't registered
	 * yet.
	 */getContentView(){if(!this._config.ContentView)return null;let tmpPict=this._shell._modal&&this._shell._modal.pict;if(!tmpPict||!tmpPict.views)return null;return tmpPict.views[this._config.ContentView]||null;}collapse(){this._setCollapsed(true);}expand(){this._setCollapsed(false);}toggle(){this._setCollapsed(!this.Collapsed);}/**
	 * Unified "show this panel" affordance — this is the shared
	 * codepath every popup trigger should funnel through. Behavior:
	 *
	 *   - If collapsed → expand (which fires OnExpand + re-renders the
	 *     ContentView via the shared transition machinery).
	 *   - If already open → re-render the ContentView (so any newly-
	 *     streamed state is visible) AND briefly flash the panel
	 *     border so the user notices that the existing panel just
	 *     received attention. Avoids the "I clicked a button but
	 *     nothing happened" feeling when the panel was already open.
	 *
	 * Idempotent — safe to call from any number of triggers without
	 * stacking effects.
	 */popup(){if(this.Collapsed){this._setCollapsed(false);}else{// Already open — refresh content + flash for attention.
this._renderContentView();this._flash();}}setSize(pSize){if(typeof pSize!=='number'||!isFinite(pSize))return;this.Size=pSize;this._clampSize();this._applySize();}destroy(pSkipFromShell){this._unwireResponsiveDrawer();if(this.El&&this.El.parentNode)this.El.parentNode.removeChild(this.El);if(!pSkipFromShell){let tmpIdx=this._shell._panels.indexOf(this);if(tmpIdx>=0)this._shell._panels.splice(tmpIdx,1);delete this._shell._panelsByHash[this.Hash];}}// ───────────── internals ─────────────
_clampSize(){if(this.Size<this.MinSize)this.Size=this.MinSize;if(this.Size>this.MaxSize)this.Size=this.MaxSize;}// Responsive drawer — sets up a matchMedia listener for
// `(max-width: <ResponsiveDrawer>px)`. Each crossing flips the
// shell's middle row between row layout (wide) and column layout
// (narrow) by toggling the `pict-modal-shell-drawer-active` class
// on the middle row. The matching CSS makes side panels expand to
// full width with a fixed `DrawerHeight`, becoming top/bottom
// drawers above/below the workspace center. Collapsed in drawer
// mode collapses to height: 0, leaving only the collapse tab.
//
// This pattern is the conventional "responsive sidebar" approach
// (used by retold-remote's content editor) — the user keeps their
// sidebar accessible at narrow widths but it gives the workspace
// room to breathe.
_wireResponsiveDrawer(){if(typeof window==='undefined'||!window.matchMedia)return;this._mediaQuery=window.matchMedia('(max-width: '+this.ResponsiveDrawer+'px)');// Apply the drawer height as a CSS variable on the panel
// element so the static CSS rules can read it. Doing this once
// here avoids per-event JS style writes.
if(this.El){this.El.style.setProperty('--pict-modal-drawer-height',this.DrawerHeight);}let tmpSelf=this;this._mediaQueryHandler=function(pEvent){let tmpNarrow=pEvent&&typeof pEvent.matches==='boolean'?pEvent.matches:tmpSelf._mediaQuery.matches;tmpSelf._setDrawerMode(tmpNarrow);};// Apply the current state immediately (handles the case where the
// page loads already-narrow). Newer browsers use addEventListener;
// older ones use addListener.
if(this._mediaQuery.addEventListener){this._mediaQuery.addEventListener('change',this._mediaQueryHandler);}else if(this._mediaQuery.addListener){this._mediaQuery.addListener(this._mediaQueryHandler);}this._mediaQueryHandler({matches:this._mediaQuery.matches});// Belt + suspenders: also listen to window resize and re-sync.
// `matchMedia.change` is supposed to be reliable on every
// boundary crossing, but in real-world testing (esp. when the
// user is dragging DevTools to resize the inner viewport, or
// going through fast successive crossings) we've seen the
// change event silently miss. A plain resize listener is
// cheap and the handler is idempotent — if matches state
// hasn't actually changed the body of `_setDrawerMode` is a
// no-op (it short-circuits when classes are already correct).
this._resizeHandler=function(){tmpSelf._setDrawerMode(tmpSelf._mediaQuery.matches);};window.addEventListener('resize',this._resizeHandler);}_unwireResponsiveDrawer(){if(this._resizeHandler&&typeof window!=='undefined'){window.removeEventListener('resize',this._resizeHandler);this._resizeHandler=null;}if(!this._mediaQuery||!this._mediaQueryHandler)return;if(this._mediaQuery.removeEventListener){this._mediaQuery.removeEventListener('change',this._mediaQueryHandler);}else if(this._mediaQuery.removeListener){this._mediaQuery.removeListener(this._mediaQueryHandler);}this._mediaQuery=null;this._mediaQueryHandler=null;}// Toggle drawer mode by adding / removing a class on the shell's
// middle row. The CSS rule for `.pict-modal-shell-drawer-active`
// flips flex-direction column, makes side panels full-width, and
// applies the panel's `--pict-modal-drawer-height` for sizing.
// Also tags the panel itself so per-panel CSS can target it.
// Re-applies the inline size at the end so the wide-mode crossing
// gets a clean width back (drawer mode forced width: 100% via CSS
// !important; the inline style was stale).
_setDrawerMode(pDrawer){if(!this._shell||!this._shell._middleRow)return;// Idempotent — short-circuit when the panel's drawer state
// already matches the target. Keeps the resize-event fallback
// (which fires constantly during drag-resize) from doing
// pointless DOM thrash + style re-application every frame.
let tmpCurrentlyDrawer=!!(this.El&&this.El.classList.contains('pict-modal-shell-panel-drawer'));if(tmpCurrentlyDrawer===!!pDrawer)return;if(pDrawer){this._shell._middleRow.classList.add('pict-modal-shell-drawer-active');if(this.El){this.El.classList.add('pict-modal-shell-panel-drawer');}}else{// Only remove the row-level class if NO other panel still
// wants drawer mode. Multi-panel hosts can safely each opt
// in independently this way.
let tmpStillNarrow=false;let tmpPanels=this._shell._panels||[];for(let i=0;i<tmpPanels.length;i++){let tmpP=tmpPanels[i];if(tmpP!==this&&tmpP._mediaQuery&&tmpP._mediaQuery.matches&&tmpP.ResponsiveDrawer>0){tmpStillNarrow=true;break;}}if(!tmpStillNarrow){this._shell._middleRow.classList.remove('pict-modal-shell-drawer-active');}if(this.El){this.El.classList.remove('pict-modal-shell-panel-drawer');}}// Re-apply inline size. In drawer mode the CSS !important
// rule overrides this anyway, but on the wide crossing we
// need the inline width to be correct so the panel shows up
// at its proper docked / collapsed-docked size rather than
// inheriting any stale state.
this._applySize();}_buildEl(pConfig){let tmpRoot=document.createElement('div');tmpRoot.className='pict-modal-shell-panel pict-modal-shell-panel-'+this.Side+' pict-modal-shell-panel-mode-'+this.Mode+(this.Position==='overlay'?' pict-modal-shell-panel-overlay':'')+(this.Hidden?' pict-modal-shell-panel-hidden':'');tmpRoot.setAttribute('data-shell-panel-hash',this.Hash);tmpRoot.setAttribute('data-shell-panel-side',this.Side);tmpRoot.setAttribute('data-shell-panel-mode',this.Mode);// Content area — hosts render their stuff into the inner #id div.
let tmpContentWrap=document.createElement('div');tmpContentWrap.className='pict-modal-shell-panel-content';this._contentEl=document.createElement('div');if(pConfig.ContentDestinationId){this._contentEl.id=pConfig.ContentDestinationId;}this._contentEl.className='pict-modal-shell-panel-content-inner';tmpContentWrap.appendChild(this._contentEl);tmpRoot.appendChild(tmpContentWrap);// Collapse tab — shown when collapsible / resizable. Lives at the
// inner edge so it's always reachable when the panel is collapsed.
// Hidden panels skip the tab entirely — the only path back from
// collapsed → expanded is a programmatic expand() / toggle() call
// from the host (e.g. a topbar gear button).
if((this.Mode==='collapsible'||this.Mode==='resizable')&&!this.Hidden){this._collapseTab=document.createElement('button');this._collapseTab.type='button';this._collapseTab.className='pict-modal-shell-panel-collapse-tab';this._collapseTab.setAttribute('aria-label',this.Title?'Toggle '+this.Title:'Toggle panel');this._collapseTab.title=this.Title||'Toggle';this._collapseTab.innerHTML=''+(this.Icon?'<span class="pict-modal-shell-panel-collapse-tab-icon">'+this.Icon+'</span>':'')+(this.Title?'<span class="pict-modal-shell-panel-collapse-tab-title">'+this._escape(this.Title)+'</span>':'');let tmpSelf=this;this._collapseTab.addEventListener('click',function(){tmpSelf.toggle();});tmpRoot.appendChild(this._collapseTab);}// Resize handle — only when resizable. Positioned via CSS based
// on side.
if(this.Mode==='resizable'){this._resizeHandle=document.createElement('div');this._resizeHandle.className='pict-modal-shell-panel-resize-handle';this._resizeHandle.setAttribute('aria-hidden','true');let tmpSelf=this;this._resizeHandle.addEventListener('pointerdown',function(pEvent){if(tmpSelf.Collapsed)return;tmpSelf._shell._attachDragStart(tmpSelf,pEvent);});tmpRoot.appendChild(this._resizeHandle);}this.El=tmpRoot;}_applySize(){let tmpEffective=this.Collapsed?this.CollapsedSize:this.Size;if(this.Side==='left'||this.Side==='right'){this.El.style.width=tmpEffective+'px';this.El.style.height='';}else{this.El.style.height=tmpEffective+'px';this.El.style.width='';}}_applyCollapsedClass(){if(this.Collapsed)this.El.classList.add('pict-modal-shell-panel-collapsed');else this.El.classList.remove('pict-modal-shell-panel-collapsed');}_setCollapsed(pBool){if(this.Collapsed===!!pBool)return;let tmpWasCollapsed=this.Collapsed;this.Collapsed=!!pBool;this._applyCollapsedClass();this._applySize();this._persist();// Transition-specific hooks fire BEFORE OnToggle so OnExpand
// callers can mutate state (e.g. set focus, re-fetch data) and
// have it reflected by any OnToggle observer that runs after.
if(tmpWasCollapsed&&!this.Collapsed){// collapsed → expanded. Render the bound ContentView so
// freshly-streamed state shows up the moment the panel
// becomes visible (replaces the manual view.render() dance
// hosts used to do in their own runAction-style helpers).
this._renderContentView();this._fireHook('OnExpand');}else if(!tmpWasCollapsed&&this.Collapsed){this._fireHook('OnCollapse');}// Back-compat: OnToggle still fires for both directions.
this._fireHook('OnToggle',this.Collapsed);}_fireHook(pName,pArg){let tmpFn=this._config[pName];if(typeof tmpFn!=='function')return;try{if(typeof pArg!=='undefined'){tmpFn(pArg,this);}else{tmpFn(this);}}catch(pErr){/* host hook failure must not break the panel */}}/**
	 * Render the bound ContentView (if any) into this panel's
	 * destination. Called by the shell on panel creation + on every
	 * collapsed→expanded transition + by popup() when re-flashing an
	 * already-open panel. Silently no-ops when no ContentView is
	 * configured or the view isn't registered yet (boot races).
	 */_renderContentView(){let tmpView=this.getContentView();if(tmpView&&typeof tmpView.render==='function'){try{tmpView.render();}catch(pErr){/* view render failure shouldn't break the panel chrome */}}}/**
	 * Briefly highlight the panel — used by popup() when called on an
	 * already-open panel so the user sees that their click landed.
	 * The class is removed after the CSS animation completes; safe to
	 * re-trigger (timeouts overlap, last one wins on the trailing edge).
	 */_flash(){if(!this.El)return;this.El.classList.add('pict-modal-shell-panel-flash');let tmpSelf=this;clearTimeout(this._flashTimer);this._flashTimer=setTimeout(function(){if(tmpSelf.El)tmpSelf.El.classList.remove('pict-modal-shell-panel-flash');},700);}_persist(){if(!this.PersistEnabled)return;this._shell._savePanelState(this.Hash,{Collapsed:this.Collapsed,Size:this.Size});}_escape(pStr){return String(pStr||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}}// ════════════════════════════════════════════════════════════════════
//  Module exports — used internally by Pict-Section-Modal.shell()
// ════════════════════════════════════════════════════════════════════
class PictModalShellManager{constructor(pModalSection){this._modal=pModalSection;this._shellsByViewport=new WeakMap();}/**
	 * Idempotent — calling shell() twice with the same viewport returns
	 * the same instance.
	 */shell(pViewportSelectorOrEl,pOptions){let tmpEl=typeof pViewportSelectorOrEl==='string'?document.querySelector(pViewportSelectorOrEl):pViewportSelectorOrEl;if(!tmpEl){throw new Error('Pict-Modal-Shell.shell: viewport not found for '+pViewportSelectorOrEl);}let tmpExisting=this._shellsByViewport.get(tmpEl);if(tmpExisting)return tmpExisting;let tmpShell=new PictModalShell(this._modal,tmpEl,pOptions);this._shellsByViewport.set(tmpEl,tmpShell);return tmpShell;}}module.exports=PictModalShellManager;module.exports.PictModalShell=PictModalShell;module.exports.ShellPanel=ShellPanel;module.exports.STORAGE_PREFIX=STORAGE_PREFIX;module.exports.SCHEMA_VERSION=SCHEMA_VERSION;},{}],28:[function(require,module,exports){/**
 * Pict-Modal-Toast
 *
 * Manages toast notification elements with auto-dismiss and stacking.
 */class PictModalToast{constructor(pModal){this._modal=pModal;this._containers={};}/**
	 * Show a toast notification.
	 *
	 * @param {string} pMessage - Toast message text
	 * @param {object} [pOptions] - Options (type, duration, position, dismissible)
	 * @returns {{ dismiss: function }} Handle with dismiss method
	 */toast(pMessage,pOptions){let tmpOptions=Object.assign({},this._modal.options.DefaultToastOptions,pOptions);let tmpContainer=this._getContainer(tmpOptions.position);let tmpId=this._modal._nextId();let tmpToast=document.createElement('div');tmpToast.className='pict-modal-toast pict-modal-toast--'+tmpOptions.type;tmpToast.id='pict-modal-toast-'+tmpId;let tmpContent='<span class="pict-modal-toast-message">'+this._escapeHTML(pMessage)+'</span>';if(tmpOptions.dismissible){tmpContent+='<button class="pict-modal-toast-dismiss" aria-label="Dismiss">&times;</button>';}tmpToast.innerHTML=tmpContent;// Create handle
let tmpDismissed=false;let tmpTimeoutHandle=null;let tmpDismiss=()=>{if(tmpDismissed){return;}tmpDismissed=true;if(tmpTimeoutHandle){clearTimeout(tmpTimeoutHandle);}// Exit animation
tmpToast.classList.remove('pict-modal-visible');tmpToast.classList.add('pict-modal-toast-exit');// Remove from active list
this._modal._activeToasts=this._modal._activeToasts.filter(pEntry=>{return pEntry.element!==tmpToast;});// Remove from DOM after transition
setTimeout(()=>{if(tmpToast.parentNode){tmpToast.parentNode.removeChild(tmpToast);}this._cleanupContainer(tmpOptions.position);},220);};let tmpHandle={dismiss:tmpDismiss};// Wire dismiss button
if(tmpOptions.dismissible){let tmpDismissBtn=tmpToast.querySelector('.pict-modal-toast-dismiss');if(tmpDismissBtn){tmpDismissBtn.addEventListener('click',tmpDismiss);}}// Append to container
tmpContainer.appendChild(tmpToast);// Track
let tmpEntry={element:tmpToast,dismiss:tmpDismiss,handle:tmpHandle};this._modal._activeToasts.push(tmpEntry);// Animate in
void tmpToast.offsetHeight;tmpToast.classList.add('pict-modal-visible');// Auto-dismiss
if(tmpOptions.duration>0){tmpTimeoutHandle=setTimeout(tmpDismiss,tmpOptions.duration);}return tmpHandle;}/**
	 * Get or create a toast container for the given position.
	 *
	 * @param {string} pPosition - Position key (e.g. 'top-right')
	 * @returns {HTMLElement}
	 */_getContainer(pPosition){if(this._containers[pPosition]){return this._containers[pPosition];}let tmpContainer=document.createElement('div');tmpContainer.className='pict-modal-toast-container pict-modal-toast-container--'+pPosition;document.body.appendChild(tmpContainer);this._containers[pPosition]=tmpContainer;return tmpContainer;}/**
	 * Remove a container if it has no more toasts.
	 *
	 * @param {string} pPosition
	 */_cleanupContainer(pPosition){let tmpContainer=this._containers[pPosition];if(tmpContainer&&tmpContainer.children.length===0){if(tmpContainer.parentNode){tmpContainer.parentNode.removeChild(tmpContainer);}delete this._containers[pPosition];}}/**
	 * Dismiss all active toasts.
	 */dismissAll(){let tmpToasts=this._modal._activeToasts.slice();for(let i=0;i<tmpToasts.length;i++){tmpToasts[i].dismiss();}}/**
	 * Destroy all containers.
	 */destroy(){this.dismissAll();let tmpPositions=Object.keys(this._containers);for(let i=0;i<tmpPositions.length;i++){let tmpContainer=this._containers[tmpPositions[i]];if(tmpContainer&&tmpContainer.parentNode){tmpContainer.parentNode.removeChild(tmpContainer);}}this._containers={};}/**
	 * Escape HTML special characters.
	 *
	 * @param {string} pText
	 * @returns {string}
	 */_escapeHTML(pText){if(typeof pText!=='string'){return'';}return pText.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}}module.exports=PictModalToast;},{}],29:[function(require,module,exports){/**
 * Pict-Modal-Tooltip
 *
 * Manages simple text and rich HTML tooltips with positioning and auto-flip.
 */class PictModalTooltip{constructor(pModal){this._modal=pModal;}/**
	 * Attach a simple text tooltip to an element.
	 *
	 * @param {HTMLElement} pElement - Target element
	 * @param {string} pText - Tooltip text
	 * @param {object} [pOptions] - Options (position, delay, maxWidth)
	 * @returns {{ destroy: function }} Handle to remove the tooltip
	 */tooltip(pElement,pText,pOptions){let tmpOptions=Object.assign({},this._modal.options.DefaultTooltipOptions,pOptions);return this._attachTooltip(pElement,pText,false,tmpOptions);}/**
	 * Attach a rich HTML tooltip to an element.
	 *
	 * @param {HTMLElement} pElement - Target element
	 * @param {string} pHTMLContent - HTML content for the tooltip
	 * @param {object} [pOptions] - Options (position, delay, maxWidth, interactive)
	 * @returns {{ destroy: function }} Handle to remove the tooltip
	 */richTooltip(pElement,pHTMLContent,pOptions){let tmpOptions=Object.assign({},this._modal.options.DefaultTooltipOptions,pOptions);return this._attachTooltip(pElement,pHTMLContent,true,tmpOptions);}/**
	 * Internal: attach tooltip event listeners to an element.
	 *
	 * @param {HTMLElement} pElement
	 * @param {string} pContent
	 * @param {boolean} pIsHTML
	 * @param {object} pOptions
	 * @returns {{ destroy: function }}
	 */_attachTooltip(pElement,pContent,pIsHTML,pOptions){let tmpTooltipElement=null;let tmpShowTimeout=null;let tmpHideTimeout=null;let tmpDestroyed=false;let tmpId=this._modal._nextId();let tmpShow=()=>{if(tmpDestroyed||tmpTooltipElement){return;}tmpTooltipElement=document.createElement('div');tmpTooltipElement.className='pict-modal-tooltip pict-modal-tooltip--'+pOptions.position;tmpTooltipElement.id='pict-modal-tooltip-'+tmpId;tmpTooltipElement.setAttribute('role','tooltip');tmpTooltipElement.style.maxWidth=pOptions.maxWidth;if(pOptions.interactive){tmpTooltipElement.classList.add('pict-modal-tooltip-interactive');}// Arrow
let tmpArrow=document.createElement('div');tmpArrow.className='pict-modal-tooltip-arrow';// Content
let tmpContentDiv=document.createElement('div');if(pIsHTML){tmpContentDiv.innerHTML=pContent;}else{tmpContentDiv.textContent=pContent;}tmpTooltipElement.appendChild(tmpArrow);tmpTooltipElement.appendChild(tmpContentDiv);document.body.appendChild(tmpTooltipElement);// Set aria-describedby on target
pElement.setAttribute('aria-describedby',tmpTooltipElement.id);// Position
this._positionTooltip(tmpTooltipElement,pElement,pOptions.position);// Animate in
void tmpTooltipElement.offsetHeight;tmpTooltipElement.classList.add('pict-modal-visible');// Track
this._modal._activeTooltips.push({element:tmpTooltipElement,targetElement:pElement,destroy:tmpDestroy});// For interactive tooltips, allow hovering over the tooltip itself
if(pOptions.interactive&&tmpTooltipElement){tmpTooltipElement.addEventListener('mouseenter',()=>{if(tmpHideTimeout){clearTimeout(tmpHideTimeout);tmpHideTimeout=null;}});tmpTooltipElement.addEventListener('mouseleave',()=>{tmpHide();});}};let tmpHide=()=>{if(!tmpTooltipElement){return;}tmpTooltipElement.classList.remove('pict-modal-visible');let tmpEl=tmpTooltipElement;tmpTooltipElement=null;// Remove aria
pElement.removeAttribute('aria-describedby');// Remove from tracking
this._modal._activeTooltips=this._modal._activeTooltips.filter(pEntry=>{return pEntry.element!==tmpEl;});setTimeout(()=>{if(tmpEl.parentNode){tmpEl.parentNode.removeChild(tmpEl);}},220);};let tmpOnMouseEnter=()=>{if(tmpHideTimeout){clearTimeout(tmpHideTimeout);tmpHideTimeout=null;}tmpShowTimeout=setTimeout(tmpShow,pOptions.delay);};let tmpOnMouseLeave=()=>{if(tmpShowTimeout){clearTimeout(tmpShowTimeout);tmpShowTimeout=null;}// Small delay before hiding to allow moving to interactive tooltip
if(pOptions.interactive){tmpHideTimeout=setTimeout(tmpHide,100);}else{tmpHide();}};let tmpOnFocusIn=()=>{tmpShowTimeout=setTimeout(tmpShow,pOptions.delay);};let tmpOnFocusOut=()=>{if(tmpShowTimeout){clearTimeout(tmpShowTimeout);tmpShowTimeout=null;}tmpHide();};// Attach listeners
pElement.addEventListener('mouseenter',tmpOnMouseEnter);pElement.addEventListener('mouseleave',tmpOnMouseLeave);pElement.addEventListener('focusin',tmpOnFocusIn);pElement.addEventListener('focusout',tmpOnFocusOut);let tmpDestroy=()=>{if(tmpDestroyed){return;}tmpDestroyed=true;if(tmpShowTimeout){clearTimeout(tmpShowTimeout);}if(tmpHideTimeout){clearTimeout(tmpHideTimeout);}tmpHide();pElement.removeEventListener('mouseenter',tmpOnMouseEnter);pElement.removeEventListener('mouseleave',tmpOnMouseLeave);pElement.removeEventListener('focusin',tmpOnFocusIn);pElement.removeEventListener('focusout',tmpOnFocusOut);};return{destroy:tmpDestroy};}/**
	 * Position a tooltip element relative to the target element.
	 * Flips direction if the tooltip would overflow the viewport.
	 *
	 * @param {HTMLElement} pTooltip
	 * @param {HTMLElement} pTarget
	 * @param {string} pPosition - 'top', 'bottom', 'left', 'right'
	 */_positionTooltip(pTooltip,pTarget,pPosition){let tmpTargetRect=pTarget.getBoundingClientRect();let tmpTooltipRect=pTooltip.getBoundingClientRect();let tmpGap=8;let tmpPosition=pPosition;// Flip if needed
if(tmpPosition==='top'&&tmpTargetRect.top<tmpTooltipRect.height+tmpGap){tmpPosition='bottom';}else if(tmpPosition==='bottom'&&window.innerHeight-tmpTargetRect.bottom<tmpTooltipRect.height+tmpGap){tmpPosition='top';}else if(tmpPosition==='left'&&tmpTargetRect.left<tmpTooltipRect.width+tmpGap){tmpPosition='right';}else if(tmpPosition==='right'&&window.innerWidth-tmpTargetRect.right<tmpTooltipRect.width+tmpGap){tmpPosition='left';}// Update class for arrow direction
pTooltip.className=pTooltip.className.replace(/pict-modal-tooltip--\w+/,'pict-modal-tooltip--'+tmpPosition);let tmpTop=0;let tmpLeft=0;switch(tmpPosition){case'top':tmpTop=tmpTargetRect.top-tmpTooltipRect.height-tmpGap;tmpLeft=tmpTargetRect.left+tmpTargetRect.width/2-tmpTooltipRect.width/2;break;case'bottom':tmpTop=tmpTargetRect.bottom+tmpGap;tmpLeft=tmpTargetRect.left+tmpTargetRect.width/2-tmpTooltipRect.width/2;break;case'left':tmpTop=tmpTargetRect.top+tmpTargetRect.height/2-tmpTooltipRect.height/2;tmpLeft=tmpTargetRect.left-tmpTooltipRect.width-tmpGap;break;case'right':tmpTop=tmpTargetRect.top+tmpTargetRect.height/2-tmpTooltipRect.height/2;tmpLeft=tmpTargetRect.right+tmpGap;break;}// Clamp to viewport
tmpLeft=Math.max(4,Math.min(tmpLeft,window.innerWidth-tmpTooltipRect.width-4));tmpTop=Math.max(4,Math.min(tmpTop,window.innerHeight-tmpTooltipRect.height-4));pTooltip.style.top=tmpTop+'px';pTooltip.style.left=tmpLeft+'px';}/**
	 * Dismiss all active tooltips.
	 */dismissAll(){let tmpTooltips=this._modal._activeTooltips.slice();for(let i=0;i<tmpTooltips.length;i++){tmpTooltips[i].destroy();}}}module.exports=PictModalTooltip;},{}],30:[function(require,module,exports){/**
 * Pict-Modal-Window
 *
 * Builds custom floating modal windows with arbitrary content and buttons.
 */class PictModalWindow{constructor(pModal){this._modal=pModal;}/**
	 * Show a custom modal window.
	 *
	 * @param {object} [pOptions] - Options
	 * @param {string} [pOptions.title] - Dialog title
	 * @param {string} [pOptions.content] - HTML content for the body
	 * @param {Array} [pOptions.buttons] - Array of { Hash, Label, Style }
	 * @param {boolean} [pOptions.closeable] - Whether the close button and overlay dismiss are enabled
	 * @param {string} [pOptions.width] - CSS width value
	 * @param {boolean} [pOptions.unbounded] - If true, removes the default 90vh/90vw viewport cap. The dialog will grow with its content and may extend beyond the viewport.
	 * @param {function} [pOptions.onOpen] - Called after dialog is shown, receives dialog element
	 * @param {function} [pOptions.onClose] - Called after dialog is dismissed
	 * @returns {Promise<string|null>} Resolves with clicked button Hash, or null on close
	 */show(pOptions){let tmpOptions=Object.assign({},this._modal.options.DefaultModalOptions,pOptions);return new Promise(fResolve=>{let tmpDialog=this._buildDialog(tmpOptions,fResolve);this._showDialog(tmpDialog,tmpOptions,fResolve);});}/**
	 * Build the modal dialog element.
	 *
	 * @param {object} pOptions
	 * @param {function} fResolve
	 * @returns {HTMLElement}
	 */_buildDialog(pOptions,fResolve){let tmpId=this._modal._nextId();let tmpDialog=document.createElement('div');tmpDialog.className='pict-modal-dialog';if(pOptions.unbounded){tmpDialog.className+=' pict-modal-dialog--unbounded';}tmpDialog.id='pict-modal-'+tmpId;tmpDialog.setAttribute('role','dialog');tmpDialog.setAttribute('aria-modal','true');tmpDialog.style.width=pOptions.width;// Header
let tmpHeaderHTML='';if(pOptions.title||pOptions.closeable){tmpHeaderHTML='<div class="pict-modal-dialog-header">';tmpHeaderHTML+='<span class="pict-modal-dialog-title">'+this._escapeHTML(pOptions.title)+'</span>';if(pOptions.closeable){tmpHeaderHTML+='<button class="pict-modal-dialog-close" aria-label="Close">&times;</button>';}tmpHeaderHTML+='</div>';}// Body
let tmpBodyHTML='<div class="pict-modal-dialog-body">'+(pOptions.content||'')+'</div>';// Footer with buttons
let tmpFooterHTML='';if(pOptions.buttons&&pOptions.buttons.length>0){tmpFooterHTML='<div class="pict-modal-dialog-footer">';for(let i=0;i<pOptions.buttons.length;i++){let tmpButton=pOptions.buttons[i];let tmpBtnClass='pict-modal-btn';if(tmpButton.Style){tmpBtnClass+=' pict-modal-btn--'+tmpButton.Style;}tmpFooterHTML+='<button class="'+tmpBtnClass+'" data-hash="'+this._escapeHTML(tmpButton.Hash)+'">'+this._escapeHTML(tmpButton.Label)+'</button>';}tmpFooterHTML+='</div>';}tmpDialog.innerHTML=tmpHeaderHTML+tmpBodyHTML+tmpFooterHTML;let tmpDismiss=pResult=>{this._dismissDialog(tmpDialog,pResult,fResolve,pOptions);};// Wire close button
if(pOptions.closeable){let tmpCloseBtn=tmpDialog.querySelector('.pict-modal-dialog-close');if(tmpCloseBtn){tmpCloseBtn.addEventListener('click',()=>{tmpDismiss(null);});}}// Wire action buttons
let tmpActionButtons=tmpDialog.querySelectorAll('[data-hash]');for(let i=0;i<tmpActionButtons.length;i++){let tmpBtn=tmpActionButtons[i];tmpBtn.addEventListener('click',()=>{tmpDismiss(tmpBtn.getAttribute('data-hash'));});}tmpDialog._dismiss=tmpDismiss;return tmpDialog;}/**
	 * Show the dialog: append to body, show overlay, animate in.
	 *
	 * @param {HTMLElement} pDialog
	 * @param {object} pOptions
	 * @param {function} fResolve
	 */_showDialog(pDialog,pOptions,fResolve){let tmpModalEntry={element:pDialog,dismiss:pDialog._dismiss,type:'window'};// Show overlay
let tmpOverlayClickHandler=null;if(this._modal.options.OverlayClickDismisses&&pOptions.closeable){tmpOverlayClickHandler=()=>{pDialog._dismiss(null);};}this._modal._overlay.show(tmpOverlayClickHandler);// Append to body
document.body.appendChild(pDialog);// Track
this._modal._activeModals.push(tmpModalEntry);// Animate in
void pDialog.offsetHeight;pDialog.classList.add('pict-modal-visible');// Focus first button or close button
let tmpFocusTarget=pDialog.querySelector('.pict-modal-btn')||pDialog.querySelector('.pict-modal-dialog-close');if(tmpFocusTarget){tmpFocusTarget.focus();}// Keyboard handler
pDialog._keyHandler=pEvent=>{if(pEvent.key==='Escape'&&pOptions.closeable){pDialog._dismiss(null);}};document.addEventListener('keydown',pDialog._keyHandler);// onOpen callback
if(typeof pOptions.onOpen==='function'){pOptions.onOpen(pDialog);}}/**
	 * Dismiss the dialog: animate out, remove from DOM, hide overlay.
	 *
	 * @param {HTMLElement} pDialog
	 * @param {*} pResult
	 * @param {function} fResolve
	 * @param {object} pOptions
	 */_dismissDialog(pDialog,pResult,fResolve,pOptions){if(pDialog._dismissed){return;}pDialog._dismissed=true;if(pDialog._keyHandler){document.removeEventListener('keydown',pDialog._keyHandler);}pDialog.classList.remove('pict-modal-visible');this._modal._activeModals=this._modal._activeModals.filter(pEntry=>{return pEntry.element!==pDialog;});if(this._modal._activeModals.length>0){let tmpTopModal=this._modal._activeModals[this._modal._activeModals.length-1];this._modal._overlay.updateClickHandler(this._modal.options.OverlayClickDismisses?tmpTopModal.dismiss:null);}this._modal._overlay.hide();setTimeout(()=>{if(pDialog.parentNode){pDialog.parentNode.removeChild(pDialog);}},220);if(typeof pOptions.onClose==='function'){pOptions.onClose(pResult);}fResolve(pResult);}/**
	 * Escape HTML special characters.
	 *
	 * @param {string} pText
	 * @returns {string}
	 */_escapeHTML(pText){if(typeof pText!=='string'){return'';}return pText.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}}module.exports=PictModalWindow;},{}],31:[function(require,module,exports){module.exports={"AutoInitialize":true,"AutoRender":false,"AutoSolveWithApp":false,"ViewIdentifier":"Pict-Section-Modal","OverlayClickDismisses":true,"DefaultConfirmOptions":{"title":"Confirm","confirmLabel":"OK","cancelLabel":"Cancel","dangerous":false,"unbounded":false},"DefaultDoubleConfirmOptions":{"title":"Are you sure?","confirmLabel":"Confirm","cancelLabel":"Cancel","phrasePrompt":"Type \"{phrase}\" to confirm:","confirmPhrase":"","unbounded":false},"DefaultModalOptions":{"title":"","content":"","buttons":[],"closeable":true,"width":"480px","unbounded":false},"DefaultTooltipOptions":{"position":"top","delay":200,"maxWidth":"300px","interactive":false},"DefaultToastOptions":{"type":"info","duration":3000,"position":"top-right","dismissible":true},"DefaultPanelOptions":{"position":"right","width":340,"minWidth":200,"maxWidth":600,"collapsible":true,"collapsed":false,"persist":false,"persistKey":""},"Templates":[],"Renderables":[],"CSS":/*css*/`
/* pict-section-modal */
.pict-modal-root
{
	/* Defaults are routed through pict-provider-theme tokens so apps
	   using the theme provider get themed modals automatically.  Each
	   var() carries its original hex as the fallback so apps that don't
	   install pict-provider-theme look exactly as before.  Apps may
	   still override any --pict-modal-* var directly to layer over the
	   theme-driven defaults. */

	/* Overlay */
	--pict-modal-overlay-bg: rgba(0, 0, 0, 0.5);

	/* Dialog */
	--pict-modal-bg:                  var(--theme-color-background-panel,  #ffffff);
	--pict-modal-fg:                  var(--theme-color-text-primary,      #1a1a1a);
	--pict-modal-border:              var(--theme-color-border-default,    #e0e0e0);
	--pict-modal-border-radius:       8px;
	--pict-modal-shadow:              0 4px 24px rgba(0, 0, 0, 0.15);
	--pict-modal-header-bg:           var(--theme-color-background-secondary, #f5f5f5);
	--pict-modal-header-fg:           var(--theme-color-text-primary,      #1a1a1a);
	--pict-modal-header-border:       var(--theme-color-border-default,    #e0e0e0);

	/* Buttons */
	--pict-modal-btn-bg:              var(--theme-color-background-secondary, #e0e0e0);
	--pict-modal-btn-fg:              var(--theme-color-text-primary,      #1a1a1a);
	--pict-modal-btn-hover-bg:        var(--theme-color-background-hover,  #d0d0d0);
	--pict-modal-btn-primary-bg:      var(--theme-color-brand-primary,     #2563eb);
	--pict-modal-btn-primary-fg:      var(--theme-color-text-on-brand,     #ffffff);
	--pict-modal-btn-primary-hover-bg:var(--theme-color-brand-primary-hover,#1d4ed8);
	--pict-modal-btn-danger-bg:       var(--theme-color-status-error,      #dc2626);
	--pict-modal-btn-danger-fg:       var(--theme-color-text-on-brand,     #ffffff);
	--pict-modal-btn-danger-hover-bg: var(--theme-color-status-error,      #b91c1c);
	--pict-modal-btn-border-radius:   4px;

	/* Toast */
	--pict-modal-toast-bg:            var(--theme-color-background-panel,  #333333);
	--pict-modal-toast-fg:            var(--theme-color-text-primary,      #ffffff);
	--pict-modal-toast-success-bg:    var(--theme-color-status-success,    #16a34a);
	--pict-modal-toast-warning-bg:    var(--theme-color-status-warning,    #d97706);
	--pict-modal-toast-error-bg:      var(--theme-color-status-error,      #dc2626);
	--pict-modal-toast-info-bg:       var(--theme-color-status-info,       #2563eb);
	--pict-modal-toast-border-radius: 6px;
	--pict-modal-toast-shadow:        0 2px 12px rgba(0, 0, 0, 0.15);

	/* Tooltip */
	--pict-modal-tooltip-bg:          var(--theme-color-background-tertiary,#1a1a1a);
	--pict-modal-tooltip-fg:          var(--theme-color-text-primary,      #ffffff);
	--pict-modal-tooltip-border-radius:4px;
	--pict-modal-tooltip-shadow:      0 2px 8px rgba(0, 0, 0, 0.15);

	/* Dropdown */
	--pict-modal-dropdown-bg:                 var(--theme-color-background-panel,  #ffffff);
	--pict-modal-dropdown-fg:                 var(--theme-color-text-primary,      #1a1a1a);
	--pict-modal-dropdown-border:             var(--theme-color-border-default,    #e0e0e0);
	--pict-modal-dropdown-border-radius:      6px;
	--pict-modal-dropdown-shadow:             0 6px 18px rgba(0, 0, 0, 0.18);
	--pict-modal-dropdown-item-hover-bg:      var(--theme-color-background-hover,  rgba(37, 99, 235, 0.10));
	--pict-modal-dropdown-item-hover-fg:      var(--theme-color-text-primary,      #1a1a1a);
	--pict-modal-dropdown-item-disabled-fg:   var(--theme-color-text-muted,        #9aa0a6);
	--pict-modal-dropdown-separator:          var(--theme-color-border-light,      #e8e8e8);
	--pict-modal-dropdown-header-fg:          var(--theme-color-text-secondary,    #6b7280);
	--pict-modal-dropdown-danger-fg:          var(--theme-color-status-error,      #dc2626);
	--pict-modal-dropdown-primary-fg:         var(--theme-color-brand-primary,     #2563eb);

	/* Typography */
	--pict-modal-font-family:         var(--theme-typography-family-sans,  system-ui, -apple-system, sans-serif);
	--pict-modal-font-size:           14px;
	--pict-modal-title-font-size:     16px;

	/* Animation */
	--pict-modal-transition-duration: 200ms;
}

/* Overlay */
.pict-modal-overlay
{
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 1000;
	background: var(--pict-modal-overlay-bg);
	opacity: 0;
	transition: opacity var(--pict-modal-transition-duration) ease;
}

.pict-modal-overlay.pict-modal-visible
{
	opacity: 1;
}

/* Dialog */
.pict-modal-dialog
{
	position: fixed;
	z-index: 1010;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%) translateY(-20px);
	opacity: 0;
	transition: opacity var(--pict-modal-transition-duration) ease,
	            transform var(--pict-modal-transition-duration) ease;

	max-width: 90vw;
	max-height: 90vh;
	display: flex;
	flex-direction: column;

	background: var(--pict-modal-bg);
	color: var(--pict-modal-fg);
	border: 1px solid var(--pict-modal-border);
	border-radius: var(--pict-modal-border-radius);
	box-shadow: var(--pict-modal-shadow);
	font-family: var(--pict-modal-font-family);
	font-size: var(--pict-modal-font-size);
}

.pict-modal-dialog.pict-modal-visible
{
	opacity: 1;
	transform: translate(-50%, -50%) translateY(0);
}

/* Unbounded modifier — lets callers opt out of the 90vh/90vw viewport cap.
   Use with caution: content taller than the viewport will push buttons
   below the fold. */
.pict-modal-dialog.pict-modal-dialog--unbounded
{
	max-height: none;
	max-width: none;
}

.pict-modal-dialog-header
{
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12px 16px;
	background: var(--pict-modal-header-bg);
	color: var(--pict-modal-header-fg);
	border-bottom: 1px solid var(--pict-modal-header-border);
	border-radius: var(--pict-modal-border-radius) var(--pict-modal-border-radius) 0 0;
}

.pict-modal-dialog-title
{
	font-size: var(--pict-modal-title-font-size);
	font-weight: 600;
}

.pict-modal-dialog-close
{
	background: none;
	border: none;
	font-size: 20px;
	cursor: pointer;
	color: var(--pict-modal-fg);
	padding: 0 4px;
	line-height: 1;
	opacity: 0.6;
}

.pict-modal-dialog-close:hover
{
	opacity: 1;
}

.pict-modal-dialog-body
{
	padding: 16px;
	overflow-y: auto;
	flex: 1;
}

.pict-modal-dialog-footer
{
	display: flex;
	justify-content: flex-end;
	gap: 8px;
	padding: 12px 16px;
	border-top: 1px solid var(--pict-modal-border);
}

/* Buttons */
.pict-modal-btn
{
	padding: 8px 16px;
	border: none;
	border-radius: var(--pict-modal-btn-border-radius);
	font-family: var(--pict-modal-font-family);
	font-size: var(--pict-modal-font-size);
	cursor: pointer;
	background: var(--pict-modal-btn-bg);
	color: var(--pict-modal-btn-fg);
	transition: background var(--pict-modal-transition-duration) ease;
}

.pict-modal-btn:hover
{
	background: var(--pict-modal-btn-hover-bg);
}

.pict-modal-btn:disabled
{
	opacity: 0.5;
	cursor: not-allowed;
}

.pict-modal-btn--primary
{
	background: var(--pict-modal-btn-primary-bg);
	color: var(--pict-modal-btn-primary-fg);
}

.pict-modal-btn--primary:hover
{
	background: var(--pict-modal-btn-primary-hover-bg);
}

.pict-modal-btn--danger
{
	background: var(--pict-modal-btn-danger-bg);
	color: var(--pict-modal-btn-danger-fg);
}

.pict-modal-btn--danger:hover
{
	background: var(--pict-modal-btn-danger-hover-bg);
}

/* Double confirm input */
.pict-modal-confirm-input
{
	width: 100%;
	padding: 8px 12px;
	margin-top: 12px;
	border: 1px solid var(--pict-modal-border);
	border-radius: var(--pict-modal-btn-border-radius);
	font-family: var(--pict-modal-font-family);
	font-size: var(--pict-modal-font-size);
	box-sizing: border-box;
}

.pict-modal-confirm-input:focus
{
	outline: 2px solid var(--pict-modal-btn-primary-bg);
	outline-offset: -1px;
}

.pict-modal-confirm-prompt
{
	margin-top: 12px;
	font-size: 13px;
	color: var(--pict-modal-fg);
	opacity: 0.7;
}

/* Toast container */
.pict-modal-toast-container
{
	position: fixed;
	z-index: 1030;
	display: flex;
	flex-direction: column;
	gap: 8px;
	pointer-events: none;
	max-width: 400px;
}

.pict-modal-toast-container--top-right
{
	top: 16px;
	right: 16px;
}

.pict-modal-toast-container--top-left
{
	top: 16px;
	left: 16px;
}

.pict-modal-toast-container--bottom-right
{
	bottom: 16px;
	right: 16px;
}

.pict-modal-toast-container--bottom-left
{
	bottom: 16px;
	left: 16px;
}

.pict-modal-toast-container--top-center
{
	top: 16px;
	left: 50%;
	transform: translateX(-50%);
}

.pict-modal-toast-container--bottom-center
{
	bottom: 16px;
	left: 50%;
	transform: translateX(-50%);
}

/* Toast */
.pict-modal-toast
{
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 12px 16px;
	border-radius: var(--pict-modal-toast-border-radius);
	box-shadow: var(--pict-modal-toast-shadow);
	font-family: var(--pict-modal-font-family);
	font-size: var(--pict-modal-font-size);
	background: var(--pict-modal-toast-bg);
	color: var(--pict-modal-toast-fg);
	pointer-events: auto;
	opacity: 0;
	transform: translateX(100%);
	transition: opacity var(--pict-modal-transition-duration) ease,
	            transform var(--pict-modal-transition-duration) ease;
}

.pict-modal-toast.pict-modal-visible
{
	opacity: 1;
	transform: translateX(0);
}

.pict-modal-toast.pict-modal-toast-exit
{
	opacity: 0;
	transform: translateX(100%);
}

.pict-modal-toast--info
{
	background: var(--pict-modal-toast-info-bg);
}

.pict-modal-toast--success
{
	background: var(--pict-modal-toast-success-bg);
}

.pict-modal-toast--warning
{
	background: var(--pict-modal-toast-warning-bg);
}

.pict-modal-toast--error
{
	background: var(--pict-modal-toast-error-bg);
}

.pict-modal-toast-message
{
	flex: 1;
}

.pict-modal-toast-dismiss
{
	background: none;
	border: none;
	color: inherit;
	font-size: 18px;
	cursor: pointer;
	padding: 0 2px;
	line-height: 1;
	opacity: 0.7;
}

.pict-modal-toast-dismiss:hover
{
	opacity: 1;
}

/* Tooltip */
.pict-modal-tooltip
{
	position: fixed;
	z-index: 1020;
	padding: 6px 10px;
	border-radius: var(--pict-modal-tooltip-border-radius);
	box-shadow: var(--pict-modal-tooltip-shadow);
	background: var(--pict-modal-tooltip-bg);
	color: var(--pict-modal-tooltip-fg);
	font-family: var(--pict-modal-font-family);
	font-size: 13px;
	pointer-events: none;
	opacity: 0;
	transition: opacity var(--pict-modal-transition-duration) ease;
	white-space: normal;
	word-wrap: break-word;
}

.pict-modal-tooltip.pict-modal-tooltip-interactive
{
	pointer-events: auto;
}

.pict-modal-tooltip.pict-modal-visible
{
	opacity: 1;
}

.pict-modal-tooltip-arrow
{
	position: absolute;
	width: 8px;
	height: 8px;
	background: var(--pict-modal-tooltip-bg);
	transform: rotate(45deg);
}

.pict-modal-tooltip--top .pict-modal-tooltip-arrow
{
	bottom: -4px;
	left: 50%;
	margin-left: -4px;
}

.pict-modal-tooltip--bottom .pict-modal-tooltip-arrow
{
	top: -4px;
	left: 50%;
	margin-left: -4px;
}

.pict-modal-tooltip--left .pict-modal-tooltip-arrow
{
	right: -4px;
	top: 50%;
	margin-top: -4px;
}

.pict-modal-tooltip--right .pict-modal-tooltip-arrow
{
	left: -4px;
	top: 50%;
	margin-top: -4px;
}

/* ── Dropdown ─────────────────────────────────────────────────────────
   Anchor-positioned menu (no overlay). Used for nav menus and
   "split button" addenda — see Pict-Modal-Dropdown.js.
*/
.pict-modal-dropdown
{
	position: fixed;
	z-index: 1025;
	min-width: 160px;
	max-width: 360px;
	max-height: 60vh;
	overflow-y: auto;
	background: var(--pict-modal-dropdown-bg);
	color: var(--pict-modal-dropdown-fg);
	border: 1px solid var(--pict-modal-dropdown-border);
	border-radius: var(--pict-modal-dropdown-border-radius);
	box-shadow: var(--pict-modal-dropdown-shadow);
	font-family: var(--pict-modal-font-family);
	font-size: var(--pict-modal-font-size);
	padding: 4px 0;
	opacity: 0;
	transform: translateY(-4px);
	transition: opacity var(--pict-modal-transition-duration) ease,
	            transform var(--pict-modal-transition-duration) ease;
}

.pict-modal-dropdown.pict-modal-dropdown--above { transform: translateY(4px); }

.pict-modal-dropdown.pict-modal-visible
{
	opacity: 1;
	transform: translateY(0);
}

.pict-modal-dropdown-item
{
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 7px 14px;
	cursor: pointer;
	user-select: none;
	color: inherit;
	outline: none;
}

.pict-modal-dropdown-item:hover,
.pict-modal-dropdown-item:focus
{
	background: var(--pict-modal-dropdown-item-hover-bg);
	color: var(--pict-modal-dropdown-item-hover-fg);
}

.pict-modal-dropdown-item--disabled
{
	cursor: not-allowed;
	color: var(--pict-modal-dropdown-item-disabled-fg);
}

.pict-modal-dropdown-item--disabled:hover,
.pict-modal-dropdown-item--disabled:focus
{
	background: transparent;
	color: var(--pict-modal-dropdown-item-disabled-fg);
}

.pict-modal-dropdown-item--primary { color: var(--pict-modal-dropdown-primary-fg); }
.pict-modal-dropdown-item--danger  { color: var(--pict-modal-dropdown-danger-fg); }

.pict-modal-dropdown-item-icon
{
	flex: 0 0 auto;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 16px;
	height: 16px;
}

.pict-modal-dropdown-item-icon svg { width: 100%; height: 100%; display: block; }

.pict-modal-dropdown-item-label { flex: 1 1 auto; min-width: 0; }

.pict-modal-dropdown-item-hint
{
	flex: 0 0 auto;
	font-size: 11px;
	opacity: 0.6;
	margin-left: 12px;
}

.pict-modal-dropdown-separator
{
	height: 1px;
	background: var(--pict-modal-dropdown-separator);
	margin: 4px 0;
}

.pict-modal-dropdown-header
{
	padding: 6px 14px 2px;
	font-size: 11px;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.04em;
	color: var(--pict-modal-dropdown-header-fg);
}

/* ── Resizable / Collapsible Panels ──────────────── */
.pict-panel
{
	position: relative;
	transition: width 0.2s ease;
	flex-shrink: 0;
	overflow: visible;
}
.pict-panel-collapsed
{
	width: 0 !important;
	min-width: 0 !important;
	overflow: visible;
}
.pict-panel-collapsed > *:not(.pict-panel-edge)
{
	display: none;
}

/* Edge container — zero-width flex sibling of the panel.
   Sits next to the panel in the flex layout; children
   use absolute positioning to overlap the panel boundary. */
.pict-panel-edge
{
	position: relative;
	width: 0;
	flex-shrink: 0;
	z-index: 50;
	overflow: visible;
}

/* Resize handle — thin strip on the panel boundary */
.pict-panel-resize
{
	position: absolute;
	top: 0;
	bottom: 0;
	width: 4px;
	cursor: col-resize;
	background: transparent;
	transition: background 0.15s, width 0.15s;
}
.pict-panel-edge-right .pict-panel-resize
{
	right: 0;
	border-right: 1px solid var(--pict-panel-border, #DDD6CA);
}
.pict-panel-edge-left .pict-panel-resize
{
	left: 0;
	border-left: 1px solid var(--pict-panel-border, #DDD6CA);
}
.pict-panel-resize:hover,
.pict-panel-edge:hover .pict-panel-resize
{
	width: 5px;
	background: var(--pict-panel-accent, #2E7D74);
	opacity: 0.5;
}
.pict-panel-resize.dragging
{
	width: 5px;
	background: var(--pict-panel-accent, #2E7D74);
	opacity: 1;
	transition: none;
}
.pict-panel-edge-collapsed .pict-panel-resize
{
	display: none;
}

/* Collapse tab — tucked sliver at rest, slides out on hover */
.pict-panel-tab
{
	position: absolute;
	top: 8px;
	width: 8px;
	height: 24px;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	background: var(--pict-panel-border, #DDD6CA);
	border: 1px solid var(--pict-panel-border, #DDD6CA);
	cursor: pointer;
	color: var(--pict-panel-fg, #8A7F72);
	font-size: 10px;
	line-height: 1;
	opacity: 0.5;
	transition: opacity 0.25s, width 0.2s ease, height 0.2s ease, left 0.2s ease, right 0.2s ease, background 0.2s;
	z-index: 51;
}
.pict-panel-edge:hover .pict-panel-tab,
.pict-panel-tab:hover
{
	width: 20px;
	height: 32px;
	opacity: 1;
	overflow: visible;
	background: var(--pict-panel-bg, #FAF8F4);
}
/* Right panel: tab to the left of the edge */
.pict-panel-edge-right .pict-panel-tab
{
	right: 0;
	border-right: none;
	border-radius: 4px 0 0 4px;
}
.pict-panel-edge-right:hover .pict-panel-tab,
.pict-panel-edge-right .pict-panel-tab:hover
{
	right: 0;
}
/* Left panel: tab to the right of the edge */
.pict-panel-edge-left .pict-panel-tab
{
	left: 0;
	border-left: none;
	border-radius: 0 4px 4px 0;
}
.pict-panel-edge-left:hover .pict-panel-tab,
.pict-panel-edge-left .pict-panel-tab:hover
{
	left: 0;
}
/* When collapsed — more visible */
.pict-panel-edge-collapsed .pict-panel-tab
{
	width: 10px;
	height: 28px;
	opacity: 0.6;
}
.pict-panel-edge-collapsed .pict-panel-tab:hover,
.pict-panel-edge-collapsed:hover .pict-panel-tab
{
	width: 20px;
	height: 32px;
	opacity: 1;
	overflow: visible;
	background: var(--pict-panel-bg, #FAF8F4);
}

/* ───────────────────────────────────────────────────────────────────
 *  Pict-Modal-Shell — viewport-managing layout for top / right /
 *  bottom / left panels around a center.
 * ───────────────────────────────────────────────────────────────── */

.pict-modal-shell-host { display: block; height: 100%; min-height: 0; }
.pict-modal-shell
{
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	min-height: 0;
	position: relative;
	color: var(--pict-modal-fg, var(--theme-color-text-primary, #1a1a1a));
	background: var(--theme-color-background-primary, transparent);
}
.pict-modal-shell-row { display: flex; min-width: 0; min-height: 0; }
/* "First added = at the edge" convention is held by reversing the
   flex-direction on the bottom row + right side. That way, for ALL
   four sides, calling addPanel() N times stacks panel #1 against
   the viewport edge, panel #2 just inside it, panel #3 further in,
   and so on. Without these reverses, top + left worked that way but
   bottom + right inverted (first-added at content side, last-added
   at edge), which surprised callers. */
.pict-modal-shell-row-top    { flex: 0 0 auto; flex-direction: column; }
.pict-modal-shell-row-bottom { flex: 0 0 auto; flex-direction: column-reverse; }
.pict-modal-shell-row-middle
{
	flex: 1 1 0;
	flex-direction: row;
	min-height: 0;
	position: relative;
}
.pict-modal-shell-side
{
	display: flex;
	flex: 0 0 auto;
	min-height: 0;
}
.pict-modal-shell-side-left  { flex-direction: row; }
.pict-modal-shell-side-right { flex-direction: row-reverse; }
.pict-modal-shell-center
{
	flex: 1 1 0;
	min-width: 0;
	min-height: 0;
	overflow: auto;
	position: relative;
}
.pict-modal-shell-center-content
{
	min-height: 100%;
}
/* Center column gains this class when at least one Scope:'center'
   panel is added.  The center stops scrolling internally — that job
   moves to the content destination — and switches to a vertical flex
   so the destination and any inner panels stack cleanly. */
.pict-modal-shell-center.pict-modal-shell-center-with-inner-panel
{
	display: flex;
	flex-direction: column;
	overflow: hidden;
}
.pict-modal-shell-center.pict-modal-shell-center-with-inner-panel > .pict-modal-shell-center-content
{
	flex: 1 1 0;
	min-height: 0;
	overflow: auto;
}
.pict-modal-shell-center.pict-modal-shell-center-with-inner-panel > .pict-modal-shell-panel
{
	flex: 0 0 auto;
	width: 100%;
}

/* Panels — base */
.pict-modal-shell-panel
{
	/* How far the collapse-tab's panel-bg "merge bar" extends INTO
	   the panel past the tab's geometric edge. Painted via box-shadow
	   on the tab (no DOM impact), it masks any 1px theme border on an
	   inner element, content padding offset, or resize-handle hover
	   bleed in the strip between the tab's panel-facing edge and the
	   first real pixel of panel content. Consumers can bump this for
	   themes with thicker (2+px) inner borders. */
	--pict-modal-collapse-tab-merge: 2px;
	position: relative;
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
	background: var(--pict-modal-bg, var(--theme-color-background-panel, #ffffff));
	color: inherit;
	min-width: 0;
	min-height: 0;
	transition: width 140ms ease, height 140ms ease;
}
.pict-modal-shell-panel-content
{
	flex: 1 1 auto;
	min-width: 0;
	min-height: 0;
	overflow: auto;
}
/* Fixed-mode panels are pure chrome (topbars, status rows). Their
   content should fit the configured Size exactly — never scroll. The
   1px border that .pict-modal-shell-panel-mode-fixed adds on the
   inner edge shaves 1px off the content's available height, which
   then triggers a sliver-scrollbar on any inner widget with
   min-height matching the panel Size. overflow:hidden here suppresses
   that without affecting resizable/collapsible panels (sidebars,
   drawers) where scrollable content is the whole point. */
.pict-modal-shell-panel-mode-fixed > .pict-modal-shell-panel-content
{
	overflow: hidden;
}
.pict-modal-shell-panel-content-inner
{
	min-height: 100%;
}
/* Panel boundary — fixed-mode panels get a hairline border for explicit
   demarcation. Collapsible / resizable panels DROP the boundary border
   (background contrast separates them from the center anyway) so the
   collapse tab can pull out cleanly without a hairline cutting across
   it. The host stylesheet still gets full control via the panel's own
   background. */
.pict-modal-shell-panel-mode-fixed.pict-modal-shell-panel-top    { border-bottom: 1px solid var(--pict-modal-border, var(--theme-color-border-default, #e0e0e0)); }
.pict-modal-shell-panel-mode-fixed.pict-modal-shell-panel-bottom { border-top:    1px solid var(--pict-modal-border, var(--theme-color-border-default, #e0e0e0)); }
.pict-modal-shell-panel-mode-fixed.pict-modal-shell-panel-left   { border-right:  1px solid var(--pict-modal-border, var(--theme-color-border-default, #e0e0e0)); }
.pict-modal-shell-panel-mode-fixed.pict-modal-shell-panel-right  { border-left:   1px solid var(--pict-modal-border, var(--theme-color-border-default, #e0e0e0)); }

/* Resize handle — absolute on the inner edge of each panel. */
.pict-modal-shell-panel-resize-handle
{
	position: absolute;
	background: transparent;
	z-index: 5;
	transition: background-color 120ms ease;
}
/* Resize handle hover — use the active brand's mode-aware primary
   color (set by pict-section-theme's Brand provider as
   --brand-color-primary-mode) so the resize affordance picks up the
   app's wordmark color. Falls back to the theme's brand-primary
   token if no brand is registered. */
.pict-modal-shell-panel-resize-handle:hover
{
	background: var(--brand-color-primary-mode, var(--theme-color-brand-primary, #2563eb));
	opacity: 0.4;
}
.pict-modal-shell-panel-left   .pict-modal-shell-panel-resize-handle { right: -3px; top: 0; bottom: 0; width: 6px; cursor: col-resize; }
.pict-modal-shell-panel-right  .pict-modal-shell-panel-resize-handle { left:  -3px; top: 0; bottom: 0; width: 6px; cursor: col-resize; }
.pict-modal-shell-panel-top    .pict-modal-shell-panel-resize-handle { bottom:-3px; left: 0; right: 0; height: 6px; cursor: row-resize; }
.pict-modal-shell-panel-bottom .pict-modal-shell-panel-resize-handle { top:   -3px; left: 0; right: 0; height: 6px; cursor: row-resize; }

/* Collapse tab — slim sliver flush on the panel's OUTER boundary
   (where the resize handle sits), modelled on retold-content-system's
   sidebar tab. At rest it's a 6×28 px sliver; hover expands to
   18×36 px without overlapping the panel's own content. The tab is
   positioned with its center on the boundary so half pokes into the
   adjacent area — the only place we can safely take over without
   stepping on app UI inside the panel. Title text only renders in the
   collapsed state where there's room for it. */
.pict-modal-shell-panel-collapse-tab
{
	position: absolute;
	display: flex;            /* not inline-flex — avoids baseline alignment quirks */
	align-items: center;
	justify-content: center;
	overflow: hidden;
	border: 1px solid var(--pict-modal-border, var(--theme-color-border-default, #d0d7de));
	background: var(--pict-modal-bg, var(--theme-color-background-panel, #ffffff));
	color: var(--theme-color-text-muted, #6b7280);
	font: inherit;
	font-size: 10px;
	letter-spacing: 0.4px;
	text-transform: uppercase;
	cursor: pointer;
	z-index: 50;
	opacity: 0.55;
	padding: 0;
	box-sizing: border-box;
	line-height: 0;          /* keep child boxes from inflating around the rotated chevron */
	/* Geometry (width/height/right/left) is intentionally NOT animated.
	   Sliding the tab's outer edge inward on hover-out makes it look like
	   the tab is "sliding into" the panel content — weird visual.
	   Snapping the size change instead, and animating only the appearance
	   (opacity/color/shadow), gives a clean fade-in/out with no boundary
	   weirdness. */
	transition: opacity 160ms ease,
	            background-color 160ms ease, color 160ms ease,
	            border-color 160ms ease, box-shadow 160ms ease;
}
/* Hover state pulls accent color from the active brand (mode-aware,
   so it's legible in both light + dark) with theme brand-primary as
   fallback. The whole point of brand colors is that they show up
   across the app's chrome. */
.pict-modal-shell-panel-collapse-tab:hover,
.pict-modal-shell-panel:hover > .pict-modal-shell-panel-collapse-tab
{
	opacity: 1;
	color:        var(--brand-color-primary-mode, var(--theme-color-brand-primary, #2563eb));
	border-color: var(--brand-color-primary-mode, var(--theme-color-brand-primary, #2563eb));
}
/* Drop shadow casts AWAY from the panel so the tab feels pulled out
   (extension of the panel) rather than floating across the boundary.
   The tab itself is now positioned fully OUTSIDE the panel boundary
   (see the per-side rules below), so we don't need a merge-bar shadow
   to mask any in-panel overlap — only the drop shadow remains. */
.pict-modal-shell-panel-left:hover    > .pict-modal-shell-panel-collapse-tab,
.pict-modal-shell-panel-left    > .pict-modal-shell-panel-collapse-tab:hover
{
	box-shadow: 3px 0 6px -2px rgba(0, 0, 0, 0.18);
}
.pict-modal-shell-panel-right:hover   > .pict-modal-shell-panel-collapse-tab,
.pict-modal-shell-panel-right   > .pict-modal-shell-panel-collapse-tab:hover
{
	box-shadow: -3px 0 6px -2px rgba(0, 0, 0, 0.18);
}
.pict-modal-shell-panel-top:hover     > .pict-modal-shell-panel-collapse-tab,
.pict-modal-shell-panel-top     > .pict-modal-shell-panel-collapse-tab:hover
{
	box-shadow: 0 3px 6px -2px rgba(0, 0, 0, 0.18);
}
.pict-modal-shell-panel-bottom:hover  > .pict-modal-shell-panel-collapse-tab,
.pict-modal-shell-panel-bottom  > .pict-modal-shell-panel-collapse-tab:hover
{
	box-shadow: 0 -3px 6px -2px rgba(0, 0, 0, 0.18);
}

/* Per-side base positioning — the tab lives entirely OUTSIDE the
   panel's outer boundary.  Its panel-facing edge touches the boundary
   (offset = -tabThickness) and the rest of the tab pokes out into the
   adjacent area (center / sibling panel).  Border on the panel-facing
   edge is dropped so the tab looks attached to the panel rather than
   floating beside it.
   Why fully-outside?  Earlier iterations had the tab straddling the
   boundary (1px inside + 4px outside) with a panel-bg-colored merge-bar
   masking the in-panel half — that worked geometrically but visually
   read as "tab pinned into the panel," and any rendering inside the
   panel (especially custom borders or hover bleeds) could clip against
   the in-panel half.  Fully-external positioning eliminates the overlap
   class of bugs and lets the tab live entirely in the adjacent area
   where there's no app content to step on. */
.pict-modal-shell-panel-left  > .pict-modal-shell-panel-collapse-tab
{
	right: -6px; top: 14px; width: 6px; height: 28px;
	border-radius: 0 4px 4px 0;
	border-left: 0;
}
.pict-modal-shell-panel-right > .pict-modal-shell-panel-collapse-tab
{
	left:  -6px; top: 14px; width: 6px; height: 28px;
	border-radius: 4px 0 0 4px;
	border-right: 0;
}
.pict-modal-shell-panel-top    > .pict-modal-shell-panel-collapse-tab
{
	bottom: -6px; right: 14px; width: 28px; height: 6px;
	border-radius: 0 0 4px 4px;
	border-top: 0;
}
.pict-modal-shell-panel-bottom > .pict-modal-shell-panel-collapse-tab
{
	top:    -6px; right: 14px; width: 28px; height: 6px;
	border-radius: 4px 4px 0 0;
	border-bottom: 0;
}

/* Hover: tab grows OUTWARD into the adjacent area.  The panel-facing
   edge stays glued to the boundary (offset = -tabThickness), so the
   tab still looks attached on hover — only its outer dimension grows.
   For side panels the height also grows (28 → 36) downward; for top
   /bottom panels the width grows (28 → 36) — see the next block for
   the perpendicular-axis offsets. */
.pict-modal-shell-panel-left:hover  > .pict-modal-shell-panel-collapse-tab,
.pict-modal-shell-panel-left  > .pict-modal-shell-panel-collapse-tab:hover
{
	width: 18px; height: 36px; right: -18px;
}
.pict-modal-shell-panel-right:hover > .pict-modal-shell-panel-collapse-tab,
.pict-modal-shell-panel-right > .pict-modal-shell-panel-collapse-tab:hover
{
	width: 18px; height: 36px; left: -18px;
}
.pict-modal-shell-panel-top:hover    > .pict-modal-shell-panel-collapse-tab,
.pict-modal-shell-panel-top    > .pict-modal-shell-panel-collapse-tab:hover
{
	width: 36px; height: 18px; bottom: -18px;
}
.pict-modal-shell-panel-bottom:hover > .pict-modal-shell-panel-collapse-tab,
.pict-modal-shell-panel-bottom > .pict-modal-shell-panel-collapse-tab:hover
{
	width: 36px; height: 18px; top: -18px;
}

.pict-modal-shell-panel-collapse-tab-title { display: none; white-space: nowrap; }

/* Auto-generated chevron glyph inside the tab — only visible once the
   tab is wide / tall enough to show it (i.e. hover state, or when the
   panel is collapsed). Direction follows side + state.
   Sized 5×5 (down from 6) so even with rotation the visual stays
   well clear of the tab's overflow:hidden bounds at 18×36 hover and
   the 24px collapsed tab strip width. flex-shrink:0 ensures the
   pseudo never collapses to zero in tight tab dimensions. */
.pict-modal-shell-panel-collapse-tab::before
{
	content: '';
	display: block;
	width: 5px; height: 5px;
	flex-shrink: 0;
	opacity: 0;
	border-right: 1.5px solid currentColor;
	border-bottom: 1.5px solid currentColor;
	transform: rotate(135deg);
	transform-origin: center center;
	transition: opacity 160ms ease, transform 160ms ease;
}
.pict-modal-shell-panel:hover > .pict-modal-shell-panel-collapse-tab::before,
.pict-modal-shell-panel-collapse-tab:hover::before,
.pict-modal-shell-panel-collapsed > .pict-modal-shell-panel-collapse-tab::before
{
	opacity: 1;
}
.pict-modal-shell-panel-right                                       > .pict-modal-shell-panel-collapse-tab::before { transform: rotate(-45deg); }
.pict-modal-shell-panel-top                                         > .pict-modal-shell-panel-collapse-tab::before { transform: rotate(-135deg); }
.pict-modal-shell-panel-bottom                                      > .pict-modal-shell-panel-collapse-tab::before { transform: rotate(45deg); }
.pict-modal-shell-panel-left.pict-modal-shell-panel-collapsed       > .pict-modal-shell-panel-collapse-tab::before { transform: rotate(-45deg); }
.pict-modal-shell-panel-right.pict-modal-shell-panel-collapsed      > .pict-modal-shell-panel-collapse-tab::before { transform: rotate(135deg); }
.pict-modal-shell-panel-top.pict-modal-shell-panel-collapsed        > .pict-modal-shell-panel-collapse-tab::before { transform: rotate(45deg); }
.pict-modal-shell-panel-bottom.pict-modal-shell-panel-collapsed     > .pict-modal-shell-panel-collapse-tab::before { transform: rotate(-135deg); }

/* Collapsed state — content disappears, only the collapse tab remains. */
.pict-modal-shell-panel-collapsed > .pict-modal-shell-panel-content
{
	display: none;
}
.pict-modal-shell-panel-collapsed > .pict-modal-shell-panel-resize-handle
{
	display: none;
}
.pict-modal-shell-panel-left.pict-modal-shell-panel-collapsed,
.pict-modal-shell-panel-right.pict-modal-shell-panel-collapsed
{
	/* When collapsed, side panels rotate the title for vertical reading. */
	overflow: hidden;
}
/* When collapsed: the entire panel becomes the tab strip — full width
   for sides, full height for top/bottom — with the title visible
   vertically (sides) or horizontally (top/bottom). The little sliver
   tab on the boundary disappears (we don't need it anymore — clicking
   anywhere on the panel toggles it back open). */
.pict-modal-shell-panel-left.pict-modal-shell-panel-collapsed,
.pict-modal-shell-panel-right.pict-modal-shell-panel-collapsed,
.pict-modal-shell-panel-top.pict-modal-shell-panel-collapsed,
.pict-modal-shell-panel-bottom.pict-modal-shell-panel-collapsed
{
	overflow: hidden;
}
.pict-modal-shell-panel-collapsed > .pict-modal-shell-panel-collapse-tab
{
	/* Promote the tab to FILL the collapsed panel (not just hug its
	   content) so the centered chevron + title group sits in the middle
	   of the panel. Without explicit width/height: 100%, the position:
	   absolute element shrinks to its natural content size and the
	   group ends up flush at the top of the panel — where the chevron
	   gets clipped by the topbar. */
	position: absolute !important;
	top: 0 !important; right: 0 !important; bottom: 0 !important; left: 0 !important;
	width: 100% !important;
	height: 100% !important;
	border: 0;
	border-radius: 0;
	background: transparent;
	opacity: 0.85;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	padding: 12px 4px;        /* keeps chevron + title clear of edges */
	box-shadow: none;
	color: var(--theme-color-text-muted, #6b7280);
	box-sizing: border-box;
	overflow: hidden;
}
.pict-modal-shell-panel-collapsed > .pict-modal-shell-panel-collapse-tab:hover
{
	background: var(--theme-color-background-hover, var(--pict-modal-bg, #fff));
	color: var(--brand-color-primary-mode, var(--theme-color-brand-primary, #2563eb));
	box-shadow: none;
}
/* Side panels (collapsed): rotate the title for vertical reading. */
.pict-modal-shell-panel-left.pict-modal-shell-panel-collapsed   > .pict-modal-shell-panel-collapse-tab,
.pict-modal-shell-panel-right.pict-modal-shell-panel-collapsed  > .pict-modal-shell-panel-collapse-tab
{
	writing-mode: vertical-rl;
	text-orientation: mixed;
}
.pict-modal-shell-panel-collapsed .pict-modal-shell-panel-collapse-tab-title
{
	display: inline;
}

/* Hidden panels — when Hidden:true is passed to addPanel, the collapsed
   state has zero footprint: no collapse tab (the tab is never built),
   the panel root is display:none, and the resize handle vanishes. The
   only path to the open state is a programmatic expand()/toggle() from
   somewhere else in the app (e.g. a topbar gear button). When expanded,
   the panel renders normally — so resize/drag handles continue to work
   while the panel is open. */
.pict-modal-shell-panel-hidden.pict-modal-shell-panel-collapsed
{
	display: none !important;
}

/* Overlay panels — float over the middle row instead of taking layout
   space. The overlay layer is positioned absolutely inside the middle
   row; individual overlay panels stack with positive z-index. */
.pict-modal-shell-overlay-layer
{
	position: absolute;
	inset: 0;
	pointer-events: none;
	z-index: 10;
}
.pict-modal-shell-overlay-layer .pict-modal-shell-panel
{
	pointer-events: auto;
	position: absolute;
	box-shadow: 0 4px 24px rgba(0, 0, 0, 0.18);
}
.pict-modal-shell-overlay-layer .pict-modal-shell-panel-left   { left:   0; top: 0; bottom: 0; }
.pict-modal-shell-overlay-layer .pict-modal-shell-panel-right  { right:  0; top: 0; bottom: 0; }
.pict-modal-shell-overlay-layer .pict-modal-shell-panel-top    { top:    0; left: 0; right: 0; }
.pict-modal-shell-overlay-layer .pict-modal-shell-panel-bottom { bottom: 0; left: 0; right: 0; }

/* ─────────────────────────────────────────────────────────────────
   Responsive drawer mode — .pict-modal-shell-drawer-active toggles
   onto the middle row when any panel with ResponsiveDrawer crosses
   below its breakpoint. Flips the row's flex-direction from row to
   column, stacking side panels above the center and stretching them
   to full width. Each opted-in panel itself gets the
   .pict-modal-shell-panel-drawer class so per-panel rules below
   target only the drawer-mode panels (right + non-drawer panels in
   the same row are unaffected). The drawer height is read from a
   per-panel --pict-modal-drawer-height CSS variable (default
   33vh, set in JS from the DrawerHeight option).
   ───────────────────────────────────────────────────────────────── */
.pict-modal-shell-row-middle.pict-modal-shell-drawer-active
{
	flex-direction: column;
	/* The drawer tab lives outside the drawer's bottom edge — ancestor
	   chain MUST allow it to escape clip. */
	overflow: visible;
}
.pict-modal-shell-row-middle.pict-modal-shell-drawer-active .pict-modal-shell-side
{
	/* Side stacks stretch full-width and lay out their panels as a
	   horizontal row of stacked drawers (so two drawers from the same
	   side don't end up overlapping). overflow: visible so the
	   per-panel tab can extend below the side stack into the workspace. */
	width: 100% !important;
	flex-direction: column;
	overflow: visible;
}
/* The drawer-tagged panel itself: kill the inline width set by
   _applySize (we override with !important since the inline style has
   higher specificity than a class selector), then size by height
   from the CSS variable. Resize handle is hidden in drawer mode
   because horizontal dragging doesn't translate to vertical sizing
   and the user already has the collapse tab to dismiss / restore.

   padding-bottom reserves an 18px strip at the bottom of the panel
   for the tab. The tab sits INSIDE the drawer's footprint — never
   below it — so the workspace header below the drawer is never in
   the same vertical band as the tab. (Previously the tab hung
   below the drawer's bottom edge into the workspace's top padding;
   that made the tab visually compete with the workspace header,
   even when the tab box-model bounds technically cleared the
   header.) box-sizing: border-box so the padding eats from the
   33vh, not adding to it. */
.pict-modal-shell-panel-drawer
{
	width: 100% !important;
	max-width: 100% !important;
	height: var(--pict-modal-drawer-height, 33vh);
	transition: height 140ms ease;
	padding-bottom: 18px;
	box-sizing: border-box;
	overflow: visible !important;
	/* Clip the panel bg to its CONTENT area only — the 18px
	   padding-bottom reserve (where the tab lives) becomes
	   transparent, so the middle row's primary background shows
	   through. Without this the reserve would render with the
	   panel's chrome bg, creating a visible "strip" between the
	   drawer content above and the workspace below — the tab would
	   look like it's sitting on its own miscoloured band rather
	   than at the seam between drawer and workspace. */
	background-clip: content-box;
}
.pict-modal-shell-panel-drawer.pict-modal-shell-panel-collapsed
{
	/* Collapsed = "just the tab strip is visible". 18px matches the
	   panel's tab reserve so the height is consistent across states.
	   When this is 0 the tab would have nowhere to render and the
	   user couldn't reopen the drawer. */
	height: 18px !important;
	padding-bottom: 0 !important;
	/* Drop the panel's bg in collapsed state — without this the 18px
	   strip shows the --pict-modal-bg (panel chrome) which doesn't
	   match the workspace --theme-color-background-primary below it,
	   creating a visible "drawer band" around the tab that breaks the
	   illusion of the tab belonging to the workspace area. With
	   transparent bg the middle row's primary background shows
	   through, the strip blends with the workspace, and the tab pill
	   reads as a free-floating handle. */
	background: transparent !important;
}
.pict-modal-shell-panel-drawer > .pict-modal-shell-panel-resize-handle
{
	display: none;
}
/* The drawer's collapse tab is a horizontal pill protruding from the
   bottom of the drawer (rather than the inner edge of a side panel).
   Override the side-panel positioning rules from above so the tab
   always sits at the drawer's bottom-center seam, in both expanded
   and collapsed states. The expand-from-zero affordance: when
   collapsed (height: 0), the tab still hangs below "where the
   drawer would be" — a small handle the user can click to pull
   the drawer back down. */
.pict-modal-shell-panel-drawer > .pict-modal-shell-panel-collapse-tab,
.pict-modal-shell-panel-drawer.pict-modal-shell-panel-collapsed > .pict-modal-shell-panel-collapse-tab
{
	position: absolute !important;
	/* Anchored to the panel's BOTTOM edge — the tab lives INSIDE the
	   drawer's footprint (in the 18px reserve at the bottom), never
	   below it into the workspace. This means the workspace below
	   the drawer is never sharing a vertical band with the tab, so
	   the workspace header doesn't optically compete with it.
	   bottom: 4px aligns the tab's top edge exactly with the panel's
	   CONTENT-AREA bottom (panel.height − padding-bottom 18px). With
	   border-top: 0 on the tab, the seam between the drawer content
	   above and the tab body is invisible — they share --pict-modal-bg
	   and merge into one shape, the tab reading as a labelled
	   extension of the drawer hanging downward. Collapsed state
	   keeps the smaller offset (overridden below) because its panel
	   has no padding-bottom, so the math doesn't apply. */
	top: auto !important;
	bottom: 4px !important;
	left: 50% !important;
	right: auto !important;
	transform: translate(-50%, 0) !important;
	width: 64px !important;
	height: 14px !important;
	/* CRITICAL: border-box + padding: 0 — the collapsed-state base
	   rule inherits "padding: 12px 4px" (so the chevron clears the
	   edges of a tab that fills a 24px-wide side strip). In drawer
	   mode the tab is a 14px tall pill, NOT a strip-fill, so that
	   12px vertical padding would balloon the tab's outer height to
	   ~38px and crash into the workspace header text. The chevron
	   is centered via flex anyway. */
	box-sizing: border-box !important;
	padding: 0 !important;
	/* Rounded BOTTOM corners + no top border — the tab looks like a
	   traditional drawer-handle/tab hanging from above. Its rounded
	   bottom curves face the workspace (the "open downward" affordance
	   for a top drawer). border-top: 0 lets the tab visually merge
	   with whatever's directly above it inside the panel (sidebar
	   content when expanded, the panel background when collapsed). */
	border-radius: 0 0 8px 8px;
	border: 1px solid var(--pict-modal-border, var(--theme-color-border-default, #cfd5dd));
	border-top: 0;
	background: var(--pict-modal-bg, var(--theme-color-background-panel, #fff));
	opacity: 0.95;
	z-index: 20;
	/* The default side-panel hover-grow values would yank the tab off
	   to the wrong spot in drawer mode — neutralise. */
	display: flex;
	align-items: center;
	justify-content: center;
}
.pict-modal-shell-panel-drawer > .pict-modal-shell-panel-collapse-tab:hover,
.pict-modal-shell-panel-drawer.pict-modal-shell-panel-collapsed > .pict-modal-shell-panel-collapse-tab:hover
{
	opacity: 1;
	width: 96px !important;
	/* height stays at 14px — the tab is anchored with bottom, so any
	   height growth would push the tab's TOP edge UPWARD past the
	   space available above it. In EXPANDED state that crashes into
	   the drawer content above; in COLLAPSED state it crashes into
	   the topbar's brand stripes. Width-only growth (64 to 96, +50%)
	   still gives the "tab is reaching toward me" affordance without
	   the encroachment. */
	color: var(--brand-color-primary-mode, var(--theme-color-brand-primary, #2563eb));
	border-color: var(--brand-color-primary-mode, var(--theme-color-brand-primary, #2563eb));
	box-shadow: 0 3px 6px -2px rgba(0, 0, 0, 0.18);
}
/* Collapsed-state bottom-offset override. Expanded panels have an
   18px padding-bottom reserve, and "bottom: 4px" anchors the tab's
   top edge exactly at the content-area boundary (so it merges
   visually with the drawer above). Collapsed panels have
   padding-bottom: 0 and a total height of 18px — "bottom: 4px"
   there would put the tab's top at the panel's actual top edge,
   crashing the (border-top: 0) tab into the topbar. The smaller
   "bottom: 2px" keeps the 14px tab vertically centered in the 18px
   strip with 2px margins on either side. */
.pict-modal-shell-panel-drawer.pict-modal-shell-panel-collapsed > .pict-modal-shell-panel-collapse-tab
{
	bottom: 2px !important;
}
/* Chevron inside the tab: point UP when expanded (the drawer
   collapses UP / out of view, so the arrow indicates "click me to
   send the drawer up"), DOWN when collapsed (the drawer expands DOWN
   into view). Rotations come from the existing top-panel chevron
   table: rotate(-135deg) → UP arrow, rotate(45deg) → DOWN arrow. */
.pict-modal-shell-panel-drawer > .pict-modal-shell-panel-collapse-tab::before
{
	transform: rotate(-135deg) !important;
}
.pict-modal-shell-panel-drawer.pict-modal-shell-panel-collapsed > .pict-modal-shell-panel-collapse-tab::before
{
	transform: rotate(45deg) !important;
}
/* The collapse tab's existing title-text span is hidden when reduced
   to a pill — there's no horizontal room. The chevron alone reads
   correctly. */
.pict-modal-shell-panel-drawer > .pict-modal-shell-panel-collapse-tab .pict-modal-shell-panel-collapse-tab-title,
.pict-modal-shell-panel-drawer > .pict-modal-shell-panel-collapse-tab .pict-modal-shell-panel-collapse-tab-icon
{
	display: none;
}

/* Drag-active state — disable text selection + change cursor globally
   so resize feels solid even when the cursor briefly leaves the handle. */
.pict-modal-shell-dragging-x, .pict-modal-shell-dragging-y { user-select: none; }
.pict-modal-shell-dragging-x * { cursor: col-resize !important; }
.pict-modal-shell-dragging-y * { cursor: row-resize !important; }

/* Per-panel resize-active state — kills the panel's collapse/expand
   width/height transition for the duration of a drag. Without this,
   every pointermove starts a fresh 140 ms transition and the resize
   visibly lags behind the cursor ("choppy"). With it disabled the
   panel snaps to the new size on the same frame as the pointer, which
   feels native. */
.pict-modal-shell-panel-resizing { transition: none !important; }
.pict-modal-shell-panel-resizing > .pict-modal-shell-panel-resize-handle
{
	background: var(--brand-color-primary-mode, var(--theme-color-brand-primary, #2563eb));
	opacity: 0.5;
}

/* Panel popup-attention flash — fires when popup() is called on an
   already-open panel. Brief brand-colored inset glow so the user sees
   that their click landed even though the panel didn't change shape.
   Class is added by the shell, auto-removed after ~700 ms. */
@keyframes pict-modal-shell-panel-flash
{
	0%   { box-shadow: inset 0 0 0 0 transparent; }
	30%  { box-shadow: inset 0 0 0 3px var(--brand-color-primary-mode, var(--theme-color-brand-primary, #2563eb)); }
	100% { box-shadow: inset 0 0 0 0 transparent; }
}
.pict-modal-shell-panel-flash
{
	animation: pict-modal-shell-panel-flash 600ms ease-out;
}
`};},{}],32:[function(require,module,exports){const libPictViewClass=require('pict-view');const libPictModalOverlay=require('./Pict-Modal-Overlay.js');const libPictModalConfirm=require('./Pict-Modal-Confirm.js');const libPictModalWindow=require('./Pict-Modal-Window.js');const libPictModalToast=require('./Pict-Modal-Toast.js');const libPictModalTooltip=require('./Pict-Modal-Tooltip.js');const libPictModalPanel=require('./Pict-Modal-Panel.js');const libPictModalDropdown=require('./Pict-Modal-Dropdown.js');const libPictModalShell=require('./Pict-Modal-Shell.js');const _DefaultConfiguration=require('./Pict-Section-Modal-DefaultConfiguration.js');class PictSectionModal extends libPictViewClass{constructor(pFable,pOptions,pServiceHash){let tmpOptions=Object.assign({},_DefaultConfiguration,pOptions);super(pFable,tmpOptions,pServiceHash);this._activeModals=[];this._activeTooltips=[];this._activeToasts=[];this._idCounter=0;this._overlay=new libPictModalOverlay(this);this._confirm=new libPictModalConfirm(this);this._window=new libPictModalWindow(this);this._toast=new libPictModalToast(this);this._tooltip=new libPictModalTooltip(this);this._panel=new libPictModalPanel(this);this._dropdown=new libPictModalDropdown(this);this._shell=new libPictModalShell(this);}onBeforeInitialize(){super.onBeforeInitialize();// Ensure the root class is on the body for CSS variable scoping
if(typeof document!=='undefined'&&document.body){if(!document.body.classList.contains('pict-modal-root')){document.body.classList.add('pict-modal-root');}}return super.onBeforeInitialize();}/**
	 * Generate a unique ID for DOM elements.
	 *
	 * @returns {number}
	 */_nextId(){this._idCounter++;return this._idCounter;}// -- Confirm API --
/**
	 * Show a confirmation dialog.
	 *
	 * @param {string} pMessage - The confirmation message
	 * @param {object} [pOptions] - Options { title, confirmLabel, cancelLabel, dangerous }
	 * @returns {Promise<boolean>}
	 */confirm(pMessage,pOptions){return this._confirm.confirm(pMessage,pOptions);}/**
	 * Show a two-step confirmation dialog.
	 *
	 * If confirmPhrase is set, the user must type it to enable the confirm button.
	 * If no confirmPhrase, the first click changes the button text and the second click confirms.
	 *
	 * @param {string} pMessage - The confirmation message
	 * @param {object} [pOptions] - Options { title, confirmPhrase, phrasePrompt, confirmLabel, cancelLabel }
	 * @returns {Promise<boolean>}
	 */doubleConfirm(pMessage,pOptions){return this._confirm.doubleConfirm(pMessage,pOptions);}// -- Modal Window API --
/**
	 * Show a custom modal window.
	 *
	 * @param {object} [pOptions] - Options { title, content, buttons, closeable, width, onOpen, onClose }
	 * @returns {Promise<string|null>} Resolves with the clicked button Hash, or null on close
	 */show(pOptions){return this._window.show(pOptions);}// -- Tooltip API --
/**
	 * Attach a simple text tooltip to an element.
	 *
	 * @param {HTMLElement} pElement - Target element
	 * @param {string} pText - Tooltip text
	 * @param {object} [pOptions] - Options { position, delay, maxWidth }
	 * @returns {{ destroy: function }}
	 */tooltip(pElement,pText,pOptions){return this._tooltip.tooltip(pElement,pText,pOptions);}/**
	 * Attach a rich HTML tooltip to an element.
	 *
	 * @param {HTMLElement} pElement - Target element
	 * @param {string} pHTMLContent - HTML content
	 * @param {object} [pOptions] - Options { position, delay, maxWidth, interactive }
	 * @returns {{ destroy: function }}
	 */richTooltip(pElement,pHTMLContent,pOptions){return this._tooltip.richTooltip(pElement,pHTMLContent,pOptions);}// -- Toast API --
/**
	 * Show a toast notification.
	 *
	 * @param {string} pMessage - Toast message
	 * @param {object} [pOptions] - Options { type, duration, position, dismissible }
	 * @returns {{ dismiss: function }}
	 */toast(pMessage,pOptions){return this._toast.toast(pMessage,pOptions);}// -- Dropdown API --
/**
	 * Open an anchor-positioned dropdown menu (no backdrop, click-outside
	 * dismisses). Useful for nav menus and split-button addenda.
	 *
	 * @param {HTMLElement|string|object} pAnchor - Element, CSS selector, or
	 *   { left, top, width, height } rect for context-menu style anchoring.
	 * @param {object} pOptions - { items, align, position, minWidth, maxHeight,
	 *   className, closeOnSelect, onSelect, onClose }
	 * @returns {Promise<{Hash, Item}|null>} Selection or null on dismiss.
	 */dropdown(pAnchor,pOptions){return this._dropdown.dropdown(pAnchor,pOptions);}/**
	 * Dismiss any open dropdown.
	 */dismissDropdowns(){this._dropdown.dismissAll();}// -- Panel API --
/**
	 * Attach resizable/collapsible panel behavior to a DOM element.
	 *
	 * @param {string} pTargetSelector - CSS selector for the panel element
	 * @param {object} [pOptions] - Options { position, width, minWidth, maxWidth, collapsible, collapsed, persist, persistKey, onResize, onToggle }
	 * @returns {{ collapse, expand, toggle, setWidth, destroy }} Panel handle
	 */panel(pTargetSelector,pOptions){return this._panel.create(pTargetSelector,pOptions);}// -- Shell API --
/**
	 * Get (or create) a layout shell for a viewport. Idempotent.
	 *
	 * The shell takes ownership of the viewport's contents and manages
	 * top / right / bottom / left panel placement plus a center area.
	 * See Pict-Modal-Shell.js for full panel-config semantics.
	 *
	 * @param {string|HTMLElement} pViewport - selector or element of the
	 *   container the shell should fill (commonly the app's root div).
	 * @param {object} [pOptions]
	 * @param {boolean} [pOptions.Persistence=true]   - autosave panel state to localStorage
	 * @param {string}  [pOptions.PersistenceKey=null]- override scope (default: hostname)
	 * @returns {PictModalShell}
	 */shell(pViewport,pOptions){return this._shell.shell(pViewport,pOptions);}// -- Cleanup API --
/**
	 * Dismiss all open modals.
	 */dismissModals(){let tmpModals=this._activeModals.slice();for(let i=tmpModals.length-1;i>=0;i--){tmpModals[i].dismiss(null);}}/**
	 * Dismiss all active tooltips.
	 */dismissTooltips(){this._tooltip.dismissAll();}/**
	 * Dismiss all active toasts.
	 */dismissToasts(){this._toast.dismissAll();}/**
	 * Dismiss everything: modals, tooltips, and toasts.
	 */dismissAll(){this.dismissModals();this.dismissTooltips();this.dismissToasts();this.dismissDropdowns();}/**
	 * Clean up all DOM elements when the view is destroyed.
	 *//**
	 * Destroy all active panels.
	 */destroyPanels(){this._panel.destroyAll();}destroy(){this.dismissAll();this.destroyPanels();this._overlay.destroy();this._toast.destroy();if(typeof super.destroy==='function'){return super.destroy();}}}module.exports=PictSectionModal;module.exports.default_configuration=_DefaultConfiguration;},{"./Pict-Modal-Confirm.js":23,"./Pict-Modal-Dropdown.js":24,"./Pict-Modal-Overlay.js":25,"./Pict-Modal-Panel.js":26,"./Pict-Modal-Shell.js":27,"./Pict-Modal-Toast.js":28,"./Pict-Modal-Tooltip.js":29,"./Pict-Modal-Window.js":30,"./Pict-Section-Modal-DefaultConfiguration.js":31,"pict-view":94}],33:[function(require,module,exports){/**
 * pict-section-theme — entry point.
 *
 * Bundles every Retold-ecosystem theme and exposes five reusable views:
 *
 *   - Theme-Picker      : a custom dropdown listing every registered theme,
 *                         grouped by category, with inline SVG mode-glyphs.
 *                         Switches the active theme on change.
 *   - Theme-ModeToggle  : a 3-button toggle for Light / Dark / System mode.
 *                         Disables itself when the active theme is single-mode.
 *   - Theme-ScaleSelect : a dropdown of viewport scale presets (75% – 200%).
 *                         Independent of theme bundles — applied via CSS
 *                         `zoom` on <html> + a `--theme-scale` custom prop.
 *   - Theme-Button      : an embeddable SVG topbar button that, when clicked,
 *                         opens a pict-section-modal containing the picker,
 *                         the mode toggle, and the scale select. Designed to
 *                         drop into any application chrome.
 *   - Theme-BrandStrip  : the per-app brand signature (icon + name + two
 *                         color stripes). Driven by libThemeBrand which the
 *                         host configures via the `Brand` option.
 *
 * # Recommended consumption (Pict provider)
 *
 * Add the section as a Pict provider — it self-bootstraps on construction:
 *
 *     const libPictSectionTheme = require('pict-section-theme');
 *
 *     pict.addProvider('Theme-Section',
 *     {
 *         ApplyDefault: 'retold-default',
 *         DefaultMode:  'system',
 *         DefaultScale: 1.0,
 *         Brand:        libRetoldManagerBrand
 *     }, libPictSectionTheme);
 *
 * That single addProvider call:
 *   - Ensures `pict.providers.Theme` (the underlying pict-provider-theme
 *     runtime) exists.
 *   - Registers every theme in the runtime registry — bundled starter set
 *     plus anything the host registered via `Catalog.register()`.
 *   - Adds Theme-Picker / Theme-ModeToggle / Theme-ScaleSelect /
 *     Theme-Button / Theme-BrandStrip to `pict.views[...]`.
 *   - Hydrates persisted choices from localStorage; otherwise applies the
 *     supplied `ApplyDefault` / `DefaultMode` / `DefaultScale`.
 *   - Wires the `onApply` save handler so subsequent user picks persist.
 *   - Applies the supplied Brand block if one was provided.
 *
 * # Runtime theme registration
 *
 * The bundled starter set lives in `themes/_catalog.js`. To add custom
 * themes (e.g. a host app's own brand palette, or a remote bundle from
 * a "theme garden") use the registry:
 *
 *     const libCatalog = require('pict-section-theme').Catalog;
 *     libCatalog.register({ Hash: 'my-theme', Bundle: require('./mine.json'), Category: 'App' });
 *     // Or, async, from a URL:
 *     await libCatalog.registerFromURL('https://garden.example.com/themes/foo.json');
 *
 * Themes registered before `addProvider()` runs are picked up
 * automatically. Themes registered after must be manually pushed via
 * `pict.providers.Theme.registerTheme(bundle)`.
 *
 * # Persistence
 *
 * Persisting active theme + mode + scale to localStorage is on by
 * default. Storage key is scoped to `window.location.hostname` so apps
 * on different hosts keep independent state. Override with
 * `PersistenceKey: 'my-app'`. Pass `Persistence: false` to disable.
 *
 * A saved entry takes precedence over `ApplyDefault` — once a user has
 * picked a theme, reloads honour that pick instead of the host's
 * default. If the saved theme hash is no longer in the registry (theme
 * removed, app downgraded), the bootstrap falls back to `ApplyDefault`
 * cleanly.
 *
 * # Legacy API
 *
 * `install(pict, options)` and `registerCatalog(pict)` are still
 * exported as thin shims that delegate to the provider — existing apps
 * keep working without changes.
 */'use strict';const libPictProvider=require('pict-provider');const libPictProviderTheme=require('pict-provider-theme');const libPickerView=require('./views/PictView-Theme-Picker.js');const libModeToggleView=require('./views/PictView-Theme-ModeToggle.js');const libScaleSelectView=require('./views/PictView-Theme-ScaleSelect.js');const libButtonView=require('./views/PictView-Theme-Button.js');const libBrandStripView=require('./views/PictView-Theme-BrandStrip.js');const libBrandMarkView=require('./views/PictView-Theme-Brand-Mark.js');const libTopBarView=require('./views/PictView-Theme-TopBar.js');const libBottomBarView=require('./views/PictView-Theme-BottomBar.js');const libThemePersistence=require('./Theme-Persistence.js');const libThemeScale=require('./Theme-Scale.js');const libThemeBrand=require('./Theme-Brand.js');// Theme-Logo (the deterministic name → SVG generator) is intentionally
// NOT required here. It's a build-time tool used by
// `pict-section-theme-brand` to precompute brand blocks into a host's
// package.json — there's no reason for it to ride along in the runtime
// bundle every host ships. Hosts that want runtime generation can
// `require('pict-section-theme/source/Theme-Logo.js')` directly; that
// keeps the import explicit and the cost opt-in.
const libCatalog=require('./themes/_catalog.js');// View registry: short-name → { lib, hash } where hash is the
// ViewIdentifier the view registers under in pict.views[...].
const _Views={Picker:{lib:libPickerView,hash:'Theme-Picker'},ModeToggle:{lib:libModeToggleView,hash:'Theme-ModeToggle'},ScaleSelect:{lib:libScaleSelectView,hash:'Theme-ScaleSelect'},Button:{lib:libButtonView,hash:'Theme-Button'},BrandStrip:{lib:libBrandStripView,hash:'Theme-BrandStrip'},BrandMark:{lib:libBrandMarkView,hash:'Theme-Brand-Mark'},TopBar:{lib:libTopBarView,hash:'Theme-TopBar'},BottomBar:{lib:libBottomBarView,hash:'Theme-BottomBar'}};const _ProviderConfiguration={ProviderIdentifier:'Theme-Section',// Don't auto-fire the standard pict-provider initialize chain — we do
// our setup work synchronously in the constructor so consumers can
// use the views immediately after addProvider() returns.
AutoInitialize:false,// Bootstrap config — same shape as the legacy install() options.
ApplyDefault:null,// theme hash to apply at boot
DefaultMode:null,// 'light' | 'dark' | 'system' | null (theme's default)
DefaultScale:null,// 0.75 .. 2.0 — viewport scale
Persistence:true,PersistenceKey:null,// null → window.location.hostname
RegisterCatalog:true,Views:null,// null → all views; or array of short-names
ViewOptions:null,// { Picker: { ... }, ... } per-view overrides
Brand:null,// { Name, Icon, Colors: { Primary, ... } }
ProviderOptions:null// pict-provider-theme overrides if a host wants them
};// ── Helpers ──────────────────────────────────────────────────────────────
/**
 * Iterate the runtime registry and call provider.registerTheme() for each
 * entry. Safe to call before or after addProvider — the runtime's
 * registerTheme is idempotent on repeat hashes.
 *
 * @param {object} pPict - a Pict instance with the Theme runtime attached
 * @returns {number} count of themes registered
 */function registerCatalog(pPict){if(!pPict||!pPict.providers||!pPict.providers.Theme){if(pPict&&pPict.log&&pPict.log.warn){pPict.log.warn('pict-section-theme.registerCatalog: pict.providers.Theme not found — register the runtime first');}return 0;}let tmpProvider=pPict.providers.Theme;let tmpEntries=libCatalog.list();let tmpCount=0;for(let i=0;i<tmpEntries.length;i++){if(tmpProvider.registerTheme(tmpEntries[i].Bundle)){tmpCount++;}}return tmpCount;}/**
 * Return the registry as picker-friendly metadata (no Bundle payload).
 *
 * @returns {Array<{Hash, Name, Category, Strategy, DefaultMode, IsDefault}>}
 */function listCatalog(){let tmpEntries=libCatalog.list();let tmpList=[];for(let i=0;i<tmpEntries.length;i++){let tmpEntry=tmpEntries[i];let tmpBundle=tmpEntry.Bundle||{};let tmpModes=tmpBundle.Modes||{};tmpList.push({Hash:tmpEntry.Hash,Name:tmpBundle.Name||tmpEntry.Hash,Category:tmpEntry.Category||'Other',Strategy:tmpModes.Strategy||'single',DefaultMode:tmpModes.Default||'light',IsDefault:!!tmpEntry.IsDefault});}return tmpList;}// Resolve the canonical fallback theme hash from the catalog: the entry
// flagged IsDefault, or — if no entry is flagged — the first registered
// entry, or null if the catalog is empty. Used as the last-resort boot
// theme when nothing else resolved (no ApplyDefault, no saved state, or
// a saved hash that's been removed from the catalog).
function _resolveCatalogDefault(){let tmpEntries=libCatalog.list();if(!tmpEntries||tmpEntries.length===0)return null;for(let i=0;i<tmpEntries.length;i++){if(tmpEntries[i].IsDefault)return tmpEntries[i].Hash;}return tmpEntries[0].Hash;}// ── Bootstrap routine ────────────────────────────────────────────────────
// Shared between the provider class (new path) and the install() function
// (legacy path). Performs the actual wiring against a Pict instance.
function _bootstrap(pPict,pOptions){if(!pPict||typeof pPict.addProvider!=='function'){throw new Error('pict-section-theme: requires a Pict instance');}let tmpOptions=pOptions||{};// 1. Theme runtime — only add if not already attached (hosts with
//    a custom runtime, e.g. retold-remote's V2 bridge, pre-register).
if(!pPict.providers||!pPict.providers.Theme){let tmpRuntimeOpts=Object.assign({},libPictProviderTheme.default_configuration,tmpOptions.ProviderOptions||{});pPict.addProvider('Theme',tmpRuntimeOpts,libPictProviderTheme);}// 2. Catalog — every entry from the runtime registry, unless the host
//    asked to skip (RegisterCatalog: false).
if(tmpOptions.RegisterCatalog!==false){registerCatalog(pPict);}// 3. Views — default all five; pass an array to subset.
let tmpViewNames=Array.isArray(tmpOptions.Views)?tmpOptions.Views:Object.keys(_Views);for(let i=0;i<tmpViewNames.length;i++){let tmpEntry=_Views[tmpViewNames[i]];if(!tmpEntry){if(pPict.log&&pPict.log.warn){pPict.log.warn('pict-section-theme: unknown view name "'+tmpViewNames[i]+'" — skipped');}continue;}if(pPict.views&&pPict.views[tmpEntry.hash]){// Already registered — skip silently.
continue;}let tmpViewOpts=Object.assign({},tmpEntry.lib.default_configuration,tmpOptions.ViewOptions&&tmpOptions.ViewOptions[tmpViewNames[i]]||{});pPict.addView(tmpEntry.hash,tmpViewOpts,tmpEntry.lib);}// 4. Persistence + initial apply.
let tmpProvider=pPict.providers.Theme;let tmpPersistenceEnabled=tmpOptions.Persistence!==false;let tmpPersistenceKey=null;let tmpBootHash=tmpOptions.ApplyDefault||null;let tmpBootMode=tmpOptions.DefaultMode||null;let tmpBootScale=typeof tmpOptions.DefaultScale==='number'?tmpOptions.DefaultScale:null;if(tmpPersistenceEnabled&&tmpProvider){tmpPersistenceKey=libThemePersistence.resolveKey(tmpOptions.PersistenceKey);let tmpSaved=libThemePersistence.load(tmpPersistenceKey);if(tmpSaved&&tmpSaved.ThemeHash&&typeof tmpProvider.getTheme==='function'&&tmpProvider.getTheme(tmpSaved.ThemeHash)){tmpBootHash=tmpSaved.ThemeHash;if(tmpSaved.Mode){tmpBootMode=tmpSaved.Mode;}if(tmpSaved.Scale){tmpBootScale=tmpSaved.Scale;}}else if(tmpSaved&&tmpSaved.Scale){tmpBootScale=tmpSaved.Scale;}// Single save snapshot — both the provider listener and the scale
// listener call this so any change persists the full set.
let tmpSaveCurrent=function(){let tmpActive=typeof tmpProvider.getActiveTheme==='function'?tmpProvider.getActiveTheme():{Hash:null,Mode:null};libThemePersistence.save(tmpPersistenceKey,{ThemeHash:tmpActive.Hash,Mode:tmpActive.Mode,Scale:libThemeScale.getActive()});};tmpProvider.onApply(tmpSaveCurrent);libThemeScale.onChange(tmpSaveCurrent);}// If nothing resolved a theme hash (no ApplyDefault, no saved state, or
// a saved hash that's no longer in the registry), fall back to the
// catalog's canonical default (IsDefault: true) so the host always
// boots with CSS variables populated. Without this fallback an app
// configured without ApplyDefault — or one whose ApplyDefault hash
// was removed — paints unstyled (token references resolve to their
// inline fallback colors, which are intentionally bland) until the
// user manually picks something from the picker.
if(tmpProvider&&(!tmpBootHash||typeof tmpProvider.getTheme==='function'&&!tmpProvider.getTheme(tmpBootHash))){let tmpFallback=_resolveCatalogDefault();if(tmpFallback){tmpBootHash=tmpFallback;if(pPict.log&&pPict.log.info){pPict.log.info('pict-section-theme: no theme resolved at boot — falling back to catalog default "'+tmpFallback+'"');}}}if(tmpBootHash&&tmpProvider){tmpProvider.applyTheme(tmpBootHash,tmpBootMode);}if(tmpBootScale!==null){libThemeScale.applyScale(tmpBootScale);}// 5. Brand — host-supplied app identity. Apply LAST so the BrandStrip
//    view's first paint sees the CSS custom properties.
if(tmpOptions.Brand){libThemeBrand.applyBrand(tmpOptions.Brand);}// Stash the resolved key on the provider for debugging + so the host
// can clear it via clearPersistence() for a "reset to defaults"
// affordance.
if(tmpProvider&&tmpPersistenceKey){tmpProvider._persistenceKey=tmpPersistenceKey;}return tmpProvider;}// ── PictProvider class ───────────────────────────────────────────────────
// The recommended entry point. `pict.addProvider('Theme-Section',
// options, PictSectionThemeProvider)` self-bootstraps the whole module
// (runtime + catalog + views + persistence + apply + brand) inside the
// constructor — no follow-up install() call required.
class PictSectionThemeProvider extends libPictProvider{constructor(pFable,pOptions,pServiceHash){super(pFable,pOptions,pServiceHash);this.serviceType='PictSectionTheme';// pict-provider sets `this.pict` for us via super() above. Run the
// bootstrap synchronously so the views, theme runtime, and applied
// theme are all in place before addProvider() returns.
_bootstrap(this.pict,this.options);}/**
	 * Embed theme controls into a host-supplied container.
	 *
	 * The Theme-Button view ships a popover that hosts the picker + mode
	 * toggle + scale select — convenient for "drop a theme menu in the
	 * topbar" but not for apps that already have a settings surface and
	 * want the controls inline there. `mount()` writes the destination
	 * divs each theme view expects into the supplied container, then
	 * calls render() on each requested view.
	 *
	 * Important: each theme view has a SINGLE default destination id
	 * (e.g. `#Theme-Picker`). Mounting overrides where the view paints —
	 * once mount() is called, the picker / toggle / scale destinations
	 * live inside the supplied container. Combining a mount() with a
	 * Theme-Button popover that ALSO hosts these views causes duplicate
	 * destination ids and undefined behaviour; pick one host per view.
	 *
	 * @param {object} pOptions
	 * @param {string|HTMLElement} pOptions.Container - CSS selector or element
	 * @param {Array<string>} [pOptions.Views] - short names; default ['Picker','ModeToggle','ScaleSelect']
	 * @param {string} [pOptions.WrapperClass] - class added to the outer wrapper div
	 * @returns {object|null} { container, viewsRendered } on success, null if the container can't be resolved
	 */mount(pOptions){let tmpOpts=pOptions||{};let tmpContainer=tmpOpts.Container;if(!tmpContainer){return null;}let tmpEl=typeof tmpContainer==='string'?this.pict&&this.pict.ContentAssignment?this.pict.ContentAssignment.getElement(tmpContainer):document.querySelector(tmpContainer):tmpContainer;// ContentAssignment.getElement returns an array-like; normalise to one node.
if(tmpEl&&tmpEl.length&&!tmpEl.tagName){tmpEl=tmpEl[0];}if(!tmpEl){if(this.pict&&this.pict.log&&this.pict.log.warn){this.pict.log.warn('pict-section-theme.mount: container not found for '+tmpContainer);}return null;}let tmpRequested=Array.isArray(tmpOpts.Views)&&tmpOpts.Views.length?tmpOpts.Views:['Picker','ModeToggle','ScaleSelect'];// Build a wrapper that carries one row per requested view; each row
// contains the destination div the view's render() will write into.
let tmpRows=[];let tmpRendered=[];for(let i=0;i<tmpRequested.length;i++){let tmpEntry=_Views[tmpRequested[i]];if(!tmpEntry){continue;}let tmpDestSel=tmpEntry.lib.default_configuration.DefaultDestinationAddress||'';let tmpDestId=tmpDestSel.replace(/^#/,'');if(!tmpDestId){continue;}tmpRows.push('<div class="pict-theme-mount-row pict-theme-mount-row-'+tmpEntry.hash.toLowerCase()+'">'+'<div id="'+tmpDestId+'"></div>'+'</div>');tmpRendered.push(tmpEntry.hash);}let tmpWrapperClass='pict-theme-mount'+(tmpOpts.WrapperClass?' '+tmpOpts.WrapperClass:'');tmpEl.innerHTML='<div class="'+tmpWrapperClass+'">'+tmpRows.join('')+'</div>';// Render each requested view. Each render() targets the destination
// id we just stamped into the wrapper.
for(let i=0;i<tmpRendered.length;i++){let tmpView=this.pict.views[tmpRendered[i]];if(tmpView&&typeof tmpView.render==='function'){try{tmpView.render();}catch(pErr){/* a view render failure shouldn't break the host */}}}return{container:tmpEl,viewsRendered:tmpRendered};}}// ── Legacy install() ─────────────────────────────────────────────────────
// Thin shim for apps that already call install(); delegates to the same
// bootstrap routine the provider runs.
function install(pPict,pOptions){if(!pPict||typeof pPict.addProvider!=='function'){throw new Error('pict-section-theme.install: first arg must be a Pict instance');}return _bootstrap(pPict,pOptions||{});}/**
 * Drop the saved theme state for this app's storage key. The next
 * install() (or page reload / addProvider) falls back to ApplyDefault.
 *
 * @param {object} pPict - the pict instance
 * @returns {boolean} true if anything was cleared
 */function clearPersistence(pPict){let tmpKey=pPict&&pPict.providers&&pPict.providers.Theme&&pPict.providers.Theme._persistenceKey||libThemePersistence.resolveKey(null);return libThemePersistence.clear(tmpKey);}// ── Exports ──────────────────────────────────────────────────────────────
// Default export = the provider class so apps can do:
//   pict.addProvider('Theme-Section', { ... }, libPictSectionTheme);
//
// Named exports preserved so legacy callers keep working unchanged.
module.exports=PictSectionThemeProvider;module.exports.default_configuration=_ProviderConfiguration;module.exports.Provider=libPictProviderTheme;// the runtime class
module.exports.PictSectionThemeProvider=PictSectionThemeProvider;module.exports.PickerView=libPickerView;module.exports.ModeToggleView=libModeToggleView;module.exports.ButtonView=libButtonView;module.exports.ScaleSelectView=libScaleSelectView;module.exports.BrandStripView=libBrandStripView;module.exports.BrandMarkView=libBrandMarkView;module.exports.TopBarView=libTopBarView;module.exports.BottomBarView=libBottomBarView;module.exports.Catalog=libCatalog;// the registry singleton
module.exports.Brand=libThemeBrand;// the brand helper module
module.exports.Scale=libThemeScale;// the scale helper module
module.exports.Persistence=libThemePersistence;// the persistence helper module
// Theme-Logo is exposed as a sub-module path, not a top-level field —
// see the comment near the imports above.
module.exports.registerCatalog=registerCatalog;module.exports.listCatalog=listCatalog;module.exports.install=install;module.exports.clearPersistence=clearPersistence;},{"./Theme-Brand.js":34,"./Theme-Persistence.js":36,"./Theme-Scale.js":37,"./themes/_catalog.js":41,"./views/PictView-Theme-BottomBar.js":83,"./views/PictView-Theme-Brand-Mark.js":84,"./views/PictView-Theme-BrandStrip.js":85,"./views/PictView-Theme-Button.js":86,"./views/PictView-Theme-ModeToggle.js":87,"./views/PictView-Theme-Picker.js":88,"./views/PictView-Theme-ScaleSelect.js":89,"./views/PictView-Theme-TopBar.js":90,"pict-provider":13,"pict-provider-theme":6}],34:[function(require,module,exports){/**
 * Theme-Brand — app-level brand identity (icon + colors) that overlays
 * the active theme.
 *
 * # What this is for
 *
 * The active *theme* describes how UI surfaces look (panel colors,
 * borders, text, status). The active *brand* describes which APP the
 * user is in. retold-facto, retold-manager, and ultravisor can share
 * the same theme but each carries its own visual signature: a small
 * icon and two brand colors that show up in a stripe under the nav
 * (and optionally tinge link underlines, header accents, etc. when
 * the active theme opts to reference them).
 *
 * Brand is host-supplied (passed to pict-section-theme.install() as
 * `Brand: {...}` or applied later via this module's `applyBrand()`)
 * and NOT user-pickable — it's the app's wordmark. It's also not
 * persisted; the host config drives it on every boot.
 *
 * # Brand shape
 *
 * Two equivalent forms — pick whichever reads better in your app.
 *
 * ## Recommended: nested form
 *
 *   {
 *     Hash:    'retold-manager',
 *     Name:    'Retold Manager',
 *     Icon:    '<svg ...>...</svg>',
 *     Colors: {
 *       Primary:   { Light: '#0044cc', Dark: '#6b8eff' },   // both required
 *       Secondary: { Light: '#c75033', Dark: '#ff8a6b' }    // both required
 *     },
 *     Tagline: 'Optional short tagline'
 *   }
 *
 * This mirrors how theme JSONs already structure their Tokens.Color.*
 * trees, makes the "explicit light + dark variants" contract obvious,
 * and means your brand and your theme look consistent in source.
 *
 * ## Legacy: flat form
 *
 *   {
 *     Hash:    'retold-manager',
 *     Name:    'Retold Manager',
 *     Icon:    '<svg ...>...</svg>',
 *     Colors: {
 *       Primary:        '#0066ff',                // required
 *       Secondary:      '#ff6600',                // required
 *       PrimaryLight:   '#3388ff',                // optional, light-mode tint
 *       PrimaryDark:    '#0044cc',                // optional, dark-mode tint
 *       SecondaryLight: '#ff8833',
 *       SecondaryDark:  '#cc4400'
 *     }
 *   }
 *
 * The flat form's `Primary` / `Secondary` are mode-agnostic constants
 * (used for the `--brand-color-primary` / `-secondary` CSS variables);
 * the *Light / *Dark fields drive the mode-aware variants. When the
 * Light / Dark fields are omitted, the base Primary / Secondary
 * doubles for both modes. Both forms land on the same six output CSS
 * variables — see "CSS variables emitted" below.
 *
 * Icon shape: inline SVG markup, OR a data URL, OR a remote / app-served
 * URL. IconType is optional and auto-detected from the value.
 *
 * # CSS variables emitted
 *
 *   :root {
 *     --brand-color-primary:           <Primary>
 *     --brand-color-secondary:         <Secondary>
 *     --brand-color-primary-light:     <PrimaryLight or Primary>
 *     --brand-color-primary-dark:      <PrimaryDark or Primary>
 *     --brand-color-secondary-light:   <SecondaryLight or Secondary>
 *     --brand-color-secondary-dark:    <SecondaryDark or Secondary>
 *     --brand-color-primary-mode:      <Primary OR PrimaryLight in :root>
 *     --brand-color-secondary-mode:    <Secondary OR SecondaryLight in :root>
 *     --brand-name:                    "<Name>"
 *   }
 *   .theme-dark {
 *     --brand-color-primary-mode:      <PrimaryDark or Primary>
 *     --brand-color-secondary-mode:    <SecondaryDark or Secondary>
 *   }
 *
 * The `*-mode` variables are the ones theme/host CSS should reach for
 * when they want a brand color that automatically swaps for dark mode
 * (parallel to how --theme-color-* works). The plain Primary/Secondary
 * are constants that ignore the mode toggle — useful for the brand
 * stripe itself, where the brand should look the same in both modes.
 *
 * # Listener pattern
 *
 * Mirrors Theme-Scale: subscribe via `onBrandChange(cb)`, dispose by
 * calling the returned function. The BrandStrip view uses this to
 * re-render when the host changes brand at runtime (rare, but used by
 * test harnesses + multi-tenant hosts).
 */const STYLE_ELEMENT_ID='pict-brand';const FAVICON_LINK_ID='pict-brand-favicon';const FAVICON_DARK_LINK_ID='pict-brand-favicon-dark';let _activeBrand=null;let _listeners=[];function _isInlineSVG(pIcon){return typeof pIcon==='string'&&/^\s*<svg[\s>]/i.test(pIcon);}function _isImageURL(pIcon){if(typeof pIcon!=='string')return false;return /^(data:|https?:|\/|\.\.?\/)/.test(pIcon);}function _detectIconType(pBrand){if(pBrand&&typeof pBrand.IconType==='string')return pBrand.IconType;if(!pBrand||!pBrand.Icon)return null;if(_isInlineSVG(pBrand.Icon))return'svg';if(_isImageURL(pBrand.Icon))return'image';return null;}// Resolve a "color slot" to { Light, Dark, Base } regardless of input
// shape. Supported inputs:
//   - "string"                        → all three equal that string
//   - { Light, Dark }                 → Base = Light, others as given
//   - { Light, Dark, Base }           → Base explicit
//   - missing                         → null (caller decides how to fail)
function _resolveColorSlot(pSlot){if(typeof pSlot==='string'&&pSlot.length>0){return{Light:pSlot,Dark:pSlot,Base:pSlot};}if(pSlot&&typeof pSlot==='object'){let tmpLight=typeof pSlot.Light==='string'&&pSlot.Light.length>0?pSlot.Light:null;let tmpDark=typeof pSlot.Dark==='string'&&pSlot.Dark.length>0?pSlot.Dark:null;// Need at least one variant present.
if(!tmpLight&&!tmpDark)return null;// Fill missing variant from the other side. Base defaults to
// the light variant (matches the legacy flat-form semantics).
tmpLight=tmpLight||tmpDark;tmpDark=tmpDark||tmpLight;let tmpBase=typeof pSlot.Base==='string'&&pSlot.Base.length>0?pSlot.Base:tmpLight;return{Light:tmpLight,Dark:tmpDark,Base:tmpBase};}return null;}function _normalize(pBrand){if(!pBrand||typeof pBrand!=='object')return null;let tmpColors=pBrand.Colors||{};// Brand colors accept TWO forms — flat or nested:
//
//   FLAT (legacy):
//     Colors: {
//       Primary:        '#e54b1e',     // required (the mode-agnostic value)
//       Secondary:      '#1e9aa0',     // required
//       PrimaryLight:   '#e54b1e',     // optional fallback to Primary
//       PrimaryDark:    '#ff7a4a',     // optional fallback to Primary
//       SecondaryLight: '#1e9aa0',     // optional fallback to Secondary
//       SecondaryDark:  '#5fc5cb'      // optional fallback to Secondary
//     }
//
//   NESTED (recommended):
//     Colors: {
//       Primary:   { Light: '#e54b1e', Dark: '#ff7a4a' },  // both required
//       Secondary: { Light: '#1e9aa0', Dark: '#5fc5cb' }   // both required
//     }
//
// The nested form mirrors how themes already structure their
// Tokens.Color.* trees and makes the "this brand needs explicit
// light + dark variants" contract obvious. Either form lands on
// the same six --brand-color-* CSS variables.
let tmpPriSlot=_resolveColorSlot(tmpColors.Primary);let tmpSecSlot=_resolveColorSlot(tmpColors.Secondary);if(!tmpPriSlot||!tmpSecSlot)return null;// Legacy flat-form fields override the resolved slot's Light/Dark
// (so a host passing both forms gets the most explicit one).
let tmpPriLight=tmpColors.PrimaryLight||tmpPriSlot.Light;let tmpPriDark=tmpColors.PrimaryDark||tmpPriSlot.Dark;let tmpSecLight=tmpColors.SecondaryLight||tmpSecSlot.Light;let tmpSecDark=tmpColors.SecondaryDark||tmpSecSlot.Dark;return{Hash:pBrand.Hash||'brand',Name:pBrand.Name||pBrand.Hash||'Brand',Icon:pBrand.Icon||null,IconType:_detectIconType(pBrand),Tagline:typeof pBrand.Tagline==='string'?pBrand.Tagline:null,// Optional favicon assets. Each can be: inline `<svg>` markup, a
// data URL, or a regular URL. When both Favicon and FaviconDark
// are supplied, paired light/dark <link rel="icon"> tags are
// emitted with prefers-color-scheme media queries; otherwise a
// single <link> covers both modes.
Favicon:pBrand.Favicon||null,FaviconDark:pBrand.FaviconDark||null,Colors:{Primary:tmpPriSlot.Base,Secondary:tmpSecSlot.Base,PrimaryLight:tmpPriLight,PrimaryDark:tmpPriDark,SecondaryLight:tmpSecLight,SecondaryDark:tmpSecDark}};}// Encode an inline `<svg>` blob into a data URL safe for an <img src> /
// <link href> attribute. Falls through if the input already looks like
// a URL (data:, http:, /, ./, ../).
function _faviconHref(pIcon){if(!pIcon||typeof pIcon!=='string')return null;if(_isInlineSVG(pIcon)){// percent-encode SVG markup. Don't encode '#' or '&' minimally;
// the safe path is to encode aggressively then unescape spaces.
let tmpEncoded=encodeURIComponent(pIcon).replace(/'/g,'%27').replace(/"/g,'%22');return'data:image/svg+xml;charset=utf-8,'+tmpEncoded;}if(_isImageURL(pIcon))return pIcon;return null;}function _removeFaviconLinks(){if(typeof document==='undefined')return;[FAVICON_LINK_ID,FAVICON_DARK_LINK_ID].forEach(pID=>{let tmpEl=document.getElementById(pID);if(tmpEl&&tmpEl.parentNode)tmpEl.parentNode.removeChild(tmpEl);});}function _injectFaviconLinks(pBrand){if(typeof document==='undefined')return;_removeFaviconLinks();let tmpLight=_faviconHref(pBrand.Favicon);let tmpDark=_faviconHref(pBrand.FaviconDark);if(!tmpLight&&!tmpDark)return;let tmpHasPair=!!(tmpLight&&tmpDark);if(tmpLight){let tmpLink=document.createElement('link');tmpLink.id=FAVICON_LINK_ID;tmpLink.rel='icon';tmpLink.href=tmpLight;if(/^data:image\/svg\+xml/.test(tmpLight))tmpLink.type='image/svg+xml';if(tmpHasPair)tmpLink.media='(prefers-color-scheme: light)';document.head.appendChild(tmpLink);}if(tmpDark){let tmpLink=document.createElement('link');tmpLink.id=FAVICON_DARK_LINK_ID;tmpLink.rel='icon';tmpLink.href=tmpDark;if(/^data:image\/svg\+xml/.test(tmpDark))tmpLink.type='image/svg+xml';// If we have a light variant, the dark link's media query handles
// the swap; otherwise it serves both modes.
if(tmpHasPair)tmpLink.media='(prefers-color-scheme: dark)';document.head.appendChild(tmpLink);}}function _injectStyleElement(pCSS){if(typeof document==='undefined')return;let tmpStyleEl=document.getElementById(STYLE_ELEMENT_ID);if(!tmpStyleEl){tmpStyleEl=document.createElement('style');tmpStyleEl.id=STYLE_ELEMENT_ID;document.head.appendChild(tmpStyleEl);}tmpStyleEl.textContent=pCSS;}// Escape so the brand name can ride along inside the CSS `content`-style
// `--brand-name` value as a quoted string.
function _cssQuote(pStr){return'"'+String(pStr||'').replace(/\\/g,'\\\\').replace(/"/g,'\\"')+'"';}function _buildCSS(pBrand){let tmpC=pBrand.Colors;let tmpRoot=':root {\n'+'\t--brand-color-primary:         '+tmpC.Primary+';\n'+'\t--brand-color-secondary:       '+tmpC.Secondary+';\n'+'\t--brand-color-primary-light:   '+tmpC.PrimaryLight+';\n'+'\t--brand-color-primary-dark:    '+tmpC.PrimaryDark+';\n'+'\t--brand-color-secondary-light: '+tmpC.SecondaryLight+';\n'+'\t--brand-color-secondary-dark:  '+tmpC.SecondaryDark+';\n'+'\t--brand-color-primary-mode:    '+tmpC.PrimaryLight+';\n'+'\t--brand-color-secondary-mode:  '+tmpC.SecondaryLight+';\n'+'\t--brand-name:                  '+_cssQuote(pBrand.Name)+';\n'+'}\n';// Dark-mode overrides for the *-mode variables only.
let tmpDark='.theme-dark {\n'+'\t--brand-color-primary-mode:    '+tmpC.PrimaryDark+';\n'+'\t--brand-color-secondary-mode:  '+tmpC.SecondaryDark+';\n'+'}\n';return tmpRoot+tmpDark;}/**
 * Apply (or replace) the active brand. Pass `null` to clear.
 *
 * @param {object|null} pBrand
 * @returns {object|null} the normalized active brand (or null on clear)
 */function applyBrand(pBrand){let tmpPrev=_activeBrand;if(pBrand===null){_activeBrand=null;if(typeof document!=='undefined'){let tmpStyleEl=document.getElementById(STYLE_ELEMENT_ID);if(tmpStyleEl&&tmpStyleEl.parentNode)tmpStyleEl.parentNode.removeChild(tmpStyleEl);}_removeFaviconLinks();_fireChange(null,tmpPrev);return null;}let tmpNorm=_normalize(pBrand);if(!tmpNorm){// Bad input — keep current brand, no-op.
if(typeof console!=='undefined'&&console.warn){console.warn('Theme-Brand.applyBrand: bad brand object — needs Colors.Primary + Colors.Secondary as strings.');}return _activeBrand;}_activeBrand=tmpNorm;_injectStyleElement(_buildCSS(tmpNorm));_injectFaviconLinks(tmpNorm);_fireChange(tmpNorm,tmpPrev);return tmpNorm;}function getActive(){return _activeBrand;}function onChange(fCallback){if(typeof fCallback!=='function')return function(){};_listeners.push(fCallback);return function(){offChange(fCallback);};}function offChange(fCallback){let tmpIdx=_listeners.indexOf(fCallback);if(tmpIdx>=0)_listeners.splice(tmpIdx,1);}function _fireChange(pNew,pOld){for(let i=0;i<_listeners.length;i++){try{_listeners[i](pNew,pOld);}catch(pErr){/* swallow — listener failure must not break callers */}}}/**
 * Reset to no-brand state and detach the injected style. Tests use this;
 * runtime hosts rarely need it.
 */function reset(){applyBrand(null);_listeners=[];}module.exports={applyBrand:applyBrand,getActive:getActive,onChange:onChange,offChange:offChange,reset:reset,STYLE_ELEMENT_ID:STYLE_ELEMENT_ID,FAVICON_LINK_ID:FAVICON_LINK_ID,FAVICON_DARK_LINK_ID:FAVICON_DARK_LINK_ID};},{}],35:[function(require,module,exports){/**
 * Theme-Icons — single source of truth for the inline SVG glyphs the
 * theme section uses (sun, moon, system / monitor, plus a chevron for
 * dropdown triggers).
 *
 * Every icon:
 *   - Is a self-contained SVG string suitable for direct DOM insertion
 *     (innerHTML, template substitution, or pict-section-modal's
 *     `Icon: <html>` field on dropdown items).
 *   - Uses `currentColor` for stroke so it picks up the surrounding
 *     text colour from the active theme (light + dark both look right
 *     without per-mode swaps).
 *   - Has `aria-hidden="true"` so screen readers ignore the decorative
 *     glyph and rely on the surrounding label / aria-label instead.
 *
 * The shapes are intentionally line-art (stroke-based, fill="none") so
 * they read at very small sizes (12–16 px) without going muddy. The
 * "system" icon is a stylised display (rectangle + stand) rather than
 * the unicode 🖥 to keep visual weight consistent with sun + moon.
 *
 * Need a different size? Pass `pSizePx` to any of the iconXxx() helpers
 * and the wrapper SVG's width/height are emitted with that value. The
 * default is 14 px which matches the mode toggle's existing visual.
 */const _DEFAULT_SIZE_PX=14;function _wrap(pSizePx,pInner){let tmpSize=typeof pSizePx==='number'&&pSizePx>0?pSizePx:_DEFAULT_SIZE_PX;return'<svg class="pict-theme-icon"'+' width="'+tmpSize+'" height="'+tmpSize+'"'+' viewBox="0 0 24 24" fill="none"'+' stroke="currentColor" stroke-width="2"'+' stroke-linecap="round" stroke-linejoin="round"'+' aria-hidden="true">'+pInner+'</svg>';}/**
 * Sun glyph — central disc + 8 radial rays. Communicates "light mode"
 * universally. Slightly chunkier disc than the typical Feather sun so
 * it still reads at 12 px.
 */function iconSun(pSizePx){return _wrap(pSizePx,'<circle cx="12" cy="12" r="4"/>'+'<path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>');}/**
 * Moon glyph — clean crescent (one continuous filled-look path drawn
 * as a stroke). Avoids the brittle thin-crescent unicode characters
 * that fall back to weird outline glyphs in some system fonts.
 */function iconMoon(pSizePx){return _wrap(pSizePx,'<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>');}/**
 * System / display glyph — a small monitor with a stand. Communicates
 * "follow the OS preference" without ambiguity (a monitor is universal
 * UI for system settings, more than the gear icon would be).
 */function iconSystem(pSizePx){return _wrap(pSizePx,'<rect x="2" y="4" width="20" height="14" rx="2"/>'+'<path d="M8 21h8M12 18v3"/>');}/**
 * Composite: a sun + moon side-by-side, sized so the two icons fit in
 * the same horizontal footprint as a single icon. Used in the picker
 * to indicate a paired (Light + Dark) theme without needing two
 * separate visual columns.
 */function iconPaired(pSizePx){let tmpSize=typeof pSizePx==='number'&&pSizePx>0?pSizePx:_DEFAULT_SIZE_PX;// Each half uses currentColor; the sun is rendered slightly smaller
// in the left half and the moon in the right half by abusing the
// viewBox width.
return'<svg class="pict-theme-icon pict-theme-icon-paired"'+' width="'+tmpSize*1.6+'" height="'+tmpSize+'"'+' viewBox="0 0 38 24" fill="none"'+' stroke="currentColor" stroke-width="2"'+' stroke-linecap="round" stroke-linejoin="round"'+' aria-hidden="true">'// Sun on the left (centred at 8,12, radius 3)
+'<circle cx="8" cy="12" r="3"/>'+'<path d="M8 4v1.5M8 18.5V20M2.5 12H4M12 12h1.5M4.1 7.1l1 1M11.1 7.1l-1 1M4.1 16.9l1-1M11.1 16.9l-1-1"/>'// Moon on the right (mirrored crescent, centred near x=28)
+'<path d="M33 13.5A6.5 6.5 0 1 1 26 6a5 5 0 0 0 7 7.5z"/>'+'</svg>';}/**
 * Down-chevron used by dropdown triggers. Sized to sit alongside body
 * text (10 px default).
 */function iconChevronDown(pSizePx){let tmpSize=typeof pSizePx==='number'&&pSizePx>0?pSizePx:10;return'<svg class="pict-theme-icon pict-theme-icon-chevron"'+' width="'+tmpSize+'" height="'+tmpSize+'"'+' viewBox="0 0 12 12" fill="none"'+' stroke="currentColor" stroke-width="1.6"'+' stroke-linecap="round" stroke-linejoin="round"'+' aria-hidden="true">'+'<path d="M3 4.5l3 3 3-3"/>'+'</svg>';}/**
 * Pick the right capability icon for a theme based on its mode strategy.
 * Returns the composite paired glyph for paired themes, sun for light-only,
 * moon for dark-only.
 *
 * @param {string} pStrategy - 'single' or 'system'/'paired'
 * @param {string} pDefaultMode - 'light' or 'dark' (only consulted for single)
 * @param {number} [pSizePx]
 */function iconForTheme(pStrategy,pDefaultMode,pSizePx){if(pStrategy==='single'){return pDefaultMode==='dark'?iconMoon(pSizePx):iconSun(pSizePx);}return iconPaired(pSizePx);}module.exports={iconSun:iconSun,iconMoon:iconMoon,iconSystem:iconSystem,iconPaired:iconPaired,iconChevronDown:iconChevronDown,iconForTheme:iconForTheme,DEFAULT_SIZE_PX:_DEFAULT_SIZE_PX};},{}],36:[function(require,module,exports){/**
 * Theme-Persistence — reads and writes the user's selected theme + mode
 * to the browser's localStorage so a reload restores the same look.
 *
 * pict-provider-theme is intentionally stateless — host applications
 * decide what to apply at boot. This module is the small, opt-out-able
 * layer that pict-section-theme.install() uses to make "remember my
 * theme" the default behaviour without forcing every consumer to wire
 * it themselves.
 *
 * # Storage shape
 *
 * Every entry is a single JSON object under one key:
 *
 *   localStorage["pict-section-theme:<scope>"] =
 *     {
 *       Version:   1,
 *       ThemeHash: "retold-manager",
 *       Mode:      "dark",
 *       Scale:     1.25,
 *       SavedAt:   "2026-05-09T21:00:00.000Z"
 *     }
 *
 * Version-tagged so future schema changes can be migrated cleanly;
 * mismatched versions are treated as "no saved entry" and the host
 * application's defaults take over. Older entries that pre-date the
 * Scale field are still valid — Scale is optional and load() returns
 * null for it when absent (caller defaults to 1.0).
 *
 * # Scope (the <scope> portion of the key)
 *
 * Determined in this priority order:
 *   1. The string the host passed in (`PersistenceKey: 'my-app'`) —
 *      use this when one host serves multiple logical apps from the
 *      same origin and they shouldn't share theme state.
 *   2. window.location.hostname when running in a browser.
 *   3. The literal 'default' as a last-ditch fallback (Node, sandbox,
 *      mid-SSR, etc.).
 *
 * # Failure modes
 *
 * - localStorage missing (SSR, Safari private mode, blocked) →
 *   load() returns null, save() returns false, no exception.
 * - Quota exceeded → save() returns false silently; the in-memory
 *   active theme is unaffected.
 * - JSON parse error or version mismatch → load() returns null so the
 *   caller falls back to ApplyDefault.
 *
 * Nothing here throws — persistence failures must NEVER crash the host
 * application's boot path.
 */const STORAGE_PREFIX='pict-section-theme:';const SCHEMA_VERSION=1;function _getStorage(){try{if(typeof window!=='undefined'&&window.localStorage){return window.localStorage;}}catch(pErr){/* SecurityError in some contexts */}return null;}function _autoScope(){try{if(typeof window!=='undefined'&&window.location&&window.location.hostname){return window.location.hostname;}}catch(pErr){/* fall through */}return'default';}/**
 * Resolve the full localStorage key for this app's theme state.
 *
 * @param {string|null} pUserKey - Host-supplied scope override; falsy
 *   values trigger the auto-scope fallback (hostname → 'default').
 * @returns {string} the fully-qualified localStorage key.
 */function resolveKey(pUserKey){let tmpScope=typeof pUserKey==='string'&&pUserKey.length>0?pUserKey:_autoScope();return STORAGE_PREFIX+tmpScope;}/**
 * Read the saved theme state for a key.  Returns null if nothing is
 * stored, the storage is unavailable, or the entry's schema version
 * doesn't match.
 *
 * @param {string} pKey - the resolved storage key
 * @returns {{ThemeHash: string, Mode: string|null, Scale: number|null}|null}
 */function load(pKey){let tmpStore=_getStorage();if(!tmpStore)return null;let tmpRaw;try{tmpRaw=tmpStore.getItem(pKey);}catch(pErr){return null;}if(!tmpRaw)return null;let tmpParsed;try{tmpParsed=JSON.parse(tmpRaw);}catch(pErr){return null;}if(!tmpParsed||typeof tmpParsed!=='object')return null;if(tmpParsed.Version!==SCHEMA_VERSION)return null;if(typeof tmpParsed.ThemeHash!=='string'||tmpParsed.ThemeHash.length===0)return null;let tmpScale=null;if(typeof tmpParsed.Scale==='number'&&isFinite(tmpParsed.Scale)&&tmpParsed.Scale>0){tmpScale=tmpParsed.Scale;}return{ThemeHash:tmpParsed.ThemeHash,Mode:typeof tmpParsed.Mode==='string'&&tmpParsed.Mode.length>0?tmpParsed.Mode:null,Scale:tmpScale};}/**
 * Persist the active theme + mode for this key.  No-ops gracefully
 * when storage is unavailable or quota is exceeded.
 *
 * @param {string} pKey
 * @param {{ThemeHash: string, Mode?: string, Scale?: number}} pState
 * @returns {boolean} true on success, false otherwise
 */function save(pKey,pState){let tmpStore=_getStorage();if(!tmpStore)return false;if(!pState||typeof pState.ThemeHash!=='string'||pState.ThemeHash.length===0)return false;let tmpEntry={Version:SCHEMA_VERSION,ThemeHash:pState.ThemeHash,Mode:typeof pState.Mode==='string'&&pState.Mode.length>0?pState.Mode:null,Scale:typeof pState.Scale==='number'&&isFinite(pState.Scale)&&pState.Scale>0?pState.Scale:null,SavedAt:new Date().toISOString()};try{tmpStore.setItem(pKey,JSON.stringify(tmpEntry));return true;}catch(pErr){return false;}}/**
 * Remove the saved theme state for a key.  Useful for "reset to
 * defaults" actions.
 */function clear(pKey){let tmpStore=_getStorage();if(!tmpStore)return false;try{tmpStore.removeItem(pKey);return true;}catch(pErr){return false;}}module.exports={resolveKey:resolveKey,load:load,save:save,clear:clear,STORAGE_PREFIX:STORAGE_PREFIX,SCHEMA_VERSION:SCHEMA_VERSION};},{}],37:[function(require,module,exports){/**
 * Theme-Scale — viewport scale (zoom) selector independent of theme bundles.
 *
 * Scale is a *user preference*, not a property of any particular theme:
 * the user might want Cyberpunk-at-1.25x or Retold-Manager-at-0.85x.
 * Pict-provider-theme is intentionally bundle-shaped (Tokens / SVG /
 * Image), so scale lives here at the section layer alongside Mode.
 *
 * # Apply mechanism
 *
 * Two outputs feed cooperating CSS:
 *
 *   1. `html { zoom: <scale>; }` — works for legacy stylesheets that
 *      use `px` everywhere (most Retold apps including retold-manager).
 *      Browsers (Chromium-based + Firefox 126+ + Safari) all honour
 *      `zoom` on root.
 *
 *   2. `:root { --theme-scale: <scale>; }` — exposed for stylesheets
 *      that want to opt into explicit `calc(... * var(--theme-scale))`
 *      sizing. Keeps the value addressable from JS too via
 *      `getComputedStyle(document.documentElement).getPropertyValue(...)`.
 *
 * Both are written into a single `<style id="pict-theme-scale">` element
 * appended to `<head>` after the theme provider's own style element so
 * scale wins last. Re-applying just rewrites this one element's text.
 *
 * # Listener pattern
 *
 * Mirrors pict-provider-theme.onApply(): subscribers receive the new
 * scale value plus the previous value and a return-able `dispose`
 * function. The persistence wiring in pict-section-theme.install()
 * uses this to autosave whenever the scale changes.
 *
 * # Stateless across instances
 *
 * No singleton state — each browser window has one DOM, so the module
 * tracks active scale via a module-level variable, but exposes
 * `getActive()` for callers that want to query it. `applyScale()` is
 * idempotent: applying the same value re-injects the same CSS (cheap
 * no-op).
 */const STYLE_ELEMENT_ID='pict-theme-scale';const CSS_VAR_NAME='--theme-scale';const DEFAULT_SCALE=1.0;const MIN_SCALE=0.5;const MAX_SCALE=3.0;// Curated list of presets. Hosts that want a different range can pass
// a custom `Presets` array to the ScaleSelect view; this default covers
// the readability common cases without overwhelming the dropdown.
const PRESETS=[{Value:0.75,Label:'Tiny (75%)'},{Value:0.85,Label:'Small (85%)'},{Value:1.00,Label:'Default (100%)'},{Value:1.15,Label:'Comfortable (115%)'},{Value:1.25,Label:'Large (125%)'},{Value:1.50,Label:'Huge (150%)'},{Value:1.75,Label:'Extra Huge (175%)'},{Value:2.00,Label:'Massive (200%)'}];let _activeScale=DEFAULT_SCALE;let _listeners=[];function _clamp(pValue){let tmpNum=Number(pValue);if(!isFinite(tmpNum)||tmpNum<=0)return DEFAULT_SCALE;if(tmpNum<MIN_SCALE)return MIN_SCALE;if(tmpNum>MAX_SCALE)return MAX_SCALE;return tmpNum;}function _injectStyleElement(pCSS){if(typeof document==='undefined')return;let tmpStyleEl=document.getElementById(STYLE_ELEMENT_ID);if(!tmpStyleEl){tmpStyleEl=document.createElement('style');tmpStyleEl.id=STYLE_ELEMENT_ID;document.head.appendChild(tmpStyleEl);}tmpStyleEl.textContent=pCSS;}function _buildCSS(pScale){// `zoom` on <html> scales everything (px + rem + layout). The
// `--theme-scale` custom property exposes the same value to any CSS
// that wants to react explicitly via calc().
return':root {\n'+'\t'+CSS_VAR_NAME+': '+pScale+';\n'+'}\n'+'html {\n'+'\tzoom: '+pScale+';\n'+'}\n';}/**
 * Apply a viewport scale.
 *
 * @param {number} pScale - desired multiplier (e.g. 1.0, 1.25). Values
 *   outside [MIN_SCALE, MAX_SCALE] are clamped; non-finite values
 *   reset to DEFAULT_SCALE.
 * @returns {number} the actually-applied scale (after clamping).
 */function applyScale(pScale){let tmpPrev=_activeScale;let tmpNext=_clamp(pScale);_activeScale=tmpNext;_injectStyleElement(_buildCSS(tmpNext));if(tmpPrev!==tmpNext){_fireChange(tmpNext,tmpPrev);}return tmpNext;}function getActive(){return _activeScale;}function onChange(fCallback){if(typeof fCallback!=='function')return function(){};_listeners.push(fCallback);return function(){offChange(fCallback);};}function offChange(fCallback){let tmpIdx=_listeners.indexOf(fCallback);if(tmpIdx>=0)_listeners.splice(tmpIdx,1);}function _fireChange(pNewScale,pOldScale){for(let i=0;i<_listeners.length;i++){try{_listeners[i](pNewScale,pOldScale);}catch(pErr){/* listener failures must not break callers */}}}/**
 * Reset to default scale and remove the injected style element. Useful
 * for tests + "reset to defaults" affordances.
 */function reset(){_activeScale=DEFAULT_SCALE;if(typeof document!=='undefined'){let tmpStyleEl=document.getElementById(STYLE_ELEMENT_ID);if(tmpStyleEl&&tmpStyleEl.parentNode)tmpStyleEl.parentNode.removeChild(tmpStyleEl);}_listeners=[];}module.exports={applyScale:applyScale,getActive:getActive,onChange:onChange,offChange:offChange,reset:reset,PRESETS:PRESETS,DEFAULT_SCALE:DEFAULT_SCALE,MIN_SCALE:MIN_SCALE,MAX_SCALE:MAX_SCALE,STYLE_ELEMENT_ID:STYLE_ELEMENT_ID,CSS_VAR_NAME:CSS_VAR_NAME};},{}],38:[function(require,module,exports){module.exports={"Hash":"1970s-console","Name":"1970s Console","Category":"Fun","Version":"0.0.1","Description":"Amber phosphor on brown-black Ported from RetoldRemote-ThemeDefinitions.js to the pict-provider-theme manifest format.","Comprehensive":true,"Modes":{"Strategy":"single","Default":"dark"},"Tokens":{"Color":{"Background":{"Primary":"#1A1000","Secondary":"#140C00","Tertiary":"#1E1400","Panel":"#1C1200","Viewer":"#100A00","Hover":"#2A1C00","Selected":"#3A2800","Thumb":"#140C00"},"Text":{"Primary":"#FFAA00","Secondary":"#DD8800","Muted":"#AA6600","Dim":"#884400","Placeholder":"#663300"},"Brand":{"Accent":"#FFCC00","AccentHover":"#FFDD44"},"Border":{"Default":"#2A1800","Light":"#3A2200"},"Status":{"Danger":"#FF4400","DangerMuted":"#AA3300"},"Scrollbar":{"Track":"#2A1800","Hover":"#3A2800"},"Selection":{"Background":"rgba(255, 204, 0, 0.2)"},"Focus":{"Outline":"#FFCC00"},"Syntax":{"Keyword":"#FFB000","String":"#FFD080","Number":"#FFB000","Comment":"#806020","Operator":"#FFB000","Punctuation":"#FFD080","Function":"#FFB000","Variable":"#FFE090","Type":"#FFB000","Builtin":"#FFB000","Property":"#FF6E40","Tag":"#FF6E40","AttrName":"#FFB000","AttrValue":"#FFD080"}},"Typography":{"Family":{"Sans":"'Courier New', 'Lucida Console', monospace","Mono":"'Courier New', 'Lucida Console', monospace"}}},"Aliases":{"--retold-bg-primary":"Color.Background.Primary","--retold-bg-secondary":"Color.Background.Secondary","--retold-bg-tertiary":"Color.Background.Tertiary","--retold-bg-panel":"Color.Background.Panel","--retold-bg-viewer":"Color.Background.Viewer","--retold-bg-hover":"Color.Background.Hover","--retold-bg-selected":"Color.Background.Selected","--retold-bg-thumb":"Color.Background.Thumb","--retold-text-primary":"Color.Text.Primary","--retold-text-secondary":"Color.Text.Secondary","--retold-text-muted":"Color.Text.Muted","--retold-text-dim":"Color.Text.Dim","--retold-text-placeholder":"Color.Text.Placeholder","--retold-accent":"Color.Brand.Accent","--retold-accent-hover":"Color.Brand.AccentHover","--retold-border":"Color.Border.Default","--retold-border-light":"Color.Border.Light","--retold-danger":"Color.Status.Danger","--retold-danger-muted":"Color.Status.DangerMuted","--retold-scrollbar":"Color.Scrollbar.Track","--retold-scrollbar-hover":"Color.Scrollbar.Hover","--retold-selection-bg":"Color.Selection.Background","--retold-focus-outline":"Color.Focus.Outline","--retold-font-family":"Typography.Family.Sans","--retold-font-mono":"Typography.Family.Mono"},"IconColors":{"Primary":"#DD8800","Accent":"#FFCC00","Muted":"#884400","Light":"#1E1400","WarmBeige":"#201800","TealTint":"#1A1000","Lavender":"#1C1200","AmberTint":"#221800","PdfFill":"#201000","PdfText":"#FF4400"},"CSS":[],"SVG":{},"Image":{},"CompiledAt":"2026-05-03T18:12:53.405Z","CompilerVersion":1};},{}],39:[function(require,module,exports){module.exports={"Hash":"1980s-console","Name":"1980s Console","Category":"Fun","Version":"0.0.1","Description":"Green phosphor on black Ported from RetoldRemote-ThemeDefinitions.js to the pict-provider-theme manifest format.","Comprehensive":true,"Modes":{"Strategy":"single","Default":"dark"},"Tokens":{"Color":{"Background":{"Primary":"#001200","Secondary":"#000E00","Tertiary":"#001600","Panel":"#001400","Viewer":"#000A00","Hover":"#002200","Selected":"#003800","Thumb":"#000E00"},"Text":{"Primary":"#00FF00","Secondary":"#00CC00","Muted":"#009900","Dim":"#006600","Placeholder":"#004400"},"Brand":{"Accent":"#00FF66","AccentHover":"#44FF88"},"Border":{"Default":"#002A00","Light":"#003A00"},"Status":{"Danger":"#FF0000","DangerMuted":"#AA0000"},"Scrollbar":{"Track":"#002A00","Hover":"#004400"},"Selection":{"Background":"rgba(0, 255, 102, 0.2)"},"Focus":{"Outline":"#00FF66"},"Syntax":{"Keyword":"#00FF00","String":"#90FF90","Number":"#FFFF00","Comment":"#208020","Operator":"#00FF00","Punctuation":"#90FF90","Function":"#00FF00","Variable":"#C0FFC0","Type":"#FFFF00","Builtin":"#FFFF00","Property":"#FF4040","Tag":"#FF4040","AttrName":"#FFFF00","AttrValue":"#90FF90"}},"Typography":{"Family":{"Sans":"'Courier New', monospace","Mono":"'Courier New', monospace"}}},"Aliases":{"--retold-bg-primary":"Color.Background.Primary","--retold-bg-secondary":"Color.Background.Secondary","--retold-bg-tertiary":"Color.Background.Tertiary","--retold-bg-panel":"Color.Background.Panel","--retold-bg-viewer":"Color.Background.Viewer","--retold-bg-hover":"Color.Background.Hover","--retold-bg-selected":"Color.Background.Selected","--retold-bg-thumb":"Color.Background.Thumb","--retold-text-primary":"Color.Text.Primary","--retold-text-secondary":"Color.Text.Secondary","--retold-text-muted":"Color.Text.Muted","--retold-text-dim":"Color.Text.Dim","--retold-text-placeholder":"Color.Text.Placeholder","--retold-accent":"Color.Brand.Accent","--retold-accent-hover":"Color.Brand.AccentHover","--retold-border":"Color.Border.Default","--retold-border-light":"Color.Border.Light","--retold-danger":"Color.Status.Danger","--retold-danger-muted":"Color.Status.DangerMuted","--retold-scrollbar":"Color.Scrollbar.Track","--retold-scrollbar-hover":"Color.Scrollbar.Hover","--retold-selection-bg":"Color.Selection.Background","--retold-focus-outline":"Color.Focus.Outline","--retold-font-family":"Typography.Family.Sans","--retold-font-mono":"Typography.Family.Mono"},"IconColors":{"Primary":"#00CC00","Accent":"#00FF66","Muted":"#006600","Light":"#001600","WarmBeige":"#001A00","TealTint":"#001200","Lavender":"#001400","AmberTint":"#001800","PdfFill":"#140000","PdfText":"#FF0000"},"CSS":[],"SVG":{},"Image":{},"CompiledAt":"2026-05-03T18:12:53.406Z","CompilerVersion":1};},{}],40:[function(require,module,exports){module.exports={"Hash":"1990s-website","Name":"1990s Web Site","Category":"Fun","Version":"0.0.1","Description":"Blue links on grey, beveled Ported from RetoldRemote-ThemeDefinitions.js to the pict-provider-theme manifest format.","Comprehensive":true,"Modes":{"Strategy":"single","Default":"light"},"Tokens":{"Color":{"Background":{"Primary":"#C0C0C0","Secondary":"#B0B0B0","Tertiary":"#A8A8A8","Panel":"#B8B8B8","Viewer":"#D0D0D0","Hover":"#B8B8D0","Selected":"#000080","Thumb":"#B0B0B0"},"Text":{"Primary":"#000000","Secondary":"#000080","Muted":"#404040","Dim":"#606060","Placeholder":"#808080"},"Brand":{"Accent":"#0000FF","AccentHover":"#0000CC"},"Border":{"Default":"#808080","Light":"#A0A0A0"},"Status":{"Danger":"#FF0000","DangerMuted":"#990000"},"Scrollbar":{"Track":"#808080","Hover":"#606060"},"Selection":{"Background":"rgba(0, 0, 128, 0.3)"},"Focus":{"Outline":"#0000FF"},"Syntax":{"Keyword":"#0000FF","String":"#008000","Number":"#A52A2A","Comment":"#808080","Operator":"#000080","Punctuation":"#000000","Function":"#0000A0","Variable":"#000000","Type":"#A52A2A","Builtin":"#A52A2A","Property":"#800080","Tag":"#800080","AttrName":"#A52A2A","AttrValue":"#008000"}},"Typography":{"Family":{"Sans":"'Times New Roman', Times, serif","Mono":"'Courier New', Courier, monospace"}}},"Aliases":{"--retold-bg-primary":"Color.Background.Primary","--retold-bg-secondary":"Color.Background.Secondary","--retold-bg-tertiary":"Color.Background.Tertiary","--retold-bg-panel":"Color.Background.Panel","--retold-bg-viewer":"Color.Background.Viewer","--retold-bg-hover":"Color.Background.Hover","--retold-bg-selected":"Color.Background.Selected","--retold-bg-thumb":"Color.Background.Thumb","--retold-text-primary":"Color.Text.Primary","--retold-text-secondary":"Color.Text.Secondary","--retold-text-muted":"Color.Text.Muted","--retold-text-dim":"Color.Text.Dim","--retold-text-placeholder":"Color.Text.Placeholder","--retold-accent":"Color.Brand.Accent","--retold-accent-hover":"Color.Brand.AccentHover","--retold-border":"Color.Border.Default","--retold-border-light":"Color.Border.Light","--retold-danger":"Color.Status.Danger","--retold-danger-muted":"Color.Status.DangerMuted","--retold-scrollbar":"Color.Scrollbar.Track","--retold-scrollbar-hover":"Color.Scrollbar.Hover","--retold-selection-bg":"Color.Selection.Background","--retold-focus-outline":"Color.Focus.Outline","--retold-font-family":"Typography.Family.Sans","--retold-font-mono":"Typography.Family.Mono"},"IconColors":{"Primary":"#000080","Accent":"#0000FF","Muted":"#606060","Light":"#A8A8A8","WarmBeige":"#B0B0B0","TealTint":"#A0A0A0","Lavender":"#ABABD0","AmberTint":"#B8B0A0","PdfFill":"#C0A0A0","PdfText":"#FF0000"},"CSS":[],"SVG":{},"Image":{},"CompiledAt":"2026-05-03T18:12:53.406Z","CompilerVersion":1};},{}],41:[function(require,module,exports){/**
 * Theme Registry — runtime registry of every theme available to
 * pict-section-theme.
 *
 * Bundled "starter set" themes are pre-registered at module load time
 * via static `require()` so browserify can resolve and inline each JSON
 * at bundle time. Beyond the starter set, consumers can register
 * additional theme bundles at runtime — useful for:
 *
 *   - Loading themes the host app authored (e.g. an app's own brand
 *     palette that isn't shipped with this module).
 *   - Pulling themes from a remote "theme garden" via
 *     `registerFromURL()` (CDN-hosted curated bundles).
 *   - Tooling / playgrounds that mutate the registry as the user
 *     iterates.
 *
 * Module exports a singleton instance, so all consumers operate on the
 * same set. Use `register({Hash, Bundle, Category, IsDefault})` to add
 * themes, `list()` to enumerate them, `get(hash)` for direct lookup,
 * `unregister(hash)` to remove.
 *
 * Each entry shape:
 *
 *   {
 *     Hash:       <string>      // matches bundle.Hash; used by the picker
 *     Bundle:     <object>      // theme JSON, ready for provider.registerTheme()
 *     Category:   <string>      // grouping label for the picker UI
 *     IsDefault:  <bool?>       // true for the canonical ecosystem default
 *     Source:     <string?>     // 'starter' | URL | host-supplied tag
 *   }
 *
 * Backwards-compat:
 *   - The instance is iterable (Symbol.iterator), exposes `.length`,
 *     and supports numeric indexing `[i]` so legacy code that treated
 *     the catalog as an array continues to work without changes.
 */'use strict';class ThemeRegistry{constructor(){this._themes=new Map();// Hash → entry, insertion-ordered
this._loadStarterSet();}// ── Bundled starter set ──────────────────────────────────────────────
// Each `require()` is a literal string so browserify inlines the JSON
// at build time. Adding a new bundled theme: drop the JSON in this
// folder and append a row here. Runtime additions go via register()
// from anywhere else in the codebase.
_loadStarterSet(){const STARTER=[// Framework defaults
// retold-default is the canonical ecosystem default (IsDefault).
// pict-default is retained for backwards compatibility with any
// consumer that explicitly opts in by Hash; it's no longer the
// default theme returned when the picker resolves "the default".
{Hash:'retold-default',Category:'Default',IsDefault:true,Bundle:require('./retold-default.json')},{Hash:'pict-default',Category:'Default',Bundle:require('./pict-default.json')},{Hash:'retold-mono',Category:'Default',Bundle:require('./retold-mono.json')},// App-extracted themes (named after their host app)
{Hash:'retold-manager',Category:'App',Bundle:require('./retold-manager.json')},{Hash:'retold-content-system',Category:'App',Bundle:require('./retold-content-system.json')},{Hash:'retold-labs',Category:'App',Bundle:require('./retold-labs.json')},{Hash:'retold-labs-cyberpunk',Category:'App',Bundle:require('./retold-labs-cyberpunk.json')},{Hash:'retold-labs-retro',Category:'App',Bundle:require('./retold-labs-retro.json')},{Hash:'ultravisor-desert-dusk',Category:'App',Bundle:require('./ultravisor-desert-dusk.json')},{Hash:'ultravisor-desert-day',Category:'App',Bundle:require('./ultravisor-desert-day.json')},{Hash:'ultravisor-desert-sunset',Category:'App',Bundle:require('./ultravisor-desert-sunset.json')},{Hash:'ultravisor-professional-light',Category:'App',Bundle:require('./ultravisor-professional-light.json')},{Hash:'ultravisor-professional-dark',Category:'App',Bundle:require('./ultravisor-professional-dark.json')},{Hash:'ultravisor-desert-canyon',Category:'App',Bundle:require('./ultravisor-desert-canyon.json')},// Paired light/dark themes
{Hash:'ocean',Category:'Paired',Bundle:require('./ocean.json')},{Hash:'playground-corp',Category:'Paired',Bundle:require('./playground-corp.json')},// Flow themes (originally pict-section-flow's internal presets; now first-class
// pict-section-theme entries so other apps can adopt the same color identity)
{Hash:'flow-modern',Category:'Flow',Bundle:require('./flow-modern.json')},{Hash:'flow-sketch',Category:'Flow',Bundle:require('./flow-sketch.json')},{Hash:'flow-blueprint',Category:'Flow',Bundle:require('./flow-blueprint.json')},{Hash:'flow-mono',Category:'Flow',Bundle:require('./flow-mono.json')},{Hash:'flow-retro-80s',Category:'Flow',Bundle:require('./flow-retro-80s.json')},{Hash:'flow-retro-90s',Category:'Flow',Bundle:require('./flow-retro-90s.json')},{Hash:'flow-whiteboard',Category:'Flow',Bundle:require('./flow-whiteboard.json')},// Greys (low-light single-mode themes)
{Hash:'twilight',Category:'Grey',Bundle:require('./twilight.json')},{Hash:'night',Category:'Grey',Bundle:require('./night.json')},{Hash:'evening',Category:'Grey',Bundle:require('./evening.json')},{Hash:'afternoon',Category:'Grey',Bundle:require('./afternoon.json')},{Hash:'daylight',Category:'Grey',Bundle:require('./daylight.json')},// Fun / period palettes
{Hash:'cyberpunk',Category:'Fun',Bundle:require('./cyberpunk.json')},{Hash:'synthwave',Category:'Fun',Bundle:require('./synthwave.json')},{Hash:'neo-tokyo',Category:'Fun',Bundle:require('./neo-tokyo.json')},{Hash:'solarized-dark',Category:'Fun',Bundle:require('./solarized-dark.json')},{Hash:'forest',Category:'Fun',Bundle:require('./forest.json')},{Hash:'hotdog',Category:'Fun',Bundle:require('./hotdog.json')},{Hash:'1970s-console',Category:'Fun',Bundle:require('./1970s-console.json')},{Hash:'1980s-console',Category:'Fun',Bundle:require('./1980s-console.json')},{Hash:'1990s-website',Category:'Fun',Bundle:require('./1990s-website.json')},{Hash:'early-2000s',Category:'Fun',Bundle:require('./early-2000s.json')},// Retro workstation palettes — extracted from retold-databeacon's
// original built-in theme set; period-platform-themed pairs.
{Hash:'databeacon-nineteen-97',Category:'Retro',Bundle:require('./databeacon-nineteen-97.json')},{Hash:'databeacon-mac-classic',Category:'Retro',Bundle:require('./databeacon-mac-classic.json')},{Hash:'databeacon-next',Category:'Retro',Bundle:require('./databeacon-next.json')},{Hash:'databeacon-beos',Category:'Retro',Bundle:require('./databeacon-beos.json')},{Hash:'databeacon-sgi',Category:'Retro',Bundle:require('./databeacon-sgi.json')},// Diagnostics / utility
{Hash:'mobile-debug',Category:'Debug',Bundle:require('./mobile-debug.json')}];for(let i=0;i<STARTER.length;i++){let tmpEntry=Object.assign({},STARTER[i],{Source:STARTER[i].Source||'starter'});this._themes.set(tmpEntry.Hash,tmpEntry);}}// ── Public API ───────────────────────────────────────────────────────
/**
	 * Register a theme. Re-registering an existing hash overwrites cleanly.
	 *
	 * @param {{Hash, Bundle, Category?, IsDefault?, Source?}} pEntry
	 * @returns {object} the stored entry
	 */register(pEntry){if(!pEntry||typeof pEntry!=='object'){throw new Error('ThemeRegistry.register: entry must be an object');}if(typeof pEntry.Hash!=='string'||pEntry.Hash.length===0){throw new Error('ThemeRegistry.register: entry.Hash is required');}if(!pEntry.Bundle||typeof pEntry.Bundle!=='object'){throw new Error('ThemeRegistry.register: entry.Bundle is required');}let tmpStored=Object.assign({Source:'host'},pEntry);this._themes.set(pEntry.Hash,tmpStored);return tmpStored;}/**
	 * Remove a theme by hash. Returns true if anything was removed.
	 * @param {string} pHash
	 * @returns {boolean}
	 */unregister(pHash){return this._themes.delete(pHash);}/**
	 * Look up a single theme entry by hash.
	 * @param {string} pHash
	 * @returns {object|undefined}
	 */get(pHash){return this._themes.get(pHash);}has(pHash){return this._themes.has(pHash);}/**
	 * Snapshot of every registered entry, in registration order.
	 * @returns {Array<object>}
	 */list(){return Array.from(this._themes.values());}/**
	 * Drop every registered entry. Mostly useful in tests; production
	 * consumers should prefer `unregister()` per hash.
	 */clear(){this._themes.clear();}/**
	 * Re-load the bundled starter set. No-op if the starter set is
	 * already registered (re-registering replaces, so this is safe to
	 * call any time).
	 */loadStarterSet(){this._loadStarterSet();}/**
	 * Number of registered themes.
	 * @returns {number}
	 */get count(){return this._themes.size;}/**
	 * Async fetch + register from a URL. Used by the future "online theme
	 * garden" — the URL must serve a JSON bundle compatible with
	 * pict-provider-theme's `registerTheme()` shape.
	 *
	 * @param {string} pURL
	 * @param {{Category?, IsDefault?, Hash?}} [pMetadata] - override metadata
	 * @returns {Promise<object>} the registered entry
	 */async registerFromURL(pURL,pMetadata){if(typeof fetch!=='function'){throw new Error('ThemeRegistry.registerFromURL: fetch is not available in this environment');}let tmpResponse=await fetch(pURL);if(!tmpResponse.ok){throw new Error('ThemeRegistry.registerFromURL: HTTP '+tmpResponse.status+' for '+pURL);}let tmpBundle=await tmpResponse.json();if(!tmpBundle||typeof tmpBundle!=='object'||typeof tmpBundle.Hash!=='string'){throw new Error('ThemeRegistry.registerFromURL: payload missing Hash');}let tmpMeta=pMetadata||{};return this.register({Hash:tmpMeta.Hash||tmpBundle.Hash,Bundle:tmpBundle,Category:tmpMeta.Category||'Garden',IsDefault:!!tmpMeta.IsDefault,Source:pURL});}// ── Array-like compatibility ─────────────────────────────────────────
// Older code iterated the catalog as an array (`for (let i = 0; i <
// CATALOG.length; i++) ... CATALOG[i]`). Preserve those usages without
// requiring a refactor: the iterator + length + numeric proxy give
// `Array.isArray(registry)` returns false, but everything that reads
// keeps working. New code should prefer `list()` / `get()`.
get length(){return this._themes.size;}[Symbol.iterator](){return this._themes.values();}}// Singleton — every consumer gets the same registry.
const _Registry=new ThemeRegistry();// Numeric-index proxy: `registry[0]` returns the first entry, matching
// the legacy "catalog as array" shape. Wraps the singleton so existing
// `tmpEntry = _CATALOG[i]` loops keep working.
const _IndexedRegistry=new Proxy(_Registry,{get(pTarget,pProp,pReceiver){if(typeof pProp==='string'&&/^\d+$/.test(pProp)){let tmpIdx=parseInt(pProp,10);let tmpList=pTarget.list();return tmpList[tmpIdx];}return Reflect.get(pTarget,pProp,pReceiver);},has(pTarget,pProp){if(typeof pProp==='string'&&/^\d+$/.test(pProp)){return parseInt(pProp,10)<pTarget.length;}return Reflect.has(pTarget,pProp);}});module.exports=_IndexedRegistry;module.exports.ThemeRegistry=ThemeRegistry;},{"./1970s-console.json":38,"./1980s-console.json":39,"./1990s-website.json":40,"./afternoon.json":42,"./cyberpunk.json":43,"./databeacon-beos.json":44,"./databeacon-mac-classic.json":45,"./databeacon-next.json":46,"./databeacon-nineteen-97.json":47,"./databeacon-sgi.json":48,"./daylight.json":49,"./early-2000s.json":50,"./evening.json":51,"./flow-blueprint.json":52,"./flow-modern.json":53,"./flow-mono.json":54,"./flow-retro-80s.json":55,"./flow-retro-90s.json":56,"./flow-sketch.json":57,"./flow-whiteboard.json":58,"./forest.json":59,"./hotdog.json":60,"./mobile-debug.json":61,"./neo-tokyo.json":62,"./night.json":63,"./ocean.json":64,"./pict-default.json":65,"./playground-corp.json":66,"./retold-content-system.json":67,"./retold-default.json":68,"./retold-labs-cyberpunk.json":69,"./retold-labs-retro.json":70,"./retold-labs.json":71,"./retold-manager.json":72,"./retold-mono.json":73,"./solarized-dark.json":74,"./synthwave.json":75,"./twilight.json":76,"./ultravisor-desert-canyon.json":77,"./ultravisor-desert-day.json":78,"./ultravisor-desert-dusk.json":79,"./ultravisor-desert-sunset.json":80,"./ultravisor-professional-dark.json":81,"./ultravisor-professional-light.json":82}],42:[function(require,module,exports){module.exports={"Hash":"afternoon","Name":"Afternoon","Category":"Grey","Version":"0.0.1","Description":"Warm light grey, softer contrast Ported from RetoldRemote-ThemeDefinitions.js to the pict-provider-theme manifest format.","Comprehensive":true,"Modes":{"Strategy":"single","Default":"light"},"Tokens":{"Color":{"Background":{"Primary":"#E8E4E0","Secondary":"#DAD6D2","Tertiary":"#D0CCC8","Panel":"#DDD9D5","Viewer":"#F0ECE8","Hover":"#CCC8C4","Selected":"#B8B4B0","Thumb":"#DAD6D2"},"Text":{"Primary":"#2A2A2A","Secondary":"#404040","Muted":"#707070","Dim":"#909090","Placeholder":"#B0B0B0"},"Brand":{"Accent":"#555555","AccentHover":"#333333"},"Border":{"Default":"#C0BCB8","Light":"#D0CCC8"},"Status":{"Danger":"#AA3333","DangerMuted":"#886655"},"Scrollbar":{"Track":"#B8B4B0","Hover":"#A0A09C"},"Selection":{"Background":"rgba(85, 85, 85, 0.2)"},"Focus":{"Outline":"#555555"},"Syntax":{"Keyword":"#7038A0","String":"#2E7A3A","Number":"#A86B00","Comment":"#888888","Operator":"#1F6FB5","Punctuation":"#666666","Function":"#3357C7","Variable":"#222222","Type":"#A86B00","Builtin":"#A86B00","Property":"#B62828","Tag":"#B62828","AttrName":"#A86B00","AttrValue":"#2E7A3A"}},"Typography":{"Family":{"Sans":"Georgia, 'Times New Roman', serif","Mono":"'Courier New', Courier, monospace"}}},"Aliases":{"--retold-bg-primary":"Color.Background.Primary","--retold-bg-secondary":"Color.Background.Secondary","--retold-bg-tertiary":"Color.Background.Tertiary","--retold-bg-panel":"Color.Background.Panel","--retold-bg-viewer":"Color.Background.Viewer","--retold-bg-hover":"Color.Background.Hover","--retold-bg-selected":"Color.Background.Selected","--retold-bg-thumb":"Color.Background.Thumb","--retold-text-primary":"Color.Text.Primary","--retold-text-secondary":"Color.Text.Secondary","--retold-text-muted":"Color.Text.Muted","--retold-text-dim":"Color.Text.Dim","--retold-text-placeholder":"Color.Text.Placeholder","--retold-accent":"Color.Brand.Accent","--retold-accent-hover":"Color.Brand.AccentHover","--retold-border":"Color.Border.Default","--retold-border-light":"Color.Border.Light","--retold-danger":"Color.Status.Danger","--retold-danger-muted":"Color.Status.DangerMuted","--retold-scrollbar":"Color.Scrollbar.Track","--retold-scrollbar-hover":"Color.Scrollbar.Hover","--retold-selection-bg":"Color.Selection.Background","--retold-focus-outline":"Color.Focus.Outline","--retold-font-family":"Typography.Family.Sans","--retold-font-mono":"Typography.Family.Mono"},"IconColors":{"Primary":"#404040","Accent":"#555555","Muted":"#909090","Light":"#D0CCC8","WarmBeige":"#DAD6D2","TealTint":"#CCC8C4","Lavender":"#D2D0CE","AmberTint":"#D8D2C8","PdfFill":"#D8C8C0","PdfText":"#AA3333"},"CSS":[],"SVG":{},"Image":{},"CompiledAt":"2026-05-03T18:12:53.406Z","CompilerVersion":1};},{}],43:[function(require,module,exports){module.exports={"Hash":"cyberpunk","Name":"Cyberpunk","Category":"Fun","Version":"0.0.1","Description":"Electric green on black Ported from RetoldRemote-ThemeDefinitions.js to the pict-provider-theme manifest format.","Comprehensive":true,"Modes":{"Strategy":"single","Default":"dark"},"Tokens":{"Color":{"Background":{"Primary":"#0A0E0A","Secondary":"#060806","Tertiary":"#0E120E","Panel":"#0C100C","Viewer":"#040604","Hover":"#142014","Selected":"#1A3A1A","Thumb":"#060806"},"Text":{"Primary":"#C8FFC8","Secondary":"#A0D8A0","Muted":"#608860","Dim":"#406040","Placeholder":"#305030"},"Brand":{"Accent":"#00FF41","AccentHover":"#44FF77"},"Border":{"Default":"#1A2A1A","Light":"#224022"},"Status":{"Danger":"#FF3333","DangerMuted":"#AA2222"},"Scrollbar":{"Track":"#1A2A1A","Hover":"#2A4A2A"},"Selection":{"Background":"rgba(0, 255, 65, 0.2)"},"Focus":{"Outline":"#00FF41"},"Syntax":{"Keyword":"#FF00FF","String":"#00FF41","Number":"#FFFF00","Comment":"#406040","Operator":"#00FFFF","Punctuation":"#A0D8A0","Function":"#FF00FF","Variable":"#C8FFC8","Type":"#FFFF00","Builtin":"#FFFF00","Property":"#FF3333","Tag":"#FF3333","AttrName":"#FFFF00","AttrValue":"#00FF41"}},"Typography":{"Family":{"Sans":"'Lucida Console', 'Courier New', monospace","Mono":"'Lucida Console', 'Courier New', monospace"}}},"Aliases":{"--retold-bg-primary":"Color.Background.Primary","--retold-bg-secondary":"Color.Background.Secondary","--retold-bg-tertiary":"Color.Background.Tertiary","--retold-bg-panel":"Color.Background.Panel","--retold-bg-viewer":"Color.Background.Viewer","--retold-bg-hover":"Color.Background.Hover","--retold-bg-selected":"Color.Background.Selected","--retold-bg-thumb":"Color.Background.Thumb","--retold-text-primary":"Color.Text.Primary","--retold-text-secondary":"Color.Text.Secondary","--retold-text-muted":"Color.Text.Muted","--retold-text-dim":"Color.Text.Dim","--retold-text-placeholder":"Color.Text.Placeholder","--retold-accent":"Color.Brand.Accent","--retold-accent-hover":"Color.Brand.AccentHover","--retold-border":"Color.Border.Default","--retold-border-light":"Color.Border.Light","--retold-danger":"Color.Status.Danger","--retold-danger-muted":"Color.Status.DangerMuted","--retold-scrollbar":"Color.Scrollbar.Track","--retold-scrollbar-hover":"Color.Scrollbar.Hover","--retold-selection-bg":"Color.Selection.Background","--retold-focus-outline":"Color.Focus.Outline","--retold-font-family":"Typography.Family.Sans","--retold-font-mono":"Typography.Family.Mono"},"IconColors":{"Primary":"#A0D8A0","Accent":"#00FF41","Muted":"#406040","Light":"#0E120E","WarmBeige":"#101610","TealTint":"#0C140C","Lavender":"#0E120E","AmberTint":"#141810","PdfFill":"#181010","PdfText":"#FF3333"},"CSS":[],"SVG":{},"Image":{},"CompiledAt":"2026-05-03T18:12:53.406Z","CompilerVersion":1};},{}],44:[function(require,module,exports){module.exports={"Hash":"databeacon-beos","Name":"DataBeacon \u2014 BeOS","Version":"0.0.1","Description":"BeOS palette \u2014 cool teals with orange accents. Light: sky-blue desktop. Dark: deep ocean panels with cyan highlights.","Comprehensive":true,"Modes":{"Strategy":"system","Default":"system"},"Tokens":{"Color":{"Background":{"Primary":{"Light":"#e0e8ec","Dark":"#0a1a22"},"Secondary":{"Light":"#c8d6de","Dark":"#102530"},"Tertiary":{"Light":"#d4dfe5","Dark":"#0d1f29"},"Panel":{"Light":"#f0f4f6","Dark":"#142430"},"Input":{"Light":"#ffffff","Dark":"#1b313f"},"Hover":{"Light":"#d7dee2","Dark":"#091820"},"Selected":{"Light":"#c2d4da","Dark":"#19353e"}},"Text":{"Primary":{"Light":"#101820","Dark":"#b0d0e0"},"Secondary":{"Light":"#40525e","Dark":"#7a98a8"},"Muted":{"Light":"#6e828e","Dark":"#556a78"},"Placeholder":{"Light":"#95a5ae","Dark":"#3a4e59"},"OnBrand":{"Light":"#ffffff","Dark":"#0a1a22"}},"Brand":{"Primary":{"Light":"#3a7a8a","Dark":"#60b0c0"},"PrimaryHover":{"Light":"#4e98aa","Dark":"#80ccdc"},"Accent":{"Light":"#3a7a8a","Dark":"#60b0c0"},"AccentHover":{"Light":"#4e98aa","Dark":"#80ccdc"}},"Border":{"Default":{"Light":"#8ba3b0","Dark":"#466070"},"Light":{"Light":"#b5c5ce","Dark":"#283d49"},"Strong":{"Light":"#6f828c","Dark":"#384c59"}},"Status":{"Success":{"Light":"#2a7a4a","Dark":"#4ac06a"},"Warning":{"Light":"#cc9930","Dark":"#ffc860"},"Error":{"Light":"#cc5530","Dark":"#ff8060"},"Info":{"Light":"#3a7a8a","Dark":"#60b0c0"}},"Scrollbar":{"Track":{"Light":"#c8d6de","Dark":"#102530"},"Thumb":{"Light":"#7c929f","Dark":"#4d6574"},"Hover":{"Light":"#6e828e","Dark":"#556a78"}},"Selection":{"Background":{"Light":"#aac4cc","Dark":"#254a54"},"Text":{"Light":"#101820","Dark":"#b0d0e0"}},"Focus":{"Outline":{"Light":"#3a7a8a","Dark":"#60b0c0"}},"Shadow":{"Color":{"Light":"rgba(0, 0, 0, 0.12)","Dark":"rgba(0, 0, 0, 0.55)"}},"Syntax":{"Keyword":{"Light":"#cc5530","Dark":"#ff8060"},"String":{"Light":"#2a7a4a","Dark":"#4ac06a"},"Number":{"Light":"#cc9930","Dark":"#ffc860"},"Comment":{"Light":"#6e828e","Dark":"#556a78"},"Operator":{"Light":"#3a7a8a","Dark":"#60b0c0"},"Punctuation":{"Light":"#40525e","Dark":"#7a98a8"},"Function":{"Light":"#3a7a8a","Dark":"#60b0c0"},"Variable":{"Light":"#101820","Dark":"#b0d0e0"},"Type":{"Light":"#cc9930","Dark":"#ffc860"},"Builtin":{"Light":"#cc9930","Dark":"#ffc860"},"Property":{"Light":"#cc5530","Dark":"#ff8060"},"Tag":{"Light":"#cc5530","Dark":"#ff8060"},"AttrName":{"Light":"#cc9930","Dark":"#ffc860"},"AttrValue":{"Light":"#2a7a4a","Dark":"#4ac06a"}}},"Typography":{"Family":{"Sans":"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif","Serif":"Georgia, Cambria, 'Times New Roman', Times, serif","Mono":"'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', 'Liberation Mono', 'Courier New', monospace"},"Size":{"XS":"0.75rem","SM":"0.875rem","MD":"1rem","LG":"1.125rem","XL":"1.375rem","XXL":"1.75rem"},"Weight":{"Regular":"400","Medium":"500","Bold":"700"},"LineHeight":{"Tight":"1.2","Normal":"1.5","Loose":"1.7"}},"Spacing":{"XS":"4px","SM":"8px","MD":"12px","LG":"16px","XL":"24px","XXL":"32px"},"Radius":{"None":"0","SM":"2px","MD":"4px","LG":"8px","XL":"12px","Pill":"999px"},"Layout":{"SidebarWidth":"220px","TopbarHeight":"48px","StatusbarHeight":"28px"}},"Brand":{"Name":"BeOS","Tagline":"Connect, introspect, and expose remote databases"}};},{}],45:[function(require,module,exports){module.exports={"Hash":"databeacon-mac-classic","Name":"DataBeacon \u2014 Mac Classic","Version":"0.0.1","Description":"Mac OS 8/9 Platinum palette \u2014 soft greys with sky blue accents. Light: classic Mac platinum. Dark: charcoal panels with the same blue accent family.","Comprehensive":true,"Modes":{"Strategy":"system","Default":"system"},"Tokens":{"Color":{"Background":{"Primary":{"Light":"#dddddd","Dark":"#202020"},"Secondary":{"Light":"#cccccc","Dark":"#2a2a2a"},"Tertiary":{"Light":"#d4d4d4","Dark":"#252525"},"Panel":{"Light":"#f0f0f0","Dark":"#2e2e2e"},"Input":{"Light":"#ffffff","Dark":"#3a3a3a"},"Hover":{"Light":"#d4d4d4","Dark":"#1e1e1e"},"Selected":{"Light":"#c0cce3","Dark":"#2b3748"}},"Text":{"Primary":{"Light":"#000000","Dark":"#dddddd"},"Secondary":{"Light":"#444444","Dark":"#b0b0b0"},"Muted":{"Light":"#777777","Dark":"#777777"},"Placeholder":{"Light":"#9a9a9a","Dark":"#585858"},"OnBrand":{"Light":"#ffffff","Dark":"#0a0a0a"}},"Brand":{"Primary":{"Light":"#4080ff","Dark":"#60a0ff"},"PrimaryHover":{"Light":"#60a0ff","Dark":"#80b8ff"},"Accent":{"Light":"#4080ff","Dark":"#60a0ff"},"AccentHover":{"Light":"#60a0ff","Dark":"#80b8ff"}},"Border":{"Default":{"Light":"#999999","Dark":"#555555"},"Light":{"Light":"#bbbbbb","Dark":"#3a3a3a"},"Strong":{"Light":"#7a7a7a","Dark":"#444444"}},"Status":{"Success":{"Light":"#339933","Dark":"#60cc60"},"Warning":{"Light":"#cc6600","Dark":"#ff9933"},"Error":{"Light":"#cc0000","Dark":"#ff4060"},"Info":{"Light":"#4080ff","Dark":"#60a0ff"}},"Scrollbar":{"Track":{"Light":"#cccccc","Dark":"#2a2a2a"},"Thumb":{"Light":"#888888","Dark":"#666666"},"Hover":{"Light":"#777777","Dark":"#777777"}},"Selection":{"Background":{"Light":"#aabfe7","Dark":"#344867"},"Text":{"Light":"#000000","Dark":"#dddddd"}},"Focus":{"Outline":{"Light":"#4080ff","Dark":"#60a0ff"}},"Shadow":{"Color":{"Light":"rgba(0, 0, 0, 0.12)","Dark":"rgba(0, 0, 0, 0.55)"}},"Syntax":{"Keyword":{"Light":"#cc0000","Dark":"#ff4060"},"String":{"Light":"#339933","Dark":"#60cc60"},"Number":{"Light":"#cc6600","Dark":"#ff9933"},"Comment":{"Light":"#777777","Dark":"#777777"},"Operator":{"Light":"#4080ff","Dark":"#60a0ff"},"Punctuation":{"Light":"#444444","Dark":"#b0b0b0"},"Function":{"Light":"#4080ff","Dark":"#60a0ff"},"Variable":{"Light":"#000000","Dark":"#dddddd"},"Type":{"Light":"#cc6600","Dark":"#ff9933"},"Builtin":{"Light":"#cc6600","Dark":"#ff9933"},"Property":{"Light":"#cc0000","Dark":"#ff4060"},"Tag":{"Light":"#cc0000","Dark":"#ff4060"},"AttrName":{"Light":"#cc6600","Dark":"#ff9933"},"AttrValue":{"Light":"#339933","Dark":"#60cc60"}}},"Typography":{"Family":{"Sans":"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif","Serif":"Georgia, Cambria, 'Times New Roman', Times, serif","Mono":"'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', 'Liberation Mono', 'Courier New', monospace"},"Size":{"XS":"0.75rem","SM":"0.875rem","MD":"1rem","LG":"1.125rem","XL":"1.375rem","XXL":"1.75rem"},"Weight":{"Regular":"400","Medium":"500","Bold":"700"},"LineHeight":{"Tight":"1.2","Normal":"1.5","Loose":"1.7"}},"Spacing":{"XS":"4px","SM":"8px","MD":"12px","LG":"16px","XL":"24px","XXL":"32px"},"Radius":{"None":"0","SM":"2px","MD":"4px","LG":"8px","XL":"12px","Pill":"999px"},"Layout":{"SidebarWidth":"220px","TopbarHeight":"48px","StatusbarHeight":"28px"}},"Brand":{"Name":"Mac Classic","Tagline":"Connect, introspect, and expose remote databases"}};},{}],46:[function(require,module,exports){module.exports={"Hash":"databeacon-next","Name":"DataBeacon \u2014 NeXT","Version":"0.0.1","Description":"NeXTSTEP palette \u2014 stone backgrounds with rich purple accents. Light: warm stone. Dark: deep aubergine with lavender highlights.","Comprehensive":true,"Modes":{"Strategy":"system","Default":"system"},"Tokens":{"Color":{"Background":{"Primary":{"Light":"#e8e6dd","Dark":"#1a1420"},"Secondary":{"Light":"#d6d3c8","Dark":"#221a2c"},"Tertiary":{"Light":"#dfdcd2","Dark":"#1e1726"},"Panel":{"Light":"#f5f3ed","Dark":"#251c2e"},"Input":{"Light":"#ffffff","Dark":"#2f253a"},"Hover":{"Light":"#dedcd4","Dark":"#18131e"},"Selected":{"Light":"#d1c7d2","Dark":"#352a42"}},"Text":{"Primary":{"Light":"#1e1a26","Dark":"#e8e6dd"},"Secondary":{"Light":"#4c465a","Dark":"#b8b4c6"},"Muted":{"Light":"#7a7488","Dark":"#7a7488"},"Placeholder":{"Light":"#a09ba5","Dark":"#585263"},"OnBrand":{"Light":"#ffffff","Dark":"#1a1420"}},"Brand":{"Primary":{"Light":"#6a3fa0","Dark":"#b090e0"},"PrimaryHover":{"Light":"#8557c0","Dark":"#c8aef0"},"Accent":{"Light":"#6a3fa0","Dark":"#b090e0"},"AccentHover":{"Light":"#8557c0","Dark":"#c8aef0"}},"Border":{"Default":{"Light":"#9a96a6","Dark":"#5e5468"},"Light":{"Light":"#c1bec1","Dark":"#3c3444"},"Strong":{"Light":"#7b7884","Dark":"#4b4353"}},"Status":{"Success":{"Light":"#3a7a3a","Dark":"#7acc7a"},"Warning":{"Light":"#b88a00","Dark":"#ffcf4a"},"Error":{"Light":"#aa2c3a","Dark":"#ff6a80"},"Info":{"Light":"#6a3fa0","Dark":"#b090e0"}},"Scrollbar":{"Track":{"Light":"#d6d3c8","Dark":"#221a2c"},"Thumb":{"Light":"#8a8597","Dark":"#6c6478"},"Hover":{"Light":"#7a7488","Dark":"#7a7488"}},"Selection":{"Background":{"Light":"#bfb0c9","Dark":"#4a3b5d"},"Text":{"Light":"#1e1a26","Dark":"#e8e6dd"}},"Focus":{"Outline":{"Light":"#6a3fa0","Dark":"#b090e0"}},"Shadow":{"Color":{"Light":"rgba(0, 0, 0, 0.12)","Dark":"rgba(0, 0, 0, 0.55)"}},"Syntax":{"Keyword":{"Light":"#aa2c3a","Dark":"#ff6a80"},"String":{"Light":"#3a7a3a","Dark":"#7acc7a"},"Number":{"Light":"#b88a00","Dark":"#ffcf4a"},"Comment":{"Light":"#7a7488","Dark":"#7a7488"},"Operator":{"Light":"#6a3fa0","Dark":"#b090e0"},"Punctuation":{"Light":"#4c465a","Dark":"#b8b4c6"},"Function":{"Light":"#6a3fa0","Dark":"#b090e0"},"Variable":{"Light":"#1e1a26","Dark":"#e8e6dd"},"Type":{"Light":"#b88a00","Dark":"#ffcf4a"},"Builtin":{"Light":"#b88a00","Dark":"#ffcf4a"},"Property":{"Light":"#aa2c3a","Dark":"#ff6a80"},"Tag":{"Light":"#aa2c3a","Dark":"#ff6a80"},"AttrName":{"Light":"#b88a00","Dark":"#ffcf4a"},"AttrValue":{"Light":"#3a7a3a","Dark":"#7acc7a"}}},"Typography":{"Family":{"Sans":"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif","Serif":"Georgia, Cambria, 'Times New Roman', Times, serif","Mono":"'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', 'Liberation Mono', 'Courier New', monospace"},"Size":{"XS":"0.75rem","SM":"0.875rem","MD":"1rem","LG":"1.125rem","XL":"1.375rem","XXL":"1.75rem"},"Weight":{"Regular":"400","Medium":"500","Bold":"700"},"LineHeight":{"Tight":"1.2","Normal":"1.5","Loose":"1.7"}},"Spacing":{"XS":"4px","SM":"8px","MD":"12px","LG":"16px","XL":"24px","XXL":"32px"},"Radius":{"None":"0","SM":"2px","MD":"4px","LG":"8px","XL":"12px","Pill":"999px"},"Layout":{"SidebarWidth":"220px","TopbarHeight":"48px","StatusbarHeight":"28px"}},"Brand":{"Name":"NeXT","Tagline":"Connect, introspect, and expose remote databases"}};},{}],47:[function(require,module,exports){module.exports={"Hash":"databeacon-nineteen-97","Name":"DataBeacon \u2014 1997 (Win95/98)","Version":"0.0.1","Description":"Windows 95/98 retro palette \u2014 beige + navy + maroon. Light: classic Win95 desktop. Dark: indigo-grey background with sky/coral accents.","Comprehensive":true,"Modes":{"Strategy":"system","Default":"system"},"Tokens":{"Color":{"Background":{"Primary":{"Light":"#ece9d8","Dark":"#1e1e2e"},"Secondary":{"Light":"#d8d3b8","Dark":"#26263a"},"Tertiary":{"Light":"#e2dec8","Dark":"#222234"},"Panel":{"Light":"#fffbf0","Dark":"#2a2a3a"},"Input":{"Light":"#ffffff","Dark":"#343450"},"Hover":{"Light":"#e2dfcf","Dark":"#1c1c2c"},"Selected":{"Light":"#c1bfc8","Dark":"#2f3553"}},"Text":{"Primary":{"Light":"#1a1a1a","Dark":"#ece9d8"},"Secondary":{"Light":"#4a4a4a","Dark":"#b8b6a8"},"Muted":{"Light":"#7a7a7a","Dark":"#7e7c70"},"Placeholder":{"Light":"#a1a09a","Dark":"#5c5b58"},"OnBrand":{"Light":"#ffffff","Dark":"#1a1a1a"}},"Brand":{"Primary":{"Light":"#000080","Dark":"#80a0ff"},"PrimaryHover":{"Light":"#0000cc","Dark":"#a0b8ff"},"Accent":{"Light":"#000080","Dark":"#80a0ff"},"AccentHover":{"Light":"#0000cc","Dark":"#a0b8ff"}},"Border":{"Default":{"Light":"#808080","Dark":"#4e4e68"},"Light":{"Light":"#b6b4ac","Dark":"#36364b"},"Strong":{"Light":"#666666","Dark":"#3e3e53"}},"Status":{"Success":{"Light":"#008000","Dark":"#80ff80"},"Warning":{"Light":"#808000","Dark":"#ffcc00"},"Error":{"Light":"#800000","Dark":"#ff8080"},"Info":{"Light":"#000080","Dark":"#80c0ff"}},"Scrollbar":{"Track":{"Light":"#d8d3b8","Dark":"#26263a"},"Thumb":{"Light":"#7d7d7d","Dark":"#66656c"},"Hover":{"Light":"#7a7a7a","Dark":"#7e7c70"}},"Selection":{"Background":{"Light":"#a09ebb","Dark":"#3d4770"},"Text":{"Light":"#1a1a1a","Dark":"#ece9d8"}},"Focus":{"Outline":{"Light":"#000080","Dark":"#80a0ff"}},"Shadow":{"Color":{"Light":"rgba(0, 0, 0, 0.12)","Dark":"rgba(0, 0, 0, 0.55)"}},"Syntax":{"Keyword":{"Light":"#800000","Dark":"#ff8080"},"String":{"Light":"#008000","Dark":"#80ff80"},"Number":{"Light":"#808000","Dark":"#ffcc00"},"Comment":{"Light":"#7a7a7a","Dark":"#7e7c70"},"Operator":{"Light":"#000080","Dark":"#80a0ff"},"Punctuation":{"Light":"#4a4a4a","Dark":"#b8b6a8"},"Function":{"Light":"#000080","Dark":"#80c0ff"},"Variable":{"Light":"#1a1a1a","Dark":"#ece9d8"},"Type":{"Light":"#808000","Dark":"#ffcc00"},"Builtin":{"Light":"#808000","Dark":"#ffcc00"},"Property":{"Light":"#800000","Dark":"#ff8080"},"Tag":{"Light":"#800000","Dark":"#ff8080"},"AttrName":{"Light":"#808000","Dark":"#ffcc00"},"AttrValue":{"Light":"#008000","Dark":"#80ff80"}}},"Typography":{"Family":{"Sans":"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif","Serif":"Georgia, Cambria, 'Times New Roman', Times, serif","Mono":"'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', 'Liberation Mono', 'Courier New', monospace"},"Size":{"XS":"0.75rem","SM":"0.875rem","MD":"1rem","LG":"1.125rem","XL":"1.375rem","XXL":"1.75rem"},"Weight":{"Regular":"400","Medium":"500","Bold":"700"},"LineHeight":{"Tight":"1.2","Normal":"1.5","Loose":"1.7"}},"Spacing":{"XS":"4px","SM":"8px","MD":"12px","LG":"16px","XL":"24px","XXL":"32px"},"Radius":{"None":"0","SM":"2px","MD":"4px","LG":"8px","XL":"12px","Pill":"999px"},"Layout":{"SidebarWidth":"220px","TopbarHeight":"48px","StatusbarHeight":"28px"}},"Brand":{"Name":"1997 (Win95/98)","Tagline":"Connect, introspect, and expose remote databases"}};},{}],48:[function(require,module,exports){module.exports={"Hash":"databeacon-sgi","Name":"DataBeacon \u2014 SGI","Version":"0.0.1","Description":"SGI Indy / IRIX palette \u2014 magenta with cyan highlights. Light: signature SGI grey. Dark: deep workstation black with the same hot magenta.","Comprehensive":true,"Modes":{"Strategy":"system","Default":"system"},"Tokens":{"Color":{"Background":{"Primary":{"Light":"#c8c8c8","Dark":"#1a1a1a"},"Secondary":{"Light":"#b8b8b8","Dark":"#232323"},"Tertiary":{"Light":"#c0c0c0","Dark":"#1e1e1e"},"Panel":{"Light":"#dcdcdc","Dark":"#252525"},"Input":{"Light":"#ffffff","Dark":"#2e2e2e"},"Hover":{"Light":"#c0c0c0","Dark":"#181818"},"Selected":{"Light":"#c8a9bb","Dark":"#432635"}},"Text":{"Primary":{"Light":"#202020","Dark":"#e0e0e0"},"Secondary":{"Light":"#4a4a4a","Dark":"#a8a8a8"},"Muted":{"Light":"#6e6e6e","Dark":"#707070"},"Placeholder":{"Light":"#8d8d8d","Dark":"#515151"},"OnBrand":{"Light":"#ffffff","Dark":"#0a0a0a"}},"Brand":{"Primary":{"Light":"#c82080","Dark":"#ff60b0"},"PrimaryHover":{"Light":"#e040a0","Dark":"#ff80c8"},"Accent":{"Light":"#c82080","Dark":"#ff60b0"},"AccentHover":{"Light":"#e040a0","Dark":"#ff80c8"}},"Border":{"Default":{"Light":"#808080","Dark":"#505050"},"Light":{"Light":"#a4a4a4","Dark":"#353535"},"Strong":{"Light":"#666666","Dark":"#404040"}},"Status":{"Success":{"Light":"#208040","Dark":"#50d080"},"Warning":{"Light":"#e8a818","Dark":"#ffd050"},"Error":{"Light":"#e83018","Dark":"#ff6060"},"Info":{"Light":"#3080c0","Dark":"#60c0ff"}},"Scrollbar":{"Track":{"Light":"#b8b8b8","Dark":"#232323"},"Thumb":{"Light":"#777777","Dark":"#606060"},"Hover":{"Light":"#6e6e6e","Dark":"#707070"}},"Selection":{"Background":{"Light":"#c892b0","Dark":"#63304a"},"Text":{"Light":"#202020","Dark":"#e0e0e0"}},"Focus":{"Outline":{"Light":"#c82080","Dark":"#ff60b0"}},"Shadow":{"Color":{"Light":"rgba(0, 0, 0, 0.12)","Dark":"rgba(0, 0, 0, 0.55)"}},"Syntax":{"Keyword":{"Light":"#e83018","Dark":"#ff6060"},"String":{"Light":"#208040","Dark":"#50d080"},"Number":{"Light":"#e8a818","Dark":"#ffd050"},"Comment":{"Light":"#6e6e6e","Dark":"#707070"},"Operator":{"Light":"#c82080","Dark":"#ff60b0"},"Punctuation":{"Light":"#4a4a4a","Dark":"#a8a8a8"},"Function":{"Light":"#3080c0","Dark":"#60c0ff"},"Variable":{"Light":"#202020","Dark":"#e0e0e0"},"Type":{"Light":"#e8a818","Dark":"#ffd050"},"Builtin":{"Light":"#e8a818","Dark":"#ffd050"},"Property":{"Light":"#e83018","Dark":"#ff6060"},"Tag":{"Light":"#e83018","Dark":"#ff6060"},"AttrName":{"Light":"#e8a818","Dark":"#ffd050"},"AttrValue":{"Light":"#208040","Dark":"#50d080"}}},"Typography":{"Family":{"Sans":"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif","Serif":"Georgia, Cambria, 'Times New Roman', Times, serif","Mono":"'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', 'Liberation Mono', 'Courier New', monospace"},"Size":{"XS":"0.75rem","SM":"0.875rem","MD":"1rem","LG":"1.125rem","XL":"1.375rem","XXL":"1.75rem"},"Weight":{"Regular":"400","Medium":"500","Bold":"700"},"LineHeight":{"Tight":"1.2","Normal":"1.5","Loose":"1.7"}},"Spacing":{"XS":"4px","SM":"8px","MD":"12px","LG":"16px","XL":"24px","XXL":"32px"},"Radius":{"None":"0","SM":"2px","MD":"4px","LG":"8px","XL":"12px","Pill":"999px"},"Layout":{"SidebarWidth":"220px","TopbarHeight":"48px","StatusbarHeight":"28px"}},"Brand":{"Name":"SGI","Tagline":"Connect, introspect, and expose remote databases"}};},{}],49:[function(require,module,exports){module.exports={"Hash":"daylight","Name":"Daylight","Category":"Grey","Version":"0.0.1","Description":"Bright white, dark text Ported from RetoldRemote-ThemeDefinitions.js to the pict-provider-theme manifest format.","Comprehensive":true,"Modes":{"Strategy":"single","Default":"light"},"Tokens":{"Color":{"Background":{"Primary":"#FFFFFF","Secondary":"#F0F0F0","Tertiary":"#E8E8E8","Panel":"#F5F5F5","Viewer":"#FAFAFA","Hover":"#E0E0E0","Selected":"#C8C8C8","Thumb":"#F0F0F0"},"Text":{"Primary":"#1A1A1A","Secondary":"#333333","Muted":"#666666","Dim":"#888888","Placeholder":"#AAAAAA"},"Brand":{"Accent":"#444444","AccentHover":"#222222"},"Border":{"Default":"#D0D0D0","Light":"#E0E0E0"},"Status":{"Danger":"#CC0000","DangerMuted":"#884444"},"Scrollbar":{"Track":"#C0C0C0","Hover":"#A0A0A0"},"Selection":{"Background":"rgba(68, 68, 68, 0.2)"},"Focus":{"Outline":"#444444"},"Syntax":{"Keyword":"#7038A0","String":"#2E7A3A","Number":"#A86B00","Comment":"#888888","Operator":"#1F6FB5","Punctuation":"#444444","Function":"#3357C7","Variable":"#222222","Type":"#A86B00","Builtin":"#A86B00","Property":"#B62828","Tag":"#B62828","AttrName":"#A86B00","AttrValue":"#2E7A3A"}},"Typography":{"Family":{"Sans":"'Segoe UI', system-ui, -apple-system, sans-serif","Mono":"'SF Mono', 'Fira Code', 'Consolas', monospace"}}},"Aliases":{"--retold-bg-primary":"Color.Background.Primary","--retold-bg-secondary":"Color.Background.Secondary","--retold-bg-tertiary":"Color.Background.Tertiary","--retold-bg-panel":"Color.Background.Panel","--retold-bg-viewer":"Color.Background.Viewer","--retold-bg-hover":"Color.Background.Hover","--retold-bg-selected":"Color.Background.Selected","--retold-bg-thumb":"Color.Background.Thumb","--retold-text-primary":"Color.Text.Primary","--retold-text-secondary":"Color.Text.Secondary","--retold-text-muted":"Color.Text.Muted","--retold-text-dim":"Color.Text.Dim","--retold-text-placeholder":"Color.Text.Placeholder","--retold-accent":"Color.Brand.Accent","--retold-accent-hover":"Color.Brand.AccentHover","--retold-border":"Color.Border.Default","--retold-border-light":"Color.Border.Light","--retold-danger":"Color.Status.Danger","--retold-danger-muted":"Color.Status.DangerMuted","--retold-scrollbar":"Color.Scrollbar.Track","--retold-scrollbar-hover":"Color.Scrollbar.Hover","--retold-selection-bg":"Color.Selection.Background","--retold-focus-outline":"Color.Focus.Outline","--retold-font-family":"Typography.Family.Sans","--retold-font-mono":"Typography.Family.Mono"},"IconColors":{"Primary":"#333333","Accent":"#444444","Muted":"#888888","Light":"#E8E8E8","WarmBeige":"#F0F0F0","TealTint":"#E0E0E0","Lavender":"#EBEBEB","AmberTint":"#F0EDE8","PdfFill":"#F0E0E0","PdfText":"#CC0000"},"CSS":[],"SVG":{},"Image":{},"CompiledAt":"2026-05-03T18:12:53.407Z","CompilerVersion":1};},{}],50:[function(require,module,exports){module.exports={"Hash":"early-2000s","Name":"Early 2000s Web","Category":"Fun","Version":"0.0.1","Description":"Teal and silver, Web 2.0 Ported from RetoldRemote-ThemeDefinitions.js to the pict-provider-theme manifest format.","Comprehensive":true,"Modes":{"Strategy":"single","Default":"light"},"Tokens":{"Color":{"Background":{"Primary":"#E8F4F8","Secondary":"#D0E8EE","Tertiary":"#C0DDE6","Panel":"#D8EEF2","Viewer":"#F0F8FA","Hover":"#B0D4E0","Selected":"#88C4D8","Thumb":"#D0E8EE"},"Text":{"Primary":"#1A3A4A","Secondary":"#2A4A5A","Muted":"#5A7A8A","Dim":"#7A9AAA","Placeholder":"#9ABACA"},"Brand":{"Accent":"#0099CC","AccentHover":"#00AADD"},"Border":{"Default":"#A0C8D8","Light":"#B8D8E4"},"Status":{"Danger":"#CC3300","DangerMuted":"#994422"},"Scrollbar":{"Track":"#A0C8D8","Hover":"#88B8CC"},"Selection":{"Background":"rgba(0, 153, 204, 0.2)"},"Focus":{"Outline":"#0099CC"},"Syntax":{"Keyword":"#1A4080","String":"#2E7A3A","Number":"#A86B00","Comment":"#888888","Operator":"#1F6FB5","Punctuation":"#333333","Function":"#3357C7","Variable":"#222222","Type":"#A86B00","Builtin":"#A86B00","Property":"#B62828","Tag":"#B62828","AttrName":"#A86B00","AttrValue":"#2E7A3A"}},"Typography":{"Family":{"Sans":"Verdana, Geneva, Tahoma, sans-serif","Mono":"'Lucida Console', Monaco, monospace"}}},"Aliases":{"--retold-bg-primary":"Color.Background.Primary","--retold-bg-secondary":"Color.Background.Secondary","--retold-bg-tertiary":"Color.Background.Tertiary","--retold-bg-panel":"Color.Background.Panel","--retold-bg-viewer":"Color.Background.Viewer","--retold-bg-hover":"Color.Background.Hover","--retold-bg-selected":"Color.Background.Selected","--retold-bg-thumb":"Color.Background.Thumb","--retold-text-primary":"Color.Text.Primary","--retold-text-secondary":"Color.Text.Secondary","--retold-text-muted":"Color.Text.Muted","--retold-text-dim":"Color.Text.Dim","--retold-text-placeholder":"Color.Text.Placeholder","--retold-accent":"Color.Brand.Accent","--retold-accent-hover":"Color.Brand.AccentHover","--retold-border":"Color.Border.Default","--retold-border-light":"Color.Border.Light","--retold-danger":"Color.Status.Danger","--retold-danger-muted":"Color.Status.DangerMuted","--retold-scrollbar":"Color.Scrollbar.Track","--retold-scrollbar-hover":"Color.Scrollbar.Hover","--retold-selection-bg":"Color.Selection.Background","--retold-focus-outline":"Color.Focus.Outline","--retold-font-family":"Typography.Family.Sans","--retold-font-mono":"Typography.Family.Mono"},"IconColors":{"Primary":"#2A4A5A","Accent":"#0099CC","Muted":"#7A9AAA","Light":"#C0DDE6","WarmBeige":"#D0E8EE","TealTint":"#B0D8E4","Lavender":"#C8DCE6","AmberTint":"#D8E0D0","PdfFill":"#E0C8C0","PdfText":"#CC3300"},"CSS":[],"SVG":{},"Image":{},"CompiledAt":"2026-05-03T18:12:53.407Z","CompilerVersion":1};},{}],51:[function(require,module,exports){module.exports={"Hash":"evening","Name":"Evening","Category":"Grey","Version":"0.0.1","Description":"Medium grey, transitional Ported from RetoldRemote-ThemeDefinitions.js to the pict-provider-theme manifest format.","Comprehensive":true,"Modes":{"Strategy":"single","Default":"dark"},"Tokens":{"Color":{"Background":{"Primary":"#484848","Secondary":"#3C3C3C","Tertiary":"#424242","Panel":"#454545","Viewer":"#363636","Hover":"#525252","Selected":"#606060","Thumb":"#3C3C3C"},"Text":{"Primary":"#E0E0E0","Secondary":"#D0D0D0","Muted":"#A0A0A0","Dim":"#888888","Placeholder":"#707070"},"Brand":{"Accent":"#C0C0C0","AccentHover":"#E0E0E0"},"Border":{"Default":"#585858","Light":"#606060"},"Status":{"Danger":"#FF6666","DangerMuted":"#AA6666"},"Scrollbar":{"Track":"#585858","Hover":"#686868"},"Selection":{"Background":"rgba(192, 192, 192, 0.25)"},"Focus":{"Outline":"#C0C0C0"},"Syntax":{"Keyword":"#B894FF","String":"#A8D8B0","Number":"#FFB880","Comment":"#8A8A8A","Operator":"#7EC0FF","Punctuation":"#BBBBBB","Function":"#FFCC80","Variable":"#DDDDDD","Type":"#FFB880","Builtin":"#FFB880","Property":"#FF9494","Tag":"#FF9494","AttrName":"#FFB880","AttrValue":"#A8D8B0"}},"Typography":{"Family":{"Sans":"system-ui, -apple-system, sans-serif","Mono":"'SF Mono', 'Fira Code', 'Consolas', monospace"}}},"Aliases":{"--retold-bg-primary":"Color.Background.Primary","--retold-bg-secondary":"Color.Background.Secondary","--retold-bg-tertiary":"Color.Background.Tertiary","--retold-bg-panel":"Color.Background.Panel","--retold-bg-viewer":"Color.Background.Viewer","--retold-bg-hover":"Color.Background.Hover","--retold-bg-selected":"Color.Background.Selected","--retold-bg-thumb":"Color.Background.Thumb","--retold-text-primary":"Color.Text.Primary","--retold-text-secondary":"Color.Text.Secondary","--retold-text-muted":"Color.Text.Muted","--retold-text-dim":"Color.Text.Dim","--retold-text-placeholder":"Color.Text.Placeholder","--retold-accent":"Color.Brand.Accent","--retold-accent-hover":"Color.Brand.AccentHover","--retold-border":"Color.Border.Default","--retold-border-light":"Color.Border.Light","--retold-danger":"Color.Status.Danger","--retold-danger-muted":"Color.Status.DangerMuted","--retold-scrollbar":"Color.Scrollbar.Track","--retold-scrollbar-hover":"Color.Scrollbar.Hover","--retold-selection-bg":"Color.Selection.Background","--retold-focus-outline":"Color.Focus.Outline","--retold-font-family":"Typography.Family.Sans","--retold-font-mono":"Typography.Family.Mono"},"IconColors":{"Primary":"#D0D0D0","Accent":"#C0C0C0","Muted":"#888888","Light":"#424242","WarmBeige":"#484848","TealTint":"#3E3E3E","Lavender":"#444444","AmberTint":"#4A4640","PdfFill":"#4A3C3C","PdfText":"#FF6666"},"CSS":[],"SVG":{},"Image":{},"CompiledAt":"2026-05-03T18:12:53.407Z","CompilerVersion":1};},{}],52:[function(require,module,exports){module.exports={"Hash":"flow-blueprint","Name":"Flow Blueprint","Version":"0.0.1","Description":"Technical-drawing aesthetic — white-on-navy with yellow selection. Single-mode (always dark blueprint).","Comprehensive":true,"Modes":{"Strategy":"single","Default":"dark"},"Tokens":{"Color":{"Background":{"Primary":"#1a3a6a","Secondary":"#142e54","Tertiary":"rgba(255,255,255,0.1)","Panel":"#1a3a6a","Hover":"rgba(255,255,255,0.06)","Selected":"rgba(255,221,68,0.18)"},"Text":{"Primary":"#ffffff","Secondary":"rgba(255,255,255,0.7)","Muted":"rgba(255,255,255,0.5)","OnBrand":"#0d2244"},"Brand":{"Primary":"#ffdd44","PrimaryHover":"#ffe978","Accent":"#88ffbb"},"Border":{"Default":"rgba(255,255,255,0.6)","Light":"rgba(255,255,255,0.15)","Strong":"#ffffff"},"Status":{"Success":"#88ffbb","Warning":"#ffdd44","Error":"#ff8888","Info":"#88bbff"},"Scrollbar":{"Track":"rgba(255,255,255,0.05)","Thumb":"rgba(255,255,255,0.3)","Hover":"rgba(255,255,255,0.5)"},"Focus":{"Outline":"#ffdd44"},"Shadow":{"Color":"rgba(0, 0, 0, 0.4)"}}},"Brand":{"Name":"Flow Blueprint","Tagline":"Technical drawing on navy"}};},{}],53:[function(require,module,exports){module.exports={"Hash":"flow-modern","Name":"Flow Modern","Version":"0.0.1","Description":"The default modern look for pict-section-flow — clean, theme-neutral. Paired light/dark.","Comprehensive":true,"Modes":{"Strategy":"system","Default":"light"},"Tokens":{"Color":{"Background":{"Primary":{"Light":"#ffffff","Dark":"#1a1a1a"},"Secondary":{"Light":"#f5f5f5","Dark":"#242424"},"Tertiary":{"Light":"#ecf0f1","Dark":"#2e2e2e"},"Panel":{"Light":"#ffffff","Dark":"#222222"},"Hover":{"Light":"#eef3f7","Dark":"#2a2a2a"},"Selected":{"Light":"#dde7f3","Dark":"#2a3550"}},"Text":{"Primary":{"Light":"#2c3e50","Dark":"#ededed"},"Secondary":{"Light":"#7f8c8d","Dark":"#bdbdbd"},"Muted":{"Light":"#95a5a6","Dark":"#888888"},"OnBrand":{"Light":"#ffffff","Dark":"#1a1a1a"}},"Brand":{"Primary":{"Light":"#2255aa","Dark":"#5b8aff"},"PrimaryHover":{"Light":"#1a4488","Dark":"#7ba4ff"},"Accent":{"Light":"#1abc9c","Dark":"#4fd1b5"}},"Border":{"Default":{"Light":"#bdc3c7","Dark":"#3a3a3a"},"Light":{"Light":"#ecf0f1","Dark":"#2c2c2c"},"Strong":{"Light":"#95a5a6","Dark":"#5a5a5a"}},"Status":{"Success":{"Light":"#27ae60","Dark":"#5fc377"},"Warning":{"Light":"#f39c12","Dark":"#f0b84a"},"Error":{"Light":"#e74c3c","Dark":"#ff7373"},"Info":{"Light":"#3498db","Dark":"#5fb4ff"}},"Scrollbar":{"Track":{"Light":"#ecf0f1","Dark":"#1f1f1f"},"Thumb":{"Light":"#bdc3c7","Dark":"#3f3f3f"},"Hover":{"Light":"#95a5a6","Dark":"#5a5a5a"}},"Focus":{"Outline":{"Light":"#2255aa","Dark":"#5b8aff"}},"Shadow":{"Color":{"Light":"rgba(0, 0, 0, 0.12)","Dark":"rgba(0, 0, 0, 0.55)"}}}},"Brand":{"Name":"Flow Modern","Tagline":"Clean modern flow editor look"}};},{}],54:[function(require,module,exports){module.exports={"Hash":"flow-mono","Name":"Flow Mono","Version":"0.0.1","Description":"High-contrast monochrome flow editor look. Paired light/dark — pure black on white or white on black.","Comprehensive":true,"Modes":{"Strategy":"system","Default":"light"},"Tokens":{"Color":{"Background":{"Primary":{"Light":"#ffffff","Dark":"#000000"},"Secondary":{"Light":"#f0f0f0","Dark":"#1a1a1a"},"Tertiary":{"Light":"#e0e0e0","Dark":"#262626"},"Panel":{"Light":"#ffffff","Dark":"#000000"},"Hover":{"Light":"#eeeeee","Dark":"#1f1f1f"},"Selected":{"Light":"#dddddd","Dark":"#333333"}},"Text":{"Primary":{"Light":"#000000","Dark":"#ffffff"},"Secondary":{"Light":"#444444","Dark":"#cccccc"},"Muted":{"Light":"#888888","Dark":"#888888"},"OnBrand":{"Light":"#ffffff","Dark":"#000000"}},"Brand":{"Primary":{"Light":"#444444","Dark":"#bbbbbb"},"PrimaryHover":{"Light":"#222222","Dark":"#dddddd"},"Accent":{"Light":"#666666","Dark":"#999999"}},"Border":{"Default":{"Light":"#000000","Dark":"#ffffff"},"Light":{"Light":"#cccccc","Dark":"#333333"},"Strong":{"Light":"#000000","Dark":"#ffffff"}},"Status":{"Success":{"Light":"#000000","Dark":"#ffffff"},"Warning":{"Light":"#000000","Dark":"#ffffff"},"Error":{"Light":"#000000","Dark":"#ffffff"},"Info":{"Light":"#000000","Dark":"#ffffff"}},"Scrollbar":{"Track":{"Light":"#f0f0f0","Dark":"#1a1a1a"},"Thumb":{"Light":"#888888","Dark":"#888888"},"Hover":{"Light":"#444444","Dark":"#cccccc"}},"Focus":{"Outline":{"Light":"#000000","Dark":"#ffffff"}},"Shadow":{"Color":{"Light":"rgba(0, 0, 0, 0.25)","Dark":"rgba(255, 255, 255, 0.25)"}}}},"Brand":{"Name":"Flow Mono","Tagline":"Monochrome ink-on-paper"}};},{}],55:[function(require,module,exports){module.exports={"Hash":"flow-retro-80s","Name":"Flow Retro 80s","Version":"0.0.1","Description":"Neon-on-purple synthwave aesthetic for the flow editor. Single-mode (always dark) — '80s arcade glow.","Comprehensive":true,"Modes":{"Strategy":"single","Default":"dark"},"Tokens":{"Color":{"Background":{"Primary":"#0a0015","Secondary":"#1a0a2e","Tertiary":"#2a0a4e","Panel":"#1a0a2e","Hover":"#2a0a4e","Selected":"#3a1466"},"Text":{"Primary":"#00ffff","Secondary":"#ff66ff","Muted":"#9966cc","OnBrand":"#0a0015"},"Brand":{"Primary":"#ff00ff","PrimaryHover":"#ff66ff","Accent":"#00ffff"},"Border":{"Default":"#ff00ff","Light":"#2a0a4e","Strong":"#ff00ff"},"Status":{"Success":"#00ff66","Warning":"#ffdd44","Error":"#ff4477","Info":"#00ffff"},"Scrollbar":{"Track":"#1a0a2e","Thumb":"#ff00ff","Hover":"#ff66ff"},"Focus":{"Outline":"#00ffff"},"Shadow":{"Color":"rgba(255, 0, 255, 0.4)"}}},"Brand":{"Name":"Flow Retro 80s","Tagline":"Neon synthwave glow"}};},{}],56:[function(require,module,exports){module.exports={"Hash":"flow-retro-90s","Name":"Flow Retro 90s","Version":"0.0.1","Description":"Windows-95 aesthetic — gray panels, navy title bars, teal desktop. Single-mode (always its specific palette).","Comprehensive":true,"Modes":{"Strategy":"single","Default":"light"},"Tokens":{"Color":{"Background":{"Primary":"#008080","Secondary":"#c0c0c0","Tertiary":"#d0d0d0","Panel":"#c0c0c0","Hover":"#d0d0d0","Selected":"#a8c8e0"},"Text":{"Primary":"#000000","Secondary":"#404040","Muted":"#606060","OnBrand":"#ffffff"},"Brand":{"Primary":"#000080","PrimaryHover":"#0000a0","Accent":"#008000"},"Border":{"Default":"#808080","Light":"#a0a0a0","Strong":"#404040"},"Status":{"Success":"#008000","Warning":"#808000","Error":"#800000","Info":"#000080"},"Scrollbar":{"Track":"#c0c0c0","Thumb":"#808080","Hover":"#404040"},"Focus":{"Outline":"#008080"},"Shadow":{"Color":"#404040"}}},"Brand":{"Name":"Flow Retro 90s","Tagline":"Workstation chrome from the 90s"}};},{}],57:[function(require,module,exports){module.exports={"Hash":"flow-sketch","Name":"Flow Sketch","Version":"0.0.1","Description":"Warm-paper sketch aesthetic for the flow editor. Single-mode (always light) — sketches live on paper.","Comprehensive":true,"Modes":{"Strategy":"single","Default":"light"},"Tokens":{"Color":{"Background":{"Primary":"#fffef5","Secondary":"#faf8ed","Tertiary":"#f0ece0","Panel":"#fffef5","Hover":"#f4f0e2","Selected":"#e8dfc8"},"Text":{"Primary":"#333333","Secondary":"#555555","Muted":"#888888","OnBrand":"#ffffff"},"Brand":{"Primary":"#2255aa","PrimaryHover":"#1a4488","Accent":"#c47b5a"},"Border":{"Default":"#444444","Light":"#ccccaa","Strong":"#222222"},"Status":{"Success":"#55aa77","Warning":"#d4a040","Error":"#c44836","Info":"#5577bb"},"Scrollbar":{"Track":"#f0ece0","Thumb":"#c5c0a8","Hover":"#9e9a82"},"Focus":{"Outline":"#2255aa"},"Shadow":{"Color":"rgba(0, 0, 0, 0.08)"}}},"Brand":{"Name":"Flow Sketch","Tagline":"Hand-drawn paper aesthetic"}};},{}],58:[function(require,module,exports){module.exports={"Hash":"flow-whiteboard","Name":"Flow Whiteboard","Version":"0.0.1","Description":"Minimal whiteboard aesthetic — transparent fills with colored brackets per node type. Single-mode (light).","Comprehensive":true,"Modes":{"Strategy":"single","Default":"light"},"Tokens":{"Color":{"Background":{"Primary":"#ffffff","Secondary":"#fafafa","Tertiary":"#f5f5f5","Panel":"#ffffff","Hover":"#f0f0f0","Selected":"#e0eaff"},"Text":{"Primary":"#333333","Secondary":"#555555","Muted":"#999999","OnBrand":"#ffffff"},"Brand":{"Primary":"#2255aa","PrimaryHover":"#1a4488","Accent":"#1abc9c"},"Border":{"Default":"#888888","Light":"#cccccc","Strong":"#555555"},"Status":{"Success":"#27ae60","Warning":"#f39c12","Error":"#e74c3c","Info":"#3498db"},"Scrollbar":{"Track":"#f5f5f5","Thumb":"#cccccc","Hover":"#888888"},"Focus":{"Outline":"#2255aa"},"Shadow":{"Color":"rgba(0, 0, 0, 0.06)"}}},"Brand":{"Name":"Flow Whiteboard","Tagline":"Minimal whiteboard sketching"}};},{}],59:[function(require,module,exports){module.exports={"Hash":"forest","Name":"Forest","Category":"Fun","Version":"0.0.1","Description":"Deep greens and earth browns Ported from RetoldRemote-ThemeDefinitions.js to the pict-provider-theme manifest format.","Comprehensive":true,"Modes":{"Strategy":"single","Default":"dark"},"Tokens":{"Color":{"Background":{"Primary":"#1A2018","Secondary":"#141A12","Tertiary":"#1E2620","Panel":"#1C221A","Viewer":"#101410","Hover":"#283828","Selected":"#344834","Thumb":"#141A12"},"Text":{"Primary":"#D0DCC8","Secondary":"#B0C4A8","Muted":"#809878","Dim":"#607858","Placeholder":"#486040"},"Brand":{"Accent":"#6AAF5C","AccentHover":"#88CC78"},"Border":{"Default":"#2A3A28","Light":"#3A4A38"},"Status":{"Danger":"#CC4422","DangerMuted":"#884422"},"Scrollbar":{"Track":"#2A3A28","Hover":"#3A4A38"},"Selection":{"Background":"rgba(106, 175, 92, 0.25)"},"Focus":{"Outline":"#6AAF5C"},"Syntax":{"Keyword":"#D4E157","String":"#A5D6A7","Number":"#FFB74D","Comment":"#5D6F58","Operator":"#80CBC4","Punctuation":"#A8C8A0","Function":"#FFCC80","Variable":"#C8E6C9","Type":"#FFB74D","Builtin":"#FFB74D","Property":"#FF8A65","Tag":"#FF8A65","AttrName":"#FFB74D","AttrValue":"#A5D6A7"}},"Typography":{"Family":{"Sans":"'Palatino Linotype', 'Book Antiqua', Palatino, serif","Mono":"'Courier New', monospace"}}},"Aliases":{"--retold-bg-primary":"Color.Background.Primary","--retold-bg-secondary":"Color.Background.Secondary","--retold-bg-tertiary":"Color.Background.Tertiary","--retold-bg-panel":"Color.Background.Panel","--retold-bg-viewer":"Color.Background.Viewer","--retold-bg-hover":"Color.Background.Hover","--retold-bg-selected":"Color.Background.Selected","--retold-bg-thumb":"Color.Background.Thumb","--retold-text-primary":"Color.Text.Primary","--retold-text-secondary":"Color.Text.Secondary","--retold-text-muted":"Color.Text.Muted","--retold-text-dim":"Color.Text.Dim","--retold-text-placeholder":"Color.Text.Placeholder","--retold-accent":"Color.Brand.Accent","--retold-accent-hover":"Color.Brand.AccentHover","--retold-border":"Color.Border.Default","--retold-border-light":"Color.Border.Light","--retold-danger":"Color.Status.Danger","--retold-danger-muted":"Color.Status.DangerMuted","--retold-scrollbar":"Color.Scrollbar.Track","--retold-scrollbar-hover":"Color.Scrollbar.Hover","--retold-selection-bg":"Color.Selection.Background","--retold-focus-outline":"Color.Focus.Outline","--retold-font-family":"Typography.Family.Sans","--retold-font-mono":"Typography.Family.Mono"},"IconColors":{"Primary":"#B0C4A8","Accent":"#6AAF5C","Muted":"#607858","Light":"#1E2620","WarmBeige":"#22281E","TealTint":"#1A221A","Lavender":"#1E2420","AmberTint":"#262218","PdfFill":"#261A18","PdfText":"#CC4422"},"CSS":[],"SVG":{},"Image":{},"CompiledAt":"2026-05-03T18:12:53.407Z","CompilerVersion":1};},{}],60:[function(require,module,exports){module.exports={"Hash":"hotdog","Name":"Hotdog","Category":"Fun","Version":"0.0.1","Description":"Red and mustard yellow, garish Ported from RetoldRemote-ThemeDefinitions.js to the pict-provider-theme manifest format.","Comprehensive":true,"Modes":{"Strategy":"single","Default":"dark"},"Tokens":{"Color":{"Background":{"Primary":"#8B0000","Secondary":"#6B0000","Tertiary":"#7B0000","Panel":"#750000","Viewer":"#550000","Hover":"#AA1111","Selected":"#BB3300","Thumb":"#6B0000"},"Text":{"Primary":"#FFD700","Secondary":"#FFC000","Muted":"#CC9900","Dim":"#AA7700","Placeholder":"#886600"},"Brand":{"Accent":"#FFD700","AccentHover":"#FFEE44"},"Border":{"Default":"#AA2222","Light":"#BB3333"},"Status":{"Danger":"#FFFF00","DangerMuted":"#CCCC00"},"Scrollbar":{"Track":"#AA2222","Hover":"#CC3333"},"Selection":{"Background":"rgba(255, 215, 0, 0.3)"},"Focus":{"Outline":"#FFD700"},"Syntax":{"Keyword":"#FFD800","String":"#FFFFFF","Number":"#FFD800","Comment":"#9C2828","Operator":"#FFD800","Punctuation":"#FFFFFF","Function":"#FFD800","Variable":"#FFFFFF","Type":"#FFD800","Builtin":"#FFD800","Property":"#FFD800","Tag":"#FFD800","AttrName":"#FFD800","AttrValue":"#FFFFFF"}},"Typography":{"Family":{"Sans":"Impact, 'Arial Black', sans-serif","Mono":"'Courier New', monospace"}}},"Aliases":{"--retold-bg-primary":"Color.Background.Primary","--retold-bg-secondary":"Color.Background.Secondary","--retold-bg-tertiary":"Color.Background.Tertiary","--retold-bg-panel":"Color.Background.Panel","--retold-bg-viewer":"Color.Background.Viewer","--retold-bg-hover":"Color.Background.Hover","--retold-bg-selected":"Color.Background.Selected","--retold-bg-thumb":"Color.Background.Thumb","--retold-text-primary":"Color.Text.Primary","--retold-text-secondary":"Color.Text.Secondary","--retold-text-muted":"Color.Text.Muted","--retold-text-dim":"Color.Text.Dim","--retold-text-placeholder":"Color.Text.Placeholder","--retold-accent":"Color.Brand.Accent","--retold-accent-hover":"Color.Brand.AccentHover","--retold-border":"Color.Border.Default","--retold-border-light":"Color.Border.Light","--retold-danger":"Color.Status.Danger","--retold-danger-muted":"Color.Status.DangerMuted","--retold-scrollbar":"Color.Scrollbar.Track","--retold-scrollbar-hover":"Color.Scrollbar.Hover","--retold-selection-bg":"Color.Selection.Background","--retold-focus-outline":"Color.Focus.Outline","--retold-font-family":"Typography.Family.Sans","--retold-font-mono":"Typography.Family.Mono"},"IconColors":{"Primary":"#FFC000","Accent":"#FFD700","Muted":"#AA7700","Light":"#7B0000","WarmBeige":"#800000","TealTint":"#6B0000","Lavender":"#780000","AmberTint":"#7A1000","PdfFill":"#6B0000","PdfText":"#FFFF00"},"CSS":[],"SVG":{},"Image":{},"CompiledAt":"2026-05-03T18:12:53.407Z","CompilerVersion":1};},{}],61:[function(require,module,exports){module.exports={"Hash":"mobile-debug","Name":"Mobile Container Debug","Category":"Debug","Version":"0.0.1","Description":"Unique color per container for layout debugging Ported from RetoldRemote-ThemeDefinitions.js to the pict-provider-theme manifest format.","Comprehensive":true,"Modes":{"Strategy":"single","Default":"light"},"Tokens":{"Color":{"Background":{"Primary":"#FF0000","Secondary":"#00CCCC","Tertiary":"#00AA00","Panel":"#FFAA00","Viewer":"#333333","Hover":"rgba(255, 255, 255, 0.2)","Selected":"rgba(255, 255, 255, 0.3)","Thumb":"#AA00AA"},"Text":{"Primary":"#FFFFFF","Secondary":"#EEEEEE","Muted":"#CCCCCC","Dim":"#AAAAAA","Placeholder":"#888888"},"Brand":{"Accent":"#FFFF00","AccentHover":"#FFFF88"},"Border":{"Default":"#FFFFFF","Light":"#CCCCCC"},"Status":{"Danger":"#FF0000","DangerMuted":"#CC4444"},"Scrollbar":{"Track":"#888888","Hover":"#AAAAAA"},"Selection":{"Background":"rgba(255, 255, 0, 0.3)"},"Focus":{"Outline":"#FFFF00"},"Syntax":{"Keyword":"#A626A4","String":"#50A14F","Number":"#986801","Comment":"#A0A1A7","Operator":"#0184BC","Punctuation":"#383A42","Function":"#4078F2","Variable":"#383A42","Type":"#C18401","Builtin":"#986801","Property":"#E45649","Tag":"#E45649","AttrName":"#986801","AttrValue":"#50A14F"}},"Typography":{"Family":{"Sans":"system-ui, -apple-system, sans-serif","Mono":"'SF Mono', 'Consolas', monospace"}}},"Aliases":{"--retold-bg-primary":"Color.Background.Primary","--retold-bg-secondary":"Color.Background.Secondary","--retold-bg-tertiary":"Color.Background.Tertiary","--retold-bg-panel":"Color.Background.Panel","--retold-bg-viewer":"Color.Background.Viewer","--retold-bg-hover":"Color.Background.Hover","--retold-bg-selected":"Color.Background.Selected","--retold-bg-thumb":"Color.Background.Thumb","--retold-text-primary":"Color.Text.Primary","--retold-text-secondary":"Color.Text.Secondary","--retold-text-muted":"Color.Text.Muted","--retold-text-dim":"Color.Text.Dim","--retold-text-placeholder":"Color.Text.Placeholder","--retold-accent":"Color.Brand.Accent","--retold-accent-hover":"Color.Brand.AccentHover","--retold-border":"Color.Border.Default","--retold-border-light":"Color.Border.Light","--retold-danger":"Color.Status.Danger","--retold-danger-muted":"Color.Status.DangerMuted","--retold-scrollbar":"Color.Scrollbar.Track","--retold-scrollbar-hover":"Color.Scrollbar.Hover","--retold-selection-bg":"Color.Selection.Background","--retold-focus-outline":"Color.Focus.Outline","--retold-font-family":"Typography.Family.Sans","--retold-font-mono":"Typography.Family.Mono"},"IconColors":{"Primary":"#FFFFFF","Accent":"#FFFF00","Muted":"#CCCCCC","Light":"#333333","WarmBeige":"#FFAA00","TealTint":"#00CCCC","Lavender":"#AA00AA","AmberTint":"#FFAA00","PdfFill":"#FF4444","PdfText":"#FFFFFF"},"CSS":[],"SVG":{},"Image":{},"CompiledAt":"2026-05-03T18:12:53.408Z","CompilerVersion":1};},{}],62:[function(require,module,exports){module.exports={"Hash":"neo-tokyo","Name":"Neo-Tokyo","Category":"Fun","Version":"0.0.1","Description":"Neon pink on dark navy Ported from RetoldRemote-ThemeDefinitions.js to the pict-provider-theme manifest format.","Comprehensive":true,"Modes":{"Strategy":"single","Default":"dark"},"Tokens":{"Color":{"Background":{"Primary":"#0D0D2B","Secondary":"#080820","Tertiary":"#121235","Panel":"#0F0F28","Viewer":"#060615","Hover":"#1A1A42","Selected":"#2A1845","Thumb":"#080820"},"Text":{"Primary":"#E8E0F0","Secondary":"#D0C8E0","Muted":"#9088A8","Dim":"#6860A0","Placeholder":"#504888"},"Brand":{"Accent":"#FF2D8A","AccentHover":"#FF5AA0"},"Border":{"Default":"#2A2050","Light":"#382868"},"Status":{"Danger":"#FF4466","DangerMuted":"#AA3355"},"Scrollbar":{"Track":"#2A2050","Hover":"#3A3068"},"Selection":{"Background":"rgba(255, 45, 138, 0.25)"},"Focus":{"Outline":"#FF2D8A"},"Syntax":{"Keyword":"#FF4E9F","String":"#A1FFCE","Number":"#FFD93D","Comment":"#807A9E","Operator":"#7DF9FF","Punctuation":"#C0BCEB","Function":"#FFCC80","Variable":"#E0D8FF","Type":"#FFD93D","Builtin":"#FFD93D","Property":"#FF6E6E","Tag":"#FF6E6E","AttrName":"#FFD93D","AttrValue":"#A1FFCE"}},"Typography":{"Family":{"Sans":"'Courier New', monospace","Mono":"'Courier New', monospace"}}},"Aliases":{"--retold-bg-primary":"Color.Background.Primary","--retold-bg-secondary":"Color.Background.Secondary","--retold-bg-tertiary":"Color.Background.Tertiary","--retold-bg-panel":"Color.Background.Panel","--retold-bg-viewer":"Color.Background.Viewer","--retold-bg-hover":"Color.Background.Hover","--retold-bg-selected":"Color.Background.Selected","--retold-bg-thumb":"Color.Background.Thumb","--retold-text-primary":"Color.Text.Primary","--retold-text-secondary":"Color.Text.Secondary","--retold-text-muted":"Color.Text.Muted","--retold-text-dim":"Color.Text.Dim","--retold-text-placeholder":"Color.Text.Placeholder","--retold-accent":"Color.Brand.Accent","--retold-accent-hover":"Color.Brand.AccentHover","--retold-border":"Color.Border.Default","--retold-border-light":"Color.Border.Light","--retold-danger":"Color.Status.Danger","--retold-danger-muted":"Color.Status.DangerMuted","--retold-scrollbar":"Color.Scrollbar.Track","--retold-scrollbar-hover":"Color.Scrollbar.Hover","--retold-selection-bg":"Color.Selection.Background","--retold-focus-outline":"Color.Focus.Outline","--retold-font-family":"Typography.Family.Sans","--retold-font-mono":"Typography.Family.Mono"},"IconColors":{"Primary":"#D0C8E0","Accent":"#FF2D8A","Muted":"#6860A0","Light":"#121235","WarmBeige":"#141438","TealTint":"#100E30","Lavender":"#141232","AmberTint":"#1A1228","PdfFill":"#1A1028","PdfText":"#FF4466"},"CSS":[],"SVG":{},"Image":{},"CompiledAt":"2026-05-03T18:12:53.408Z","CompilerVersion":1};},{}],63:[function(require,module,exports){module.exports={"Hash":"night","Name":"Night","Category":"Grey","Version":"0.0.1","Description":"Near-black, minimal contrast Ported from RetoldRemote-ThemeDefinitions.js to the pict-provider-theme manifest format.","Comprehensive":true,"Modes":{"Strategy":"single","Default":"dark"},"Tokens":{"Color":{"Background":{"Primary":"#0A0A0A","Secondary":"#060606","Tertiary":"#0E0E0E","Panel":"#0C0C0C","Viewer":"#040404","Hover":"#161616","Selected":"#252525","Thumb":"#060606"},"Text":{"Primary":"#888888","Secondary":"#707070","Muted":"#555555","Dim":"#444444","Placeholder":"#333333"},"Brand":{"Accent":"#666666","AccentHover":"#808080"},"Border":{"Default":"#1A1A1A","Light":"#222222"},"Status":{"Danger":"#AA4444","DangerMuted":"#663333"},"Scrollbar":{"Track":"#1A1A1A","Hover":"#2A2A2A"},"Selection":{"Background":"rgba(102, 102, 102, 0.2)"},"Focus":{"Outline":"#666666"},"Syntax":{"Keyword":"#C28FFF","String":"#B0E0B0","Number":"#FFA070","Comment":"#888888","Operator":"#80C8FF","Punctuation":"#BBBBBB","Function":"#FFD080","Variable":"#DDDDDD","Type":"#FFB870","Builtin":"#FFB870","Property":"#FF9090","Tag":"#FF9090","AttrName":"#FFB870","AttrValue":"#B0E0B0"}},"Typography":{"Family":{"Sans":"system-ui, -apple-system, sans-serif","Mono":"'SF Mono', 'Fira Code', 'Consolas', monospace"}}},"Aliases":{"--retold-bg-primary":"Color.Background.Primary","--retold-bg-secondary":"Color.Background.Secondary","--retold-bg-tertiary":"Color.Background.Tertiary","--retold-bg-panel":"Color.Background.Panel","--retold-bg-viewer":"Color.Background.Viewer","--retold-bg-hover":"Color.Background.Hover","--retold-bg-selected":"Color.Background.Selected","--retold-bg-thumb":"Color.Background.Thumb","--retold-text-primary":"Color.Text.Primary","--retold-text-secondary":"Color.Text.Secondary","--retold-text-muted":"Color.Text.Muted","--retold-text-dim":"Color.Text.Dim","--retold-text-placeholder":"Color.Text.Placeholder","--retold-accent":"Color.Brand.Accent","--retold-accent-hover":"Color.Brand.AccentHover","--retold-border":"Color.Border.Default","--retold-border-light":"Color.Border.Light","--retold-danger":"Color.Status.Danger","--retold-danger-muted":"Color.Status.DangerMuted","--retold-scrollbar":"Color.Scrollbar.Track","--retold-scrollbar-hover":"Color.Scrollbar.Hover","--retold-selection-bg":"Color.Selection.Background","--retold-focus-outline":"Color.Focus.Outline","--retold-font-family":"Typography.Family.Sans","--retold-font-mono":"Typography.Family.Mono"},"IconColors":{"Primary":"#707070","Accent":"#666666","Muted":"#444444","Light":"#0E0E0E","WarmBeige":"#121212","TealTint":"#0C0C0C","Lavender":"#101010","AmberTint":"#141210","PdfFill":"#141010","PdfText":"#AA4444"},"CSS":[],"SVG":{},"Image":{},"CompiledAt":"2026-05-03T18:12:53.408Z","CompilerVersion":1};},{}],64:[function(require,module,exports){module.exports={"Hash":"ocean","Name":"Ocean","Version":"0.0.1","Description":"Cool blue-greens (180-235°) with warm coral / amber punctuation (5-30°). Paired light/dark; feels like sea + sun on the horizon.","Comprehensive":true,"Modes":{"Strategy":"system","Default":"light"},"Tokens":{"Color":{"Background":{"Primary":{"Light":"#f4f9fb","Dark":"#0e1820"},"Secondary":{"Light":"#e8f1f5","Dark":"#15212b"},"Tertiary":{"Light":"#dde9ee","Dark":"#1f2c38"},"Panel":{"Light":"#ffffff","Dark":"#1a2632"},"Hover":{"Light":"#e0eef3","Dark":"#26323f"},"Selected":{"Light":"#c8e1ea","Dark":"#1e3a48"}},"Text":{"Primary":{"Light":"#0e2832","Dark":"#e1ecf0"},"Secondary":{"Light":"#3a5662","Dark":"#a8c0c8"},"Muted":{"Light":"#6c828b","Dark":"#7a8e96"},"Placeholder":{"Light":"#90a4ad","Dark":"#5a6e76"}},"Brand":{"Primary":{"Light":"#0e7c8a","Dark":"#4dc4d4"},"PrimaryHover":{"Light":"#0a6371","Dark":"#6dd4e2"},"Accent":{"Light":"#e8a050","Dark":"#f0b878"}},"Border":{"Default":{"Light":"#c0d5dc","Dark":"#2c3d49"},"Light":{"Light":"#d8e6ec","Dark":"#1f2c38"},"Strong":{"Light":"#90b0bc","Dark":"#4a6470"}},"Status":{"Success":{"Light":"#1f8a52","Dark":"#4dc97a"},"Warning":{"Light":"#d68910","Dark":"#f0b020"},"Error":{"Light":"#c93a3a","Dark":"#ff6464"},"Info":{"Light":"#0e7c8a","Dark":"#4dc4d4"}},"Data":{"1":{"Light":"#0e7c8a","Dark":"#4dc4d4"},"2":{"Light":"#e8a050","Dark":"#f0b878"},"3":{"Light":"#1f8a52","Dark":"#4dc97a"},"4":{"Light":"#c93a3a","Dark":"#ff6464"},"5":{"Light":"#b07bac","Dark":"#cda6cf"},"6":{"Light":"#d68910","Dark":"#f0b020"},"7":{"Light":"#5a7f9e","Dark":"#82a0c4"},"8":{"Light":"#6c828b","Dark":"#a8c0c8"}},"Scrollbar":{"Track":{"Light":"#dde9ee","Dark":"#15212b"},"Thumb":{"Light":"#a8c2cc","Dark":"#324658"},"Hover":{"Light":"#7a99a4","Dark":"#506876"}},"Selection":{"Background":{"Light":"#c8e1ea","Dark":"#1e3a48"},"Text":{"Light":"#0e2832","Dark":"#e1ecf0"}},"Focus":{"Outline":{"Light":"#0e7c8a","Dark":"#4dc4d4"}},"Shadow":{"Color":{"Light":"rgba(14, 40, 50, 0.12)","Dark":"rgba(0, 0, 0, 0.55)"}},"Syntax":{"Keyword":{"Light":"#0e7c8a","Dark":"#4dc4d4"},"String":{"Light":"#1f8a52","Dark":"#4dc97a"},"Number":{"Light":"#d68910","Dark":"#f0b020"},"Comment":{"Light":"#90a4ad","Dark":"#5a6e76"},"Operator":{"Light":"#3a5662","Dark":"#a8c0c8"},"Punctuation":{"Light":"#3a5662","Dark":"#a8c0c8"},"Function":{"Light":"#0e7c8a","Dark":"#4dc4d4"},"Variable":{"Light":"#0e2832","Dark":"#e1ecf0"},"Type":{"Light":"#e8a050","Dark":"#f0b878"},"Builtin":{"Light":"#d68910","Dark":"#f0b020"},"Property":{"Light":"#c93a3a","Dark":"#ff6464"},"Tag":{"Light":"#c93a3a","Dark":"#ff6464"},"AttrName":{"Light":"#d68910","Dark":"#f0b020"},"AttrValue":{"Light":"#1f8a52","Dark":"#4dc97a"}},"Editor":{"LineNumberBackground":{"Light":"#e8f1f5","Dark":"#15212b"},"LineNumberText":{"Light":"#90a4ad","Dark":"#5a6e76"},"CurrentLineHighlight":{"Light":"#e0eef3","Dark":"#26323f"},"SelectionBackground":{"Light":"#c8e1ea","Dark":"#1e3a48"},"GutterBorder":{"Light":"#d8e6ec","Dark":"#1f2c38"}}},"Typography":{"Family":{"Sans":"system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif","Serif":"Georgia, Cambria, Times New Roman, Times, serif","Mono":"ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"},"Size":{"XS":"0.75rem","SM":"0.875rem","MD":"1rem","LG":"1.125rem","XL":"1.375rem","XXL":"1.75rem"},"Weight":{"Regular":"400","Medium":"500","Bold":"700"},"LineHeight":{"Tight":"1.2","Normal":"1.45","Loose":"1.7"}},"Spacing":{"XS":"4px","SM":"8px","MD":"12px","LG":"16px","XL":"24px","XXL":"32px"},"Radius":{"None":"0","SM":"2px","MD":"4px","LG":"8px","XL":"12px","Pill":"999px"},"Shadow":{"SM":"0 1px 2px var(--theme-color-shadow-color)","MD":"0 2px 6px var(--theme-color-shadow-color)","LG":"0 6px 18px var(--theme-color-shadow-color)"},"ZIndex":{"Base":"0","Dropdown":"100","Sticky":"200","Overlay":"900","Modal":"1000","Toast":"2000","Tooltip":"3000"},"Duration":{"Fast":"100ms","Normal":"200ms","Slow":"400ms"}},"Brand":{"Name":"Ocean","Tagline":"Cool waters, warm sun"}};},{}],65:[function(require,module,exports){module.exports={"Hash":"pict-default","Name":"Pict Default","Version":"0.0.1","Description":"The reference paired light/dark theme for pict-based applications. Neutral palette suitable for any app; dark mode is mid-grey rather than pure black to reduce eye strain.","Comprehensive":true,"Modes":{"Strategy":"system","Default":"light"},"Tokens":{"Color":{"Background":{"Primary":{"Light":"#ffffff","Dark":"#1a1a1a"},"Secondary":{"Light":"#f5f5f5","Dark":"#242424"},"Tertiary":{"Light":"#ebebeb","Dark":"#2e2e2e"},"Panel":{"Light":"#ffffff","Dark":"#222222"},"Hover":{"Light":"#f0f0f0","Dark":"#2a2a2a"},"Selected":{"Light":"#e0eaff","Dark":"#2a3550"}},"Text":{"Primary":{"Light":"#1a1a1a","Dark":"#ededed"},"Secondary":{"Light":"#454545","Dark":"#bdbdbd"},"Muted":{"Light":"#6b6b6b","Dark":"#888888"},"Placeholder":{"Light":"#9a9a9a","Dark":"#6a6a6a"}},"Brand":{"Primary":{"Light":"#3357c7","Dark":"#6b8eff"},"PrimaryHover":{"Light":"#2848b3","Dark":"#88a4ff"},"Accent":{"Light":"#c75033","Dark":"#ff8a6b"}},"Border":{"Default":{"Light":"#d6d6d6","Dark":"#3a3a3a"},"Light":{"Light":"#e9e9e9","Dark":"#2c2c2c"},"Strong":{"Light":"#a0a0a0","Dark":"#5a5a5a"}},"Status":{"Success":{"Light":"#2e7a3a","Dark":"#5fc377"},"Warning":{"Light":"#a86b00","Dark":"#f0b84a"},"Error":{"Light":"#b62828","Dark":"#ff7373"},"Info":{"Light":"#1f6fb5","Dark":"#5fb4ff"}},"Data":{"1":{"Light":"#3357c7","Dark":"#6b8eff"},"2":{"Light":"#c75033","Dark":"#ff8a6b"},"3":{"Light":"#2e7a3a","Dark":"#5fc377"},"4":{"Light":"#a86b00","Dark":"#f0b84a"},"5":{"Light":"#6b3aac","Dark":"#b08eff"},"6":{"Light":"#1f6fb5","Dark":"#5fb4ff"},"7":{"Light":"#c63a8e","Dark":"#ff7fb6"},"8":{"Light":"#6b6b6b","Dark":"#bdbdbd"}},"Scrollbar":{"Track":{"Light":"#ebebeb","Dark":"#1f1f1f"},"Thumb":{"Light":"#c2c2c2","Dark":"#3f3f3f"},"Hover":{"Light":"#a0a0a0","Dark":"#5a5a5a"}},"Selection":{"Background":{"Light":"#bcd2ff","Dark":"#3a4f7a"},"Text":{"Light":"#1a1a1a","Dark":"#ededed"}},"Focus":{"Outline":{"Light":"#3357c7","Dark":"#6b8eff"}},"Shadow":{"Color":{"Light":"rgba(0, 0, 0, 0.12)","Dark":"rgba(0, 0, 0, 0.55)"}},"Syntax":{"Keyword":{"Light":"#a626a4","Dark":"#c678dd"},"String":{"Light":"#50a14f","Dark":"#98c379"},"Number":{"Light":"#986801","Dark":"#d19a66"},"Comment":{"Light":"#a0a1a7","Dark":"#7f848e"},"Operator":{"Light":"#0184bc","Dark":"#56b6c2"},"Punctuation":{"Light":"#383a42","Dark":"#abb2bf"},"Function":{"Light":"#4078f2","Dark":"#61afef"},"Variable":{"Light":"#383a42","Dark":"#e06c75"},"Type":{"Light":"#c18401","Dark":"#e5c07b"},"Builtin":{"Light":"#986801","Dark":"#d19a66"},"Property":{"Light":"#e45649","Dark":"#e06c75"},"Tag":{"Light":"#e45649","Dark":"#e06c75"},"AttrName":{"Light":"#986801","Dark":"#d19a66"},"AttrValue":{"Light":"#50a14f","Dark":"#98c379"}},"Editor":{"LineNumberBackground":{"Light":"#f5f5f5","Dark":"#1f1f1f"},"LineNumberText":{"Light":"#9a9a9a","Dark":"#6a6a6a"},"CurrentLineHighlight":{"Light":"#f0f0f0","Dark":"#2a2a2a"},"SelectionBackground":{"Light":"#bcd2ff","Dark":"#3a4f7a"},"GutterBorder":{"Light":"#e9e9e9","Dark":"#2c2c2c"}}},"Typography":{"Family":{"Sans":"system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif","Serif":"Georgia, Cambria, Times New Roman, Times, serif","Mono":"ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"},"Size":{"XS":"0.75rem","SM":"0.875rem","MD":"1rem","LG":"1.125rem","XL":"1.375rem","XXL":"1.75rem"},"Weight":{"Regular":"400","Medium":"500","Bold":"700"},"LineHeight":{"Tight":"1.2","Normal":"1.45","Loose":"1.7"}},"Spacing":{"XS":"4px","SM":"8px","MD":"12px","LG":"16px","XL":"24px","XXL":"32px"},"Radius":{"None":"0","SM":"2px","MD":"4px","LG":"8px","XL":"12px","Pill":"999px"},"Shadow":{"SM":"0 1px 2px var(--theme-color-shadow-color)","MD":"0 2px 6px var(--theme-color-shadow-color)","LG":"0 6px 18px var(--theme-color-shadow-color)"},"ZIndex":{"Base":"0","Dropdown":"100","Sticky":"200","Overlay":"900","Modal":"1000","Toast":"2000","Tooltip":"3000"},"Duration":{"Fast":"100ms","Normal":"200ms","Slow":"400ms"}},"Brand":{"Name":"Pict","Tagline":"A JavaScript MVC framework for building web applications."},"CSS":[{"Hash":"pict-default-brand-accents","Priority":600,"Content":"/* pict-default — subtle brand-aware accents.\n   Falls back gracefully to theme-color tokens when no brand is registered,\n   so non-branded apps still look right. */\na { text-decoration-color: var(--brand-color-primary-mode, var(--theme-color-brand-primary, currentColor)); text-decoration-thickness: 2px; text-underline-offset: 3px; }\nh1 { border-bottom: 2px solid var(--brand-color-primary-mode, var(--theme-color-border-default, transparent)); padding-bottom: 6px; }\nh2 { border-bottom: 1px solid var(--brand-color-secondary-mode, var(--theme-color-border-light, transparent)); padding-bottom: 4px; }"}]};},{}],66:[function(require,module,exports){module.exports={"Hash":"playground-corp","Name":"Playground Corp","Version":"0.0.1","Description":"A different paired starter — corporate teal palette, rounder corners.","Comprehensive":true,"Modes":{"Strategy":"system","Default":"light"},"Tokens":{"Color":{"Background":{"Primary":{"Light":"#fbfbfd","Dark":"#0e1416"},"Secondary":{"Light":"#eef3f6","Dark":"#152024"},"Tertiary":{"Light":"#dde7ec","Dark":"#1e2c30"},"Panel":{"Light":"#ffffff","Dark":"#162126"},"Hover":{"Light":"#e5edf1","Dark":"#1d292e"}},"Text":{"Primary":{"Light":"#0a1d22","Dark":"#e3edf0"},"Secondary":{"Light":"#3a5b65","Dark":"#a8c0c8"},"Muted":{"Light":"#647e87","Dark":"#7a929a"},"OnBrand":{"Light":"#ffffff","Dark":"#ffffff"}},"Brand":{"Primary":{"Light":"#117a8b","Dark":"#3ec0d4"},"PrimaryHover":{"Light":"#0e6271","Dark":"#5fd0e0"},"Accent":{"Light":"#d97706","Dark":"#fb923c"}},"Border":{"Default":{"Light":"#cfdce1","Dark":"#2c3a3f"},"Strong":{"Light":"#86a3ac","Dark":"#4d5e64"}},"Status":{"Success":{"Light":"#0f7a52","Dark":"#34d399"},"Warning":{"Light":"#b45309","Dark":"#fbbf24"},"Error":{"Light":"#9f1239","Dark":"#fb7185"},"Info":{"Light":"#1e6fbe","Dark":"#60a5fa"}},"Syntax":{"Keyword":{"Light":"#a626a4","Dark":"#c678dd"},"String":{"Light":"#50a14f","Dark":"#98c379"},"Number":{"Light":"#986801","Dark":"#d19a66"},"Comment":{"Light":"#a0a1a7","Dark":"#7f848e"},"Operator":{"Light":"#0184bc","Dark":"#56b6c2"},"Punctuation":{"Light":"#383a42","Dark":"#abb2bf"},"Function":{"Light":"#4078f2","Dark":"#61afef"},"Variable":{"Light":"#383a42","Dark":"#e06c75"},"Type":{"Light":"#c18401","Dark":"#e5c07b"},"Builtin":{"Light":"#986801","Dark":"#d19a66"},"Property":{"Light":"#e45649","Dark":"#e06c75"},"Tag":{"Light":"#e45649","Dark":"#e06c75"},"AttrName":{"Light":"#986801","Dark":"#d19a66"},"AttrValue":{"Light":"#50a14f","Dark":"#98c379"}}},"Typography":{"Family":{"Sans":"Inter, system-ui, sans-serif","Mono":"ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"},"Size":{"SM":"0.875rem","MD":"1rem","LG":"1.25rem"},"Weight":{"Regular":"400","Bold":"700"}},"Spacing":{"XS":"4px","SM":"8px","MD":"14px","LG":"20px","XL":"28px"},"Radius":{"SM":"4px","MD":"10px","LG":"16px"}},"Brand":{"Name":"Corp"},"Aliases":{"--pict-modal-overlay-bg":"Color.Background.Tertiary","--pict-modal-bg":"Color.Background.Panel","--pict-modal-fg":"Color.Text.Primary","--pict-modal-border":"Color.Border.Default","--pict-modal-shadow":"Color.Border.Strong","--pict-modal-header-bg":"Color.Background.Secondary","--pict-modal-header-fg":"Color.Text.Primary","--pict-modal-header-border":"Color.Border.Default","--pict-modal-btn-bg":"Color.Background.Secondary","--pict-modal-btn-fg":"Color.Text.Primary","--pict-modal-btn-hover-bg":"Color.Background.Hover","--pict-modal-btn-primary-bg":"Color.Brand.Primary","--pict-modal-btn-primary-fg":"Color.Text.OnBrand","--pict-modal-btn-primary-hover-bg":"Color.Brand.PrimaryHover","--pict-modal-btn-danger-bg":"Color.Status.Error","--pict-modal-btn-danger-fg":"Color.Text.OnBrand","--pict-modal-btn-danger-hover-bg":"Color.Status.Error","--pict-modal-toast-bg":"Color.Background.Panel","--pict-modal-toast-fg":"Color.Text.Primary","--pict-modal-toast-shadow":"Color.Border.Strong","--pict-modal-toast-success-bg":"Color.Status.Success","--pict-modal-toast-error-bg":"Color.Status.Error","--pict-modal-toast-warning-bg":"Color.Status.Warning","--pict-modal-toast-info-bg":"Color.Status.Info","--pict-modal-tooltip-bg":"Color.Background.Tertiary","--pict-modal-tooltip-fg":"Color.Text.Primary","--pict-modal-font-family":"Typography.Family.Sans","--pict-um-bg":"Color.Background.Panel","--pict-um-fg":"Color.Text.Primary","--pict-um-muted":"Color.Text.Muted","--pict-um-accent":"Color.Brand.Primary","--pict-um-border":"Color.Border.Default","--pict-um-border-soft":"Color.Border.Light","--pict-um-input-bg":"Color.Background.Primary","--pict-um-pill-bg":"Color.Background.Tertiary","--pict-um-font":"Typography.Family.Sans"}};},{}],67:[function(require,module,exports){module.exports={"Hash":"retold-content-system","Name":"Retold Content System","Version":"0.0.1","Description":"Default palette for the Retold Content System editor — warm beige with teal accents. Light side preserves the original retold-content-system.css palette verbatim; dark side keeps the teal accent and warms the backgrounds into a deep walnut/charcoal range so dark mode reads as the same family of values rather than a generic dark theme.","Comprehensive":true,"Modes":{"Strategy":"system","Default":"system"},"Tokens":{"Color":{"Background":{"Primary":{"Light":"#F5F3EE","Dark":"#1F1B17"},"Secondary":{"Light":"#FAF8F4","Dark":"#2A251F"},"Tertiary":{"Light":"#F0EDE8","Dark":"#332D26"},"Panel":{"Light":"#FFFFFF","Dark":"#26221C"},"Hover":{"Light":"#EDE9E3","Dark":"#383028"},"Selected":{"Light":"#DCE9E7","Dark":"#1E3833"}},"Text":{"Primary":{"Light":"#3D3229","Dark":"#E8DCC8"},"Secondary":{"Light":"#5E5549","Dark":"#C0B5A4"},"Muted":{"Light":"#8A7F72","Dark":"#8E8478"},"Placeholder":{"Light":"#A89E91","Dark":"#6E6457"},"OnBrand":{"Light":"#FFFFFF","Dark":"#1F1B17"}},"Brand":{"Primary":{"Light":"#2E7D74","Dark":"#4FB3A6"},"PrimaryHover":{"Light":"#3A9E92","Dark":"#65CBBE"},"Accent":{"Light":"#2E7D74","Dark":"#4FB3A6"},"AccentHover":{"Light":"#3A9E92","Dark":"#65CBBE"}},"Border":{"Default":{"Light":"#DDD6CA","Dark":"#3F362C"},"Light":{"Light":"#E8E2D7","Dark":"#33291F"},"Strong":{"Light":"#C4BDB0","Dark":"#5A4F40"}},"Status":{"Success":{"Light":"#7BC47F","Dark":"#8FD493"},"Warning":{"Light":"#E8A94D","Dark":"#F0BE6E"},"Error":{"Light":"#D9534F","Dark":"#E87B78"},"Info":{"Light":"#5DA6C7","Dark":"#7FBDD8"}},"Data":{"1":{"Light":"#2E7D74","Dark":"#4FB3A6"},"2":{"Light":"#E8A94D","Dark":"#F0BE6E"},"3":{"Light":"#7BC47F","Dark":"#8FD493"},"4":{"Light":"#D9534F","Dark":"#E87B78"},"5":{"Light":"#A07ACC","Dark":"#BCA0DC"},"6":{"Light":"#5DA6C7","Dark":"#7FBDD8"},"7":{"Light":"#C46B8A","Dark":"#D8919E"},"8":{"Light":"#8A7F72","Dark":"#B8AFA4"}},"Scrollbar":{"Track":{"Light":"#F5F0E8","Dark":"#26221C"},"Thumb":{"Light":"#C4BDB0","Dark":"#4A4036"},"Hover":{"Light":"#8A7F72","Dark":"#6A5F50"}},"Selection":{"Background":{"Light":"#CDE3E0","Dark":"#2E5B55"},"Text":{"Light":"#3D3229","Dark":"#E8DCC8"}},"Focus":{"Outline":{"Light":"#2E7D74","Dark":"#4FB3A6"}},"Shadow":{"Color":{"Light":"rgba(61, 50, 41, 0.12)","Dark":"rgba(0, 0, 0, 0.55)"}},"Syntax":{"Keyword":{"Light":"#A0532E","Dark":"#E89A6E"},"String":{"Light":"#3F8A52","Dark":"#8FD493"},"Number":{"Light":"#A86B00","Dark":"#E8A94D"},"Comment":{"Light":"#8A7F72","Dark":"#8E8478"},"Operator":{"Light":"#2E7D74","Dark":"#4FB3A6"},"Punctuation":{"Light":"#5E5549","Dark":"#C0B5A4"},"Function":{"Light":"#2E5E96","Dark":"#7FBDD8"},"Variable":{"Light":"#3D3229","Dark":"#E8DCC8"},"Type":{"Light":"#A86B00","Dark":"#E8A94D"},"Builtin":{"Light":"#A86B00","Dark":"#E8A94D"},"Property":{"Light":"#A0532E","Dark":"#E89A6E"},"Tag":{"Light":"#A0532E","Dark":"#E89A6E"},"AttrName":{"Light":"#A86B00","Dark":"#E8A94D"},"AttrValue":{"Light":"#3F8A52","Dark":"#8FD493"}}},"Typography":{"Family":{"Sans":"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif","Serif":"Georgia, Cambria, 'Times New Roman', Times, serif","Mono":"'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', 'Liberation Mono', 'Courier New', monospace"},"Size":{"XS":"0.75rem","SM":"0.875rem","MD":"1rem","LG":"1.125rem","XL":"1.375rem","XXL":"1.75rem"},"Weight":{"Regular":"400","Medium":"500","Bold":"700"},"LineHeight":{"Tight":"1.2","Normal":"1.5","Loose":"1.7"}},"Spacing":{"XS":"4px","SM":"8px","MD":"12px","LG":"16px","XL":"24px","XXL":"32px"},"Radius":{"None":"0","SM":"2px","MD":"4px","LG":"8px","XL":"12px","Pill":"999px"},"Layout":{"SidebarWidth":"250px","TopbarHeight":"48px","StatusbarHeight":"28px"}},"Brand":{"Name":"Retold Content","Tagline":"Author content for the Retold ecosystem."}};},{}],68:[function(require,module,exports){module.exports={"Hash":"retold-default","Name":"Retold Default","Version":"0.0.1","Description":"The canonical paired light/dark theme for the Retold ecosystem. Neutral palette suitable for any retold-based app; dark mode is mid-grey rather than pure black to reduce eye strain.","Comprehensive":true,"Modes":{"Strategy":"system","Default":"light"},"Tokens":{"Color":{"Background":{"Primary":{"Light":"#ffffff","Dark":"#1a1a1a"},"Secondary":{"Light":"#f5f5f5","Dark":"#242424"},"Tertiary":{"Light":"#ebebeb","Dark":"#2e2e2e"},"Panel":{"Light":"#ffffff","Dark":"#222222"},"Hover":{"Light":"#f0f0f0","Dark":"#2a2a2a"},"Selected":{"Light":"#e0eaff","Dark":"#2a3550"}},"Text":{"Primary":{"Light":"#1a1a1a","Dark":"#ededed"},"Secondary":{"Light":"#454545","Dark":"#bdbdbd"},"Muted":{"Light":"#6b6b6b","Dark":"#888888"},"Placeholder":{"Light":"#9a9a9a","Dark":"#6a6a6a"}},"Brand":{"Primary":{"Light":"#3357c7","Dark":"#6b8eff"},"PrimaryHover":{"Light":"#2848b3","Dark":"#88a4ff"},"Accent":{"Light":"#c75033","Dark":"#ff8a6b"}},"Border":{"Default":{"Light":"#d6d6d6","Dark":"#3a3a3a"},"Light":{"Light":"#e9e9e9","Dark":"#2c2c2c"},"Strong":{"Light":"#a0a0a0","Dark":"#5a5a5a"}},"Status":{"Success":{"Light":"#2e7a3a","Dark":"#5fc377"},"Warning":{"Light":"#a86b00","Dark":"#f0b84a"},"Error":{"Light":"#b62828","Dark":"#ff7373"},"Info":{"Light":"#1f6fb5","Dark":"#5fb4ff"}},"Data":{"1":{"Light":"#3357c7","Dark":"#6b8eff"},"2":{"Light":"#c75033","Dark":"#ff8a6b"},"3":{"Light":"#2e7a3a","Dark":"#5fc377"},"4":{"Light":"#a86b00","Dark":"#f0b84a"},"5":{"Light":"#6b3aac","Dark":"#b08eff"},"6":{"Light":"#1f6fb5","Dark":"#5fb4ff"},"7":{"Light":"#c63a8e","Dark":"#ff7fb6"},"8":{"Light":"#6b6b6b","Dark":"#bdbdbd"}},"Scrollbar":{"Track":{"Light":"#ebebeb","Dark":"#1f1f1f"},"Thumb":{"Light":"#c2c2c2","Dark":"#3f3f3f"},"Hover":{"Light":"#a0a0a0","Dark":"#5a5a5a"}},"Selection":{"Background":{"Light":"#bcd2ff","Dark":"#3a4f7a"},"Text":{"Light":"#1a1a1a","Dark":"#ededed"}},"Focus":{"Outline":{"Light":"#3357c7","Dark":"#6b8eff"}},"Shadow":{"Color":{"Light":"rgba(0, 0, 0, 0.12)","Dark":"rgba(0, 0, 0, 0.55)"}},"Syntax":{"Keyword":{"Light":"#a626a4","Dark":"#c678dd"},"String":{"Light":"#50a14f","Dark":"#98c379"},"Number":{"Light":"#986801","Dark":"#d19a66"},"Comment":{"Light":"#a0a1a7","Dark":"#7f848e"},"Operator":{"Light":"#0184bc","Dark":"#56b6c2"},"Punctuation":{"Light":"#383a42","Dark":"#abb2bf"},"Function":{"Light":"#4078f2","Dark":"#61afef"},"Variable":{"Light":"#383a42","Dark":"#e06c75"},"Type":{"Light":"#c18401","Dark":"#e5c07b"},"Builtin":{"Light":"#986801","Dark":"#d19a66"},"Property":{"Light":"#e45649","Dark":"#e06c75"},"Tag":{"Light":"#e45649","Dark":"#e06c75"},"AttrName":{"Light":"#986801","Dark":"#d19a66"},"AttrValue":{"Light":"#50a14f","Dark":"#98c379"}},"Editor":{"LineNumberBackground":{"Light":"#f5f5f5","Dark":"#1f1f1f"},"LineNumberText":{"Light":"#9a9a9a","Dark":"#6a6a6a"},"CurrentLineHighlight":{"Light":"#f0f0f0","Dark":"#2a2a2a"},"SelectionBackground":{"Light":"#bcd2ff","Dark":"#3a4f7a"},"GutterBorder":{"Light":"#e9e9e9","Dark":"#2c2c2c"}}},"Typography":{"Family":{"Sans":"system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif","Serif":"Georgia, Cambria, Times New Roman, Times, serif","Mono":"ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"},"Size":{"XS":"0.75rem","SM":"0.875rem","MD":"1rem","LG":"1.125rem","XL":"1.375rem","XXL":"1.75rem"},"Weight":{"Regular":"400","Medium":"500","Bold":"700"},"LineHeight":{"Tight":"1.2","Normal":"1.45","Loose":"1.7"}},"Spacing":{"XS":"4px","SM":"8px","MD":"12px","LG":"16px","XL":"24px","XXL":"32px"},"Radius":{"None":"0","SM":"2px","MD":"4px","LG":"8px","XL":"12px","Pill":"999px"},"Shadow":{"SM":"0 1px 2px var(--theme-color-shadow-color)","MD":"0 2px 6px var(--theme-color-shadow-color)","LG":"0 6px 18px var(--theme-color-shadow-color)"},"ZIndex":{"Base":"0","Dropdown":"100","Sticky":"200","Overlay":"900","Modal":"1000","Toast":"2000","Tooltip":"3000"},"Duration":{"Fast":"100ms","Normal":"200ms","Slow":"400ms"}},"Brand":{"Name":"Retold","Tagline":"What is software if not a tool to tell stories."},"CSS":[{"Hash":"retold-default-brand-accents","Priority":600,"Content":"/* pict-default \u2014 subtle brand-aware accents.\n   Falls back gracefully to theme-color tokens when no brand is registered,\n   so non-branded apps still look right. */\na { text-decoration-color: var(--brand-color-primary-mode, var(--theme-color-brand-primary, currentColor)); text-decoration-thickness: 2px; text-underline-offset: 3px; }\nh1 { border-bottom: 2px solid var(--brand-color-primary-mode, var(--theme-color-border-default, transparent)); padding-bottom: 6px; }\nh2 { border-bottom: 1px solid var(--brand-color-secondary-mode, var(--theme-color-border-light, transparent)); padding-bottom: 4px; }"}]};},{}],69:[function(require,module,exports){module.exports={"Hash":"retold-labs-cyberpunk","Name":"Retold Labs Cyberpunk","Version":"0.0.1","Description":"retold-labs’ neon \"cyberpunk\" identity — cyan/magenta on near-black (dark) or violet on light. Preserves the original cyberpunk-light / cyberpunk-dark palettes verbatim.","Comprehensive":true,"Modes":{"Strategy":"system","Default":"system"},"Tokens":{"Color":{"Background":{"Primary":{"Light":"#eae8f0","Dark":"#0a0a12"},"Secondary":{"Light":"#ddd8ea","Dark":"#12101e"},"Tertiary":{"Light":"#ddd8ea","Dark":"#12101e"},"Panel":{"Light":"#f4f2fa","Dark":"#1a1628"},"Sidebar":{"Light":"#1e1430","Dark":"#06060e"},"Hover":{"Light":"rgba(130, 0, 200, 0.06)","Dark":"rgba(0, 255, 255, 0.08)"},"Selected":{"Light":"rgba(138, 0, 212, 0.10)","Dark":"rgba(0, 229, 255, 0.12)"}},"Text":{"Primary":{"Light":"#1a1028","Dark":"#e8e0f0"},"Secondary":{"Light":"#4a3868","Dark":"#b0a8c8"},"Muted":{"Light":"#7a6a98","Dark":"#6a6488"},"Placeholder":{"Light":"#7a6a98","Dark":"#6a6488"},"OnBrand":{"Light":"#d0c8e0","Dark":"#d0c8e0"}},"Brand":{"Primary":{"Light":"#8a00d4","Dark":"#00e5ff"},"PrimaryHover":{"Light":"#b040f0","Dark":"#60f0ff"},"Accent":{"Light":"#8a00d4","Dark":"#00e5ff"},"AccentHover":{"Light":"#b040f0","Dark":"#60f0ff"}},"Border":{"Default":{"Light":"#c8c0d8","Dark":"#2a2440"},"Light":{"Light":"#c8c0d8","Dark":"#2a2440"},"Strong":{"Light":"#2a2040","Dark":"#1a1430"}},"Status":{"Success":{"Light":"#00a050","Dark":"#39ff14"},"Warning":{"Light":"#d41878","Dark":"#ff2ec4"},"Error":{"Light":"#c82050","Dark":"#ff3860"},"Info":{"Light":"#8a00d4","Dark":"#00e5ff"}},"Scrollbar":{"Track":{"Light":"#ddd8ea","Dark":"#12101e"},"Thumb":{"Light":"#c8c0d8","Dark":"#2a2440"},"Hover":{"Light":"#7a6a98","Dark":"#6a6488"}},"Selection":{"Background":{"Light":"rgba(138, 0, 212, 0.10)","Dark":"rgba(0, 229, 255, 0.12)"},"Text":{"Light":"#1a1028","Dark":"#e8e0f0"}},"Focus":{"Outline":{"Light":"#8a00d4","Dark":"#00e5ff"}},"Shadow":{"Color":{"Light":"rgba(26, 16, 40, 0.12)","Dark":"rgba(0, 0, 0, 0.55)"}},"Syntax":{"Keyword":{"Light":"#8a00d4","Dark":"#00e5ff"},"String":{"Light":"#00a050","Dark":"#39ff14"},"Number":{"Light":"#d41878","Dark":"#ff2ec4"},"Comment":{"Light":"#7a6a98","Dark":"#6a6488"},"Operator":{"Light":"#8a00d4","Dark":"#00e5ff"},"Punctuation":{"Light":"#4a3868","Dark":"#b0a8c8"},"Function":{"Light":"#8a00d4","Dark":"#00e5ff"},"Variable":{"Light":"#1a1028","Dark":"#e8e0f0"},"Type":{"Light":"#d41878","Dark":"#ff2ec4"},"Builtin":{"Light":"#d41878","Dark":"#ff2ec4"},"Property":{"Light":"#c82050","Dark":"#ff3860"},"Tag":{"Light":"#8a00d4","Dark":"#00e5ff"},"AttrName":{"Light":"#d41878","Dark":"#ff2ec4"},"AttrValue":{"Light":"#00a050","Dark":"#39ff14"}}},"Typography":{"Family":{"Sans":"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif","Serif":"Georgia, Cambria, 'Times New Roman', Times, serif","Mono":"'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', 'Liberation Mono', 'Courier New', monospace"},"Size":{"XS":"0.75rem","SM":"0.875rem","MD":"1rem","LG":"1.125rem","XL":"1.375rem","XXL":"1.75rem"},"Weight":{"Regular":"400","Medium":"500","Bold":"700"},"LineHeight":{"Tight":"1.2","Normal":"1.5","Loose":"1.7"}},"Spacing":{"XS":"4px","SM":"8px","MD":"12px","LG":"16px","XL":"24px","XXL":"32px"},"Radius":{"None":"0","SM":"2px","MD":"4px","LG":"8px","XL":"12px","Pill":"999px"},"Layout":{"SidebarWidth":"230px","TopbarHeight":"52px","StatusbarHeight":"28px"}},"Brand":{"Name":"Retold Labs","Tagline":"Run, compare, and distribute ML experiments across the mesh"}};},{}],70:[function(require,module,exports){module.exports={"Hash":"retold-labs-retro","Name":"Retold Labs Retro","Version":"0.0.1","Description":"retold-labs’ \"retro\" identity — amber/green phosphor on dark or sepia/olive on light. Preserves the original retro-light / retro-dark palettes verbatim.","Comprehensive":true,"Modes":{"Strategy":"system","Default":"system"},"Tokens":{"Color":{"Background":{"Primary":{"Light":"#f5f0e0","Dark":"#0c0c08"},"Secondary":{"Light":"#ebe4d0","Dark":"#161610"},"Tertiary":{"Light":"#ebe4d0","Dark":"#161610"},"Panel":{"Light":"#faf6e8","Dark":"#1e1e14"},"Sidebar":{"Light":"#3a3020","Dark":"#080804"},"Hover":{"Light":"rgba(140, 80, 20, 0.06)","Dark":"rgba(255, 176, 0, 0.08)"},"Selected":{"Light":"rgba(140, 80, 20, 0.10)","Dark":"rgba(255, 176, 0, 0.12)"}},"Text":{"Primary":{"Light":"#2e2418","Dark":"#d0c8a0"},"Secondary":{"Light":"#5c4a30","Dark":"#a09870"},"Muted":{"Light":"#8a7450","Dark":"#706848"},"Placeholder":{"Light":"#8a7450","Dark":"#706848"},"OnBrand":{"Light":"#d8c8a0","Dark":"#c8b870"}},"Brand":{"Primary":{"Light":"#8c5014","Dark":"#ffb000"},"PrimaryHover":{"Light":"#b06820","Dark":"#ffc840"},"Accent":{"Light":"#8c5014","Dark":"#ffb000"},"AccentHover":{"Light":"#b06820","Dark":"#ffc840"}},"Border":{"Default":{"Light":"#d0c4a8","Dark":"#2a2a1e"},"Light":{"Light":"#d0c4a8","Dark":"#2a2a1e"},"Strong":{"Light":"#4a4030","Dark":"#1a1a10"}},"Status":{"Success":{"Light":"#2e7830","Dark":"#40c850"},"Warning":{"Light":"#2e7830","Dark":"#40c850"},"Error":{"Light":"#a03020","Dark":"#e04030"},"Info":{"Light":"#8c5014","Dark":"#ffb000"}},"Scrollbar":{"Track":{"Light":"#ebe4d0","Dark":"#161610"},"Thumb":{"Light":"#d0c4a8","Dark":"#2a2a1e"},"Hover":{"Light":"#8a7450","Dark":"#706848"}},"Selection":{"Background":{"Light":"rgba(140, 80, 20, 0.10)","Dark":"rgba(255, 176, 0, 0.12)"},"Text":{"Light":"#2e2418","Dark":"#d0c8a0"}},"Focus":{"Outline":{"Light":"#8c5014","Dark":"#ffb000"}},"Shadow":{"Color":{"Light":"rgba(46, 36, 24, 0.12)","Dark":"rgba(0, 0, 0, 0.55)"}},"Syntax":{"Keyword":{"Light":"#8c5014","Dark":"#ffb000"},"String":{"Light":"#2e7830","Dark":"#40c850"},"Number":{"Light":"#2e7830","Dark":"#40c850"},"Comment":{"Light":"#8a7450","Dark":"#706848"},"Operator":{"Light":"#8c5014","Dark":"#ffb000"},"Punctuation":{"Light":"#5c4a30","Dark":"#a09870"},"Function":{"Light":"#8c5014","Dark":"#ffb000"},"Variable":{"Light":"#2e2418","Dark":"#d0c8a0"},"Type":{"Light":"#2e7830","Dark":"#40c850"},"Builtin":{"Light":"#2e7830","Dark":"#40c850"},"Property":{"Light":"#a03020","Dark":"#e04030"},"Tag":{"Light":"#8c5014","Dark":"#ffb000"},"AttrName":{"Light":"#2e7830","Dark":"#40c850"},"AttrValue":{"Light":"#2e7830","Dark":"#40c850"}}},"Typography":{"Family":{"Sans":"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif","Serif":"Georgia, Cambria, 'Times New Roman', Times, serif","Mono":"'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', 'Liberation Mono', 'Courier New', monospace"},"Size":{"XS":"0.75rem","SM":"0.875rem","MD":"1rem","LG":"1.125rem","XL":"1.375rem","XXL":"1.75rem"},"Weight":{"Regular":"400","Medium":"500","Bold":"700"},"LineHeight":{"Tight":"1.2","Normal":"1.5","Loose":"1.7"}},"Spacing":{"XS":"4px","SM":"8px","MD":"12px","LG":"16px","XL":"24px","XXL":"32px"},"Radius":{"None":"0","SM":"2px","MD":"4px","LG":"8px","XL":"12px","Pill":"999px"},"Layout":{"SidebarWidth":"230px","TopbarHeight":"52px","StatusbarHeight":"28px"}},"Brand":{"Name":"Retold Labs","Tagline":"Run, compare, and distribute ML experiments across the mesh"}};},{}],71:[function(require,module,exports){module.exports={"Hash":"retold-labs","Name":"Retold Labs","Version":"0.0.1","Description":"retold-labs’ original \"professional\" identity — warm beige with teal accents and a deep teal sidebar. Light side preserves professional-light verbatim; dark side preserves professional-dark.","Comprehensive":true,"Modes":{"Strategy":"system","Default":"system"},"Tokens":{"Color":{"Background":{"Primary":{"Light":"#faf6f0","Dark":"#14201e"},"Secondary":{"Light":"#f0ebe2","Dark":"#1a2c2a"},"Tertiary":{"Light":"#f0ebe2","Dark":"#1a2c2a"},"Panel":{"Light":"#ffffff","Dark":"#1e3532"},"Sidebar":{"Light":"#1a3a3a","Dark":"#0e1a18"},"Hover":{"Light":"rgba(13, 138, 138, 0.06)","Dark":"rgba(45, 212, 191, 0.08)"},"Selected":{"Light":"rgba(13, 138, 138, 0.10)","Dark":"rgba(45, 212, 191, 0.12)"}},"Text":{"Primary":{"Light":"#2c2416","Dark":"#e0ebe8"},"Secondary":{"Light":"#5c4f3d","Dark":"#a8bfb8"},"Muted":{"Light":"#8a7d6b","Dark":"#6a8a82"},"Placeholder":{"Light":"#8a7d6b","Dark":"#6a8a82"},"OnBrand":{"Light":"#c8dcd8","Dark":"#c8dcd8"}},"Brand":{"Primary":{"Light":"#0d8a8a","Dark":"#2dd4bf"},"PrimaryHover":{"Light":"#14b8a6","Dark":"#5eead4"},"Accent":{"Light":"#0d8a8a","Dark":"#2dd4bf"},"AccentHover":{"Light":"#14b8a6","Dark":"#5eead4"}},"Border":{"Default":{"Light":"#ddd5c8","Dark":"#2a4a44"},"Light":{"Light":"#ddd5c8","Dark":"#2a4a44"},"Strong":{"Light":"#2a5454","Dark":"#1e3a36"}},"Status":{"Success":{"Light":"#2e9e5a","Dark":"#4ade80"},"Warning":{"Light":"#e07830","Dark":"#f59e4a"},"Error":{"Light":"#c9442e","Dark":"#f87171"},"Info":{"Light":"#0d8a8a","Dark":"#2dd4bf"}},"Scrollbar":{"Track":{"Light":"#f0ebe2","Dark":"#1a2c2a"},"Thumb":{"Light":"#ddd5c8","Dark":"#2a4a44"},"Hover":{"Light":"#8a7d6b","Dark":"#6a8a82"}},"Selection":{"Background":{"Light":"rgba(13, 138, 138, 0.10)","Dark":"rgba(45, 212, 191, 0.12)"},"Text":{"Light":"#2c2416","Dark":"#e0ebe8"}},"Focus":{"Outline":{"Light":"#0d8a8a","Dark":"#2dd4bf"}},"Shadow":{"Color":{"Light":"rgba(44, 36, 22, 0.12)","Dark":"rgba(0, 0, 0, 0.45)"}},"Syntax":{"Keyword":{"Light":"#0d8a8a","Dark":"#2dd4bf"},"String":{"Light":"#2e9e5a","Dark":"#4ade80"},"Number":{"Light":"#e07830","Dark":"#f59e4a"},"Comment":{"Light":"#8a7d6b","Dark":"#6a8a82"},"Operator":{"Light":"#0d8a8a","Dark":"#2dd4bf"},"Punctuation":{"Light":"#5c4f3d","Dark":"#a8bfb8"},"Function":{"Light":"#0d8a8a","Dark":"#2dd4bf"},"Variable":{"Light":"#2c2416","Dark":"#e0ebe8"},"Type":{"Light":"#e07830","Dark":"#f59e4a"},"Builtin":{"Light":"#e07830","Dark":"#f59e4a"},"Property":{"Light":"#c9442e","Dark":"#f87171"},"Tag":{"Light":"#0d8a8a","Dark":"#2dd4bf"},"AttrName":{"Light":"#e07830","Dark":"#f59e4a"},"AttrValue":{"Light":"#2e9e5a","Dark":"#4ade80"}}},"Typography":{"Family":{"Sans":"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif","Serif":"Georgia, Cambria, 'Times New Roman', Times, serif","Mono":"'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', 'Liberation Mono', 'Courier New', monospace"},"Size":{"XS":"0.75rem","SM":"0.875rem","MD":"1rem","LG":"1.125rem","XL":"1.375rem","XXL":"1.75rem"},"Weight":{"Regular":"400","Medium":"500","Bold":"700"},"LineHeight":{"Tight":"1.2","Normal":"1.5","Loose":"1.7"}},"Spacing":{"XS":"4px","SM":"8px","MD":"12px","LG":"16px","XL":"24px","XXL":"32px"},"Radius":{"None":"0","SM":"2px","MD":"4px","LG":"8px","XL":"12px","Pill":"999px"},"Layout":{"SidebarWidth":"230px","TopbarHeight":"52px","StatusbarHeight":"28px"}},"Brand":{"Name":"Retold Labs","Tagline":"Run, compare, and distribute ML experiments across the mesh"}};},{}],72:[function(require,module,exports){module.exports={"Hash":"retold-manager","Name":"Retold Manager","Description":"Default palette for the Retold Manager application — GitHub-style dark on slate with a parallel light variant. Dark side mirrors retold-manager.css's original colors verbatim; light side is a sympathetic translation tuned for daytime use. The retold-manager.css :root block proxies its --color-* names through these --theme-color-* tokens (with the original hexes as fallbacks), so this theme drives the whole app cleanly and other catalog themes still skin most of it.","Comprehensive":true,"Modes":{"Strategy":"system","Default":"system"},"Tokens":{"Color":{"Background":{"Primary":{"Light":"#f6f8fa","Dark":"#0e1116"},"Secondary":{"Light":"#eef1f4","Dark":"#161b22"},"Tertiary":{"Light":"#e4e8ec","Dark":"#1c2128"},"Panel":{"Light":"#ffffff","Dark":"#161b22"},"PanelAlt":{"Light":"#f0f3f6","Dark":"#1c2128"},"Hover":{"Light":"#eaeef2","Dark":"#1c2128"},"Selected":{"Light":"#dbe7ff","Dark":"#243454"}},"Border":{"Default":{"Light":"#d0d7de","Dark":"#30363d"},"Light":{"Light":"#e1e4e8","Dark":"#21262d"},"Strong":{"Light":"#a8b1bb","Dark":"#484f58"}},"Brand":{"Primary":{"Light":"#0969da","Dark":"#2f81f7"},"PrimaryHover":{"Light":"#0550ae","Dark":"#1f6feb"},"Accent":{"Light":"#0969da","Dark":"#2f81f7"},"AccentHover":{"Light":"#0550ae","Dark":"#1f6feb"}},"Text":{"Primary":{"Light":"#1f2328","Dark":"#e6edf3"},"Secondary":{"Light":"#3b424a","Dark":"#c9d1d9"},"Muted":{"Light":"#656d76","Dark":"#8b949e"},"Placeholder":{"Light":"#8c959f","Dark":"#6e7681"},"OnBrand":{"Light":"#ffffff","Dark":"#ffffff"}},"Status":{"Success":{"Light":"#1a7f37","Dark":"#3fb950"},"Danger":{"Light":"#cf222e","Dark":"#f85149"},"Warning":{"Light":"#9a6700","Dark":"#d29922"},"Error":{"Light":"#cf222e","Dark":"#f85149"},"Info":{"Light":"#0969da","Dark":"#2f81f7"}},"Data":{"1":{"Light":"#0969da","Dark":"#2f81f7"},"2":{"Light":"#cf222e","Dark":"#f85149"},"3":{"Light":"#1a7f37","Dark":"#3fb950"},"4":{"Light":"#9a6700","Dark":"#d29922"},"5":{"Light":"#8250df","Dark":"#a371f7"},"6":{"Light":"#bf3989","Dark":"#db61a2"},"7":{"Light":"#1b7c83","Dark":"#39c5cf"},"8":{"Light":"#656d76","Dark":"#8b949e"}},"Scrollbar":{"Track":{"Light":"#eef1f4","Dark":"#161b22"},"Thumb":{"Light":"#c1c8cf","Dark":"#30363d"},"Hover":{"Light":"#a8b1bb","Dark":"#484f58"}},"Selection":{"Background":{"Light":"#cfe6ff","Dark":"#243454"},"Text":{"Light":"#1f2328","Dark":"#e6edf3"}},"Focus":{"Outline":{"Light":"#0969da","Dark":"#2f81f7"}},"Syntax":{"Keyword":{"Light":"#cf222e","Dark":"#ff7b72"},"String":{"Light":"#0a3069","Dark":"#a5d6ff"},"Number":{"Light":"#0550ae","Dark":"#79c0ff"},"Comment":{"Light":"#6e7781","Dark":"#8b949e"},"Operator":{"Light":"#cf222e","Dark":"#ff7b72"},"Punctuation":{"Light":"#24292f","Dark":"#c9d1d9"},"Function":{"Light":"#8250df","Dark":"#d2a8ff"},"Variable":{"Light":"#24292f","Dark":"#c9d1d9"},"Type":{"Light":"#953800","Dark":"#ffa657"},"Builtin":{"Light":"#0550ae","Dark":"#79c0ff"},"Property":{"Light":"#0550ae","Dark":"#79c0ff"},"Tag":{"Light":"#116329","Dark":"#7ee787"},"AttrName":{"Light":"#8250df","Dark":"#d2a8ff"},"AttrValue":{"Light":"#0a3069","Dark":"#a5d6ff"}}},"Typography":{"Family":{"Sans":"-apple-system, BlinkMacSystemFont, \"SF Pro\", \"Segoe UI\", sans-serif","Mono":"ui-monospace, \"SF Mono\", Menlo, Monaco, \"Courier New\", monospace"}},"Layout":{"SidebarWidth":"280px","TopbarHeight":"44px","StatusbarHeight":"28px"}}};},{}],73:[function(require,module,exports){module.exports={"Hash":"retold-mono","Name":"Retold Mono","Version":"0.0.2","Description":"High-contrast monochrome theme — black on white in light mode, white on black in dark mode. Useful for print, simple admin tooling, and as a paired-mode reference theme that proves the toggle works on something visually unmistakable.","Comprehensive":true,"Modes":{"Strategy":"system","Default":"system"},"Tokens":{"Color":{"Background":{"Primary":{"Light":"#ffffff","Dark":"#000000"},"Secondary":{"Light":"#f0f0f0","Dark":"#101010"},"Tertiary":{"Light":"#e2e2e2","Dark":"#1c1c1c"},"Panel":{"Light":"#ffffff","Dark":"#000000"},"Hover":{"Light":"#ebebeb","Dark":"#1a1a1a"},"Selected":{"Light":"#d6d6d6","Dark":"#2a2a2a"}},"Text":{"Primary":{"Light":"#000000","Dark":"#ffffff"},"Secondary":{"Light":"#222222","Dark":"#dddddd"},"Muted":{"Light":"#555555","Dark":"#aaaaaa"},"Placeholder":{"Light":"#888888","Dark":"#777777"}},"Brand":{"Primary":{"Light":"#000000","Dark":"#ffffff"},"PrimaryHover":{"Light":"#222222","Dark":"#dddddd"},"Accent":{"Light":"#444444","Dark":"#bbbbbb"}},"Border":{"Default":{"Light":"#888888","Dark":"#666666"},"Light":{"Light":"#cccccc","Dark":"#333333"},"Strong":{"Light":"#000000","Dark":"#ffffff"}},"Status":{"Success":{"Light":"#000000","Dark":"#ffffff"},"Warning":{"Light":"#000000","Dark":"#ffffff"},"Error":{"Light":"#000000","Dark":"#ffffff"},"Info":{"Light":"#000000","Dark":"#ffffff"}},"Data":{"1":{"Light":"#000000","Dark":"#ffffff"},"2":{"Light":"#262626","Dark":"#e0e0e0"},"3":{"Light":"#404040","Dark":"#c0c0c0"},"4":{"Light":"#595959","Dark":"#a0a0a0"},"5":{"Light":"#737373","Dark":"#808080"},"6":{"Light":"#8c8c8c","Dark":"#737373"},"7":{"Light":"#a6a6a6","Dark":"#595959"},"8":{"Light":"#bfbfbf","Dark":"#404040"}},"Scrollbar":{"Track":{"Light":"#e0e0e0","Dark":"#101010"},"Thumb":{"Light":"#888888","Dark":"#666666"},"Hover":{"Light":"#444444","Dark":"#bbbbbb"}},"Selection":{"Background":{"Light":"#000000","Dark":"#ffffff"},"Text":{"Light":"#ffffff","Dark":"#000000"}},"Focus":{"Outline":{"Light":"#000000","Dark":"#ffffff"}},"Shadow":{"Color":{"Light":"rgba(0, 0, 0, 0.18)","Dark":"rgba(255, 255, 255, 0.18)"}},"Syntax":{"Keyword":{"Light":"#000000","Dark":"#ffffff"},"String":{"Light":"#555555","Dark":"#cccccc"},"Number":{"Light":"#000000","Dark":"#ffffff"},"Comment":{"Light":"#888888","Dark":"#888888"},"Operator":{"Light":"#000000","Dark":"#ffffff"},"Punctuation":{"Light":"#444444","Dark":"#bbbbbb"},"Function":{"Light":"#000000","Dark":"#ffffff"},"Variable":{"Light":"#000000","Dark":"#ffffff"},"Type":{"Light":"#222222","Dark":"#dddddd"},"Builtin":{"Light":"#222222","Dark":"#dddddd"},"Property":{"Light":"#444444","Dark":"#bbbbbb"},"Tag":{"Light":"#000000","Dark":"#ffffff"},"AttrName":{"Light":"#444444","Dark":"#bbbbbb"},"AttrValue":{"Light":"#555555","Dark":"#cccccc"}}},"Typography":{"Family":{"Sans":"Helvetica, Arial, sans-serif","Serif":"Georgia, Times New Roman, serif","Mono":"ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"},"Size":{"XS":"0.75rem","SM":"0.875rem","MD":"1rem","LG":"1.125rem","XL":"1.375rem","XXL":"1.75rem"},"Weight":{"Regular":"400","Medium":"600","Bold":"700"},"LineHeight":{"Tight":"1.15","Normal":"1.4","Loose":"1.65"}},"Spacing":{"XS":"4px","SM":"8px","MD":"12px","LG":"16px","XL":"24px","XXL":"32px"},"Radius":{"None":"0","SM":"0","MD":"0","LG":"0","XL":"0","Pill":"999px"},"Shadow":{"SM":"0 1px 0 var(--theme-color-shadow-color)","MD":"0 2px 0 var(--theme-color-shadow-color)","LG":"0 4px 0 var(--theme-color-shadow-color)"},"ZIndex":{"Base":"0","Dropdown":"100","Sticky":"200","Overlay":"900","Modal":"1000","Toast":"2000","Tooltip":"3000"},"Duration":{"Fast":"0ms","Normal":"0ms","Slow":"0ms"}},"Brand":{"Name":"Retold Mono","Tagline":"Black on white. White on black. Nothing else."},"CSS":[{"Hash":"retold-mono-brand-accents","Priority":600,"Content":"/* retold-mono — keeps the all-monochrome aesthetic but lets brand colors\n   in for narrow accent moments. The thick rule under H1 is brand primary;\n   the hair rule under H2 is brand secondary. Without a brand registered\n   they fall back to mono black/grey. */\na { text-decoration-color: var(--brand-color-primary-mode, currentColor); text-decoration-thickness: 2px; text-underline-offset: 3px; }\nh1 { border-bottom: 3px solid var(--brand-color-primary-mode, var(--theme-color-text-primary, #000)); padding-bottom: 6px; }\nh2 { border-bottom: 1px solid var(--brand-color-secondary-mode, var(--theme-color-border-default, #888)); padding-bottom: 4px; }"}]};},{}],74:[function(require,module,exports){module.exports={"Hash":"solarized-dark","Name":"Solarized Dark","Category":"Fun","Version":"0.0.1","Description":"Schoonover's classic palette Ported from RetoldRemote-ThemeDefinitions.js to the pict-provider-theme manifest format.","Comprehensive":true,"Modes":{"Strategy":"single","Default":"dark"},"Tokens":{"Color":{"Background":{"Primary":"#002B36","Secondary":"#073642","Tertiary":"#003B4A","Panel":"#00303C","Viewer":"#001E28","Hover":"#0A4858","Selected":"#155868","Thumb":"#073642"},"Text":{"Primary":"#FDF6E3","Secondary":"#EEE8D5","Muted":"#93A1A1","Dim":"#839496","Placeholder":"#657B83"},"Brand":{"Accent":"#268BD2","AccentHover":"#45A0E0"},"Border":{"Default":"#0A4050","Light":"#125868"},"Status":{"Danger":"#DC322F","DangerMuted":"#AA2A28"},"Scrollbar":{"Track":"#0A4050","Hover":"#125868"},"Selection":{"Background":"rgba(38, 139, 210, 0.25)"},"Focus":{"Outline":"#268BD2"},"Syntax":{"Keyword":"#859900","String":"#2AA198","Number":"#D33682","Comment":"#586E75","Operator":"#268BD2","Punctuation":"#93A1A1","Function":"#B58900","Variable":"#FDF6E3","Type":"#B58900","Builtin":"#CB4B16","Property":"#268BD2","Tag":"#268BD2","AttrName":"#B58900","AttrValue":"#2AA198"}},"Typography":{"Family":{"Sans":"'Source Code Pro', 'Fira Code', monospace","Mono":"'Source Code Pro', 'Fira Code', monospace"}}},"Aliases":{"--retold-bg-primary":"Color.Background.Primary","--retold-bg-secondary":"Color.Background.Secondary","--retold-bg-tertiary":"Color.Background.Tertiary","--retold-bg-panel":"Color.Background.Panel","--retold-bg-viewer":"Color.Background.Viewer","--retold-bg-hover":"Color.Background.Hover","--retold-bg-selected":"Color.Background.Selected","--retold-bg-thumb":"Color.Background.Thumb","--retold-text-primary":"Color.Text.Primary","--retold-text-secondary":"Color.Text.Secondary","--retold-text-muted":"Color.Text.Muted","--retold-text-dim":"Color.Text.Dim","--retold-text-placeholder":"Color.Text.Placeholder","--retold-accent":"Color.Brand.Accent","--retold-accent-hover":"Color.Brand.AccentHover","--retold-border":"Color.Border.Default","--retold-border-light":"Color.Border.Light","--retold-danger":"Color.Status.Danger","--retold-danger-muted":"Color.Status.DangerMuted","--retold-scrollbar":"Color.Scrollbar.Track","--retold-scrollbar-hover":"Color.Scrollbar.Hover","--retold-selection-bg":"Color.Selection.Background","--retold-focus-outline":"Color.Focus.Outline","--retold-font-family":"Typography.Family.Sans","--retold-font-mono":"Typography.Family.Mono"},"IconColors":{"Primary":"#EEE8D5","Accent":"#268BD2","Muted":"#839496","Light":"#003B4A","WarmBeige":"#073642","TealTint":"#004050","Lavender":"#003848","AmberTint":"#0A3A30","PdfFill":"#0A3028","PdfText":"#DC322F"},"CSS":[],"SVG":{},"Image":{},"CompiledAt":"2026-05-03T18:12:53.408Z","CompilerVersion":1};},{}],75:[function(require,module,exports){module.exports={"Hash":"synthwave","Name":"Synthwave","Category":"Fun","Version":"0.0.1","Description":"Purple and pink neon Ported from RetoldRemote-ThemeDefinitions.js to the pict-provider-theme manifest format.","Comprehensive":true,"Modes":{"Strategy":"single","Default":"dark"},"Tokens":{"Color":{"Background":{"Primary":"#1A0A2E","Secondary":"#140824","Tertiary":"#200E38","Panel":"#1C0C32","Viewer":"#100620","Hover":"#2A1848","Selected":"#3A2060","Thumb":"#140824"},"Text":{"Primary":"#E8C0F8","Secondary":"#D0A8E8","Muted":"#9878B8","Dim":"#7858A8","Placeholder":"#584088"},"Brand":{"Accent":"#FF71CE","AccentHover":"#FF99DD"},"Border":{"Default":"#302050","Light":"#402868"},"Status":{"Danger":"#FF4488","DangerMuted":"#AA3366"},"Scrollbar":{"Track":"#302050","Hover":"#402868"},"Selection":{"Background":"rgba(255, 113, 206, 0.25)"},"Focus":{"Outline":"#FF71CE"},"Syntax":{"Keyword":"#FF6AD5","String":"#FFE066","Number":"#FF6AD5","Comment":"#9C8AC1","Operator":"#26F0F1","Punctuation":"#C8B6E2","Function":"#26F0F1","Variable":"#FFE0FF","Type":"#FFD93D","Builtin":"#FFD93D","Property":"#FF477E","Tag":"#FF477E","AttrName":"#FFD93D","AttrValue":"#FFE066"}},"Typography":{"Family":{"Sans":"'Trebuchet MS', sans-serif","Mono":"'Courier New', monospace"}}},"Aliases":{"--retold-bg-primary":"Color.Background.Primary","--retold-bg-secondary":"Color.Background.Secondary","--retold-bg-tertiary":"Color.Background.Tertiary","--retold-bg-panel":"Color.Background.Panel","--retold-bg-viewer":"Color.Background.Viewer","--retold-bg-hover":"Color.Background.Hover","--retold-bg-selected":"Color.Background.Selected","--retold-bg-thumb":"Color.Background.Thumb","--retold-text-primary":"Color.Text.Primary","--retold-text-secondary":"Color.Text.Secondary","--retold-text-muted":"Color.Text.Muted","--retold-text-dim":"Color.Text.Dim","--retold-text-placeholder":"Color.Text.Placeholder","--retold-accent":"Color.Brand.Accent","--retold-accent-hover":"Color.Brand.AccentHover","--retold-border":"Color.Border.Default","--retold-border-light":"Color.Border.Light","--retold-danger":"Color.Status.Danger","--retold-danger-muted":"Color.Status.DangerMuted","--retold-scrollbar":"Color.Scrollbar.Track","--retold-scrollbar-hover":"Color.Scrollbar.Hover","--retold-selection-bg":"Color.Selection.Background","--retold-focus-outline":"Color.Focus.Outline","--retold-font-family":"Typography.Family.Sans","--retold-font-mono":"Typography.Family.Mono"},"IconColors":{"Primary":"#D0A8E8","Accent":"#FF71CE","Muted":"#7858A8","Light":"#200E38","WarmBeige":"#221040","TealTint":"#1A0C30","Lavender":"#1E0E36","AmberTint":"#241028","PdfFill":"#241020","PdfText":"#FF4488"},"CSS":[],"SVG":{},"Image":{},"CompiledAt":"2026-05-03T18:12:53.408Z","CompilerVersion":1};},{}],76:[function(require,module,exports){module.exports={"Hash":"twilight","Name":"Twilight","Category":"Grey","Version":"0.0.1","Description":"Dark grey, low light. Ported from RetoldRemote-ThemeDefinitions.js to the pict-provider-theme manifest format. Single-mode (no light/dark bifurcation). Aliases preserve the legacy `--retold-*` variable names so existing CSS keeps working through the migration.","Comprehensive":true,"Modes":{"Strategy":"single","Default":"dark"},"Tokens":{"Color":{"Background":{"Primary":"#1E1E1E","Secondary":"#181818","Tertiary":"#252525","Panel":"#202020","Viewer":"#141414","Hover":"#2E2E2E","Selected":"#404040","Thumb":"#181818"},"Text":{"Primary":"#E0E0E0","Secondary":"#C8C8C8","Muted":"#909090","Dim":"#707070","Placeholder":"#585858"},"Brand":{"Accent":"#A0A0A0","AccentHover":"#C0C0C0"},"Border":{"Default":"#333333","Light":"#404040"},"Status":{"Danger":"#FF6666","DangerMuted":"#AA6666"},"Scrollbar":{"Track":"#404040","Hover":"#505050"},"Selection":{"Background":"rgba(160, 160, 160, 0.25)"},"Focus":{"Outline":"#A0A0A0"},"Syntax":{"Keyword":"#B58FFF","String":"#9CDFB0","Number":"#FFB870","Comment":"#6E6E6E","Operator":"#7CC5FF","Punctuation":"#C0C0C0","Function":"#FFD080","Variable":"#E0E0E0","Type":"#FFB870","Builtin":"#FFB870","Property":"#FF8B8B","Tag":"#FF8B8B","AttrName":"#FFB870","AttrValue":"#9CDFB0"}},"Typography":{"Family":{"Sans":"system-ui, -apple-system, sans-serif","Mono":"'SF Mono', 'Fira Code', 'Consolas', monospace"}}},"Aliases":{"--retold-bg-primary":"Color.Background.Primary","--retold-bg-secondary":"Color.Background.Secondary","--retold-bg-tertiary":"Color.Background.Tertiary","--retold-bg-panel":"Color.Background.Panel","--retold-bg-viewer":"Color.Background.Viewer","--retold-bg-hover":"Color.Background.Hover","--retold-bg-selected":"Color.Background.Selected","--retold-bg-thumb":"Color.Background.Thumb","--retold-text-primary":"Color.Text.Primary","--retold-text-secondary":"Color.Text.Secondary","--retold-text-muted":"Color.Text.Muted","--retold-text-dim":"Color.Text.Dim","--retold-text-placeholder":"Color.Text.Placeholder","--retold-accent":"Color.Brand.Accent","--retold-accent-hover":"Color.Brand.AccentHover","--retold-border":"Color.Border.Default","--retold-border-light":"Color.Border.Light","--retold-danger":"Color.Status.Danger","--retold-danger-muted":"Color.Status.DangerMuted","--retold-scrollbar":"Color.Scrollbar.Track","--retold-scrollbar-hover":"Color.Scrollbar.Hover","--retold-selection-bg":"Color.Selection.Background","--retold-focus-outline":"Color.Focus.Outline","--retold-font-family":"Typography.Family.Sans","--retold-font-mono":"Typography.Family.Mono"},"IconColors":{"Primary":"#C8C8C8","Accent":"#A0A0A0","Muted":"#707070","Light":"#252525","WarmBeige":"#2A2A2A","TealTint":"#222222","Lavender":"#282828","AmberTint":"#2E2A24","PdfFill":"#2E2224","PdfText":"#E06060"},"CSS":[],"SVG":{},"Image":{},"CompiledAt":"2026-05-03T18:12:53.408Z","CompilerVersion":1};},{}],77:[function(require,module,exports){module.exports={"Hash":"ultravisor-desert-canyon","Name":"Ultravisor — Desert Canyon","Version":"0.0.1","Description":"Vibrant desert palette — orange brand and teal accents on deep canyon-brown backgrounds. Single-mode dark.","Comprehensive":true,"Modes":{"Strategy":"single","Default":"dark"},"Tokens":{"Color":{"Background":{"Primary":"#18120e","Secondary":"#221a14","Tertiary":"#2e2018","Panel":"#221a14","Hover":"#3a2a1e","Selected":"#3a2a1e"},"Text":{"Primary":"#d8c8b0","Secondary":"#e8d8c0","Muted":"#a09080","Placeholder":"#685040","OnBrand":"#18120e"},"Brand":{"Primary":"#e8943a","PrimaryHover":"#f0a44a","Accent":"#18a0a0","AccentHover":"#30b0b0"},"Border":{"Default":"#3a2a1e","Light":"#2e2018","Strong":"#4a3a2e"},"Status":{"Success":"#18a0a0","Warning":"#e0c870","Error":"#e05830","Info":"#18a0a0"},"Scrollbar":{"Track":"#221a14","Thumb":"#3a2a1e","Hover":"#4a3a2e"},"Selection":{"Background":"#3a2a1e","Text":"#e8d8c0"},"Focus":{"Outline":"#e8943a"},"Shadow":{"Color":"rgba(0, 0, 0, 0.30)"},"Syntax":{"Keyword":"#E89A6E","String":"#8FD493","Number":"#E8A94D","Comment":"#8E8478","Operator":"#4FB3A6","Punctuation":"#C0B5A4","Function":"#7FBDD8","Variable":"#E8DCC8","Type":"#E8A94D","Builtin":"#E8A94D","Property":"#E89A6E","Tag":"#E89A6E","AttrName":"#E8A94D","AttrValue":"#8FD493"},"Editor":{"LineNumberBackground":"#221a14","LineNumberText":"#685040","CurrentLineHighlight":"#2e2018","SelectionBackground":"#3a2a1e","GutterBorder":"#2e2018"}},"Typography":{"Family":{"Sans":"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif","Serif":"Georgia, Cambria, 'Times New Roman', Times, serif","Mono":"'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', 'Liberation Mono', 'Courier New', monospace"}},"Layout":{"SidebarWidth":"260px","TopbarHeight":"56px","StatusbarHeight":"28px"}},"Brand":{"Name":"Ultravisor","Tagline":"Process supervision and workflow automation"}};},{}],78:[function(require,module,exports){module.exports={"Hash":"ultravisor-desert-day","Name":"Ultravisor — Desert Day","Version":"0.0.1","Description":"Ultravisor's warm light palette — cream backgrounds, deep walnut text, teal accents. Single-mode light.","Comprehensive":true,"Modes":{"Strategy":"single","Default":"light"},"Tokens":{"Color":{"Background":{"Primary":"#faf6f0","Secondary":"#f0e6d6","Tertiary":"#e8ddd0","Panel":"#ffffff","Hover":"#f0e6d6","Selected":"#e8ddd0"},"Text":{"Primary":"#3d2b1f","Secondary":"#2e1e14","Muted":"#8a7560","Placeholder":"#a09080","OnBrand":"#ffffff"},"Brand":{"Primary":"#5c3d2e","PrimaryHover":"#7a5040","Accent":"#3a8a8c","AccentHover":"#2a7070"},"Border":{"Default":"#e0d0b8","Light":"#e8ddd0","Strong":"#c8b8a0"},"Status":{"Success":"#5a7a30","Warning":"#b08020","Error":"#a03040","Info":"#3a8a8c"},"Scrollbar":{"Track":"#f0e6d6","Thumb":"#d0c0a8","Hover":"#c0b098"},"Selection":{"Background":"#e8ddd0","Text":"#2e1e14"},"Focus":{"Outline":"#c2703e"},"Shadow":{"Color":"rgba(92, 61, 46, 0.10)"},"Syntax":{"Keyword":"#A0532E","String":"#3F8A52","Number":"#A86B00","Comment":"#8A7F72","Operator":"#2E7D74","Punctuation":"#5E5549","Function":"#2E5E96","Variable":"#3D3229","Type":"#A86B00","Builtin":"#A86B00","Property":"#A0532E","Tag":"#A0532E","AttrName":"#A86B00","AttrValue":"#3F8A52"},"Editor":{"LineNumberBackground":"#f0e6d6","LineNumberText":"#a09080","CurrentLineHighlight":"#f5ede0","SelectionBackground":"#e8ddd0","GutterBorder":"#e0d0b8"}},"Typography":{"Family":{"Sans":"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif","Serif":"Georgia, Cambria, 'Times New Roman', Times, serif","Mono":"'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', 'Liberation Mono', 'Courier New', monospace"}},"Layout":{"SidebarWidth":"260px","TopbarHeight":"56px","StatusbarHeight":"28px"}},"Brand":{"Name":"Ultravisor","Tagline":"Process supervision and workflow automation"}};},{}],79:[function(require,module,exports){module.exports={"Hash":"ultravisor-desert-dusk","Name":"Ultravisor — Desert Dusk","Version":"0.0.1","Description":"Ultravisor's original default — warm tan brand on muted dark desert backgrounds. Single-mode dark.","Comprehensive":true,"Modes":{"Strategy":"single","Default":"dark"},"Tokens":{"Color":{"Background":{"Primary":"#1a1714","Secondary":"#252018","Tertiary":"#302818","Panel":"#252018","Hover":"#3a3028","Selected":"#3a3028"},"Text":{"Primary":"#c8b8a0","Secondary":"#d8c8a8","Muted":"#907860","Placeholder":"#706050","OnBrand":"#FFFFFF"},"Brand":{"Primary":"#c4956a","PrimaryHover":"#d4a57a","Accent":"#4a9090","AccentHover":"#5aacac"},"Border":{"Default":"#3a3028","Light":"#302818","Strong":"#4a4038"},"Status":{"Success":"#8a9a5a","Warning":"#c0a050","Error":"#b04050","Info":"#4a9090"},"Scrollbar":{"Track":"#252018","Thumb":"#3a3028","Hover":"#4a4038"},"Selection":{"Background":"#3a3028","Text":"#d8c8a8"},"Focus":{"Outline":"#c4956a"},"Shadow":{"Color":"rgba(0, 0, 0, 0.30)"},"Syntax":{"Keyword":"#E89A6E","String":"#8FD493","Number":"#E8A94D","Comment":"#8E8478","Operator":"#4FB3A6","Punctuation":"#C0B5A4","Function":"#7FBDD8","Variable":"#E8DCC8","Type":"#E8A94D","Builtin":"#E8A94D","Property":"#E89A6E","Tag":"#E89A6E","AttrName":"#E8A94D","AttrValue":"#8FD493"},"Editor":{"LineNumberBackground":"#252018","LineNumberText":"#706050","CurrentLineHighlight":"#302818","SelectionBackground":"#3a3028","GutterBorder":"#302818"}},"Typography":{"Family":{"Sans":"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif","Serif":"Georgia, Cambria, 'Times New Roman', Times, serif","Mono":"'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', 'Liberation Mono', 'Courier New', monospace"}},"Layout":{"SidebarWidth":"260px","TopbarHeight":"56px","StatusbarHeight":"28px"}},"Brand":{"Name":"Ultravisor","Tagline":"Process supervision and workflow automation"}};},{}],80:[function(require,module,exports){module.exports={"Hash":"ultravisor-desert-sunset","Name":"Ultravisor — Desert Sunset","Version":"0.0.1","Description":"Ultravisor's golden-hour palette — orange brand on rust-warmed dark backgrounds. Single-mode dark.","Comprehensive":true,"Modes":{"Strategy":"single","Default":"dark"},"Tokens":{"Color":{"Background":{"Primary":"#1e1610","Secondary":"#2a2018","Tertiary":"#342818","Panel":"#2a2018","Hover":"#3a2e22","Selected":"#3a2e22"},"Text":{"Primary":"#d4c4aa","Secondary":"#e0d0b8","Muted":"#8a7560","Placeholder":"#6a5840","OnBrand":"#1e1610"},"Brand":{"Primary":"#e8943a","PrimaryHover":"#f0a44a","Accent":"#2a8a8a","AccentHover":"#3a9a9a"},"Border":{"Default":"#3a2e22","Light":"#342818","Strong":"#4a3e32"},"Status":{"Success":"#6a9a3a","Warning":"#d4a46a","Error":"#c44e2a","Info":"#2a8a8a"},"Scrollbar":{"Track":"#2a2018","Thumb":"#3a2e22","Hover":"#4a3e32"},"Selection":{"Background":"#3a2e22","Text":"#e0d0b8"},"Focus":{"Outline":"#e8943a"},"Shadow":{"Color":"rgba(0, 0, 0, 0.30)"},"Syntax":{"Keyword":"#E89A6E","String":"#8FD493","Number":"#E8A94D","Comment":"#8E8478","Operator":"#4FB3A6","Punctuation":"#C0B5A4","Function":"#7FBDD8","Variable":"#E8DCC8","Type":"#E8A94D","Builtin":"#E8A94D","Property":"#E89A6E","Tag":"#E89A6E","AttrName":"#E8A94D","AttrValue":"#8FD493"},"Editor":{"LineNumberBackground":"#2a2018","LineNumberText":"#6a5840","CurrentLineHighlight":"#342818","SelectionBackground":"#3a2e22","GutterBorder":"#342818"}},"Typography":{"Family":{"Sans":"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif","Serif":"Georgia, Cambria, 'Times New Roman', Times, serif","Mono":"'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', 'Liberation Mono', 'Courier New', monospace"}},"Layout":{"SidebarWidth":"260px","TopbarHeight":"56px","StatusbarHeight":"28px"}},"Brand":{"Name":"Ultravisor","Tagline":"Process supervision and workflow automation"}};},{}],81:[function(require,module,exports){module.exports={"Hash":"ultravisor-professional-dark","Name":"Ultravisor — Professional Dark","Version":"0.0.1","Description":"Dark modern palette — slate-blue text on inky surfaces, sky-blue brand. Single-mode dark.","Comprehensive":true,"Modes":{"Strategy":"single","Default":"dark"},"Tokens":{"Color":{"Background":{"Primary":"#111318","Secondary":"#1a1d24","Tertiary":"#22252e","Panel":"#1a1d24","Hover":"#282c34","Selected":"#282c34"},"Text":{"Primary":"#c8cdd5","Secondary":"#e0e4ea","Muted":"#8b92a0","Placeholder":"#5a6070","OnBrand":"#ffffff"},"Brand":{"Primary":"#60a5fa","PrimaryHover":"#93c5fd","Accent":"#60a5fa","AccentHover":"#93c5fd"},"Border":{"Default":"#282c34","Light":"#22252e","Strong":"#3a3f4a"},"Status":{"Success":"#34d399","Warning":"#fbbf24","Error":"#f87171","Info":"#60a5fa"},"Scrollbar":{"Track":"#1a1d24","Thumb":"#282c34","Hover":"#3a3f4a"},"Selection":{"Background":"#1e2230","Text":"#e0e4ea"},"Focus":{"Outline":"#60a5fa"},"Shadow":{"Color":"rgba(0, 0, 0, 0.30)"},"Syntax":{"Keyword":"#E89A6E","String":"#8FD493","Number":"#E8A94D","Comment":"#8E8478","Operator":"#4FB3A6","Punctuation":"#C0B5A4","Function":"#7FBDD8","Variable":"#E8DCC8","Type":"#E8A94D","Builtin":"#E8A94D","Property":"#E89A6E","Tag":"#E89A6E","AttrName":"#E8A94D","AttrValue":"#8FD493"},"Editor":{"LineNumberBackground":"#1a1d24","LineNumberText":"#5a6070","CurrentLineHighlight":"#22252e","SelectionBackground":"#1e2230","GutterBorder":"#22252e"}},"Typography":{"Family":{"Sans":"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif","Serif":"Georgia, Cambria, 'Times New Roman', Times, serif","Mono":"'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', 'Liberation Mono', 'Courier New', monospace"}},"Layout":{"SidebarWidth":"260px","TopbarHeight":"56px","StatusbarHeight":"28px"}},"Brand":{"Name":"Ultravisor","Tagline":"Process supervision and workflow automation"}};},{}],82:[function(require,module,exports){module.exports={"Hash":"ultravisor-professional-light","Name":"Ultravisor — Professional Light","Version":"0.0.1","Description":"Bright modern palette — slate text on near-white backgrounds, royal-blue brand. Single-mode light.","Comprehensive":true,"Modes":{"Strategy":"single","Default":"light"},"Tokens":{"Color":{"Background":{"Primary":"#f5f6f8","Secondary":"#ffffff","Tertiary":"#e4e7ec","Panel":"#ffffff","Hover":"#f0f1f4","Selected":"#e4e7ec"},"Text":{"Primary":"#2d3748","Secondary":"#1a202c","Muted":"#6b7280","Placeholder":"#9ca3af","OnBrand":"#ffffff"},"Brand":{"Primary":"#3b82f6","PrimaryHover":"#2563eb","Accent":"#3b82f6","AccentHover":"#2563eb"},"Border":{"Default":"#e2e5ea","Light":"#eceef2","Strong":"#c8cdd5"},"Status":{"Success":"#10b981","Warning":"#f59e0b","Error":"#ef4444","Info":"#3b82f6"},"Scrollbar":{"Track":"#f0f1f4","Thumb":"#d1d5db","Hover":"#b0b5bd"},"Selection":{"Background":"#dbeafe","Text":"#1a202c"},"Focus":{"Outline":"#3b82f6"},"Shadow":{"Color":"rgba(0, 0, 0, 0.06)"},"Syntax":{"Keyword":"#A0532E","String":"#3F8A52","Number":"#A86B00","Comment":"#8A7F72","Operator":"#2E7D74","Punctuation":"#5E5549","Function":"#2E5E96","Variable":"#3D3229","Type":"#A86B00","Builtin":"#A86B00","Property":"#A0532E","Tag":"#A0532E","AttrName":"#A86B00","AttrValue":"#3F8A52"},"Editor":{"LineNumberBackground":"#f5f6f8","LineNumberText":"#9ca3af","CurrentLineHighlight":"#f0f1f4","SelectionBackground":"#dbeafe","GutterBorder":"#e2e5ea"}},"Typography":{"Family":{"Sans":"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif","Serif":"Georgia, Cambria, 'Times New Roman', Times, serif","Mono":"'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', 'Liberation Mono', 'Courier New', monospace"}},"Layout":{"SidebarWidth":"260px","TopbarHeight":"56px","StatusbarHeight":"28px"}},"Brand":{"Name":"Ultravisor","Tagline":"Process supervision and workflow automation"}};},{}],83:[function(require,module,exports){/**
 * Theme-BottomBar — standard application footer row.
 *
 * The bottom-row counterpart to Theme-TopBar: a thin status / chrome bar
 * that sits at the absolute bottom of the application shell. Three
 * zones — status text on the left, info indicators in the middle, and
 * action buttons / toggles on the right.
 *
 *   ┌────────────────────────────────────────────────────────────────┐
 *   │ Status text          [── Info slot (flex) ──]      [actions]   │
 *   └────────────────────────────────────────────────────────────────┘
 *
 * Renders into `#Theme-BottomBar` by default.
 *
 * Three slots host views drop content into:
 *   - `#Theme-BottomBar-Status`  — short status / state line (left)
 *   - `#Theme-BottomBar-Info`    — center info: connection, version,
 *                                  ambient indicators
 *   - `#Theme-BottomBar-Actions` — log toggle, debug controls, etc.
 *
 * Top border uses `--brand-color-secondary-mode` so the bottombar gets
 * a brand-tinted edge that's visually distinct from the topbar's
 * primary-color stripe.
 */const libPictView=require('pict-view');const _ViewConfiguration={ViewIdentifier:'Theme-BottomBar',AutoInitialize:true,AutoRender:false,DefaultDestinationAddress:'#Theme-BottomBar',DefaultRenderable:'Theme-BottomBar-Renderable',// ViewIdentifier of a host view that fills #Theme-BottomBar-Status.
StatusView:null,// ViewIdentifier of a host view that fills #Theme-BottomBar-Info.
InfoView:null,// ViewIdentifier of a host view that fills #Theme-BottomBar-Actions.
ActionsView:null,// Height of the bar in pixels. Drives the min-height on the chrome
// row so it fills the panel cleanly even when the parent chain
// (pict-section-modal shell uses min-height: 100% on its panel
// content destination, which doesn't resolve through plain
// height: 100% chains) doesn't establish a determinate height.
// Hosts should match this to whatever Size they use on the panel
// addPanel() call so the chrome and panel agree on the row size.
Height:32,Templates:[{Hash:'Theme-BottomBar-Template',Template:/*html*/`
<div class="pict-theme-bottombar">
	<div class="pict-theme-bottombar-status" id="Theme-BottomBar-Status"></div>
	<div class="pict-theme-bottombar-info" id="Theme-BottomBar-Info"></div>
	<div class="pict-theme-bottombar-actions" id="Theme-BottomBar-Actions"></div>
</div>`}],Renderables:[{RenderableHash:'Theme-BottomBar-Renderable',TemplateHash:'Theme-BottomBar-Template',ContentDestinationAddress:'#Theme-BottomBar',RenderMethod:'replace'}],CSS:/*css*/`
.pict-theme-bottombar {
	display: flex;
	align-items: center;
	gap: 14px;
	/* The min-height is rewritten per-instance in onAfterRender from the
	   Height option (default 32). A fixed px value avoids the
	   percent-height resolution trap the pict-section-modal shell sets
	   up — see the comment on Theme-TopBar's CSS for the full story. */
	min-height: 32px;
	padding: 0 14px;
	box-sizing: border-box;
	background: var(--theme-color-background-secondary, transparent);
	font-size: var(--theme-typography-size-xs, 12px);
	color: var(--theme-color-text-secondary, #4a5568);
	/* Single medium brand-primary stripe at the top of the bottombar.
	   The topbar carries the full two-stripe identifier; on the
	   bottombar (which is only 32px tall) a single 2px primary line is
	   enough to seat the brand colour at the bottom of the page
	   without competing for visual weight against the content row. */
	border-top: 2px solid var(--brand-color-primary-mode, var(--theme-color-brand-primary, #2563eb));
}
.pict-theme-bottombar-status {
	flex: 0 0 auto;
	display: flex;
	align-items: center;
	gap: 6px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	max-width: 50%;
}
.pict-theme-bottombar-info {
	flex: 1 1 auto;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 12px;
	min-width: 0;
	overflow: hidden;
}
.pict-theme-bottombar-actions {
	flex: 0 0 auto;
	display: flex;
	align-items: center;
	gap: 6px;
}`,CSSPriority:500};class PictViewThemeBottomBar extends libPictView{constructor(pFable,pOptions,pServiceHash){super(pFable,pOptions,pServiceHash);}onAfterRender(pRenderable,pAddress,pRecord,pContent){this.pict.CSSMap.injectCSS();// Apply the configured Height to the rendered .pict-theme-bottombar
// — see the matching block in Theme-TopBar's onAfterRender for why.
if(typeof document!=='undefined'&&this.options.Height){let tmpRoot=document.querySelector('.pict-theme-bottombar');if(tmpRoot){tmpRoot.style.minHeight=this.options.Height+'px';}}let tmpRenderSlot=pIdentifier=>{if(!pIdentifier)return;let tmpView=this.pict.views[pIdentifier];if(tmpView){tmpView.render();}else if(this.log&&this.log.warn){this.log.warn('Theme-BottomBar: slot view "'+pIdentifier+'" not registered');}};tmpRenderSlot(this.options.StatusView);tmpRenderSlot(this.options.InfoView);tmpRenderSlot(this.options.ActionsView);return super.onAfterRender?super.onAfterRender(pRenderable,pAddress,pRecord,pContent):undefined;}// ─── Per-route slot swapping ──────────────────────────────────────────
// Mirrors Theme-TopBar's setNavView / setUserView — call from a
// router callback to swap the bottom bar's slot content as the
// route changes (different status formats per page, etc.).
setStatusView(pViewIdentifier){this._setSlotView('StatusView','#Theme-BottomBar-Status',pViewIdentifier);}setInfoView(pViewIdentifier){this._setSlotView('InfoView','#Theme-BottomBar-Info',pViewIdentifier);}setActionsView(pViewIdentifier){this._setSlotView('ActionsView','#Theme-BottomBar-Actions',pViewIdentifier);}_setSlotView(pOptionKey,pDestSelector,pViewIdentifier){this.options[pOptionKey]=pViewIdentifier||null;if(typeof document!=='undefined'){let tmpDest=document.querySelector(pDestSelector);if(tmpDest){tmpDest.innerHTML='';}}if(!pViewIdentifier){return;}let tmpView=this.pict.views[pViewIdentifier];if(tmpView){tmpView.render();}else if(this.log&&this.log.warn){this.log.warn('Theme-BottomBar: view "'+pViewIdentifier+'" not registered');}}}module.exports=PictViewThemeBottomBar;module.exports.default_configuration=_ViewConfiguration;},{"pict-view":94}],84:[function(require,module,exports){/**
 * Theme-Brand-Mark — single-row inline brand mark (icon + name).
 *
 * The drop-in counterpart to Theme-BrandStrip for apps that put the
 * brand wordmark *inside* their topbar (next to action buttons) rather
 * than as a multi-row chrome below the nav.
 *
 * Layout:
 *
 *   ┌─────────────────────────┐
 *   │ [icon]  App Name        │
 *   └─────────────────────────┘
 *
 * Colors come from the brand's primary/secondary; the icon (when SVG
 * with `stroke="currentColor"`) inherits `--brand-color-primary-mode`,
 * which auto-swaps between PrimaryLight (default mode) and PrimaryDark
 * (`.theme-dark`).
 *
 * Reads from libThemeBrand and re-renders on `onChange`. Renders an
 * empty span when no brand is registered.
 *
 * Drop-in destination: `<div id="Theme-Brand-Mark"></div>`.
 */const libPictView=require('pict-view');const libThemeBrand=require('../Theme-Brand.js');const _ViewConfiguration={ViewIdentifier:'Theme-Brand-Mark',AutoInitialize:true,AutoRender:false,DefaultDestinationAddress:'#Theme-Brand-Mark',DefaultRenderable:'Theme-Brand-Mark-Renderable',// Optional: when false the icon is omitted (text-only wordmark).
ShowIcon:true,// Optional: when false the name is omitted (icon-only mark).
ShowName:true,Templates:[{Hash:'Theme-Brand-Mark-Template',Template:/*html*/`{~TS:Theme-Brand-Mark-Body-Template:AppData.PictSectionTheme.BrandMark.BodySlot~}`},{Hash:'Theme-Brand-Mark-Body-Template',Template:/*html*/`
<span class="pict-theme-brand-mark" title="{~D:Record.Tooltip~}">
	{~TS:Theme-Brand-Mark-IconSVG-Template:Record.IconSVGSlot~}
	{~TS:Theme-Brand-Mark-IconImg-Template:Record.IconImgSlot~}
	{~TS:Theme-Brand-Mark-Name-Template:Record.NameSlot~}
</span>`},{// Inline SVG: trusted markup; let it ride. SVG icons that
// reference `currentColor` inherit `--brand-color-primary-mode`.
Hash:'Theme-Brand-Mark-IconSVG-Template',Template:/*html*/`<span class="pict-theme-brand-mark-icon">{~D:Record.IconHTML~}</span>`},{Hash:'Theme-Brand-Mark-IconImg-Template',Template:/*html*/`<span class="pict-theme-brand-mark-icon"><img src="{~D:Record.IconURL~}" alt=""></span>`},{Hash:'Theme-Brand-Mark-Name-Template',Template:/*html*/`<span class="pict-theme-brand-mark-name">{~D:Record.Name~}</span>`}],Renderables:[{RenderableHash:'Theme-Brand-Mark-Renderable',TemplateHash:'Theme-Brand-Mark-Template',ContentDestinationAddress:'#Theme-Brand-Mark',RenderMethod:'replace'}],CSS:/*css*/`
.pict-theme-brand-mark {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	/* line-height: 1 collapses the inherited ~1.2 line-box around the
	   name glyphs. Without this the inline-flex container is taller
	   than its visible content, the line-box adds asymmetric space
	   above the caps, and the whole mark looks pushed up vs.
	   neighbouring buttons that sit on standard 12px-text baselines. */
	line-height: 1;
	color: var(--brand-color-primary-mode, var(--theme-color-text-primary, #1a1a1a));
	user-select: none;
}
.pict-theme-brand-mark-icon {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 22px;
	height: 22px;
	color: currentColor;
}
.pict-theme-brand-mark-icon img,
.pict-theme-brand-mark-icon svg {
	width: 100%;
	height: 100%;
	display: block;
}
.pict-theme-brand-mark-name {
	/* Font size dropped from 15 → 14 so the brand name reads closer
	   to the typical 12px action-button text height; bigger glyphs
	   reaching higher into the row are why the mark looked optically
	   high. The 2px brand-secondary underline keeps the mark feeling
	   distinctly branded; padding-bottom: 1px was an asymmetric nudge
	   that shifted the visual center up — removed. */
	font-size: 14px;
	font-weight: 600;
	letter-spacing: 0.4px;
	border-bottom: 2px solid var(--brand-color-secondary-mode, transparent);
	white-space: nowrap;
}
/* Compact form — at narrow viewports the brand mark collapses to
   icon-only. The icon alone still reads as the brand (the deterministic
   logo is designed to be recognisable without the wordmark) and freeing
   up the wordmark's width keeps the nav buttons reachable on tablet /
   small-laptop widths. The threshold matches the topbar's compact
   breakpoint in Theme-TopBar. */
@media (max-width: 720px) {
	.pict-theme-brand-mark-name {
		display: none;
	}
}`,CSSPriority:500};class PictViewThemeBrandMark extends libPictView{constructor(pFable,pOptions,pServiceHash){super(pFable,pOptions,pServiceHash);this._unsubscribeFromBrand=null;}onAfterInitialize(){this._subscribeToBrand();return super.onAfterInitialize?super.onAfterInitialize():undefined;}onBeforeRender(pRenderable){this._refreshAppData();return super.onBeforeRender?super.onBeforeRender(pRenderable):undefined;}onAfterRender(pRenderable,pAddress,pRecord,pContent){this.pict.CSSMap.injectCSS();return super.onAfterRender?super.onAfterRender(pRenderable,pAddress,pRecord,pContent):undefined;}_subscribeToBrand(){if(this._unsubscribeFromBrand)return;let tmpSelf=this;this._unsubscribeFromBrand=libThemeBrand.onChange(function(){tmpSelf.render();});}_refreshAppData(){let tmpBrand=libThemeBrand.getActive();this.pict.AppData.PictSectionTheme=this.pict.AppData.PictSectionTheme||{};if(!tmpBrand){this.pict.AppData.PictSectionTheme.BrandMark={BodySlot:[]};return;}// Single-element array slot drives the {~TS:~} render. Empty
// slots for icon-img/icon-svg/name suppress those sub-templates.
let tmpShowIcon=this.options.ShowIcon!==false;let tmpShowName=this.options.ShowName!==false;let tmpIconSVGSlot=tmpShowIcon&&tmpBrand.IconType==='svg'&&tmpBrand.Icon?[{IconHTML:tmpBrand.Icon}]:[];let tmpIconImgSlot=tmpShowIcon&&tmpBrand.IconType==='image'&&tmpBrand.Icon?[{IconURL:tmpBrand.Icon}]:[];let tmpNameSlot=tmpShowName&&tmpBrand.Name?[{Name:tmpBrand.Name}]:[];this.pict.AppData.PictSectionTheme.BrandMark={BodySlot:[{Tooltip:tmpBrand.Tagline||tmpBrand.Name||'',IconSVGSlot:tmpIconSVGSlot,IconImgSlot:tmpIconImgSlot,NameSlot:tmpNameSlot}]};}}module.exports=PictViewThemeBrandMark;module.exports.default_configuration=_ViewConfiguration;},{"../Theme-Brand.js":34,"pict-view":94}],85:[function(require,module,exports){/**
 * Theme-BrandStrip — the subtle two-line brand signature that sits
 * under the application's navigation.
 *
 * Layout:
 *
 *   ┌─────────────────────────────────────────────────────────────┐
 *   │ [icon]  App Name                                            │
 *   │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │  ← primary stripe (3× tall)
 *   │ ─────────────────────────────────────────────────────────── │  ← secondary stripe (1× tall)
 *   └─────────────────────────────────────────────────────────────┘
 *
 * The icon + name row is colored using the brand's primary color (and
 * the secondary as an underline accent on the name). Clicking the row
 * does nothing by default — hosts that want it to navigate or open a
 * dropdown can pass an `OnClickName` hook in the view options.
 *
 * Reads the active brand from libThemeBrand. Subscribes to
 * libThemeBrand.onChange so swapping the brand at runtime updates the
 * strip immediately. Renders nothing (an empty span) when no brand is
 * registered.
 *
 * Drop-in destination: `<div id="Theme-BrandStrip"></div>`.
 */const libPictView=require('pict-view');const libThemeBrand=require('../Theme-Brand.js');const _ViewConfiguration={ViewIdentifier:'Theme-BrandStrip',AutoInitialize:true,AutoRender:false,DefaultDestinationAddress:'#Theme-BrandStrip',DefaultRenderable:'Theme-BrandStrip-Renderable',// Stripe heights in pixels. Primary is conventionally 3× secondary,
// per the design brief, but exposed here so hosts can tune.
PrimaryStripeHeight:3,SecondaryStripeHeight:1,// When false, the icon + name row is omitted and only the two
// stripes render. Useful for very tight chrome where the brand
// name is already in the topbar.
ShowName:true,Templates:[{Hash:'Theme-BrandStrip-Template',Template:/*html*/`
{~TS:Theme-BrandStrip-Body-Template:AppData.PictSectionTheme.BrandStrip.BodySlot~}`},{Hash:'Theme-BrandStrip-Body-Template',Template:/*html*/`
<div class="pict-theme-brandstrip" title="{~D:Record.Tooltip~}">
	{~TS:Theme-BrandStrip-NameRow-Template:Record.NameRowSlot~}
	<div class="pict-theme-brandstrip-stripes">
		<div class="pict-theme-brandstrip-stripe pict-theme-brandstrip-stripe-primary"
		     style="height: {~D:Record.PrimaryHeight~}px;"></div>
		<div class="pict-theme-brandstrip-stripe pict-theme-brandstrip-stripe-secondary"
		     style="height: {~D:Record.SecondaryHeight~}px;"></div>
	</div>
</div>`},{Hash:'Theme-BrandStrip-NameRow-Template',Template:/*html*/`
<div class="pict-theme-brandstrip-row">
	{~TS:Theme-BrandStrip-IconSVG-Template:Record.IconSVGSlot~}
	{~TS:Theme-BrandStrip-IconImg-Template:Record.IconImgSlot~}
	<span class="pict-theme-brandstrip-name">{~D:Record.Name~}</span>
</div>`},{// SVG icon: leading <svg> markup is trusted (host-supplied,
// not user-supplied) so we let it through verbatim. Theme-Icons
// SVGs use stroke="currentColor" so they pick up the brand
// primary color from the row's `color: var(--brand-color-primary)`.
Hash:'Theme-BrandStrip-IconSVG-Template',Template:/*html*/`<span class="pict-theme-brandstrip-icon">{~D:Record.IconHTML~}</span>`},{// <img> icon: src can be a data URL or a regular URL.
Hash:'Theme-BrandStrip-IconImg-Template',Template:/*html*/`<span class="pict-theme-brandstrip-icon"><img src="{~D:Record.IconURL~}" alt=""></span>`}],Renderables:[{RenderableHash:'Theme-BrandStrip-Renderable',TemplateHash:'Theme-BrandStrip-Template',ContentDestinationAddress:'#Theme-BrandStrip',RenderMethod:'replace'}],CSS:/*css*/`
.pict-theme-brandstrip {
	display: flex;
	flex-direction: column;
	gap: 4px;
	user-select: none;
}
.pict-theme-brandstrip-row {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	padding: 6px 12px 4px;
	font-size: 12px;
	font-weight: 600;
	letter-spacing: 0.4px;
	text-transform: uppercase;
	color: var(--brand-color-primary, var(--theme-color-text-muted, #6b6b6b));
}
.pict-theme-brandstrip-name {
	border-bottom: 2px solid var(--brand-color-secondary, transparent);
	padding-bottom: 1px;
}
.pict-theme-brandstrip-icon {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 16px; height: 16px;
	color: var(--brand-color-primary, currentColor);
}
.pict-theme-brandstrip-icon img,
.pict-theme-brandstrip-icon svg {
	width: 100%; height: 100%;
	display: block;
}
.pict-theme-brandstrip-stripes {
	display: flex;
	flex-direction: column;
	width: 100%;
}
.pict-theme-brandstrip-stripe {
	width: 100%;
}
.pict-theme-brandstrip-stripe-primary {
	background: var(--brand-color-primary, transparent);
}
.pict-theme-brandstrip-stripe-secondary {
	background: var(--brand-color-secondary, transparent);
}`,CSSPriority:500};class PictViewThemeBrandStrip extends libPictView{constructor(pFable,pOptions,pServiceHash){super(pFable,pOptions,pServiceHash);this._unsubscribeFromBrand=null;}onAfterInitialize(){this._subscribeToBrand();return super.onAfterInitialize?super.onAfterInitialize():undefined;}onBeforeRender(pRenderable){this._refreshAppData();return super.onBeforeRender?super.onBeforeRender(pRenderable):undefined;}onAfterRender(pRenderable,pAddress,pRecord,pContent){this.pict.CSSMap.injectCSS();return super.onAfterRender?super.onAfterRender(pRenderable,pAddress,pRecord,pContent):undefined;}_subscribeToBrand(){if(this._unsubscribeFromBrand)return;let tmpSelf=this;this._unsubscribeFromBrand=libThemeBrand.onChange(function(){tmpSelf.render();});}_refreshAppData(){let tmpBrand=libThemeBrand.getActive();this.pict.AppData.PictSectionTheme=this.pict.AppData.PictSectionTheme||{};// No brand → empty BodySlot → renderable emits nothing.
if(!tmpBrand){this.pict.AppData.PictSectionTheme.BrandStrip={BodySlot:[]};return;}let tmpShowName=this.options.ShowName!==false;// Pick the right per-icon-type slot. Only one of these will be
// non-empty so the template renders the right element.
let tmpIconSVGSlot=[];let tmpIconImgSlot=[];if(tmpBrand.IconType==='svg'&&tmpBrand.Icon){tmpIconSVGSlot=[{IconHTML:tmpBrand.Icon}];}else if(tmpBrand.IconType==='image'&&tmpBrand.Icon){tmpIconImgSlot=[{IconURL:tmpBrand.Icon}];}let tmpNameRowSlot=tmpShowName?[{Name:tmpBrand.Name,IconSVGSlot:tmpIconSVGSlot,IconImgSlot:tmpIconImgSlot}]:[];let tmpTooltip=tmpBrand.Name+(tmpBrand.Tagline?' — '+tmpBrand.Tagline:'');this.pict.AppData.PictSectionTheme.BrandStrip={BodySlot:[{Tooltip:tmpTooltip,NameRowSlot:tmpNameRowSlot,PrimaryHeight:this.options.PrimaryStripeHeight||3,SecondaryHeight:this.options.SecondaryStripeHeight||1}]};}}PictViewThemeBrandStrip.default_configuration=_ViewConfiguration;module.exports=PictViewThemeBrandStrip;},{"../Theme-Brand.js":34,"pict-view":94}],86:[function(require,module,exports){/**
 * Theme-Button — an embeddable SVG button (sun/moon glyph) suitable for
 * application top bars. Clicking it opens a pict-section-modal popup
 * containing the Theme-Picker dropdown and the Theme-ModeToggle.
 *
 * Drop-in destination: `<div id="Theme-Button"></div>`. The button itself
 * is a tiny self-contained SVG that picks its color from the theme via
 * `currentColor` so it inherits the surrounding text color.
 *
 * Requires `pict-section-modal` to be registered (under the view hash
 * `Pict-Section-Modal` by default). If it isn't, clicking the button
 * falls back to a `console.warn` and a no-op.
 */const libPictView=require('pict-view');const libThemeIcons=require('../Theme-Icons.js');const _ViewConfiguration={ViewIdentifier:'Theme-Button',AutoInitialize:true,AutoRender:false,DefaultDestinationAddress:'#Theme-Button',DefaultRenderable:'Theme-Button-Renderable',ProviderHash:'Theme',ModalViewHash:'Pict-Section-Modal',// Identifiers of the picker / toggle / scale views that the popup
// will mount. Each one is optional — if a view isn't registered the
// matching row is silently skipped (no broken DOM placeholders).
PickerViewHash:'Theme-Picker',ModeToggleViewHash:'Theme-ModeToggle',ScaleSelectViewHash:'Theme-ScaleSelect',// Visible button label / title (tooltip).
Title:'Theme',AriaLabel:'Open theme menu',// Modal title.
ModalTitle:'Theme',// Modal width (CSS).
ModalWidth:'320px',Templates:[{Hash:'Theme-Button-Template',// SVG sourced from the shared Theme-Icons module so the
// topbar glyph matches the picker + mode toggle exactly.
Template:/*html*/`
<button type="button"
        class="pict-theme-button"
        aria-label="{~D:AppData.PictSectionTheme.Button.AriaLabel~}"
        title="{~D:AppData.PictSectionTheme.Button.Title~}"
        onclick="_Pict.views['Theme-Button'].openMenu();">
	${libThemeIcons.iconSun(16)}
</button>`},{Hash:'Theme-Button-Modal-Template',Template:/*html*/`
<div class="pict-theme-button-menu">
	<div class="pict-theme-button-menu-row">
		<label class="pict-theme-button-menu-label">Theme</label>
		<div id="Theme-Picker"></div>
	</div>
	<div class="pict-theme-button-menu-row">
		<label class="pict-theme-button-menu-label">Mode</label>
		<div id="Theme-ModeToggle"></div>
	</div>
	<div class="pict-theme-button-menu-row">
		<label class="pict-theme-button-menu-label">Scale</label>
		<div id="Theme-ScaleSelect"></div>
	</div>
</div>`}],Renderables:[{RenderableHash:'Theme-Button-Renderable',TemplateHash:'Theme-Button-Template',ContentDestinationAddress:'#Theme-Button',RenderMethod:'replace'}],CSS:/*css*/`
.pict-theme-button {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	/* Sized to match a typical 12px-font / 6px-12px-padding text button
	   (~28px tall) so this drops cleanly into a topbar row alongside
	   action buttons without standing taller and crashing the row's
	   visual rhythm. Squareish — width matches height for the icon. */
	width: 28px;
	height: 28px;
	padding: 0;
	border-radius: 6px;
	border: 1px solid var(--theme-color-border-default, #cfd5dd);
	background: var(--theme-color-background-secondary, #fbfbfc);
	color: var(--theme-color-text-secondary, #4a5568);
	cursor: pointer;
	transition: background-color 120ms ease, color 120ms ease, border-color 120ms ease;
}
.pict-theme-button:hover {
	background: var(--theme-color-background-hover, #f0f0f0);
	color: var(--theme-color-brand-primary, #2563eb);
	border-color: var(--theme-color-brand-primary, #2563eb);
}
.pict-theme-button-icon { width: 16px; height: 16px; }
.pict-theme-button-menu { display: flex; flex-direction: column; gap: 14px; }
.pict-theme-button-menu-row { display: flex; flex-direction: column; gap: 6px; }
.pict-theme-button-menu-label {
	font-size: 11px;
	font-weight: 600;
	letter-spacing: 0.4px;
	text-transform: uppercase;
	color: var(--theme-color-text-muted, #6b6b6b);
}`,CSSPriority:500};class PictViewThemeButton extends libPictView{onBeforeRender(pRenderable){this._refreshAppData();return super.onBeforeRender?super.onBeforeRender(pRenderable):undefined;}onAfterRender(pRenderable,pAddress,pRecord,pContent){this.pict.CSSMap.injectCSS();return super.onAfterRender?super.onAfterRender(pRenderable,pAddress,pRecord,pContent):undefined;}/**
	 * onclick handler — open the theme menu in a modal.
	 */openMenu(){let tmpModal=this._modal();if(!tmpModal){if(typeof console!=='undefined'){console.warn('Theme-Button: pict-section-modal view not found at "'+(this.options.ModalViewHash||'Pict-Section-Modal')+'" — cannot open theme menu.');}return null;}let tmpHTML=this.pict.parseTemplateByHash('Theme-Button-Modal-Template',{});let tmpSelf=this;return tmpModal.show({title:this.options.ModalTitle||'Theme',content:tmpHTML,width:this.options.ModalWidth||'320px',closeable:true,buttons:[],onOpen:function(){// Mount the picker + toggle into the freshly-created
// modal DOM. The views look up their own destinations
// so a simple render() is enough.
tmpSelf._mountSubViews();}});}// ================================================================
// Internals
// ================================================================
_modal(){let tmpHash=this.options.ModalViewHash||'Pict-Section-Modal';return this.pict&&this.pict.views&&this.pict.views[tmpHash];}_mountSubViews(){let tmpPicker=this.pict.views[this.options.PickerViewHash||'Theme-Picker'];if(tmpPicker){tmpPicker.render();}let tmpToggle=this.pict.views[this.options.ModeToggleViewHash||'Theme-ModeToggle'];if(tmpToggle){tmpToggle.render();}let tmpScale=this.pict.views[this.options.ScaleSelectViewHash||'Theme-ScaleSelect'];if(tmpScale){tmpScale.render();}}_refreshAppData(){this.pict.AppData.PictSectionTheme=this.pict.AppData.PictSectionTheme||{};this.pict.AppData.PictSectionTheme.Button={Title:this.options.Title||'Theme',AriaLabel:this.options.AriaLabel||'Open theme menu'};}}PictViewThemeButton.default_configuration=_ViewConfiguration;module.exports=PictViewThemeButton;},{"../Theme-Icons.js":35,"pict-view":94}],87:[function(require,module,exports){/**
 * Theme-ModeToggle — three-segment toggle for Light / Dark / System mode.
 *
 * Calls `provider.setMode(...)` on click. Greys itself out (and the
 * Dark / System buttons) when the active theme is single-mode (since
 * single-mode themes ignore mode requests internally).
 *
 * Like the Picker, subscribes to `provider.onApply` so the active button
 * highlight stays in sync with theme changes from elsewhere.
 *
 * Drop-in destination: `<div id="Theme-ModeToggle"></div>`.
 */const libPictView=require('pict-view');const libThemeIcons=require('../Theme-Icons.js');const _ViewConfiguration={ViewIdentifier:'Theme-ModeToggle',AutoInitialize:true,AutoRender:false,DefaultDestinationAddress:'#Theme-ModeToggle',DefaultRenderable:'Theme-ModeToggle-Renderable',ProviderHash:'Theme',// Allow hosts to relabel buttons (i18n). Order is fixed.
Labels:{Light:'Light',Dark:'Dark',System:'System'},// Show the inline sun / moon / monitor SVG icons next to the labels.
ShowIcons:true,Templates:[{Hash:'Theme-ModeToggle-Template',Template:/*html*/`
<div class="pict-theme-modetoggle-wrap">
	<div class="pict-theme-modetoggle{~NE:AppData.PictSectionTheme.ModeToggle.Disabled^ pict-theme-modetoggle-disabled~}"
	     role="group" aria-label="Color mode"
	     title="{~D:AppData.PictSectionTheme.ModeToggle.WrapTitle~}">
		{~TS:Theme-ModeToggle-Button-Template:AppData.PictSectionTheme.ModeToggle.Buttons~}
	</div>
	{~TS:Theme-ModeToggle-LockedNote-Template:AppData.PictSectionTheme.ModeToggle.LockedNoteSlot~}
</div>`},{Hash:'Theme-ModeToggle-Button-Template',Template:/*html*/`
<button type="button"
        class="pict-theme-modetoggle-btn{~NE:Record.Active^ pict-theme-modetoggle-btn-active~}{~NE:Record.LockedOut^ pict-theme-modetoggle-btn-lockedout~}"
        title="{~D:Record.Title~}"
        aria-pressed="{~D:Record.Active~}"
        aria-disabled="{~D:Record.LockedOut~}"
        onclick="_Pict.views['Theme-ModeToggle'].pickMode('{~D:Record.Mode~}');">
	{~TS:Theme-ModeToggle-Icon-Light:Record.IconLight~}{~TS:Theme-ModeToggle-Icon-Dark:Record.IconDark~}{~TS:Theme-ModeToggle-Icon-System:Record.IconSystem~}<span class="pict-theme-modetoggle-label">{~D:Record.Label~}</span>
</button>`},{Hash:'Theme-ModeToggle-LockedNote-Template',Template:/*html*/`
<div class="pict-theme-modetoggle-locked-note" role="note">
	<svg class="pict-theme-modetoggle-locked-icon" viewBox="0 0 24 24" fill="none"
	     stroke="currentColor" stroke-width="2" stroke-linecap="round"
	     stroke-linejoin="round" aria-hidden="true">
		<rect x="4" y="11" width="16" height="9" rx="2"/>
		<path d="M8 11V7a4 4 0 0 1 8 0v4"/>
	</svg>
	<span>{~D:Record.Message~}</span>
</div>`},// Icon templates pull SVG markup from the shared Theme-Icons
// module so the picker, toggle, and topbar button stay visually
// consistent — change the glyph in one place, every consumer
// updates.
{Hash:'Theme-ModeToggle-Icon-Light',Template:libThemeIcons.iconSun()},{Hash:'Theme-ModeToggle-Icon-Dark',Template:libThemeIcons.iconMoon()},{Hash:'Theme-ModeToggle-Icon-System',Template:libThemeIcons.iconSystem()}],Renderables:[{RenderableHash:'Theme-ModeToggle-Renderable',TemplateHash:'Theme-ModeToggle-Template',ContentDestinationAddress:'#Theme-ModeToggle',RenderMethod:'replace'}],CSS:/*css*/`
.pict-theme-modetoggle-wrap { display: inline-flex; flex-direction: column; gap: 6px; }
.pict-theme-modetoggle {
	display: inline-flex;
	border: 1px solid var(--theme-color-border-default, #cfd5dd);
	border-radius: 6px;
	overflow: hidden;
	background: var(--theme-color-background-secondary, #fbfbfc);
	font-size: 12px;
}
.pict-theme-modetoggle-btn {
	display: inline-flex;
	align-items: center;
	gap: 4px;
	padding: 4px 10px;
	border: 0;
	background: transparent;
	color: var(--theme-color-text-secondary, #4a5568);
	cursor: pointer;
	border-right: 1px solid var(--theme-color-border-default, #cfd5dd);
	transition: background-color 120ms ease, color 120ms ease;
}
.pict-theme-modetoggle-btn:last-child { border-right: 0; }
.pict-theme-modetoggle-btn:hover {
	background: var(--theme-color-background-hover, #f0f0f0);
	color: var(--theme-color-text-primary, #1f2933);
}
.pict-theme-modetoggle-btn-active {
	background: var(--theme-color-brand-primary, #2563eb);
	color: var(--theme-color-text-on-brand, #ffffff);
}
.pict-theme-modetoggle-btn-active:hover {
	background: var(--theme-color-brand-primary-hover, #1e54cc);
	color: var(--theme-color-text-on-brand, #ffffff);
}
/* When the active theme is single-mode the entire group becomes
   non-interactive. The locked-out buttons (the ones the theme cannot
   switch to) get a strikethrough so the cause is unmistakable; the
   active button stays styled normally so users can still see which
   mode the theme IS using. */
.pict-theme-modetoggle-disabled .pict-theme-modetoggle-btn {
	pointer-events: none;
	cursor: not-allowed;
}
.pict-theme-modetoggle-disabled .pict-theme-modetoggle-btn-lockedout {
	opacity: 0.45;
	text-decoration: line-through;
	text-decoration-thickness: 1.5px;
}
/* Icons come from Theme-Icons.js with explicit width/height baked into
   the <svg>. We only need to nudge their vertical alignment with the
   button label. */
.pict-theme-modetoggle .pict-theme-icon {
	display: inline-block; vertical-align: -2px;
}
.pict-theme-modetoggle-label { line-height: 1; }
.pict-theme-modetoggle-locked-note {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	font-size: 11px;
	line-height: 1.3;
	color: var(--theme-color-text-muted, #6b6b6b);
	padding: 0 2px;
}
.pict-theme-modetoggle-locked-icon {
	width: 12px; height: 12px;
	flex: 0 0 12px;
	color: var(--theme-color-text-muted, #6b6b6b);
}`,CSSPriority:500};// The icon SVGs themselves live as templates above (Theme-ModeToggle-Icon-*).
// Per CLAUDE.md "AppData stores data, not HTML" — we drive icon selection
// with one-or-zero element arrays (`Record.IconLight = [{}]` to render the
// Light icon, `[]` to skip it). Each template is keyed off `Record.Mode`.
class PictViewThemeModeToggle extends libPictView{constructor(pFable,pOptions,pServiceHash){super(pFable,pOptions,pServiceHash);this._unsubscribeFromProvider=null;}onAfterInitialize(){this._subscribeToProvider();return super.onAfterInitialize?super.onAfterInitialize():undefined;}onBeforeRender(pRenderable){this._refreshAppData();return super.onBeforeRender?super.onBeforeRender(pRenderable):undefined;}onAfterRender(pRenderable,pAddress,pRecord,pContent){this.pict.CSSMap.injectCSS();return super.onAfterRender?super.onAfterRender(pRenderable,pAddress,pRecord,pContent):undefined;}/**
	 * onclick handler — flip mode on the active theme. Single-mode themes
	 * silently ignore (the toggle is shown disabled in that case anyway).
	 */pickMode(pMode){let tmpProvider=this._provider();if(!tmpProvider)return false;let tmpOk=tmpProvider.setMode(pMode);if(tmpOk&&typeof this.options.OnModeChange==='function'){try{this.options.OnModeChange(pMode);}catch(pErr){/* host hook failure */}}// setMode fires onApply listeners which trigger our own re-render.
// If single-mode rejected the change, force a re-render so the UI
// state is still consistent.
if(!tmpOk){this.render();}return tmpOk;}// ================================================================
// Internals
// ================================================================
_subscribeToProvider(){if(this._unsubscribeFromProvider)return;let tmpProvider=this._provider();if(!tmpProvider||typeof tmpProvider.onApply!=='function')return;let tmpSelf=this;this._unsubscribeFromProvider=tmpProvider.onApply(function(){tmpSelf.render();});}_provider(){let tmpHash=this.options.ProviderHash||'Theme';return this.pict&&this.pict.providers&&this.pict.providers[tmpHash];}_refreshAppData(){let tmpProvider=this._provider();let tmpActive=tmpProvider?tmpProvider.getActiveTheme():null;let tmpActiveMode=tmpActive&&tmpActive.Mode||'light';// Detect single-mode (Strategy === 'single') so we can lock the
// toggle and surface the reason the buttons aren't responding.
let tmpDisabled=false;let tmpLockedToMode=null;let tmpThemeName=null;if(tmpActive&&tmpActive.Hash&&tmpProvider&&typeof tmpProvider.getTheme==='function'){let tmpBundle=tmpProvider.getTheme(tmpActive.Hash);let tmpStrategy=tmpBundle&&tmpBundle.Modes&&tmpBundle.Modes.Strategy||'single';tmpDisabled=tmpStrategy==='single';if(tmpDisabled){tmpLockedToMode=tmpBundle.Modes&&tmpBundle.Modes.Default||tmpActiveMode||'light';tmpThemeName=tmpBundle.Name||tmpBundle.Hash||'this theme';}}let tmpLabels=this.options.Labels||_ViewConfiguration.Labels;let tmpShowIcons=this.options.ShowIcons!==false;// Use one-or-zero element arrays to drive each icon template so
// the icon SVG never gets stuffed into AppData as a raw string.
let tmpModeRows=[{Mode:'light',Label:tmpLabels.Light||'Light'},{Mode:'dark',Label:tmpLabels.Dark||'Dark'},{Mode:'system',Label:tmpLabels.System||'System'}];let tmpButtons=[];for(let i=0;i<tmpModeRows.length;i++){let tmpRow=tmpModeRows[i];let tmpIsActive=tmpActiveMode===tmpRow.Mode;// "Locked out" = single-mode theme AND this button is not the
// mode the theme is fixed to. The active button keeps normal
// styling so users can still see which mode is in use.
let tmpLockedOut=tmpDisabled&&tmpRow.Mode!==tmpLockedToMode;let tmpTitle;if(tmpLockedOut){let tmpLockedLabel=tmpLockedToMode.charAt(0).toUpperCase()+tmpLockedToMode.slice(1);tmpTitle=tmpThemeName+' is fixed to '+tmpLockedLabel+' mode — pick a different theme to switch.';}else{tmpTitle=tmpRow.Label+' mode';}tmpButtons.push({Mode:tmpRow.Mode,Label:tmpRow.Label,Title:tmpTitle,Active:tmpIsActive,LockedOut:tmpLockedOut,IconLight:tmpShowIcons&&tmpRow.Mode==='light'?[{}]:[],IconDark:tmpShowIcons&&tmpRow.Mode==='dark'?[{}]:[],IconSystem:tmpShowIcons&&tmpRow.Mode==='system'?[{}]:[]});}// One-or-zero element array drives the locked-note template
// (per CLAUDE.md "single-element-array trick"). Empty array →
// note skipped entirely.
let tmpLockedNoteSlot=[];let tmpWrapTitle='';if(tmpDisabled){let tmpLockedLabel=tmpLockedToMode.charAt(0).toUpperCase()+tmpLockedToMode.slice(1);let tmpMessage=tmpThemeName+' is fixed to '+tmpLockedLabel+' mode';tmpLockedNoteSlot=[{Message:tmpMessage}];tmpWrapTitle=tmpMessage+' — pick a different theme to switch modes.';}this.pict.AppData.PictSectionTheme=this.pict.AppData.PictSectionTheme||{};this.pict.AppData.PictSectionTheme.ModeToggle={ActiveMode:tmpActiveMode,Disabled:tmpDisabled,LockedToMode:tmpLockedToMode,ThemeName:tmpThemeName,Buttons:tmpButtons,LockedNoteSlot:tmpLockedNoteSlot,WrapTitle:tmpWrapTitle};}}PictViewThemeModeToggle.default_configuration=_ViewConfiguration;module.exports=PictViewThemeModeToggle;},{"../Theme-Icons.js":35,"pict-view":94}],88:[function(require,module,exports){/**
 * Theme-Picker — a custom dropdown that lists every theme registered
 * with the Theme provider, grouped by category.
 *
 * Renders as a trigger button showing the active theme name + a chevron.
 * Click → opens a `pict-section-modal` dropdown menu where each row is
 * the theme name plus an inline SVG glyph indicating the modes the
 * theme supports (sun for light-only, moon for dark-only, sun+moon for
 * paired). This is why we ditched the native <select>: option elements
 * can't render SVG, only plain text, and the unicode crescent
 * substitutes that earlier looked like dental glyphs.
 *
 * Subscribes to `provider.onApply` so a theme switch from elsewhere
 * (the modal-tucked picker, a hotkey, persistence restore) keeps the
 * trigger button in sync.
 *
 * Drop-in destination: `<div id="Theme-Picker"></div>`.
 *
 * # Modal section dependency
 *
 * Requires pict-section-modal to be registered (the dropdown popover
 * is a modal-section feature, not a hand-rolled DOM widget). When
 * pict-section-theme.install() is used, the host always has the modal
 * section available because Theme-Button needs it too. If you add this
 * view manually without the modal section, the trigger button will
 * still render but clicking it logs a warning and no-ops.
 */const libPictView=require('pict-view');const libThemeIcons=require('../Theme-Icons.js');// AppData address used to surface picker state to templates.
const APPDATA_ADDRESS='PictSectionTheme.Picker';const _ViewConfiguration={ViewIdentifier:'Theme-Picker',AutoInitialize:true,AutoRender:false,DefaultDestinationAddress:'#Theme-Picker',DefaultRenderable:'Theme-Picker-Renderable',ProviderHash:'Theme',ModalViewHash:'Pict-Section-Modal',// Optional categories block — array describing the optgroup order.
// If omitted we discover categories from the provider's themes in
// first-seen order.
Categories:null,// Show the per-row mode-capability glyph (sun / moon / sun+moon) as
// the leading icon on each dropdown item. Default on. Pass false if
// you want a plainer menu.
ShowModeIcons:true,Templates:[{Hash:'Theme-Picker-Template',// Trigger button that mirrors a native <select>'s look but
// can carry SVG content. Clicking opens the modal dropdown.
Template:/*html*/`
<button type="button" class="pict-theme-picker"
        title="{~D:AppData.PictSectionTheme.Picker.TriggerTooltip~}"
        onclick="_Pict.views['Theme-Picker'].openMenu(this);">
	{~TS:Theme-Picker-Trigger-Glyph:AppData.PictSectionTheme.Picker.TriggerGlyphSlot~}
	<span class="pict-theme-picker-name">{~D:AppData.PictSectionTheme.Picker.ActiveLabel~}</span>
	<span class="pict-theme-picker-chevron">{~D:AppData.PictSectionTheme.Picker.ChevronHTML~}</span>
</button>`},{// Wrapped in a 1-or-0 element array so the trigger glyph is
// optional (ShowModeIcons: false → empty slot, no leading
// icon). Per CLAUDE.md "AppData stores data, not HTML".
Hash:'Theme-Picker-Trigger-Glyph',Template:/*html*/`<span class="pict-theme-picker-trigger-glyph">{~D:Record.IconHTML~}</span>`}],Renderables:[{RenderableHash:'Theme-Picker-Renderable',TemplateHash:'Theme-Picker-Template',ContentDestinationAddress:'#Theme-Picker',RenderMethod:'replace'}],CSS:/*css*/`
.pict-theme-picker {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	min-width: 200px;
	max-width: 100%;
	padding: 6px 10px;
	border-radius: 6px;
	font: inherit;
	font-size: 13px;
	background: var(--theme-color-background-secondary, #fbfbfc);
	color: var(--theme-color-text-primary, #1f2933);
	border: 1px solid var(--theme-color-border-default, #cfd5dd);
	cursor: pointer;
	text-align: left;
	transition: border-color 120ms ease, box-shadow 120ms ease;
}
.pict-theme-picker:hover { border-color: var(--theme-color-text-muted, #6b6b6b); }
.pict-theme-picker:focus, .pict-theme-picker:focus-visible {
	outline: none;
	border-color: var(--theme-color-brand-primary, #2563eb);
	box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}
.pict-theme-picker .pict-theme-picker-name {
	flex: 1;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.pict-theme-picker .pict-theme-picker-chevron {
	color: var(--theme-color-text-muted, #6b6b6b);
	display: inline-flex;
	align-items: center;
}
.pict-theme-picker-trigger-glyph {
	display: inline-flex; align-items: center;
	color: var(--theme-color-text-muted, #6b6b6b);
}

/* Skin the modal-dropdown items with cleaner spacing for our glyphs. */
.pict-theme-picker-menu .pict-modal-dropdown-item-icon {
	width: 28px;
	display: inline-flex;
	align-items: center;
	justify-content: flex-start;
	color: var(--theme-color-text-muted, #6b6b6b);
}
.pict-theme-picker-menu .pict-modal-dropdown-item--active {
	background: var(--theme-color-background-selected, #e0eaff);
	color: var(--theme-color-brand-primary, #2563eb);
}
.pict-theme-picker-menu .pict-modal-dropdown-item--active .pict-modal-dropdown-item-icon {
	color: var(--theme-color-brand-primary, #2563eb);
}`,CSSPriority:500};class PictViewThemePicker extends libPictView{constructor(pFable,pOptions,pServiceHash){super(pFable,pOptions,pServiceHash);this._unsubscribeFromProvider=null;}onAfterInitialize(){this._subscribeToProvider();return super.onAfterInitialize?super.onAfterInitialize():undefined;}onBeforeRender(pRenderable){// Defensive resubscribe: onAfterInitialize attempts this once, but if the
// Theme provider wasn't yet registered at that moment (a real race when
// docuserve wires the Theme-Section after some views have already been
// instantiated), the initial subscribe silently no-ops and the picker
// never re-renders on applyTheme.  The internal guard makes this cheap
// when we're already subscribed.
this._subscribeToProvider();this._refreshAppData();return super.onBeforeRender?super.onBeforeRender(pRenderable):undefined;}onAfterRender(pRenderable,pAddress,pRecord,pContent){this.pict.CSSMap.injectCSS();return super.onAfterRender?super.onAfterRender(pRenderable,pAddress,pRecord,pContent):undefined;}/**
	 * onclick handler — open the rich dropdown menu via pict-section-modal.
	 * @param {HTMLElement} pAnchor - the trigger button (click target)
	 */openMenu(pAnchor){let tmpModal=this._modal();if(!tmpModal){if(typeof console!=='undefined'&&console.warn){console.warn('Theme-Picker: pict-section-modal not registered — cannot open menu.');}return null;}let tmpItems=this._buildMenuItems();let tmpSelf=this;return tmpModal.dropdown(pAnchor,{items:tmpItems,align:'left',minWidth:'260px',maxHeight:'60vh',className:'pict-theme-picker-menu',closeOnSelect:true,onSelect:function(pHash){tmpSelf.pick(pHash);}});}/**
	 * Apply the picked theme. Public so external callers can drive the
	 * picker programmatically too (hotkeys, tests, etc.).
	 */pick(pHash){let tmpProvider=this._provider();if(!tmpProvider)return false;// Preserve the current user-facing mode if the new theme
// supports modes. Single-mode themes will clamp internally.
let tmpActive=tmpProvider.getActiveTheme();let tmpMode=tmpActive?tmpActive.Mode:null;let tmpOk=tmpProvider.applyTheme(pHash,tmpMode);if(tmpOk&&typeof this.options.OnPick==='function'){try{this.options.OnPick(pHash);}catch(pErr){/* host hook failure */}}return tmpOk;}// ================================================================
// Internals
// ================================================================
_subscribeToProvider(){if(this._unsubscribeFromProvider)return;let tmpProvider=this._provider();if(!tmpProvider||typeof tmpProvider.onApply!=='function')return;let tmpSelf=this;this._unsubscribeFromProvider=tmpProvider.onApply(function(){tmpSelf.render();});}_provider(){let tmpHash=this.options.ProviderHash||'Theme';return this.pict&&this.pict.providers&&this.pict.providers[tmpHash];}_modal(){let tmpHash=this.options.ModalViewHash||'Pict-Section-Modal';return this.pict&&this.pict.views&&this.pict.views[tmpHash];}/**
	 * Build the modal-dropdown `items` array from the registered themes
	 * + the catalog's category metadata. One Header row per category,
	 * one item per theme with a leading SVG capability glyph.
	 */_buildMenuItems(){let tmpProvider=this._provider();let tmpThemes=tmpProvider?tmpProvider.listThemes():[];let tmpActive=tmpProvider?tmpProvider.getActiveTheme():{Hash:null};let tmpActiveHash=tmpActive&&tmpActive.Hash||null;let tmpCatalog=this._loadCatalog();let tmpCategoryByHash={};let tmpCategoryOrder=[];if(Array.isArray(this.options.Categories)){tmpCategoryOrder=this.options.Categories.slice();}for(let i=0;i<tmpCatalog.length;i++){let tmpEntry=tmpCatalog[i];let tmpCat=tmpEntry.Category||'Other';tmpCategoryByHash[tmpEntry.Hash]=tmpCat;if(tmpCategoryOrder.indexOf(tmpCat)<0)tmpCategoryOrder.push(tmpCat);}let tmpBuckets={};for(let i=0;i<tmpThemes.length;i++){let tmpTheme=tmpThemes[i];let tmpCat=tmpCategoryByHash[tmpTheme.Hash]||'Other';if(!tmpBuckets[tmpCat]){tmpBuckets[tmpCat]=[];if(tmpCategoryOrder.indexOf(tmpCat)<0)tmpCategoryOrder.push(tmpCat);}tmpBuckets[tmpCat].push(tmpTheme);}let tmpShowIcons=this.options.ShowModeIcons!==false;let tmpItems=[];for(let i=0;i<tmpCategoryOrder.length;i++){let tmpCat=tmpCategoryOrder[i];if(!tmpBuckets[tmpCat]||tmpBuckets[tmpCat].length===0)continue;tmpItems.push({Header:tmpCat});for(let j=0;j<tmpBuckets[tmpCat].length;j++){let tmpTheme=tmpBuckets[tmpCat][j];let tmpIcon=tmpShowIcons?libThemeIcons.iconForTheme(tmpTheme.Strategy,tmpTheme.DefaultMode,14):'';tmpItems.push({Hash:tmpTheme.Hash,Label:tmpTheme.Name||tmpTheme.Hash,Icon:tmpIcon,Style:tmpTheme.Hash===tmpActiveHash?'active':null,Tooltip:this._capabilityLabel(tmpTheme)});}}return tmpItems;}_capabilityLabel(pTheme){let tmpStrategy=pTheme.Strategy||'single';if(tmpStrategy==='single'){let tmpMode=pTheme.DefaultMode||'light';return(pTheme.Name||pTheme.Hash)+' — '+(tmpMode==='dark'?'dark only':'light only');}return(pTheme.Name||pTheme.Hash)+' — light + dark';}_refreshAppData(){let tmpProvider=this._provider();let tmpThemes=tmpProvider?tmpProvider.listThemes():[];let tmpActive=tmpProvider?tmpProvider.getActiveTheme():{Hash:null};let tmpActiveHash=tmpActive&&tmpActive.Hash||null;// Find the active theme's metadata for the trigger glyph.
let tmpActiveTheme=null;for(let i=0;i<tmpThemes.length;i++){if(tmpThemes[i].Hash===tmpActiveHash){tmpActiveTheme=tmpThemes[i];break;}}let tmpShowIcons=this.options.ShowModeIcons!==false;let tmpTriggerGlyphSlot=[];if(tmpShowIcons&&tmpActiveTheme){tmpTriggerGlyphSlot=[{IconHTML:libThemeIcons.iconForTheme(tmpActiveTheme.Strategy,tmpActiveTheme.DefaultMode,14)}];}this.pict.AppData.PictSectionTheme=this.pict.AppData.PictSectionTheme||{};this.pict.AppData.PictSectionTheme.Picker={ActiveHash:tmpActiveHash,ActiveLabel:tmpActiveTheme?tmpActiveTheme.Name||tmpActiveTheme.Hash:'Choose a theme',TriggerTooltip:tmpActiveTheme?this._capabilityLabel(tmpActiveTheme)+' — click to change':'Choose a theme',TriggerGlyphSlot:tmpTriggerGlyphSlot,ChevronHTML:libThemeIcons.iconChevronDown(10)};this.pict.AppData.PictSectionTheme.AllThemes=tmpThemes;}_loadCatalog(){try{return require('../themes/_catalog.js');}catch(pError){return[];}}}PictViewThemePicker.default_configuration=_ViewConfiguration;PictViewThemePicker.APPDATA_ADDRESS=APPDATA_ADDRESS;module.exports=PictViewThemePicker;},{"../Theme-Icons.js":35,"../themes/_catalog.js":41,"pict-view":94}],89:[function(require,module,exports){/**
 * Theme-ScaleSelect — dropdown that picks a viewport scale (zoom).
 *
 * Independent of the active theme bundle: scale is a per-user
 * preference stored alongside ThemeHash + Mode in localStorage. Reads
 * presets from the Theme-Scale helper (or a host-supplied `Presets`
 * array). Subscribes to Theme-Scale.onChange so external scale changes
 * (the persisted boot apply, hotkeys, other code) keep the dropdown's
 * selected option in sync.
 *
 * Drop-in destination: `<div id="Theme-ScaleSelect"></div>`.
 */const libPictView=require('pict-view');const libThemeScale=require('../Theme-Scale.js');const _ViewConfiguration={ViewIdentifier:'Theme-ScaleSelect',AutoInitialize:true,AutoRender:false,DefaultDestinationAddress:'#Theme-ScaleSelect',DefaultRenderable:'Theme-ScaleSelect-Renderable',// Optional override of the preset list. Each entry: { Value: <number>, Label: <string> }.
// When omitted we use libThemeScale.PRESETS.
Presets:null,Templates:[{Hash:'Theme-ScaleSelect-Template',Template:/*html*/`
<select class="pict-theme-scaleselect"
        title="{~D:AppData.PictSectionTheme.ScaleSelect.Tooltip~}"
        onchange="_Pict.views['Theme-ScaleSelect'].pickScale(parseFloat(this.value));">
	{~TS:Theme-ScaleSelect-Option-Template:AppData.PictSectionTheme.ScaleSelect.Options~}
</select>`},{Hash:'Theme-ScaleSelect-Option-Template',Template:/*html*/`
<option value="{~D:Record.Value~}"{~NE:Record.Selected^ selected~}>{~D:Record.Label~}</option>`}],Renderables:[{RenderableHash:'Theme-ScaleSelect-Renderable',TemplateHash:'Theme-ScaleSelect-Template',ContentDestinationAddress:'#Theme-ScaleSelect',RenderMethod:'replace'}],CSS:/*css*/`
.pict-theme-scaleselect {
	min-width: 180px;
	padding: 6px 10px;
	border-radius: 6px;
	font: inherit;
	font-size: 13px;
	background: var(--theme-color-background-secondary, #fbfbfc);
	color: var(--theme-color-text-primary, #1f2933);
	border: 1px solid var(--theme-color-border-default, #cfd5dd);
	cursor: pointer;
}
.pict-theme-scaleselect:focus {
	outline: none;
	border-color: var(--theme-color-brand-primary, #2563eb);
	box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}`,CSSPriority:500};class PictViewThemeScaleSelect extends libPictView{constructor(pFable,pOptions,pServiceHash){super(pFable,pOptions,pServiceHash);this._unsubscribeFromScale=null;}onAfterInitialize(){this._subscribeToScale();return super.onAfterInitialize?super.onAfterInitialize():undefined;}onBeforeRender(pRenderable){this._refreshAppData();return super.onBeforeRender?super.onBeforeRender(pRenderable):undefined;}onAfterRender(pRenderable,pAddress,pRecord,pContent){this.pict.CSSMap.injectCSS();return super.onAfterRender?super.onAfterRender(pRenderable,pAddress,pRecord,pContent):undefined;}/**
	 * onchange handler — apply a new scale and let the listener re-render.
	 * @param {number} pScale
	 */pickScale(pScale){let tmpApplied=libThemeScale.applyScale(pScale);if(typeof this.options.OnScaleChange==='function'){try{this.options.OnScaleChange(tmpApplied);}catch(pErr){/* host hook failure */}}return tmpApplied;}// ================================================================
// Internals
// ================================================================
_subscribeToScale(){if(this._unsubscribeFromScale)return;let tmpSelf=this;this._unsubscribeFromScale=libThemeScale.onChange(function(){tmpSelf.render();});}_refreshAppData(){let tmpPresets=Array.isArray(this.options.Presets)?this.options.Presets:libThemeScale.PRESETS;let tmpActive=libThemeScale.getActive();// "Closest" match — the saved scale may be a custom value (e.g.
// 1.10 from a hotkey nudge) that doesn't exactly equal any preset.
// We highlight the nearest option so the dropdown still reflects
// roughly where the user is.
let tmpClosestIdx=0;let tmpClosestDelta=Infinity;for(let i=0;i<tmpPresets.length;i++){let tmpDelta=Math.abs(tmpPresets[i].Value-tmpActive);if(tmpDelta<tmpClosestDelta){tmpClosestDelta=tmpDelta;tmpClosestIdx=i;}}let tmpOptions=[];for(let i=0;i<tmpPresets.length;i++){let tmpEntry=tmpPresets[i];tmpOptions.push({Value:tmpEntry.Value,Label:tmpEntry.Label,Selected:i===tmpClosestIdx});}let tmpTooltip='Viewport scale — currently '+Math.round(tmpActive*100)+'%';this.pict.AppData.PictSectionTheme=this.pict.AppData.PictSectionTheme||{};this.pict.AppData.PictSectionTheme.ScaleSelect={ActiveScale:tmpActive,Tooltip:tmpTooltip,Options:tmpOptions};}}PictViewThemeScaleSelect.default_configuration=_ViewConfiguration;module.exports=PictViewThemeScaleSelect;},{"../Theme-Scale.js":37,"pict-view":94}],90:[function(require,module,exports){/**
 * Theme-TopBar — standard application chrome row.
 *
 * Provides the boilerplate every Pict / retold app remakes: a flex row
 * with three zones — brand mark on the left, navigation in the middle,
 * configuration / user widgets on the right (with the theme button
 * pinned at the far edge).
 *
 *   ┌────────────────────────────────────────────────────────────────┐
 *   │ [Brand-Mark]   [── Nav slot (flex-grow) ──]   [User-slot] [⚙]  │
 *   └────────────────────────────────────────────────────────────────┘
 *
 * Auto-mounts:
 *   - Theme-Brand-Mark in the brand slot (skip via MountBrandMark: false)
 *   - Theme-Button at the far right of the user area (skip via
 *     MountThemeButton: false)
 *
 * Host fills two empty slots via standard Pict view destinations:
 *   - `#Theme-TopBar-Nav`  — primary navigation / action buttons
 *   - `#Theme-TopBar-User` — app-specific user-area widgets (account,
 *                            log toggle, custom indicators)
 *
 * Renders into `#Theme-TopBar` by default. The host's layout shell
 * provides that destination — typically the top panel of a
 * pict-section-modal Shell.
 *
 * The bottom border uses `--brand-color-primary-mode` so the topbar
 * carries a thin brand stripe that auto-swaps with light/dark mode.
 *
 * Each app's nav / user-area views can stay app-specific; this view
 * eliminates the chrome boilerplate around them.
 */const libPictView=require('pict-view');const _ViewConfiguration={ViewIdentifier:'Theme-TopBar',AutoInitialize:true,AutoRender:false,DefaultDestinationAddress:'#Theme-TopBar',DefaultRenderable:'Theme-TopBar-Renderable',// When false, the host is responsible for mounting Theme-Brand-Mark
// itself (or skipping the brand entirely).
MountBrandMark:true,// When false, Theme-Button is not auto-mounted into the user slot.
// Useful when the host wants to position the button somewhere else
// or when no theme picker is desired.
MountThemeButton:true,// ViewIdentifier of a host-supplied view that fills the nav slot
// (#Theme-TopBar-Nav). Typical convention: a small per-app view
// rendering primary action buttons / nav links / breadcrumbs.
NavView:null,// ViewIdentifier of a host-supplied view that fills the user-area
// slot (#Theme-TopBar-User). Theme-Button still auto-mounts at the
// far edge — this view fills the slot before it.
UserView:null,// Height of the bar in pixels. Drives the min-height on the
// chrome row so it fills the panel cleanly even when the parent
// chain (pict-section-modal shell uses min-height: 100% on its
// panel content destination, which doesn't resolve through plain
// height: 100% chains) doesn't establish a determinate height.
// Hosts should match this to whatever Size they use on the panel
// addPanel() call so the chrome and panel agree on the row size.
Height:56,// Horizontal alignment of items inside the nav slot. The slot
// itself stretches (flex: 1) between brand mark and user area;
// this option controls where the nav content sits within that
// stretched space. Default 'right' so action buttons hug the
// user-area / theme button cluster (the convention every
// retold-* app converged on). Override to 'left' to put the nav
// flush against the brand, or 'center' to centre it across the
// row. Maps to justify-content: flex-end / flex-start / center.
NavAlign:'right',// Viewport width (px) below which the topbar collapses to compact
// mode: nav + user-area widgets hide, a burger button shows in
// their place. Clicking the burger opens a pict-section-modal
// popup with a clone of the nav + user DOM, so every action stays
// reachable.
//
// Default 900px — the conventional "narrow desktop / small laptop"
// cut-off where a topbar with ~4 nav buttons + a brand mark + a
// user-area cluster genuinely starts crowding. Most users will
// resize a window to this range (drag a split-pane, dock a window
// next to another app, etc.); 600px would only trigger at true
// mobile widths most desktop users never hit.
//
// Conventional ladder for picking a value:
//   ~1024px  large breakpoint — nav-heavy apps with 6+ buttons
//    ~900px  default — "narrow desktop window" (recommended)
//    ~768px  tablet portrait — minimal-nav apps
//    ~600px  mobile-only — single-button toolbars
//        0   disable compact mode entirely
CompactBreakpoint:900,Templates:[{Hash:'Theme-TopBar-Template',// The burger button is hidden by default and the regular nav /
// user-slot are visible — flipped by the media query in CSS
// at the CompactBreakpoint (default 600px). On click the
// burger opens a pict-section-modal popup containing a clone
// of the existing #Theme-TopBar-Nav + #Theme-TopBar-User DOM
// — host apps don't need to provide a separate burger view.
Template:/*html*/`
<div class="pict-theme-topbar">
	<div class="pict-theme-topbar-mark"><div id="Theme-Brand-Mark"></div></div>
	<div class="pict-theme-topbar-nav" id="Theme-TopBar-Nav"></div>
	<div class="pict-theme-topbar-user">
		<div class="pict-theme-topbar-user-slot" id="Theme-TopBar-User"></div>
		<div class="pict-theme-topbar-user-button"><div id="Theme-Button"></div></div>
		<button type="button" class="pict-theme-topbar-burger"
			aria-label="More navigation"
			title="Menu"
			onclick="_Pict.views['Theme-TopBar'].openBurgerMenu();">
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none"
				stroke="currentColor" stroke-width="2"
				stroke-linecap="round" stroke-linejoin="round"
				aria-hidden="true">
				<path d="M3 6h18M3 12h18M3 18h18"/>
			</svg>
		</button>
	</div>
</div>`}],Renderables:[{RenderableHash:'Theme-TopBar-Renderable',TemplateHash:'Theme-TopBar-Template',ContentDestinationAddress:'#Theme-TopBar',RenderMethod:'replace'}],CSS:/*css*/`
.pict-theme-topbar {
	display: flex;
	align-items: center;
	gap: 14px;
	/* The min-height is rewritten per-instance in onAfterRender from the
	   Height option (default 56). Avoids the percent-height resolution
	   trap: pict-section-modal's panel destination uses min-height: 100%
	   on its inner div, which means a child's height: 100% / min-height:
	   100% resolves against the parent's *property* (auto), not its
	   resolved size — and collapses the row to its content. A fixed px
	   value gives align-items: center real space to centre into. */
	min-height: 56px;
	padding: 0 14px;
	box-sizing: border-box;
	background: var(--theme-color-background-panel, transparent);
	/* Brand stripes are drawn by .pict-theme-topbar::after as an absolute
	   element overlaying the bottom 5px of the row. Using ::after rather
	   than border-bottom + box-shadow lets us put a transparent gap
	   between the two stripes (border / box-shadow can't draw gaps).
	   Position relative so the ::after positions to this row. */
	position: relative;
}
/* Two-stripe brand identifier at the bottom of the topbar:
     4px brand-primary (thicker — the dominant identifier)
     2px transparent gap (clearly readable separation)
     3px brand-secondary (thinner than primary but still substantial)
   Earlier iterations used 1–2px stripes; both read clearly at light
   mode but dark-mode secondary colors are often desaturated (lifted)
   so the eye can miss a thin band against a dark background. The
   current sizes push the secondary above the perception threshold
   regardless of palette. Stripes overlay the bottom 9px of the row;
   content (which centres in the full row via align-items: center)
   keeps its visual position. */
.pict-theme-topbar::after {
	content: '';
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	height: 9px;
	pointer-events: none;
	background: linear-gradient(
		to bottom,
		var(--brand-color-primary-mode, var(--theme-color-brand-primary, #2563eb)) 0,
		var(--brand-color-primary-mode, var(--theme-color-brand-primary, #2563eb)) 4px,
		transparent 4px,
		transparent 6px,
		var(--brand-color-secondary-mode, var(--theme-color-brand-secondary, transparent)) 6px,
		var(--brand-color-secondary-mode, var(--theme-color-brand-secondary, transparent)) 9px
	);
}
.pict-theme-topbar-mark {
	flex: 0 0 auto;
	display: flex;
	align-items: center;
}
.pict-theme-topbar-nav {
	flex: 1 1 auto;
	display: flex;
	align-items: center;
	/* Default to right-aligning nav items inside the stretched slot —
	   the convention retold-* apps converged on. Overridden per-instance
	   from the NavAlign option in onAfterRender. */
	justify-content: flex-end;
	gap: 8px;
	min-width: 0;
	/* Horizontally scrollable when the nav overflows (narrow viewports
	   with many buttons) — better than overflow:hidden which would
	   silently clip buttons offscreen. The vertical axis stays clipped
	   so a tall accidental child doesn't blow up the row height. A
	   proper overflow menu is a future enhancement; this gets us safe
	   degradation today. */
	overflow-x: auto;
	overflow-y: hidden;
	/* Hide the scrollbar by default; modern browsers pick up the
	   trackpad scroll without it. Apps wanting a visible scrollbar
	   can override at higher specificity. */
	scrollbar-width: none;
}
.pict-theme-topbar-nav::-webkit-scrollbar { display: none; }
/* Active-route indicator. The convention every host app should follow:
   put aria-current="page" on the button (or anchor) representing the
   current route. The W3C-standard attribute reads correctly to screen
   readers and gets a brand-tinted highlight here. Apps that already
   ship their own active styling can override these rules — they're
   keyed off attribute selectors so no class collision is possible. */
.pict-theme-topbar-nav [aria-current="page"],
.pict-theme-topbar-user [aria-current="page"] {
	color: var(--brand-color-primary-mode, var(--theme-color-brand-primary, #2563eb));
	border-color: var(--brand-color-primary-mode, var(--theme-color-brand-primary, #2563eb));
	background: var(--theme-color-background-hover, rgba(37, 99, 235, 0.08));
}
.pict-theme-topbar-user {
	flex: 0 0 auto;
	display: flex;
	align-items: center;
	gap: 8px;
}
.pict-theme-topbar-user-slot {
	display: flex;
	align-items: center;
	gap: 8px;
}
.pict-theme-topbar-user-button {
	display: flex;
	align-items: center;
}
/* Burger button — hidden by default; the media query (or the inline
   per-instance JS that swaps it via CompactBreakpoint) shows it once
   the viewport drops below the host's compact threshold. Sized to
   match Theme-Button (28×28) so the row's rhythm is preserved. */
.pict-theme-topbar-burger {
	display: none;
	align-items: center;
	justify-content: center;
	width: 28px;
	height: 28px;
	padding: 0;
	border-radius: 6px;
	border: 1px solid var(--theme-color-border-default, #cfd5dd);
	background: var(--theme-color-background-secondary, #fbfbfc);
	color: var(--theme-color-text-secondary, #4a5568);
	cursor: pointer;
	transition: background-color 120ms ease, color 120ms ease, border-color 120ms ease;
}
.pict-theme-topbar-burger:hover {
	background: var(--theme-color-background-hover, #f0f0f0);
	color: var(--brand-color-primary-mode, var(--theme-color-brand-primary, #2563eb));
	border-color: var(--brand-color-primary-mode, var(--theme-color-brand-primary, #2563eb));
}
/* Burger menu popup — applied to the cloned nav + user DOM inside
   pict-section-modal. The cloned children inherit their original
   styling (action buttons, badges, etc.) so the popup looks visually
   consistent with what was on the topbar. */
.pict-theme-burger-menu {
	display: flex;
	flex-direction: column;
	gap: 6px;
}
.pict-theme-burger-menu-section {
	display: flex;
	flex-direction: column;
	gap: 6px;
}
/* Cloned children render as a vertical stack inside the popup — flip
   the horizontal flex layouts to column so each button takes a full
   row instead of cramming side-by-side at narrow width. */
.pict-theme-burger-menu .rm-topbar-nav,
.pict-theme-burger-menu .rm-topbar-user,
.pict-theme-burger-menu [class*="-topbar-nav"],
.pict-theme-burger-menu [class*="-topbar-user"] {
	display: flex;
	flex-direction: column;
	align-items: stretch;
	gap: 6px;
}
.pict-theme-burger-menu button { width: 100%; text-align: left; }
.pict-theme-burger-menu .rm-topbar-nav-divider,
.pict-theme-burger-menu [class*="divider"] { display: none; }
/* Compact mode — defaults to a 900px breakpoint. The onAfterRender
   handler injects a per-instance <style> rule when the host passes a
   different CompactBreakpoint, so this @media block is the fallback
   for hosts that accept the default. */
@media (max-width: 900px) {
	.pict-theme-topbar-nav            { display: none !important; }
	.pict-theme-topbar-user-slot      { display: none !important; }
	.pict-theme-topbar-burger         { display: inline-flex; }
	/* In wide mode the flex-1 nav slot pushes the user-area to the
	   right edge. With the nav hidden the user-area would collapse
	   left of the now-empty middle; the auto-margin re-creates the
	   "push right" effect so the theme button + burger stay flush
	   against the right edge of the topbar. */
	.pict-theme-topbar-user           { margin-left: auto; }
}`,CSSPriority:500};class PictViewThemeTopBar extends libPictView{constructor(pFable,pOptions,pServiceHash){super(pFable,pOptions,pServiceHash);}onAfterRender(pRenderable,pAddress,pRecord,pContent){this.pict.CSSMap.injectCSS();// Apply the configured Height to the rendered .pict-theme-topbar.
// Using inline style so each instance can carry its own size
// (different apps will pick different heights) without us having
// to inject per-instance <style> blocks.
if(typeof document!=='undefined'&&this.options.Height){let tmpRoot=document.querySelector('.pict-theme-topbar');if(tmpRoot){tmpRoot.style.minHeight=this.options.Height+'px';}}// Per-instance CompactBreakpoint. CSS @media rules can't reference
// JS option values, so when the host overrides the default 600px
// we inject a single-rule <style> with the chosen breakpoint and
// !important to win over the static media query. Set to 0 to
// disable compact mode entirely (the burger stays hidden).
this._applyCompactBreakpoint();// Translate NavAlign ('left' | 'right' | 'center') to the matching
// justify-content. Right is the default (and already in the static
// CSS), but the inline style wins so an explicit option always
// takes precedence over the cached stylesheet.
if(typeof document!=='undefined'&&this.options.NavAlign){let tmpJustify={left:'flex-start',right:'flex-end',center:'center'}[this.options.NavAlign];if(tmpJustify){let tmpNav=document.querySelector('.pict-theme-topbar-nav');if(tmpNav){tmpNav.style.justifyContent=tmpJustify;}}}// Auto-mount the standard pieces. Host can opt out via the view
// options (MountBrandMark / MountThemeButton).
if(this.options.MountBrandMark!==false){let tmpBrandMark=this.pict.views['Theme-Brand-Mark'];if(tmpBrandMark){tmpBrandMark.render();}}if(this.options.NavView){let tmpNavView=this.pict.views[this.options.NavView];if(tmpNavView){tmpNavView.render();}else if(this.log&&this.log.warn){this.log.warn('Theme-TopBar: NavView "'+this.options.NavView+'" not registered');}}if(this.options.UserView){let tmpUserView=this.pict.views[this.options.UserView];if(tmpUserView){tmpUserView.render();}else if(this.log&&this.log.warn){this.log.warn('Theme-TopBar: UserView "'+this.options.UserView+'" not registered');}}if(this.options.MountThemeButton!==false){let tmpThemeButton=this.pict.views['Theme-Button'];if(tmpThemeButton){tmpThemeButton.render();}}return super.onAfterRender?super.onAfterRender(pRenderable,pAddress,pRecord,pContent):undefined;}// ─── Per-route slot swapping ──────────────────────────────────────────
// Apps with chrome that morphs between routes (e.g. breadcrumb-style
// navigation that differs by section) call setNavView / setUserView
// from their router callback. The new view is rendered into the
// matching slot and the option is persisted so subsequent re-renders
// of the topbar (theme switches, etc.) keep the new view mounted.
/**
	 * Swap the NavView (slot at `#Theme-TopBar-Nav`) at runtime.
	 * @param {string|null} pViewIdentifier
	 *   View hash to mount, or null to clear the slot.
	 */setNavView(pViewIdentifier){this.options.NavView=pViewIdentifier||null;this._mountSlot('#Theme-TopBar-Nav',this.options.NavView);}/**
	 * Swap the UserView (slot at `#Theme-TopBar-User`) at runtime.
	 * @param {string|null} pViewIdentifier
	 */setUserView(pViewIdentifier){this.options.UserView=pViewIdentifier||null;this._mountSlot('#Theme-TopBar-User',this.options.UserView);}_mountSlot(pDestSelector,pViewIdentifier){// Clear the slot first — handles both the clear-only case
// (pViewIdentifier is null) and the swap case (gives the
// new view a clean slate when its renderable doesn't use
// `replace` mode).
if(typeof document!=='undefined'){let tmpDest=document.querySelector(pDestSelector);if(tmpDest){tmpDest.innerHTML='';}}if(!pViewIdentifier){return;}let tmpView=this.pict.views[pViewIdentifier];if(tmpView){tmpView.render();}else if(this.log&&this.log.warn){this.log.warn('Theme-TopBar: view "'+pViewIdentifier+'" not registered');}}// ─── Compact mode + burger menu ──────────────────────────────────────
// At narrow widths the nav + user-area slots collapse into a single
// burger button that opens a pict-section-modal popup with the
// cloned nav + user DOM. The default breakpoint is 600px; hosts that
// want a different value pass CompactBreakpoint in ViewOptions.
_applyCompactBreakpoint(){if(typeof document==='undefined')return;// Default value of 900 lives in the static CSS @media block; we
// only need to inject when the host explicitly overrode it.
let tmpBreakpoint=this.options.CompactBreakpoint;if(tmpBreakpoint===undefined||tmpBreakpoint===null)return;if(tmpBreakpoint===900)return;// matches default — no override needed
let tmpStyleId='pict-theme-topbar-compact-'+this.UUID;let tmpStyleEl=document.getElementById(tmpStyleId);if(!tmpStyleEl){tmpStyleEl=document.createElement('style');tmpStyleEl.id=tmpStyleId;document.head.appendChild(tmpStyleEl);}// 0 (or any non-positive value) disables compact mode by emitting
// a never-matching media rule. The static CSS still has the 600px
// rule, so we override it with a more-specific selector + the
// chosen breakpoint. Specificity-wise the inline rule wins
// because it's emitted after the static CSS and has !important
// matching the static rule's importance.
if(typeof tmpBreakpoint!=='number'||tmpBreakpoint<=0){// Disable: force compact selectors to never apply by giving
// the burger display: none unconditionally at all widths.
tmpStyleEl.textContent='.pict-theme-topbar-nav            { display: flex !important; }\n'+'.pict-theme-topbar-user-slot      { display: flex !important; }\n'+'.pict-theme-topbar-burger         { display: none !important; }\n'+'.pict-theme-topbar-user           { margin-left: 0 !important; }\n';}else{tmpStyleEl.textContent='@media (max-width: '+tmpBreakpoint+'px) {\n'+'\t.pict-theme-topbar-nav            { display: none !important; }\n'+'\t.pict-theme-topbar-user-slot      { display: none !important; }\n'+'\t.pict-theme-topbar-burger         { display: inline-flex !important; }\n'+'\t.pict-theme-topbar-user           { margin-left: auto !important; }\n'+'}\n'+'@media (min-width: '+(tmpBreakpoint+1)+'px) {\n'+'\t.pict-theme-topbar-nav            { display: flex !important; }\n'+'\t.pict-theme-topbar-user-slot      { display: flex !important; }\n'+'\t.pict-theme-topbar-burger         { display: none !important; }\n'+'\t.pict-theme-topbar-user           { margin-left: 0 !important; }\n'+'}\n';}}/**
	 * Open the burger / overflow menu. Clones the current contents of
	 * `#Theme-TopBar-Nav` and `#Theme-TopBar-User` into a
	 * pict-section-modal popup so every action stays reachable at narrow
	 * widths. The cloned buttons keep their inline `onclick` handlers
	 * (those reference globals like `_Pict.PictApplication.*`, which
	 * resolve at click-time regardless of where the DOM lives).
	 *
	 * Override on the instance (`view.openBurgerMenu = function() {...}`)
	 * to customise the popup contents — e.g. emit a per-app menu view
	 * instead of cloning the topbar DOM.
	 */openBurgerMenu(){if(typeof document==='undefined')return null;let tmpModal=this.pict.views['Pict-Section-Modal'];if(!tmpModal||typeof tmpModal.show!=='function'){if(typeof console!=='undefined'&&console.warn){console.warn('Theme-TopBar: pict-section-modal not registered — burger menu unavailable.');}return null;}let tmpSections=[];let tmpNav=document.querySelector('#Theme-TopBar-Nav');let tmpUser=document.querySelector('#Theme-TopBar-User');if(tmpNav&&tmpNav.innerHTML.trim()){tmpSections.push('<div class="pict-theme-burger-menu-section">'+tmpNav.innerHTML+'</div>');}if(tmpUser&&tmpUser.innerHTML.trim()){tmpSections.push('<div class="pict-theme-burger-menu-section">'+tmpUser.innerHTML+'</div>');}if(tmpSections.length===0){tmpSections.push('<div class="pict-theme-burger-menu-empty">No menu items configured.</div>');}let tmpHTML='<div class="pict-theme-burger-menu">'+tmpSections.join('')+'</div>';return tmpModal.show({title:'Menu',content:tmpHTML,width:'280px',closeable:true,buttons:[]});}}module.exports=PictViewThemeTopBar;module.exports.default_configuration=_ViewConfiguration;},{"pict-view":94}],91:[function(require,module,exports){module.exports={"name":"pict-template","version":"1.0.15","description":"Pict Template Base Class","main":"source/Pict-Template.js","scripts":{"start":"node source/Pict-Template.js","test":"npx quack test","tests":"npx quack test -g","coverage":"npx quack coverage","build":"npx quack build","types":"tsc -p ."},"types":"types/source/Pict-Template.d.ts","repository":{"type":"git","url":"git+https://github.com/stevenvelozo/pict-view.git"},"author":"steven velozo <steven@velozo.com>","license":"MIT","bugs":{"url":"https://github.com/stevenvelozo/pict-view/issues"},"homepage":"https://github.com/stevenvelozo/pict-view#readme","devDependencies":{"pict":"^1.0.348","quackage":"^1.0.58","typescript":"^5.9.3"},"mocha":{"diff":true,"extension":["js"],"package":"./package.json","reporter":"spec","slow":"75","timeout":"5000","ui":"tdd","watch-files":["source/**/*.js","test/**/*.js"],"watch-ignore":["lib/vendor"]},"dependencies":{"fable-serviceproviderbase":"^3.0.19"}};},{}],92:[function(require,module,exports){const libFableServiceBase=require('fable-serviceproviderbase');const libPackage=require('../package.json');/** @typedef {import('pict') & {
 *     [key: string]: any, // represent services for now as a workaround
 * }} Pict *//**
 * @class PictTemplateExpression
 * @classdesc The PictTemplateExpression class is a service provider for the pict anti-framework that provides template rendering services.
 */class PictTemplateExpression extends libFableServiceBase{/**
	 * @param {Pict} pFable - The Fable Framework instance
	 * @param {Record<string, any>} [pOptions] - The options for the service
	 * @param {string} [pServiceHash] - The hash of the service
	 */constructor(pFable,pOptions,pServiceHash){super(pFable,pOptions,pServiceHash);/** @type {Pict} */this.fable;/** @type {Pict} */this.pict=this.fable;this.serviceType='PictTemplate';/** @type {Record<string, any>} */this._Package=libPackage;}/**
	 * Render a template expression, returning a string with the resulting content.
	 *
	 * @param {string} pTemplateHash - The hash contents of the template (what's between the template start and stop tags)
	 * @param {any} pRecord - The json object to be used as the Record for the template render
	 * @param {Array<any>} pContextArray - An array of context objects accessible from the template; safe to leave empty
	 * @param {any} [pScope] - A sticky scope that can be used to carry state and simplify template
	 * @param {any} [pState] - A catchall state object for plumbing data through template processing.
	 *
	 * @return {string} The rendered template
	 */render(pTemplateHash,pRecord,pContextArray,pScope,pState){return'';}/**
	 * Render a template expression, deliver a string with the resulting content to a callback function.
	 *
	 * @param {string} pTemplateHash - The hash contents of the template (what's between the template start and stop tags)
	 * @param {any} pRecord - The json object to be used as the Record for the template render
	 * @param {(error?: Error, content?: String) => void} fCallback - callback function invoked with the rendered template, or an error
	 * @param {Array<any>} pContextArray - An array of context objects accessible from the template; safe to leave empty
	 * @param {any} [pScope] - A sticky scope that can be used to carry state and simplify template
	 * @param {any} [pState] - A catchall state object for plumbing data through template processing.
	 *
	 * @return {void}
	 */renderAsync(pTemplateHash,pRecord,fCallback,pContextArray,pScope,pState){return fCallback(null,this.render(pTemplateHash,pRecord,pContextArray,pScope,pState));}/**
	 * Provide a match criteria for a template expression.  Anything between these two values is returned as the template hash.
	 *
	 * @param {string} pMatchStart - The string pattern to start a match in the template trie
	 * @param {string} pMatchEnd  - The string pattern to stop a match in the trie acyclic graph
	 *
	 * @return {void}
	 */addPattern(pMatchStart,pMatchEnd){return this.pict.MetaTemplate.addPatternBoth(pMatchStart,pMatchEnd,this.render,this.renderAsync,this);}/**
	 * Read a value from a nested object using a dot notation string.
	 *
	 * @param {string} pAddress - The address to resolve
	 * @param {Record<string, any>} pRecord - The record to resolve
	 * @param {Array<any>} [pContextArray] - The context array to resolve (optional)
	 * @param {Record<string, any>} [pRootDataObject] - The root data object to resolve (optional)
	 * @param {any} [pScope] - A sticky scope that can be used to carry state and simplify template
	 * @param {any} [pState] - A catchall state object for plumbing data through template processing.
	 *
	 * @return {any} The value at the given address, or undefined
	 */resolveStateFromAddress(pAddress,pRecord,pContextArray,pRootDataObject,pScope,pState){return this.pict.resolveStateFromAddress(pAddress,pRecord,pContextArray,pRootDataObject,pScope,pState);}}module.exports=PictTemplateExpression;module.exports.template_hash='Default';},{"../package.json":91,"fable-serviceproviderbase":2}],93:[function(require,module,exports){module.exports={"name":"pict-view","version":"1.0.68","description":"Pict View Base Class","main":"source/Pict-View.js","scripts":{"test":"npx quack test","tests":"npx quack test -g","start":"node source/Pict-View.js","coverage":"npx quack coverage","build":"npx quack build","docker-dev-build":"docker build ./ -f Dockerfile_LUXURYCode -t pict-view-image:local","docker-dev-run":"docker run -it -d --name pict-view-dev -p 30001:8080 -p 38086:8086 -v \"$PWD/.config:/home/coder/.config\"  -v \"$PWD:/home/coder/pict-view\" -u \"$(id -u):$(id -g)\" -e \"DOCKER_USER=$USER\" pict-view-image:local","docker-dev-shell":"docker exec -it pict-view-dev /bin/bash","types":"tsc -p .","lint":"eslint source/**"},"types":"types/source/Pict-View.d.ts","repository":{"type":"git","url":"git+https://github.com/stevenvelozo/pict-view.git"},"author":"steven velozo <steven@velozo.com>","license":"MIT","bugs":{"url":"https://github.com/stevenvelozo/pict-view/issues"},"homepage":"https://github.com/stevenvelozo/pict-view#readme","devDependencies":{"@eslint/js":"^9.39.1","browser-env":"^3.3.0","eslint":"^9.39.1","pict":"^1.0.363","quackage":"^1.0.65","typescript":"^5.9.3"},"mocha":{"diff":true,"extension":["js"],"package":"./package.json","reporter":"spec","slow":"75","timeout":"5000","ui":"tdd","watch-files":["source/**/*.js","test/**/*.js"],"watch-ignore":["lib/vendor"]},"dependencies":{"fable":"^3.1.67","fable-serviceproviderbase":"^3.0.19"}};},{}],94:[function(require,module,exports){const libFableServiceBase=require('fable-serviceproviderbase');const libPackage=require('../package.json');const defaultPictViewSettings={DefaultRenderable:false,DefaultDestinationAddress:false,DefaultTemplateRecordAddress:false,ViewIdentifier:false,// If this is set to true, when the App initializes this will.
// After the App initializes, initialize will be called as soon as it's added.
AutoInitialize:true,AutoInitializeOrdinal:0,// If this is set to true, when the App autorenders (on load) this will.
// After the App initializes, render will be called as soon as it's added.
AutoRender:true,AutoRenderOrdinal:0,AutoSolveWithApp:true,AutoSolveOrdinal:0,CSSHash:false,CSS:false,CSSProvider:false,CSSPriority:500,Templates:[],DefaultTemplates:[],Renderables:[],Manifests:{}};/** @typedef {(error?: Error) => void} ErrorCallback *//** @typedef {number | boolean} PictTimestamp *//**
 * @typedef {'replace' | 'append' | 'prepend' | 'append_once' | 'virtual-assignment'} RenderMethod
 *//**
 * @typedef {Object} Renderable
 *
 * @property {string} RenderableHash - A unique hash for the renderable.
 * @property {string} TemplateHash - The hash of the template to use for rendering this renderable.
 * @property {string} [DefaultTemplateRecordAddress] - The default address for resolving the data record for this renderable.
 * @property {string} [ContentDestinationAddress] - The default address (DOM CSS selector) for rendering the content of this renderable.
 * @property {RenderMethod} [RenderMethod=replace] - The method to use when projecting the renderable to the DOM ('replace', 'append', 'prepend', 'append_once', 'virtual-assignment').
 * @property {string} [TestAddress] - The address to use for testing the renderable.
 * @property {string} [TransactionHash] - The transaction hash for the root renderable.
 * @property {string} [RootRenderableViewHash] - The hash of the root renderable.
 * @property {string} [Content] - The rendered content for this renderable, if applicable.
 *//**
 * Represents a view in the Pict ecosystem.
 */class PictView extends libFableServiceBase{/**
	 * @param {any} pFable - The Fable object that this service is attached to.
	 * @param {any} [pOptions] - (optional) The options for this service.
	 * @param {string} [pServiceHash] - (optional) The hash of the service.
	 */constructor(pFable,pOptions,pServiceHash){// Intersect default options, parent constructor, service information
let tmpOptions=Object.assign({},JSON.parse(JSON.stringify(defaultPictViewSettings)),pOptions);super(pFable,tmpOptions,pServiceHash);//FIXME: add types to fable and ancillaries
/** @type {any} */this.fable;/** @type {any} */this.options;/** @type {String} */this.UUID;/** @type {String} */this.Hash;/** @type {any} */this.log;const tmpHashIsUUID=this.Hash===this.UUID;//NOTE: since many places are using the view UUID as the HTML element ID, we prefix it to avoid starting with a number
this.UUID=`V-${this.UUID}`;if(tmpHashIsUUID){this.Hash=this.UUID;}if(!this.options.ViewIdentifier){this.options.ViewIdentifier=`AutoViewID-${this.fable.getUUID()}`;}this.serviceType='PictView';/** @type {Record<string, any>} */this._Package=libPackage;// Convenience and consistency naming
/** @type {import('pict') & { log: any, instantiateServiceProviderWithoutRegistration: (hash: String) => any, instantiateServiceProviderIfNotExists: (hash: string) => any, TransactionTracking: import('pict/types/source/services/Fable-Service-TransactionTracking') }} */this.pict=this.fable;// Wire in the essential Pict application state
this.AppData=this.pict.AppData;this.Bundle=this.pict.Bundle;/** @type {PictTimestamp} */this.initializeTimestamp=false;/** @type {PictTimestamp} */this.lastSolvedTimestamp=false;/** @type {PictTimestamp} */this.lastRenderedTimestamp=false;/** @type {PictTimestamp} */this.lastMarshalFromViewTimestamp=false;/** @type {PictTimestamp} */this.lastMarshalToViewTimestamp=false;this.pict.instantiateServiceProviderIfNotExists('TransactionTracking');// Load all templates from the array in the options
// Templates are in the form of {Hash:'Some-Template-Hash',Template:'Template content',Source:'TemplateSource'}
for(let i=0;i<this.options.Templates.length;i++){let tmpTemplate=this.options.Templates[i];if(!('Hash'in tmpTemplate)||!('Template'in tmpTemplate)){this.log.error(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} could not load Template ${i} in the options array.`,tmpTemplate);}else{if(!tmpTemplate.Source){tmpTemplate.Source=`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} options object.`;}this.pict.TemplateProvider.addTemplate(tmpTemplate.Hash,tmpTemplate.Template,tmpTemplate.Source);}}// Load all default templates from the array in the options
// Templates are in the form of {Prefix:'',Postfix:'-List-Row',Template:'Template content',Source:'TemplateSourceString'}
for(let i=0;i<this.options.DefaultTemplates.length;i++){let tmpDefaultTemplate=this.options.DefaultTemplates[i];if(!('Postfix'in tmpDefaultTemplate)||!('Template'in tmpDefaultTemplate)){this.log.error(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} could not load Default Template ${i} in the options array.`,tmpDefaultTemplate);}else{if(!tmpDefaultTemplate.Source){tmpDefaultTemplate.Source=`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} options object.`;}this.pict.TemplateProvider.addDefaultTemplate(tmpDefaultTemplate.Prefix,tmpDefaultTemplate.Postfix,tmpDefaultTemplate.Template,tmpDefaultTemplate.Source);}}// Load the CSS if it's available
if(this.options.CSS){let tmpCSSHash=this.options.CSSHash?this.options.CSSHash:`View-${this.options.ViewIdentifier}`;let tmpCSSProvider=this.options.CSSProvider?this.options.CSSProvider:tmpCSSHash;this.pict.CSSMap.addCSS(tmpCSSHash,this.options.CSS,tmpCSSProvider,this.options.CSSPriority);}// Load all renderables
// Renderables are launchable renderable instructions with templates
// They look as such: {Identifier:'ContentEntry', TemplateHash:'Content-Entry-Section-Main', ContentDestinationAddress:'#ContentSection', RecordAddress:'AppData.Content.DefaultText', ManifestTransformation:'ManyfestHash', ManifestDestinationAddress:'AppData.Content.DataToTransformContent'}
// The only parts that are necessary are Identifier and Template
// A developer can then do render('ContentEntry') and it just kinda works.  Or they can override the ContentDestinationAddress
/** @type {Record<String, Renderable>} */this.renderables={};for(let i=0;i<this.options.Renderables.length;i++){/** @type {Renderable} */let tmpRenderable=this.options.Renderables[i];this.addRenderable(tmpRenderable);}}/**
	 * Adds a renderable to the view.
	 *
	 * @param {string | Renderable} pRenderableHash - The hash of the renderable, or a renderable object.
	 * @param {string} [pTemplateHash] - (optional) The hash of the template for the renderable.
	 * @param {string} [pDefaultTemplateRecordAddress] - (optional) The default data address for the template.
	 * @param {string} [pDefaultDestinationAddress] - (optional) The default destination address for the renderable.
	 * @param {RenderMethod} [pRenderMethod=replace] - (optional) The method to use when rendering the renderable (ex. 'replace').
	 */addRenderable(pRenderableHash,pTemplateHash,pDefaultTemplateRecordAddress,pDefaultDestinationAddress,pRenderMethod){/** @type {Renderable} */let tmpRenderable;if(typeof pRenderableHash=='object'){// The developer passed in the renderable as an object.
// Use theirs instead!
tmpRenderable=pRenderableHash;}else{/** @type {RenderMethod} */let tmpRenderMethod=typeof pRenderMethod!=='string'?pRenderMethod:'replace';tmpRenderable={RenderableHash:pRenderableHash,TemplateHash:pTemplateHash,DefaultTemplateRecordAddress:pDefaultTemplateRecordAddress,ContentDestinationAddress:pDefaultDestinationAddress,RenderMethod:tmpRenderMethod};}if(typeof tmpRenderable.RenderableHash!='string'||typeof tmpRenderable.TemplateHash!='string'){this.log.error(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} could not load Renderable; RenderableHash or TemplateHash are invalid.`,tmpRenderable);}else{if(this.pict.LogNoisiness>0){this.log.trace(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} adding renderable [${tmpRenderable.RenderableHash}] pointed to template ${tmpRenderable.TemplateHash}.`);}this.renderables[tmpRenderable.RenderableHash]=tmpRenderable;}}/* -------------------------------------------------------------------------- *//*                        Code Section: Initialization                        *//* -------------------------------------------------------------------------- *//**
	 * Lifecycle hook that triggers before the view is initialized.
	 */onBeforeInitialize(){if(this.pict.LogNoisiness>3){this.log.trace(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} onBeforeInitialize:`);}return true;}/**
	 * Lifecycle hook that triggers before the view is initialized (async flow).
	 *
	 * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
	 */onBeforeInitializeAsync(fCallback){this.onBeforeInitialize();return fCallback();}/**
	 * Lifecycle hook that triggers when the view is initialized.
	 */onInitialize(){if(this.pict.LogNoisiness>3){this.log.trace(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} onInitialize:`);}return true;}/**
	 * Lifecycle hook that triggers when the view is initialized (async flow).
	 *
	 * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
	 */onInitializeAsync(fCallback){this.onInitialize();return fCallback();}/**
	 * Performs view initialization.
	 */initialize(){if(this.pict.LogControlFlow){this.log.trace(`PICT-ControlFlow VIEW [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} initialize:`);}if(!this.initializeTimestamp){this.onBeforeInitialize();this.onInitialize();this.onAfterInitialize();this.initializeTimestamp=this.pict.log.getTimeStamp();return true;}else{this.log.warn(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} initialize called but initialization is already completed.  Aborting.`);return false;}}/**
	 * Performs view initialization (async flow).
	 *
	 * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
	 */initializeAsync(fCallback){if(this.pict.LogControlFlow){this.log.trace(`PICT-ControlFlow VIEW [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} initializeAsync:`);}if(!this.initializeTimestamp){let tmpAnticipate=this.pict.instantiateServiceProviderWithoutRegistration('Anticipate');if(this.pict.LogNoisiness>0){this.log.info(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} beginning initialization...`);}tmpAnticipate.anticipate(this.onBeforeInitializeAsync.bind(this));tmpAnticipate.anticipate(this.onInitializeAsync.bind(this));tmpAnticipate.anticipate(this.onAfterInitializeAsync.bind(this));tmpAnticipate.wait(/** @param {Error} pError */pError=>{if(pError){this.log.error(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} initialization failed: ${pError.message||pError}`,{stack:pError.stack});}this.initializeTimestamp=this.pict.log.getTimeStamp();if(this.pict.LogNoisiness>0){this.log.info(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} initialization complete.`);}return fCallback();});}else{this.log.warn(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} async initialize called but initialization is already completed.  Aborting.`);// TODO: Should this be an error?
return fCallback();}}onAfterInitialize(){if(this.pict.LogNoisiness>3){this.log.trace(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} onAfterInitialize:`);}return true;}/**
	 * Lifecycle hook that triggers after the view is initialized (async flow).
	 *
	 * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
	 */onAfterInitializeAsync(fCallback){this.onAfterInitialize();return fCallback();}/* -------------------------------------------------------------------------- *//*                            Code Section: Render                            *//* -------------------------------------------------------------------------- *//**
	 * Lifecycle hook that triggers before the view is rendered.
	 *
	 * @param {Renderable} pRenderable - The renderable that will be rendered.
	 */onBeforeRender(pRenderable){// Overload this to mess with stuff before the content gets generated from the template
if(this.pict.LogNoisiness>3){this.log.trace(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} onBeforeRender:`);}return true;}/**
	 * Lifecycle hook that triggers before the view is rendered (async flow).
	 *
	 * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
	 * @param {Renderable} pRenderable - The renderable that will be rendered.
	 */onBeforeRenderAsync(fCallback,pRenderable){this.onBeforeRender(pRenderable);return fCallback();}/**
	 * Lifecycle hook that triggers before the view is projected into the DOM.
	 *
	 * @param {Renderable} pRenderable - The renderable that will be projected.
	 */onBeforeProject(pRenderable){// Overload this to mess with stuff before the content gets generated from the template
if(this.pict.LogNoisiness>3){this.log.trace(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} onBeforeProject:`);}return true;}/**
	 * Lifecycle hook that triggers before the view is projected into the DOM (async flow).
	 *
	 * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
	 * @param {Renderable} pRenderable - The renderable that will be projected.
	 */onBeforeProjectAsync(fCallback,pRenderable){this.onBeforeProject(pRenderable);return fCallback();}/**
	 * Builds the render options for a renderable.
	 *
	 * For DRY purposes on the three flavors of render.
	 *
	 * @param {string|ErrorCallback} [pRenderableHash] - The hash of the renderable to render.
	 * @param {string|ErrorCallback} [pRenderDestinationAddress] - The address where the renderable will be rendered.
	 * @param {string|object|ErrorCallback} [pTemplateRecordAddress] - The address of (or actual obejct) where the data for the template is stored.
	 */buildRenderOptions(pRenderableHash,pRenderDestinationAddress,pTemplateRecordAddress){let tmpRenderOptions={Valid:true};tmpRenderOptions.RenderableHash=typeof pRenderableHash==='string'?pRenderableHash:typeof this.options.DefaultRenderable=='string'?this.options.DefaultRenderable:false;if(!tmpRenderOptions.RenderableHash){this.log.error(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} could not find a suitable RenderableHash ${tmpRenderOptions.RenderableHash} (param ${pRenderableHash}because it is not a valid renderable.`);tmpRenderOptions.Valid=false;}tmpRenderOptions.Renderable=this.renderables[tmpRenderOptions.RenderableHash];if(!tmpRenderOptions.Renderable){this.log.error(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} could not render ${tmpRenderOptions.RenderableHash} (param ${pRenderableHash}) because it does not exist.`);tmpRenderOptions.Valid=false;}tmpRenderOptions.DestinationAddress=typeof pRenderDestinationAddress==='string'?pRenderDestinationAddress:typeof tmpRenderOptions.Renderable.ContentDestinationAddress==='string'?tmpRenderOptions.Renderable.ContentDestinationAddress:typeof this.options.DefaultDestinationAddress==='string'?this.options.DefaultDestinationAddress:false;if(!tmpRenderOptions.DestinationAddress){this.log.error(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} could not render ${tmpRenderOptions.RenderableHash} (param ${pRenderableHash}) because it does not have a valid destination address (param ${pRenderDestinationAddress}).`);tmpRenderOptions.Valid=false;}if(typeof pTemplateRecordAddress==='object'){tmpRenderOptions.RecordAddress='Passed in as object';tmpRenderOptions.Record=pTemplateRecordAddress;}else{tmpRenderOptions.RecordAddress=typeof pTemplateRecordAddress==='string'?pTemplateRecordAddress:typeof tmpRenderOptions.Renderable.DefaultTemplateRecordAddress==='string'?tmpRenderOptions.Renderable.DefaultTemplateRecordAddress:typeof this.options.DefaultTemplateRecordAddress==='string'?this.options.DefaultTemplateRecordAddress:false;tmpRenderOptions.Record=typeof tmpRenderOptions.RecordAddress==='string'?this.pict.DataProvider.getDataByAddress(tmpRenderOptions.RecordAddress):undefined;}return tmpRenderOptions;}/**
	 * Assigns the content to the destination address.
	 *
	 * For DRY purposes on the three flavors of render.
	 *
	 * @param {Renderable} pRenderable - The renderable to render.
	 * @param {string} pRenderDestinationAddress - The address where the renderable will be rendered.
	 * @param {string} pContent - The content to render.
	 * @returns {boolean} - Returns true if the content was assigned successfully.
	 * @memberof PictView
	 */assignRenderContent(pRenderable,pRenderDestinationAddress,pContent){return this.pict.ContentAssignment.projectContent(pRenderable.RenderMethod,pRenderDestinationAddress,pContent,pRenderable.TestAddress);}/**
	 * Render a renderable from this view.
	 *
	 * @param {string} [pRenderableHash] - The hash of the renderable to render.
	 * @param {string} [pRenderDestinationAddress] - The address where the renderable will be rendered.
	 * @param {string|object} [pTemplateRecordAddress] - The address where the data for the template is stored.
	 * @param {Renderable} [pRootRenderable] - The root renderable for the render operation, if applicable.
	 * @return {boolean}
	 */render(pRenderableHash,pRenderDestinationAddress,pTemplateRecordAddress,pRootRenderable){return this.renderWithScope(this,pRenderableHash,pRenderDestinationAddress,pTemplateRecordAddress,pRootRenderable);}/**
	 * Render a renderable from this view, providing a specifici scope for the template.
	 *
	 * @param {any} pScope - The scope to use for the template rendering.
	 * @param {string} [pRenderableHash] - The hash of the renderable to render.
	 * @param {string} [pRenderDestinationAddress] - The address where the renderable will be rendered.
	 * @param {string|object} [pTemplateRecordAddress] - The address where the data for the template is stored.
	 * @param {Renderable} [pRootRenderable] - The root renderable for the render operation, if applicable.
	 * @return {boolean}
	 */renderWithScope(pScope,pRenderableHash,pRenderDestinationAddress,pTemplateRecordAddress,pRootRenderable){let tmpRenderableHash=typeof pRenderableHash==='string'?pRenderableHash:typeof this.options.DefaultRenderable=='string'?this.options.DefaultRenderable:false;if(!tmpRenderableHash){this.log.error(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} could not render ${tmpRenderableHash} (param ${pRenderableHash}) because it is not a valid renderable.`);return false;}/** @type {Renderable} */let tmpRenderable;if(tmpRenderableHash=='__Virtual'){tmpRenderable={RenderableHash:'__Virtual',TemplateHash:this.renderables[this.options.DefaultRenderable].TemplateHash,ContentDestinationAddress:typeof pRenderDestinationAddress==='string'?pRenderDestinationAddress:typeof tmpRenderable.ContentDestinationAddress==='string'?tmpRenderable.ContentDestinationAddress:typeof this.options.DefaultDestinationAddress==='string'?this.options.DefaultDestinationAddress:null,RenderMethod:'virtual-assignment',TransactionHash:pRootRenderable&&pRootRenderable.TransactionHash,RootRenderableViewHash:pRootRenderable&&pRootRenderable.RootRenderableViewHash};}else{tmpRenderable=Object.assign({},this.renderables[tmpRenderableHash]);tmpRenderable.ContentDestinationAddress=typeof pRenderDestinationAddress==='string'?pRenderDestinationAddress:typeof tmpRenderable.ContentDestinationAddress==='string'?tmpRenderable.ContentDestinationAddress:typeof this.options.DefaultDestinationAddress==='string'?this.options.DefaultDestinationAddress:null;}if(!tmpRenderable.TransactionHash){tmpRenderable.TransactionHash=`ViewRender-V-${this.options.ViewIdentifier}-R-${tmpRenderableHash}-U-${this.pict.getUUID()}`;tmpRenderable.RootRenderableViewHash=this.Hash;this.pict.TransactionTracking.registerTransaction(tmpRenderable.TransactionHash);}if(!tmpRenderable){this.log.error(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} could not render ${tmpRenderableHash} (param ${pRenderableHash}) because it does not exist.`);return false;}if(!tmpRenderable.ContentDestinationAddress){this.log.error(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} could not render ${tmpRenderableHash} (param ${pRenderableHash}) because it does not have a valid destination address.`);return false;}let tmpRecordAddress;let tmpRecord;if(typeof pTemplateRecordAddress==='object'){tmpRecord=pTemplateRecordAddress;tmpRecordAddress='Passed in as object';}else{tmpRecordAddress=typeof pTemplateRecordAddress==='string'?pTemplateRecordAddress:typeof tmpRenderable.DefaultTemplateRecordAddress==='string'?tmpRenderable.DefaultTemplateRecordAddress:typeof this.options.DefaultTemplateRecordAddress==='string'?this.options.DefaultTemplateRecordAddress:false;tmpRecord=typeof tmpRecordAddress==='string'?this.pict.DataProvider.getDataByAddress(tmpRecordAddress):undefined;}// Execute the developer-overridable pre-render behavior
this.onBeforeRender(tmpRenderable);if(this.pict.LogControlFlow){this.log.trace(`PICT-ControlFlow VIEW [${this.UUID}]::[${this.Hash}] Renderable[${tmpRenderableHash}] Destination[${tmpRenderable.ContentDestinationAddress}] TemplateRecordAddress[${tmpRecordAddress}] render:`);}if(this.pict.LogNoisiness>0){this.log.trace(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} Beginning Render of Renderable[${tmpRenderableHash}] to Destination [${tmpRenderable.ContentDestinationAddress}]...`);}// Generate the content output from the template and data
tmpRenderable.Content=this.pict.parseTemplateByHash(tmpRenderable.TemplateHash,tmpRecord,null,[this],pScope,{RootRenderable:typeof pRootRenderable==='object'?pRootRenderable:tmpRenderable});if(this.pict.LogNoisiness>0){this.log.trace(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} Assigning Renderable[${tmpRenderableHash}] content length ${tmpRenderable.Content.length} to Destination [${tmpRenderable.ContentDestinationAddress}] using render method [${tmpRenderable.RenderMethod}].`);}this.onBeforeProject(tmpRenderable);this.onProject(tmpRenderable);if(tmpRenderable.RenderMethod!=='virtual-assignment'){this.onAfterProject(tmpRenderable);// Execute the developer-overridable post-render behavior
this.onAfterRender(tmpRenderable);}return true;}/**
	 * Render a renderable from this view.
	 *
	 * @param {string|ErrorCallback} [pRenderableHash] - The hash of the renderable to render.
	 * @param {string|ErrorCallback} [pRenderDestinationAddress] - The address where the renderable will be rendered.
	 * @param {string|object|ErrorCallback} [pTemplateRecordAddress] - The address where the data for the template is stored.
	 * @param {Renderable|ErrorCallback} [pRootRenderable] - The root renderable for the render operation, if applicable.
	 * @param {ErrorCallback} [fCallback] - The callback to call when the async operation is complete.
	 *
	 * @return {void}
	 */renderAsync(pRenderableHash,pRenderDestinationAddress,pTemplateRecordAddress,pRootRenderable,fCallback){return this.renderWithScopeAsync(this,pRenderableHash,pRenderDestinationAddress,pTemplateRecordAddress,pRootRenderable,fCallback);}/**
	 * Render a renderable from this view.
	 *
	 * @param {any} pScope - The scope to use for the template rendering.
	 * @param {string|ErrorCallback} [pRenderableHash] - The hash of the renderable to render.
	 * @param {string|ErrorCallback} [pRenderDestinationAddress] - The address where the renderable will be rendered.
	 * @param {string|object|ErrorCallback} [pTemplateRecordAddress] - The address where the data for the template is stored.
	 * @param {Renderable|ErrorCallback} [pRootRenderable] - The root renderable for the render operation, if applicable.
	 * @param {ErrorCallback} [fCallback] - The callback to call when the async operation is complete.
	 *
	 * @return {void}
	 */renderWithScopeAsync(pScope,pRenderableHash,pRenderDestinationAddress,pTemplateRecordAddress,pRootRenderable,fCallback){let tmpRenderableHash=typeof pRenderableHash==='string'?pRenderableHash:typeof this.options.DefaultRenderable=='string'?this.options.DefaultRenderable:false;// Allow the callback to be passed in as the last parameter no matter what
/** @type {ErrorCallback} */let tmpCallback=typeof fCallback==='function'?fCallback:typeof pTemplateRecordAddress==='function'?pTemplateRecordAddress:typeof pRenderDestinationAddress==='function'?pRenderDestinationAddress:typeof pRenderableHash==='function'?pRenderableHash:typeof pRootRenderable==='function'?pRootRenderable:null;if(!tmpCallback){this.log.warn(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.Name} renderAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions.`);tmpCallback=pError=>{if(pError){this.log.error(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.Name} renderAsync Auto Callback Error: ${pError}`,pError);}};}if(!tmpRenderableHash){this.log.error(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} could not asynchronously render ${tmpRenderableHash} (param ${pRenderableHash}because it is not a valid renderable.`);return tmpCallback(new Error(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} could not asynchronously render ${tmpRenderableHash} (param ${pRenderableHash}because it is not a valid renderable.`));}/** @type {Renderable} */let tmpRenderable;if(tmpRenderableHash=='__Virtual'){tmpRenderable={RenderableHash:'__Virtual',TemplateHash:this.renderables[this.options.DefaultRenderable].TemplateHash,ContentDestinationAddress:typeof pRenderDestinationAddress==='string'?pRenderDestinationAddress:typeof this.options.DefaultDestinationAddress==='string'?this.options.DefaultDestinationAddress:null,RenderMethod:'virtual-assignment',TransactionHash:pRootRenderable&&typeof pRootRenderable!=='function'&&pRootRenderable.TransactionHash,RootRenderableViewHash:pRootRenderable&&typeof pRootRenderable!=='function'&&pRootRenderable.RootRenderableViewHash};}else{tmpRenderable=Object.assign({},this.renderables[tmpRenderableHash]);tmpRenderable.ContentDestinationAddress=typeof pRenderDestinationAddress==='string'?pRenderDestinationAddress:typeof tmpRenderable.ContentDestinationAddress==='string'?tmpRenderable.ContentDestinationAddress:typeof this.options.DefaultDestinationAddress==='string'?this.options.DefaultDestinationAddress:null;}if(!tmpRenderable.TransactionHash){tmpRenderable.TransactionHash=`ViewRender-V-${this.options.ViewIdentifier}-R-${tmpRenderableHash}-U-${this.pict.getUUID()}`;tmpRenderable.RootRenderableViewHash=this.Hash;this.pict.TransactionTracking.registerTransaction(tmpRenderable.TransactionHash);}if(!tmpRenderable){this.log.error(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} could not render ${tmpRenderableHash} (param ${pRenderableHash}) because it does not exist.`);return tmpCallback(new Error(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} could not render ${tmpRenderableHash} (param ${pRenderableHash}) because it does not exist.`));}if(!tmpRenderable.ContentDestinationAddress){this.log.error(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} could not render ${tmpRenderableHash} (param ${pRenderableHash}) because it does not have a valid destination address.`);return tmpCallback(new Error(`Could not render ${tmpRenderableHash}`));}let tmpRecordAddress;let tmpRecord;if(typeof pTemplateRecordAddress==='object'){tmpRecord=pTemplateRecordAddress;tmpRecordAddress='Passed in as object';}else{tmpRecordAddress=typeof pTemplateRecordAddress==='string'?pTemplateRecordAddress:typeof tmpRenderable.DefaultTemplateRecordAddress==='string'?tmpRenderable.DefaultTemplateRecordAddress:typeof this.options.DefaultTemplateRecordAddress==='string'?this.options.DefaultTemplateRecordAddress:false;tmpRecord=typeof tmpRecordAddress==='string'?this.pict.DataProvider.getDataByAddress(tmpRecordAddress):undefined;}if(this.pict.LogControlFlow){this.log.trace(`PICT-ControlFlow VIEW [${this.UUID}]::[${this.Hash}] Renderable[${tmpRenderableHash}] Destination[${tmpRenderable.ContentDestinationAddress}] TemplateRecordAddress[${tmpRecordAddress}] renderAsync:`);}if(this.pict.LogNoisiness>2){this.log.trace(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} Beginning Asynchronous Render (callback-style)...`);}let tmpAnticipate=this.fable.newAnticipate();tmpAnticipate.anticipate(fOnBeforeRenderCallback=>{this.onBeforeRenderAsync(fOnBeforeRenderCallback,tmpRenderable);});tmpAnticipate.anticipate(fAsyncTemplateCallback=>{// Render the template (asynchronously)
this.pict.parseTemplateByHash(tmpRenderable.TemplateHash,tmpRecord,(pError,pContent)=>{if(pError){this.log.error(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} could not render (asynchronously) ${tmpRenderableHash} (param ${pRenderableHash}) because it did not parse the template.`,pError);return fAsyncTemplateCallback(pError);}tmpRenderable.Content=pContent;return fAsyncTemplateCallback();},[this],pScope,{RootRenderable:typeof pRootRenderable==='object'?pRootRenderable:tmpRenderable});});tmpAnticipate.anticipate(fNext=>{this.onBeforeProjectAsync(fNext,tmpRenderable);});tmpAnticipate.anticipate(fNext=>{this.onProjectAsync(fNext,tmpRenderable);});if(tmpRenderable.RenderMethod!=='virtual-assignment'){tmpAnticipate.anticipate(fNext=>{this.onAfterProjectAsync(fNext,tmpRenderable);});// Execute the developer-overridable post-render behavior
tmpAnticipate.anticipate(fNext=>{this.onAfterRenderAsync(fNext,tmpRenderable);});}tmpAnticipate.wait(tmpCallback);}/**
	 * Renders the default renderable.
	 *
	 * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
	 */renderDefaultAsync(fCallback){// Render the default renderable
this.renderAsync(fCallback);}/**
	 * @param {string} [pRenderableHash] - The hash of the renderable to render.
	 * @param {string} [pRenderDestinationAddress] - The address where the renderable will be rendered.
	 * @param {string|object} [pTemplateRecordAddress] - The address of (or actual obejct) where the data for the template is stored.
	 */basicRender(pRenderableHash,pRenderDestinationAddress,pTemplateRecordAddress){return this.basicRenderWithScope(this,pRenderableHash,pRenderDestinationAddress,pTemplateRecordAddress);}/**
	 * @param {any} pScope - The scope to use for the template rendering.
	 * @param {string} [pRenderableHash] - The hash of the renderable to render.
	 * @param {string} [pRenderDestinationAddress] - The address where the renderable will be rendered.
	 * @param {string|object} [pTemplateRecordAddress] - The address of (or actual obejct) where the data for the template is stored.
	 */basicRenderWithScope(pScope,pRenderableHash,pRenderDestinationAddress,pTemplateRecordAddress){let tmpRenderOptions=this.buildRenderOptions(pRenderableHash,pRenderDestinationAddress,pTemplateRecordAddress);if(tmpRenderOptions.Valid){this.assignRenderContent(tmpRenderOptions.Renderable,tmpRenderOptions.DestinationAddress,this.pict.parseTemplateByHash(tmpRenderOptions.Renderable.TemplateHash,tmpRenderOptions.Record,null,[this],pScope,{RootRenderable:tmpRenderOptions.Renderable}));return true;}else{this.log.error(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} could not perform a basic render of ${tmpRenderOptions.RenderableHash} because it is not valid.`);return false;}}/**
	 * @param {string|ErrorCallback} [pRenderableHash] - The hash of the renderable to render.
	 * @param {string|ErrorCallback} [pRenderDestinationAddress] - The address where the renderable will be rendered.
	 * @param {string|Object|ErrorCallback} [pTemplateRecordAddress] - The address of (or actual obejct) where the data for the template is stored.
	 * @param {ErrorCallback} [fCallback] - The callback to call when the async operation is complete.
	 */basicRenderAsync(pRenderableHash,pRenderDestinationAddress,pTemplateRecordAddress,fCallback){return this.basicRenderWithScopeAsync(this,pRenderableHash,pRenderDestinationAddress,pTemplateRecordAddress,fCallback);}/**
	 * @param {any} pScope - The scope to use for the template rendering.
	 * @param {string|ErrorCallback} [pRenderableHash] - The hash of the renderable to render.
	 * @param {string|ErrorCallback} [pRenderDestinationAddress] - The address where the renderable will be rendered.
	 * @param {string|Object|ErrorCallback} [pTemplateRecordAddress] - The address of (or actual obejct) where the data for the template is stored.
	 * @param {ErrorCallback} [fCallback] - The callback to call when the async operation is complete.
	 */basicRenderWithScopeAsync(pScope,pRenderableHash,pRenderDestinationAddress,pTemplateRecordAddress,fCallback){// Allow the callback to be passed in as the last parameter no matter what
/** @type {ErrorCallback} */let tmpCallback=typeof fCallback==='function'?fCallback:typeof pTemplateRecordAddress==='function'?pTemplateRecordAddress:typeof pRenderDestinationAddress==='function'?pRenderDestinationAddress:typeof pRenderableHash==='function'?pRenderableHash:null;if(!tmpCallback){this.log.warn(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.Name} basicRenderAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions.`);tmpCallback=pError=>{if(pError){this.log.error(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.Name} basicRenderAsync Auto Callback Error: ${pError}`,pError);}};}const tmpRenderOptions=this.buildRenderOptions(pRenderableHash,pRenderDestinationAddress,pTemplateRecordAddress);if(tmpRenderOptions.Valid){this.pict.parseTemplateByHash(tmpRenderOptions.Renderable.TemplateHash,tmpRenderOptions.Record,/**
				 * @param {Error} [pError] - The error that occurred during template parsing.
				 * @param {string} [pContent] - The content that was rendered from the template.
				 */(pError,pContent)=>{if(pError){this.log.error(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} could not render (asynchronously) ${tmpRenderOptions.RenderableHash} because it did not parse the template.`,pError);return tmpCallback(pError);}this.assignRenderContent(tmpRenderOptions.Renderable,tmpRenderOptions.DestinationAddress,pContent);return tmpCallback();},[this],pScope,{RootRenderable:tmpRenderOptions.Renderable});}else{let tmpErrorMessage=`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} could not perform a basic render of ${tmpRenderOptions.RenderableHash} because it is not valid.`;this.log.error(tmpErrorMessage);return tmpCallback(new Error(tmpErrorMessage));}}/**
	 * @param {Renderable} pRenderable - The renderable that was rendered.
	 */onProject(pRenderable){if(this.pict.LogNoisiness>3){this.log.trace(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} onProject:`);}if(pRenderable.RenderMethod==='virtual-assignment'){this.pict.TransactionTracking.pushToTransactionQueue(pRenderable.TransactionHash,{ViewHash:this.Hash,Renderable:pRenderable},'Deferred-Post-Content-Assignment');}if(this.pict.LogNoisiness>0){this.log.trace(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} Assigning Renderable[${pRenderable.RenderableHash}] content length ${pRenderable.Content.length} to Destination [${pRenderable.ContentDestinationAddress}] using Async render method ${pRenderable.RenderMethod}.`);}// Assign the content to the destination address
this.pict.ContentAssignment.projectContent(pRenderable.RenderMethod,pRenderable.ContentDestinationAddress,pRenderable.Content,pRenderable.TestAddress);this.lastRenderedTimestamp=this.pict.log.getTimeStamp();}/**
	 * Lifecycle hook that triggers after the view is projected into the DOM (async flow).
	 *
	 * @param {(error?: Error, content?: string) => void} fCallback - The callback to call when the async operation is complete.
	 * @param {Renderable} pRenderable - The renderable that is being projected.
	 */onProjectAsync(fCallback,pRenderable){this.onProject(pRenderable);return fCallback();}/**
	 * Lifecycle hook that triggers after the view is rendered.
	 *
	 * @param {Renderable} pRenderable - The renderable that was rendered.
	 */onAfterRender(pRenderable){if(this.pict.LogNoisiness>3){this.log.trace(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} onAfterRender:`);}if(pRenderable&&pRenderable.RootRenderableViewHash===this.Hash){const tmpTransactionQueue=this.pict.TransactionTracking.clearTransactionQueue(pRenderable.TransactionHash)||[];for(const tmpEvent of tmpTransactionQueue){const tmpView=this.pict.views[tmpEvent.Data.ViewHash];if(!tmpView){this.log.error(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} onAfterRender: Could not find view for transaction hash ${pRenderable.TransactionHash} and ViewHash ${tmpEvent.Data.ViewHash}.`);continue;}tmpView.onAfterProject();// Execute the developer-overridable post-render behavior
tmpView.onAfterRender(tmpEvent.Data.Renderable);}// Queue is drained and nested child renders have each cleaned up
// their own transactions; remove this root render's entry from
// the tracking map so it does not leak.
this.pict.TransactionTracking.unregisterTransaction(pRenderable.TransactionHash);}return true;}/**
	 * Lifecycle hook that triggers after the view is rendered (async flow).
	 *
	 * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
	 * @param {Renderable} pRenderable - The renderable that was rendered.
	 */onAfterRenderAsync(fCallback,pRenderable){// NOTE: this.onAfterRender(pRenderable) will itself clear the
// transaction queue and unregister the transaction if this view is
// the root renderable - see onAfterRender above. So by the time the
// loop below runs, the queue is already empty and there is nothing
// to drain. Keeping the async queue walk here defensively in case
// future subclasses override onAfterRender in ways that skip the
// drain, but the common path is now "sync drain, async no-op".
this.onAfterRender(pRenderable);const tmpAnticipate=this.fable.newAnticipate();const tmpIsRootRenderable=pRenderable&&pRenderable.RootRenderableViewHash===this.Hash;if(tmpIsRootRenderable){const queue=this.pict.TransactionTracking.clearTransactionQueue(pRenderable.TransactionHash)||[];for(const event of queue){/** @type {PictView} */const tmpView=this.pict.views[event.Data.ViewHash];if(!tmpView){this.log.error(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} onAfterRenderAsync: Could not find view for transaction hash ${pRenderable.TransactionHash} and ViewHash ${event.Data.ViewHash}.`);continue;}tmpAnticipate.anticipate(tmpView.onAfterProjectAsync.bind(tmpView));tmpAnticipate.anticipate(fNext=>{tmpView.onAfterRenderAsync(fNext,event.Data.Renderable);});// Execute the developer-overridable post-render behavior
}}return tmpAnticipate.wait(pError=>{// Nested virtual-assignment children have now settled their own
// onAfterRenderAsync chains (and unregistered their own
// transactions along the way). Ensure this root render's entry
// is also gone - unregisterTransaction is a no-op if the sync
// onAfterRender above already removed it, so this is safe to
// call unconditionally on the root path.
if(tmpIsRootRenderable&&pRenderable&&pRenderable.TransactionHash){this.pict.TransactionTracking.unregisterTransaction(pRenderable.TransactionHash);}return fCallback(pError);});}/**
	 * Lifecycle hook that triggers after the view is projected into the DOM.
	 *
	 * @param {Renderable} pRenderable - The renderable that was projected.
	 */onAfterProject(pRenderable){if(this.pict.LogNoisiness>3){this.log.trace(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} onAfterProject:`);}return true;}/**
	 * Lifecycle hook that triggers after the view is projected into the DOM (async flow).
	 *
	 * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
	 * @param {Renderable} pRenderable - The renderable that was projected.
	 */onAfterProjectAsync(fCallback,pRenderable){return fCallback();}/* -------------------------------------------------------------------------- *//*                            Code Section: Solver                            *//* -------------------------------------------------------------------------- *//**
	 * Lifecycle hook that triggers before the view is solved.
	 */onBeforeSolve(){if(this.pict.LogNoisiness>3){this.log.trace(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} onBeforeSolve:`);}return true;}/**
	 * Lifecycle hook that triggers before the view is solved (async flow).
	 *
	 * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
	 */onBeforeSolveAsync(fCallback){this.onBeforeSolve();return fCallback();}/**
	 * Lifecycle hook that triggers when the view is solved.
	 */onSolve(){if(this.pict.LogNoisiness>3){this.log.trace(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} onSolve:`);}return true;}/**
	 * Lifecycle hook that triggers when the view is solved (async flow).
	 *
	 * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
	 */onSolveAsync(fCallback){this.onSolve();return fCallback();}/**
	 * Performs view solving and triggers lifecycle hooks.
	 *
	 * @return {boolean} - True if the view was solved successfully, false otherwise.
	 */solve(){if(this.pict.LogNoisiness>2){this.log.trace(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} executing solve() function...`);}this.onBeforeSolve();this.onSolve();this.onAfterSolve();this.lastSolvedTimestamp=this.pict.log.getTimeStamp();return true;}/**
	 * Performs view solving and triggers lifecycle hooks (async flow).
	 *
	 * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
	 */solveAsync(fCallback){let tmpAnticipate=this.pict.instantiateServiceProviderWithoutRegistration('Anticipate');/** @type {ErrorCallback} */let tmpCallback=typeof fCallback==='function'?fCallback:null;if(!tmpCallback){this.log.warn(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.Name} solveAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions.`);tmpCallback=pError=>{if(pError){this.log.error(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.Name} solveAsync Auto Callback Error: ${pError}`,pError);}};}tmpAnticipate.anticipate(this.onBeforeSolveAsync.bind(this));tmpAnticipate.anticipate(this.onSolveAsync.bind(this));tmpAnticipate.anticipate(this.onAfterSolveAsync.bind(this));tmpAnticipate.wait(pError=>{if(this.pict.LogNoisiness>2){this.log.trace(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} solveAsync() complete.`);}this.lastSolvedTimestamp=this.pict.log.getTimeStamp();return tmpCallback(pError);});}/**
	 * Lifecycle hook that triggers after the view is solved.
	 */onAfterSolve(){if(this.pict.LogNoisiness>3){this.log.trace(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} onAfterSolve:`);}return true;}/**
	 * Lifecycle hook that triggers after the view is solved (async flow).
	 *
	 * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
	 */onAfterSolveAsync(fCallback){this.onAfterSolve();return fCallback();}/* -------------------------------------------------------------------------- *//*                     Code Section: Marshal From View                        *//* -------------------------------------------------------------------------- *//**
	 * Lifecycle hook that triggers before data is marshaled from the view.
	 *
	 * @return {boolean} - True if the operation was successful, false otherwise.
	 */onBeforeMarshalFromView(){if(this.pict.LogNoisiness>3){this.log.trace(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} onBeforeMarshalFromView:`);}return true;}/**
	 * Lifecycle hook that triggers before data is marshaled from the view (async flow).
	 *
	 * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
	 */onBeforeMarshalFromViewAsync(fCallback){this.onBeforeMarshalFromView();return fCallback();}/**
	 * Lifecycle hook that triggers when data is marshaled from the view.
	 */onMarshalFromView(){if(this.pict.LogNoisiness>3){this.log.trace(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} onMarshalFromView:`);}return true;}/**
	 * Lifecycle hook that triggers when data is marshaled from the view (async flow).
	 *
	 * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
	 */onMarshalFromViewAsync(fCallback){this.onMarshalFromView();return fCallback();}/**
	 * Marshals data from the view.
	 *
	 * @return {boolean} - True if the operation was successful, false otherwise.
	 */marshalFromView(){if(this.pict.LogNoisiness>2){this.log.trace(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} executing solve() function...`);}this.onBeforeMarshalFromView();this.onMarshalFromView();this.onAfterMarshalFromView();this.lastMarshalFromViewTimestamp=this.pict.log.getTimeStamp();return true;}/**
	 * Marshals data from the view (async flow).
	 *
	 * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
	 */marshalFromViewAsync(fCallback){let tmpAnticipate=this.pict.instantiateServiceProviderWithoutRegistration('Anticipate');/** @type {ErrorCallback} */let tmpCallback=typeof fCallback==='function'?fCallback:null;if(!tmpCallback){this.log.warn(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.Name} marshalFromViewAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions.`);tmpCallback=pError=>{if(pError){this.log.error(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.Name} marshalFromViewAsync Auto Callback Error: ${pError}`,pError);}};}tmpAnticipate.anticipate(this.onBeforeMarshalFromViewAsync.bind(this));tmpAnticipate.anticipate(this.onMarshalFromViewAsync.bind(this));tmpAnticipate.anticipate(this.onAfterMarshalFromViewAsync.bind(this));tmpAnticipate.wait(pError=>{if(this.pict.LogNoisiness>2){this.log.trace(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} marshalFromViewAsync() complete.`);}this.lastMarshalFromViewTimestamp=this.pict.log.getTimeStamp();return tmpCallback(pError);});}/**
	 * Lifecycle hook that triggers after data is marshaled from the view.
	 */onAfterMarshalFromView(){if(this.pict.LogNoisiness>3){this.log.trace(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} onAfterMarshalFromView:`);}return true;}/**
	 * Lifecycle hook that triggers after data is marshaled from the view (async flow).
	 *
	 * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
	 */onAfterMarshalFromViewAsync(fCallback){this.onAfterMarshalFromView();return fCallback();}/* -------------------------------------------------------------------------- *//*                     Code Section: Marshal To View                          *//* -------------------------------------------------------------------------- *//**
	 * Lifecycle hook that triggers before data is marshaled into the view.
	 */onBeforeMarshalToView(){if(this.pict.LogNoisiness>3){this.log.trace(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} onBeforeMarshalToView:`);}return true;}/**
	 * Lifecycle hook that triggers before data is marshaled into the view (async flow).
	 *
	 * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
	 */onBeforeMarshalToViewAsync(fCallback){this.onBeforeMarshalToView();return fCallback();}/**
	 * Lifecycle hook that triggers when data is marshaled into the view.
	 */onMarshalToView(){if(this.pict.LogNoisiness>3){this.log.trace(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} onMarshalToView:`);}return true;}/**
	 * Lifecycle hook that triggers when data is marshaled into the view (async flow).
	 *
	 * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
	 */onMarshalToViewAsync(fCallback){this.onMarshalToView();return fCallback();}/**
	 * Marshals data into the view.
	 *
	 * @return {boolean} - True if the operation was successful, false otherwise.
	 */marshalToView(){if(this.pict.LogNoisiness>2){this.log.trace(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} executing solve() function...`);}this.onBeforeMarshalToView();this.onMarshalToView();this.onAfterMarshalToView();this.lastMarshalToViewTimestamp=this.pict.log.getTimeStamp();return true;}/**
	 * Marshals data into the view (async flow).
	 *
	 * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
	 */marshalToViewAsync(fCallback){let tmpAnticipate=this.pict.instantiateServiceProviderWithoutRegistration('Anticipate');/** @type {ErrorCallback} */let tmpCallback=typeof fCallback==='function'?fCallback:null;if(!tmpCallback){this.log.warn(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.Name} marshalToViewAsync was called without a valid callback.  A callback will be generated but this could lead to race conditions.`);tmpCallback=pError=>{if(pError){this.log.error(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.Name} marshalToViewAsync Auto Callback Error: ${pError}`,pError);}};}tmpAnticipate.anticipate(this.onBeforeMarshalToViewAsync.bind(this));tmpAnticipate.anticipate(this.onMarshalToViewAsync.bind(this));tmpAnticipate.anticipate(this.onAfterMarshalToViewAsync.bind(this));tmpAnticipate.wait(pError=>{if(this.pict.LogNoisiness>2){this.log.trace(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} marshalToViewAsync() complete.`);}this.lastMarshalToViewTimestamp=this.pict.log.getTimeStamp();return tmpCallback(pError);});}/**
	 * Lifecycle hook that triggers after data is marshaled into the view.
	 */onAfterMarshalToView(){if(this.pict.LogNoisiness>3){this.log.trace(`PictView [${this.UUID}]::[${this.Hash}] ${this.options.ViewIdentifier} onAfterMarshalToView:`);}return true;}/**
	 * Lifecycle hook that triggers after data is marshaled into the view (async flow).
	 *
	 * @param {ErrorCallback} fCallback - The callback to call when the async operation is complete.
	 */onAfterMarshalToViewAsync(fCallback){this.onAfterMarshalToView();return fCallback();}/** @return {boolean} - True if the object is a PictView. */get isPictView(){return true;}}module.exports=PictView;},{"../package.json":93,"fable-serviceproviderbase":2}],95:[function(require,module,exports){/**
 * Pict-Beacon-WebAuth-Client — pict-app helper for beacon login UIs
 *
 * Companion to Ultravisor-Beacon-WebAuth.cjs on the server side.  Any
 * beacon whose pict-app wants the same three-mode gate Ultravisor's UI
 * has (promiscuous → just works; authenticated → forced through login;
 * external-auth → in-app user mgmt hidden) imports this and calls
 * `install(pict, options)` from its application constructor.
 *
 * What this module does:
 *
 *   1. Registers `pict-section-login` as a view named `Pict-Section-Login`
 *      with endpoints + behaviour wired to the beacon's local proxy
 *      routes (which in turn talk to UV).  Mount target is the
 *      conventional `#Pict-Login-Container` div.
 *
 *   2. Monkey-patches `onLoginSuccess`/`onLogout`/`onSessionChecked` on
 *      the section instance so the host application's flow hooks run
 *      after the section's HTTP calls resolve (no subclass file needed).
 *
 *   3. Exposes `loadAuthStatus(callback)` for the host's
 *      `onAfterInitializeAsync` to fetch `/status` and populate
 *      `AppData.<AuthStateAddress>.Auth = { Mode, SupportsUserManagement,
 *      SessionChecked, Authenticated }`.  The host typically renders
 *      the layout after both this AND its task/data loading finish, then
 *      navigates to /Login when AuthMode === 'authenticated'.
 *
 * What this module does NOT do:
 *
 *   - Define a wrapper view (each beacon has its own ~20-line wrapper
 *     that paints `#Pict-Login-Container` inside its content panel).
 *   - Touch the host's router config.  The host adds a `/Login` route
 *     pointing at the wrapper view.
 *   - Force a particular AppData shape — `AuthStateAddress` is
 *     configurable so beacons that already use a nested namespace
 *     (e.g. `AppData.DataBeacon.Auth`) stay tidy.
 *
 * Usage:
 *
 *   const libBeaconWebAuthClient = require('ultravisor-beacon/webinterface/Pict-Beacon-WebAuth-Client.js');
 *
 *   libBeaconWebAuthClient.install(this.pict, {
 *       Section:              require('pict-section-login'),
 *       AuthStateAddress:     'AppData.DataBeacon.Auth',
 *       LoginRoute:           '/Login',
 *       HomeRoute:            '/Dashboard',
 *       StatusURL:            '/status',
 *       LoginEndpoint:        '/1.0/Authenticate',
 *       LogoutEndpoint:       '/1.0/Deauthenticate',
 *       CheckSessionEndpoint: '/1.0/CheckSession',
 *       OnAfterLogin:         (pSession) => app.refreshTopBarAndSidebar(),
 *       OnAfterLogout:        ()         => app.refreshTopBarAndSidebar(),
 *       OnSessionChecked:     (pSession) => { /* optional extra hook *\/ }
 *   });
 *
 * The Section module must be passed in by the host — this helper has
 * to live in a browser-loaded bundle so it can't require the pict
 * package at module-load time (the host's bundler resolves `pict-
 * section-login` against its own dependency tree).
 */'use strict';const DEFAULTS={SectionViewIdentifier:'Pict-Section-Login',AuthStateAddress:'AppData.Beacon.Auth',LoginRoute:'/Login',HomeRoute:'/Home',StatusURL:'/status',LoginEndpoint:'/1.0/Authenticate',LogoutEndpoint:'/1.0/Deauthenticate',CheckSessionEndpoint:'/1.0/CheckSession',CheckSessionOnLoad:true,ShowOAuthProviders:false};/**
 * Install the login section + return a small handle the host uses to
 * drive its boot gate.
 *
 * @param {object} pPict       — the live Pict instance
 * @param {object} pOptions    — see DEFAULTS for the full surface
 * @returns {object} handle    — { loadAuthStatus, navigateToLogin, ... }
 */function install(pPict,pOptions){if(!pPict||typeof pPict.addView!=='function'){throw new Error('Pict-Beacon-WebAuth-Client.install: pPict must be a Pict instance');}if(!pOptions||!pOptions.Section){throw new Error('Pict-Beacon-WebAuth-Client.install: pOptions.Section (the pict-section-login module) is required');}let tmpConfig=Object.assign({},DEFAULTS,pOptions);let libPictSectionLogin=tmpConfig.Section;// Register the section view.  CheckSessionOnLoad triggers the
// section's automatic session validation on its first render —
// which we use as the boot-gate's "is the cookie still good?" check.
pPict.addView(tmpConfig.SectionViewIdentifier,{LoginEndpoint:tmpConfig.LoginEndpoint,LogoutEndpoint:tmpConfig.LogoutEndpoint,CheckSessionEndpoint:tmpConfig.CheckSessionEndpoint,CheckSessionOnLoad:tmpConfig.CheckSessionOnLoad,ShowOAuthProviders:tmpConfig.ShowOAuthProviders},libPictSectionLogin);// Wire the section's overridable hooks to the host's flow.  Each
// hook also keeps the auth-state slot in AppData in sync so any
// view (top bar, sidebar, menus) can re-render off a single source.
let tmpLogin=pPict.views[tmpConfig.SectionViewIdentifier];if(tmpLogin){tmpLogin.onLoginSuccess=pSession=>_afterLogin(pPict,tmpConfig,pSession);tmpLogin.onLogout=()=>_afterLogout(pPict,tmpConfig);tmpLogin.onSessionChecked=pSession=>_afterSessionChecked(pPict,tmpConfig,pSession);}// Seed the auth-state slot with defaults so views that render
// before /status returns can read truthy/falsy values without
// optional-chaining.
_writeAuthState(pPict,tmpConfig,{Mode:'promiscuous',SupportsUserManagement:false,SessionChecked:false,Authenticated:false});return{/**
		 * Fetch /status and refresh AppData auth state.  Hosts call this
		 * inside `onAfterInitializeAsync` alongside their task/data load
		 * so route resolution + layout render only happen once both are
		 * complete.  fCallback(pError) — `pError` is non-fatal; on
		 * failure we keep the seeded defaults (promiscuous) so the UI
		 * still renders.
		 */loadAuthStatus:function(fCallback){fetch(tmpConfig.StatusURL,{credentials:'include'}).then(pResp=>pResp.ok?pResp.json():Promise.reject(new Error('HTTP '+pResp.status))).then(pBody=>{_writeAuthState(pPict,tmpConfig,{Mode:pBody&&pBody.AuthMode==='authenticated'?'authenticated':'promiscuous',SupportsUserManagement:!!(pBody&&pBody.SupportsUserManagement),SessionChecked:false,Authenticated:false});if(typeof fCallback==='function'){fCallback(null,pBody);}}).catch(pErr=>{if(typeof fCallback==='function'){fCallback(pErr);}});},/**
		 * Convenience: navigate to the configured /Login route.  Hosts
		 * use this from their bootGate when /status reports authenticated
		 * mode + the section's CheckSessionOnLoad has not yet confirmed
		 * a valid cookie.
		 */navigateToLogin:function(){if(pPict.PictApplication&&typeof pPict.PictApplication.navigateTo==='function'){pPict.PictApplication.navigateTo(tmpConfig.LoginRoute);}else if(pPict.providers&&pPict.providers.PictRouter){pPict.providers.PictRouter.navigate(tmpConfig.LoginRoute);}},/** True iff the user is currently authenticated (per local state). */isAuthenticated:function(){let tmpState=_readAuthState(pPict,tmpConfig);return!!(tmpState&&tmpState.Authenticated);},/** Current cached AuthMode. */getAuthMode:function(){let tmpState=_readAuthState(pPict,tmpConfig);return tmpState&&tmpState.Mode||'promiscuous';},/** Direct accessor to the AppData auth state (for views/templates). */getAuthState:function(){return _readAuthState(pPict,tmpConfig);}};}// ────────────────────────────────────────────────────────────────────────
// Hooks fired by the section view
// ────────────────────────────────────────────────────────────────────────
function _afterLogin(pPict,pConfig,pSession){_writeAuthState(pPict,pConfig,Object.assign({},_readAuthState(pPict,pConfig)||{},{Authenticated:true,SessionChecked:true}));if(typeof pConfig.OnAfterLogin==='function'){try{pConfig.OnAfterLogin(pSession);}catch(pErr){_warn(pPict,pErr);}}_safeNavigate(pPict,pConfig,pConfig.HomeRoute);}function _afterLogout(pPict,pConfig){_writeAuthState(pPict,pConfig,Object.assign({},_readAuthState(pPict,pConfig)||{},{Authenticated:false}));if(typeof pConfig.OnAfterLogout==='function'){try{pConfig.OnAfterLogout();}catch(pErr){_warn(pPict,pErr);}}_safeNavigate(pPict,pConfig,pConfig.LoginRoute);}function _afterSessionChecked(pPict,pConfig,pSession){let tmpLoggedIn=!!(pSession&&pSession.LoggedIn);_writeAuthState(pPict,pConfig,Object.assign({},_readAuthState(pPict,pConfig)||{},{SessionChecked:true,Authenticated:tmpLoggedIn}));if(typeof pConfig.OnSessionChecked==='function'){try{pConfig.OnSessionChecked(pSession);}catch(pErr){_warn(pPict,pErr);}}// Only redirect away from the login view when the user is currently
// looking at it (boot gate forced them there) AND auth-mode is on
// (otherwise we have no business bouncing them anywhere).  We read
// mode from AppData rather than pConfig because the gate hydrates
// the state at runtime via loadAuthStatus().
let tmpState=_readAuthState(pPict,pConfig)||{};let tmpOnLogin=pPict.AppData&&pPict.AppData.CurrentView==='Login'||_currentHashRoute()===pConfig.LoginRoute||_currentHashRoute()==='/'+pConfig.LoginRoute;if(tmpLoggedIn&&tmpState.Mode==='authenticated'&&tmpOnLogin){_safeNavigate(pPict,pConfig,pConfig.HomeRoute);}}// ────────────────────────────────────────────────────────────────────────
// AppData address resolution
// ────────────────────────────────────────────────────────────────────────
function _readAuthState(pPict,pConfig){let tmpParts=String(pConfig.AuthStateAddress||'').split('.');let tmpCursor=pPict;for(let i=0;i<tmpParts.length;i++){if(!tmpCursor||typeof tmpCursor!=='object'){return null;}tmpCursor=tmpCursor[tmpParts[i]];}return tmpCursor||null;}function _writeAuthState(pPict,pConfig,pValue){let tmpParts=String(pConfig.AuthStateAddress||'').split('.');if(tmpParts.length===0){return;}let tmpCursor=pPict;for(let i=0;i<tmpParts.length-1;i++){let tmpKey=tmpParts[i];if(!tmpCursor[tmpKey]||typeof tmpCursor[tmpKey]!=='object'){tmpCursor[tmpKey]={};}tmpCursor=tmpCursor[tmpKey];}tmpCursor[tmpParts[tmpParts.length-1]]=pValue;}// ────────────────────────────────────────────────────────────────────────
// Misc
// ────────────────────────────────────────────────────────────────────────
function _safeNavigate(pPict,pConfig,pRoute){if(!pRoute){return;}if(pPict.PictApplication&&typeof pPict.PictApplication.navigateTo==='function'){pPict.PictApplication.navigateTo(pRoute);}else if(pPict.providers&&pPict.providers.PictRouter&&typeof pPict.providers.PictRouter.navigate==='function'){pPict.providers.PictRouter.navigate(pRoute);}}function _currentHashRoute(){if(typeof window==='undefined'||!window.location){return'';}let tmpHash=window.location.hash||'';if(tmpHash.charAt(0)==='#'){tmpHash=tmpHash.slice(1);}return tmpHash||'/';}function _warn(pPict,pErr){let tmpLog=pPict&&pPict.log||console;let tmpFn=tmpLog&&(tmpLog.warn||tmpLog.error)||console.warn;tmpFn('[Pict-Beacon-WebAuth-Client] hook threw: '+(pErr&&pErr.message||pErr));}module.exports={install};},{}],96:[function(require,module,exports){module.exports={"name":"retold-databeacon","version":"1.0.12","description":"Deployable data beacon service — connect to remote databases, introspect schemas, generate REST endpoints, and expose beacon capabilities to the Ultravisor mesh.","main":"source/Retold-DataBeacon.js","bin":{"retold-databeacon":"bin/retold-databeacon.js"},"scripts":{"start":"node bin/retold-databeacon.js","test":"npx quack test","test-browser":"npx mocha test/DataBeacon_Browser_Integration_tests.js -u tdd --exit --timeout 120000","coverage":"npx quack coverage","brand":"node node_modules/pict-section-theme/bin/pict-section-theme-brand.js --manifest ../../../Retold-Modules-Manifest.json --module retold-databeacon --favicons source/services/web-app/web/favicons","prebuild":"npm run brand","build":"npx quack build","docker-build":"docker build -t retold-databeacon .","docker-run":"docker run -p 8389:8389 -v $(pwd)/data:/app/data retold-databeacon","docker-up":"docker compose up -d --build","docker-down":"docker compose down","docker-package":"bash scripts/docker-package.sh","docker-package-fast":"bash scripts/docker-package.sh --skip-build","docker-test-up":"docker compose -f test/docker-compose.yml up -d","docker-test-down":"docker compose -f test/docker-compose.yml down","dev":"node test/dev-server.js","dev-seed":"node test/seed-dev.js","prepublishOnly":"npm test","postversion":"npx quack release postversion","postpublish":"npx quack release postpublish","publish:docker":"npx quack release publish --image","release:patch":"npx quack release patch","release:minor":"npx quack release minor","release:major":"npx quack release major","release:patch:image":"npx quack release patch --image","release:minor:image":"npx quack release minor --image","release:major:image":"npx quack release major --image"},"mocha":{"spec":"test/RetoldDataBeacon_tests.js","diff":true,"extension":["js"],"package":"./package.json","reporter":"spec","slow":"75","timeout":"10000","ui":"tdd","watch-files":["source/**/*.js","test/**/*.js"],"watch-ignore":["lib/vendor"]},"repository":{"type":"git","url":"https://github.com/fable-retold/retold-databeacon.git"},"keywords":["data","beacon","database","introspection","REST","ultravisor"],"retoldBeacon":{"displayName":"Retold Databeacon","description":"REST/meadow proxy over a connected database, with schema introspection and endpoint enable/disable.","category":"database","mode":"standalone-service","bin":"bin/retold-databeacon.js","argTemplate":["serve","--port",{"fromLabPath":"Port"},"--config",{"fromLabPath":"ConfigPath"}],"healthCheck":{"path":"/beacon/capabilities"},"defaultPort":8500,"requiresUltravisor":false,"configTemplate":{"APIServerPort":"{{Port}}","SQLite":{"SQLiteFilePath":"{{BeaconDir}}/databeacon.sqlite"}},"configForm":{"Fields":[{"Name":"EngineDatabase","Label":"Target engine / database","Type":"lab-engine-database-picker","Required":false}]},"docker":{"image":"retold-databeacon","dockerfile":"retold-databeacon.Dockerfile","dataMountPath":"/app/data","configMountPath":"/app/data/config.json","exposedPort":8500}},"author":"Steven Velozo <steven@velozo.com> (http://velozo.com/)","license":"MIT","bugs":{"url":"https://github.com/fable-retold/retold-databeacon/issues"},"homepage":"https://github.com/fable-retold/retold-databeacon","devDependencies":{"pict-docuserve":"^1.4.12","puppeteer":"^24.40.0","quackage":"^1.3.0","stricture":"^4.0.6","supertest":"^7.2.2"},"dependencies":{"fable":"^3.1.75","fable-serviceproviderbase":"^3.0.19","meadow":"^2.0.42","meadow-connection-manager":"^1.1.4","meadow-connection-mssql":"^1.0.23","meadow-connection-mysql":"^1.0.19","meadow-connection-oracle":"^1.0.1","meadow-connection-postgresql":"^1.0.7","meadow-connection-retold-databeacon":"^1.0.0","meadow-connection-sqlite":"^1.0.20","meadow-endpoints":"^4.0.22","meadow-migrationmanager":"^1.0.4","orator":"^6.1.2","orator-serviceserver-restify":"^2.0.11","orator-static-server":"^2.1.4","pict":"^1.0.372","pict-application":"^1.0.34","pict-provider-theme":"^1.1.2","pict-router":"^1.0.10","pict-section-code":"^1.0.11","pict-section-connection-form":"^1.0.0","pict-section-login":"^1.0.0","pict-section-modal":"^1.1.4","pict-section-theme":"^1.1.1","pict-view":"^1.0.68","retold-facto":"^1.0.2","ultravisor-beacon":"^1.0.4"},"optionalDependencies":{"meadow-connection-mongodb":"^1.0.3","meadow-connection-rocksdb":"^1.0.0","meadow-connection-solr":"^1.0.3"},"retold":{"brand":{"Hash":"retold-databeacon","Name":"DataBeacon","Tagline":"Connect, introspect, and expose remote databases","Palette":"ocean","Icon":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 96 96\" width=\"96\" height=\"96\">\n\t\t<defs>\n\t\t\t<clipPath id=\"frame-retold-databeacon-filled-light\">\n\t\t\t\t<path d=\"M 48.00 2.00 L 87.84 25.00 L 87.84 71.00 L 48.00 94.00 L 8.16 71.00 L 8.16 25.00 Z\"/>\n\t\t\t</clipPath>\n\t\t</defs>\n\t\t<path d=\"M 48.00 2.00 L 87.84 25.00 L 87.84 71.00 L 48.00 94.00 L 8.16 71.00 L 8.16 25.00 Z\" fill=\"#28a9bf\"/>\n\t\t<g clip-path=\"url(#frame-retold-databeacon-filled-light)\"><circle cx=\"48\" cy=\"48\" r=\"39\" fill=\"#de5d3b\" opacity=\"0.85\"/>\n\t\t\t\t\t<circle cx=\"48\" cy=\"48\" r=\"28\" fill=\"rgba(255,255,255,0.18)\"/></g>\n\t\t<text x=\"48\" y=\"50\" text-anchor=\"middle\" dominant-baseline=\"central\"\n\t\t\tfont-family=\"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif\"\n\t\t\tfont-size=\"38\" font-weight=\"700\"\n\t\t\tfill=\"#ffffff\" letter-spacing=\"-1\">RD</text>\n\t</svg>","IconType":"svg","Favicon":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 96 96\" width=\"96\" height=\"96\">\n\t\t<defs>\n\t\t\t<clipPath id=\"fav-retold-databeacon-light\">\n\t\t\t\t<path d=\"M 48.00 2.00 L 87.84 25.00 L 87.84 71.00 L 48.00 94.00 L 8.16 71.00 L 8.16 25.00 Z\"/>\n\t\t\t</clipPath>\n\t\t</defs>\n\t\t<path d=\"M 48.00 2.00 L 87.84 25.00 L 87.84 71.00 L 48.00 94.00 L 8.16 71.00 L 8.16 25.00 Z\" fill=\"#28a9bf\"/>\n\t\t<g clip-path=\"url(#fav-retold-databeacon-light)\"><circle cx=\"48\" cy=\"48\" r=\"43\" fill=\"rgba(255,255,255,0.22)\"/></g>\n\t\t<text x=\"48\" y=\"50\" text-anchor=\"middle\" dominant-baseline=\"central\"\n\t\t\tfont-family=\"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif\"\n\t\t\tfont-size=\"60\" font-weight=\"800\"\n\t\t\tfill=\"#ffffff\" letter-spacing=\"-1\">R</text>\n\t</svg>","FaviconDark":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 96 96\" width=\"96\" height=\"96\">\n\t\t<defs>\n\t\t\t<clipPath id=\"fav-retold-databeacon-dark\">\n\t\t\t\t<path d=\"M 48.00 2.00 L 87.84 25.00 L 87.84 71.00 L 48.00 94.00 L 8.16 71.00 L 8.16 25.00 Z\"/>\n\t\t\t</clipPath>\n\t\t</defs>\n\t\t<path d=\"M 48.00 2.00 L 87.84 25.00 L 87.84 71.00 L 48.00 94.00 L 8.16 71.00 L 8.16 25.00 Z\" fill=\"#6ac8d9\"/>\n\t\t<g clip-path=\"url(#fav-retold-databeacon-dark)\"><circle cx=\"48\" cy=\"48\" r=\"43\" fill=\"rgba(255,255,255,0.22)\"/></g>\n\t\t<text x=\"48\" y=\"50\" text-anchor=\"middle\" dominant-baseline=\"central\"\n\t\t\tfont-family=\"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif\"\n\t\t\tfont-size=\"60\" font-weight=\"800\"\n\t\t\tfill=\"#101418\" letter-spacing=\"-1\">R</text>\n\t</svg>","Colors":{"Primary":"#28a9bf","Secondary":"#de5d3b","PrimaryLight":"#28a9bf","PrimaryDark":"#6ac8d9","SecondaryLight":"#de5d3b","SecondaryDark":"#e7a08d"}}}};},{}],97:[function(require,module,exports){// Path-relative require lets the LogoGenerator stay out of the runtime bundle.
// pict-app/ → up 4 to package root (modules/apps/retold-databeacon/).
const tmpPackage=require('../../../../package.json');if(!tmpPackage.retold||!tmpPackage.retold.brand){throw new Error('retold-databeacon: package.json is missing retold.brand — '+'run `npm run brand` (which calls pict-section-theme-brand) before building');}module.exports=tmpPackage.retold.brand;},{"../../../../package.json":96}],98:[function(require,module,exports){/**
 * Retold DataBeacon — Pict Application
 *
 * Main web application class for the DataBeacon web UI. Registers
 * providers and views; boots AppData; delegates navigation to the
 * Layout view.
 */const libPictApplication=require('pict-application');const libPictSectionModal=require('pict-section-modal');const libPictSectionTheme=require('pict-section-theme');const libPictSectionCode=require('pict-section-code');const libPictSectionConnectionForm=require('pict-section-connection-form');const libPictSectionLogin=require('pict-section-login');const libBeaconWebAuthClient=require('ultravisor-beacon/webinterface/Pict-Beacon-WebAuth-Client.js');const libPictRouter=require('pict-router');const libPictRouterConfig=require('./providers/PictRouter-DataBeacon-Configuration.json');const libDataBeaconBrand=require('./DataBeacon-Brand.js');const libDataBeaconProvider=require('./providers/Pict-Provider-DataBeacon.js');const libDataBeaconIconsProvider=require('./providers/Pict-Provider-DataBeacon-Icons.js');const libDataBeaconExportProvider=require('./providers/Pict-Provider-DataBeacon-Export.js');const libDataBeaconSavedQueriesProvider=require('./providers/Pict-Provider-DataBeacon-SavedQueries.js');// Shell + chrome views
const libViewLayout=require('./views/PictView-DataBeacon-Layout.js');const libViewSidebar=require('./views/PictView-DataBeacon-Sidebar.js');const libViewTopBarNav=require('./views/PictView-DataBeacon-TopBar-Nav.js');const libViewTopBarUser=require('./views/PictView-DataBeacon-TopBar-User.js');const libViewSettingsPanel=require('./views/PictView-DataBeacon-SettingsPanel.js');// Page / container views
const libViewDashboard=require('./views/PictView-DataBeacon-Dashboard.js');const libViewLogin=require('./views/PictView-DataBeacon-Login.js');const libViewConnections=require('./views/PictView-DataBeacon-Connections.js');const libViewIntrospection=require('./views/PictView-DataBeacon-Introspection.js');const libViewEndpoints=require('./views/PictView-DataBeacon-Endpoints.js');const libViewRecords=require('./views/PictView-DataBeacon-Records.js');const libViewSQL=require('./views/PictView-DataBeacon-SQL.js');// Sub-views composed into the container pages
const libViewConnectionForm=require('./views/PictView-DataBeacon-ConnectionForm.js');const libViewConnectionList=require('./views/PictView-DataBeacon-ConnectionList.js');const libViewIntrospectionControls=require('./views/PictView-DataBeacon-IntrospectionControls.js');const libViewIntrospectionTables=require('./views/PictView-DataBeacon-IntrospectionTables.js');const libViewRecordBrowser=require('./views/PictView-DataBeacon-RecordBrowser.js');const libViewQueryPanel=require('./views/PictView-DataBeacon-QueryPanel.js');const libViewSavedQueriesList=require('./views/PictView-DataBeacon-SavedQueriesList.js');class DataBeaconApplication extends libPictApplication{constructor(pFable,pOptions,pServiceHash){super(pFable,pOptions,pServiceHash);this.serviceType='DataBeaconApplication';// Data + utility providers.
this.pict.addProvider('DataBeaconProvider',libDataBeaconProvider.default_configuration,libDataBeaconProvider);this.pict.addProvider('DataBeacon-Icons',libDataBeaconIconsProvider.default_configuration,libDataBeaconIconsProvider);this.pict.addProvider('DataBeacon-Export',libDataBeaconExportProvider.default_configuration,libDataBeaconExportProvider);this.pict.addProvider('DataBeacon-SavedQueries',libDataBeaconSavedQueriesProvider.default_configuration,libDataBeaconSavedQueriesProvider);// pict-section-modal must exist before the Layout view calls shell().
this.pict.addView('Pict-Section-Modal',libPictSectionModal.default_configuration,libPictSectionModal);// Slot + chrome views must be registered BEFORE the Theme-Section provider
// — its bootstrap looks slot views up by hash when it wires Theme-TopBar.
this.pict.addView('DataBeacon-TopBar-Nav',libViewTopBarNav.default_configuration,libViewTopBarNav);this.pict.addView('DataBeacon-TopBar-User',libViewTopBarUser.default_configuration,libViewTopBarUser);this.pict.addView('DataBeacon-Sidebar',libViewSidebar.default_configuration,libViewSidebar);this.pict.addView('DataBeacon-SettingsPanel',libViewSettingsPanel.default_configuration,libViewSettingsPanel);// Theme-Section: registers the Theme provider, mounts the bundled theme
// catalog, wires localStorage persistence, applies the default theme,
// and stamps the brand into the topbar's BrandMark + nav/user slots.
this.pict.addProvider('Theme-Section',{ApplyDefault:'retold-default',DefaultMode:'system',DefaultScale:1.0,Brand:libDataBeaconBrand,Views:['Picker','ModeToggle','ScaleSelect','BrandMark','TopBar'],ViewOptions:{TopBar:{NavView:'DataBeacon-TopBar-Nav',UserView:'DataBeacon-TopBar-User',Height:48}}},libPictSectionTheme);// Layout owns the shell; page views render into the workspace destinations
// the layout's shell creates.
this.pict.addView('Layout',libViewLayout.default_configuration,libViewLayout);this.pict.addView('Dashboard',libViewDashboard.default_configuration,libViewDashboard);this.pict.addView('Connections',libViewConnections.default_configuration,libViewConnections);this.pict.addView('Introspection',libViewIntrospection.default_configuration,libViewIntrospection);this.pict.addView('Endpoints',libViewEndpoints.default_configuration,libViewEndpoints);this.pict.addView('Records',libViewRecords.default_configuration,libViewRecords);this.pict.addView('SQL',libViewSQL.default_configuration,libViewSQL);// Sub-views
this.pict.addView('ConnectionForm',libViewConnectionForm.default_configuration,libViewConnectionForm);this.pict.addView('ConnectionList',libViewConnectionList.default_configuration,libViewConnectionList);// Shared schema-driven connection form.  Renders the type
// select + per-provider field block into the slot owned by
// the ConnectionForm wrapper view.  The provider's
// loadAvailableTypes() pumps schemas in once
// /beacon/connection/schemas responds.
this.pict.addView('PictSection-ConnectionForm',Object.assign({},libPictSectionConnectionForm.default_configuration,{ContainerSelector:'#DataBeacon-ConnectionForm-FieldsSlot',DefaultDestinationAddress:'#DataBeacon-ConnectionForm-FieldsSlot',SchemasAddress:'AppData.ConnectionFormSchemas',ActiveAddress:'AppData.ConnectionFormActiveProvider',FieldIDPrefix:'databeacon-conn'}),libPictSectionConnectionForm);this.pict.addView('IntrospectionControls',libViewIntrospectionControls.default_configuration,libViewIntrospectionControls);this.pict.addView('IntrospectionTables',libViewIntrospectionTables.default_configuration,libViewIntrospectionTables);this.pict.addView('RecordBrowser',libViewRecordBrowser.default_configuration,libViewRecordBrowser);this.pict.addView('QueryPanel',libViewQueryPanel.default_configuration,libViewQueryPanel);this.pict.addView('SavedQueriesList',libViewSavedQueriesList.default_configuration,libViewSavedQueriesList);// Login flow — wrapper view + the beacon-SDK's client helper
// install pict-section-login and wire its hooks back into this
// application's navigation.  The helper writes
// `AppData.DataBeacon.Auth = { Mode, SupportsUserManagement,
// SessionChecked, Authenticated }` for any view to read.
this.pict.addView('Login',libViewLogin.default_configuration,libViewLogin);this._WebAuthClient=libBeaconWebAuthClient.install(this.pict,{Section:libPictSectionLogin,AuthStateAddress:'AppData.DataBeacon.Auth',LoginRoute:'Login',HomeRoute:'Dashboard',StatusURL:'/status',LoginEndpoint:'/1.0/Authenticate',LogoutEndpoint:'/1.0/Deauthenticate',CheckSessionEndpoint:'/1.0/CheckSession',OnAfterLogin:()=>this.renderTopBar(),OnAfterLogout:()=>this.renderTopBar()});// SQL code editor (pict-section-code + CodeJar) — registered separately so the
// QueryPanel view can mount it into its editor slot each time it renders.
this.pict.addView('SQLEditor',{ViewIdentifier:'SQLEditor',TargetElementAddress:'#DataBeacon-QueryPanel-Editor',Language:'sql',LineNumbers:true,ReadOnly:false,CodeDataAddress:'AppData.QueryPanel.SQL',DefaultCode:'',AutoRender:false},libPictSectionCode);// Router -- Navigo in hash mode.  Every navigation and action in the
// DataBeacon web app flows through `<a href="#/...">` anchors dispatched
// via this router; there are no addEventListener callbacks in view
// lifecycle hooks (pict-first imperative).
this.pict.addProvider('PictRouter',libPictRouterConfig,libPictRouter);}onAfterInitializeAsync(fCallback){// Set up application state.
if(!this.pict.AppData)this.pict.AppData={};this.pict.AppData.Connections=[];this.pict.AppData.AvailableTypes=[];this.pict.AppData.AvailableTypesForForm=[];this.pict.AppData.Tables=[];this.pict.AppData.Endpoints=[];this.pict.AppData.SelectedConnectionID=null;this.pict.AppData.SelectedTableName=null;this.pict.AppData.Records=[];this.pict.AppData.BeaconStatus={Connected:false};this.pict.AppData.CurrentView='Dashboard';// Seed the view-shape AppData branches so the first render of each
// screen has something to bind against (providers overwrite these
// as soon as API responses arrive).
this.pict.AppData.Dashboard={TotalConnections:0,ActiveConnections:0,TotalEndpoints:0,BeaconStatusLabel:'Unknown',BeaconBadgeClass:'badge-neutral',BeaconName:'retold-databeacon',BeaconNameDisplay:'',ConnectionSummary:[]};this.pict.AppData.Introspection={ConnectedList:[],ShowPlaceholder:true,HasSelection:false,SelectedBanner:null,RunDisabled:true,AllDisabled:true,State:'NoConnections',TablesView:[],TablesHeader:null,DetailModalColumns:[]};this.pict.AppData.QueryPanel={SQL:''};this.pict.AppData.RecordBrowser={TableOptions:[],PageSizeOptions:[],SelectedTableName:'',TableName:'',CursorStart:0,PageSize:50,PrevDisabled:true,NextDisabled:true,LoadDisabled:true,RangeLabel:'',State:'NoSelection',ColumnList:[],Rows:[]};// Topbar-driven AppData. PageTitle drives the section label rendered in
// the Nav slot; setActiveView() updates it and re-renders the topbar.
this.pict.AppData.DataBeacon=this.pict.AppData.DataBeacon||{};this.pict.AppData.DataBeacon.PageTitle='Dashboard';// Keep a window handle for legacy/debug access only; views do NOT rely on it.
if(typeof window!=='undefined')window.DataBeaconApp=this;// Render the shell.
this.pict.views.Layout.render();// Boot gate: fetch /status to discover auth mode before deciding
// the landing route.  In promiscuous mode (default for older
// databeacons or when no UV is connected) we go straight to the
// dashboard and load data.  In authenticated mode we force the
// user through Login first; pict-section-login's
// CheckSessionOnLoad will then validate any stored cookie and,
// if valid, the helper's onSessionChecked hook bounces back to
// /Home (i.e. Dashboard).
this._WebAuthClient.loadAuthStatus(pStatusErr=>{// pStatusErr is non-fatal — defaults leave us in promiscuous
// mode and the UI still works (just without a backend-driven
// gate).  Logging via pict.log keeps it visible without
// blocking.
if(pStatusErr){this.pict.log.warn('DataBeacon: /status fetch failed during boot: '+pStatusErr.message);}let tmpAuthState=this.pict.AppData.DataBeacon&&this.pict.AppData.DataBeacon.Auth||{};if(tmpAuthState.Mode==='authenticated'){// Force the user to the Login view; the section's
// CheckSessionOnLoad will silently bounce them back to
// the dashboard if their cookie is still good.
this.navigateTo('Login');// Defer data loads until login completes — the
// OnAfterLogin hook re-renders the topbar but doesn't
// trigger data-loading; do that here once we know the
// post-login route.  Data load is idempotent so we'll
// re-fire on login too via an additional callback.
let tmpOriginalOnAfterLogin=this._WebAuthClient.getAuthState?this._WebAuthClient.getAuthState()._OnAfterLogin:null;let fLoadData=()=>{let tmpProv=this.pict.providers.DataBeaconProvider;if(tmpProv){tmpProv.loadConnections();tmpProv.loadAvailableTypes();tmpProv.loadEndpoints();tmpProv.loadBeaconStatus();}};// Patch the login section's onLoginSuccess to also load
// data after a successful sign-in.
let tmpLogin=this.pict.views['Pict-Section-Login'];if(tmpLogin){let tmpPrev=tmpLogin.onLoginSuccess;tmpLogin.onLoginSuccess=pSess=>{if(typeof tmpPrev==='function'){tmpPrev(pSess);}fLoadData();};}return super.onAfterInitializeAsync(fCallback);}// Promiscuous (or status unreachable) — load data + land on
// Dashboard the same as before.
let tmpProvider=this.pict.providers.DataBeaconProvider;if(tmpProvider){tmpProvider.loadConnections();tmpProvider.loadAvailableTypes();tmpProvider.loadEndpoints();tmpProvider.loadBeaconStatus();}this.navigateTo('Dashboard');return super.onAfterInitializeAsync(fCallback);});}// ── Router action handlers ──────────────────────────────────────────────
// Every `{~LV:Pict.PictApplication.method(...)~}` route target resolves
// here.  Handlers are intentionally thin dispatchers into the owning
// view or provider -- they exist so routes can be the single source of
// truth for how actions fire, without every view shipping its own
// event-delegation code.
setActiveView(pViewName){this.pict.AppData.CurrentView=pViewName;this.pict.AppData.DataBeacon=this.pict.AppData.DataBeacon||{};this.pict.AppData.DataBeacon.PageTitle=pViewName;if(this.pict.views.Layout&&typeof this.pict.views.Layout.setActiveView==='function'){this.pict.views.Layout.setActiveView(pViewName);}this.renderTopBar();}// Re-render the Theme-TopBar's nav + user slot views without touching the
// shared Theme-TopBar chrome itself (its background, brand mark, etc.).
renderTopBar(){let tmpNav=this.pict.views['DataBeacon-TopBar-Nav'];let tmpUser=this.pict.views['DataBeacon-TopBar-User'];if(tmpNav&&typeof tmpNav.render==='function'){tmpNav.render();}if(tmpUser&&typeof tmpUser.render==='function'){tmpUser.render();}}// Legacy shim kept for window.DataBeaconApp.navigateTo() callers.  New
// code should hit the route `#/view/<name>` anchors instead.
navigateTo(pViewName){return this.setActiveView(pViewName);}// ── Connections ─────────────────────────────────────────────────────────
createConnection(){return this._form('ConnectionForm')._submit();}connectConnection(pID){return this.pict.providers.DataBeaconProvider.connectConnection(parseInt(pID,10));}disconnectConnection(pID){return this.pict.providers.DataBeaconProvider.disconnectConnection(parseInt(pID,10));}testConnection(pID){let tmpModal=this.pict.views['Pict-Section-Modal'];this.pict.providers.DataBeaconProvider.testConnection(parseInt(pID,10),(pErr,pData)=>{if(pData&&pData.Success){tmpModal.toast('Connection test succeeded.',{type:'success'});}else{tmpModal.toast('Connection test failed: '+(pData?pData.Error:'Unknown error'),{type:'error'});}});}deleteConnection(pID){let tmpModal=this.pict.views['Pict-Section-Modal'];tmpModal.confirm('Are you sure you want to delete this connection?',{title:'Delete Connection',confirmLabel:'Delete',cancelLabel:'Cancel',dangerous:true}).then(pConfirmed=>{if(pConfirmed){this.pict.providers.DataBeaconProvider.deleteConnection(parseInt(pID,10));}});}introspectConnection(pID){let tmpID=parseInt(pID,10);let tmpModal=this.pict.views['Pict-Section-Modal'];this.pict.providers.DataBeaconProvider.introspect(tmpID,(pErr,pData)=>{if(pData&&pData.Success){this.pict.AppData.SelectedConnectionID=tmpID;this.setActiveView('Introspection');}else{tmpModal.toast('Introspection failed: '+(pData?pData.Error:'Unknown error'),{type:'error'});}});}// ── Introspection ───────────────────────────────────────────────────────
runIntrospect(){let tmpView=this.pict.views.IntrospectionControls;if(tmpView&&typeof tmpView._runIntrospect==='function'){tmpView._runIntrospect();}}introspectAll(){let tmpView=this.pict.views.IntrospectionControls;if(tmpView&&typeof tmpView._introspectAll==='function'){tmpView._introspectAll();}}selectIntrospectionConnection(pID){let tmpView=this.pict.views.IntrospectionControls;if(tmpView&&typeof tmpView._selectConnection==='function'){tmpView._selectConnection(pID);}}viewTable(pConnID,pTable){let tmpView=this.pict.views.IntrospectionTables;if(tmpView&&typeof tmpView._viewTableDetails==='function'){tmpView._viewTableDetails(parseInt(pConnID,10),pTable);}}// ── Endpoints ───────────────────────────────────────────────────────────
refreshEndpoints(){return this.pict.providers.DataBeaconProvider.loadEndpoints();}enableEndpoint(pConnID,pTable){return this.pict.providers.DataBeaconProvider.enableEndpoint(parseInt(pConnID,10),pTable);}disableEndpoint(pConnID,pTable){return this.pict.providers.DataBeaconProvider.disableEndpoint(parseInt(pConnID,10),pTable);}browseEndpoint(pTableName){this.pict.AppData.SelectedTableName=pTableName;if(!this.pict.AppData.RecordBrowser){this.pict.AppData.RecordBrowser={};}// Always restart paging from row 0 when jumping from Endpoints.
this.pict.AppData.RecordBrowser.CursorStart=0;let tmpPageSize=this.pict.AppData.RecordBrowser.PageSize||50;this.setActiveView('Records');let tmpProv=this.pict.providers.DataBeaconProvider;if(tmpProv&&typeof tmpProv.loadRecords==='function'){tmpProv.loadRecords(pTableName,0,tmpPageSize);}}// ── Records ─────────────────────────────────────────────────────────────
recordsPrev(){let tmpView=this.pict.views.RecordBrowser;if(tmpView&&typeof tmpView._pagePrev==='function'){tmpView._pagePrev();}}recordsNext(){let tmpView=this.pict.views.RecordBrowser;if(tmpView&&typeof tmpView._pageNext==='function'){tmpView._pageNext();}}recordsLoad(){let tmpView=this.pict.views.RecordBrowser;if(tmpView&&typeof tmpView._loadCurrent==='function'){tmpView._loadCurrent();}}recordsExport(pFormat){let tmpView=this.pict.views.RecordBrowser;if(tmpView&&typeof tmpView._exportRecords==='function'){tmpView._exportRecords(pFormat);}}recordsExportAll(pFormat){let tmpView=this.pict.views.RecordBrowser;if(tmpView&&typeof tmpView._exportAllRecords==='function'){tmpView._exportAllRecords(pFormat);}}selectRecordsTable(pTableName){let tmpView=this.pict.views.RecordBrowser;if(tmpView&&typeof tmpView._selectTable==='function'){tmpView._selectTable(pTableName);}}changeRecordsPageSize(pSize){let tmpView=this.pict.views.RecordBrowser;if(tmpView&&typeof tmpView._setPageSize==='function'){tmpView._setPageSize(pSize);}}goToRecordsPage(pPage){let tmpView=this.pict.views.RecordBrowser;if(tmpView&&typeof tmpView._goToPage==='function'){tmpView._goToPage(pPage);}}applyRecordsFilter(pFilter){let tmpView=this.pict.views.RecordBrowser;if(!tmpView){return;}// If no value arg is supplied (the Apply button's route doesn't carry
// one; only the inline onchange does), read the filter input from the
// DOM at dispatch time so the user's last keystrokes are captured.
let tmpValue=typeof pFilter==='string'?pFilter:this._domValue('#databeacon-records-filter');if(typeof tmpView._applyFilter==='function'){tmpView._applyFilter(tmpValue||'');}}clearRecordsFilter(){let tmpView=this.pict.views.RecordBrowser;if(tmpView&&typeof tmpView._clearFilter==='function'){tmpView._clearFilter();}}_domValue(pSelector){let tmpList=this.pict.ContentAssignment.getElement(pSelector);if(!tmpList||tmpList.length===0){return'';}let tmpNode=typeof tmpList.length==='number'&&!('value'in tmpList)?tmpList[0]:tmpList;return tmpNode&&'value'in tmpNode?tmpNode.value:'';}// ── Queries ─────────────────────────────────────────────────────────────
executeQuery(){let tmpView=this.pict.views.QueryPanel;if(tmpView&&typeof tmpView._executeQuery==='function'){tmpView._executeQuery();}}saveQueryFromPanel(){let tmpView=this.pict.views.QueryPanel;if(tmpView&&typeof tmpView._saveQuery==='function'){tmpView._saveQuery();}}queryExport(pFormat){let tmpView=this.pict.views.QueryPanel;if(tmpView&&typeof tmpView._exportQueryResult==='function'){tmpView._exportQueryResult(pFormat);}}// ── Saved queries ───────────────────────────────────────────────────────
toggleSavedPanel(){let tmpView=this.pict.views.SavedQueriesList;if(tmpView&&typeof tmpView._togglePanel==='function'){tmpView._togglePanel();}}loadSavedQuery(pGUID){let tmpView=this.pict.views.SavedQueriesList;if(tmpView&&typeof tmpView._loadRecord==='function'){tmpView._loadRecord(pGUID);}}editSavedQuery(pGUID){let tmpView=this.pict.views.SavedQueriesList;if(tmpView&&typeof tmpView._editQuery==='function'){tmpView._editQuery(pGUID);}}deleteSavedQuery(pGUID){let tmpView=this.pict.views.SavedQueriesList;if(tmpView&&typeof tmpView._deleteQuery==='function'){tmpView._deleteQuery(pGUID);}}// ── Helpers ─────────────────────────────────────────────────────────────
_form(pViewName){return this.pict.views[pViewName]||{_submit:()=>{}};}}module.exports=DataBeaconApplication;module.exports.default_configuration={};},{"./DataBeacon-Brand.js":97,"./providers/Pict-Provider-DataBeacon-Export.js":100,"./providers/Pict-Provider-DataBeacon-Icons.js":101,"./providers/Pict-Provider-DataBeacon-SavedQueries.js":102,"./providers/Pict-Provider-DataBeacon.js":103,"./providers/PictRouter-DataBeacon-Configuration.json":104,"./views/PictView-DataBeacon-ConnectionForm.js":105,"./views/PictView-DataBeacon-ConnectionList.js":106,"./views/PictView-DataBeacon-Connections.js":107,"./views/PictView-DataBeacon-Dashboard.js":108,"./views/PictView-DataBeacon-Endpoints.js":109,"./views/PictView-DataBeacon-Introspection.js":110,"./views/PictView-DataBeacon-IntrospectionControls.js":111,"./views/PictView-DataBeacon-IntrospectionTables.js":112,"./views/PictView-DataBeacon-Layout.js":113,"./views/PictView-DataBeacon-Login.js":114,"./views/PictView-DataBeacon-QueryPanel.js":115,"./views/PictView-DataBeacon-RecordBrowser.js":116,"./views/PictView-DataBeacon-Records.js":117,"./views/PictView-DataBeacon-SQL.js":118,"./views/PictView-DataBeacon-SavedQueriesList.js":119,"./views/PictView-DataBeacon-SettingsPanel.js":120,"./views/PictView-DataBeacon-Sidebar.js":121,"./views/PictView-DataBeacon-TopBar-Nav.js":122,"./views/PictView-DataBeacon-TopBar-User.js":123,"pict-application":5,"pict-router":14,"pict-section-code":17,"pict-section-connection-form":20,"pict-section-login":22,"pict-section-modal":32,"pict-section-theme":33,"ultravisor-beacon/webinterface/Pict-Beacon-WebAuth-Client.js":95}],99:[function(require,module,exports){/**
 * Retold DataBeacon — Browser Bundle Entry
 *
 * This file is the entry point for the Pict web application bundle.
 * Quackage (browserify) processes this file to produce retold-databeacon.js.
 */let libPictApplication=require('pict-application');let libPictView=require('pict-view');let libPictRouter=require('pict-router');let libPictSectionCode=require('pict-section-code');let libPictSectionTheme=require('pict-section-theme');// Application
let libDataBeaconApplication=require('./Pict-Application-DataBeacon.js');// Providers
let libDataBeaconProvider=require('./providers/Pict-Provider-DataBeacon.js');let libDataBeaconIconsProvider=require('./providers/Pict-Provider-DataBeacon-Icons.js');let libDataBeaconExportProvider=require('./providers/Pict-Provider-DataBeacon-Export.js');let libDataBeaconSavedQueriesProvider=require('./providers/Pict-Provider-DataBeacon-SavedQueries.js');// Views — Layout + chrome
let libViewLayout=require('./views/PictView-DataBeacon-Layout.js');let libViewSidebar=require('./views/PictView-DataBeacon-Sidebar.js');let libViewTopBarNav=require('./views/PictView-DataBeacon-TopBar-Nav.js');let libViewTopBarUser=require('./views/PictView-DataBeacon-TopBar-User.js');let libViewSettingsPanel=require('./views/PictView-DataBeacon-SettingsPanel.js');// Views — page / container views
let libViewDashboard=require('./views/PictView-DataBeacon-Dashboard.js');let libViewConnections=require('./views/PictView-DataBeacon-Connections.js');let libViewIntrospection=require('./views/PictView-DataBeacon-Introspection.js');let libViewEndpoints=require('./views/PictView-DataBeacon-Endpoints.js');let libViewRecords=require('./views/PictView-DataBeacon-Records.js');let libViewSQL=require('./views/PictView-DataBeacon-SQL.js');// Views — sub-views that make up the page containers
let libViewConnectionForm=require('./views/PictView-DataBeacon-ConnectionForm.js');let libViewConnectionList=require('./views/PictView-DataBeacon-ConnectionList.js');let libViewIntrospectionControls=require('./views/PictView-DataBeacon-IntrospectionControls.js');let libViewIntrospectionTables=require('./views/PictView-DataBeacon-IntrospectionTables.js');let libViewRecordBrowser=require('./views/PictView-DataBeacon-RecordBrowser.js');let libViewQueryPanel=require('./views/PictView-DataBeacon-QueryPanel.js');let libViewSavedQueriesList=require('./views/PictView-DataBeacon-SavedQueriesList.js');// Expose the application class on window for Pict.safeLoadPictApplication
window.DataBeaconApplication=libDataBeaconApplication;},{"./Pict-Application-DataBeacon.js":98,"./providers/Pict-Provider-DataBeacon-Export.js":100,"./providers/Pict-Provider-DataBeacon-Icons.js":101,"./providers/Pict-Provider-DataBeacon-SavedQueries.js":102,"./providers/Pict-Provider-DataBeacon.js":103,"./views/PictView-DataBeacon-ConnectionForm.js":105,"./views/PictView-DataBeacon-ConnectionList.js":106,"./views/PictView-DataBeacon-Connections.js":107,"./views/PictView-DataBeacon-Dashboard.js":108,"./views/PictView-DataBeacon-Endpoints.js":109,"./views/PictView-DataBeacon-Introspection.js":110,"./views/PictView-DataBeacon-IntrospectionControls.js":111,"./views/PictView-DataBeacon-IntrospectionTables.js":112,"./views/PictView-DataBeacon-Layout.js":113,"./views/PictView-DataBeacon-QueryPanel.js":115,"./views/PictView-DataBeacon-RecordBrowser.js":116,"./views/PictView-DataBeacon-Records.js":117,"./views/PictView-DataBeacon-SQL.js":118,"./views/PictView-DataBeacon-SavedQueriesList.js":119,"./views/PictView-DataBeacon-SettingsPanel.js":120,"./views/PictView-DataBeacon-Sidebar.js":121,"./views/PictView-DataBeacon-TopBar-Nav.js":122,"./views/PictView-DataBeacon-TopBar-User.js":123,"pict-application":5,"pict-router":14,"pict-section-code":17,"pict-section-theme":33,"pict-view":94}],100:[function(require,module,exports){/**
 * Retold DataBeacon — Export Provider
 *
 * Converts an in-memory row set into JSON (array), JSON (Meadow
 * Comprehension), CSV, or TSV and triggers a browser download. Shared by
 * the RecordBrowser (paginated table page) and QueryPanel (SQL result set)
 * views — any new view that shows tabular data can call the same entry
 * point.
 */const libPictProvider=require('pict-provider');const _ProviderConfiguration={ProviderIdentifier:'DataBeacon-Export',AutoInitialize:true,AutoInitializeOrdinal:0};const _SupportedFormats=['json','json-comp','csv','tsv'];class PictProviderDataBeaconExport extends libPictProvider{constructor(pFable,pOptions,pServiceHash){let tmpOptions=Object.assign({},_ProviderConfiguration,pOptions);super(pFable,tmpOptions,pServiceHash);this.serviceType='PictProviderDataBeaconExport';}/**
	 * Public entry point. Converts pRows to the requested format and kicks
	 * off a browser download.
	 *
	 * @param {string} pFormat - 'json' | 'json-comp' | 'csv' | 'tsv'
	 * @param {Array<Object>} pRows
	 * @param {Object} [pOptions]
	 * @param {string} [pOptions.BaseName]   - Filename stem (default "databeacon-export").
	 * @param {string} [pOptions.EntityName] - Top-level key for Comprehension exports (default "Record").
	 * @param {string} [pOptions.KeyField]   - Row field used as the Comprehension map key. Falls back to row index.
	 * @returns {boolean} true on success, false when the format is unknown or the download fails.
	 */exportRows(pFormat,pRows,pOptions){if(_SupportedFormats.indexOf(pFormat)===-1){this.log.warn(`PictProviderDataBeaconExport: unsupported format [${pFormat}]`);return false;}let tmpOptions=pOptions||{};let tmpBase=tmpOptions.BaseName||'databeacon-export';let tmpRows=Array.isArray(pRows)?pRows:[];let tmpContent;let tmpMime;let tmpExt;let tmpSuffix='';switch(pFormat){case'json':tmpContent=this.formatJSONArray(tmpRows);tmpMime='application/json';tmpExt='json';break;case'json-comp':tmpContent=this.formatJSONComprehension(tmpRows,tmpOptions.EntityName||'Record',tmpOptions.KeyField);tmpMime='application/json';tmpExt='json';tmpSuffix='-comprehension';break;case'csv':tmpContent=this.formatCSV(tmpRows);tmpMime='text/csv';tmpExt='csv';break;case'tsv':tmpContent=this.formatTSV(tmpRows);tmpMime='text/tab-separated-values';tmpExt='tsv';break;}let tmpFilename=`${tmpBase}${tmpSuffix}-${this._timestamp()}.${tmpExt}`;return this._download(tmpContent,tmpMime,tmpFilename);}// ================================================================
// Format helpers (pure — exposed for test / reuse)
// ================================================================
formatJSONArray(pRows){return JSON.stringify(pRows||[],null,'\t');}/**
	 * Emit a Meadow-style Comprehension:
	 *   { [EntityName]: { [KeyValue]: { ...record }, ... } }
	 * Rows missing pKeyField fall back to 1-based row index as the map key.
	 */formatJSONComprehension(pRows,pEntityName,pKeyField){let tmpEntity=pEntityName||'Record';let tmpRows=pRows||[];let tmpMap={};for(let i=0;i<tmpRows.length;i++){let tmpRow=tmpRows[i];let tmpKey;if(pKeyField&&tmpRow&&tmpRow[pKeyField]!==null&&tmpRow[pKeyField]!==undefined&&tmpRow[pKeyField]!==''){tmpKey=String(tmpRow[pKeyField]);}else{tmpKey=String(i+1);}// Disambiguate duplicates by suffixing — Comprehension map keys must be unique.
let tmpCandidate=tmpKey;let tmpCollisionIndex=1;while(Object.prototype.hasOwnProperty.call(tmpMap,tmpCandidate)){tmpCollisionIndex++;tmpCandidate=`${tmpKey}#${tmpCollisionIndex}`;}tmpMap[tmpCandidate]=tmpRow;}let tmpOut={};tmpOut[tmpEntity]=tmpMap;return JSON.stringify(tmpOut,null,'\t');}formatCSV(pRows){// RFC 4180: comma-separated, CRLF line endings, double-quote wrap
// when a field contains a delimiter / quote / newline.
return this._buildDelimited(pRows,',','\r\n',true);}formatTSV(pRows){// Classic TSV — tabs separate fields, LF separates rows. Tabs and
// newlines inside values are replaced with spaces because the TSV
// spec has no escape mechanism.
return this._buildDelimited(pRows,'\t','\n',false);}_buildDelimited(pRows,pFieldSep,pRowSep,pQuote){let tmpRows=pRows||[];let tmpColumns=this._collectColumns(tmpRows);if(tmpColumns.length===0)return'';let tmpLines=[];let tmpHeader=[];for(let h=0;h<tmpColumns.length;h++){tmpHeader.push(this._escapeField(tmpColumns[h],pFieldSep,pRowSep,pQuote));}tmpLines.push(tmpHeader.join(pFieldSep));for(let r=0;r<tmpRows.length;r++){let tmpRow=tmpRows[r]||{};let tmpCells=[];for(let c=0;c<tmpColumns.length;c++){tmpCells.push(this._escapeField(tmpRow[tmpColumns[c]],pFieldSep,pRowSep,pQuote));}tmpLines.push(tmpCells.join(pFieldSep));}return tmpLines.join(pRowSep);}/**
	 * Walk every row and record column names in first-seen order so a union
	 * of sparse rows exports cleanly.
	 */_collectColumns(pRows){let tmpSeen={};let tmpOrdered=[];for(let i=0;i<pRows.length;i++){let tmpRow=pRows[i];if(!tmpRow||typeof tmpRow!=='object')continue;let tmpKeys=Object.keys(tmpRow);for(let k=0;k<tmpKeys.length;k++){if(!tmpSeen[tmpKeys[k]]){tmpSeen[tmpKeys[k]]=true;tmpOrdered.push(tmpKeys[k]);}}}return tmpOrdered;}_escapeField(pValue,pFieldSep,pRowSep,pQuote){if(pValue===null||pValue===undefined)return'';let tmpStr;if(typeof pValue==='object'){try{tmpStr=JSON.stringify(pValue);}catch(pError){tmpStr=String(pValue);}}else{tmpStr=String(pValue);}if(pQuote){let tmpNeedsQuote=tmpStr.indexOf(pFieldSep)!==-1||tmpStr.indexOf('"')!==-1||tmpStr.indexOf('\n')!==-1||tmpStr.indexOf('\r')!==-1;if(tmpNeedsQuote)tmpStr='"'+tmpStr.replace(/"/g,'""')+'"';return tmpStr;}return tmpStr.replace(/\t/g,' ').replace(/\r?\n/g,' ');}_timestamp(){let tmpDate=new Date();let tmpPad=n=>String(n).padStart(2,'0');return tmpDate.getFullYear()+tmpPad(tmpDate.getMonth()+1)+tmpPad(tmpDate.getDate())+'-'+tmpPad(tmpDate.getHours())+tmpPad(tmpDate.getMinutes())+tmpPad(tmpDate.getSeconds());}_download(pContent,pMime,pFilename){if(typeof document==='undefined'||typeof Blob==='undefined'||typeof URL==='undefined'){this.log.warn('PictProviderDataBeaconExport: no browser APIs available; cannot download.');return false;}try{// Standard browser-download pattern: synthesize a hidden <a> with
// an object URL and programmatically click it, then remove.  No
// ContentAssignment analog for transient off-DOM anchor tricks,
// so this is one of the pict "unless absolutely necessary"
// carve-outs (downloads, popovers, tooltips).
let tmpBlob=new Blob([pContent],{type:`${pMime};charset=utf-8`});let tmpUrl=URL.createObjectURL(tmpBlob);let tmpAnchor=document.createElement('a');tmpAnchor.href=tmpUrl;tmpAnchor.download=pFilename;tmpAnchor.style.display='none';document.body.appendChild(tmpAnchor);tmpAnchor.click();setTimeout(()=>{if(tmpAnchor.parentNode)tmpAnchor.parentNode.removeChild(tmpAnchor);URL.revokeObjectURL(tmpUrl);},0);return true;}catch(pError){this.log.error(`PictProviderDataBeaconExport: download failed: ${pError&&pError.message?pError.message:pError}`);return false;}}}module.exports=PictProviderDataBeaconExport;module.exports.default_configuration=_ProviderConfiguration;},{"pict-provider":13}],101:[function(require,module,exports){/**
 * Retold DataBeacon — Icon Provider
 *
 * Centralized SVG icon library. All icons share a 24x24 viewBox and use
 * currentColor for stroke so they inherit the surrounding text color via CSS.
 *
 * Each icon is registered as a pict template with hash `DataBeacon-Icon-{key}`,
 * so templates can emit `{~Template:DataBeacon-Icon-plus:~}` inline. Views can
 * also inject at custom sizes via `getIconSVGMarkup(key, size)` into
 * `<span data-databeacon-icon="key" data-icon-size="N"></span>` placeholders.
 */const libPictProvider=require('pict-provider');const _ProviderConfiguration={ProviderIdentifier:'DataBeacon-Icons',AutoInitialize:true,AutoInitializeOrdinal:0};// Default rendered size (pixels) when a placeholder does not specify one.
const _DefaultSize=16;// Icon library. The `{IconSize}` placeholder is replaced at render time.
const _DefaultIcons={// ── Navigation ─────────────────────────────────────────────────────────
'dashboard':'<svg xmlns="http://www.w3.org/2000/svg" width="{IconSize}" height="{IconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="8" height="10" rx="1.5"/><rect x="13" y="3" width="8" height="6" rx="1.5"/><rect x="3" y="15" width="8" height="6" rx="1.5"/><rect x="13" y="11" width="8" height="10" rx="1.5"/></svg>','connections':'<svg xmlns="http://www.w3.org/2000/svg" width="{IconSize}" height="{IconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="8" ry="2.5"/><path d="M4 5v14c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5V5"/><path d="M4 10c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5"/><path d="M4 15c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5"/></svg>','introspection':'<svg xmlns="http://www.w3.org/2000/svg" width="{IconSize}" height="{IconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/><path d="M8 11h6M11 8v6"/></svg>','endpoints':'<svg xmlns="http://www.w3.org/2000/svg" width="{IconSize}" height="{IconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="5" cy="12" r="2.5"/><circle cx="19" cy="6" r="2.5"/><circle cx="19" cy="18" r="2.5"/><path d="M7.2 10.8l9.6-3.6M7.2 13.2l9.6 3.6"/></svg>','records':'<svg xmlns="http://www.w3.org/2000/svg" width="{IconSize}" height="{IconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M3 14h18M9 4v16"/></svg>','terminal':'<svg xmlns="http://www.w3.org/2000/svg" width="{IconSize}" height="{IconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9l3 3-3 3M13 15h4"/></svg>','chevron-left':'<svg xmlns="http://www.w3.org/2000/svg" width="{IconSize}" height="{IconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>','chevron-right':'<svg xmlns="http://www.w3.org/2000/svg" width="{IconSize}" height="{IconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>','download':'<svg xmlns="http://www.w3.org/2000/svg" width="{IconSize}" height="{IconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>','save':'<svg xmlns="http://www.w3.org/2000/svg" width="{IconSize}" height="{IconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>','chevron-up':'<svg xmlns="http://www.w3.org/2000/svg" width="{IconSize}" height="{IconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>','chevron-down':'<svg xmlns="http://www.w3.org/2000/svg" width="{IconSize}" height="{IconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>','tag':'<svg xmlns="http://www.w3.org/2000/svg" width="{IconSize}" height="{IconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>','settings':'<svg xmlns="http://www.w3.org/2000/svg" width="{IconSize}" height="{IconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1.08 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',// ── Row / button actions ──────────────────────────────────────────────
'plus':'<svg xmlns="http://www.w3.org/2000/svg" width="{IconSize}" height="{IconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>','trash':'<svg xmlns="http://www.w3.org/2000/svg" width="{IconSize}" height="{IconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M6 6v14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6"/><path d="M10 11v6M14 11v6"/></svg>','test':'<svg xmlns="http://www.w3.org/2000/svg" width="{IconSize}" height="{IconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/></svg>','connect':'<svg xmlns="http://www.w3.org/2000/svg" width="{IconSize}" height="{IconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14a5 5 0 0 1 0-7l3-3a5 5 0 0 1 7 7l-1.5 1.5"/><path d="M14 10a5 5 0 0 1 0 7l-3 3a5 5 0 0 1-7-7l1.5-1.5"/></svg>','disconnect':'<svg xmlns="http://www.w3.org/2000/svg" width="{IconSize}" height="{IconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 7l3-3M4 20l3-3M15 5l-2 2M9 19l2-2"/><path d="M10 14a5 5 0 0 1 0-7l1.5-1.5"/><path d="M14 10a5 5 0 0 1 0 7l-1.5 1.5"/></svg>','refresh':'<svg xmlns="http://www.w3.org/2000/svg" width="{IconSize}" height="{IconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 4v5h-5"/></svg>','eye':'<svg xmlns="http://www.w3.org/2000/svg" width="{IconSize}" height="{IconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>','external-link':'<svg xmlns="http://www.w3.org/2000/svg" width="{IconSize}" height="{IconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14L21 3"/></svg>','play':'<svg xmlns="http://www.w3.org/2000/svg" width="{IconSize}" height="{IconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 4 20 12 6 20 6 4"/></svg>','info':'<svg xmlns="http://www.w3.org/2000/svg" width="{IconSize}" height="{IconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',// ── Status / misc ─────────────────────────────────────────────────────
'check':'<svg xmlns="http://www.w3.org/2000/svg" width="{IconSize}" height="{IconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>','x':'<svg xmlns="http://www.w3.org/2000/svg" width="{IconSize}" height="{IconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>','warning':'<svg xmlns="http://www.w3.org/2000/svg" width="{IconSize}" height="{IconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9L2 18a2 2 0 0 0 1.7 3h16.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>','database':'<svg xmlns="http://www.w3.org/2000/svg" width="{IconSize}" height="{IconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="8" ry="2.5"/><path d="M4 5v14c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5V5"/><path d="M4 12c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5"/></svg>','key':'<svg xmlns="http://www.w3.org/2000/svg" width="{IconSize}" height="{IconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="15" r="4"/><path d="M10.8 12.2L21 2M17 6l3 3M14 9l3 3"/></svg>',// ── Theme / mode switcher ─────────────────────────────────────────────
'sun':'<svg xmlns="http://www.w3.org/2000/svg" width="{IconSize}" height="{IconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>','moon':'<svg xmlns="http://www.w3.org/2000/svg" width="{IconSize}" height="{IconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>','monitor':'<svg xmlns="http://www.w3.org/2000/svg" width="{IconSize}" height="{IconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></svg>','palette':'<svg xmlns="http://www.w3.org/2000/svg" width="{IconSize}" height="{IconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a9 9 0 1 0 0 18c1.66 0 3-1.34 3-3v-.5a2.5 2.5 0 0 1 2.5-2.5H19a3 3 0 0 0 3-3 9 9 0 0 0-10-9z"/><circle cx="7.5" cy="10.5" r="1" fill="currentColor"/><circle cx="10.5" cy="7" r="1" fill="currentColor"/><circle cx="14.5" cy="7" r="1" fill="currentColor"/><circle cx="17.5" cy="10.5" r="1" fill="currentColor"/></svg>',// ── Fallback ──────────────────────────────────────────────────────────
'default':'<svg xmlns="http://www.w3.org/2000/svg" width="{IconSize}" height="{IconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="12" cy="12" r="2"/></svg>'};class PictProviderDataBeaconIcons extends libPictProvider{constructor(pFable,pOptions,pServiceHash){let tmpOptions=Object.assign({},_ProviderConfiguration,pOptions);super(pFable,tmpOptions,pServiceHash);this.serviceType='PictProviderDataBeaconIcons';// Deep copy the default icon set so consumer registrations do not mutate it.
this._Icons=JSON.parse(JSON.stringify(_DefaultIcons));}onAfterInitialize(){this._registerIconTemplates();return super.onAfterInitialize();}/**
	 * Register each icon as a pict template so it can be emitted inline via
	 * `{~Template:DataBeacon-Icon-<key>:~}` from any other template.
	 * Templates are registered at the default size (16px).
	 */_registerIconTemplates(){if(!this.pict||!this.pict.TemplateProvider||typeof this.pict.TemplateProvider.addTemplate!=='function'){this.log.warn('PictProviderDataBeaconIcons: TemplateProvider not available; icon templates not registered.');return;}let tmpKeys=Object.keys(this._Icons);for(let i=0;i<tmpKeys.length;i++){let tmpHash=`DataBeacon-Icon-${tmpKeys[i]}`;let tmpMarkup=this._Icons[tmpKeys[i]].replace(/\{IconSize\}/g,String(_DefaultSize));this.pict.TemplateProvider.addTemplate(tmpHash,tmpMarkup);}}/**
	 * Resolve an icon key to SVG markup at a specific pixel size.
	 * Unknown keys fall back to the `default` icon.
	 *
	 * @param {string} pIconKey
	 * @param {number} [pSize]
	 * @returns {string}
	 */getIconSVGMarkup(pIconKey,pSize){let tmpSize=pSize||_DefaultSize;let tmpKey=pIconKey&&this._Icons.hasOwnProperty(pIconKey)?pIconKey:'default';return this._Icons[tmpKey].replace(/\{IconSize\}/g,String(tmpSize));}/**
	 * Fill every `<span data-databeacon-icon="key" [data-icon-size="N"]>` placeholder
	 * within `pRootSelector` with the matching SVG. Called by views from onAfterRender
	 * so templates can stay declarative.
	 *
	 * @param {string} pRootSelector - CSS selector of the container to scan.
	 */injectIconPlaceholders(pRootSelector){if(!this.pict||!this.pict.ContentAssignment)return;let tmpRootList=this.pict.ContentAssignment.getElement(pRootSelector);if(!tmpRootList||tmpRootList.length===0)return;let tmpRoot=tmpRootList[0];let tmpPlaceholders=tmpRoot.querySelectorAll('[data-databeacon-icon]');for(let i=0;i<tmpPlaceholders.length;i++){let tmpEl=tmpPlaceholders[i];if(tmpEl.getAttribute('data-databeacon-icon-rendered')==='true')continue;let tmpKey=tmpEl.getAttribute('data-databeacon-icon');let tmpSize=parseInt(tmpEl.getAttribute('data-icon-size'),10)||_DefaultSize;tmpEl.innerHTML=this.getIconSVGMarkup(tmpKey,tmpSize);tmpEl.setAttribute('data-databeacon-icon-rendered','true');}}hasIcon(pIconKey){return this._Icons.hasOwnProperty(pIconKey);}registerIcon(pIconKey,pSVGMarkup){if(!pIconKey||!pSVGMarkup)return false;this._Icons[pIconKey]=pSVGMarkup;if(this.pict&&this.pict.TemplateProvider){this.pict.TemplateProvider.addTemplate(`DataBeacon-Icon-${pIconKey}`,pSVGMarkup.replace(/\{IconSize\}/g,String(_DefaultSize)));}return true;}}module.exports=PictProviderDataBeaconIcons;module.exports.default_configuration=_ProviderConfiguration;},{"pict-provider":13}],102:[function(require,module,exports){/**
 * Retold DataBeacon — Saved Queries Provider
 *
 * localStorage-backed library of reusable SQL queries. Each record has a
 * stable GUIDSavedQuery (Meadow's GUID${Entity} convention), a Name,
 * free-form Documentation, the SQL body, an optional associated connection,
 * freeform Tags, create/update timestamps, and a last-run timestamp +
 * row count populated by QueryPanel.execute.
 *
 * Storage envelope:
 *   localStorage[databeacon.savedQueries] = JSON.stringify({
 *     Version: 1,
 *     Records: { [GUID]: { ...record } }
 *   })
 *
 * Exposes view-ready data at AppData.SavedQueries for the
 * SavedQueriesList view and QueryPanel to bind against.
 */const libPictProvider=require('pict-provider');const _ProviderConfiguration={ProviderIdentifier:'DataBeacon-SavedQueries',AutoInitialize:true,AutoInitializeOrdinal:0};const _StorageKey='databeacon.savedQueries';const _SchemaVersion=1;class PictProviderDataBeaconSavedQueries extends libPictProvider{constructor(pFable,pOptions,pServiceHash){let tmpOptions=Object.assign({},_ProviderConfiguration,pOptions);super(pFable,tmpOptions,pServiceHash);this.serviceType='PictProviderDataBeaconSavedQueries';this._Records={};}onAfterInitialize(){this._load();if(!this.pict.AppData.SavedQueries){this.pict.AppData.SavedQueries={List:[],Count:0,IsEmpty:true,Expanded:false,ActiveGUID:null,ToggleIcon:'chevron-right'};}this._recomputeViewData();return super.onAfterInitialize();}// ================================================================
// Public CRUD
// ================================================================
list(){let tmpOut=[];let tmpKeys=Object.keys(this._Records);for(let i=0;i<tmpKeys.length;i++)tmpOut.push(this._Records[tmpKeys[i]]);tmpOut.sort((a,b)=>String(b.DateUpdated||'').localeCompare(String(a.DateUpdated||'')));return tmpOut;}get(pGUID){if(!pGUID)return null;return this._Records[pGUID]||null;}create(pDraft){let tmpDraft=pDraft||{};let tmpGUID=this._generateGUID();let tmpNow=new Date().toISOString();let tmpRecord={GUIDSavedQuery:tmpGUID,Name:typeof tmpDraft.Name==='string'&&tmpDraft.Name.length>0?tmpDraft.Name:'Untitled Query',Documentation:typeof tmpDraft.Documentation==='string'?tmpDraft.Documentation:'',SQL:typeof tmpDraft.SQL==='string'?tmpDraft.SQL:'',IDBeaconConnection:this._normalizeConnectionID(tmpDraft.IDBeaconConnection),Tags:this._normalizeTags(tmpDraft.Tags),DateCreated:tmpNow,DateUpdated:tmpNow,DateLastRun:null,LastRowCount:null};this._Records[tmpGUID]=tmpRecord;this._persist();this._broadcast();return tmpRecord;}update(pGUID,pPatch){let tmpExisting=this._Records[pGUID];if(!tmpExisting)return null;let tmpNext=Object.assign({},tmpExisting);if(pPatch){if(typeof pPatch.Name==='string'&&pPatch.Name.length>0)tmpNext.Name=pPatch.Name;if(typeof pPatch.Documentation==='string')tmpNext.Documentation=pPatch.Documentation;if(typeof pPatch.SQL==='string')tmpNext.SQL=pPatch.SQL;if('IDBeaconConnection'in pPatch)tmpNext.IDBeaconConnection=this._normalizeConnectionID(pPatch.IDBeaconConnection);if('Tags'in pPatch)tmpNext.Tags=this._normalizeTags(pPatch.Tags);}tmpNext.DateUpdated=new Date().toISOString();this._Records[pGUID]=tmpNext;this._persist();this._broadcast();return tmpNext;}remove(pGUID){if(!this._Records[pGUID])return false;delete this._Records[pGUID];// If the deleted query was the active one, clear the active pointer.
if(this.pict.AppData.SavedQueries&&this.pict.AppData.SavedQueries.ActiveGUID===pGUID){this.pict.AppData.SavedQueries.ActiveGUID=null;}this._persist();this._broadcast();return true;}/**
	 * Record a successful execution against a saved query. Invoked from
	 * QueryPanel._execute after the server responds.
	 */noteRun(pGUID,pRowCount){if(!pGUID||!this._Records[pGUID])return false;this._Records[pGUID].DateLastRun=new Date().toISOString();this._Records[pGUID].LastRowCount=typeof pRowCount==='number'&&isFinite(pRowCount)?pRowCount:null;this._persist();this._broadcast();return true;}setActiveGUID(pGUID){if(!this.pict.AppData.SavedQueries)this.pict.AppData.SavedQueries={};this.pict.AppData.SavedQueries.ActiveGUID=pGUID||null;this._broadcast();}getActiveGUID(){return this.pict.AppData.SavedQueries&&this.pict.AppData.SavedQueries.ActiveGUID||null;}setExpanded(pExpanded){if(!this.pict.AppData.SavedQueries)this.pict.AppData.SavedQueries={};this.pict.AppData.SavedQueries.Expanded=!!pExpanded;this._broadcast();}toggleExpanded(){this.setExpanded(!(this.pict.AppData.SavedQueries&&this.pict.AppData.SavedQueries.Expanded));}// ================================================================
// Internal
// ================================================================
_broadcast(){this._recomputeViewData();if(this.pict.views.SavedQueriesList&&typeof this.pict.views.SavedQueriesList.render==='function'){this.pict.views.SavedQueriesList.render();}}_recomputeViewData(){let tmpItems=this.list();let tmpConnections=this.pict.AppData.Connections||[];let tmpPrev=this.pict.AppData.SavedQueries||{};let tmpActiveGUID=tmpPrev.ActiveGUID||null;let tmpExpanded=!!tmpPrev.Expanded;let tmpList=[];for(let i=0;i<tmpItems.length;i++){let tmpR=tmpItems[i];let tmpConn=this._findConnection(tmpConnections,tmpR.IDBeaconConnection);let tmpIsActive=tmpR.GUIDSavedQuery===tmpActiveGUID;tmpList.push({GUIDSavedQuery:tmpR.GUIDSavedQuery,Name:tmpR.Name,Documentation:tmpR.Documentation,DocumentationPreview:this._truncate(tmpR.Documentation,80),SQL:tmpR.SQL,IDBeaconConnection:tmpR.IDBeaconConnection,Tags:tmpR.Tags,TagsDisplay:Array.isArray(tmpR.Tags)&&tmpR.Tags.length>0?tmpR.Tags.join(', '):'—',ConnectionLabel:tmpConn?`${tmpConn.Name} (${tmpConn.Type})`:'—',DateCreated:tmpR.DateCreated,DateUpdated:tmpR.DateUpdated,DateLastRun:tmpR.DateLastRun,DateUpdatedDisplay:this._formatDate(tmpR.DateUpdated),DateLastRunDisplay:tmpR.DateLastRun?this._formatDate(tmpR.DateLastRun):'—',LastRowCount:tmpR.LastRowCount,LastRowCountDisplay:tmpR.LastRowCount!==null&&tmpR.LastRowCount!==undefined?String(tmpR.LastRowCount):'—',IsActive:tmpIsActive,ActiveClass:tmpIsActive?'is-active-query':''});}this.pict.AppData.SavedQueries={List:tmpList,Count:tmpList.length,IsEmpty:tmpList.length===0,Expanded:tmpExpanded,ActiveGUID:tmpActiveGUID,ToggleIcon:tmpExpanded?'chevron-down':'chevron-right',ToggleLabel:tmpExpanded?'Hide':'Show'};}_findConnection(pConnections,pID){if(pID===null||pID===undefined)return null;for(let i=0;i<pConnections.length;i++){if(pConnections[i].IDBeaconConnection===pID)return pConnections[i];}return null;}_truncate(pStr,pMax){if(!pStr)return'';let tmpS=String(pStr);return tmpS.length<=pMax?tmpS:tmpS.substring(0,pMax-1)+'…';}_formatDate(pISO){if(!pISO)return'';try{let tmpD=new Date(pISO);if(isNaN(tmpD.getTime()))return pISO;let tmpPad=n=>String(n).padStart(2,'0');return tmpD.getFullYear()+'-'+tmpPad(tmpD.getMonth()+1)+'-'+tmpPad(tmpD.getDate())+' '+tmpPad(tmpD.getHours())+':'+tmpPad(tmpD.getMinutes());}catch(pError){return pISO;}}_normalizeTags(pTags){if(Array.isArray(pTags)){let tmpOut=[];for(let i=0;i<pTags.length;i++){let tmpT=String(pTags[i]||'').trim();if(tmpT.length>0)tmpOut.push(tmpT);}return tmpOut;}if(typeof pTags==='string'){let tmpParts=pTags.split(',');let tmpOut=[];for(let i=0;i<tmpParts.length;i++){let tmpT=tmpParts[i].trim();if(tmpT.length>0)tmpOut.push(tmpT);}return tmpOut;}return[];}_normalizeConnectionID(pID){if(pID===null||pID===undefined||pID==='')return null;let tmpN=parseInt(pID,10);return isNaN(tmpN)?null:tmpN;}_generateGUID(){if(this.pict&&typeof this.pict.getUUID==='function'){try{let tmpUUID=this.pict.getUUID();if(tmpUUID)return tmpUUID;}catch(pError){/* fall through */}}return'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,pChar=>{let tmpR=Math.random()*16|0;let tmpV=pChar==='x'?tmpR:tmpR&0x3|0x8;return tmpV.toString(16);});}_load(){try{if(typeof localStorage==='undefined')return;let tmpRaw=localStorage.getItem(_StorageKey);if(!tmpRaw)return;let tmpParsed=JSON.parse(tmpRaw);if(tmpParsed&&tmpParsed.Version===_SchemaVersion&&tmpParsed.Records&&typeof tmpParsed.Records==='object'){this._Records=tmpParsed.Records;}}catch(pError){this.log.warn(`SavedQueries load failed: ${pError&&pError.message?pError.message:pError}`);this._Records={};}}_persist(){try{if(typeof localStorage==='undefined')return;localStorage.setItem(_StorageKey,JSON.stringify({Version:_SchemaVersion,Records:this._Records}));}catch(pError){this.log.warn(`SavedQueries persist failed: ${pError&&pError.message?pError.message:pError}`);}}}module.exports=PictProviderDataBeaconSavedQueries;module.exports.default_configuration=_ProviderConfiguration;},{"pict-provider":13}],103:[function(require,module,exports){/**
 * Retold DataBeacon — API Provider
 *
 * Calls the DataBeacon REST API, stores results in AppData, and pre-computes
 * render-ready view data (status labels, badge classes, per-row flags, etc.)
 * so the Pict templates can stay declarative. After each API response the
 * appropriate sub-views are re-rendered.
 */const libPictProvider=require('pict-view');class DataBeaconProvider extends libPictProvider{constructor(pFable,pOptions,pServiceHash){super(pFable,pOptions,pServiceHash);this.serviceType='DataBeaconProvider';}_apiCall(pMethod,pPath,pBody,fCallback){let tmpOptions={method:pMethod,headers:{'Content-Type':'application/json'}};if(pBody&&pMethod!=='GET'){tmpOptions.body=JSON.stringify(pBody);}fetch(pPath,tmpOptions).then(pResponse=>pResponse.json()).then(pData=>{if(fCallback)fCallback(null,pData);}).catch(pError=>{if(fCallback)fCallback(pError);});}// ================================================================
// Connections
// ================================================================
loadConnections(fCallback){this._apiCall('GET','/beacon/connections',null,(pError,pData)=>{if(!pError&&pData){this.pict.AppData.Connections=this._decorateConnections(pData.Connections||[]);}this._recomputeDashboard();this.refreshIntrospectionViewData();this.refreshRecordBrowserViewData();this._renderConnectionViews();this._renderDashboard();this._renderIntrospectionViews();if(fCallback)fCallback(pError,pData);});}createConnection(pConnectionData,fCallback){this._apiCall('POST','/beacon/connection',pConnectionData,(pError,pData)=>{if(!pError&&pData&&pData.Success)this.loadConnections();if(fCallback)fCallback(pError,pData);});}updateConnection(pID,pConnectionData,fCallback){this._apiCall('PUT',`/beacon/connection/${pID}`,pConnectionData,(pError,pData)=>{if(!pError&&pData&&pData.Success)this.loadConnections();if(fCallback)fCallback(pError,pData);});}deleteConnection(pID,fCallback){this._apiCall('DELETE',`/beacon/connection/${pID}`,null,(pError,pData)=>{if(!pError&&pData&&pData.Success)this.loadConnections();if(fCallback)fCallback(pError,pData);});}testConnection(pID,fCallback){this._apiCall('POST',`/beacon/connection/${pID}/test`,null,(pError,pData)=>{this.loadConnections();if(fCallback)fCallback(pError,pData);});}connectConnection(pID,fCallback){this._apiCall('POST',`/beacon/connection/${pID}/connect`,null,(pError,pData)=>{this.loadConnections();if(fCallback)fCallback(pError,pData);});}disconnectConnection(pID,fCallback){this._apiCall('POST',`/beacon/connection/${pID}/disconnect`,null,(pError,pData)=>{this.loadConnections();if(fCallback)fCallback(pError,pData);});}loadAvailableTypes(fCallback){// Two parallel hits:
//   - /beacon/connection/available-types  → installed-flag map (kept
//     for compatibility with anything still iterating
//     AppData.AvailableTypes / AvailableTypesForForm).
//   - /beacon/connection/schemas          → aggregated form schemas
//     (drives the shared pict-section-connection-form view).
// Both are cheap, idempotent, and only run on app load.
this._apiCall('GET','/beacon/connection/available-types',null,(pError,pData)=>{if(!pError&&pData){this.pict.AppData.AvailableTypes=pData.Types||[];this.pict.AppData.AvailableTypesForForm=this._buildAvailableTypesForForm(this.pict.AppData.AvailableTypes);}if(this.pict.views.ConnectionForm)this.pict.views.ConnectionForm.render();if(fCallback)fCallback(pError,pData);});// Hand the schemas to the shared view so its provider <select>
// + per-provider field block can paint.  Failures are non-fatal
// — the shared view shows a friendly empty-state notice.
this._apiCall('GET','/beacon/connection/schemas',null,(pSchemaError,pSchemaData)=>{let tmpSchemas=pSchemaData&&Array.isArray(pSchemaData.Schemas)?pSchemaData.Schemas:[];let tmpFormView=this.pict.views['PictSection-ConnectionForm'];if(tmpFormView&&typeof tmpFormView.setSchemas==='function'){tmpFormView.setSchemas(tmpSchemas);}if(pSchemaError&&this.fable&&this.fable.log){this.fable.log.warn(`DataBeacon: failed to fetch /beacon/connection/schemas: ${pSchemaError.message||pSchemaError}`);}});}// ================================================================
// Introspection
// ================================================================
introspect(pConnectionID,fCallback){this._apiCall('POST',`/beacon/connection/${pConnectionID}/introspect`,null,(pError,pData)=>{if(!pError&&pData&&pData.Success){this.loadTables(pConnectionID);}if(fCallback)fCallback(pError,pData);});}loadTables(pConnectionID,fCallback){this._apiCall('GET',`/beacon/connection/${pConnectionID}/tables`,null,(pError,pData)=>{if(!pError&&pData){this.pict.AppData.Tables=pData.Tables||[];this.pict.AppData.SelectedConnectionID=pConnectionID;}this.refreshIntrospectionViewData();this._renderIntrospectionViews();if(fCallback)fCallback(pError,pData);});}loadTableDetails(pConnectionID,pTableName,fCallback){this._apiCall('GET',`/beacon/connection/${pConnectionID}/table/${pTableName}`,null,(pError,pData)=>{if(fCallback)fCallback(pError,pData);});}executeQuery(pConnectionID,pSQL,fCallback){this._apiCall('POST',`/beacon/connection/${pConnectionID}/query`,{SQL:pSQL},(pError,pData)=>{if(fCallback)fCallback(pError,pData);});}// ================================================================
// Endpoints
// ================================================================
enableEndpoint(pConnectionID,pTableName,fCallback){this._apiCall('POST',`/beacon/endpoint/${pConnectionID}/${pTableName}/enable`,null,(pError,pData)=>{this.loadEndpoints();this.loadTables(pConnectionID);if(fCallback)fCallback(pError,pData);});}disableEndpoint(pConnectionID,pTableName,fCallback){this._apiCall('POST',`/beacon/endpoint/${pConnectionID}/${pTableName}/disable`,null,(pError,pData)=>{this.loadEndpoints();this.loadTables(pConnectionID);if(fCallback)fCallback(pError,pData);});}loadEndpoints(fCallback){this._apiCall('GET','/beacon/endpoints',null,(pError,pData)=>{if(!pError&&pData){this.pict.AppData.Endpoints=this._decorateEndpoints(pData.Endpoints||[]);}this._recomputeDashboard();this.refreshRecordBrowserViewData();if(this.pict.views.Endpoints)this.pict.views.Endpoints.render();this._renderDashboard();if(this.pict.views.RecordBrowser)this.pict.views.RecordBrowser.render();if(fCallback)fCallback(pError,pData);});}// ================================================================
// Records
// ================================================================
loadRecords(pTableName,pStart,pCap,pFilterOrCallback,fCallback){// Backwards-compatible signature: callers that pre-date filter support
// pass `(table, start, cap, fCallback)`.  New callers pass
// `(table, start, cap, filter, fCallback)`.
let tmpFilter='';let tmpCallback=fCallback;if(typeof pFilterOrCallback==='function'){tmpCallback=pFilterOrCallback;}else if(typeof pFilterOrCallback==='string'){tmpFilter=pFilterOrCallback.trim();}let tmpStart=this._toNonNegativeInt(pStart,0);let tmpCap=this._toPositiveInt(pCap,50);if(!this.pict.AppData.RecordBrowser)this.pict.AppData.RecordBrowser={};this.pict.AppData.RecordBrowser.CursorStart=tmpStart;this.pict.AppData.RecordBrowser.PageSize=tmpCap;this.pict.AppData.RecordBrowser.FilterString=tmpFilter;// Dynamic endpoints are namespaced under the connection's sanitized
// name (see DataBeacon-DynamicEndpointManager.js).  Filtered reads
// route to /{Scope}s/FilteredTo/<filter>/<begin>/<cap>; unfiltered
// to /{Scope}s/<begin>/<cap>.  Filter values go in the URL per the
// meadow-endpoints convention (FBL expression, URL-encoded).
let tmpPrefix=this._routeHashForSelectedConnection();let tmpPathBase=tmpPrefix?`/1.0/${tmpPrefix}`:'/1.0';let tmpPath=tmpFilter?`${tmpPathBase}/${pTableName}s/FilteredTo/${encodeURIComponent(tmpFilter)}/${tmpStart}/${tmpCap}`:`${tmpPathBase}/${pTableName}s/${tmpStart}/${tmpCap}`;this._apiCall('GET',tmpPath,null,(pError,pData)=>{if(!pError&&pData){this.pict.AppData.Records=Array.isArray(pData)?pData:pData.Records||[];this.pict.AppData.SelectedTableName=pTableName;}this.refreshRecordBrowserViewData();if(this.pict.views.RecordBrowser)this.pict.views.RecordBrowser.render();if(tmpCallback)tmpCallback(pError,pData);});}/**
	 * Non-blocking count fetch.  Updates AppData.RecordBrowser.TotalCount
	 * and re-renders the RecordBrowser so the page strip + badge refresh
	 * whenever the server answers.  Failures are swallowed (leaves
	 * TotalCount null; UI falls back to the "no count, probe with Next"
	 * behavior).
	 */loadRecordCount(pTableName,pFilter,fCallback){if(!this.pict.AppData.RecordBrowser){this.pict.AppData.RecordBrowser={};}this.pict.AppData.RecordBrowser.TotalCount=null;this.pict.AppData.RecordBrowser.CountIsLoading=true;let tmpPrefix=this._routeHashForSelectedConnection();let tmpPathBase=tmpPrefix?`/1.0/${tmpPrefix}`:'/1.0';let tmpFilter=(pFilter||'').trim();let tmpPath=tmpFilter?`${tmpPathBase}/${pTableName}s/Count/FilteredTo/${encodeURIComponent(tmpFilter)}`:`${tmpPathBase}/${pTableName}s/Count`;this._apiCall('GET',tmpPath,null,(pError,pData)=>{let tmpCount=null;if(!pError&&pData!=null){// meadow-endpoints returns { Count: N } or just N.
if(typeof pData==='number'){tmpCount=pData;}else if(typeof pData==='object'&&typeof pData.Count==='number'){tmpCount=pData.Count;}}this.pict.AppData.RecordBrowser.TotalCount=tmpCount;this.pict.AppData.RecordBrowser.CountIsLoading=false;this.refreshRecordBrowserViewData();if(this.pict.views.RecordBrowser)this.pict.views.RecordBrowser.render();if(fCallback)fCallback(pError,tmpCount);});}/**
	 * Full-set fetch for export.  Hits the unpaginated endpoint (no begin/cap)
	 * which meadow-endpoints exposes for filtered reads.  For unfiltered we
	 * fall back to a large single page -- servers should cap this themselves
	 * but callers should treat it as "up to the server's hard limit" rather
	 * than a guaranteed full enumeration of million-row tables.
	 */loadRecordsAll(pTableName,pFilter,fCallback){let tmpPrefix=this._routeHashForSelectedConnection();let tmpPathBase=tmpPrefix?`/1.0/${tmpPrefix}`:'/1.0';let tmpFilter=(pFilter||'').trim();let tmpPath=tmpFilter?`${tmpPathBase}/${pTableName}s/FilteredTo/${encodeURIComponent(tmpFilter)}`:`${tmpPathBase}/${pTableName}s/0/100000`;this._apiCall('GET',tmpPath,null,(pError,pData)=>{if(pError){return fCallback(pError);}let tmpRows=Array.isArray(pData)?pData:pData&&pData.Records||[];return fCallback(null,tmpRows);});}/**
	 * Client-side equivalent of meadow-connection-manager's
	 * sanitizeConnectionName -- lowercases and replaces non-URL-safe chars
	 * (notably underscores) with hyphens.  Must stay in sync with the
	 * server's sanitizer so route-hash matching works end-to-end.  Returns
	 * '' when no connection is selected so callers can fall back to the
	 * unprefixed /1.0/<Table> path.
	 */_routeHashForSelectedConnection(){let tmpCID=this.pict.AppData.SelectedConnectionID;if(!tmpCID){return'';}let tmpConns=this.pict.AppData.Connections||[];let tmpConn=tmpConns.find(pC=>pC.IDBeaconConnection===tmpCID);if(!tmpConn||!tmpConn.Name){return'';}return String(tmpConn.Name).toLowerCase().replace(/[^a-z0-9-]+/g,'-');}_toNonNegativeInt(pValue,pDefault){let tmpN=parseInt(pValue,10);if(isNaN(tmpN)||tmpN<0)return pDefault;return tmpN;}_toPositiveInt(pValue,pDefault){let tmpN=parseInt(pValue,10);if(isNaN(tmpN)||tmpN<1)return pDefault;return tmpN;}// ================================================================
// Beacon
// ================================================================
connectBeacon(pConfig,fCallback){this._apiCall('POST','/beacon/ultravisor/connect',pConfig,(pError,pData)=>{this.loadBeaconStatus();if(fCallback)fCallback(pError,pData);});}disconnectBeacon(fCallback){this._apiCall('POST','/beacon/ultravisor/disconnect',null,(pError,pData)=>{this.loadBeaconStatus();if(fCallback)fCallback(pError,pData);});}loadBeaconStatus(fCallback){this._apiCall('GET','/beacon/ultravisor/status',null,(pError,pData)=>{if(!pError&&pData)this.pict.AppData.BeaconStatus=pData;this._recomputeDashboard();this._renderDashboard();if(fCallback)fCallback(pError,pData);});}// ================================================================
// View data computation (public helpers + internal)
// ================================================================
/**
	 * Recompute AppData.Introspection based on current Connections/Tables.
	 * Auto-selects the sole connected database when nothing is selected.
	 * Safe to call repeatedly and in response to any data change.
	 */refreshIntrospectionViewData(){let tmpConns=this.pict.AppData.Connections||[];let tmpTables=this.pict.AppData.Tables||[];let tmpCID=this.pict.AppData.SelectedConnectionID;// Connected-only list for the picker.
let tmpConnectedList=[];for(let i=0;i<tmpConns.length;i++){if(tmpConns[i].Connected)tmpConnectedList.push(tmpConns[i]);}// Auto-select sole connection.
if(!tmpCID&&tmpConnectedList.length===1){tmpCID=tmpConnectedList[0].IDBeaconConnection;this.pict.AppData.SelectedConnectionID=tmpCID;}// Decorate connection list with SelectedAttr for the dropdown.
let tmpListForTemplate=[];for(let i=0;i<tmpConnectedList.length;i++){let tmpConn=tmpConnectedList[i];tmpListForTemplate.push({IDBeaconConnection:tmpConn.IDBeaconConnection,Name:tmpConn.Name,Type:tmpConn.Type,SelectedAttr:tmpConn.IDBeaconConnection===tmpCID?'selected':''});}let tmpSelectedConn=null;for(let i=0;i<tmpConns.length;i++){if(tmpConns[i].IDBeaconConnection===tmpCID){tmpSelectedConn=tmpConns[i];break;}}let tmpBanner=null;if(tmpSelectedConn){tmpBanner={Name:tmpSelectedConn.Name,Type:tmpSelectedConn.Type,StatusLabel:tmpSelectedConn.StatusLabel,StatusBadgeClass:tmpSelectedConn.StatusBadgeClass,Description:tmpSelectedConn.Description||'',HasDescription:!!tmpSelectedConn.Description};}// Table rows view shape.
let tmpTablesView=[];for(let i=0;i<tmpTables.length;i++){let tmpTable=tmpTables[i];tmpTablesView.push({ConnectionID:tmpCID,TableName:tmpTable.TableName,ColumnCount:tmpTable.ColumnCount,RowCountDisplay:tmpTable.RowCountEstimate===null||tmpTable.RowCountEstimate===undefined?'--':tmpTable.RowCountEstimate,EndpointsEnabled:!!tmpTable.EndpointsEnabled});}let tmpState;if(tmpConnectedList.length===0)tmpState='NoConnections';else if(!tmpCID)tmpState='NoSelection';else if(tmpTablesView.length===0)tmpState='Empty';else tmpState='HasTables';let tmpTablesHeader=null;if(tmpState==='HasTables'&&tmpSelectedConn){let tmpCount=tmpTablesView.length;tmpTablesHeader={ConnectionName:tmpSelectedConn.Name,Subline:`${tmpSelectedConn.Type} \u00B7 ${tmpCount} table${tmpCount!==1?'s':''} discovered`};}let tmpShowPlaceholder=tmpConnectedList.length!==1||!tmpCID;let tmpRunDisabled=!tmpCID;let tmpAllDisabled=tmpConnectedList.length===0;this.pict.AppData.Introspection={ConnectedList:tmpListForTemplate,ShowPlaceholder:tmpShowPlaceholder,HasSelection:!!tmpSelectedConn,SelectedBanner:tmpBanner,RunDisabled:tmpRunDisabled,AllDisabled:tmpAllDisabled,// Template-friendly class names; anchor elements don't honor
// `disabled` so we swap visual state via CSS classes.
RunDisabledClass:tmpRunDisabled?'disabled':'',AllDisabledClass:tmpAllDisabled?'disabled':'',State:tmpState,TablesView:tmpTablesView,TablesHeader:tmpTablesHeader,DetailModalColumns:this.pict.AppData.Introspection&&this.pict.AppData.Introspection.DetailModalColumns||[]};}/**
	 * Recompute AppData.RecordBrowser based on current Endpoints/Records
	 * and the persisted CursorStart / PageSize. Preserves the caller's
	 * cursor/size preferences across fetches.
	 */refreshRecordBrowserViewData(){let tmpEndpoints=this.pict.AppData.Endpoints||[];let tmpRecords=this.pict.AppData.Records||[];let tmpSelectedTable=this.pict.AppData.SelectedTableName||'';let tmpPrev=this.pict.AppData.RecordBrowser||{};let tmpCursorStart=this._toNonNegativeInt(tmpPrev.CursorStart,0);let tmpPageSize=this._toPositiveInt(tmpPrev.PageSize,50);let tmpFilter=typeof tmpPrev.FilterString==='string'?tmpPrev.FilterString:'';let tmpTotalCount=typeof tmpPrev.TotalCount==='number'?tmpPrev.TotalCount:null;let tmpCountIsLoading=!!tmpPrev.CountIsLoading;let tmpTableOptions=[];for(let i=0;i<tmpEndpoints.length;i++){tmpTableOptions.push({TableName:tmpEndpoints[i].TableName,SelectedAttr:tmpEndpoints[i].TableName===tmpSelectedTable?'selected':''});}let tmpPageSizeOptions=this._buildPageSizeOptions(tmpPageSize);let tmpState;let tmpColumnList=[];let tmpRows=[];let tmpFetched=tmpRecords.length;if(!tmpSelectedTable)tmpState='NoSelection';else if(tmpFetched===0)tmpState='Empty';else{tmpState='HasRows';let tmpColumnNames=Object.keys(tmpRecords[0]||{});for(let c=0;c<tmpColumnNames.length;c++)tmpColumnList.push({Name:tmpColumnNames[c]});for(let r=0;r<tmpFetched;r++){let tmpCells=[];for(let c=0;c<tmpColumnNames.length;c++){tmpCells.push({CellHTML:this._formatCellValue(tmpRecords[r][tmpColumnNames[c]])});}tmpRows.push({Cells:tmpCells});}}let tmpCurrentPage=Math.floor(tmpCursorStart/tmpPageSize)+1;let tmpPageCount=tmpTotalCount===null||tmpTotalCount<=0?0:Math.max(1,Math.ceil(tmpTotalCount/tmpPageSize));// Prev/Next:
//   With a count known: both bounded by the count-derived page range.
//   Without a count: fall back to probe-next-if-page-was-full heuristic.
let tmpPrevDisabled=!tmpSelectedTable||tmpCurrentPage<=1;let tmpNextDisabled;if(tmpPageCount>0){tmpNextDisabled=!tmpSelectedTable||tmpCurrentPage>=tmpPageCount;}else{tmpNextDisabled=!tmpSelectedTable||tmpFetched<tmpPageSize;}let tmpRangeLabel;if(!tmpSelectedTable){tmpRangeLabel='';}else if(tmpFetched===0){tmpRangeLabel=tmpFilter?`No records match the current filter.`:`No records at start ${tmpCursorStart}.`;}else{let tmpRangeEnd=tmpCursorStart+tmpFetched;tmpRangeLabel=`Showing records ${tmpCursorStart+1}–${tmpRangeEnd} · Page size ${tmpPageSize}`;if(tmpPageCount>0){tmpRangeLabel+=` · Page ${tmpCurrentPage} of ${tmpPageCount}`;}}// Label for the "Export all" action and the count badge.  Phrased as
// "N filtered records" or "N records" so the user can see the full
// scope of the download before clicking.
let tmpTotalCountLabel='';let tmpFullExportLabel='records';if(tmpCountIsLoading){tmpTotalCountLabel='counting…';tmpFullExportLabel=tmpFilter?'filtered records (counting…)':'records (counting…)';}else if(tmpTotalCount!==null){tmpTotalCountLabel=`${tmpTotalCount.toLocaleString()} total`;tmpFullExportLabel=tmpFilter?`${tmpTotalCount.toLocaleString()} filtered records`:`${tmpTotalCount.toLocaleString()} records`;}// Route-href builders.  Emitting the full hash URL in AppData means
// the template can bind {~D:...Href~} directly without computing paths.
let tmpHrefBase='#/records/page/';let tmpPrevHref=tmpCurrentPage>1?`${tmpHrefBase}${tmpCurrentPage-1}`:`${tmpHrefBase}${tmpCurrentPage}`;let tmpNextHref=tmpPageCount===0||tmpCurrentPage<tmpPageCount?`${tmpHrefBase}${tmpCurrentPage+1}`:`${tmpHrefBase}${tmpCurrentPage}`;let tmpPageLinks=this._buildPageLinks(tmpCurrentPage,tmpPageCount,tmpHrefBase);let tmpLoadDisabled=!tmpSelectedTable;let tmpHasTotalCount=tmpTotalCount!==null||tmpCountIsLoading;this.pict.AppData.RecordBrowser={TableOptions:tmpTableOptions,PageSizeOptions:tmpPageSizeOptions,SelectedTableName:tmpSelectedTable,TableName:tmpSelectedTable,CursorStart:tmpCursorStart,PageSize:tmpPageSize,Page:tmpCurrentPage,PageCount:tmpPageCount,PageLinks:tmpPageLinks,ShowPagination:tmpPageCount>1||tmpPageCount===0&&(tmpCurrentPage>1||!tmpNextDisabled),PrevHref:tmpPrevHref,NextHref:tmpNextHref,FilterString:tmpFilter,FilterClearClass:tmpFilter?'':'disabled',TotalCount:tmpTotalCount,TotalCountLabel:tmpTotalCountLabel,HasTotalCount:tmpHasTotalCount,FullExportLabel:tmpFullExportLabel,CountIsLoading:tmpCountIsLoading,PrevDisabled:tmpPrevDisabled,NextDisabled:tmpNextDisabled,LoadDisabled:tmpLoadDisabled,// Anchor-friendly class mirrors (pict imperative-first replaces
// delegated click handlers with `<a href="#/..."/>`; buttons-as-
// anchors don't honor the native `disabled` attribute).
PrevDisabledClass:tmpPrevDisabled?'disabled':'',NextDisabledClass:tmpNextDisabled?'disabled':'',LoadDisabledClass:tmpLoadDisabled?'disabled':'',RangeLabel:tmpRangeLabel,State:tmpState,ColumnList:tmpColumnList,Rows:tmpRows};}/**
	 * Produce a pagination record list for the template.
	 *
	 * Shape (each entry is one of):
	 *   { Kind: 'link', Label, Href, CurrentClass }
	 *   { Kind: 'ellipsis' }
	 *
	 * Elides middle pages for large sets so the strip stays compact:
	 *   1  2  3  …  42  43  44  45  46  …  98  99  100    (when current=44)
	 *
	 * If PageCount is 0 (no count yet), returns an empty list; the template
	 * falls back to Prev/Next-only navigation.
	 */_buildPageLinks(pCurrent,pPageCount,pHrefBase){if(pPageCount<=0){return[];}let tmpOut=[];let tmpAdd=pPage=>{tmpOut.push({Kind:'link',Label:String(pPage),Href:`${pHrefBase}${pPage}`,CurrentClass:pPage===pCurrent?'current':''});};let tmpEllipsis=()=>tmpOut.push({Kind:'ellipsis'});if(pPageCount<=9){for(let i=1;i<=pPageCount;i++){tmpAdd(i);}return tmpOut;}// Always show first two + last two + a window around the current page.
let tmpShown=new Set([1,2,pPageCount-1,pPageCount,pCurrent-1,pCurrent,pCurrent+1]);// Clamp window to valid range.
let tmpSorted=Array.from(tmpShown).filter(n=>n>=1&&n<=pPageCount).sort((a,b)=>a-b);let tmpPrev=0;for(let i=0;i<tmpSorted.length;i++){let tmpPg=tmpSorted[i];if(tmpPg-tmpPrev>1){tmpEllipsis();}tmpAdd(tmpPg);tmpPrev=tmpPg;}return tmpOut;}_buildPageSizeOptions(pCurrent){let tmpChoices=[10,25,50,100,200,500];if(tmpChoices.indexOf(pCurrent)===-1)tmpChoices.push(pCurrent);tmpChoices.sort((a,b)=>a-b);let tmpResult=[];for(let i=0;i<tmpChoices.length;i++){tmpResult.push({Value:tmpChoices[i],SelectedAttr:tmpChoices[i]===pCurrent?'selected':''});}return tmpResult;}/**
	 * Build a view-ready AppData.QueryPanel structure from raw rows returned
	 * by executeQuery(). Called by the QueryPanel view after a successful
	 * response.
	 * @param {Array<Object>} pRows
	 * @returns {Object}
	 */buildQueryResultViewData(pRows){let tmpColumnList=[];let tmpRowList=[];let tmpColumnNames=pRows&&pRows.length>0?Object.keys(pRows[0]):[];for(let c=0;c<tmpColumnNames.length;c++)tmpColumnList.push({Name:tmpColumnNames[c]});let tmpLimit=Math.min(pRows.length,100);for(let r=0;r<tmpLimit;r++){let tmpCells=[];for(let c=0;c<tmpColumnNames.length;c++){tmpCells.push({CellHTML:this._formatCellValue(pRows[r][tmpColumnNames[c]])});}tmpRowList.push({Cells:tmpCells});}return{ColumnList:tmpColumnList,Rows:tmpRowList,// RawRows keeps the unformatted response so the export provider
// can serialize to JSON/CSV/TSV without having to reverse the
// cell-HTML formatting. Limited to the same display window the
// user actually sees.
RawRows:pRows.slice(0,tmpLimit),DisplayCount:tmpLimit,TotalCount:pRows.length,IsTruncated:pRows.length>100};}/**
	 * HTML-escape a string. Exposed so views can safely interpolate error
	 * messages into error banners.
	 * @param {string} pValue
	 * @returns {string}
	 */escapeHTML(pValue){let tmpStr=pValue===null||pValue===undefined?'':String(pValue);return tmpStr.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}// ================================================================
// Private decorators
// ================================================================
_decorateConnections(pConnections){let tmpResult=[];for(let i=0;i<pConnections.length;i++){let tmpConn=pConnections[i];let tmpIsConnected=!!tmpConn.Connected;let tmpStatusLabel;let tmpStatusBadgeClass;if(tmpIsConnected){tmpStatusLabel='Connected';tmpStatusBadgeClass='badge-success';}else if(tmpConn.Status==='OK'){tmpStatusLabel='OK';tmpStatusBadgeClass='badge-info';}else if(tmpConn.Status==='Failed'){tmpStatusLabel='Failed';tmpStatusBadgeClass='badge-error';}else{tmpStatusLabel=tmpConn.Status||'Unknown';tmpStatusBadgeClass='badge-neutral';}tmpResult.push(Object.assign({},tmpConn,{Connected:tmpIsConnected,StatusLabel:tmpStatusLabel,StatusBadgeClass:tmpStatusBadgeClass,Description:tmpConn.Description||''}));}return tmpResult;}_decorateEndpoints(pEndpoints){let tmpResult=[];for(let i=0;i<pEndpoints.length;i++){let tmpEP=pEndpoints[i];let tmpBase=tmpEP.EndpointBase||'';tmpResult.push(Object.assign({},tmpEP,{EndpointAPIURL:`${tmpBase}s/0/50`}));}return tmpResult;}_buildAvailableTypesForForm(pTypes){let tmpInstalled=[];for(let i=0;i<pTypes.length;i++){if(pTypes[i].Installed)tmpInstalled.push({Type:pTypes[i].Type});}if(tmpInstalled.length===0){tmpInstalled=[{Type:'MySQL'},{Type:'PostgreSQL'},{Type:'MSSQL'},{Type:'SQLite'}];}return tmpInstalled;}_recomputeDashboard(){let tmpConns=this.pict.AppData.Connections||[];let tmpEndpoints=this.pict.AppData.Endpoints||[];let tmpBeaconStatus=this.pict.AppData.BeaconStatus||{};let tmpActive=0;let tmpSummary=[];for(let i=0;i<tmpConns.length;i++){if(tmpConns[i].Connected)tmpActive++;tmpSummary.push({Name:tmpConns[i].Name,Type:tmpConns[i].Type,StatusLabel:tmpConns[i].StatusLabel,StatusBadgeClass:tmpConns[i].StatusBadgeClass,Description:tmpConns[i].Description});}this.pict.AppData.Dashboard={TotalConnections:tmpConns.length,ActiveConnections:tmpActive,TotalEndpoints:tmpEndpoints.length,BeaconStatusLabel:tmpBeaconStatus.Connected?'Connected':'Not Connected',BeaconBadgeClass:tmpBeaconStatus.Connected?'badge-success':'badge-neutral',BeaconName:tmpBeaconStatus.BeaconName||'retold-databeacon',BeaconNameDisplay:this._prettyBeaconName(tmpBeaconStatus.BeaconName),ConnectionSummary:tmpSummary};}_prettyBeaconName(pRawName){if(!pRawName)return'';let tmpAcronyms={opdb:'OpDB',sql:'SQL',db:'DB',api:'API',uv:'UV'};let tmpStripped=String(pRawName).replace(/-?databeacon$/i,'');let tmpDisplay=tmpStripped.split('-').map(p=>tmpAcronyms[p.toLowerCase()]||(p?p[0].toUpperCase()+p.slice(1):'')).join(' ');let tmpFormatted=tmpDisplay?' — '+tmpDisplay:'';// The Layout shell template only renders once on app boot, so the
// {~D:AppData.Dashboard.BeaconNameDisplay~} binding doesn't reflect
// a later status load. Push the value into the sidebar h2 directly
// so it stays in sync once the beacon's name resolves.
if(typeof document!=='undefined'){let tmpHeader=document.querySelector('.sidebar-header h2');if(tmpHeader)tmpHeader.textContent='DataBeacon'+tmpFormatted;}return tmpFormatted;}_formatCellValue(pValue){if(pValue===null||pValue===undefined){return'<span class="null-value">NULL</span>';}if(typeof pValue==='object'){let tmpText=JSON.stringify(pValue);if(tmpText.length>80)tmpText=tmpText.substring(0,80)+'...';return`<code>${this.escapeHTML(tmpText)}</code>`;}let tmpStr=String(pValue);if(tmpStr.length>100)tmpStr=tmpStr.substring(0,100)+'...';return this.escapeHTML(tmpStr);}_renderConnectionViews(){if(this.pict.views.ConnectionList)this.pict.views.ConnectionList.render();}_renderDashboard(){if(this.pict.views.Dashboard)this.pict.views.Dashboard.render();}_renderIntrospectionViews(){if(this.pict.views.IntrospectionControls)this.pict.views.IntrospectionControls.render();if(this.pict.views.IntrospectionTables)this.pict.views.IntrospectionTables.render();}}module.exports=DataBeaconProvider;module.exports.default_configuration={ProviderIdentifier:'DataBeaconProvider',AutoInitialize:true,AutoRender:false};},{"pict-view":94}],104:[function(require,module,exports){module.exports={"ProviderIdentifier":"PictRouter","AutoInitialize":true,"AutoInitializeOrdinal":0,"Routes":[{"path":"/view/dashboard","template":"{~LV:Pict.PictApplication.setActiveView(`Dashboard`)~}"},{"path":"/Login","template":"{~LV:Pict.PictApplication.setActiveView(`Login`)~}"},{"path":"/view/connections","template":"{~LV:Pict.PictApplication.setActiveView(`Connections`)~}"},{"path":"/view/introspection","template":"{~LV:Pict.PictApplication.setActiveView(`Introspection`)~}"},{"path":"/view/endpoints","template":"{~LV:Pict.PictApplication.setActiveView(`Endpoints`)~}"},{"path":"/view/records","template":"{~LV:Pict.PictApplication.setActiveView(`Records`)~}"},{"path":"/view/sql","template":"{~LV:Pict.PictApplication.setActiveView(`SQL`)~}"},{"path":"/connections/create","template":"{~LV:Pict.PictApplication.createConnection()~}"},{"path":"/connections/:id/connect","template":"{~LV:Pict.PictApplication.connectConnection(Record.data.id)~}"},{"path":"/connections/:id/disconnect","template":"{~LV:Pict.PictApplication.disconnectConnection(Record.data.id)~}"},{"path":"/connections/:id/test","template":"{~LV:Pict.PictApplication.testConnection(Record.data.id)~}"},{"path":"/connections/:id/delete","template":"{~LV:Pict.PictApplication.deleteConnection(Record.data.id)~}"},{"path":"/connections/:id/introspect","template":"{~LV:Pict.PictApplication.introspectConnection(Record.data.id)~}"},{"path":"/introspection/run","template":"{~LV:Pict.PictApplication.runIntrospect()~}"},{"path":"/introspection/all","template":"{~LV:Pict.PictApplication.introspectAll()~}"},{"path":"/introspection/table/:connId/:table","template":"{~LV:Pict.PictApplication.viewTable(Record.data.connId, Record.data.table)~}"},{"path":"/endpoints/refresh","template":"{~LV:Pict.PictApplication.refreshEndpoints()~}"},{"path":"/endpoints/:connId/:table/enable","template":"{~LV:Pict.PictApplication.enableEndpoint(Record.data.connId, Record.data.table)~}"},{"path":"/endpoints/:connId/:table/disable","template":"{~LV:Pict.PictApplication.disableEndpoint(Record.data.connId, Record.data.table)~}"},{"path":"/endpoints/:tableName/browse","template":"{~LV:Pict.PictApplication.browseEndpoint(Record.data.tableName)~}"},{"path":"/records/prev","template":"{~LV:Pict.PictApplication.recordsPrev()~}"},{"path":"/records/next","template":"{~LV:Pict.PictApplication.recordsNext()~}"},{"path":"/records/load","template":"{~LV:Pict.PictApplication.recordsLoad()~}"},{"path":"/records/page/:n","template":"{~LV:Pict.PictApplication.goToRecordsPage(Record.data.n)~}"},{"path":"/records/filter/apply","template":"{~LV:Pict.PictApplication.applyRecordsFilter()~}"},{"path":"/records/filter/clear","template":"{~LV:Pict.PictApplication.clearRecordsFilter()~}"},{"path":"/records/export/:format","template":"{~LV:Pict.PictApplication.recordsExport(Record.data.format)~}"},{"path":"/records/export-all/:format","template":"{~LV:Pict.PictApplication.recordsExportAll(Record.data.format)~}"},{"path":"/queries/execute","template":"{~LV:Pict.PictApplication.executeQuery()~}"},{"path":"/queries/save","template":"{~LV:Pict.PictApplication.saveQueryFromPanel()~}"},{"path":"/queries/export/:format","template":"{~LV:Pict.PictApplication.queryExport(Record.data.format)~}"},{"path":"/saved-queries/toggle","template":"{~LV:Pict.PictApplication.toggleSavedPanel()~}"},{"path":"/saved-queries/:guid/load","template":"{~LV:Pict.PictApplication.loadSavedQuery(Record.data.guid)~}"},{"path":"/saved-queries/:guid/edit","template":"{~LV:Pict.PictApplication.editSavedQuery(Record.data.guid)~}"},{"path":"/saved-queries/:guid/delete","template":"{~LV:Pict.PictApplication.deleteSavedQuery(Record.data.guid)~}"}]};},{}],105:[function(require,module,exports){/**
 * DataBeacon — ConnectionForm view
 *
 * Thin wrapper around the shared `pict-section-connection-form` view.
 * This wrapper owns the persistent connection-record fields (Name,
 * Description, AutoConnect) plus the Save button; the schema-driven
 * provider <select> + per-provider field block is rendered by the
 * shared view into a slot inside this template.
 *
 * Wiring:
 *   - The shared view is registered in Pict-Application-DataBeacon.js
 *     with ContainerSelector = '#DataBeacon-ConnectionForm-FieldsSlot'
 *     and FieldIDPrefix = 'databeacon-conn'.
 *   - Pict-Provider-DataBeacon#loadAvailableTypes() fetches
 *     /beacon/connection/schemas and feeds the shared view via
 *     setSchemas().
 *   - On Save, this view reads name/description/autoconnect from its
 *     own DOM and pulls Type + Config out of the shared view via
 *     getProviderConfig(), then dispatches to provider.createConnection().
 *
 * Earlier versions of this view contained inline host/port/user/etc.
 * inputs that were show/hide-toggled per type — that's now handled by
 * the shared view, which also picks up MSSQL retry tuning, Solr
 * secure-mode, MongoDB pool size, etc. for free.
 */'use strict';const libPictView=require('pict-view');const _ViewConfiguration={ViewIdentifier:'ConnectionForm',DefaultRenderable:'DataBeacon-ConnectionForm',DefaultDestinationAddress:'#DataBeacon-ConnectionForm-Slot',AutoRender:false,Templates:[{Hash:'DataBeacon-ConnectionForm-Template',Template:/*html*/`
<div id="DataBeacon-ConnectionForm-Root" class="section">
	<h2>Add Connection</h2>
	<div class="form-grid">
		<div class="form-group"><label>Name</label><input type="text" id="databeacon-connform-name" placeholder="My Database" /></div>
		<div class="form-group"><label>Description</label><input type="text" id="databeacon-connform-description" /></div>
		<div class="form-group checkbox-group"><label><input type="checkbox" id="databeacon-connform-autoconnect" /> Auto-connect on startup</label></div>
	</div>

	<!-- pict-section-connection-form renders the type select + per-provider field block here -->
	<div id="DataBeacon-ConnectionForm-FieldsSlot" style="margin-top:1em"></div>

	<div class="button-row" style="margin-top:1em">
		<a class="btn btn-primary" href="#/connections/create">
			<span data-databeacon-icon="plus" data-icon-size="16"></span>
			Add Connection
		</a>
	</div>
</div>`}],Renderables:[{RenderableHash:'DataBeacon-ConnectionForm',TemplateHash:'DataBeacon-ConnectionForm-Template',ContentDestinationAddress:'#DataBeacon-ConnectionForm-Slot',RenderMethod:'replace'}]};class PictViewDataBeaconConnectionForm extends libPictView{constructor(pFable,pOptions,pServiceHash){super(pFable,pOptions,pServiceHash);}onAfterRender(pRenderable,pRenderDestinationAddress,pRecord,pContent){let tmpIcons=this.pict.providers['DataBeacon-Icons'];if(tmpIcons)tmpIcons.injectIconPlaceholders('#DataBeacon-ConnectionForm-Root');// Make sure the schema-driven form renders into our slot.  The
// shared view's AutoRender is false so we trigger it here once
// our slot exists.
let tmpFormView=this.pict.views['PictSection-ConnectionForm'];if(tmpFormView){tmpFormView.render();}return super.onAfterRender(pRenderable,pRenderDestinationAddress,pRecord,pContent);}// Router-handler entry point.  Application.createConnection() calls this
// via the `#/connections/create` route.
_submit(){this._createConnection();}_readValue(pSelector){let tmpList=this.pict.ContentAssignment.getElement(pSelector);if(!tmpList||tmpList.length===0)return'';return tmpList[0].value;}_readChecked(pSelector){let tmpList=this.pict.ContentAssignment.getElement(pSelector);if(!tmpList||tmpList.length===0)return false;return!!tmpList[0].checked;}_createConnection(){let tmpName=this._readValue('#databeacon-connform-name')||'Untitled';let tmpDescription=this._readValue('#databeacon-connform-description');let tmpAutoConnect=this._readChecked('#databeacon-connform-autoconnect');// Pull Type + Config out of the shared view.  Falls back to
// empty if the schemas haven't loaded yet (defensive — the
// Save button is rendered before the schema fetch returns).
let tmpFormView=this.pict.views['PictSection-ConnectionForm'];let tmpConnInfo=tmpFormView&&typeof tmpFormView.getProviderConfig==='function'?tmpFormView.getProviderConfig():{Provider:'MySQL',Config:{}};this.pict.providers.DataBeaconProvider.createConnection({Name:tmpName,Type:tmpConnInfo.Provider||'MySQL',Config:tmpConnInfo.Config||{},AutoConnect:tmpAutoConnect,Description:tmpDescription});}}module.exports=PictViewDataBeaconConnectionForm;module.exports.default_configuration=_ViewConfiguration;},{"pict-view":94}],106:[function(require,module,exports){/**
 * DataBeacon ConnectionList View
 *
 * Renders saved connections as a table with per-row actions. The provider
 * pre-computes per-row display flags (StatusLabel, StatusBadgeClass, etc.)
 * into AppData.Connections so this template stays declarative.
 */const libPictView=require('pict-view');const _ViewConfiguration={ViewIdentifier:'ConnectionList',DefaultRenderable:'DataBeacon-ConnectionList',DefaultDestinationAddress:'#DataBeacon-ConnectionList-Slot',AutoRender:false,Templates:[{Hash:'DataBeacon-ConnectionList-Template',Template:/*html*/`
<div id="DataBeacon-ConnectionList-Root" class="section">
	<h2>Saved Connections ({~D:AppData.Connections.length:0~})</h2>
	{~TemplateIfAbsolute:DataBeacon-ConnectionList-Empty:AppData.Connections:AppData.Connections.length^==^0~}
	{~TemplateIfAbsolute:DataBeacon-ConnectionList-Table:AppData.Connections:AppData.Connections.length^>^0~}
</div>`},{Hash:'DataBeacon-ConnectionList-Empty',Template:`<p class="empty-state">No connections yet.</p>`},{Hash:'DataBeacon-ConnectionList-Table',Template:/*html*/`
<table class="data-table">
	<thead><tr><th>Name</th><th>Type</th><th>Status</th><th>Description</th><th>Actions</th></tr></thead>
	<tbody>{~TS:DataBeacon-ConnectionList-Row:AppData.Connections~}</tbody>
</table>`},{Hash:'DataBeacon-ConnectionList-Row',Template:/*html*/`
<tr>
	<td><strong>{~D:Record.Name~}</strong></td>
	<td>{~D:Record.Type~}</td>
	<td><span class="badge {~D:Record.StatusBadgeClass~}">{~D:Record.StatusLabel~}</span></td>
	<td>{~D:Record.Description~}</td>
	<td class="actions-cell">
		{~TIf:DataBeacon-ConnectionList-Row-ConnectedActions::Record.Connected^TRUE^x~}
		{~TIf:DataBeacon-ConnectionList-Row-DisconnectedActions::Record.Connected^FALSE^x~}
		<a class="btn btn-small btn-danger" href="#/connections/{~D:Record.IDBeaconConnection~}/delete">
			<span data-databeacon-icon="trash" data-icon-size="14"></span> Delete
		</a>
	</td>
</tr>`},{Hash:'DataBeacon-ConnectionList-Row-ConnectedActions',Template:/*html*/`
<a class="btn btn-small btn-secondary" href="#/connections/{~D:Record.IDBeaconConnection~}/introspect">
	<span data-databeacon-icon="introspection" data-icon-size="14"></span> Introspect
</a>
<a class="btn btn-small btn-warning" href="#/connections/{~D:Record.IDBeaconConnection~}/disconnect">
	<span data-databeacon-icon="disconnect" data-icon-size="14"></span> Disconnect
</a>`},{Hash:'DataBeacon-ConnectionList-Row-DisconnectedActions',Template:/*html*/`
<a class="btn btn-small btn-primary" href="#/connections/{~D:Record.IDBeaconConnection~}/connect">
	<span data-databeacon-icon="connect" data-icon-size="14"></span> Connect
</a>
<a class="btn btn-small btn-secondary" href="#/connections/{~D:Record.IDBeaconConnection~}/test">
	<span data-databeacon-icon="test" data-icon-size="14"></span> Test
</a>`}],Renderables:[{RenderableHash:'DataBeacon-ConnectionList',TemplateHash:'DataBeacon-ConnectionList-Template',ContentDestinationAddress:'#DataBeacon-ConnectionList-Slot',RenderMethod:'replace'}]};class PictViewDataBeaconConnectionList extends libPictView{constructor(pFable,pOptions,pServiceHash){super(pFable,pOptions,pServiceHash);}onAfterRender(pRenderable,pRenderDestinationAddress,pRecord,pContent){let tmpIcons=this.pict.providers['DataBeacon-Icons'];if(tmpIcons)tmpIcons.injectIconPlaceholders('#DataBeacon-ConnectionList-Root');return super.onAfterRender(pRenderable,pRenderDestinationAddress,pRecord,pContent);}}module.exports=PictViewDataBeaconConnectionList;module.exports.default_configuration=_ViewConfiguration;},{"pict-view":94}],107:[function(require,module,exports){/**
 * DataBeacon Connections Page (container view)
 *
 * Thin container: renders two slot divs, then cascades a render call to
 * the ConnectionForm and ConnectionList sub-views. New sections for the
 * Connections screen can be added as additional sub-views without touching
 * this file or growing it.
 */const libPictView=require('pict-view');const _ViewConfiguration={ViewIdentifier:'Connections',DefaultRenderable:'DataBeacon-ConnectionsPage',DefaultDestinationAddress:'#DataBeacon-View-Connections',AutoRender:false,Templates:[{Hash:'DataBeacon-ConnectionsPage-Template',Template:/*html*/`
<div class="connections-view">
	<h1>Database Connections</h1>
	<div id="DataBeacon-ConnectionForm-Slot"></div>
	<div id="DataBeacon-ConnectionList-Slot"></div>
</div>`}],Renderables:[{RenderableHash:'DataBeacon-ConnectionsPage',TemplateHash:'DataBeacon-ConnectionsPage-Template',ContentDestinationAddress:'#DataBeacon-View-Connections',RenderMethod:'replace'}]};class PictViewDataBeaconConnections extends libPictView{constructor(pFable,pOptions,pServiceHash){super(pFable,pOptions,pServiceHash);}onAfterRender(pRenderable,pRenderDestinationAddress,pRecord,pContent){if(this.pict.views.ConnectionForm)this.pict.views.ConnectionForm.render();if(this.pict.views.ConnectionList)this.pict.views.ConnectionList.render();return super.onAfterRender(pRenderable,pRenderDestinationAddress,pRecord,pContent);}}module.exports=PictViewDataBeaconConnections;module.exports.default_configuration=_ViewConfiguration;},{"pict-view":94}],108:[function(require,module,exports){/**
 * DataBeacon Dashboard View
 *
 * Overview screen: stats cards (connection counts, endpoint count, beacon
 * status), a quick-actions block, and a summary table of all connections.
 * All HTML is declarative; per-row fields are pre-computed by the
 * DataBeacon provider into AppData.Dashboard.*.
 */const libPictView=require('pict-view');const _ViewConfiguration={ViewIdentifier:'Dashboard',DefaultRenderable:'DataBeacon-Dashboard',DefaultDestinationAddress:'#DataBeacon-View-Dashboard',AutoRender:false,Templates:[{Hash:'DataBeacon-Dashboard-Template',Template:/*html*/`
<div id="DataBeacon-Dashboard-Root" class="dashboard-view">
	<h1>DataBeacon Dashboard</h1>

	<div class="stats-grid">
		<div class="stat-card">
			<div class="stat-value">{~D:AppData.Dashboard.TotalConnections:0~}</div>
			<div class="stat-label">Database Connections</div>
			<div class="stat-detail">{~D:AppData.Dashboard.ActiveConnections:0~} active</div>
		</div>
		<div class="stat-card">
			<div class="stat-value">{~D:AppData.Dashboard.TotalEndpoints:0~}</div>
			<div class="stat-label">Active Endpoints</div>
			<div class="stat-detail">REST API routes</div>
		</div>
		<div class="stat-card">
			<div class="stat-value"><span class="badge {~D:AppData.Dashboard.BeaconBadgeClass~}">{~D:AppData.Dashboard.BeaconStatusLabel~}</span></div>
			<div class="stat-label">Ultravisor Beacon</div>
			<div class="stat-detail">{~D:AppData.Dashboard.BeaconName:retold-databeacon~}</div>
		</div>
	</div>

	<div class="section">
		<h2>Quick Actions</h2>
		<div class="button-row">
			<a class="btn btn-primary" href="#/view/connections">
				<span data-databeacon-icon="connections" data-icon-size="16"></span>
				Manage Connections
			</a>
			<a class="btn btn-secondary" href="#/view/endpoints">
				<span data-databeacon-icon="endpoints" data-icon-size="16"></span>
				View Endpoints
			</a>
		</div>
	</div>

	{~TemplateIfAbsolute:DataBeacon-Dashboard-ConnectionSummary-Table:AppData.Dashboard:AppData.Dashboard.TotalConnections^>^0~}
</div>`},{Hash:'DataBeacon-Dashboard-ConnectionSummary-Table',Template:/*html*/`
<div class="section">
	<h2>Connections</h2>
	<table class="data-table">
		<thead><tr><th>Name</th><th>Type</th><th>Status</th></tr></thead>
		<tbody>{~TS:DataBeacon-Dashboard-ConnectionSummary-Row:AppData.Dashboard.ConnectionSummary~}</tbody>
	</table>
</div>`},{Hash:'DataBeacon-Dashboard-ConnectionSummary-Row',Template:/*html*/`
<tr>
	<td>{~D:Record.Name~}</td>
	<td>{~D:Record.Type~}</td>
	<td><span class="badge {~D:Record.StatusBadgeClass~}">{~D:Record.StatusLabel~}</span></td>
</tr>`}],Renderables:[{RenderableHash:'DataBeacon-Dashboard',TemplateHash:'DataBeacon-Dashboard-Template',ContentDestinationAddress:'#DataBeacon-View-Dashboard',RenderMethod:'replace'}]};class PictViewDataBeaconDashboard extends libPictView{constructor(pFable,pOptions,pServiceHash){super(pFable,pOptions,pServiceHash);}onAfterRender(pRenderable,pRenderDestinationAddress,pRecord,pContent){let tmpIcons=this.pict.providers['DataBeacon-Icons'];if(tmpIcons)tmpIcons.injectIconPlaceholders('#DataBeacon-View-Dashboard');return super.onAfterRender(pRenderable,pRenderDestinationAddress,pRecord,pContent);}}module.exports=PictViewDataBeaconDashboard;module.exports.default_configuration=_ViewConfiguration;},{"pict-view":94}],109:[function(require,module,exports){/**
 * DataBeacon Endpoints View
 *
 * Lists active REST endpoints with Browse / API / Refresh actions. The
 * provider pre-computes each endpoint's API URL (EndpointAPIURL) so the
 * template can emit `data-api-url` without JS concatenation.
 */const libPictView=require('pict-view');const _ViewConfiguration={ViewIdentifier:'Endpoints',DefaultRenderable:'DataBeacon-Endpoints',DefaultDestinationAddress:'#DataBeacon-View-Endpoints',AutoRender:false,Templates:[{Hash:'DataBeacon-Endpoints-Template',Template:/*html*/`
<div id="DataBeacon-Endpoints-Root" class="endpoints-view">
	<h1>Active REST Endpoints</h1>
	<div class="section">
		<div class="button-row">
			<a class="btn btn-secondary" href="#/endpoints/refresh">
				<span data-databeacon-icon="refresh" data-icon-size="16"></span>
				Refresh
			</a>
		</div>
	</div>
	{~TemplateIfAbsolute:DataBeacon-Endpoints-Empty:AppData.Endpoints:AppData.Endpoints.length^==^0~}
	{~TemplateIfAbsolute:DataBeacon-Endpoints-Table:AppData.Endpoints:AppData.Endpoints.length^>^0~}
</div>`},{Hash:'DataBeacon-Endpoints-Empty',Template:`<p class="empty-state">No dynamic endpoints enabled yet.</p>`},{Hash:'DataBeacon-Endpoints-Table',Template:/*html*/`
<div class="section">
	<h2>Endpoints ({~D:AppData.Endpoints.length:0~})</h2>
	<table class="data-table">
		<thead><tr><th>Table</th><th>Type</th><th>Base</th><th>Actions</th></tr></thead>
		<tbody>{~TS:DataBeacon-Endpoints-Row:AppData.Endpoints~}</tbody>
	</table>
	<div class="help-text">
		<p>CRUD: GET /1.0/{Table}s/{Begin}/{Cap}, GET /1.0/{Table}/{ID}, POST/PUT/DEL /1.0/{Table}</p>
	</div>
</div>`},{Hash:'DataBeacon-Endpoints-Row',Template:/*html*/`
<tr>
	<td><strong>{~D:Record.TableName~}</strong></td>
	<td>{~D:Record.ConnectionType~}</td>
	<td><code>{~D:Record.EndpointBase~}</code></td>
	<td class="actions-cell">
		<a class="btn btn-small btn-primary" href="#/endpoints/{~D:Record.TableName~}/browse">
			<span data-databeacon-icon="eye" data-icon-size="14"></span> Browse
		</a>
		<a class="btn btn-small btn-secondary" href="{~D:Record.EndpointAPIURL~}" target="_blank" rel="noopener">
			<span data-databeacon-icon="external-link" data-icon-size="14"></span> API
		</a>
	</td>
</tr>`}],Renderables:[{RenderableHash:'DataBeacon-Endpoints',TemplateHash:'DataBeacon-Endpoints-Template',ContentDestinationAddress:'#DataBeacon-View-Endpoints',RenderMethod:'replace'}]};class PictViewDataBeaconEndpoints extends libPictView{constructor(pFable,pOptions,pServiceHash){super(pFable,pOptions,pServiceHash);}onAfterRender(pRenderable,pRenderDestinationAddress,pRecord,pContent){let tmpIcons=this.pict.providers['DataBeacon-Icons'];if(tmpIcons)tmpIcons.injectIconPlaceholders('#DataBeacon-Endpoints-Root');return super.onAfterRender(pRenderable,pRenderDestinationAddress,pRecord,pContent);}}module.exports=PictViewDataBeaconEndpoints;module.exports.default_configuration=_ViewConfiguration;},{"pict-view":94}],110:[function(require,module,exports){/**
 * DataBeacon Introspection Page (container view)
 *
 * Hosts two sub-views: IntrospectionControls (picker + buttons + banner)
 * and IntrospectionTables (table grid + per-table detail modal).
 */const libPictView=require('pict-view');const _ViewConfiguration={ViewIdentifier:'Introspection',DefaultRenderable:'DataBeacon-IntrospectionPage',DefaultDestinationAddress:'#DataBeacon-View-Introspection',AutoRender:false,Templates:[{Hash:'DataBeacon-IntrospectionPage-Template',Template:/*html*/`
<div class="introspection-view">
	<h1>Schema Introspection</h1>
	<div id="DataBeacon-IntrospectionControls-Slot"></div>
	<div id="DataBeacon-IntrospectionTables-Slot"></div>
</div>`}],Renderables:[{RenderableHash:'DataBeacon-IntrospectionPage',TemplateHash:'DataBeacon-IntrospectionPage-Template',ContentDestinationAddress:'#DataBeacon-View-Introspection',RenderMethod:'replace'}]};class PictViewDataBeaconIntrospection extends libPictView{constructor(pFable,pOptions,pServiceHash){super(pFable,pOptions,pServiceHash);}onBeforeRender(pRenderable){// Ask the provider to refresh its view-shape for the Introspection
// screen (auto-select single connection, compute banner, etc.)
// before the sub-views attempt to read AppData.Introspection.
let tmpProvider=this.pict.providers.DataBeaconProvider;if(tmpProvider&&typeof tmpProvider.refreshIntrospectionViewData==='function'){tmpProvider.refreshIntrospectionViewData();}return super.onBeforeRender(pRenderable);}onAfterRender(pRenderable,pRenderDestinationAddress,pRecord,pContent){if(this.pict.views.IntrospectionControls)this.pict.views.IntrospectionControls.render();if(this.pict.views.IntrospectionTables)this.pict.views.IntrospectionTables.render();return super.onAfterRender(pRenderable,pRenderDestinationAddress,pRecord,pContent);}}module.exports=PictViewDataBeaconIntrospection;module.exports.default_configuration=_ViewConfiguration;},{"pict-view":94}],111:[function(require,module,exports){/**
 * DataBeacon IntrospectionControls View
 *
 * Connection picker + Introspect / Introspect All buttons + a connection
 * banner showing the current selection. The dropdown only lists connected
 * databases; the provider pre-computes AppData.Introspection.ConnectedList
 * and AppData.Introspection.SelectedBanner for this view.
 */const libPictView=require('pict-view');const _ViewConfiguration={ViewIdentifier:'IntrospectionControls',DefaultRenderable:'DataBeacon-IntrospectionControls',DefaultDestinationAddress:'#DataBeacon-IntrospectionControls-Slot',AutoRender:false,Templates:[{Hash:'DataBeacon-IntrospectionControls-Template',Template:/*html*/`
<div id="DataBeacon-IntrospectionControls-Root" class="section">
	<div class="form-row">
		<div class="form-group">
			<label>Connection</label>
			<select id="databeacon-introspect-connection" onchange="{~P~}.PictApplication.selectIntrospectionConnection(this.value)">
				{~TemplateIfAbsolute:DataBeacon-IntrospectionControls-PlaceholderOption:AppData.Introspection:AppData.Introspection.ShowPlaceholder^TRUE^x~}
				{~TS:DataBeacon-IntrospectionControls-ConnectionOption:AppData.Introspection.ConnectedList~}
			</select>
		</div>
		<div class="form-group">
			<a class="btn btn-primary {~D:AppData.Introspection.RunDisabledClass~}" href="#/introspection/run">
				<span data-databeacon-icon="introspection" data-icon-size="16"></span>
				Introspect
			</a>
		</div>
		<div class="form-group">
			<a class="btn btn-secondary {~D:AppData.Introspection.AllDisabledClass~}" href="#/introspection/all">
				<span data-databeacon-icon="refresh" data-icon-size="16"></span>
				Introspect All
			</a>
		</div>
	</div>
	{~TemplateIfAbsolute:DataBeacon-IntrospectionControls-Banner:AppData.Introspection.SelectedBanner:AppData.Introspection.HasSelection^TRUE^x~}
</div>`},{Hash:'DataBeacon-IntrospectionControls-PlaceholderOption',Template:`<option value="">-- Select Connection --</option>`},{Hash:'DataBeacon-IntrospectionControls-ConnectionOption',Template:`<option value="{~D:Record.IDBeaconConnection~}" {~D:Record.SelectedAttr~}>{~D:Record.Name~} ({~D:Record.Type~})</option>`},{Hash:'DataBeacon-IntrospectionControls-Banner',Template:/*html*/`
<div class="connection-banner">
	<span class="connection-banner-name">{~D:AppData.Introspection.SelectedBanner.Name~}</span>
	<span class="badge {~D:AppData.Introspection.SelectedBanner.StatusBadgeClass~}">{~D:AppData.Introspection.SelectedBanner.StatusLabel~}</span>
	<span class="connection-banner-type">{~D:AppData.Introspection.SelectedBanner.Type~}</span>
	{~TemplateIfAbsolute:DataBeacon-IntrospectionControls-BannerDesc:AppData.Introspection.SelectedBanner:AppData.Introspection.SelectedBanner.HasDescription^TRUE^x~}
</div>`},{Hash:'DataBeacon-IntrospectionControls-BannerDesc',Template:`<span class="connection-banner-desc">{~D:AppData.Introspection.SelectedBanner.Description~}</span>`}],Renderables:[{RenderableHash:'DataBeacon-IntrospectionControls',TemplateHash:'DataBeacon-IntrospectionControls-Template',ContentDestinationAddress:'#DataBeacon-IntrospectionControls-Slot',RenderMethod:'replace'}]};class PictViewDataBeaconIntrospectionControls extends libPictView{constructor(pFable,pOptions,pServiceHash){super(pFable,pOptions,pServiceHash);}onAfterRender(pRenderable,pRenderDestinationAddress,pRecord,pContent){let tmpIcons=this.pict.providers['DataBeacon-Icons'];if(tmpIcons)tmpIcons.injectIconPlaceholders('#DataBeacon-IntrospectionControls-Root');return super.onAfterRender(pRenderable,pRenderDestinationAddress,pRecord,pContent);}// ── Router-handler entry points (called by Application) ────────────────
_runIntrospect(){let tmpSelectedID=this.pict.AppData.SelectedConnectionID;if(tmpSelectedID){this.pict.providers.DataBeaconProvider.introspect(tmpSelectedID);}}_selectConnection(pRawValue){let tmpID=parseInt(pRawValue,10);if(isNaN(tmpID))tmpID=null;this.pict.AppData.SelectedConnectionID=tmpID;let tmpProvider=this.pict.providers.DataBeaconProvider;if(tmpID){tmpProvider.loadTables(tmpID);}else{this.pict.AppData.Tables=[];if(tmpProvider.refreshIntrospectionViewData)tmpProvider.refreshIntrospectionViewData();if(this.pict.views.IntrospectionControls)this.pict.views.IntrospectionControls.render();if(this.pict.views.IntrospectionTables)this.pict.views.IntrospectionTables.render();}}// Public entry called from Application.introspectAll() via the
// #/introspection/all route.  Iterates all connected connections and
// introspects each in sequence.
_introspectAll(){let tmpConns=this.pict.AppData.Connections||[];let tmpProvider=this.pict.providers.DataBeaconProvider;let tmpConnectedIDs=[];for(let i=0;i<tmpConns.length;i++){if(tmpConns[i].Connected)tmpConnectedIDs.push(tmpConns[i].IDBeaconConnection);}let tmpIdx=0;let tmpDoNext=()=>{if(tmpIdx>=tmpConnectedIDs.length){if(this.pict.AppData.SelectedConnectionID){tmpProvider.loadTables(this.pict.AppData.SelectedConnectionID);}return;}tmpProvider.introspect(tmpConnectedIDs[tmpIdx],()=>{tmpIdx++;tmpDoNext();});};tmpDoNext();}}module.exports=PictViewDataBeaconIntrospectionControls;module.exports.default_configuration=_ViewConfiguration;},{"pict-view":94}],112:[function(require,module,exports){/**
 * DataBeacon IntrospectionTables View
 *
 * Renders the schema tables list for the currently selected connection.
 * Each row shows column count, row estimate, endpoint status, and an
 * Enable/Disable action. Clicking a table name opens a pict-section-modal
 * with full column details.
 *
 * The provider pre-computes `AppData.Introspection.TablesView` (with
 * per-row display flags) and `AppData.Introspection.TablesHeader`
 * (heading + subline) so this view stays declarative.
 */const libPictView=require('pict-view');const _ViewConfiguration={ViewIdentifier:'IntrospectionTables',DefaultRenderable:'DataBeacon-IntrospectionTables',DefaultDestinationAddress:'#DataBeacon-IntrospectionTables-Slot',AutoRender:false,Templates:[{Hash:'DataBeacon-IntrospectionTables-Template',Template:/*html*/`
<div id="DataBeacon-IntrospectionTables-Root">
	{~TemplateIfAbsolute:DataBeacon-IntrospectionTables-NoConnections:AppData.Introspection:AppData.Introspection.State^==^NoConnections~}
	{~TemplateIfAbsolute:DataBeacon-IntrospectionTables-NoSelection:AppData.Introspection:AppData.Introspection.State^==^NoSelection~}
	{~TemplateIfAbsolute:DataBeacon-IntrospectionTables-Empty:AppData.Introspection:AppData.Introspection.State^==^Empty~}
	{~TemplateIfAbsolute:DataBeacon-IntrospectionTables-Table:AppData.Introspection:AppData.Introspection.State^==^HasTables~}
</div>`},{Hash:'DataBeacon-IntrospectionTables-NoConnections',Template:/*html*/`
<p class="empty-state">
	No databases connected. Go to
	<a href="#/view/connections">Connections</a>
	to add and connect a database first.
</p>`},{Hash:'DataBeacon-IntrospectionTables-NoSelection',Template:`<p class="empty-state">Select a connected database above and click Introspect.</p>`},{Hash:'DataBeacon-IntrospectionTables-Empty',Template:`<p class="empty-state">No tables discovered yet. Click <strong>Introspect</strong> to scan the database.</p>`},{Hash:'DataBeacon-IntrospectionTables-Table',Template:/*html*/`
<div class="section">
	<h2>Tables from <strong>{~D:AppData.Introspection.TablesHeader.ConnectionName~}</strong></h2>
	<span class="section-subline">{~D:AppData.Introspection.TablesHeader.Subline~}</span>
	<table class="data-table" style="margin-top:12px;">
		<thead><tr><th>Table</th><th>Columns</th><th>Est. Rows</th><th>Endpoint</th><th>Actions</th></tr></thead>
		<tbody>{~TS:DataBeacon-IntrospectionTables-Row:AppData.Introspection.TablesView~}</tbody>
	</table>
</div>`},{Hash:'DataBeacon-IntrospectionTables-Row',Template:/*html*/`
<tr>
	<td><a href="#/introspection/table/{~D:Record.ConnectionID~}/{~D:Record.TableName~}">{~D:Record.TableName~}</a></td>
	<td>{~D:Record.ColumnCount~}</td>
	<td>{~D:Record.RowCountDisplay~}</td>
	<td>{~TIf:DataBeacon-IntrospectionTables-Row-EndpointBadge::Record.EndpointsEnabled^TRUE^x~}</td>
	<td class="actions-cell">
		{~TIf:DataBeacon-IntrospectionTables-Row-Disable::Record.EndpointsEnabled^TRUE^x~}
		{~TIf:DataBeacon-IntrospectionTables-Row-Enable::Record.EndpointsEnabled^FALSE^x~}
	</td>
</tr>`},{Hash:'DataBeacon-IntrospectionTables-Row-EndpointBadge',Template:`<span class="badge badge-success">Active</span>`},{Hash:'DataBeacon-IntrospectionTables-Row-Enable',Template:/*html*/`
<a class="btn btn-small btn-primary" href="#/endpoints/{~D:Record.ConnectionID~}/{~D:Record.TableName~}/enable">
	<span data-databeacon-icon="check" data-icon-size="14"></span> Enable
</a>`},{Hash:'DataBeacon-IntrospectionTables-Row-Disable',Template:/*html*/`
<a class="btn btn-small btn-warning" href="#/endpoints/{~D:Record.ConnectionID~}/{~D:Record.TableName~}/disable">
	<span data-databeacon-icon="x" data-icon-size="14"></span> Disable
</a>`},{Hash:'DataBeacon-IntrospectionTables-DetailModal',Template:/*html*/`
<table class="data-table">
	<thead><tr><th>Column</th><th>Native Type</th><th>Meadow Type</th><th>Nullable</th><th>Default</th></tr></thead>
	<tbody>{~TS:DataBeacon-IntrospectionTables-DetailModal-Row:AppData.Introspection.DetailModalColumns~}</tbody>
</table>`},{Hash:'DataBeacon-IntrospectionTables-DetailModal-Row',Template:/*html*/`
<tr>
	<td>
		<strong>{~D:Record.Name~}</strong>
		{~TIf:DataBeacon-IntrospectionTables-DetailModal-Row-PK::Record.IsPrimaryKey^TRUE^x~}
		{~TIf:DataBeacon-IntrospectionTables-DetailModal-Row-Auto::Record.IsAutoIncrement^TRUE^x~}
	</td>
	<td>{~D:Record.NativeTypeDisplay~}</td>
	<td>{~D:Record.MeadowType~}</td>
	<td>{~D:Record.NullableDisplay~}</td>
	<td>{~D:Record.DefaultValueDisplay~}</td>
</tr>`},{Hash:'DataBeacon-IntrospectionTables-DetailModal-Row-PK',Template:`<span class="badge badge-info">PK</span>`},{Hash:'DataBeacon-IntrospectionTables-DetailModal-Row-Auto',Template:`<span class="badge badge-neutral">AUTO</span>`}],Renderables:[{RenderableHash:'DataBeacon-IntrospectionTables',TemplateHash:'DataBeacon-IntrospectionTables-Template',ContentDestinationAddress:'#DataBeacon-IntrospectionTables-Slot',RenderMethod:'replace'}]};class PictViewDataBeaconIntrospectionTables extends libPictView{constructor(pFable,pOptions,pServiceHash){super(pFable,pOptions,pServiceHash);}onAfterRender(pRenderable,pRenderDestinationAddress,pRecord,pContent){let tmpIcons=this.pict.providers['DataBeacon-Icons'];if(tmpIcons)tmpIcons.injectIconPlaceholders('#DataBeacon-IntrospectionTables-Root');return super.onAfterRender(pRenderable,pRenderDestinationAddress,pRecord,pContent);}// Router-handler entry point (Application.viewTable).  Opens a modal
// with the table's column details.  Kept imperative to host the modal
// orchestration; the actual "which table?" dispatch is driven by the
// #/introspection/table/:connId/:table route.
_viewTableDetails(pConnectionID,pTableName){this._showDetail(parseInt(pConnectionID,10),pTableName);}_showDetail(pConnectionID,pTableName){let tmpProvider=this.pict.providers.DataBeaconProvider;let tmpModal=this.pict.views['Pict-Section-Modal'];if(!tmpModal)return;tmpProvider.loadTableDetails(pConnectionID,pTableName,(pError,pData)=>{if(pError||!pData||!pData.Columns){tmpModal.toast('Failed to load table details.',{type:'error'});return;}// Pre-compute display-ready column records and stash them in AppData
// so parseTemplateByHash can resolve {~D:AppData.Introspection.DetailModalColumns~}.
if(!this.pict.AppData.Introspection)this.pict.AppData.Introspection={};this.pict.AppData.Introspection.DetailModalColumns=this._buildDetailRows(pData.Columns);let tmpContent=this.pict.parseTemplateByHash('DataBeacon-IntrospectionTables-DetailModal',null);let tmpConn=this._getSelectedConnection();let tmpTitle=tmpConn?`${pTableName} — ${tmpConn.Name}`:pTableName;tmpModal.show({title:tmpTitle,content:tmpContent,closeable:true,width:'720px',buttons:[{Hash:'close',Label:'Close',Style:'primary'}]});});}_buildDetailRows(pColumns){let tmpRows=[];for(let i=0;i<pColumns.length;i++){let tmpCol=pColumns[i];tmpRows.push({Name:tmpCol.Name,IsPrimaryKey:!!tmpCol.IsPrimaryKey,IsAutoIncrement:!!tmpCol.IsAutoIncrement,NativeTypeDisplay:tmpCol.NativeType+(tmpCol.MaxLength?`(${tmpCol.MaxLength})`:''),MeadowType:tmpCol.MeadowType||'',NullableDisplay:tmpCol.Nullable?'YES':'NO',DefaultValueDisplay:tmpCol.DefaultValue===null||tmpCol.DefaultValue===undefined?'--':String(tmpCol.DefaultValue)});}return tmpRows;}_getSelectedConnection(){let tmpCID=this.pict.AppData.SelectedConnectionID;if(!tmpCID)return null;let tmpConns=this.pict.AppData.Connections||[];for(let i=0;i<tmpConns.length;i++){if(tmpConns[i].IDBeaconConnection===tmpCID)return tmpConns[i];}return null;}}module.exports=PictViewDataBeaconIntrospectionTables;module.exports.default_configuration=_ViewConfiguration;},{"pict-view":94}],113:[function(require,module,exports){/**
 * DataBeacon Layout View
 *
 * Owns the Pict-Section-Modal shell: a fixed Theme-TopBar at top, a
 * resizable Sidebar on the left, a gear-toggled overlay Settings panel
 * on the right, and a center workspace that hosts all six page panels.
 *
 * Page views render into `#DataBeacon-View-<Name>` panels inside the
 * center workspace; `setActiveView()` swaps which one is visible.
 */const libPictView=require('pict-view');const _NavItems=[{View:'Dashboard',Slug:'dashboard',Label:'Dashboard',Icon:'dashboard'},{View:'Connections',Slug:'connections',Label:'Connections',Icon:'connections'},{View:'Introspection',Slug:'introspection',Label:'Introspection',Icon:'introspection'},{View:'Endpoints',Slug:'endpoints',Label:'Endpoints',Icon:'endpoints'},{View:'Records',Slug:'records',Label:'Records',Icon:'records'},{View:'SQL',Slug:'sql',Label:'SQL',Icon:'terminal'}];const _ViewConfiguration={ViewIdentifier:'Layout',DefaultRenderable:'DataBeacon-Layout',DefaultDestinationAddress:'#DataBeacon-App',AutoRender:false,CSS:/*css*/`
		html, body { height: 100%; margin: 0; padding: 0; }
		body
		{
			background: var(--theme-color-background-primary, #ece9d8);
			color:      var(--theme-color-text-primary,       #1a1a1a);
			font-family: var(--theme-typography-family-sans,
				-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif);
		}
		#DataBeacon-App { height: 100%; min-height: 0; overflow: hidden; }
		.pict-modal-shell-host   { height: 100%; }
		.pict-modal-shell        { background: var(--theme-color-background-primary, #ece9d8); }
		.pict-modal-shell-panel  { background: var(--theme-color-background-panel,   var(--theme-color-background-secondary, #d8d3b8)); }
		.pict-modal-shell-center { background: var(--theme-color-background-primary, #ece9d8); }

		#DataBeacon-Workspace { height: 100%; min-height: 0; overflow: auto; padding: 24px; }
		.view-panel { max-width: 1200px; }
	`,Templates:[{Hash:'DataBeacon-Layout-Shell',Template:/*html*/`<div id="DataBeacon-Layout-Mount" style="height:100%"></div>`}],Renderables:[{RenderableHash:'DataBeacon-Layout',TemplateHash:'DataBeacon-Layout-Shell',ContentDestinationAddress:'#DataBeacon-App',RenderMethod:'replace'}]};class PictViewDataBeaconLayout extends libPictView{constructor(pFable,pOptions,pServiceHash){super(pFable,pOptions,pServiceHash);this._shellPanelsBuilt=false;}onBeforeRender(pRenderable){// Publish the nav-item list so the Sidebar view can iterate over it.
if(!this.pict.AppData.Layout)this.pict.AppData.Layout={};this.pict.AppData.Layout.NavItems=_NavItems;return super.onBeforeRender(pRenderable);}onAfterRender(pRenderable,pRenderDestinationAddress,pRecord,pContent){this.pict.CSSMap.injectCSS();if(!this._shellPanelsBuilt){this._buildShell();this._shellPanelsBuilt=true;}return super.onAfterRender(pRenderable,pRenderDestinationAddress,pRecord,pContent);}_buildShell(){let tmpModal=this.pict.views['Pict-Section-Modal'];let tmpMount=document.getElementById('DataBeacon-Layout-Mount');if(!tmpModal||!tmpMount){return;}this._shell=tmpModal.shell(tmpMount,{PersistenceKey:'retold-databeacon'});// Topbar — Theme-TopBar handles BrandMark + Nav slot + User slot.
this._shell.addPanel({Hash:'topbar',Side:'top',Mode:'fixed',Size:48,ContentDestinationId:'Theme-TopBar',ContentView:'Theme-TopBar'});// Left sidebar — host's navigation list.
this._shell.addPanel({Hash:'sidebar',Side:'left',Mode:'resizable',Size:220,MinSize:180,MaxSize:360,Title:'Navigation',ContentDestinationId:'DataBeacon-Sidebar-Host',ContentView:'DataBeacon-Sidebar',ResponsiveDrawer:900});// Hidden overlay settings panel — only the gear button opens it.
this._shell.addPanel({Hash:'settings',Side:'right',Mode:'resizable',Position:'overlay',Size:360,MinSize:280,MaxSize:540,Hidden:true,Collapsed:true,ContentDestinationId:'DataBeacon-Settings-Panel',ContentView:'DataBeacon-SettingsPanel'});// Center — workspace for the six page views.
this._shell.center({ContentDestinationId:'DataBeacon-Workspace'});// Mount the six page-panel destinations into the workspace.  Page
// views render into these ids; setActiveView() toggles visibility.
let tmpCenter=document.getElementById('DataBeacon-Workspace');if(tmpCenter){tmpCenter.innerHTML=''+'<div id="DataBeacon-View-Dashboard"      class="view-panel"></div>'+'<div id="DataBeacon-View-Connections"    class="view-panel" style="display:none;"></div>'+'<div id="DataBeacon-View-Introspection"  class="view-panel" style="display:none;"></div>'+'<div id="DataBeacon-View-Endpoints"      class="view-panel" style="display:none;"></div>'+'<div id="DataBeacon-View-Records"        class="view-panel" style="display:none;"></div>'+'<div id="DataBeacon-View-SQL"            class="view-panel" style="display:none;"></div>'// Login panel is special: outside the normal _NavItems
// roster (no sidebar/topbar entry).  Shown only when the
// auth gate forces the user there via setActiveView('Login').
+'<div id="DataBeacon-View-Login"          class="view-panel" style="display:none;"></div>';}}getSidebarPanel(){return this._shell?this._shell.getPanel('sidebar'):null;}getSettingsPanel(){return this._shell?this._shell.getPanel('settings'):null;}toggleSidebar(){let p=this.getSidebarPanel();if(p&&typeof p.toggle==='function')p.toggle();}toggleSettingsPanel(){let p=this.getSettingsPanel();if(p&&typeof p.toggle==='function')p.toggle();}/**
	 * Switch the visible page panel and nav highlight, then trigger
	 * the target view's render so it has fresh data on display.
	 * @param {string} pViewName
	 */setActiveView(pViewName){this.pict.AppData.CurrentView=pViewName;// Login is a special "outside the nav roster" view — the auth
// gate forces it on top of whatever the user was looking at.
// Hide every _NavItems panel, hide chrome that doesn't belong
// on a login screen, show the Login panel only.
let tmpIsLogin=pViewName==='Login';// Toggle panel visibility for the regular nav items.
for(let i=0;i<_NavItems.length;i++){let tmpName=_NavItems[i].View;let tmpPanelList=this.pict.ContentAssignment.getElement(`#DataBeacon-View-${tmpName}`);if(tmpPanelList&&tmpPanelList.length>0){tmpPanelList[0].style.display=!tmpIsLogin&&tmpName===pViewName?'block':'none';}}// Toggle the Login panel separately.
let tmpLoginPanelList=this.pict.ContentAssignment.getElement('#DataBeacon-View-Login');if(tmpLoginPanelList&&tmpLoginPanelList.length>0){tmpLoginPanelList[0].style.display=tmpIsLogin?'block':'none';}// Re-render the sidebar so its active-state highlight follows the
// new selection; it iterates over AppData.Layout.NavItems and reads
// AppData.CurrentView to decide which item gets `.active`.
let tmpSidebar=this.pict.views['DataBeacon-Sidebar'];if(tmpSidebar&&typeof tmpSidebar.render==='function'){tmpSidebar.render();}// Render the active page view (container pages cascade to sub-views).
let tmpView=this.pict.views[pViewName];if(tmpView&&typeof tmpView.render==='function'){tmpView.render();}}}module.exports=PictViewDataBeaconLayout;module.exports.default_configuration=_ViewConfiguration;},{"pict-view":94}],114:[function(require,module,exports){/**
 * PictView-DataBeacon-Login
 *
 * Thin host wrapper around pict-section-login.  The section view
 * renders into `#Pict-Login-Container`; this wrapper paints that
 * mount point inside the databeacon's Login panel and delegates the
 * render to the section.  Modeled after PictView-Ultravisor-Login.js
 * so the experience matches Ultravisor's login screen 1:1.
 *
 * The section ships its own theme-neutral CSS; this file only adds
 * layout chrome (centered card in the content panel).
 */const libPictView=require('pict-view');const _ViewConfiguration={ViewIdentifier:'Login',AutoInitialize:true,AutoRender:false,DefaultRenderable:'DataBeacon-Login-Content',DefaultDestinationAddress:'#DataBeacon-View-Login',Templates:[{Hash:'DataBeacon-Login-Template',Template:/*html*/`
<div class="databeacon-login-page">
	<div id="Pict-Login-Container"></div>
</div>`}],Renderables:[{RenderableHash:'DataBeacon-Login-Content',TemplateHash:'DataBeacon-Login-Template',ContentDestinationAddress:'#DataBeacon-View-Login',RenderMethod:'replace'}],CSS:/*css*/`
		.databeacon-login-page
		{
			min-height: calc(100vh - 56px);
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 32px 16px;
		}
	`};class DataBeaconLoginView extends libPictView{onAfterRender(pRenderable,pAddress,pRecord,pContent){// Render pict-section-login into the freshly-painted mount point.
// The section tracks its own DefaultDestinationAddress (#Pict-
// Login-Container), so a plain render() call routes correctly.
let tmpInner=this.pict&&this.pict.views&&this.pict.views['Pict-Section-Login'];if(tmpInner){tmpInner.render();}this.pict.CSSMap.injectCSS();return super.onAfterRender?super.onAfterRender(pRenderable,pAddress,pRecord,pContent):undefined;}}module.exports=DataBeaconLoginView;module.exports.default_configuration=_ViewConfiguration;},{"pict-view":94}],115:[function(require,module,exports){/**
 * DataBeacon QueryPanel View
 *
 * SQL input (pict-section-code CodeJar editor, SQL syntax highlighting) +
 * Execute button + result table. Operates against the currently selected
 * connection (AppData.SelectedConnectionID). Results are stashed into
 * AppData.QueryPanel.* by the view before rendering the results area.
 *
 * The editor instance lives in the 'SQLEditor' view (registered in the
 * application) and is mounted into this view's editor slot on every render.
 * Because QueryPanel's root is replaced on each render, the editor's
 * CodeJar instance is destroyed and the initial-render flag is reset so
 * pict-section-code reinitialises cleanly into the fresh target div.
 */const libPictView=require('pict-view');const _ViewConfiguration={ViewIdentifier:'QueryPanel',DefaultRenderable:'DataBeacon-QueryPanel',DefaultDestinationAddress:'#DataBeacon-QueryPanel-Slot',AutoRender:false,CSS:/*css*/`
		#DataBeacon-QueryPanel-Editor { min-height: 140px; }
		#DataBeacon-QueryPanel-Editor .pict-code-editor-wrap
		{
			border: 1px solid var(--theme-color-border-default, #808080);
			border-radius: 4px;
			background: var(--theme-color-background-input, var(--theme-color-background-panel, #ffffff));
		}
		#DataBeacon-QueryPanel-Editor .pict-code-editor
		{
			background: var(--theme-color-background-input, var(--theme-color-background-panel, #ffffff)) !important;
			color: var(--theme-color-text-primary, #1a1a1a) !important;
			font-family: 'SFMono-Regular', 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
			font-size: 13px;
			min-height: 120px;
		}
		#DataBeacon-QueryPanel-Editor .pict-code-line-numbers
		{
			background: var(--theme-color-background-panel, #fffbf0) !important;
			color: var(--theme-color-text-muted, #7a7a7a) !important;
			border-right: 1px solid var(--theme-color-border-default, #808080) !important;
		}
		#DataBeacon-QueryPanel-Editor .keyword { color: var(--theme-color-brand-primary, #000080); font-weight: 600; }
		#DataBeacon-QueryPanel-Editor .string { color: var(--theme-color-status-success, #008000); }
		#DataBeacon-QueryPanel-Editor .number { color: var(--theme-color-status-warning, #808000); }
		#DataBeacon-QueryPanel-Editor .comment { color: var(--theme-color-text-muted, #7a7a7a); font-style: italic; }
		#DataBeacon-QueryPanel-Editor .operator { color: var(--theme-color-status-info, #000080); }
		#DataBeacon-QueryPanel-Editor .function-name { color: var(--theme-color-status-info, #000080); }
		#DataBeacon-QueryPanel-Root .databeacon-export-bar { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; margin-top: 10px; }
		#DataBeacon-QueryPanel-Root .databeacon-export-bar .databeacon-export-label { color: var(--theme-color-text-muted, #7a7a7a); font-size: 12px; margin-right: 4px; }
	`,Templates:[{Hash:'DataBeacon-QueryPanel-Template',Template:/*html*/`
<div id="DataBeacon-QueryPanel-Root" class="section">
	<h2>Query Panel</h2>
	<div class="form-group">
		<label>{~D:AppData.QueryPanel.EditorLabel:SQL (SELECT only)~}</label>
		<div id="DataBeacon-QueryPanel-Editor"></div>
		<div class="help-text" id="DataBeacon-QueryPanel-EditorHint">{~D:AppData.QueryPanel.EditorHint~}</div>
	</div>
	<div class="button-row">
		<a class="btn btn-primary" href="#/queries/execute">
			<span data-databeacon-icon="play" data-icon-size="16"></span>
			Execute
		</a>
		<a class="btn btn-secondary" href="#/queries/save">
			<span data-databeacon-icon="save" data-icon-size="16"></span>
			Save…
		</a>
	</div>
	<div id="DataBeacon-QueryPanel-Results"></div>
</div>`},{Hash:'DataBeacon-QueryPanel-ResultsTable',Template:/*html*/`
<div class="table-scroll">
	<table class="data-table">
		<thead><tr>{~TS:DataBeacon-QueryPanel-HeaderCell:AppData.QueryPanel.ColumnList~}</tr></thead>
		<tbody>{~TS:DataBeacon-QueryPanel-Row:AppData.QueryPanel.Rows~}</tbody>
	</table>
</div>
{~TemplateIfAbsolute:DataBeacon-QueryPanel-TruncationNote:AppData.QueryPanel:AppData.QueryPanel.IsTruncated^TRUE^x~}
{~Template:DataBeacon-QueryPanel-ExportBar:~}`},{Hash:'DataBeacon-QueryPanel-ExportBar',Template:/*html*/`
<div class="databeacon-export-bar">
	<span class="databeacon-export-label">Export result:</span>
	<a class="btn btn-small btn-secondary" href="#/queries/export/json">
		<span data-databeacon-icon="download" data-icon-size="14"></span> JSON
	</a>
	<a class="btn btn-small btn-secondary" href="#/queries/export/json-comp">
		<span data-databeacon-icon="download" data-icon-size="14"></span> JSON Comprehension
	</a>
	<a class="btn btn-small btn-secondary" href="#/queries/export/csv">
		<span data-databeacon-icon="download" data-icon-size="14"></span> CSV
	</a>
	<a class="btn btn-small btn-secondary" href="#/queries/export/tsv">
		<span data-databeacon-icon="download" data-icon-size="14"></span> TSV
	</a>
</div>`},{Hash:'DataBeacon-QueryPanel-HeaderCell',Template:`<th>{~D:Record.Name~}</th>`},{Hash:'DataBeacon-QueryPanel-Row',Template:`<tr>{~TS:DataBeacon-QueryPanel-Cell:Record.Cells~}</tr>`},{Hash:'DataBeacon-QueryPanel-Cell',Template:`<td>{~D:Record.CellHTML~}</td>`},{Hash:'DataBeacon-QueryPanel-TruncationNote',Template:`<p class="help-text">Showing {~D:AppData.QueryPanel.DisplayCount~} of {~D:AppData.QueryPanel.TotalCount~}</p>`},{Hash:'DataBeacon-QueryPanel-EmptyResults',Template:`<p class="empty-state">No results.</p>`}],Renderables:[{RenderableHash:'DataBeacon-QueryPanel',TemplateHash:'DataBeacon-QueryPanel-Template',ContentDestinationAddress:'#DataBeacon-QueryPanel-Slot',RenderMethod:'replace'}]};class PictViewDataBeaconQueryPanel extends libPictView{constructor(pFable,pOptions,pServiceHash){super(pFable,pOptions,pServiceHash);}onBeforeRender(pRenderable){// Refresh the editor label/hint/language metadata based on the
// current connection type so the declarative template bindings
// (`AppData.QueryPanel.EditorLabel` etc.) have the latest values
// before the root renders.
this._applyDriverProfile();return super.onBeforeRender(pRenderable);}onAfterRender(pRenderable,pRenderDestinationAddress,pRecord,pContent){let tmpIcons=this.pict.providers['DataBeacon-Icons'];if(tmpIcons)tmpIcons.injectIconPlaceholders('#DataBeacon-QueryPanel-Root');// QueryPanel's root DOM is replaced on every render, so a previously
// mounted CodeJar instance is orphaned against a detached div.
// Tear it down (if present) and rebuild into the fresh target.
this._mountEditor();this.pict.CSSMap.injectCSS();return super.onAfterRender(pRenderable,pRenderDestinationAddress,pRecord,pContent);}_mountEditor(){let tmpEditor=this.pict.views.SQLEditor;if(!tmpEditor)return;// Align CodeJar's language BEFORE (re)creating its instance so the
// appropriate highlighter is compiled at init time.
let tmpLanguage=this._resolveEditorLanguage();if(tmpEditor._language!==tmpLanguage&&typeof tmpEditor.setLanguage==='function'){try{tmpEditor.setLanguage(tmpLanguage);}catch(pError){tmpEditor._language=tmpLanguage;}}if(tmpEditor.codeJar)tmpEditor.destroy();tmpEditor.initialRenderComplete=false;tmpEditor.render();// Wire a defensive Enter handler that guarantees a '\n' insertion in
// every browser. In Firefox >= 136, contentEditable="plaintext-only"
// is disabled and CodeJar's legacy fallback only triggers when its
// indent branch doesn't match — non-indent Enter keys fall through
// to the browser's default, which on some platforms splits the line
// into <div> wrappers whose textContent doesn't preserve newlines.
// Handling Enter explicitly in the capture phase bypasses that.
this._wireEnterSafety();}_wireEnterSafety(){let tmpEditor=this.pict.views.SQLEditor;if(!tmpEditor||!tmpEditor._editorElement)return;let tmpEl=tmpEditor._editorElement;// Guaranteed-newline Enter handler. Some browsers insert <br> or <div>
// on Enter even when contenteditable is plaintext-only; when CodeJar's
// highlighter re-renders innerHTML from textContent, those non-'\n'
// structures collapse and the visual line break disappears ("line
// numbers don't increment, typing another char joins them back").
// Inserting a literal '\n' as a Text node bypasses the browser's
// default Enter behavior entirely.
let fHandler=pEvent=>{if(pEvent.key!=='Enter')return;if(pEvent.defaultPrevented)return;if(pEvent.ctrlKey||pEvent.metaKey||pEvent.altKey)return;pEvent.preventDefault();pEvent.stopPropagation();pEvent.stopImmediatePropagation();let tmpPadding=this._computeCurrentLinePadding(tmpEl);// When Enter lands at end-of-content, the next keystroke would
// otherwise target a DOM "flag" position (between-nodes) which
// Chrome resolves into the preceding span — the next character
// appears joined to the previous line. Mirror the browser's
// own end-of-content placeholder pattern: insert '\n\n' when
// there's nothing after the cursor, and pin the caret between
// the two newlines. CodeJar's highlighter then re-renders into
// a single trailing text node whose contents are addressable.
let tmpAtEnd=this._isCursorAtEnd(tmpEl);let tmpInsert='\n'+tmpPadding+(tmpAtEnd?'\n':'');let tmpInserted=this._manualInsertText(tmpEl,tmpInsert);if(tmpAtEnd&&tmpInserted){this._placeCaretInTextNode(tmpInserted,tmpPadding.length+1);}// Do NOT call codeJar.updateCode here — it resets textContent
// which loses the cursor position we just placed. CodeJar's
// keyup handler (unaffected by our keydown preventDefault) will
// fire debounceHighlight + onUpdate shortly; that drives line
// numbers and the AppData write through the normal path.
};tmpEl.addEventListener('keydown',fHandler,true);}// ── Caret / text-node helpers ──────────────────────────────────────────
// The methods below manipulate Selection / Range / TextNode directly via
// the browser DOM.  ContentAssignment's abstractions don't cover caret
// position or in-place text splicing, so these fall under the pict
// "DOM access unless absolutely necessary" carve-out (rich text input
// behavior).  Keep them scoped to CodeJar's contenteditable root only.
_computeCurrentLinePadding(pEditor){let tmpSel=window.getSelection();if(!tmpSel||tmpSel.rangeCount===0)return'';let tmpRange=tmpSel.getRangeAt(0);let tmpPre=document.createRange();tmpPre.selectNodeContents(pEditor);tmpPre.setEnd(tmpRange.startContainer,tmpRange.startOffset);let tmpText=tmpPre.toString();let tmpLineStart=tmpText.lastIndexOf('\n')+1;let tmpLine=tmpText.substring(tmpLineStart);let tmpMatch=tmpLine.match(/^[ \t]*/);return tmpMatch?tmpMatch[0]:'';}_manualInsertText(pEditor,pText){let tmpSel=window.getSelection();if(!tmpSel||tmpSel.rangeCount===0){let tmpNode=document.createTextNode(pText);pEditor.appendChild(tmpNode);return tmpNode;}let tmpRange=tmpSel.getRangeAt(0);tmpRange.deleteContents();let tmpNode=document.createTextNode(pText);tmpRange.insertNode(tmpNode);// Place caret INSIDE the newly-inserted text node at its end by
// default. Caller may reposition via _placeCaretInTextNode.
let tmpCollapse=document.createRange();tmpCollapse.setStart(tmpNode,tmpNode.length);tmpCollapse.setEnd(tmpNode,tmpNode.length);tmpSel.removeAllRanges();tmpSel.addRange(tmpCollapse);return tmpNode;}_placeCaretInTextNode(pTextNode,pOffset){if(!pTextNode||pTextNode.nodeType!==Node.TEXT_NODE)return;let tmpSel=window.getSelection();if(!tmpSel)return;let tmpOffset=Math.max(0,Math.min(pOffset,pTextNode.length));let tmpRange=document.createRange();tmpRange.setStart(pTextNode,tmpOffset);tmpRange.setEnd(pTextNode,tmpOffset);tmpSel.removeAllRanges();tmpSel.addRange(tmpRange);}_isCursorAtEnd(pEditor){let tmpSel=window.getSelection();if(!tmpSel||tmpSel.rangeCount===0)return true;let tmpRange=tmpSel.getRangeAt(0);let tmpAfter=document.createRange();tmpAfter.selectNodeContents(pEditor);tmpAfter.setStart(tmpRange.endContainer,tmpRange.endOffset);return tmpAfter.toString().length===0;}// ── Router-handler entry points (called by Application) ────────────────
// `#/queries/execute`, `#/queries/save`, `#/queries/export/:format` each
// resolve to one of these methods through PictApplication.
_executeQuery(){return this._execute();}_saveQuery(){return this._openSaveModal();}_exportQueryResult(pFormat){return this._export(pFormat);}_openSaveModal(){let tmpList=this.pict.views.SavedQueriesList;let tmpProvider=this.pict.providers['DataBeacon-SavedQueries'];if(!tmpList||!tmpProvider)return;let tmpSQL=this._readSQL();let tmpActiveGUID=tmpProvider.getActiveGUID();tmpList.openSaveFormModal({GUID:tmpActiveGUID,SQL:tmpSQL,EditMetadataOnly:false});}_export(pFormat){let tmpExport=this.pict.providers['DataBeacon-Export'];if(!tmpExport)return;let tmpQP=this.pict.AppData.QueryPanel||{};let tmpRows=Array.isArray(tmpQP.RawRows)?tmpQP.RawRows:[];if(tmpRows.length===0)return;// Query results have no table-of-origin — autodetect a Comprehension
// key by looking for Meadow's GUID${Entity} convention. Any column
// whose name starts with "GUID" wins; otherwise fall through to the
// exporter's 1-based row-index fallback.
let tmpKeyField=null;if(tmpRows[0]&&typeof tmpRows[0]==='object'){let tmpKeys=Object.keys(tmpRows[0]);for(let k=0;k<tmpKeys.length;k++){if(/^GUID[A-Z]/.test(tmpKeys[k])){tmpKeyField=tmpKeys[k];break;}}}tmpExport.exportRows(pFormat,tmpRows,{BaseName:'query-result',EntityName:'QueryResult',KeyField:tmpKeyField});}_readSQL(){let tmpEditor=this.pict.views.SQLEditor;if(tmpEditor&&typeof tmpEditor.getCode==='function'){let tmpCode=tmpEditor.getCode();if(typeof tmpCode==='string'&&tmpCode.length>0)return tmpCode;}// Fallback to the data-bound AppData address in case the editor was
// never initialised (headless context, no CodeJar, etc.).
let tmpAppData=this.pict.AppData.QueryPanel||{};return typeof tmpAppData.SQL==='string'?tmpAppData.SQL:'';}_execute(){let tmpModal=this.pict.views['Pict-Section-Modal'];let tmpSQL=this._readSQL().trim();let tmpCID=this.pict.AppData.SelectedConnectionID;if(!tmpSQL){let tmpProfile=this._currentDriverProfile();let tmpMessage=tmpProfile.IsSQL?'Please enter a SQL query.':`Please enter a ${tmpProfile.Label} query.`;if(tmpModal)tmpModal.toast(tmpMessage,{type:'warning'});return;}if(!tmpCID){if(tmpModal)tmpModal.toast('Select a connection in Introspection first.',{type:'warning'});return;}let tmpProvider=this.pict.providers.DataBeaconProvider;tmpProvider.executeQuery(tmpCID,tmpSQL,(pError,pData)=>{let tmpResultsSelector='#DataBeacon-QueryPanel-Results';if(pError||!pData||!pData.Success){let tmpMessage=pData?pData.Error:pError?pError.message:'Unknown error';this.pict.ContentAssignment.assignContent(tmpResultsSelector,`<p class="error">${tmpProvider.escapeHTML?tmpProvider.escapeHTML(tmpMessage):tmpMessage}</p>`);return;}let tmpRows=pData.Rows||[];if(tmpRows.length===0){let tmpHTML=this.pict.parseTemplateByHash('DataBeacon-QueryPanel-EmptyResults',null);this.pict.ContentAssignment.assignContent(tmpResultsSelector,tmpHTML);return;}this.pict.AppData.QueryPanel=Object.assign({},this.pict.AppData.QueryPanel,tmpProvider.buildQueryResultViewData(tmpRows));let tmpHTML=this.pict.parseTemplateByHash('DataBeacon-QueryPanel-ResultsTable',null);this.pict.ContentAssignment.assignContent(tmpResultsSelector,tmpHTML);// The results fragment contains fresh data-databeacon-icon
// placeholders (export-bar buttons) — fill them in now since
// the view's initial icon pass ran before these elements existed.
let tmpIcons=this.pict.providers['DataBeacon-Icons'];if(tmpIcons)tmpIcons.injectIconPlaceholders('#DataBeacon-QueryPanel-Root');// If a saved query is currently loaded, record this successful
// execution on it (timestamp + row count).
let tmpSavedProvider=this.pict.providers['DataBeacon-SavedQueries'];if(tmpSavedProvider){let tmpGUID=tmpSavedProvider.getActiveGUID();if(tmpGUID)tmpSavedProvider.noteRun(tmpGUID,tmpRows.length);}});}// ================================================================
// Driver-aware editor profile (SQL vs Mongo/Solr/RocksDB JSON)
// ================================================================
_currentDriverProfile(){let tmpConn=this._currentConnection();let tmpType=tmpConn?tmpConn.Type:null;switch(tmpType){case'MongoDB':return{Type:'MongoDB',IsSQL:false,Language:'json',Label:'MongoDB (JSON descriptor)',Hint:'Example: {"op":"find","collection":"users","filter":{"active":true},"limit":50} · also supports "aggregate" and "runCommand"'};case'Solr':return{Type:'Solr',IsSQL:false,Language:'json',Label:'Solr (JSON descriptor or query string)',Hint:'JSON: {"q":"title:foo","rows":50} · or raw: q=title:foo&rows=50'};case'RocksDB':return{Type:'RocksDB',IsSQL:false,Language:'json',Label:'RocksDB (JSON descriptor)',Hint:'Example: {"op":"scan","start":"user/","end":"user/~","limit":50} · also supports {"op":"get","key":"user/1"}'};case'MySQL':case'PostgreSQL':case'MSSQL':case'SQLite':default:return{Type:tmpType||'SQL',IsSQL:true,Language:'sql',Label:'SQL (SELECT only)',Hint:'SELECT ... — other statement types are rejected server-side.'};}}_resolveEditorLanguage(){return this._currentDriverProfile().Language;}_applyDriverProfile(){let tmpProfile=this._currentDriverProfile();if(!this.pict.AppData.QueryPanel)this.pict.AppData.QueryPanel={SQL:''};this.pict.AppData.QueryPanel.EditorLabel=tmpProfile.Label;this.pict.AppData.QueryPanel.EditorHint=tmpProfile.Hint;this.pict.AppData.QueryPanel.EditorLanguage=tmpProfile.Language;this.pict.AppData.QueryPanel.DriverType=tmpProfile.Type;}_currentConnection(){let tmpID=this.pict.AppData.SelectedConnectionID;if(tmpID===null||tmpID===undefined)return null;let tmpConns=this.pict.AppData.Connections||[];for(let i=0;i<tmpConns.length;i++){if(tmpConns[i].IDBeaconConnection===tmpID)return tmpConns[i];}return null;}}module.exports=PictViewDataBeaconQueryPanel;module.exports.default_configuration=_ViewConfiguration;},{"pict-view":94}],116:[function(require,module,exports){/**
 * DataBeacon RecordBrowser View
 *
 * Table picker + paginated record table. Users pick a page size, a
 * cursor-start offset, and page forward/backward through the underlying
 * endpoint. The provider populates AppData.RecordBrowser with render-ready
 * fields (ColumnList, Rows, CursorStart, PageSize, PrevDisabled,
 * NextDisabled, RangeLabel, PageSizeOptions) so templates stay declarative.
 */const libPictView=require('pict-view');const _ViewConfiguration={ViewIdentifier:'RecordBrowser',DefaultRenderable:'DataBeacon-RecordBrowser',DefaultDestinationAddress:'#DataBeacon-RecordBrowser-Slot',AutoRender:false,CSS:/*css*/`
		.databeacon-records-toolbar
		{
			display: flex; flex-wrap: wrap; gap: 12px; align-items: flex-end;
		}
		.databeacon-records-toolbar .form-group
		{
			display: flex; flex-direction: column; gap: 4px; margin: 0;
		}
		.databeacon-records-toolbar .form-group label
		{
			font-size: 12px; line-height: 1; color: var(--theme-color-text-muted, #7a7a7a);
			text-transform: uppercase; letter-spacing: 0.4px;
			margin: 0;
		}
		/* Single uniform control height: inputs, selects, and anchor-styled
		   buttons inside the toolbar all share this so labels stay aligned. */
		.databeacon-records-toolbar input,
		.databeacon-records-toolbar select,
		.databeacon-records-toolbar .btn
		{
			height: 32px;
			box-sizing: border-box;
			line-height: 1.2;
			padding: 0 10px;
			font-size: 13px;
		}
		/* Anchors styled as buttons don't vertically center their text the
		   way block inputs do; inline-flex centers the label (and any icon
		   span) cleanly on the 32px row. */
		.databeacon-records-toolbar .btn
		{
			display: inline-flex;
			align-items: center;
			justify-content: center;
			gap: 4px;
		}
		.databeacon-records-pager-buttons { display: flex; gap: 6px; align-items: stretch; }
		.databeacon-records-start-input { width: 100px; }
		.databeacon-records-pagesize-select { width: 90px; }
		/* Flex grow lives on the form-group (a toolbar row child) so the
		   group widens on the main axis; the input below just fills the
		   group's width.  Putting flex-basis on the input itself would set
		   its height inside the column-flex form-group. */
		.databeacon-records-filter-group { flex: 1 1 260px; min-width: 260px; max-width: 520px; }
		.databeacon-records-filter-input { width: 100%; }
		.databeacon-records-range { margin-top: 8px; color: var(--theme-color-text-muted, #7a7a7a); font-size: 12px; }
		.databeacon-records-count-badge
		{
			display: inline-block; padding: 1px 8px; margin-left: 6px;
			border-radius: 10px; background: var(--theme-color-background-input, var(--theme-color-background-panel, #ffffff)); color: var(--theme-color-text-primary, #1a1a1a);
			font-size: 11px; font-weight: 600;
		}
		.databeacon-records-pagination
		{
			display: flex; flex-wrap: wrap; gap: 4px; align-items: center;
			margin-top: 14px;
		}
		.databeacon-records-pagination .btn { min-width: 34px; padding: 0 8px; height: 30px; }
		.databeacon-records-pagination .btn.current
		{
			background: var(--theme-color-brand-primary, #000080); color: var(--theme-color-background-panel, #fffbf0);
			border-color: var(--theme-color-brand-primary, #000080);
		}
		.databeacon-records-pagination-ellipsis
		{
			padding: 0 6px; color: var(--theme-color-text-muted, #7a7a7a); font-size: 13px;
		}
		.databeacon-export-bar { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; margin-top: 10px; }
		.databeacon-export-bar .databeacon-export-label { color: var(--theme-color-text-muted, #7a7a7a); font-size: 12px; margin-right: 4px; }
	`,Templates:[{Hash:'DataBeacon-RecordBrowser-Template',Template:/*html*/`
<div id="DataBeacon-RecordBrowser-Root" class="section">
	<div class="databeacon-records-toolbar">
		<div class="form-group">
			<label>Table</label>
			<select id="databeacon-records-table" onchange="{~P~}.PictApplication.selectRecordsTable(this.value)">
				<option value="">-- Select Table --</option>
				{~TS:DataBeacon-RecordBrowser-TableOption:AppData.RecordBrowser.TableOptions~}
			</select>
		</div>
		<div class="form-group">
			<label>Page Size</label>
			<select class="databeacon-records-pagesize-select" onchange="{~P~}.PictApplication.changeRecordsPageSize(this.value)">
				{~TS:DataBeacon-RecordBrowser-PageSizeOption:AppData.RecordBrowser.PageSizeOptions~}
			</select>
		</div>
		<div class="form-group">
			<label>Page</label>
			<input type="number" class="databeacon-records-start-input" min="1" step="1" value="{~D:AppData.RecordBrowser.Page:1~}" onchange="{~P~}.PictApplication.goToRecordsPage(this.value)" />
		</div>
		<div class="form-group databeacon-records-filter-group">
			<label>Filter (meadow FBL)</label>
			<input type="text" id="databeacon-records-filter" class="databeacon-records-filter-input" placeholder="FBV~Column~EQ~Value~FBV~Other~LK~%25foo%25" value="{~D:AppData.RecordBrowser.FilterString:~}" onchange="{~P~}.PictApplication.applyRecordsFilter(this.value)" />
		</div>
		<div class="form-group">
			<label>&nbsp;</label>
			<div class="databeacon-records-pager-buttons">
				<a class="btn btn-small btn-secondary" href="#/records/filter/apply" title="Apply the filter currently in the input">Apply</a>
				<a class="btn btn-small btn-secondary {~D:AppData.RecordBrowser.FilterClearClass~}" href="#/records/filter/clear" title="Remove the filter">Clear</a>
			</div>
		</div>
		<div class="form-group">
			<label>&nbsp;</label>
			<a class="btn btn-small btn-primary {~D:AppData.RecordBrowser.LoadDisabledClass~}" href="#/records/load">
				<span data-databeacon-icon="refresh" data-icon-size="14"></span> Reload
			</a>
		</div>
	</div>
	<div class="databeacon-records-range">
		{~D:AppData.RecordBrowser.RangeLabel~}
		{~TemplateIfAbsolute:DataBeacon-RecordBrowser-CountBadge:AppData.RecordBrowser:AppData.RecordBrowser.HasTotalCount^TRUE^x~}
	</div>
	{~TemplateIfAbsolute:DataBeacon-RecordBrowser-Empty:AppData.RecordBrowser:AppData.RecordBrowser.State^==^Empty~}
	{~TemplateIfAbsolute:DataBeacon-RecordBrowser-NoSelection:AppData.RecordBrowser:AppData.RecordBrowser.State^==^NoSelection~}
	{~TemplateIfAbsolute:DataBeacon-RecordBrowser-Table:AppData.RecordBrowser:AppData.RecordBrowser.State^==^HasRows~}
	{~TemplateIfAbsolute:DataBeacon-RecordBrowser-Pagination:AppData.RecordBrowser:AppData.RecordBrowser.ShowPagination^TRUE^x~}
	{~TemplateIfAbsolute:DataBeacon-RecordBrowser-ExportBar:AppData.RecordBrowser:AppData.RecordBrowser.State^==^HasRows~}
</div>`},{Hash:'DataBeacon-RecordBrowser-ExportBar',Template:/*html*/`
<div class="databeacon-export-bar">
	<span class="databeacon-export-label">Export current page:</span>
	<a class="btn btn-small btn-secondary" href="#/records/export/json">
		<span data-databeacon-icon="download" data-icon-size="14"></span> JSON
	</a>
	<a class="btn btn-small btn-secondary" href="#/records/export/json-comp">
		<span data-databeacon-icon="download" data-icon-size="14"></span> JSON Comprehension
	</a>
	<a class="btn btn-small btn-secondary" href="#/records/export/csv">
		<span data-databeacon-icon="download" data-icon-size="14"></span> CSV
	</a>
	<a class="btn btn-small btn-secondary" href="#/records/export/tsv">
		<span data-databeacon-icon="download" data-icon-size="14"></span> TSV
	</a>
</div>
<div class="databeacon-export-bar">
	<span class="databeacon-export-label">Export <strong>all {~D:AppData.RecordBrowser.FullExportLabel~}</strong>:</span>
	<a class="btn btn-small btn-secondary" href="#/records/export-all/json-comp">
		<span data-databeacon-icon="download" data-icon-size="14"></span> Comprehension
	</a>
	<a class="btn btn-small btn-secondary" href="#/records/export-all/csv">
		<span data-databeacon-icon="download" data-icon-size="14"></span> CSV
	</a>
</div>`},{Hash:'DataBeacon-RecordBrowser-CountBadge',Template:`<span class="databeacon-records-count-badge">{~D:AppData.RecordBrowser.TotalCountLabel~}</span>`},{Hash:'DataBeacon-RecordBrowser-Pagination',Template:/*html*/`
<div class="databeacon-records-pagination">
	<a class="btn btn-small btn-secondary {~D:AppData.RecordBrowser.PrevDisabledClass~}" href="{~D:AppData.RecordBrowser.PrevHref~}" title="Previous page">
		<span data-databeacon-icon="chevron-left" data-icon-size="14"></span>
	</a>
	{~TS:DataBeacon-RecordBrowser-PaginationLink:AppData.RecordBrowser.PageLinks~}
	<a class="btn btn-small btn-secondary {~D:AppData.RecordBrowser.NextDisabledClass~}" href="{~D:AppData.RecordBrowser.NextHref~}" title="Next page">
		<span data-databeacon-icon="chevron-right" data-icon-size="14"></span>
	</a>
</div>`},{// Each pagination entry is either a link (Kind=link) or an ellipsis
// spacer (Kind=ellipsis).  Rendered via TIf on Kind so one template
// covers both cases without a branch in the provider.
Hash:'DataBeacon-RecordBrowser-PaginationLink',Template:/*html*/`{~TIf:DataBeacon-RecordBrowser-PaginationLinkItem::Record.Kind^link^x~}{~TIf:DataBeacon-RecordBrowser-PaginationEllipsis::Record.Kind^ellipsis^x~}`},{Hash:'DataBeacon-RecordBrowser-PaginationLinkItem',Template:`<a class="btn btn-small btn-secondary {~D:Record.CurrentClass~}" href="{~D:Record.Href~}">{~D:Record.Label~}</a>`},{Hash:'DataBeacon-RecordBrowser-PaginationEllipsis',Template:`<span class="databeacon-records-pagination-ellipsis">…</span>`},{Hash:'DataBeacon-RecordBrowser-TableOption',Template:`<option value="{~D:Record.TableName~}" {~D:Record.SelectedAttr~}>{~D:Record.TableName~}</option>`},{Hash:'DataBeacon-RecordBrowser-PageSizeOption',Template:`<option value="{~D:Record.Value~}" {~D:Record.SelectedAttr~}>{~D:Record.Value~}</option>`},{Hash:'DataBeacon-RecordBrowser-NoSelection',Template:`<p class="empty-state">Select an enabled table and click Reload.</p>`},{Hash:'DataBeacon-RecordBrowser-Empty',Template:`<p class="empty-state">No records in this page.</p>`},{Hash:'DataBeacon-RecordBrowser-Table',Template:/*html*/`
<div class="section">
	<h2>{~D:AppData.RecordBrowser.TableName~}</h2>
	<div class="table-scroll">
		<table class="data-table">
			<thead><tr>{~TS:DataBeacon-RecordBrowser-HeaderCell:AppData.RecordBrowser.ColumnList~}</tr></thead>
			<tbody>{~TS:DataBeacon-RecordBrowser-Row:AppData.RecordBrowser.Rows~}</tbody>
		</table>
	</div>
</div>`},{Hash:'DataBeacon-RecordBrowser-HeaderCell',Template:`<th>{~D:Record.Name~}</th>`},{Hash:'DataBeacon-RecordBrowser-Row',Template:`<tr>{~TS:DataBeacon-RecordBrowser-Cell:Record.Cells~}</tr>`},{Hash:'DataBeacon-RecordBrowser-Cell',Template:`<td>{~D:Record.CellHTML~}</td>`}],Renderables:[{RenderableHash:'DataBeacon-RecordBrowser',TemplateHash:'DataBeacon-RecordBrowser-Template',ContentDestinationAddress:'#DataBeacon-RecordBrowser-Slot',RenderMethod:'replace'}]};class PictViewDataBeaconRecordBrowser extends libPictView{constructor(pFable,pOptions,pServiceHash){super(pFable,pOptions,pServiceHash);}onAfterRender(pRenderable,pRenderDestinationAddress,pRecord,pContent){let tmpIcons=this.pict.providers['DataBeacon-Icons'];if(tmpIcons)tmpIcons.injectIconPlaceholders('#DataBeacon-RecordBrowser-Root');this.pict.CSSMap.injectCSS();return super.onAfterRender(pRenderable,pRenderDestinationAddress,pRecord,pContent);}// ── Router-handler entry points (called by Application) ────────────────
// Each method is called from a `#/records/...` route or an inline
// onchange expression (select/input).  No addEventListener delegation.
_loadCurrent(){let tmpProvider=this.pict.providers.DataBeaconProvider;let tmpBrowser=this.pict.AppData.RecordBrowser||{};let tmpTable=this.pict.AppData.SelectedTableName;if(!tmpTable){return;}let tmpStart=this._clampStart(tmpBrowser.CursorStart);let tmpSize=this._clampSize(tmpBrowser.PageSize);tmpProvider.loadRecords(tmpTable,tmpStart,tmpSize,tmpBrowser.FilterString||'');}_pagePrev(){this._pageStep(-1);}_pageNext(){this._pageStep(+1);}_pageStep(pDir){let tmpBrowser=this.pict.AppData.RecordBrowser||{};let tmpTable=this.pict.AppData.SelectedTableName;if(!tmpTable){return;}let tmpSize=this._clampSize(tmpBrowser.PageSize);let tmpCurrent=this._clampStart(tmpBrowser.CursorStart);let tmpTotal=typeof tmpBrowser.TotalCount==='number'&&tmpBrowser.TotalCount>0?tmpBrowser.TotalCount:Infinity;let tmpMaxStart=tmpTotal===Infinity?Infinity:Math.max(0,tmpTotal-1);let tmpNext=Math.min(tmpMaxStart,Math.max(0,tmpCurrent+pDir*tmpSize));this.pict.AppData.RecordBrowser.CursorStart=tmpNext;this.pict.AppData.RecordBrowser.Page=this._pageFromStart(tmpNext,tmpSize);this.pict.providers.DataBeaconProvider.loadRecords(tmpTable,tmpNext,tmpSize,tmpBrowser.FilterString||'');}_goToPage(pPage){let tmpBrowser=this.pict.AppData.RecordBrowser||{};let tmpTable=this.pict.AppData.SelectedTableName;if(!tmpTable){return;}let tmpSize=this._clampSize(tmpBrowser.PageSize);let tmpPage=parseInt(pPage,10);if(isNaN(tmpPage)||tmpPage<1){tmpPage=1;}let tmpStart=(tmpPage-1)*tmpSize;this.pict.AppData.RecordBrowser.CursorStart=tmpStart;this.pict.AppData.RecordBrowser.Page=tmpPage;this.pict.providers.DataBeaconProvider.loadRecords(tmpTable,tmpStart,tmpSize,tmpBrowser.FilterString||'');}_applyFilter(pFilterString){if(!this.pict.AppData.RecordBrowser){this.pict.AppData.RecordBrowser={};}this.pict.AppData.RecordBrowser.FilterString=(pFilterString||'').trim();this.pict.AppData.RecordBrowser.CursorStart=0;this.pict.AppData.RecordBrowser.Page=1;// Kick a non-blocking count refresh then load the first page.
this._refreshTotalCount();this._loadCurrent();}_clearFilter(){this._applyFilter('');}_refreshTotalCount(){let tmpTable=this.pict.AppData.SelectedTableName;if(!tmpTable){return;}let tmpFilter=this.pict.AppData.RecordBrowser&&this.pict.AppData.RecordBrowser.FilterString||'';let tmpProv=this.pict.providers.DataBeaconProvider;if(tmpProv&&typeof tmpProv.loadRecordCount==='function'){tmpProv.loadRecordCount(tmpTable,tmpFilter);}}_exportRecords(pFormat){let tmpBrowser=this.pict.AppData.RecordBrowser||{};let tmpTable=this.pict.AppData.SelectedTableName;let tmpStart=this._clampStart(tmpBrowser.CursorStart);let tmpSize=this._clampSize(tmpBrowser.PageSize);this._export(pFormat,tmpTable,tmpStart,tmpSize);}_exportAllRecords(pFormat){let tmpProv=this.pict.providers.DataBeaconProvider;let tmpExport=this.pict.providers['DataBeacon-Export'];let tmpModal=this.pict.views['Pict-Section-Modal'];let tmpBrowser=this.pict.AppData.RecordBrowser||{};let tmpTable=this.pict.AppData.SelectedTableName;let tmpFilter=tmpBrowser.FilterString||'';if(!tmpTable||!tmpExport||!tmpProv||typeof tmpProv.loadRecordsAll!=='function'){return;}if(tmpModal){tmpModal.toast('Fetching full record set for export…',{type:'info'});}tmpProv.loadRecordsAll(tmpTable,tmpFilter,(pErr,pRows)=>{if(pErr||!Array.isArray(pRows)){if(tmpModal){tmpModal.toast(`Export fetch failed: ${pErr?pErr.message:'unknown'}`,{type:'error'});}return;}if(pRows.length===0){if(tmpModal){tmpModal.toast('No records to export.',{type:'warning'});}return;}let tmpFilterSlug=this._filenameSlug(tmpFilter);let tmpBaseName=tmpFilterSlug?`${tmpTable}-all-filtered-${tmpFilterSlug}`:`${tmpTable}-all`;let tmpKeyField=this._findGUIDField(tmpTable,pRows);tmpExport.exportRows(pFormat,pRows,{BaseName:tmpBaseName,EntityName:tmpTable||'Record',KeyField:tmpKeyField});});}_filenameSlug(pFilterString){if(!pFilterString){return'';}return String(pFilterString).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,60);}_pageFromStart(pStart,pSize){let tmpStart=parseInt(pStart,10)||0;let tmpSize=parseInt(pSize,10)||1;return Math.floor(tmpStart/tmpSize)+1;}_selectTable(pTableName){this.pict.AppData.SelectedTableName=pTableName||'';if(!this.pict.AppData.RecordBrowser){this.pict.AppData.RecordBrowser={};}this.pict.AppData.RecordBrowser.CursorStart=0;this.pict.AppData.RecordBrowser.Page=1;// Changing table invalidates any prior filter/count.
this.pict.AppData.RecordBrowser.FilterString='';this.pict.AppData.RecordBrowser.TotalCount=null;let tmpProv=this.pict.providers.DataBeaconProvider;if(pTableName&&tmpProv){this._refreshTotalCount();tmpProv.loadRecords(pTableName,0,this._clampSize(this.pict.AppData.RecordBrowser.PageSize),'');}else if(tmpProv&&typeof tmpProv.refreshRecordBrowserViewData==='function'){tmpProv.refreshRecordBrowserViewData();this.render();}}_setPageSize(pRawValue){let tmpSize=this._clampSize(pRawValue);if(!this.pict.AppData.RecordBrowser){this.pict.AppData.RecordBrowser={};}this.pict.AppData.RecordBrowser.PageSize=tmpSize;// Recompute page 1 for consistency (current CursorStart may not align).
this.pict.AppData.RecordBrowser.CursorStart=0;this.pict.AppData.RecordBrowser.Page=1;this._loadCurrent();}_export(pFormat,pTable,pStart,pSize){let tmpExport=this.pict.providers['DataBeacon-Export'];if(!tmpExport)return;let tmpRows=Array.isArray(this.pict.AppData.Records)?this.pict.AppData.Records:[];if(tmpRows.length===0)return;let tmpEntity=pTable||'Record';let tmpKeyField=this._findGUIDField(tmpEntity,tmpRows);let tmpBase=`${tmpEntity}-${pStart}-${pStart+tmpRows.length-1}`;tmpExport.exportRows(pFormat,tmpRows,{BaseName:tmpBase,EntityName:tmpEntity,KeyField:tmpKeyField});}/**
	 * Resolve the Comprehension key column for the selected table.
	 *
	 * Meadow's Comprehension format keys records by a GUID column, not the
	 * numeric primary key. The default GUIDName is `GUID${Entity}` (e.g.
	 * `GUIDUser` for the `User` entity). We try, in order:
	 *   1) Exact match `GUID${Entity}` on the first row.
	 *   2) Exact match `GUID${Entity}` in the introspected column list.
	 *   3) Any column whose name starts with `GUID[A-Z]` in the first row.
	 *   4) null — the exporter then falls back to 1-based row index.
	 */_findGUIDField(pEntityName,pRows){let tmpFirstRow=pRows&&pRows.length>0&&typeof pRows[0]==='object'&&pRows[0]!==null?pRows[0]:null;if(pEntityName&&tmpFirstRow){let tmpExpected=`GUID${pEntityName}`;if(Object.prototype.hasOwnProperty.call(tmpFirstRow,tmpExpected)){return tmpExpected;}}if(pEntityName){let tmpTables=this.pict.AppData.Tables||[];let tmpExpected=`GUID${pEntityName}`;for(let i=0;i<tmpTables.length;i++){if(tmpTables[i].TableName!==pEntityName)continue;let tmpColumns=tmpTables[i].Columns||[];for(let c=0;c<tmpColumns.length;c++){if(tmpColumns[c].Name===tmpExpected)return tmpExpected;}break;}}if(tmpFirstRow){let tmpKeys=Object.keys(tmpFirstRow);for(let k=0;k<tmpKeys.length;k++){if(/^GUID[A-Z]/.test(tmpKeys[k]))return tmpKeys[k];}}return null;}_clampStart(pValue){let tmpN=parseInt(pValue,10);if(isNaN(tmpN)||tmpN<0)return 0;return tmpN;}_clampSize(pValue){let tmpN=parseInt(pValue,10);if(isNaN(tmpN)||tmpN<1)return 50;if(tmpN>1000)return 1000;return tmpN;}}module.exports=PictViewDataBeaconRecordBrowser;module.exports.default_configuration=_ViewConfiguration;},{"pict-view":94}],117:[function(require,module,exports){/**
 * DataBeacon Records Page (container view)
 *
 * Dedicated page for paging through table records. Hosts the RecordBrowser
 * sub-view only — SQL execution lives on its own page (see
 * PictView-DataBeacon-SQL.js) so the two workflows don't crowd each other.
 */const libPictView=require('pict-view');const _ViewConfiguration={ViewIdentifier:'Records',DefaultRenderable:'DataBeacon-RecordsPage',DefaultDestinationAddress:'#DataBeacon-View-Records',AutoRender:false,Templates:[{Hash:'DataBeacon-RecordsPage-Template',Template:/*html*/`
<div class="records-view">
	<h1>Record Browser</h1>
	<div id="DataBeacon-RecordBrowser-Slot"></div>
</div>`}],Renderables:[{RenderableHash:'DataBeacon-RecordsPage',TemplateHash:'DataBeacon-RecordsPage-Template',ContentDestinationAddress:'#DataBeacon-View-Records',RenderMethod:'replace'}]};class PictViewDataBeaconRecords extends libPictView{constructor(pFable,pOptions,pServiceHash){super(pFable,pOptions,pServiceHash);}onBeforeRender(pRenderable){let tmpProvider=this.pict.providers.DataBeaconProvider;if(tmpProvider&&typeof tmpProvider.refreshRecordBrowserViewData==='function'){tmpProvider.refreshRecordBrowserViewData();}return super.onBeforeRender(pRenderable);}onAfterRender(pRenderable,pRenderDestinationAddress,pRecord,pContent){if(this.pict.views.RecordBrowser)this.pict.views.RecordBrowser.render();return super.onAfterRender(pRenderable,pRenderDestinationAddress,pRecord,pContent);}}module.exports=PictViewDataBeaconRecords;module.exports.default_configuration=_ViewConfiguration;},{"pict-view":94}],118:[function(require,module,exports){/**
 * DataBeacon SQL Page (container view)
 *
 * Dedicated page for ad-hoc SQL execution. Hosts the QueryPanel sub-view
 * so it has its own nav item (separated from record browsing).
 */const libPictView=require('pict-view');const _ViewConfiguration={ViewIdentifier:'SQL',DefaultRenderable:'DataBeacon-SQLPage',DefaultDestinationAddress:'#DataBeacon-View-SQL',AutoRender:false,Templates:[{Hash:'DataBeacon-SQLPage-Template',Template:/*html*/`
<div class="sql-view">
	<h1>SQL Query</h1>
	<div id="DataBeacon-SavedQueries-Slot"></div>
	<div id="DataBeacon-QueryPanel-Slot"></div>
</div>`}],Renderables:[{RenderableHash:'DataBeacon-SQLPage',TemplateHash:'DataBeacon-SQLPage-Template',ContentDestinationAddress:'#DataBeacon-View-SQL',RenderMethod:'replace'}]};class PictViewDataBeaconSQL extends libPictView{constructor(pFable,pOptions,pServiceHash){super(pFable,pOptions,pServiceHash);}onAfterRender(pRenderable,pRenderDestinationAddress,pRecord,pContent){if(this.pict.views.SavedQueriesList)this.pict.views.SavedQueriesList.render();if(this.pict.views.QueryPanel)this.pict.views.QueryPanel.render();return super.onAfterRender(pRenderable,pRenderDestinationAddress,pRecord,pContent);}}module.exports=PictViewDataBeaconSQL;module.exports.default_configuration=_ViewConfiguration;},{"pict-view":94}],119:[function(require,module,exports){/**
 * DataBeacon SavedQueriesList View
 *
 * Collapsible panel above the QueryPanel that lists saved SQL queries.
 * Handles Load / Edit / Delete actions and opens the shared save/edit
 * form modal (also used by QueryPanel's Save button). Persists via the
 * DataBeacon-SavedQueries provider.
 */const libPictView=require('pict-view');const _ViewConfiguration={ViewIdentifier:'SavedQueriesList',DefaultRenderable:'DataBeacon-SavedQueriesList',DefaultDestinationAddress:'#DataBeacon-SavedQueries-Slot',AutoRender:false,CSS:/*css*/`
		.databeacon-saved-panel { padding: 0; }
		.databeacon-saved-header
		{
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 12px;
			padding: 14px 20px;
			cursor: pointer;
			user-select: none;
		}
		.databeacon-saved-header h2 { margin: 0; font-size: 16px; font-weight: 600; }
		.databeacon-saved-header-right { display: flex; align-items: center; gap: 10px; color: var(--theme-color-text-muted, #7a7a7a); font-size: 13px; }
		.databeacon-saved-body { padding: 0 20px 20px 20px; border-top: 1px solid var(--theme-color-border-default, #808080); }
		.databeacon-saved-empty { color: var(--theme-color-text-muted, #7a7a7a); padding: 16px 0; font-style: italic; }
		.databeacon-saved-row { }
		.databeacon-saved-row.is-active-query { background: color-mix(in srgb, var(--theme-color-brand-primary, #000080) 15%, transparent); }
		.databeacon-saved-name { font-weight: 600; }
		.databeacon-saved-docpreview { color: var(--theme-color-text-muted, #7a7a7a); font-size: 12px; margin-top: 2px; }
		.databeacon-saved-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
		.databeacon-saved-form-grid .full { grid-column: 1 / span 2; }
		.databeacon-saved-form-grid label { display: block; font-size: 12px; color: var(--theme-color-text-secondary, #4a4a4a); margin-bottom: 4px; }
		.databeacon-saved-form-grid input,
		.databeacon-saved-form-grid textarea,
		.databeacon-saved-form-grid select { width: 100%; }
		.databeacon-saved-form-grid textarea { min-height: 80px; resize: vertical; }
		.databeacon-saved-form-sqlpreview
		{
			background: var(--theme-color-background-input, var(--theme-color-background-panel, #ffffff));
			color: var(--theme-color-text-primary, #1a1a1a);
			border: 1px solid var(--theme-color-border-default, #808080);
			border-radius: 4px;
			padding: 8px;
			font-family: 'SFMono-Regular', Menlo, Consolas, monospace;
			font-size: 12px;
			max-height: 160px;
			overflow: auto;
			white-space: pre-wrap;
		}
	`,Templates:[{Hash:'DataBeacon-SavedQueriesList-Template',Template:/*html*/`
<div id="DataBeacon-SavedQueries-Root" class="section databeacon-saved-panel">
	<a class="databeacon-saved-header" href="#/saved-queries/toggle">
		<h2>Saved Queries ({~D:AppData.SavedQueries.Count:0~})</h2>
		<div class="databeacon-saved-header-right">
			<span>{~D:AppData.SavedQueries.ToggleLabel~}</span>
			<span data-databeacon-icon="{~D:AppData.SavedQueries.ToggleIcon~}" data-icon-size="16"></span>
		</div>
	</a>
	{~TemplateIfAbsolute:DataBeacon-SavedQueriesList-Body:AppData.SavedQueries:AppData.SavedQueries.Expanded^TRUE^x~}
</div>`},{Hash:'DataBeacon-SavedQueriesList-Body',Template:/*html*/`
<div class="databeacon-saved-body">
	{~TemplateIfAbsolute:DataBeacon-SavedQueriesList-Empty:AppData.SavedQueries:AppData.SavedQueries.IsEmpty^TRUE^x~}
	{~TemplateIfAbsolute:DataBeacon-SavedQueriesList-Table:AppData.SavedQueries:AppData.SavedQueries.IsEmpty^FALSE^x~}
</div>`},{Hash:'DataBeacon-SavedQueriesList-Empty',Template:`<p class="databeacon-saved-empty">No saved queries yet. Write a query in the editor below and click <strong>Save</strong> to add one.</p>`},{Hash:'DataBeacon-SavedQueriesList-Table',Template:/*html*/`
<table class="data-table">
	<thead><tr><th>Name</th><th>Tags</th><th>Connection</th><th>Updated</th><th>Last Run</th><th>Rows</th><th>Actions</th></tr></thead>
	<tbody>{~TS:DataBeacon-SavedQueriesList-Row:AppData.SavedQueries.List~}</tbody>
</table>`},{Hash:'DataBeacon-SavedQueriesList-Row',Template:/*html*/`
<tr class="databeacon-saved-row {~D:Record.ActiveClass~}">
	<td>
		<div class="databeacon-saved-name">{~D:Record.Name~}</div>
		<div class="databeacon-saved-docpreview">{~D:Record.DocumentationPreview~}</div>
	</td>
	<td>{~D:Record.TagsDisplay~}</td>
	<td>{~D:Record.ConnectionLabel~}</td>
	<td>{~D:Record.DateUpdatedDisplay~}</td>
	<td>{~D:Record.DateLastRunDisplay~}</td>
	<td>{~D:Record.LastRowCountDisplay~}</td>
	<td class="actions-cell">
		<a class="btn btn-small btn-primary" href="#/saved-queries/{~D:Record.GUIDSavedQuery~}/load">
			<span data-databeacon-icon="play" data-icon-size="14"></span> Load
		</a>
		<a class="btn btn-small btn-secondary" href="#/saved-queries/{~D:Record.GUIDSavedQuery~}/edit">
			<span data-databeacon-icon="info" data-icon-size="14"></span> Edit
		</a>
		<a class="btn btn-small btn-danger" href="#/saved-queries/{~D:Record.GUIDSavedQuery~}/delete">
			<span data-databeacon-icon="trash" data-icon-size="14"></span> Delete
		</a>
	</td>
</tr>`},{Hash:'DataBeacon-SavedQueryForm-Body',Template:/*html*/`
<div class="databeacon-saved-form-grid">
	<div class="full">
		<label for="databeacon-savedform-name">Name</label>
		<input type="text" id="databeacon-savedform-name" value="{~D:AppData.SavedQueryForm.Name~}" placeholder="e.g. Active users in last 30 days" />
	</div>
	<div class="full">
		<label for="databeacon-savedform-doc">Documentation</label>
		<textarea id="databeacon-savedform-doc" placeholder="What does this query do? Parameters, edge cases, notes.">{~D:AppData.SavedQueryForm.Documentation~}</textarea>
	</div>
	<div>
		<label for="databeacon-savedform-tags">Tags / Folder (comma-separated)</label>
		<input type="text" id="databeacon-savedform-tags" value="{~D:AppData.SavedQueryForm.TagsDisplay~}" placeholder="analytics, users" />
	</div>
	<div>
		<label for="databeacon-savedform-conn">Associated Connection</label>
		<select id="databeacon-savedform-conn">
			<option value="">— None —</option>
			{~TS:DataBeacon-SavedQueryForm-ConnectionOption:AppData.SavedQueryForm.ConnectionOptions~}
		</select>
	</div>
	<div class="full">
		<label>SQL</label>
		<div class="databeacon-saved-form-sqlpreview">{~D:AppData.SavedQueryForm.SQLDisplay~}</div>
	</div>
</div>`},{Hash:'DataBeacon-SavedQueryForm-ConnectionOption',Template:`<option value="{~D:Record.IDBeaconConnection~}" {~D:Record.SelectedAttr~}>{~D:Record.Label~}</option>`}],Renderables:[{RenderableHash:'DataBeacon-SavedQueriesList',TemplateHash:'DataBeacon-SavedQueriesList-Template',ContentDestinationAddress:'#DataBeacon-SavedQueries-Slot',RenderMethod:'replace'}]};class PictViewDataBeaconSavedQueriesList extends libPictView{constructor(pFable,pOptions,pServiceHash){super(pFable,pOptions,pServiceHash);}onAfterRender(pRenderable,pRenderDestinationAddress,pRecord,pContent){let tmpIcons=this.pict.providers['DataBeacon-Icons'];if(tmpIcons)tmpIcons.injectIconPlaceholders('#DataBeacon-SavedQueries-Root');this.pict.CSSMap.injectCSS();return super.onAfterRender(pRenderable,pRenderDestinationAddress,pRecord,pContent);}// ── Router-handler entry points (called by Application) ────────────────
_togglePanel(){let tmpProvider=this.pict.providers['DataBeacon-SavedQueries'];if(tmpProvider&&typeof tmpProvider.toggleExpanded==='function'){tmpProvider.toggleExpanded();}}_editQuery(pGUID){this.openEditModal(pGUID);}_deleteQuery(pGUID){this._deleteRecord(pGUID);}_loadRecord(pGUID){let tmpProvider=this.pict.providers['DataBeacon-SavedQueries'];let tmpRecord=tmpProvider?tmpProvider.get(pGUID):null;if(!tmpRecord)return;// Push SQL into editor + active-query pointer.
let tmpEditor=this.pict.views.SQLEditor;if(tmpEditor&&typeof tmpEditor.setCode==='function'){tmpEditor.setCode(tmpRecord.SQL||'');}if(!this.pict.AppData.QueryPanel)this.pict.AppData.QueryPanel={SQL:''};this.pict.AppData.QueryPanel.SQL=tmpRecord.SQL||'';tmpProvider.setActiveGUID(pGUID);// Auto-select the associated connection, if any.
if(tmpRecord.IDBeaconConnection!==null&&tmpRecord.IDBeaconConnection!==undefined){this.pict.AppData.SelectedConnectionID=tmpRecord.IDBeaconConnection;let tmpDBProvider=this.pict.providers.DataBeaconProvider;if(tmpDBProvider&&typeof tmpDBProvider.refreshIntrospectionViewData==='function'){tmpDBProvider.refreshIntrospectionViewData();}}let tmpModal=this.pict.views['Pict-Section-Modal'];if(tmpModal&&typeof tmpModal.toast==='function'){tmpModal.toast(`Loaded “${tmpRecord.Name}” into the editor.`,{type:'success'});}}_deleteRecord(pGUID){let tmpProvider=this.pict.providers['DataBeacon-SavedQueries'];let tmpRecord=tmpProvider?tmpProvider.get(pGUID):null;if(!tmpRecord)return;let tmpModal=this.pict.views['Pict-Section-Modal'];if(!tmpModal||typeof tmpModal.confirm!=='function'){tmpProvider.remove(pGUID);return;}tmpModal.confirm(`Delete saved query “${tmpRecord.Name}”?`,{title:'Delete Saved Query',confirmLabel:'Delete',cancelLabel:'Cancel',dangerous:true}).then(pConfirmed=>{if(pConfirmed)tmpProvider.remove(pGUID);});}// ================================================================
// Save / Edit form modal (shared entry — QueryPanel calls openSaveModal)
// ================================================================
/**
	 * Open the save modal. If pSQL is provided it will be used as the SQL
	 * to persist (Save case from QueryPanel). If pGUID is provided and
	 * matches a saved record, the form pre-fills from it and defaults to
	 * updating that record (unless pForceNew is true).
	 *
	 * @param {Object} pOptions
	 * @param {string} [pOptions.GUID]     - Existing GUID when updating.
	 * @param {string} [pOptions.SQL]      - Override SQL; defaults to the record's SQL (Edit) or current editor text (Save).
	 * @param {boolean} [pOptions.EditMetadataOnly] - true = Edit mode (SQL read-only, metadata only); false = Save mode (SQL becomes record's SQL).
	 */openSaveFormModal(pOptions){let tmpOptions=pOptions||{};this._openForm({Mode:tmpOptions.EditMetadataOnly?'edit':'save',GUID:tmpOptions.GUID||null,SQL:typeof tmpOptions.SQL==='string'?tmpOptions.SQL:''});}openEditModal(pGUID){let tmpProvider=this.pict.providers['DataBeacon-SavedQueries'];let tmpRecord=tmpProvider?tmpProvider.get(pGUID):null;if(!tmpRecord)return;this._openForm({Mode:'edit',GUID:pGUID,SQL:tmpRecord.SQL});}_openForm(pContext){let tmpProvider=this.pict.providers['DataBeacon-SavedQueries'];let tmpModal=this.pict.views['Pict-Section-Modal'];if(!tmpProvider||!tmpModal)return;let tmpExisting=pContext.GUID?tmpProvider.get(pContext.GUID):null;let tmpIsEdit=pContext.Mode==='edit';let tmpTitle=tmpIsEdit?'Edit Saved Query':tmpExisting?'Save Query':'Save Query';// Seed the form's AppData branch so the template can read it.
this.pict.AppData.SavedQueryForm={Mode:pContext.Mode,GUID:pContext.GUID,Name:tmpExisting&&tmpExisting.Name||'',Documentation:tmpExisting&&tmpExisting.Documentation||'',TagsDisplay:tmpExisting&&Array.isArray(tmpExisting.Tags)?tmpExisting.Tags.join(', '):'',SelectedConnectionID:tmpExisting&&tmpExisting.IDBeaconConnection!==undefined?tmpExisting.IDBeaconConnection:this.pict.AppData.SelectedConnectionID||null,SQLDisplay:pContext.SQL||tmpExisting&&tmpExisting.SQL||'',ConnectionOptions:this._buildConnectionOptions(tmpExisting&&tmpExisting.IDBeaconConnection!==undefined?tmpExisting.IDBeaconConnection:this.pict.AppData.SelectedConnectionID||null)};let tmpContent=this.pict.parseTemplateByHash('DataBeacon-SavedQueryForm-Body',null);let tmpButtons;if(tmpIsEdit){tmpButtons=[{Hash:'save',Label:'Save Changes',Style:'primary'},{Hash:'cancel',Label:'Cancel',Style:'secondary'}];}else if(tmpExisting){// Save-with-loaded-query: offer both update-in-place and save-as-new.
tmpButtons=[{Hash:'save-update',Label:'Save Changes',Style:'primary'},{Hash:'save-new',Label:'Save as New',Style:'secondary'},{Hash:'cancel',Label:'Cancel',Style:'secondary'}];}else{tmpButtons=[{Hash:'save-new',Label:'Save',Style:'primary'},{Hash:'cancel',Label:'Cancel',Style:'secondary'}];}// After the modal renders, fill icon placeholders that may be inside the form body.
let tmpIcons=this.pict.providers['DataBeacon-Icons'];tmpModal.show({title:tmpTitle,content:tmpContent,width:'620px',closeable:true,buttons:tmpButtons,onOpen:()=>{if(tmpIcons)tmpIcons.injectIconPlaceholders('body');}}).then(pButtonHash=>{if(!pButtonHash||pButtonHash==='cancel')return;this._applyFormSubmission(pButtonHash,pContext,tmpExisting);});}_applyFormSubmission(pButtonHash,pContext,pExisting){let tmpProvider=this.pict.providers['DataBeacon-SavedQueries'];if(!tmpProvider)return;let tmpName=this._readValue('#databeacon-savedform-name',pExisting&&pExisting.Name||'');let tmpDoc=this._readValue('#databeacon-savedform-doc',pExisting&&pExisting.Documentation||'');let tmpTagsRaw=this._readValue('#databeacon-savedform-tags','');let tmpConnRaw=this._readValue('#databeacon-savedform-conn','');let tmpConnID=tmpConnRaw===''||tmpConnRaw===null?null:parseInt(tmpConnRaw,10);if(isNaN(tmpConnID))tmpConnID=null;if(pButtonHash==='save-update'&&pExisting){tmpProvider.update(pExisting.GUIDSavedQuery,{Name:tmpName,Documentation:tmpDoc,Tags:tmpTagsRaw,IDBeaconConnection:tmpConnID,SQL:pContext.SQL});tmpProvider.setActiveGUID(pExisting.GUIDSavedQuery);}else if(pButtonHash==='save-new'){let tmpNew=tmpProvider.create({Name:tmpName,Documentation:tmpDoc,Tags:tmpTagsRaw,IDBeaconConnection:tmpConnID,SQL:pContext.SQL});if(tmpNew)tmpProvider.setActiveGUID(tmpNew.GUIDSavedQuery);}else if(pButtonHash==='save'&&pContext.Mode==='edit'&&pExisting){// Edit mode — metadata only, SQL is not touched.
tmpProvider.update(pExisting.GUIDSavedQuery,{Name:tmpName,Documentation:tmpDoc,Tags:tmpTagsRaw,IDBeaconConnection:tmpConnID});}}_readValue(pSelector,pFallback){let tmpList=this.pict.ContentAssignment.getElement(pSelector);if(!tmpList||tmpList.length===0)return pFallback||'';let tmpVal=tmpList[0].value;return typeof tmpVal==='string'?tmpVal:pFallback||'';}_buildConnectionOptions(pSelectedID){let tmpConns=this.pict.AppData.Connections||[];let tmpOut=[];for(let i=0;i<tmpConns.length;i++){tmpOut.push({IDBeaconConnection:tmpConns[i].IDBeaconConnection,Label:`${tmpConns[i].Name} (${tmpConns[i].Type})`,SelectedAttr:tmpConns[i].IDBeaconConnection===pSelectedID?'selected':''});}return tmpOut;}}module.exports=PictViewDataBeaconSavedQueriesList;module.exports.default_configuration=_ViewConfiguration;},{"pict-view":94}],120:[function(require,module,exports){/**
 * DataBeacon Settings Panel View
 *
 * Hidden right-side overlay panel toggled by the gear button in the
 * TopBar-User slot. Embeds pict-section-theme's Picker / ModeToggle /
 * ScaleSelect controls via `Theme-Section.mount()`, plus a Default Page
 * Size preference that the Records view honors.
 */const libPictView=require('pict-view');const _ViewConfiguration={ViewIdentifier:'DataBeacon-SettingsPanel',DefaultRenderable:'DataBeacon-SettingsPanel-Display',DefaultDestinationAddress:'#DataBeacon-Settings-Panel',AutoRender:false,CSS:/*css*/`
		.databeacon-settings-body
		{
			padding: 16px;
			color: var(--theme-color-text-primary, #1a1a1a);
			background: var(--theme-color-background-panel, var(--theme-color-background-secondary, #FAF8F4));
			height: 100%;
			box-sizing: border-box;
			overflow-y: auto;
		}
		.databeacon-settings-section
		{
			margin-bottom: 18px;
		}
		.databeacon-settings-divider
		{
			height: 1px;
			background: var(--theme-color-border-default, #DDD6CA);
			margin: 8px 0 16px 0;
		}
		.databeacon-settings-label
		{
			font-size: 11px;
			text-transform: uppercase;
			letter-spacing: 0.04em;
			color: var(--theme-color-text-muted, #8A7F72);
			margin-bottom: 8px;
			font-weight: 600;
		}
		.databeacon-settings-row
		{
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 10px;
			padding: 6px 0;
			font-size: 13px;
		}
		.databeacon-settings-row select
		{
			padding: 6px 10px;
			border-radius: 4px;
			border: 1px solid var(--theme-color-border-default, #DDD6CA);
			background: var(--theme-color-background-input, #FFFFFF);
			color:      var(--theme-color-text-primary,      #1a1a1a);
			font-size: 13px;
		}
	`,Templates:[{Hash:'DataBeacon-SettingsPanel-Template',Template:/*html*/`
<div class="databeacon-settings-body">
	<div class="databeacon-settings-section">
		<div class="databeacon-settings-label">Appearance</div>
		<div id="DataBeacon-Settings-Theme"></div>
	</div>
	<div class="databeacon-settings-divider"></div>
	<div class="databeacon-settings-section">
		<div class="databeacon-settings-label">Records</div>
		<div class="databeacon-settings-row">
			<label for="DataBeacon-Setting-PageSize">Default page size</label>
			<select id="DataBeacon-Setting-PageSize"
				onchange="_Pict.views['DataBeacon-SettingsPanel'].onPageSizeChanged(this.value)">
				<option value="25">25</option>
				<option value="50">50</option>
				<option value="100">100</option>
				<option value="250">250</option>
			</select>
		</div>
	</div>
</div>`}],Renderables:[{RenderableHash:'DataBeacon-SettingsPanel-Display',TemplateHash:'DataBeacon-SettingsPanel-Template',ContentDestinationAddress:'#DataBeacon-Settings-Panel',RenderMethod:'replace'}]};class PictViewDataBeaconSettingsPanel extends libPictView{constructor(pFable,pOptions,pServiceHash){super(pFable,pOptions,pServiceHash);}onAfterRender(pRenderable,pRenderDestinationAddress,pRecord,pContent){this.pict.CSSMap.injectCSS();// Mount the theme controls on every render — the template re-renders
// rewrite the inner DataBeacon-Settings-Theme div and erase the
// previously-rendered Picker/ModeToggle/ScaleSelect views.
let tmpThemeProvider=this.pict.providers&&this.pict.providers['Theme-Section'];if(tmpThemeProvider&&typeof tmpThemeProvider.mount==='function'){tmpThemeProvider.mount({Container:'#DataBeacon-Settings-Theme',Views:['Picker','ModeToggle','ScaleSelect']});}// Sync the page-size select to the current AppData value.
let tmpBrowser=this.pict.AppData&&this.pict.AppData.RecordBrowser||{};let tmpSize=tmpBrowser.PageSize||50;let tmpSelectList=this.pict.ContentAssignment.getElement('#DataBeacon-Setting-PageSize');if(tmpSelectList&&tmpSelectList.length>0){tmpSelectList[0].value=String(tmpSize);}return super.onAfterRender(pRenderable,pRenderDestinationAddress,pRecord,pContent);}onPageSizeChanged(pSize){let tmpSize=parseInt(pSize,10);if(!Number.isFinite(tmpSize)||tmpSize<=0){return;}if(!this.pict.AppData.RecordBrowser){this.pict.AppData.RecordBrowser={};}this.pict.AppData.RecordBrowser.PageSize=tmpSize;let tmpBrowserView=this.pict.views.RecordBrowser;if(tmpBrowserView&&typeof tmpBrowserView._setPageSize==='function'){tmpBrowserView._setPageSize(tmpSize);}}}module.exports=PictViewDataBeaconSettingsPanel;module.exports.default_configuration=_ViewConfiguration;},{"pict-view":94}],121:[function(require,module,exports){/**
 * DataBeacon Sidebar View
 *
 * Renders into the left shell panel's ContentDestinationId
 * (`#DataBeacon-Sidebar-Host`). Owns the navigation list iterated from
 * `AppData.Layout.NavItems` and highlights the active item based on
 * `AppData.CurrentView`.
 */const libPictView=require('pict-view');const _ViewConfiguration={ViewIdentifier:'DataBeacon-Sidebar',DefaultRenderable:'DataBeacon-Sidebar-Display',DefaultDestinationAddress:'#DataBeacon-Sidebar-Host',AutoRender:false,CSS:/*css*/`
		.databeacon-sidebar
		{
			height: 100%;
			display: flex;
			flex-direction: column;
			background: var(--theme-color-background-panel, var(--theme-color-background-secondary, #d8d3b8));
			color:      var(--theme-color-text-primary,    #1a1a1a);
		}
		.databeacon-sidebar-nav
		{
			padding: 10px 0;
			overflow-y: auto;
			flex: 1 1 auto;
		}
		.databeacon-sidebar .nav-item
		{
			display: flex;
			align-items: center;
			gap: 10px;
			padding: 10px 20px;
			cursor: pointer;
			color: var(--theme-color-text-secondary, #4a4a4a);
			text-decoration: none;
			font-size: 13px;
			transition: background 0.12s, color 0.12s;
		}
		.databeacon-sidebar .nav-item:hover
		{
			background: var(--theme-color-background-hover, var(--theme-color-background-tertiary, #f0ede8));
			color:      var(--theme-color-text-primary,     #1a1a1a);
		}
		.databeacon-sidebar .nav-item.active
		{
			background: var(--theme-color-brand-primary,  #2E7D74);
			color:      var(--theme-color-text-on-brand,  #ffffff);
		}
		.databeacon-sidebar .nav-icon
		{
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 20px;
			height: 20px;
		}
		.databeacon-sidebar .nav-icon svg { display: block; }
		.databeacon-sidebar .nav-label { line-height: 1; }
	`,Templates:[{Hash:'DataBeacon-Sidebar-Template',Template:/*html*/`
<div class="databeacon-sidebar">
	<nav class="databeacon-sidebar-nav">{~TS:DataBeacon-Sidebar-NavItem:AppData.Layout.NavItems~}</nav>
</div>`},{Hash:'DataBeacon-Sidebar-NavItem',Template:/*html*/`
<a class="nav-item {~D:Record.ActiveClass~}" href="#/view/{~D:Record.Slug~}" data-view-nav="{~D:Record.View~}">
	<span class="nav-icon" data-databeacon-icon="{~D:Record.Icon~}" data-icon-size="20"></span>
	<span class="nav-label">{~D:Record.Label~}</span>
</a>`}],Renderables:[{RenderableHash:'DataBeacon-Sidebar-Display',TemplateHash:'DataBeacon-Sidebar-Template',ContentDestinationAddress:'#DataBeacon-Sidebar-Host',RenderMethod:'replace'}]};class PictViewDataBeaconSidebar extends libPictView{constructor(pFable,pOptions,pServiceHash){super(pFable,pOptions,pServiceHash);}onBeforeRender(pRenderable){// Decorate the nav list with an ActiveClass driven by AppData.CurrentView
// so the template can render the highlight without per-render JS.
let tmpCurrent=this.pict.AppData.CurrentView||'Dashboard';let tmpItems=this.pict.AppData.Layout&&this.pict.AppData.Layout.NavItems||[];for(let i=0;i<tmpItems.length;i++){tmpItems[i].ActiveClass=tmpItems[i].View===tmpCurrent?'active':'';}return super.onBeforeRender(pRenderable);}onAfterRender(pRenderable,pRenderDestinationAddress,pRecord,pContent){// Fill SVG icon placeholders the host's icon provider knows how to render.
let tmpIcons=this.pict.providers['DataBeacon-Icons'];if(tmpIcons&&typeof tmpIcons.injectIconPlaceholders==='function'){tmpIcons.injectIconPlaceholders('#DataBeacon-Sidebar-Host');}this.pict.CSSMap.injectCSS();return super.onAfterRender(pRenderable,pRenderDestinationAddress,pRecord,pContent);}}module.exports=PictViewDataBeaconSidebar;module.exports.default_configuration=_ViewConfiguration;},{"pict-view":94}],122:[function(require,module,exports){/**
 * DataBeacon TopBar Nav View
 *
 * Renders into `#Theme-TopBar-Nav` — the left slot of Theme-TopBar,
 * right of the BrandMark. Shows the current section name + the beacon
 * name as context ("where am I in the app").
 */const libPictView=require('pict-view');const _ViewConfiguration={ViewIdentifier:'DataBeacon-TopBar-Nav',DefaultRenderable:'DataBeacon-TopBar-Nav-Display',DefaultDestinationAddress:'#Theme-TopBar-Nav',AutoRender:false,CSS:/*css*/`
		.databeacon-nav
		{
			display: flex;
			align-items: baseline;
			gap: 10px;
			height: 100%;
			padding: 0 12px;
			color: var(--theme-color-text-on-brand, var(--theme-color-text-primary, #E8E0D4));
			line-height: 48px;
		}
		.databeacon-nav-section
		{
			font-weight: 600;
			font-size: 14px;
		}
		.databeacon-nav-beacon
		{
			font-size: 12px;
			opacity: 0.75;
		}
	`,Templates:[{Hash:'DataBeacon-TopBar-Nav-Template',Template:/*html*/`
<div class="databeacon-nav">
	<span class="databeacon-nav-section">{~D:AppData.DataBeacon.PageTitle~}</span>
	<span class="databeacon-nav-beacon">{~D:AppData.Dashboard.BeaconNameDisplay~}</span>
</div>`}],Renderables:[{RenderableHash:'DataBeacon-TopBar-Nav-Display',TemplateHash:'DataBeacon-TopBar-Nav-Template',ContentDestinationAddress:'#Theme-TopBar-Nav',RenderMethod:'replace'}]};class PictViewDataBeaconTopBarNav extends libPictView{constructor(pFable,pOptions,pServiceHash){super(pFable,pOptions,pServiceHash);}onAfterRender(pRenderable,pRenderDestinationAddress,pRecord,pContent){this.pict.CSSMap.injectCSS();return super.onAfterRender(pRenderable,pRenderDestinationAddress,pRecord,pContent);}}module.exports=PictViewDataBeaconTopBarNav;module.exports.default_configuration=_ViewConfiguration;},{"pict-view":94}],123:[function(require,module,exports){/**
 * DataBeacon TopBar User View
 *
 * Renders into `#Theme-TopBar-User` — the right slot of Theme-TopBar.
 * Currently hosts a single gear button that toggles the Settings panel.
 * Add additional pinned actions here as the app grows.
 */const libPictView=require('pict-view');const _ViewConfiguration={ViewIdentifier:'DataBeacon-TopBar-User',DefaultRenderable:'DataBeacon-TopBar-User-Display',DefaultDestinationAddress:'#Theme-TopBar-User',AutoRender:false,CSS:/*css*/`
		.databeacon-user
		{
			display: flex;
			align-items: center;
			gap: 8px;
			height: 100%;
			padding: 0 12px;
		}
		.databeacon-user-btn
		{
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 32px;
			height: 32px;
			padding: 0;
			border-radius: 6px;
			background: transparent;
			border: 1px solid var(--theme-color-border-default, #DDD6CA);
			color: var(--theme-color-text-on-brand, var(--theme-color-text-secondary, #B8AFA4));
			cursor: pointer;
			transition: background 0.12s, color 0.12s, border-color 0.12s;
		}
		.databeacon-user-btn:hover
		{
			background: var(--theme-color-background-hover, rgba(255,255,255,0.08));
			color:      var(--theme-color-text-on-brand,    var(--theme-color-text-primary, #FFFFFF));
		}
		.databeacon-user-btn svg { display: block; width: 18px; height: 18px; }
	`,Templates:[{Hash:'DataBeacon-TopBar-User-Template',Template:/*html*/`
<div class="databeacon-user">
	<button class="databeacon-user-btn databeacon-user-btn-gear"
		onclick="_Pict.views.Layout.toggleSettingsPanel()"
		title="Settings" aria-label="Settings">
		<span data-databeacon-icon="settings" data-icon-size="18"></span>
	</button>
</div>`}],Renderables:[{RenderableHash:'DataBeacon-TopBar-User-Display',TemplateHash:'DataBeacon-TopBar-User-Template',ContentDestinationAddress:'#Theme-TopBar-User',RenderMethod:'replace'}]};class PictViewDataBeaconTopBarUser extends libPictView{constructor(pFable,pOptions,pServiceHash){super(pFable,pOptions,pServiceHash);}onAfterRender(pRenderable,pRenderDestinationAddress,pRecord,pContent){this.pict.CSSMap.injectCSS();// Resolve any data-databeacon-icon placeholders into inline SVGs.
let tmpIcons=this.pict.providers['DataBeacon-Icons'];if(tmpIcons&&typeof tmpIcons.injectIconPlaceholders==='function'){tmpIcons.injectIconPlaceholders('#Theme-TopBar-User');}return super.onAfterRender(pRenderable,pRenderDestinationAddress,pRecord,pContent);}}module.exports=PictViewDataBeaconTopBarUser;module.exports.default_configuration=_ViewConfiguration;},{"pict-view":94}]},{},[99])(99);});
//# sourceMappingURL=retold-databeacon.js.map
