class loggerTestController {
  static async getAll(req, res) {
    req.logger.fatal("this a fatal error log");
    req.logger.error("this is an error log", new Error("This is an error"));
    req.logger.warning("this is a warning log");
    req.logger.info("this is an info log");
    req.logger.http("this is an http log");
    req.logger.debug("this is a debug log");

    res.send({ status: "success", message: "Logger test" });
  }
}

export default loggerTestController