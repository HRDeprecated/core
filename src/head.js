/**
 * @module hr/head
 */
define([
    "hr/dom",
    "hr/utils",
    "hr/view"
], function($, _, View) {
    /**
     * Represent an interface for the head element of the dom.
     * Makes it easy to manage links, meta, title, ...
     *
     * @class Head
     * @extends View
     * @constructor
     */
    var Head = View.extend({
        /**
         * The main element for this head interface.
         *
         * @attribute el
         * @type {jQueryElement}
         * @default $("head")
         */
        el: $("head"),

        initialize: function() {
            Head.__super__.initialize.apply(this, arguments);

            this._title = "";
            this._preTitle = "";
            this.app = this.options.app;

            return this;
        },

        /**
         * Transform a page name in complete title
         * 
         * @method completeTitle
         * @param {string} title title of the page
         * @return {string} complete name with application name
         */
        completeTitle: function(title) {
            if (this._preTitle.length > 0) title = this._preTitle + " " + title;
            if (_.size(title) == 0) return this.app.name;
            return title + " - " + this.app.name;
        },

        /**
         * Set or get a meta tag value
         * 
         * @method meta
         * @param {string} name name of the meta tag
         * @param {string} [value] value to set on the meta tag
         * @param {string} [metaName="name"] selector for the meta name
         * @return {string} value of the meta tag
         */
        meta: function(name, value, metaName) {
            if (_.isObject(name)) {
                _.each(name, function(value, name) {
                    this.meta(name, value);
                }, this);
                return;
            }

            if (metaName == null) metaName = "name";
            var mt = this.$('meta['+metaName+'="'+name+'"]');
            if (mt.length === 0) {
                mt =  $("<meta>", {}).attr(metaName, name).appendTo('head');
            }
            if (value != null) {
                mt.attr('content', value);
                return this;
            } else {
                return mt.attr('content');
            }
        },

        /**
         * Set or get a link tag value
         * 
         * @method link
         * @param {string} ref name of the link tag
         * @param {string} [href] value to set on the link tag
         * @param {string} [mimetype] mimetype for this link
         * @return {string} value of the link tag
         */
        link: function(rel, href, mimetype) {
            if (_.isObject(rel)) {
                _.each(rel, function(value, name) {
                    this.link(name, value);
                }, this);
                return;
            }

            var mt =  this.$('link[rel="'+rel+'"]');
            if (mt.length === 0) {
                mt =  $("<link>", {}).attr("rel", rel).appendTo(this.$el);
            }
            if (mimetype != null) mt.attr("type", mimetype);
            if (href != null) {
                mt.attr('href', href);
            } else {
                return mt.attr('href');
            }
        },

        /**
         * Set or get the page title
         * 
         * @method title
         * @param {string} value value for the title
         * @param {boolean} [absolute] if true, it'll not use completeTitle
         * @return {string} value of the title
         */
        title: function(value, absolute) {
            var mt =  this.$('title');
            if (mt.length === 0) {
                mt =  $("<title>", {}).appendTo(this.$el);
            }
            if (value != null) {
                this._title = value;
                if (absolute !== false) value = this.completeTitle(value);
                mt.text(value);
            } else {
                return mt.attr('content');
            }
        },

        /**
         * Set the pre-title, could be use for signaling notification.
         * @example
         *      head.pretitle("(1)"); // One notification
         * 
         * @method preTitle
         * @param {string} value value for the pre-title
         */
        preTitle: function(value) {
            if (value == null) return this._preTitle;
            this._preTitle = value;
            this.title(this._title);
        },

        /**
         * Set or get description
         * 
         * @method description
         * @param {string} value value for the description
         * @return {string} return current description
         */
        description: function(value) {
            return this.meta("description", value);
        },     

        /**
         * Active or desactive page indexation using robots meta tag
         * 
         * @method setCrawling
         * @param {boolean} index
         * @return {boolean} follow
         */
        setCrawling: function(index, follow) {
            if (_.isNull(follow)) follow = index;
            var value = "";
            value = index ? "index" : "noindex";
            value =  value + "," + (follow ? "follow" : "nofollow");
            this.meta("robots", value);
            return this;
        },

        render: function() {
            return this.ready();
        }
    });

    return Head;
});