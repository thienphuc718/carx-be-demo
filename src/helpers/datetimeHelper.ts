import { format } from 'date-fns';

export const calculateDiffDays = (firstDate: Date, secondDate: Date) => {
  const date1: any = new Date(
    new Date(firstDate).toLocaleString('en-US', {
      timeZone: 'Asia/Ho_Chi_Minh',
    }),
  );
  const date2: any = new Date(
    new Date(secondDate).toLocaleString('en-US', {
      timeZone: 'Asia/Ho_Chi_Minh',
    }),
  );
  const diffTime: number = Math.abs(date2 - date1);
  const diffDays: number = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const getFirstDateOfYear = (year: number) => {
  return format(new Date(year, 0, 1), 'yyyy-MM-dd');
};

export const getLastDateOfYear = (year: number) => {
  return format(new Date(year, 11, 31), 'yyyy-MM-dd');
};
