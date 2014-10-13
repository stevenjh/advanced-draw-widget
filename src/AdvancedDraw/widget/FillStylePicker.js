define( [
            'dojo/_base/declare',
            'dojo/_base/lang',
            'dojo/_base/array',
            'dijit/_WidgetBase',
            'dijit/_TemplatedMixin',
            'dijit/_WidgetsInTemplateMixin',
            'dojo/text!src/AdvancedDraw/widget/templates/FillStylePicker.html',
            'dojo/i18n!src/AdvancedDraw/nls/resource',
            'dijit/form/Select',
            'xstyle/css!src/AdvancedDraw/widget/css/FillStylePicker.css'

        ],
        function( declare,
                  lang,
                  array,
                  _WidgetBase,
                  _TemplatedMixin,
                  _WidgetsInTemplateMixin,
                  template,
                  i18n
            ) {

            var FillStylePicker = declare( [ _WidgetBase,
                _TemplatedMixin,
                _WidgetsInTemplateMixin
            ],
            {

                widgetsInTemplate: true,
                templateString: template,
                fillStyle: 'esriSFSSolid',
                i18n: i18n,

                constructor: function( options ) {

                    options = options || {};
                    lang.mixin( this, options );

                },

                postCreate: function () {

                    this.inherited( arguments );
                    this._set( 'fillStyle', this.fillStyle );

                },

                _setFillStyleAttr: function ( value ) {

                    this._updateSelectDijit( value );
                    this.fillStyle = value;

                },

                _updateSelectDijit: function ( value ) {

                    if ( this.selectDijit ) {
                        this.selectDijit.set( 'value', value );
                    }

                },

                _onSelectDijitChange: function( newIndex ) {

                    var value = this.selectDijit.get( 'value' );
                    this._set( 'fillStyle', value );

                }

            } );

            return FillStylePicker;

        }

);