import { Duration } from "@bryntum/gantt";

export const taskList =            {
  id       : 1,
  name     : '前端开发任务',
  expanded : true,
  children : [
      { id : 6, name : '项目搭建', startDate : '2024-05-08', endDate : '2024-05-09' },
      { id : 3, name : '页面开发', duration: 3},
      { id : 9, name : '接口联调', duration: 3 },
  ]
}

