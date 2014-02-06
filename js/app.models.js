/* Prototype Model*/

var Models, PrototypeModel, User, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

PrototypeModel = (function() {
  function PrototypeModel() {
    this.fish = window.location.host === "" || /localhost/.test(window.location.host);
  }

  PrototypeModel.prototype.getFish = function(url, data, res, callback) {
    var json, obj, response;
    json = JSON.stringify(res);
    obj = $.parseJSON(json);
    response = obj.data || [];
    console.warn('[WARNING Api FISH!]', url, '| request:', data, '| response:', response);
    return callback(response);
  };

  return PrototypeModel;

})();

/* Models*/


User = (function(_super) {
  __extends(User, _super);

  function User() {
    _ref = User.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  return User;

})(PrototypeModel);

/* ============ Объявляем классы! ===========*/


Models = (function() {
  function Models() {
    this.user = new User;
  }

  return Models;

})();
