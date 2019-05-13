const defaultState = {
    id: undefined,
    isLoggedIn: false,
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    token: '',
    profileImg: '',
    isSignedup: false,
    isForgotPwd: false,
    profile: undefined,
    defaultTeam: "",
    clientProject: [],
    contractorItems: []
};

export default function reducer( state = defaultState, action ) {
    switch ( action.type ) {
        case 'LOGIN_SUCCESS':
            return Object.assign( {}, state, {
                id: action.id,
                isLoggedIn: true,
                username: action.username,
                firstName: action.firstName,
                lastName: action.lastName,
                token: action.token,
                profileImg: action.profileImg,
                defaultTeam: action.defaultTeam,
                isSignedup: false,
                password: action.password
            } );
        case 'LOGIN_FAILURE':
            return Object.assign( {}, state, {
                isLoggedIn: false,
                isSignedup: false
            } );
        case 'PROFILE_SUCCESS':
            return Object.assign( {}, state, {
                profile: action.profile,
                profilePic: action.profile.image
            } );
        case 'PROFILE_FAILURE':
            return Object.assign( {}, state, {
                profile: undefined
            } );
        case 'Client_Project_SUCCESS':
            console.log( action.data )
            return Object.assign( {}, state, {
                clientProject: action.data,
            } );
        case 'Client_Project_FAILURE':
            return Object.assign( {}, state, {
                clientProject: undefined
            } );






        case 'FORGOT_PWD':
            return Object.assign( {}, state, {
                isForgotPwd: true
            } );
        case 'LOGOUT':
            return Object.assign( {}, state, defaultState );
        case 'SIGNUP_SUCCESS':
            return Object.assign( {}, state, {
                isSignedup: true
            } );
        case 'SIGNUP_FAILURE':
            return Object.assign( {}, state, {
                isSignedup: false
            } );
        default:
            return state;
    }
}