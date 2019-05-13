import CreateForm from '../components/task/new-task';
import CreateContractorForm from '../components/task/new-contractor-task';
import NewFormList from '../components/forms/new-list';
import NewContractorFormList from '../components/forms/contractor-new-list';
import ContractorTeamsList from '../components/forms/contractor-teams-list';
import ActionForm from '../components/task/action-form';
import ImageSection from '../components/task/photo-section';
import ExportStack from './export.stack';
import DrawerStack from './drawer.stack';
import CompletedFormList from '../components/forms/completed-list';
import { StackNavigator } from 'react-navigation';
import React from 'react';
import CameraView from '../components/task/camera.view';
import Export1Stack from '../components/export/export1';

export const NewTaskStack = StackNavigator({
    NewList: {
        screen: NewFormList
    },
    CreateForm: {
        screen: CreateForm
    },
    Action: {
        screen: ActionForm
    },
    Photo: {
        screen: ImageSection,
        navigationOptions: {
            header: null
        }
    },
    Camera: {
        screen: CameraView
    },
    Export: {
        screen: ExportStack,
        navigationOptions: {
            header: null
        }
    },
    Drawer: {
        screen: DrawerStack
    },
    CompletedList: {
        screen: CompletedFormList
    }
},
    {
        initialRouteName: 'NewList',
        headerMode: 'screen'
    });

export const ContractorTeamsFormStack = StackNavigator({
    ContractorTeamsList: {
        screen: ContractorTeamsList // Need to change to contractor teams screen
    },
    NewContractorList: {
        screen: NewContractorFormList
    },
    CreateForm: {
        screen: CreateContractorForm
    },
    Action: {
        screen: ActionForm
    },
    Photo: {
        screen: ImageSection,
        navigationOptions: {
            header: null
        }
    },
    Camera: {
        screen: CameraView
    },
    Export: {
        screen: ExportStack,
        navigationOptions: {
            header: null
        }
    },
    Drawer: {
        screen: DrawerStack
    },
    CompletedList: {
        screen: CompletedFormList
    }
},
    {
        initialRouteName: 'ContractorTeamsList',
        headerMode: 'screen'
    });
    
export const CompletedTaskStack = StackNavigator({
    CompletedList: {
        screen: CompletedFormList
    },
    CreateForm: {
        screen: CreateForm
    },
    Action: {
        screen: ActionForm
    },
    Photo: {
        screen: ImageSection,
        navigationOptions: {
            header: null
        }
    },
    Camera: {
        screen: CameraView
    },
    Export: {
        screen: ExportStack,
        navigationOptions: {
            header: null
        }
    },
}, {
        initialRouteName: 'CompletedList',
        headerMode: 'screen'
    });