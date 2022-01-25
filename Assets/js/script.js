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

var saveListItem = function (index) {
    console.log(index," here we goooooooO!");
    console.log(activities);
    var tempArr = JSON.parse(localStorage.getItem("activities"));
    console.log(tempArr);
    tempArr.splice(index,1,activities[index]);
    console.log(activities);

    localStorage.setItem("activities", JSON.stringify(tempArr));
    
}

$("ul").on("click", "p", function() {

    var text = $(this)
      .text()
      .trim();
  
    var textInput = $("<textarea>").addClass("textarea col-10").val(text);
    $(this).replaceWith(textInput);
  
    textInput.trigger("focus");
    console.log($(this));
});

$("ul").on("click", "button", function() {

    var index = $(this)
      .closest("li")
      .index();
      console.log(index," KAY")

    saveListItem(index);
});

$("ul").on("blur", "textarea", function() {
    // get current value of textarea
    var text = $(this).val();
  
    // get status type and position in the list
    var index = $(this)
      .closest("li")
      .index();
  
    // update task in array 
    activities[index][1] = text;
  
    var activity = $("<p>")
        .addClass("col-10 description")
        .text(text);
  
    // replace textarea with new content
    $(this).replaceWith(activity);
});




loadDailyActivityList();

console.log(activities);