CREATE MIGRATION m1zj5u2xqebhtu7md3ivckhaut6qblp6mtthqtq3676magny5xqsyq
    ONTO initial
{
  CREATE ABSTRACT TYPE default::HasTimestamps {
      CREATE REQUIRED PROPERTY created: std::datetime {
          SET readonly := true;
          CREATE REWRITE
              INSERT 
              USING (std::datetime_of_statement());
      };
      CREATE REQUIRED PROPERTY modified: std::datetime {
          CREATE REWRITE
              INSERT 
              USING (std::datetime_of_statement());
          CREATE REWRITE
              UPDATE 
              USING (std::datetime_of_statement());
      };
  };
  CREATE TYPE default::User EXTENDING default::HasTimestamps {
      CREATE REQUIRED PROPERTY email: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY name: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  CREATE ABSTRACT TYPE default::HasCreator {
      CREATE LINK created_by: default::User;
  };
  CREATE ABSTRACT TYPE default::HasDescriptionAndSource {
      CREATE REQUIRED PROPERTY description: std::str;
      CREATE REQUIRED PROPERTY source: std::str;
  };
  CREATE TYPE default::Language EXTENDING default::HasTimestamps {
      CREATE REQUIRED PROPERTY code: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY name: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY native_name: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE PROPERTY order: std::int16 {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  CREATE ABSTRACT TYPE default::HasLanguage {
      CREATE REQUIRED LINK language: default::Language;
  };
  CREATE ABSTRACT TYPE default::HasTitle {
      CREATE REQUIRED PROPERTY slug: std::str;
      CREATE REQUIRED PROPERTY title: std::str;
  };
  CREATE ABSTRACT TYPE default::HasLocalizedTitle EXTENDING default::HasTitle, default::HasLanguage;
  CREATE ABSTRACT TYPE default::HasLocation {
      CREATE REQUIRED PROPERTY latitude: std::float64;
      CREATE REQUIRED PROPERTY longitude: std::float64;
  };
  CREATE ABSTRACT TYPE default::HasStatus {
      CREATE LINK verified_by: default::User;
  };
  CREATE TYPE default::SeedStatus EXTENDING default::HasTimestamps {
      CREATE REQUIRED PROPERTY performed_at: std::datetime {
          SET readonly := true;
          CREATE REWRITE
              INSERT 
              USING (std::datetime_of_statement());
      };
      CREATE REQUIRED PROPERTY seed_name: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
  };
};
