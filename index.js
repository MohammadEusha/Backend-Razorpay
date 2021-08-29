const app = require('express')()
const path = require('path')
const shortid = require('shortid')
const Razorpay = require('razorpay')
const cors = require('cors')
const bodyParser = require('body-parser')
const fs = require('fs');


app.use(cors())
app.use(bodyParser.json())

const razorpay = new Razorpay({
	key_id: 'rzp_test_VyHtTatQ09TDsY',
	key_secret: 'S4VtyFo7eeZ9Q2ghYW6cUOUM'
})

app.get('/icon.png', (req, res) => {
	res.sendFile(path.join(__dirname, 'icon.png'))
})

app.post('/verification', (req, res) => {
	// do a validation
	const secret = '12345678'

	console.log(req.body)

	const crypto = require('crypto')

	const shasum = crypto.createHmac('sha256', secret)
	shasum.update(JSON.stringify(req.body))
	const digest = shasum.digest('hex')

	console.log(digest, req.headers['x-razorpay-signature'])

	if (digest === req.headers['x-razorpay-signature']) {
		console.log('request is legit')
		// process it
		require('fs').writeFileSync('payment1.json', JSON.stringify(req.body, null, 4))
	} else {
		// pass it
	}
	res.json({ status: 'ok' })
})

// const stateForInfo = (data) => {
// 	let details = data
// 	// console.log("This is details =>", details.price);
// 	// app.get('/info', (req, res) => {
// 	// 	details.find({})
// 	// 		.toArray((err, documents) => {
// 	// 			res.send(documents)
// 	// 		})
// 	// })
// }

// let infos;


// app.post('/razorpay', (req, res) => {
// 	const newInfo = req.body
// 	// console.log(newInfo);
// 	infos = newInfo
// 	console.log("Customer", infos);

// })

// console.log(infos);


// app.get('/info', (req, res) => {


// })

app.post('/razorpay', async (req, res) => {
	// const newInfo = req.body
	// console.log("Total Cost =>", newInfo.totalCost);
	// console.log(req.body.ShippingDetails.email);
	const payment_capture = 1
	const amount = 500
	const currency = 'INR'
	// const name = req.body.ShippingDetails.name
	// console.log("name", name);

	const options = {
		amount: amount * 100,
		currency,
		receipt: shortid.generate(),
		payment_capture,

	}

	try {
		const response = await razorpay.orders.create(options)
		// console.log(response)
		res.json({

			currency: response.currency,
			amount: response.amount,
			id: response.id,

		})
	} catch (error) {
		console.log(error)
	}
})



app.listen(1337, () => {
	console.log('Listening on 1337')
})
