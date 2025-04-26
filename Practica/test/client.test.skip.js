const supertest = require('supertest')
const {app, server} = require('../index.js')
const mongoose = require('mongoose');
const ClientModel=require('../models/client')
const UserModel=require('../models/users.js')

const api = supertest(app);
var t=null
var clientId=null

//cambiar los test porque estan mal
//tienen que ser independiente cada uno de esos
//hacer todo el proceso con beforeeach y aftereach borrar todos los datos

beforeAll(async () => {
    await new Promise((resolve) => mongoose.connection.once('connected', resolve));
})

describe('Test without client',()=>{
    beforeEach(async()=>{
        const result=await api.post('/api/users/register').send({
            "email": "nicolaila@gmail.com",
            "password": "password"
        })
        t=result.body.token
        
    })
    afterEach(async()=>{
        await ClientModel.deleteMany({})
        await UserModel.deleteMany({})
    })
    it('should return 404 if client not found',async()=>{
        await api.get('/api/client/')
        .set('Authorization', `Bearer ${t}`)
        .expect(404)
    })
    
})

describe('Test with created client',()=>{
    beforeEach(async()=>{
        const result=await api.post('/api/users/register').send({
            "email": "nicolaila@gmail.com",
            "password": "password"
        })
        t=result.body.token
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
        const clientRes=await api.post('/api/client').send(client)
        .set('Authorization', `Bearer ${t}`)
        clientId=clientRes.body._id
        
    })
    afterEach(async()=>{
        await ClientModel.deleteMany({})
        await UserModel.deleteMany({})
    })
    describe('posts',()=>{
        it('should create a client',async()=>{
            const client={
                "name": "ACS2",
                "cif": "D52921212",
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
        })
        
        it('should return 409 if client already exists',async()=>{
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
        it(' should return 401 if no token is provided',async()=>{
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
            await api.post('/api/client/').send(client)
            .expect(401)
        })
        it(' should return 403 if token is expired',async()=>{
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
            await api.post('/api/client/').send(client)
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODAyMmJmOTViYTVjODZkNTAzNTQ2ZjMiLCJyb2xlIjpbInVzZXIiXSwiaWF0IjoxNzQ0OTcyNzk0LCJleHAiOjE3NDQ5Nzk5OTR9.ETdVXmlwxT0Smz9KW4iUtp_c6pboYreDMa5LNEFMfd8`)
            .expect(403)
        })
    })
    describe('gets',()=>{
        it('should get clients',async()=>{

            await api.get('/api/client/')
            .set('Authorization', `Bearer ${t}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        })
        it('should get a client',async()=>{

            await api.get(`/api/client/${clientId}`)
            .set('Authorization', `Bearer ${t}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        })
        it('should return 404 if client not found',async()=>{
            await api.get(`/api/client/68022c082f41b78e03477c99`)
            .set('Authorization', `Bearer ${t}`)
            .expect(404)
        })
        it('should get clients with deleted true',async()=>{
            await api.delete(`/api/client/archive/${clientId}`)
            .set('Authorization', `Bearer ${t}`)

            await api.get(`/api/client/archive/`)
            .set('Authorization', `Bearer ${t}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        })
        it('should return 404 if client not found in archive',async()=>{
            await api.get(`/api/client/archive/`)
            .set('Authorization', `Bearer ${t}`)
            .expect(404)
        })
        it(' should return 401 if no token is provided',async()=>{
            await api.get('/api/client/')
            .expect(401)
        })
        it(' should return 401 if no token is provided',async()=>{
            await api.get(`/api/client/${clientId}`)
            .expect(401)
        })
        it(' should return 401 if no token is provided',async()=>{
            await api.get(`/api/client/archive/`)
            .expect(401)
        })
        it('should return 403 if token is expired',async()=>{
            await api.get('/api/client/')
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODAyMmJmOTViYTVjODZkNTAzNTQ2ZjMiLCJyb2xlIjpbInVzZXIiXSwiaWF0IjoxNzQ0OTcyNzk0LCJleHAiOjE3NDQ5Nzk5OTR9.ETdVXmlwxT0Smz9KW4iUtp_c6pboYreDMa5LNEFMfd8`)
            .expect(403)
        })
        it('should return 403 if token is expired',async()=>{
            await api.get('/api/client/archive')
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODAyMmJmOTViYTVjODZkNTAzNTQ2ZjMiLCJyb2xlIjpbInVzZXIiXSwiaWF0IjoxNzQ0OTcyNzk0LCJleHAiOjE3NDQ5Nzk5OTR9.ETdVXmlwxT0Smz9KW4iUtp_c6pboYreDMa5LNEFMfd8`)
            .expect(403)
        })
        it('should return 403 if token is expired',async()=>{
            await api.get(`/api/client/${clientId}`)
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODAyMmJmOTViYTVjODZkNTAzNTQ2ZjMiLCJyb2xlIjpbInVzZXIiXSwiaWF0IjoxNzQ0OTcyNzk0LCJleHAiOjE3NDQ5Nzk5OTR9.ETdVXmlwxT0Smz9KW4iUtp_c6pboYreDMa5LNEFMfd8`)
            .expect(403)
        })
    })
    describe('deletes',()=>{
        it('should delete a client',async()=>{
            await api.delete(`/api/client/${clientId}`)
            .set('Authorization', `Bearer ${t}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        })
        
        it('should return 404 if client not found',async()=>{
            await api.delete(`/api/client/68022c082f41b78e03477c99`)
            .set('Authorization', `Bearer ${t}`)
            .expect(404)
        })
        
        it('should soft delete the resource by setting deleted to true',async()=>{
            await api.delete(`/api/client/archive/${clientId}`)
            .set('Authorization', `Bearer ${t}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
            
        })
        
        it('should return 404 if client not found',async()=>{
            await api.delete(`/api/client/archive/68022c082f41b78e03477c99`)
            .set('Authorization', `Bearer ${t}`)
            .expect(404)
        })

        it(' should return 401 if no token is provided',async()=>{
            await api.delete(`/api/client/${clientId}`)
            .expect(401)
        })
        it(' should return 401 if no token is provided',async()=>{
            await api.delete(`/api/client/archive/${clientId}`)
            .expect(401)
        })
        it('should return 403 if token is expired',async()=>{
            await api.delete(`/api/client/${clientId}`)
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODAyMmJmOTViYTVjODZkNTAzNTQ2ZjMiLCJyb2xlIjpbInVzZXIiXSwiaWF0IjoxNzQ0OTcyNzk0LCJleHAiOjE3NDQ5Nzk5OTR9.ETdVXmlwxT0Smz9KW4iUtp_c6pboYreDMa5LNEFMfd8`)
            .expect(403)
        })
        it('should return 403 if token is expired',async()=>{
            await api.delete(`/api/client/archive/${clientId}`)
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODAyMmJmOTViYTVjODZkNTAzNTQ2ZjMiLCJyb2xlIjpbInVzZXIiXSwiaWF0IjoxNzQ0OTcyNzk0LCJleHAiOjE3NDQ5Nzk5OTR9.ETdVXmlwxT0Smz9KW4iUtp_c6pboYreDMa5LNEFMfd8`)
            .expect(403)
        })
        
    })
    describe('puts',()=>{
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
            await api.put(`/api/client/${clientId}`).send(body)
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
            await api.put(`/api/client/${clientId}`).send(body)
            .set('Authorization', `Bearer ${t}`)
            .expect(403)
        })
        
        it('should return 404 if client not found',async()=>{
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
            await api.put(`/api/client/68022c082f41b78e03477c99`).send(body)
            .set('Authorization', `Bearer ${t}`)
            .expect(404)
        })
        it(' should return 401 if no token is provided',async()=>{
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
            await api.put(`/api/client/${clientId}`).send(body)
            .expect(401)
        })
        it('should return 403 if token is expired',async()=>{
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
            await api.put(`/api/client/${clientId}`).send(body)
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODAyMmJmOTViYTVjODZkNTAzNTQ2ZjMiLCJyb2xlIjpbInVzZXIiXSwiaWF0IjoxNzQ0OTcyNzk0LCJleHAiOjE3NDQ5Nzk5OTR9.ETdVXmlwxT0Smz9KW4iUtp_c6pboYreDMa5LNEFMfd8`)
            .expect(403)
        })
    })
    describe('patchs',()=>{
        it('should update the client by setting deleted to false',async()=>{
            await api.delete(`/api/client/archive/${clientId}`)
            await api.patch(`/api/client/restore/${clientId}`)
            .set('Authorization', `Bearer ${t}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        })
        
        it('should return 404 if client not found',async()=>{
            await api.patch(`/api/client/restore/68022c082f41b78e03477c99`)
            .set('Authorization', `Bearer ${t}`)
            .expect(404)
        })
        it('should return 401 if no token is provided',async()=>{
            await api.delete(`/api/client/archive/${clientId}`)
            .set('Authorization', `Bearer ${t}`)
            await api.patch(`/api/client/restore/${clientId}`)
            .expect(401)
        })
        it('should return 403 if token is expired',async()=>{
            await api.delete(`/api/client/archive/${clientId}`)
            .set('Authorization', `Bearer ${t}`)
            await api.patch(`/api/client/restore/${clientId}`)
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODAyMmJmOTViYTVjODZkNTAzNTQ2ZjMiLCJyb2xlIjpbInVzZXIiXSwiaWF0IjoxNzQ0OTcyNzk0LCJleHAiOjE3NDQ5Nzk5OTR9.ETdVXmlwxT0Smz9KW4iUtp_c6pboYreDMa5LNEFMfd8`)
            .expect(403)
        })
        
    })
})


afterAll(async()=> {
    server.close()
    await mongoose.connection.close();
})