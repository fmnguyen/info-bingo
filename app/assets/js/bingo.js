// CHANGE COURSE DEPENDING ON GREG HAY(INFO 340) OR ADAM MOORE(INFO 450)
var course = 450,
	rowSize = 5,
	entries,
	adminTiles,
	tiles;

if (course === 450) {
	// INFO 450 Adam Moore Entries
	$('.img-header').attr({'src': '../img/am.png'});
	$('.chat-header').find('span').text('INFO 450');
	entries = ['Jeans and a sportcoat aka FREE SQUARE','"Commies"','"Nazis"','Uses "Nazis" and "Info Students" in the same sentence"','"My friend Mark the Commie"','"Back at Ohio state"','"Psycho-surgeon"','"Damnit Adam"','Uses "Locke" / "Lockean" twice in a sentence','Uses "Locke" / "Lockean" three times in a sentence','RHCP||Rush reference','"Slipping a mickey"','"Killing people for fun"','"Cook a case"','"Darn tootin"','"Droppin hundies"','"No harm no foul"','"Back at Ohio State..."','"My old professor..."',"Single Malt Scotch",'Talks about his commie friend a 2nd time','His accent comes out','Reference to something "before our generation"','Thumbs up','References wife and kids','Weed reference','Acid reference','Serial Killer reference (Ted Bundy)','Excessive hand gestures',"Swears and thinks he's awesome (first time)","Ridiculous thought experiment","Someone is theoretically forced to kill someone else",'"Period."','"Mundane"','HOCKEY HOCKEY HOCKEY','Tells us far too much about his life',"Rahvalrous","Something something Greeks something something",'Someone in the first 5 rows is visibly asleep','Slide that doesn\'t use transition effects circa 2008','Almost says something controversial about religion (1st time)','Almost says something controversial about religion (2nd time)','Almost says something controversial about religion (3rd time)','Bizarre text formatting on slide','Pronounces "e" as "a"','"My son\'s band"','"Card carrying commie"','Swears and thinks he\'s awesome (second time)','Swears and thinks he\'s awesome (third time)','Becomes clear he has no idea what hacking is','"Nahsty"','Left hand in pocket, right hand flailing','"5 minute break"... 10 minutes later...','"Access to your sexual history"','Doug says anything',"It becomes apparent he has no idea what programming is",'Mentions Jimi Hendrix'];
} else if (course === 340) {
	// INFO 340 Greg Hay Entries
	$('.img-header').attr({'src': '../img/gh.png'});
	$('.chat-header').find('span').text('INFO 340');
	entries = ['YOU SHOWED UP TO CLASS! FREE!!!', '~"That was supposed to be funny, no one laughed"', '“I made this slidedeck last night”', 'Wearing an "Colourful" shirt', 'Rhetorical Question!', '~"You! Whatever your name is: I need to learn names"', 'Builds something in Microsoft MySQL (code)', 'Builds something in Microsoft MySQL (GUI)', '"I did not know how to code"', 'LIKE "%$140,000%"', '~"$40 an hour…"', 'Picks on iSchool', '"When I worked at Microsoft..."', 'Quotes Justin Bieber', '"We will be finished a bit early"', '"Unlike [Person in Class]…/Don’t be like []…"', 'Picks on Phill a 2nd time', 'Picks on Phill a 3rd time', 'Picks on Phill a 4th time', 'Picks on Phill a 5th time', '"Blah" as he enters the room', '"Blah" second time', '"Visio 08, not 13, it is crap"', '"Back in the day..."', '5 mins late', 'Spells something wrong, catches it', 'Spells something wrong, does not catch it', 'Says he is going to spell something wrong, spells it correctly', 'Builds something in Visio', '"I’ll cut to the chase"', 'Skips a break slide', '"If you can write a query you can get a job"', 'Brand new rant', '"Never say never"', '"I just needed a picture to go on this slide..."', 'Grumbles about lab section','Is 10 Mins late','Says "varchar" then chuckles','"Hundo"','Assures us that this will exciting soon','"AHA!"','Gets someones name wrong','"We are LEARNING today"','Talks about his house','"Humor me"','Begins sentence with "YO"','Fiddy','Assures us that it will all make sense soon','Assures us that we are the best section','"Back when I worked at Disney..."','Second new story of the day','Rhetorical "Who cares?"','Extols virtues of Amazos','"That is a lousy question"','Picks on Phil the first time'];
}	

/*
 * Creates the game grid with randomized tiles
 * Animates in chatbox and game board 
 * Animates out login el
 */ 
function playerSetup() {
	tiles = createGameGrid();
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
	adminTiles = createAdminGrid();
	$('.chat-container').addClass('slideIn');
	$('.chat-header').addClass('slideIn');
	$('.message-input').addClass('slideIn');
	$('.game-content').fadeIn('fast');
}

/*
 *
 * @returns array containing all tileID values of tiles
 * Creates randomized list of all tiles and assigns values
 */ 
function createGameGrid() {
	var $grid = $('.grid-container');
	var used = new Array();
	var numsUsed = new Array();
	numsUsed.push(0);
	used.push({'tileID': 0, 'selected': true });
	for(var i = 0; i < rowSize; i++) {
		var $row = $('<div>', { class: 'grid-row' });
		for(var j = 0; j < rowSize; j++) {
			var tileID = Math.round(Math.random() * (entries.length - 1));
			if((i * 5 + j) === Math.floor((rowSize * rowSize) / 2)) { 
				tileID = 0;
				used.splice(0, 1);
				used.push({'tileID': tileID, 'selected': true });
			} else {
				while(numsUsed.indexOf(tileID) != -1) { // forces non-identical tiles
					tileID = Math.round(Math.random() * (entries.length - 1)); 
				}
				used.push({'tileID': tileID, 'selected': false });
				numsUsed.push(tileID);
			}
			// Construct divs that hold the tiles
			$cell = $('<div>', { class: 'grid-cell'});
			$cell.data('tileIndex', (i * 5 + j)); // set data so it's easy to manipulate later
			if((i * 5 + j) === Math.floor((rowSize * rowSize) / 2)) { 
				$cell.addClass('selected'); // 'free' center tile auto-selected
			}
			$data = $('<span>', {class: 'cell-data', text: entries[tileID] })
			$cell.click(function (){ // add click handler to update tile
				updateTile($(this));
			});
			
			$cell.append($data);
			$row.append($cell);
		}
		$grid.append($row);
		
	}
	console.log(used);
	return used;
}

function createAdminGrid() {
	var adminRowLength = 8;
	var $grid = $('.admin-grid-container');
	var used = new Array();
	for(var i = 0; i < Math.floor(entries.length / adminRowLength); i++) {
		var $row = $('<div>', { class: 'admin-grid-row' });
		for(var j = 0; j < adminRowLength; j++) {
			used.push({ 'tileID': i * adminRowLength + j, 'selected': false });
			// Construct divs that hold the tiles
			$cell = $('<div>', { class: 'admin-grid-cell'});
			$data = $('<span>', {class: 'admin-cell-data', text: entries[i * adminRowLength + j] })
			$cell.click(function (){ // add click handler to update tile
				updateAdminTile($(this));
			});
			$cell.data('tileIndex', (i * adminRowLength + j));
			$cell.append($data);
			$row.append($cell);
		}
		$grid.append($row);
	}
	return used;
}

/*
 * Updates a tile and checks the board if any rows/columns/diagonals are complete
 */ 
function updateTile($elem) {
	if(!$elem.hasClass('selected')) {
		$elem.addClass('selected');
		tiles[$elem.data('tileIndex')].selected = true;
		checkAll($elem.data('tileIndex')); // check their board to see if it completes anything
	} else {
		$elem.removeClass('selected');
		tiles[$elem.data('tileIndex')].selected = false;
	}
}

/*
 * Updates a tile and checks the board if any rows/columns/diagonals are complete
 */ 
function updateAdminTile($elem) {
	if(!$elem.hasClass('selected')) {
		$elem.addClass('selected');
		adminTiles[$elem.data('tileIndex')].selected = true;
		socket.emit(Packet.ADMIN_VALID_TILE, { 
			addTile: true, 
			tileIndex: $elem.data('tileIndex') 
		});
	} else {
		$elem.removeClass('selected');
		adminTiles[$elem.data('tileIndex')].selected = false;
		socket.emit(Packet.ADMIN_VALID_TILE, {  // have to remove the tile from the master
			addTile: false, 
			tileIndex: $elem.data('tileIndex') 
		});
	}
}

function checkAll(index) {
	// if row returns false, check the columns
	var checkedTiles = (checkRow(index)) ? checkRow(index) : checkColumn(index);
	console.log('After rows: ' + checkedTiles);
	if(checkedTiles) {
		socket.emit(Packet.USER_CHECK_GAME, {'tiles': checkedTiles});
	} else { // neither rows or columns match, so check diagonals
		checkedTiles = (checkLeftDiagonal(index)) ? checkLeftDiagonal(index) : checkRightDiagonal(index);
		console.log('After diagonals: ' + checkedTiles);
		if(checkedTiles) {
			socket.emit(Packet.USER_CHECK_GAME, {'tiles': checkedTiles});
		} else {
			return; // none of the diagonals have 5 selected elements, so let's just return it
		}
	}
}

/*
 * @param index, INT of the index of the tile selected
 * @returns array containing tileIDs of selected tiles in the row
 * @returns boolean FALSE if any of the tiles in the row are not selected
 * Checks the row of elements given and returns array of ints representing tiles or false
 */ 
function checkRow(index) {
	var startIndex = Math.floor(index / rowSize) * rowSize;
	var selectedTiles = [];
	for (var i = 0; i < rowSize; i++) {
		if(!tiles[startIndex + i].selected) {
			return false;
		}
		selectedTiles.push(tiles[startIndex + i].tileID);
	}
	return selectedTiles; // user marked all of this row "selected"
}

/*
 * @param index, INT of the index of the tile selected
 * @returns array containing tileIDs of selected tiles in the column
 * @returns boolean FALSE if any of the tiles in the column are not selected
 * Checks the column of elements given and returns array of ints representing tiles or false
 */ 
function checkColumn(index) {
	var startIndex = index % rowSize;
	var selectedTiles = [];
	for (var i = 0; i < rowSize; i++) {
		if(!tiles[startIndex + (i * rowSize)].selected) {
			return false;
		}
		selectedTiles.push(tiles[startIndex + (i * rowSize)].tileID);
	}
	return selectedTiles;
}

/*
 * @param index, INT of the index of the tile selected
 * @returns array containing tileIDs of selected tiles in the diagonal
 * @returns boolean FALSE if any of the tiles in the diagaonal are not selected
 * Checks the top left corner to bottom right corner diagonal and returns array of ints representing tiles or false
 */ 
function checkLeftDiagonal(index) {
	var startIndex = 0;
	var selectedTiles = [];
	for (var i = 0; i < rowSize; i++) {
		if(!tiles[startIndex + (i * rowSize) + i].selected) {
			return false;
		}
		selectedTiles.push(tiles[startIndex + (i * rowSize) + i].tileID);
	}
	return selectedTiles;
}

/*
 * @param index, INT of the index of the tile selected
 * @returns array containing tileIDs of selected tiles in the diagonal
 * @returns boolean FALSE if any of the tiles in the diagaonal are not selected
 * Checks the top right corner to bottom left corner diagonal and returns array of ints representing tiles or false
 */ 
function checkRightDiagonal(index) {
	var startIndex = rowSize - 1;
	var selectedTiles = [];
	for (var i = 0; i < rowSize; i++) {
		if(!tiles[startIndex + (i * rowSize) - i].selected) {
			return false;
		}
		selectedTiles.push(tiles[startIndex + (i * rowSize) - i].tileID);
	}
	return selectedTiles;
}