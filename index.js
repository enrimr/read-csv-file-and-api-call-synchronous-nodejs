'use strict'

const https = require('https');
const csv = require('csv-parser');
const fs = require('fs');
const axios = require('axios').default;
var { parse } = require('json2csv');

let paused = false;
const queue = [];
let end = false;
var dataArray = [];

//process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'; // Only for development mode
// You can also use
// const instance = axios.create({
//     baseURL: 'https://yourresource.com',
//     timeout: 1000,
//     httpsAgent: new https.Agent({  
//         rejectUnauthorized: false
//     })
//   });
  
async function getData(pan) {
    return await axios.get('https://yourresuorce.com').then(function (response) {
        // handle success
        return response.data
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    });
} 

const stream = fs.createReadStream('input.csv')
    .pipe(csv({ separator: ';' }))
    .on("error", (error) => {
        throw error.message;
    })
    .on("data", async (row) => {
        queue.push(row);
        if (!paused) {
            stream.pause();
            paused = true;
            while (queue.length) {
                try {
                    await processRow(queue.shift());
                } catch (e) {
                    // decide what to do here if you get an error processing a row
                    console.log(e);
                }
            }
            paused = false;
            stream.resume();
            if (end) {
                stream.emit("finalEnd");
            }
        }

        async function processRow(data) {
            console.log(data);

            const result = await getData(data);
          
            // TODO: Edit or modify your row data if needed
          
            dataArray.push(data);
        }

    })
    .on("end", async () => {
        end = true;
        if (!queue.length && !paused) {
            stream.emit("finalEnd");
        }
    }).on("finalEnd", () => {
        //console.log("ENDDD ---->", dataArray)
        console.log(dataArray.length)
        var result = parse(dataArray, Object.keys(dataArray[0]));
        fs.writeFileSync('output.csv', result);
    });
