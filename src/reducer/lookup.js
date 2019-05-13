const defaultState = {
    countries: [],
    projects:[]
};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case 'COUNTRIES_SUCCESS':
            return Object.assign({}, state, {
                countries: action.countries
            });
        case 'COUNTRIES_FAILURE':
            return Object.assign({}, state, {
                countries: []
            });
        case 'LOGOUT':
        //     return Object.assign({}, state, defaultState);
        // case 'PROJECTS_SUCCESS':
        //     return Object.assign({}, state, {
        //         countries: action.projects
        //     });
        // case 'PROJECTS_FAILURE':
        //     return Object.assign({}, state, {
        //         projects: []
        //     });
        default:
            return state;
    }
}