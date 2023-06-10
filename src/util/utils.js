
const getRandInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const capitalize = (str) => str[0].toUpperCase() + str.substring(1);

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

const diffByDay = (pa, pb) => pa.dateFrom.toDate() - pb.dateFrom.toDate();

const diffByPrice = (pa, pb) => pa.price - pb.price;

export {getRandInt, capitalize, updateItem, diffByDay, diffByPrice};