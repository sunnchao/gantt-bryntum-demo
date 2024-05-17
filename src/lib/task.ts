
export const taskList = 
[
  // rows : [
    {
      "id"       : 1,
      "name"     : "前端开发任务",
      "startDate" : "",
      "endDate" : "",
      "expanded" : true,
      "format": "YYYY-MM-DD",
      "children" : [
          { "id" : 6, "name" : "项目搭建", "expanded" : true, "startDate" : "2024-05-08", "endDate" : "2024-05-12", "durationUnit": "hour", "format": "YYYY-MM-DD", "children": [
            { "id" : 61, "name" : "需求分析", "startDate" : "2024-05-08", "endDate" : "2024-05-10", "percentDone": 50, "durationUnit": "hour" },
            { "id" : 62, "name" : "详设", "startDate" : "2024-05-10", "endDate" : "2024-05-12", "durationUnit": "hour", "hideAble": true }
          ] },
          { "id" : 3, "name" : "页面开发", "startDate" : "2024-05-14", "endDate" : "2024-05-19", "durationUnit": "hour" },
          { "id" : 9, "name" : "接口联调", "duration": 7, "durationUnit": "hour" }
      ]
    },
    {
      "id"       : 2,
      "name"     : "后端开发任务",
      "expanded" : true,
      "children" : [
          { "id" : 7, "name" : "数据库设计", "expanded" : true, "startDate" : "2024-05-08", "endDate" : "2024-05-14", "durationUnit": "hour", "children": [
            { "id" : 71, "name" : "数据库分析", "startDate" : "2024-05-08", "endDate" : "2024-05-11", "durationUnit": "hour" },
            { "id" : 72, "name" : "表结构设计", "duration": 3, "durationUnit": "hour" }
          ] },
          { "id" : 8, "name" : "接口开发", "startDate" : "2024-05-14", "endDate" : "2024-05-20", "durationUnit": "hour" },
          { "id" : 5, "name" : "接口联调", "duration": 7, "durationUnit": "hour" }
      ]
    }
  // ]
// }
  ]

