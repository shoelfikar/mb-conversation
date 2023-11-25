## Install Dependency
`npm install`

## Run Aplication
`npm start`

## Endpoint API
`http://localhost:4000/api/v1/conversation`

`Create new database in mysql server to store data`

## curl API

`curl --location 'http://localhost:4000/api/v1/conversation' \
--header 'Content-Type: text/plain' \
--data '{
    "accessKey": "api_key_mb",
    "dateFilter": "2023-01-01", // to get spesific conversation date
    "offset": 0
}'`
