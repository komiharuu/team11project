

import { Strategy as NaverStrategy } from 'passport-naver';
import { prisma } from '../utils/prisma.util.js';

export const kakaoStrategy = new NaverStrategy({
    clientID: process.env.NAVER_CLIENT_ID,
    clientSecret: process.env.NAVER_CLIENT_SECRET,
    callbackURL: process.env.NAVER_CALLBACK,
}, async (accessToken, refreshToken, profile, done) => {
    console.log('naver profile', profile);
    try {
        profile.id = String(profile.id);
        let user = await prisma.snsuser.findFirst({
            where: {
               
                    snsId: profile.id,
                    // provider: 'kakao'
                
            },
        });

        if (!user) {
            // Create a new user if not found
            const newUser = await prisma.snsuser.create({
                data: {
                    email: profile._json.email,
                    name: profile._json.nickname,
                    image: profile._json.profile_image,
                    snsId: profile._json.id,
                    provider: 'naver',
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