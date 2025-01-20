CREATE MIGRATION m17fdeyacjotenia6cte6m22bv5kkyqvya6tyijgbfkyikswjepytq
    ONTO m1nd56esoykze3zytsefkfqcnyjd64ikvq7tqeg3i2vsswbbqruuga
{
  CREATE GLOBAL default::server_admin -> std::bool {
      SET default := false;
  };
  ALTER TYPE default::Language {
      CREATE ACCESS POLICY server_admin_has_full_access
          ALLOW ALL USING ((GLOBAL default::server_admin ?= true)) {
              SET errmessage := 'Only server admins can access this data.';
          };
  };
  ALTER TYPE default::LegalDocument {
      CREATE ACCESS POLICY server_admin_has_full_access
          ALLOW ALL USING ((GLOBAL default::server_admin ?= true)) {
              SET errmessage := 'Only server admins can access this data.';
          };
  };
  ALTER TYPE default::LegalDocumentTranslation {
      CREATE ACCESS POLICY server_admin_has_full_access
          ALLOW ALL USING ((GLOBAL default::server_admin ?= true)) {
              SET errmessage := 'Only server admins can access this data.';
          };
  };
};
