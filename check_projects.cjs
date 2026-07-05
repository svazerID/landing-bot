const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'gwlcf911',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-04-20',
});

client.fetch('*[_type == "project"]{title, description, slug}').then(res => {
  console.log('PROJECTS:', JSON.stringify(res, null, 2));
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
