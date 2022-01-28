var today = moment().format('LL');
var dayBegin = 9;
var hoursInTheDay = 8;
var classesInNOut;
var lastContent;
var activities = [];
var initialLoad = true;
var countDownToStyleChecks = (60 - moment().minutes());
console.log(countDownToStyleChecks)


var fillSlot = function(slotTime, slotText) {
    
    var timeStyle = styleOnTime(slotTime);

    var slotLi = $("<li>")
        .addClass("row");
    var slot = $("<span>")
        .addClass("col-2 col-sm-1 hour")
        .text(slotTime);
    var activity = $("<p>")
        .addClass("col-8 col-sm-10 description" + " " + timeStyle)
        .text(slotText);
    var btn = $("<button>")
        .addClass("col-2 col-sm-1 bi bi-save2 saveBtn")

    

    slotLi.append(slot, activity, btn);

    $("#dailyActivityList")
        .append(slotLi);
}

var styleOnTime = function (slotTime) {
 console.log("running style check");
    var timeToCheck = moment(slotTime, "hA");
    
    if (moment().isSame(timeToCheck, "h")) {
        return "present";
    }
    else if (moment().isAfter(timeToCheck, "h")) {
        return "past";
    }
    else {
        return "future";
    }

}

var loadDailyActivityList = function() {

    activities = JSON.parse(localStorage.getItem("activities"));
if (initialLoad) {
    if (!activities) {
        activities = [];
        var tempArr = [];
        var timeString;
        var timeSlot;
        for (var i =0; i < hoursInTheDay; i++) {

            timeString = " " + (i + dayBegin) +":00"
            console.log(timeString);
            timeSlot = moment(today + timeString).format("hA");
           
            tempArr = [timeSlot,""];
            activities.push(tempArr);
        }
        localStorage.setItem("activities", JSON.stringify(activities));
    }

    for (var i =0; i < hoursInTheDay; i++) {
        fillSlot(activities[i][0], activities[i][1])
    }
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

        // change the style of the button to highlight color
    $(this).siblings(".saveBtn").addClass("not-saved");
    classesInNOut = $(this).attr('class');
    var text = $(this)
      .text()
      .trim();
  
    lastContent = text;

    var timeStyle = styleOnTime($(this).siblings(".hour").text());

    var textInput = $("<textarea>").addClass("textarea col-10 " + timeStyle).val(text);
    $(this).replaceWith(textInput);
  
    textInput.trigger("focus");
    console.log($(this));
});

$("ul").on("click", "button", function() {

    var index = $(this)
      .closest("li")
      .index();
      console.log(index," KAY");

    saveListItem(index);
    $(this).removeClass("not-saved")
});

$("ul").on("blur", "textarea", function() {

    var text = $(this).val();
  
    if (text === lastContent) {
        
        $(this).siblings(".saveBtn").removeClass("not-saved")
    }   // if didn't change take highlight off save button



    var index = $(this)
      .closest("li")
      .index();
  
    activities[index][1] = text;
  
    var activity = $("<p>")
        .addClass(classesInNOut)
        .text(text);
        
    styleOnTime($(activity).closest(".hour"));
    $(this).replaceWith(activity);

    
    
});

// $("ul").on("keydown", "textarea", function() {

//     if ()
//     var text = $(this).val();
  
//     if (text === lastContent) {
        
//         $(this).siblings(".saveBtn").removeClass("not-saved")
//     }   // if didn't change take highlight off save button



//     var index = $(this)
//       .closest("li")
//       .index();
  
//     activities[index][1] = text;
  
//     var activity = $("<p>")
//         .addClass(classesInNOut)
//         .text(text);
        
//     styleOnTime($(activity).closest(".hour"));
//     $(this).replaceWith(activity);



// });

var userSubmitResponseHandler = function (event) {

    if (event.keyCode === 13 ) {
        lastPlayer = document.querySelector("input").value.toUpperCase();
        console.log(lastPlayer);
        var newRecordArray = [lastPlayer, userScore];
    }
}

var hourlyStyleUpdate = function( ){
    var currentHourStringToCheck = moment().format("hA");
    var lastHourStringToCheck = moment().subtract(1, "hours").format("hA");

    console.log(currentHourStringToCheck);
    console.log(lastHourStringToCheck);

    console.log($("ul, li, span:contains(" + currentHourStringToCheck + ")").siblings("p").addClass("present"));
    console.log($("ul, li, span:contains(" + currentHourStringToCheck + ")").siblings("p").removeClass("future"));
    console.log($("ul, li, span:contains(" + lastHourStringToCheck + ")").siblings("p").addClass("past"));
    console.log($("ul, li, span:contains(" + lastHourStringToCheck + ")").siblings("p").removeClass("present"));
}


$("#currentDay").append(" " + today);
loadDailyActivityList();


// addEventListener("keydown", userSubmitResponseHandler);
console.log($("li"));
// setCountdown(hourlyStyleUpdate, countDownToStyleChecks*60*1000)

hourlyStyleUpdate();