import LookupApi from '../api/lookup';
import ManagementApi from '../api/management';

export const getAutocompleteUsers = (token, teamId, pharse) => {
    return new Promise((resolve, reject) => {
        LookupApi.getAutocompleteUsers(token, teamId, pharse).then(data => data.json()).then(data => {
            if (data.success) {
                // console.warn(data.result)
                resolve(data);
            }
        }).catch(error => {
            reject(error);
        });
    });
}

export const getAutocompleteQualification = (token, teamId, pharse) => {
    return new Promise((resolve, reject) => {
        LookupApi.getAutocompleteQualification(token, teamId, pharse).then(data => data.json()).then(data => {
            //  console.log(data)
            if (data.success) {

                resolve(data.result.map(i => i.name + ',' + i.id));
            }
        }).catch(error => {
            reject(error);
        });
    });
}

export const getAutocompleteCompetency = (token, teamId, pharse) => {
    return new Promise((resolve, reject) => {
        LookupApi.getAutocompleteCompetency(token, teamId, pharse).then(data => data.json()).then(data => {
            if (data.success) {
                resolve(data.result.map(i => i.name + ',' + i.id));
            }
        }).catch(error => {
            reject(error);
        });
    });
}

export const getRegisters = (token, teamId) => {
    return new Promise((resolve, reject) => {
        ManagementApi.getRegisters(token, teamId).then(data => data.json()).then(data => {
            if (data.success) {
                resolve(data.result.map(i => {
                    return {
                        id: i.id,
                        name: i.title
                    }
                }));
            }
        }).catch(error => {
            reject(error);
        });
    });
}

export const getFormPdf = (formDetail, token) => {
    return new Promise((resolve, reject) => {
        ManagementApi.getFormPdf(formDetail, token).then(data => data.json()).then(data => {
            if (data.success) {
                resolve(data.result.url);
            }
        }).catch(error => {
            reject(error);
        });
    });
}

export const getLocations = (token, teamId) => {
    return new Promise((resolve, reject) => {
        ManagementApi.getLocations(token, teamId).then(data => data.json()).then(data => {
            if (data.success) {
                resolve(data.result.map(i => {
                    return {
                        id: i.id,
                        name: i.name
                    }
                }));
            }
        }).catch(error => {
            reject(error);
        });
    });
}

export const getItems = (token, Obj) => {
    // console.warn(Obj)
    return new Promise((resolve, reject) => {
        ManagementApi.getItems(token, Obj.registerId, Obj.projectId, Obj.teamId).then(data => data.json()).then(data => {
            if (data.success) {
                resolve(data.result.map(i => {
                    return {
                        id: i.id,
                        name: i.input_value,
                        register_submitted_record_id: i.register_submitted_record_id
                    }
                }));
            }
        }).catch(error => {
            reject(error);
        });
    });
}

export const getSubRegisters = (token, teamId, parentId) => {
    return new Promise((resolve, reject) => {
        ManagementApi.getSubRegisters(token, teamId, parentId).then(data => data.json()).then(data => {
            if (data.success) {
                console.log("# Hello data:", data.result);
                resolve(data.result.map(i => {
                    return {
                        id: i.id,
                        name: i.title
                    }
                }));
            }
        }).catch(error => {
            reject(error);
        });
    });
}

export const getSubLocations = (token, teamId, parentId) => {
    return new Promise((resolve, reject) => {
        ManagementApi.getSubLocations(token, teamId, parentId).then(data => data.json()).then(data => {
            if (data.success) {
                resolve(data.result.map(i => {
                    return {
                        id: i.id,
                        name: i.name
                    }
                }));
            }
        }).catch(error => {
            reject(error);
        });
    });
}

export const getSubSubLocations = (token, teamId, parentId) => {
    return new Promise((resolve, reject) => {
        ManagementApi.getSubSubLocations(token, teamId, parentId).then(data => data.json()).then(data => {
            if (data.success) {
                resolve(data.result.map(i => {
                    return {
                        id: i.id,
                        name: i.name
                    }
                }));
            }
        }).catch(error => {
            reject(error);
        });
    });
}

export const getProjectBySubSubLocations = (token, teamId, parentId) => {
    return new Promise((resolve, reject) => {
        ManagementApi.getProjectBySubSubLocations(token, teamId, parentId).then(data => data.json()).then(data => {
            if (data.success) {
                resolve(data.result.map(i => {
                    return {
                        id: i.id,
                        name: i.name
                    }
                }));
            }
        }).catch(error => {
            reject(error);
        });
    });
}

export const getRegisterForProject = (token, teamId, parentId) => {
    return new Promise((resolve, reject) => {
        ManagementApi.getRegisterForProject(token, teamId, parentId).then(data => data.json()).then(data => {
            if (data.success) {
                resolve(data.result.map(i => {
                    return {
                        id: i.id,
                        name: i.name
                    }
                }));
            }
        }).catch(error => {
            reject(error);
        });
    });
}

export const getActionSubmitData = (action) => {
    return new Promise((resolve, reject) => {
        ManagementApi.actionDataSubmit(action).then(data => data.json()).then(data => {
            if (data.success) {

                resolve(data.result.map(i => {
                    return {
                        id: i.id,
                        name: i.name
                    }
                }));
            }
        }).catch(error => {
          //  console.log(error)
            reject(error);
        });
    });
}

export const getSubRegisterForProject = (token, teamId, parentId) => {
    return new Promise((resolve, reject) => {
        ManagementApi.getSubRegisterForProject(token, teamId, parentId).then(data => data.json()).then(data => {
            if (data.success) {
                resolve(data.result.map(i => {
                    return {
                        id: i.id,
                        name: i.name
                    }
                }));
            }
        }).catch(error => {
            reject(error);
        });
    });
}

export const getCountries = (token, callback) => {

    return (dispatch) => {
        LookupApi.getCountries(token).then(data => data.json()).then(data => {
            if (data.success) {
                dispatch(countryResp(data.result));
            } else {
                alertBox(data.result.message.header, data.result.message.body);
                dispatch(countryFailureResp());
            }
            callback();
        }).catch(error => {
            alertBox('Info', 'Network Error !');
            callback();
        });
    }
};

function countryResp(data) {
    return {
        type: 'COUNTRIES_SUCCESS',
        countries: data
    };
}

function countryFailureResp(data) {
    return {
        type: 'COUNTRIES_FAILURE'
    };
}

// Get Projects by team
export const getProjectByTeam= (token, teamId) => {
    return new Promise((resolve, reject) => {
        ManagementApi.getProjectByTeam(token, teamId).then(data => data.json()).then(data => {
            //console.log(data);
            if (data.success) {
                resolve(data.result.map(i => {
                    return {
                        id: i.id,
                        name: i.name
                    }
                }));
            }
        }).catch(error => {
            reject(error);
        });
    });
}
