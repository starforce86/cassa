import { StackNavigator } from 'react-navigation';
import React from 'react';
import { Platform } from 'react-native';
import DrawerStack from './drawer.stack';
import { Export, Export1, ManagementHome, ClientProject, ContractorItems, Locations, SubLocations, SubSubLocations, ProjectByRegister, ProjectBySubRegister, ProjectBySubSubLocation, Projects, Items, Registers, SubRegisters, ExportAction } from '../components/export/index';

const ProjectStack = StackNavigator( {
    // Locations: {
    //     screen: Locations
    // },
    // SubLocations: {
    //     screen: SubLocations
    // },
    // SubSubLocations: {
    //     screen: SubSubLocations
    // },

    // ProjectBySubSubLocation: {
    //     screen: ProjectBySubSubLocation
    // },

    // Added New
    Projects:{
        screen: Projects
    },

    RegisterForProject: {
        screen: ProjectByRegister
    },
    SubRegisterForProject: {
        screen: ProjectBySubRegister
    },
    ProjectItems: {
        screen: Items
    },
    Drawer: {
        screen: DrawerStack
    },
    ExportAction: {
        screen: ExportAction
    }
}, {
        //initialRouteName: 'Locations',
        initialRouteName: 'Projects',
        //initialRouteName: 'RegisterForProject',
        headerMode: 'none'//
    } )

const ContractorItemsStack = StackNavigator( {
    // Added New
    ClientProject: {
        screen: ClientProject
    },
        
    ContractorItems: {
        screen: ContractorItems
    },
    Drawer: {
        screen: DrawerStack
    },
    ExportAction: {
        screen: ExportAction
    }
}, {
        initialRouteName: 'ClientProject',
        headerMode: 'none'//
    } )
    
const ManagementStack = StackNavigator( {
    Home: {
        screen: ManagementHome
    },
    ClientProject: {
        screen: ClientProject
    },
    Registers: {
        screen: Registers
    },
    SubRegisters: {
        screen: SubRegisters
    },
    // Locations: {
    //     screen: Locations
    // },
    // SubLocations: {
    //     screen: SubLocations
    // },   
    // SubSubLocations: {
    //     screen: SubSubLocations
    // },
    // ProjectBySubSubLocation: {
    //     screen: ProjectBySubSubLocation
    // },
    
    // Added New
    Projects:{
        screen: Projects
    },

    RegisterForProject: {
        screen: ProjectByRegister
    },

    ProjectItems: {
        screen: Items
    },
    Drawer: {
        screen: DrawerStack
    },

    Items: {
        screen: Items
    },

    ExportAction: {
        screen: ExportAction
    },
    Projects: {
        screen: ProjectStack
    },

    ClientProject: {
        screen: ContractorItemsStack
    },
    Drawer: {
        screen: DrawerStack
    }
}, {
        initialRouteName: 'Home',
        headerMode: 'none'//
    } );

const ExportStack = StackNavigator( {
    Export: {
        screen: Export1
    },
    Export1: {
        screen: Export1
    },
    Management: {
        screen: ManagementStack
    }
},
    {
        initialRouteName: 'Export',
        headerMode: 'none'//
    } );


export default ExportStack;