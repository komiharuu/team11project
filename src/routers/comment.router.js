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

/** 댓글 조회 API **/
router.get("/:postId", async (req, res, next) => {
  try {
    const { postId } = req.params;

    const post = await prisma.post.findFirst({
      where: {
        postId: +postId,
      },
    });
    if (!post)
      return res.status(404).json({ message: "게시글이 존재하지 않습니다." });

    const comments = await prisma.comment.findMany({
      where: {
        postId: +postId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res
      .status(200)
      .json({ message: "댓글이 조회되었습니다.", data: { comments } });
  } catch (err) {
    next(err);
  }
});

/** 댓글 수정 api */
router.patch("/:postId/:commentId", accessToken, async (req, res, next) => {
  try {
    // userID 받기
    const { userId} = req.user;

    // commentId 받기
    const {   postId , commentId} = req.params;

    // content 받기
    const { content } = req.body;

    // 댓글 내용이 없는 경우
    if (!content) {
      return res.status(400).json({ message: "댓글을 입력해주세요." });
    }

    // 수정할 댓글 조회
    const comment = await prisma.comment.findFirst({
      where: {
        
        postId: +postId,
        commentId: +commentId,
      },
    });

    // 댓글이 없는 경우
    if (!comment) {
      return res.status(400).json({ message: "댓글이 존재하지 않습니다." });
    }

    // 댓글 수정하기
    const patchComment = await prisma.comment.update({
      where: {
        commentId: +commentId,
        postId: +postId,
      },
      data: {
        content,
        updatedAt: new Date(),
      },
    });

    // 수정된 댓글 반환
    return res
      .status(200)
      .json({ message: "댓글 수정이 완료되었습니다.", date: patchComment });
  } catch (error) {
    next(error);
  }
});


/** 댓글 삭제 api */
router.delete('/:postId/:commentId', accessToken, async(req, res, next) => {
  try {
    // userId 받기
    const { userId} = req.user;

    // commentId 받기
    const {    postId, commentId} = req.params;
    
    // comment 조회
    const comment = await prisma.comment.findFirst({
      where: {
       postId: +postId,
        
        commentId: +commentId,
      },
    });

    // comment가 없는 경우
    if (!comment) {
      return res.status(400).json({ message: '댓글이 존재하지 않습니다.'});
    };
    
    // comment 삭제하기
    await prisma.comment.delete({
      where: {
        postId: +postId,
        commentId: +commentId,
      },
    });

    // 삭제된 commentId 반환
    return res.status(200).json({ message: '댓글이 삭제되었습니다.', commentId: commentId });

  } catch(error){
    next(error);
  }
});

//댓글 좋아요 추가
router.post('/likes/:postId/:commentId', accessToken, async (req, res, next) => {
  const { postId, commentId } = req.params;
  const userId = req.user.userId; // 사용자 ID 추출

  try {
    // 본인이 작성한 댓글인지 확인
    const comment = await prisma.comment.findFirst({
      where: { 
       commentId: +commentId, 
        postId: +postId, 
        userId: userId // 본인이 작성한 댓글 확인
      }
    });

    if (comment) {
      return res.status(400).json({
        status: 400,
        message: '본인이 작성한 댓글에는 좋아요를 남길 수 없습니다.'
      });
    }

    // 이미 좋아요를 남긴 경우
    const like = await prisma.like.findFirst({
      where: { 
        commentId: +commentId,
        postId: +postId,
        userId: userId
      }
    });

    if (like) {
      return res.status(400).json({
        status: 400,
        message: '이미 이 댓글에 좋아요를 눌렀습니다.'
      });
    }

    // 댓글 좋아요 추가
    const newLike = await prisma.like.create({
      data: {
        postId: +postId,
        commentId: +commentId,
        userId: userId
      }
    });

    return res.status(201).json({
      status: 201,
      message: '댓글에 좋아요가 추가되었습니다.',
      data: newLike
    });
  } catch (err) {
    next(err);
  }
});


// 댓글 좋아요 제거
router.delete('/likes/:postId/:commentId', accessToken, async (req, res, next) => {
  const { postId, commentId } = req.params;
  const userId = req.user.userId;

  try {
    // 좋아요 찾기
    const like = await prisma.like.findFirst({
      where: {
       
        commentId: +commentId,
        userId: +userId
      }
    });

    if (!like) {
      return res.status(404).json({
        status: 404,
        message: '해당 좋아요가 존재하지 않습니다.'
      });
    }

    // 좋아요 삭제
    await prisma.like.delete({
      where: {
       likeId: like.likeId
      }
    });

    return res.status(200).json({
      status: 200,
      message: '댓글 좋아요가 제거되었습니다.'
    });
  } catch (err) {
    next(err);
  }
});





export default router;
