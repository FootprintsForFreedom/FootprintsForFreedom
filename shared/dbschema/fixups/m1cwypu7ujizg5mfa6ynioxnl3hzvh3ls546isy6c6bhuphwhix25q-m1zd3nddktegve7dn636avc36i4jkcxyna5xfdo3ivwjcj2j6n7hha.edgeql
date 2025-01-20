CREATE MIGRATION m1pangkhiep4u2ghp3x3feicitygw7clet3m3z76zqf74tryfzdb6q
    ONTO m1cwypu7ujizg5mfa6ynioxnl3hzvh3ls546isy6c6bhuphwhix25q
{
  ALTER TYPE default::Language {
      CREATE REQUIRED PROPERTY native_name: std::str {
          SET REQUIRED USING (<std::str>{});
          CREATE CONSTRAINT std::exclusive;
      };
  };
};
