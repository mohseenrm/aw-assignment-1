chrome.extension.sendMessage( {}, function( response ) {
	var $loginButton = $( '#login-form--button' );
	var $loginPassword = $( '#login-form--password' );
	var $loginUsername = $( '#login-form--username' );

	var $registerButton = $( '#signup-form--button' );
	var $registerUsername = $( '#signup-form--username' );
	var $registerPassword = $( '#signup-form--password' );

	// Toggle Function
	$( '.toggle' ).click( function() {
		// Switches the Icon
		$( this ).children( 'i' ).toggleClass( 'fa-pencil' );
		// Switches the forms  
		$( '.form' ).animate( {
			height: "toggle",
			'padding-top': 'toggle',
			'padding-bottom': 'toggle',
			opacity: "toggle"
		}, "slow" );
	} );

	$loginButton.click( function( e ) {
		e.preventDefault();
		console.log( 'Caught it.' );
		var payload = {
			username: $loginUsername.val(),
			password: $loginPassword.val()
		};
		console.log( 'Payload: ', payload );
		// send ajax request
		$.ajax( {
			type: 'POST',
			url: 'http://localhost:9001/auth/login',
			data: payload,
			success: function( result ){
				console.log( 'result: ', result )
			},
			error: function( request, error ){
				console.log( 'Error: ', error );
			}
		} );
	} );

	$registerButton.click( function( e ) {
		e.preventDefault();
		var payload = {
			username: $registerUsername.val(),
			password: $registerPassword.val()
		};
		console.log( 'Payload: ', payload );
		// send ajax request
		$.ajax( {
			type: 'POST',
			url: 'http://localhost:9001/auth/create',
			data: payload,
			success: function( result ){
				console.log( 'result: ', result )
			},
			error: function( request, error ){
				console.log( 'Error: ', error );
			}
		} );
	} );
/* 
	$.ajax( {
		type: 'POST',
		url: 'http://localhost:9001/auth',
		data: {
			sample: ' data'
		},
		success: function( result ){
			console.log( 'result: ', result )
		},
		error: function( request, error ){
			console.log( 'Error: ', error );
		}
	} ); */

} );
