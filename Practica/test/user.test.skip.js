/*const supertest = require('supertest')
const {app, server} = require('../index.js')
const mongoose = require('mongoose');
const UserModel=require('../models/users.js')

//test para los usuarios
const api = supertest(app);

beforeAll(async () => {
    await new Promise((resolve) => mongoose.connection.once('connected', resolve));
    await UserModel.deleteMany({})
    UserModel.create()
});


it('should get all users', async () => {
    await api.get('/api/users/allUsers')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

it('should get the current user with token',async()=>{
    const user={
        "email": "nicolaila@gmail.com",
        "password": "password"
    }
    await api.post('/api/users/register').send(user)

    const res=await api.post('/api/users/login').send(user)
    const token=`Bearer ${res.body.token}`

    await api.get('/api/users')
    .set('Authorization', token)
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

it('should update a user',async()=>{
    const user={
        "email": "eduardo@gmail.com",
        "password": "password"
    }
    const res=await api.post('/api/users/register').send(user)
    console.log(res)
    const code={"code":res.body.codigoAleatorio}

    const res1=await api.post('/api/users/login').send(user)
    const token=`Bearer ${res1.body.token}`

    await api.put('/api/users/validation')
    .set('Authorization',token)
    .send(code)
    .expect(200)
    .expect('Content-Type', /application\/json/)

})

afterAll(async()=> {
    server.close()
    await mongoose.connection.close();
})*/