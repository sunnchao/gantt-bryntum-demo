import { Toolbar, Toast, DateHelper, CSSHelper, LocaleHelper } from "@bryntum/gantt";
/**
 * @module GanttToolbar
 */

/**
 * @extends Core/widget/Toolbar
 */
export default class GanttToolbar extends Toolbar {
    // Factoryable type name
    static get type() {
        return "gantttoolbar";
    }

    static get $name() {
        return "GanttToolbar";
    }

    // Called when toolbar is added to the Gantt panel
    set parent(parent) {
        super.parent = parent;

        const me = this;
        me.gantt = parent;

        parent.project.on({
            load: "updateStartDateField",
            refresh: "updateStartDateField",
            thisObj: me
        });

        me.styleNode = document.createElement("style");
        document.head.appendChild(me.styleNode);
    }

    get parent() {
        return super.parent;
    }

    static get configurable() {
        return {
            items: [
                // 导出
                {
                    type: "buttonGroup",
                    items: [
                        {
                            ref: "exportButton",
                            icon: "b-fa b-fa-file-export",
                            text: "导出",
                            tooltip: "导出",
                            onAction: "up.onExportClick"
                        }
                    ]
                },
                {
                    type: "buttonGroup",
                    items: [
                        {
                            color: "b-green",
                            ref: "addTaskButton",
                            icon: "b-fa b-fa-plus",
                            text: '创建',
                            tooltip: "创建新任务",
                            onAction: "up.onAddTaskClick"
                        }
                    ]
                },
                {
                    type: "buttonGroup",
                    items: [
                        {
                            ref: "editTaskButton",
                            icon: "b-fa b-fa-pen",
                            text: '编辑',
                            tooltip: "编辑所选的任务",
                            onAction: "up.onEditTaskClick"
                        },
                        {
                            ref: "undoRedo",
                            type: "undoredo",
                            items: {
                                transactionsCombo: null
                            }
                        }
                    ]
                },
                {
                    type: "buttonGroup",
                    items: [
                        {
                            ref: "expandAllButton",
                            icon: "b-fa b-fa-angle-double-down",
                            tooltip: "全部展开",
                            onAction: "up.onExpandAllClick"
                        },
                        {
                            ref: "collapseAllButton",
                            icon: "b-fa b-fa-angle-double-up",
                            tooltip: "全部折叠",
                            onAction: "up.onCollapseAllClick"
                        }
                    ]
                },
                {
                    type: "buttonGroup",
                    items: [
                        {
                            ref: "zoomInButton",
                            icon: "b-fa b-fa-search-plus",
                            tooltip: "放大",
                            onAction: "up.onZoomInClick"
                        },
                        {
                            ref: "zoomOutButton",
                            icon: "b-fa b-fa-search-minus",
                            tooltip: "缩小",
                            onAction: "up.onZoomOutClick"
                        },
                        {
                            ref: "zoomToFitButton",
                            icon: "b-fa b-fa-compress-arrows-alt",
                            tooltip: "缩放到适当大小",
                            onAction: "up.onZoomToFitClick"
                        },
                        {
                            ref: "previousButton",
                            icon: "b-fa b-fa-angle-left",
                            tooltip: "上一个时间跨度",
                            onAction: "up.onShiftPreviousClick"
                        },
                        {
                            ref: "nextButton",
                            icon: "b-fa b-fa-angle-right",
                            tooltip: "下一个时间跨度",
                            onAction: "up.onShiftNextClick"
                        }
                    ]
                },
                {
                    type: "buttonGroup",
                    items: [
                        {
                            type: "button",
                            ref: "featuresButton",
                            icon: "b-fa b-fa-tasks",
                            text: "功能",
                            tooltip: "切换功能",
                            toggleable: true,
                            menu: {
                                onItem: "up.onFeaturesClick",
                                onBeforeShow: "up.onFeaturesShow",
                                items: [
                                    {
                                        text: "连接线",
                                        feature: "dependencies",
                                        checked: false
                                    },
                                    {
                                        text: "任务标签",
                                        feature: "labels",
                                        checked: true
                                    },
                                    {
                                        text: "项目行",
                                        feature: "projectLines",
                                        checked: false
                                    },
                                    {
                                        text: "突出显示非工作时间",
                                        feature: "nonWorkingTime",
                                        checked: false
                                    },
                                    {
                                        text: "启用单元格编辑",
                                        feature: "cellEdit",
                                        checked: false
                                    },
                                    {
                                        text: "显示基线",
                                        feature: "baselines",
                                        checked: false
                                    },
                                    {
                                        text: "显示汇总",
                                        feature: "rollups",
                                        checked: false
                                    },
                                    {
                                        text: "显示进度线",
                                        feature: "progressLine",
                                        checked: false
                                    },
                                    {
                                        text: "隐藏时间表",
                                        cls: "b-separator",
                                        subGrid: "normal",
                                        checked: false
                                    }
                                ]
                            }
                        },
                        {
                            type: "button",
                            ref: "settingsButton",
                            icon: "b-fa b-fa-cogs",
                            text: "设置",
                            tooltip: "调整设置",
                            toggleable: true,
                            menu: {
                                type: "popup",
                                anchor: true,
                                cls: "settings-menu",
                                layoutStyle: {
                                    flexDirection: "column"
                                },
                                onBeforeShow: "up.onSettingsShow",

                                items: [
                                    {
                                        type: "slider",
                                        ref: "rowHeight",
                                        text: "行高",
                                        width: "12em",
                                        showValue: true,
                                        min: 30,
                                        max: 70,
                                        onInput: "up.onSettingsRowHeightChange"
                                    },
                                    {
                                        type: "slider",
                                        ref: "barMargin",
                                        text: "条形边距",
                                        width: "12em",
                                        showValue: true,
                                        min: 0,
                                        max: 10,
                                        onInput: "up.onSettingsMarginChange"
                                    },
                                    {
                                        type: "slider",
                                        ref: "duration",
                                        text: "动画持续时间",
                                        width: "12em",
                                        min: 0,
                                        max: 2000,
                                        step: 100,
                                        showValue: true,
                                        onInput: "up.onSettingsDurationChange"
                                    }
                                ]
                            }
                        },
                        {
                            type: "button",
                            color: "b-red",
                            ref: "criticalPathsButton",
                            icon: "b-fa b-fa-fire",
                            text: "关键路径",
                            tooltip: "突出显示关键路径",
                            toggleable: true,
                            onAction: "up.onCriticalPathsClick"
                        }
                    ]
                },
                {
                    type: "datefield",
                    ref: "startDateField",
                    label: "项目启动",
                    // required  : true, (done on load)
                    flex: "0 0 17em",
                    listeners: {
                        change: "up.onStartDateChange"
                    }
                },
                {
                    type: "textfield",
                    ref: "filterByName",
                    cls: "filter-by-name",
                    flex: "0 0 12.5em",
                    // Label used for material, hidden in other themes
                    label: "按名称查找任务",
                    // Placeholder for others
                    placeholder: "按名称查找任务",
                    clearable: true,
                    keyStrokeChangeDelay: 100,
                    triggers: {
                        filter: {
                            align: "end",
                            cls: "b-fa b-fa-filter"
                        }
                    },
                    onChange: "up.onFilterChange"
                }
            ]
        };
    }

    setAnimationDuration(value) {
        const me = this,
            cssText = `.b-animating .b-gantt-task-wrap { transition-duration: ${value /
                1000}s !important; }`;

        me.gantt.transitionDuration = value;

        if (me.transitionRule) {
            me.transitionRule.cssText = cssText;
        } else {
            me.transitionRule = CSSHelper.insertRule(cssText);
        }
    }

    updateStartDateField() {
        const { startDateField } = this.widgetMap;

        startDateField.value = this.gantt.project.startDate;

        // This handler is called on project.load/propagationComplete, so now we have the
        // initial start date. Prior to this time, the empty (default) value would be
        // flagged as invalid.
        startDateField.required = true;
    }

    // region controller methods

    async onAddTaskClick() {
        const { gantt } = this,
            added = gantt.taskStore.rootNode.appendChild({
                name: "New task",
                duration: 1
            });

        // wait for immediate commit to calculate new task fields
        await gantt.project.commitAsync();

        // scroll to the added task
        await gantt.scrollRowIntoView(added);

        gantt.features.cellEdit.startEditing({
            record: added,
            field: "name"
        });
    }

    onEditTaskClick() {
        const { gantt } = this;

        if (gantt.selectedRecord) {
            gantt.editTask(gantt.selectedRecord);
        } else {
            Toast.show("First select the task you want to edit");
        }
    }

    onExpandAllClick() {
        this.gantt.expandAll();
    }

    onCollapseAllClick() {
        this.gantt.collapseAll();
    }

    onZoomInClick() {
        this.gantt.zoomIn();
    }

    onZoomOutClick() {
        this.gantt.zoomOut();
    }

    onZoomToFitClick() {
        this.gantt.zoomToFit({
            leftMargin: 50,
            rightMargin: 50
        });
    }

    onShiftPreviousClick() {
        this.gantt.shiftPrevious();
    }

    onShiftNextClick() {
        this.gantt.shiftNext();
    }

    onStartDateChange({ value, userAction }) {
        // Scroll to date only when user changes the date, not for the initial set
        if (value && userAction) {
            this.gantt.scrollToDate(DateHelper.add(value, -1, 'week'), {
                block : 'start'
            });

            this.gantt.project.setStartDate(value);
        }
    }

    onFilterChange({ value }) {
        if (value === "") {
            this.gantt.taskStore.clearFilters();
        } else {
            value = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

            this.gantt.taskStore.filter({
                filters: task =>
                    task.name && task.name.match(new RegExp(value, "i")),
                replace: true
            });
        }
    }

    onFeaturesClick({ source: item }) {
        const { gantt } = this;

        if (item.feature) {
            const feature = gantt.features[item.feature];
            feature.disabled = !feature.disabled;
        } else if (item.subGrid) {
            const subGrid = gantt.subGrids[item.subGrid];
            subGrid.collapsed = !subGrid.collapsed;
        }
    }

    onFeaturesShow({ source: menu }) {
        const { gantt } = this;

        menu.items.map(item => {
            const { feature } = item;

            if (feature) {
                // a feature might be not presented in the gantt
                // (the code is shared between "advanced" and "php" demos which use a bit different set of features)
                if (gantt.features[feature]) {
                    item.checked = !gantt.features[feature].disabled;
                }
                // hide not existing features
                else {
                    item.hide();
                }
            } else {
                item.checked = gantt.subGrids[item.subGrid].collapsed;
            }
        });
    }

    onSettingsShow({ source: menu }) {
        const { gantt } = this,
            { rowHeight, barMargin, duration } = menu.widgetMap;

        rowHeight.value = gantt.rowHeight;
        barMargin.value = gantt.barMargin;
        barMargin.max = gantt.rowHeight / 2 - 5;
        duration.value = gantt.transitionDuration;
    }

    onSettingsRowHeightChange({ value }) {
        this.gantt.rowHeight = value;
        this.widgetMap.settingsButton.menu.widgetMap.barMargin.max =
            value / 2 - 5;
    }

    onSettingsMarginChange({ value }) {
        this.gantt.barMargin = value;
    }

    onSettingsDurationChange({ value }) {
        this.gantt.transitionDuration = value;
        this.styleNode.innerHTML = `.b-animating .b-gantt-task-wrap { transition-duration: ${value /
            1000}s !important; }`;
    }

    onCriticalPathsClick({ source }) {
        this.gantt.features.criticalPaths.disabled = !source.pressed;
    }

    onExportClick() {
        const { gantt } = this;
        console.log('onExportClick', gantt.features)
        gantt.features.pdfExport.showExportDialog();
    }
    // endregion
}

// Register this widget type with its Factory
GanttToolbar.initClass();
