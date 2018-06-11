import Express from 'express';
import Mailchimp from 'mailchimp-api-v3';
import * as BodyParser from 'body-parser';
import { MAILCHIMP_API_KEY, MAILCHIMP_LIST_ID } from './config';
console.log('KEY: ', MAILCHIMP_API_KEY);
const MAILCHIMP_API_BASE_URL = 'https://api.mailchimp.com';
const MAILCHIMP_ENDPOINT = `${MAILCHIMP_API_BASE_URL}/3.0/lists/${MAILCHIMP_LIST_ID}/members/`;

const mailchimp = new Mailchimp(MAILCHIMP_API_KEY);
const app = Express();

function handleEmail(email) {
  return new Promise((resolve, reject) => {
    mailchimp.post(`/lists/${MAILCHIMP_LIST_ID}/members`, {
      email_address: email.toLowerCase(),
      status: 'subscribed'
    }, function (err, result) {
      console.log('response: ', result, err);
      if (err && err.status) {
        resolve(err.status); // 400, 500, etc. 
      } else { 
        resolve(result.statusCode); // 200 
      }
    });
  });
}

app.use(BodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/api/mailchimp/', async function (req, res) {
  let email = req.body.email;
  console.log(req.body);
  if (!email) return;
  let result = await handleEmail(email) // .then(result => res.status(200).json({ status: result }));
  res.json({ status: result });
});

app.listen(3001, function () {
  console.log('Mailchimp API forwarder/subscriber listening on port 3001!')
});
