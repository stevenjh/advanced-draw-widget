define( [
            'dojo/_base/declare',
            'dijit/_WidgetBase',
            'dijit/_TemplatedMixin',
            'dojo/text!./templates/_SymbolEditorBase.html',
            'dojo/i18n!../nls/resource',
            'xstyle/css!./css/_SymbolEditorBase.css'

        ],
        function( declare,
                  _WidgetBase,
                  _TemplatedMixin,
                  template,
                  i18n
            ) {

            var _SymEditorBase = declare( [ _WidgetBase, _TemplatedMixin ], {

                templateString: template,
                i18n: i18n,
                baseClass: 'symbolEditorBase',

                constructor: function() {

                    this.leftHandControlsLabel = 'Fill';
                    this.rightHandControlsLabel = 'Outline';
                    this.editorLabel = 'Symbol Editor';

                }

            } );

            return _SymEditorBase;

        }

);