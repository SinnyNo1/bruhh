const axios = require('axios')

function CurrentTime() {
    return new Date().getTime() / 1000
}

// DATA \\
let queue = {}
let cd = {}
let host_client

// EXPRESS \\ 
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    var q = req.query
    if (q.a && q.b) {
        axios.get('https://users.roblox.com/v1/users/'+q.a).then(async resp => {
            var data = resp.data
            if (data.name == q.b) {
                if (cd[q.a] && CurrentTime()-cd[q.a] < 300) {return res.send("cd: "+((cd[q.a]+300)-CurrentTime()))}
                await host_client.send("new server|"+q.a)
                cd[q.a] = CurrentTime()
                queue[q.a] = false
                var interval = setInterval(function() {
                    if (queue[q.a] != false) {
                        res.send(queue[q.a])
                        queue[q.a] = null
                        clearInterval(interval)
                    }
                }, 500)
            } else {
                res.send("???")
            }
        }).catch(err => {
            console.log(err)
            res.send("???")
        })
    } else {
        res.send("???")
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

// WEBSOCKET \\ 
const WebSocketServer = require('ws')
const wss = new WebSocketServer.Server({ port: 8888 })

wss.on('connection', async (client,req) => {
    client.on('message', async (data) => {
        data = data.toString()
        if (data == "start n3k0") {
            host_client = client
            cd = {}
            queue = {}
        } else if (data.includes("code: ")) {
            code = data.split(" ")[1]
            id = data.split(" ")[2]
            queue[id] = code
        } else {
            client.close()
        }
    })
})
