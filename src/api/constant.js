//const BASE_URL = "http://13.54.80.14:8081/v1";
// const BASE_URL = "http://127.0.0.1:8085/v1";
//const BASE_URL = "http://13.211.119.29/mobileApi/v1";
const BASE_URL = "https://app.cassa.io/mobileApi/v1"
//const BASE_URL =  "http://dev.cassa.io/mobileApi/v1"

//export const WEB_URL ="http://13.211.119.29"

export const WEB_URL = "https://app.cassa.io"

//export const WEB_URL ="http://dev.cassa.io"

const APICONSTANTS = {
    LOGIN: ( BASE_URL + '/auth/login' ),
    PROFILE: ( BASE_URL + '/users/me' ),
    CLIENTPROJECT: ( BASE_URL + '/clientProject' ),

    REGISTER: ( BASE_URL + '/auth/register' ),
    FORGOT_PWD: ( BASE_URL + '/auth/forgotPassword' ),
    UPDATE_PWD: ( BASE_URL + '/auth/updatePassword' ),
    TEAMS: ( BASE_URL + '/users/teams' ),
    FORMS: ( BASE_URL + '/users/forms' ),
    CONTRACTOR_FORMS: ( BASE_URL + '/users/contractorforms' ),
    FORM_DETAIL: ( BASE_URL + '/forms/' ),
    PROJECTS: ( BASE_URL + '/projects/' ),
    CLIENT_PROJECTS_FOR_FORM: ( BASE_URL + '/projects/getClientProjectForForm' ),
    QUALIFICATIONS: ( BASE_URL + '/qualifications/' ),
    COMPETENCIES: ( BASE_URL + '/competencies/' ),
    CATAGORIES: ( BASE_URL + '/categories' ),
    CONTRACTORS: ( BASE_URL + '/contractors' ),
    CONTRACTORS_ITEMS: ( BASE_URL + '/contractors/contractoritems' ),
    CONTRACTORS_TEAMS: ( BASE_URL + '/contractors/contractorteams' ),
    COUNTRIES: ( BASE_URL + '/countries' ),
    AUTOCOMPLETE_USERS: ( BASE_URL + '/teams/users' ),
    AUTOCOMPLETE_Qualification: ( BASE_URL + '/qualifications/global' ),
    AUTOCOMPLETE_Competency: ( BASE_URL + '/competencies/global' ),

    REGISTERS: ( BASE_URL + '/categories/registers/projects/' ),
    SUB_REGISTERS: ( BASE_URL + '/categories/registers/sub' ),
    LOCATIONS: ( BASE_URL + '/projects/locationList' ),
    SUB_LOCATIONS: ( BASE_URL + '/projects/subLocationList' ),
    SUB_SUB_LOCATIONS: ( BASE_URL + '/projects/subsublocation' ),
    PROJECT_SUB_SUB_LOCATIONS: ( BASE_URL + '/projects/subregion' ),
    PROJECT_BY_TEAM: ( BASE_URL + '/projects' ),
    // API not working at server 
    //PROJECT_BY_USER_ROLE: ( BASE_URL + '/projects/list' ),
    REGISTER_PROJECT: ( BASE_URL + '/categories/registers/projects' ),
    SUB_REGISTER_PROJECT: ( BASE_URL + '/categories/registers/sub' ),

    REGISTER_ITEMS: ( BASE_URL + '/items/' ),
    FORM_PDF: ( BASE_URL + '/services/' ),

    ACTION_SUBMIT_DATA: 'https://app.cassa.io/api/action/formdata-action-post-add'
}

export default APICONSTANTS;