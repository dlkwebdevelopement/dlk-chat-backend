export const generateEmployeeId = async (count = 1) => {
  const padded = String(count).padStart(3, '0');
  return `DLK26@EMP${padded}`;
};

export const generateCustomerId = async (count = 1) => {
  const padded = String(count).padStart(3, '0');
  return `DLK26@CUS${padded}`;
};
