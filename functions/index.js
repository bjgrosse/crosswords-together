const firebase = require('firebase');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

const db = admin.firestore();

const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});


/**
 * Creates a document with ID -> uid in the `Users` collection.
 *
 * @param {Object} userRecord Contains the auth, uid and displayName info.
 * @param {Object} context Details about the event.
 */
const createProfile = (userRecord, context) => {
  const { email, displayName, uid } = userRecord;

  return db
    .collection('users')
    .doc(uid)
    .set({ email, displayName })
    .catch(console.error);
};


/**
 * Sends a notification email when someone is invited to join a puzzle.
 *
 * @param {Object} userRecord Contains the auth, uid and displayName info.
 * @param {Object} context Details about the event.
 */
const createInvitation = async (snapshot, context) => {
  const invitation = snapshot.data();
  const { recipientEmail, puzzleId, senderId } = invitation

  const existingUserQuery = await db.collection("users").where("email", "==", recipientEmail).get();

  console.log(invitation.id, recipientEmail);

  const newPlayer = { name: recipientEmail, pending: true, invitationId: invitation.id };

  if (existingUserQuery.docs.length > 0 ) {
    newPlayer.name = existingUserQuery.docs[0].data().displayName;
    newPlayer.id =  existingUserQuery.docs[0].id;
  }

  
  console.log(newPlayer.name, newPlayer.id);
  
  const puzzleRef = db.collection("puzzles").doc(puzzleId);
  await puzzleRef.update({ players: admin.firestore.FieldValue.arrayUnion(newPlayer) });

  if (newPlayer.id) {
    
  await puzzleRef.update({ playerIds: admin.firestore.FieldValue.arrayUnion(newPlayer.id) });
  }

  const mailOptions = {
    from: '"Crosswords Together" <crosswords.together@gmail.com>',
    to: recipientEmail,
    subject: "You've been invited",
    text: "You've been invited to this game " + puzzleId
  };

  try {
    await mailTransport.sendMail(mailOptions);
    console.log(`Invitation email sent to:`, recipientEmail);
  } catch (error) {
    console.error('There was an error while sending the email:', error);
  }
  return null;
};



module.exports = {
  authOnCreate: functions.auth.user().onCreate(createProfile),
  sendPuzzleInvitation: functions.firestore.document('/invitations/{uid}').onCreate(createInvitation)
};

