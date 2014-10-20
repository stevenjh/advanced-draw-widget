define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    './_SymEditorBase',
    './SymColorPicker',
    './LineStylePicker',
    './NumericSlider'
], function (
    declare,
    lang,
    _SymEditorBase,
    SymColorPicker,
    LineStylePicker,
    NumericSlider
) {

    var SLSEditor = declare( _SymEditorBase, {

        constructor: function (options) {

            options = options || {};

            if (!options.symbol) {
                options.symbol = this.advancedDrawConfig.defaultPolylineSymbol;
            }
            lang.mixin(this, options);

            this.initialized = false;
            this.editorLabel = this.i18n.widgets.slsEditor.defaultEditorLabel;
            this.leftHandControlsLabel = this.i18n.widgets.slsEditor.leftHandControlsLabel;

            this._set('symbol', this.symbol);

        },

        postCreate: function () {

            this.inherited(arguments);

            this._initOutlineStylePicker();
            this._initOutlineColorPicker();
            this._initOutlineWidthSlider();

            this.removeRightHandControls();

            this.initialized = true;

        },

        _initOutlineStylePicker: function () {

            this.outlineStylePicker = new LineStylePicker({
                lineStyle: this.symbol.style,
                baseClass: 'symbolEditorControl',
                label: this.i18n.widgets.symbolStylePicker.label
            }, this.createLeftHandControlsDiv() );

            this.outlineStylePicker.watch('lineStyle', lang.hitch(this, function () {

                this._updateSymbolAtt();

            }));

            this.outlineStylePicker.startup();

        },

        _initOutlineColorPicker: function () {

            this.outlineColorPicker = new SymColorPicker({
                color: this.symbol.color,
                baseClass: 'symbolEditorControl',
                buttonLabel: this.i18n.widgets.symbolColorPicker.buttonLabel,
                sliderLabel: this.i18n.widgets.symbolColorPicker.sliderLabel
            }, this.createLeftHandControlsDiv() );

            this.outlineColorPicker.watch('color', lang.hitch(this, function () {

                this._updateSymbolAtt();

            }));

            this.outlineColorPicker.startup();

        },

        _initOutlineWidthSlider: function () {

            this.outlineWidthSlider = new NumericSlider({
                value: this.symbol.width,
                minimum: 1,
                maximum: 10,
                baseClass: 'symbolEditorControl',
                label: this.i18n.widgets.symbolWidthPicker.label
            }, this.createLeftHandControlsDiv() );

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

            var lineStyle = this.outlineStylePicker.get('lineStyle');
            symbol.style = lineStyle;

            var lineColor = this.outlineColorPicker.get('color');
            symbol.color = lineColor;

            var lineWidth = this.outlineWidthSlider.get('value');
            symbol.width = lineWidth;

            this._set('symbol', symbol);
        },

        _setSymbolAttr: function (value) {

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