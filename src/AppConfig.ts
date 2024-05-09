import type { GanttConfig, TreeGridConfig } from '@bryntum/gantt';
import './lib/GanttToolbar.js';
import './lib/gantt.locale.ZhCn.js';
export const useGanttConfig = () => {
    return {
        enableUndoRedoKeys : true,
        flex               : '1 1 auto',
        dependencyIdField  : 'wbsCode',

        project : {
            transport : {
                load : {
                    url : './data/launch-saas.json'
                }
            },

            autoLoad : true,

            // The State TrackingManager which the UndoRedo widget in the toolbar uses
            stm : {
                autoRecord : true
            },

            // This config enables response validation and dumping of found errors to the browser console.
            // It's meant to be used as a development stage helper only so please set it to false for production systems.
            validateResponse : true
        },
        columns : [{ type : 'addnew' }],
        tbar : 
        {
            type  : 'gantttoolbar',
        },
        startDate : '',
        endDate   : '',
        locale: ''
    };
};

export const useProjectConfig = () => {
    return {
        startDate : '',
    };
};

export const treeGridConfiguration = {
    flex : '0 0 30em',
    tbar : ['操作记录'],
    readOnly : false,

    store : {
        tree   : true,
        fields : ['idx', 'title', 'changes'],
        data   : []
    },

    columns : [
        { text : '#', field : 'idx', width : '1em', sortable : false },
        { text : '行为', field : 'title', flex : 0.4, type : 'tree', sortable : false },
        { text : '改变', field : 'changes', flex : 0.6, sortable : false }
    ]
};


