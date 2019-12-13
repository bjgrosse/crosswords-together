const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const colors = [
  "Red",
  "Pink",
  "Purple",
  "Deep Purple",
  "Indigo",
  "Blue",
  "Light Blue",
  "Cyan",
  "Teal",
  "Green",
  "Light Green",
  "Lime",
  "Amber",
  "Orange",
  "Deep Orange"
];
const axios = require("axios");

admin.initializeApp();

const db = admin.firestore();

// const gmailEmail = functions.config().gmail.email;
// const gmailPassword = functions.config().gmail.password;
// const mailTransport = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: gmailEmail,
//     pass: gmailPassword,
//   },
// });

/**
 * Creates a document with ID -> uid in the `Users` collection.
 */
const onCreateProfile = async (userRecord, context) => {
  const { uid } = userRecord;

  const user = await admin.auth().getUser(uid);

  return db
    .collection("users")
    .doc(uid)
    .set({ email: user.email, displayName: user.displayName || user.email })
    .catch(console.error);
};

/**
 * When an invitation record gets created, this function adds a placeholder
 * player value to the puzzle and sends a notification to the recipient
 */
const onCreateInvitation = async (snapshot, context) => {
  const { recipientEmail, puzzleId, senderId } = snapshot.data();
  console.log(snapshot.id, recipientEmail, puzzleId);

  const existingUserQuery = await db
    .collection("users")
    .where("email", "==", recipientEmail)
    .get();
  const newPlayer = {
    name: recipientEmail,
    pending: true,
    invitationId: snapshot.id
  };

  if (existingUserQuery.docs.length > 0) {
    let user = existingUserQuery.docs[0].data();
    newPlayer.name = user.displayName || user.email;
    newPlayer.id = existingUserQuery.docs[0].id;

    console.log(newPlayer.name, newPlayer.id);
  }
};
/**
 * When an invitation record gets created, this function adds a placeholder
 * player value to the puzzle and sends a notification to the recipient
 */
const onStartPuzzle = async (snapshot, context) => {
  const { ownerId, templateId } = snapshot.data();
  console.log("starting new puzzle", snapshot.id, ownerId, templateId);

  const userRef = db.collection("users").doc(ownerId);
  userRef
    .collection("usedTemplateIds")
    .doc(templateId)
    .set({ date: Date.now() });
};
/**
 * When an invitation record gets created, this function adds a placeholder
 * player value to the puzzle and sends a notification to the recipient
 */
const createInvitationLink = async (data, context) => {
  let { puzzleId, userId } = data;

  const invitationRef = db.collection("invitations").doc();

  let user = await admin.auth().getUser(userId);
  let name = user.displayName;

  let invitationData = {
    puzzleId: puzzleId,
    senderId: userId,
    senderName: name
  };

  const puzzleRef = db.collection("puzzles").doc(puzzleId);

  await Promise.all([
    invitationRef.set(invitationData),
    puzzleRef.update({ [`invitationLinks.${userId}`]: invitationRef.id })
  ]);
  return invitationRef.id;
};

const getOptimalColor = (preferredColors, takenColors) => {
  preferredColors = preferredColors.filter(x => !takenColors.includes(x));

  if (preferredColors.length === 0) {
    preferredColors = colors.filter(x => !takenColors.includes(x));
  }

  let takenIndices = takenColors.map(x => colors.indexOf(x));
  let bestColor;
  let bestColorDistance = 0;
  for (let color of preferredColors) {
    let idx = colors.indexOf(color);
    let distances = takenIndices.map(x =>
      Math.min(Math.abs(idx - x), Math.abs(idx - (colors.length + x)))
    );
    let minDistance = distances.reduce((a, b) => Math.min(a, b));

    console.log(color, minDistance);
    if (minDistance > bestColorDistance) {
      bestColor = color;
      bestColorDistance = minDistance;
    }
  }

  return bestColor;
};

/**
 * When an invitation record gets created, this function adds a placeholder
 * player value to the puzzle and sends a notification to the recipient
 */
const acceptInvitation = async (data, context) => {
  let { id, acceptingUserId } = data;

  const invitationRef = db.collection("invitations").doc(id);
  const invitation = (await invitationRef.get()).data();

  await invitationRef.update({ accepted: true });

  const puzzleRef = db.collection("puzzles").doc(invitation.puzzleId);
  const puzzle = (await puzzleRef.get()).data();

  const user = (
    await db
      .collection("users")
      .doc(acceptingUserId)
      .get()
  ).data();

  let player = puzzle.players.find(x => x.id === acceptingUserId);

  if (player) {
    let batch = db.batch();

    batch.update(puzzleRef, {
      players: admin.firestore.FieldValue.arrayRemove(player)
    });

    let needToAddPlayerId = !player.id;
    let existingColors = puzzle.players.map(x => x.color);
    let availableColors = user.preferredColors || colors;

    let newColor = getOptimalColor(availableColors, existingColors);

    let newPlayer = {
      ...player,
      ...{ id: acceptingUserId, pending: false, color: newColor }
    };

    if (needToAddPlayerId) {
      let user = await admin.auth().getUser(acceptingUserId);
      player.name = user.displayName;
    }
    batch.update(puzzleRef, {
      players: admin.firestore.FieldValue.arrayUnion(newPlayer),
      playerIds: admin.firestore.FieldValue.arrayUnion(acceptingUserId)
    });

    await batch.commit();
  }
};

const updatePlayerColor = async (data, context) => {
  let { id, puzzleId, color } = data;

  const puzzleRef = db.collection("puzzles").doc(puzzleId);
  const puzzle = (await puzzleRef.get()).data();

  let player = puzzle.players.find(x => x.id === id);

  if (player) {
    let batch = db.batch();

    batch.update(puzzleRef, {
      players: admin.firestore.FieldValue.arrayRemove(player)
    });

    let newPlayer = {
      ...player,
      ...{ color: color }
    };

    batch.update(puzzleRef, {
      players: admin.firestore.FieldValue.arrayUnion(newPlayer)
    });

    await batch.commit();
  }
};
/**
 * When a player declines an invitation
 */
const leaveGame = async (data, context) => {
  let { id, userId } = data;

  const puzzleRef = db.collection("puzzles").doc(id);
  const puzzle = (await puzzleRef.get()).data();

  let player = puzzle.players.find(x => x.id === userId);

  if (player) {
    await puzzleRef.update({
      players: admin.firestore.FieldValue.arrayRemove(player),
      playerIds: admin.firestore.FieldValue.arrayRemove(userId)
    });
  }
};

/**
 * When someone clicks an invitation link and logs in
 * we want to add a "pending" record for them under the
 * puzzle so we can show it in their Invitations list
 */
const connectInvitation = async (data, context) => {
  const { id, puzzleId, acceptingUserId } = data;

  const user = await admin.auth().getUser(acceptingUserId);

  const userRef = db.collection("users").doc(acceptingUserId);
  const puzzleRef = db.collection("puzzles").doc(puzzleId);
  const { templateId } = (await puzzleRef.get()).data();

  player = {
    id: acceptingUserId,
    invitationId: id,
    pending: true,
    name: user.displayName
  };

  const batch = db.batch();

  batch.create(userRef.collection("usedTemplateIds").doc(templateId), {
    date: Date.now()
  });
  batch.update(puzzleRef, {
    players: admin.firestore.FieldValue.arrayUnion(player),
    playerIds: admin.firestore.FieldValue.arrayUnion(acceptingUserId)
  });

  await batch.commit();
};

/**
 * When someone clicks an invitation link and logs in
 * we want to add a "pending" record for them under the
 * puzzle so we can show it in their Invitations list
 */
const updateCompletedWord = async (data, context) => {
  const { id, puzzleId, userId, value } = data;
  const puzzleRef = db.collection("puzzles").doc(puzzleId);
  const wordRef = puzzleRef.collection("completed-words").doc(id);
  const user = (
    await db
      .collection("users")
      .doc(userId)
      .get()
  ).data();
  const existingWordSnapshot = await wordRef.get();
  const exists = existingWordSnapshot.exists;
  const existingData = existingWordSnapshot.data();
  let usePreviousValues;

  // If no change, exit
  if (exists && existingData.value === value) {
    return;
  }

  let newActivityRef = puzzleRef.collection("activity").doc();
  const newData = {
    ...existingData,
    ...{
      id: id,
      userId: userId,
      value: value,
      addedTimestamp: new Date().getTime(),
      activityId: newActivityRef.id
    }
  };

  if (exists) {
    // We treat any value added within the last two minutes as "pending"
    // and will treat any changes made to the word by the same user within that
    // period as simply overwriting their previous change

    // If previous value was set by the same user in the last two minutes, we need to lookup
    // and delete the previously logged activity record,
    if (
      existingData.userId === userId &&
      existingData.addedTimestamp >= new Date().getTime() - 120000
    ) {
      puzzleRef
        .collection("activity")
        .doc(existingData.activityId)
        .delete();
      usePreviousValues = true;

      //
      // Otherwise we are updating a previously "committed" word
      // and we want to save that info while the current changes are "pending"
    } else {
      newData.previousValue = existingData.value;
      newData.previousUserId = existingData.userId;
    }
  }

  if (!value) {
    wordRef.delete();
    return;
  }

  const batch = db.batch();

  if (!exists) {
    batch.create(wordRef, newData);
  } else {
    batch.update(wordRef, newData);
  }

  const activityData = {
    userId: userId,
    userDisplayName: user.displayName,
    addedTimestamp: new Date().getTime()
  };

  const wordName = `${id.substr(1)}-${id.startsWith("h") ? "across" : "down"}`;
  // If this is a new record, or we're overwriting this user's last added value
  // and there was no "previous" value to refer to...
  if (!exists || (usePreviousValues && !newData.previousValue)) {
    activityData.message = `added ${value.toUpperCase()} for ${wordName}`;
  } else {
    let existingValue = usePreviousValues
      ? newData.previousValue
      : existingData.value;
    activityData.message = `changed ${existingValue.toUpperCase()} to ${value.toUpperCase()} for ${wordName}`;
  }
  batch.create(newActivityRef, activityData);

  await batch.commit();

  const notification = {
    title: `${user.displayName} made progress:`,
    body: activityData.message,
    puzzleId: puzzleId
  };
  await sendNotificationForPuzzle(puzzleId, userId, notification);
};

/**
 * When an invitation record gets created, this function adds a placeholder
 * player value to the puzzle and sends a notification to the recipient
 */
const saveFcmToken = async (data, context) => {
  let { userId, token } = data;

  const userRef = db.collection("users").doc(userId);
  const user = await userRef.get();
  let groupKey = user.data().FCMGroupKey;
  let newGroupKey;

  const instance = axios.create({
    headers: {
      "Content-Type": "application/json",
      Authorization: "key=AIzaSyBNIXv7rYW48wCmyIIZK_tXAXdFGW9ylOg",
      project_id: "847675267519"
    }
  });

  if (!groupKey) {
    await instance
      .get(
        "https://fcm.googleapis.com/fcm/notification?notification_key_name=" +
          userId
      )
      .then(res => {
        console.log(res);
        if (!groupKey) {
          newGroupKey = res.data.notification_key;
          groupKey = newGroupKey;
        }

        return true;
      })
      .catch(error => {
        console.error(error);
        console.log(error.response.data);
        throw error;
      });
  }

  let body;

  if (groupKey) {
    body = {
      operation: "add",
      notification_key_name: userId,
      notification_key: groupKey,
      registration_ids: [token]
    };
  } else {
    body = {
      operation: "create",
      notification_key_name: userId,
      registration_ids: [token]
    };
  }

  await instance
    .post("https://fcm.googleapis.com/fcm/notification", body)
    .then(res => {
      console.log(`statusCode: ${res.statusCode}`);
      console.log(res);
      if (!groupKey) {
        newGroupKey = res.data.notification_key;
      }

      return true;
    })
    .catch(error => {
      console.error(error);
      console.log(error.response.data);
      throw error;
    });

  if (newGroupKey) {
    await userRef.update({ FCMGroupKey: newGroupKey });
  }
};

const sendNotificationForPuzzle = async (puzzleId, senderId, messageData) => {
  const puzzleRef = db.collection("puzzles").doc(puzzleId);
  const puzzle = (await puzzleRef.get()).data();
  let tasks = [];
  for (player of puzzle.playerIds) {
    if (player !== senderId) {
      console.log(`Sending notification to ${player}`);
      tasks.push(
        sendMessage({
          userId: player,
          puzzleId: puzzleId,
          messageData: messageData
        })
      );
    }
  }

  await Promise.all(tasks);
};

/**
 * When an invitation record gets created, this function adds a placeholder
 * player value to the puzzle and sends a notification to the recipient
 */
const sendMessage = async (data, context) => {
  let { userId, messageData } = data;

  const user = await db
    .collection("users")
    .doc(userId)
    .get();
  const token = user.data().FCMGroupKey;

  //const token = 'eggA5XgTAFmb7zYWQMMyy6:APA91bHyEZAyLHR4t6V17N6lVfpNzCayEkoCF9bR3JHO6qDcNoyE69FXurdL-Q-cbH0P37AzIILdoxmw_ZQzpz8v2oNapTuW43Lz4dN50v12CxJWHZPaQ_ZQ_6klxCa6Bu9G1OeLuH4t'
  var message = {
    data: messageData
  };

  console.log("preparing to send message");
  // Send a message to the device corresponding to the provided
  // registration token.
  await admin
    .messaging()
    .sendToDeviceGroup(token, message)
    .then(response => {
      // Response is a message ID string.
      console.log("Successfully sent message:", response);

      return response;
    })
    .catch(error => {
      console.log("Error sending message:", error);
    });
};

module.exports = {
  authOnCreate: functions.auth.user().onCreate(onCreateProfile),
  onCreateInvitation: functions.firestore
    .document("/invitations/{uid}")
    .onCreate(onCreateInvitation),
  onStartPuzzle: functions.firestore
    .document("/puzzles/{uid}")
    .onCreate(onStartPuzzle),
  acceptInvitation: functions.https.onCall(acceptInvitation),
  saveFcmToken: functions.https.onCall(saveFcmToken),
  sendMessage: functions.https.onCall(sendMessage),
  createInvitationLink: functions.https.onCall(createInvitationLink),
  connectInvitation: functions.https.onCall(connectInvitation),
  leaveGame: functions.https.onCall(leaveGame),
  updateCompletedWord: functions.https.onCall(updateCompletedWord),
  updatePlayerColor: functions.https.onCall(updatePlayerColor)
};
