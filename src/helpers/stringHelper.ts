import {smsMobiponeStartNumber, smsVinaphoneStartNumber} from "../constants/SmsConstants";

export function generateSlug(str) {
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();
  // remove accents, swap ñ for n, etc
  var from = 'ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;';
  var to = 'aaaaaeeeeeiiiiooooouuuunc------';
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes
  return str + +new Date();
}

export const removeVietnameseTones = (str): string => {
  // remove accents
  const from =
    'àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ';
  const to =
    'aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy';
  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(RegExp(from[i], 'gi'), to[i]);
  }

  str = str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\-\/]/g, ' ')
    // .replace(/-+/g, ' ');

  return str;
};

export const normalizeString = (str) => {
  return str.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/([^0-9a-z-\s])/g, '')
        .replace(/(\s+)/g, '%20');
}

export const getTextSearchString = (str: string): string => {
  return removeVietnameseTones(str).split(' ').filter(item => item !== '').join(' & ') + ':*';
}

export const getTemplateString = (phoneNumber: string, otp: string): string => {
  if (smsVinaphoneStartNumber.some(i => phoneNumber.startsWith((i)))) {
    return `CarX - Ma xac thuc cua Quy khach tren ung dung CarX la ${otp}. Vui long khong chia se ma nay cho bat ky ai voi bat ky hinh thuc nao. Ma co hieu luc trong 5 phut`
  }
  if (smsMobiponeStartNumber.some(i => phoneNumber.startsWith((i)))) {
    return `CarX - Ma xac thuc cua Quy khach tren ung dung CarX la.${otp} Vui long khong chia se ma nay cho bat ky ai voi bat ky hinh thuc nao. Ma co hieu luc trong.5 phut`
  }
  return `Mã xác thực của bạn là ${otp}. Mã có hiệu lực trong 5 phút`;
}