export const blockContent = {
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    {
      title: 'Block',
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'H1', value: 'h1'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
        {title: 'H4', value: 'h4'},
        {title: 'Quote', value: 'blockquote'},
      ],
      lists: [{title: 'Bullet', value: 'bullet'}],
      marks: {
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
        ],
        annotations: [
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
              },
            ],
          },
        ],
      },
    },
    {
      type: 'image',
      options: {hotspot: true},
    },
    {
      name: 'gallery',
      title: 'Image Gallery',
      type: 'object',
      fields: [
        {
          name: 'images',
          title: 'Images',
          type: 'array',
          of: [{type: 'image'}],
        }
      ]
    },
    {
      name: 'codeSnippet',
      title: 'Code Snippet',
      type: 'object',
      fields: [
        {
          name: 'code',
          title: 'Code',
          type: 'text',
        },
        {
          name: 'language',
          title: 'Language',
          type: 'string',
        }
      ]
    }
  ],
};
