const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient } = require('mongodb');

let infos = [];
let db = '';
app.use(cors());
app.use(express.json());
app.get('/infos', (req, res) => {res.json(infos);});
async function mongoConnect() {
  let client = new MongoClient('mongodb+srv://anshif:nesRoWgW5SqAD0yF@cluster0.8dtglzr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
  await client.connect();
  db = client.db('test');
 ;
}
app.get('/users', async function (req, res) {
  let output = await db.collection('user').find({}).toArray();
  res.json(output);
});
// app.post('/SignUp', async function(req, res) {
//   let output = await db.collection('infos').insertOne(req.body);
//   console.log(req.body);
//   user.push(output)
// })


// app.post('/SignUp', async (req, res) => {
//   console.log(req.body);
//   let output = await db.collection('infos').insertOne(req.body);
//   console.log(output);
//   // Adding the user to the local infos array
//   infos.push(req.body);
//   res.json({ success: true, message: 'User registered successfully' });
// });
app.post('/SignUp', async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  const output = await db.collection('user').insertOne(req.body);
  console.log(output);
  infos.push(req.body);
  res.json({ success: true, message: 'User registered successfully' });
});


app.post('/SignIn', (req, res) => {
  console.log(req.body);
  const user = infos.find(user => user.email === req.body.email);
  if (!user) {
    return res.json('email not found');
  }
  if (user.password !== req.body.password) {
    return res.json('password not found');
  }
  return res.json({ message: 'Login successful', user });
});
app.post('/Forget', (req, res) => {
  const { email, newPassword } = req.body;
  console.log(req.body);

  // Find user by email
  const user = infos.find(user => user.email === email);

  if (!user) {
    return res.json('email not found');
  }

  // Update the user's password
  user.password = newPassword;
  return res.json({ message: 'Password updated successfully' });
});
  app.listen(5000, () => {
  console.log('Server is ready, Listening on port 5000');
  mongoConnect();
});
