// netlify/functions/track.js
const admin = require('firebase-admin');
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const data = JSON.parse(event.body);

    const trackingCollection = db.collection('tracking_data');
    const docRef = trackingCollection.doc();

    const result = await docRef.set({
      user_agent: data.userAgent,
      screen_resolution: data.screenResolution,
      browser_language: data.browserLanguage,
      referrer_url: data.referrerUrl,
      timezone: data.timezone,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Data received and stored in Firestore!" }),
    };
  } catch (error) {
    console.error('Firestore insert error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to insert data into Firestore' }),
    };
  }
};