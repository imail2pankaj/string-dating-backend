const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const httpStatus = require("http-status");
const passport = require("passport");
const { createServer } = require("http");
const cookieParser = require('cookie-parser');

const { errorConverter, errorHandler } = require("./middlewares/error.js");
const { jwtStrategy } = require("./config/passport.js");
const config = require("./config/cfg");
const socketSetup = require('./socket');
const routes = require('./routes/v1');
const ApiError = require("./utils/ApiError.js");

const app = express();
const server = createServer(app);

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: false }));
app.use(cors({
  origin: config.appUrl,
  credentials: true
}));

app.use(cookieParser());

app.use("/api/v1", routes)

app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

app.use(errorConverter);

app.use(errorHandler);

socketSetup(server)

server.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}.`);
});
