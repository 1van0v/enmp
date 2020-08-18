export default function logger(req, res, next) {
    const body = Object.keys(req.body).length ? req.body : '';

    console.log(res.statusCode, req.method, req.path, body);

    next();
}
