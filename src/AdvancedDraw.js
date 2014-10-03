define([
    // dojo base
    'dojo/_base/declare',
    'dojo/_base/lang',
    //'dojo/_base/array',

    // events
    //'dojo/topic',
    'dojo/on',

    // default config
    './AdvancedDraw/modules/_AdvancedDrawConfig',

    // widget mixins and template
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    './AdvancedDraw/modules/_AdvancedDrawInit', // initialization mixin (layers, menus, etc)
    'dojo/text!./AdvancedDraw/templates/AdvancedDraw.html',

    //i18n
    'dojo/i18n!./AdvancedDraw/nls/resource',

    // in template widgets and css
    'dijit/layout/StackContainer',
    'dijit/layout/TabContainer',
    'dijit/layout/ContentPane',
    'dijit/Toolbar',
    'dijit/ToolbarSeparator',
    'dijit/form/Button',
    'dijit/form/DropDownButton',
    'dijit/form/ComboButton',
    'xstyle/css!./AdvancedDraw/css/AdvancedDraw.css'
], function (
    declare,
    lang,
    //array,

    //topic,
    on,

    _AdvancedDrawConfig,

    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    _AdvancedDrawInit,
    template,

    bundle
) {
    // the AdvancedDraw widget
    var AdvancedDraw = declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _AdvancedDrawInit], {
        // class
        map: null,
        config: null,
        stickyLayers: true,
        stickyPosition: 'bottom',

        //undocumented or unused
        manualLayerLoad: false, // unused - enhancement - don't initLayers when true - add public method to init layers at devs discretion

        // widget
        templateString: template,
        baseClass: 'AdvancedDrawWidget',

        constructor: function () {
            // mixed into widget config param ==> this.config
            //   will always have the default config if needed
            this.defaultConfig = _AdvancedDrawConfig;

            // uncomment to inspect i18n strings
            console.log(bundle);
        },

        postCreate: function () {
            this.inherited(arguments);
        },

        ///////////////////////
        // widget operations //
        ///////////////////////
        // select a pane in the stack container
        //   simply calling or as a click evt callback will return to default pane
        _setPane: function (pane, evt) {
            this.stackNode.selectChild((evt) ? pane : this.defaultPane);
        },

        // set draw button click and label
        _setDrawButton: function (fnc, type, label) {
            this._drawButtonClickHandler.remove();
            if (type) {
                this._drawButtonClickHandler = on(this.drawButtonNode, 'click', lang.hitch(this, fnc, type, label));
            } else {
                this._drawButtonClickHandler = on(this.drawButtonNode, 'click', lang.hitch(this, fnc, label));
            }
            this.drawButtonNode.set('label', label);
        },

        /////////////////
        // the drawing //
        /////////////////
        // initiate standard geometry draw
        _draw: function (type, label) {
            this._setDrawButton('_draw', type, label);


            this._drawTb.activate(type);

        },

        // initiate text draw
        _drawText: function (label) {
            this._setDrawButton('_drawText', null, label);
        },

        // initiate extent draw (converted to polygon)
        _drawRectangle: function (label) {
            this._setDrawButton('_drawRectangle', null, label);
        }
    });

    return AdvancedDraw;
});