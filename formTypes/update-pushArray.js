/* global AutoForm, validateFormDoc */

AutoForm.addFormType('update-pushArray', {
  onSubmit: function () {
    var c = this;

    // Prevent browser form submission
    this.event.preventDefault();

    // Make sure we have a collection
    var collection = this.collection;
    if (!collection) {
      throw new Error("AutoForm: You must specify a collection when form type is update-pushArray.");
    }

    // Make sure we have a scope
    var scope = c.formAttributes.scope;
    if (!scope) {
      throw new Error("AutoForm: You must specify a scope when form type is update-pushArray.");
    }

    // Run "before.update" hooks
    this.runBeforeHooks(this.insertDoc, function (doc) {
      if (_.isEmpty(doc)) { // make sure this check stays after the before hooks
        // Nothing to update. Just treat it as a successful update.
        c.result(null, 0);
      } else {
        var modifer = {$push: {}};
        modifer.$push[scope] = doc;
        // Perform update
        collection.update({_id: c.docId}, modifer, c.validationOptions, c.result);
      }
    });
  },
  validateForm: function () {
    // Get SimpleSchema
    var ss = AutoForm.getFormSchema(this.form.id);
    // We validate as if it's an insert form
    return validateFormDoc(this.formDocs.insertDoc, false, this.form.id, ss, this.form);
  },
  adjustSchema: function (ss) {
    var scope = this.form.scope;
    // TODO create new SS instance with only the fields that begin with `scope`
    return ss;
  }
});
