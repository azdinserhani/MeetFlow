// export const tryCatch = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res);
//     } catch (error) {
//         next(error);
//     }
// };
export const tryCatch = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};