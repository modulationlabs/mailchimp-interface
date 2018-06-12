import express from 'express';
import Mailchimp from 'mailchimp-api-v3';
import * as BodyParser from 'body-parser';
import { MAILCHIMP_API_KEY, MAILCHIMP_LIST_ID } from './config';
const MAILCHIMP_API_BASE_URL = 'https://api.mailchimp.com';
const MAILCHIMP_ENDPOINT = `${MAILCHIMP_API_BASE_URL}/3.0/lists/${MAILCHIMP_LIST_ID}/members/`;

const mailchimp = new Mailchimp(MAILCHIMP_API_KEY);

const app = express();
const router = express.Router();

const handleEmail = (email) =>
	mailchimp.post(`/lists/${MAILCHIMP_LIST_ID}/members`, {
		email_address: email.toLowerCase(),
		status: 'subscribed'
	});

router.post('/mailchimp', (req, res) => {
	let { email } = req.body;
	if (!email) return res.send(500);
	handleEmail(email)
		.then(data => {
			console.log('data');
			res.status(200).send({ success: true, data });
		}, error => { 
			console.log('err');
			res.status(200).send({ success: false, error });
		})
		.catch(error => {
			console.log('caught err');
			res.status(200).send({ success: false, error });
		});
});

router.get('/', (req, res) => {
	res.status(200).send({ success: true });
});

app.use(BodyParser.json());

app.use('/api', router);

app.listen(3001, function () {
	console.log('Mailchimp API middleware listening on port 3001.')
});
