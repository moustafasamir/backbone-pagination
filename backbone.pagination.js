/* 
 * backbone.pagination.js v0.9
 * Copyright (C) 2012 Philipp Nolte
 * backbone.pagination.js may be freely distributed under the MIT license.
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
    enable: function(collection, config) {
      _.extend(collection, Backbone.Pagination.Paginator)
      if (config) {
        _.extend(collection.paginationConfig, config);
      }
    }
  };

  // Define all the pagination methods available.
  Backbone.Pagination.Paginator = {

    // The current page displayed -- defaults to page 1.
    currentPage: 0,

    // Pagination configuration can be overwritten anytime.
    paginationConfig: {
      pretty:       false,  // enable pretty urls url/page/2/ipp/20
      ipp:          20,     // items per page
      page_attr:    'page',
      ipp_attr:     'ipp',  // will result in a query like page=4&ipp=20
      fetchOptions: {}      // any options handed over to the fetch method
    },

    _getFetchOptions:function(){
      var paginationOptions = {data:{}}
      paginationOptions["data"][this.paginationConfig.page_attr] = this.currentPage;
      paginationOptions["data"][this.paginationConfig.ipp_attr] = this.paginationConfig.ipp;
      return $.extend(paginationOptions, this.paginationConfig.fetchOptions)
    },
    // Load the page number given.
    loadPage: function(page, customOptions) {
      this.currentPage = (page > 0) ? page : 1;
      this.fetch($.extend(this._getFetchOptions(), customOptions));
    },

    // Load the next page.
    nextPage: function(customOptions) {
      if (customOptions == null) {
        customOptions = {};
      }
      this.loadPage(this.currentPage +1, customOptions);
    },

    // Load the previous page.
    previousPage: function(customOptions) {
      if (customOptions == null) {
        customOptions = {};
      }
      this.loadPage(this.currentPage -1, customOptions);
    },
    resetPagination: function(){
      this.currentPage = 0;
    }

  }

  // Provide a PaginatedCollection constructor that extends Backbone.Collection.
  Backbone.PaginatedCollection = Backbone.Collection.extend(Backbone.Pagination.Paginator);

})(this);

