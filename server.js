const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sgMail = require('@sendgrid/mail');

const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => {
	res.send('Backend is running');
});
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.use(cors());
app.use(bodyParser.json());

app.post('/api/send-email', async (req, res) => {
	const { name, email, message } = req.body;

	const msg = {
		to: `${email}`,
		from: process.env.SENDER_EMAIL, // must be verified in SendGrid
		subject: `New Contact Form Submission from ${name}`,
		text: `Message from ${email}:\n\n${message}`
	};

	try {
		await sgMail.send(msg);
		res.status(200).json({ success: true, message: 'Email sent!' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: 'Email failed to send.' });
	}
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
