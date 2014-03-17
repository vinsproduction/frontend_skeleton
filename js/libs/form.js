var Form;

Form = (function() {
  Form.prototype.logs = false;

  Form.prototype.formId = "form";

  Form.prototype.submitBtnClass = ".submit";

  Form.prototype.errorAlertClass = "error-alert";

  Form.prototype.errorAlertExtClass = "error";

  Form.prototype.errorInputClass = "error-field";

  Form.prototype.placeholderClass = "placeholder";

  Form.prototype.errorHideMethod = "visibility";

  Form.prototype.errorFade = 300;

  Form.prototype.fields = {};

  Form.prototype.data = {};

  Form.prototype.errors = {};

  Form.prototype.onFail = function(errors) {};

  Form.prototype.onSuccess = function(data) {};

  Form.prototype.onSubmit = function(data) {};

  Form.prototype.onReset = function() {};

  Form.prototype.onLoad = function() {};

  function Form(options) {
    var k, v, _ref;
    this.options = options != null ? options : {};
    _ref = this.options;
    for (k in _ref) {
      v = _ref[k];
      this[k] = v;
    }
    this.errorTemplate = "<div class=\"" + this.errorAlertClass + "\"></div>";
    this.errorTemplateList = "{error}<br/>";
    $((function(_this) {
      return function() {
        _this.form = $("#" + _this.formId);
        _this.submitBtn = _this.form.find(_this.submitBtnClass);
        _this.init();
        _this.log("onLoad", "options", _this.options);
        return _this.onLoad();
      };
    })(this));
  }

  Form.prototype.init = function() {
    var el, errorAlert, name, self, _ref, _ref1, _ref2, _ref3, _ref4;
    self = this;
    this.form.unbind();
    this.submitBtn.unbind();
    for (name in this.fields) {
      el = this.form.find("[name='" + name + "']");
      el.unbind();
      if ((_ref = el.attr('type')) === 'checkbox' || _ref === 'radio') {
        this.fields[name].originVal = el.filter(":checked").val() || false;
      } else {
        this.fields[name].originVal = el.val();
      }
      this.fields[name].useErrorTemplate = (_ref1 = this.fields[name].useErrorTemplate) != null ? _ref1 : false;
      this.fields[name].hideErrorsOnFocus = (_ref2 = this.fields[name].hideErrorsOnFocus) != null ? _ref2 : false;
      this.fields[name].checkErrorsOnFocus = (_ref3 = this.fields[name].checkErrorsOnFocus) != null ? _ref3 : false;
      this.fields[name].focus = (_ref4 = this.fields[name].focus) != null ? _ref4 : false;
      if (!this.fields[name].onError) {
        this.fields[name].onError = function(fieldName, errors) {};
      }
      if (this.fields[name].placeholder && (el.is("input[type='text']") || el.is('textarea'))) {
        this.placeholder(el, this.fields[name].placeholder);
      }
      if (this.fields[name].useErrorTemplate && this.fields[name].rules) {
        errorAlert = $("." + this.errorAlertExtClass + "-" + name);
        if (!errorAlert.size()) {
          errorAlert = $(this.errorTemplate);
          el.after(errorAlert);
          errorAlert.addClass("" + this.errorAlertExtClass + "-" + name);
        }
        errorAlert.unbind();
        if (this.errorHideMethod === "visibility") {
          errorAlert.css('visibility', 'hidden').show();
        } else {
          errorAlert.hide();
        }
        if (this.fields[name].hideErrorsOnFocus) {
          el.focus(function() {
            el = $(this);
            name = el.attr('name');
            return self.removeErrorAlert(name);
          });
        }
        if (this.fields[name].checkErrorsOnFocus) {
          el.keyup(function() {
            var rule, ruleName, val, valid, _ref5;
            self.errors[name] = [];
            self.data[name] = [];
            el = $(this);
            name = el.attr('name');
            val = self.getVal(name);
            self.setData(name, val);
            self.removeErrorAlert(name);
            _ref5 = self.fields[name].rules;
            for (ruleName in _ref5) {
              rule = _ref5[ruleName];
              valid = self.validate[ruleName](val, rule);
              if (!valid.state) {
                self.setError(name, valid.reason);
              }
            }
            if (!self.isEmpty(self.errors[name])) {
              self.log("onError", name, self.errors[name]);
              self.addErrorAlert(name);
              return self.fields[name].onError(name, self.errors[name]);
            }
          });
        }
      }
      if (this.fields[name].focus) {
        el.focus();
      }
    }
    this.form.submit(function(e) {
      return e.preventDefault();
    });
    return this.submitBtn.click((function(_this) {
      return function() {
        _this.submit();
        return false;
      };
    })(this));
  };

  Form.prototype.setVal = function(name, val) {
    var el, errorAlert, _ref;
    el = this.form.find("[name='" + name + "']");
    if ((_ref = el.attr('type')) === 'checkbox' || _ref === 'radio') {
      el.prop("checked", false);
      el.filter("[value='" + val + "']").prop("checked", true);
    } else {
      el.val($$.trim(val));
    }
    if (this.fields[name].placeholder && (el.is("input[type='text']") || el.is('textarea'))) {
      if (val === "" || val === this.fields[name].placeholder) {
        this.placeholder(el, this.fields[name].placeholder);
      } else {
        el.removeClass(this.placeholderClass);
      }
    }
    if (this.fields[name].useErrorTemplate) {
      errorAlert = this.form.find("." + this.errorAlertExtClass + "-" + name);
      errorAlert.empty();
      return el.removeClass(this.errorInputClass);
    }
  };

  Form.prototype.getVal = function(name) {
    var el, val, _ref;
    el = this.form.find("[name='" + name + "']");
    name = el.attr('name');
    if ((_ref = el.attr('type')) === 'checkbox' || _ref === 'radio') {
      val = el.filter(":checked").val() || false;
    } else if (el.is('select')) {
      val = el.val();
    } else {
      el.val(this.trim(el.val()));
      if (this.fields[name].escape) {
        el.val(this.stripHTML(el.val()));
      }
      val = this.trim(el.val());
      if (this.fields[name]['placeholder'] && val === this.fields[name]['placeholder']) {
        val = "";
      }
    }
    return val;
  };

  Form.prototype.submit = function() {
    var name, rule, ruleName, val, valid, _ref;
    this.log("SUBMIT!");
    this.resetData();
    this.resetErorrs();
    for (name in this.fields) {
      val = this.getVal(name);
      this.setData(name, val);
      this.removeErrorAlert(name);
      if (this.fields[name].rules) {
        _ref = this.fields[name].rules;
        for (ruleName in _ref) {
          rule = _ref[ruleName];
          valid = this.validate[ruleName](val, rule);
          if (!valid.state) {
            this.setError(name, valid.reason);
          }
        }
      }
    }
    this.log("onSubmit", "data", this.data);
    this.onSubmit(this.data);
    if (this.isEmpty(this.errors)) {
      return this.success();
    } else {
      return this.fail();
    }
  };

  Form.prototype.fail = function() {
    var field, name, _ref;
    _ref = this.fields;
    for (name in _ref) {
      field = _ref[name];
      if (this.errors[name]) {
        this.log("onError", name, this.errors[name]);
        this.addErrorAlert(name);
        this.fields[name].onError(name, this.errors[name]);
      }
    }
    this.log("onFail", "errors", this.errors);
    return this.onFail(this.errors);
  };

  Form.prototype.success = function() {
    this.log("onSuccess", "data", this.data);
    return this.onSuccess(this.data);
  };

  Form.prototype.reset = function() {
    var name;
    this.resetData();
    this.resetErorrs();
    for (name in this.fields) {
      this.setVal(name, this.fields[name].originVal);
    }
    this.log("onReset");
    this.onReset();
    this.init();
    return false;
  };

  Form.prototype.resetErorrs = function() {
    return this.errors = {};
  };

  Form.prototype.resetData = function() {
    return this.data = {};
  };

  Form.prototype.setData = function(name, val) {
    if (!this.data[name]) {
      return this.data[name] = val;
    }
  };

  Form.prototype.setError = function(name, val) {
    if (!this.errors[name]) {
      this.errors[name] = [];
    }
    if (this.errors[name].indexOf(val) < 0) {
      return this.errors[name].push(val);
    }
  };

  Form.prototype.addErrorAlert = function(name) {
    var el, errorAlert, i;
    if (this.fields[name].useErrorTemplate) {
      el = this.form.find("[name='" + name + "']");
      el.addClass(this.errorInputClass);
      errorAlert = this.form.find("." + this.errorAlertExtClass + "-" + name);
      errorAlert.stop().empty();
      for (i in this.errors[name]) {
        errorAlert.append(this.errorTemplateList.replace(/\{error\}/g, this.errors[name][i]));
      }
      if (this.errorHideMethod === "visibility") {
        errorAlert.css('visibility', 'visible');
      }
      if (this.errorFade) {
        return errorAlert.hide().fadeIn(this.errorFade);
      }
    }
  };

  Form.prototype.removeErrorAlert = function(name) {
    var el, errorAlert;
    if (this.fields[name].useErrorTemplate) {
      el = this.form.find("[name='" + name + "']");
      el.removeClass(this.errorInputClass);
      errorAlert = this.form.find("." + this.errorAlertExtClass + "-" + name);
      errorAlert.empty();
      if (this.errorHideMethod === "visibility") {
        return errorAlert.css('visibility', 'hidden').show();
      } else {
        return errorAlert.hide();
      }
    }
  };

  Form.prototype.placeholder = function(el, val) {
    el.focus((function(_this) {
      return function() {
        if (el.val() === val) {
          return el.val("").removeClass(_this.placeholderClass);
        }
      };
    })(this)).blur((function(_this) {
      return function() {
        if (el.val() === "") {
          return el.val(val).addClass(_this.placeholderClass);
        }
      };
    })(this));
    return el.blur();
  };


  /* VALIDATION FUNCTIONS */

  Form.prototype.validate = {
    required: function(val, rule) {
      var valid;
      valid = {
        state: val !== "" && val !== false && val !== rule.not,
        reason: rule.reason || 'Не заполнено'
      };
      return valid;
    },
    numeric: function(val, rule) {
      var valid;
      valid = {
        state: /^[0-9]+$/.test(val),
        reason: rule.reason || 'Не цифры'
      };
      return valid;
    },
    numericDash: function(val, rule) {
      var valid;
      valid = {
        state: /^[\d\-\s]+$/.test(val),
        reason: rule.reason || 'Не цифры и подчеркивания'
      };
      return valid;
    },
    alpha: function(val, rule) {
      var valid;
      valid = {
        state: /^[a-z]+$/i.test(val),
        reason: rule.reason || 'Не буквы'
      };
      return valid;
    },
    alphaDash: function(val, rule) {
      var valid;
      valid = {
        state: /^[a-z0-9_\-]+$/i.test(val),
        reason: rule.reason || 'Не буквы и подчеркивания'
      };
      return valid;
    },
    alphaNumeric: function(val, rule) {
      var valid;
      valid = {
        state: /^[a-z0-9]+$/i.test(val),
        reason: rule.reason || 'Не буквы и не цифры'
      };
      return valid;
    },
    max: function(val, rule) {
      var valid;
      if (rule.reason) {
        rule.reason = rule.reason.replace(/\{count\}/g, rule.count);
      }
      valid = {
        state: val.length <= rule.count,
        reason: rule.reason || ("Максимум " + rule.count)
      };
      return valid;
    },
    min: function(val, rule) {
      var valid;
      if (rule.reason) {
        rule.reason = rule.reason.replace(/\{count\}/g, rule.count);
      }
      valid = {
        state: val.length >= rule.count,
        reason: rule.reason || ("Минимум " + rule.count)
      };
      return valid;
    },
    email: function(val, rule) {
      var valid;
      valid = {
        state: /^[a-zA-Z0-9.!#$%&amp;'*+\-\/=?\^_`{|}~\-]+@[a-zA-Z0-9\-]+(?:\.[a-zA-Z0-9\-]+)*$/.test(val),
        reason: rule.reason || 'Не email'
      };
      return valid;
    },
    url: function(val, rule) {
      var valid;
      valid = {
        state: /^((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/.test(val),
        reason: rule.reason || 'Не url'
      };
      return valid;
    },
    ip: function(val, rule) {
      var valid;
      valid = {
        state: /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/i.test(val),
        reason: rule.reason || 'Не ip'
      };
      return valid;
    }
  };


  /* ДОБАВЛЕНИЕ НОВОГО ПРАВИЛА */

  Form.prototype.addRule = function(opt) {
    this.fields[opt.field]['rules'][opt.rule] = opt.reason;
    return this.validate[opt.rule] = function(val, args, description) {
      var valid;
      valid = {
        state: opt.condition(val),
        reason: opt.reason || 'custom reason'
      };
      return valid;
    };
  };


  /* HELPERS */

  Form.prototype.log = function() {
    var i, newArgs;
    if (console && this.logs) {
      newArgs = ["[Form]", "#" + this.formId];
      for (i in arguments) {
        newArgs.push(arguments[i]);
      }
      return console.log.apply(console, newArgs);
    }
  };

  Form.prototype.trim = function(text) {
    if (text == null) {
      text = "";
    }
    return text.replace(/^\s+|\s+$/g, '');
  };

  Form.prototype.stripHTML = function(text) {
    if (text == null) {
      text = "";
    }
    return text.replace(/<(?:.|\s)*?>/g, '');
  };

  Form.prototype.isFunction = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Function]';
  };

  Form.prototype.isString = function(obj) {
    return Object.prototype.toString.call(obj) === '[object String]';
  };

  Form.prototype.isArray = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  };

  Form.prototype.isObject = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
  };

  Form.prototype.isEmpty = function(o) {
    var i;
    if (this.isString(o)) {
      if (this.trim(o) === "") {
        return true;
      } else {
        return false;
      }
    }
    if (this.isArray(o)) {
      if (o.length === 0) {
        return true;
      } else {
        return false;
      }
    }
    if (this.isObject(o)) {
      for (i in o) {
        if (o.hasOwnProperty(i)) {
          return false;
        }
      }
      return true;
    }
  };

  Form.prototype.declOfNum = function(number, titles) {
    var cases;
    cases = [2, 0, 1, 1, 1, 2];
    return titles[(number % 100 > 4 && number % 100 < 20 ? 2 : cases[(number % 10 < 5 ? number % 10 : 5)])];
  };

  return Form;

})();
