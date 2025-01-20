CREATE MIGRATION m1v37txatsnddghmkevxpr5vt6lmg7777qgmpsemm3thnc6x2cclaq
    ONTO m1iuqxixm4uzeohzj3yzll2tzjqxgp5spd2qwowjtgbeprkeugtclq
{
  ALTER TYPE default::LegalDocument {
      ALTER LINK translations {
          RESET CARDINALITY;
      };
      DROP PROPERTY content;
  };
};
