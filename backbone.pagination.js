/* 
 * backbone.paginattion.js v0.8
 * Copyright (C) 2012 Philipp Nolte
 * backbone.paginattion.js may be freely distributed under the MIT license.
 */

(function(window) {
  "use strict";

  // Alias backbone, underscore and jQuery.
  var Backbone = window.Backbone,
      _        = window._,
      $        = window.$;

  // Define the pagination enale method under the Pagination namespace.
  Backbone.Pagination = {

    // Called when enabling pagination on a Backbone.Collection.
    enable: function(collection) {
      _.extend(collection, Backbone.Pagination.Paginator)
    }
  };

  // Define all the pagination methods available.
  Backbone.Pagination.Paginator = {

    // The current page displayed.
    currentPage: 1,

    // Pagination configuration can be overwritten anytime.
    paginationConfig: {
      ipp:       20,     // items per page
      page_attr: 'page',
      ipp_attr:  'ipp',  // will result in a query like page=4&ipp=20
      add:       true    // true will append any new data
                         // false will replace the old data
    },

    // Load the page number given.
    loadPage: function(page) {
      this.currentPage = page;
      this.fetch(this.paginationConfig.add);
    },

    // Load the next page.
    nextPage: function() {
      this.loadPage(this.currentPage +1);
    },

    // Load the previous page.
    previousPage: function() {
      this.loadPage((this.currentPage > 0) ? (this.currentPage -1) : 0);
    },

    // The url function will append the page and ipp attribute to the result
    // of an baseUrl property or function (if it exists). Note, that
    // this url function will override any previous defined url function.
    url: function() {

      // Generate the preceding base of the url.
      var base = "";
      if (typeof this.baseUrl === 'function') {
        base += this.baseUrl();
      } else if (typeof this.baseUrl !== 'undefined') {
        base += this.baseUrl;
      }

      // Add the pagination params to the url.
      var params = {};
      params[this.paginationConfig.page_attr] = this.currentPage;
      params[this.paginationConfig.ipp_attr]  = this.paginationConfig.ipp;
      return base + ((base.indexOf('?') === -1) ? '?' : '&') + $.param(params);
    }

  }

})(this);