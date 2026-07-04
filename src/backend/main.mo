import MixinViews "mo:caffeineai-data-viewer/MixinViews";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import Types "types/ats-autofill";
import AtsAutofillApi "mixins/ats-autofill-api";

actor {
  include MixinViews();

  let accessControlState : AccessControl.AccessControlState;
  include MixinAuthorization(accessControlState, null);

  let profileState : { var profile : ?Types.Profile };
  let answersState : { var answers : [Types.GeneratedAnswer]; var nextId : Nat };

  include AtsAutofillApi(profileState, answersState);
};
