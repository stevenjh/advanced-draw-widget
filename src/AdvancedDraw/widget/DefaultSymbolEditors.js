define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dijit/layout/StackContainer',
    './SMSEditor',
    './SLSEditor',
    './SFSEditor',
    './_ADWNotificationsMixin',
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
    _ADWNotificationsMixin,
    i18n,
    symUtil
) {
    var DefaultSymbolEditors = declare( [ StackContainer, _ADWNotificationsMixin ], {
        doLayout: false,
        baseClass: 'defaultSymbolEditors',
        symbols: null,
        colorPickerOptions: {
            type: 'simple',
            simple: {
                paletteSize  : '7x10'
            },
            closeOnChange: true
        },

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

            this.smsEditor = new SMSEditor( {
                colorPickerOptions: this.colorPickerOptions
            });

            this.smsEditor.watch('symbol', lang.hitch(this, function () {

                var value = arguments[2];
                this._updateSymbol( 'point', value );

            }));

            this.addChild(this.smsEditor);
            this.smsEditor.set('symbol', this.symbols.point.toJson());

        },

        _createSLSEditor: function () {

            this.slsEditor = new SLSEditor( {
                colorPickerOptions: this.colorPickerOptions
            });

            this.slsEditor.watch('symbol', lang.hitch(this, function () {

                var value = arguments[2];
                this._updateSymbol( 'polyline', value );

            }));

            this.addChild(this.slsEditor);
            this.slsEditor.set('symbol', this.symbols.polyline.toJson());

        },

        _createSFSEditor: function () {

            this.sfsEditor = new SFSEditor( {
                colorPickerOptions: this.colorPickerOptions
            });

            this.sfsEditor.watch('symbol', lang.hitch(this, function () {

                var value = arguments[2];
                this._updateSymbol( 'polygon', value );

            }));

            this.addChild(this.sfsEditor);
            this.sfsEditor.set('symbol', this.symbols.polygon.toJson());

        },

        _updateSymbol: function ( type, value ) {

            var oldSymbol = {};
            var newSymbol = value;
            if ( this.symbols ) {
                oldSymbol = this.symbols[ type].toJson();
                this.symbols[ type ] = symUtil.fromJson( value );
            }

            this.sendDefaultSymbolUpdatedNotification( oldSymbol, newSymbol );

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
