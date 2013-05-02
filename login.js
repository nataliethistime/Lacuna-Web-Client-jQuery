(function() {

	if (!$.Lacuna.Login || typeof($.Lacuna.Login) === 'undefined') {
		$.Lacuna.Login = {
			build: function() {
				
				// Grab the name of the Empire that was last logged into.
				$.Lacuna.GameData.Empire.Name = $.cookie.read('lacuna-expanse-empire-name') || '';
			
				// Buld the Login Panel.
				this.panel = $.Lacuna.Panel.newTabbedPanel({
					name: 'Login Panel', // Could somone please come up with something more creative?
					tabs: [
						{
							name: 'Login',
							content: [
								'<table class="centerTable" id="loginPanel">',
								'	<tr>',
								'		<td><label>Empire Name</label></td>',
								'		<td><input type="text" id="empire" value="', $.Lacuna.GameData.Empire.Name, '" /></td>',
								'	</tr>',
								'	<tr>',
								'		<td><label>Password</label>',
								'		<td><input type="password" id="password" /></td>',
								'	</tr>',
								'	<tr>',
								'		<td><label>Remember Empire?</label></td>',
								'		<td>',
								'			<input id="rememberEmpire" type="checkbox" checked="checked" />',
								'			<button type="button" style="float:right;" id="loginButton">Login</button>',
								'		</td>',
								'	</tr>',
								'</table>'
							].join('')
						},
						{
							name: 'Create Empire',
							content: 'TODO!'
						},
						{
							name: 'Forgot Password?',
							content: 'TODO!'
						}
					]
				});
				
				// Add the login event handlers.
				$('#password').keydown(function(event) {
					// Check if the 'enter' key was hit.
					if (event.which === 13) {
						$.Lacuna.Login.login();
					}
				});
				$('#loginButton').click(this.login);
			},
			destroy: function(callback) {
				this.panel.close(callback);
				delete this.panel;
			},
	
			login: function() {
				$.Lacuna.GameData.Empire.Name = $('#empire').val();
				$.Lacuna.GameData.Password    = $('#password').val();
		
				$.Lacuna.showPulser();
				$.Lacuna.send({
					module: '/empire',
					method: 'login',
					params: [
						$.Lacuna.GameData.Empire.Name, // Empire Name
						$.Lacuna.GameData.Password, // Password
						'anonymous' // API Key
					],
			
					success: function(o) {
						$.Lacuna.hidePulser();
						$.Lacuna.GameData.ClientData.SessionId = o.result.session_id;
				
						// Pop the sesion and empire name into a cookie.
						// Unused as yet, any volunteers for implementing loging in from Cookie?
						//$.cookie.write('lacuna-expanse-session-id', $.Lacuna.GameData.ClientData.SessionId, 2 * 60 * 60); // 2 hour session.
						
						if ($('#rememberEmpire').prop('checked')) {
							$.cookie.write('lacuna-expanse-empire-name', $.Lacuna.GameData.Empire.Name, 365 * 24 * 60 * 60); // 1 year.
						}
						else {
							$.cookie.destroy('lacuna-expanse-empire-name');
						}

						// Over here goes the building of the main game panel(s).
						$.Lacuna.Login.destroy(function() {
							$.Lacuna.Game.BuildMainScreen();
						});
					}
				});
			}
		};
	}
})();