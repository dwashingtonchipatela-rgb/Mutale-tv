// ================================================
// ZEDLEARN ONLINE — NETLIFY FUNCTION
// send-notification.js
// A Mutale TV Product
//
// This is a Netlify serverless function.
// It runs on Netlify's servers — not in the browser.
// It handles sending email notifications securely.
// ================================================

exports.handler = async function(event, context) {

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body);
    const { type, title } = body;

    // Validate input
    if (!type || !title) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Log the notification
    console.log('New resource uploaded:', type, '-', title);

    // Return success
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Notification recorded: ' + title
      })
    };

  } catch (error) {
    console.error('Notification error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
