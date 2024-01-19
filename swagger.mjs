// swagger.js


const outputFile = './swagger-output.json';
const endpointsFiles = ['./apis.mjs']; // Update the path to match your actual routes
// Serve Swagger UI documentation
const swaggerConfig = {
  info: {
    title: 'StoreFront',
    description: 'API documentation [StoreFront]',
    version: '1.0.0', // Specify your API version
  },
  host:  'localhost:5000', // Replace 'your-server-ip' with the actual IP address or hostname
  basePath: '/store',
  schemes: ['http'],

  // Other configuration options go here
};
(async () => {
  const autogen = await import('swagger-autogen');
  const swaggerAutogen = autogen.default();
    // Add the base path for your endpoints


  await swaggerAutogen(outputFile, endpointsFiles,swaggerConfig);
  await import('./app.mjs'); // Update the path to your main file
})();

