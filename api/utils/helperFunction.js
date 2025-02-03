exports.groupBy = (array, keyGetter) => {
  const grouped = [];

  array.forEach((item) => {
    const key =
      typeof keyGetter === 'function' ? keyGetter(item) : item[keyGetter];

    if (!grouped[key]) {
      grouped[key] = [];
    }

    grouped[key].push(item);
  });

  return grouped;
};
