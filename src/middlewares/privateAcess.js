const privateAcess = (req, res, next) => {
    if (!req.session.user) {
      req.logger.info("Must be Logged In.")
      return res.redirect("/login");
    }
    next();
  };

export default privateAcess