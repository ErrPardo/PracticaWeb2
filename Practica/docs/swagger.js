const swaggerJsdoc = require("swagger-jsdoc")

const options = {
    definition: {
      openapi: "3.0.3",
      info: {
        title: "Tracks - Express API with Swagger (OpenAPI 3.0)",
        version: "0.1.0",
        description:
          "This is a CRUD API application made with Express and documented with Swagger",
        license: {
          name: "MIT",
          url: "https://spdx.org/licenses/MIT.html",
        },
        contact: {
          name: "a",
          url: "https://a.com",
          email: "a@r.com",
        },
      },
      servers: [
        {
          url: "http://localhost:3000",
        },
      ],
      components: {
        
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer"
            },
        },
        schemas: {
          user: {
              type: "object",
              required: ["email", "password"],
              properties: {
                  email: { type: "string", format: "email",example:"user@gmail.com" },
                  password: { type: "string",example:"password" },
              },
          },
          putRegister:{
            type:"object",
            properties:{
              "email": { type: "string", format: "email",example:"user@gmail.com" },
              "name": { type: "string",example:"Nicolas"},
              "surnames": { type: "string",example:"Calvo"},
              "nif": { type: "string",example:"40000000W"},
              "autonomo": { type: "boolean",example:true}
            }
          },
          verificationPut: {
            type: "object",
            required: ["code"],
            properties: {
                code: { type: "string",example:777255 },
            },
          },
          verification: {
              type: "object",
              required: ["email", "code"],
              properties: {
                  email: { type: "string", format: "email",example:"user@gmail.com" },
                  code: { type: "string",example:777255 },
              },
          },
          address: {
              type: "object",
              properties: {
                  "email": { type: "string", format: "email" },
                  "name": { type: "string" },
                  "surnames": { type: "string" },
                  "nif": { type: "string" },
                  "autonomo":{ type: "boolean"}
              },
          },
          company: {
              type: "object",
              properties: {
                  "company":{
                    type:"object",
                    properties:{
                      "name": { type: "string",example:"Servitop, SL."},
                      "cif": { type: "string",example:"BXXXXXXXX"},
                      "street":{type:"string",exampe: "Carlos V"},
                      "number": {type:"number",example:22},
                      "postal": {type:"number",example:28936},
                      "city": {type:"string",example: "Móstoles"},
                      "province":  {type:"string",example: "Madrid"}
                    }
                  }      
              },
          },
          address: {
              type: "object",
              properties: {
                  address:{
                    type:"object",
                    properties:{
                      "street":{ type: "string",example:"Carlos V"} ,
                      "number":{type:"number",example:22},
                      "postal": {type:"number",example:28936},
                      "city": {type:"string",example: "Móstoles"},
                      "province": {type:"string",example: "Madrid"}
                    }
                  }
              },
          },
          invite:{
            type:"object",
            properties:{
                "name":{ type: "string",example:"Manuel"} ,
                "surnames":{ type: "string",example:"Pérez Gómez"},
                "email":{ type: "string",example:"guest@gmail.com"} ,
                "password":{ type: "string",example:"password"},
                "role":{ type: "string",example:"guest"},
                "company":{
                    type:"object",
                    properties:{
                      "name": { type: "string",example:"Servitop, SL."},
                      "cif": { type: "string",example:"BXXXXXXXX"},
                      "street":{type:"string",exampe: "Carlos V"},
                      "number": {type:"number",example:22},
                      "postal": {type:"number",example:28936},
                      "city": {type:"string",example: "Móstoles"},
                      "province":  {type:"string",example: "Madrid"}
                    }
                  }
            }
          }
        },
      },
    },
    apis: ["./routers/*.js"],
  };
  
module.exports = swaggerJsdoc(options)