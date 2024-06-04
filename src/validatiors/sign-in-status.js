import Joi from "joi";

//f로그인 Joi 정의
const signInSchma = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: ["com", "net", "kr"] } })
    .required()
    .messages({ "string.email": "이메일 형식이 올바르지 않습니다." }),

  password: Joi.string().min(6).required().messages({
    "string.base": "비밀번호는 문자열이어야 합니다.",
    "string.min": "비밀번호는 6자리 이상이어야 합니다.",
  }),

  passwordConfirm: Joi.any()
    .valid(Joi.ref("password"))
    .optional()
    .messages({ "any.only": "두 비밀번호가 일치하지 않습니다." }),
});

export default signInSchma;
