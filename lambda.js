"use strict";
const warmer = require("lambda-warmer");
const awsServerlessExpress = require("aws-serverless-express");
const app = require("./app");
const server = awsServerlessExpress.createServer(app);

exports.handler = (event, context) => {
  // Start a promise chain
  warmer(event).then((isWarmer) => {
    // If a warming event
    if (isWarmer) {
      return "warmed";
    }
    
    
    // Proceed with handler logic
    awsServerlessExpress.proxy(server, event, context);
  });
};
