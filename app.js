const { Datastore } = require('@google-cloud/datastore');
const express = require('express');

const app = express();
const kind = 'Customer_Data';
const datastore = new Datastore({
    projectId: 'custproj-220919',
    keyFilename: 'key.json'
});

app.get('/', function (request, response) {
    return response
        .status(200)
        .send('The API endpoints are "/getCustomers" for fetching all customers and "/getCustomer/:id" for fetching customer specific details! Lycka till');
});

app.get('/getCustomers', function (request, response) {
    let query = datastore
        .createQuery([kind])
        .order('customer_id');
    query.run(function (error, custData) {
        if (custData.length == 0) {
            return response
                .status(200)
                .send('Customer data NOT available !');
        }
        else {
            return response
                .status(200)
                .send(custData);
        }
    });
});

app.get('/getCustomer/:customer_id', function (request, response) {
    const customerId = parseInt(request.params.customer_id);
    let query = datastore
        .createQuery([kind])
        .order('customer_id');
    query.run(function (error, custData) {        
        var custDisplay = custData.find(item => parseInt(item.customer_id) === customerId);
          if (!custDisplay) {
              return response
                  .status(200)
                  .send("Customer NOT found");
          }
          else {
              return response
                  .status(200)
                  .send(custDisplay.customer_name);
          }
    });
});

const PORT = process.env.PORT || 8080;
app.listen(process.env.PORT || 8080, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});
module.exports = app;
