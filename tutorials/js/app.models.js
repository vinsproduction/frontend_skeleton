/* Prototype Model*/

var Models, PrototypeModel, UserModel, _ref,
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


UserModel = (function(_super) {
  __extends(UserModel, _super);

  function UserModel() {
    _ref = UserModel.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  UserModel.prototype.getRes = {
    "data": {
      "age": 31,
      "avatar": "http://cs607518.vk.me/v607518871/1b51/MLpE9yqMzOg.jpg",
      "birthday": "1983-01-19",
      "city": "Москва",
      "country": "Россия",
      "firstname": "Vins",
      "gender": "male",
      "uid": 131380871,
      "lastname": "Surfer"
    },
    "status": "success"
  };

  /*
  	Описание: Отдает данные пользователя
  */


  UserModel.prototype.get = function(data, callback) {
    var url,
      _this = this;
    url = 'user/details';
    if (this.fish) {
      return this.getFish(url, data, this.getRes, callback);
    }
    return app.api(url, 'GET', data, function(res) {
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
