const express = require('express')
const sqlite3 = require('sqlite3')

const db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    console.error(err)
  }
  console.log('Database connection is success')
})

db.run('CREATE TABLE storage (personName TEXT)', [], function (err) {
  if (err) {
    console.error(err)
  }
  console.log('Create table successfully')
})

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/person/:personName', (req, res) => {
  db.serialize(() => {
    db.run(`INSERT INTO storage (personName) VALUES (?)`, [req.params.personName], function (err) {
      if (err) {
        console.error(err)
      }
      console.log('Insert data successfully')
    })
    db.all('SELECT * FROM storage', [], function (err, rows) {
      if (err) {
        console.error(err)
      }
      console.log(rows)
    })
  })
  res.send(req.params)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})