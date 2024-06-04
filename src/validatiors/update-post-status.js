import Joi from "joi";

//프로필 수정 Joi 정의
const profileUpdatedSchema = Joi.object({
  name: Joi.string()
    .optional()
    .messages({ "string.base": "이름은 문자열이어야 합니다." }),
  introduce: Joi.string()
    .optional()
    .messages({ "string.base": "소개는 문자열이어야 합니다." }),
  password: Joi.string()
    .optional()
    .messages({ "string.base": "비밀번호는 문자열이어야 합니다." }),
  passwordConfirm: Joi.any()
    .valid(Joi.ref("password"))
    .optional()
    .messages({ "any.only": "두 비밀번호가 일치하지 않습니다." }),
  profileImgurl: Joi.string()
    .uri()
    .optional()
    .messages({ "string.url": "프로필 이미지 URL이 유효하지 않습니다." }),
});

export default profileUpdatedSchema;

const Schema = Joi.object({
  recommendedArea: Joi.string().required().messages({
    "any.required": "추천 지역을 입력해 주세요.",
  }),
  recommendationReason: Joi.string().required().messages({
    "any.required": "추천 이유를 입력해 주세요.",
  }),
  imageurl: Joi.string().required().messages({
    "any.required": "이미지 링크를 입력해 주세요.",
  }),
});

export const PostValidator = async (req, res, next) => {
  try {
    await Schema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};
