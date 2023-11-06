import MessageDAO from "../models/userscomment.js";
import MessageHistoryDAO from "../models/commenthistory.js";
import UserDAO from "../models/users.js";
import query from "../services/db.service.js";
import responseHander from "../utils/responseHander.js";
import contentId from "../utils/content-id.js";
import { v4 as uuidv4 } from "uuid";

const queryMessage = query(MessageDAO);
const queryMessageHistory = query(MessageHistoryDAO);
const queryUser = query(UserDAO);

const Action = Object.freeze({
  Like: Symbol.for("like"),
  Love: Symbol.for("love"),
  Angry: Symbol.for("angry"),
  Dislike: Symbol.for("dislike"),
});
class MessageController {
  async id(req, res, next) {
    const mId = req.params?.id ?? 0;
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
      const user = await queryUser.findOne({ where: { userId: userId } });
      const createdMessage = await queryMessage.create({
        userId: user.id,
        contentId: uuidv4(),
        text: content,
        title: title,
      });
      /* const formatedContentId = contentId(createdMessage.id);
      createdMessage.contentId = formatedContentId;
      await queryMessage.update(
        { contentId: contentId(createdMessage.id) },
        { where: { id: createdMessage.id } }
      ); */
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

  async action(req, res, next) {
    const { messageId, uid } = req.body;
    const action = req.body.action.toLowerCase();
    const actionSymbol = Symbol.for(action);
    switch (actionSymbol) {
      case Action.Dislike:
      case Action.Like:
      case Action.Love:
      case Action.Angry:
        break;
      default:
        responseHander(res, null, "ER01", "unknown action", 400);
        return;
    }

    try {
      const user = await queryUser.findOne({ where: { userId: uid } });

      const [lastMessageRecord, created] =
        await queryMessageHistory.findOrCreate({
          where: {
            userId: user.id,
            commentId: messageId,
          },
        });
      await queryMessageHistory.update(
        {
          action: action,
        },
        {
          where: {
            id: lastMessageRecord.id,
          },
        }
      );
      responseHander(res, null);
    } catch (error) {
      next(error);
    }
  }

  async upvote(req, res, next) {
    responseHander(res, null);
  }

  async downvote(req, res, next) {
    responseHander(res, null);
  }
}

export default new MessageController();

function formatMessage(message) {
  return {
    id: message.id,
    author: message.userId,
    contentId: message.contentId,
    parentId: message?.parentId ?? null,
    title: message?.title ?? null,
    content: message?.text ?? null,
    upvotes: message?.upvotes ?? 0,
    downvotes: message?.downvotes ?? 0,
    createTime: message?.createdAt ?? null,
  };
}
