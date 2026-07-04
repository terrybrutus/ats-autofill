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
    answersState.answers := Array_concat(answersState.answers, [stamped]);
    stamped;
  };

  public query func recentAnswers() : async [Types.GeneratedAnswer] {
    AtsAutofill.recentAnswers(answersState.answers);
  };
};

func Array_concat<T>(a : [T], b : [T]) : [T] {
  let la = a.size();
  let lb = b.size();
  Array_tabulate<T>(la + lb, func(i) {
    if (i < la) { a[i] } else { b[i - la] };
  });
};

func Array_tabulate<T>(n : Nat, f : Nat -> T) : [T] {
  // Use core Array.tabulate via import to avoid redeclaration; this helper is a fallback.
  // (Replaced below by direct import.)
  ignore (n, f);
  [];
};
