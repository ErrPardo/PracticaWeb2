const supertest = require('supertest')
const {app, server} = require('../index.js')
const mongoose = require('mongoose');
const ClientModel=require('../models/client')
const UserModel=require('../models/users.js')
const ProjectModel=require('../models/projects.js')

const api = supertest(app);
var t=null
var clientId=null
var projectId=null

//cambiar los test porque estan mal
//tienen que ser independiente cada uno de esos
//hacer todo el proceso con beforeeach y aftereach borrar todos los datos

beforeAll(async () => {
    await new Promise((resolve) => mongoose.connection.once('connected', resolve));
})

describe('Test without client and project',()=>{
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
    it('should return 404 if project not found',async()=>{
        await api.get('/api/projects/')
        .set('Authorization', `Bearer ${t}`)
        .expect(404)
    })
    
})

describe('Test with created client and project',()=>{
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
    })
    afterEach(async()=>{
        await ClientModel.deleteMany({})
        await UserModel.deleteMany({})
        await ProjectModel.deleteMany({})
    })
    describe('posts',()=>{
        it('should create a project',async()=>{
            const project={
                "name": "Nombre del proyecto",
                "projectCode": "Id2",
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
            res=await api.post('/api/projects').send(project)
            .set('Authorization', `Bearer ${t}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        })
        
        it('should return 409 if project already exists',async()=>{
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
            await api.post('/api/projects').send(project)
            .set('Authorization', `Bearer ${t}`)
            .expect(409)
        })
        
        it('should return 403 if required fields are missing or invalid',async()=>{
            const project={
                "name": "Nombre del proyecto",
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
            await api.post('/api/projects').send(project)
            .set('Authorization', `Bearer ${t}`)
            .expect(403)
        })
        it('should return 404 if client not found',async()=>{
            const project={
                "name": "Nombre del proyecto",
                "projectCode": "Id2",
                "address": {
                    "street": "Carlos V",
                    "number": 22,
                    "postal": 28936,
                    "city": "Móstoles",
                    "province": "Madrid"
                },
                "code": "Código interno del proyecto",
                "clientId": "680a663528dc41e25a05b4e5"
            }
            await api.post('/api/projects').send(project)
            .set('Authorization', `Bearer ${t}`)
            .expect(404)
        })
        it(' should return 401 if no token is provided',async()=>{
            const project={
                "name": "Nombre del proyecto",
                "projectCode": "Id2",
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
            await api.post('/api/projects/').send(project)
            .expect(401)
        })
        it(' should return 403 if token is expired',async()=>{
            const project={
                "name": "Nombre del proyecto",
                "projectCode": "Id2",
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
            await api.post('/api/projects/').send(project)
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODAyMmJmOTViYTVjODZkNTAzNTQ2ZjMiLCJyb2xlIjpbInVzZXIiXSwiaWF0IjoxNzQ0OTcyNzk0LCJleHAiOjE3NDQ5Nzk5OTR9.ETdVXmlwxT0Smz9KW4iUtp_c6pboYreDMa5LNEFMfd8`)
            .expect(403)
        })
    })
    describe('gets',()=>{
        it('should get projects',async()=>{

            await api.get('/api/projects/')
            .set('Authorization', `Bearer ${t}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        })
        it('should get a project',async()=>{

            await api.get(`/api/projects/${projectId}`)
            .set('Authorization', `Bearer ${t}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        })
        it('should return 404 if project not found',async()=>{
            await api.get(`/api/projects/68022c082f41b78e03477c99`)
            .set('Authorization', `Bearer ${t}`)
            .expect(404)
        })
        it('should get projects with deleted true',async()=>{
            await api.delete(`/api/projects/archive/${projectId}`)
            .set('Authorization', `Bearer ${t}`)

            await api.get(`/api/projects/archive/`)
            .set('Authorization', `Bearer ${t}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        })
        it('should return 404 if project not found in archive',async()=>{
            await api.get(`/api/projects/archive/`)
            .set('Authorization', `Bearer ${t}`)
            .expect(404)
        })
        it(' should return 401 if no token is provided',async()=>{
            await api.get('/api/projects/')
            .expect(401)
        })
        it(' should return 401 if no token is provided',async()=>{
            await api.get(`/api/projects/${projectId}`)
            .expect(401)
        })
        it(' should return 401 if no token is provided',async()=>{
            await api.get(`/api/projects/archive/`)
            .expect(401)
        })
        it('should return 403 if token is expired',async()=>{
            await api.get('/api/projects/')
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODAyMmJmOTViYTVjODZkNTAzNTQ2ZjMiLCJyb2xlIjpbInVzZXIiXSwiaWF0IjoxNzQ0OTcyNzk0LCJleHAiOjE3NDQ5Nzk5OTR9.ETdVXmlwxT0Smz9KW4iUtp_c6pboYreDMa5LNEFMfd8`)
            .expect(403)
        })
        it('should return 403 if token is expired',async()=>{
            await api.get('/api/projects/archive')
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODAyMmJmOTViYTVjODZkNTAzNTQ2ZjMiLCJyb2xlIjpbInVzZXIiXSwiaWF0IjoxNzQ0OTcyNzk0LCJleHAiOjE3NDQ5Nzk5OTR9.ETdVXmlwxT0Smz9KW4iUtp_c6pboYreDMa5LNEFMfd8`)
            .expect(403)
        })
        it('should return 403 if token is expired',async()=>{
            await api.get(`/api/projects/${projectId}`)
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODAyMmJmOTViYTVjODZkNTAzNTQ2ZjMiLCJyb2xlIjpbInVzZXIiXSwiaWF0IjoxNzQ0OTcyNzk0LCJleHAiOjE3NDQ5Nzk5OTR9.ETdVXmlwxT0Smz9KW4iUtp_c6pboYreDMa5LNEFMfd8`)
            .expect(403)
        })
    })
    describe('deletes',()=>{
        it('should delete a project',async()=>{
            await api.delete(`/api/projects/${projectId}`)
            .set('Authorization', `Bearer ${t}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        })
        
        it('should return 404 if project not found',async()=>{
            await api.delete(`/api/projects/68022c082f41b78e03477c99`)
            .set('Authorization', `Bearer ${t}`)
            .expect(404)
        })
        
        it('should soft delete the resource by setting deleted to true',async()=>{
            await api.delete(`/api/projects/archive/${projectId}`)
            .set('Authorization', `Bearer ${t}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
            
        })
        
        it('should return 404 if project not found',async()=>{
            await api.delete(`/api/projects/archive/68022c082f41b78e03477c99`)
            .set('Authorization', `Bearer ${t}`)
            .expect(404)
        })

        it(' should return 401 if no token is provided',async()=>{
            await api.delete(`/api/projects/${projectId}`)
            .expect(401)
        })
        it(' should return 401 if no token is provided',async()=>{
            await api.delete(`/api/projects/archive/${projectId}`)
            .expect(401)
        })
        it('should return 403 if token is expired',async()=>{
            await api.delete(`/api/projects/${projectId}`)
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODAyMmJmOTViYTVjODZkNTAzNTQ2ZjMiLCJyb2xlIjpbInVzZXIiXSwiaWF0IjoxNzQ0OTcyNzk0LCJleHAiOjE3NDQ5Nzk5OTR9.ETdVXmlwxT0Smz9KW4iUtp_c6pboYreDMa5LNEFMfd8`)
            .expect(403)
        })
        it('should return 403 if token is expired',async()=>{
            await api.delete(`/api/projects/archive/${projectId}`)
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODAyMmJmOTViYTVjODZkNTAzNTQ2ZjMiLCJyb2xlIjpbInVzZXIiXSwiaWF0IjoxNzQ0OTcyNzk0LCJleHAiOjE3NDQ5Nzk5OTR9.ETdVXmlwxT0Smz9KW4iUtp_c6pboYreDMa5LNEFMfd8`)
            .expect(403)
        })
        
    })
    describe('puts',()=>{
        it('should put the project',async()=>{
            const body={
                "name": "Pardo Project",
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
            await api.put(`/api/projects/${projectId}`).send(body)
            .set('Authorization', `Bearer ${t}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        })
        
        it('should return 403 if required fields are missing or invalid',async()=>{
            const body={
                "name": "Pardo Project",
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
            await api.put(`/api/projects/${projectId}`).send(body)
            .set('Authorization', `Bearer ${t}`)
            .expect(403)
        })
        
        it('should return 404 if project not found',async()=>{
            const body={
                "name": "Pardo Project",
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
            await api.put(`/api/projects/68022c082f41b78e03477c99`).send(body)
            .set('Authorization', `Bearer ${t}`)
            .expect(404)
        })
        it('should return 404 if client not found',async()=>{
            const project={
                "name": "Nombre del proyecto",
                "projectCode": "Id2",
                "address": {
                    "street": "Carlos V",
                    "number": 22,
                    "postal": 28936,
                    "city": "Móstoles",
                    "province": "Madrid"
                },
                "code": "Código interno del proyecto",
                "clientId": "680a663528dc41e25a05b4e5"
            }
            await api.put(`/api/projects/${projectId}`).send(project)
            .set('Authorization', `Bearer ${t}`)
            .expect(404)
        })
        it(' should return 401 if no token is provided',async()=>{
            const body={
                "name": "Pardo Project",
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
            await api.put(`/api/projects/${projectId}`).send(body)
            .expect(401)
        })
        it('should return 403 if token is expired',async()=>{
            const body={
                "name": "Pardo Project",
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
            await api.put(`/api/projects/${projectId}`).send(body)
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODAyMmJmOTViYTVjODZkNTAzNTQ2ZjMiLCJyb2xlIjpbInVzZXIiXSwiaWF0IjoxNzQ0OTcyNzk0LCJleHAiOjE3NDQ5Nzk5OTR9.ETdVXmlwxT0Smz9KW4iUtp_c6pboYreDMa5LNEFMfd8`)
            .expect(403)
        })
    })
    describe('patchs',()=>{
        it('should update the project by setting deleted to false',async()=>{
            await api.delete(`/api/projects/archive/${projectId}`)
            await api.patch(`/api/projects/restore/${projectId}`)
            .set('Authorization', `Bearer ${t}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        })
        
        it('should return 404 if project not found',async()=>{
            await api.patch(`/api/projects/restore/68022c082f41b78e03477c99`)
            .set('Authorization', `Bearer ${t}`)
            .expect(404)
        })
        it('should return 401 if no token is provided',async()=>{
            await api.delete(`/api/projects/archive/${projectId}`)
            .set('Authorization', `Bearer ${t}`)
            await api.patch(`/api/projects/restore/${projectId}`)
            .expect(401)
        })
        it('should return 403 if token is expired',async()=>{
            await api.delete(`/api/projects/archive/${projectId}`)
            .set('Authorization', `Bearer ${t}`)
            await api.patch(`/api/projects/restore/${projectId}`)
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODAyMmJmOTViYTVjODZkNTAzNTQ2ZjMiLCJyb2xlIjpbInVzZXIiXSwiaWF0IjoxNzQ0OTcyNzk0LCJleHAiOjE3NDQ5Nzk5OTR9.ETdVXmlwxT0Smz9KW4iUtp_c6pboYreDMa5LNEFMfd8`)
            .expect(403)
        })
        
    })
})


afterAll(async()=> {
    server.close()
    await mongoose.connection.close();
})

