<template>
    <div class="b-widget b-wrapper">
        <!-- <bryntum-gantt-project-model
            ref="project"
            v-bind="ganttConfig"
            :tasks="tasks"
            :resources="resources"
            :calendars="calendars"
            :assignments="assignments"
            :dependencies="dependencies"
        /> -->
        <bryntum-gantt
            ref="ganttRef"
            v-bind="ganttConfig"
        />


        <bryntum-splitter />


        <bryntum-tree-grid
            ref="treeGridRef"
            v-bind="treeGridConfig"
            :cellEditFeature="false"
        />
    </div>
</template>

<script lang="ts" setup name="App">
import { ref, reactive, onMounted, nextTick } from 'vue';
import './lib/gantt.locale.ZhCn.js';
import {
    BryntumGanttProjectModel,
    BryntumGantt,
    BryntumTreeGrid,
    BryntumSplitter
} from '@bryntum/gantt-vue-3';
import { taskList } from './lib/task'
import { calendarsList } from './lib/calendars'
import { resourcesList } from './lib/resources'
import { dependenList } from './lib/dependen'
import { assignmentsList } from './lib/assignments'
import { useGanttConfig, useProjectConfig, treeGridConfiguration } from './AppConfig.js';
import { type Store, type Model, type SchedulerEventModel, ProjectModel, StringHelper, LocaleHelper, LocaleManager, TaskModel, DependencyModel } from '@bryntum/gantt';
const ganttRef = ref(null);
const project = ref(null);
const treeGridConfig = reactive(treeGridConfiguration)
const ganttConfig = reactive(useGanttConfig());
const projectConfig = reactive(useProjectConfig());
const treeGridRef = ref(null);
const tasks = ref([] as any);
const dependencies = ref([]);
const calendars = ref([]);
const resources = ref([]);
const assignments = ref([]);
const updateTaskList = ref([] as any);
const updateDependencyList = ref([] as any);

LocaleHelper.publishLocale({
    localeName: "ZhCn",
    localeDesc: "中文（中国）",
    localeCode: "zh-CN",
    localePath : './lib/gantt.locale.ZhCn.js'
});
LocaleManager.applyLocale('ZhCn')
const chineseLocale = LocaleHelper.locales.ZhCn;

function arrayToTree(ary: any) {
    const result = [] as any; 
    const itemMap = {} as any; 
    ary.forEach((item: any) => {
        item.children = []; 
        itemMap[item.id] = item;
    });
    ary.forEach((item: any) => {
        const parentId = item.parentId;
        if (typeof(parentId) === 'string') {
            result.push(item);
        } else {
            if (itemMap[parentId]) {
                itemMap[parentId].children.push(item);
            } 
        }
    });
    return result;
}
    tasks.value = taskList;
    dependencies.value = dependenList;
    calendars.value = calendarsList;
    resources.value = resourcesList;
    assignments.value = assignmentsList;
onMounted(() => {
    // ganttRef.value.instance.value.project = project.value.instance.value;
    //此下操作位记录 操作记录
    const gantt = ganttRef.value.instance.value

    const treeGrid = treeGridRef.value.instance.value;
    const onRecordingStop = ({ stm, transaction }: any) => {
        console.log('我移动了')
        const
            gantt = ganttRef.value!.instance.value,
            treeGrid    = treeGridRef.value!.instance.value,
            actionStore = treeGrid.store,
            toRemove    = (actionStore.rootNode.children)?.slice(stm.position) || [],
            action      = actionStore.rootNode.insertChild({
                idx      : stm.position,
                title    : transaction.title,
                changes  : transaction.length > 1 ? `${transaction.length} steps` : `${transaction.length} step`,
                expanded : false,
                children : transaction.queue.map((action: any, idx: number) => {
                    let {
                            type,
                            parentModel,
                            model,
                            modelList,
                            newData
                        } = action,
                        title   = '',
                        changes = '';

                    if (!model) {
                        if (parentModel) {
                            model = parentModel;
                        }
                        else {
                            model = modelList[modelList.length - 1];
                        }
                    }
                    const { fromEvent, toEvent } = model as { fromEvent: SchedulerEventModel; toEvent: SchedulerEventModel };
                    if (type === 'UpdateAction' && model instanceof ProjectModel) {
                        title   = 'Update project';
                        changes = StringHelper.safeJsonStringify(newData);
                    }
                    else if (type === 'EventUpdateAction') {
                        title   = 'Edit task ' + model.name;
                        changes = StringHelper.safeJsonStringify(newData);
                    }
                    else if (type === 'AddAction' && model instanceof TaskModel) {
                        title = 'Add task ' + model.name;
                    }
                    else if (type === 'RemoveAction' && model instanceof TaskModel) {
                        title = 'Remove task ' + model.name;
                    }
                    else if (type === 'UpdateAction' && model instanceof DependencyModel) {
                        if (fromEvent && toEvent) {
                            title = `Edit link ${fromEvent.name} -> ${toEvent.name}`;
                        }
                        else {
                            title = 'Edit link';
                        }
                        changes = StringHelper.safeJsonStringify(newData);
                    }
                    else if (type === 'AddAction' && model instanceof DependencyModel) {
                        title = `Link ${fromEvent.name} -> ${toEvent.name}`;
                    }
                    else if (type === 'RemoveAction' && model instanceof DependencyModel) {
                        const
                            fromEvent = model.fromEvent || gantt.taskStore.getById(model.from),
                            toEvent   = model.toEvent || gantt.taskStore.getById(model.to);

                        if (fromEvent && toEvent) {
                            title = `Unlink ${(fromEvent as SchedulerEventModel).name} -> ${(toEvent as SchedulerEventModel).name}`;
                        }
                        else {
                            title = 'Unlink tasks';
                        }
                    }
                    else if (type === 'InsertChildAction') {
                        title = `Insert task ${model.name} at ${action.insertIndex} position`;
                    }

                    return {
                        idx : `${stm.position}.${idx + 1}`,
                        title,
                        changes
                    };
                })
            }, toRemove[0]);
        treeGrid.selectedRecord = action;
        if (toRemove.length) {
            actionStore.rootNode.removeChild(toRemove);
        }
    };
    const onRestoringStop = ({ stm }: any) => {
        console.log('我暂停了')
        const
            treeGrid = treeGridRef.value!.instance.value,
            store = treeGrid.store,
            rootNodeChildren = store.rootNode.children,
            action = rootNodeChildren[stm.position];
        treeGrid.selectedRecord = action;
    };
    console.log(gantt.project)
    gantt.project.taskStore.add(taskList)
    gantt.project.stm.on({
        recordingStop : onRecordingStop,
        restoringStop : onRestoringStop,
        thisObj : treeGrid
    });
    treeGrid.on({
        selectionchange() {
            const
                { stm } = gantt.project,
                action  = treeGrid.selectedRecord as any;
            if (action && action.parent.isRoot) {
                const idx = action.idx;
                if (stm.position < idx) {
                    stm.redo(idx - stm.position);
                }
                else if (stm.position > idx) {
                    stm.undo(stm.position - idx);
                }
            }
        },
        thisObj : treeGrid
    });

    nextTick(() => {
      gantt.project.taskStore.on('update', async () => {
          console.log('update', gantt.project.taskStore.allRecords)
        //   console.log('sources', gantt.project.taskStore.changes)
        //   console.log('update', gantt.project.dependencyStore.allRecords)
        if(gantt.project.taskStore.allRecords && gantt.project.taskStore.allRecords.length > 0) {
            let dataList = [] as any
            gantt.project.taskStore.allRecords.map((item: any) => {
                dataList.push(item.data)
            //     let startTime = new Date(item._data.startDate)
            //     let endTime = new Date(item._data.endDate)
            //     let startDate = `${startTime.getFullYear()}-${("0" + (startTime.getMonth() + 1)).slice(-2)}-${("0" + startTime.getDate()).slice(-2)}`
            //     let endtDate = `${endTime.getFullYear()}-${("0" + (endTime.getMonth() + 1)).slice(-2)}-${("0" + endTime.getDate()).slice(-2)}`
            //     console.log(typeof(item.data.parentId))
                
            })
            // console.log(dataList)
            updateTaskList.value =  await arrayToTree(dataList)
            console.log(updateTaskList.value)
        }
      });
      gantt.project.dependencyStore.on('change', () => {
        //   console.log('update', gantt.project.taskStore.allRecords)
        //   console.log('update', gantt.project.dependencyStore.allRecords)
          updateDependencyList.value = [] as any
          if(gantt.project.dependencyStore.allRecords && gantt.project.dependencyStore.allRecords.length > 0) {
            gantt.project.dependencyStore.allRecords.map((item: any, index: any) => {
                if(!item._id) {
                    updateDependencyList.value.push({id: index + 1, fromTask: item._data.fromEvent._id, toTask: item._data.toEvent._id,})
                } else {
                    updateDependencyList.value.push(item.originalData)
                }
            })
            console.log(updateDependencyList.value)
          }
      });
    })
});
</script>

<style lang="scss">
@import './App.scss';

/* 隐藏项目起止线 */
.b-gantt-project-line-canvas {
    display: none !important;
}
</style>


