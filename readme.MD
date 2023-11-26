## Install Dependency
`npm install`

## Run Aplication
`npm start`

## Endpoint API
`http://localhost:4000/api/v1/conversation`

`Create new database in mysql server to store data`

## Field for database
`let conv = {
    conversationId: item.conversationId,
    to: item.to,
    from: item.from,
    channelId: item.channelId,
    details: JSON.stringify(item),
    status: item.status,
    createdDatetime: date
    // add some field from response mb API
}`

## curl API

`curl --location 'http://localhost:4000/api/v1/conversation' \
--header 'Content-Type: text/plain' \
--data '{
    "accessKey": "api_key_mb",
    "dateFilter": "2023-01-01", // to get spesific conversation date
    "offset": 0
}'`
