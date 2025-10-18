export default (_config, { strapi }) => {
  return async (ctx, next) => {
    const xfproto = ctx.headers['x-forwarded-proto'];
    if (xfproto && xfproto.toString().toLowerCase() === 'https') {
      ctx.request.secure = true;
    }
    await next();
  };
};
