const express = require('express');
const cors = require('cors');
let routes = require('./routes');

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());

app.use('/user', routes.user);
app.use('/message', routes.message);
app.use('/list', routes.whwlist);

app.listen(3000);