import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// 인증번호 생성 함수
const generateVerificationCode = () => {
  // 랜덤한 6자리 숫자를 생성합니다.
  return Math.floor(100000 + Math.random() * 900000);
};

const sendEmail = async (toEmail) => {
  // 이메일에 포함될 인증번호 생성
  const verificationCode = generateVerificationCode();

  const transporter = nodemailer.createTransport({
    service: "naver",
    host: "smtp.naver.com",
    port: 465,
    auth: { user: process.env.NAVER_USER, pass: process.env.NAVER_PASS }
  });

  const mailOptions = {
    from: "nackylove@naver.com",
    to: toEmail,
    subject: "이메일 인증",
    html: `
      <h1>이메일 인증 코드</h1>
      <p>아래의 인증 코드를 입력하여 이메일을 인증해주세요:</p>
      <p><strong>${verificationCode}</strong></p>
    `,
  };

  try {
    // 이메일 전송
    await transporter.sendMail(mailOptions);
    // 생성된 인증번호 반환
    return verificationCode;
  } catch (error) {
    console.error('이메일 전송 중 오류가 발생했습니다:', error);
    throw new Error('이메일 전송 중 오류가 발생했습니다.');
  }
};

export default sendEmail;