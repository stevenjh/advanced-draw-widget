define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dijit/layout/AccordionContainer',
    './SymColorPicker',
    './LineStylePicker',
    './NumericSlider',
    './_ColorMixin',
    './_SymEditorMixin',
    'dojo/i18n!../nls/resource',
    './../advancedDrawConfig',
    'xstyle/css!./css/SymbolEditor.css'
], function (
    declare,
    lang,
    AccordionContainer,
    SymColorPicker,
    LineStylePicker,
    NumericSlider,
    _ColorMixin,
    _SymEditorMixin,
    i18n,
    advancedDrawConfig
) {

    var SLSEditor = declare([ AccordionContainer, _ColorMixin, _SymEditorMixin ], {

        i18n: i18n,
        doLayout: false,
        baseClass: 'symbolEditor',

        constructor: function (options) {

            options = options || {};

            if (!options.symbol) {
                options.symbol = advancedDrawConfig.defaultPolylineSymbol;
            }
            lang.mixin(this, options);

            this.initialized = false;

            this._set('symbol', this.symbol);

        },

        postCreate: function () {

            this.inherited(arguments);

            this._initContentPanes();
            this._initOutlineStylePicker();
            this._initOutlineColorPicker();
            this._initOutlineWidthSlider();

            this.initialized = true;

        },

        startup: function () {

            this.inherited(arguments);
            this.resize();

        },

        _initContentPanes: function () {

            this.outlinePane = this._getContentPane( i18n.widgets.slsEditor.outline );
            this.addChild(this.outlinePane);
        },

        _initOutlineStylePicker: function () {

            this.outlineStylePicker = new LineStylePicker({
                lineStyle: this.symbol.style,
                baseClass: 'symbolEditorControl'
            });

            this.outlineStylePicker.watch('lineStyle', lang.hitch(this, function () {

                this._updateSymbolAtt();

            }));

            this.outlinePane.addChild(this.outlineStylePicker);

        },

        _initOutlineColorPicker: function () {

            this.outlineColorPicker = new SymColorPicker({
                color: this.symbol.color,
                baseClass: 'symbolEditorControl'
            });

            this.outlineColorPicker.watch('color', lang.hitch(this, function () {

                this._updateSymbolAtt();

            }));

            this.outlinePane.addChild(this.outlineColorPicker);

        },

        _initOutlineWidthSlider: function () {

            this.outlineWidthSlider = new NumericSlider({
                value: this.symbol.width,
                minimum: 1,
                maximum: 10,
                baseClass: 'symbolEditorControl'
            });

            this.outlineWidthSlider.watch('value', lang.hitch(this, function () {

                this._updateSymbolAtt();

            }));

            this.outlinePane.addChild(this.outlineWidthSlider);

        },

        _updateSymbolAtt: function () {

            if (!this.initialized) {
                return;
            }

            var symbol = lang.clone(this.symbol);

            var lineStyle = this.outlineStylePicker.get('lineStyle');
            symbol.style = lineStyle;

            var lineColor = this.outlineColorPicker.get('color');
            symbol.color = lineColor;

            var lineWidth = this.outlineWidthSlider.get('value');
            symbol.width = lineWidth;

            this._set('symbol', symbol);
        },

        _getSymbolAttr: function () {

            if (this.symbol) {
                this.symbol.color = this._dojoColorToEsriColorArray(this.symbol.color);
            }

            return this.symbol;
        },

        _setSymbolAttr: function (value) {

            value.color = this._esriColorArrayToDojoColor(value.color);

            if (this.initialized) {

                this.outlineColorPicker.set('color', value.color);
                this.outlineWidthSlider.set('value', value.width);
                this.outlineStylePicker.set('lineStyle', value.style);

            }

            this.symbol = value;

        }

    });

    return SLSEditor;
});