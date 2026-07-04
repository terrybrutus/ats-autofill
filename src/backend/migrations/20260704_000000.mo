import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  type UserRole = { #admin; #user; #guest };

  type AccessControlState = {
    var adminAssigned : Bool;
    userRoles : Map.Map<Principal, UserRole>;
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
    label : Text;
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

  type OldActor = {};
  type NewActor = {
    accessControlState : AccessControlState;
    profileState : { var profile : ?LivingProfile };
    answersState : { var answers : [AnswerBankEntry]; var nextId : Nat };
    applicationsState : { var applications : [ApplicationRecord]; var nextId : Nat };
    draftsState : { var drafts : [DraftResponse]; var nextId : Nat };
  };

  public func migration(_old : OldActor) : NewActor {
    {
      accessControlState = {
        var adminAssigned = false;
        userRoles = Map.empty();
      };
      profileState = { var profile = null };
      answersState = { var answers = []; var nextId = 1 };
      applicationsState = { var applications = []; var nextId = 1 };
      draftsState = { var drafts = []; var nextId = 1 };
    };
  };
};
