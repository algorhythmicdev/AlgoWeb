let counter = 0;

export const nextId = (prefix = 'id'): string => {
  counter += 1;
  return `${prefix}-${counter}`;
};
