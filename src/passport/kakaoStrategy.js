
import { Strategy as KakaoStrategy } from 'passport-kakao';
import { prisma } from '../utils/prisma.util.js';

export const kakaoStrategy = new KakaoStrategy({
    clientID: process.env.KAKAO_CLIENT_ID,
    clientSecret: process.env.KAKAO_CLIENT_SECRET,
    callbackURL: '/auth/kakao/callback',
}, async (accessToken, refreshToken, profile, done) => {
    console.log('kakao profile', profile);
    try {
        let user = await prisma.kakaouser.findFirst({
            where: {
               
                    snsId: profile.id,
                    // provider: 'kakao'
                
            },
        });

        if (!user) {
            // Create a new user if not found
            const newUser = await prisma.kakaouser.create({
                data: {
                    email: profile._json.kakao_account.email,
                    name: profile.displayName,
                    snsId: profile.id,
                    provider: 'kakao',
                }
            });
            done(null, newUser); // done 콜백 함수 내부에서 newUser 사용
        } else {
            done(null, user); // 이미 존재하는 사용자인 경우
        }
    } catch (err) { 
        console.error(err);
        done(err);
    }
});

export default kakaoStrategy;











