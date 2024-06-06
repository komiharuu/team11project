import Joi from "joi";

// 로그인 Joi 정의
const signInSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: ["com", "net", "kr"] } })
    .required()
    .messages({
      "string.empty": "이메일을 입력해주세요",
      "string.email": "유효한 이메일 형식을 입력해주세요",
    }),

  password: Joi.string()
    .required()
    .messages({
      "any.required": "비밀번호를 입력해주세요",
      "string.empty": "비밀번호를 입력해주세요",
    }),
});

export const SigninValidator = async (req, res, next) => {
  try {
    await signInSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    res.status(400).json({ message: errorMessage });
  }
};

