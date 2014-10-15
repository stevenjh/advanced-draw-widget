define( [
            'dojo/_base/declare',
            'dojo/_base/lang',
            'dojo/on',
            'dijit/_WidgetBase',
            'dijit/_TemplatedMixin',
            'dijit/_WidgetsInTemplateMixin',
            'dijit/form/HorizontalSlider',
            'dojo/text!./templates/NumericSlider.html',
            'dojo/i18n!../nls/resource',
            'xstyle/css!./css/NumericSlider.css'

        ],
        function( declare,
                  lang,
                  on,
                  _WidgetBase,
                  _TemplatedMixin,
                  _WidgetsInTemplateMixin,
                  HorizontalSlider,
                  template,
                  i18n
            ) {

            var NumericSlider = declare( [ _WidgetBase,
                _TemplatedMixin,
                _WidgetsInTemplateMixin
            ],
            {

                widgetsInTemplate: true,
                templateString: template,
                value: 0,
                min: 0,
                max: 1,
                i18n: i18n,
                label: 'Line width:',

                constructor: function( options ) {

                    options = options || {};
                    lang.mixin( this, options );
                },

                startup: function () {

                    this.slider = new HorizontalSlider( {
                        name: 'hSlider',
                        value: this.value,
                        minimun: this.min,
                        maximum: this.max,
                        intermediateChanges: true,
                        showButtons: false
                    }, this.numericSliderNode );

                    on( this.slider, 'change', lang.hitch( this, function ( value ) {
                        this._onSliderDijitChange( value );
                    } ) );

                    this.inherited( arguments );

                },

                _setValueAttr: function ( value ) {

                    this._updateSliderDijit( value );
                    this.value = value;

                },

                _updateSliderDijit: function ( value ) {

                    if ( this.slider ) {
                        this.slider.set( 'value', value );
                    }

                },

                _onSliderDijitChange: function( value ) {

                    this._set( 'value', value );

                }

            } );

            return NumericSlider;

        }

);