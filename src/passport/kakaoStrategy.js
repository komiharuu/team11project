
import { Strategy as KakaoStrategy } from 'passport-kakao';
import { prisma } from '../utils/prisma.util.js';

export const kakaoStrategy = new KakaoStrategy({
    clientID: process.env.KAKAO_CLIENT_ID,
    clientSecret: process.env.KAKAO_CLIENT_SECRET,
    callbackURL: '/auth/kakao/callback',
}, async (accessToken, refreshToken, profile, done) => {
    console.log('kakao profile', profile);
    try {
        profile.id = String(profile.id);
        let user = await prisma.snsuser.findFirst({
            where: {
               
                    snsId: profile.id,
                    // provider: 'kakao'
                
            },
        });

        if (!user) {
            console.log(profile)
        //  사용자가 없으면 새로 계정을 생성합니다.
            const newUser = await prisma.snsuser.create({
                data: {
                    email: profile._json.kakao_account.email,
                    name: profile.displayName,
                    image: profile._json.properties.profile_image,
                    snsId: profile.id,
                    provider: 'kakao',
                }
            });
            done(null, newUser); 
        } else {
            done(null, user); // 이미 존재하는 사용자인 경우
        }
    } catch (err) { 
        console.error(err);
        done(err);
    }
});

export default kakaoStrategy;











