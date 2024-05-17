export const calendarsList = 
[
  // "rows" : [
    {
      "id"        : 1,
      "name"      : "前端开发任务",
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
  // ]
]
