const supertest = require('supertest')
const email=require('../utils/handleEmail.js')

const spy = jest.spyOn(email, 'sendEmail').mockImplementation(()=>{
    return 684691
})

const pinata=require('../utils/handleUploadIPFS.js')

const spy2 = jest.spyOn(pinata, 'uploadToPinata').mockImplementation(()=>{
    return '67eaab50997e2bdeb769769b'
})

const {app, server} = require('../index.js')
const mongoose = require('mongoose');
const UserModel=require('../models/users.js')
const StorageModel=require('../models/storage.js')
const { tokenSign } = require('../utils/handleToken.js')

//test para los usuarios
const api = supertest(app);

var t=null

beforeAll(async () => {
    await new Promise((resolve) => mongoose.connection.once('connected', resolve));
})


describe('gets',()=>{
    beforeEach(async()=>{
        const user={
            "email": "nicolaila@gmail.com",
            "password": "password",
            "role": ["user"],
            "codigoAleatorio": 684691,
            "intentos": 0,
            "estado": false,
            "deleted": false
        }
        const result=await UserModel.create(user)
        result.set('password', undefined, { strict: false })
        t=await tokenSign(result)
        const user1={
            "email": "oscarinin@gmail.com",
            "password": "password1",
            "role": ["user"],
            "codigoAleatorio": 966496,
            "intentos": 0,
            "estado": true,
            "deleted": false
        }
        const result1=await UserModel.create(user1)
        result1.set('password', undefined, { strict: false })
        
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

        expect(spy).toHaveBeenCalled()
        spy.mockClear()
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
        const user={
            "email": "oscarinin@gmail.com",
            "password": "$2b$10$4e0QaIIMyeghzuPkfeQZa.WMPlOUUYTkYy2tbdIODw5v1Yn5/bKnS",
            "role": ["user"],
            "codigoAleatorio": 684691,
            "intentos": 0,
            "estado": true,
            "deleted": false
        }
        const result=await UserModel.create(user)
        t=await tokenSign(result)
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

        expect(spy).toHaveBeenCalled()
        spy.mockClear()
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

        expect(spy).toHaveBeenCalled()
        spy.mockClear()
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
            "code":684691
        }
        await api.post('/api/users/validation').send(user)
        .expect(200)
    })
    it('should return 404 if user not found',async()=>{
        const user={
            "email":"a@gmail.com",
            "code":684691
        }
        await api.post('/api/users/validation').send(user)
        .expect(404)
    })
    it('should return 403 if required fields are missing or invalid',async()=>{
        const user={
            "email":"oscarinin@gmail.com",
        }
        await api.post('/api/users/validation').send(user)
        .expect(403)
    })
})
describe('puts',()=>{
    beforeEach(async()=>{
        const user={
            "email": "nicolaila@gmail.com",
            "password": "password",
            "role": ["user"],
            "codigoAleatorio": 684691,
            "intentos": 0,
            "estado": false,
            "deleted": false
        }
        const result=await UserModel.create(user)
        result.set('password', undefined, { strict: false })
        t=await tokenSign(result)
        
    })
    afterEach(async()=>{
        await UserModel.deleteMany({})
    })
    it('should validate a user',async()=>{
        await api.put('/api/users/validation').send({"code":684691})
        .set('Authorization', `Bearer ${t}`)
        .expect(200)
    })
    it('should return 403 if max attemps reached',async()=>{
        await api.put('/api/users/validation').send({code:123455})

        await api.put('/api/users/validation').send({code:123455})

        await api.put('/api/users/validation').send({code:123455})

        await api.put('/api/users/validation').send({code:123455})
        .set('Authorization', `Bearer ${t}`)
        .expect(403)
    })
    it('should return 403 if wrong code',async()=>{
        await api.put('/api/users/validation').send({code:123455})
        .set('Authorization', `Bearer ${t}`)
        .expect(403)
    })
    it('should return 403 if token expired',async()=>{
        await api.put('/api/users/validation').send({code:123455})
        .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODAyMmJmOTViYTVjODZkNTAzNTQ2ZjMiLCJyb2xlIjpbInVzZXIiXSwiaWF0IjoxNzQ0OTcyNzk0LCJleHAiOjE3NDQ5Nzk5OTR9.ETdVXmlwxT0Smz9KW4iUtp_c6pboYreDMa5LNEFMfd8`)
        .expect(403)
    })
    it('should return 401 if no token is provided',async()=>{
        await api.put('/api/users/validation').send({"code":684691})
        .expect(401)
    })
    it('should modify a user',async()=>{
        const at={
            "email": "nicolaila@gmail.com",
            "name": "Nicolas",
            "surnames": "Calvo",
            "nif": "40000000W",
            "autonomo":true
          }
        await api.put('/api/users/register').send(at)
        .set('Authorization', `Bearer ${t}`)
        .expect(200)
    })
    it('should return 401 if no token is provided',async()=>{
        const at={
            "email": "nicolaila@gmail.com",
            "name": "Nicolas",
            "surnames": "Calvo",
            "nif": "40000000W",
            "autonomo":true
          }
        await api.put('/api/users/register').send(at)
        .expect(401)
    })
    it('should return 403 if token expired',async()=>{
        const at={
            "email": "nicolaila@gmail.com",
            "name": "Nicolas",
            "surnames": "Calvo",
            "nif": "40000000W",
            "autonomo":true
          }
        await api.put('/api/users/register').send(at)
        .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODAyMmJmOTViYTVjODZkNTAzNTQ2ZjMiLCJyb2xlIjpbInVzZXIiXSwiaWF0IjoxNzQ0OTcyNzk0LCJleHAiOjE3NDQ5Nzk5OTR9.ETdVXmlwxT0Smz9KW4iUtp_c6pboYreDMa5LNEFMfd8`)
        .expect(403)
    })
})
describe('patchs',()=>{
    beforeEach(async()=>{
        const user={
            "email": "nicolaila@gmail.com",
            "password": "password",
            "role": ["user"],
            "codigoAleatorio": 684691,
            "intentos": 0,
            "estado": false,
            "deleted": false
        }
        const result=await UserModel.create(user)
        result.set('password', undefined, { strict: false })
        t=await tokenSign(result)  
    })
    afterEach(async()=>{
        await UserModel.deleteMany({})
        await StorageModel.deleteMany({})
    })
    it('should update a user adding a company',async()=>{
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
        await api.patch('/api/users/company').send(company)
        .set('Authorization', `Bearer ${t}`)
        .expect(200)
    })
    it('should return 401 if no token is provided',async()=>{
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
        await api.patch('/api/users/company').send(company)
        .expect(401)
    })
    it('should return 403 if token is expired',async()=>{
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
        await api.patch('/api/users/company').send(company)
        .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODAyMmJmOTViYTVjODZkNTAzNTQ2ZjMiLCJyb2xlIjpbInVzZXIiXSwiaWF0IjoxNzQ0OTcyNzk0LCJleHAiOjE3NDQ5Nzk5OTR9.ETdVXmlwxT0Smz9KW4iUtp_c6pboYreDMa5LNEFMfd8`)
        .expect(403)
    })
    it('should return 403 if required fields are missing or invalid',async()=>{
        const company={
            "company": {
                "name": "Servitop, SL.",
                "street": "Carlos V",
                "number": 22,
                "postal": 28936,
                "province": "Madrid"
            }
        }
        await api.patch('/api/users/company').send(company)
        .set('Authorization', `Bearer ${t}`)
        .expect(403)
    })
    it('should return a user with address',async()=>{
        const ad={
            "address": {
              "street": "Carlos V",
              "number": 22,
              "postal": 28936,
              "city": "Móstoles",
              "province": "Madrid"
            }
        }
        await api.patch('/api/users/address').send(ad)
        .set('Authorization', `Bearer ${t}`)
        .expect(200)
    })
    it('should return 401 if no token is provided',async()=>{
        const ad={
            "address": {
              "street": "Carlos V",
              "number": 22,
              "postal": 28936,
              "city": "Móstoles",
              "province": "Madrid"
            }
        }
        await api.patch('/api/users/address').send(ad)
        .expect(401)
    })
    it('should return 403 if token is expired',async()=>{
        const ad={
            "address": {
              "street": "Carlos V",
              "number": 22,
              "postal": 28936,
              "city": "Móstoles",
              "province": "Madrid"
            }
        }
        await api.patch('/api/users/address').send(ad)
        .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODAyMmJmOTViYTVjODZkNTAzNTQ2ZjMiLCJyb2xlIjpbInVzZXIiXSwiaWF0IjoxNzQ0OTcyNzk0LCJleHAiOjE3NDQ5Nzk5OTR9.ETdVXmlwxT0Smz9KW4iUtp_c6pboYreDMa5LNEFMfd8`)
        .expect(403)
    })
    it('should return 403 if required fields are missing or invalid',async()=>{
        const ad={
            "address": {
              "number": 22,
              "postal": 28936,
              "province": "Madrid"
            }
        }
        await api.patch('/api/users/address').send(ad)
        .set('Authorization', `Bearer ${t}`)
        .expect(403)
    })
    it('should upload an image',async()=>{
        
        
        await api.patch('/api/users/logo')
        .set('Authorization', `Bearer ${t}`)
        .attach('image','./image.png')
        .expect(200)

        expect(spy2).toHaveBeenCalled()
        spy2.mockClear()
    })
    it('should return 401 if no token is provided',async()=>{
        await api.patch('/api/users/logo')
        .attach('image','./image.png')
        .expect(401)
    })
    it('should return 403 if token is expired',async()=>{
        await api.patch('/api/users/logo')
        .attach('image','./image.png')
        .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODAyMmJmOTViYTVjODZkNTAzNTQ2ZjMiLCJyb2xlIjpbInVzZXIiXSwiaWF0IjoxNzQ0OTcyNzk0LCJleHAiOjE3NDQ5Nzk5OTR9.ETdVXmlwxT0Smz9KW4iUtp_c6pboYreDMa5LNEFMfd8`)
        .expect(403)
    })
    
})
describe('deletes',()=>{
    beforeEach(async()=>{
        const result=await api.post('/api/users/register').send({
            "email": "oscarinin@gmail.com",
            "password": "password",
        })
        t=result.body.token
        
    })
    afterEach(async()=>{
        await UserModel.deleteMany({})
    })
    it('should soft delete a user',async()=>{
        await api.delete('/api/users?soft=true')
        .set('Authorization', `Bearer ${t}`)
        .expect(200)
    })
    it('should delete a user',async()=>{
        await api.delete('/api/users?soft=false')
        .set('Authorization', `Bearer ${t}`)
        .expect(200)
    })
    it('should return 403 if token is expired',async()=>{
       await api.delete('/api/users?soft=true')
        .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODAyMmJmOTViYTVjODZkNTAzNTQ2ZjMiLCJyb2xlIjpbInVzZXIiXSwiaWF0IjoxNzQ0OTcyNzk0LCJleHAiOjE3NDQ5Nzk5OTR9.ETdVXmlwxT0Smz9KW4iUtp_c6pboYreDMa5LNEFMfd8`)
        .expect(403)
    })
    it('should return 401 if no token is provided',async()=>{
        await api.delete('/api/users?soft=true')
        .expect(401)
    })
    
})

afterAll(async()=> {
    server.close()
    await mongoose.connection.close();
})