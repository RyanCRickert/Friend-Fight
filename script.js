$(function () {
	$("#navbarToggle").blur(function (event) {
			var screenWidth = window.innerWidth;
			if (screenWidth < 768) {
				$("#collapsable-nav").collapse('hide');
			}
		});
});

$(document).ready(function () {
	$('#fightbutton').click(function () {
		battleRound();
	});
	$('#resetbutton').click(function () {
		clearScore();
	});
});


var Random = function (min, max) {
	if(arguments.length === 0) {
		return Math.random();
	}
	if(arguments.length === 1) {
		return Math.random() * arguments[0];
	}
	return Math.random() * (max-min) + min;
}

var Character = function(name, strength, dexterity, intelligence, vitality, agility) {
	this.name = name;
	this.strength = strength;
	this.dexterity = dexterity;
	this.intelligence = intelligence;
	this.vitality = vitality;
	this.agility = agility;
}
/*Variable declaration area*/
var missChance = 0.3;
var hitHandicap = 0.003;
var dodgeHandicap = 0.003;
var intDodgeHandicap = dodgeHandicap / 3;
var critChance = 0.2;
var critHandicapDex = 0.002;
var critHandicapInt = critHandicapDex * 0.25;

var combat = false; /*Set so that combat doesn't initiate on load*/

var character1Wins = 0;
var character2Wins = 0;


var battleRound = function () {

	var char1Name = $("#character1Name").val();
	var char2Name = $("#character2Name").val();
	/*Check to make sure name doesn't display empty*/
	if (char1Name == "") {
		char1Name = "Unknown Warrior #1";
	}
	if (char2Name == "") {
		char2Name = "Unknown Warrior #2";
	}

	var numberOfBattles = $("#numberOfRoundsInput").val();

	$("#battlearea").empty(); /*Clears out the Div*/

	for (var i = 0; i < numberOfBattles; i++) {

	var character1 = new Character(char1Name,parseInt($("#char1Str").val(), 10),parseInt($("#char1Dex").val(), 10),parseInt($("#char1Int").val(), 10),parseInt($("#char1Vit").val(), 10),parseInt($("#char1Agi").val(), 10));
	var character2 = new Character(char2Name,parseInt($("#char2Str").val(), 10),parseInt($("#char2Dex").val(), 10),parseInt($("#char2Int").val(), 10),parseInt($("#char2Vit").val(), 10),parseInt($("#char2Agi").val(), 10));

	var combat = true;
	var character1Health = character1.vitality * 5;
	var character2Health = character2.vitality * 5;
	var character1CritMult = 1.4;
	var character2CritMult = 1.4;
	var character1FirstStrikeChance = character1.agility / 50;
	var character2FirstStrikeChance = character2.agility / 50;

	/*This Section Prevents an infinte loop of dodges*/
	var character1DodgeChance = ((character1.agility * dodgeHandicap) + (character1.intelligence * (intDodgeHandicap)));
	var character2DodgeChance = ((character2.agility * dodgeHandicap) + (character2.intelligence * (intDodgeHandicap)));

	if(character1DodgeChance > 0.95) {
		var character1DodgeChance = 0.95;
	}
	if(character2DodgeChance > 0.95) {
		var character2DodgeChance = 0.95;
	}


	var character1Attack = function() {

		var character1Damage = Math.round((character1.strength *Random(0.8,1)) + ( character1.strength / 5 * Random()));
		var character1Crit = Math.round(character1Damage * character1CritMult);

   		if ((Random()+(character1.dexterity*hitHandicap)) < missChance) {
    		$('<div>' + character1.name + " missed!" + '</div>').appendTo('#battlearea');
        	} else {
        		if (character2DodgeChance > Random()) {
        		    $('<div class="dodge">' + character2.name + " dodges " + character1.name + "'s attack!" + '</div>').appendTo('#battlearea');
        		} else {
        			if ((Random()+(character1.dexterity*critHandicapDex) + (character1.intelligence * critHandicapInt)) < critChance) {
        				$('<div class="critical animated infinite flash">' + character1.name + " critically hits " + character2.name + ' for ' + character1Crit +  '</div>').appendTo('#battlearea');
        				character2Health -= character1Crit;
        			} else {
        			$('<div>' + character1.name + " deals " + character1Damage + " damage to " + character2.name + '</div>').appendTo('#battlearea');
            		character2Health -= character1Damage;
        		}
        	}
    		}
	} /*End of character 1 attack*/

	var character2AttacK = function() {

		var character2Damage = Math.round((character2.strength *Random(0.8,1)) + ( character2.strength / 5 * Random()));
		var character2Crit = Math.round(character2Damage * character2CritMult);

   		if ((Random()+(character2.dexterity*hitHandicap)) < missChance) {
    		$('<div>' + character2.name + " missed!" + '</div>').appendTo('#battlearea');
        	} else {
        		if (character1DodgeChance > Random()) {
        		    $('<div class="dodge">' + character1.name + " dodges " + character2.name + "'s attack!" + '</div>').appendTo('#battlearea');
        		} else {
        			if ((Random()+(character2.dexterity*critHandicapDex) + (character2.intelligence * critHandicapInt)) < critChance) {
        				$('<div class="critical animated infinite flash">' + character2.name + " critically hits " + character1.name + ' for ' + character2Crit + '</div>').appendTo('#battlearea');
        				character1Health -= character2Crit;
        			} else {
        			$('<div>' + character2.name + " deals " + character2Damage + " damage to " + character1.name + '</div>').appendTo('#battlearea');
            		character1Health -= character2Damage;
			    }
			}
			}
	} /*End of character 2 attack*/

	var character1FirstStrike = function() {

		var character1Damage = Math.round((character1.strength * Random(0.8,1)) + ( character1.strength / 5 * Random()));
		var character1Crit = Math.round(character1Damage * character1CritMult);

   		if ((Random()+(character1.dexterity*critHandicapDex) + (character1.intelligence * critHandicapInt)) < critChance) {
    			$('<div class="critical animated infinite flash">' + character1.name + " preemptively criticals " + character2.name + ' for ' + character1Crit + '</div>').appendTo('#battlearea');
    			character2Health -= character1Crit;
        } else {
        		$('<div>' + character1.name + " preemptively strikes " + character2.name + ' for ' + character1Damage + '</div>').appendTo('#battlearea');
        		character2Health -= character1Damage;
    	}
	} /*End of first strike*/

	var character2FirstStrike = function() {

		var character2Damage = Math.round((character2.strength *Random(0.8,1)) + ( character2.strength / 5 * Random()));
		var character2Crit = Math.round(character2Damage * character2CritMult);

   		if ((Random()+(character2.dexterity*critHandicapDex) + (character2.intelligence * critHandicapInt)) < critChance) {
    			$('<div class="critical animated infinite flash">' + character2.name + " preemptively criticals " + character1.name + ' for ' + character2Crit + '</div>').appendTo('#battlearea');
    			character1Health -= character2Crit;
        } else {
        		$('<div>' + character2.name + " preemptively strikes " + character1.name + ' for ' + character2Damage + '</div>').appendTo('#battlearea');
        		character1Health -= character2Damage;
    	}
	} /*End of first strike*/

	while (combat) {
		var character1FS = character1FirstStrikeChance * Random();
		var character2FS = character2FirstStrikeChance * Random();

		/******Health calculation at the end of a combat round******/
		var healthCheck = function() {
		    if(character1Health <= 0 && character2Health <= 0) {
		    	$('<div>' + '<strong>' +  "Double knockout, its a tie!" + '</strong>' + '</div>' + '<br>').appendTo('#battlearea');
		        	combat=false;
			} else if(character1Health <= 0) {
		    	$('<div>' + '<strong>' + character2.name + " has won!" + '</strong>' + '</div>' + '<br>').appendTo('#battlearea');
		    		character2Wins++
		        	combat=false;
			} else if(character2Health <= 0) {
		    	$('<div>' + '<strong>' + character1.name + " has won!" + '</strong>' + '</div>' + '<br>').appendTo('#battlearea');
		    		character1Wins++
		        	combat=false;
			}
		}

		if (character1FS > character2FS && (character1FS - character2FS > 0.6)) {
			character1FirstStrike();
			healthCheck();
		} else if (character2FS > character1FS && (character2FS - character1FS > 0.6)) {
			character2FirstStrike();
			healthCheck();
		} else {
			character1Attack();
    		character2AttacK();
    		healthCheck();
    	}

	} /*End of combat round*/
} /*End of battle number for loop*/
$("#character1score").html(character1Wins);
$("#character2score").html(character2Wins);
} /*End of battleround function*/
var clearScore = function() {
	character1Wins = 0;
	character2Wins = 0;
	$("#character1score").html("0");
	$("#character2score").html("0");
}