var phone = document.getElementById('phone'),
	fullName = document.getElementById('name'),
	city = document.getElementById('city'),
	male = document.getElementById('male'),
	female = document.getElementById('female'),
	zodiacSign = document.getElementById('signs'),
	notes = document.getElementById('notes'),
	vphone = document.getElementById('vphone'),
	vfullName = document.getElementById('vname'),
	vcity = document.getElementById('vcity'),
	vgender = document.getElementById('vgender'),
	vsign = document.getElementById('vsign'),
	vnotes = document.getElementById('vnotes'),
	table = document.getElementById('phonebook'),
	text = document.getElementById('importContacts'),
	entry,
	validator = {
		validatePhone: function (str) {
			var i,
				len;

			if (str == null || str == '') {
				alert("Phone number must be filled out");
				return true;
			}

			if (str[0] !== '+' && str[0] !== '0') {
				alert('Phone number must start with 0 or +');
				return true;
			}

			if (str.length < 5 || str.length > 12) {
				alert('Phone number\'s length must be between 5 and 12');
				return true;
			}

			for (i = 1, len = str.length; i < len; i += 1) {
				if (isNaN(str[i] * 1)) {
					alert('Phone number must contain only digits');
					return true;
				}
			}
		},
		validateName: function (str) {
			if (str == null || str == '') {
				alert("Name must be filled out");
				return true;
			}

			if (str.length > 30) {
				alert('Name\'s length must be no longer than 30 letters');
				return true;
			}
		},
		validateCity: function (str) {
			if (str.length > 30) {
				alert('City\'s length must be no longer than 30 letters');
				return true;
			}
		},
		validateGender: function (male, female) {
			if (!male.checked && !female.checked) {
				alert('Please choose a gender');
				return true;
			}
		},
		validateNotes: function (str) {
			if (str.length > 500) {
				alert('Notes\'s length must be no longer than 500 symbols');
				return true;
			}
		}
	};

function isValidNum(num){
	if (num == undefined) {
		return false;
	}
	for(var key in localStorage){
		if (key === num + ''){
			return false;
		}
	}
	return true;
}

function id(){
	for (var i = 0; i < 10000; i += 1){
		if(isValidNum(i)){
			return i;
		}
	}
}

function checkForm() {

	var fieldsWithContent = '';

	if (validator.validatePhone(phone.value)) {
		return false;
	}
	if (validator.validateName(fullName.value)) {
		return false;
	}
	if (validator.validateCity(city.value)) {
		return false;
	}
	if (validator.validateGender(male, female)) {
		return false;
	}
	if (validator.validateNotes(notes.value)) {
		return false;
	} else {

		for (var key in localStorage) {
			var info = localStorage.getItem(key).split('\t');
			if (key !== 'cf' && info[0] === phone.value) {
				alert('Duplicate numbers are not allowed')
				return false;
			}
			if (key !== 'cf' && info[1] === fullName.value) {
				alert('Duplicate names are not allowed')
				return false;
			}
		}

		city.value === '' ? fieldsWithContent += 'f' : fieldsWithContent += 't';
		zodiacSign.value === '0' ? fieldsWithContent += 'f' : fieldsWithContent += 't';
		notes.value === '' ? fieldsWithContent += 'f' : fieldsWithContent += 't';

		entry = '' + phone.value + '\t' + fullName.value + '\t' + city.value + '\t' + (male.checked ? 'м' : 'ж') +
		'\t' + zodiacSign.value + '\t' + notes.value + '\t' + fieldsWithContent;
		
		if (localStorage.i === '') {
			localStorage.setItem(id() + '', entry);
		} else {
			localStorage.setItem(localStorage.i + '', entry);
		}

		return true;
	}
}

function createDeleteButton(id) {
	var deleteBtn = document.createElement('button');
	deleteBtn.setAttribute('class', 'deleteBtn');
	deleteBtn.setAttribute('id', id + '');
	deleteBtn.innerHTML = 'Delete';
	return deleteBtn;
}

function createViewButton(id) {
	var viewBtn = document.createElement('button');
	viewBtn.setAttribute('class', 'viewBtn');
	viewBtn.setAttribute('id', id + '');
	viewBtn.innerHTML = 'View';
	return viewBtn;
}

function createEditButton(id) {
	var editBtn = document.createElement('button');
	editBtn.setAttribute('class', 'editBtn');
	editBtn.setAttribute('id', id + '');
	editBtn.innerHTML = 'Edit';
	return editBtn;
}

function getInnerHtmlCodeForPhoneBookEntry(infoStr, id) {

	var result = '';
	var element;
	var deleteBtn = createDeleteButton(id);
	var viewBtn = createViewButton(id);
	var editBtn = createEditButton(id);
	var data = infoStr.split('\t');
	result += '<tr>'
	for (var i = 0; i < 4; i += 1) {
		element = '<td>' + data[i] + '</td>';
		result += element;
	}
	result += '<td>';
	result += viewBtn.outerHTML;
	result += editBtn.outerHTML;
	result += deleteBtn.outerHTML;
	result += '</td>';
	result += '</tr>';
	return result;
}

function updateTable() {
	localStorage.setItem('cf', '');
	localStorage.setItem('nf', '');
	localStorage.setItem('i', '');
	var result = '';
	var entry;
	for (var key in localStorage) {
		if (key !== 'cf' && key !== 'nf' && key !== 'i') {
			entry = getInnerHtmlCodeForPhoneBookEntry(localStorage.getItem(key + ''), key);
			result += entry;
		}
	}

	table.innerHTML += result;

	var buttons = document.getElementsByClassName("deleteBtn");
	var buttonsCount = buttons.length;
	for (var i = 0; i < buttonsCount; i += 1) {
		buttons[i].onclick = function () {
			if (confirm('Are you sure you want to delete this contact?')) {
				
				localStorage.removeItem(this.id + '');
				window.location = 'PhoneBook.html';
				return true
			} else {
				return false;
			}
		}
	}

	buttons = document.getElementsByClassName("viewBtn");
	buttonsCount = buttons.length;
	for (i = 0; i < buttonsCount; i += 1) {
		buttons[i].onclick = function () {
			var content = localStorage.getItem(this.id + '');
			localStorage.cf = content;
			localStorage.nf = 'true';
			localStorage.i = this.id + '';
			window.location = 'links/ViewContact.html';
			fillViewSheet(content);
		}
	}

	buttons = document.getElementsByClassName("editBtn");
	buttonsCount = buttons.length;
	for (i = 0; i < buttonsCount; i += 1) {
		buttons[i].onclick = function () {
			var content = localStorage.getItem(this.id + '');
			localStorage.cf = content;
			localStorage.nf = 'true';
			localStorage.i = this.id + '';
			localStorage.removeItem(this.id + '');
			window.location = 'links/AddContact.html';
			fillEditSheet(content);
		}
	}
}

function fillEditSheet(content) {

	content = content.split('\t');
	var fill = content[content.length - 1].split('');
	var index = 0;

	phone.value = content[index];
	index += 1;
	fullName.value = content[index];
	index += 1;
	if (fill[0] === 't') {
		city.value = content[index];
		
	}
	index += 1;
	content[index] === 'м' ? male.checked = true : female.checked = true;
	index += 1;
	if (fill[1] === 't') {
		zodiacSign.value = content[index];
		
	}
	index += 1;
	if (fill[2] === 't') {
		notes.value = content[index];
	}
}

function fillViewSheet(content) {
	content = content.split('\t');

	var fill = content[content.length - 1].split('');
	var index = 0;

	vphone.innerHTML = content[index];
	index += 1;
	vfullName.innerHTML = content[index];
	index += 1;
	if (fill[0] === 't') {
		vcity.innerHTML = content[index];
	}
	index += 1;
	vgender.innerHTML = content[index];
	index += 1;
	if (fill[1] === 't') {
		vsign.innerHTML = content[index];
	}
	
	index += 1;
	if (fill[2] === 't') {
		vnotes.innerHTML = content[index];
	}

}

function fill() {
	if (localStorage.nf === 'true') {
		fillEditSheet(localStorage.cf);
		document.getElementById('addContact').innerHTML = 'Edit Contact';
		document.getElementById('backBtn').outerHTML = '';
	}
}

function viewFill() {
	var id = localStorage.i;
	var delBtn = createDeleteButton(id);
	var edtBtn = createEditButton(id);
	if (localStorage.nf === 'true') {
		fillViewSheet(localStorage.cf);
		document.getElementById('viewSheetBtns').innerHTML += edtBtn.outerHTML;
		document.getElementById('viewSheetBtns').innerHTML += delBtn.outerHTML;
	}

	var buttons = document.getElementsByClassName("deleteBtn");
	var buttonsCount = buttons.length;
	for (var i = 0; i < buttonsCount; i += 1) {
		buttons[i].onclick = function () {
			if (confirm('Are you sure you want to delete this contact?')) {
				localStorage.removeItem(this.id + '');
				window.location = '../PhoneBook.html';
				return true
			} else {
				return false;
			}
		}
	}

	buttons = document.getElementsByClassName("editBtn");
	buttonsCount = buttons.length;
	for (i = 0; i < buttonsCount; i += 1) {
		buttons[i].onclick = function () {
			var content = localStorage.getItem(this.id + '');
			localStorage.cf = content;
			localStorage.nf = 'true';
			localStorage.i = this.id + '';
			localStorage.removeItem(this.id + '');
			window.location = 'AddContact.html';
			fillEditSheet(content);
		}
	}
}


function importD() {
	localStorage.setItem('cf', '');
	localStorage.setItem('nf', '');
	localStorage.setItem('i', '');
	var data = text.value.split('\n');
	for (var j in data) {
		createEntry(data[j]);
	}
	window.location = 'Adding.html';
}

function createEntry(entry) {
	var t = entry;
	var count = t.split('\t');

	t += '\tt';
	count[4] === '' ? t += 'f' : t += 't';
	count[5] === '' ? t += 'f' : t += 't';


	localStorage.setItem(id() + '', t);
}

var count = 3;
var redirect = '../PhoneBook.html'

function countDown() {
	if (count <= 0) {
		window.location = redirect;
	} else {
		count--;
		document.getElementById("timer").innerHTML = "This page will redirect in " + count + " seconds.";
		setTimeout("countDown()", 1000);
	}
}
