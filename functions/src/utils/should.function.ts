import * as admin from 'firebase-admin';

const db = admin.firestore();

export function markEventTried(eventId: string) {
  const documentRef = db.collection('functionEvents').doc(eventId);
  return documentRef.set({ tried: true });
}

const leaseTime = 60 * 1000;

export function shouldEventRun(eventId: string) {
  const documentRef = db.collection('functionEvents').doc(eventId);
  return db.runTransaction(async (transaction) => {
    const doc = await transaction.get(documentRef);
    const data = doc.data();
    if (doc.exists && data && data.tried) {
      return false;
    }
    if (doc.exists && data && new Date() < data.lease) {
      return Promise.reject('Lease already taken, try later.');
    }
    transaction.set(documentRef, {
      lease: new Date(new Date().getTime() + leaseTime),
    });
    return true;
  });
}
