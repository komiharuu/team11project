
import Joi from "joi";

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
