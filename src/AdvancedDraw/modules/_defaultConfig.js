// the default configuration of symbols, layers, etc
define([], function () {
    return {
        // default symbols
        defaultPolygonSymbol: {
            color: [255, 0, 0, 32],
            outline: {
                color: [255, 0, 0, 255],
                width: 3,
                type: 'esriSLS',
                style: 'esriSLSSolid'
            },
            type: 'esriSFS',
            style: 'esriSFSSolid'
        },
        defaultPolylineSymbol: {
            color: [0, 255, 0, 255],
            width: 3,
            type: 'esriSLS',
            style: 'esriSLSSolid'
        },
        defaultPointSymbol: {
            color: [0, 0, 255, 255],
            size: 10.5,
            type: 'esriSMS',
            style: 'esriSMSCircle',
            outline: {
                color: [255, 255, 255, 255],
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
            font: {
                size: 12,
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
        //   changing may (probably will) cause errors
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
        }
    };
});