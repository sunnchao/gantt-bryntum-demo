<template>
    <div class="b-widget b-wrapper">
        <!-- <bryntum-gantt-project-model
            ref="project"
            v-bind="projectConfig"
            :tasks="tasks"
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
// import { taskList } from './lib/task.js'
import { useGanttConfig, useProjectConfig, treeGridConfiguration } from './AppConfig.js';
import { type Store, type Model, type SchedulerEventModel, ProjectModel, StringHelper, LocaleHelper, LocaleManager, TaskModel, DependencyModel } from '@bryntum/gantt';
const ganttRef = ref(null);
const project = ref(null);
const treeGridConfig = reactive(treeGridConfiguration)
const ganttConfig = reactive(useGanttConfig());
const projectConfig = reactive(useProjectConfig());
const treeGridRef = ref(null);
const tasks = ref([] as any[]);
const dependencies = ref(null);
LocaleHelper.publishLocale({
    localeName: "ZhCn",
    localeDesc: "中文（中国）",
    localeCode: "zh-CN",
    localePath : './lib/gantt.locale.ZhCn.js'
});
LocaleManager.applyLocale('ZhCn')
const chineseLocale = LocaleHelper.locales.ZhCn;
onMounted(() => {
    // tasks.value = [taskList];
    // ganttRef.value.instance.value.project = project.value.instance.value;
    //此下操作位记录 操作记录
    const gantt = ganttRef.value.instance.value
    const treeGrid = treeGridRef.value.instance.value;
    const onRecordingStop = ({ stm, transaction }: any) => {
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
        const
            treeGrid = treeGridRef.value!.instance.value,
            store = treeGrid.store,
            rootNodeChildren = store.rootNode.children,
            action = rootNodeChildren[stm.position];
        treeGrid.selectedRecord = action;
    };
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
});
</script>

<style lang="scss">
@import './App.scss';

/* 隐藏项目起止线 */
.b-scheduler .b-gantt-dependency-line,
.b-scheduler .b-gantt-milestone-line {
    display: none !important;
}
</style>


