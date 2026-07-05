import Array "mo:core/Array";
import Time "mo:core/Time";
import Types "../types/ats-autofill";
import AtsAutofill "../lib/ats-autofill";

mixin (
  profileState : { var profile : ?Types.LivingProfile },
  answersState : { var answers : [Types.AnswerBankEntry]; var nextId : Nat },
  applicationsState : { var applications : [Types.ApplicationRecord]; var nextId : Nat },
  draftsState : { var drafts : [Types.DraftResponse]; var nextId : Nat },
  scanCapturesState : { var captures : [Types.ScanCapture]; var nextId : Nat },
) {
  public shared ({ caller }) func saveProfile(profile : Types.LivingProfile) : async Types.LivingProfile {
    ignore caller;
    let saved = AtsAutofill.saveProfile(profile, Time.now());
    profileState.profile := ?saved;
    saved;
  };

  public query func getProfile() : async ?Types.LivingProfile {
    profileState.profile;
  };

  public shared ({ caller }) func saveAnswer(
    kind : Text,
    prompt : Text,
    answer : Text,
    sensitive : Bool,
  ) : async Types.AnswerBankEntry {
    ignore caller;
    let result = AtsAutofill.addOrUpdateAnswer(
      answersState.answers,
      answersState.nextId,
      kind,
      prompt,
      answer,
      sensitive,
      Time.now(),
    );
    answersState.answers := result.0;
    answersState.nextId := result.1;
    result.2;
  };

  public query func listAnswers() : async [Types.AnswerBankEntry] {
    AtsAutofill.recentAnswers(answersState.answers);
  };

  public shared ({ caller }) func createApplication(
    company : Text,
    title : Text,
    url : Text,
    platform : Text,
    status : Text,
    usedAnswerIds : [Nat],
  ) : async Types.ApplicationRecord {
    ignore caller;
    let result = AtsAutofill.createApplication(
      applicationsState.applications,
      applicationsState.nextId,
      company,
      title,
      url,
      platform,
      status,
      usedAnswerIds,
      Time.now(),
    );
    applicationsState.applications := result.0;
    applicationsState.nextId := result.1;
    result.2;
  };

  public query func listApplications() : async [Types.ApplicationRecord] {
    AtsAutofill.recentApplications(applicationsState.applications);
  };

  public shared ({ caller }) func createDraft(request : Types.DraftRequest) : async Types.DraftResponse {
    ignore caller;
    let draft = AtsAutofill.createDraft(
      request,
      profileState.profile,
      answersState.answers,
      draftsState.nextId,
      Time.now(),
    );
    draftsState.drafts := append(draftsState.drafts, draft);
    draftsState.nextId += 1;
    draft;
  };

  public query func recentDrafts() : async [Types.DraftResponse] {
    draftsState.drafts;
  };

  public shared ({ caller }) func saveScanCapture(
    request : Types.DraftRequest,
    suggestions : [Types.FieldSuggestion],
  ) : async Types.ScanCapture {
    ignore caller;
    let result = AtsAutofill.createScanCapture(
      scanCapturesState.captures,
      scanCapturesState.nextId,
      request,
      suggestions,
      Time.now(),
    );
    scanCapturesState.captures := result.0;
    scanCapturesState.nextId := result.1;
    result.2;
  };

  public query func listScanCaptures() : async [Types.ScanCapture] {
    AtsAutofill.recentScanCaptures(scanCapturesState.captures);
  };

  public query func getExtensionContractVersion() : async Text {
    "ats-autofill-contract-v1";
  };

  func append<T>(items : [T], item : T) : [T] {
    Array.tabulate<T>(
      items.size() + 1,
      func(i) {
        if (i < items.size()) { items[i] } else { item };
      },
    );
  };
};
