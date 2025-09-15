// netlify/functions/track.js

exports.handler = async (event, context) => {
  try {
    const data = JSON.parse(event.body);

    // The user's IP is automatically available on the server side from the headers
    const userIp = event.headers['x-nf-client-connection-ip'];

    // You can see this output in your Netlify function logs
    console.log('Received tracking data:', { ...data, userIp });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Data received!" }),
    };
  } catch (error) {
    console.error('Error processing tracking request:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to process request." }),
    };
  }
};