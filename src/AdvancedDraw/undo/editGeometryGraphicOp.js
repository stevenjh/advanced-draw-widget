define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'esri/OperationBase',
    'dojo/i18n!./../nls/resource'
], function (
    declare,
    lang,
    OperationBase,
    i18n
) {
    return declare(OperationBase, {
        label: i18n.undoManager.deleteGraphic,
        constructor: function (params) {
            lang.mixin(this, params);
            // @param graphic
            // @param startGeom - geometry before edit
            // @param endGeom - geometry after edit
        },
        performUndo: function () {
            this.graphic.setGeometry(this.startGeom);
        },
        performRedo: function () {
            this.graphic.setGeometry(this.endGeom);
        }
    });
});