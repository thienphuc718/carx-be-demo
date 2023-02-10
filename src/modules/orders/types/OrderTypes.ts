import {InsuranceInfoCertificateTypeEnum} from "../enum/OrderEnum";

export type CathayInsuranceRequestPayloadType = {
  CUSTOMER_NAME: string;
  CERTIFICATE_TYPE: InsuranceInfoCertificateTypeEnum;
  CERTIFICATE_NUMBER: string;
  PHONE_NUMBER?: string;
  ADDRESS: string;
  EMAIL: string;
  RGST_NO?: string;
  FRAM_NO: string;
  ENGN_NO: string;
  VEHC_KD: string;
  VEHC_PURP: string;
  IS_BUSSINESS: string;
  POL_DT: string;
  POL_DUE_DT: string;
  AMT_VOLUNTARY?: string;
  PREM_VOLUNTARY?: number;
  INSR_CNT?: string;
  AMT: string;
  PREM: string;
  TAXES?: string;
  MAX_CAPL?: string;
  IS_VOLUNTARY: string;
  CARX_NO: string;
  SEND_DATE_INFO: string;
};