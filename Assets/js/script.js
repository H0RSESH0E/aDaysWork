// Gets the current day for main display
var today = moment().format('LL');
// allows customization of the start of the work day
var dayBegin = 9;
// allows customization of the length of the work day
var hoursInTheDay = 8;
// provides for persistence of class information durring element replacements
var classesInNOut;
// provides comparison for judgement of the need to save
var lastContent;
// creates a globally accesible array to manipulate the schedule
var activities = [];
// provides a temporal reference point to begin automatic hourly style updates
var countDownToStyleChecks = (60 - moment().minutes()) * 60 * 1000;


// Populate the <ul> with <li>s containing content from local storage
var loadDailyActivityList = function() {

    // get data from local storage
    activities = JSON.parse(localStorage.getItem("activities"));

    // populate an array with only time values and place it in local storage
    if (!activities) {
        activities = [];
        var tempArr = [];
        var timeString;
        var timeSlot;
        for (var i =0; i < hoursInTheDay; i++) {

            timeString = " " + (i + dayBegin) +":00"
            timeSlot = moment(today + timeString).format("hA");
           
            tempArr = [timeSlot,""];
            activities.push(tempArr);
        }
        localStorage.setItem("activities", JSON.stringify(activities));
    }

    // pass each sub array's contents to the element creation function "fillSlot"
    for (var i = 0; i < hoursInTheDay; i++) {
        fillSlot(activities[i][0], activities[i][1])
    }
}

// create and append each list item and its' contents when passed the times and contents by the loadDailyActivityList () function
var fillSlot = function(slotTime, slotText) {
    
    // Create a list item, span element, paragraph element and button with attirbutes and styles
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

    // append the <span>, <p> and <button> to the <li>
    slotLi.append(slot, activity, btn);

    // append the <li> to the <ul>
    $("#dailyActivityList")
        .append(slotLi);
}

// return the timeStyle variable to the fillSlot() function to add as a CSS style while the <ul> is being populated
var styleOnTime = function (slotTime) {
 
    // convert the slotTime string into a moment()js array 
    var timeToCheck = moment(slotTime, "hA");

    // compare the timeToCheck moment()js array with the current hour and return the appropriate style
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

// replaces the appropriate sub array in the activities array and then stores the whole array in local storage
var saveListItem = function (index) {

    var tempArr = JSON.parse(localStorage.getItem("activities"));
    tempArr.splice(index,1,activities[index]);
    localStorage.setItem("activities", JSON.stringify(tempArr));
}

// stores current time and last hour times as strings, searches for them in the list items and restyles the paragraphs and text areas accordingly
var hourlyStyleUpdate = function( ){

    var currentHourStringToCheck = moment().format("hA");
    var lastHourStringToCheck = moment().subtract(1, "hours").format("hA");

    $("ul, li, span:contains(" + currentHourStringToCheck + ")").siblings("p").addClass("present");
    $("ul, li, span:contains(" + currentHourStringToCheck + ")").siblings("p").removeClass("future");
    $("ul, li, span:contains(" + currentHourStringToCheck + ")").siblings("p").removeClass("past");
    $("ul, li, span:contains(" + lastHourStringToCheck + ")").siblings("p").addClass("past");
    $("ul, li, span:contains(" + lastHourStringToCheck + ")").siblings("p").removeClass("present");
}

// Aplication START //

// Displays the current date
$("#currentDay").append(" " + today);

// loads any saved calendar items
loadDailyActivityList();

// updates the styling at the next hour and every subsequent hour on the hour
setTimeout(function() {
    hourlyStyleUpdate();
    setInterval(hourlyStyleUpdate(),60*60*1000);
}, countDownToStyleChecks);

// listen for user interaction with any paragraph within the <ul>
$("ul").on("click", "p", function() {

    // changes the style of the button to highlight unsaved state
    $(this).siblings(".saveBtn").addClass("not-saved");

    // saves the classes of the paragraph to apply to the textarea
    classesInNOut = $(this).attr('class');
    
    // saves the text of the paragraph to insert in the textarea
    var text = $(this)
      .text()
      .trim();
  
    // records the initial state of the text before editing began
    lastContent = text;

    // gets the styling appropriate for the time of day
    var timeStyle = styleOnTime($(this).siblings(".hour").text());

    // stores the new element with its attributes and text to be swapped with the paragraph it will replace
    var textInput = $("<textarea>").addClass("textarea col-10 " + timeStyle).val(text);

    // replaces the existing <p> with the new <textarea>
    $(this).replaceWith(textInput);
  
    // places the cursor for editing into the text area
    textInput.trigger("focus");

});


// listens for user clicks of the save button, saves the information for a particular timeblock and adjust the styling to provide feedback
$("ul").on("click", "button", function() {

    // captures the index number associated with the li element the button is in
    var index = $(this)
      .closest("li")
      .index();

    // adds only the content of the list item to the array saved in local storage
    saveListItem(index);

    // changes the color and animation characteristics of the button to indicate the state of the input
    $(this).removeClass("not-saved")
});


// stops editing the text of a particular timeblock
$("ul").on("blur", "textarea", function() {

    // stores the text of the textarea for insertion into the <p> that will be created and appended
    var text = $(this).val();
  
    // checks for any content change and finding none returns the save button to it's "saved" sppearance
    if (text === lastContent) {
        $(this).siblings(".saveBtn").removeClass("not-saved")
    }   

    // gets the location in the array where the text from the textarea should be kept
    var index = $(this)
      .closest("li")
      .index();
  
    // stores the text in the array in the appropriate position
    activities[index][1] = text;
  
    // creates a <p> with the same class as it's predecessor and the text value the same as the textarea 
    var activity = $("<p>")
        .addClass(classesInNOut)
        .text(text);
        
    // replaces the editable textarea with a <p>
    $(this).replaceWith(activity);

});