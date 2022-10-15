function newElement() {
  var li = document.createElement("li");
document.getElementById("myUL").appendChild(li);

var i = document.createElement("i");
li.appendChild(i);
i.className="fa fa-dashboard";

// document.getElementById("myInput").value = "";

var span = document.createElement("span");
li.appendChild(span);
var inputValue = document.getElementById("myInput").value;
var t = document.createTextNode(inputValue);
span.appendChild(t);

var i2 = document.createElement("i");
li.appendChild(i2);
i2.className="fa fa-angle-left pull-right";

}
