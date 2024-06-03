import { Router } from 'express';
import { prisma } from '../utils/prisma.util.js';
import accessMiddleware from '../middlewares/access-token.middleware.js';
// // 3번째 줄 이거 사용자 인증기능할때 쓰세요

const router = Router();


// 게시글 등록 api
router.post('/', accessMiddleware, async (req, res, next) => {
    
  const { recommendedArea, recommendationReason, imageurl } = req.body;
  const user = req.user;
  try {
    // 필수 필드가 모두 제공되었는지 확인합니다.
    if (!recommendedArea) {
      return res.status(400).json({ message: '추천 지역을 입력해 주세요.' });
    }
    if (!recommendationReason) {
      return res.status(400).json({ message: '추천 이유를 입력해 주세요.' });
    }
    if (!imageurl) {
      return res.status(400).json({ message: '여행지 사진을 등록해 주세요.' });
    }



    // // Post 데이터를 데이터베이스에 삽입합니다.
    const posts = await prisma.post.create({
      data: {
        userId: user.userId,
        recommendedArea: recommendedArea,
        recommendationReason: recommendationReason,
        imageurl: imageurl,
      },
    });



    // 클라이언트에 생성된 데이터를 반환합니다.
    return res.status(201).json({ data: posts });
  } catch (err) {
    // 에러 발생 시 에러 핸들러로 에러를 전달합니다.
    next(err);
  }
});
  
  

// 게시글 조회 api

router.get('/',  async (req, res, next) => {
  try {
    const { sort = 'desc' } = req.query;
    const sortOrder = sort.toLowerCase() === 'asc' ? 'asc' : 'desc'; 
    let where = {};

  
    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: sortOrder },
      select:  {
        userId: true,
        postId: true,
        user: { select: { name: true } },
        recommendedArea: true,
        recommendationReason: true,
        imageurl: true,
        createdAt: true,
        updatedAt: true
      }
    });

   

    res.status(200).json({ data: posts });
  } catch (err) {
    next(err);
  }
});

// // 게시글 상세조회 api
router.get('/:postId',  async (req, res, next) => {
  try {
    

    // Prisma 쿼리 실행
    const posts = await prisma.post.findFirst({
      select: {
        post_Id: true,
        recommended_area: true,
        recommendation_reason: true,
        image_url: true,
        createdAt: true,
        updatedAt: true,
        user: { select: { name: true } }
      }
    });

  

    res.status(200).json({ data: posts });
  } catch (err) {
    next(err);
  }
});



  export default router;