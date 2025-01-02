CREATE MIGRATION m1xhjnjsj6s5pspzoes2oqdc3ir44j7vwlu6ojaq6htpqaplcrkxna
    ONTO m1i2luwiyurmtcl7puz3zftmjpf5sr7iscladbl4te6ses43pnhoda
{
  ALTER TYPE default::HasTimestamps {
      ALTER PROPERTY created {
          SET readonly := true;
      };
      ALTER PROPERTY modified {
          SET REQUIRED USING (std::datetime_current());
          CREATE REWRITE
              INSERT 
              USING (std::datetime_of_statement());
      };
  };
  ALTER TYPE default::User {
      ALTER LINK identity {
          RESET OPTIONALITY;
      };
  };
};
