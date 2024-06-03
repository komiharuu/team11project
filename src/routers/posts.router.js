import { Router } from "express";
import { prisma } from "../utils/prisma.util.js";
import accessMiddleware from '../middlewares/auth.middleware.js';
// // 3번째 줄 이거 사용자 인증기능할때 쓰세요

const router = Router();

// 게시글 등록 api
// router.post('/posts',  async (req, res, next) => {

//     const {  recommendedArea, recommendationReason, imageurl} = req.body;

//    try { if (!recommendedArea) {
//       return res.status(400).json({ message: '제목을 입력해 주세요.' });
//     }
//     if (!recommendationReason) {
//       return res.status(400).json({ message: '추천 이유를 입력해 주세요.' });
//     }

//     if (!imageurl) {
//       return res.status(400).json({ message: '여행지 사진을 등록해 주세요.' });
//     }

//     const travel = await prisma.post.create({
//       data: {
//         // userId: userId,
//         recommendedArea,
//         recommendationReason,
//         imageurl
//       },
//     });

//     return res.status(201).json({ data: travel});
//   }
//   catch (err) {
//     next(err);
//   }
//   });

// // 게시글 조회 api

// router.get('/posts',  async (req, res, next) => {
//   try {
//     const { recommendedArea, sort = 'desc' } = req.query;
//     const sortOrder = sort.toLowerCase() === 'asc' ? 'asc' : 'desc'; // 기본값은 'desc'

//     // 게시글에 지역을 enum으로 만들고 해외 국내로 크게 나눠서 지역별로 정렬하는 기능을 구현하고 싶은데 어떻게 생각하시나요?
//     // 그리고 update 빼고 created만 넣는거 어떻게 생각하시나요?
//     // 조건에 따른 where 객체 생성
//     let where = {};

//     if (recommendedArea) {
//       where.status = recommendedArea.toUpperCase();
//     }

//     // Prisma 쿼리 실행
//     const posts = await prisma.post.findMany({
//       where,
//       orderBy: { createdAt: sortOrder },
//       select: {
//         // user: { select: { name: true } }
//         post_Id: true,
//         recommendedArea: true,
//         recommendationReason: true,
//         imageurl: true,
//         createdAt: true,
//         updatedAt: true,

//       }
//     });

//     res.status(200).json({ data: posts });
//   } catch (err) {
//     next(err);
//   }
// });

// // 게시글 상세조회 api
// router.get('/posts/:post_id',  async (req, res, next) => {
//   try {

//     // Prisma 쿼리 실행
//     const posts = await prisma.post.findFirst({
//       select: {
//         post_Id: true,
//         recommendedArea: true,
//         recommendationReason: true,
//         imageurl: true,
//         createdAt: true,
//         updatedAt: true,
//         // user: { select: { name: true } }
//       }
//     });

//     res.status(200).json({ data: posts });
//   } catch (err) {
//     next(err);
//   }
// });

/** 게시글 수정 API */
router.patch("/posts/:postId", accessMiddleware, async (req, res, next) => {
  try {
    // userId를 req.posts에서 받기
    const { userId } = req.post;

    // postId를 req.params에서 받기
    const { postId } = req.params;

    // 추천지역, 추천이유, 사진을 req.body에서 받기
    const { recommendedArea, recommendationReason, imageurl } = req.body;

    // 입력값이 하나도 없는 경우
    if (!recommendedArea && !recommendationReason && !imageurl) {
      return res.status(400).json({ message: "수정 할 정보를 입력해주세요." });
    }

    // 수정할 게시글 조회하기
    const existPost = await prisma.post.findFirst({
      where: {
        postId: +postId,
        userId: +userId,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    // 게시글이 없는 경우
    if (!existPost) {
      return res.status(404).json({ message: "게시글이 존재하지 않습니다." });
    }

    // 수정한 내용 반영하기
    const updatePost = await prisma.post.update({
      where: {
        postId: +postId,
      },
      data: {
        recommendedArea,
        recommendationReason,
        imageurl,
        updatedAt: new Date(),
      },
    });

    return res
      .status(200)
      .json({ message: "게시글 수정이 완료되었습니다!", data: updatePost });
  } catch (error) {
    next(error);
  }
});

/** 게시글 삭제 API */
router.delete("/posts/:postId", accessMiddleware, async (req, res, next) => {
  try {
    // userId를 req.posts에서 받기
    const { userId } = req.post;

    // postId를 req.params에서 받기
    const { postId } = req.params;

    // 삭제할 게시글 조회하기
    const existPost = await prisma.post.findFirst({
      where: {
        postId: +postId,
        userId: +userId,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    // 게시글이 없는 경우
    if (!existPost) {
      return res.status(404).json({ message: "게시글이 존재하지 않습니다." });
    }

    // 게시글 삭제하기
    await prisma.post.delete({
      where: {
        postId: +postId,
      },
    });

    return res
      .status(200)
      .json({ message: "이럭서가 삭제되었습니다.", data: postId });
  } catch (error) {
    next(error);
  }
});

export default router;
