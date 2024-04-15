import initApp from "./app";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import http from "http";
import fs from "fs";
import https from "https";

initApp().then((app) => {
   
    const options = {
        definition: {
        openapi: "3.0.0",
        info: {
        title: "Web Dev 2024 REST API",
        version: "1.0.0",
        description: "REST server including authentication using JWT",
        },
        servers: [{url: "http://localhost:3000",},],
        },
        apis: ["./src/Routing/*.ts"],
        };
        const specs = swaggerJsDoc(options);
        app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

        const port = process.env.PORT;
        const httpsPort = process.env.HTTPS_PORT;

        if (process.env.NODE_ENV !== 'production') {
            console.log('Starting server in development mode');
            http.createServer(app).listen(port);
            console.log('Server is running on port ' + port);
            
        }
        else{
            console.log('Starting server in production mode');
            const option2 = {
                key: fs.readFileSync('../client-key.pem'),
                cert: fs.readFileSync('../client-cert.pem') 
            };
            https.createServer(option2, app).listen(httpsPort);
            console.log('Server is running on port ' + httpsPort);
            
        }
       

    });