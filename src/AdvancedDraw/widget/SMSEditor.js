define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/layout/TabContainer',
    'dijit/layout/ContentPane',
    './SymColorPicker',
    './LineStylePicker',
    './MarkerStylePicker',
    './NumericSlider',
    './_ColorMixin',
    'dojo/text!./templates/SymbolEditor.html',
    'dojo/i18n!../nls/resource',
    './../advancedDrawConfig',
    'xstyle/css!./css/SymbolEditor.css'
], function (
    declare,
    lang,
    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    TabContainer,
    ContentPane,
    SymColorPicker,
    LineStylePicker,
    MarkerStylePicker,
    NumericSlider,
    _ColorMixin,
    template,
    i18n,
    advancedDrawConfig
) {

    var SMSEditor = declare([_WidgetBase,
        _TemplatedMixin,
        _WidgetsInTemplateMixin,
        _ColorMixin
    ], {

        widgetsInTemplate: true,
        templateString: template,
        i18n: i18n,
        baseClass: 'symbolEditor',

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

            this._initTabContainer();
            this._initSymbolStylePicker();
            this._initSymbolColorPicker();
            this._initSymbolSizeSlider();

            this._initOutlineStylePicker();
            this._initOutlineColorPicker();
            this._initOutlineWidthSlider();

            this.initialized = true;

        },

        startup: function () {

            this.inherited(arguments);
            this.tabContainer.resize();

        },

        _initTabContainer: function () {

            this.tabContainer = new TabContainer({
                style: 'height: 100%; width: 100%;',
                doLayout: false,
                tabPosition: 'top'
            }, this.tabContainerNode);

            this.symbolPane = this._getContentPane('Symbol');
            this.outlinePane = this._getContentPane('Outline');
            this.tabContainer.addChild(this.symbolPane);
            this.tabContainer.addChild(this.outlinePane);
            this.tabContainer.startup();
        },

        _initSymbolStylePicker: function () {

            this.symbolStylePicker = new MarkerStylePicker({
                markerStyle: this.symbol.style,
                baseClass: 'symbolEditorControl'
            });

            this.symbolStylePicker.watch('markerStyle', lang.hitch(this, function () {

                this._updateSymbolAtt();

            }));

            this.symbolPane.addChild(this.symbolStylePicker);

        },

        _initSymbolColorPicker: function () {

            this.symbolColorPicker = new SymColorPicker({
                color: this.symbol.color,
                baseClass: 'symbolEditorControl'
            });

            this.symbolColorPicker.watch('color', lang.hitch(this, function () {

                this._updateSymbolAtt();

            }));

            this.symbolPane.addChild(this.symbolColorPicker);

        },

        _initSymbolSizeSlider: function () {

            this.symbolSizeSlider = new NumericSlider({
                value: this.symbol.size,
                min: 1,
                max: 100,
                label: 'Symbol size:',
                baseClass: 'symbolEditorControl'
            });

            this.symbolSizeSlider.watch('value', lang.hitch(this, function () {

                this._updateSymbolAtt();

            }));

            this.symbolPane.addChild(this.symbolSizeSlider);

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
                min: 1,
                max: 10,
                baseClass: 'symbolEditorControl'
            });

            this.outlineWidthSlider.watch('value', lang.hitch(this, function () {

                this._updateSymbolAtt();

            }));

            this.outlinePane.addChild(this.outlineWidthSlider);

        },

        _getContentPane: function (title) {

            var contentPane = new ContentPane({
                title: title
            });

            return contentPane;
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