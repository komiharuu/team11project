export function isLoggedIn(req, res, next) {
if (req.isAuthenticated()) {
next();
} else{
    res.status(403).send('로그인 필요')
}}

export function isNotLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        next();
    } else{
        res.status(403).send('로그인 필요')
    }
}