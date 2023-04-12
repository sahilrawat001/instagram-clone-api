const PLATFORM = process.env.PLATFORM || 'Node.JS';
module.exports = {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": `${PLATFORM} Application`,
    "description": "Project",
    "termsOfService": "http://swagger.io/terms/",
    "contact": {
      "name": `${PLATFORM} Team`
    },
    "license": {
      "name": "MIT"
    }
  },
  "paths": {},
  "definitions": {},
  "schemes": [
    "http",
    "https"
  ],
  "consumes": [
    "application/json"
  ],
  "produces": [
    "application/json"
  ],
  securityDefinitions:{
    apiKey: {
      type: "apiKey",
      in: "header",
      name: "X-API-KEY"
    }
  },
  security:[ {
    apiKey: []
  }]
};