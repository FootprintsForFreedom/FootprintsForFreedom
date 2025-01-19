using extension auth;

module default {
  global current_user := (
    assert_single((
      select User { id, name, role }
      filter .identity = global ext::auth::ClientTokenIdentity
    ))
  );

  global server_admin: bool {
    default := false;
  }

  scalar type Role extending enum<User, Moderator, Admin>;
  scalar type VersionStatus extending enum<Draft, Pending_Verification, Approved, Changes_Requested, Rejected>;
  scalar type MediaFileTypes extending enum<Image, Video, Audio, Document>;

  abstract type HasTitle {
    required title: str;
    required slug: str;
  }

  abstract type HasDescriptionAndSource {
    required description: str;
    required source: str;
  }

  abstract type HasLanguage {
    required language: Language;
  }

  abstract type HasLocalizedTitle extending HasTitle, HasLanguage { }

  abstract type HasLocation {
    required latitude: float64;
    required longitude: float64;
  }

  abstract type HasStatus {
    required status: VersionStatus {
      default := <VersionStatus>'Draft';
    }
      verified_by: User;
    change_requests := .<version_with_status[is ChangeRequest];
  }

  abstract type HasCreator {
    created_by: User {
      rewrite insert using (global current_user)
    }
  }

  abstract type HasTimestamps {
    required created: datetime {
      rewrite insert using (datetime_of_statement());
      readonly := true;
    }
    required modified: datetime {
      rewrite insert, update using (datetime_of_statement())
    }
  }

  type SeedStatus extending HasTimestamps {
    required seed_name: str {
      constraint exclusive;
    }
    required performed_at: datetime {
      readonly := true;
      rewrite insert using (datetime_of_statement());
    }
  }

  type User extending HasTimestamps {
    required name: str {
      constraint exclusive;
    };
    required email: str {
      constraint exclusive;
    };
    identity: ext::auth::Identity;
    required role: Role {
      default := <Role>'User';
    }

    places := .<created_by[is PlaceVersion];
    media := .<created_by[is MediaVersion];
    change_requests := .<created_by[is ChangeRequest];
    verified_places := .<verified_by[is PlaceVersion];
    verified_media := .<verified_by[is MediaVersion];

    access policy user_themself_has_full_access
      allow all
      using (global current_user.identity.id ?= .identity.id) {
        errmessage := "Only the user themselves can access this data."
      };

    access policy admin_has_full_access
      allow all
      using (global current_user.role ?= <Role>'Admin') {
        errmessage := "Only admins can access this data."
      };

    access policy user_read_create_update_only
      allow select, insert, update;
  }

  type Language extending HasTimestamps {
    required code: str {
      constraint exclusive;
    }
    required name: str {
      constraint exclusive;
    }
    required native_name: str {
      constraint exclusive;
    }
    order: int16 {
      constraint exclusive;
    }

    access policy admin_has_full_access
      allow all
      using (global current_user.role ?= <Role>'Admin') {
        errmessage := "Only admins can access this data."
      };

    access policy server_admin_has_full_access
      allow all
      using (global server_admin ?= true) {
        errmessage := "Only server admins can access this data."
      };

    access policy language_read_only
      allow select;
  }

  type LegalDocument extending HasTitle, HasTimestamps {
    translations := .<document[is LegalDocumentTranslation];

    access policy admin_has_full_access
      allow all
      using (global current_user.role ?= <Role>'Admin') {
        errmessage := "Only admins can access this data."
      };

    access policy server_admin_has_full_access
      allow all
      using (global server_admin ?= true) {
        errmessage := "Only server admins can access this data."
      };

    access policy legal_document_read_only
      allow select;
  }

  type LegalDocumentTranslation extending HasLocalizedTitle, HasTimestamps {
    required document: LegalDocument;
    required content: str;

    access policy admin_has_full_access
      allow all
      using (global current_user.role ?= <Role>'Admin') {
        errmessage := "Only admins can access this data."
      };

    access policy server_admin_has_full_access
      allow all
      using (global server_admin ?= true) {
        errmessage := "Only server admins can access this data."
      };

    access policy legal_document_translation_read_only
      allow select;
  }

  type Place extending HasLocation, HasTimestamps {
    versions := .<place[is PlaceVersion];

    access policy admin_has_full_access
      allow all
      using (global current_user.role ?= <Role>'Admin') {
        errmessage := "Only admins can access this data."
      };

    access policy moderator_has_full_access
      allow all
      using (global current_user.role ?= <Role>'Moderator') {
        errmessage := "Only moderators can access this data."
      };

    access policy place_read_only
      allow select;
  }

  type PlaceVersion extending HasLocalizedTitle, HasDescriptionAndSource, HasLocation, HasStatus, HasCreator, HasTimestamps {
    required place: Place;

    access policy admin_has_full_access
      allow all
      using (global current_user.role ?= <Role>'Admin') {
        errmessage := "Only admins can access this data."
      };

    access policy moderator_has_full_access
      allow all
      using (global current_user.role ?= <Role>'Moderator') {
        errmessage := "Only moderators can access this data."
      };

    access policy place_version_read_only
      allow select;

    access policy every_user_can_create
      allow select, insert
      using (global current_user ?!= <User>{});

    access policy author_has_full_access
      allow all
      using (global current_user.id ?= .created_by.id) {
        errmessage := "Only the author can access this data."
      };
  }

  type ChangeRequest extending HasCreator, HasTimestamps {
    required version_with_status: HasStatus;
    required reason: str;
    required resolved: bool {
      default := false;
    }

    access policy admin_has_full_access
      allow all
      using (global current_user.role ?= <Role>'Admin') {
        errmessage := "Only admins can access this data."
      };

    access policy moderator_has_full_access
      allow all
      using (global current_user.role ?= <Role>'Moderator') {
        errmessage := "Only moderators can access this data."
      };

    access policy change_request_read_only
      allow select;
  }

  type Media extending HasTimestamps {
    required file: MediaFile;
    required place: Place;
    versions := .<media[is MediaVersion];

    access policy admin_has_full_access
      allow all
      using (global current_user.role ?= <Role>'Admin') {
        errmessage := "Only admins can access this data."
      };

    access policy moderator_has_full_access
      allow all
      using (global current_user.role ?= <Role>'Moderator') {
        errmessage := "Only moderators can access this data."
      };

    access policy media_read_only
      allow select;
  }

  type MediaFile {
    required file_path: str;
    required type: MediaFileTypes;
    medias := .<file[is Media];
    media_versions := .<file[is MediaVersion];

    access policy admin_has_full_access
      allow all
      using (global current_user.role ?= <Role>'Admin') {
        errmessage := "Only admins can access this data."
      };

    access policy media_file_read_only
      allow select;

    access policy every_user_can_create
      allow select, insert
      using (global current_user ?!= <User>{});
  }

  type MediaVersion extending HasLocalizedTitle, HasDescriptionAndSource, HasStatus, HasCreator, HasTimestamps {
    required media: Media;
    file: MediaFile;

    access policy admin_has_full_access
      allow all
      using (global current_user.role ?= <Role>'Admin') {
        errmessage := "Only admins can access this data."
      };

    access policy moderator_has_full_access
      allow all
      using (global current_user.role ?= <Role>'Moderator') {
        errmessage := "Only moderators can access this data."
      };

    access policy media_version_read_only
      allow select;

    access policy every_user_can_create
      allow select, insert
      using (global current_user ?!= <User>{});

    access policy author_has_full_access
      allow all
      using (global current_user.id ?= .created_by.id) {
        errmessage := "Only the author can access this data."
      };
  }
}
