const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = '';

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get('/', async (req, res) => {
    const cactiEndpoint = 'https://api.hubspot.com/crm/v3/objects/cacti?properties=cactus_name,height_of_cactus,species,name';
    const headers = {
      Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
      'Content-Type': 'application/json'
    }

    try {
      const response = await axios.get(cactiEndpoint, { headers });
      console.log('results of the call ', JSON.stringify(response.data, null, 2));
      const cacti = response.data.results;
      console.log('cactidetails:', JSON.stringify(cacti, null, 2));
      res.render('homepage', { cacti: cacti });
    } catch (error) {
      console.error(error);
    }
  })

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cacti', (req, res) => {
    try {
      res.render('updates', { pageTitle: 'Update Cacti Form | Integrating With HubSpot I Practicum' }); // Render the updates.pug template
    } catch (error) {
      console.error(error);
    }
  });

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/update-cacti', async (req, res) => {
    const cactiEndpoint = 'https://api.hubspot.com/crm/v3/objects/cacti';
    const headers = {
      Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
      'Content-Type': 'application/json'
    }
    const theproperties = {
      properties: {
        cactus_name: req.body.cactus_name,
        height_of_cactus: req.body.height_of_cactus,
        species: req.body.species,
        name: req.body.name
      }
    }
    try {
      const response = await axios.post(cactiEndpoint, theproperties, { headers });
      console.log('HubSpot Response:', JSON.stringify(response.data, null, 2));
      res.redirect('/'); // Redirects to home page
    } catch (error) {
      console.error(error);
    }
  });


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));