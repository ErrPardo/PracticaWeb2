const supertest = require('supertest')
const {app, server} = require('../index.js')
const mongoose = require('mongoose');
const UserModel=require('../models/users.js')

//test para los usuarios
const api = supertest(app);

var t=null
var t1=null

beforeAll(async () => {
    await new Promise((resolve) => mongoose.connection.once('connected', resolve));
})


describe('gets',()=>{
    beforeEach(async()=>{
        const result=await api.post('/api/users/register').send({
            "email": "nicolaila@gmail.com",
            "password": "password"
        })
        const result1=await api.post('/api/users/register').send({
            "email": "oscarinin@gmail.com",
            "password": "password",
            "estado":true
        })
        t=result.body.token
        t1=result.body.token
        await api.patch('/api/users/company')
        .set('Authorization', `Bearer ${t}`)
        
    })
    afterEach(async()=>{
        await UserModel.deleteMany({})
    })
    it('should return 200 if user found',async()=>{
        await api.get('/api/users')
        .set('Authorization', `Bearer ${t}`)
        .expect(200)
    })
    it(' should return 401 if no token is provided',async()=>{
        await api.get('/api/users/')
        .expect(401)
    })
    it('should return 403 if token is expired',async()=>{
        await api.get('/api/users')
        .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODAyMmJmOTViYTVjODZkNTAzNTQ2ZjMiLCJyb2xlIjpbInVzZXIiXSwiaWF0IjoxNzQ0OTcyNzk0LCJleHAiOjE3NDQ5Nzk5OTR9.ETdVXmlwxT0Smz9KW4iUtp_c6pboYreDMa5LNEFMfd8`)
        .expect(403)
    })
    it('should return 401 if user is not verified',async()=>{
        const email={
            "email":"nicolaila@gmail.com" 
        }
        await api.get('/api/users/verify').send(email)
        .expect(401)
    })
    it('should return verification code',async()=>{
        const email={
            "email":"oscarinin@gmail.com" 
          }
        await api.get('/api/users/verify').send(email)
        .expect(200)
    })
    it('should return 404 if user not found',async()=>{
        const email={
            "email":"a@gmail.com" 
          }
        await api.get('/api/users/verify').send(email)
        .expect(404)
    })
    
})
describe('posts',()=>{
    beforeEach(async()=>{
        const company={
            "company": {
                "name": "Servitop, SL.",
                "cif": "BXXXXXXXX",
                "street": "Carlos V",
                "number": 22,
                "postal": 28936,
                "city": "Móstoles",
                "province": "Madrid"
            }
        }
        const result=await api.post('/api/users/register').send({
            "email": "oscarinin@gmail.com",
            "password": "password",
            "estado":true
        })
        t=result.body.token
        await api.patch('/api/users/company').send(company)
        .set('Authorization', `Bearer ${t}`)
        
    })
    afterEach(async()=>{
        await UserModel.deleteMany({})
    })
    it('should return a user',async ()=>{
        const user={
            "email": "user@gmail.com",
            "password": "password"
        }
        await api.post('/api/users/register').send(user)
        .expect(200)
    })
    it('should return 409 if duplicate user',async()=>{
        const user={
            "email": "oscarinin@gmail.com",
            "password": "password"
        }
        await api.post('/api/users/register').send(user)
        .expect(409)
    })
    it('should return 403 if required fields are missing or invalid',async ()=>{
        const user={
            "email": "user@gmail.com",
        }
        await api.post('/api/users/register').send(user)
        .expect(403)
    })
    it('should return 404 if company not found',async()=>{
        const user={
            "name": "Manuel",
            "surnames": "Pérez Gómez",
            "email": "guest@gmail.com",
            "password":"password",
            "role":"guest",
            "company": {
                "name": "Servitop, SLU.",
                "cif": "BXXXXXXXX",
                "street": "España 2",
                "number": 22,
                "postal": 28936,
                "city": "Móstoles",
                "province": "Madrid"
            }
        }
        await api.post('/api/users/invite').send(user)
        .expect(404)
    })
    it('should return a invite user',async()=>{
        const user={
            "name": "Manuel",
            "surnames": "Pérez Gómez",
            "email": "guest@gmail.com",
            "password":"password",
            "role":"guest",
            "company": {
                "name": "Servitop, SL.",
                "cif": "BXXXXXXXX",
                "street": "Carlos V",
                "number": 22,
                "postal": 28936,
                "city": "Móstoles",
                "province": "Madrid"
            }
        }
        await api.post('/api/users/invite').send(user)
        .expect(200)
    })
    it('should return 403 if required fields are missing or invalid',async()=>{
        const user={
            "name": "Manuel",
            "email": "guest@gmail.com",
            "role":"guest",
            "company": {
                "name": "Servitop, SL.",
                "cif": "BXXXXXXXX",
                "street": "Carlos V",
                "number": 22,
                "postal": 28936,
                "city": "Móstoles",
                "province": "Madrid"
            }
        }
        await api.post('/api/users/invite').send(user)
        .expect(403)
    })
    it('should login a user',async()=>{
        const user={
            "email": "oscarinin@gmail.com",
            "password": "password"
        }
        await api.post('/api/users/login').send(user)
        .expect(200)
    })
    it('should return 404 if user not found',async()=>{
        const user={
            "email": "a@gmail.com",
            "password": "password"
        }
        await api.post('/api/users/login').send(user)
        .expect(404)
    })
    it('should return 403 if wrong password',async()=>{
        const user={
            "email": "oscarinin@gmail.com",
            "password": "newPassword"
        }
        await api.post('/api/users/login').send(user)
        .expect(403)
    })
    it('should return 403 if required fields are missing or invalid',async()=>{
        const user={
            "email": "oscarinin@gmail.com"
        }
        await api.post('/api/users/login').send(user)
        .expect(403)
    })
    it('should return recover token',async()=>{
        const user={
            "email":"oscarinin@gmail.com",
            "code":777255
        }
        await api.post('/api/users/login').send(user)
        .expect(200)
    })
})
describe('puts',()=>{

})
describe('patchs',()=>{

})
describe('deletes',()=>{

})

afterAll(async()=> {
    server.close()
    await mongoose.connection.close();
})