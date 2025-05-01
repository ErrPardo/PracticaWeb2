const uploadToPinata=require('../utils/handleUploadIPFS.js')
const spy = jest.spyOn(uploadToPinata, 'uploadToPinata').mockImplementation(()=>{
    return "ok"
})
const supertest = require('supertest')
const {app, server} = require('../index.js')
const mongoose = require('mongoose');
const ClientModel=require('../models/client')
const UserModel=require('../models/users.js')
const ProjectModel=require('../models/projects.js')
const AlbaranModel=require('../models/albaran.js')

const { tokenSign } = require('../utils/handleToken.js')

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
        await ClientModel.deleteMany({})
        await UserModel.deleteMany({})
        await ProjectModel.deleteMany({})
        await AlbaranModel.deleteMany({})
    })
    it('should return 404 if albaran not found',async()=>{
        await api.get('/api/albaran/')
        .set('Authorization', `Bearer ${t}`)
        .expect(404)
    })
})

describe('Test with project,client',()=>{
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
        const client={
            "name": "ACS",
            "cif": "D52921211",
            "address": {
                "street": "Carlos V",
                "number": 22,
                "postal": 28936,
                "city": "Móstoles",
                "province": "Madrid"
            },
            "deleted": false,
            "userId":result._id
        }
        const clientRes=await ClientModel.create(client)
        clientId=clientRes._id
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
            "clientId": clientId,
            "userId":result._id,
            "deleted":false
        }
        const projectRes=await ProjectModel.create(project)
        projectId=projectRes._id
        const albaran={
            "albaranCode":"Id1",
            "userId":result._id,
            "clientId": clientId,
            "projectId": projectId,
            "description": "Primer Albaran",
            "hours": 8,
            "format":"hours",
            "pending":true,
            "pdf":"null",
            "sign":"null",
            "multi":[
                {
                    "name":"Alright",
                    "hours":2,
                    "description":"cosas"
                }
            ],
            "deleted":false,
            "workdate":"2025-04-29T08:16:02.158+00:00"
        } 
        const resAlbaran=await AlbaranModel.create(albaran)
        albaranId=resAlbaran._id
    })
    afterEach(async()=>{
        await ClientModel.deleteMany({})
        await UserModel.deleteMany({})
        await ProjectModel.deleteMany({})
        await AlbaranModel.deleteMany({})
    })
    describe('posts',()=>{
        it('should create a deliverynote',async()=>{
            const albaran={
                "albaranCode":"Id2",
                "clientId": clientId,
                "projectId": projectId,
                "description": "Segundo Albaran",
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
            await api.post('/api/albaran/').send(albaran)
            .set('Authorization', `Bearer ${t}`)
            .expect(200)
        })
        it('should return 409 if deliverynote already exists',async()=>{
            const albaran={
                "albaranCode":"Id1",
                "clientId": clientId,
                "projectId": projectId,
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
            await api.post('/api/albaran').send(albaran)
            .set('Authorization', `Bearer ${t}`)
            .expect(409)
        })
        it('should return 404 if client not found',async()=>{
            const albaran={
                "albaranCode":"Id2",
                "clientId": "680a663528dc41e25a05b4e5",
                "projectId": projectId,
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
            await api.post('/api/albaran').send(albaran)
            .set('Authorization', `Bearer ${t}`)
            .expect(404)
        })
        it('should return 404 if project not found',async()=>{
            const albaran={
                "albaranCode":"Id2",
                "clientId": clientId,
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
            await api.post('/api/albaran').send(albaran)
            .set('Authorization', `Bearer ${t}`)
            .expect(404)
        })
        it('should return 404 if project and client not found',async()=>{
            const albaran={
                "albaranCode":"Id2",
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
            await api.post('/api/albaran').send(albaran)
            .set('Authorization', `Bearer ${t}`)
            .expect(404)
        })
        it('should return 403 if invalid values are provided',async()=>{
            const albaran={
                "albaranCode":"Id2",
                "clientId": clientId,
                "projectId": projectId,
                "description": "Segundo Albaran",
                "hours": 8,
                "format":"hours",
                "materials":[
                    {
                        "description":"material",
                        "quantity":2
                    }
                ]   
            }
            await api.post('/api/albaran').send(albaran)
            .set('Authorization', `Bearer ${t}`)
            .expect(403)
        })
        it('should return 403 if invalid values are provided',async()=>{
            const albaran={
                "albaranCode":"Id2",
                "clientId": clientId,
                "projectId": projectId,
                "description": "Segundo Albaran",
                "hours": 8,
                "format":"materials",
                "multi":[
                    {
                        "name":"Alright",
                        "hours":2,
                        "description":"cosas"
                    }
                ]
                
            }
            await api.post('/api/albaran').send(albaran)
            .set('Authorization', `Bearer ${t}`)
            .expect(403)
        })
        it('should return 403 if required fields are missing or invalid',async()=>{
            const albaran={
                "clientId": "680a663528dc41e25a05b4e5",
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
            await api.post('/api/albaran').send(albaran)
            .set('Authorization', `Bearer ${t}`)
            .expect(403)
        })
        it('should return 401 if no token is provided',async()=>{
            const albaran={
                "albaranCode":"Id1",
                "clientId": clientId,
                "projectId": projectId,
                "description": "Segundo Albaran",
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
            await api.post('/api/albaran').send(albaran)
            .expect(401)
        })
        it('should return 403 if token is expired',async()=>{
            const albaran={
                "albaranCode":"Id1",
                "clientId": clientId,
                "projectId": projectId,
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
            await api.post('/api/albaran').send(albaran)
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODAyMmJmOTViYTVjODZkNTAzNTQ2ZjMiLCJyb2xlIjpbInVzZXIiXSwiaWF0IjoxNzQ0OTcyNzk0LCJleHAiOjE3NDQ5Nzk5OTR9.ETdVXmlwxT0Smz9KW4iUtp_c6pboYreDMa5LNEFMfd8`)
            .expect(403)
        })
    })
    describe('gets',()=>{
        it('should get all deliverynotes',async()=>{
            await api.get('/api/albaran')
            .set('Authorization', `Bearer ${t}`)
            .expect(200)
        })
        it('should get a deliverynote',async()=>{
            await api.get(`/api/albaran/${albaranId}`)
            .set('Authorization', `Bearer ${t}`)
            .expect(200)
        })
        it('should get a pdf',async()=>{
            await api.get(`/api/albaran/pdf/${albaranId}`)
            .set('Authorization', `Bearer ${t}`)
            .attach('image','./signature.png')
            .expect(200)

            expect(spy).toHaveBeenCalled();
            spy.mockRestore();
        })
        it('should return 404 if deliverynote not found',async()=>{
            await api.get(`/api/albaran/pdf/68022c082f41b78e03477c99`)
            .set('Authorization', `Bearer ${t}`)
            .attach('image','./signature.png')
            .expect(404)
        })
        it('should return 404 if deliverynote not found',async()=>{
            await api.get(`/api/albaran/68022c082f41b78e03477c99`)
            .set('Authorization', `Bearer ${t}`)
            .expect(404)
        })
        it('should return 401 if no token is provided',async()=>{
            await api.get(`/api/albaran/${albaranId}`)
            .expect(401)
        })
        it('should return 403 if if token is expired',async()=>{
            await api.get(`/api/albaran/${albaranId}`)
            .set('Authorization', `Bearer ${t}`)
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODAyMmJmOTViYTVjODZkNTAzNTQ2ZjMiLCJyb2xlIjpbInVzZXIiXSwiaWF0IjoxNzQ0OTcyNzk0LCJleHAiOjE3NDQ5Nzk5OTR9.ETdVXmlwxT0Smz9KW4iUtp_c6pboYreDMa5LNEFMfd8`)
            .expect(403)
        })

    })
    describe('delete',()=>{
        it('should delete an deliverynote',async()=>{
            await api.delete(`/api/albaran/${albaranId}`)
            .set('Authorization', `Bearer ${t}`)
            .expect(200)
        })
        it('should return 404 if deliverynote not found',async()=>{
            await api.delete(`/api/albaran/680a663528dc41e25a05b4e5`)
            .set('Authorization', `Bearer ${t}`)
            .expect(404)
        })
        it('should return 401 if no token is provided',async()=>{
            await api.delete(`/api/albaran/${albaranId}`)
            .expect(401)
        })
        it('should return 403 if token is expired',async()=>{
            await api.delete(`/api/albaran/${albaranId}`)
            .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODAyMmJmOTViYTVjODZkNTAzNTQ2ZjMiLCJyb2xlIjpbInVzZXIiXSwiaWF0IjoxNzQ0OTcyNzk0LCJleHAiOjE3NDQ5Nzk5OTR9.ETdVXmlwxT0Smz9KW4iUtp_c6pboYreDMa5LNEFMfd8`)
            .expect(403)
        })
    
    })
})

describe('signed',()=>{
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
        const client={
            "name": "ACS",
            "cif": "D52921211",
            "address": {
                "street": "Carlos V",
                "number": 22,
                "postal": 28936,
                "city": "Móstoles",
                "province": "Madrid"
            },
            "deleted": false,
            "userId":result._id
        }
        const clientRes=await ClientModel.create(client)
        clientId=clientRes._id
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
            "clientId": clientId,
            "userId":result._id,
            "deleted":false
        }
        const projectRes=await ProjectModel.create(project)
        projectId=projectRes._id
        const albaran={
            "albaranCode":"Id1",
            "userId":result._id,
            "clientId": clientId,
            "projectId": projectId,
            "description": "Primer Albaran",
            "hours": 8,
            "format":"hours",
            "pending":true,
            "pdf":"https://gold-electrical-cat-313.mypinata.cloud/ipfs/QmeuCSx5c9H4muGsyjD1fz4r5xTu15F4fZYJ6QqxAHtK1N",
            "sign":"https://gold-electrical-cat-313.mypinata.cloud/ipfs/QmUuiQ3aNhgx8722KJZsukcfqRxR89znHFWFZqsWwEY1qa",
            "multi":[
                {
                    "name":"Alright",
                    "hours":2,
                    "description":"cosas"
                }
            ],
            "deleted":false,
            "workdate":"2025-04-29T08:16:02.158+00:00"
        } 
        const resAlbaran=await AlbaranModel.create(albaran)
        albaranId=resAlbaran._id  
    })
    afterEach(async()=>{
        await ClientModel.deleteMany({})
        await UserModel.deleteMany({})
        await ProjectModel.deleteMany({})
        await AlbaranModel.deleteMany({})
    })
    describe('delete',()=>{
        it('should return 403 if deliverynote signed',async()=>{
            const res=await api.delete(`/api/albaran/${albaranId}`)
            .set('Authorization', `Bearer ${t}`)
            .expect(403)
        })
        it('should get a pdf',async()=>{
            await api.get(`/api/albaran/pdf/${albaranId}`)
            .set('Authorization', `Bearer ${t}`)
            .attach('image','./signature.png')
            .expect(201)
            
            expect(spy).not.toHaveBeenCalled();
            spy.mockClear();
        })

    })
    
})


afterAll(async()=>{
    server.close()
    await mongoose.connection.close();
})