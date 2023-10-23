class MessageController {
  async id(req, res, next) {
    res.status(200).json({ message: req.params.id });
  }
  async create(req, res, next) {
    res.status(200).json({ message: req.body });
  }

  async createWithError(req, res, next) {
    try {
      const error = new Error("create error!");
      error.status = 400;
      throw error;
    } catch (error) {
      next(error);
    }
  }
}

export default new MessageController();
