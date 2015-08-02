var module = (function() {
    var validator = function() {
        var validator = {
            validatePhone: function(str) {
                var i,
                    len,
                    trimedStr = str.trim();

                if (trimedStr == null || trimedStr == '') {
                    alert("Phone number must be filled out");
                    return true;
                }

                if (trimedStr[0] !== '+' && trimedStr[0] !== '0') {
                    alert('Phone number must start with 0 or +');
                    return true;
                }

                if (trimedStr.length < 5 || trimedStr.length > 12) {
                    alert('Phone number\'s length must be between 5 and 12');
                    return true;
                }

                for (i = 1, len = trimedStr.length; i < len; i += 1) {
                    if (isNaN(str[i] * 1)) {
                        alert('Phone number must contain only digits');
                        return true;
                    }
                }
                return false;
            },
            validateName: function(str) {
                var trimedStr = str.trim();
                if (trimedStr == null || trimedStr == '') {
                    alert("Name must be filled out");
                    return true;
                }

                if (trimedStr.length > 30) {
                    alert('Name\'s length must be no longer than 30 letters');
                    return true;
                }
                return false;
            },
            validateCity: function(str) {
                if (str.length > 30) {
                    alert('City\'s length must be no longer than 30 letters');
                    return true;
                }
                return false;
            },
            validateGender: function(maleRadioButton, femaleRadioButton) {
                if (!maleRadioButton.checked && !femaleRadioButton.checked) {
                    alert('Please choose a gender');
                    return true;
                }
                return false;
            },
            validateNotes: function(str) {
                if (str.length > 500) {
                    alert('Notes\'s length must be no longer than 500 symbols');
                    return true;
                }
                return false;
            }
        };

        return validator;
    }();

    var buttonMaker = function() {
        var buttonMaker = {
            deleteButton: function(id) {
                var deleteBtn = document.createElement('button');
                deleteBtn.setAttribute('class', 'deleteBtn');
                deleteBtn.setAttribute('id', id + '');
                deleteBtn.innerHTML = 'Delete';
                return deleteBtn;
            },
            viewButton: function(id) {
                var viewBtn = document.createElement('button');
                viewBtn.setAttribute('class', 'viewBtn');
                viewBtn.setAttribute('id', id + '');
                viewBtn.innerHTML = 'View';
                return viewBtn;
            },
            editButton: function(id) {
                var editBtn = document.createElement('button');
                editBtn.setAttribute('class', 'editBtn');
                editBtn.setAttribute('id', id + '');
                editBtn.innerHTML = 'Edit';
                return editBtn;
            }
        };
        return buttonMaker;
    }();

    var userInputValidation = function() {
        var userInputValidation = {
            init: function() {
                this.phone = document.getElementById('phone');
                this.fullName = document.getElementById('name');
                this.city = document.getElementById('city');
                this.male = document.getElementById('male');
                this.female = document.getElementById('female');
                this.zodiacSign = document.getElementById('signs');
                this.notes = document.getElementById('notes');
                this.validator = validator;
                return this;
            },
            dataManagement: function() {
                if (validator.validatePhone(this.phone.value)) {
                    return false;
                }
                if (validator.validateName(this.fullName.value)) {
                    return false;
                }
                if (validator.validateCity(this.city.value)) {
                    return false;
                }
                if (validator.validateGender(this.male, this.female)) {
                    return false;
                }
                if (validator.validateNotes(this.notes.value)) {
                    return false;
                }
                for (var key in localStorage) {
                    var info = localStorage.getItem(key).split('\t');
                    if (key !== 'cf' && info[0] === this.phone.value.trim()) {
                        alert('Duplicate numbers are not allowed')
                        return false;
                    }
                    if (key !== 'cf' && info[1] === this.fullName.value.trim()) {
                        alert('Duplicate names are not allowed')
                        return false;
                    }
                }
                this.dataEntry();
                return true;
            },
            dataEntry: function() {
                var entry,
                    fieldsWithContent = '';

                this.city.value === '' ? fieldsWithContent += 'f' : fieldsWithContent += 't';
                this.zodiacSign.value === '0' ? fieldsWithContent += 'f' : fieldsWithContent += 't';
                this.notes.value === '' ? fieldsWithContent += 'f' : fieldsWithContent += 't';

                entry = '' + this.phone.value.trim() + '\t' + this.fullName.value.trim() +
                    '\t' + this.city.value + '\t' + (this.male.checked ? 'м' : 'ж') +
                    '\t' + this.zodiacSign.value + '\t' + this.notes.value + '\t' + fieldsWithContent;

                localStorage.setItem(this.fullName.value + '', entry);
            }
        };

        return userInputValidation;
    }();

    var tableManager = function() {
        var tableManager = {
            init: function() {
                this.table = document.getElementById('phonebook');
                localStorage.setItem('cf', '');
                localStorage.setItem('nf', '');
                localStorage.setItem('i', '');
                return this;
            },
            createEntry: function() {
                var entry,
                    result = '';

                for (var key in localStorage) {
                    if (key !== 'cf' && key !== 'nf' && key !== 'i') {
                        entry = this.innerHtmlGenerator(localStorage.getItem(key + ''), key);
                        result += entry;
                    }
                }
                this.table.innerHTML += result;
            },
            innerHtmlGenerator: function(infoStr, id) {
                var element,
                    result = '';
                deleteBtn = buttonMaker.deleteButton(id),
                    viewBtn = buttonMaker.viewButton(id),
                    editBtn = buttonMaker.editButton(id),
                    data = infoStr.split('\t');

                result += '<tr>';
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
            },
            buttonEventAttachment: function() {
                var buttons = document.getElementsByClassName("deleteBtn");
                var buttonsCount = buttons.length;
                for (var i = 0; i < buttonsCount; i += 1) {
                    buttons[i].onclick = function() {
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
                    buttons[i].onclick = function() {
                        var content = localStorage.getItem(this.id + '');
                        localStorage.cf = content;
                        localStorage.nf = 'true';
                        localStorage.i = this.id + '';
                        window.location = 'links/ViewContact.html';
                    }
                }

                buttons = document.getElementsByClassName("editBtn");
                buttonsCount = buttons.length;
                for (i = 0; i < buttonsCount; i += 1) {
                    buttons[i].onclick = function() {
                        var content = localStorage.getItem(this.id + '');
                        localStorage.cf = content;
                        localStorage.nf = 'true';
                        localStorage.i = this.id + '';
                        localStorage.removeItem(this.id + '');
                        window.location = 'links/AddContact.html';
                    }
                }
            }
        };
        return tableManager;
    }();

    var editPageManager = function() {
        var editPageManager = {
            init: function() {
                this.phone = document.getElementById('phone');
                this.fullName = document.getElementById('name');
                this.city = document.getElementById('city');
                this.male = document.getElementById('male');
                this.female = document.getElementById('female');
                this.zodiacSign = document.getElementById('signs');
                this.notes = document.getElementById('notes');
                this.dataContent = [];
                return this;
            },
            fillPage: function(dataContent) {
                var fill,
                    index = 0;
                this.dataContent = dataContent.split('\t');

                fill = this.dataContent[this.dataContent.length - 1].split('');

                this.phone.value = this.dataContent[index];
                index += 1;
                this.fullName.value = this.dataContent[index];
                index += 1;
                if (fill[0] === 't') {
                    this.city.value = this.dataContent[index];

                }
                index += 1;
                this.dataContent[index] === 'м' ? this.male.checked = true : this.female.checked = true;
                index += 1;
                if (fill[1] === 't') {
                    this.zodiacSign.value = this.dataContent[index];

                }
                index += 1;
                if (fill[2] === 't') {
                    this.notes.value = this.dataContent[index];
                }
            }
        };

        return editPageManager;
    }();

    var viewPageManager = function() {
        var viewPageManager = {
            init: function() {
                this.phone = document.getElementById('vphone');
                this.fullName = document.getElementById('vname');
                this.city = document.getElementById('vcity');
                this.gender = document.getElementById('vgender');
                this.sign = document.getElementById('vsign');
                this.notes = document.getElementById('vnotes');
                this.dataContent = [];
                return this;
            },
            fillPage: function(dataContent) {
                var fill,
                    index = 0;
                this.dataContent = dataContent.split('\t');

                fill = this.dataContent[this.dataContent.length - 1].split('');

                this.phone.innerHTML = this.dataContent[index];
                index += 1;
                this.fullName.innerHTML = this.dataContent[index];
                index += 1;
                if (fill[0] === 't') {
                    this.city.innerHTML = this.dataContent[index];
                }
                index += 1;
                this.gender.innerHTML = this.dataContent[index];
                index += 1;
                if (fill[1] === 't') {
                    this.sign.innerHTML = this.dataContent[index];
                }

                index += 1;
                if (fill[2] === 't') {
                    this.notes.innerHTML = this.dataContent[index];
                }
            }

        };

        return viewPageManager;
    }();

    var mainManager = function() {
        var mainManager = {
            phoneBookPage: function() {
                tableManager.init().createEntry();
                tableManager.buttonEventAttachment();

            },
            editPage: function() {
                if (localStorage.nf === 'true') {
                    editPageManager.init().fillPage(localStorage.cf);
                    document.getElementById('addContact').innerHTML = 'Edit Contact';
                    document.getElementById('backBtn').outerHTML = '';
                }
            },
            viewPage: function() {
                var id = localStorage.i,
                    deleteButton = buttonMaker.deleteButton(id),
                    editButton = buttonMaker.editButton(id);

                if (localStorage.nf === 'true') {
                    viewPageManager.init().fillPage(localStorage.cf);
                    document.getElementById('viewSheetBtns').innerHTML += editButton.outerHTML;
                    document.getElementById('viewSheetBtns').innerHTML += deleteButton.outerHTML;
                }

                var buttons = document.getElementsByClassName("deleteBtn");
                var buttonsCount = buttons.length;
                for (var i = 0; i < buttonsCount; i += 1) {
                    buttons[i].onclick = function() {
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
                    buttons[i].onclick = function() {
                        var content = localStorage.getItem(this.id + '');
                        localStorage.cf = content;
                        localStorage.nf = 'true';
                        localStorage.i = this.id + '';
                        localStorage.removeItem(this.id + '');
                        window.location = 'AddContact.html';
                        editPageManager.init().fillPage(content);
                    }
                }
            },
            importPage: function(){
                importPageManager.init().importData();
            }

        };

        return mainManager;
    }();

    var importPageManager = function() {
        var importPageManager = {
            init: function() {
                this.textArea = document.getElementById('importContacts');
                localStorage.setItem('cf', '');
                localStorage.setItem('nf', '');
                localStorage.setItem('i', '');
                return this;
            },
            importData: function() {
                var data = this.textArea.value.split('\n');

                for (var i = 0; i < data.length; i++) {
                    if (data[i] === '') {
                        alert('Empty entries are not allowed');
                        return false;
                    }
                }
                for (var j in data) {
                    this.createEntry(data[j]);
                }
            },
            createEntry: function(entry) {
                var text = entry,
                    elements = text.split('\t'),
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
                    editedEntry += elements[2] + '\t';

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
                        if (validator.validateNotes(elements[4])) {
                            return false;
                        }
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
                            editedEntry += elements[4];
                        } else {
                            editedEntry += '';
                        }
                    }

                    if (elements[5] === undefined) {
                        editedEntry += '';
                    } else {
                        if (validator.validateNotes(elements[5])) {
                            return false;
                        }
                        editedEntry += elements[5];
                    }
                }

                var splitedEntry = editedEntry.split('\t');

                splitedEntry[2] === '' ? editedEntry += '\tf' : editedEntry += '\tt';
                splitedEntry[4] === '0' ? editedEntry += 'f' : editedEntry += 't';
                splitedEntry[5] === '' ? editedEntry += 'f' : editedEntry += 't';

                localStorage.setItem(elements[1] + '', editedEntry);

                window.location = '../PhoneBook.html';
            }
        };

        return importPageManager;
    }();

    return {
        manageValidation: function() {
            return userInputValidation.init().dataManagement();
        },
        managePhoneBook: function() {
            return mainManager.phoneBookPage();
        },
        manageEditPage: function(){
            return mainManager.editPage();
        },
        manageViewPage: function(){
            return mainManager.viewPage();
        },
        manageImportPage: function(){
            return mainManager.importPage();
        }
    };
}());
