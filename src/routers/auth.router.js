
import express from 'express';
import { prisma } from '../utils/prisma.util.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from "validator";
import { requireRefreshToken } from '../middlewares/require-refresh-token.middleware.js';
import sendEmail from '../constants/transport.constant.js';
const router = express.Router();


// 회원가입 api
router.post("/sign-up", async (req, res, next) => {
  try {
    const { email, password, passwordConfirm, name, introduce, profileImgurl } =
      req.body;

    // 유효성 검사
    if (
      !email ||
      !password ||
      !passwordConfirm ||
      !name ||
      !introduce ||
      !profileImgurl
    ) {
      return res.status(400).json({ message: "모든 필드를 입력해 주세요." });
    }

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ message: "이메일 형식이 올바르지 않습니다." });
    }

    const isExistUser = await prisma.user.findFirst({ where: { email } });

    if (isExistUser) {
      return res.status(409).json({ message: "이미 가입 된 사용자입니다." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "비밀번호는 6자리 이상이어야 합니다." });
    }

    if (password !== passwordConfirm) {
      return res
        .status(400)
        .json({ message: "입력한 두 비밀번호가 일치하지 않습니다." });
    }

    // 비밀번호 해시화하기
    const hashedPassword = await bcrypt.hash(password, 10);

    // Users 테이블에 사용자 추가
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        userInfo: { create: { name, introduce, profileImgurl } },
      },
      include: { userInfo: true },
    });


    // // AccessToken 생성- 이부분은 로그인에서 처리하므로 생략해도 될 것 같습니다
    // const accessToken = jwt.sign(
    //   {
    //     userId: user.id,
    //   },
    //   process.env.ACCESS_TOKEN_SECRET_KEY,
    //   { expiresIn: "12h" },
    // );

    // req.header("authorization", accessToken );


    return res.status(201).json({
      status: 201,
      message: "회원가입에 성공했습니다.",
      data: {
        userId: user.userId,
        email: user.email,
        name: user.userInfo.name,
        introduce: user.userInfo.introduce,
        profileImgurl: user.userInfo.profileImgurl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    next(err);
  }
});




//하는중
router.get('/sign-in',(req,res) =>{
  res.render("login"); //app.set homepage설정 그안에 /login.ejs폴더.
})



  //로그인 API
  router.post('/sign-in', async (req, res, next) => {
   
    const { email, password } = req.body;
    // - **로그인 정보 중 하나라도 빠진 경우** - “OOO을 입력해 주세요.”
    if (!email || !password) {
      const missingFields = [];
      if (!email) {
        missingFields.push('이메일을');
      }
      if (!password) {
        missingFields.push('비밀번호를');
      }
  
      return res.status(401).json({
        status: 401,
        message: `${missingFields} 입력해 주세요.`,
      });
    }
    // - **이메일 형식에 맞지 않는 경우** - “이메일 형식이 올바르지 않습니다.”
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: 400,
        message: '이메일 형식이 올바르지 않습니다.',
      });
    }
  
    // - **이메일로 조회되지 않거나 비밀번호가 일치하지 않는 경우** - “인증 정보가 유효하지 않습니다.”
    const user = await prisma.user.findFirst({ where: { email } }); 
  
    if (!user) {
      return res
        .status(401)
        .json({ status: 401, message: '인증 정보가 유효하지 않습니다.' });
    }
  
    //비밀번호 일치
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        status: 401,
        message: '인증 정보가 유효하지 않습니다.',
      });
    }
    //사용자에게 accessToken jwt발급
  
    const accessToken = jwt.sign(
      {
        userId: user.userId,
      },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRES },
    );
    //refresh토큰  발급
  const refreshToken = jwt.sign(
    {
      userId : user.userId,
    },process.env.REFRESH_TOKEN_SECRET_KEY,{expiresIn: process.env.REFRESH_TOKEN_EXPIRES});

   const hashedRefreshToken = bcrypt.hashSync(refreshToken,10);
   await prisma.refreshToken.upsert({
    where:{
      userId : user.userId
    },
    update:{
      refresh_token:hashedRefreshToken,
    },
    create:{
      userId : user.userId,
      refresh_token:hashedRefreshToken,
    }
  })


    return res.status(200).json({
      status: 200,
      message: '로그인 성공했습니다.',
      data:{accessToken: accessToken, refreshToken: refreshToken},
    });
  });
  

//refresh토큰 재발급
router.post('/token', requireRefreshToken, async(req, res, next)=>{
 try{
    const user = req.user; //미들웨어인증받은 user
    const payload = { userId: user.userId };
    

    const accessToken = jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRES },
    );
    //refresh토큰  발급
  const refreshToken = jwt.sign(
    payload,
    process.env.REFRESH_TOKEN_SECRET_KEY,{expiresIn: process.env.REFRESH_TOKEN_EXPIRES});

   const hashedRefreshToken = bcrypt.hashSync(refreshToken,10);

   await prisma.refreshToken.upsert({
    where: {userId : user.userId},
    update:{
      refresh_token:hashedRefreshToken,
    },
    create:{
      userId : user.userId,
      refresh_token:hashedRefreshToken,
    }
  })

    

  return res.status(200).json({
  status: 200,
  message: '토큰 재발급에 성공했습니다.',
  data:{accessToken: accessToken, refreshToken: refreshToken},
    });
 }catch(err){
  next(err);  
}

})


//로그아웃 API
router.post('/sign-out', requireRefreshToken, async(req, res, next)=>{
  try{
    const user = req.user;
    //refreshToken 로그아웃시 Null 값
    await prisma.refreshToken.update({
      where:{userId:user.userId},
      data:{
        refresh_token:null,
      }
    })

    return res.status(200).json({
      status: 200,
      message: '로그아웃에 성공했습니다.',
      data:{ID: user.userId},
        });
  }catch(err){
    next(err);
  }
})


// 이메일 인증 api

router.post('/verify-email', async (req, res) => {
  try {
  
    const { email } = req.body;

 //  보낸 인증 번호로 프리즈마 데이터베이스를 저장합니다. 

    // Save
  

    // 
    await sendEmail(email);
 // 이메일을 보내는 함수를 호출하여 인증 메일을 사용자 이메일 주소로 전송합니다.

 


    // 성공적으로 이메일을 보낸 후 클라이언트에게 응답합니다.
    res.status(200).json({ message: '인증번호가 성공적으로 전송되었습니다' });
  } catch (error) {
    // 이메일 전송 중 오류가 발생한 경우 오류를 클라이언트에게 전달합니다.
    res.status(400).json({ message: '이메일 전송에 실패했습니다.' });
  }
});




//이메일 인증번호 확인 api 

router.get('/verify-email/:email', async (req, res) => {
  try {
    const { verificationCode} = req.body;
    const email = req.params.email; 
  
    // 데이터베이스에 이메일이 저장되어있는지 확인합니다.
    const record = await prisma.email.findFirst({
      where: {email },
      orderBy: { createdAt: 'desc' }
    });


    // 최신의 인증번호로 유효하게 합니다.
    
    if (!record) {
      res.status(400).json({ message: '인증번호를 다시 확인해주세요' });
      return;
    }

    
// 인증 번호가 같으면 인증에 성공하고, 다르면 실패하는 과정입니다.

    if (record.verificationCode === parseInt(verificationCode, 10)) {
      res.status(200).json({ message: '이메일이 성공적으로 인증되었습니다.' });
    } else {
      res.status(400).json({ message: '인증번호가 일치하지 않습니다.' });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: '이메일 인증 중 오류가 발생했습니다.' });
  }
});



export default router;
