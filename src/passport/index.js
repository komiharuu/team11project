import passport from 'passport';
import { prisma } from '../utils/prisma.util.js';
import kakaoStrategy from './kakaoStrategy.js';
import naverStrategy from './naverStrategy.js';
export const passportConfig = () => {
    passport.serializeUser((snsuser, done) => {
        done(null, snsuser.id);
    });

    passport.deserializeUser((id, done) => {
        prisma.snsuser.findUnique({ where: { id } })
            .then(snsuser => {
                if (snsuser) {
                    console.log('User found:', snsuser);
                    done(null, snsuser);
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
    passport.use('naver', naverStrategy);
};

