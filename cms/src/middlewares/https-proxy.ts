export default (_config, { strapi }) => {
  return async (ctx, next) => {
    // If Cloud Run/LB says the original scheme was HTTPS, mark the request secure so Koa can issue secure cookies.
    const xfproto = ctx.headers['x-forwarded-proto'];
    if (xfproto && xfproto.toString().toLowerCase() === 'https') {
      ctx.request.header['x-forwarded-proto'] = 'https';
      if (ctx.request.socket) {
        ctx.request.socket.encrypted = true;
      }
    }
    await next();
  };
};
