define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'esri/OperationBase',
    'esri/symbols/jsonUtils',
    'dojo/i18n!./../nls/resource'
], function (
    declare,
    lang,
    OperationBase,
    symUtil,
    i18n
) {
    return declare(OperationBase, {
        label: i18n.undoManager.editSymbol,
        constructor: function (params) {
            lang.mixin(this, params);
            // @param graphic
            // @param startSym - geometry before edit
            // @param endSym - geometry after edit
        },
        performUndo: function () {
            this.graphic.setSymbol(symUtil.fromJson(this.startSym));
        },
        performRedo: function () {
            this.graphic.setSymbol(symUtil.fromJson(this.endSym));
        }
    });
});