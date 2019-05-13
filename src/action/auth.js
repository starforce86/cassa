import AuthApi from '../api/auth';
import { Alert } from "react-native";

export const validateEmail = ( email ) => {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test( email );
}

export const alertBox = ( title, msg ) => {
    Alert.alert(
        title,
        msg,
        [
            { text: 'OK', onPress: () => console.log( 'OK Pressed' ) },
        ],
        { cancelable: false }
    )
    return ( dispatch ) => {
    }
}

export const login = ( username, password, callback ) => {

    return ( dispatch ) => {
        AuthApi.login( username.trim(), password ).then( data => data.json() ).then( data => {

            // alertBox( "Log-data.result.message", JSON.stringify(data.result.message));
            
            if ( data.success ) {
                //alertBox( "Log-data.result", JSON.stringify(data.result));
                data.result.username = username;
                dispatch( loginResp( data.result ) );
            } else {
                //alertBox( "Log-data.result.message.header", JSON.stringify(data.result.message.header));
                alertBox( data.result.message.header, JSON.stringify(data.result.message.body) );
                dispatch( loginFailureResp() );
            }
            callback();
        } ).catch( error => {
            //alertBox( '1 Error', error );
            callback();
        } );
    }
};

export const profile = ( token, callback ) => {

    return ( dispatch ) => {
        AuthApi.profile( token ).then( data => data.json() ).then( data => {
            // console.warn(data)
            if ( data.success ) {
                dispatch( profileResp( data.result ) );
            } else {
                alertBox( data.result.message.header, data.result.message.body );
                dispatch( profileFailure() );
            }
            callback();
        } ).catch( error => {
            //alertBox('Info', '');
            callback();
        } );
    }
};



export const clientProject = ( token, callback ) => {
    //console.warn( token )
    return ( dispatch ) => {
        AuthApi.clientProject( token ).then( data => data.json() ).then( data => {
            // console.warn( data )
            if ( data.success ) {
                dispatch( clientProjectResp( data.result ) );
            } else {
                // alertBox( data.result.message.header, data.result.message.body );
                dispatch( clientProjectFailure() );
            }
            callback();
        } ).catch( error => {
            // alertBox( 'Info', 'Network Error !' );
            callback();
        } );
    }
};

export const getContractorItems = ( token, projectId, callback ) => {
    //console.warn( token )
    console.log("Hello:", token);
    console.log("Project Id:", projectId);
    return new Promise((resolve, reject) => {
        AuthApi.contractorItems( token, projectId ).then(data => data.json()).then(data => {
            if (data.success) {
                console.log("# contractor data:", data.result);
                resolve(data.result.map(i => {
                    return {
                        id: i.register_submitted_record_id,
                        name: i.input_value,
                        category_id: i.register_id
                    }
                }));
            }
        }).catch(error => {
            reject(error);
        });
    });
};

export const updateProfile = ( token, profile, callback ) => {

    return ( dispatch ) => {
        AuthApi.updateProfile( token, profile ).then( data => data.json() ).then( data => {
            if ( data.success ) {
                alertBox( 'Success', 'Profile updated successfully !' );
            } else {
                alertBox( data.result.message.header, data.result.message.body );
            }
            callback();
        } ).catch( error => {
            alertBox( 'Info', 'Network Error !' );
            callback();
        } );
    }
};

export const passwordupdate = ( password, newpassword, callback ) => {

    return ( dispatch ) => {
        AuthApi.updatePassword( password, newpassword ).then( data => data.json() ).then( data => {
            if ( data.success ) {
                callback();
            } else {
                alertBox( data.result.message.header, data.result.message.body );
            }
            callback();
        } ).catch( error => {
            alertBox( 'Info', 'Network Error !' );
            callback();
        } );
    }
};

export const forgot = ( username, callback ) => {

    return ( dispatch ) => {
        AuthApi.forgot( username ).then( data => data.json() ).then( data => {
            if ( data.success ) {
                dispatch( forgotPwd( data.result ) );
                alertBox( data.result.message.header, data.result.message.body );
            } else {
                alertBox( data.result.message.header, data.result.message.body );
            }
            callback();
        } ).catch( error => {
            alertBox( 'Info', 'Network Error !' );
            callback();
        } );
    }
};

function forgotPwd( data ) {
    return {
        type: 'FORGOT_PWD'
    }
}

function loginResp( data ) {
    return {
        type: 'LOGIN_SUCCESS',
        id: data.id,
        token: data.token,
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        profileImg: data.profileImg,
        defaultTeam: data.defaultTeam
    };
}

function profileResp( data ) {
    return {
        type: 'PROFILE_SUCCESS',
        profile: data
    };
}

function profileFailure( data ) {
    return {
        type: 'PROFILE_FAILURE'
    };
}



function clientProjectResp( data ) {
    console.log(data)
    return {
        type: 'Client_Project_SUCCESS',
        data
    };
}

function clientProjectFailure( data ) {
    return {
        type: 'Client_Project_FAILURE'
    };
}

function contractorItemsResp( data ) {
    console.log(data)
    return {
        type: 'Contractor_Items_SUCCESS',
        data
    };
}

function contractorItemsFailure( data ) {
    return {
        type: 'Contractor_Items_FAILURE'
    };
}


function registerResp() {
    return {
        type: 'SIGNUP_SUCCESS'
    };
}

function registerFailureResp() {
    return {
        type: 'SIGNUP_FAILURE'
    }
}

function loginFailureResp() {
    return {
        type: 'LOGIN_FAILURE'
    }
}

export const logout = () => {
    return {
        type: 'LOGOUT'
    };
};

export const signup = ( body, callback ) => {
    return ( dispatch ) => {
        AuthApi.signup( body ).then( data => data.json() ).then( data => {
            if ( data.success ) {
                alertBox( data.result.message.header, data.result.message.body );
                dispatch( registerResp() );
            } else {
                alertBox( data.result.message.header, data.result.message.body );
                dispatch( registerFailureResp() );
            }
            callback();
        } ).catch( error => {
            alertBox( 'Info', 'Network Error !' );
            callback();
        } );
    };
};

export const signupclear = () => {
    return ( dispatch ) => {
        dispatch( registerFailureResp() );
    }
}