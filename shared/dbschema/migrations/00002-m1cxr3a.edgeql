CREATE MIGRATION m1cxr3alczsdjgsdc7i73q3u5ocdffs2hs4dere6ivdpvp2ujlvc4q
    ONTO m1zj5u2xqebhtu7md3ivckhaut6qblp6mtthqtq3676magny5xqsyq
{
  CREATE SCALAR TYPE default::VersionStatus EXTENDING enum<Draft, Pending_Verification, Approved, Changes_Requested, Rejected>;
};
