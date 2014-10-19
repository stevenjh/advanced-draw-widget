define([
	'dojo/_base/declare',
	'dojo/_base/lang',
    'dojo/dom-style',
    './_SymEditorBase',
	'./SymColorPicker',
	'./LineStylePicker',
	'./FillStylePicker',
	'./NumericSlider'
], function (
	declare,
	lang,
    domStyle,
    _SymEditorBase,
	SymColorPicker,
	LineStylePicker,
	FillStylePicker,
	NumericSlider
) {

	var SFSEditor = declare( _SymEditorBase, {

		constructor: function (options) {

			options = options || {};

			if (!options.symbol) {
				options.symbol = this.advancedDrawConfig.defaultPolygonSymbol;
			}
			lang.mixin(this, options);

			this.initialized = false;
            this.editorLabel = this.i18n.widgets.sfsEditor.defaultEditorLabel;
            this.leftHandControlsLabel = this.i18n.widgets.sfsEditor.leftHandControlsLabel;
            this.rightHandControlsLabel = this.i18n.widgets.sfsEditor.rightHandControlsLabel;

			this._set('symbol', this.symbol);

		},

		postCreate: function () {

			this.inherited(arguments);

			this._initFillStylePicker();
			this._initFillColorPicker();

			this._initOutlineStylePicker();
			this._initOutlineColorPicker();
			this._initOutlineWidthSlider();

			this.initialized = true;

		},

		_initFillStylePicker: function () {

			this.fillStylePicker = new FillStylePicker({
				fillStyle: this.symbol.style,
				baseClass: 'symbolEditorControl',
                label: this.i18n.widgets.symbolStylePicker.label
			}, this.createLeftHandControlsDiv() );

			this.fillStylePicker.watch('fillStyle', lang.hitch(this, function () {

				this._updateSymbolAtt();

                if ( !this._hasFill( arguments[ 2 ] ) ) {
                    this._toggleSymbolColorControl( false );
                } else {
                    this._toggleSymbolColorControl( true );
                }

			}));

			this.fillStylePicker.startup();

		},

        _toggleSymbolColorControl: function ( show ) {

            var display = show ? 'block' : 'none';
            domStyle.set( this.fillColorPicker.domNode, 'display', display );

        },

        _hasFill: function ( style ) {

            if ( style === 'esriSFSSolid' ) {
                return true;
            }
            return false;
        },

		_initFillColorPicker: function () {

			this.fillColorPicker = new SymColorPicker({
				color: this.symbol.color,
				baseClass: 'symbolEditorControl',
                buttonLabel: this.i18n.widgets.symbolColorPicker.buttonLabel,
                sliderLabel: this.i18n.widgets.symbolColorPicker.sliderLabel
			}, this.createLeftHandControlsDiv() );

			this.fillColorPicker.watch('color', lang.hitch(this, function () {

				this._updateSymbolAtt();

			}));

			this.fillColorPicker.startup();

		},

		_initOutlineStylePicker: function () {

			this.outlineStylePicker = new LineStylePicker({
				lineStyle: this.symbol.outline.style,
				baseClass: 'symbolEditorControl',
                label: this.i18n.widgets.symbolStylePicker.label
			}, this.createRightHandControlsDiv() );

			this.outlineStylePicker.watch('lineStyle', lang.hitch(this, function () {

				this._updateSymbolAtt();

			}));

			this.outlineStylePicker.startup();

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

			var symbol = lang.clone(this.symbol);

			var symStyle = this.fillStylePicker.get('fillStyle');
			symbol.style = symStyle;

			var symColor = this.fillColorPicker.get('color');
			symbol.color = symColor;

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

				this.fillColorPicker.set('value', this._esriColorArrayToDojoColor(this.symbol.color));
				this.fillStylePicker.set('value', this.symbol.style);
				this.outlineColorPicker.set('value', this._esriColorArrayToDojoColor(this.symbol.outline.color));
				this.outlineWidthSlider.set('value', this.symbol.outline.width);
				this.outlineStylePicker.set('value', this.symbol.outline.style);

			}

			this.symbol = value;

		}

	});

	return SFSEditor;
});