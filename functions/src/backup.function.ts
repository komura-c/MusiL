import * as functions from 'firebase-functions';

const config = functions.config();

const firestore = require('@google-cloud/firestore');
const client = new firestore.v1.FirestoreAdminClient();

const bucket = 'gs://' + config.project.project_id + '-backup';

export const backup = functions
  .region('asia-northeast1')
  .pubsub.schedule('1,15,27 of month 09:00')
  .onRun((_) => {
    const databaseName = client.databasePath(
      config.project.project_id,
      '(default)'
    );

    return client
      .exportDocuments({
        name: databaseName,
        outputUriPrefix: bucket,
        collectionIds: [],
      })
      .then((responses: any) => {
        const response = responses[0];
        functions.logger.info(response);
        return true;
      })
      .catch((err: any) => {
        functions.logger.error(err);
        throw new Error('Export operation failed');
      });
  });
