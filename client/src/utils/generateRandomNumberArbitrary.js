/**
 * возвращает случайное число от min до max
 * @param {*} min - минимальное возможное чилсо
 * @param {*} max - максимальное возможное число
 */
function getRandomArbitrary(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default getRandomArbitrary;
