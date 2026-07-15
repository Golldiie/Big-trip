export const getRandomInteger = (a,b) => {
  const lower = Math.ceil(Math.min(a,b));
  const upper = Math.floor(Math.max(a,b));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

export const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];

export const capitalize = (str) => {
  if (!str) {
    return str;
  }

  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const createIdGenerator = (startFrom = 1) => {
  let currentId = startFrom;
  return () => currentId++;
};
