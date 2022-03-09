# read-csv-file-and-api-call-synchronous-nodejs

Script to read a CSV file with several lines and process each one in a synchronous way.

In that case, the script read a line, make an API call using Axios and then wait until each response is returned to generate a new CSV file.

## Read file

To open the file, the script use createReadStream to convert the file into a row stream.

```
    fs.createReadStream('input.csv').pipe(csv())
```

By default, csv dependency use , as separator. If you want to customize, you need to use the following code:

```
    fs.createReadStream('input.csv').pipe(csv({ separator: ';' }))
```

where separator indicates in that case a ; as separator for each column.

## Process row

To process each row the script use the event onData

```
    .on('data', async function (data) {
...
}
```

## Create a new CSV file after processing all rows
```
    .on("end", async () => {
        end = true;
        if (!queue.length && !paused) {
            stream.emit("finalEnd");
        }
    }).on("finalEnd", () => {
        console.log(dataArray.length)
        var result = parse(dataArray, Object.keys(dataArray[0]));
        fs.writeFileSync('output.csv', result);
    });
```
