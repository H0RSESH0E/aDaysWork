console.log("I'm here");
var today = moment().format('LL');
console.log(today);
var dayBegin = 9;


let dt = moment();
dt. format("HH:mm") // 24 hour time.
dt. format("hh:mm a") // 12 hour time (with am/pm)
var activities = [];

var fillSlot = function(slotTime, slotText) {

    var slotLi = $("<li>")
        .addClass("time-block calendar-item");
    var slot = $("<span>")
        .addClass("col-1 hour")
        .text(slotTime);
    var activity = $("<p>")
        .addClass("col-10 description")
        .text(slotText);
    var btn = $("<button>")
        .addClass("col-1 bi bi-save2 saveBtn")
           
    slotLi.append(slot, activity, btn);

    $("#dailyActivityList")
        .append(slotLi);
}

var loadDailyActivityList = function() {

    activities = JSON.parse(localStorage.getItem("activities"));

    if (!activities) {
        activities = [];
        var tempArr = [];
        var timeString;
        var timeSlot;
        for (var i =0; i < 8; i++) {

            timeString = " " + (i + dayBegin) +":00"
            console.log(timeString);
            timeSlot = moment(today + timeString).format("hA");
           
            tempArr = [timeSlot,"Placeholders"];
            activities.push(tempArr);
        }
    }

    for (var i =0; i < 8; i++) {
        fillSlot(activities[i][0], activities[i][1])
    }

}

loadDailyActivityList();

console.log(activities);