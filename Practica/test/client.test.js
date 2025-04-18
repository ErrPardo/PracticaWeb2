const supertest = require('supertest')
const {app, server} = require('../index.js')
const mongoose = require('mongoose');
const ClientModel=require('../models/client')
const UserModel=require('../models/users.js')



const api = supertest(app);
var t=null
var clientId=null
var clientIdArchive=null

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

it('should return 403 if token is expired',async()=>{
    await api.get('/api/client/')
    .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODAyMmJmOTViYTVjODZkNTAzNTQ2ZjMiLCJyb2xlIjpbInVzZXIiXSwiaWF0IjoxNzQ0OTcyNzk0LCJleHAiOjE3NDQ5Nzk5OTR9.ETdVXmlwxT0Smz9KW4iUtp_c6pboYreDMa5LNEFMfd8`)
    .expect(403)
})

it(' should return 401 if no token is provided',async()=>{
    await api.get('/api/client/')
    .expect(401)
})

it('should create a client',async()=>{
    const client={
        "name": "ACS",
        "cif": "D52921211",
        "address": {
          "street": "Carlos V",
          "number": 22,
          "postal": 28936,
          "city": "Móstoles",
          "province": "Madrid"
        }
    }
    res=await api.post('/api/client').send(client)
    .set('Authorization', `Bearer ${t}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

    clientId=res.body._id
})

it('should create a client',async()=>{
    const client={
        "name": "Eduardo",
        "cif": "D52921210",
        "address": {
          "street": "Carlos V",
          "number": 22,
          "postal": 28936,
          "city": "Móstoles",
          "province": "Madrid"
        }
    }
    res=await api.post('/api/client').send(client)
    .set('Authorization', `Bearer ${t}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

    clientIdArchive=res.body._id
})

it('should return 409 if client already exists',async()=>{
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
    .expect(409)
})

it('should return 403 if required fields are missing or invalid',async()=>{
    const client={
        "name": "ACS",
        "address": {
          "number": 22,
          "postal": 28936,
          "city": "Móstoles",
          "province": "Madrid"
        }
    }
    await api.post('/api/client').send(client)
    .set('Authorization', `Bearer ${t}`)
    .expect(403)
})


it('should get clients',async()=>{
    await api.get('/api/client/')
    .set('Authorization', `Bearer ${t}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)
})


it('should get clients',async()=>{
    await api.get(`/api/client/${clientId}`)
    .set('Authorization', `Bearer ${t}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

it('should delete a client',async()=>{
    await api.delete(`/api/client/${clientId}`)
    .set('Authorization', `Bearer ${t}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

it('should soft delete the resource by setting deleted to true',async()=>{
    await api.delete(`/api/client/archive/${clientIdArchive}`)
    .set('Authorization', `Bearer ${t}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)
    
})

it('should get clients with deleted true',async()=>{
    await api.get(`/api/client/archive/`)
    .set('Authorization', `Bearer ${t}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

it('should update the client by setting deleted to false',async()=>{
    await api.patch(`/api/client/restore/${clientIdArchive}`)
    .set('Authorization', `Bearer ${t}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

it('should put the client',async()=>{
    const body={
        "name": "ACS1",
        "cif": "D52921213",
        "address": {
          "street": "EDUARDO I",
          "number": 22,
          "postal": 28936,
          "city": "Móstoles",
          "province": "Madrid"
        }
    }
    await api.put(`/api/client/${clientIdArchive}`).send(body)
    .set('Authorization', `Bearer ${t}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

it('should return 403 if required fields are missing or invalid',async()=>{
    const body={
        "cif": "D52921213",
        "address": {
          "number": 22,
          "postal": 28936,
          "city": "Móstoles",
          "province": "Madrid"
        }
    }
    await api.put(`/api/client/${clientIdArchive}`).send(body)
    .set('Authorization', `Bearer ${t}`)
    .expect(403)
})


afterAll(async()=> {
    server.close()
    await mongoose.connection.close();
})