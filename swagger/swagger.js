const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-Commerce API",
      version: "1.0.0",
      description: "API documentation for the e-commerce backend",
    },
    servers: [
      {
        url: "http://localhost:3000", // change to your deployed URL later
      },
    ],
  },
  apis: ["./routes/*.js"], // Swagger reads docs from route files
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  console.log("📄 Swagger Docs available at: http://localhost:3000/api-docs");
}

module.exports = swaggerDocs;
