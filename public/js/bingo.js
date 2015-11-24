// CHANGE COURSE DEPENDING ON GREG HAY(INFO 340) OR ADAM MOORE(INFO 450)
var course = 450,
	entries;

if (course === 450) {
	// INFO 450 Adam Moore Entries
	$('.img-header').attr({'src': '/assets/am.png'});
	$('.chat-header').find('span').text('INFO 450');
	entries = ['Jeans and a sportcoat aka FREE SQUARE','"Commies"','"Nazis"','Uses "Nazis" and "Info Students" in the same sentence"','"My friend Mark the Commie"','"Back at Ohio state"','"Psycho-surgeon"','"Damnit Adam"','Uses "Locke" / "Lockean" twice in a sentence','Uses "Locke" / "Lockean" three times in a sentence','RHCP||Rush reference','"Slipping a mickey"','"Killing people for fun"','"Cook a case"','"Darn tootin"','"Droppin hundies"','"No harm no foul"','"Back at Ohio State..."','"My old professor..."',"Single Malt Scotch",'Talks about his commie friend a 2nd time','His accent comes out','Reference to something "before our generation"','Thumbs up','References wife and kids','Weed reference','Acid reference','Serial Killer reference (Ted Bundy)','Excessive hand gestures',"Swears and thinks he's awesome (first time)","Ridiculous thought experiment","Someone is theoretically forced to kill someone else",'"Period."','"Mundane"','HOCKEY HOCKEY HOCKEY','Tells us far too much about his life',"Rahvalrous","Something something Greeks something something",'Someone in the first 5 rows is visibly asleep','Slide that doesn\'t use transition effects circa 2008','Almost says something controversial about religion (1st time)','Almost says something controversial about religion (2nd time)','Almost says something controversial about religion (3rd time)','Bizarre text formatting on slide','Pronounces "e" as "a"','"My son\'s band"','"Card carrying commie"','Swears and thinks he\'s awesome (second time)','Swears and thinks he\'s awesome (third time)','Becomes clear he has no idea what hacking is','"Nahsty"','Left hand in pocket, right hand flailing','"5 minute break"... 10 minutes later...','"Access to your sexual history"','Doug says anything',"It becomes apparent he has no idea what programming is",'Mentions Jimi Hendrix'];
} else if (course === 340) {
	// INFO 340 Greg Hay Entries
	$('.img-header').attr({'src': '/assets/gh.png'});
	$('.chat-header').find('span').text('INFO 340');
	entries = ['YOU SHOWED UP TO CLASS! FREE!!!', '~"That was supposed to be funny, no one laughed"', '“I made this slidedeck last night”', 'Wearing an "Colourful" shirt', 'Rhetorical Question!', '~"You! Whatever your name is: I need to learn names"', 'Builds something in Microsoft MySQL (code)', 'Builds something in Microsoft MySQL (GUI)', '"I did not know how to code"', 'LIKE "%$140,000%"', '~"$40 an hour…"', 'Picks on iSchool', '"When I worked at Microsoft..."', 'Quotes Justin Bieber', '"We will be finished a bit early"', '"Unlike [Person in Class]…/Don’t be like []…"', 'Picks on Phill a 2nd time', 'Picks on Phill a 3rd time', 'Picks on Phill a 4th time', 'Picks on Phill a 5th time', '"Blah" as he enters the room', '"Blah" second time', '"Visio 08, not 13, it is crap"', '"Back in the day..."', '5 mins late', 'Spells something wrong, catches it', 'Spells something wrong, does not catch it', 'Says he is going to spell something wrong, spells it correctly', 'Builds something in Visio', '"I’ll cut to the chase"', 'Skips a break slide', '"If you can write a query you can get a job"', 'Brand new rant', '"Never say never"', '"I just needed a picture to go on this slide..."', 'Grumbles about lab section','Is 10 Mins late','Says "varchar" then chuckles','"Hundo"','Assures us that this will exciting soon','"AHA!"','Gets someones name wrong','"We are LEARNING today"','Talks about his house','"Humor me"','Begins sentence with "YO"','Fiddy','Assures us that it will all make sense soon','Assures us that we are the best section','"Back when I worked at Disney..."','Second new story of the day','Rhetorical "Whe cares?"','Extols virtues of Amazos','"That is a lousy question"','Picks on Phil the first time'];
}
	
/*
 * Creates the game grid with randomized tiles
 * Animates in chatbox and game board 
 * Animates out login el
 */ 
function playerSetup() {
	createGameGrid();
	$('.chat-container').addClass('slideIn');
	$('.chat-header').addClass('slideIn');
	$('.message-input').addClass('slideIn');
	$('.game-content').fadeIn('fast');
}

/*
 * Creates list of all tiles (admin view)
 * Animates in chatbox and admin tiles
 * Animates out login el
 */ 
function adminSetup() {
	// Create admin view of tiles
	// createAdminGrid();
	$('.chat-container').addClass('slideIn');
	$('.chat-header').addClass('slideIn');
	$('.message-input').addClass('slideIn');
	$('.game-content').fadeIn('fast');
}

/*
 * Creates randomized list of all tiles and assigns values
 */ 
function createGameGrid() {
	var $grid = $('.grid-container');
	var used = new Array();
	used.push(0);
	for(var i = 0; i < 5; i++) {
		var $row = $('<div>', { class: 'grid-row' });
		for(var j = 0; j < 5; j++) {
			var tileID = Math.round(Math.random() * (entries.length - 1));
			while(used.indexOf(tileID) != -1) { // forces non-identical tiles
				tileID = Math.round(Math.random() * (entries.length - 1)); 
			}
			used.push(tileID);
			// Construct divs that hold the tiles
			$cell = $('<div>', { class: 'grid-cell'});
			$data = $('<span>', {class: 'cell-data', text: entries[tileID] })
			$cell.click(function (){ // add click handler to update tile
				updateTile($(this));
			});
			$cell.data('tileID', tileID); // set data so it's easy to manipulate later
			if((i * 5 + j) === 12) { 
				$cell.addClass('selected'); // 'free' center tile auto-selected
				$data.text(entries[0]); 	// set center tile
			}
			$cell.append($data);
			$row.append($cell);
		}
		$grid.append($row);
	}
}

/*
 * Updates a tile and checks the board if any rows are complete
 */ 
function updateTile($elem) {
	if(!$elem.hasClass('selected')) {
		$elem.addClass('selected');
		// check their board to see if it completes anything
	} else {
		$elem.removeClass('selected');
	}
}