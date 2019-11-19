
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const colors = ["Red", "Pink", "Purple", "Deep Purple", "Indigo", "Blue", "Light Blue", "Cyan", "Teal", "Green", "Light Green", "Lime", "Amber", "Orange", "Deep Orange", "Brown"]
const axios = require("axios")

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
 */
const onCreateProfile = async (userRecord, context) => {
  const { uid } = userRecord;

  const user = await admin.auth().getUser(uid)

  return db
    .collection('users')
    .doc(uid)
    .set({ email: user.email, displayName: user.displayName || user.email })
    .catch(console.error);
};

/**
 * When an invitation record gets created, this function adds a placeholder
 * player value to the puzzle and sends a notification to the recipient
 */
const onCreateInvitation = async (snapshot, context) => {
  const { recipientEmail, puzzleId, senderId } = snapshot.data()
  console.log(snapshot.id, recipientEmail, puzzleId);

  const existingUserQuery = await db.collection("users").where("email", "==", recipientEmail).get();
  const newPlayer = { name: recipientEmail, pending: true, invitationId: snapshot.id };

  if (existingUserQuery.docs.length > 0) {
    let user = existingUserQuery.docs[0].data()
    newPlayer.name = user.displayName || user.email;
    newPlayer.id = existingUserQuery.docs[0].id;

    console.log(newPlayer.name, newPlayer.id);
  }


  const puzzleRef = db.collection("puzzles").doc(puzzleId);
  await puzzleRef.update({ players: admin.firestore.FieldValue.arrayUnion(newPlayer) });

  if (newPlayer.id) {
    await puzzleRef.update({ playerIds: admin.firestore.FieldValue.arrayUnion(newPlayer.id) });
  }

  const sender = await admin.auth().getUser(senderId);

  const mailOptions = {
    from: '"Crosswords Together" <crosswords.together@gmail.com>',
    to: recipientEmail,
    subject: "You've been invited",
    html: `You've been invited by ${sender.displayName} (${sender.email}) to collaborate on a puzzle. <a href="http://crosswordstogether.com/invitation/${snapshot.id}">Click here</a> to start!`
  };

  try {
    await mailTransport.sendMail(mailOptions);
    console.log(`Invitation email sent to:`, recipientEmail);
  } catch (error) {
    console.error('There was an error while sending the email:', error);
  }
  return null;
};

/**
 * When an invitation record gets created, this function adds a placeholder
 * player value to the puzzle and sends a notification to the recipient
 */
const acceptInvitation = async (data, context) => {
  let { id, acceptingUserId } = data

  const invitationRef = db.collection("invitations").doc(id)
  const invitation = (await invitationRef.get()).data();

  await invitationRef.update({ accepted: true });

  const puzzleRef = db.collection("puzzles").doc(invitation.puzzleId);
  const puzzle = (await puzzleRef.get()).data();



  let player = puzzle.players.find(x => x.invitationId === id);

  if (player) {
    await puzzleRef.update({ players: admin.firestore.FieldValue.arrayRemove(player) });

    let needToAddPlayerId = !player.id;

    let existingColors = puzzle.players.map(x => x.color);
    let availableColors = colors.filter(x => !existingColors.includes(x));
    let newColor = availableColors[Math.floor(Math.random() * availableColors.length)];

    player = { ...player, ...{ id: acceptingUserId, pending: false, color: newColor } }

    if (needToAddPlayerId) {
      let user = await admin.auth().getUser(acceptingUserId);
      player.name = user.displayName;

    }
    await puzzleRef.update({ players: admin.firestore.FieldValue.arrayUnion(player), playerIds: admin.firestore.FieldValue.arrayUnion(acceptingUserId) });
  }

}


/**
 * When an invitation record gets created, this function adds a placeholder
 * player value to the puzzle and sends a notification to the recipient
 */
const saveFcmToken = async (data, context) => {
  let { userId, token } = data

  const userRef = db.collection("users").doc(userId)
  const user = await userRef.get();
  const groupKey = user.data().FCMGroupKey

  const instance = axios.create({
    headers: {
      "Content-Type" : "application/json",
      Authorization:  "key=AIzaSyBNIXv7rYW48wCmyIIZK_tXAXdFGW9ylOg",
      "project_id" : "847675267519"
    }
  })

  let body

  if (groupKey) {
    body = {
      "operation": "add",
      "notification_key_name": userId,
      "notification_key": groupKey,
      "registration_ids": [token]
   }
  } else {
    body = {
      "operation": "create",
      "notification_key_name": userId,
      "registration_ids": [token]
   }
  }
  
  let newGroupKey

  await instance.post('https://fcm.googleapis.com/fcm/notification', body)
    .then((res) => {
      console.log(`statusCode: ${res.statusCode}`)
      console.log(res)
      if (!groupKey) {
        newGroupKey = res.data.notification_key
      }

      return res;
    })
    .catch((error) => {
      console.error(error)
    })

    if (newGroupKey) {
      await userRef.update({FCMGroupKey: newGroupKey})
    }
}

/**
 * When an invitation record gets created, this function adds a placeholder
 * player value to the puzzle and sends a notification to the recipient
 */
const sendMessage = async (data, context) => {
  let { userId, messageData } = data

  const user = await db.collection("users").doc(userId).get();
  const token = user.data().FCMGroupKey

  //const token = 'eggA5XgTAFmb7zYWQMMyy6:APA91bHyEZAyLHR4t6V17N6lVfpNzCayEkoCF9bR3JHO6qDcNoyE69FXurdL-Q-cbH0P37AzIILdoxmw_ZQzpz8v2oNapTuW43Lz4dN50v12CxJWHZPaQ_ZQ_6klxCa6Bu9G1OeLuH4t'
  var message = {
    data: messageData
  };


  console.log('preparing to send message');
  // Send a message to the device corresponding to the provided
  // registration token.
  await admin.messaging().sendToDeviceGroup(token, message)
    .then((response) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', response);

      return response
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
}

module.exports = {
  authOnCreate: functions.auth.user().onCreate(onCreateProfile),
  onCreateInvitation: functions.firestore.document('/invitations/{uid}').onCreate(onCreateInvitation),
  acceptInvitation: functions.https.onCall(acceptInvitation),
  saveFcmToken: functions.https.onCall(saveFcmToken),
  sendMessage: functions.https.onCall(sendMessage)
};

