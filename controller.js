const { response } = require('./utils')
const axios = require('axios')
const moment = require('moment')
const { insertConversationData } = require('./model')
// const accessKey = 'AccessKey  BKaOCJsiiEian8mYUSvkchMMw'

const fetchDataConversation = async (offset,limit, count, accessKey) => {
    const data = {
        totalPage: 0,
        totalCount: offset,
        totalData: 0,
        dataPerPage: limit,
        items: []
    }
    let response = await axios.get(`https://conversations.messagebird.com/v1/conversations?offset=${offset}&limit=${limit}`, {headers: {
        "Content-Type": "application/json",
        "Authorization": accessKey
    }})
    .then(res => {
        data.totalData = res.data.totalCount
        data.totalPage =  Math.ceil(count/limit)
        data.items = res.data.items

            
        return data
    })
    .catch(err => {
        console.log(err)
    })

    return response
}

const fetchConversationDetail = async (data, accessKey) => {
    try {
        let response = []
   
        for(let i = 0; i < data.length ; i++){
            let resp = await loopDetailConversation(data[i], accessKey)

            resp.forEach(item => {
                response.push(item)
            })
        }

        return response
        
    } catch (error) {
        console.log(error)
    }
    
}

const loopDetailConversation = async (data, keys) => {

    let detailOffset = 0
    let count = 0
    let totalCount = 0
    let nextLoop = true
    let page = 1
    const datas = []
    while(nextLoop){
        const resp = await axios.get(`${data.messages.href}?offset=${detailOffset}&limit=20`, {headers: {
            "Content-Type": "application/json",
            "Authorization": keys
        }})

        count += resp.data.count
        totalCount = resp.data.totalCount
        page += 1
        detailOffset = (20 * page) - 20

        console.log(resp.data.totalCount)

        resp.data.items.forEach(item => {
            item.lastReceivedDatetime = data.lastReceivedDatetime
            datas.push(item)
        })

        if(count >= totalCount){
            nextLoop = false
        }
    }

    return datas
}

const getMessageFromMB = async (startData = 0,countData, filterDate = "", page = 1, AccessKey) => {
    let totalData = 0
    const dataPerPage = 20
    let currentPage = page
    let totalPage = 0
    let offset = startData
    let process = true
    let response = []
    let temp = []
    
    while(process){
        const data = await fetchDataConversation(offset,dataPerPage, countData, AccessKey)
        const details = await fetchConversationDetail(data.items, AccessKey)
        details.forEach(item => {
            let date = moment(item.lastReceivedDatetime).format("YYYY-MM-DD HH:mm:ss")
            let firstdata = moment(filterDate).format("YYYY-MM-DD")
            let mbDate = moment(item.lastReceivedDatetime).format("YYYY-MM-DD")
            if(filterDate != "") {
                if(mbDate >= firstdata) {
                    // if(item.type == "hsm"){
                        let conv = {
                            conversationId: item.conversationId,
                            to: item.to,
                            from: item.from,
                            channelId: item.channelId,
                            details: JSON.stringify(item),
                            status: item.status,
                            createdDatetime: date
                        }
                        response.push(conv)
                        temp.push(conv)
                    // }
                }else {
                    process = false
                }

            } else {
                if(item.type == "hsm"){
                    let conv = {
                        conversationId: item.conversationId,
                        messageId: item.id,
                        to: item.to,
                        from: item.from,
                        channelId: item.channelId,
                        details: JSON.stringify(item),
                        status: item.status,
                        createdDatetime: date
                    }
                    response.push(conv)
                    temp.push(conv)
                }
            }
        })
        console.log(`Page: ${currentPage}`)
        if(temp.length > 0){
            insertConversationData(temp)
            .then(result => {
                rows = result.affectedRows
                temp = []
                console.log(`Success Insert Conversation Status`)
                console.log(`Total Insert Data ${rows}`)
            })
            .catch(err => {
                console.log("Page Error :" + currentPage)
                process = false
                throw err
    
            })
        }
        currentPage += 1
        offset = (dataPerPage * currentPage) - dataPerPage
        totalPage = data.totalPage
        if(currentPage > totalPage){
            process = false
        }
    }
    
    return response

}

const fetchDataFromMessageBird = async (req, res) => {
    try {
        const {
          offset,
          totalData,
          dateFilter,
          accessKey,
          page
        } = req.body

        if(accessKey == ""){
            throw Error("Access Key is required")
        }
        
        const data = await getMessageFromMB(offset, totalData, dateFilter, page, accessKey)
        let message = `Success Insert Conversation Status`
        response(res, `Total Insert Data ${data.length}`, 200, message, null)
    } catch (error) {
        response(res, "hit from api", 500, "failed", null)
    }
}

const parsingDateTime = (value) => {
    let data = new Date(value)
    let year = data.getFullYear()
    let month = data.getMonth() + 1
    let day = data.getDate()
    let hour = data.getHours()
    let munite = data.getMinutes()
    let second = data.getSeconds()

    let fullYear = `${year}-${month > 12? month: '0'+month}-${day} ${hour}:${munite}:${second}`
    return fullYear
}

module.exports = {
    fetchDataFromMessageBird
}