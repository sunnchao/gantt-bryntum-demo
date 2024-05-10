export const taskList =            {
  id       : 1,
  name     : '前端开发任务',
  expanded : true,
  children : [
      { id : 6, name : '项目搭建', startDate : '2024-05-08', endDate : '2024-05-09' },
      { id : 3, name : '页面开发', startDate : '2024-05-12', endDate : '2024-05-17' },
      { id : 9, name : '接口联调', startDate : '2024-05-19', endDate : '2024-05-20' },
  ]
}

export const calendars =       {
  "id"        : "general",
  "name"      : "General",
  "intervals" : [
    {
      "recurrentStartDate" : "on Sat at 0:00",
      "recurrentEndDate"   : "on Mon at 0:00",
      "isWorking"          : false
    }
  ],
  "expanded" : true,
  "children" : [
    {
      "id"        : "business",
      "name"      : "Business",
      "intervals" : [
        {
          "recurrentStartDate" : "every weekday at 12:00",
          "recurrentEndDate"   : "every weekday at 13:00",
          "isWorking"          : false
        },
        {
          "recurrentStartDate" : "every weekday at 17:00",
          "recurrentEndDate"   : "every weekday at 08:00",
          "isWorking"          : false
        }
      ]
    },
    {
      "id"        : "night",
      "name"      : "Night shift",
      "intervals" : [
        {
          "recurrentStartDate" : "every weekday at 6:00",
          "recurrentEndDate"   : "every weekday at 22:00",
          "isWorking"          : false
        }
      ]
    }
  ]
}
