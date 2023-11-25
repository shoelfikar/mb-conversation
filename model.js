const mysql = require('./db')

const insertConversationData = (data) => {

    const payload = []

    data.forEach(item => {
        const detailData = Object.values(item)
        payload.push(detailData)
    })

    return new Promise((resolve, reject) => {
        mysql.beginTransaction(function(err)  {
            if(err) {throw err}

            mysql.query('INSERT INTO mb_status_conversation (`conversation_id`, `to`, `from`, `channel_id`, `details`, `status`, `created_datetime`) VALUES ?', [payload], (err, result) => {
              if(!err) {
                resolve(result)
                mysql.commit()
              }else{
                mysql.rollback()
                reject(new Error(err))
              }
            })  
        })
        
      })

}

module.exports = {insertConversationData}