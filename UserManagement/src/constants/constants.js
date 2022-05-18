export default {
	ROLE: {
		SUPER_USER: 'SUPER_USER',
		DEVELOPER: 'DEVELOPER',
		ADMIN: 'ADMIN',
	},
	STATUS_CODE: {
		SUCCESS: 200,
		FAILED: 400,
		UNAUTHORIZED: 401,
	},

	RESPONSE_MESSAGE: {
		INVALID_OBJECTID: 'ID IS INVALID',
		FAILED_RESPONSE: 'failed',
	
		PERMISSIONS: {
			CREATE_SUCCESS: 'Permissions created successfully',
			CREATE_FAILED: 'Permissions creating failed',
			UPDATE_SUCCESS: 'Permissions update successfully',
			UPDATE_FAILED: 'Permissions updating failed',
			GET_SUCCESS: 'Permissions get successfully',
			GET_FAILED: 'Permissions is not available',
			DELETE_SUCCESS: 'Permissions delete successfully',
			DELETE_FAILED: 'Permissions deletion failed',
			NOT_PERMISSIONS: 'Permissions is not available',
			ALREADY_AVAILABLE: 'Permissions is already available',
		},
		ROLE: {
			CREATE_SUCCESS: 'Role created successfully',
			CREATE_FAILED: 'Role creating failed',
			UPDATE_SUCCESS: 'Role update successfully',
			UPDATE_FAILED: 'Role updating failed',
			GET_SUCCESS: 'Role get successfully',
			GET_FAILED: 'Role is not available',
			DELETE_SUCCESS: 'Role delete successfully',
			DELETE_FAILED: 'Role deletion failed',
			NOT_ROLE: 'Role is not available',
			USER_AVAILABLE:
				'Many user has available with this role. please remove user from the role and then after deletion',
		},
		ADMINUSER: {
			CREATE_SUCCESS: 'Admin user created successfully',
			CREATE_FAILED: 'Admin user creating failed',
			UPDATE_SUCCESS: 'Admin user update successfully',
			UPDATE_FAILED: 'Admin user updating failed',
			GET_SUCCESS: 'Admin user get successfully',
			GET_FAILED: 'Admin user is not available',
			DELETE_SUCCESS: 'Admin user delete successfully',
			DELETE_FAILED: 'Admin user deletion failed',
			NOT_ADMINUSER: 'Admin user is not available',
			USER_AVAILABLE: 'Admin user is already registered',
			USER_NOT_AVAILABLE: 'Admin user is not available',
			LOGIN_SUSPEND: 'user is suspending',
			PASSWORD_CHANGED: 'Password is changed successfully',
			PASSWORD_NOT_CHANGED: 'Password is not changed',
		},
		AUTH_MIDDLEWARE: {
			UNAUTHORIZED: 'You can not access this resource',
			TOKEN_NOTFOUND: 'Access denied. No token provided',
			TOKEN_INVALID: 'Invalid Token',
			USER_DISABLE: 'User disabled',
			USER_NOT_FOUND: 'No User Found With That Token',
			SESSION_EXPIRY: 'Session ended',
		},
		
	},
};
