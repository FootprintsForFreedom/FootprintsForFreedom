CREATE MIGRATION m1gdg7izo2xiu4cs7w5m55h5medqnbnhr7gpln3df2ysrj6vvyxdxa
    ONTO m1cxr3alczsdjgsdc7i73q3u5ocdffs2hs4dere6ivdpvp2ujlvc4q
{
  ALTER TYPE default::HasStatus {
      CREATE REQUIRED PROPERTY status: default::VersionStatus {
          SET default := (<default::VersionStatus>'Draft');
      };
  };
};
