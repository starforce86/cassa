import APICONSTANTS from './constant';

class AuthApi {

    static login( username, password ) {
        let payload = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify( {
                email: username,
                password: password
            } )
        }
        return fetch( APICONSTANTS.LOGIN, payload );
    }

    static profile( token ) {
        let payload = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        }
        return fetch( APICONSTANTS.PROFILE, payload );
    }

    static clientProject( token ) {
        let payload = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        }
        return fetch( APICONSTANTS.CLIENTPROJECT, payload );
    }

    static contractorItems( token, projectId ) {
        console.log("projectId",projectId);
        let payload = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token,
                'projectId': projectId
            }
        }
        return fetch( APICONSTANTS.CONTRACTORS_ITEMS, payload );
    }

    static updateProfile( token, profile ) {
        let payload = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            },
            'body': JSON.stringify( profile )
        }
        return fetch( APICONSTANTS.PROFILE, payload );
    }

    static qualifications( token ) {
        let payload = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        }
        return fetch( APICONSTANTS.QUALIFICATIONS, payload );
    }

    static createQualification( token, body, isCreate ) {
        
        let payload = {
            method: isCreate ? 'POST' : 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            },
            body: JSON.stringify(
                {
                    "qualifications": {
                        "name": body.name
                    },
                    "userQualifications": {
                        "qualification_id": body.qualification_id,
                        "copies": `${ body.copyFrontImage },${ body.copyBackImage }`,
                        "date_completed": body.completedDate,
                        "expired_at": body.expiryDate,
                        "notes": body.note,
                        "active": body.active
                    }
                }
            )
        };

        return fetch( ( isCreate ? APICONSTANTS.QUALIFICATIONS : ( APICONSTANTS.QUALIFICATIONS + body.id ) ), payload );
    }

    static deleteQualification( token, id ) {
        let payload = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        }
        return fetch( APICONSTANTS.QUALIFICATIONS + id, payload );
    }




    static competencies( token ) {
        let payload = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        }
        return fetch( APICONSTANTS.COMPETENCIES, payload );
    }

    static createCompetency( token, body, isCreate ) {
        //  console.warn(body,isCreate)
        let payload = {
            method: isCreate ? 'POST' : 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            },
            body: JSON.stringify( {

                "competency": {
                    "name": body.name
                },
                "userCompetency": {
                    "qualification_id": body.qualification_id,
                    "copies": `${ body.copyFrontImage },${ body.copyBackImage }`,
                    "date_completed": body.completedDate,
                    "expired_at": body.expiryDate,
                    "notes": body.note,
                    "active": body.active
                }

            } )
        }
        return fetch( ( isCreate ? APICONSTANTS.COMPETENCIES : ( APICONSTANTS.COMPETENCIES + body.id ) ), payload );
    }

    static deleteCompetency( token, id ) {
        let payload = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        }
        return fetch( APICONSTANTS.COMPETENCIES + id, payload );
    }

    static forgot( username ) {
        let payload = {
            method: 'POST',
            timeout: 5000,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify( {
                email: username
            } )
        }
        return fetch( APICONSTANTS.FORGOT_PWD, payload );
    }

    static signup( body ) {
        let payload = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify( body )
        }
        return fetch( APICONSTANTS.REGISTER, payload );
    }

    static updatePassword( password, newpassword ) {
        let payload = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify( {//TODO
            } )
        }
        return fetch( APICONSTANTS.REGISTER, payload );
    }
}

export default AuthApi;