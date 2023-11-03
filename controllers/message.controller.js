import MessageDAO from "../models/userscomment.js";
import query from "../services/db.service.js";
import responseHander from "../utils/responseHander.js";
import contentId from "../utils/content-id.js";
const queryMessage = query(MessageDAO);

class MessageController {
  async id(req, res, next) {
    const mId = req.params?.id ?? "0";
    try {
      const message = await queryMessage.findOne({
        where: {
          id: mId,
        },
      });
      console.log(message);
      responseHander(res, formatMessage(message));
    } catch (error) {
      responseHander(res, null, "ER0001", "Not found", 400);
    }
  }
  async create(req, res, next) {
    const userId = req.body?.uid ?? "0";
    const { title, content } = req.body;
    try {
      const createdMessage = await queryMessage.create({
        userId: userId,
        contentId: null,
        parentId: null,
        text: content,
        upvotes: 0,
        downvotes: 0,
      });
      const formatedContentId = contentId(createdMessage.id);
      createdMessage.contentId = formatedContentId;
      await queryMessage.update(
        { contentId: contentId(createdMessage.id) },
        { where: { id: createdMessage.id } }
      );
      responseHander(res, formatMessage(createdMessage));
    } catch (e) {
      next(e);
    }
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

function formatMessage(message) {
  return {
    id: `${message.id}`,
    author: message.userId,
    contentId: message.contentId,
    parentId: message?.parentId ?? null,
    title: message?.title ?? null,
    content: message?.text ?? null,
    upvotes: message?.upvotes ?? 0,
    downvotes: message?.downvotes ?? 0,
    createTime: message?.createAt ?? null,
  };
}
