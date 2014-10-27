define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'esri/OperationBase',
    'esri/symbols/jsonUtils',
    'dojo/i18n!./../nls/resource',
    '../widget/_ADWNotificationsMixin'
], function (
    declare,
    lang,
    OperationBase,
    symUtil,
    i18n,
    _ADWNotificationsMixin
) {
    return declare( [ OperationBase, _ADWNotificationsMixin ], {

        label: i18n.undoManager.editSymbol,

        constructor: function (params) {
            lang.mixin(this, params);
            // @param graphic
            // @param startSym - geometry before edit
            // @param endSym - geometry after edit
        },

        performUndo: function () {
            this.graphic.setSymbol(symUtil.fromJson(this.startSym));
            this.sendGraphicSymbolEditedNotification( this.graphic, this.endSym, this.startSym );
        },

        performRedo: function () {
            this.graphic.setSymbol(symUtil.fromJson(this.endSym));
            this.sendGraphicSymbolEditedNotification( this.graphic, this.startSym, this.endSym );
        }

    });
});