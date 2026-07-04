module {
  public type ProfileIdentity = {
    fullName : Text;
    email : Text;
    phone : Text;
    location : Text;
    linkedin : Text;
    portfolio : Text;
  };

  public type WorkExperience = {
    company : Text;
    title : Text;
    startDate : Text;
    endDate : Text;
    highlights : [Text];
  };

  public type Project = {
    name : Text;
    url : Text;
    summary : Text;
    highlights : [Text];
  };

  public type LivingProfile = {
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

  public type AnswerBankEntry = {
    id : Nat;
    kind : Text;
    prompt : Text;
    answer : Text;
    sensitive : Bool;
    updatedAt : Int;
  };

  public type ApplicationRecord = {
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

  public type DetectedField = {
    id : Text;
    name : Text;
    label : Text;
    placeholder : Text;
    ariaLabel : Text;
    tagName : Text;
    fieldType : Text;
  };

  public type DraftJobContext = {
    company : Text;
    title : Text;
    description : Text;
  };

  public type DraftRequest = {
    url : Text;
    pageTitle : Text;
    platform : Text;
    mode : Text;
    job : DraftJobContext;
    fields : [DetectedField];
  };

  public type FieldSuggestion = {
    fieldId : Text;
    label : Text;
    kind : Text;
    value : Text;
    confidence : Nat;
    source : Text;
    requiresReview : Bool;
  };

  public type DraftResponse = {
    id : Nat;
    mode : Text;
    platform : Text;
    url : Text;
    suggestions : [FieldSuggestion];
    createdAt : Int;
  };
};
