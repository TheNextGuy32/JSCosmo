angular.module('utilityApp')
  .filter('reverse', () => {
    return (items) => {
      return items.slice().reverse();
    };
  })
  .filter('daysToDate', () => {
    return (days, shortened) => {
      var months = [
        "January", "February", "March", "April",
        "May", "June", "July", "August", 
        "September", "October","November","December"
        ];
      var shortenedMonths = [
          "Jan", "Feb", "Mar", "Apr",
          "May", "Jun", "Jul", "Aug", 
          "Sep", "Oct","Nov","Dec"
          ];
      var daysOfWeek = [
          "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
          "Saturday", "Sunday",
          "Arlsday", "Farsday", "Shorsday"
        ];
      
      var shortenedDaysOfWeek = [
        "Mon", "Tues", "Wed", "Thurs", "Fri",
        "Sat", "Sun",
        "Arls", "Fars", "Shors"
       ];
      
      var weekday = daysOfWeek[days % 10];
      var day = ((days % 360) % 30) + 1;
      var month = shortenedMonths[Math.floor((days % 360) / 30)];
      var year = Math.floor(days / 360) + 1;
      
      return (shortened ? "" : weekday + ", ") + month + " " + day + ", " + " Year " + year;
    };
  })
  .filter('duration', () => {
    return (days) => {
      var years = Math.floor(days / 360);
      days = days % 360;
      
      var months = Math.floor(days / 30);
      days = days % 30

      if(years == 0 && months == 0 && days == 0) {
        return "0 days";
      }

      return (years!=0 ? years + (years==1 ? " year" : " years") : "")  
        + (years!=0 && months!=0 && days!=0 ? ", " : (years!=0 && months!=0 ? " and ": "")) // List commo and and
        + (months!=0 ? months + (months==1 ? " month" : " months") : "") 
        + (years!=0 && months!=0 && days!=0 ? ", and " : (days!=0 && (years!=0 || months!=0) ? " and ": "")) // List commo and and
        + (days!=0 ? days + (days==1 ? " day" : " days") : ""); 
    };
  });