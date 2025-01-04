CREATE MIGRATION m1nbqd6eeafmsnm5mtnyzb2icjzocxl4q4hdb7os7zvnmeyeda5c5a
    ONTO m1rvlwfhmlanf72vn6tc226ufyyy7moigp5ukchsc5ay2zemij7rkq
{
  ALTER TYPE default::User {
      ALTER ACCESS POLICY user_themself_has_full_access USING (((GLOBAL default::current_user).identity.id ?= .identity.id));
  };
};
