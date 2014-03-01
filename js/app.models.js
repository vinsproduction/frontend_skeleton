/* Prototype Model*/

var Models, PrototypeModel, UserModel, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

PrototypeModel = (function() {
  function PrototypeModel() {}

  PrototypeModel.prototype.get = function(url, data, callback) {
    return app.api(url, 'GET', data, function(res) {
      return callback(res);
    });
  };

  PrototypeModel.prototype.post = function(url, data, callback) {
    return app.api(url, 'POST', data, function(res) {
      return callback(res);
    });
  };

  return PrototypeModel;

})();

UserModel = (function(_super) {
  __extends(UserModel, _super);

  function UserModel() {
    _ref = UserModel.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  /*
  	Описание: Отдает данные пользователя
  */


  UserModel.prototype.getDetails = function(data, callback) {
    var _this = this;
    return this.get('api/user/details', data, function(res) {
      return callback(res);
    });
  };

  return UserModel;

})(PrototypeModel);

/* ============ Объявляем классы! ===========*/


Models = (function() {
  function Models() {
    this.user = new UserModel;
  }

  return Models;

})();
