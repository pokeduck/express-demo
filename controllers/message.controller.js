import MessageDAO from "../models/userscomment.js";
import MessageHistoryDAO from "../models/commenthistory.js";
import UserDAO from "../models/users.js";
import query from "../services/db.service.js";
import responseHander from "../utils/responseHander.js";
import contentId from "../utils/content-id.js";
import { v4 as uuidv4 } from "uuid";
import { parseInt } from "lodash-es";

const queryMessage = query(MessageDAO);
const queryMessageHistory = query(MessageHistoryDAO);
const queryUser = query(UserDAO);

const Action = Object.freeze({
  Like: Symbol.for("like"),
  Love: Symbol.for("love"),
  Angry: Symbol.for("angry"),
  Dislike: Symbol.for("dislike"),
});

function actionToColumnName(action) {
  const actionSymbol = Symbol.for(action.toLowerCase());
  switch (actionSymbol) {
    case Action.Dislike:
      return "dislike";
    case Action.Like:
      return "likes";
    case Action.Love:
      return "loves";
    case Action.Angry:
      return "angries";
    default:
      return null;
  }
}
class MessageController {
  async id(req, res, next) {
    const mId = req.params?.id ?? 0;
    try {
      let loginUserId = null;
      if (req.body.uid !== undefined) {
        let loginUser = await queryUser.findOne({
          where: { userId: req.body.uid },
        });
        loginUserId = loginUser?.id ?? null;
      }
      queryMessage.hasMany(queryMessageHistory, { foreignKey: "commentId" });
      queryMessageHistory.belongsTo(queryMessage, { foreignKey: "commentId" });
      const messages = await queryMessage.findAll({
        where: { id: mId },
        include: [{ model: queryMessageHistory }],
      });
      const histories = await queryMessageHistory.findAll({
        where: { commentId: mId },
      });
      messages.CommentHistories = histories;
      responseHander(res, {
        messages: messages.map((x) => formatMessage(x, loginUserId)),
      });

      /* const message = await queryMessage.findOne({
        where: {
          id: mId,
        },
      });
      console.log(message);
      responseHander(res, formatMessage(message)); */
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
  async list(req, res, next) {
    try {
      console.log(req.query);
      const offset = parseInt(req.query?.offset ?? 0);
      const limit = parseInt(req.query?.limit ?? 100);
      //queryUser.hasMany(queryMessageHistory);
      let loginUserId = null;
      if (req.body.uid !== undefined) {
        let loginUser = await queryUser.findOne({
          where: { userId: req.body.uid },
        });
        loginUserId = loginUser?.id ?? null;
      }
      queryMessage.hasMany(queryMessageHistory, { foreignKey: "commentId" });
      queryMessageHistory.belongsTo(queryMessage, { foreignKey: "commentId" });
      const messages = await queryMessage.findAll({
        offset: offset,
        limit: limit,
        include: [{ model: queryMessageHistory }],
      });
      responseHander(res, {
        messages: messages.map((x) => formatMessage(x, loginUserId)),
      });
    } catch (e) {
      next(e);
    }
  }
  async total(req, res, next) {
    try {
      let total = await queryMessage.count({ distinct: "id" });
      responseHander(res, { total: total ?? 0 });
    } catch (e) {
      next(e);
    }
  }
  async edit(req, res, next) {
    try {
      const { uid, id, title, content } = req.body;
      const user = await queryUser.findOne({ where: { userId: uid } });
      const lastMessage = await queryMessage.findOne({
        where: { userId: user.id, id: id },
      });
      if (lastMessage === null) {
        responseHander(res, null, 404, "message not found.", 404);
        return;
      }
      await queryMessage.update(
        { title: title, text: content },
        { where: { id: id } }
      );
      responseHander(res, null);
    } catch (e) {
      next(e);
    }
  }
}

export default new MessageController();

function formatMessage(message, loginUserId) {
  let userActionStatus = null;
  const likes = [],
    angries = [],
    dislikes = [],
    loves = [];
  const actionUsers = message?.CommentHistories ?? [];
  actionUsers.forEach((element) => {
    const actionSymbol = Symbol.for(element.action.toLowerCase());
    if (loginUserId === element.userId) {
      userActionStatus = element.action;
    }
    switch (actionSymbol) {
      case Action.Dislike:
        dislikes.push(element.userId);
        break;
      case Action.Like:
        likes.push(element.userId);
        break;
      case Action.Love:
        loves.push(element.userId);
        break;
      case Action.Angry:
        angries.push(element.userId);
        break;
      default:
        break;
    }
  });
  return {
    id: message.id,
    author: message.userId,
    contentId: message.contentId,
    parentId: message?.parentId ?? null,
    title: message?.title ?? null,
    content: message?.text ?? null,
    actions: {
      likes: likes,
      dislikes: dislikes,
      loves: loves,
      angries: angries,
    },
    userReactAction: userActionStatus,
    createTime: message?.createdAt ?? null,
  };
}
