CREATE MIGRATION m1ufaxbcliixg4wggidspx2hr2rw24uo6f2blxlcaejkguqog2t5ta
    ONTO m1gdg7izo2xiu4cs7w5m55h5medqnbnhr7gpln3df2ysrj6vvyxdxa
{
  ALTER TYPE default::HasStatus {
      ALTER PROPERTY status {
          SET default := (<default::VersionStatus>'draft');
      };
  };
  ALTER SCALAR TYPE default::VersionStatus EXTENDING enum<draft, pending_verification, approved, changes_requested, rejected>;
};
