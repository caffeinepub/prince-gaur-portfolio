import Array "mo:core/Array";

actor {
  type ContactFormEntry = {
    name : Text;
    email : Text;
    message : Text;
  };

  var contactEntries : [ContactFormEntry] = [];

  public shared ({ caller }) func submitContactForm(name : Text, email : Text, message : Text) : async () {
    let newEntry : ContactFormEntry = {
      name;
      email;
      message;
    };
    contactEntries := contactEntries.concat([newEntry]);
  };

  public query ({ caller }) func getAllContactEntries() : async [ContactFormEntry] {
    contactEntries;
  };
};
