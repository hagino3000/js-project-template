/*
 * Sample project source
 *
 */
(function(namespace) {
'use strict';

var gb = namespace.gb = {};

(function() {

  gb.context = {
    ticketNum: 0,
    coinNum: 0
  };

  gb.sampleFunction = function() {
  };

  gb.exchangeCoin2Ticket = function() {
    return 100;
  };

  function internalMethod() {
    return 'I am invisible from other source';
  }

})();


(function() {


  gb.sampleFunction2 = function() {
  };

  function internalMethod() {
    return 'I am invisible from other source';
  }

})();



/**
 * Resource bundles for Japanese
 */
gb.Bundle['ja_JP'] = {

  'gb.common': {
    LABEL_ERROR: '\u30a8\u30e9\u30fc',
    LABEL_BACK: '\u623b\u308b',
    LABEL_OK: 'OK',
    LABEL_CANCEL: '\u30ad\u30e3\u30f3\u30bb\u30eb',
    LABEL_CLOSE: '\u9589\u3058\u308b',
    LABEL_NOTICE: '\u304a\u77e5\u3089\u305b',
    LABEL_CONFIRM: '\u78ba\u8a8d',
    MSG_CONNECTING: '\u63a5\u7d9a\u3057\u3066\u3044\u307e\u3059',
    MSG_UNKNOWN_ERROR: '\u30a8\u30e9\u30fc\u304c\u767a\u751f\u3057\u307e\u3057\u305f\u3002',
    MSG_AUTHENTICATION_ERROR: '\u30a8\u30e9\u30fc\u304c\u767a\u751f\u3057\u307e\u3057\u305f\u3002',
    MSG_SERVER_VALIDATION_ERROR: '\u30a8\u30e9\u30fc\u304c\u767a\u751f\u3057\u307e\u3057\u305f\u3002',
    MSG_NETWORK_OFFLINE: '\u30cd\u30c3\u30c8\u30ef\u30fc\u30af\u306b\u63a5\u7d9a\u3057\u3066\u3044\u306a\u3044\u305f\u3081\u3001\u51e6\u7406\u304c\u7d9a\u884c\u3067\u304d\u307e\u305b\u3093\u3067\u3057\u305f\u3002',
    MSG_SERVER_ERROR: '\u30b5\u30fc\u30d0\u30fc\u3067\u30a8\u30e9\u30fc\u304c\u767a\u751f\u3057\u307e\u3057\u305f\u3002',
    MSG_CANNOT_REACH_SERVER: '\u30b5\u30fc\u30d0\u30fc\u306b\u63a5\u7d9a\u3067\u304d\u307e\u305b\u3093\u3067\u3057\u305f\u3002'
  },

  'gb.controllers.Aplication': {
    MSG_PLEASE_UPDATE: '\u30a2\u30c3\u30d7\u30c7\u30fc\u30c8\u3057\u3066----------(^-^)'
  }
};



/**
 * Resource bundles for Japanese
 */
gb.Bundle['ja_JP'] = {

  'gb.common': {
    LABEL_ERROR: 'Error',
    LABEL_BACK: 'Back',
    LABEL_OK: 'OK',
    LABEL_CANCEL: 'Cancel',
    LABEL_CLOSE: 'Close',
    LABEL_NOTICE: 'Notice',
    LABEL_CONFIRM: 'Are you sure?',
    MSG_CONNECTING: 'Connecting...',
    MSG_UNKNOWN_ERROR: 'Error.',
    MSG_AUTHENTICATION_ERROR: 'Error.',
    MSG_SERVER_VALIDATION_ERROR: 'Error.',
    MSG_NETWORK_OFFLINE: 'Network offline.',
    MSG_SERVER_ERROR: 'Server Error',
    MSG_CANNOT_REACH_SERVER: 'Cannot connect server.'
  },

  'gb.controllers.Aplication': {
    MSG_PLEASE_UPDATE: 'Please update me!!'
  }
};



})(this);

