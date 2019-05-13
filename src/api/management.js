import APICONSTANTS from './constant';

class ManagementApi {

    static getRegisters(token, teamId) {
        let payload = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token,
                'teamid' : teamId
            }
        }
        return fetch(APICONSTANTS.REGISTERS, payload);
    }

    static getFormPdf(formDetail, token) {
       // console.warn(formDetail)
        let payload = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': token.token,
                'teamid':token.teamid
            },
            body: JSON.stringify(formDetail)
        }
        return fetch(APICONSTANTS.FORM_PDF, payload);
    }

    static getItems(token, registerId,projectId,teamId) {
     //   console.warn(registerId,projectId,teamId)
        let payload = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token,
                'teamid':teamId,
                'registerid' : registerId,
                'projectid' : projectId,

            }
        }
        return fetch(APICONSTANTS.REGISTER_ITEMS, payload);
    }

    static getSubRegisters(token, teamId, parentId) {
        let payload = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token,
                'teamid': teamId,
                'parentid': parentId
            }
        }
        return fetch(APICONSTANTS.SUB_REGISTERS, payload);
    }

    static getLocations(token, teamId) {
        let payload = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token,
                'created_by_team': teamId
            }
        }
        return fetch(APICONSTANTS.LOCATIONS+'/'+teamId, payload);
    }

    static getSubLocations(token, teamId, parentId) {
        let payload = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token,
                'created_by_team': teamId,
                'region_id': parentId
            }
        }
        return fetch(APICONSTANTS.SUB_LOCATIONS+'/'+parentId, payload);
    }

    static getSubSubLocations(token, teamId, parentId) {
        let payload = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token,
                'created_by_team': teamId,
                'region_id': parentId
            }
        }
        return fetch(APICONSTANTS.SUB_SUB_LOCATIONS+'/'+parentId, payload);
    }
    
    static getProjectBySubSubLocations(token, teamId, parentId) {
        let payload = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token,
                'teamid': teamId,
                'regionid': parentId
            }
        }
        return fetch(APICONSTANTS.PROJECT_SUB_SUB_LOCATIONS+'/'+parentId, payload);
    }
    
    static getRegisterForProject(token, teamId, parentId) {
        let payload = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token,
                'teamid': teamId,
                
            }
        }
        return fetch(APICONSTANTS.REGISTER_PROJECT+'/'+teamId, payload);
    }

    static getSubRegisterForProject(token, teamId, parentId) {
        let payload = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token,
                'teamid': teamId,
                'parentid': parentId
                
            }
        }
        return fetch(APICONSTANTS.SUB_REGISTER_PROJECT, payload);
    }

    static actionDataSubmit(action) {
        let payload = {
            method: 'POST',
            body: JSON.stringify(action),
            headers: {
                'Accept':'application/json',
                'Content-Type': 'application/json',
                 
                
            }
        }
        return fetch(APICONSTANTS.ACTION_SUBMIT_DATA, payload);
    }

    static getProjectByTeam(token, teamId) {
        let payload = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'token': token,
                'teamid': teamId
            }
        }
        return fetch(APICONSTANTS.PROJECT_BY_TEAM, payload);
    }

}

export default ManagementApi;