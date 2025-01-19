CREATE MIGRATION m1asqqbegpvps66otci4ivggydbnxg32zqk4u7qqdabznmxd3kzrmq
    ONTO m1nudaoorp67uduw4osqhdjurbggibli74mmh3roitqc6smzrpwi6q
{
  ALTER TYPE default::Language {
      ALTER PROPERTY code {
          CREATE CONSTRAINT std::exclusive;
      };
      ALTER PROPERTY name {
          CREATE CONSTRAINT std::exclusive;
      };
  };
};
