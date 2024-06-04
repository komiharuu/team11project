import Joi from "joi";

//회원가입 Joi 정의
const signUpSchma = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: ["com", "net", "kr"] } })
    .required()
    .messages({ "string.email": "이메일 형식이 올바르지 않습니다." }),

  password: Joi.string().min(6).required().messages({
    "string.base": "비밀번호는 문자열이어야 합니다.",
    "string.min": "비밀번호는 6자리 이상이어야 합니다.",
  }),
});

export default signUpSchma;
