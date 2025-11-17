export async function JSONBodyPreprocessorMiddleware(req, res, next) {
    req.body = req.body ?? {};
    next();
};

