const getWeek = (date: Date) => {
  const startDate = new Date(date.getFullYear(), 0, 1);
  return Math.ceil(
    ((date.getTime() - startDate.getTime()) / 86400000 + startDate.getDay() + 1) / 7
  );
};

export { getWeek };
