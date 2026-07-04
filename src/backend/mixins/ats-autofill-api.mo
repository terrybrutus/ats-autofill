import Array "mo:core/Array";
import Time "mo:core/Time";
import Types "../types/ats-autofill";
import AtsAutofill "../lib/ats-autofill";

mixin (profileState : { var profile : ?Types.Profile }, answersState : { var answers : [Types.GeneratedAnswer]; var nextId : Nat }) {
  public shared ({ caller }) func saveProfile(text : Text) : async () {
    ignore caller;
    profileState.profile := ?AtsAutofill.saveProfile(text, Time.now());
  };

  public query func getProfile() : async ?Types.Profile {
    profileState.profile;
  };

  public query func getProfileCharCount() : async Nat {
    AtsAutofill.getProfileText(profileState.profile).size();
  };

  public shared ({ caller }) func generateAnswer(question : Text) : async Types.GeneratedAnswer {
    ignore caller;
    let id = answersState.nextId;
    answersState.nextId := id + 1;
    let answer = AtsAutofill.generateAnswer(profileState.profile, question, Time.now());
    let stamped = { answer with id };
    let prev = answersState.answers;
    answersState.answers := Array.tabulate(
      prev.size() + 1,
      func(i) {
        if (i < prev.size()) { prev[i] } else { stamped };
      }
    );
    stamped;
  };

  public query func recentAnswers() : async [Types.GeneratedAnswer] {
    AtsAutofill.recentAnswers(answersState.answers);
  };
};
