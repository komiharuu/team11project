import passport from 'passport';
import local from './localStrategy';
import kakao from './kakaoStrategy';
import naver from './naverStrategy';

import { findOne } from '../models/user';

export default () => {
    serializeUser((user, done) => {
        done(null, user.userid);
    });
    
    deserializeUser((userid, done) => {
        findOne({ where: { userid } })
            .then(user => done(null, user))
            .catch(err => done(err));
    });

   
    kakao();
   
}