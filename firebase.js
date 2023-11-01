const express = require('express');
const app = express();
const axios = require('axios');

const databaseURL = 'https://mqtt-dashboard-1-default-rtdb.europe-west1.firebasedatabase.app/';
const topic = 'topic/MQTTx/1';

function writeToDatabase() {
  const currentDate = new Date();
  const dateTime = currentDate.toISOString(); // Convert the date to a string in ISO format

  const data = {
    datetime: dateTime,
  };

  const config = {
    method: 'post',
    url: `${databaseURL}${topic}.json`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(data),
  };

  axios
    .request(config)
    .then((response) => {
      console.log('Data written to the database:', JSON.stringify(response.data));

      app.get('/write', (req, res) => {
        res.send('Data written to the database:' + JSON.stringify(response.data));
      });
    })
    .catch((error) => {
      console.error('Error writing to the database:', error);
    });
}

// Set up an HTTP route to check if the server is running
app.get('/', (req, res) => {
  res.send('Server is running.');
});

// Start the Express HTTP server on a port
const serverPort = process.env.PORT || 8080;
app.listen(serverPort, () => {
  console.log(`Server listening on port ${serverPort}`);
});

// Call the function to write date and time to the database every 5 seconds
setInterval(writeToDatabase, 5000); // 5000 milliseconds = 5 seconds
