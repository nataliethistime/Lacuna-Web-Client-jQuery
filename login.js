var Login = {
	build: function() {
		$('#lacuna').append([
			'<div id="loginScreen">',
			'	<input type="text" id="empire" /><br />',
			'	<input type="password" id="password" /><br />',
			'	<button type="button" id="doLogIn" onClick="Login.login()" ><span style="font-weight:bold;">Login!</span></button><br />',
			'</div>'
		].join(''));
	},
	
	login: function() {
		Lacuna.GameData.empire   = $('#empire').val();
		Lacuna.GameData.password = $('#password').val();
		
		Lacuna.send({
			module: '/empire',
			method: 'login',
			params: [
				Lacuna.GameData.empire, // Empire Name
				Lacuna.GameData.password, // Password
				'anonymous' // API Key
			],
			
			success: function(o) {
				alert(o.result.session_id);
			}
		});
	}
};