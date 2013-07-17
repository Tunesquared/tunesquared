'use strict';

// Backbone enhancements

define(['jquery', 'backbone', 'underscore'], function ($, Backbone, _) {

    var CollectionCtr = Backbone.Collection;

    var methods = ['forEach', 'each', 'map', 'collect', 'reduce', 'foldl',
        'inject', 'reduceRight', 'foldr', 'find', 'detect', 'filter', 'select',
        'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke',
        'max', 'min', 'toArray', 'size', 'first', 'head', 'take', 'initial', 'rest',
        'tail', 'drop', 'last', 'without', 'indexOf', 'shuffle', 'lastIndexOf',
        'isEmpty', 'chain'
    ];

    var TemplateCollection = {};
    var slice = [].slice;
    _.each(methods, function (method) {
        TemplateCollection[method] = function () {
            var args = slice.call(arguments);
            args.unshift(this);
            return _[method].apply(_, args);
        };
    });

    Backbone.Collection = Backbone.Collection.extend({

        constructor: function () {
            CollectionCtr.apply(this, arguments);
        },

        toTemplate: function () {
            var base = this.map(function (model) {
                return model.toTemplate();
            });
            _.extend(base, TemplateCollection);
            return base;
        }
    });


    var ModelCtr = Backbone.Model;

    Backbone.Model = Backbone.Model.extend({
        idAttribute: '_id',

        constructor: function () {
            ModelCtr.apply(this, arguments);
        },

        toTemplate: function () {
            var base = this.toJSON();

            for (var i in this) {
                if (!(i in Backbone.Model.prototype) || i == 'get') {
                    base[i] = this[i];
                }
            }

            return base;
        }
    });



    /*  --- View override   --- */

    // Keeps a copy of original constructor
    var ViewCtr = Backbone.View;

    function setContentsValue(text) {
        /* jshint validthis: true */
        var $this = $(this);

        if ($this.is('input') || $this.is('textarea')) {
            $this.val(text);
        } else {
            $this.text(text);
        }
    }

    function bindModelProp(model, prop) {
        /* jshint validthis: true */

        // We hook the 'get' method to trace dependencies
        var deps = [];

        model.get = function (prop) {
            if (deps.indexOf(prop) == -1) {
                model.on('change:' + prop, evtHandler);
                deps.push(prop);
            }

            return Backbone.Model.prototype.get.apply(this, arguments);
        };

        var evtHandler = $.proxy(function () {
            setContentsValue.call(this, (_.isUndefined(model[prop])) ? model.get(prop) : _.result(model, prop));
        }, this);

        var removeHandlers = function () {
            for (var prop in deps) {
                model.off('change:' + prop, evtHandler);
            }
        };

        $(this).bind('remove', removeHandlers);

        evtHandler();
    }

    // Then extends it
    Backbone.View = Backbone.View.extend({
        constructor: function () {
            _.bindAll(this, 'render');
            ViewCtr.apply(this, arguments);
        },

        render: function () {

            // Renders the view's template
            if (typeof (this.template) !== 'undefined')
                this.$el.html(_.template(this.template, {
                    model: (this.model && this.model.toTemplate()) || {},
                    collection: (this.collection && this.collection.toTemplate()) || {},
                    view: this
                }));



            // Model binding

            var model = this.model;
            this.$('[model-bind]').each(function () {
                var prop = $(this).attr('model-bind');

                bindModelProp.call(this, model, prop);
            });

            // Collection binding
            var coll = this.collection;
            this.$('[collec-bind]').each(function () {
                var attr = $(this).attr('collec-bind').split('.');
                var model = coll.get(attr[0]);
                var prop = attr[1];

                bindModelProp.call(this, model, prop);
            });

            var events = this.events || {};
            this.$('[data-event]').each(function () {

                var attr = $(this).attr('data-event');
                var evts = attr.split(',');

                for (var i in evts) {
                    // e[0] is event type and e[1] is handler
                    var e = evts[i].split(' ');

                    events[e[0] + ' [data-event="' + attr + '"]'] = e[1];
                }
            });

            this.delegateEvents(events);

            // TODO : clean this mess
            this.$ref = (function(){
                var refs = {};
                function escape(str){
                    return str.replace(/\\/g, '\\\\').replace(/"/g, '\"');
                }

                return function(val){
                    return refs[val] || (refs[val] = this.$('[ref="'+escape(val)+'"]'));
                };
            })();

            if (typeof this.postRender === 'function')
                this.postRender();

            return this;
        }
    });

    return Backbone;
});
