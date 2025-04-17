const supertest = require('supertest')
const {app, server} = require('../index.js')
const mongoose = require('mongoose');
const ClientModel=require('../models/client')
const UserModel=require('../models/users.js')

const api = supertest(app);
var t=null

beforeAll(async () => {
    await new Promise((resolve) => mongoose.connection.once('connected', resolve));
    await ClientModel.deleteMany({})
    await UserModel.deleteMany({})
    const result=await api.post('/api/users/register').send({
        "email": "nicolaila@gmail.com",
        "password": "password"
    })
    t=result.body.token
});


it('should create a client',async()=>{
    const client={
        "name": "ACS",
        "cif": "D52921210",
        "address": {
          "street": "Carlos V",
          "number": 22,
          "postal": 28936,
          "city": "Móstoles",
          "province": "Madrid"
        }
    }
    await api.post('/api/client').send(client)
    .set('Authorization', `Bearer ${t}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

it('should return 422 if client already exists',async()=>{
    const client={
        "name": "ACS",
        "cif": "D52921210",
        "address": {
          "street": "Carlos V",
          "number": 22,
          "postal": 28936,
          "city": "Móstoles",
          "province": "Madrid"
        }
    }
    await api.post('/api/client').send(client)
    .set('Authorization', `Bearer ${t}`)
    .expect(422)
})

afterAll(async()=> {
    server.close()
    await mongoose.connection.close();
})