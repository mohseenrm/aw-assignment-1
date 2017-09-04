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

	var payload = {
		username: $loginUsername.val(),
		password: $loginPassword.val()
	};
	console.log( 'Payload: ', payload );
	// send ajax request
	$.ajax( {
		type: 'POST',
		url: 'http://localhost:9008/auth/login',
		data: JSON.stringify(payload),
		contentType: 'application/json; charset=utf-8',
		dataType: 'json',
		success: function( result ){
			console.log( 'login result: ', result )
		},
		error: function( request, error ){
			console.log( 'login Error: ', error );
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
		url: 'http://localhost:9008/auth/create',
		data: JSON.stringify(payload),
		contentType: 'application/json; charset=utf-8',
		dataType: 'json',
		success: function( result ){
			console.log( 'register result: ', result )
		},
		error: function( request, error ){
			console.log( 'register Error: ', error );
		}
	} );
} );