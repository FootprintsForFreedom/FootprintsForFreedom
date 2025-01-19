CREATE MIGRATION m1nhjuosebkyr6xqzehug35nzezgpzl2lm7nvbngehoicjrsxsbteq
    ONTO initial
{
  CREATE EXTENSION pgcrypto VERSION '1.3';
  CREATE EXTENSION auth VERSION '1.0';
  CREATE ABSTRACT TYPE default::HasTimestamps {
      CREATE REQUIRED PROPERTY created: std::datetime {
          SET readonly := true;
          CREATE REWRITE
              INSERT 
              USING (std::datetime_of_statement());
      };
      CREATE REQUIRED PROPERTY modified: std::datetime {
          CREATE REWRITE
              INSERT 
              USING (std::datetime_of_statement());
          CREATE REWRITE
              UPDATE 
              USING (std::datetime_of_statement());
      };
  };
  CREATE SCALAR TYPE default::Role EXTENDING enum<User, Moderator, Admin>;
  CREATE TYPE default::User EXTENDING default::HasTimestamps {
      CREATE LINK identity: ext::auth::Identity;
      CREATE REQUIRED PROPERTY name: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY role: default::Role {
          SET default := (<default::Role>'User');
      };
      CREATE REQUIRED PROPERTY email: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE ACCESS POLICY user_read_create_update_only
          ALLOW SELECT, UPDATE, INSERT ;
  };
  CREATE ABSTRACT TYPE default::HasCreator {
      CREATE LINK created_by: default::User;
  };
  CREATE GLOBAL default::current_user := (std::assert_single((SELECT
      default::User {
          id,
          name,
          role
      }
  FILTER
      (.identity = GLOBAL ext::auth::ClientTokenIdentity)
  )));
  CREATE TYPE default::ChangeRequest EXTENDING default::HasCreator, default::HasTimestamps {
      CREATE ACCESS POLICY admin_has_full_access
          ALLOW ALL USING (((GLOBAL default::current_user).role ?= <default::Role>'Admin')) {
              SET errmessage := 'Only admins can access this data.';
          };
      CREATE ACCESS POLICY moderator_has_full_access
          ALLOW ALL USING (((GLOBAL default::current_user).role ?= <default::Role>'Moderator')) {
              SET errmessage := 'Only moderators can access this data.';
          };
      CREATE ACCESS POLICY change_request_read_only
          ALLOW SELECT ;
      CREATE REQUIRED PROPERTY reason: std::str;
      CREATE REQUIRED PROPERTY resolved: std::bool {
          SET default := false;
      };
  };
  CREATE TYPE default::Language EXTENDING default::HasTimestamps {
      CREATE ACCESS POLICY admin_has_full_access
          ALLOW ALL USING (((GLOBAL default::current_user).role ?= <default::Role>'Admin')) {
              SET errmessage := 'Only admins can access this data.';
          };
      CREATE ACCESS POLICY language_read_only
          ALLOW SELECT ;
      CREATE REQUIRED PROPERTY code: std::str;
      CREATE REQUIRED PROPERTY name: std::str;
      CREATE PROPERTY order: std::int16;
  };
  CREATE ABSTRACT TYPE default::HasTitle {
      CREATE REQUIRED PROPERTY slug: std::str;
      CREATE REQUIRED PROPERTY title: std::str;
  };
  CREATE ABSTRACT TYPE default::HasLanguage {
      CREATE REQUIRED LINK language: default::Language;
  };
  CREATE ABSTRACT TYPE default::HasLocalizedTitle EXTENDING default::HasTitle, default::HasLanguage;
  CREATE TYPE default::LegalDocument EXTENDING default::HasTitle, default::HasTimestamps {
      CREATE ACCESS POLICY admin_has_full_access
          ALLOW ALL USING (((GLOBAL default::current_user).role ?= <default::Role>'Admin')) {
              SET errmessage := 'Only admins can access this data.';
          };
      CREATE ACCESS POLICY legal_document_read_only
          ALLOW SELECT ;
      CREATE REQUIRED PROPERTY content: std::str;
  };
  CREATE TYPE default::LegalDocumentTranslation EXTENDING default::HasLocalizedTitle, default::HasTimestamps {
      CREATE ACCESS POLICY admin_has_full_access
          ALLOW ALL USING (((GLOBAL default::current_user).role ?= <default::Role>'Admin')) {
              SET errmessage := 'Only admins can access this data.';
          };
      CREATE REQUIRED LINK document: default::LegalDocument;
      CREATE ACCESS POLICY legal_document_translation_read_only
          ALLOW SELECT ;
      CREATE REQUIRED PROPERTY content: std::str;
  };
  CREATE ABSTRACT TYPE default::HasLocation {
      CREATE REQUIRED PROPERTY latitude: std::float64;
      CREATE REQUIRED PROPERTY longitude: std::float64;
  };
  CREATE TYPE default::Media EXTENDING default::HasTimestamps {
      CREATE ACCESS POLICY admin_has_full_access
          ALLOW ALL USING (((GLOBAL default::current_user).role ?= <default::Role>'Admin')) {
              SET errmessage := 'Only admins can access this data.';
          };
      CREATE ACCESS POLICY moderator_has_full_access
          ALLOW ALL USING (((GLOBAL default::current_user).role ?= <default::Role>'Moderator')) {
              SET errmessage := 'Only moderators can access this data.';
          };
      CREATE ACCESS POLICY media_read_only
          ALLOW SELECT ;
  };
  CREATE SCALAR TYPE default::MediaFileTypes EXTENDING enum<Image, Video, Audio, Document>;
  CREATE TYPE default::MediaFile {
      CREATE ACCESS POLICY admin_has_full_access
          ALLOW ALL USING (((GLOBAL default::current_user).role ?= <default::Role>'Admin')) {
              SET errmessage := 'Only admins can access this data.';
          };
      CREATE ACCESS POLICY every_user_can_create
          ALLOW SELECT, INSERT USING ((GLOBAL default::current_user ?!= <default::User>{}));
      CREATE ACCESS POLICY media_file_read_only
          ALLOW SELECT ;
      CREATE REQUIRED PROPERTY file_path: std::str;
      CREATE REQUIRED PROPERTY type: default::MediaFileTypes;
  };
  CREATE ABSTRACT TYPE default::HasDescriptionAndSource {
      CREATE REQUIRED PROPERTY description: std::str;
      CREATE REQUIRED PROPERTY source: std::str;
  };
  CREATE SCALAR TYPE default::VersionStatus EXTENDING enum<Draft, Pending_Verification, Approved, Changes_Requested, Rejected>;
  CREATE ABSTRACT TYPE default::HasStatus {
      CREATE LINK verified_by: default::User;
      CREATE REQUIRED PROPERTY status: default::VersionStatus {
          SET default := (<default::VersionStatus>'Draft');
      };
  };
  CREATE TYPE default::MediaVersion EXTENDING default::HasLocalizedTitle, default::HasDescriptionAndSource, default::HasStatus, default::HasCreator, default::HasTimestamps {
      CREATE ACCESS POLICY admin_has_full_access
          ALLOW ALL USING (((GLOBAL default::current_user).role ?= <default::Role>'Admin')) {
              SET errmessage := 'Only admins can access this data.';
          };
      CREATE ACCESS POLICY author_has_full_access
          ALLOW ALL USING (((GLOBAL default::current_user).id ?= .created_by.id)) {
              SET errmessage := 'Only the author can access this data.';
          };
      CREATE ACCESS POLICY every_user_can_create
          ALLOW SELECT, INSERT USING ((GLOBAL default::current_user ?!= <default::User>{}));
      CREATE ACCESS POLICY moderator_has_full_access
          ALLOW ALL USING (((GLOBAL default::current_user).role ?= <default::Role>'Moderator')) {
              SET errmessage := 'Only moderators can access this data.';
          };
      CREATE REQUIRED LINK media: default::Media;
      CREATE LINK file: default::MediaFile;
      CREATE ACCESS POLICY media_version_read_only
          ALLOW SELECT ;
  };
  ALTER TYPE default::ChangeRequest {
      CREATE REQUIRED LINK version_with_status: default::HasStatus;
  };
  ALTER TYPE default::HasStatus {
      CREATE LINK change_requests := (.<version_with_status[IS default::ChangeRequest]);
  };
  CREATE TYPE default::Place EXTENDING default::HasLocation, default::HasTimestamps {
      CREATE ACCESS POLICY admin_has_full_access
          ALLOW ALL USING (((GLOBAL default::current_user).role ?= <default::Role>'Admin')) {
              SET errmessage := 'Only admins can access this data.';
          };
      CREATE ACCESS POLICY moderator_has_full_access
          ALLOW ALL USING (((GLOBAL default::current_user).role ?= <default::Role>'Moderator')) {
              SET errmessage := 'Only moderators can access this data.';
          };
      CREATE ACCESS POLICY place_read_only
          ALLOW SELECT ;
  };
  CREATE TYPE default::PlaceVersion EXTENDING default::HasLocalizedTitle, default::HasDescriptionAndSource, default::HasLocation, default::HasStatus, default::HasCreator, default::HasTimestamps {
      CREATE ACCESS POLICY admin_has_full_access
          ALLOW ALL USING (((GLOBAL default::current_user).role ?= <default::Role>'Admin')) {
              SET errmessage := 'Only admins can access this data.';
          };
      CREATE ACCESS POLICY author_has_full_access
          ALLOW ALL USING (((GLOBAL default::current_user).id ?= .created_by.id)) {
              SET errmessage := 'Only the author can access this data.';
          };
      CREATE ACCESS POLICY every_user_can_create
          ALLOW SELECT, INSERT USING ((GLOBAL default::current_user ?!= <default::User>{}));
      CREATE ACCESS POLICY moderator_has_full_access
          ALLOW ALL USING (((GLOBAL default::current_user).role ?= <default::Role>'Moderator')) {
              SET errmessage := 'Only moderators can access this data.';
          };
      CREATE REQUIRED LINK place: default::Place;
      CREATE ACCESS POLICY place_version_read_only
          ALLOW SELECT ;
  };
  ALTER TYPE default::User {
      CREATE ACCESS POLICY admin_has_full_access
          ALLOW ALL USING (((GLOBAL default::current_user).role ?= <default::Role>'Admin')) {
              SET errmessage := 'Only admins can access this data.';
          };
      CREATE ACCESS POLICY user_themself_has_full_access
          ALLOW ALL USING (((GLOBAL default::current_user).identity.id ?= .identity.id)) {
              SET errmessage := 'Only the user themselves can access this data.';
          };
      CREATE LINK change_requests := (.<created_by[IS default::ChangeRequest]);
      CREATE LINK media := (.<created_by[IS default::MediaVersion]);
      CREATE LINK verifiedMedia := (.<verified_by[IS default::MediaVersion]);
      CREATE LINK places := (.<created_by[IS default::PlaceVersion]);
      CREATE LINK verifiedPlaces := (.<verified_by[IS default::PlaceVersion]);
  };
  ALTER TYPE default::Media {
      CREATE REQUIRED LINK file: default::MediaFile;
      CREATE REQUIRED LINK place: default::Place;
      CREATE LINK versions := (.<media[IS default::MediaVersion]);
  };
  ALTER TYPE default::MediaFile {
      CREATE LINK medias := (.<file[IS default::Media]);
      CREATE LINK media_versions := (.<file[IS default::MediaVersion]);
  };
  ALTER TYPE default::HasCreator {
      ALTER LINK created_by {
          CREATE REWRITE
              INSERT 
              USING (GLOBAL default::current_user);
      };
  };
  ALTER TYPE default::LegalDocument {
      CREATE MULTI LINK translations := (.<document[IS default::LegalDocumentTranslation]);
  };
  ALTER TYPE default::Place {
      CREATE LINK versions := (.<place[IS default::PlaceVersion]);
  };
};
