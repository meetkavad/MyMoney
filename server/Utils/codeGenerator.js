// 6-digit Code generator :
export const generateCode = () => {
  return Math.floor(Math.random() * 900000 + 100000);
};
