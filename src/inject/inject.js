chrome.extension.sendMessage({}, function( response ) {
	var $loginButton = $( '#login-form--button' );
	var $registerButton = $( '#signup-form--button' );

	// Toggle Function
	$('.toggle').click(function(){
		// Switches the Icon
		$(this).children('i').toggleClass('fa-pencil');
		// Switches the forms  
		$('.form').animate({
			height: "toggle",
			'padding-top': 'toggle',
			'padding-bottom': 'toggle',
			opacity: "toggle"
		}, "slow");
	});

	$.ajax({
		type: 'POST',
		url: 'http://localhost:9001/auth',
		data: {
			sample: ' data'
		},
		success: function(result){
			console.log('result: ', result)
		},
		error: function(request, error){
			console.log('Error: ', error);
		}
	})

});
