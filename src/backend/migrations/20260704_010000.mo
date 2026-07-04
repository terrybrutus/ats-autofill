import Array "mo:core/Array";
import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  type UserRole = { #admin; #user; #guest };

  type AccessControlState = {
    var adminAssigned : Bool;
    userRoles : Map.Map<Principal, UserRole>;
  };

  type Profile = {
    text : Text;
    updatedAt : Int;
  };

  type GeneratedAnswer = {
    id : Nat;
    question : Text;
    answer : Text;
    createdAt : Int;
  };

  type ProfileIdentity = {
    fullName : Text;
    email : Text;
    phone : Text;
    location : Text;
    linkedin : Text;
    portfolio : Text;
  };

  type WorkExperience = {
    company : Text;
    title : Text;
    startDate : Text;
    endDate : Text;
    highlights : [Text];
  };

  type Project = {
    name : Text;
    url : Text;
    summary : Text;
    highlights : [Text];
  };

  type LivingProfile = {
    identity : ProfileIdentity;
    headline : Text;
    summary : Text;
    skills : [Text];
    experience : [WorkExperience];
    projects : [Project];
    education : [Text];
    preferences : [Text];
    updatedAt : Int;
  };

  type AnswerBankEntry = {
    id : Nat;
    kind : Text;
    prompt : Text;
    answer : Text;
    sensitive : Bool;
    updatedAt : Int;
  };

  type ApplicationRecord = {
    id : Nat;
    company : Text;
    title : Text;
    url : Text;
    platform : Text;
    status : Text;
    usedAnswerIds : [Nat];
    createdAt : Int;
    updatedAt : Int;
  };

  type FieldSuggestion = {
    fieldId : Text;
    fieldLabel : Text;
    kind : Text;
    value : Text;
    confidence : Nat;
    source : Text;
    requiresReview : Bool;
  };

  type DraftResponse = {
    id : Nat;
    mode : Text;
    platform : Text;
    url : Text;
    suggestions : [FieldSuggestion];
    createdAt : Int;
  };

  type OldActor = {
    accessControlState : AccessControlState;
    profileState : { var profile : ?Profile };
    answersState : { var answers : [GeneratedAnswer]; var nextId : Nat };
  };

  type NewActor = {
    accessControlState : AccessControlState;
    profileState : { var profile : ?LivingProfile };
    answersState : { var answers : [AnswerBankEntry]; var nextId : Nat };
    applicationsState : { var applications : [ApplicationRecord]; var nextId : Nat };
    draftsState : { var drafts : [DraftResponse]; var nextId : Nat };
  };

  public func migration(old : OldActor) : NewActor {
    {
      accessControlState = old.accessControlState;
      profileState = { var profile = migrateProfile(old.profileState.profile) };
      answersState = {
        var answers = Array.map<GeneratedAnswer, AnswerBankEntry>(old.answersState.answers, migrateAnswer);
        var nextId = old.answersState.nextId;
      };
      applicationsState = { var applications = []; var nextId = 1 };
      draftsState = { var drafts = []; var nextId = 1 };
    };
  };

  func migrateProfile(profile : ?Profile) : ?LivingProfile {
    switch (profile) {
      case null { null };
      case (?old) {
        ?{
          identity = {
            fullName = "";
            email = "";
            phone = "";
            location = "";
            linkedin = "";
            portfolio = "";
          };
          headline = "";
          summary = old.text;
          skills = [];
          experience = [];
          projects = [];
          education = [];
          preferences = [];
          updatedAt = old.updatedAt;
        };
      };
    };
  };

  func migrateAnswer(answer : GeneratedAnswer) : AnswerBankEntry {
    {
      id = answer.id;
      kind = "custom";
      prompt = answer.question;
      answer = answer.answer;
      sensitive = false;
      updatedAt = answer.createdAt;
    };
  };
};
