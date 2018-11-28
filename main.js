$(document).ready(function() {


	// GET requests to Taco API, one per category
	$.get("https://tacos-ocecwkpxeq.now.sh/shells", function(data) {

		//for each option in each category add an entry with the option's name to the appropriate list
		for (var i in data) {
			$("#shell").append('<button type="button" class="list-group-item list-group-item-action" data-type="shell">' + data[i].name + '</button>');	
		};

		//bind click listener to each option in category
		$("[data-type=shell").click(makeActive);
	});

	//repeat for the other four categories
	$.get("https://tacos-ocecwkpxeq.now.sh/baseLayers", function(data) {
		for (var i in data) {
			$("#bases").append('<button type="button" class="list-group-item list-group-item-action" data-type="bases">' + data[i].name + '</button>');	
		};
		$("[data-type=bases").click(makeActive);
	});

	$.get("https://tacos-ocecwkpxeq.now.sh/mixins", function(data) {
		for (var i in data) {
			$("#mixins").append('<button type="button" class="list-group-item list-group-item-action" data-type="mixins">' + data[i].name + '</button>');	
		};
		$("[data-type=mixins").click(makeActive);
	});

	$.get("https://tacos-ocecwkpxeq.now.sh/condiments", function(data) {
		for (var i in data) {
			$("#condiments").append('<button type="button" class="list-group-item list-group-item-action" data-type="condiments">' + data[i].name + '</button>');	
		};
		$("[data-type=condiments").click(makeActive);
	});

	$.get("https://tacos-ocecwkpxeq.now.sh/seasonings", function(data) {
		for (var i in data) {
			$("#seasonings").append('<button type="button" class="list-group-item list-group-item-action" data-type="seasonings">' + data[i].name + '</button>');	
		};
		$("[data-type=seasonings").click(makeActive);
	});

	//bind submit listener to order button
	$("#order").submit(function(event) {
		addOrder();
		clearOrder();
		$(document).scrollTop($("#orders").offset().top);
		event.preventDefault();
	});

	$("#surprise").click(function(event) {
		clearOrder();

		//get each category and select random ingredients
		$("[data-max]").each(function() {
			randomIngredients($(this).attr('id'));
		});

		//prevent automatic ordering of random taco. TOOOOOO adventerous...
		event.preventDefault();
	});

	//bind click listener for individual order remove
	$(document).on('click', '.remove', function() {
	    $(this).parent().remove();
	});

	//bind click listener for removeAll order remove
	$(document).on('click', '#removeAll', function() {
	    $(".order").remove();
	});
	
});


//toggles selection of given option if number selected is under the max allowed for that category, otherwise displays modal
function makeActive() {
	var type = $(this).data("type");
	var max = $("#"+type).data("max");
	if ($(this).hasClass("active")) {
		$(this).removeClass("active");
	} else if (max >= 0 && $("[data-type="+type+"].active").length >= max) {
		$(".modal-body").html("Please choose at most "+max+" "+type+".");
		$("#errorModal").modal();
	} else {
		$(this).addClass("active");
	}
}

//return selected ingredients of category == type, formatted to be human readable
function getIngredients(type) {
	var ingredients = "";
	var $ordered = $("[data-type="+type+"].active");
	$ordered.each(function(i) {
		if (i > 0 && i == $ordered.length-1){
			ingredients = ingredients + " and ";
		} 
		else if (i > 0) {
			ingredients = ingredients + ", ";
		}
		ingredients = ingredients + $(this).text();
	});
	return ingredients;
}

//select (mark as active) between 1 and MAX random ingredients of category == type
function randomIngredients(type) {
	var possibilities = $("[data-type="+type+"]");
	var max = $("#"+type).data("max");

	//if max < 0, infinite options allowed from that category, so we'll give them two.
	max = (max > 0 ? max : 2);

	for (var i = 0; i < Math.ceil(Math.random()*max); i++) {
		$(possibilities[Math.floor(Math.random()*possibilities.length)]).addClass("active");
	}
}

//make a delicious sounding string and append it to the orders table, with its own delete button
function addOrder() {
	var order = "Two "+getIngredients("shell")+" piled high with "+getIngredients("bases")+" tossed with "+getIngredients("seasonings")+" covered in "+getIngredients("mixins")+" and slathered with "+getIngredients("condiments")+"!";
	$("#orders").append('<li class="list-group-item order">'+order+'<button type="button" class="close remove text-danger" aria-label="Remove">&times;</button></li>');
}

//clear all orders from the orders table
function clearOrder() {
	$(".active").removeClass("active");
}






