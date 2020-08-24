export const lowerFisrtLetter = (query: string) => {
  const arr = query.split('');
  for (let i = 0; i < arr.length; i++) {
   arr[i] = i === 0 ? arr[i].toUpperCase() : arr[i].toLowerCase();
  }
  return arr.join('');
};
