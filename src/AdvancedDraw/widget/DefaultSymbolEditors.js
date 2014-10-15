define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dijit/layout/StackContainer',
    './SMSEditor',
    './SLSEditor',
    './SFSEditor',
    'dojo/i18n!../nls/resource',
    'esri/symbols/jsonUtils',
    'xstyle/css!./css/DefaultSymbolEditors.css'
], function (
    declare,
    lang,
    StackContainer,
    SMSEditor,
    SLSEditor,
    SFSEditor,
    i18n,
    symUtil
) {
    var DefaultSymbolEditors = declare(StackContainer, {
        doLayout: false,
        baseClass: 'defaultSymbolEditors',
        symbols: null,

        constructor: function (options) {

            options = options || {};
            lang.mixin(this, options);

            this.i18n = i18n;
        },

        startup: function () {
            this.inherited(arguments);
            this._createSMSEditor();
            this._createSLSEditor();
            this._createSFSEditor();
        },

        _createSMSEditor: function () {

            this.smsEditor = new SMSEditor();
            this.smsEditor.watch('symbol', lang.hitch(this, function () {

                var value = arguments[2];
                console.log('default marker symbol updated: ', value);
                if (this.symbols) {
                    console.log('updating default point sym');
                    this.symbols.point = symUtil.fromJson(value);
                }

            }));
            this.addChild(this.smsEditor);
            this.smsEditor.set('symbol', this.symbols.point.toJson());

        },

        _createSLSEditor: function () {

            this.slsEditor = new SLSEditor();
            this.slsEditor.watch('symbol', lang.hitch(this, function () {
                var value = arguments[2];
                console.log('default line symbol updated: ', value);
                if (this.symbols) {
                    console.log('updating default polyline sym');
                    this.symbols.polyline = symUtil.fromJson(value);
                }

            }));
            this.addChild(this.slsEditor);
            this.slsEditor.set('symbol', this.symbols.polyline.toJson());

        },

        _createSFSEditor: function () {

            this.sfsEditor = new SFSEditor();
            this.sfsEditor.watch('symbol', lang.hitch(this, function () {

                var value = arguments[2];
                console.log('default fill symbol updated: ', value);
                if (this.symbols) {
                    console.log('updating default polygon sym');
                    this.symbols.polygon = symUtil.fromJson(value);
                }

            }));
            this.addChild(this.sfsEditor);
            this.sfsEditor.set('symbol', this.symbols.polygon.toJson());

        },

        showSMSEditor: function () {
            this.selectChild(this.smsEditor);
        },

        showSLSEditor: function () {
            this.selectChild(this.slsEditor);
        },

        showSFSEditor: function () {
            this.selectChild(this.sfsEditor);
        }

    });

    return DefaultSymbolEditors;
});
