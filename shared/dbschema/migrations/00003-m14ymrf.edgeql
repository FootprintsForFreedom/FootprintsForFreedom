CREATE MIGRATION m14ymrfxed5m45w3zicm6s7f5bikhbhh4qjdxxxm3utmgemjkagtya
    ONTO m1x2t4gqhiu37fgt2at5ykcjlv225uato6onzwodo7nc26b7lscdca
{
  ALTER TYPE default::User {
      CREATE REQUIRED PROPERTY email: std::str {
          SET REQUIRED USING (<std::str>{});
      };
  };
};
