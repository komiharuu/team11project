import { Router } from "express";
import { prisma } from "../utils/prisma.util.js";
import bcrypt from "bcrypt";
import accessToken from "../middlewares/access-token.middleware.js";
import { ProfileValidator } from "../validatiors/profileUpdatedSchema.js";

const router = Router();

/** 프로필 수정 API 구현 **/
router.patch(
  "/:userid",
  accessToken,
  ProfileValidator,
  async (req, res, next) => {
    try {
      const userId = req.params.userid;
      const { name, introduce, email, password, profileImgurl } = req.body;
      const user = await prisma.user.findUnique({
        where: { userId: parseInt(userId) },
      });
      if (!user) {
        return res.status(404).json({ message: "사용자가 존재하지 않습니다." });
      }
      const userDataUpdate = {};
      if (name) userDataUpdate.name = user.name;
      if (introduce) userDataUpdate.introduce = user.introduce;
      if (password) {
        // 비밀번호 해시화하기
        const hashedPassword = await bcrypt.hash(password, 10);
        userDataUpdate.password = hashedPassword;
      }
      //프로필 수정
      const updateUser = await prisma.user.update({
        where: { userId: parseInt(userId) },
        data: {
          ...userDataUpdate,
          userInfo: {
            update: {
              name: name || (user.userInfo && user.userInfo.name),
              introduce:
                introduce || (user.userInfo && user.userInfo.introduce),
              profileImgurl:
                profileImgurl || (user.userInfo && user.userInfo.profileImgurl),
            },
          },
        },
        include: { userInfo: true },
      });
      return res.status(200).json({
        status: 200,
        message: "프로필이 수정되었습니다.",
        data: {
          email: updateUser.email,
          name: updateUser.userInfo.name,
          introduce: updateUser.userInfo.introduce,
          profileImgurl: updateUser.userInfo.profileImgurl,
        },
      });
    } catch (err) {
      next(err);
    }
  },
);

/** 유저 조회 API 구현 **/
router.get("/:userid", accessToken, async (req, res, next) => {
  try {
    const userId = req.params.userid;


    const user = await prisma.user.findUnique({
      where: { userId: parseInt(userId) },
      include: { userInfo: true },
    });

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "사용자가 존재하지 않습니다." });
    }

    return res.status(200).json({
      status: "success",
      profile: {
        email: user.email,
        name: user.userInfo.name,
        introduce: user.userInfo.introduce,
        profileImgurl: user.userInfo.profileImgurl,
      },
    });
  } catch (err) {
    next(err);
  }
});

//팔로우 기능

router.post('/follows/:userId', accessToken,async(req, res, next)=>{
  try{
  const followingId =req.params.userId; //팔로잉 한 사람 아이디
  const followerId = req.user.userId; // 현재 사용자의 userId
  
  const existingFollow = await prisma.follows.findFirst({
    where: {
      followerId,
      followingId: +followingId
    }
  });
  
  if (existingFollow) {
    return res.status(400).json({ message: '이미 해당 사용자를 팔로우하고 있습니다.' });
  }

  const follow = await prisma.follows.create({
    data: {
      followerId,
      followingId :+followingId
    }
  });
  res.status(201).json({ status:201, message: '팔로우가 생성되었습니다.', follow });
}catch(error){
  next(error);
}
})

//팔로우 끊기
router.delete('/follows/:userId', accessToken, async (req, res, next) => {
  try {
    const followingId = req.params.userId; // 팔로잉 한 사람 아이디
    const followerId = req.user.userId; // 현재 사용자의 userId



    const existingFollow = await prisma.follows.findFirst({
      where: {
        followerId,
        followingId: +followingId
      }
    });
    
    if (!existingFollow) {
      return res.status(400).json({ message: '해당 사용자를 팔로잉 하지 않았습니다.' });
    }

    
    const deletedFollow = await prisma.follows.deleteMany({
      where: {
        followerId,
        followingId: +followingId
      }
    });
    
    res.status(200).json({ message:`${followingId}님을 팔로우 취소하였습니다.`, deletedFollow });
  } catch (error) {
    next(error);
  }
});



export default router;
