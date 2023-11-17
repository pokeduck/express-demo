/**
 *
 * @param {string | number} serialId
 * @param {Date} date
 * @returns
 */
const uid = (serialId, date) => {
  const limitUserPerDay = 100000;
  const formatedUid = limitUserPerDay + serialId;
  const year = date.getFullYear().toString().padStart(4, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = (date.getDate() + 1).toString().padStart(2, "0");
  return `${year}${month}${day}${formatedUid}`;
};
export default uid;
