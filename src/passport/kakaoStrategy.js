import passport from 'passport';
import { Strategy as KakaoStrategy } from 'passport-kakao';
// import RefreshToken  from '../middlewares/require-refresh-token.middleware.js';
// import  accessToken  from '../middlewares/access-token.middleware.js';
import { prisma } from '../utils/prisma.util.js';
;

export default () => {
  passport.use(new KakaoStrategy({
    clientID: process.env.KAKAO_ID,
    clientSecret: process.env.KAKAO_CLIENT_SECRET,
    callbackURL: '/auth/kakao/callback',
  }, 
  
  async (accessToken, refreshToken, profile, done) => {
    console.log('kakao profile', profile);
    try {
      // Check if the user already exists
      const exUser = await prisma.user.findUnique({
        where: {
          userid_provider: {
            userid: profile.id,
            provider: 'kakao'
          }
        },
      });

      if (exUser) {
        done(null, exUser);
      } else {
        // Create a new user if not found
        const newUser = await prisma.kakaouser.create({
          data: {
            email: profile._json && profile._json.kakao_account_email,
            nickname: profile.displayName,
            image: profile._json && profile._json.properties.profile_image,
            userid: profile.id,
            provider: 'kakao',
          },
        });
        done(null, newUser);
      }
    } catch (err) {
      console.error(err);
      done(err);
    }
  }));
};












