define( [
    'dojo/_base/declare',
    'dojo/dom-construct',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dojo/i18n!../nls/resource',
    './../advancedDrawConfig',
    'dojo/text!./templates/_SymbolEditorBase.html',
    'xstyle/css!./css/_SymbolEditorBase.css',
    'xstyle/css!./css/SymbolEditor.css'
], function(
    declare,
    domConstruct,
    _WidgetBase,
    _TemplatedMixin,
    i18n,
    advancedDrawConfig,
    template
) {

    var _SymEditorBase = declare( [ _WidgetBase, _TemplatedMixin ], {

        templateString: template,
        i18n: i18n,
        baseClass: 'symbolEditorBase',
        advancedDrawConfig: advancedDrawConfig,

        constructor: function() {

            this.leftHandControlsLabel = 'Fill';
            this.rightHandControlsLabel = 'Outline';
            this.editorLabel = 'Symbol Editor';

        },

        removeLeftHandControls: function () {

            domConstruct.destroy( this.leftHandControlsLI );

        },

        removeRightHandControls: function () {

            domConstruct.destroy( this.rightHandControlsLI );

        },

        createLeftHandControlsDiv: function () {

            return domConstruct.create( 'div', {}, this.leftHandControls, 'last' );

        },

        createRightHandControlsDiv: function () {

            return domConstruct.create( 'div', {}, this.rightHandControls, 'last' );

        }

    } );

    return _SymEditorBase;

} );