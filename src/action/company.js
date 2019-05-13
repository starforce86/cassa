import CompanyApi from '../api/company';
import { Alert } from "react-native";

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

export const typeSelection = (id) => {
    return (dispatch) => {
        dispatch(selectionResponse(id));
    }
}

const selectionResponse = function (id) {
    return {
        type: id === 0 ? 'MANAGEMENT_SELECTION' : 'PROJECT_SELECTION',
        project_id: id
    };
}

export const getTeams = (token, callback) => {

    return (dispatch) => {
        CompanyApi.getTeams(token).then(data => data.json()).then(data => {
            if (data.success) {
                // console.warn(data)
                dispatch(teamResp(data.result));

                //               if (data.result && data.result.length > 0) dispatch(defaultTeam(data.result[0]))
            } else {
                alertBox(data.result.message.header, data.result.message.body);
                dispatch(teamFailureResp());
            }
            callback();
        }).catch(error => {
            // alertBox('Info', 'Network Error !');
            callback();
        });
    }
};

export const getForms = (token, teamId, formname, callback) => {
    console.log("Inside getForms()");
    return (dispatch) => {
        CompanyApi.getForms(token, teamId, formname).then(data => data.json()).then(data => {
            if (data.success) {
                console.log("Forms", data.result)
                dispatch(formResp(data.result));
            } else {
                alertBox(data.result.message.header, data.result.message.body);
                dispatch(formFailureResp());
            }
            callback();
        }).catch(error => {
            // alertBox('Info', 'Network Error !');
            callback();
        });
    }
};

export const getFormDetail = (token, formId, callback) => {

    return (dispatch) => {
        CompanyApi.getFormDetail(token, formId).then(data => data.json()).then(data => {
            if (data.success) {
                dispatch(formDetailResp(data.result));
            } else {
                alertBox(data.result.message.header, data.result.message.body);
                dispatch(formDetailFailureResp());
            }
            callback();
        }).catch(error => {
            // alertBox('Info', 'Network Error !');
            callback();
        });
    }
};

//Contractors
export const getContractors = (token, teamId, callback) => {

    return (dispatch) => {
        CompanyApi.getContractors(token, teamId).then(data => data.json()).then(data => {
            if (data.success) {
                dispatch(contractorResp(data.result));
            } else {
                alertBox(data.result.message.header, data.result.message.body);
                dispatch(contractorFailureResp());
            }
            callback();
        }).catch(error => {
            // alertBox('Info', 'Network Error !');
            callback();
        });
    }
};

//Contractors
export const getContractorTeams = (token, teamId, teamname, callback) => {
    console.log("In getContractorTeams()")
    return (dispatch) => {
        CompanyApi.getContractorTeams(token, teamId, teamname).then(data => data.json()).then(data => {
            if (data.success) {
                console.log("ResultSet:", data.result);
                dispatch(contractorTeamsResp(data.result));
            } else {
                alertBox(data.result.message.header, data.result.message.body);
                dispatch(contractorTeamsFailureResp());
            }
            callback();
        }).catch(error => {
            // alertBox('Info', 'Network Error !');
            callback();
        });
    }
};

/**
 * @author TM
 * @param {*} token 
 * @param {*} teamId 
 * @param {*} formname 
 * @param {*} callback 
 */
export const getContractorForms = (token, teamId, formname, callback) => {
    console.log("Inside getForms()");
    return (dispatch) => {
        CompanyApi.getContractorForms(token, teamId, formname).then(data => data.json()).then(data => {
            if (data.success) {
                console.log("Forms", data.result)
                dispatch(contractorFormResp(data.result));
            } else {
                alertBox(data.result.message.header, data.result.message.body);
                dispatch(contractorFormFailureResp());
            }
            callback();
        }).catch(error => {
            // alertBox('Info', 'Network Error !');
            callback();
        });
    }
};

export const getProjects = (token, teamId, callback) => {

    return (dispatch) => {
        CompanyApi.getProjects(token, teamId).then(data => data.json()).then(data => {
            if (data.success) {
                dispatch(projectResp(data.result));
            } else {
                alertBox(data.result.message.header, data.result.message.body);
                dispatch(projectFailureResp());
            }
            callback();
        }).catch(error => {
            // alertBox('Info', 'Network Error !');
            callback();
        });
    }
};

export const getClientProjectsForForms = (token, teamId, callback) => {

    return (dispatch) => {
        CompanyApi.getClientProjectsForForms(token, teamId).then(data => data.json()).then(data => {
            console.log("Client Projects", data.result)
            if (data.success) {
                dispatch(clientProjectsForFormsResp(data.result));
            } else {
                alertBox(data.result.message.header, data.result.message.body);
                dispatch(clientProjectsForFormsFailureResp());
            }
            callback();
        }).catch(error => {
            // alertBox('Info', 'Network Error !');
            callback();
        });
    }
};

export const getCategories = (token, teamId, callback) => {

    return (dispatch) => {
        CompanyApi.getCategories(token, teamId).then(data => data.json()).then(data => {
            if (data.success) {
                dispatch(categoryResp(data.result));
            } else {
                alertBox(data.result.message.header, data.result.message.body);
                dispatch(categoryFailureResp());
            }
            callback();
        }).catch(error => {
            // alertBox('Info', 'Network Error !');
            callback();
        });
    }
};

export const defaultTeam = (team) => {

    return (dispatch) => {
        dispatch(defaultTeamResp(team));
    }
};

function defaultTeamResp(team) {
    return {
        type: 'DEAFULT_TEAM',
        team: team
    };
}

function teamResp(data) {
    return {
        type: 'TEAM_SUCCESS',
        teams: data
    };
}

function teamFailureResp(data) {
    return {
        type: 'TEAM_FAILURE'
    };
}

function formResp(data) {
    return {
        type: 'FORM_SUCCESS',
        forms: data
    };
}

function formFailureResp(data) {
    return {
        type: 'FORM_FAILURE'
    };
}

function contractorFormResp(data) {
    return {
        type: 'CONTRACTOR_FORM_SUCCESS',
        forms: data
    };
}

function contractorFormFailureResp(data) {
    return {
        type: 'CONTRACTOR_FORM_FAILURE'
    };
}

function formDetailResp(data) {
    return {
        type: 'FORM_DETAIL_SUCCESS',
        formDetail: data
    };
}

function formDetailFailureResp(data) {
    return {
        type: 'FORM_DETAIL_FAILURE'
    };
}

function categoryResp(data) {
    return {
        type: 'CATEGORY_SUCCESS',
        catagories: data
    };
}

function categoryFailureResp(data) {
    return {
        type: 'CATEGORY_FAILURE'
    };
}

function projectResp(data) {
    return {
        type: 'PROJECT_SUCCESS',
        projects: data
    };
}

function projectFailureResp(data) {
    return {
        type: 'PROJECT_FAILURE'
    };
}

function clientProjectsForFormsResp(data) {
    return {
        type: 'CLIENT_PROJECTS_FOR_FORM_SUCCESS',
        clientProjects: data
    };
}

function clientProjectsForFormsFailureResp(data) {
    return {
        type: 'CLIENT_PROJECTS_FOR_FORM_FAILURE'
    };
}

function contractorResp(data) {
    return {
        type: 'CONTRACTOR_SUCCESS',
        contractors: data
    };
}

function contractorFailureResp(data) {
    return {
        type: 'CONTRACTOR_FAILURE'
    };
}

function contractorTeamsResp(data) {
    return {
        type: 'CONTRACTOR_TEAMS_SUCCESS',
        contractorTeams: data
    };
}

function contractorTeamsFailureResp(data) {
    return {
        type: 'CONTRACTOR_TEAMS_FAILURE'
    };
}

export function deleteForm(data) {
    return {
        type: 'deleteForm',
        data
    };
}