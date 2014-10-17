define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/dom-construct',
    'dojo/dom-style',
    './_SymEditorBase',
    './SymColorPicker',
    './LineStylePicker',
    './MarkerStylePicker',
    './NumericSlider',
    './_ColorMixin',
    './_SymEditorMixin',
    'dojo/i18n!../nls/resource',
    './../advancedDrawConfig',
    'xstyle/css!./css/SymbolEditor.css'
], function (
    declare,
    lang,
    domConstruct,
    domStyle,
    _SymEditorBase,
    SymColorPicker,
    LineStylePicker,
    MarkerStylePicker,
    NumericSlider,
    _ColorMixin,
    _SymEditorMixin,
    i18n,
    advancedDrawConfig
) {

    var SMSEditor = declare( [ _SymEditorBase, _ColorMixin, _SymEditorMixin ], {

        i18n: i18n,
        doLayout: false,

        constructor: function (options) {

            options = options || {};

            if (!options.symbol) {
                options.symbol = advancedDrawConfig.defaultPointSymbol;
            }
            lang.mixin(this, options);

            this.initialized = false;

            this._set('symbol', this.symbol);

        },

        postCreate: function () {

            this.inherited(arguments);

            this._initSymbolStylePicker();
            this._initSymbolColorPicker();
            this._initSymbolSizeSlider();

            this._initOutlineStylePicker();
            this._initOutlineColorPicker();
            this._initOutlineWidthSlider();

            this.initialized = true;

        },

        _initSymbolStylePicker: function () {

            var div = domConstruct.create( 'div', {}, this.leftHandControls, 'last' );

            this.symbolStylePicker = new MarkerStylePicker({
                markerStyle: this.symbol.style,
                baseClass: 'symbolEditorControl',
                label: 'Style'
            }, div );

            this.symbolStylePicker.watch('markerStyle', lang.hitch(this, function () {

                this._updateSymbolAtt();

                if ( arguments[ 2 ] !== 'esriSMSCircle' ) {
                    domStyle.set( this.symbolColorPicker.domNode, 'display', 'none' );
                } else {
                    domStyle.set( this.symbolColorPicker.domNode, 'display', 'block' );
                }

            }));

            this.symbolStylePicker.startup();

        },

        _initSymbolColorPicker: function () {

            var div = domConstruct.create( 'div', {}, this.leftHandControls, 'last' );

            this.symbolColorPicker = new SymColorPicker({
                color: this.symbol.color,
                baseClass: 'symbolEditorControl',
                buttonLabel: 'Color',
                sliderLabel: 'Transparency'
            }, div );

            this.symbolColorPicker.watch('color', lang.hitch(this, function () {

                this._updateSymbolAtt();

            }));

            this.symbolColorPicker.startup();

        },

        _initSymbolSizeSlider: function () {

            var div = domConstruct.create( 'div', {}, this.leftHandControls, 'last' );

            this.symbolSizeSlider = new NumericSlider({
                value: this.symbol.size,
                minimum: 1,
                maximum: 100,
                label: 'Size:',
                baseClass: 'symbolEditorControl'
            }, div );

            this.symbolSizeSlider.watch('value', lang.hitch(this, function () {

                this._updateSymbolAtt();

            }));

            this.symbolSizeSlider.startup();

        },

        _initOutlineStylePicker: function () {

            var div = domConstruct.create( 'div', {}, this.rightHandControls, 'last' );

            this.outlineStylePicker = new LineStylePicker({
                lineStyle: this.symbol.outline.style,
                baseClass: 'symbolEditorControl',
                label: 'Style'
            }, div );

            this.outlineStylePicker.watch('lineStyle', lang.hitch(this, function () {

                this._updateSymbolAtt();

            }));

            this.outlineStylePicker.startup();

        },

        _initOutlineColorPicker: function () {

            var div = domConstruct.create( 'div', {}, this.rightHandControls, 'last' );
            this.outlineColorPicker = new SymColorPicker({
                color: this.symbol.outline.color,
                baseClass: 'symbolEditorControl',
                buttonLabel: 'Color',
                sliderLabel: 'Transparency'
            }, div );

            this.outlineColorPicker.watch('color', lang.hitch(this, function () {

                this._updateSymbolAtt();

            }));

            this.outlineColorPicker.startup();

        },

        _initOutlineWidthSlider: function () {

            var div = domConstruct.create( 'div', {}, this.rightHandControls, 'last' );

            this.outlineWidthSlider = new NumericSlider({
                value: this.symbol.outline.width,
                minimum: 1,
                maximum: 10,
                baseClass: 'symbolEditorControl'
            }, div );

            this.outlineWidthSlider.watch('value', lang.hitch(this, function () {

                this._updateSymbolAtt();

            }));

            this.outlineWidthSlider.startup();

        },

        _updateSymbolAtt: function () {

            if (!this.initialized) {
                return;
            }

            var symbol = lang.clone(this.symbol);

            var symStyle = this.symbolStylePicker.get('markerStyle');
            symbol.style = symStyle;

            var symColor = this.symbolColorPicker.get('color');
            symbol.color = symColor;

            var symSize = this.symbolSizeSlider.get('value');
            symbol.size = symSize;

            var outlineStyle = this.outlineStylePicker.get('lineStyle');
            symbol.outline.style = outlineStyle;

            var outlineColor = this.outlineColorPicker.get('color');
            symbol.outline.color = outlineColor;

            var outlineWidth = this.outlineWidthSlider.get('value');
            symbol.outline.width = outlineWidth;

            this._set('symbol', symbol);
        },

        _getSymbolAttr: function () {

            if (this.symbol) {
                this.symbol.color = this._dojoColorToEsriColorArray(this.symbol.color);
                this.symbol.outline.color = this._dojoColorToEsriColorArray(this.symbol.outline.color);
            }

            return this.symbol;
        },

        _setSymbolAttr: function (value) {

            value.color = this._esriColorArrayToDojoColor(value.color);
            value.outline.color = this._esriColorArrayToDojoColor(value.outline.color);

            if (this.initialized) {

                this.symbolColorPicker.set('color', value.color);
                this.symbolSizeSlider.set('value', this.symbol.size);
                this.symbolStylePicker.set('markerStyle', this.symbol.style);
                this.outlineColorPicker.set('color', value.outline.color);
                this.outlineWidthSlider.set('value', this.symbol.outline.width);
                this.outlineStylePicker.set('lineStyle', this.symbol.outline.style);

            }

            this.symbol = value;

        }

    });

    return SMSEditor;
});