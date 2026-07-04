import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Types "../types/ats-autofill";

module {
  public type Profile = Types.Profile;
  public type GeneratedAnswer = Types.GeneratedAnswer;

  public func saveProfile(profile : Text, now : Int) : Profile {
    { text = profile; updatedAt = now };
  };

  public func getProfileText(profile : ?Profile) : Text {
    switch (profile) {
      case (?p) { p.text };
      case null { "" };
    };
  };

  public func generateAnswer(profile : ?Profile, question : Text, now : Int) : GeneratedAnswer {
    let profileText = getProfileText(profile);
    let answer = if (profileText == "") {
      "No profile saved yet. Add your background to generate tailored answers."
    } else {
      // Simple keyword matching: collect question words that appear in the profile.
      let words = question.split(#char ' ').toArray();
      let matched = words.filter(
        func(word) {
          word.size() > 3 and profileText.contains(#text word)
        }
      );
      if (matched.size() == 0) {
        profileText
      } else {
        let keywords = matched.values().join(", ");
        "Based on your profile (keywords: " # keywords # "): " # profileText
      };
    };
    { id = 0; question; answer; createdAt = now };
  };

  public func recentAnswers(answers : [GeneratedAnswer]) : [GeneratedAnswer] {
    let total = answers.size();
    if (total <= 5) {
      answers
    } else {
      let start = total - 5;
      Array.tabulate(5, func(i) { answers[start + i] })
    };
  };
};
