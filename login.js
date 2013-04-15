Lacuna.Login = {
	build: function() {
		var content = [
			'<div id="loginPanelTabs">',
			'	<ul>',
			'		<li><a href="#loginPanelTabs-1">Login</a></li>',
			'	</ul>',
			'	<div id="loginPanelTabs-1">',
			'		<input type="text" id="empire" /><br />',
			'		<input type="password" id="password" /><br />',
			'		<button type="button" id="doLogIn" onClick="Lacuna.Login.login()" >Login!</button><br />',
			'	</div>',
			'</div>',
		];
		
		var panel = Lacuna.Panel.NewTabbedPanel('Login Panel', 'loginPanel', false, content);
	},
	destroy: function() {
		$('#loginScreen').fadeOut(500, function() {
			$(this).remove();
		});
	},
	
	login: function() {
		Lacuna.GameData.Empire.Name = $('#empire').val();
		Lacuna.GameData.Password    = $('#password').val();
		
		Lacuna.showPulser();
		Lacuna.send({
			module: '/empire',
			method: 'login',
			params: [
				Lacuna.GameData.Empire.Name, // Empire Name
				Lacuna.GameData.Password, // Password
				'anonymous' // API Key
			],
			
			success: function(o) {
				Lacuna.hidePulser();
				Lacuna.GameData.ClientData.SessionId = o.result.session_id;
				
				// Pop the sesion and empire name into a cookie.
				$.cookie.write('lacuna-expanse-session-id', Lacuna.GameData.ClientData.SessionId, 2 * 60 * 60); // 2 hour session.
				$.cookie.write('lacuna-expanse-empire-name', Lacuna.GameData.Empire.Name, 365 * 24 * 60 * 60); // 1 year.
				
				Lacuna.alert('You have now been logged into the game with a session Id of:<br />' + Lacuna.GameData.ClientData.SessionId); 
			}
		});
	}
};