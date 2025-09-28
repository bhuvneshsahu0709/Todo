const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TodoModel = require('./models/Todo');

const app = express();
app.use(cors());
app.use(express.json());

// Ensure Express routes work when deployed under Vercel's /api prefix
app.use((req, res, next) => {
  if (req.url.startsWith('/api/')) {
    req.url = req.url.replace(/^\/api/, '');
  }
  next();
});

const mongoUri = process.env.MONGO_URI || 'mongodb+srv://bhuvnesh:bhuvi@cluster0.nm7zbfj.mongodb.net/TODO';
mongoose
  .connect(mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error', err));

if (!process.env.VERCEL) {
  app.listen(5000, () => {
    console.log('Server listening on port: 5000');
  });
}

app.post('/add', (req, res) => {
  const { task } = req.body;
  TodoModel.create({ task })
      .then(result => res.json(result))
      .catch(err => console.log(err));
   
});

app.get('/get',(req,res)=>{
  TodoModel.find()
  .then(result=> res.json(result))
  .catch(err=>console.log(err));
});
  
app.put('/edit/:id',(req,res)=>{
  const{id} = req.params;
  TodoModel.findByIdAndUpdate(id,{done:true},{new:true})
  .then(result=> res.json(result))
  .catch(err=>res.json(err));
 });

app.put('/update/:id',(req,res)=>{
  const{id} = req.params;
  const{task} = req.body;
  TodoModel.findByIdAndUpdate(id,{task:task})
  .then(result=> res.json(result))
  .catch(err=>res.json(err));
 });

app.delete('/delete/:id',(req,res)=>{
  const{id} = req.params;
  TodoModel.findByIdAndDelete({_id:id})
  .then(result=> res.json(result))
  .catch(err=>res.json(err));
 }); 

module.exports=app;

// RESTful routes per assessment
app.post('/todos', (req, res) => {
  const { task, done } = req.body;
  const payload = { task };
  if (typeof done === 'boolean') payload.done = done;
  TodoModel.create(payload)
    .then((result) => res.json(result))
    .catch((err) => res.status(400).json({ error: err.message }));
});

app.get('/todos', (req, res) => {
  TodoModel.find()
    .then((result) => res.json(result))
    .catch((err) => res.status(500).json({ error: err.message }));
});

app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const update = {};
  if (typeof req.body.task === 'string') update.task = req.body.task;
  if (typeof req.body.done === 'boolean') update.done = req.body.done;
  if (Object.keys(update).length === 0) {
    return res.status(400).json({ error: 'No valid fields to update' });
  }
  TodoModel.findByIdAndUpdate(id, update, { new: true })
    .then((result) => res.json(result))
    .catch((err) => res.status(400).json({ error: err.message }));
});

app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  TodoModel.findByIdAndDelete(id)
    .then((result) => res.json(result))
    .catch((err) => res.status(400).json({ error: err.message }));
});
