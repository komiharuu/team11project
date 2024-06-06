import { Router } from "express";
import { prisma } from "../utils/prisma.util.js";
import  accessToken  from '../middlewares/access-token.middleware.js';
import {PostValidator } from "../validatiors/update-post-status.js";
import {multerMiddleware} from "../middlewares/multer.middleware.js";
const router = Router();

//게시물 상세 렌더링 조회 
router.get('/:postId', async (req, res, next) => {
  try {
    const postId = parseInt(req.params.postId);

    // 게시물 조회
    const post = await prisma.post.findUnique({
      where: {
        postId: postId
      },
      select: {
        userId: true,
        postId: true,
        recommendedArea: true,
        recommendationReason: true,
        imageurl: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!post) {
      return res.status(404).json({ message: '게시글이 존재하지 않습니다.' });
    }

    res.render('post-detail', { post: post }); // post-detail.ejs로 post 객체를 전달하여 렌더링
  } catch (err) {
    next(err);
  }
});

//게시판 페이지 렌더링 
router.get('/', async (req, res, next) => {
  try {
    const { sort = 'desc' } = req.query;
    const sortOrder = sort.toLowerCase() === 'asc' ? 'asc' : 'desc';
    let where = {};
    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: sortOrder },
      select: {
        userId: true,
        postId: true,
        recommendedArea: true,
        recommendationReason: true,
        imageurl: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.render('main', { data: posts });
  } catch (err) {
    next(err);
  }
});



// 게시글 등록 api
router.post('/', accessToken, PostValidator, async (req, res, next) => {
    
  const { recommendedArea, recommendationReason, imageurl } = req.body;
  const user = req.user;
  try {
    // 필수 필드가 모두 제공되었는지 확인합니다.
 
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
    return res.status(201).json({ status:201,message:"게시물이 등록되었습니다", data: posts});
  } catch (err) {
    // 에러 발생 시 에러 핸들러로 에러를 전달합니다.
    next(err);
  }
});
  
  

// // 게시글 조회 api

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



// 게시글 상세조회 api
router.get('/:postId',  async (req, res, next) => {
  try {
    const postId = parseInt(req.params.postId); 

    const post = await prisma.post.findUnique({
      where: {
        postId: postId
      },
      select: {
        userId: true,
        postId: true,
        recommendedArea: true,
        recommendationReason: true,
        imageurl: true,
        createdAt: true,
        updatedAt: true
      }
    });

  

    if (!post) {
      
      return res.status(404).json({ message: '게시글이 존재하지 않습니다.' });
    }

    res.status(200).json({ data: post });
  } catch (err) {
    next(err);
  }
});



// 본인이 팔로우 한 사람들의 게시글을 볼 수 있는 api
router.get('/follow/:userId', accessToken, async (req, res) => {
  const { userId } = req.params;
  const following = await prisma.follows.findMany({
    where: { followerId: +userId },
    select: { followingId: true },
  });
  const followingIds = following.map(f => f.followingId);

  const posts = await prisma.post.findMany({
    where: { userId: { in: followingIds } },
    orderBy: { createdAt: 'desc' },
    include: { user: true },
  });

  res.json(posts);
});




/** 게시글 수정 API */
router.patch("/:postId", accessToken, async (req, res, next) => {
  try {
    // userId를
    const { userId } = req.user;

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
router.delete("/:postId", accessToken, async (req, res, next) => {
  try {
    // userId를 req.user에서 받기
    const { userId } = req.user;

    // postId를 req.params에서 받기
    const { postId } = req.params;

    // 삭제할 게시글 조회하기
    const existPost = await prisma.post.findFirst({
      where: {
        postId: +postId,
        userId: +userId,
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
      .json({ message: "게시글이 삭제되었습니다.", data: postId });
  } catch (error) {
    next(error);
  }
});

//게시물 좋아요 추가
router.post('/likes/:postId', accessToken, async (req, res, next) => {
  const { postId } = req.params;
  const userId = req.user.userId;
 
  try {

    const post = await prisma.post.findUnique({
      where: { postId: +postId },
      select: { userId: true }
    });

    // 본인이 작성한 게시글에는 좋아요를 남길 수 없음
    if (post.userId === userId) {
      return res.status(400).json({
        status: 400,
        message: '본인이 작성한 게시글에는 좋아요를 남길 수 없습니다.'
      });
    }

  const existingLike = await prisma.like.findFirst({
    where: { 
      userId,
      postId: +postId
    }
  });
  
  if (existingLike) {
    return res.status(400).json({
      status: 400,
      message: '이미 이 게시물에 좋아요를 눌렀습니다.'
    });
  }

  
    // 게시물 좋아요 추가
    const like = await prisma.like.create({
      data: {
        userId,
        postId:+postId
      }
    });

    return res.status(201).json({
      status: 201,
      message: '게시물 좋아요가 추가되었습니다.',
      data: like
    });
  } catch (err) {
    next(err);
  }
});

// 게시물 좋아요 제거 api
router.delete('/likes/:postId', accessToken, async (req, res, next) => {
  const { postId } = req.params;
  const userId = req.user.userId;

  try {
   //게시물 존재 유무
   const existingPost = await prisma.post.findUnique({
    where: {
      postId: +postId
    }
  });
  if (!existingPost) {
    return res.status(404).json({
      status: 404,
      message: '해당 게시물이 존재하지 않습니다.'
    });
  }


    // 게시물 좋아요 제거
    await prisma.like.deleteMany({
      where: {
        postId :+postId,
        userId
      }
    });

    return res.status(200).json({
      status: 200,
      message: '게시물 좋아요가 제거되었습니다.'
    });
  } catch (err) {
    next(err);
  }
});


// 멀티미디어 업로드
router.get('/upload', (req,res) => { res.sendFile(path.join(__dirname, 'html.html'))});

router.post('/upload', multerMiddleware, (req, res) => {
  console.log(req.files, req.body);
  const fileUrls = Object.keys(req.files).map(fieldName => {
    return req.files[fieldName].map(file => `/posts/upload/${file.filename}`);
  }).flat();
  res.json({ urls: fileUrls });
});




export default router;

