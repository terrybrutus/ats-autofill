import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  type UserRole = { #admin; #user; #guest };

  type AccessControlState = {
    var adminAssigned : Bool;
    userRoles : Map.Map<Principal, UserRole>;
  };

  type Profile = { text : Text; updatedAt : Int };

  type GeneratedAnswer = {
    id : Nat;
    question : Text;
    answer : Text;
    createdAt : Int;
  };

  type OldActor = {};
  type NewActor = {
    accessControlState : AccessControlState;
    profileState : { var profile : ?Profile };
    answersState : { var answers : [GeneratedAnswer]; var nextId : Nat };
  };

  public func migration(_old : OldActor) : NewActor {
    {
      accessControlState = {
        var adminAssigned = false;
        userRoles = Map.empty();
      };
      profileState = { var profile = null };
      answersState = { var answers = []; var nextId = 1 };
    };
  };
};
