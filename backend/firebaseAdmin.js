const admin = require('firebase-admin');

try {
  // Uses GOOGLE_APPLICATION_CREDENTIALS environment variable
  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });
} catch (error) {
  console.warn("Firebase Admin Initialization Warning:", error.message);
}

module.exports = admin;
