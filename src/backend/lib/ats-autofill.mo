import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Types "../types/ats-autofill";

module {
  public type LivingProfile = Types.LivingProfile;
  public type AnswerBankEntry = Types.AnswerBankEntry;
  public type ApplicationRecord = Types.ApplicationRecord;
  public type DetectedField = Types.DetectedField;
  public type DraftRequest = Types.DraftRequest;
  public type DraftResponse = Types.DraftResponse;
  public type FieldSuggestion = Types.FieldSuggestion;
  public type ScanCapture = Types.ScanCapture;

  public func defaultProfile(now : Int) : LivingProfile {
    {
      identity = {
        fullName = "";
        email = "";
        phone = "";
        location = "";
        linkedin = "";
        portfolio = "";
      };
      headline = "";
      summary = "";
      skills = [];
      experience = [];
      projects = [];
      education = [];
      preferences = [];
      updatedAt = now;
    };
  };

  public func saveProfile(profile : LivingProfile, now : Int) : LivingProfile {
    { profile with updatedAt = now };
  };

  public func addOrUpdateAnswer(
    answers : [AnswerBankEntry],
    nextId : Nat,
    kind : Text,
    prompt : Text,
    answer : Text,
    sensitive : Bool,
    now : Int,
  ) : ([AnswerBankEntry], Nat, AnswerBankEntry) {
    let existing = findAnswerByKind(answers, kind);
    switch (existing) {
      case (?entry) {
        let updated = {
          entry with prompt = prompt;
          answer = answer;
          sensitive = sensitive;
          updatedAt = now;
        };
        (replaceAnswer(answers, updated), nextId, updated);
      };
      case null {
        let created = {
          id = nextId;
          kind = kind;
          prompt = prompt;
          answer = answer;
          sensitive = sensitive;
          updatedAt = now;
        };
        (append(answers, created), nextId + 1, created);
      };
    };
  };

  public func createApplication(
    applications : [ApplicationRecord],
    nextId : Nat,
    company : Text,
    title : Text,
    url : Text,
    platform : Text,
    status : Text,
    usedAnswerIds : [Nat],
    now : Int,
  ) : ([ApplicationRecord], Nat, ApplicationRecord) {
    let created = {
      id = nextId;
      company = company;
      title = title;
      url = url;
      platform = platform;
      status = status;
      usedAnswerIds = usedAnswerIds;
      createdAt = now;
      updatedAt = now;
    };
    (append(applications, created), nextId + 1, created);
  };

  public func createDraft(
    request : DraftRequest,
    profile : ?LivingProfile,
    answers : [AnswerBankEntry],
    nextId : Nat,
    now : Int,
  ) : DraftResponse {
    {
      id = nextId;
      mode = request.mode;
      platform = request.platform;
      url = request.url;
      createdAt = now;
      suggestions = Array.map<DetectedField, FieldSuggestion>(
        request.fields,
        func(field) {
          let kind = classifyField(field);
          let answer = findAnswerByKind(answers, kind);
          let valueAndSource = suggestValue(kind, field, request, profile, answer);
          let sensitive = isSensitiveKind(kind) or optionSensitive(answer);
          {
            fieldId = field.id;
            fieldLabel = bestLabel(field);
            kind = kind;
            value = valueAndSource.0;
            source = valueAndSource.1;
            confidence = valueAndSource.2;
            requiresReview = sensitive or kind == "custom" or request.mode == "tailored-draft";
          };
        },
      );
    };
  };

  public func recentApplications(applications : [ApplicationRecord]) : [ApplicationRecord] {
    tail(applications, 10);
  };

  public func recentAnswers(answers : [AnswerBankEntry]) : [AnswerBankEntry] {
    tail(answers, 20);
  };

  public func createScanCapture(
    captures : [ScanCapture],
    nextId : Nat,
    request : DraftRequest,
    suggestions : [FieldSuggestion],
    now : Int,
  ) : ([ScanCapture], Nat, ScanCapture) {
    let created = {
      id = nextId;
      platform = request.platform;
      url = request.url;
      pageTitle = request.pageTitle;
      fields = request.fields;
      suggestions = suggestions;
      createdAt = now;
    };
    (append(captures, created), nextId + 1, created);
  };

  public func recentScanCaptures(captures : [ScanCapture]) : [ScanCapture] {
    tail(captures, 25);
  };

  func suggestValue(
    kind : Text,
    field : DetectedField,
    request : DraftRequest,
    profile : ?LivingProfile,
    answer : ?AnswerBankEntry,
  ) : (Text, Text, Nat) {
    switch (answer) {
      case (?entry) { return (entry.answer, "approved-answer", 92) };
      case null {};
    };

    switch (profile) {
      case null { ("", "missing-profile", 0) };
      case (?p) {
        if (kind == "fullName") { (p.identity.fullName, "profile.identity", 88) }
        else if (kind == "email") { (p.identity.email, "profile.identity", 90) }
        else if (kind == "phone") { (p.identity.phone, "profile.identity", 88) }
        else if (kind == "location") { (p.identity.location, "profile.identity", 82) }
        else if (kind == "linkedin") { (p.identity.linkedin, "profile.links", 86) }
        else if (kind == "portfolio") { (p.identity.portfolio, "profile.links", 86) }
        else if (kind == "coverLetter") {
          (
            "I am interested in " # request.job.title # " at " # request.job.company # ". " # p.summary,
            "tailored-draft",
            62,
          )
        } else if (kind == "custom" and request.mode == "tailored-draft") {
          (
            "Draft from profile: " # p.summary,
            "tailored-draft",
            45,
          )
        } else {
          ignore field;
          ("", "no-match", 0);
        };
      };
    };
  };

  func classifyField(field : DetectedField) : Text {
    let haystack = field.fieldLabel # " " # field.name # " " # field.placeholder # " " # field.ariaLabel;
    if (containsAny(haystack, ["disability", "Disability", "disabled", "Disabled", "form cc-305", "Form CC-305", "reasonable accommodation", "Reasonable accommodation"])) { "disability" }
    else if (containsAny(haystack, ["veteran", "Veteran", "protected veteran", "Protected veteran", "armed forces", "Armed forces", "military service", "Military service"])) { "veteran" }
    else if (containsAny(haystack, ["race", "Race", "ethnicity", "Ethnicity", "hispanic", "Hispanic", "latino", "Latino", "black", "Black", "african american", "African American", "white", "White", "asian", "Asian", "native hawaiian", "Native Hawaiian", "pacific islander", "Pacific Islander", "american indian", "American Indian", "alaska native", "Alaska Native", "two or more races", "Two or More Races"])) { "race" }
    else if (containsAny(haystack, ["gender", "Gender", "male", "Male", "female", "Female", "decline to self-identify", "Decline to self-identify"])) { "gender" }
    else if (containsAny(haystack, ["pronouns", "Pronouns", "she/her", "She/Her", "he/him", "He/Him", "they/them", "They/Them"])) { "pronouns" }
    else if (containsAny(haystack, ["eeo", "EEO", "equal employment", "Equal Employment", "self-identify", "Self-identify", "voluntary self-identification", "Voluntary Self-Identification", "demographic", "Demographic"])) { "eeo" }
    else if (containsAny(haystack, ["email", "Email", "e-mail", "E-mail"])) { "email" }
    else if (containsAny(haystack, ["phone", "Phone", "mobile", "Mobile", "cell", "Cell"])) { "phone" }
    else if (containsAny(haystack, ["first name", "First name", "First Name", "given name", "Given name", "Given Name"])) { "firstName" }
    else if (containsAny(haystack, ["last name", "Last name", "Last Name", "surname", "Surname", "family name", "Family name", "Family Name"])) { "lastName" }
    else if (containsAny(haystack, ["full name", "Full name", "Full Name", "legal name", "Legal name", "Legal Name", "name", "Name"])) { "fullName" }
    else if (containsAny(haystack, ["location", "Location", "city", "City", "state", "State", "address", "Address"])) { "location" }
    else if (containsAny(haystack, ["linkedin", "LinkedIn", "Linkedin"])) { "linkedin" }
    else if (containsAny(haystack, ["portfolio", "Portfolio", "website", "Website", "github", "Github", "GitHub", "personal site", "Personal site", "Personal Site"])) { "portfolio" }
    else if (containsAny(haystack, ["resume", "Resume", "cv", "CV"])) { "resume" }
    else if (containsAny(haystack, ["cover letter", "Cover letter", "Cover Letter"])) { "coverLetter" }
    else if (containsAny(haystack, ["authorized", "Authorized", "work authorization", "Work authorization", "Work Authorization", "eligible to work", "Eligible to work", "Eligible to Work"])) { "workAuthorization" }
    else if (containsAny(haystack, ["sponsor", "Sponsor", "sponsorship", "Sponsorship", "visa", "Visa"])) { "sponsorship" }
    else if (containsAny(haystack, ["salary", "Salary", "compensation", "Compensation", "pay", "Pay"])) { "salary" }
    else { "custom" };
  };

  func containsAny(text : Text, needles : [Text]) : Bool {
    var found = false;
    for (needle in needles.vals()) {
      if (Text.contains(text, #text needle)) {
        found := true;
      };
    };
    found;
  };

  func bestLabel(field : DetectedField) : Text {
    if (field.fieldLabel != "") { field.fieldLabel }
    else if (field.placeholder != "") { field.placeholder }
    else if (field.name != "") { field.name }
    else { field.id };
  };

  func isSensitiveKind(kind : Text) : Bool {
    kind == "workAuthorization" or kind == "sponsorship" or kind == "salary" or kind == "gender" or kind == "race" or kind == "veteran" or kind == "disability" or kind == "pronouns" or kind == "eeo";
  };

  func optionSensitive(answer : ?AnswerBankEntry) : Bool {
    switch (answer) {
      case (?entry) { entry.sensitive };
      case null { false };
    };
  };

  func findAnswerByKind(answers : [AnswerBankEntry], kind : Text) : ?AnswerBankEntry {
    for (entry in answers.vals()) {
      if (entry.kind == kind) {
        return ?entry;
      };
    };
    null;
  };

  func replaceAnswer(answers : [AnswerBankEntry], updated : AnswerBankEntry) : [AnswerBankEntry] {
    Array.map<AnswerBankEntry, AnswerBankEntry>(
      answers,
      func(entry) {
        if (entry.id == updated.id) { updated } else { entry };
      },
    );
  };

  func append<T>(items : [T], item : T) : [T] {
    Array.tabulate<T>(
      items.size() + 1,
      func(i) {
        if (i < items.size()) { items[i] } else { item };
      },
    );
  };

  func tail<T>(items : [T], count : Nat) : [T] {
    let total = items.size();
    if (count == 0) {
      [];
    } else if (total <= count) {
      items;
    } else {
      let start = Nat.sub(total, count);
      Array.tabulate<T>(count, func(i) { items[start + i] });
    };
  };
};
