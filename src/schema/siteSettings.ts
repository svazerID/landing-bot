export const siteSettings = {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    {
      name: 'siteTitle',
      title: 'Site Title',
      type: 'string',
      description: 'The main title of the website (e.g. Inside a Head | Digital Studio).',
    },
    {
      name: 'siteDescription',
      title: 'Site Description',
      type: 'text',
      description: 'The SEO meta description for search engines.',
    },
    {
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'The image shown when sharing the site on social media.',
    },
    {
      name: 'bio',
      title: 'Bio / Hero Copy',
      type: 'text',
      description: 'The introductory text shown in the hero section.',
    },
    {
      name: 'currentlyReading',
      title: 'Currently Reading',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Book Title',
          type: 'string',
        },
        {
          name: 'author',
          title: 'Author',
          type: 'string',
        },
        {
          name: 'coverImage',
          title: 'Cover Image',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'url',
          title: 'Book URL (Goodreads/Store)',
          type: 'url',
        },
      ],
    },
  ],
};
