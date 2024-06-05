import Joi from "joi";

//프로필 수정 Joi 정의

const profileUpdatedSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({ "any.required": "이름을 입력해주세요" }),
  email: Joi.string()
    .required()
    .messages({ "any.required": "이메일 주소를 입력해주세요" }),
  introduce: Joi.string()
    .required()
    .messages({ "any.required": "소개는 문자열이어야 합니다." }),
  password: Joi.string()
    .required()
    .messages({ "any.required": "비밀번호는 문자열이어야 합니다." }),
  passwordConfirm: Joi.any()
    .valid(Joi.ref("password"))
    .required()
    .messages({ "any.only": "두 비밀번호가 일치하지 않습니다." }),
  profileImgurl: Joi.string()
    .uri()
    .required()
    .messages({ "any.required": "프로필 이미지 URL이 유효하지 않습니다." }),
});

export const ProfileValidator = async (req, res, next) => {
  try {
    await profileUpdatedSchema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};
