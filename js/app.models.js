
/* Prototype Model */
var Models, PrototypeModel, UserModel,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

PrototypeModel = (function() {
  function PrototypeModel() {}

  PrototypeModel.prototype.get = function(url, data, callback) {
    return app.api({
      url: url,
      dataType: 'GET',
      data: data,
      dataType: 'json',
      callback: function(res) {
        return callback(res);
      }
    });
  };

  PrototypeModel.prototype.post = function(url, data, callback) {
    return app.api({
      url: url,
      dataType: 'POST',
      data: data,
      dataType: 'json',
      callback: function(res) {
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
    return this.get('api/user/details', data, (function(_this) {
      return function(res) {
        if (res.status === 'success') {
          return callback(res.data);
        }
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
