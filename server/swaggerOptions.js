// swaggerOptions.js
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API",
      version: "1.0.0",
      description: "API documentation using Swagger",
    },
    servers: [
      {
        url: "http://localhost:5000", // change this as per your app
      },
    ],
  },
  apis: ["./routes/instructor-routes/course-routes.js"], // path to your route files
};

module.exports = options;
