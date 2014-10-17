define([
	'dojo/_base/declare',
	'dojo/_base/lang',
    'dijit/layout/AccordionContainer',
	'./SymColorPicker',
	'./LineStylePicker',
	'./FillStylePicker',
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
	FillStylePicker,
	NumericSlider,
	_ColorMixin,
	_SymEditorMixin,
	i18n,
	advancedDrawConfig
) {

	var SFSEditor = declare([ AccordionContainer, _ColorMixin, _SymEditorMixin ], {

		i18n: i18n,
        doLayout: false,
		baseClass: 'symbolEditor',

		constructor: function (options) {

			options = options || {};

			if (!options.symbol) {
				options.symbol = advancedDrawConfig.defaultPolygonSymbol;
			}
			lang.mixin(this, options);

			this.initialized = false;

			this._set('symbol', this.symbol);

		},
		postCreate: function () {

			this.inherited(arguments);

			this._initContentPanes();
			this._initFillStylePicker();
			this._initFillColorPicker();

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

			this.fillPane = this._getContentPane( i18n.widgets.sfsEditor.fill );
			this.outlinePane = this._getContentPane( i18n.widgets.sfsEditor.outline );
			this.addChild(this.fillPane);
			this.addChild(this.outlinePane);
		},

		_initFillStylePicker: function () {

			this.fillStylePicker = new FillStylePicker({
				fillStyle: this.symbol.style,
				baseClass: 'symbolEditorControl'
			});

			this.fillStylePicker.watch('fillStyle', lang.hitch(this, function () {

				this._updateSymbolAtt();

			}));

			this.fillPane.addChild(this.fillStylePicker);

		},

		_initFillColorPicker: function () {

			this.fillColorPicker = new SymColorPicker({
				color: this.symbol.color,
				baseClass: 'symbolEditorControl'
			});

			this.fillColorPicker.watch('color', lang.hitch(this, function () {

				this._updateSymbolAtt();
                this._updateColorPickerEnabled( arguments[ 2 ] );

			}));

			this.fillPane.addChild(this.fillColorPicker);

		},

		_initOutlineStylePicker: function () {

			this.outlineStylePicker = new LineStylePicker({
				lineStyle: this.symbol.outline.style,
				baseClass: 'symbolEditorControl'
			});

			this.outlineStylePicker.watch('lineStyle', lang.hitch(this, function () {

				this._updateSymbolAtt();

			}));

			this.outlinePane.addChild(this.outlineStylePicker);

		},

		_initOutlineColorPicker: function () {

			this.outlineColorPicker = new SymColorPicker({
				color: this.symbol.outline.color,
				baseClass: 'symbolEditorControl'
			});

			this.outlineColorPicker.watch('color', lang.hitch(this, function () {

				this._updateSymbolAtt();

			}));

			this.outlinePane.addChild(this.outlineColorPicker);

		},

		_initOutlineWidthSlider: function () {

			this.outlineWidthSlider = new NumericSlider({
				value: this.symbol.outline.width,
				minimum: 1,
				maximum: 10,
				baseClass: 'symbolEditorControl'
			});

			this.outlineWidthSlider.watch('value', lang.hitch(this, function () {

				this._updateSymbolAtt();

			}));

			this.outlinePane.addChild(this.outlineWidthSlider);

		},

        _updateColorPickerEnabled: function ( style ) {

            var enableColorPicker = style === 'esriSFSSolid';
            this.fillColorPicker.disabled = !enableColorPicker;
            
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