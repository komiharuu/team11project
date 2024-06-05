import Joi from "joi";

//로그인 Joi 정의
const signInSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: ["com", "net", "kr"] } })
    .required()
    .messages({ "any.required": "이메일을 입력해주세요" }),

  password: Joi.string().required().messages({
    "any.required": "비밀번호를 입력해주세요",
  }),
});

export const SigninValidator = async (req, res, next) => {
  try {
    await signInSchema.validateAsync(req.body);
    next();
  } catch (error) {
    next(error);
  }
};
