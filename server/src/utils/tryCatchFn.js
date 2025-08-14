const tryCatchFn = (fn)=> {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        }catch (error) {
            next(error);
        }
    };
};
// we created a global tryCatch function to use for our api calls instead of creating try Catch every time we make an api call instead we can simply call this for function

export default tryCatchFn;