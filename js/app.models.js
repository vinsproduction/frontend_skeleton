
/* Prototype Model */
var Models, PrototypeModel, UserModel,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

PrototypeModel = (function() {
  function PrototypeModel() {}

  PrototypeModel.prototype.getApiPrefix = function() {
    return "api/";
  };

  PrototypeModel.prototype.get = function(url, data, callback) {
    if (data == null) {
      data = {};
    }
    return app.api.get(this.getApiPrefix() + url, data, function(res) {
      if (res.status === "error") {
        console.error("[App > models] " + url + " | error: ", res.message);
      }
      if (callback) {
        return callback(res);
      }
    });
  };

  PrototypeModel.prototype.post = function(url, data, callback) {
    if (data == null) {
      data = {};
    }
    return app.api.post(this.getApiPrefix() + url, data, function(res) {
      if (res.status === "error") {
        console.error("[App > models] " + url + " | error: ", res.message);
      }
      if (callback) {
        return callback(res);
      }
    });
  };

  return PrototypeModel;

})();

UserModel = (function(_super) {
  __extends(UserModel, _super);

  function UserModel() {
    return UserModel.__super__.constructor.apply(this, arguments);
  }


  /*
  	Описание: Отдает данные пользователя
   */

  UserModel.prototype.getDetails = function(data, callback) {
    return this.get('user/details', data, (function(_this) {
      return function(res) {
        return callback(res);
      };
    })(this));
  };

  return UserModel;

})(PrototypeModel);


/* ============ Объявляем классы! =========== */

Models = (function() {
  function Models() {
    this.user = new UserModel;
  }

  return Models;

})();
