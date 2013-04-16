(function() {

	if (!$.Lacuna.Login || typeof($.Lacuna.Login) === 'undefined') {
		$.Lacuna.Login = {
			build: function() {
				
				// Grab the name of the Empire that was last logged into.
				$.Lacuna.GameData.Empire.Name = $.cookie.read('lacuna-expanse-empire-name') || '';
			
				// Buld the Login Panel.
				this.panel = $.Lacuna.Panel.NewTabbedPanel('Login Panel', 'loginPanel', false, [
					'<div id="loginPanelTabs">',
					'	<ul>',
					'		<li><a href="#loginPanelTabs-1">Login</a></li>',
					'	</ul>',
					'	<div id="loginPanelTabs-1">',
					'		<input type="text" id="empire" value="', $.Lacuna.GameData.Empire.Name, '" /><br />',
					'		<input type="password" id="password" /><br />',
					'		<button type="button" id="loginButton">Login</button><br />',
					'	</div>',
					'</div>'
				]);
				
				$('#loginButton').click(this.login);
			},
			destroy: function(callback) {
				this.panel.close();
				
				// Wait for the Dialog to fade out.
				setTimeout(callback, 600);
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
						$.cookie.write('lacuna-expanse-session-id', $.Lacuna.GameData.ClientData.SessionId, 2 * 60 * 60); // 2 hour session.
						$.cookie.write('lacuna-expanse-empire-name', $.Lacuna.GameData.Empire.Name, 365 * 24 * 60 * 60); // 1 year.
					
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