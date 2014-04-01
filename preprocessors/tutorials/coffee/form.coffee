class Form

	logs: false

	formId: "form"
	submitBtnClass: ".submit"

	errorAlertClass: "error-alert"
	errorAlertExtClass: "error"
	errorInputClass: "error-field"
	placeholderClass: "placeholder"

	errorHideMethod: "visibility" # "display"

	errorFade: 300

	fields: {}
	data: {}
	errors: {}

	onFail: (errors) ->
	onSuccess: (data)   ->
	onSubmit: (data) ->
	onReset: ->
	onLoad: ->

	constructor: (@options={}) ->

		for k,v of @options
			@[k] = v

		@errorTemplate = """
			<div class="#{@errorAlertClass}"></div>
		"""

		@errorTemplateList = """
			{error}<br/>
		"""

		$ =>

			@form 		= $("#" + @formId)
			@submitBtn 	= @form.find(@submitBtnClass)

			do @init

			@log "onLoad", "options", @options

			do @onLoad

	init: ->

		self = @

		@form.unbind()
		@submitBtn.unbind()

		for name of @fields

			el  = @form.find("[name='#{name}']")

			el.unbind()

			if el.attr('type') in ['checkbox','radio']
				@fields[name].originVal = el.filter(":checked").val() or false
			else
				@fields[name].originVal = el.val()

			@fields[name].useErrorTemplate = @fields[name].useErrorTemplate ? false
			@fields[name].hideErrorsOnFocus = @fields[name].hideErrorsOnFocus ? false
			@fields[name].checkErrorsOnFocus = @fields[name].checkErrorsOnFocus ? false
			@fields[name].focus = @fields[name].focus ? false

			if !@fields[name].onError then @fields[name].onError = (fieldName,errors) ->

			# placeholder
			if @fields[name].placeholder and (el.is("input[type='text']") or el.is('textarea'))
				@placeholder(el,@fields[name].placeholder)

			if @fields[name].useErrorTemplate and @fields[name].rules

				errorAlert = $(".#{@errorAlertExtClass}-#{name}")

				if !errorAlert.size()
					errorAlert = $(@errorTemplate)
					el.after errorAlert
					errorAlert.addClass("#{@errorAlertExtClass}-#{name}")

				errorAlert.unbind()

				if @errorHideMethod is "visibility"
					errorAlert.css('visibility','hidden').show()
				else
					errorAlert.hide()

				if @fields[name].hideErrorsOnFocus 

					el.focus ->

						el 	= $(@)
						name 	= el.attr('name')

						self.removeErrorAlert(name)

				if @fields[name].checkErrorsOnFocus

					el.keyup ->

						self.errors[name] = []
						self.data[name] = []

						el = $(@)
						name 	= el.attr('name')
						val 	= self.getVal(name)

						self.setData(name,val)
						self.removeErrorAlert(name)

						for ruleName,rule of self.fields[name].rules
							valid = self.validate[ruleName](val, rule)
					
							if !valid.state
								self.setError(name,valid.reason)

						if !self.isEmpty(self.errors[name])
							self.log "onError", name, self.errors[name]
							self.addErrorAlert(name)
							self.fields[name].onError(name,self.errors[name])


			el.focus() if @fields[name].focus

		@form.submit (e) -> e.preventDefault()

		@submitBtn.click =>
			@submit()
			return false

	setVal: (name,val) ->

		el  = @form.find("[name='#{name}']")

		if el.attr('type') in ['checkbox','radio']

			el.prop("checked", false)
			el.filter("[value='#{val}']").prop("checked", true)
		else
			el.val($$.trim(val))

		if @fields[name].placeholder and (el.is("input[type='text']") or el.is('textarea'))
			if val in ["",@fields[name].placeholder]
				@placeholder(el,@fields[name].placeholder)
			else
				el.removeClass(@placeholderClass)

		if @fields[name].useErrorTemplate
			errorAlert = @form.find(".#{@errorAlertExtClass}-#{name}")
			errorAlert.empty()
			el.removeClass(@errorInputClass)

	getVal: (name) ->

		el  = @form.find("[name='#{name}']")

		name 	= el.attr('name')

		if el.attr('type') in ['checkbox','radio']
			val = el.filter(":checked").val() or false

		else if el.is('select')
			val = el.val()

		else
			el.val @trim(el.val()) # trim val

			el.val @stripHTML(el.val()) if @fields[name].escape # escape HTML
			val = @trim(el.val())

			#if placeholder
			val = "" if @fields[name]['placeholder'] and val is @fields[name]['placeholder']

		return val

	submit: ->

		@log "SUBMIT!"

		do @resetData
		do @resetErorrs

		for name of @fields

			val = @getVal(name)
	
			@setData(name,val)
			@removeErrorAlert(name)

			# validate rules
			if @fields[name].rules
				for ruleName,rule of @fields[name].rules
					valid = @validate[ruleName](val, rule)
					if !valid.state
						@setError(name,valid.reason)

		@log "onSubmit", "data", @data
		@onSubmit(@data)

		if @isEmpty(@errors)
			do @success
		else
			do @fail

	fail: ->

		for name,field of @fields

			if @errors[name]
				@log "onError", name, @errors[name]
				@addErrorAlert(name)
				@fields[name].onError(name,@errors[name])

		@log "onFail","errors", @errors
		@onFail(@errors)

	success: ->
		@log "onSuccess","data", @data
		@onSuccess(@data)

	reset: ->

		do @resetData
		do @resetErorrs

		for name of @fields

			@setVal(name,@fields[name].originVal)

		@log "onReset"
		do @onReset

		do @init

		return false

	resetErorrs: -> @errors = {}

	resetData: -> @data = {}

	setData: (name,val) ->

		if !@data[name] then @data[name] = val

	setError: (name,val) ->

		if !@errors[name]
			@errors[name] = []

		@errors[name].push val

	addErrorAlert: (name) ->

		if @fields[name].useErrorTemplate

			el  = @form.find("[name='#{name}']")
			el.addClass(@errorInputClass)

			errorAlert = @form.find(".#{@errorAlertExtClass}-#{name}")
			errorAlert.stop().empty()

			for i of @errors[name]
				errorAlert.append(@errorTemplateList.replace(/\{error\}/g, @errors[name][i]))

			if @errorHideMethod is "visibility"
				errorAlert.css('visibility','visible')

			if @errorFade	
				errorAlert.hide().fadeIn @errorFade

	removeErrorAlert: (name) ->

		if @fields[name].useErrorTemplate

			el  = @form.find("[name='#{name}']")
			el.removeClass(@errorInputClass)

			errorAlert = @form.find(".#{@errorAlertExtClass}-#{name}")
			errorAlert.empty()

			if @errorHideMethod is "visibility"
				errorAlert.css('visibility','hidden').show()
			else
				errorAlert.hide()
	
	placeholder: (el,val) ->

		el.focus =>
			if el.val() is val then el.val("").removeClass(@placeholderClass)      
		.blur =>
			if el.val() is "" then el.val(val).addClass(@placeholderClass)
		el.blur()

	### VALIDATION FUNCTIONS ###

	validate:

		required: (val,rule) ->
			valid = 
				state: val not in ["", false, rule.not]
				reason: rule.reason || 'Не заполнено'

			return valid

		numeric : (val,rule) ->
			valid = 
				state: /^[0-9]+$/.test(val)
				reason: rule.reason  || 'Не цифры'

			return valid

		numericDash : (val,rule) ->
			valid = 
				state: /^[\d\-\s]+$/.test(val)
				reason: rule.reason  || 'Не цифры и подчеркивания'

			return valid

		alpha : (val,rule) ->
			valid = 
				state: /^[a-z]+$/i.test(val)
				reason: rule.reason  || 'Не буквы'

			return valid

		alphaDash : (val,rule) ->
			valid = 
				state: /^[a-z0-9_\-]+$/i.test(val)
				reason: rule.reason  || 'Не буквы и подчеркивания'

			return valid

		alphaNumeric : (val,rule) ->
			valid = 
				state: /^[a-z0-9]+$/i.test(val)
				reason: rule.reason  || 'Не буквы и не цифры'

			return valid

		max: (val,rule) ->

			rule.reason = rule.reason.replace(/\{count\}/g, rule.count) if rule.reason

			valid = 
				state:  val.length <= rule.count
				reason: rule.reason || "Максимум #{rule.count}"

			return valid

		min : (val,rule) ->

			rule.reason = rule.reason.replace(/\{count\}/g, rule.count) if rule.reason

			valid = 
				state: val.length >= rule.count
				reason: rule.reason || "Минимум #{rule.count}"

			return valid

		email: (val,rule) ->
			valid = 
				state: /^[a-zA-Z0-9.!#$%&amp;'*+\-\/=?\^_`{|}~\-]+@[a-zA-Z0-9\-]+(?:\.[a-zA-Z0-9\-]+)*$/.test(val)
				reason: rule.reason  || 'Не email'

			return valid

		url: (val,rule) ->
			valid = 
				state: /^((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/.test(val)
				reason: rule.reason  || 'Не url'

			return valid

		ip: (val,rule) ->
			valid = 
				state: /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/i.test(val)
				reason: rule.reason  || 'Не ip'

			return valid


	### ДОБАВЛЕНИЕ НОВОГО ПРАВИЛА ###

	addRule: (opt) ->

		@fields[opt.field]['rules'][opt.rule] = opt.reason

		@validate[opt.rule] = (val,args,description) ->

			valid = 
				state: opt.condition(val)
				reason: opt.reason || 'custom reason'

			return valid


	### HELPERS ###

	log: () ->
		if console and @logs
			
			newArgs = ["[Form]","##{@formId}"]
			for argument in arguments
				newArgs.push argument
			console.log.apply(console,newArgs)
			
			
			

	trim: (text="") -> text.replace(/^\s+|\s+$/g, '')
	stripHTML: (text="") -> text.replace(/<(?:.|\s)*?>/g, '')
	isFunction: (obj) -> Object.prototype.toString.call(obj) is '[object Function]'
	isString: (obj) -> Object.prototype.toString.call(obj) is '[object String]'
	isArray: (obj) -> Object.prototype.toString.call(obj) is '[object Array]'
	isObject: (obj) -> Object.prototype.toString.call(obj) is '[object Object]'
	isEmpty: (o) ->
		if @isString(o)
			return if @trim(o) is "" then true else false
		if @isArray(o)
			return if o.length is 0 then true else false
		if @isObject(o)
			for i of o
				if o.hasOwnProperty(i)
					return false
			return true
	declOfNum: (number, titles) ->
		cases = [2, 0, 1, 1, 1, 2]
		titles[(if (number % 100 > 4 and number % 100 < 20) then 2 else cases[(if (number % 10 < 5) then number % 10 else 5)])]
	

