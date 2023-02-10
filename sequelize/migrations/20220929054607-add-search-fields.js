'use strict';

const tableSearchFields = [
  {
    tableName: 'products',
    mappingField: 'name',
    convertedField: 'converted_name',
    textSearchField: 'tsv_converted_name',
  },
  {
    tableName: 'services',
    mappingField: 'name',
    convertedField: 'converted_name',
    textSearchField: 'tsv_converted_name',
  },
  {
    tableName: 'agents',
    mappingField: 'name',
    convertedField: 'converted_name',
    textSearchField: 'tsv_converted_name',
  },
  {
    tableName: 'customers',
    mappingField: 'full_name',
    convertedField: 'converted_full_name',
    textSearchField: 'tsv_converted_full_name',
  },
  {
    tableName: 'posts',
    mappingField: 'title',
    convertedField: 'converted_title',
    textSearchField: 'tsv_converted_title',
  },
  {
    tableName: 'deals',
    mappingField: 'title',
    convertedField: 'converted_title',
    textSearchField: 'tsv_converted_title',
  },
  {
    tableName: 'roles',
    mappingField: 'name',
    convertedField: 'converted_name',
    textSearchField: 'tsv_converted_name',
  },
  {
    tableName: 'staffs',
    mappingField: 'name',
    convertedField: 'converted_name',
    textSearchField: 'tsv_converted_name',
  },
  {
    tableName: 'flash_buy_requests',
    mappingField: 'product_name',
    convertedField: 'converted_product_name',
    textSearchField: 'tsv_converted_product_name',
  },
  {
    tableName: 'promotions',
    mappingField: 'name',
    convertedField: 'converted_name',
    textSearchField: 'tsv_converted_name',
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
      // CREATE REMOVE VIETNAMESE TONES
      await queryInterface.sequelize.query(`
        CREATE OR REPLACE FUNCTION remove_vietnamese_tones (x text) RETURNS text AS
        $$
        DECLARE cdau text; kdau text; r text;
        BEGIN
          cdau = 'áàảãạâấầẩẫậăắằẳẵặđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵÁÀẢÃẠÂẤẦẨẪẬĂẮẰẲẴẶĐÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴ';
          kdau = 'aaaaaaaaaaaaaaaaadeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyAAAAAAAAAAAAAAAAADEEEEEEEEEEEIIIIIOOOOOOOOOOOOOOOOOUUUUUUUUUUUYYYYY';
          r = x;
          FOR i IN 0..length(cdau)
          LOOP
          r = replace(r, substr(cdau,i,1), substr(kdau,i,1));
          END LOOP;
          RETURN lower(r);
        END;
        $$ LANGUAGE plpgsql;
      `, {logging: console.log ,transaction: t});

      for (let i = 0; i < tableSearchFields.length; i++) {
        const record = tableSearchFields[i];
        // ADD VIETNAMESE CONVERTED COLUMN
        await queryInterface.addColumn(record.tableName, record.convertedField, {
          type: Sequelize.DataTypes.STRING,
        }, {logging: console.log ,transaction: t});
        // CREATE TSVECTOR COLUMN
        await queryInterface.addColumn(record.tableName, record.textSearchField, {
          type: Sequelize.DataTypes.TSVECTOR,
        }, {logging: console.log ,transaction: t});
        // CREATE INDEX ON TSVECTOR FIELD
        await queryInterface.sequelize.query(`
          CREATE INDEX ${record.tableName}_${record.textSearchField}_idx ON ${record.tableName} USING GIN (${record.textSearchField});
        `, {logging: console.log ,transaction: t});
        // CREATE FUNCTION TO AUTO-UPDATING TSVECTOR COLUMN
        await queryInterface.sequelize.query(`
          CREATE FUNCTION ${record.tableName}_tsvector_trigger() RETURNS TRIGGER AS $$
          BEGIN
            new.${record.textSearchField} := setweight(to_tsvector(coalesce(new.${record.convertedField}, '')), 'A');
            return new;
          end
          $$ LANGUAGE plpgsql;
        `, {logging: console.log ,transaction: t});
        // CREATE TRIGGER FOR AUTO-UPDATING FUNCTION
        await queryInterface.sequelize.query(`
           CREATE TRIGGER ${record.tableName}_vector_update
              BEFORE INSERT OR UPDATE ON ${record.tableName} FOR EACH ROW EXECUTE PROCEDURE ${record.tableName}_tsvector_trigger();
        `, {logging: console.log ,transaction: t});
        // UPDATE CONVERTED COLUMN AND TSVECTOR COLUMN
        await queryInterface.sequelize.query(`
           update ${record.tableName}
           set ${record.convertedField} = remove_vietnamese_tones(${record.tableName}.${record.mappingField})
           where exists(select 1 from ${record.tableName} pt1 where pt1.${record.mappingField} is not null);
        `, {logging: console.log ,transaction: t});
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (t) => {
        for (let i = 0; i < tableSearchFields.length; i++) {
            const record = tableSearchFields[i];
            await queryInterface.sequelize.query(`alter table ${record.tableName} drop column if exists ${record.convertedField};`, {transaction: t});
            await queryInterface.sequelize.query(`alter table ${record.tableName} drop column if exists ${record.textSearchField};`, {transaction: t});
            await queryInterface.sequelize.query(`drop function if exists ${record.tableName}_tsvector_trigger() cascade;`, {transaction: t});
        }
        await queryInterface.sequelize.query(`drop function if exists remove_vietnamese_tones cascade;`, {transaction: t})
    });
  },
};
