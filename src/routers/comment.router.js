import { Router } from "express";
import { prisma } from "../utils/prisma.util.js";
import accessMiddleware from "../middlewares/access-token.middleware.js";

const router = Router();

/** 댓글 작성 API **/
router.post(
  "/posts/:postId/comments",
  authMiddleware,
  async (req, res, next) => {
    const { postId } = req.params;
    const { userId } = req.user;
    const { content } = req.body;

    const post = await prisma.posts.findFirst({
      where: {
        postId: +postId,
      },
    });
    if (!post)
      return res.status(404).json({ message: "게시글이 존재하지 않습니다." });

    const comment = await prisma.comments.create({
      data: {
        userId: +userId,
        postId: +postId,
        content: content,
      },
    });

    return res.status(201).json({ data: comment });
  },
);

export default router;
