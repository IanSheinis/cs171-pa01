export const time_port = 6969;
export const nw_port = 6769;
export const client_port = 6967; 
export const utcTimeFn = () => String(((Date.now())/1000).toFixed(3));
export const utcTimeFnNumber = () => parseFloat(((Date.now())/1000).toFixed(3));