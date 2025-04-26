const supertest = require('supertest')
const {app, server} = require('../index.js')
const mongoose = require('mongoose');
const ClientModel=require('../models/client')
const UserModel=require('../models/users.js')
const ProjectModel=require('../models/projects.js')
const AlbaranModel=require('../models/albaran.js')

const api = supertest(app);
var t=null
var clientId=null
var projectId=null
var albaranId=null

beforeAll(async () => {
    await new Promise((resolve) => mongoose.connection.once('connected', resolve));
})

describe('Test without project,client',()=>{
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
        await ProjectModel.deleteMany({})
    })
    it('should return 404 if project not found',()=>{

    })
})

describe('Test with project,client',()=>{
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
        const project={
            "name": "Nombre del proyecto",
            "projectCode": "Id1",
            "address": {
                "street": "Carlos V",
                "number": 22,
                "postal": 28936,
                "city": "Móstoles",
                "province": "Madrid"
            },
            "code": "Código interno del proyecto",
            "clientId": clientId
        }
        const projectRes=await api.post('/api/projects').send(project)
        .set('Authorization', `Bearer ${t}`)
        projectId=projectRes.body._id
        const albaran={
            "clientId": "680a663528dc41e25a05b4e5",
            "projectId": "680a664d28dc41e25a05b4ea",
            "description": "Primer Albaran",
            "hours": 8,
            "format":"hours",
            "multi":[
            {
                "name":"Alright",
                "hours":2,
                "description":"cosas"
            }
            ]
        } 
        const resAlbaran=await api.post('/api/albaran').send(albaran)
        .set('Authorization', `Bearer ${t}`)
        albaranId=resAlbaran.body._id
    })
    afterEach(async()=>{
        await ClientModel.deleteMany({})
        await UserModel.deleteMany({})
        await ProjectModel.deleteMany({})
    })
    describe('gets',()=>{

    })
    describe('posts',()=>{

    })
    describe('delete',()=>{
        
    })
})


afterAll(async()=>{
    server.close()
    await mongoose.connection.close();
})