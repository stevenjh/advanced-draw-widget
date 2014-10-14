// the default configuration of symbols, layers, etc
define([], function () {
    return {
        // default symbols
        defaultPolygonSymbol: {
            color: [0, 255, 0, 64],
            outline: {
                color: [255, 0, 0, 255],
                width: 2,
                type: 'esriSLS',
                style: 'esriSLSSolid'
            },
            type: 'esriSFS',
            style: 'esriSFSForwardDiagonal'
        },
        defaultPolylineSymbol: {
            color: [255, 0, 0, 255],
            width: 2,
            type: 'esriSLS',
            style: 'esriSLSSolid'
        },
        defaultPointSymbol: {
            color: [255, 0, 0, 200],
            size: 10.5,
            type: 'esriSMS',
            style: 'esriSMSCircle',
            outline: {
                color: [255, 0, 0, 255],
                width: 1.5,
                type: 'esriSLS',
                style: 'esriSLSSolid'
            }
        },
        defaultTextSymbol: {
            color: [0, 0, 0, 255],
            type: 'esriTS',
            verticalAlignment: 'middle',
            horizontalAlignment: 'center',
            text: 'New Text',
            rotated: false,
            kerning: true,
            //haloSize: 12, // no esrijs support - try to make it work
            //haloColor: [255, 255, 255, 255], // no esrijs support - try to make it work
            //borderLineSize: 12, // no esrijs support - try to make it work
            //borderLineColor: [255, 0, 0, 255], // no esrijs support - try to make it work
            font: {
                size: 14,
                style: 'normal',
                variant: 'normal',
                weight: 'bold',
                family: 'sans-serif'
            }
        },
        defaultTempSymbol: {
            color: [255, 255, 255, 192],
            type: 'esriSFS',
            style: 'esriSFSSolid'
        },
        // advanced settings
        //   only change here or via widget params if you know what you're doing!
        //
        // default layer definition
        _layerDefinition: {
            objectIdField: 'OBJECTID',
            type: 'Feature Layer',
            hasAttachments: false,
            capabilities: 'Query,Editing',
            fields: [{
                name: 'OBJECTID',
                type: 'esriFieldTypeOID'
            }, {
                name: 'draw_type',
                type: 'esriFieldTypeString'
            }, {
                name: 'draw_text_string',
                type: 'esriFieldTypeString'
            }]
        },
        // screen offsets for text tooltip dialog
        _textTooltipDialogOffset: {
            x: -12,
            y: 0
        },
        // snapping manager options
        _snappingOptions: {
            snapPointSymbol: {
                color: null,
                size: 11.25,
                type: 'esriSMS',
                style: 'esriSMSCross',
                outline: {
                    color: [255, 0, 0, 192],
                    width: 3.75,
                    type: 'esriSLS',
                    style: 'esriSLSSolid'
                }
            },
            alwaysSnap: false,
            snapKey: 'CTRL', // key string ==> keys['CTRL']
            tolerance: 15
        },
        // geom editing edit toolbar options
        _editGeometryOptions: {
            allowAddVertices: true,
            allowDeleteVertices: true,
            uniformScaling: false
        }
    };
});