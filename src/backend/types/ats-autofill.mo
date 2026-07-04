module {
  public type Profile = {
    text : Text;
    updatedAt : Int;
  };

  public type GeneratedAnswer = {
    id : Nat;
    question : Text;
    answer : Text;
    createdAt : Int;
  };
};
