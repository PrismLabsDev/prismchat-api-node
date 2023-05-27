export default {
  origin: "*",
  methods: ['GET','PUT','PATCH','POST','DELETE'],
  allowedHeaders: ['Authorization'],
  "preflightContinue": false,
  "optionsSuccessStatus": 204
};
