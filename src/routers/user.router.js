import { Router } from "express";
import { prisma } from "../utils/prisma.util.js";
import validator from "validator";
import bcrypt from "bcrypt";
import accessToken from "../middlewares/access-token.middleware.js";

const router = Router();

/** 프로필 수정 API 구현 **/
router.patch("/:userid", accessToken, async (req, res, next) => {
  try {
    const userId = req.params.userid;
    const { name, introduce, password, passwordConfirm, profileImgurl } =
      req.body;

    // 유효성 검사
    if ((!name && !introduce && !password) || (password && !passwordConfirm)) {
      return res.status(400).json({ message: "수정 할 정보를 입력해 주세요." });
    }

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
      if (password !== passwordConfirm) {
        return res
          .status(400)
          .json({ message: "입력한 두 비밀번호가 일치하지 않습니다." });
      }
    }

    // 비밀번호 해시화하기
    const hashedPassword = await bcrypt.hash(password, 10);
    userDataUpdate.password = hashedPassword;

    //프로필 수정
    const updateUser = await prisma.user.update({
      where: { userId: parseInt(userId) },
      data: {
        ...userDataUpdate,
        userInfo: {
          update: {
            name: name || (user.userInfo && user.userInfo.name),
            introduce: introduce || (user.userInfo && user.userInfo.introduce),
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
});

export default router;
