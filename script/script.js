var phone,
	fullName,
	city,
	male,
	female,
	zodiacSign,
	notes,
	table,
	text,
	entry,
	validator = {
		validatePhone: function (str) {
			var i,
				len,
				trimedStr = str.trim();

			if (str == null || str == '') {
				alert("Phone number must be filled out");
				return true;
			}

			if (str[0] !== '+' && str[0] !== '0') {
				alert('Phone number must start with 0 or +');
				return true;
			}

			if (trimedStr.length < 5 || trimedStr.length > 12) {
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

function add(){
	var counter = 0;
    function plus() {counter += 1;}
    plus();
    return counter;
}

function checkForm() {

	var fieldsWithContent = '';

	phone = document.getElementById('phone');
	fullName = document.getElementById('name');
	city = document.getElementById('city');
	male = document.getElementById('male');
	female = document.getElementById('female');
	zodiacSign = document.getElementById('signs');
	notes = document.getElementById('notes');

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
			if (key !== 'cf' && info[0] === phone.value.trim()) {
				alert('Duplicate numbers are not allowed')
				return false;
			}
			if (key !== 'cf' && info[1] === fullName.value.trim()) {
				alert('Duplicate names are not allowed')
				return false;
			}
		}

		city.value === '' ? fieldsWithContent += 'f' : fieldsWithContent += 't';
		zodiacSign.value === '0' ? fieldsWithContent += 'f' : fieldsWithContent += 't';
		notes.value === '' ? fieldsWithContent += 'f' : fieldsWithContent += 't';

		entry = '' + phone.value.trim() + '\t' + fullName.value.trim() + '\t' + city.value + '\t' + (male.checked ? 'м' : 'ж') +
		'\t' + zodiacSign.value + '\t' + notes.value + '\t' + fieldsWithContent;

		if (localStorage.i === '') {
			localStorage.setItem(phone.value + '', entry);
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
	table = document.getElementById('phonebook');
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

	phone = document.getElementById('phone');
	fullName = document.getElementById('name');
	city = document.getElementById('city');
	male = document.getElementById('male');
	female = document.getElementById('female');
	zodiacSign = document.getElementById('signs');
	notes = document.getElementById('notes');

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
	phone = document.getElementById('vphone'),
	fullName = document.getElementById('vname'),
	city = document.getElementById('vcity'),
	gender = document.getElementById('vgender'),
	sign = document.getElementById('vsign'),
	notes = document.getElementById('vnotes'),

	content = content.split('\t');

	var fill = content[content.length - 1].split('');
	var index = 0;

	phone.innerHTML = content[index];
	index += 1;
	fullName.innerHTML = content[index];
	index += 1;
	if (fill[0] === 't') {
		city.innerHTML = content[index];
	}
	index += 1;
	gender.innerHTML = content[index];
	index += 1;
	if (fill[1] === 't') {
		sign.innerHTML = content[index];
	}

	index += 1;
	if (fill[2] === 't') {
		notes.innerHTML = content[index];
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
	text = document.getElementById('importContacts')
	localStorage.setItem('cf', '');
	localStorage.setItem('nf', '');
	localStorage.setItem('i', '');
	var data = text.value.split('\n');

	for (var i = 0; i < data.length; i++) {
		if (data[i] === '') {
			alert('Empty entries are not allowed');
			return false;
		}
	}
	for (var j in data) {
		createEntry(data[j]);
	}

}

function createEntry(entry) {

	var text = entry;
	var elements = text.split('\t');
	editedEntry = '';

	if (elements.length < 3) {
		alert('Phone number, name and gender are requiered!')
		return false;
	}

	if (validator.validatePhone(elements[0])) {
		return false;
	}
	if (validator.validateName(elements[1])) {
		return false;
	}

	for (var key in localStorage) {
		var info = localStorage.getItem(key).split('\t');
		if (key !== 'cf' && info[0] === elements[0]) {
			alert('Duplicate numbers are not allowed')
			return false;
		}
		if (key !== 'cf' && info[1] === elements[1]) {
			alert('Duplicate names are not allowed')
			return false;
		}
	}

	editedEntry += elements[0] + '\t';
	editedEntry += elements[1] + '\t';

	if (elements[2] === 'м' || elements[2] === 'ж') {
		editedEntry += '' + '\t';
		editedEntry +=  elements[2] + '\t';

		if (elements[3] === 'Овен' || elements[3] === 'Телец' ||
			elements[3] === 'Близнаци' || elements[3] === 'Рак' ||
			elements[3] === 'Лъв' || elements[3] === 'Дева' ||
			elements[3] === 'Везни' || elements[3] === 'Скорпион' ||
			elements[3] === 'Стрелец' || elements[3] === 'Козирог' ||
			elements[3] === 'Водолей' || elements[3] === 'Риби') {
			editedEntry += elements[3];
			editedEntry += '\t'
		} else {
			editedEntry += '0';
			editedEntry += '\t';
			if (elements[3] !== undefined) {
				editedEntry += elements[3];
			} else {
				editedEntry += '';
			}
		}

		if (elements[4] === undefined) {
			editedEntry += '';
		} else {
			editedEntry += elements[4];
		}

	} else {
		if (validator.validateCity(elements[2])) {
			return false;
		}
		editedEntry += elements[2] + '\t';
		if (elements[3] !== 'м' && elements[3] !== 'ж') {
			alert('You must enter a gender(м or ж)!');
			return false;
		} else {
			editedEntry += elements[3];
			editedEntry += '\t';
		}
		if (elements[4] === 'Овен' || elements[4] === 'Телец' ||
			elements[4] === 'Близнаци' || elements[4] === 'Рак' ||
			elements[4] === 'Лъв' || elements[4] === 'Дева' ||
			elements[4] === 'Везни' || elements[4] === 'Скорпион' ||
			elements[4] === 'Стрелец' || elements[4] === 'Козирог' ||
			elements[4] === 'Водолей' || elements[4] === 'Риби') {
			editedEntry += elements[4];
			editedEntry += '\t'
		} else {
			editedEntry += '0';
			editedEntry += '\t';
			if (elements[4] !== undefined) {
				editedEntry+= elements[4];
			} else {
				editedEntry += '';
			}
		}

		if (elements[5] === undefined) {
			editedEntry += '';
		} else {
			editedEntry += elements[5];
		}
	}

	var splitedEntry = editedEntry.split('\t');

	splitedEntry[2] === '' ? editedEntry += '\tf' : editedEntry += '\tt';
	splitedEntry[4] === '0' ? editedEntry += 'f' : editedEntry += 't';
	splitedEntry[5] === '' ? editedEntry += 'f' : editedEntry += 't';

	localStorage.setItem(elements[0] + '', editedEntry);

	window.location = '../PhoneBook.html';
}
