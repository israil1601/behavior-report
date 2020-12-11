const getWeek = (date: Date) => {
  const startDate = new Date(date.getFullYear(), 0, 1);
  return Math.ceil(
    ((date.getTime() - startDate.getTime()) / 86400000 +
      startDate.getDay() +
      1) /
      7
  );
};

const isEmpty = (obj: object) =>
  Object.keys(obj).length === 0 && obj.constructor === Object;

const getHeaderState = async (session: any) => {
  const isAuth = await session.get("authenticated");
  const userObj = await session.get("user");
  const email = userObj?.email || "";
  return {
    isAuth,
    email,
  };
};

export { getWeek, getHeaderState, isEmpty };
