'use strict';

const fs = require('fs');
const swaggerJson = require('../../config').swagger;
const j2s = require('joi-to-swagger');
let singleton = undefined;

class Swagger {
    constructor() {

    }

    static instance() {
        if (!singleton) {
            singleton = new Swagger();
            singleton.currentRoute = [];
            singleton.paths = {};
            singleton.definitions = {};
            return singleton;
        }

        return this;
    }

    createJsonDoc(info, host, basePath) {
        let swaggerData = swaggerJson;
        if (info) {
            swaggerData = {
                ...swaggerData,
                info
            }
        }

        if (host) {
            swaggerData = {
                ...swaggerData,
                host
            }
        }

        if (basePath) {
            swaggerData = {
                ...swaggerData,
                basePath
            }
        }

        return fs.writeFileSync('swagger.json', JSON.stringify(swaggerData));
    }

    addNewRoute(joiDefinitions, path, method) {

        if (this.currentRoute.includes(path + method)) {

            return false;
        }

        this.currentRoute.push(path + method);

        const swaggerData = fs.readFileSync('swagger.json', 'utf-8');
        const otherData = JSON.parse(swaggerData);
        const name = joiDefinitions.model || Date.now();
        const tag = joiDefinitions.group || 'default';
        const summary = joiDefinitions.description || 'No desc';

        const toSwagger = j2s(joiDefinitions).swagger;
        if (toSwagger && toSwagger.properties && toSwagger.properties.body) {
            this.definitions = {
                ...this.definitions,
                [name]: toSwagger.properties.body
            }
        }

        const pathArray = path.split('/').filter(Boolean);
        const transformPath = pathArray.map((path) => {
            if (path.charAt(0) === ':') {
                return `/{${path.substr(1)}}`;
            }

            return `/${path}`;
        })
            .join('');

        const parameters = [];

        const { body, params, query, headers, formData, responseDescription } = joiDefinitions;

        if (body) {
            parameters.push({
                "in": "body",
                "name": "body",
                // ...toSwagger.properties.body
                "schema": {
                    "$ref": `#/definitions/${name}`
                }
            })
        }

        if (params) {
            const getParams = [];
            const rxp = /{([^}]+)}/g;
            let curMatch;

            while (curMatch = rxp.exec(transformPath)) {
                getParams.push(curMatch[1]);
            }
            let requiredFields = toSwagger.properties.params.required;
            getParams.forEach((param) => {

                let index = requiredFields ? requiredFields.findIndex(key => key === param) : -1;

                if (index > -1) {
                    toSwagger.properties.params.properties[param].required = true;
                }
                parameters.push({
                    "name": param,
                    "in": "path",
                    ...toSwagger.properties.params.properties[param]
                })
            })

        }

        if (query) {
            const keys = Object.keys(toSwagger.properties.query.properties).map((key) => key);
            let requiredFields = toSwagger.properties.query.required;
            keys.forEach((key) => {
                let index = requiredFields ? requiredFields.findIndex(requiredKey => requiredKey === key) : -1;
                if (index > -1) {
                    toSwagger.properties.query.properties[key].required = true;
                }
                parameters.push({
                    "in": "query",
                    "name": key,
                    ...toSwagger.properties.query.properties[key]
                })
            })
        }

        if (formData) {
            toSwagger.properties.formData.properties = {
                ...(toSwagger.properties.formData.properties.file && toSwagger.properties.formData.properties.file.properties),
                ...(toSwagger.properties.formData.properties.fileArray && toSwagger.properties.formData.properties.fileArray.properties),
                ...(toSwagger.properties.formData.properties.files && toSwagger.properties.formData.properties.files.properties),
                ...(toSwagger.properties.formData.properties.body && toSwagger.properties.formData.properties.body.properties),
            }
            const keys = Object.keys(toSwagger.properties.formData.properties).map((key) => key);
            let requiredFields = toSwagger.properties.formData.required;
            keys.forEach((key) => {
                let index = requiredFields ? requiredFields.findIndex(requiredKey => requiredKey === key) : -1;
                if (index > -1) {
                    toSwagger.properties.formData.properties[key].required = true;
                }
                parameters.push({
                    "in": "formData",
                    "name": key,
                    ...toSwagger.properties.formData.properties[key]
                });
            });
        }

        if (headers) {
            const keys = Object.keys(toSwagger.properties.headers.properties).map((key) => key);
            let requiredFields = toSwagger.properties.headers.required;
            keys.forEach((key) => {
                let index = requiredFields ? requiredFields.findIndex(requiredKey => requiredKey === key) : -1;
                if (index > -1) {
                    toSwagger.properties.headers.properties[key].required = true;
                }
                parameters.push({
                    "in": "header",
                    "name": key,
                    ...toSwagger.properties.headers.properties[key]
                })
            });
        }
        if (this.paths && this.paths[transformPath]) {
            this.paths[transformPath] = {
                ...this.paths[transformPath],
                [method]: {
                    "tags": [
                        tag
                    ],
                    summary,
                    responses:
                    {
                        200: {
                            description: responseDescription || "success"
                        }
                    },
                    parameters,
                }
            }
        } else {
            this.paths = {
                ...this.paths,
                [transformPath]: {
                    [method]: {
                        "tags": [
                            tag
                        ],
                        summary,
                        responses:
                        {
                            200: {
                                description: responseDescription || "success"
                            }
                        },
                        parameters,
                    }
                }
            }
        }

        const newData = {
            ...otherData,
            definitions: this.definitions,
            paths: this.paths
        };

        return fs.writeFileSync('swagger.json', JSON.stringify(newData));
    }
}

exports.swaggerDoc = Swagger.instance();