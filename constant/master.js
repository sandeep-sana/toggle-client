export const MASTER = {
    DATATYPE: [
        { label: 'String', value: 'String' },
        { label: 'Boolean', value: 'Boolean' },
        { label: 'Number', value: 'Number' },
        { label: 'Date', value: 'Date' },
    ],
    UNIQUE: [
        { label: 'True', value: 'true' },
        { label: 'False', value: 'false' },
    ],
    BOOLEAN: [
        { label: 'True', value: true },
        { label: 'False', value: false },
    ],
    VALIDATION: {
        String: [
            'required',
            'nospace',
            'nouppercase',
            'nonumber',
            'email',
            'number',
            'alphabate',
            'min',
            'max',
        ]
    }
}

export const DATA_TYPE = {
    STRING: 'String',
    BOOLEAN: 'Boolean',
    NUMBER: 'Number',
    DATE: 'Date',
}