import passport from 'passport';
import { prisma } from '../utils/prisma.util.js';
import kakaoStrategy from './kakaoStrategy.js';

export const passportConfig = () => {
    passport.serializeUser((kakaouser, done) => {
        done(null, kakaouser.id);
    });

    passport.deserializeUser((id, done) => {
        prisma.kakaouser.findUnique({ where: { id } })
            .then(kakaouser => {
                if (kakaouser) {
                    console.log('User found:', kakaouser);
                    done(null, kakaouser);
                } else {
                    console.log('User not found');
                    done(null, false);
                }
            })
            .catch(err => {
                console.error('Error in deserializeUser:', err);
                done(err);
            });
    });

    passport.use('kakao', kakaoStrategy);
};

