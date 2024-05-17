import {AjaxStore, DateHelper, ColumnStore, Column} from '@bryntum/gantt';
import './lib/GanttToolbar.js';
import './lib/gantt.locale.ZhCn.js';

const headerTpl = ({
    currentPage,
    totalPages
}) => `

    <dl>
        <dt>Date: ${DateHelper.format(new Date(), 'll LT')}</dt>
        <dd>${totalPages ? `Page: ${currentPage + 1}/${totalPages}` : ''}</dd>
    </dl>
    `;
const footerTpl = () => `<h3>© ${new Date().getFullYear()} Bryntum AB</h3></div>`;

class CustomColumn extends Column {
    static get type() {
        return 'customcolumn';
    }

    static isGanttColumn = true;

    static get defaults() {
        return {
            text : 'Custom Column',
            field: 'customColumn',
            renderer: (v) => {
                return v.value ? v.value + 'H' : '';
            }
        };
    }
}
ColumnStore.registerColumnType(CustomColumn, true);

export const useGanttConfig = () => {
    return {
        flex               : '1 1 auto',
        project : {
            autoLoad: true,
            transport : {
                // load : {
                //     url : './data/launch-saas.json'
                // },
                // sync : {
                //     url : './data/sync-saas.json'
                // }
            },
            stm : {
                autoRecord : true
            },
            validateResponse : true
        },
        columns : {
            autoAddField : true,
            // baselineDurationColumn: {
            //     hideable : false
            // },
            data: [
                {
                    type: 'name', text: '任务名称', field: 'name', width: 250,
                    filterable: {
                        filterField : {
                            type  : 'combo',
                            field: 'name',
                            store : new AjaxStore({
                                readUrl  : 'http://localhost:8080/resources/demo.json',
                                autoLoad : true,
                            }),
                            valueField   : 'name',
                            displayField : 'name',
                            multiSelect  : true
                        },
                    }
                },
                { type : 'startdate', text : '开始时间', format: 'YYYY-MM-DD' },
                { type : 'duration', text : 'Duration', },
                { type : 'enddate', text : '结束时间', format: 'YYYY-MM-DD'  },
                { type : 'customcolumn', text : '所需工时' },
                { type : 'addnew' }
            ],
        },
        tbar : 
        {
            type  : 'gantttoolbar',
        },
        // startDate : '',
        // endDate   : '',
        features: {
            filter : {
                prioritizeColumns : true
            },
            // taskTooltip : {
            //     template : (data) => `Tooltip for ${data}`,
            //     // // Tooltip configs can be used here
            //     // align    : 'l-r' // Align left to right
            // },
            pdfExport : {
                exportServer            : 'http://localhost:8080/',
                // Required for font-awesome icons to display correctly
                translateURLsToAbsolute : 'http://localhost:8080/resources/',
                headerTpl,
                footerTpl
            }
        }
    };
};

export const useProjectConfig = () => {
    return {
        startDate : '',
        calendar: "1",
        hoursPerDay: 24,
        daysPerWeek: 5,
        daysPerMonth: 20,
        stm: {
            autoRecord : true
        }

    };
};

export const treeGridConfiguration = {
    flex : '0 0 30em',
    tbar : ['操作记录'],
    readOnly : false,

    store : {
        tree   : true,
        fields : ['idx', 'title', 'changes'],
        data: []
    },

    columns : [
        { text : '#', field : 'idx', width : '1em', sortable : false },
        { text : '行为', field : 'title', flex : 0.4, type : 'tree', sortable : false },
        { text : '改变', field : 'changes', flex : 0.6, sortable : false }
    ]
};


