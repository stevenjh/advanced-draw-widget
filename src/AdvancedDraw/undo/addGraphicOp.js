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
        label: i18n.undoManager.addGraphic,
        constructor: function (params) {
            lang.mixin(this, params);
            // @param layer
            // @param graphic
        },
        performUndo: function () {
            this.layer.remove(this.graphic);
        },
        performRedo: function () {
            this.layer.add(this.graphic);
        }
    });
});