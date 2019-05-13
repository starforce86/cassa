import APICONSTANTS from './constant';

class LookupApi {

    static getCountries(token) {
        let payload = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        }
        return fetch(APICONSTANTS.COUNTRIES, payload);
    }

    static getAutocompleteUsers(token, teamId, username) {
        let payload = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token,
                'teamid': teamId,
                'username': username
            }
        }
        return fetch(APICONSTANTS.AUTOCOMPLETE_USERS, payload);
    }

    static getAutocompleteQualification(token, teamId, username) {
        let payload = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token,
                'query': username
            }
        }
        return fetch(APICONSTANTS.AUTOCOMPLETE_Qualification, payload);
    }

    static getAutocompleteCompetency(token, teamId, username) {
        let payload = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token,
                'query': username
            }
        }
        return fetch(APICONSTANTS.AUTOCOMPLETE_Competency, payload);
    }

}

export default LookupApi;