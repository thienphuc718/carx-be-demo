import { CARX_MODULES } from '../constants';

function checkStaffAndCustomerOnly(
  user: any,
  moduleName: string,
  objectId?: string,
) {}

function checkStaffOnly(user) {
  return user.is_staff;
}

export const havePermission = (
  user: any,
  moduleName: string,
  objectId?: string,
): boolean => {
  if (moduleName === CARX_MODULES.COMPANIES) {
    return checkStaffOnly(user);
  }
  if (moduleName === CARX_MODULES.STAFFS) {
    return checkStaffOnly(user);
  }
  if (moduleName === CARX_MODULES.NOTIFICATIONS) {
    return checkStaffOnly(user);
  }
  return false;
};
