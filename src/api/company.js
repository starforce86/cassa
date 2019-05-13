import APICONSTANTS from './constant';

class CompanyApi {

    static getTeams(token) {
        let payload = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        }
        return fetch(APICONSTANTS.TEAMS, payload);
    }

    static getForms(token, teamId, formname) {
        let payload = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token,
                'teamid': teamId
            }
        }
        if (formname) payload.headers.formname = formname;
        return fetch(APICONSTANTS.FORMS, payload);
    }

    static getContractorForms(token, teamId, formname) {
        let payload = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token,
                'teamid': teamId
            }
        }
        if (formname) payload.headers.formname = formname;
        return fetch(APICONSTANTS.CONTRACTOR_FORMS, payload);
    }

    static getFormDetail(token, formId) {
        let payload = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token,
                'formid': formId
            }
        }
        return fetch(APICONSTANTS.FORM_DETAIL, payload);
    }

    static getCategories(token, teamId) {
        let payload = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token,
                'teamid': teamId
            }
        }
        return fetch(APICONSTANTS.CATAGORIES, payload);
    }

    static getProjects(token, teamId) {
        let payload = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token,
                'teamid': teamId
            }
        }
        return fetch(APICONSTANTS.PROJECTS, payload);
    }

    static getClientProjectsForForms(token, teamId) {
        let payload = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token,
                'teamid': teamId
            }
        }
        return fetch(APICONSTANTS.CLIENT_PROJECTS_FOR_FORM, payload);
    }

    static getContractors(token,teamId) {
        let payload = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token,
                'teamid':teamId
            }
        }
        return fetch(APICONSTANTS.CONTRACTORS, payload);
    }

    static getContractorTeams(token,teamId,teamname) {
        let payload = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token,
                'teamid':teamId
            }
        }
        if (teamname) payload.headers.teamname = teamname;
        return fetch(APICONSTANTS.CONTRACTORS_TEAMS, payload);
    }
}

export default CompanyApi;