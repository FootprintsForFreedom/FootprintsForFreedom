CREATE MIGRATION m1i2luwiyurmtcl7puz3zftmjpf5sr7iscladbl4te6ses43pnhoda
    ONTO m14ymrfxed5m45w3zicm6s7f5bikhbhh4qjdxxxm3utmgemjkagtya
{
  ALTER TYPE default::HasTimestamps {
      ALTER PROPERTY modified {
          RESET OPTIONALITY;
      };
  };
};
