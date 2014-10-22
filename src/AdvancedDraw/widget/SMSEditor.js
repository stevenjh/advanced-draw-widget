define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/dom-style',
    './_SymEditorBase',
    './SymColorPicker',
    './StylePicker',
    './NumericSlider'
], function (
    declare,
    lang,
    domStyle,
    _SymEditorBase,
    SymColorPicker,
    StylePicker,
    NumericSlider
) {

    var SMSEditor = declare( _SymEditorBase, {

        constructor: function (options) {

            options = options || {};

            if (!options.symbol) {
                options.symbol = this.advancedDrawConfig.defaultPointSymbol;
            }
            lang.mixin(this, options);

            this.initialized = false;
            this.editorLabel = this.i18n.widgets.smsEditor.defaultEditorLabel;
            this.leftHandControlsLabel = this.i18n.widgets.smsEditor.leftHandControlsLabel;
            this.rightHandControlsLabel = this.i18n.widgets.smsEditor.rightHandControlsLabel;

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

            this.symbolStylePicker = new StylePicker({
                style: this.symbol.style,
                baseClass: 'symbolEditorControl',
                label: this.i18n.widgets.symbolStylePicker.label,
                styleSet: 'marker'
            }, this.createLeftHandControlsDiv() );

            this.symbolStylePicker.watch('style', lang.hitch(this, function () {

                this._updateSymbolAtt();

                if ( !this._symbolStyleHasFill( arguments[ 2 ] ) ) {
                    this._toggleSymbolColorControl( false );
                } else {
                    this._toggleSymbolColorControl( true );
                }

            }));

            this.symbolStylePicker.startup();

        },

        _toggleSymbolColorControl: function ( show ) {

            var display = show ? 'block' : 'none';
            domStyle.set( this.symbolColorPicker.domNode, 'display', display );

        },

        _symbolStyleHasFill: function ( style ) {

            if ( style === 'esriSMSCross' || style === 'esriSMSX' ) {
                return false;
            }
            return true;
        },

        _initSymbolColorPicker: function () {

            this.symbolColorPicker = new SymColorPicker({
                color: this.symbol.color,
                baseClass: 'symbolEditorControl',
                buttonLabel: this.i18n.widgets.symbolColorPicker.buttonLabel,
                sliderLabel: this.i18n.widgets.symbolColorPicker.sliderLabel,
                colorPickerOptions: {
                    type: 'simple',
                    simple: {
                        paletteSize  : '3x4'
                    },
                    closeOnChange: true
                }
            }, this.createLeftHandControlsDiv() );

            this.symbolColorPicker.watch('color', lang.hitch(this, function () {

                this._updateSymbolAtt();

            }));

            this.symbolColorPicker.startup();

        },

        _initSymbolSizeSlider: function () {

            this.symbolSizeSlider = new NumericSlider({
                value: this.symbol.size,
                minimum: 1,
                maximum: 100,
                label: this.i18n.widgets.symbolSizePicker.label,
                baseClass: 'symbolEditorControl'
            }, this.createLeftHandControlsDiv() );

            this.symbolSizeSlider.watch('value', lang.hitch(this, function () {

                this._updateSymbolAtt();

            }));

            this.symbolSizeSlider.startup();

        },

        _initOutlineStylePicker: function () {

            this.outlineStylePicker = new StylePicker({
                lineStyle: this.symbol.outline.style,
                baseClass: 'symbolEditorControl',
                label: this.i18n.widgets.symbolStylePicker.label,
                styleSet: 'line'
            }, this.createRightHandControlsDiv() );

            this.outlineStylePicker.watch('style', lang.hitch(this, function () {

                this._updateSymbolAtt();

                if ( arguments[ 2 ] === 'esriSLSNull' ) {
                    this._toggleOutlineControlsDisplay( false );
                } else {
                    this._toggleOutlineControlsDisplay( true );
                }

            }));

            this.outlineStylePicker.startup();

        },

        _toggleOutlineControlsDisplay: function ( show ) {

            var display = show ? 'block' : 'none';

            domStyle.set ( this.outlineColorPicker.domNode, 'display', display );
            domStyle.set ( this.outlineWidthSlider.domNode, 'display', display );

        },

        _initOutlineColorPicker: function () {

            this.outlineColorPicker = new SymColorPicker({
                color: this.symbol.outline.color,
                baseClass: 'symbolEditorControl',
                buttonLabel: this.i18n.widgets.symbolColorPicker.buttonLabel,
                sliderLabel: this.i18n.widgets.symbolColorPicker.sliderLabel
            }, this.createRightHandControlsDiv() );

            this.outlineColorPicker.watch('color', lang.hitch(this, function () {

                this._updateSymbolAtt();

            }));

            this.outlineColorPicker.startup();

        },

        _initOutlineWidthSlider: function () {

            this.outlineWidthSlider = new NumericSlider({
                value: this.symbol.outline.width,
                minimum: 1,
                maximum: 10,
                baseClass: 'symbolEditorControl',
                label: this.i18n.widgets.symbolWidthPicker.label
            }, this.createRightHandControlsDiv() );

            this.outlineWidthSlider.watch('value', lang.hitch(this, function () {

                this._updateSymbolAtt();

            }));

            this.outlineWidthSlider.startup();

        },

        _updateSymbolAtt: function () {

            if (!this.initialized) {
                return;
            }

            var symbol = this._getSymbol();
            this._set('symbol', symbol);

        },

        _getSymbol: function () {

            var symbol = lang.clone(this.symbol);

            var symStyle = this.symbolStylePicker.get('style');
            symbol.style = symStyle;

            var symColor = this.symbolColorPicker.get('color');
            symbol.color = symColor;

            var symSize = this.symbolSizeSlider.get('value');
            symbol.size = symSize;

            var outlineStyle = this.outlineStylePicker.get('style');
            symbol.outline.style = outlineStyle;

            var outlineColor = this.outlineColorPicker.get('color');
            symbol.outline.color = outlineColor;

            var outlineWidth = this.outlineWidthSlider.get('value');
            symbol.outline.width = outlineWidth;

            return symbol;

        },

        _getSymbolAttr: function () {

            return this._getSymbol();

        },

        _setSymbolAttr: function (value) {

            if (this.initialized) {

                this.symbolColorPicker.set('color', value.color);
                this.symbolSizeSlider.set('value', value.size);
                this.symbolStylePicker.set('style', value.style);
                this.outlineColorPicker.set('color', value.outline.color);
                this.outlineWidthSlider.set('value', value.outline.width);
                this.outlineStylePicker.set('style', value.outline.style);

            }

            this.symbol = value;

        }

    });

    return SMSEditor;
});