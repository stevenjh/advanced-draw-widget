define([
    // dojo base
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',

    // events
    'dojo/topic',
    'dojo/on',

    // dom
    'dojo/dom',
    'dojo/dom-attr',
    'dojo/dom-class',
    'dojo/html',

    // widget mixins and template
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    './AdvancedDraw/_AdvancedDrawMixin', // menus and such
    'dojo/text!./AdvancedDraw/templates/AdvancedDraw.html',

    // layer and graphic
    'esri/layers/FeatureLayer',
    'esri/graphic',

    // menu
    'dijit/popup',
    'dijit/Menu',
    'dijit/MenuItem',
    'dijit/PopupMenuItem',
    'dijit/MenuSeparator',

    // in template widgets and css
    'dijit/layout/StackContainer',
    'dijit/layout/ContentPane',
    'dijit/Toolbar',
    'dijit/ToolbarSeparator',
    'dijit/form/Button',
    'dijit/form/DropDownButton',
    'dijit/form/ComboButton',
    'xstyle/css!./AdvancedDraw/AdvancedDraw.css'
], function (
    declare,
    lang,
    array,

    topic,
    on,

    dom,
    domAttr,
    domClass,
    html,

    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    _AdvancedDrawMixin,
    template,

    FeatureLayer,
    Graphic,

    popup,
    Menu,
    MenuItem,
    PopupMenuItem,
    MenuSeparator
) {
    
    var AdvancedDraw = declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _AdvancedDrawMixin], {
        map: null,
        templateString: template,
        baseClass: 'AdvancedDrawWidget',

        constructor: function (params) {
            params = params || {};
        },

        postCreate: function () {
            this.inherited(arguments);

            // stack containers in templated widgets must be started - bug?
            this.stackNode.startup();

            // options menu
            this._initOptionsMenu();
        },

        _draw: function () {

        }
    });

    return AdvancedDraw;
});