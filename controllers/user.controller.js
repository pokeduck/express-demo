class UserController {
  async signIn(req, res, next) {
    res.status(200).json({ message: "signin" });
  }
  async profile(req, res, next) {
    res.status(200).json({ message: "signin" });
  }
}

export default new UserController();
