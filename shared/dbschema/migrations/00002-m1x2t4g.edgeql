CREATE MIGRATION m1x2t4gqhiu37fgt2at5ykcjlv225uato6onzwodo7nc26b7lscdca
    ONTO m1s6ayqhuakwy2dza4oglnayipzdgppm3eodk3wzakdrdrahxuoj5a
{
  ALTER TYPE default::HasStatus {
      CREATE LINK verified_by: default::User;
  };
  ALTER TYPE default::MediaVersion {
      ALTER LINK verified_by {
          DROP OWNED;
          RESET TYPE;
      };
  };
  ALTER TYPE default::PlaceVersion {
      ALTER LINK verified_by {
          DROP OWNED;
          RESET TYPE;
      };
  };
};
