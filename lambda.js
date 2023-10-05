"use strict";
const warmer = require("lambda-warmer");


exports.handler = (event, context) => {
  // Start a promise chain
  warmer(event).then((isWarmer) => {
    // If a warming event
    if (isWarmer) {
      return "warmed";
    }
    
    const awsServerlessExpress = require("aws-serverless-express");
    const app = require("./app");
    const server = awsServerlessExpress.createServer(app);
    // Proceed with handler logic
    awsServerlessExpress.proxy(server, event, context);
  });
};
