import { Parser } from 'json2csv';

export const parseCsvData = (fields, data) => {
  const json2csv = new Parser({ fields, withBOM: true });
  const csv = json2csv.parse(data);
  return csv;
};

export const exportAgentFields = () => {
  return [
    {
      label: 'Agent Name',
      value: 'agent_name',
    },
    {
      label: 'Agent Phone Number',
      value: 'agent_phone_number',
    },
    {
      label: 'Agent Address',
      value: 'agent_address',
    },
    {
      label: 'Agent Avatar',
      value: 'agent_avatar',
    },
    // {
    //   label: 'Agent Images',
    //   value: 'agent_images',
    // },
    {
      label: 'Agent Description',
      value: 'agent_description',
    },
    {
      label: 'Top Agent',
      value: 'top_agent',
    },
    {
      label: 'Created At',
      value: 'created_at',
    },
    {
      label: 'Company Tax ID',
      value: 'company_tax_id',
    },
    {
      label: 'Company Name',
      value: 'company_name',
    },
    {
      label: 'Company Phone Number',
      value: 'company_phone_number',
    },
    {
      label: 'Company Address',
      value: 'company_address',
    },
    {
      label: 'Company Size',
      value: 'company_size',
    },
    // {
    //   label: 'Company License',
    //   value: 'company_license',
    // },
    {
      label: 'Company Email',
      value: 'company_email',
    },
    // {
    //   label: 'Company Other Info',
    //   value: 'company_other_info',
    // },
  ];
};
