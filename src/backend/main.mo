import MixinViews "mo:caffeineai-data-viewer/MixinViews";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import Types "types/ats-autofill";
import AtsAutofillApi "mixins/ats-autofill-api";

actor {
  include MixinViews();

  let accessControlState : AccessControl.AccessControlState;
  include MixinAuthorization(accessControlState, null);

  let profileState : { var profile : ?Types.LivingProfile };
  let answersState : { var answers : [Types.AnswerBankEntry]; var nextId : Nat };
  let applicationsState : { var applications : [Types.ApplicationRecord]; var nextId : Nat };
  let draftsState : { var drafts : [Types.DraftResponse]; var nextId : Nat };
  let scanCapturesState : { var captures : [Types.ScanCapture]; var nextId : Nat };

  include AtsAutofillApi(profileState, answersState, applicationsState, draftsState, scanCapturesState);
};
