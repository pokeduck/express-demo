class MessageController {
  async id(req, res, next) {
    res.status(200).json({ message: req.params.id });
  }
  async create(req, res, next) {
    res.status(200).json({ message: req.body });
  }
}

export default new MessageController();
