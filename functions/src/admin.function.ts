import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const addAdminClaim = functions
  .region('asia-northeast1')
  .firestore.document('admin/{id}')
  .onCreate(async (snap) => {
    const createdAdminUser = snap.data();
    if (createdAdminUser === undefined) {
      return;
    }
    return await modifyAdmin(createdAdminUser.uid, true);
  });

export const removeAdminClaim = functions
  .region('asia-northeast1')
  .firestore.document('admin/{id}')
  .onDelete(async (snap) => {
    const deletedAdminUser = snap.data();
    if (deletedAdminUser === undefined) {
      return;
    }
    return await modifyAdmin(deletedAdminUser.uid, false);
  });

async function modifyAdmin(uid: string, isAdmin: boolean): Promise<void> {
  return await admin.auth().setCustomUserClaims(uid, { admin: isAdmin });
}
