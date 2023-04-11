export default {
  $schema: 'http://json-schema.org/draft-04/schema#',
  title: 'ProductAPI',
  type: 'object',
  properties: {
    title: {
      type: 'string'
    },
    description: {
      type: 'string'
    },
    price: {
      type: 'number'
    },
    count: {
      type: 'number'
    },
  },
  required: [
    'title',
    'description',
    'price',
    'count'
  ],
} as const;
