backbone-pagination V0.9
========================

This simple and lightweight (<1kb minified) pagination plugin for [Backbone.js](http://backbone.js) allows you to extend your ```Backbone.Collection```s with pagination functionality by modifying the collection's fetch url.

These three methods are introduced:

* ```loadPage(pageNumber)```
* ```nextPage()```
* ```previousPage()```

A typical REST api call with backbone-pagination will look like this:

    /sales?page=3&ipp=25

or with ```pretty``` set to ```true```:

    /sales/page/3/ipp/25

Dependencies
------------

The backbone-pagination plugin relies on
* Backbone (tested with Backbone.js v0.9.2, but should work with most other versions)
* Underscore.js
* jQuery (as it uses the ```$.param()``` function)

Using the Backbone.js plugin
----------------------------

If you are not using a module loading library you will want to include the source file into your webpage:

    <script type='text/javascript' src='/js/lib/modules/backbone-pagination.js'></script>

If you are using a module loading library like [Require.js](http://require.js) you can simply add it to your collection's dependencies.

    define(['app', 'plugins/backbone.pagination'], function(app) {
        // Your module code.
    });

You probably want to make sure that the shim configuration is set correctly.

    require.config({
		// Your path configuration goes here
  		shim: {
    	    backbone: {
                deps: ['underscore', 'jquery'],
                exports: 'Backbone'
            },
            // Backbone.Pagination depends on Backbone.
            'plugins/backbone.pagination' : ['backbone']
        }
    });  

Extending your collection
-------------------------

Extend your collection by calling the ```Backbone.Pagination.enable```method:

    var someCollection = Backbone.Collection.extend({
    	initialize: function(option) {
    		Backbone.Pagination.enable(this);
    	}
    });

The ```enable(collection, config)``` method takes an optional config parameter, that can be used to configure the paginator.

Configuring backbone.pagination
-------------------------------

Configure the url params and items-per-page count at any time by setting the ```paginationConfig``` values:

	// default configuration
    someCollection.paginationConfig = {
        pretty:       false,  // use pretty url params instead of query params
    	ipp:          25,     // items per page
    	page_attr:    'page', // the query's page attribute
    	ipp_attr:     'ipp',  // the query's ipp attribute
    	fetchOptions: {}      // any options passed to the fetch() method
    }

If the ```pretty``` attribute is set to ```true``` the resulting api call will result in ```/baseUrl/page/3/ipp/25``` instead of ```/baseUrl?page=3&ipp=25```.

The ```fetchOptions``` attribute holds options, that will be passed to the ```Backbone.Collection.fetch()``` method. For example, if ```paginationConfig.fetchOptions.add``` is set to ```true```, then new items will be appended to the collection. ```false``` will replace the collection's items with any new items fetched. You can also define ```success``` and ```error``` callbacks. See the [Backbone.Collection.fetch() method's documentation](http://backbonejs.org/#Collection-fetch).

Providing a ```url()``` method
------------------------------

backbone.pagination overrides the Backbone.Collection.url method in order to append the pagination params. Instead of setting the ```url``` property you will have to introduce a ```baseUrl``` property.

API
---

After enabling pagination on your collection, the following methods and attributes become available:

* ```currentPage``` holds the last fetched page number. Do not modify this attribute. Instead call one of the following ```xxxPage()``` methods:
* ```loadPage(pageNumber)``` will fetch the page number specified
* ```nextPage()``` will fetch the next page
* ```previousPage()``` will fetch the previous page – or fetch the first page if a call to this method would result in a negative or zero page number
* ```url()``` pagination url method will produce a custom pagination url like ```/baseUrl?page=3&ipp=25``` or ```/baseUrl/page/3/ipp/25``` with ```pretty``` set to ```true```
* ```baseUrl``` or ```baseUrl()``` you should specify either a ```baseUrl``` attribute or method that returns the collection's base url.
* ```paginationConfig``` see [Configuring backbone.pagination](#configuring-backbonepagination)

Example
-------

This example uses require.js to define a module providing a sales collection of sale models.

    define([
        // Application.
        'app',

        // Backbone.
        'backbone',

        // Plugins.
        'plugins/backbone.pagination',
    ],

    // Map dependencies from above array.
    function(app, Backbone) {
    
        // Create a new module.
        var Sales = {};
    
        // The basic **sales** model.
        Sales.Model = Backbone.Model.extend({
    
            // Sync with this api url.
            url: 'sales/sale/id'
        });
    
        // Default collection.
        Sales.List = Backbone.Collection.extend({
    
            // Use this model class for collection items.
            model: Sales.Model,
    
            // Sync with this api url.  This method is called baseUrl because,
            // the Backbone.Collection.url method will be overwritten by the
            // pagination module.
            baseUrl: function() {
                return app.api + 'sales/list/city/' + this.city;
            },
    
            initialize: function(options) {
                // Enable pagination.
                Backbone.Pagination.enable(this, {
                    ipp: 10,
                    fetchOptions: {
                        add: true  // instead of replacing the collection's model items, append new items
                    }
                });
            }
        });
    
        // Return the module for AMD compliance.
        return Sales;
    });

