import { Router } from "express";
import { prisma } from "../utils/prisma.util.js";
import accessToken from "../middlewares/access-token.middleware.js";

const router = Router();

/** 댓글 작성 API **/
router.post("/:postId", accessToken, async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { userId } = req.user;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "댓글 내용을 입력해주세요." });
    }

    const post = await prisma.post.findFirst({
      where: {
        postId: +postId,
      },
    });
    if (!post)
      return res.status(404).json({ message: "게시글이 존재하지 않습니다." });

    const comment = await prisma.comment.create({
      data: {
        userId: +userId,
        postId: +postId,
        content: content,
      },
    });

    return res
      .status(201)
      .json({ message: "댓글이 작성되었습니다.", data: { comment } });
  } catch (err) {
    next(err);
  }
});

export default router;
