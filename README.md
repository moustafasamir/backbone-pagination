backbone-pagination
===================

This simple and lightweight (906 Byte minified) pagination plugin for [Backbone.js](http://www.backbone.js) allows you to extend your ```Backbone.Collection```s with pagination functionality by modifying the collection's fetch url.

These two methods are introduced:

* ```loadPage(pageNumber)```
* ```nextPage()```

A typical REST api call with backbone-pagination will look like this:

    /sales?page=3&ipp=25

Dependencies
------------

The backbone-pagination module relies on
* Backbone
* Underscore.js
* jQuery (as it uses the ```$.param()``` function)

Using the Backbone.js plugin
----------------------------

If you are not using a module loading library you will want to include the source file into your webpage:

    <script type='text/javascript' src='/js/lib/modules/backbone-pagination.js'></script>

If you are using a module loading library like [Require.js](http://www.require.js) you can simply add it to your collection's dependencies.

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

Extend your collection by calling the ```Backbone.Pagination.enable```method on your collection:

    var someCollection = Backbone.Collection.extend({
    	initialize: function(option) {
    		Backbone.Pagination.enable(this);
    	}
    });

Configuring backbone.pagination
-------------------------------

Configure the url params and items-per-page count at any time by setting the ```paginationConfig``` values:

    someCollection.paginationConfig = {
    	ipp: 25, // items per page
    	page_attr: 'page',
    	ipp_attr: 'ipp'
    	add: true
    }

If ```paginationConfig.add``` is set to ```true```, then new items will be appended to the collection. ```false``` will replace the collection's items with any new items fetched.

Providing a ```url()``` method
------------------------------

backbone.pagination overrides the Backbone.Collection.url method in order to append the pagination params. Instead of setting the ```url``` property you will have to introduce a ```baseUrl``` property.

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
        var Sales = app.module();
    
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
                Backbone.Pagination.enable(this);
            }
        });
    
        // Return the module for AMD compliance.
        return Sales;
    });

