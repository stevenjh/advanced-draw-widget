define( [
            'dojo/_base/declare',
            'dojo/_base/lang',
            'dojo/_base/array',
            'dijit/_WidgetBase',
            'dijit/_TemplatedMixin',
            'dijit/_WidgetsInTemplateMixin',
            'dojo/text!./templates/FillStylePicker.html',
            'dijit/form/Select',
            'xstyle/css!./css/FillStylePicker.css'

        ],
        function( declare,
                  lang,
                  array,
                  _WidgetBase,
                  _TemplatedMixin,
                  _WidgetsInTemplateMixin,
                  template
            ) {

            var FillStylePicker = declare( [ _WidgetBase,
                _TemplatedMixin,
                _WidgetsInTemplateMixin
            ],
            {

                widgetsInTemplate: true,
                templateString: template,
                fillStyle: 'esriSFSSolid',

                constructor: function() {
                    //TODO implementation
                    this.set( 'fillStyle', 'esriSFSSolid' );

                },

                _setFillStyleAttr: function ( value ) {

                    this._updateSelectDijit( value );
                    this._set( 'fillStyle', value );

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