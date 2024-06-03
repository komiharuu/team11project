import { Router } from 'express';
import { prisma } from '../utils/prisma.util.js';
// import accessMiddleware from '../middlewares/auth.middleware.js';
// // 3번째 줄 이거 사용자 인증기능할때 쓰세요

const router = Router();


// 게시글 등록 api
// router.post('/posts',  async (req, res, next) => {
    
//     const {  recommended_area, recommendation_reason, image_url} = req.body;
  
//    try { if (!recommended_area) {
//       return res.status(400).json({ message: '제목을 입력해 주세요.' });
//     }
//     if (!recommendation_reason) {
//       return res.status(400).json({ message: '추천 이유를 입력해 주세요.' });
//     }
  
//     if (!image_url) {
//       return res.status(400).json({ message: '여행지 사진을 등록해 주세요.' });
//     }
  
  
//     const travel = await prisma.post.create({
//       data: { 
//         // user_Id: +user_Id,
//         recommended_area, 
//         recommendation_reason, 
//         image_url
//       },
//     });
  
  
  
  
//     return res.status(201).json({ data: travel});
//   } 
//   catch (err) {
//     next(err);
//   }
//   });

// 게시글 조회 api

// router.get('/posts',  async (req, res, next) => {
//   try {
//     const { recommended_area, sort = 'desc' } = req.query;
//     const sortOrder = sort.toLowerCase() === 'asc' ? 'asc' : 'desc'; // 기본값은 'desc'

//     // 게시글에 지역을 enum으로 만들고 해외 국내로 크게 나눠서 지역별로 정렬하는 기능을 구현하고 싶은데 어떻게 생각하시나요?
//     // 그리고 update 빼고 created만 넣는거 어떻게 생각하시나요?
//     // 조건에 따른 where 객체 생성 
//     let where = {};

    // if (recommended_area) {
    //   where.status = recommended_area.toUpperCase();
    // }

  

    // Prisma 쿼리 실행
//     const posts = await prisma.post.findMany({
//       where,
//       orderBy: { createdAt: sortOrder },
//       select: {
//         // user: { select: { name: true } }
//         post_Id: true,
//         recommended_area: true,
//         recommendation_reason: true,
//         image_url: true,
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
//         recommended_area: true,
//         recommendation_reason: true,
//         image_url: true,
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



  export default router;