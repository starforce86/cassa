const defaultState = {
    teams: [],
    team: undefined,
    forms: [],
    formDetail: [],
    catagories: [],
    projects: [],
    clientProjects: [],
    contractors: [],
    contractorTeams: [],
    project_id: 0,

    deleteForm: false
};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case 'TEAM_SUCCESS':
            return Object.assign({}, state, {
                teams: action.teams
            });
        case 'DEAFULT_TEAM':
            return Object.assign({}, state, {
                team: action.team
            });
        case 'TEAM_FAILURE':
            return Object.assign({}, state, {
                teams: []
            });
        case 'FORM_SUCCESS':
            return Object.assign({}, state, {
                forms: action.forms
            });
        case 'FORM_FAILURE':
            return Object.assign({}, state, {
                forms: []
            });
        case 'CONTRACTOR_FORM_SUCCESS':
            return Object.assign({}, state, {
                forms: action.forms
            });
        case 'CONTRACTOR_FORM_FAILURE':
            return Object.assign({}, state, {
                forms: []
            });
        case 'FORM_DETAIL_SUCCESS':
            return Object.assign({}, state, {
                formDetail: action.formDetail
            });
        case 'FORM_DETAIL_FAILURE':
            return Object.assign({}, state, {
                formDetail: []
            });

        case 'CATEGORY_SUCCESS':
            return Object.assign({}, state, {
                catagories: action.catagories
            });
        case 'CATEGORY_FAILURE':
            return Object.assign({}, state, {
                catagories: []
            });
        case 'PROJECT_SUCCESS':
            return Object.assign({}, state, {
                projects: action.projects
            });
        case 'PROJECT_FAILURE':
            return Object.assign({}, state, {
                projects: []
            });
        case 'CLIENT_PROJECTS_FOR_FORM_SUCCESS':
            return Object.assign({}, state, {
                clientProjects: action.clientProjects
            });
        case 'CLIENT_PROJECTS_FOR_FORM_FAILURE':
            return Object.assign({}, state, {
                clientProjects: []
            });
        case 'CONTRACTOR_SUCCESS':
            return Object.assign({}, state, {
                contractors: action.contractors
            });
        case 'CONTRACTOR_FAILURE':
            return Object.assign({}, state, {
                contractors: []
            });
        case 'CONTRACTOR_TEAMS_SUCCESS':
            return Object.assign({}, state, {
                contractorTeams: action.contractorTeams
            });
        case 'CONTRACTOR_TEAMS_FAILURE':
            return Object.assign({}, state, {
                contractorTeams: []
            });
        case 'MANAGEMENT_SELECTION':
            return Object.assign({}, state, {
                project_id: action.project_id
            });
        case 'PROJECT_SELECTION':
            return Object.assign({}, state, {
                project_id: action.project_id
            });
        case 'PROJECT_SELECTION':
            return Object.assign({}, state, {
                deleteFrom: action.data
            });
        case 'LOGOUT':
            return Object.assign({}, state, defaultState);
        default:
            return state;
    }
}