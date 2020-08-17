export default function logger(req, res, next) {
    console.log(res.statusCode, req.method, req.path, req.body);
    next();
}
