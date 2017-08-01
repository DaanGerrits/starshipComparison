document.getElementById('compare').addEventListener('click',function(){
  run(gen)
    .catch(function(err){
      alert(err);
    });
})

function getHighest(val1, val2){
  if (val1.innerHTML > val2.innerHTML) {
    console.log(val1);
    val1.className = "highlight";
  }
  else if (val2.innerHTML > val1.innerHTML) {
    console.log(val2);
    val2.className = "highlight";
  } else if (val1.innerHTML == val2.innerHTML) {
    return;
  }
}

function removeHighlight(){
  [...document.getElementsByTagName("td")].forEach(function(el) {
    el.className = "";
  });
}

function run(genFunc){
  const genObject = genFunc();

  function iterate(iteration){
    if (iteration.done)
      return Promise.resolve(iteration.value);
    return Promise.resolve(iteration.value)
      .then(x => iterate(genObject.next(x)))
      .catch(x => iterate(genObject.throw(x)));
  }

  try {
    return iterate(genObject.next());
  } catch(ex) {
    return Promise.reject(ex);
  }
}

function *gen(){
  // check if input is valid
  if (document.getElementById("firstShip").value === document.getElementById("secondShip").value) {
    throw new Error("You cannot compare the same starships");
  }

  // get selected starships
  var starship1Select = document.getElementById("firstShip").value;
  var starship2Select = document.getElementById("secondShip").value;

  // fetch starship1
  var starship1Response = yield fetch("http://swapi.co/api/starships/" + starship1Select);
  var starship1 = yield starship1Response.json();

  // fetch starship2
  var starship2Response = yield fetch("http://swapi.co/api/starships/" + starship2Select);
  var starship2 = yield starship2Response.json();

  removeHighlight();

  // display starship info
  document.getElementById("name1").innerHTML = starship1.name;
  document.getElementById("name2").innerHTML = starship2.name;

  document.getElementById("cost1").innerHTML = starship1.cost_in_credits;
  document.getElementById("cost2").innerHTML = starship2.cost_in_credits;

  document.getElementById("speed1").innerHTML = starship1.max_atmosphering_speed;
  document.getElementById("speed2").innerHTML = starship2.max_atmosphering_speed;

  document.getElementById("cargo1").innerHTML = starship1.cargo_capacity;
  document.getElementById("cargo2").innerHTML = starship2.cargo_capacity;

  document.getElementById("passengers1").innerHTML = starship1.passengers;
  document.getElementById("passengers2").innerHTML = starship2.passengers;

  // highlight highest values
  getHighest(document.getElementById("cost1"), document.getElementById("cost2"));
  getHighest(document.getElementById("speed1"), document.getElementById("speed2"));
  getHighest(document.getElementById("cargo1"), document.getElementById("cargo2"));
  getHighest(document.getElementById("passengers1"), document.getElementById("passengers2"));

}
