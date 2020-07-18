import * as functions from 'firebase-functions';
import * as https from 'https';

export const iframely = functions.region('asia-northeast1').https.onCall(async (data) => {
  const URL = 'url=http://iframe.ly/ACcM3Y';
  const iframelyURL = 'https://iframe.ly/api/oembed?';
  // const api_key = '&api_key=';
  const req = https.request((iframelyURL + URL), (res) => {
    res.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
      console.log('No more data in response.');
    });
  })
  req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
  });
  req.end();
  return req;
});
