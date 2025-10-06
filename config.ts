export const time_port = 8080;
export const nw_port = 8000;
export const client_port = 3000;
export const utcTimeFn = () => String(((Date.now())/1000).toFixed(3));
export const utcTimeFnNumber = () => parseFloat(((Date.now())/1000).toFixed(3));