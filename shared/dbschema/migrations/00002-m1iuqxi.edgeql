CREATE MIGRATION m1iuqxixm4uzeohzj3yzll2tzjqxgp5spd2qwowjtgbeprkeugtclq
    ONTO m1nhjuosebkyr6xqzehug35nzezgpzl2lm7nvbngehoicjrsxsbteq
{
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
  ALTER TYPE default::User {
      ALTER LINK verifiedMedia {
          RENAME TO verified_media;
      };
  };
  ALTER TYPE default::User {
      ALTER LINK verifiedPlaces {
          RENAME TO verified_places;
      };
  };
};
