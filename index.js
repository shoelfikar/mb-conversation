const { response } = require('./utils')
const axios = require('axios')
const moment = require('moment')
const { insertConversationData } = require('./model')
const accessKey = 'AccessKey '

const fetchDataConversation = async (offset,limit) => {
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
        data.totalPage =  Math.ceil(900/limit)
        data.items = res.data.items
            
        return data
    })
    .catch(err => {
        console.log(err)
    })

    return response
}

const fetchConversationDetail = async (data) => {
    try {
        let response = []
        for(let i = 0; i < data.length ; i++){

            console.log(`conversation_id: ${data[i].id}`)

            const resp = await axios.get(`${data[i].messages.href}`, {headers: {
                        "Content-Type": "application/json",
                        "Authorization": accessKey
            }})

            resp.data.items.forEach(item => {
                response.push(item)
            })
            
        }

        return response
        
    } catch (error) {
        console.log(error)
    }
    
}

const getMessageFromMB = async () => {
    let totalData = 0
    const dataPerPage = 20
    let currentPage = 1
    let totalPage = 0
    let process = true
    let response = []
    let temp = []
    let count = 0
    
    while(process){
        const data = await fetchDataConversation(currentPage,dataPerPage)
        const details = await fetchConversationDetail(data.items, currentPage)
        details.forEach(item => {
            let date = moment(item.createdDatetime).format("YYYY-MM-DD HH:mm:ss")
            let firstdata = moment().format("YYYY-MM-DD")
            let mbDate = moment(item.lastReceivedDatetime).format("YYYY-MM-DD")
            if(item.type == "hsm" && firstdata == mbDate){
                console.log(date)
                let conv = {
                    conversationId: item.conversationId,
                    to: item.to,
                    from: item.from,
                    channelId: item.channelId,
                    templateName: item.content.hsm.templateName,
                    status: item.status,
                    createdDatetime: date
                }
                response.push(conv)
                temp.push(conv)
                count += 1
            }
        })
        console.log(`Page: ${currentPage}`)
        console.log(count)
        currentPage += 1
        totalPage = data.totalPage
        if(currentPage > totalPage){
            process = false
        }
    }
    
    return response

}

getMessageFromMB()

// const fetchDataFromMessageBird = async (req, res) => {
//     try {
//         const {
//           page,
//           limit
//         } = req.body
        
//         const data = await getMessageFromMB(page, limit)
//         let message = `Success Insert Conversation Status`
//         response(res, `Total Insert Data ${data.length}`, 200, message, null)
//     } catch (error) {
//         console.log(error)
//         response(res, "hit from api", 500, "failed", null)
//     }
// }

// module.exports = {
//     fetchDataFromMessageBird
// }