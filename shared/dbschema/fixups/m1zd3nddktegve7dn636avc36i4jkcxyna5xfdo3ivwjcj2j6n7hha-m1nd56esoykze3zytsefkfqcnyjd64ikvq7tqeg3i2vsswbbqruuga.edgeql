CREATE MIGRATION m16rtdsswfjrexd3brysdvzgnx6puvtpa4nydsinxg5cfqwnyxtkeq
    ONTO m1zd3nddktegve7dn636avc36i4jkcxyna5xfdo3ivwjcj2j6n7hha
{
  ALTER TYPE default::Language {
      ALTER PROPERTY order {
          CREATE CONSTRAINT std::exclusive;
      };
  };
};
