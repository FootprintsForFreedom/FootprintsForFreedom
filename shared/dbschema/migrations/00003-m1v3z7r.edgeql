CREATE MIGRATION m1v3z7rzfhiwa7a6z24dmhdnwbqkv6tdtqsvt3n5n6xjy435gccyca
    ONTO m1nbqd6eeafmsnm5mtnyzb2icjzocxl4q4hdb7os7zvnmeyeda5c5a
{
  ALTER GLOBAL default::current_user USING (std::assert_single((SELECT
      default::User {
          id,
          name,
          role
      }
  FILTER
      (.identity = GLOBAL ext::auth::ClientTokenIdentity)
  )));
  ALTER TYPE default::User {
      DROP ACCESS POLICY user_read_and_create_only;
  };
  ALTER TYPE default::User {
      CREATE ACCESS POLICY user_read_create_update_only
          ALLOW SELECT, UPDATE, INSERT ;
  };
};
